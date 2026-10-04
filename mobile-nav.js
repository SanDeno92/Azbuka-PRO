
/* Azbuka PRO – Bottom-Navigation v10 FINAL MERGED */
(function () {
  'use strict';
  var LS_TAB = 'azbuka_bottom_tab';
  var NAV_ITEMS = [
    { id: 'lernen', icon: '🎓', label: 'Lernen' },
    { id: 'ueben', icon: '⚡', label: 'Quiz' },
    { id: 'spiele', icon: '🎮', label: 'Spiele' },
    { id: 'shop', icon: '🛍️', label: 'Shop' },
    { id: 'leaderboard', icon: '🏆', label: 'Leaderboard' },
    { id: 'profil', icon: '👤', label: 'Profil' }
  ];
  var HEADER_LABEL = { lernen: 'LERNEN', ueben: 'QUIZ', leaderboard: 'RANGLISTE' };
  var nav = null;
  var shopOverlay = null;
  var profilOverlay = null;
  var spieleOverlay = null;
  var activeTab = 'lernen';
  var booted = false;

  function clickHeaderButton(label) {
    var btns = document.querySelectorAll('header button');
    for (var i = 0; i < btns.length; i++) {
      if (btns[i].textContent.trim() === label) { btns[i].click(); return true; }
    }
    return false;
  }

  function buildNav() {
    var banner = document.createElement('a');
    banner.className = 'az-instagram-banner';
    banner.href = 'https://www.instagram.com/asbuka_pro';
    banner.target = '_blank';
    banner.rel = 'noopener noreferrer';
    banner.title = 'Support & Feedback auf Instagram (@asbuka_pro)';
    banner.setAttribute('aria-label', banner.title);
    banner.innerHTML =
      '<span class="az-instagram-icon" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">' +
          '<rect x="2" y="2" width="20" height="20" rx="6" stroke="#fff" stroke-width="2"/>' +
          '<circle cx="12" cy="12" r="4.6" stroke="#fff" stroke-width="2"/>' +
          '<circle cx="17.2" cy="6.8" r="1.2" fill="#fff"/>' +
        '</svg>' +
      '</span>' +
      '<span class="az-instagram-copy">' +
        '<strong>Support & Feedback auf Instagram</strong>' +
        '<small>@asbuka_pro</small>' +
      '</span>' +
      '<span class="az-instagram-arrow" aria-hidden="true">↗</span>';
    document.body.appendChild(banner);

    /* Beim Runterscrollen ausblenden, beim Hochscrollen wieder zeigen.
       Capture, weil die Overlays (Shop/Profil/Spiele) selbst scrollen. */
    var lastY = new WeakMap();
    document.addEventListener('scroll', function (e) {
      var t = e.target === document ? document.scrollingElement : e.target;
      if (!t) return;
      var y = t.scrollTop;
      var prev = lastY.get(t) || 0;
      if (Math.abs(y - prev) < 6) return;
      banner.classList.toggle('az-hidden', y > prev && y > 40);
      lastY.set(t, y);
    }, true);

    nav = document.createElement('nav');
    nav.className = 'az-bottom-nav';
    NAV_ITEMS.forEach(function (it) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('data-tab', it.id);
      btn.innerHTML = '<span>' + it.icon + '</span><small>' + it.label + '</small>';
      btn.addEventListener('click', function () { setActive(it.id); });
      nav.appendChild(btn);
    });
    document.body.appendChild(nav);

    shopOverlay = document.createElement('div');
    shopOverlay.id = 'azShopOverlay';
    shopOverlay.className = 'az-view-overlay';
    document.body.appendChild(shopOverlay);

    profilOverlay = document.createElement('div');
    profilOverlay.id = 'azProfilOverlay';
    profilOverlay.className = 'az-view-overlay';
    document.body.appendChild(profilOverlay);

    spieleOverlay = document.createElement('div');
    spieleOverlay.id = 'azSpieleOverlay';
    spieleOverlay.className = 'az-view-overlay';
    document.body.appendChild(spieleOverlay);

    nav.setAttribute('data-count', NAV_ITEMS.length);
  }

  function updateActiveStyles() {
    if (!nav) return;
    var btns = nav.querySelectorAll('button');
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.toggle('active', btns[i].getAttribute('data-tab') === activeTab);
    }
  }

  function setActive(id) {
    activeTab = id;
    try { localStorage.setItem(LS_TAB, id); } catch (e) {}
    updateActiveStyles();

    function closeOverlay(ov) {
      if (!ov) return;
      ov.classList.remove('open');
      ov.style.display = 'none';
    }
    closeOverlay(shopOverlay);
    closeOverlay(profilOverlay);
    closeOverlay(spieleOverlay);

    if (id === 'shop') {
      if (window.AzbukaShopView) window.AzbukaShopView.render(shopOverlay);
      shopOverlay.style.display = 'block';
      shopOverlay.classList.add('open');
      return;
    }
    if (id === 'profil') {
      if (window.AzbukaProfilView) window.AzbukaProfilView.render(profilOverlay);
      profilOverlay.style.display = 'block';
      profilOverlay.classList.add('open');
      return;
    }
    if (id === 'spiele') {
      spieleOverlay.style.display = 'block';
      if (window.AzbukaSpieleView && typeof window.AzbukaSpieleView.render === 'function') {
        window.AzbukaSpieleView.render(spieleOverlay);
      } else if (window.AzbukaWortsucheView && typeof window.AzbukaWortsucheView.render === 'function') {
        window.AzbukaWortsucheView.render(spieleOverlay);
      }
      spieleOverlay.classList.add('open');
      spieleOverlay.style.display = 'block';
      return;
    }
    var headerLabel = HEADER_LABEL[id];
    if (headerLabel) clickHeaderButton(headerLabel);
  }

  function boot() {
    if (booted) return;
    if (!document.querySelector('header button')) return;
    booted = true;
    buildNav();
    var saved = 'lernen';
    try {
      var stored = localStorage.getItem(LS_TAB);
      if (stored && NAV_ITEMS.some(function (it) { return it.id === stored; })) saved = stored;
    } catch (e) {}
    setActive(saved);
  }

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
