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
const LEADERBOARD_MODE_KEY = 'azbuka_lb_mode';
const TASK_LEADERBOARD_KEY = 'azbuka_aufgaben_weekly_leaderboard';
const browserFetch = window.fetch.bind(window);

function getLeaderboardMode() {
  try {
    const stored = localStorage.getItem(LEADERBOARD_MODE_KEY);
    return stored === 'aufgaben' ? 'aufgaben' : 'quiz';
  } catch (e) {
    return 'quiz';
  }
}

function setLeaderboardMode(mode) {
  const next = mode === 'aufgaben' ? 'aufgaben' : 'quiz';
  try { localStorage.setItem(LEADERBOARD_MODE_KEY, next); } catch (e) {}
  return next;
}

function getLeaderboardRowsForMode(mode) {
  const chosen = mode === 'aufgaben' ? 'aufgaben' : 'quiz';
  const key = chosen === 'aufgaben' ? TASK_LEADERBOARD_KEY : 'azbuka_leaderboard';

  try {
    const raw = localStorage.getItem(key);
    const rows = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(rows)) return [];
    return rows
      .filter((row) => row && row.name)
      .sort((a, b) => (Number(b.xp) || 0) - (Number(a.xp) || 0))
      .slice(0, 50);
  } catch (e) {
    return [];
  }
}

function buildLeaderboardToggleMarkup(activeMode) {
  const modes = [
    { key: 'quiz', label: 'Quiz XP' },
    { key: 'aufgaben', label: 'Aufgaben XP' }
  ];

  return `
    <div id="azbukaLeaderboardToggle" style="display:flex;align-items:center;justify-content:center;gap:8px;margin:0 auto 16px;max-width:420px;position:relative;z-index:20;">
      ${modes.map((entry) => {
        const isActive = activeMode === entry.key;
        return `
          <button type="button" data-mode="${entry.key}" style="border-radius:999px;padding:8px 14px;font-size:12px;font-weight:800;letter-spacing:0.08em;border:1px solid ${isActive ? 'var(--theme-primary)' : 'rgba(255,255,255,0.12)'};background:${isActive ? 'linear-gradient(180deg, var(--theme-primary), color-mix(in srgb, var(--theme-primary) 85%, black))' : 'rgba(255,255,255,0.04)'};color:${isActive ? '#0b120b' : '#fff'};cursor:pointer;transition:all .2s ease;">${entry.label}</button>
        `;
      }).join('')}
    </div>
  `;
}

function renderLeaderboardViewFromMode() {
  const view = document.getElementById('ranglisteView');
  if (!view) return;

  const mode = getLeaderboardMode();
  const rows = getLeaderboardRowsForMode(mode);
  const heading = mode === 'aufgaben' ? 'Aufgaben XP - Top 50' : 'Bestenliste - Top 50';
  const emptyText = mode === 'aufgaben' ? 'Noch keine Aufgaben-XP Einträge - löse Aufgaben, um auf der Liste zu erscheinen.' : 'Noch keine Einträge - starte ein Quiz';

  const top3 = rows.slice(0, 3);
  const topHtml = top3.map((entry, idx) => {
    const medal = idx === 0 ? 'var(--theme-primary)' : idx === 1 ? '#D9D9D9' : '#C08A3C';
    return `
      <div class="azbuka-rank-card" style="background:rgba(var(--theme-panel-rgb),0.88);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:12px 10px;text-align:center;min-width:0;">
        <div style="width:28px;height:28px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;margin-bottom:8px;background:${medal};color:#0b120b;">${idx + 1}</div>
        <div style="font-size:12px;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${(entry.name || 'Anonym').slice(0, 18)}</div>
        <div style="font-size:11px;color:rgba(255,255,255,0.55);margin-top:3px;">Lvl ${entry.lvl || 1} • ${entry.correct || 0} richtig</div>
        <div style="font-size:10px;color:rgba(255,255,255,0.35);margin-top:4px;">${(Number(entry.xp) || 0).toLocaleString()} XP</div>
      </div>
    `;
  }).join('');

  const rowsHtml = rows.length ? rows.map((entry, idx) => `
    <div style="display:flex;align-items:center;justify-content:space-between;border-radius:12px;border:1px solid rgba(255,255,255,0.08);padding:12px 14px;background:rgba(var(--theme-panel-rgb),0.85);">
      <div style="display:flex;align-items:center;gap:10px;min-width:0;">
        <div style="width:24px;height:24px;border-radius:999px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;background:${idx === 0 ? 'var(--theme-primary)' : 'rgba(255,255,255,0.08)'};color:${idx === 0 ? '#0b120b' : '#fff'};flex-shrink:0;">${idx + 1}</div>
        <div style="min-width:0;">
          <div style="font-size:13px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${(entry.name || 'Anonym').slice(0, 18)}</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.48);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Lvl ${entry.lvl || 1} • ${entry.correct || 0} richtig</div>
        </div>
      </div>
      <div style="font-size:11px;font-weight:900;border-radius:999px;padding:6px 10px;background:rgba(255,255,255,0.08);color:#fff;white-space:nowrap;">${(Number(entry.xp) || 0).toLocaleString()} XP</div>
    </div>
  `).join('') : `<div style="border-radius:14px;background:rgba(var(--theme-panel-rgb),0.85);border:1px solid rgba(255,255,255,0.08);padding:24px;text-align:center;color:rgba(255,255,255,0.55);">${emptyText}</div>`;

  view.innerHTML = `
    ${buildLeaderboardToggleMarkup(mode)}
    <h1 style="font-size:28px;font-weight:900;letter-spacing:-0.04em;line-height:1.1;margin:0 0 8px;">${heading}</h1>
    <p style="font-size:13px;color:rgba(255,255,255,0.52);margin:0 0 18px;line-height:1.5;">Top 50 nach XP - ${mode === 'aufgaben' ? 'Aufgaben XP' : 'Quiz XP'} </p>
    <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-bottom:18px;">${topHtml || '<div></div>'}</div>
    <div style="display:flex;flex-direction:column;gap:10px;">${rowsHtml}</div>
    <p style="margin-top:18px;text-align:center;font-size:10px;color:rgba(255,255,255,0.2);letter-spacing:0.14em;">🌍 Global gespeichert</p>
  `;

  const toggle = view.querySelector('#azbukaLeaderboardToggle');
  if (toggle) {
    toggle.querySelectorAll('button[data-mode]').forEach((button) => {
      button.addEventListener('click', () => {
        const next = setLeaderboardMode(button.dataset.mode || 'quiz');
        renderLeaderboardViewFromMode();
        try {
          window.dispatchEvent(new CustomEvent('azbuka-leaderboard-mode-change', { detail: { mode: next } }));
        } catch (e) {}
        if (typeof fetchLeaderboard === 'function') fetchLeaderboard();
      });
    });
  }
}

window.addEventListener('azbuka-leaderboard-mode-change', () => {
  try {
    renderLeaderboardViewFromMode();
    const key = getLeaderboardStorageKey();
    const raw = localStorage.getItem(key);
    if (!raw) return;
    const rows = JSON.parse(raw);
    if (Array.isArray(rows)) {
      const appState = window.__AZBUKA_APP_STATE__ || null;
      if (appState && typeof appState.setLeaderboard === 'function') {
        appState.setLeaderboard(rows);
      }
    }
  } catch (e) {}
});

function refreshLeaderboardModeUi() {
  renderLeaderboardViewFromMode();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(refreshLeaderboardModeUi, 150);
    setTimeout(refreshLeaderboardModeUi, 800);
  }, { once: true });
} else {
  setTimeout(refreshLeaderboardModeUi, 150);
  setTimeout(refreshLeaderboardModeUi, 800);
}

window.azbukaLeaderboard = { getMode: getLeaderboardMode, setMode: setLeaderboardMode };

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
  const mode = getLeaderboardMode();

  if (mode === 'aufgaben') {
    try {
      const cached = JSON.parse(localStorage.getItem(TASK_LEADERBOARD_KEY) || '[]');
      const rows = Array.isArray(cached) ? cached : [];
      leaderboardCache = rows
        .filter((row) => row && row.source === 'aufgaben')
        .sort((a, b) => (Number(b.xp) || 0) - (Number(a.xp) || 0))
        .slice(0, 50);
      return leaderboardCache;
    } catch (e) {
      return [];
    }
  }

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
  const mode = getLeaderboardMode();
  if (mode === 'aufgaben') {
    const cleanName = normalizeName(playerData && playerData.name);
    if (!cleanName) return false;

    const rows = JSON.parse(localStorage.getItem(TASK_LEADERBOARD_KEY) || '[]');
    const nextRows = Array.isArray(rows) ? rows : [];
    const entry = {
      name: cleanName,
      xp: Number(playerData.xp) || 0,
      lvl: Math.max(1, Number(playerData.lvl) || 1),
      correct: Math.max(0, Number(playerData.correct) || 0),
      streak: Number(playerData.streak) || 0,
      beststreak: Math.max(Number(playerData.bestStreak) || 0, Number(playerData.streak) || 0),
      source: 'aufgaben',
      weekKey: new Date().toISOString().slice(0, 10),
      date: Date.now()
    };

    const filtered = nextRows.filter((row) => !(row && row.source === 'aufgaben' && row.name === cleanName));
    filtered.push(entry);
    const sorted = filtered.sort((a, b) => (Number(b.xp) || 0) - (Number(a.xp) || 0)).slice(0, 50);
    localStorage.setItem(TASK_LEADERBOARD_KEY, JSON.stringify(sorted));
    leaderboardCache = sorted;
    return sorted;
  }

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
