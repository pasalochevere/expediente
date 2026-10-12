-- COFRE 047 · Media FK indexes
-- Removes the two performance-linter regressions introduced by the R04 media relationships.

create index if not exists media_albums_created_by_idx on cofre.media_albums(created_by);
create index if not exists media_assets_album_cofre_fk_idx on cofre.media_assets(album_id,cofre_id);
