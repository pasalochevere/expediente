-- COFRE 043 · Media Library Polish v1
-- Applied to pasalochevere-gamefactory on 2026-10-12.

alter table cofre.media_assets
  add column if not exists display_name text,
  add column if not exists media_date date,
  add column if not exists album_id uuid;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'media_assets_display_name_nonblank'
      and conrelid = 'cofre.media_assets'::regclass
  ) then
    alter table cofre.media_assets
      add constraint media_assets_display_name_nonblank
      check (display_name is null or length(btrim(display_name)) between 1 and 120);
  end if;
end $$;

create table if not exists cofre.media_albums (
  id uuid not null default gen_random_uuid(),
  cofre_id uuid not null,
  name text not null,
  description text,
  event_date date,
  created_by uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint media_albums_pkey primary key (id, cofre_id),
  constraint media_albums_id_key unique (id),
  constraint media_albums_cofre_id_fkey foreign key (cofre_id) references cofre.cofres(id) on delete cascade,
  constraint media_albums_created_by_fkey foreign key (created_by) references auth.users(id),
  constraint media_albums_name_nonblank check (length(btrim(name)) between 1 and 120),
  constraint media_albums_description_length check (description is null or length(description) <= 1000)
);

create index if not exists media_albums_cofre_event_idx
  on cofre.media_albums (cofre_id, event_date desc nulls last, created_at desc)
  where deleted_at is null;

create index if not exists media_assets_album_idx
  on cofre.media_assets (cofre_id, album_id, media_date desc nulls last, created_at desc)
  where deleted_at is null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'media_assets_album_cofre_fkey'
      and conrelid = 'cofre.media_assets'::regclass
  ) then
    alter table cofre.media_assets
      add constraint media_assets_album_cofre_fkey
      foreign key (album_id, cofre_id)
      references cofre.media_albums(id, cofre_id)
      on delete set null;
  end if;
end $$;

alter table cofre.media_albums enable row level security;

drop policy if exists media_albums_select_v1 on cofre.media_albums;
create policy media_albums_select_v1
  on cofre.media_albums
  for select
  to authenticated
  using (deleted_at is null and cofre_private.is_cofre_member(cofre_id));

create or replace function cofre.create_media_album_secure(
  p_cofre_id uuid,
  p_name text,
  p_event_date date default null,
  p_description text default null
) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_id uuid;
  v_name text := btrim(coalesce(p_name, ''));
begin
  if v_user is null or not cofre_private.is_cofre_member(p_cofre_id) then raise exception 'not_authorized'; end if;
  if length(v_name) < 1 or length(v_name) > 120 then raise exception 'invalid_album_name'; end if;
  if p_description is not null and length(p_description) > 1000 then raise exception 'description_too_long'; end if;

  insert into cofre.media_albums(cofre_id,name,description,event_date,created_by)
  values(p_cofre_id,v_name,nullif(btrim(p_description),''),p_event_date,v_user)
  returning id into v_id;

  insert into cofre.audit_events(cofre_id,actor_user_id,event_type,entity_type,entity_id,payload)
  values(p_cofre_id,v_user,'media_album_created','media_album',v_id,jsonb_build_object('name',v_name));
  return v_id;
end;
$$;

create or replace function cofre.update_media_asset_metadata_secure(
  p_cofre_id uuid,
  p_media_id uuid,
  p_display_name text default null,
  p_media_date date default null,
  p_album_id uuid default null
) returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_uploaded_by uuid;
  v_name text := nullif(btrim(coalesce(p_display_name,'')),'');
begin
  if v_user is null or not cofre_private.is_cofre_member(p_cofre_id) then raise exception 'not_authorized'; end if;
  select uploaded_by into v_uploaded_by from cofre.media_assets where id=p_media_id and cofre_id=p_cofre_id and deleted_at is null;
  if v_uploaded_by is null then raise exception 'media_not_found'; end if;
  if v_uploaded_by <> v_user and not cofre_private.is_cofre_admin(p_cofre_id) and not cofre_private.is_cofre_owner(p_cofre_id) then raise exception 'not_authorized'; end if;
  if v_name is not null and length(v_name)>120 then raise exception 'display_name_too_long'; end if;
  if p_album_id is not null and not exists(select 1 from cofre.media_albums where id=p_album_id and cofre_id=p_cofre_id and deleted_at is null) then raise exception 'album_not_found'; end if;

  update cofre.media_assets set display_name=v_name,media_date=p_media_date,album_id=p_album_id,updated_at=now()
  where id=p_media_id and cofre_id=p_cofre_id and deleted_at is null;

  insert into cofre.audit_events(cofre_id,actor_user_id,event_type,entity_type,entity_id,payload)
  values(p_cofre_id,v_user,'media_metadata_updated','media_asset',p_media_id,jsonb_build_object('display_name',v_name,'media_date',p_media_date,'album_id',p_album_id));
end;
$$;

create or replace function cofre.update_media_album_secure(
  p_cofre_id uuid,
  p_album_id uuid,
  p_name text,
  p_event_date date default null,
  p_description text default null
) returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_created_by uuid;
  v_name text := btrim(coalesce(p_name,''));
begin
  if v_user is null or not cofre_private.is_cofre_member(p_cofre_id) then raise exception 'not_authorized'; end if;
  select created_by into v_created_by from cofre.media_albums where id=p_album_id and cofre_id=p_cofre_id and deleted_at is null;
  if v_created_by is null then raise exception 'album_not_found'; end if;
  if v_created_by <> v_user and not cofre_private.is_cofre_admin(p_cofre_id) and not cofre_private.is_cofre_owner(p_cofre_id) then raise exception 'not_authorized'; end if;
  if length(v_name)<1 or length(v_name)>120 then raise exception 'invalid_album_name'; end if;
  if p_description is not null and length(p_description)>1000 then raise exception 'description_too_long'; end if;

  update cofre.media_albums set name=v_name,description=nullif(btrim(p_description),''),event_date=p_event_date,updated_at=now()
  where id=p_album_id and cofre_id=p_cofre_id and deleted_at is null;

  insert into cofre.audit_events(cofre_id,actor_user_id,event_type,entity_type,entity_id,payload)
  values(p_cofre_id,v_user,'media_album_updated','media_album',p_album_id,jsonb_build_object('name',v_name));
end;
$$;

revoke all on function cofre.create_media_album_secure(uuid,text,date,text) from public, anon;
revoke all on function cofre.update_media_asset_metadata_secure(uuid,uuid,text,date,uuid) from public, anon;
revoke all on function cofre.update_media_album_secure(uuid,uuid,text,date,text) from public, anon;
grant execute on function cofre.create_media_album_secure(uuid,text,date,text) to authenticated;
grant execute on function cofre.update_media_asset_metadata_secure(uuid,uuid,text,date,uuid) to authenticated;
grant execute on function cofre.update_media_album_secure(uuid,uuid,text,date,text) to authenticated;
