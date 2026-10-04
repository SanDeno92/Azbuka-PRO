/* ============================================================
   Azbuka PRO – Lautschrift ins Alphabet einsetzen
   ------------------------------------------------------------
   Tauscht auf den Alphabet-Karten (React-Bundle, #learnView)
   den Inhalt der gruenen Aussprache-Pille gegen die Lautschrift
   aus alphabet-lautschrift-data.js und haengt bei Bedarf eine
   kleine Hinweiszeile darunter.

   Unangetastet bleiben:
   - der russische Buchstabenname (бэ, вэ ...) darueber
   - die Beispiele auf der Rueckseite
   - das Bundle selbst

   Weil React die Karten neu zeichnen kann (Filter, Reiterwechsel,
   "gelernt" markieren), laeuft ein MutationObserver mit und setzt
   die Lautschrift danach erneut.
   ============================================================ */
(function () {
  'use strict';

  var MARK = 'data-az-laut';   /* schon ersetzt? */

  function daten() {
    return Array.isArray(window.AZBUKA_LAUTSCHRIFT) ? window.AZBUKA_LAUTSCHRIFT : [];
  }

  /* Nachschlagetabelle: Grossbuchstabe -> Eintrag */
  var tabelle = null;
  function lookup(ch) {
    if (!tabelle) {
      tabelle = {};
      daten().forEach(function (e) { tabelle[e.char] = e; });
    }
    return tabelle[ch] || null;
  }

  /* Aus "А а" den Grossbuchstaben "А" holen. */
  function charAusKarte(card) {
    var gross = card.querySelector('.card-front .text-\\[72px\\], .card-front [class*="text-[72px]"]');
    var txt = gross ? gross.textContent : '';
    if (!txt) {
      /* Fallback: erstes Zeichen der Rueckseiten-Ueberschrift */
      var back = card.querySelector('.card-back');
      txt = back ? back.textContent : '';
    }
    return txt.trim().charAt(0);
  }

  function entferneHtmlBeispiele(back) {
    if (!back) return;

    var all = Array.prototype.slice.call(back.querySelectorAll('div,span'));
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      var txt = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (!txt) continue;

      var hatBeispieleLabel = txt.indexOf('BEISPIELE') !== -1;
      var hatRussischeWorte = /[А-Яа-яЁё]/.test(txt);
      var hatBeispielZeile = txt.indexOf('•') !== -1 && hatRussischeWorte;

      if (hatBeispieleLabel || hatBeispielZeile) {
        el.remove();
      }
    }
  }

  function belegeBeispiele(card, ch) {
    var back = card.querySelector('.card-back');
    if (!back) return;
    var data = window.AZBUKA_BEISPIELE && window.AZBUKA_BEISPIELE[ch];
    if (!Array.isArray(data) || !data.length) return;

    entferneHtmlBeispiele(back);

    var existing = back.querySelector('.az-beispiele');
    if (existing) existing.remove();

    var box = document.createElement('div');
    box.className = 'az-beispiele';
    box.style.marginTop = '10px';
    box.style.paddingTop = '8px';
    box.style.borderTop = '1px solid rgba(255,255,255,0.12)';
    box.style.display = 'flex';
    box.style.flexDirection = 'column';
    box.style.gap = '6px';
    box.style.flex = '1';
    box.style.minHeight = '0';

    var label = document.createElement('div');
    label.textContent = 'BEISPIELE';
    label.style.fontSize = '9px';
    label.style.fontWeight = '800';
    label.style.letterSpacing = '0.18em';
    label.style.textTransform = 'uppercase';
    label.style.opacity = '0.7';
    label.style.marginBottom = '2px';
    box.appendChild(label);

    data.forEach(function (item) {
      var row = document.createElement('div');
      row.style.display = 'flex';
      row.style.flexDirection = 'column';
      row.style.gap = '2px';
      row.style.padding = '5px 0';
      row.style.borderBottom = '1px solid rgba(255,255,255,0.08)';
      row.style.lineHeight = '1.3';

      var ru = document.createElement('div');
      ru.textContent = item.ru + ' • ' + item.pron;
      ru.style.fontWeight = '700';
      ru.style.fontSize = '13px';
      ru.style.color = '#fff';

      var de = document.createElement('div');
      de.textContent = item.de;
      de.style.fontSize = '11px';
      de.style.opacity = '0.78';
      de.style.color = '#fff';

      row.appendChild(ru);
      row.appendChild(de);
      box.appendChild(row);
    });

    back.appendChild(box);
  }

  /* Die gruene Aussprache-Pille auf einer Kartenseite. */
  function pille(seite) {
    var spans = seite.querySelectorAll('span');
    for (var i = 0; i < spans.length; i++) {
      var c = spans[i].className || '';
      if (c.indexOf('rounded-full') !== -1 &&
          c.indexOf('#D4FF00') !== -1 &&
          c.indexOf('border') !== -1) {
        return spans[i];
      }
    }
    return null;
  }

  function setzeSeite(seite, eintrag) {
    if (!seite) return;
    var p = pille(seite);
    if (!p) return;

    /* Schon mit genau diesem Wert bearbeitet? Dann nichts tun. */
    if (p.getAttribute(MARK) === eintrag.laut) return;

    p.textContent = eintrag.laut;
    p.setAttribute(MARK, eintrag.laut);

    /* Hinweiszeile direkt unter die Pille (bzw. entfernen). */
    var wrap = p.parentNode;
    if (!wrap) return;
    var alt = wrap.querySelector('.az-laut-hinweis');

    if (!eintrag.hinweis) {
      if (alt) alt.remove();
      return;
    }
    if (!alt) {
      alt = document.createElement('span');
      alt.className = 'az-laut-hinweis';
      wrap.insertBefore(alt, p.nextSibling);
    }
    alt.textContent = eintrag.hinweis;
  }

  function bearbeite(card) {
    var ch = charAusKarte(card);
    var eintrag = lookup(ch);
    if (!eintrag) return;
    setzeSeite(card.querySelector('.card-front'), eintrag);
    setzeSeite(card.querySelector('.card-back'), eintrag);
    belegeBeispiele(card, ch);
  }

  function alleKarten() {
    var lv = document.getElementById('learnView');
    if (!lv) return;
    var cards = lv.querySelectorAll('.alphabet-card');
    for (var i = 0; i < cards.length; i++) bearbeite(cards[i]);
  }

  /* ----------------------------------------------------------
     QUIZ
     Das Quiz nutzt intern ein eigenes Feld ("latin", z.B. "CH"),
     nicht die Lautschrift. Damit dort dasselbe steht wie auf den
     Karten, wird die Beschriftung der Antwort-Buttons und der
     Aufloesungstext ersetzt.

     Wichtig: Angeklickt wird weiterhin der Original-Button, die
     Bewertung richtig/falsch bleibt also unangetastet.
     ---------------------------------------------------------- */

  /* Antwort-Text des Quiz -> Buchstabe. Fest, stammt aus der App. */
  var LATIN2CHAR = {
    "A": "А", "O": "О", "M": "М", "T": "Т", "K": "К", "JE / E": "Е",
    "I": "И", "N": "Н", "B": "Б", "W / V": "В", "G": "Г", "D": "Д",
    "S / Z": "З", "L": "Л", "P": "П", "R": "Р", "S": "С", "U": "У",
    "F": "Ф", "TSCH": "Ч", "JO / Ö": "Ё", "ZH": "Ж", "J": "Й",
    "CH": "Х", "Z / TS": "Ц", "SCH": "Ш", "SCHJ": "Щ", "ʺ": "Ъ",
    "Y": "Ы", "ʹ": "Ь", "E / Ä": "Э", "JU / JÜ": "Ю", "JA": "Я"
  };

  var ORIG = 'data-az-orig';   /* Originalbeschriftung merken */

  /* Das Element mit der Antwort-Beschriftung in einem Options-Button. */
  function optLabel(btn) {
    return btn.querySelector('div[class*="font-extrabold"]');
  }

  function quizOptionen() {
    var box = document.getElementById('qOpts');
    if (!box) return;

    var btns = box.children;

    for (var i = 0; i < btns.length; i++) {
      var el = optLabel(btns[i]);
      if (!el) continue;

      /* Beim ersten Mal die Originalbeschriftung sichern. */
      if (!el.hasAttribute(ORIG)) el.setAttribute(ORIG, el.textContent.trim());

      var eintrag = lookup(LATIN2CHAR[el.getAttribute(ORIG)]);
      if (!eintrag) continue;

      if (el.textContent !== eintrag.laut) el.textContent = eintrag.laut;
    }
  }

  /* Aufloesung nach einer Antwort, z.B. "✕ Falsch. Richtig ist О = O — ...".
     Der Teil "О = O" steht dort als eigener Textknoten. */
  function quizAufloesung() {
    var box = document.getElementById('qOpts');
    var rahmen = box && box.parentNode;
    if (!rahmen) return;

    var lauf = document.createTreeWalker(rahmen, NodeFilter.SHOW_TEXT, null);
    var knoten;
    while ((knoten = lauf.nextNode())) {
      var m = /^(.)\s=\s(.+)$/.exec(knoten.nodeValue);
      if (!m) continue;

      var eintrag = lookup(m[1]);
      if (!eintrag) continue;
      if (m[2] === eintrag.laut) continue;

      knoten.nodeValue = m[1] + ' = ' + eintrag.laut;
    }
  }

  function quizAlles() {
    quizOptionen();
    quizAufloesung();
  }

  function boot() {
    var lv = document.getElementById('learnView');
    if (!lv) return false;

    alleKarten();

    /* React zeichnet die Karten bei Filterwechsel neu -> nachziehen.
       Eigene Aenderungen loesen den Observer erneut aus, das ist
       unkritisch: bearbeite() steigt beim zweiten Mal sofort aus
       (MARK-Attribut). */
    var pending = false;
    var obs = new MutationObserver(function () {
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () { pending = false; alleKarten(); });
    });
    obs.observe(lv, { childList: true, subtree: true });

    /* Das Quiz liegt in einem anderen Teil der Seite und wird bei
       jeder Frage neu aufgebaut -> eigener Beobachter am Wurzelknoten. */
    var root = document.getElementById('root') || document.body;
    var qPending = false;
    var qObs = new MutationObserver(function () {
      if (qPending) return;
      qPending = true;
      requestAnimationFrame(function () { qPending = false; quizAlles(); });
    });
    qObs.observe(root, { childList: true, subtree: true, characterData: true });
    quizAlles();

    return true;
  }

  function warte() {
    var n = 0;
    var t = setInterval(function () {
      n++;
      if (boot() || n > 150) clearInterval(t);
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', warte);
  } else {
    warte();
  }
})();
