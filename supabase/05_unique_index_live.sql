-- ============================================================
-- 05 | Unique-Index auf der LIVE-Tabelle
-- ERST ausfuehren, wenn:
--   1. Alles auf leaderboard_test erfolgreich getestet wurde
--   2. 02_doppelte_namen_pruefen.sql KEINE Treffer mehr liefert
--      (sonst schlaegt der Index fehl)
-- ============================================================

create unique index leaderboard_name_unique
  on leaderboard (lower(trim(name)));

-- Falls Duplikate im Weg sind, pro Namen nur den besten behalten:
--
-- delete from leaderboard a
-- using leaderboard b
-- where lower(trim(a.name)) = lower(trim(b.name))
--   and (a.correct, a.xp, a.date) < (b.correct, b.xp, b.date);
--
-- Danach den create unique index erneut ausfuehren.
