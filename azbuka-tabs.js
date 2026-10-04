/* ============================================================
   Azbuka PRO – Unter-Reiter-Steuerung für LERNEN
   ------------------------------------------------------------
   Baut die Leiste "Alphabet | Vokabeln | Aufgaben" oberhalb der
   Lernen-Ansicht und schaltet zwischen der Original-Ansicht
   (React-Bundle, #learnView) und den eigenen Panels um.

   WICHTIG: Es wird NICHTS im React-Bundle verändert. Unser
   Host-Element haengt am Ende von <main> und wird per CSS
   (order:-1) nach oben gezogen. React verwaltet nur seine
   eigenen Knoten und kommt damit nicht in Konflikt.

   Eigenen Reiter hinzufuegen:

     AzbukaTabs.register({
       id: 'meintab',
       label: 'Mein Tab',
       render: function (container) { ... }
     });

   ============================================================ */
(function () {
  'use strict';

  var tabs = [];          // registrierte Zusatz-Reiter
  var activeId = 'hub';   // 'hub' = Auswahlseite, sonst Id eines Bereichs
  var host = null;        // unser Wrapper in <main>
  var barEl = null;       // Kopfleiste mit Zurueck-Knopf
  var barInner = null;    // Inhalt der Kopfleiste
  var panel = null;       // Inhalt der Zusatz-Reiter
  var learnView = null;   // #learnView aus dem Bundle
  var regelnView = null;  // #regelnView aus dem Bundle (jetzt Unter-Reiter)
  var booted = false;

  /* ---------------- Oeffentliche API ---------------- */

  var API = {
    /* tab.render ist optional, wenn stattdessen tab.reactViewId gesetzt
       ist (nutzt eine bereits vom Bundle gerenderte Ansicht, z.B. Regeln). */
    register: function (tab) {
      if (!tab || !tab.id) return;
      if (!tab.reactViewId && typeof tab.render !== 'function') return;
      if (tabs.some(function (t) { return t.id === tab.id; })) return;
      tabs.push(tab);
      if (booted) { renderBar(); renderPanel(); applyLearnViewVisibility(); }
    },
    show: function (id) { setActive(id); },
    active: function () { return activeId; },
    /* Damit andere Module (z.B. Aufgaben) neu zeichnen koennen. */
    refresh: function () { if (booted) renderPanel(); }
  };

  window.AzbukaTabs = API;

  /* ---------------- Aufbau ---------------- */

  function buildHost() {
    var main = document.querySelector('main');
    if (!main) return false;

    learnView = document.getElementById('learnView');
    if (!learnView) return false;
    regelnView = document.getElementById('regelnView');

    host = document.createElement('div');
    host.className = 'az-tabs-host';
    /* order:-1 zieht die Leiste optisch an den Anfang von <main>,
       obwohl der Knoten physisch am Ende haengt. */
    host.style.order = '-1';
    host.style.width = '100%';

    var bar = document.createElement('div');
    bar.className = 'az-subtabs';
    barEl = bar;
    barInner = document.createElement('div');
    barInner.className = 'az-subtabs-inner';
    bar.appendChild(barInner);

    panel = document.createElement('div');
    panel.className = 'az-tabs-panel';

    host.appendChild(bar);
    host.appendChild(panel);

    main.style.display = 'flex';
    main.style.flexDirection = 'column';
    main.appendChild(host);

    return true;
  }

  function allTabs() {
    return [{ id: 'alphabet', label: 'Alphabet' }].concat(tabs);
  }

  var TAB_META = {
    alphabet: { icon: '🔤', desc: 'Die Buchstaben mit Aussprache und Beispielen' },
    vokabeln: {
      icon: '📚',
      desc: function () {
        var n = Array.isArray(window.AZBUKA_VOKABELN) ? window.AZBUKA_VOKABELN.length : 0;
        return (n ? n + ' Wörter' : 'Wörter') + ' mit Beispielsätzen';
      }
    },
    aufgaben: { icon: '✏️', desc: 'Übungen in Kapiteln und Leveln' },
    regeln: { icon: '📖', desc: 'Grammatikregeln und Tipps' }
  };

  function tabLabel(id) {
    var t = allTabs().filter(function (x) { return x.id === id; })[0];
    return t ? t.label : '';
  }

  /* Kopfleiste: nur in einem Bereich sichtbar, mit Weg zurueck zur Auswahl. */
  function renderBar() {
    if (!barInner || !barEl) return;
    barInner.textContent = '';
    barEl.style.display = activeId === 'hub' ? 'none' : 'block';
    if (activeId === 'hub') return;

    var back = document.createElement('button');
    back.type = 'button';
    back.className = 'az-learn-back';
    back.textContent = '‹ Lernen';
    back.addEventListener('click', function () { setActive('hub'); });
    barInner.appendChild(back);

    var title = document.createElement('span');
    title.className = 'az-learn-section';
    title.textContent = tabLabel(activeId);
    barInner.appendChild(title);
  }

  /* Auswahlseite: eine Karte pro Bereich. */
  function renderHub(container) {
    var inner = document.createElement('div');
    inner.className = 'az-view-inner';
    var h = document.createElement('h1');
    h.textContent = 'Lernen';
    var p = document.createElement('p');
    p.className = 'az-view-sub';
    p.textContent = 'Was möchtest du heute üben?';
    inner.appendChild(h);
    inner.appendChild(p);

    allTabs().forEach(function (tab) {
      var meta = TAB_META[tab.id] || { icon: '📌', desc: '' };
      var desc = typeof meta.desc === 'function' ? meta.desc() : meta.desc;

      var card = document.createElement('button');
      card.type = 'button';
      card.className = 'az-shop-item az-hub-item';

      var icon = document.createElement('div');
      icon.className = 'az-shop-icon';
      icon.textContent = meta.icon;
      var info = document.createElement('div');
      info.className = 'az-shop-info';
      var title = document.createElement('div');
      title.className = 'az-shop-title';
      title.textContent = tab.label;
      var sub = document.createElement('div');
      sub.className = 'az-shop-desc';
      sub.textContent = desc;
      info.appendChild(title);
      info.appendChild(sub);

      card.appendChild(icon);
      card.appendChild(info);
      card.addEventListener('click', function () { setActive(tab.id); });
      inner.appendChild(card);
    });
    container.appendChild(inner);
  }

  function renderPanel() {
    if (!panel) return;
    panel.textContent = '';

    if (activeId === 'alphabet') {
      panel.style.display = 'none';
      return;
    }

    if (activeId === 'hub') {
      panel.style.display = 'block';
      renderHub(panel);
      return;
    }

    var tab = tabs.filter(function (t) { return t.id === activeId; })[0];

    /* Reine "Bundle-Ansichten" (z.B. Regeln) haben eigenen Inhalt im
       React-Bundle - unser Panel bleibt dafuer leer/unsichtbar. */
    if (tab && tab.reactViewId) {
      panel.style.display = 'none';
      return;
    }

    panel.style.display = 'block';

    if (tab) {
      try {
        tab.render(panel);
      } catch (e) {
        panel.innerHTML = '<div class="az-empty"><span>Fehler in Reiter "' +
          activeId + '" – siehe Konsole.</span></div>';
        console.error('[AzbukaTabs]', activeId, e);
      }
    }
  }

  function setActive(id) {
    activeId = id;
    renderBar();
    renderPanel();
    applyLearnViewVisibility();
    try { window.scrollTo(0, 0); } catch (e) {}
  }

  /* Blendet die Original-Alphabet-Ansicht aus, wenn ein
     Zusatz-Reiter aktiv ist. */
  function applyLearnViewVisibility() {
    if (!learnView || !host) return;

    var lernenAktiv = isLernenActive();
    host.style.display = lernenAktiv ? 'block' : 'none';

    if (!lernenAktiv) {
      /* Regeln-Inhalt (Bundle-Ansicht) nicht sichtbar lassen, wenn
         woanders hin gewechselt wurde. */
      if (regelnView) regelnView.style.display = 'none';
      return;
    }

    var tab = tabs.filter(function (t) { return t.id === activeId; })[0];

    if (activeId === 'alphabet') {
      learnView.style.display = 'block';
      if (regelnView) regelnView.style.display = 'none';
    } else if (tab && tab.reactViewId) {
      /* Regeln: eigene Bundle-Ansicht anzeigen (bleibt Teil von
         React, wir erzwingen nur die Sichtbarkeit von aussen, weil
         das Bundle sie sonst wieder ausblendet – e bleibt "lernen"). */
      learnView.style.display = 'none';
      var reactView = document.getElementById(tab.reactViewId);
      if (reactView) reactView.style.display = 'block';
    } else {
      learnView.style.display = 'none';
      if (regelnView) regelnView.style.display = 'none';
    }
  }

  /* Ob das Bundle gerade LERNEN zeigt.
     Wir lesen NICHT #learnView aus (das manipulieren wir ja selbst),
     sondern den aktiven Knopf im Top-Menue: das Bundle gibt ihm die
     Klasse bg-[#D4FF00]. */
  function isLernenActive() {
    var btns = document.querySelectorAll('header button');
    for (var i = 0; i < btns.length; i++) {
      if (btns[i].textContent.trim() === 'LERNEN') {
        return btns[i].className.indexOf('bg-[#D4FF00]') !== -1;
      }
    }
    return false;
  }

  /* Das React-Bundle schreibt beim Reiterwechsel wieder
     display:block/none auf #learnView. Der Beobachter zieht
     unseren Zustand danach jedes Mal nach. Zusaetzlich reagieren
     wir sofort auf Klicks im Top-Menue, damit nichts flackert. */
  function watchLearnView() {
    document.addEventListener('click', function (e) {
      var b = e.target && e.target.closest && e.target.closest('header button');
      if (b) setTimeout(applyLearnViewVisibility, 0);

      /* Erneutes Tippen auf "Lernen" unten fuehrt zurueck zur Auswahl. */
      var navBtn = e.target && e.target.closest && e.target.closest('.az-bottom-nav button[data-tab="lernen"]');
      if (navBtn && activeId !== 'hub' && isLernenActive()) setActive('hub');
    }, true);

    setInterval(applyLearnViewVisibility, 150);
  }

  /* ---------------- Start ---------------- */

  function boot() {
    if (booted) return;
    if (!buildHost()) return;   /* React noch nicht fertig – spaeter erneut */

    booted = true;

    /* Regeln war frueher ein eigener Reiter oben (REGELN) - jetzt
       gehoert er inhaltlich zu Lernen (Grammatikregeln & Tipps). */
    if (regelnView && !tabs.some(function (t) { return t.id === 'regeln'; })) {
      tabs.push({ id: 'regeln', label: 'Regeln', reactViewId: 'regelnView' });
    }

    renderBar();
    renderPanel();
    applyLearnViewVisibility();
    watchLearnView();
  }

  /* Das Bundle rendert asynchron – so lange nachfassen, bis
     #learnView da ist (max. ~15s). */
  function waitForApp() {
    var tries = 0;
    var t = setInterval(function () {
      tries++;
      boot();
      if (booted || tries > 150) clearInterval(t);
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForApp);
  } else {
    waitForApp();
  }
})();
