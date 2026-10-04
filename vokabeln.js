/* ============================================================
   Azbuka PRO – Reiter "Vokabeln"
   ------------------------------------------------------------
   Zeichnet die Vokabelkarten. Die Inhalte stehen in
   vokabeln-data.js – DIESE Datei musst du zum Erweitern
   normalerweise nicht anfassen.

   Nutzt die bestehenden Klassen .alphabet-card / .card-inner /
   .card-front / .card-back aus dem Bundle, damit Flip-Animation
   und Look identisch zum Alphabet sind.
   ============================================================ */
(function () {
  'use strict';

  var LS_FILTER = 'azbuka_voc_filter';
  var LS_SEEN   = 'azbuka_voc_seen';

  var filter = 'alle';
  var CATEGORY_GROUPS = {
    'Grundwörter': 'Grundlagen',
    'Pronomen': 'Grundlagen',
    'Begrüßung': 'Kommunikation',
    'Vorstellen': 'Kommunikation',
    'Verständigung': 'Kommunikation',
    'Menschen': 'Alltag',
    'Wohnen': 'Alltag',
    'Essen': 'Essen & Trinken',
    'Restaurant': 'Essen & Trinken'
  };
  var CATEGORY_ORDER = [
    'Grundlagen',
    'Kommunikation',
    'Alltag',
    'Essen & Trinken',
    'Unterwegs',
    'Verben',
    'Zeit'
  ];

  /* ---------------- Helfer ---------------- */

  function data() {
    return Array.isArray(window.AZBUKA_VOKABELN) ? window.AZBUKA_VOKABELN : [];
  }

  function categoryOf(v) {
    var original = v.kategorie || 'Allgemein';
    return CATEGORY_GROUPS[original] || original;
  }

  function kategorien() {
    var out = [];
    data().forEach(function (v) {
      var category = categoryOf(v);
      if (out.indexOf(category) === -1) out.push(category);
    });
    return out.sort(function (a, b) {
      var ai = CATEGORY_ORDER.indexOf(a);
      var bi = CATEGORY_ORDER.indexOf(b);
      if (ai === -1) ai = CATEGORY_ORDER.length;
      if (bi === -1) bi = CATEGORY_ORDER.length;
      return ai - bi || a.localeCompare(b);
    });
  }

  function getSeen() {
    try {
      var s = JSON.parse(localStorage.getItem(LS_SEEN));
      return Array.isArray(s) ? s : [];
    } catch (e) { return []; }
  }

  function markSeen(key) {
    try {
      var seen = getSeen();
      if (seen.indexOf(key) !== -1) return;
      seen.push(key);
      localStorage.setItem(LS_SEEN, JSON.stringify(seen));
    } catch (e) {}
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /* ---------------- Karte ---------------- */

  function buildCard(v, index) {
    var key = v.ru + '|' + v.de;

    var card = el('div', 'alphabet-card');
    if (Array.isArray(v.formen) && v.formen.length) card.classList.add('az-voc-hasformen');
    var inner = el('div', 'card-inner');

    /* --- Vorderseite: Russisch --- */
    var front = el('div', 'card-front');

    var topF = el('div', 'az-voc-top');
    topF.appendChild(el('span', 'az-chip', '#' + (index + 1)));
    topF.appendChild(el('span', 'az-chip az-chip-lime', categoryOf(v).toUpperCase()));
    front.appendChild(topF);

    var midF = el('div', 'az-voc-mid');
    var wordF = el('div', 'az-voc-word', v.ru);
    if (v.ru.length > 13) wordF.classList.add('az-voc-xlong');
    else if (v.ru.length > 9) wordF.classList.add('az-voc-long');
    midF.appendChild(wordF);
    if (v.pron) midF.appendChild(el('div', 'az-voc-pron', v.pron));
    if (Array.isArray(v.formen) && v.formen.length) {
      midF.appendChild(el('div', 'az-voc-formen-mark', v.formen.length + ' Formen'));
    }
    front.appendChild(midF);

    front.appendChild(el('div', 'az-voc-hint', 'TIPPEN ZUM DREHEN'));

    /* --- Rueckseite: Deutsch --- */
    var back = el('div', 'card-back');

    var topB = el('div', 'az-voc-top');
    topB.appendChild(el('span', 'az-chip', 'RU / DE'));
    topB.appendChild(el('span', 'az-chip az-chip-lime', categoryOf(v).toUpperCase()));
    back.appendChild(topB);

    var midB = el('div', 'az-voc-mid');
    midB.appendChild(el('div', 'az-voc-de', v.de));

    var hatFormen = Array.isArray(v.formen) && v.formen.length;

    /* Bei Formen kommt die Tabelle zuerst - deswegen dreht man
       die Karte. Der Beispielsatz rutscht darunter. */
    if (hatFormen) {
      var fWrap2 = el('div', 'az-voc-formen');
      fWrap2.appendChild(el('div', 'az-voc-example-label', v.formenLabel || 'FORMEN'));

      var tab = el('div', 'az-voc-formen-tab');
      v.formen.forEach(function (f) {
        if (!f || !f.form) return;
        var row = el('div', 'az-voc-formen-row');
        row.appendChild(el('span', 'az-voc-formen-ru', f.form));
        if (f.pron) row.appendChild(el('span', 'az-voc-formen-pron', f.pron));
        if (f.de) row.appendChild(el('span', 'az-voc-formen-de', f.de));
        tab.appendChild(row);
      });
      fWrap2.appendChild(tab);
      midB.appendChild(fWrap2);
    }

    if (v.beispiel) {
      var ex = el('div', 'az-voc-example');
      ex.appendChild(el('div', 'az-voc-example-label', 'BEISPIEL'));
      ex.appendChild(el('div', 'az-voc-example-ru', v.beispiel));
      if (v.beispielDe) ex.appendChild(el('div', 'az-voc-example-de', v.beispielDe));
      midB.appendChild(ex);
    }

    back.appendChild(midB);

    back.appendChild(el('div', 'az-voc-hint', 'TIPPE ZUM ZURÜCKDREHEN'));

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    card.addEventListener('click', function () {
      inner.classList.toggle('flipped');
      if (inner.classList.contains('flipped')) markSeen(key);
    });

    return card;
  }

  /* ---------------- Ansicht ---------------- */

  function render(container) {
    try { filter = localStorage.getItem(LS_FILTER) || 'alle'; } catch (e) {}

    var alle = data();
    var kats = kategorien();
    if (filter !== 'alle' && kats.indexOf(filter) === -1) filter = 'alle';

    /* Kopfzeile + Filter */
    var head = el('div', 'az-head');

    var titel = el('div');
    titel.appendChild(el('h1', null, 'Vokabeln'));
    titel.appendChild(el('p', null, alle.length + ' Wörter • ' + getSeen().length + ' schon angesehen'));
    head.appendChild(titel);

    var fWrap = el('div', 'az-filter');
    [{ id: 'alle', label: 'Alle ' + alle.length }]
      .concat(kats.map(function (k) {
        var n = alle.filter(function (v) { return categoryOf(v) === k; }).length;
        return { id: k, label: k + ' ' + n };
      }))
      .forEach(function (f) {
        var b = el('button', 'az-filter-btn' + (f.id === filter ? ' az-active' : ''), f.label);
        b.type = 'button';
        b.addEventListener('click', function () {
          try { localStorage.setItem(LS_FILTER, f.id); } catch (e) {}
          if (window.AzbukaTabs) window.AzbukaTabs.refresh();
        });
        fWrap.appendChild(b);
      });
    head.appendChild(fWrap);

    container.appendChild(head);

    /* Karten */
    var liste = filter === 'alle'
      ? alle
      : alle.filter(function (v) { return categoryOf(v) === filter; });

    if (liste.length === 0) {
      var leer = el('div', 'az-empty');
      leer.appendChild(el('span', null, 'Keine Vokabeln in dieser Kategorie.'));
      container.appendChild(leer);
      return;
    }

    var grid = el('div', 'az-grid');
    container.appendChild(grid);

    /* Bei ~1000 Woertern nur seitenweise zeichnen. */
    var PAGE = 60, shown = 0;
    var moreWrap = el('div', 'az-more-wrap');
    var moreBtn = el('button', 'az-btn az-more');
    moreBtn.type = 'button';
    moreWrap.appendChild(moreBtn);
    container.appendChild(moreWrap);

    function showMore() {
      var end = Math.min(shown + PAGE, liste.length);
      for (var i = shown; i < end; i++) grid.appendChild(buildCard(liste[i], alle.indexOf(liste[i])));
      shown = end;
      moreWrap.style.display = shown < liste.length ? '' : 'none';
      moreBtn.textContent = 'Mehr anzeigen (' + (liste.length - shown) + ' weitere)';
    }
    moreBtn.addEventListener('click', showMore);
    showMore();

    // Apply theme colors to cards
    setTimeout(function () {
      if (window.AzbukaThemeSystem && window.AzbukaThemeSystem.applyAppThemeVisuals) {
        var theme = window.AzbukaThemeSystem.getActiveTheme();
        var skin = window.AzbukaThemeSystem.getActiveSkin();
        window.AzbukaThemeSystem.applyAppThemeVisuals(theme, skin);
      }
    }, 50);
  }

  /* ---------------- Anmelden ---------------- */

  function register() {
    if (!window.AzbukaTabs) return false;
    window.AzbukaTabs.register({ id: 'vokabeln', label: 'Vokabeln', render: render });
    return true;
  }

  if (!register()) {
    var t = setInterval(function () { if (register()) clearInterval(t); }, 100);
    setTimeout(function () { clearInterval(t); }, 20000);
  }
})();
