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

  function activate(name) {
    setActive(name);
    var stored = readXpFor(name);
    var fresh  = JSON.stringify({ xp: 0, streak: 0, qCount: 0, learned: [] });
    try {
      localStorage.setItem(LS_XP, stored || fresh);
      var stk = null;
      try { stk = localStorage.getItem(stkKey(name)); } catch (e) {}
      if (stk) localStorage.setItem(LS_STREAK, stk);
      else localStorage.removeItem(LS_STREAK);
    } catch (e) {}
    lastMirror = null;
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
              localStorage.setItem(xpKey(active), cur);
              lastMirror = cur;
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
    setInterval(hideInternalModal, 300);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
