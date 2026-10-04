-- ============================================================
-- 01 | Test-Tabelle anlegen (1:1 Kopie von leaderboard)
-- Im Supabase SQL Editor ausfuehren. Die Live-Tabelle
-- `leaderboard` wird NICHT veraendert.
-- ============================================================

-- Kopie mit Struktur + Daten:
create table leaderboard_test as select * from leaderboard;

-- Primaerschluessel + Auto-Increment nachziehen,
-- damit neue Eintraege wieder eine id bekommen:
create sequence if not exists leaderboard_test_id_seq;
alter table leaderboard_test
  alter column id set default nextval('leaderboard_test_id_seq');
select setval('leaderboard_test_id_seq', coalesce((select max(id) from leaderboard_test), 1));
alter table leaderboard_test add primary key (id);

-- Danach kurz pruefen:
-- select count(*) from leaderboard;       -- Live
-- select count(*) from leaderboard_test;  -- Test (sollte gleich sein)
