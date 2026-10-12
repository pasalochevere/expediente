-- COFRE 045 · Media metadata live contract fix
-- The live recovered media_assets table has no updated_at column.

create or replace function cofre.update_media_asset_metadata_secure(
  p_cofre_id uuid,
  p_media_id uuid,
  p_display_name text default null,
  p_media_date date default null,
  p_album_id uuid default null
) returns void
language plpgsql
security definer
set search_path=''
as $$
declare
  v_user uuid := (select auth.uid());
  v_uploaded_by uuid;
  v_name text := nullif(btrim(coalesce(p_display_name,'')),'');
begin
  if v_user is null or not cofre_private.is_cofre_member(p_cofre_id) then raise exception 'not_authorized'; end if;
  select uploaded_by into v_uploaded_by from cofre.media_assets where id=p_media_id and cofre_id=p_cofre_id and deleted_at is null;
  if v_uploaded_by is null then raise exception 'media_not_found'; end if;
  if v_uploaded_by<>v_user and not cofre_private.is_cofre_admin(p_cofre_id) and not cofre_private.is_cofre_owner(p_cofre_id) then raise exception 'not_authorized'; end if;
  if v_name is not null and length(v_name)>120 then raise exception 'display_name_too_long'; end if;
  if p_album_id is not null and not exists(select 1 from cofre.media_albums where id=p_album_id and cofre_id=p_cofre_id and deleted_at is null) then raise exception 'album_not_found'; end if;

  update cofre.media_assets
  set display_name=v_name,media_date=p_media_date,album_id=p_album_id
  where id=p_media_id and cofre_id=p_cofre_id and deleted_at is null;

  insert into cofre.audit_events(cofre_id,user_id,event_type,entity_type,entity_id,metadata)
  values(p_cofre_id,v_user,'media_metadata_updated','media_asset',p_media_id,jsonb_build_object('display_name',v_name,'media_date',p_media_date,'album_id',p_album_id));
end;
$$;

revoke all on function cofre.update_media_asset_metadata_secure(uuid,uuid,text,date,uuid) from public,anon;
grant execute on function cofre.update_media_asset_metadata_secure(uuid,uuid,text,date,uuid) to authenticated;
