create table if not exists cofre.contact_import_batches (
  id uuid primary key default gen_random_uuid(),
  cofre_id uuid not null references cofre.cofres(id) on delete cascade,
  provider text not null check (provider in ('google','outlook','vcard','csv','phone')),
  status text not null default 'pending' check (status in ('pending','committed','expired','cancelled')),
  total_count integer not null default 0,
  created_by uuid not null,
  expires_at timestamptz not null default (now()+interval '30 minutes'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists contact_import_batches_owner_idx on cofre.contact_import_batches(created_by,expires_at);

create table if not exists cofre.contact_import_candidates (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references cofre.contact_import_batches(id) on delete cascade,
  cofre_id uuid not null references cofre.cofres(id) on delete cascade,
  provider text not null,
  position integer not null,
  payload jsonb not null,
  created_by uuid not null,
  created_at timestamptz not null default now(),
  unique(batch_id,position)
);
create index if not exists contact_import_candidates_batch_idx on cofre.contact_import_candidates(batch_id,position);

alter table cofre.contact_import_batches enable row level security;
alter table cofre.contact_import_candidates enable row level security;

drop policy if exists contact_import_batches_owner_select on cofre.contact_import_batches;
create policy contact_import_batches_owner_select on cofre.contact_import_batches for select to authenticated using (created_by=auth.uid() and cofre_private.is_cofre_member(cofre_id) and expires_at>now());

drop policy if exists contact_import_candidates_owner_select on cofre.contact_import_candidates;
create policy contact_import_candidates_owner_select on cofre.contact_import_candidates for select to authenticated using (created_by=auth.uid() and cofre_private.is_cofre_member(cofre_id) and exists(select 1 from cofre.contact_import_batches b where b.id=batch_id and b.created_by=auth.uid() and b.expires_at>now()));

revoke all on cofre.contact_import_batches from anon,authenticated;
revoke all on cofre.contact_import_candidates from anon,authenticated;
grant select on cofre.contact_import_batches to authenticated;
grant select on cofre.contact_import_candidates to authenticated;

create or replace function cofre.stage_contact_import_secure(p_cofre_id uuid,p_provider text,p_contacts jsonb)
returns uuid language plpgsql security definer set search_path='pg_catalog','cofre','cofre_private' as $$
declare v_user uuid:=auth.uid(); v_provider text:=lower(btrim(coalesce(p_provider,''))); v_batch uuid; v_item jsonb; v_pos integer:=0;
begin
  if v_user is null then raise exception 'authentication_required' using errcode='42501'; end if;
  if not cofre_private.is_cofre_member(p_cofre_id) then raise exception 'cofre_not_found' using errcode='42501'; end if;
  if v_provider not in ('google','outlook','vcard','csv','phone') then raise exception 'unsupported_provider'; end if;
  if p_contacts is null or jsonb_typeof(p_contacts)<>'array' then raise exception 'contacts_must_be_array'; end if;
  if jsonb_array_length(p_contacts)>500 then raise exception 'too_many_contacts'; end if;
  update cofre.contact_import_batches set status='expired',updated_at=now() where created_by=v_user and status='pending' and expires_at<=now();
  insert into cofre.contact_import_batches(cofre_id,provider,total_count,created_by) values(p_cofre_id,v_provider,jsonb_array_length(p_contacts),v_user) returning id into v_batch;
  for v_item in select value from jsonb_array_elements(p_contacts) loop v_pos:=v_pos+1; insert into cofre.contact_import_candidates(batch_id,cofre_id,provider,position,payload,created_by) values(v_batch,p_cofre_id,v_provider,v_pos,v_item,v_user); end loop;
  return v_batch;
end;$$;
revoke all on function cofre.stage_contact_import_secure(uuid,text,jsonb) from public;
grant execute on function cofre.stage_contact_import_secure(uuid,text,jsonb) to authenticated;

create or replace function cofre.commit_contact_import_batch_secure(p_batch_id uuid,p_candidate_ids uuid[])
returns jsonb language plpgsql security definer set search_path='pg_catalog','cofre','cofre_private' as $$
declare v_user uuid:=auth.uid(); v_batch cofre.contact_import_batches%rowtype; v_payload jsonb; v_result jsonb;
begin
  if v_user is null then raise exception 'authentication_required' using errcode='42501'; end if;
  select * into v_batch from cofre.contact_import_batches where id=p_batch_id and created_by=v_user and status='pending' and expires_at>now();
  if not found or not cofre_private.is_cofre_member(v_batch.cofre_id) then raise exception 'batch_not_found' using errcode='P0002'; end if;
  if p_candidate_ids is null or coalesce(array_length(p_candidate_ids,1),0)=0 then raise exception 'no_contacts_selected'; end if;
  if array_length(p_candidate_ids,1)>500 then raise exception 'too_many_contacts'; end if;
  select coalesce(jsonb_agg(c.payload order by c.position),'[]'::jsonb) into v_payload from cofre.contact_import_candidates c where c.batch_id=v_batch.id and c.created_by=v_user and c.id=any(p_candidate_ids);
  if jsonb_array_length(v_payload)=0 then raise exception 'no_contacts_selected'; end if;
  v_result:=cofre.import_people_secure(v_batch.cofre_id,v_batch.provider,v_payload);
  update cofre.contact_import_batches set status='committed',updated_at=now() where id=v_batch.id;
  delete from cofre.contact_import_candidates where batch_id=v_batch.id;
  return v_result||jsonb_build_object('batchId',v_batch.id);
end;$$;
revoke all on function cofre.commit_contact_import_batch_secure(uuid,uuid[]) from public;
grant execute on function cofre.commit_contact_import_batch_secure(uuid,uuid[]) to authenticated;
