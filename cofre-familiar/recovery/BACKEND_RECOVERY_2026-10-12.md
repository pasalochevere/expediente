# COFRE-R01 · Backend Recovery Snapshot

Fecha: 2026-10-12
Proyecto Supabase: `pasalochevere-gamefactory`
Ref: `awuzunqfsbqyjsxlkdsb`

## Hallazgo

El backend de Cofre Familiar RC1 sigue activo. El ZIP/frontend se perdió, pero el contrato de datos y seguridad no.

### Schema `cofre`

61 tablas recuperadas:

`audit_events`, `capsule_items`, `capsule_recipients`, `capsules`, `cinema_scenes`, `cinema_sequences`, `cofre_members`, `cofres`, `collaboration_requests`, `collaboration_rooms`, `collaboration_submissions`, `contribution_links`, `contribution_media`, `contributions`, `creation_asset_refs`, `creation_elements`, `creation_projects`, `creation_revisions`, `creation_surfaces`, `creation_templates`, `dreams`, `experience_options`, `experience_projects`, `exports`, `gift_experiences`, `gift_ideas`, `gift_projects`, `gift_tokens`, `gift_votes`, `important_date_people`, `important_dates`, `invitations`, `letter_contents`, `letter_media`, `letters`, `media_assets`, `memories`, `memory_media`, `memory_people`, `notification_dispatches`, `notification_preferences`, `notifications`, `occasion_campaigns`, `occasion_instances`, `occasion_people`, `occasion_templates`, `people`, `person_preferences`, `person_quotes`, `person_relationships`, `person_wishes`, `plans`, `profiles`, `project_access_links`, `project_feedback`, `project_links`, `project_participants`, `project_tasks`, `projects`, `storage_usage`, `subscriptions`.

### Schema `cofre_private`

6 tablas de orquestación: `orchestration_actions`, `orchestration_dependencies`, `orchestration_events`, `orchestration_locks`, `orchestration_overrides`, `orchestration_rules`.

## RPC importantes existentes

- `create_cofre_secure`
- `create_cofre_invitation` / `accept_cofre_invitation` / `get_cofre_invitation_context`
- `reserve_media_upload` / `finalize_media_upload` / `cancel_media_upload`
- `seal_letter` / `open_letter`
- `seal_capsule` / `open_capsule`
- `create_gift_project_secure`
- `create_experience_project_secure`
- `create_creation_project_secure`
- `create_collaboration_room_secure`
- `create_project_access_link` / `revoke_project_access_link`
- `consume_reveal_link_service`
- `search_cofre_secure`
- `trash_cofre_item_secure` / `restore_cofre_item_secure`
- `update_cofre_settings_secure` / `update_profile_settings_secure`

## Seguridad recuperada

- RLS por membresía, creador y admin.
- `cofre-media` privado; lectura limitada a miembros.
- Links/tokens almacenados como hash.
- `gift_tokens`, `project_access_links` y `notification_dispatches` sin acceso cliente directo.
- Privacy de cartas/cápsulas y proyectos sorpresa implementada a nivel DB.
- Rutas de gift/invite/contribution deben permanecer `noindex/nofollow`.

## Edge Functions RC activas

- `cofre-media-upload-url` v1 · JWT
- `cofre-media-finalize` v1 · JWT
- `cofre-gift-reveal` v2 · token público validado por hash
- `cofre-integration-smoke` v3 · deshabilitada intencionalmente (410)

## Migraciones RC preservadas en historial

`cofre_001_core_auth` → `cofre_042_settings_privacy_trash_export_v1`, con fixes intermedios para RLS, media, invitaciones, cartas futuras, proyectos, cinema reveal, ocasiones, recordatorios, búsqueda, miembros y exportación.

Las migraciones posteriores `cofre_shared_*` (2026-10-06) pertenecen al Cofre compartido Gas+Dai y no se mezclan con esta reconstrucción.
