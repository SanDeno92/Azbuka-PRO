-- ============================================================
-- 02 | Doppelte Namen finden (case-insensitiv + getrimmt)
-- Zuerst auf der LIVE-Tabelle pruefen. Wenn hier Zeilen
-- zurueckkommen, muessen die Duplikate vor dem Unique-Index
-- aufgeloest werden (siehe 03_loeschen_live.sql).
-- ============================================================

select lower(trim(name)) as name_normalisiert, count(*) as anzahl
from leaderboard
group by 1
having count(*) > 1
order by anzahl desc;

-- Detailansicht: welche Eintraege genau betroffen sind
-- (aendere 'deinname' auf einen Treffer von oben):
-- select id, name, correct, xp, date
-- from leaderboard
-- where lower(trim(name)) = 'deinname'
-- order by correct desc, xp desc;
