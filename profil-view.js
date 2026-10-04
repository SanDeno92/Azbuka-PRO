/* ============================================================
   Azbuka PRO – Profil-Ansicht (Mobile Bottom-Nav "Profil")
   ------------------------------------------------------------
   Zeigt Name, Avatar und Statistiken aus dem bestehenden
   Profil-System (profiles.js / localStorage) an und bereitet
   Einstellungen sowie persönliche Infos (E-Mail, Passwort) vor,
   die erst mit einem echten Login-System funktionsfähig werden.

   Nutzt window.AzbukaProfiles (aus profiles.js) für Name/Stats,
   liest also keine eigenen Daten neu ein.
   ============================================================ */
(function () {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function initials(name) {
    var n = (name || '?').trim();
    return n ? n.charAt(0).toUpperCase() : '?';
  }

  function isSoundOn() {
    var btn = document.querySelector('header button[aria-label^="Sound"]');
    return btn ? btn.getAttribute('aria-label') === 'Sound an' : true;
  }

  function toggleSound() {
    var btn = document.querySelector('header button[aria-label^="Sound"]');
    if (btn) btn.click();
    setTimeout(render, 30);
  }

  function switchProfile() {
    if (window.AzbukaProfiles && typeof window.AzbukaProfiles.showPicker === 'function') {
      window.AzbukaProfiles.showPicker();
    }
  }

  function changeImage() {
    var input = container && container.querySelector('#azProfImageInput');
    if (input) input.click();
  }

  function saveImage(file) {
    if (!file || !/^image\//.test(file.type)) {
      window.alert('Bitte wähle eine Bilddatei aus.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      window.alert('Das Bild darf maximal 5 MB groß sein.');
      return;
    }

    var reader = new FileReader();
    reader.onload = function () {
      var source = new Image();
      source.onload = function () {
        var max = 256;
        var scale = Math.min(1, max / Math.max(source.width, source.height));
        var canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(source.width * scale));
        canvas.height = Math.max(1, Math.round(source.height * scale));
        canvas.getContext('2d').drawImage(source, 0, 0, canvas.width, canvas.height);
        var dataUrl = canvas.toDataURL('image/jpeg', 0.86);
        var api = window.AzbukaProfiles;
        var name = api && api.getActiveName ? api.getActiveName() : null;
        if (!name || !api.setAvatar || !api.setAvatar(name, dataUrl)) {
          window.alert('Das Bild konnte nicht gespeichert werden.');
          return;
        }
        render();
      };
      source.onerror = function () { window.alert('Das Bild konnte nicht gelesen werden.'); };
      source.src = reader.result;
    };
    reader.onerror = function () { window.alert('Das Bild konnte nicht gelesen werden.'); };
    reader.readAsDataURL(file);
  }

  var container = null;

  function render() {
    if (!container) return;

    var api = window.AzbukaProfiles;
    var name = api ? api.getActiveName() : null;
    var stats = api ? api.getStats(name) : { xp: 0, streak: 0, bestStreak: 0, dayStreak: 0, bestDayStreak: 0, shields: 0, weekShields: 0, qCount: 0, taskAnswers: 0, learned: 0 };
    var soundOn = isSoundOn();
    var avatar = api && api.getAvatar ? api.getAvatar(name) : '';

    container.innerHTML =
      '<div class="az-view-inner">' +
        '<h1>Profil</h1>' +
        '<p class="az-view-sub">Dein Konto, deine Statistiken und Einstellungen.</p>' +

        '<div class="az-card">' +
          '<div class="az-profile-head">' +
            (avatar
              ? '<img class="az-avatar az-avatar-image" src="' + esc(avatar) + '" alt="Profilbild">'
              : '<div class="az-avatar">' + esc(initials(name)) + '</div>') +
            '<div>' +
              '<div class="az-profile-name">' + esc(name || 'Kein Profil') + '</div>' +
              '<div class="az-profile-name-sub">Aktives Profil</div>' +
            '</div>' +
            '<button type="button" class="az-avatar-edit" id="azProfImageBtn">Bild ändern</button>' +
            '<input type="file" id="azProfImageInput" accept="image/*" hidden>' +
          '</div>' +
        '</div>' +

        '<div class="az-card">' +
          '<h2>Statistiken</h2>' +
          '<div class="az-stat-grid">' +
            '<div class="az-stat-box"><b>' + esc(stats.xp) + '</b><span>XP GESAMT</span></div>' +
            '<div class="az-stat-box"><b>🔥 ' + esc(stats.dayStreak) + '</b><span>DAYSTREAK</span></div>' +
            '<div class="az-stat-box"><b>' + esc(stats.bestDayStreak) + '</b><span>BESTE DAYSTREAK</span></div>' +
            '<div class="az-stat-box"><b>' + esc(stats.learned) + ' / 33</b><span>BUCHSTABEN GELERNT</span></div>' +
            '<div class="az-stat-box"><b>' + esc(stats.qCount) + '</b><span>QUIZ-FRAGEN GESAMT</span></div>' +
          '</div>' +
          '<p class="az-view-sub az-profile-rewards">🛡️ ' + esc(stats.shields) + '/3 Tages-Schilde &nbsp;·&nbsp; 🏰 ' + esc(stats.weekShields) + '/1 Wochen-Schild</p>' +
        '</div>' +

        '<div class="az-card">' +
          '<h2>Einstellungen</h2>' +
          '<div class="az-row">' +
            '<div>' +
              '<div class="az-row-label">Sound</div>' +
              '<div class="az-row-hint">Töne beim Lernen & im Quiz</div>' +
            '</div>' +
            '<button type="button" class="az-btn" id="azProfSoundBtn">' + (soundOn ? 'AN' : 'AUS') + '</button>' +
          '</div>' +
          '<div class="az-row">' +
            '<div>' +
              '<div class="az-row-label">Profil wechseln</div>' +
              '<div class="az-row-hint">Zu einem anderen Spieler wechseln</div>' +
            '</div>' +
            '<button type="button" class="az-btn az-btn-ghost" id="azProfSwitchBtn">Wechseln</button>' +
          '</div>' +
        '</div>' +

        '<div class="az-card">' +
          '<h2>Persönliche Infos <span class="az-badge-soon">Bald verfügbar</span></h2>' +
          '<div class="az-row" style="flex-direction:column;align-items:stretch;">' +
            '<label class="az-row-label" for="azProfEmail">E-Mail</label>' +
            '<input class="az-input" id="azProfEmail" type="email" placeholder="noch nicht verknüpft" disabled>' +
          '</div>' +
          '<div class="az-row">' +
            '<div>' +
              '<div class="az-row-label">Passwort</div>' +
              '<div class="az-row-hint">Verfügbar sobald Accounts mit Login eingeführt werden</div>' +
            '</div>' +
            '<button type="button" class="az-btn az-btn-ghost" id="azProfPasswordBtn" disabled>Ändern</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    var soundBtn = container.querySelector('#azProfSoundBtn');
    if (soundBtn) soundBtn.addEventListener('click', toggleSound);
    var switchBtn = container.querySelector('#azProfSwitchBtn');
    if (switchBtn) switchBtn.addEventListener('click', switchProfile);
    var imageBtn = container.querySelector('#azProfImageBtn');
    if (imageBtn) imageBtn.addEventListener('click', changeImage);
    var imageInput = container.querySelector('#azProfImageInput');
    if (imageInput) imageInput.addEventListener('change', function () {
      saveImage(imageInput.files && imageInput.files[0]);
      imageInput.value = '';
    });
  }

  window.AzbukaProfilView = {
    render: function (target) {
      container = target;
      render();
    },
    refresh: render
  };
})();
