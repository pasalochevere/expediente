# COFRE-R04 — VISUAL + MEDIA POLISH

Fecha: 2026-10-12
Estado técnico: PASS / DEPLOYED

## Source / deploy
- Branch: `release/cofre-familiar-rc1`
- Source deployed: `c76915ad16be3be604c9b294fbf1f0853a105eae`
- Railway service: `cofre-web-rc1`
- Deployment: `620ffaca-a91e-4af5-8d7f-668877652aff`
- Deployment status: SUCCESS
- Runtime: Next.js 16.4.0 / Node 22
- Healthcheck `/health`: 1/1 PASS

## Gates
- Recovery general: 75 PASS / 0 FAIL
- R03 functional: 33 PASS / 0 FAIL
- R04 visual/media: 21 PASS / 0 FAIL
- TypeScript: PASS
- Next production build: PASS
- Static generation: 8/8 PASS
- Container start: PASS
- Healthcheck: PASS

## R04.1 — Media UX
- Media library rebuilt as a visual archive instead of a technical file list.
- Photos/videos use `object-fit: contain`; images are no longer intentionally cropped in the gallery.
- Private signed preview flow preserved (20-minute signed URL).
- Original technical filename moved under `Detalles del archivo`.
- Primary visible title uses `display_name`, with a human fallback such as `Foto · 12 oct 2026`.
- Upload area rebuilt as drag/drop + multi-file selector.
- Sequential multi-file progress and 25 MB per-file guard.
- Existing private upload/finalize Edge Functions preserved.

## R04.2 — Albums / rename / date
Live DB additions:
- `cofre.media_assets.display_name`
- `cofre.media_assets.media_date`
- `cofre.media_assets.album_id`
- New `cofre.media_albums`

Secure RPCs:
- `cofre.create_media_album_secure`
- `cofre.update_media_asset_metadata_secure`
- `cofre.update_media_album_secure`

Behavior:
- Create/name album.
- Optional album event date and note.
- Rename photo/file without touching original filename/storage path.
- Assign actual photo/date.
- Move media into or out of an album.
- Filter by album / all / ungrouped.
- Edit permissions: uploader/album creator or Cofre admin/owner as applicable.

Security model:
- `media_albums` SELECT only to authenticated + membership RLS.
- Direct INSERT/UPDATE/DELETE remain revoked from client roles.
- Writes happen only through SECURITY DEFINER RPCs with membership/ownership checks.
- No service role in frontend.

## DB migrations
Stored and applied:
- `cofre_043_media_library_polish_v1`
- `cofre_044_media_audit_contract_fix`
- `cofre_045_media_metadata_live_contract_fix`
- `cofre_046_media_albums_data_api_grant`
- `cofre_047_media_fk_indexes`

Migration source snapshots are under `cofre-familiar/recovery/`.

## QA real against live backend
Executed in transactions with ROLLBACK so no QA data remained.

Positive flow PASS:
- authenticated Cofre owner creates album
- renames existing media
- assigns media date
- moves media to album
- reads updated values
- rollback

RLS PASS:
- Cofre member can read the temporary album
- nonmember reads 0 rows
- rollback

No temporary album or media metadata remained after QA.

## Supabase advisors after R04
- Security: no new R04 regression detected.
- Performance: R04 initially introduced 2 new unindexed-FK findings; `cofre_047_media_fk_indexes` removed both.
- Unindexed FK advisor returned to the historical RC baseline of 127 findings; R04 added 0 new FK warning debt.
- New R04 indexes may appear as unused until real traffic uses them; expected immediately after creation.
- Existing unrelated warnings in `public` schema and Auth remain outside R04 scope.

## R04.3 — visual polish
New `app/r04.css` loaded after the recovered global stylesheet.
- cleaner cards/forms/spacing
- media gallery 3 columns desktop / 2 tablet / 1 mobile
- horizontal album chips
- mobile 44px touch targets
- responsive media editor
- stronger focus states
- lighter visual hierarchy for technical details

## Known release pending
`package-lock.json` is still not committed. Exact dependency versions are pinned and Railway installs/builds successfully, but deterministic lockfile versioning remains required before the final main/release merge.

## Browser visual acceptance pending
Technical R04 is deployed. Final visual acceptance still requires browser inspection of authenticated Media, especially:
1. portrait and landscape photos show complete image without crop;
2. rename persists;
3. date persists;
4. create album + move photo works;
5. filter chips work;
6. multi-upload works;
7. mobile Media is comfortable and readable.

Do not merge to `main` or publish the GitHub Pages launcher until browser acceptance is complete.
