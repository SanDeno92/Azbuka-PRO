/* ============================================================
   Azbuka PRO 0.0.26 – Profil-System (Overlay)
   Laedt VOR dem React-Bundle (classic script, kein defer).

   Aufgaben:
   - "Wer spielt?"-Screen vor App-Start (Profile aus localStorage)
   - Namensreservierung sofort beim Anlegen (ueber reserveName
     aus leaderboard-api.js, landet in leaderboard_test lokal)
   - Inline-Fehler "Name bereits vergeben" (kein Alert)
   - XP-Fortschritt pro Profil (azbuka_xp wird pro aktivem
     Profil gespiegelt, das Bundle muss nicht geaendert werden)
   - Migration: alte Einzel-Nutzer werden automatisch zu Profil 1
   ============================================================ */
(function () {
  'use strict';

  var LS_PROFILES = 'azbuka_profiles';
  var LS_ACTIVE   = 'azbuka_active_profile';
  var LS_NAME     = 'azbuka_name';      // vom Bundle gelesen
  var LS_XP       = 'azbuka_xp';        // vom Bundle gelesen/geschrieben
  var LS_STREAK   = 'azbuka_bestStreak';
  var LS_DAY      = 'azbuka_dayStreak';
  var LS_WALLET   = 'azbuka_wallet';
  var LS_AVATAR   = 'azbuka_avatar';
  var LS_ACTIVITY = 'azbuka_activityStats';
  var DAY_STATE_VERSION = 1;

  /* ---------------- Storage-Helfer ---------------- */

  function getProfiles() {
    try {
      var p = JSON.parse(localStorage.getItem(LS_PROFILES));
      return Array.isArray(p) ? p : [];
    } catch (e) { return []; }
  }

  function saveProfiles(list) {
    try { localStorage.setItem(LS_PROFILES, JSON.stringify(list)); } catch (e) {}
  }

  function getActive() {
    try { return localStorage.getItem(LS_ACTIVE) || null; } catch (e) { return null; }
  }

  function setActive(name) {
    try {
      localStorage.setItem(LS_ACTIVE, name);
      localStorage.setItem(LS_NAME, name); // Bundle liest daraus
    } catch (e) {}
  }

  function xpKey(name)   { return LS_XP + ':' + name; }
  function stkKey(name)  { return LS_STREAK + ':' + name; }
  function dayKey(name)  { return LS_DAY + ':' + name; }
  function walletKey(name) { return LS_WALLET + ':' + name; }
  function avatarKey(name) { return LS_AVATAR + ':' + name; }
  function activityKey(name) { return LS_ACTIVITY + ':' + name; }

  function getAvatar(name) {
    if (!name) return '';
    try {
      var avatar = localStorage.getItem(avatarKey(name));
      return avatar && avatar.indexOf('data:image/') === 0 ? avatar : '';
    } catch (e) { return ''; }
  }

  function setAvatar(name, dataUrl) {
    if (!name || !dataUrl) return false;
    try {
      localStorage.setItem(avatarKey(name), dataUrl);
      return true;
    } catch (e) {
      console.error('Avatar speichern fehlgeschlagen:', e.message);
      return false;
    }
  }

  function todayKey() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  function daysBetween(a, b) {
    var first = new Date(a + 'T00:00:00');
    var second = new Date(b + 'T00:00:00');
    return Math.round((second - first) / 86400000);
  }

  function protectionForMissedDays(state, missedDays) {
    if (missedDays <= 0) return { daily: 0, weekly: 0 };
    if (missedDays <= state.shields) return { daily: missedDays, weekly: 0 };
    if (missedDays <= 7 && state.weekShields > 0) return { daily: 0, weekly: 1 };
    return null;
  }

  function visibleDayStreak(state) {
    if (!state.lastDate || state.current <= 0) return 0;
    var gap = daysBetween(state.lastDate, todayKey());
    if (!isFinite(gap)) return 0;
    if (gap <= 1) return state.current;
    return protectionForMissedDays(state, gap - 1) ? state.current : 0;
  }

  function readDayState(name) {
    var fallback = { current: 0, best: 0, lastDate: '', shields: 0, weekShields: 0 };
    try {
      var raw = localStorage.getItem(dayKey(name));
      var state = raw ? JSON.parse(raw) : null;
      if (!state || typeof state !== 'object') return fallback;
      var qualified = state.version === DAY_STATE_VERSION;
      return {
        current: qualified ? Math.max(0, parseInt(state.current, 10) || 0) : 0,
        best: qualified ? Math.max(0, parseInt(state.best, 10) || 0) : 0,
        lastDate: qualified && typeof state.lastDate === 'string' ? state.lastDate : '',
        shields: Math.min(3, Math.max(0, parseInt(state.shields, 10) || 0)),
        weekShields: Math.min(1, Math.max(0, parseInt(state.weekShields, 10) || 0))
      };
    } catch (e) { return fallback; }
  }

  function writeDayState(name, state) {
    state.version = DAY_STATE_VERSION;
    try { localStorage.setItem(dayKey(name), JSON.stringify(state)); } catch (e) {}
  }

  function readActivityStats(name) {
    var fallback = { quizQuestions: 0, taskAnswers: 0 };
    try {
      var raw = localStorage.getItem(activityKey(name));
      var stats = raw ? JSON.parse(raw) : null;
      if (!stats || typeof stats !== 'object') return fallback;
      return {
        quizQuestions: Math.max(0, parseInt(stats.quizQuestions, 10) || 0),
        taskAnswers: Math.max(0, parseInt(stats.taskAnswers, 10) || 0)
      };
    } catch (e) { return fallback; }
  }

  function writeActivityStats(name, stats) {
    try { localStorage.setItem(activityKey(name), JSON.stringify(stats)); } catch (e) {}
  }

  function ensureActivityStats(name, initialQuizCount) {
    if (!name) return;
    try {
      if (localStorage.getItem(activityKey(name))) return;
      writeActivityStats(name, {
        quizQuestions: Math.max(0, parseInt(initialQuizCount, 10) || 0),
        taskAnswers: 0
      });
    } catch (e) {}
  }

  function incrementActivityStat(name, field, amount) {
    if (!name || (field !== 'quizQuestions' && field !== 'taskAnswers')) return;
    var stats = readActivityStats(name);
    stats[field] += Math.max(0, parseInt(amount, 10) || 0);
    writeActivityStats(name, stats);
  }

  function readWallet(name) {
    var fallback = { stars: 0 };
    try {
      var raw = localStorage.getItem(walletKey(name));
      var wallet = raw ? JSON.parse(raw) : null;
      return { stars: Math.max(0, parseInt(wallet && wallet.stars, 10) || 0) };
    } catch (e) { return fallback; }
  }

  function writeWallet(name, wallet) {
    try { localStorage.setItem(walletKey(name), JSON.stringify(wallet)); } catch (e) {}
  }

  function showDayStreakAnimation(streak, type) {
    if (!document.body) return;
    var existing = document.querySelector('.az-daystreak-celebration');
    if (existing) existing.remove();

    var celebration = document.createElement('div');
    celebration.className = 'az-daystreak-celebration az-streak-' + (type || 'kindle');
    celebration.setAttribute('aria-live', 'polite');
    var isBroken = type === 'broken';
    var isSaved = type === 'saved';
    var title = isBroken ? 'STREAK ERLOSCHEN' : isSaved ? 'SCHILD AKTIVIERT' : 'DAYSTREAK +1';
    var subtitle = isBroken ? 'Deine Flamme muss neu entfacht werden' :
      isSaved ? 'Dein Streak-Schild hat dich gerettet!' :
      streak + (streak === 1 ? ' Tag' : ' Tage') + ' am Stück!';
    celebration.innerHTML =
      '<div class="az-streak-burst" aria-hidden="true">' +
        '<i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>' +
      '</div>' +
      '<div class="az-streak-fire" aria-hidden="true">' +
        '<span class="az-fire-glow"></span><span class="az-fire-outer"></span>' +
        '<span class="az-fire-inner"></span><span class="az-fire-core"></span>' +
      '</div>' +
      '<div class="az-streak-copy">' +
        '<strong>' + title + '</strong>' +
        '<span>' + subtitle + '</span>' +
      '</div>';
    document.body.appendChild(celebration);
    setTimeout(function () {
      celebration.classList.add('is-done');
      setTimeout(function () { if (celebration.parentNode) celebration.remove(); }, 500);
    }, 2600);
  }

  function recordDailyActivity(name) {
    if (!name) return { current: 0, best: 0, lastDate: '', shields: 0, weekShields: 0 };
    var state = readDayState(name);
    var today = todayKey();
    if (state.lastDate === today) return state;

    var gap = state.lastDate ? daysBetween(state.lastDate, today) : 0;
    var animationType = 'kindle';
    if (!state.lastDate) {
      state.current = 1;
    } else if (!isFinite(gap)) {
      state.current = 1;
    } else if (gap <= 0) {
      return state;
    } else {
      if (gap === 1) {
        state.current += 1;
      } else if (gap > 1) {
        var protection = protectionForMissedDays(state, gap - 1);
        if (protection) {
          state.shields -= protection.daily;
          state.weekShields -= protection.weekly;
          state.current += 1;
          animationType = 'saved';
        } else {
          animationType = 'broken';
          state.current = 1;
        }
      }
    }
    var increased = state.current > 0 && state.lastDate !== today;
    state.lastDate = today;
    state.best = Math.max(state.best, state.current);
    writeDayState(name, state);

    if (increased) showDayStreakAnimation(state.current, animationType);
    return state;
  }

  function purchase(itemId, currency, cost) {
    var name = getActive();
    var amount = Math.max(0, parseInt(cost, 10) || 0);
    if (!name || !amount || currency !== 'xp') {
      return { ok: false, reason: 'invalid_purchase' };
    }
    var raw = localStorage.getItem(LS_XP);
    var data;
    try { data = raw ? JSON.parse(raw) : null; } catch (e) { data = null; }
    if (!data || typeof data.xp !== 'number' || data.xp < amount) {
      return { ok: false, reason: 'insufficient_xp' };
    }
    var state = readDayState(name);
    if (itemId === 'streak-shield') {
      if (state.shields >= 3) return { ok: false, reason: 'daily_limit' };
      data.xp -= amount;
      localStorage.setItem(LS_XP, JSON.stringify(data));
      localStorage.setItem(xpKey(name), JSON.stringify(data));
      state.shields += 1;
      writeDayState(name, state);
    } else if (itemId === 'week-streak-shield') {
      if (state.weekShields >= 1) return { ok: false, reason: 'weekly_limit' };
      data.xp -= amount;
      localStorage.setItem(LS_XP, JSON.stringify(data));
      localStorage.setItem(xpKey(name), JSON.stringify(data));
      state.weekShields += 1;
      writeDayState(name, state);
    } else {
      return { ok: false, reason: 'unknown_item' };
    }
    return { ok: true };
  }

  function readXpFor(name) {
    try {
      var raw = localStorage.getItem(xpKey(name));
      if (!raw || raw === '0') return null;
      var parsed = JSON.parse(raw);
      return (parsed && typeof parsed === 'object') ? raw : null;
    } catch (e) { return null; }
  }

  /* ---------------- Migration (0.0.25 -> 0.0.26) ----------------
     Bisheriger Einzel-Spieler wird automatisch zum ersten Profil. */

  function migrate() {
    var profiles = getProfiles();
    if (profiles.length > 0) return; // schon migriert

    var legacyName = null;
    try { legacyName = (localStorage.getItem(LS_NAME) || '').trim(); } catch (e) {}
    if (!legacyName) return; // komplett neuer Nutzer

    profiles = [legacyName];
    saveProfiles(profiles);

    // bisherigen XP-Stand dem Profil zuordnen
    try {
      var xp = localStorage.getItem(LS_XP);
      if (xp) localStorage.setItem(xpKey(legacyName), xp);
      var stk = localStorage.getItem(LS_STREAK);
      if (stk) localStorage.setItem(stkKey(legacyName), stk);
    } catch (e) {}

    activate(legacyName);
  }

  /* ---------------- Profil aktivieren / XP spiegeln ----------------
     Das Bundle arbeitet fest mit 'azbuka_xp'. Beim Aktivieren wird der
     Profil-Stand dorthin gespiegelt; ein Intervall schreibt Aenderungen
     des Bundles zurueck ins Profil. */

  var lastMirror = null;
  var lastQuizCount = 0;

  function activate(name) {
    setActive(name);
    var stored = readXpFor(name);
    var fresh  = JSON.stringify({ xp: 0, streak: 0, qCount: 0, learned: [] });
    var activeXp = stored || fresh;
    try {
      localStorage.setItem(LS_XP, activeXp);
      var stk = null;
      try { stk = localStorage.getItem(stkKey(name)); } catch (e) {}
      if (stk) localStorage.setItem(LS_STREAK, stk);
      else localStorage.removeItem(LS_STREAK);
    } catch (e) {}
    lastMirror = activeXp;
    try {
      var parsed = JSON.parse(activeXp);
      lastQuizCount = Math.max(0, parseInt(parsed && parsed.qCount, 10) || 0);
    } catch (e) {
      lastQuizCount = 0;
    }
    ensureActivityStats(name, lastQuizCount);
  }

  function startMirror() {
    setInterval(function () {
      var active = getActive();
      if (!active) return;
      try {
        var cur = localStorage.getItem(LS_XP);
        // Nur gueltige Objekte spiegeln (Bundle schreibt manchmal "0" als String)
        if (cur && cur !== '0' && cur !== lastMirror) {
          try {
            var parsed = JSON.parse(cur);
            if (parsed && typeof parsed === 'object') {
              var quizCount = Math.max(0, parseInt(parsed.qCount, 10) || 0);
              localStorage.setItem(xpKey(active), cur);
              lastMirror = cur;
              if (quizCount > lastQuizCount) {
                incrementActivityStat(active, 'quizQuestions', quizCount - lastQuizCount);
                recordDailyActivity(active);
              }
              lastQuizCount = quizCount;
            }
          } catch (e) { /* kein gueltiges JSON -> ignorieren */ }
        }
        var s = localStorage.getItem(LS_STREAK);
        if (s) localStorage.setItem(stkKey(active), s);
      } catch (e) {}
    }, 1000);
  }

  /* ---------------- Internes Bundle-Modal verstecken ----------------
     Wenn wir einen Namen gesetzt haben, soll das alte "Wie heisst du?"
     Modal nie sichtbar sein (reiner Fallback). */

  function hideInternalModal() {
    var m = document.getElementById('startModal');
    if (m && getActive()) m.style.display = 'none';
  }

  /* ---------------- UI: Profil-Overlay ---------------- */

  var overlayEl = null;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function buildOverlay() {
    if (overlayEl) return;
    overlayEl = document.createElement('div');
    overlayEl.className = 'prof-overlay';
    document.body.appendChild(overlayEl);
  }

  function showPicker() {
    buildOverlay();
    var profiles = getProfiles();
    var items = profiles.map(function (p) {
      return '<div class="prof-row">' +
               '<button type="button" class="prof-item" data-name="' + esc(p) + '">' + esc(p) + '</button>' +
               '<button type="button" class="prof-del" data-name="' + esc(p) + '" title="Profil löschen">✕</button>' +
             '</div>';
    }).join('');

    overlayEl.innerHTML =
      '<div class="prof-card">' +
        '<img class="prof-logo" src="apple-touch-icon.png" alt="Азбука PRO">' +
        '<h2 class="prof-title">Wer spielt?</h2>' +
        (items ? '<div class="prof-list">' + items + '</div>' : '') +
        '<button type="button" class="prof-new">+ Neuer Spieler</button>' +
      '</div>';
    overlayEl.style.display = 'flex';

    overlayEl.querySelectorAll('.prof-item').forEach(function (btn) {
      btn.addEventListener('click', function () { choose(btn.getAttribute('data-name')); });
    });
    overlayEl.querySelectorAll('.prof-del').forEach(function (btn) {
      btn.addEventListener('click', function () { deleteProfile(btn.getAttribute('data-name')); });
    });
    overlayEl.querySelector('.prof-new').addEventListener('click', showNewForm);
  }

  /* Profil nur lokal loeschen – der Ranglisten-Eintrag in Supabase
     bleibt absichtlich erhalten. */
  function deleteProfile(name) {
    if (!window.confirm('Profil „' + name + '“ löschen?\nDer Ranglisten-Eintrag bleibt erhalten.')) return;

    saveProfiles(getProfiles().filter(function (p) { return p !== name; }));
    try {
      localStorage.removeItem(xpKey(name));
      localStorage.removeItem(stkKey(name));
      localStorage.removeItem(dayKey(name));
      localStorage.removeItem(walletKey(name));
      localStorage.removeItem(avatarKey(name));
      localStorage.removeItem(activityKey(name));
    } catch (e) {}

    if (getActive() === name) {
      try {
        localStorage.removeItem(LS_ACTIVE);
        localStorage.removeItem(LS_NAME);
        localStorage.removeItem(LS_XP);
        localStorage.removeItem(LS_STREAK);
      } catch (e) {}
      location.reload(); // Boot zeigt dann wieder "Wer spielt?"
      return;
    }
    showPicker(); // Liste neu aufbauen
  }

  function showNewForm() {
    buildOverlay();
    overlayEl.innerHTML =
      '<div class="prof-card">' +
        '<img class="prof-logo" src="apple-touch-icon.png" alt="Азбука PRO">' +
        '<h2 class="prof-title">Wie heißt du?</h2>' +
        '<p class="prof-sub">Name fürs Leaderboard</p>' +
        '<input class="prof-input" id="profNameInput" maxlength="18" placeholder="z. B. Melek" autocomplete="off">' +
        '<div class="prof-error" id="profError"></div>' +
        '<button type="button" class="prof-save" id="profSaveBtn" disabled>SPEICHERN &amp; WEITER →</button>' +
        '<button type="button" class="prof-back" id="profBackBtn">← Zurück</button>' +
      '</div>';
    overlayEl.style.display = 'flex';

    var input = overlayEl.querySelector('#profNameInput');
    var error = overlayEl.querySelector('#profError');
    var save  = overlayEl.querySelector('#profSaveBtn');
    var back  = overlayEl.querySelector('#profBackBtn');
    var debounce = null;
    var taken = false;

    function setTaken(isTaken) {
      taken = isTaken;
      input.classList.toggle('prof-input-error', isTaken);
      error.textContent = isTaken ? 'Name bereits vergeben' : '';
      save.disabled = isTaken || !input.value.trim();
    }

    // Live-Check beim Tippen (300 ms Debounce)
    input.addEventListener('input', function () {
      var val = input.value.trim();
      save.disabled = !val;
      if (!val) { setTaken(false); return; }
      clearTimeout(debounce);
      debounce = setTimeout(function () {
        if (typeof checkNameTaken !== 'function') return;
        checkNameTaken(val).then(function (isTaken) {
          if (input.value.trim() === val) setTaken(isTaken);
        });
      }, 300);
    });

    function submit() {
      var val = input.value.trim();
      if (!val || taken) return;
      save.disabled = true;
      save.textContent = 'SPEICHERE…';

      var finish = function () {
        var profiles = getProfiles();
        if (profiles.indexOf(val) === -1) {
          profiles.push(val);
          saveProfiles(profiles);
        }
        activate(val);
        location.reload(); // Bundle startet sauber mit neuem Profil
      };

      if (typeof reserveName === 'function') {
        reserveName(val).then(function (res) {
          if (res.ok) { finish(); return; }
          if (res.reason === 'name_taken') {
            setTaken(true);
            save.textContent = 'SPEICHERN & WEITER →';
            return;
          }
          // Netzwerk-/Server-Fehler: lokal trotzdem weiter
          finish();
        });
      } else {
        finish();
      }
    }

    save.addEventListener('click', submit);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') submit(); });
    back.addEventListener('click', showPicker);
    input.focus();
  }

  function choose(name) {
    activate(name);
    location.reload(); // Bundle laedt XP/Name des gewaehlten Profils
  }

  /* ---------------- Switch-Button (immer erreichbar) ---------------- */

  function addSwitchButton() {
    if (!getActive()) return;
    if (document.querySelector('.prof-switch-btn')) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'prof-switch-btn';
    b.textContent = '👤';
    b.title = 'Nutzer wechseln';
    b.addEventListener('click', showPicker);
    document.body.appendChild(b);
  }

  /* ---------------- "Name ändern" des Bundles umleiten ----------------
      Der Button im Quiz-Screen oeffnet sonst das alte interne Modal
      (keine Reservierung, setzt XP zurueck). Wir fangen den Klick in der
      Capture-Phase ab, BEVOR React ihn sieht, und zeigen unser Overlay. */

  function interceptBundleNameChange() {
    document.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest ? e.target.closest('button') : null;
      if (btn && btn.textContent.indexOf('Name ändern') !== -1) {
        e.preventDefault();
        e.stopPropagation();
        showPicker();
      }
    }, true);
  }

  /* Das Bundle setzt qCount beim Start jeder Quizrunde auf 0.
     Wir setzen unseren Vergleichswert schon in der Capture-Phase
     zurück, damit auch eine sehr schnelle erste Antwort sicher als
     neue, lebenslange Quizfrage gezählt wird. */
  function watchQuizSessionStarts() {
    document.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest ? e.target.closest('#quizView button') : null;
      if (btn && btn.textContent.indexOf('QUIZ STARTEN') !== -1) {
        lastQuizCount = 0;
        try {
          var raw = localStorage.getItem(LS_XP);
          var data = raw ? JSON.parse(raw) : null;
          if (data && typeof data === 'object') {
            data.qCount = 0;
            lastMirror = JSON.stringify(data);
            localStorage.setItem(LS_XP, lastMirror);
            var active = getActive();
            if (active) localStorage.setItem(xpKey(active), lastMirror);
          }
        } catch (err) {
          console.error('Quiz-Zähler konnte nicht zurückgesetzt werden:', err.message);
        }
      }
    }, true);
  }

  function decorateLeaderboardAvatars() {
    var view = document.getElementById('ranglisteView');
    if (!view) return;

    view.querySelectorAll('.truncate').forEach(function (nameEl) {
      if (nameEl.getAttribute('data-avatar-ready') === '1') return;
      var name = (nameEl.textContent || '').trim();
      var avatar = getAvatar(name);
      if (!avatar) return;

      nameEl.setAttribute('data-avatar-ready', '1');
      nameEl.style.display = 'flex';
      nameEl.style.alignItems = 'center';
      nameEl.style.justifyContent = 'center';
      nameEl.style.gap = '6px';
      nameEl.innerHTML =
        '<img src="' + avatar + '" alt="" class="az-leaderboard-avatar">' +
        '<span class="az-leaderboard-name">' + esc(name) + '</span>';
    });
  }

  function startLeaderboardAvatarObserver() {
    if (!document.body || typeof MutationObserver === 'undefined') return;
    var observer = new MutationObserver(decorateLeaderboardAvatars);
    observer.observe(document.body, { childList: true, subtree: true });
    decorateLeaderboardAvatars();
  }

  /* ---------------- Boot ---------------- */

  function boot() {
    migrate();
    var active = getActive();
    var inList = active && getProfiles().indexOf(active) !== -1;
    if (inList) {
      activate(active); // sicherstellen, dass XP gespiegelt ist
      addSwitchButton();
    } else {
      showPicker();
    }
    startMirror();
    interceptBundleNameChange();
    watchQuizSessionStarts();
    setInterval(hideInternalModal, 300);
    startLeaderboardAvatarObserver();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  /* ---------------- Oeffentliche API (fuer Profil-Tab / Mobile-Nav) ----------------
     Liest nur bereits vorhandene Daten aus, aendert an der bisherigen
     Logik nichts. Damit koennen andere Module (z.B. profil-view.js)
     Name/XP/Streak anzeigen, ohne das Storage-Format selbst zu kennen. */
  window.AzbukaProfiles = {
    getActiveName: getActive,
    getAllNames: getProfiles,
    getAvatar: getAvatar,
    setAvatar: setAvatar,
    showPicker: showPicker,
    getStats: function (name) {
      var target = name || getActive();
      var out = { xp: 0, streak: 0, bestStreak: 0, dayStreak: 0, bestDayStreak: 0, shields: 0, weekShields: 0, qCount: 0, taskAnswers: 0, learned: 0 };
      if (!target) return out;
      try {
        var raw = target === getActive()
          ? localStorage.getItem(LS_XP)
          : readXpFor(target);
        if (raw) {
          var parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            out.xp = Math.max(0, parseInt(parsed.xp, 10) || 0);
            out.streak = Math.max(0, parseInt(parsed.streak, 10) || 0);
            out.learned = Array.isArray(parsed.learned)
              ? Math.min(33, new Set(parsed.learned.map(String)).size)
              : 0;
          }
        }
        var best = target === getActive()
          ? localStorage.getItem(LS_STREAK)
          : localStorage.getItem(stkKey(target));
        out.bestStreak = best ? (parseInt(best, 10) || 0) : 0;
        var day = readDayState(target);
        out.dayStreak = visibleDayStreak(day);
        out.bestDayStreak = day.best;
        out.shields = day.shields;
        out.weekShields = day.weekShields;
        var activity = readActivityStats(target);
        out.qCount = activity.quizQuestions;
        out.taskAnswers = activity.taskAnswers;
      } catch (e) {}
      return out;
    },
    recordDailyActivity: function () { return recordDailyActivity(getActive()); },
    recordTaskActivity: function () {
      var active = getActive();
      incrementActivityStat(active, 'taskAnswers', 1);
      return recordDailyActivity(active);
    },
    getWallet: function () { return readWallet(getActive()); },
    purchase: purchase
  };
})();
