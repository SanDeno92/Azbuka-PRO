/* ============================================================
   Azbuka PRO – Reiter "Aufgaben"
   ------------------------------------------------------------
   Zeigt Stages → Level → Übungen mit echter Abfrage.
   Die Inhalte stehen in aufgaben-data.js – DIESE Datei musst du
   zum Erweitern normalerweise nicht anfassen.

   Drei Ansichten, umgeschaltet ueber die Variable "sicht":
     stages  – Uebersicht aller Kapitel
     levels  – Level eines Kapitels
     uebung  – die Abfrage selbst

   UEBUNGSFORMEN
   ------------------------------------------------------------
   Es gibt neun Formen. Welche drankommt, entscheidet die App
   selbst: jedes Level hat eine Schwierigkeit 1-4 (steigt
   automatisch ueber alle Level an), und die Schwierigkeit legt
   fest, aus welchem Topf an Formen gezogen wird. Innerhalb
   eines Levels wird pro Aufgabe durchgewechselt, damit nichts
   monoton wird.

     wahl-ru     Deutsch  -> russische Antwort waehlen
     wahl-de     Russisch -> deutsche Antwort waehlen
     wahl-pron   Lautschrift -> russischen Satz waehlen
     paare       vier Paare russisch/deutsch verbinden
     bau         Woerter in die richtige Reihenfolge
     luecke-wahl fehlendes Wort aus vier waehlen
     salat       Wort aus einzelnen Buchstaben bauen
     luecke-tipp fehlendes Wort eintippen
     tippen      ganzen Satz eintippen

   Fortschritt liegt in localStorage unter azbuka_aufgaben:
     { "level-id": { geloest: ["0","3"] } }
   Gezaehlt wird pro Uebung, damit nichts doppelt zaehlt.
   ============================================================ */
(function () {
  'use strict';

  var LS_PROGRESS = 'azbuka_aufgaben';

  var sicht = 'stages';
  var aktStage = null;
  var aktLevel = null;

  /* Laufende Uebungsrunde */
  var runde = null;

  /* Globale Popup-Positionen fuer XP-Anzeige */
  var popupPositions = [];

  /* ---------------- Daten ---------------- */

  function data() {
    return Array.isArray(window.AZBUKA_AUFGABEN) ? window.AZBUKA_AUFGABEN : [];
  }

  function getProgress() {
    try {
      var p = JSON.parse(localStorage.getItem(LS_PROGRESS));
      return (p && typeof p === 'object' && !Array.isArray(p)) ? p : {};
    } catch (e) { return {}; }
  }

  function setProgress(p) {
    try { localStorage.setItem(LS_PROGRESS, JSON.stringify(p)); } catch (e) {}
  }

  var LS_XP = 'azbuka_aufgaben_xp';
  var LS_TASK_LEADERBOARD = 'azbuka_aufgaben_weekly_leaderboard';

  function getWeekKey(now) {
    var d = new Date(now || Date.now());
    d.setHours(0, 0, 0, 0);
    var day = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - day);
    return d.toISOString().slice(0, 10);
  }

  function resetTaskXPIfNeeded() {
    try {
      var raw = localStorage.getItem(LS_XP);
      if (!raw) return;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return;
      var needReset = !parsed.weekKey || parsed.weekKey !== getWeekKey();
      if (!needReset) return;
      var resetState = { total: 0, streak: 0, bestStreak: 0, weekKey: getWeekKey() };
      localStorage.setItem(LS_XP, JSON.stringify(resetState));
    } catch (e) {}
  }

  function getXPState() {
    resetTaskXPIfNeeded();

    var taskState = { total: 0, streak: 0, bestStreak: 0, weekKey: getWeekKey() };
    try {
      var rawTask = localStorage.getItem(LS_XP);
      if (rawTask) {
        var parsedTask = JSON.parse(rawTask);
        if (parsedTask && typeof parsedTask === 'object' && !Array.isArray(parsedTask)) {
          taskState = parsedTask;
        }
      }
    } catch (e) {}

    var total = Number(taskState.total || 0);
    var streak = Number(taskState.streak || 0);
    var bestStreak = Number(taskState.bestStreak || 0);
    return { total: Number(total) || 0, streak: Number(streak) || 0, bestStreak: Number(bestStreak) || 0, weekKey: taskState.weekKey || getWeekKey() };
  }

  function getTaskLeaderboardName() {
    if (window.AzbukaProfiles && typeof window.AzbukaProfiles.getActiveName === 'function') {
      var activeName = window.AzbukaProfiles.getActiveName();
      if (activeName) return activeName;
    }
    try {
      var fromStorage = localStorage.getItem('azbuka_name');
      if (fromStorage) return fromStorage;
    } catch (e) {}
    return 'Spieler';
  }

  function syncTaskLeaderboard() {
    try {
      var state = getXPState();
      var rows = [];
      try {
        rows = JSON.parse(localStorage.getItem(LS_TASK_LEADERBOARD) || '[]');
      } catch (e) { rows = []; }
      if (!Array.isArray(rows)) rows = [];

      var name = getTaskLeaderboardName();
      var weekKey = state.weekKey || getWeekKey();
      var entry = {
        name: String(name || 'Spieler').trim().slice(0, 18),
        xp: Number(state.total) || 0,
        lvl: 1,
        correct: Math.max(0, Number(state.bestStreak) || 0),
        streak: Number(state.streak) || 0,
        beststreak: Number(state.bestStreak) || 0,
        source: 'aufgaben',
        weekKey: weekKey,
        date: Date.now()
      };

      var clean = rows.filter(function (row) {
        return !(row && row.source === 'aufgaben' && row.name === entry.name && row.weekKey === weekKey);
      });

      clean.push(entry);
      clean = clean
        .filter(function (row) { return row && row.source === 'aufgaben' && row.weekKey === weekKey; })
        .sort(function (a, b) { return (Number(b.xp) || 0) - (Number(a.xp) || 0); })
        .slice(0, 50);

      localStorage.setItem(LS_TASK_LEADERBOARD, JSON.stringify(clean));
    } catch (e) {}
  }

  function setXPState(state) {
    var effective = {
      total: Number(state.total) || 0,
      streak: Number(state.streak) || 0,
      bestStreak: Number(state.bestStreak) || 0,
      weekKey: state.weekKey || getWeekKey()
    };

    try { localStorage.setItem(LS_XP, JSON.stringify(effective)); } catch (e) {}
    syncTaskLeaderboard();
  }

  function verarbeiteXP(ok) {
    var state = getXPState();
    var reward = 0;
    var bonus = 0;

    if (ok) {
      var prevStreak = Number(state.streak) || 0;
      state.streak = prevStreak + 1;
      state.bestStreak = Math.max(Number(state.bestStreak) || 0, state.streak);

      bonus = Math.max(0, Math.floor(state.streak / 3) * 100);
      reward = 500 + bonus;
      state.total = (Number(state.total) || 0) + reward;
    } else {
      state.streak = 0;
      reward = -250;
      state.total = Math.max(0, (Number(state.total) || 0) + reward);
    }

    setXPState(state);
    return {
      delta: reward,
      bonus: bonus,
      streak: Number(state.streak) || 0,
      total: Number(state.total) || 0
    };
  }

  function levelStand(level) {
    var p = getProgress()[level.id];
    var arr = (p && Array.isArray(p.geloest)) ? p.geloest : [];
    return Math.min(arr.length, level.uebungen.length);
  }

  function istGeloest(level, index) {
    var p = getProgress()[level.id];
    if (!p || !Array.isArray(p.geloest)) return false;
    return p.geloest.indexOf(String(index)) !== -1;
  }

  function merkeGeloest(level, index) {
    var p = getProgress();
    var e = p[level.id];
    if (!e || typeof e !== 'object') e = { geloest: [] };
    if (!Array.isArray(e.geloest)) e.geloest = [];
    if (e.geloest.indexOf(String(index)) === -1) e.geloest.push(String(index));
    p[level.id] = e;
    setProgress(p);
  }

  function levelReset(level) {
    var p = getProgress();
    delete p[level.id];
    setProgress(p);
  }

  function sterne(wert, ziel) {
    if (ziel <= 0) return 0;
    var q = wert / ziel;
    if (q >= 1) return 3;
    if (q >= 0.85) return 2;
    if (q >= 0.7) return 1;
    return 0;
  }

  /* Alle Level flach, in Reihenfolge – fuer die automatische Stufe. */
  function alleLevel() {
    var out = [];
    data().forEach(function (st) {
      (st.levels || []).forEach(function (lv) { out.push({ stage: st, level: lv }); });
    });
    return out;
  }

  function stageIstFreigeschaltet(stageIndex) {
    /* ---------- Hier Stages freigeben! ---------- */
    // Beispiel: Stages 1 und 2 sofort freigeben
    // var manuellFreigeschaltet = { 1: true, 2: true };
    // if (Object.prototype.hasOwnProperty.call(manuellFreigeschaltet, String(stageIndex))) {
    //   return manuellFreigeschaltet[String(stageIndex)];
    // }

    var manuellFreigeschaltet = {
      1: false,
      2: false,
      3: false,
      4: false
    };

    if (Object.prototype.hasOwnProperty.call(manuellFreigeschaltet, String(stageIndex))) {
      return manuellFreigeschaltet[String(stageIndex)];
    }

    if (stageIndex <= 0) return true;
    var alle = data();
    var vorher = alle[stageIndex - 1];
    if (!vorher) return true;

    var ziel = 0;
    var wert = 0;
    (vorher.levels || []).forEach(function (lv) {
      ziel += lv.uebungen.length;
      wert += levelStand(lv);
    });

    return wert >= ziel;
  }

  function levelIstFreigeschaltet(stage, levelIndex) {
    if (levelIndex <= 0) return true;

    var levels = stage.levels || [];
    var vorher = levels[levelIndex - 1];
    if (!vorher) return true;

    var wert = levelStand(vorher);
    var ziel = vorher.uebungen.length;
    return sterne(wert, ziel) >= 1;
  }

  /* Schwierigkeit 1-4.
     Die Stage gibt den Grundton vor, innerhalb der Stage steigt es
     in der zweiten Haelfte um eine Stufe. So bleibt Stage 1 leicht,
     egal wie viele Level sie hat. */
  function stufeVon(level) {
    var alle = data();
    for (var s = 0; s < alle.length; s++) {
      var lv = alle[s].levels || [];
      for (var i = 0; i < lv.length; i++) {
        if (lv[i].id === level.id) {
          var anteil = lv.length < 2 ? 0 : i / (lv.length - 1);
          return Math.min(4, s + 1 + (anteil >= 0.5 ? 1 : 0));
        }
      }
    }
    return 1;
  }

  var STUFEN_NAME = {
    1: 'Einsteiger',
    2: 'Aufbau',
    3: 'Fortgeschritten',
    4: 'Profi'
  };

  /* Welche Formen sind auf welcher Stufe erlaubt?
     Von Stufe zu Stufe fallen leichte weg und harte kommen dazu. */
  var FORMEN = {
    1: ['wahl-ru', 'wahl-de', 'wahl-pron', 'paare', 'salat'],
    2: ['wahl-ru', 'wahl-de', 'paare', 'bau', 'luecke-wahl', 'salat'],
    3: ['wahl-de', 'bau', 'luecke-wahl', 'salat', 'luecke-tipp'],
    4: ['bau', 'luecke-tipp', 'tippen', 'tippen']
  };

  var FORM_LABEL = {
    'wahl-ru':     'Wie sagt man das auf Russisch?',
    'wahl-de':     'Was heißt das?',
    'wahl-pron':   'Welcher Satz klingt so?',
    'paare':       'Finde die Paare',
    'bau':         'Bau den russischen Satz',
    'luecke-wahl': 'Welches Wort fehlt?',
    'salat':       'Setz das Wort zusammen',
    'luecke-tipp': 'Tipp das fehlende Wort',
    'tippen':      'Schreib den Satz auf Russisch'
  };

  /* ---------------- Helfer ---------------- */

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function btn(cls, text, fn) {
    var b = el('button', cls, text);
    b.type = 'button';
    if (fn) b.addEventListener('click', fn);
    return b;
  }

  function mische(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function neu() { if (window.AzbukaTabs) window.AzbukaTabs.refresh(); }

  /* Zum Vergleich beim Tippen: Gross/klein und Satzzeichen egal. */
  function normalisiere(s) {
    return String(s || '')
      .toLowerCase()
      .replace(/ё/g, 'е')
      .replace(/[.,!?;:«»"'()\-–—]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function woerterVon(satz) {
    return String(satz || '').split(/\s+/).filter(Boolean);
  }

  function sterneReihe(n) {
    var w = el('div', 'az-stars');
    for (var i = 1; i <= 3; i++) {
      w.appendChild(el('span', 'az-star' + (i <= n ? ' az-on' : ''), '★'));
    }
    return w;
  }

  function fortschrittsBalken(wert, ziel) {
    var bar = el('div', 'az-progress-wrap');
    var fill = el('div', 'az-progress');
    fill.style.width = (ziel > 0 ? Math.round((wert / ziel) * 100) : 0) + '%';
    bar.appendChild(fill);
    return bar;
  }

  /* Alle Uebungen des aktuellen Kapitels – fuer Ablenker. */
  function nachbarn() {
    var out = [];
    (aktStage ? (aktStage.levels || []) : []).forEach(function (lv) {
      lv.uebungen.forEach(function (x) { out.push(x); });
    });
    if (out.length < 5) {
      data().forEach(function (st) {
        (st.levels || []).forEach(function (lv) {
          lv.uebungen.forEach(function (x) { out.push(x); });
        });
      });
    }
    return out;
  }

  /* Drei falsche Antworten zu einem Feld ziehen. */
  function ablenker(feld, richtig, anzahl) {
    var pool = [];
    nachbarn().forEach(function (x) {
      if (x[feld] && x[feld] !== richtig) pool.push(x[feld]);
    });
    var out = [];
    mische(pool).forEach(function (v) {
      if (out.length < anzahl && out.indexOf(v) === -1) out.push(v);
    });
    return out;
  }

  /* Passt eine Form zu dieser Uebung? Kurze Saetze taugen z.B.
     nicht zum Bauen, lange nicht zum Buchstabensalat. */
  function formPasst(form, u) {
    var w = woerterVon(u.ru);
    if (form === 'bau')         return w.length >= 3;
    if (form === 'luecke-wahl') return w.length >= 2;
    if (form === 'luecke-tipp') return w.length >= 2;
    if (form === 'salat')       return w.length === 1 && u.ru.replace(/[^\wа-яёА-ЯЁ]/g, '').length >= 3
                                       && u.ru.replace(/[^\wа-яёА-ЯЁ]/g, '').length <= 9;
    if (form === 'wahl-pron')   return !!u.pron;
    if (form === 'tippen')      return w.length <= 5;
    return true;
  }

  /* Naechste Form waehlen: passend zur Stufe, moeglichst nicht
     dieselbe wie eben, und passend zur Uebung. */
  function formFuer(u, stufe, zuletzt) {
    var kandidaten = (FORMEN[stufe] || FORMEN[1]).filter(function (f) {
      return formPasst(f, u);
    });
    if (!kandidaten.length) {
      /* Nichts passt? Dann die immer moegliche Wahlaufgabe. */
      return woerterVon(u.ru).length > 5 ? 'wahl-de' : 'wahl-ru';
    }
    var ohneWdh = kandidaten.filter(function (f) { return f !== zuletzt; });
    var liste = ohneWdh.length ? ohneWdh : kandidaten;
    return liste[Math.floor(Math.random() * liste.length)];
  }

  /* ---------------- Ansicht: Stages ---------------- */

  function renderStages(c) {
    var alle = data();

    var head = el('div', 'az-head');
    var t = el('div');
    t.appendChild(el('h1', null, 'Aufgaben'));

    var ges = 0, geloest = 0;
    alle.forEach(function (st) {
      (st.levels || []).forEach(function (lv) {
        ges += lv.uebungen.length;
        geloest += levelStand(lv);
      });
    });
    t.appendChild(el('p', null, geloest + ' von ' + ges + ' Übungen geschafft'));
    head.appendChild(t);
    c.appendChild(head);

    if (!alle.length) {
      var leer = el('div', 'az-empty');
      leer.appendChild(el('span', null, 'Noch keine Aufgaben angelegt.'));
      c.appendChild(leer);
      return;
    }

    var liste = el('div', 'az-tasks');

    alle.forEach(function (st, nr) {
      var lv = st.levels || [];
      var ziel = 0, wert = 0;
      lv.forEach(function (l) { ziel += l.uebungen.length; wert += levelStand(l); });

      var verfuegbar = stageIstFreigeschaltet(nr);
      var karte = el('div', 'az-card' + (verfuegbar ? ' az-klick' : ' az-coming-soon'));
      var row = el('div', 'az-task');

      var fertig = ziel > 0 && wert >= ziel;
      row.appendChild(el('div', 'az-task-icon' + (fertig ? ' az-done' : ''),
        fertig ? '✓' : String(nr + 1)));

      var body = el('div', 'az-task-body');
      var title = el('h3', 'az-task-title', st.titel);
      if (!verfuegbar) title.appendChild(el('span', 'az-coming-soon-pill', 'Gesperrt'));
      body.appendChild(title);
      if (st.text) body.appendChild(el('p', 'az-task-text', st.text));

      var meta = el('div', 'az-task-meta');
      meta.appendChild(sterneReihe(sterne(wert, ziel)));
      meta.appendChild(fortschrittsBalken(wert, ziel));
      meta.appendChild(el('div', 'az-task-count', wert + ' / ' + ziel));
      meta.appendChild(el('div', 'az-task-badge', lv.length + ' Level'));
      body.appendChild(meta);

      row.appendChild(body);
      row.appendChild(el('div', 'az-chevron', '›'));
      karte.appendChild(row);

      if (verfuegbar) {
        karte.addEventListener('click', function () {
          aktStage = st; sicht = 'levels'; neu();
        });
      }

      liste.appendChild(karte);
    });

    c.appendChild(liste);
  }

  /* ---------------- Ansicht: Level ---------------- */

  function renderLevels(c) {
    var st = aktStage;
    if (!st) { sicht = 'stages'; return renderStages(c); }

    var head = el('div', 'az-head az-head-back');
    head.appendChild(btn('az-back', '‹ Alle Kapitel', function () {
      sicht = 'stages'; aktStage = null; neu();
    }));
    var t = el('div');
    t.appendChild(el('h1', null, st.titel));
    if (st.text) t.appendChild(el('p', null, st.text));
    head.appendChild(t);
    c.appendChild(head);

    var liste = el('div', 'az-tasks');

    (st.levels || []).forEach(function (lv, nr) {
      var ziel = lv.uebungen.length;
      var wert = levelStand(lv);
      var fertig = wert >= ziel;
      var verfuegbar = levelIstFreigeschaltet(st, nr);
      var stufe = stufeVon(lv);

      var karte = el('div', 'az-card' + (verfuegbar ? ' az-klick' : ' az-coming-soon'));
      var row = el('div', 'az-task');

      row.appendChild(el('div', 'az-task-icon' + (fertig ? ' az-done' : ''),
        fertig ? '✓' : String(nr + 1)));

      var body = el('div', 'az-task-body');
      var title = el('h3', 'az-task-title', 'Level ' + (nr + 1) + ' · ' + lv.titel);
      if (!verfuegbar) title.appendChild(el('span', 'az-coming-soon-pill', 'Freischaltung durch Levelabschluss'));
      body.appendChild(title);
      body.appendChild(el('p', 'az-task-text', STUFEN_NAME[stufe]));

      var meta = el('div', 'az-task-meta');
      meta.appendChild(sterneReihe(sterne(wert, ziel)));
      meta.appendChild(fortschrittsBalken(wert, ziel));
      meta.appendChild(el('div', 'az-task-count', wert + ' / ' + ziel));
      for (var s = 0; s < stufe; s++) meta.appendChild(el('span', 'az-dot', '●'));
      body.appendChild(meta);

      row.appendChild(body);
      row.appendChild(el('div', 'az-chevron', '›'));
      karte.appendChild(row);

      if (verfuegbar) {
        karte.addEventListener('click', function () {
          starteLevel(lv);
        });
      }

      liste.appendChild(karte);
    });

    c.appendChild(liste);
  }

  /* ---------------- Uebungsrunde ---------------- */

  function starteLevel(level) {
    var offen = [];
    level.uebungen.forEach(function (u, i) {
      if (!istGeloest(level, i)) offen.push(i);
    });
    /* Alles geschafft? Dann alles noch mal, ohne Fortschritt zu loeschen. */
    if (!offen.length) level.uebungen.forEach(function (u, i) { offen.push(i); });

    aktLevel = level;
    runde = {
      reihenfolge: mische(offen),
      pos: 0,
      stufe: stufeVon(level),
      form: null,
      letzteForm: null,
      zustand: 'frage',   // frage | richtig | falsch
      auswahl: null,
      gebaut: [],
      vorrat: [],
      eingabe: ''
    };
    baueAufgabe();
    sicht = 'uebung';
    neu();
  }

  function aktuelleUebung() {
    if (!runde || !aktLevel) return null;
    var i = runde.reihenfolge[runde.pos];
    return aktLevel.uebungen[i];
  }

  /* Antwortmoeglichkeiten bzw. Bausteine vorbereiten. */
  function baueAufgabe() {
    var u = aktuelleUebung();
    if (!u) return;

    runde.zustand = 'frage';
    runde.auswahl = null;
    runde.gebaut = [];
    runde.vorrat = [];
    runde.eingabe = '';
    runde.optionen = [];
    runde.paare = null;
    runde.luecke = null;

    var f = formFuer(u, runde.stufe, runde.letzteForm);
    runde.form = f;

    if (f === 'wahl-ru' || f === 'wahl-pron') {
      runde.richtig = u.ru;
      runde.optionen = mische(ablenker('ru', u.ru, 3).concat([u.ru]));

    } else if (f === 'wahl-de') {
      runde.richtig = u.de;
      runde.optionen = mische(ablenker('de', u.de, 3).concat([u.de]));

    } else if (f === 'paare') {
      baueParre(u);

    } else if (f === 'bau') {
      runde.vorrat = mische(woerterVon(u.ru));
      runde.richtig = u.ru;

    } else if (f === 'luecke-wahl' || f === 'luecke-tipp') {
      baueLuecke(u, f);

    } else if (f === 'salat') {
      var buchstaben = u.ru.replace(/[^\wа-яёА-ЯЁ]/g, '').split('');
      runde.vorrat = mische(buchstaben);
      runde.richtig = u.ru;

    } else {
      runde.richtig = u.ru;
    }
  }

  /* Vier Paare: die aktuelle Uebung plus drei Nachbarn. */
  function baueParre(u) {
    var mit = [u];
    mische(nachbarn()).forEach(function (x) {
      if (mit.length < 4 && x.ru !== u.ru && !mit.some(function (m) { return m.ru === x.ru; })) {
        mit.push(x);
      }
    });
    /* Jedes Paar bekommt eine eigene Farbe, damit man nach dem
       Verbinden sieht, was zusammengehoert. */
    var farbe = {};
    mit.forEach(function (x, i) { farbe[x.ru] = i + 1; });

    runde.paare = {
      links:  mische(mit.map(function (x) { return { key: x.ru, text: x.ru }; })),
      rechts: mische(mit.map(function (x) { return { key: x.ru, text: x.de }; })),
      farbe: farbe,
      offenL: null,
      fertig: [],
      danebenL: null,
      danebenR: null,
      fehler: 0,
      ziel: mit.length
    };
  }

  /* Ein Wort aus dem Satz herausnehmen. */
  function baueLuecke(u, form) {
    var w = woerterVon(u.ru);
    /* Moeglichst nicht das erste Wort – die Luecke soll im Satz liegen. */
    var i = w.length > 2 ? 1 + Math.floor(Math.random() * (w.length - 1))
                         : Math.floor(Math.random() * w.length);
    var wort = w[i];
    var anzeige = w.slice();
    anzeige[i] = '_____';

    runde.luecke = { satz: anzeige.join(' '), wort: wort };
    runde.richtig = wort;

    if (form === 'luecke-wahl') {
      /* Falsche Woerter aus anderen Saetzen des Kapitels. */
      var pool = [];
      nachbarn().forEach(function (x) {
        woerterVon(x.ru).forEach(function (v) {
          if (normalisiere(v) !== normalisiere(wort)) pool.push(v);
        });
      });
      var falsch = [];
      mische(pool).forEach(function (v) {
        if (falsch.length < 3 && falsch.indexOf(v) === -1) falsch.push(v);
      });
      runde.optionen = mische(falsch.concat([wort]));
    }
  }

  function pruefe(wert) {
    var u = aktuelleUebung();
    if (!u || runde.zustand !== 'frage') return;

    var f = runde.form;
    var ok;

    if (f === 'bau') {
      ok = normalisiere(runde.gebaut.join(' ')) === normalisiere(u.ru);
    } else if (f === 'salat') {
      ok = normalisiere(runde.gebaut.join('')) === normalisiere(u.ru);
    } else if (f === 'tippen') {
      ok = normalisiere(wert) === normalisiere(u.ru);
    } else if (f === 'luecke-tipp') {
      ok = normalisiere(wert) === normalisiere(runde.luecke.wort);
    } else if (f === 'paare') {
      ok = runde.paare.fehler === 0;
    } else {
      ok = wert === runde.richtig;
      runde.auswahl = wert;
    }

    /* Eine Daystreak zählt erst, wenn wirklich eine Aufgabe
       beantwortet wurde – nicht schon beim Öffnen der App. */
    if (window.AzbukaProfiles) {
      if (typeof window.AzbukaProfiles.recordTaskActivity === 'function') {
        window.AzbukaProfiles.recordTaskActivity();
      } else if (typeof window.AzbukaProfiles.recordDailyActivity === 'function') {
        window.AzbukaProfiles.recordDailyActivity();
      }
    }

    runde.zustand = ok ? 'richtig' : 'falsch';
    var xpResult = verarbeiteXP(ok);
    if (ok) merkeGeloest(aktLevel, runde.reihenfolge[runde.pos]);
    if (window.AzbukaAufgaben) {
      window.AzbukaAufgaben.xpState = getXPState();
      window.AzbukaAufgaben.xpDelta = xpResult.delta;
      window.AzbukaAufgaben.xpBonus = xpResult.bonus;
      window.AzbukaAufgaben.streak = xpResult.streak;
    }
    neu();
  }

  function weiter() {
    if (!runde) return;
    runde.letzteForm = runde.form;
    if (runde.zustand === 'falsch') {
      /* Falsche kommt spaeter noch mal dran. */
      runde.reihenfolge.push(runde.reihenfolge[runde.pos]);
    }
    runde.pos++;
    if (runde.pos >= runde.reihenfolge.length) {
      sicht = 'levels'; runde = null; neu(); return;
    }
    baueAufgabe();
    neu();
  }

  /* ---------------- Eingabebereiche ---------------- */

  function bereichWahl(karte) {
    var opts = el('div', 'az-opts');
    runde.optionen.forEach(function (o) {
      var cls = 'az-opt';
      if (runde.zustand !== 'frage') {
        if (o === runde.richtig) cls += ' az-opt-ok';
        else if (o === runde.auswahl) cls += ' az-opt-bad';
        else cls += ' az-opt-aus';
      }
      opts.appendChild(btn(cls, o, function () { pruefe(o); }));
    });
    karte.appendChild(opts);
  }

  /* Bausteine: Woerter (bau) oder Buchstaben (salat). */
  function bereichBau(karte, trenner, hinweis) {
    var zeile = el('div', 'az-bau' + (trenner === '' ? ' az-bau-eng' : ''));
    if (!runde.gebaut.length) {
      zeile.appendChild(el('span', 'az-bau-leer', hinweis));
    }
    runde.gebaut.forEach(function (w, i) {
      zeile.appendChild(btn('az-wort az-wort-an', w, function () {
        if (runde.zustand !== 'frage') return;
        runde.gebaut.splice(i, 1);
        runde.vorrat.push(w);
        neu();
      }));
    });
    karte.appendChild(zeile);

    var vorrat = el('div', 'az-vorrat');
    runde.vorrat.forEach(function (w, i) {
      vorrat.appendChild(btn('az-wort', w, function () {
        if (runde.zustand !== 'frage') return;
        runde.vorrat.splice(i, 1);
        runde.gebaut.push(w);
        neu();
      }));
    });
    karte.appendChild(vorrat);

    if (runde.zustand === 'frage') {
      var pb = btn('az-btn az-btn-main', 'PRÜFEN', function () { pruefe(); });
      if (!runde.gebaut.length) pb.disabled = true;
      karte.appendChild(pb);
    }
  }

  function bereichTippen(karte, platzhalter) {
    var wrap = el('div', 'az-tippen');
    var inp = el('input', 'az-input');
    inp.type = 'text';
    inp.placeholder = platzhalter;
    inp.autocomplete = 'off';
    inp.spellcheck = false;
    if (runde.zustand !== 'frage') {
      inp.value = runde.eingabe || '';
      inp.disabled = true;
    }
    inp.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter') { runde.eingabe = inp.value; pruefe(inp.value); }
    });
    wrap.appendChild(inp);
    karte.appendChild(wrap);

    if (runde.zustand === 'frage') {
      karte.appendChild(btn('az-btn az-btn-main', 'PRÜFEN', function () {
        runde.eingabe = inp.value;
        pruefe(inp.value);
      }));
      setTimeout(function () { try { inp.focus(); } catch (e) {} }, 30);
    }
  }

  /* Zwei Spalten, die man zusammenklickt. */
  function bereichPaare(karte) {
    var p = runde.paare;
    var wrap = el('div', 'az-paare');

    function spalte(items, seite) {
      var col = el('div', 'az-paar-col');
      items.forEach(function (it) {
        var fertig = p.fertig.indexOf(it.key) !== -1;
        var cls = 'az-paar';
        if (fertig) cls += ' az-paar-ok az-paar-f' + (p.farbe[it.key] || 1);
        if (seite === 'l' && p.offenL === it.key && !fertig) cls += ' az-paar-an';
        if (seite === 'l' && p.danebenL === it.key) cls += ' az-paar-bad';
        if (seite === 'r' && p.danebenR === it.key) cls += ' az-paar-bad';

        var b = btn(cls, it.text, function () {
          if (runde.zustand !== 'frage' || fertig) return;
          p.danebenL = null;
          p.danebenR = null;
          if (seite === 'l') {
            p.offenL = (p.offenL === it.key) ? null : it.key;
            neu();
            return;
          }
          if (!p.offenL) return;
          if (p.offenL === it.key) {
            p.fertig.push(it.key);
            p.offenL = null;
            if (p.fertig.length >= p.ziel) { pruefe(); return; }
          } else {
            p.fehler++;
            p.danebenL = p.offenL;
            p.danebenR = it.key;
            p.offenL = null;
            /* Rot nur kurz zeigen, danach zurueck auf neutral. */
            setTimeout(function () {
              if (!runde || runde.paare !== p) return;
              p.danebenL = null;
              p.danebenR = null;
              neu();
            }, 700);
          }
          neu();
        });
        col.appendChild(b);
      });
      return col;
    }

    wrap.appendChild(spalte(p.links, 'l'));
    wrap.appendChild(spalte(p.rechts, 'r'));
    karte.appendChild(wrap);

    if (runde.zustand === 'frage') {
      karte.appendChild(el('div', 'az-paar-info',
        p.fertig.length + ' / ' + p.ziel + ' verbunden' +
        (p.fehler ? '  ·  ' + p.fehler + ' daneben' : '')));
    }
  }

  /* ---------------- Ansicht: Uebung ---------------- */

  function renderUebung(c) {
    var u = aktuelleUebung();
    if (!u) { sicht = 'levels'; return renderLevels(c); }

    var ziel = aktLevel.uebungen.length;
    var wert = levelStand(aktLevel);
    var f = runde.form;

    var head = el('div', 'az-head az-head-back');
    head.appendChild(btn('az-back', '‹ ' + aktStage.titel, function () {
      sicht = 'levels'; runde = null; neu();
    }));
    var t = el('div');
    t.appendChild(el('h1', null, aktLevel.titel));
    t.appendChild(el('p', null,
      STUFEN_NAME[runde.stufe] + ' • ' + wert + ' / ' + ziel + ' geschafft'));
    head.appendChild(t);
    c.appendChild(head);

    c.appendChild(fortschrittsBalken(wert, ziel));

    var karte = el('div', 'az-card az-uebung');

    /* --- Frage --- */
    karte.appendChild(el('div', 'az-frage-label', FORM_LABEL[f] || ''));

    if (f === 'wahl-de') {
      karte.appendChild(el('div', 'az-frage', u.ru));
    } else if (f === 'wahl-pron') {
      karte.appendChild(el('div', 'az-frage az-frage-pron', u.pron));
    } else if (f === 'paare') {
      karte.appendChild(el('div', 'az-frage az-frage-klein',
        'Tippe links einen russischen Satz an, dann rechts die Übersetzung.'));
    } else if (f === 'luecke-wahl' || f === 'luecke-tipp') {
      karte.appendChild(el('div', 'az-frage', runde.luecke.satz));
      karte.appendChild(el('div', 'az-frage-sub', u.de));
    } else {
      karte.appendChild(el('div', 'az-frage', u.de));
    }

    /* --- Eingabebereich --- */
    if (f === 'wahl-ru' || f === 'wahl-de' || f === 'wahl-pron' || f === 'luecke-wahl') {
      bereichWahl(karte);
    } else if (f === 'paare') {
      bereichPaare(karte);
    } else if (f === 'bau') {
      bereichBau(karte, ' ', 'Tippe die Wörter der Reihe nach an');
    } else if (f === 'salat') {
      bereichBau(karte, '', 'Tippe die Buchstaben der Reihe nach an');
    } else if (f === 'luecke-tipp') {
      bereichTippen(karte, 'Fehlendes Wort …');
    } else {
      bereichTippen(karte, 'Auf Russisch schreiben …');
    }

    /* --- Auswertung --- */
    if (runde.zustand !== 'frage') {
      var ok = runde.zustand === 'richtig';
      var box = el('div', 'az-loesung ' + (ok ? 'az-loesung-ok' : 'az-loesung-bad'));
      box.style.boxShadow = ok
        ? '0 0 0 1px rgba(var(--theme-primary-rgb,212,255,0),0.35), 0 18px 45px rgba(var(--theme-primary-rgb,212,255,0),0.18)'
        : '0 0 0 1px rgba(255,107,157,0.2), 0 18px 45px rgba(255,107,157,0.12)';
      box.style.transformOrigin = 'center bottom';
      if (typeof box.animate === 'function') {
        box.animate([
          { transform: 'scale(0.96)', opacity: 0.7 },
          { transform: 'scale(1.04)', opacity: 1 },
          { transform: 'scale(1)', opacity: 1 }
        ], { duration: 420, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' });
      }

      var xpState = getXPState();
      var xpDelta = ok ? (window.AzbukaAufgaben && typeof window.AzbukaAufgaben.xpDelta === 'number' ? window.AzbukaAufgaben.xpDelta : 500) : -250;
      var xpBonus = ok ? (window.AzbukaAufgaben && typeof window.AzbukaAufgaben.xpBonus === 'number' ? window.AzbukaAufgaben.xpBonus : 0) : 0;
      var streak = ok ? (window.AzbukaAufgaben && typeof window.AzbukaAufgaben.streak === 'number' ? window.AzbukaAufgaben.streak : (xpState.streak || 1)) : 0;

      box.appendChild(el('div', 'az-loesung-kopf', ok ? '✓ Richtig!' : '✕ Noch nicht'));
      
      // Hilfs-Funktion für zufällige Popup-Positionen
      function getRandomPopupPos() {
        var pos;
        var padding = 120;
        var attempts = 0;
        do {
          pos = {
            x: Math.random() * (window.innerWidth - padding * 2) + padding,
            y: Math.random() * (window.innerHeight - padding * 2) + padding
          };
          attempts++;
        } while (attempts < 5 && popupPositions.some(function(p) {
          return Math.abs(p.x - pos.x) < 250 && Math.abs(p.y - pos.y) < 250;
        }));
        popupPositions.push(pos);
        setTimeout(function() {
          popupPositions = popupPositions.filter(function(p) { return p !== pos; });
        }, 1500);
        return pos;
      }
      
      // XP-Popup mit zufälliger Position
      function showXpPopup(amount, color, label) {
        var pos = getRandomPopupPos();
        var xpPopup = el('div');
        xpPopup.style.cssText = 'position:fixed; left:' + pos.x + 'px; top:' + pos.y + 'px; transform:translate(-50%, -50%); z-index:9999; text-align:center; pointer-events:none;';
        var xpText = el('div');
        xpText.style.cssText = 'font-size:68px; font-weight:900; margin-bottom:6px; text-shadow:0 6px 20px rgba(0,0,0,0.4); letter-spacing:-2px;';
        xpText.textContent = (amount > 0 ? '+' : '') + amount;
        xpText.style.color = color;
        var xpLabel = el('div');
        xpLabel.style.cssText = 'font-size:18px; font-weight:900; letter-spacing:2px;';
        xpLabel.textContent = label;
        xpLabel.style.color = color;
        xpPopup.appendChild(xpText);
        xpPopup.appendChild(xpLabel);
        document.body.appendChild(xpPopup);
        
        if (typeof xpPopup.animate === 'function') {
          xpPopup.animate([
            { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 },
            { transform: 'translate(-50%, -50%) scale(1.3)', opacity: 1 },
            { transform: 'translate(-50%, -50%) scale(1.1)', opacity: 0.8 },
            { transform: 'translate(-50%, -50%) scale(0.9)', opacity: 0.6 },
            { transform: 'translate(-50%, -50%) scale(0.5)', opacity: 0 }
          ], { duration: 1500, easing: 'cubic-bezier(0.6, 0.2, 0.2, 1)' });
        }
        setTimeout(function() { xpPopup.remove(); }, 1500);
      }
      
      // Popups für Base XP, Bonus und Penalty unabhängig
      if (!ok) {
        showXpPopup(-250, '#ff6b9d', 'XP');
      } else {
        showXpPopup(xpDelta, 'var(--theme-primary, #d4ff00)', 'XP');
        if (xpBonus > 0) {
          setTimeout(function() {
            showXpPopup(xpBonus, 'var(--theme-accent, #7aff8a)', '🔥 BONUS');
          }, 300);
        }
      }

      box.appendChild(el('div', 'az-loesung-ru', u.ru));
      if (u.pron) box.appendChild(el('div', 'az-loesung-pron', u.pron));
      box.appendChild(el('div', 'az-loesung-de', u.de));
      if (!ok) box.appendChild(el('div', 'az-loesung-hint', 'Kommt gleich noch mal.'));
      karte.appendChild(box);

      karte.appendChild(btn('az-btn az-btn-main', 'WEITER →', weiter));
    }

    c.appendChild(karte);

    var fuss = el('div', 'az-task-btns');
    fuss.appendChild(btn('az-btn az-btn-ghost', '↻ Level zurücksetzen', function () {
      levelReset(aktLevel);
      sicht = 'levels'; runde = null; neu();
    }));
    c.appendChild(fuss);
  }

  /* ---------------- Einstieg ---------------- */

  function render(container) {
    if (sicht === 'uebung') return renderUebung(container);
    if (sicht === 'levels') return renderLevels(container);
    var result = renderStages(container);
    
    // Apply theme colors to quiz elements
    setTimeout(function () {
      if (window.AzbukaThemeSystem && window.AzbukaThemeSystem.applyAppThemeVisuals) {
        var theme = window.AzbukaThemeSystem.getActiveTheme();
        var skin = window.AzbukaThemeSystem.getActiveSkin();
        window.AzbukaThemeSystem.applyAppThemeVisuals(theme, skin);
      }
    }, 50);
    
    return result;
  }

  /* ---------------- Oeffentliche API ---------------- */

  window.AzbukaAufgaben = {
    /* Fortschritt eines Levels, z.B. fuer andere Module. */
    levelStand: levelStand,
    sterne: sterne,
    getXPState: getXPState,
    setXPState: setXPState,
    verarbeiteXP: verarbeiteXP,
    xpState: getXPState(),
    xpDelta: 0,
    xpBonus: 0,
    streak: 0
  };

  /* ---------------- Anmelden ---------------- */

  function register() {
    if (!window.AzbukaTabs) return false;
    window.AzbukaTabs.register({ id: 'aufgaben', label: 'Aufgaben', render: render });
    return true;
  }

  if (!register()) {
    var t = setInterval(function () { if (register()) clearInterval(t); }, 100);
    setTimeout(function () { clearInterval(t); }, 20000);
  }
})();
