/* ============================================================
   Azbuka PRO 0.0.27 - News/Ankuendigungen (Overlay-Karte)
   Laedt NACH leaderboard-api.js (nutzt SUPABASE_URL/KEY).

   Ablauf:
   - Beim Start die neueste Meldung aus der Tabelle `news` holen
   - Schon gesehene Meldungen (azbuka_news_seen = [ids]) ueberspringen
   - Karte zeigen, X = als gelesen merken (pro Profil nicht noetig,
     News sind global fuer das Geraet)
   - Fehler/keine Tabelle/offline -> einfach nichts anzeigen
   ============================================================ */
(function () {
  'use strict';

  var LS_SEEN = 'azbuka_news_seen';

  function getSeen() {
    try {
      var s = JSON.parse(localStorage.getItem(LS_SEEN));
      return Array.isArray(s) ? s : [];
    } catch (e) { return []; }
  }

  function markSeen(id) {
    try {
      var seen = getSeen();
      if (seen.indexOf(id) === -1) seen.push(id);
      localStorage.setItem(LS_SEEN, JSON.stringify(seen));
    } catch (e) {}
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function showCard(item) {
    if (document.querySelector('.news-overlay')) return;
    var el = document.createElement('div');
    el.className = 'news-overlay';
    el.innerHTML =
      '<div class="news-card">' +
        '<div class="news-head">' +
          '<span class="news-badge">📢 NEU</span>' +
          '<button type="button" class="news-close" title="Schließen">✕</button>' +
        '</div>' +
        '<div class="news-title">' + esc(item.titel) + '</div>' +
        '<div class="news-text">' + esc(item.text).replace(/\n/g, '<br>') + '</div>' +
      '</div>';
    document.body.appendChild(el);

    function close() {
      el.remove();
      markSeen(item.id);
    }
    el.querySelector('.news-close').addEventListener('click', close);
    // Klick auf den dunklen Hintergrund schliesst ebenfalls
    el.addEventListener('click', function (e) { if (e.target === el) close(); });

    requestAnimationFrame(function () { el.classList.add('news-visible'); });
  }

  function fetchNews() {
    if (typeof SUPABASE_URL === 'undefined' || typeof SUPABASE_KEY === 'undefined') return;
    fetch(SUPABASE_URL + '/rest/v1/news?select=id,titel,text&order=id.desc&limit=1', {
      headers: { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY }
    })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (rows) {
        if (!Array.isArray(rows) || rows.length === 0) return;
        var item = rows[0];
        if (getSeen().indexOf(item.id) !== -1) return; // schon gesehen
        showCard(item);
      })
      .catch(function () { /* offline o.ae. -> einfach keine News */ });
  }

  // Etwas verzoegert starten, damit Profil-Picker zuerst kommt
  function boot() { setTimeout(fetchNews, 2500); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
