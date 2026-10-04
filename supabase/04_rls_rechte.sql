-- ============================================================
-- 04 | RLS-Rechte: anon braucht SELECT, INSERT, UPDATE
-- Die App spricht mit dem Publishable-Key (Rolle "anon").
-- Neu in 0.0.26: Scores werden per PATCH aktualisiert, also
-- braucht anon jetzt auch UPDATE. DELETE ist nicht mehr noetig.
-- ============================================================

-- Schnellcheck: Ist RLS ueberhaupt an?
--   Im Dashboard: Table Editor -> Tabelle -> "RLS disabled/enabled"

-- Falls RLS AUS ist (bei beiden Tabellen): nichts zu tun.

-- Falls RLS AN ist, diese Policies anlegen (fuer beide Tabellen):

-- --- leaderboard_test ---
create policy "anon_select_test" on leaderboard_test for select to anon using (true);
create policy "anon_insert_test" on leaderboard_test for insert to anon with check (true);
create policy "anon_update_test" on leaderboard_test for update to anon using (true) with check (true);

-- --- leaderboard (Live) ---
-- create policy "anon_select" on leaderboard for select to anon using (true);
-- create policy "anon_insert" on leaderboard for insert to anon with check (true);
-- create policy "anon_update" on leaderboard for update to anon using (true) with check (true);

-- Hinweis: Da jeder mit dem Publishable-Key schreiben kann, ist das
-- weiterhin "ehrliche Nutzer"-Sicherheit. Fuer 0.0.26 ok.
-- Echte Absicherung kommt ab 0.1.0 mit Login.
