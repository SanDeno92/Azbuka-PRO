/* Azbuka PRO – Anime-Theme: Hintergrund ist ein echtes Foto (bg-sakura.jpg, Pexels-Lizenz: frei nutzbar). */
(function () {
  'use strict';

  function bgHtml() {
    // Der Filter #azPencil gibt den Panel-Rahmen die wackelige Zweitlinie
    return '<svg class="anb-defs" width="0" height="0" aria-hidden="true"><defs>' +
      '<filter id="azPencil" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3.2"/></filter>' +
      '</defs></svg>' +
      '<div class="anb-photo"></div><div class="anb-shade"></div>';
  }

  window.AzbukaAnimeArt = { bgHtml: bgHtml, paint: function () {} };
})();
