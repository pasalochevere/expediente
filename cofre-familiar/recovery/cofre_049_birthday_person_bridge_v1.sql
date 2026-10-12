create unique index if not exists important_dates_person_birthday_active_uidx
on cofre.important_dates(cofre_id,person_id)
where person_id is not null and event_type='birthday'::cofre.event_type and deleted_at is null;

create or replace function cofre_private.ensure_person_birthday_internal(p_person_id uuid,p_actor uuid default null)
returns uuid
language plpgsql
security definer
set search_path='pg_catalog','cofre','cofre_private'
as $$
declare
  v_person cofre.people%rowtype;
  v_date_id uuid;
  v_name text;
  v_actor uuid;
begin
  select * into v_person from cofre.people where id=p_person_id and deleted_at is null;
  if not found or v_person.birth_date is null then return null; end if;
  v_actor:=coalesce(p_actor,v_person.created_by);
  v_name:=coalesce(nullif(btrim(v_person.display_name),''),nullif(btrim(concat_ws(' ',v_person.first_name,v_person.last_name)),''),'Alguien especial');

  select id into v_date_id
  from cofre.important_dates
  where cofre_id=v_person.cofre_id and person_id=v_person.id and event_type='birthday'::cofre.event_type and deleted_at is null
  limit 1;

  if v_date_id is null then
    insert into cofre.important_dates(cofre_id,person_id,created_by,title,event_type,event_date,repeat_rule,reminder_days,visibility)
    values(v_person.cofre_id,v_person.id,v_actor,'Cumpleaños de '||v_name,'birthday',v_person.birth_date,'yearly',array[30,14,7,3,1,0],'members')
    returning id into v_date_id;
  else
    update cofre.important_dates
       set event_date=v_person.birth_date,
           repeat_rule='yearly',
           reminder_days=(select array_agg(distinct x order by x desc) from unnest(coalesce(reminder_days,'{}'::integer[])||array[30,14,7,3,1,0]) x),
           updated_at=now()
     where id=v_date_id;
  end if;

  insert into cofre.important_date_people(important_date_id,cofre_id,person_id,role)
  values(v_date_id,v_person.cofre_id,v_person.id,'primary')
  on conflict(important_date_id,person_id) do update set role='primary';

  return v_date_id;
exception when unique_violation then
  select id into v_date_id from cofre.important_dates
  where cofre_id=v_person.cofre_id and person_id=v_person.id and event_type='birthday'::cofre.event_type and deleted_at is null limit 1;
  return v_date_id;
end;
$$;

create or replace function cofre.ensure_person_birthday_secure(p_person_id uuid)
returns uuid
language plpgsql
security definer
set search_path='pg_catalog','cofre','cofre_private'
as $$
declare
  v_user uuid:=auth.uid();
  v_cofre uuid;
begin
  if v_user is null then raise exception 'authentication_required' using errcode='42501'; end if;
  select cofre_id into v_cofre from cofre.people where id=p_person_id and deleted_at is null;
  if v_cofre is null or not cofre_private.is_cofre_member(v_cofre) then raise exception 'person_not_found' using errcode='P0002'; end if;
  return cofre_private.ensure_person_birthday_internal(p_person_id,v_user);
end;
$$;

revoke all on function cofre.ensure_person_birthday_secure(uuid) from public;
grant execute on function cofre.ensure_person_birthday_secure(uuid) to authenticated;

create or replace function cofre_private.people_birthday_bridge_trg()
returns trigger
language plpgsql
security definer
set search_path='pg_catalog','cofre','cofre_private'
as $$
begin
  if new.deleted_at is null and new.birth_date is not null then
    perform cofre_private.ensure_person_birthday_internal(new.id,coalesce(new.created_by,auth.uid()));
  end if;
  return new;
end;
$$;

drop trigger if exists people_birthday_bridge on cofre.people;
create trigger people_birthday_bridge
after insert or update of birth_date,display_name,first_name,last_name,deleted_at on cofre.people
for each row execute function cofre_private.people_birthday_bridge_trg();

do $$
declare r record;
begin
  for r in select id,created_by from cofre.people where deleted_at is null and birth_date is not null loop
    perform cofre_private.ensure_person_birthday_internal(r.id,r.created_by);
  end loop;
end;
$$;