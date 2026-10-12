-- COFRE 046 · Media albums Data API grant
-- Read access is available only to authenticated users and still filtered by RLS.
-- All writes remain behind SECURITY DEFINER RPCs.

grant select on table cofre.media_albums to authenticated;
revoke insert,update,delete,truncate,references,trigger on table cofre.media_albums from authenticated,anon;
