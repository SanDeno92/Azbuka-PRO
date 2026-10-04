/* Azbuka PRO – Weltraum-Effekte (Sterne, Sternschnuppen, Satellit) auf einem Canvas in #azSpaceFx.
   Wird von theme-system.js gestartet, sobald das Weltall-Theme aktiv ist; endet, wenn der Layer entfernt wird. */
(function () {
  'use strict';

  // Spektralklassen (Farbe, Häufigkeit): blau-weiß bis orange
  var COLORS = [['#9bb0ff', 0.08], ['#cad7ff', 0.17], ['#f8f7ff', 0.35], ['#fff4ea', 0.2], ['#ffd2a1', 0.13], ['#ffcc6f', 0.07]];
  var DRIFT = [0.93, 0.36]; // Blickrichtung der langsamen Kamera-Drift

  function rand(a, b) { return a + Math.random() * (b - a); }

  function pickColor() {
    var r = Math.random(), acc = 0;
    for (var i = 0; i < COLORS.length; i++) {
      acc += COLORS[i][1];
      if (r < acc) return COLORS[i][0];
    }
    return COLORS[2][0];
  }

  function rgbOf(hex) {
    var h = hex.replace('#', '');
    return parseInt(h.substr(0, 2), 16) + ',' + parseInt(h.substr(2, 2), 16) + ',' + parseInt(h.substr(4, 2), 16);
  }

  // Vorgerendertes Leuchten für helle Sterne (weißer Kern, farbiger Halo)
  var glowCache = {};
  function glowSprite(color) {
    if (glowCache[color]) return glowCache[color];
    var s = 64, c = document.createElement('canvas');
    c.width = c.height = s;
    var g = c.getContext('2d'), rgb = rgbOf(color);
    var grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.1, 'rgba(' + rgb + ',0.85)');
    grad.addColorStop(0.28, 'rgba(' + rgb + ',0.22)');
    grad.addColorStop(1, 'rgba(' + rgb + ',0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, s, s);
    glowCache[color] = c;
    return c;
  }

  function start(host) {
    if (!host || host._spx) return;
    var cv = host.querySelector('canvas');
    if (!cv) return;
    host._spx = true;
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var ctx = cv.getContext('2d');
    var w = 0, h = 0, layers = [], meteors = [], sat = null;
    var t0 = performance.now(), last = t0;
    var nextMeteor = t0 + rand(2500, 6000), nextSat = t0 + rand(12000, 25000);

    var LAYERS = [
      { share: 0.55, speed: 1.5, aMin: 0.25, aMax: 0.6 },
      { share: 0.33, speed: 4, aMin: 0.4, aMax: 0.85 },
      { share: 0.12, speed: 9, aMin: 0.6, aMax: 1 }
    ];

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      // Kleine Größenänderungen (z. B. mobile Adressleiste) behalten das Sternenfeld
      var regen = !layers.length || Math.abs(window.innerWidth - w) > w * 0.2 || Math.abs(window.innerHeight - h) > h * 0.4;
      w = window.innerWidth;
      h = window.innerHeight;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!regen) return;
      var total = Math.min(w * h / 2300, 900);
      var spikes = 0;
      layers = LAYERS.map(function (L, li) {
        var stars = [];
        for (var i = 0; i < Math.round(total * L.share); i++) {
          var r = 0.35 + Math.pow(Math.random(), 3.2) * (1.1 + li * 0.5);
          stars.push({
            x: rand(0, w), y: rand(0, h), r: r, color: pickColor(),
            a: rand(L.aMin, L.aMax), ph: rand(0, 6.28), sp: rand(0.6, 2.6),
            spike: r > 1.35 && li > 0 && spikes++ < 4
          });
        }
        return { def: L, stars: stars };
      });
    }

    function spawnMeteor(now) {
      var ang = rand(0.35, 0.85); // flach bis steil nach unten
      var dir = Math.random() < 0.5 ? 1 : -1;
      var v = rand(900, 1500);
      meteors.push({
        x: dir > 0 ? rand(-50, w * 0.6) : rand(w * 0.4, w + 50),
        y: rand(-30, h * 0.35),
        vx: Math.cos(ang) * v * dir, vy: Math.sin(ang) * v,
        age: 0, life: rand(0.55, 0.95), len: rand(110, 260),
        warm: Math.random() < 0.25
      });
    }

    function drawStars(t, dt) {
      layers.forEach(function (L) {
        var mv = L.def.speed * dt;
        L.stars.forEach(function (s) {
          if (dt) {
            s.x += DRIFT[0] * mv;
            s.y += DRIFT[1] * mv;
            if (s.x > w + 4) s.x = -4;
            if (s.y > h + 4) s.y = -4;
          }
          var tw = reduced ? 1 : 0.68 + 0.32 * Math.sin(t * s.sp + s.ph);
          var alpha = s.a * tw;
          if (s.r > 1.0) {
            var size = s.r * 12;
            ctx.globalAlpha = Math.min(1, alpha);
            ctx.drawImage(glowSprite(s.color), s.x - size / 2, s.y - size / 2, size, size);
            if (s.spike) {
              ctx.globalAlpha = alpha * 0.45;
              ctx.strokeStyle = '#fff';
              ctx.lineWidth = 0.6;
              ctx.beginPath();
              ctx.moveTo(s.x - s.r * 14, s.y); ctx.lineTo(s.x + s.r * 14, s.y);
              ctx.moveTo(s.x, s.y - s.r * 14); ctx.lineTo(s.x, s.y + s.r * 14);
              ctx.stroke();
            }
          } else {
            ctx.globalAlpha = alpha;
            ctx.fillStyle = s.color;
            ctx.fillRect(s.x, s.y, s.r + 0.2, s.r + 0.2);
          }
        });
      });
      ctx.globalAlpha = 1;
    }

    function drawMeteors(dt) {
      for (var i = meteors.length - 1; i >= 0; i--) {
        var m = meteors[i];
        m.age += dt;
        if (m.age > m.life) { meteors.splice(i, 1); continue; }
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        var env = Math.sin(Math.PI * m.age / m.life);
        var sp = Math.sqrt(m.vx * m.vx + m.vy * m.vy);
        var tx = m.x - m.vx / sp * m.len * env, ty = m.y - m.vy / sp * m.len * env;
        var rgb = m.warm ? '255,200,140' : '190,215,255';
        var g = ctx.createLinearGradient(tx, ty, m.x, m.y);
        g.addColorStop(0, 'rgba(' + rgb + ',0)');
        g.addColorStop(1, 'rgba(255,255,255,' + (0.95 * env) + ')');
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.7;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();
        ctx.globalAlpha = env;
        var gs = 22;
        ctx.drawImage(glowSprite(m.warm ? '#ffd2a1' : '#cad7ff'), m.x - gs / 2, m.y - gs / 2, gs, gs);
        ctx.globalAlpha = 1;
      }
    }

    // Satellit: gleichmäßig wandernder Lichtpunkt mit kurzem Aufblitzen
    function drawSat(t, dt) {
      if (!sat) return;
      sat.x += sat.vx * dt;
      sat.y += sat.vy * dt;
      if (sat.x < -20 || sat.x > w + 20 || sat.y < -20 || sat.y > h + 20) { sat = null; return; }
      var glint = Math.max(0, Math.sin(t * 0.9 + sat.ph)) > 0.97 ? 1 : 0;
      ctx.globalAlpha = 0.55 + glint * 0.45;
      ctx.fillStyle = '#fff';
      ctx.fillRect(sat.x, sat.y, 1.8, 1.8);
      ctx.globalAlpha = 1;
    }

    function frame(now) {
      if (!host.isConnected) return;
      requestAnimationFrame(frame);
      var dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      var t = (now - t0) / 1000;
      ctx.clearRect(0, 0, w, h);
      drawStars(t, dt);
      if (now >= nextMeteor) { spawnMeteor(now); nextMeteor = now + rand(4000, 11000); }
      if (!sat && now >= nextSat) {
        var left = Math.random() < 0.5;
        sat = { x: left ? -10 : w + 10, y: rand(h * 0.1, h * 0.5), vx: (left ? 1 : -1) * rand(35, 55), vy: rand(-8, 8), ph: rand(0, 6) };
        nextSat = now + rand(25000, 45000);
      }
      drawMeteors(dt);
      drawSat(t, dt);
    }

    resize();
    host._spxTrigger = function () { spawnMeteor(performance.now()); };
    window.addEventListener('resize', function () {
      if (!host.isConnected) return;
      resize();
      if (reduced) drawStars(0, 0);
    });
    if (reduced) { drawStars(0, 0); return; }
    requestAnimationFrame(frame);
  }

  window.AzbukaSpaceFx = { start: start };
  var existing = document.getElementById('azSpaceFx');
  if (existing) start(existing);
})();
