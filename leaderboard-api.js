// Supabase Leaderboard API (Direct Frontend) - v0.0.26
const SUPABASE_URL = 'https://ivfkjsemrygskblepfrn.supabase.co';
const SUPABASE_KEY = 'sb_publishable_56eLZ-zIM_ItXl6rNe44Xw_8lxtp2Xc';

// Test vs. Live: identischer Code – nur die EXAKTE Live-URL schreibt
// auf die Live-Tabelle. Alles andere (localhost, Live Server, file://,
// Handy-Test per WLAN-IP, ein evtl. Test-Repo auf GitHub Pages) landet
// automatisch auf der Test-Tabelle. Fail-safe Richtung: Test.
const LIVE_HOST = 'sandeno92.github.io';
const path = location.pathname.toLowerCase().replace(/\/+$/, '');
const IS_LIVE = location.hostname === LIVE_HOST &&
                (path === '/azbuka-pro' || path.startsWith('/azbuka-pro/'));
const TABLE = IS_LIVE ? 'leaderboard' : 'leaderboard_test';

const REST_HEADERS = {
  'apikey': SUPABASE_KEY,
  'Content-Type': 'application/json'
};

// Namen normalisieren: trimmen, max. 18 Zeichen, keine spitzen Klammern.
function normalizeName(name) {
  return String(name || '').trim().slice(0, 18).replace(/[<>]/g, '');
}

let leaderboardCache = [];
let lastLeaderboardFetch = 0;
const browserFetch = window.fetch.bind(window);

// Route the bundled app's legacy leaderboard path directly through Supabase.
window.fetch = async (input, init) => {
  const requestUrl = typeof input === 'string' ? input : input.url;
  const pathname = new URL(requestUrl, window.location.href).pathname;

  if (!pathname.endsWith('/functions/leaderboard')) {
    return browserFetch(input, init);
  }

  if (init && init.method === 'POST' && typeof init.body === 'string') {
    const result = await saveToLeaderboard(JSON.parse(init.body));
    return new Response(JSON.stringify(result), {
      status: result === false ? 502 : 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify(await fetchLeaderboard()), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

async function fetchLeaderboard() {
  const now = Date.now();
  if (now - lastLeaderboardFetch < 3000 && leaderboardCache.length > 0) {
    return leaderboardCache;
  }
  
  try {
    // correct>0: 0-Punkte-Eintraege sind nur Namensreservierungen und
    // bleiben im Ranking unsichtbar.
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${TABLE}?correct=gt.0&select=*&order=xp.desc,correct.desc&limit=50`,
      {
        headers: REST_HEADERS,
        cache: 'no-store'
      }
    );
    
    if (!res.ok) {
      console.error('Leaderboard fetch failed:', res.status);
      return leaderboardCache;
    }
    
    const data = await res.json();
    leaderboardCache = Array.isArray(data) ? data : [];
    lastLeaderboardFetch = now;
    
    // Speicher lokal
    try {
      localStorage.setItem('azbuka_leaderboard', JSON.stringify(leaderboardCache));
    } catch (e) {}
    
    return leaderboardCache;
  } catch (e) {
    console.error('Leaderboard fetch error:', e.message);
    
    // Fallback zu lokalstorage
    try {
      const cached = localStorage.getItem('azbuka_leaderboard');
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    
    return leaderboardCache;
  }
}

// Prueft, ob ein Name (case-insensitiv, getrimmt) schon vergeben ist.
async function checkNameTaken(name) {
  const clean = normalizeName(name);
  if (!clean) return false;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${TABLE}?name=ilike.${encodeURIComponent(clean)}&select=id&limit=1`,
      { headers: REST_HEADERS, cache: 'no-store' }
    );
    if (!res.ok) return false; // Bei Fehler nicht blockieren
    const rows = await res.json();
    return Array.isArray(rows) && rows.length > 0;
  } catch (e) {
    return false; // Offline etc. -> nicht blockieren
  }
}

// Reserviert einen Namen sofort (INSERT mit 0 Punkten).
// Rueckgabe: { ok: true } oder { ok: false, reason: 'name_taken'|'error' }
async function reserveName(name) {
  const clean = normalizeName(name);
  if (!clean) return { ok: false, reason: 'empty' };
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${TABLE}`,
      {
        method: 'POST',
        headers: { ...REST_HEADERS, 'Prefer': 'return=minimal' },
        body: JSON.stringify({
          name: clean,
          correct: 0,
          xp: 0,
          lvl: 1,
          streak: 0,
          beststreak: 0,
          date: Math.floor(Date.now())
        })
      }
    );
    if (res.ok) return { ok: true };
    // Unique-Verletzung (23505) oder Konflikt -> Name schon vergeben
    if (res.status === 409) return { ok: false, reason: 'name_taken' };
    const errText = await res.text();
    if (errText.includes('23505')) return { ok: false, reason: 'name_taken' };
    console.error('reserveName failed:', res.status, errText);
    return { ok: false, reason: 'error' };
  } catch (e) {
    console.error('reserveName error:', e.message);
    return { ok: false, reason: 'error' };
  }
}

// Wird vom Bundle nach dem Quiz aufgerufen (ueber fetch-Intercept).
// Der Name wurde bereits beim Speichern reserviert -> hier nur noch
// die Punkte per PATCH aktualisieren, und nur wenn der neue Score besser ist.
async function saveToLeaderboard(playerData) {
  const { name, correct, xp, lvl, streak, bestStreak } = playerData;
  const cleanName = normalizeName(name);

  if (!cleanName) {
    console.error('Player name required');
    return false;
  }

  // Das Bundle sendet streak/bestStreak nicht mit - aus localStorage ergaenzen
  // (azbuka_bestStreak ist durch das Profil-System bereits der aktive Profil-Wert).
  // Robuster Zugriff: Bundle schreibt manchmal "0" als String statt Objekt.
  let storedBest = 0;
  try {
    const raw = localStorage.getItem('azbuka_bestStreak');
    storedBest = (raw && raw !== 'null' && raw !== 'undefined') ? Number(raw) || 0 : 0;
  } catch (e) {}
  let currentStreak = 0;
  try {
    const raw = localStorage.getItem('azbuka_xp');
    if (raw && raw !== 'null' && raw !== 'undefined' && raw !== '0') {
      const xpObj = JSON.parse(raw);
      currentStreak = Number(xpObj.streak) || 0;
    }
  } catch (e) {}

  const entry = {
    correct: Math.max(0, Number(correct) || 0),
    xp: Math.max(0, Number(xp) || 0),
    lvl: Math.max(1, Number(lvl) || 1),
    streak: Number(streak) || currentStreak,
    beststreak: Math.max(Number(bestStreak) || 0, storedBest),
    date: Math.floor(Date.now())
  };

  try {
    // Aktuellen Stand des reservierten Eintrags holen
    const checkRes = await fetch(
      `${SUPABASE_URL}/rest/v1/${TABLE}?name=eq.${encodeURIComponent(cleanName)}&select=id,correct,xp&limit=1`,
      { headers: REST_HEADERS, cache: 'no-store' }
    );

    if (checkRes.ok) {
      const existing = await checkRes.json();

      if (Array.isArray(existing) && existing.length > 0) {
        const best = existing[0];
        // XP ist die fuehrende Waehrung: hoehere Streak/Genauigkeit = mehr XP.
        // Nur ueberschreiben, wenn der neue XP-Stand hoeher ist (bei Gleichstand
        // gewinnt mehr richtige Antworten). beststreak/streak werden trotzdem
        // mitgepatcht, damit die Rangliste aktuelle Werte zeigt.
        const newScoreIsWorse = (entry.xp < best.xp) ||
                                (entry.xp === best.xp && entry.correct < best.correct);
        if (newScoreIsWorse && best.correct > 0) {
          console.log('New score is worse than existing best. Skipping save.');
          return await fetchLeaderboard();
        }
      } else {
        // Kein Eintrag vorhanden (z.B. Reservierung fehlgeschlagen) -> Fallback: INSERT
        const postRes = await fetch(
          `${SUPABASE_URL}/rest/v1/${TABLE}`,
          {
            method: 'POST',
            headers: { ...REST_HEADERS, 'Prefer': 'return=minimal' },
            body: JSON.stringify({ name: cleanName, ...entry })
          }
        );
        if (!postRes.ok) {
          console.error('POST fallback failed:', postRes.status);
          return false;
        }
        lastLeaderboardFetch = 0;
        return await fetchLeaderboard();
      }
    }

    // Score in die reservierte Zeile patchen
    const patchRes = await fetch(
      `${SUPABASE_URL}/rest/v1/${TABLE}?name=eq.${encodeURIComponent(cleanName)}`,
      {
        method: 'PATCH',
        headers: { ...REST_HEADERS, 'Prefer': 'return=minimal' },
        body: JSON.stringify(entry)
      }
    );

    if (!patchRes.ok) {
      const errText = await patchRes.text();
      console.error('PATCH failed:', patchRes.status, errText);
      return false;
    }

    lastLeaderboardFetch = 0; // Force refresh
    const updated = await fetchLeaderboard();
    console.log('Leaderboard after save:', updated.length, 'entries');
    return updated;
  } catch (e) {
    console.error('Save to leaderboard error:', e.message);
    return false;
  }
}

// Auto-load leaderboard on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    fetchLeaderboard();
  });
} else {
  fetchLeaderboard();
}

// Periodically refresh
setInterval(fetchLeaderboard, 10000);
