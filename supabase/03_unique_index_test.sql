-- ============================================================
-- 03 | Unique-Index auf der TEST-Tabelle
-- Ab hier ist jeder Name (egal ob "Melek", "melek" oder " Melek ")
-- nur noch 1x erlaubt. Ohne diesen Index funktioniert die
-- Namensreservierung nicht zuverlaessig (Rennbedingungen).
-- ============================================================

create unique index leaderboard_test_name_unique
  on leaderboard_test (lower(trim(name)));

-- Falls das fehlschlaegt mit "could not create unique index":
-- In der Test-Tabelle gibt es noch Duplikate. Zum Bereinigen
-- pro Namen nur den besten Eintrag behalten:
--
-- delete from leaderboard_test a
-- using leaderboard_test b
-- where lower(trim(a.name)) = lower(trim(b.name))
--   and (a.correct, a.xp, a.date) < (b.correct, b.xp, b.date);
--
-- Danach den create unique index erneut ausfuehren.
