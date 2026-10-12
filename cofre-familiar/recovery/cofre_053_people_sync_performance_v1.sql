create index if not exists contact_import_batches_cofre_idx on cofre.contact_import_batches(cofre_id);
create index if not exists contact_import_candidates_cofre_idx on cofre.contact_import_candidates(cofre_id);

drop policy if exists contact_import_batches_owner_select on cofre.contact_import_batches;
create policy contact_import_batches_owner_select on cofre.contact_import_batches for select to authenticated
using (created_by=(select auth.uid()) and cofre_private.is_cofre_member(cofre_id) and expires_at>now());

drop policy if exists contact_import_candidates_owner_select on cofre.contact_import_candidates;
create policy contact_import_candidates_owner_select on cofre.contact_import_candidates for select to authenticated
using (created_by=(select auth.uid()) and cofre_private.is_cofre_member(cofre_id) and exists(select 1 from cofre.contact_import_batches b where b.id=batch_id and b.created_by=(select auth.uid()) and b.expires_at>now()));

drop policy if exists person_contact_methods_private_select on cofre.person_contact_methods;
create policy person_contact_methods_private_select on cofre.person_contact_methods for select to authenticated
using ((created_by=(select auth.uid()) or cofre_private.is_cofre_admin(cofre_id)) and exists(select 1 from cofre.people p where p.id=person_id and p.cofre_id=cofre_id and p.deleted_at is null));

drop policy if exists person_external_profiles_private_select on cofre.person_external_profiles;
create policy person_external_profiles_private_select on cofre.person_external_profiles for select to authenticated
using ((created_by=(select auth.uid()) or cofre_private.is_cofre_admin(cofre_id)) and exists(select 1 from cofre.people p where p.id=person_id and p.cofre_id=cofre_id and p.deleted_at is null));
