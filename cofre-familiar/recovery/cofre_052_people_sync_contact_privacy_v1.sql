drop policy if exists person_contact_methods_select_members on cofre.person_contact_methods;
create policy person_contact_methods_private_select on cofre.person_contact_methods
for select to authenticated
using ((created_by=auth.uid() or cofre_private.is_cofre_admin(cofre_id)) and exists(select 1 from cofre.people p where p.id=person_id and p.cofre_id=cofre_id and p.deleted_at is null));

drop policy if exists person_external_profiles_select_members on cofre.person_external_profiles;
create policy person_external_profiles_private_select on cofre.person_external_profiles
for select to authenticated
using ((created_by=auth.uid() or cofre_private.is_cofre_admin(cofre_id)) and exists(select 1 from cofre.people p where p.id=person_id and p.cofre_id=cofre_id and p.deleted_at is null));
