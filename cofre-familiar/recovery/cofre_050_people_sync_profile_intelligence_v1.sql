create table if not exists cofre.person_contact_methods (
  id uuid primary key default gen_random_uuid(),
  cofre_id uuid not null references cofre.cofres(id) on delete cascade,
  person_id uuid not null references cofre.people(id) on delete cascade,
  kind text not null check (kind in ('email','phone')),
  label text,
  value text not null,
  normalized_value text not null,
  is_primary boolean not null default false,
  source_type text not null default 'manual',
  created_by uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(cofre_id,person_id,kind,normalized_value)
);
create index if not exists person_contact_methods_lookup_idx on cofre.person_contact_methods(cofre_id,kind,normalized_value);
create index if not exists person_contact_methods_person_idx on cofre.person_contact_methods(person_id);
alter table cofre.person_contact_methods enable row level security;
drop policy if exists person_contact_methods_select_members on cofre.person_contact_methods;
create policy person_contact_methods_select_members on cofre.person_contact_methods for select to authenticated using (cofre_private.is_cofre_member(cofre_id) and exists(select 1 from cofre.people p where p.id=person_id and p.cofre_id=cofre_id and p.deleted_at is null));
revoke all on cofre.person_contact_methods from anon, authenticated;
grant select on cofre.person_contact_methods to authenticated;

create table if not exists cofre.person_external_profiles (
  id uuid primary key default gen_random_uuid(),
  cofre_id uuid not null references cofre.cofres(id) on delete cascade,
  person_id uuid not null references cofre.people(id) on delete cascade,
  provider text not null check (provider in ('google','outlook','vcard','csv','phone','manual')),
  external_id text,
  profile_url text,
  source_label text,
  source_updated_at timestamptz,
  created_by uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists person_external_profiles_provider_uidx on cofre.person_external_profiles(cofre_id,provider,external_id) where external_id is not null;
create index if not exists person_external_profiles_person_idx on cofre.person_external_profiles(person_id);
alter table cofre.person_external_profiles enable row level security;
drop policy if exists person_external_profiles_select_members on cofre.person_external_profiles;
create policy person_external_profiles_select_members on cofre.person_external_profiles for select to authenticated using (cofre_private.is_cofre_member(cofre_id) and exists(select 1 from cofre.people p where p.id=person_id and p.cofre_id=cofre_id and p.deleted_at is null));
revoke all on cofre.person_external_profiles from anon, authenticated;
grant select on cofre.person_external_profiles to authenticated;

create or replace function cofre.import_people_secure(p_cofre_id uuid,p_provider text,p_contacts jsonb)
returns jsonb language plpgsql security definer set search_path='pg_catalog','cofre','cofre_private' as $$
declare
  v_user uuid:=auth.uid(); v_provider text:=lower(btrim(coalesce(p_provider,''))); v_item jsonb; v_person_id uuid;
  v_first text; v_last text; v_name text; v_display text; v_birth date; v_relation text; v_bio text;
  v_email text; v_email_norm text; v_phone text; v_phone_norm text; v_external_id text; v_profile_url text;
  v_created int:=0; v_merged int:=0; v_processed int:=0; v_results jsonb:='[]'::jsonb;
begin
  if v_user is null then raise exception 'authentication_required' using errcode='42501'; end if;
  if p_cofre_id is null or not cofre_private.is_cofre_member(p_cofre_id) then raise exception 'cofre_not_found' using errcode='42501'; end if;
  if v_provider not in ('google','outlook','vcard','csv','phone','manual') then raise exception 'unsupported_provider'; end if;
  if p_contacts is null or jsonb_typeof(p_contacts)<>'array' then raise exception 'contacts_must_be_array'; end if;
  if jsonb_array_length(p_contacts)>500 then raise exception 'too_many_contacts'; end if;
  for v_item in select value from jsonb_array_elements(p_contacts) loop
    v_processed:=v_processed+1;
    v_name:=left(btrim(coalesce(v_item->>'name','')),160); v_first:=left(btrim(coalesce(v_item->>'firstName','')),80); v_last:=left(btrim(coalesce(v_item->>'lastName','')),80); v_display:=left(btrim(coalesce(v_item->>'displayName','')),120);
    if v_first='' and v_name<>'' then v_first:=left(split_part(v_name,' ',1),80); v_last:=left(nullif(btrim(substr(v_name,length(split_part(v_name,' ',1))+1)),''),80); end if;
    if v_first='' then continue; end if; if v_display='' then v_display:=nullif(v_name,''); end if;
    v_relation:=left(nullif(btrim(coalesce(v_item->>'relationship','')),''),80); v_bio:=left(nullif(btrim(coalesce(v_item->>'bio','')),''),1000);
    v_email:=left(nullif(btrim(coalesce(v_item->>'email','')),''),254); v_email_norm:=case when v_email is null then null else lower(v_email) end;
    v_phone:=left(nullif(btrim(coalesce(v_item->>'phone','')),''),80); v_phone_norm:=case when v_phone is null then null else nullif(regexp_replace(v_phone,'[^0-9]','','g'),'') end;
    v_external_id:=left(nullif(btrim(coalesce(v_item->>'externalId','')),''),300); v_profile_url:=left(nullif(btrim(coalesce(v_item->>'profileUrl','')),''),1000);
    v_birth:=null; begin if coalesce(v_item->>'birthDate','') ~ '^\d{4}-\d{2}-\d{2}$' then v_birth:=(v_item->>'birthDate')::date; end if; exception when others then v_birth:=null; end;
    v_person_id:=null;
    if v_external_id is not null then select person_id into v_person_id from cofre.person_external_profiles where cofre_id=p_cofre_id and provider=v_provider and external_id=v_external_id limit 1; end if;
    if v_person_id is null and v_email_norm is not null then select person_id into v_person_id from cofre.person_contact_methods where cofre_id=p_cofre_id and kind='email' and normalized_value=v_email_norm limit 1; end if;
    if v_person_id is null and v_phone_norm is not null then select person_id into v_person_id from cofre.person_contact_methods where cofre_id=p_cofre_id and kind='phone' and normalized_value=v_phone_norm limit 1; end if;
    if v_person_id is null and v_birth is not null then select p.id into v_person_id from cofre.people p where p.cofre_id=p_cofre_id and p.deleted_at is null and p.birth_date=v_birth and lower(btrim(coalesce(nullif(p.display_name,''),concat_ws(' ',p.first_name,p.last_name))))=lower(btrim(coalesce(nullif(v_display,''),concat_ws(' ',v_first,v_last)))) limit 1; end if;
    if v_person_id is null then
      insert into cofre.people(cofre_id,created_by,first_name,last_name,display_name,birth_date,relationship_label,bio) values(p_cofre_id,v_user,v_first,nullif(v_last,''),nullif(v_display,''),v_birth,v_relation,v_bio) returning id into v_person_id;
      v_created:=v_created+1; v_results:=v_results||jsonb_build_array(jsonb_build_object('personId',v_person_id,'action','created','name',coalesce(nullif(v_display,''),concat_ws(' ',v_first,v_last))));
    else
      update cofre.people set last_name=coalesce(last_name,nullif(v_last,'')),display_name=coalesce(display_name,nullif(v_display,'')),birth_date=coalesce(birth_date,v_birth),relationship_label=coalesce(relationship_label,v_relation),bio=coalesce(bio,v_bio),updated_at=now() where id=v_person_id and cofre_id=p_cofre_id and deleted_at is null;
      v_merged:=v_merged+1; v_results:=v_results||jsonb_build_array(jsonb_build_object('personId',v_person_id,'action','merged','name',coalesce(nullif(v_display,''),concat_ws(' ',v_first,v_last))));
    end if;
    if v_email_norm is not null then insert into cofre.person_contact_methods(cofre_id,person_id,kind,label,value,normalized_value,is_primary,source_type,created_by) values(p_cofre_id,v_person_id,'email',nullif(v_item->>'emailLabel',''),v_email,v_email_norm,true,v_provider,v_user) on conflict(cofre_id,person_id,kind,normalized_value) do update set value=excluded.value,updated_at=now(); end if;
    if v_phone_norm is not null then insert into cofre.person_contact_methods(cofre_id,person_id,kind,label,value,normalized_value,is_primary,source_type,created_by) values(p_cofre_id,v_person_id,'phone',nullif(v_item->>'phoneLabel',''),v_phone,v_phone_norm,true,v_provider,v_user) on conflict(cofre_id,person_id,kind,normalized_value) do update set value=excluded.value,updated_at=now(); end if;
    if v_external_id is not null then insert into cofre.person_external_profiles(cofre_id,person_id,provider,external_id,profile_url,source_label,source_updated_at,created_by) values(p_cofre_id,v_person_id,v_provider,v_external_id,v_profile_url,left(nullif(v_item->>'sourceLabel',''),160),now(),v_user) on conflict(cofre_id,provider,external_id) where external_id is not null do update set person_id=excluded.person_id,profile_url=coalesce(excluded.profile_url,cofre.person_external_profiles.profile_url),source_updated_at=now(),updated_at=now(); end if;
  end loop;
  return jsonb_build_object('processed',v_processed,'created',v_created,'merged',v_merged,'results',v_results);
end;$$;
revoke all on function cofre.import_people_secure(uuid,text,jsonb) from public;
grant execute on function cofre.import_people_secure(uuid,text,jsonb) to authenticated;
