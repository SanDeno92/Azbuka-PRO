/* ============================================================
   Azbuka PRO – Spiele Tab (Wortsuche) als Haupt-Tab unten
   - Fügt 🎮 Spiele in die Bottom-Nav ein (wie Lernen, Quiz etc.)
   - Eigenes Vollbild-View #spieleView
   - Nutzt nur ru: aus window.AZBUKA_VOKABELN
   - Zeigt nach Fund die Übersetzung in der Pille
   ============================================================ */
(function () {
  'use strict';
  console.log('[Spiele] spiele.js geladen');

  var STORAGE_LEVEL = 'azbuka_wortsuche_level';
  var STORAGE_DIFF = 'azbuka_wortsuche_diff';

  var CONFIG = {
    leicht: { size: 8, count: 5, dirs: ['H','V'], label: 'Leicht' },
    mittel: { size: 10, count: 7, dirs: ['H','V','D','D2'], label: 'Mittel' },
    schwer: { size: 12, count: 9, dirs: ['H','V','D','D2','HR','VR'], label: 'Schwer' },
    extrem: { size: 15, count: 12, dirs: ['H','V','D','D2','HR','VR','DR','DR2'], label: 'Extrem' }
  };

  var DIRS = {
    'H': [0, 1], 'HR': [0, -1], 'V': [1, 0], 'VR': [-1, 0],
    'D': [1, 1], 'D2': [1, -1], 'DR': [-1, -1], 'DR2': [-1, 1]
  };

  var CYR = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'.split('');

  var state = {
    level: 1, diff: 'auto', grid: [], placed: [], found: new Set(),
    selecting: [], timer: 0, timerId: null, vocabMap: {}
  };

  function loadPersisted() {
    try {
      var l = parseInt(localStorage.getItem(STORAGE_LEVEL) || '1', 10);
      if (l >= 1) state.level = l;
      var d = localStorage.getItem(STORAGE_DIFF);
      if (d && (d === 'auto' || CONFIG[d])) state.diff = d;
    } catch (e) {}
  }
  function saveLevel() { try { localStorage.setItem(STORAGE_LEVEL, String(state.level)); } catch (e) {} }
  function saveDiff() { try { localStorage.setItem(STORAGE_DIFF, state.diff); } catch (e) {} }

  function getVocabEntries() {
    var raw = window.AZBUKA_VOKABELN || [];
    if (!Array.isArray(raw) || raw.length === 0) return [];
    var map = {}, list = [];
    raw.forEach(function (entry) {
      if (!entry || !entry.ru) return;
      var ru = String(entry.ru).trim().toLowerCase();
      if (!ru || ru.indexOf(' ') !== -1) return;
      if (ru.length < 2 || ru.length > 12) return;
      if (!/^[а-яё]+$/i.test(ru)) return;
      if (map[ru]) return;
      var de = entry.de ? String(entry.de).trim() : '—';
      map[ru] = { de: de, pron: entry.pron || '', kategorie: entry.kategorie || '' };
      list.push(ru);
    });
    state.vocabMap = map;
    return list;
  }

  function getCurrentConfig() {
    if (state.diff !== 'auto') return CONFIG[state.diff];
    if (state.level <= 2) return CONFIG.leicht;
    if (state.level <= 5) return CONFIG.mittel;
    if (state.level <= 8) return CONFIG.schwer;
    return CONFIG.extrem;
  }

  function generateGrid(words, size, allowedDirKeys) {
    var grid = Array.from({ length: size }, function () { return Array(size).fill(null); });
    var placed = [];
    var dirs = allowedDirKeys.map(function (k) { return { key: k, vec: DIRS[k] }; }).filter(function (d) { return d.vec; });
    var sorted = words.slice().sort(function (a, b) { return b.length - a.length; });
    sorted.forEach(function (word) {
      for (var attempt = 0; attempt < 120; attempt++) {
        var dirObj = dirs[Math.floor(Math.random() * dirs.length)];
        if (!dirObj) continue;
        var dr = dirObj.vec[0], dc = dirObj.vec[1];
        var minR = 0, maxR = size - 1, minC = 0, maxC = size - 1;
        if (dr === 1) maxR = size - word.length;
        if (dr === -1) minR = word.length - 1;
        if (dc === 1) maxC = size - word.length;
        if (dc === -1) minC = word.length - 1;
        if (minR > maxR || minC > maxC) continue;
        var r = minR + Math.floor(Math.random() * (maxR - minR + 1));
        var c = minC + Math.floor(Math.random() * (maxC - minC + 1));
        var can = true;
        for (var i = 0; i < word.length; i++) {
          var rr = r + dr * i, cc = c + dc * i;
          if (grid[rr][cc] !== null && grid[rr][cc] !== word[i]) { can = false; break; }
        }
        if (!can) continue;
        for (var j = 0; j < word.length; j++) {
          var r2 = r + dr * j, c2 = c + dc * j;
          grid[r2][c2] = word[j];
        }
        placed.push({ word: word, dirKey: dirObj.key });
        break;
      }
    });
    for (var r = 0; r < size; r++) for (var c = 0; c < size; c++) if (grid[r][c] === null) grid[r][c] = CYR[Math.floor(Math.random() * CYR.length)];
    return { grid: grid, placed: placed };
  }

  function renderGame(container) {
    if (!container) return;
    if (state.timerId) { clearInterval(state.timerId); state.timerId = null; }
    var vocabList = getVocabEntries();
    if (vocabList.length < 5) {
      container.innerHTML = '<div class="az-empty"><span>Zu wenig Vokabeln - brauche 5 ru: Wörter</span></div>';
      return;
    }
    var cfg = getCurrentConfig();
    var actualDiffLabel = state.diff === 'auto' ? 'AUTO LVL ' + state.level : CONFIG[state.diff].label.toUpperCase();
    var shuffled = vocabList.slice().sort(function () { return Math.random() - 0.5; }).filter(function (w) { return w.length <= cfg.size; });
    var chosen = shuffled.slice(0, cfg.count);
    var gen = generateGrid(chosen, cfg.size, cfg.dirs);
    state.grid = gen.grid;
    state.placed = gen.placed;
    state.found = new Set();
    state.selecting = [];
    state.timer = 0;

    var html = ''
      + '<div class="ws-wrap">'
      + '<div class="ws-top"><div class="ws-top-left"><div class="ws-h1">WORTSUCHE <span class="ws-lvl">LVL ' + state.level + '</span></div><div class="ws-sub">' + gen.placed.length + ' Wörter • Nur ru: aus deinen Vokabeln</div></div>'
      + '<div class="ws-top-right"><div class="ws-pill ws-pill-timer" id="wsTimer">00:00</div><div class="ws-pill ws-pill-count"><span id="wsFound">0</span> / ' + gen.placed.length + '</div><div class="ws-pill ws-pill-diff">' + actualDiffLabel + '</div></div></div>'
      + '<div class="ws-controls"><div class="ws-diffbar">'
      + ['auto', 'leicht', 'mittel', 'schwer', 'extrem'].map(function (d) {
        var label = d === 'auto' ? 'Auto' : CONFIG[d].label;
        var active = state.diff === d ? ' ws-db-active' : '';
        return '<button class="ws-db' + active + '" data-diff="' + d + '">' + label + '</button>';
      }).join('')
      + '</div><button class="ws-new" id="wsNewBtn">Neues Gitter</button></div>'
      + '<div class="ws-main"><div class="ws-grid" id="wsGrid" style="--ws-size:' + cfg.size + '">'
      + gen.grid.map(function (row, r) { return row.map(function (ch, c) { return '<div class="ws-cell" data-r="' + r + '" data-c="' + c + '">' + ch + '</div>'; }).join(''); }).join('')
      + '</div><div class="ws-side"><div class="ws-side-title">Finde:</div><div class="ws-wordlist">'
      + gen.placed.map(function (p) { return '<div class="ws-w" data-w="' + p.word + '"><span class="ws-w-ru">' + p.word + '</span><span class="ws-w-de"></span></div>'; }).join('')
      + '</div><div class="ws-progress"><div class="ws-progress-fill" id="wsProgress"></div></div><div class="ws-hint">Ziehe mit Maus/Finger über Buchstaben</div></div></div></div>';

    container.innerHTML = html;
    bindEvents(container);
    startTimer(container);
  }

  function bindEvents(root) {
    var gridEl = root.querySelector('#wsGrid');
    if (!gridEl) return;
    var isDown = false, startCell = null;
    function cellAt(x, y) { var el = document.elementFromPoint(x, y); return el ? el.closest('.ws-cell') : null; }
    function lineBetween(a, b) {
      if (!a || !b) return [a].filter(Boolean);
      var r1 = parseInt(a.dataset.r, 10), c1 = parseInt(a.dataset.c, 10);
      var r2 = parseInt(b.dataset.r, 10), c2 = parseInt(b.dataset.c, 10);
      var dr = Math.sign(r2 - r1), dc = Math.sign(c2 - c1);
      var dR = Math.abs(r2 - r1), dC = Math.abs(c2 - c1);
      if (!(r1 === r2 || c1 === c2 || dR === dC)) return [a];
      var len = Math.max(dR, dC), cells = [];
      for (var i = 0; i <= len; i++) {
        var rr = r1 + dr * i, cc = c1 + dc * i;
        var cel = gridEl.querySelector('.ws-cell[data-r="' + rr + '"][data-c="' + cc + '"]');
        if (cel) cells.push(cel);
      }
      return cells;
    }
    function clearSelecting() { gridEl.querySelectorAll('.ws-cell.ws-sel').forEach(function (c) { c.classList.remove('ws-sel'); }); }
    gridEl.addEventListener('pointerdown', function (e) {
      var cell = e.target.closest('.ws-cell'); if (!cell) return;
      isDown = true; startCell = cell; gridEl.setPointerCapture(e.pointerId);
      clearSelecting(); state.selecting = [cell]; cell.classList.add('ws-sel'); e.preventDefault();
    });
    gridEl.addEventListener('pointermove', function (e) {
      if (!isDown || !startCell) return;
      var over = cellAt(e.clientX, e.clientY); if (!over) return;
      var line = lineBetween(startCell, over); clearSelecting();
      line.forEach(function (c) { c.classList.add('ws-sel'); }); state.selecting = line;
    });
    function onPointerUp() {
      if (!isDown) return; isDown = false;
      var word = state.selecting.map(function (c) { return c.textContent; }).join('');
      var rev = word.split('').reverse().join('');
      var match = null;
      state.placed.forEach(function (p) { if (!state.found.has(p.word) && (p.word === word || p.word === rev)) match = p; });
      if (match) {
        state.selecting.forEach(function (c) { c.classList.remove('ws-sel'); c.classList.add('ws-found'); });
        state.found.add(match.word);
        var row = root.querySelector('.ws-w[data-w="' + match.word + '"]');
        if (row) {
          row.classList.add('ws-w-done');
          var deEl = row.querySelector('.ws-w-de');
          var info = state.vocabMap[match.word];
          if (deEl && info) { deEl.textContent = info.de; deEl.title = (info.pron ? info.pron + ' • ' : '') + (info.kategorie || ''); }
        }
        var foundEl = root.querySelector('#wsFound'); if (foundEl) foundEl.textContent = String(state.found.size);
        var prog = root.querySelector('#wsProgress'); if (prog) prog.style.width = (state.found.size / state.placed.length * 100) + '%';
        if (state.found.size === state.placed.length) {
          setTimeout(function () { state.level++; saveLevel(); renderGame(root); }, 800);
        }
      } else {
        state.selecting.forEach(function (c) { c.classList.add('ws-bad'); });
        setTimeout(function () { state.selecting.forEach(function (c) { c.classList.remove('ws-bad', 'ws-sel'); }); }, 250);
      }
      state.selecting = []; startCell = null;
    }
    gridEl.addEventListener('pointerup', onPointerUp);
    gridEl.addEventListener('pointercancel', function () { isDown = false; clearSelecting(); });
    root.querySelectorAll('.ws-db').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.diff = btn.dataset.diff; saveDiff();
        if (state.diff !== 'auto') { state.level = 1; saveLevel(); }
        renderGame(root);
      });
    });
    var newBtn = root.querySelector('#wsNewBtn'); if (newBtn) newBtn.addEventListener('click', function () { renderGame(root); });
  }

  function startTimer(root) {
    if (state.timerId) clearInterval(state.timerId);
    state.timer = 0;
    var el = root.querySelector('#wsTimer');
    state.timerId = setInterval(function () {
      state.timer++;
      if (!el) el = root.querySelector('#wsTimer');
      if (!el) return;
      var m = String(Math.floor(state.timer / 60)).padStart(2, '0');
      var s = String(state.timer % 60).padStart(2, '0');
      el.textContent = m + ':' + s;
    }, 1000);
  }

  // === BOTTOM NAV INJECTION ===
  function findBottomNav() {
    // Versuche verschiedene Selektoren
    var candidates = [
      document.querySelector('nav'),
      document.querySelector('.mobile-nav'),
      document.querySelector('.bottom-nav'),
      document.querySelector('[class*="bottom-nav"]'),
      document.querySelector('footer nav'),
      document.querySelector('footer')
    ];
    for (var i = 0; i < candidates.length; i++) if (candidates[i]) return candidates[i];

    // Fallback: finde Parent von Lernen Button
    var allBtns = document.querySelectorAll('button');
    for (var j = 0; j < allBtns.length; j++) {
      var t = allBtns[j].textContent.trim();
      if (t === 'Lernen' || t.toLowerCase().indexOf('lernen') !== -1) {
        // Bottom nav hat 5 Buttons nebeneinander
        var parent = allBtns[j].parentElement;
        // Gehe hoch bis wir 4-6 Buttons finden
        while (parent && parent !== document.body) {
          if (parent.querySelectorAll('button').length >= 4) return parent;
          parent = parent.parentElement;
        }
        return allBtns[j].parentElement;
      }
    }
    return null;
  }

  function createSpieleView() {
    var view = document.getElementById('spieleView');
    if (view) return view;
    view = document.createElement('div');
    view.id = 'spieleView';
    view.style.display = 'none';
    view.style.minHeight = '100vh';
    view.style.padding = '16px';
    view.style.paddingBottom = '100px';
    view.style.background = 'var(--theme-bg, #0A1E0A)';
    var main = document.querySelector('main') || document.querySelector('#root') || document.body;
    main.appendChild(view);
    return view;
  }

  function injectBottomNav() {
    var nav = findBottomNav();
    if (!nav) {
      //console.log('[Spiele] Bottom Nav nicht gefunden, retry...');
      return false;
    }
    if (document.getElementById('spieleTabBtn')) {
      //console.log('[Spiele] Button schon da');
      return true;
    }

    console.log('[Spiele] Bottom Nav gefunden:', nav);
    var spieleView = createSpieleView();

    // Erstelle Button im gleichen Style wie bestehende
    var existingBtn = nav.querySelector('button');
    var btn = document.createElement('button');
    btn.id = 'spieleTabBtn';
    btn.type = 'button';
    btn.setAttribute('data-view', 'spiele');

    // Kopiere Klassen vom bestehenden Button für gleiches Design
    if (existingBtn) {
      btn.className = existingBtn.className;
    }

    // Inhalt: Controller Emoji + Spiele Text - passend zum Screenshot Style
    // Versuche das gleiche HTML Pattern wie die anderen Buttons zu nutzen
    // Screenshot zeigt: Icon oben, Text unten
    btn.innerHTML = '<span style="font-size:18px; line-height:1;">🎮</span><span>Spiele</span>';

    // Falls bestehende Buttons Struktur mit 2 spans haben, behalten wir das
    // Style fix für 6 Items
    btn.style.flex = '1';

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('[Spiele] Klick auf Spiele');

      // Alle Haupt-Views verstecken
      var viewsToHide = document.querySelectorAll('#learnView, #quizView, #shopView, #leaderboardView, #profilView, #regelnView, #alphabetView');
      viewsToHide.forEach(function (v) { v.style.display = 'none'; });

      // Azbuka Tabs Panel auch verstecken
      document.querySelectorAll('.az-tabs-host, .az-tabs-panel').forEach(function (p) {
        // Wenn wir in Spiele sind, verstecke Lernen sub-tabs host
        if (p.id !== 'spieleView') {
          // Wir lassen host da aber panel verstecken? Besser: learnView war schon hidden
        }
      });

      // Spiele View zeigen
      spieleView.style.display = 'block';

      // Active State in Bottom Nav
      nav.querySelectorAll('button').forEach(function (b) {
        b.classList.remove('active', 'az-active', 'text-[#D4FF00]', 'bg-[#D4FF00]');
        // Versuche generische active Entfernung
        b.style.color = '';
      });
      btn.classList.add('active');
      btn.style.color = 'var(--theme-primary, #D4FF00)';

      // Render Game
      renderGame(spieleView);

      // Verhindere dass mobile-nav.js danach wieder umschaltet
      setTimeout(function () {
        spieleView.style.display = 'block';
      }, 50);
    });

    // Füge Button hinzu - am besten vor Profil oder am Ende
    // Finde Profil Button und füge davor ein
    var profilBtn = null;
    var all = nav.querySelectorAll('button');
    all.forEach(function (b) {
      if (b.textContent.toLowerCase().indexOf('profil') !== -1) profilBtn = b;
    });

    if (profilBtn && profilBtn.parentElement === nav) {
      nav.insertBefore(btn, profilBtn);
    } else {
      nav.appendChild(btn);
    }

    // Fix: Wenn 6 Buttons, etwas kleiner machen
    var allBtnsNow = nav.querySelectorAll('button');
    if (allBtnsNow.length >= 6) {
      nav.style.display = 'flex';
      nav.style.justifyContent = 'space-around';
      allBtnsNow.forEach(function (b) {
        b.style.fontSize = '10px';
        b.style.flex = '1';
        b.style.minWidth = '0';
      });
    }

    console.log('[Spiele] Button injiziert!');
    return true;
  }

  function init() {
    loadPersisted();

    // Bottom Nav Injection - mehrmals versuchen weil React async rendert
    var tries = 0;
    var iv = setInterval(function () {
      tries++;
      var ok = injectBottomNav();
      if (ok || tries > 100) {
        if (ok) console.log('[Spiele] Injection erfolgreich nach ' + tries + ' Versuchen');
        clearInterval(iv);
      }
    }, 300);

    // Auch bei Klicks auf Header nochmal versuchen (falls Nav neu gerendert wird)
    document.addEventListener('click', function () {
      setTimeout(function () {
        if (!document.getElementById('spieleTabBtn')) injectBottomNav();
      }, 200);
    }, true);
  }

  window.renderSpiele = renderGame;
  window.testSpiele = function () {
    var v = createSpieleView();
    v.style.display = 'block';
    document.querySelectorAll('#learnView, #quizView, #shopView').forEach(function (x) { x.style.display = 'none'; });
    renderGame(v);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
