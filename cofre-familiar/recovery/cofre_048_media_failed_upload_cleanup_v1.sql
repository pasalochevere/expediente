-- COFRE-R04.5 · secure cleanup for client-side failed uploads

create or replace function cofre.cancel_my_media_upload_secure(
  p_cofre_id uuid,
  p_media_id uuid,
  p_reason text default 'client_upload_failed'
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_status cofre.media_status;
begin
  if v_uid is null then
    raise exception 'authentication_required';
  end if;

  select status
    into v_status
  from cofre.media_assets
  where id = p_media_id
    and cofre_id = p_cofre_id
    and uploaded_by = v_uid
    and deleted_at is null
  for update;

  if not found then
    return false;
  end if;

  if v_status = 'uploading'::cofre.media_status then
    perform cofre.cancel_media_upload(
      p_media_id,
      left(coalesce(nullif(btrim(p_reason), ''), 'client_upload_failed'), 500)
    );
    return true;
  end if;

  if v_status = 'failed'::cofre.media_status then
    return true;
  end if;

  return false;
end;
$$;

revoke all on function cofre.cancel_my_media_upload_secure(uuid, uuid, text) from public;
grant execute on function cofre.cancel_my_media_upload_secure(uuid, uuid, text) to authenticated;
