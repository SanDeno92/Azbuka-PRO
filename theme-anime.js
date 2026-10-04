/* Azbuka PRO – Anime-Theme: Hintergrund-Markup (Wolken, Hügel, Sakura-Ast als Buntstift-Zeichnung)
   und Canvas-Effekte (Blüten, Funkeln, Komet, Manga-Speedlines) in #azAnimeFx. */
(function () {
  'use strict';

  var TAU = Math.PI * 2;
  var PETAL_FILL = ['#FFD1E3', '#FFC2DA', '#FFB3D1', '#FFE0EC'];
  var SPARKLE = ['#FFFFFF', '#FFE9A8', '#BDEBFF', '#FFC6E0'];
  var SFX = ['ドンッ!', 'キラッ!', 'ゴゴゴ', 'パァァっ!', 'バリッ!'];

  function rand(a, b) { return a + Math.random() * (b - a); }

  /* ---------- Hintergrund (gemalt in theme-anime-art.js) ---------- */

  function bgHtml() { return window.AzbukaAnimeArt ? window.AzbukaAnimeArt.bgHtml() : ''; }

  /* ---------- Canvas-Effekte ---------- */

  function sparkle(ctx, x, y, r, rot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.quadraticCurveTo(0, 0, 0, r);
    ctx.quadraticCurveTo(0, 0, -r, 0);
    ctx.quadraticCurveTo(0, 0, 0, -r);
    ctx.fill();
    ctx.restore();
  }

  function drawPetal(ctx, p) {
    var s = p.s, flip = 0.25 + Math.abs(Math.cos(p.flip)) * 0.75;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.scale(flip, 1);
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.bezierCurveTo(s * 1.05, -s * 0.7, s * 0.85, s * 0.75, 0, s);
    ctx.bezierCurveTo(-s * 0.85, s * 0.75, -s * 1.05, -s * 0.7, 0, -s);
    ctx.fillStyle = p.fill;
    ctx.fill();
    // Buntstift-Konturen: Rand und feine Mittelrippe
    ctx.lineWidth = 0.9;
    ctx.strokeStyle = 'rgba(255,111,168,0.75)';
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.55);
    ctx.lineTo(0, s * 0.7);
    ctx.lineWidth = 0.6;
    ctx.strokeStyle = 'rgba(255,111,168,0.4)';
    ctx.stroke();
    ctx.restore();
  }

  function start(host) {
    if (!host || host._anx) return;
    var cv = host.querySelector('canvas');
    if (!cv) return;
    host._anx = true;
    // Hintergrundbild erst nach dem ersten Frame malen, damit das Theme sofort reagiert
    setTimeout(function () { if (window.AzbukaAnimeArt) window.AzbukaAnimeArt.paint(); }, 30);
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var ctx = cv.getContext('2d');
    var w = 0, h = 0, petals = [], sparkles = [], comet = null, burst = null;
    var t0 = performance.now(), last = t0;
    var nextSparkle = 0, nextComet = t0 + rand(5000, 9000), nextBurst = t0 + rand(7000, 12000);

    function newPetal(anywhere) {
      return {
        x: rand(0, w + 200), y: anywhere ? rand(-20, h) : rand(-40, -10),
        s: rand(4.5, 9), vy: rand(28, 62), ph: rand(0, TAU), amp: rand(15, 40), fr: rand(0.4, 1),
        rot: rand(0, TAU), rs: rand(-1.5, 1.5), flip: rand(0, TAU), fs: rand(1.5, 4),
        fill: PETAL_FILL[Math.floor(rand(0, PETAL_FILL.length))]
      };
    }

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      var regen = !petals.length || Math.abs(window.innerWidth - w) > w * 0.2 || Math.abs(window.innerHeight - h) > h * 0.4;
      w = window.innerWidth;
      h = window.innerHeight;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!regen) return;
      petals = [];
      for (var i = 0, n = Math.max(24, Math.min(Math.round(w * h / 14000), 80)); i < n; i++) petals.push(newPetal(true));
    }

    function drawBurst(env) {
      // Manga-Speedlines: schmale Dreiecke, die auf die Bildmitte zeigen
      var cx = w / 2, cy = h / 2, diag = Math.hypot(w, h), r0 = diag * 0.3, r1 = diag * 0.56;
      ctx.fillStyle = 'rgba(255,255,255,' + (0.3 * env) + ')';
      burst.lines.forEach(function (L) {
        var inner = r0 + L.in * diag;
        var ax = cx + Math.cos(L.a) * inner, ay = cy + Math.sin(L.a) * inner;
        var bx = cx + Math.cos(L.a - L.wd) * r1, by = cy + Math.sin(L.a - L.wd) * r1;
        var ex = cx + Math.cos(L.a + L.wd) * r1, ey = cy + Math.sin(L.a + L.wd) * r1;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.lineTo(ex, ey);
        ctx.closePath();
        ctx.fill();
      });
      drawSfx(env);
    }

    // Manga-Lautmalerei: dicke Umrisse, Doppelschatten, springt mit Überschwung ein
    function drawSfx(env) {
      var a = burst.age / burst.life, pop = a < 0.2 ? 1 + 2.2 * Math.pow(a / 0.2 - 1, 3) + 1.2 * Math.pow(a / 0.2 - 1, 2) : 1;
      var size = Math.min(w * 0.17, 92) * pop;
      ctx.save();
      ctx.translate(w * burst.sx, h * burst.sy);
      ctx.rotate(burst.rot);
      ctx.globalAlpha = Math.min(1, env * 2);
      ctx.font = 'italic 900 ' + size + 'px "Yu Gothic UI","Yu Gothic","Meiryo","Hiragino Kaku Gothic ProN","Noto Sans JP",sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineJoin = 'round';
      ctx.lineWidth = size * 0.2;
      ctx.strokeStyle = '#1B1038';
      ctx.strokeText(burst.sfx, 4, 5);
      ctx.fillStyle = '#FF6FA8';
      ctx.fillText(burst.sfx, 4, 5);
      ctx.strokeText(burst.sfx, 0, 0);
      ctx.fillStyle = '#FFE066';
      ctx.fillText(burst.sfx, 0, 0);
      ctx.restore();
    }

    function frame(now) {
      if (!host.isConnected) return;
      requestAnimationFrame(frame);
      var dt = Math.min(0.05, (now - last) / 1000), t = (now - t0) / 1000;
      last = now;
      ctx.clearRect(0, 0, w, h);

      // Wind: gleichmäßiger Zug nach links mit gelegentlichen Böen
      var gust = Math.pow(Math.max(0, Math.sin(t * 0.17)), 3);
      var wind = 28 + 18 * Math.sin(t * 0.31) + 70 * gust;
      petals.forEach(function (p) {
        p.y += p.vy * dt * (1 + gust * 0.4);
        p.x += (-wind * (p.s / 7) + Math.sin(t * p.fr + p.ph) * p.amp * 0.6) * dt;
        p.rot += p.rs * dt;
        p.flip += p.fs * dt;
        if (p.y > h + 20 || p.x < -30) { var np = newPetal(false); np.x = rand(w * 0.2, w + 120); petals[petals.indexOf(p)] = np; }
        drawPetal(ctx, p);
      });

      // Funkeln
      if (now >= nextSparkle && sparkles.length < 16) {
        sparkles.push({ x: rand(0, w), y: rand(0, h * 0.8), age: 0, life: rand(0.9, 1.6), r: rand(5, 13), rot: rand(-0.3, 0.3), c: SPARKLE[Math.floor(rand(0, SPARKLE.length))] });
        nextSparkle = now + rand(120, 320);
      }
      for (var i = sparkles.length - 1; i >= 0; i--) {
        var sp = sparkles[i];
        sp.age += dt;
        if (sp.age > sp.life) { sparkles.splice(i, 1); continue; }
        var env = Math.sin(Math.PI * sp.age / sp.life);
        ctx.fillStyle = sp.c;
        ctx.globalAlpha = 0.9 * env;
        sparkle(ctx, sp.x, sp.y, sp.r * (0.4 + 0.6 * env), sp.rot + sp.age * 0.8);
      }
      ctx.globalAlpha = 1;

      // Komet mit Pastell-Schweif und Funkenspur
      if (!comet && now >= nextComet) {
        var dir = Math.random() < 0.5 ? 1 : -1, v = rand(700, 1000), ang = rand(0.4, 0.7);
        comet = { x: dir > 0 ? rand(-40, w * 0.5) : rand(w * 0.5, w + 40), y: rand(-20, h * 0.3), vx: Math.cos(ang) * v * dir, vy: Math.sin(ang) * v, age: 0, life: rand(0.9, 1.3) };
        nextComet = now + rand(10000, 17000);
      }
      if (comet) {
        comet.age += dt;
        comet.x += comet.vx * dt;
        comet.y += comet.vy * dt;
        if (comet.age > comet.life) comet = null;
        else {
          var ce = Math.sin(Math.PI * comet.age / comet.life), sp2 = Math.hypot(comet.vx, comet.vy);
          var tx = comet.x - comet.vx / sp2 * 230 * ce, ty = comet.y - comet.vy / sp2 * 230 * ce;
          var g = ctx.createLinearGradient(tx, ty, comet.x, comet.y);
          g.addColorStop(0, 'rgba(255,180,220,0)');
          g.addColorStop(0.6, 'rgba(255,214,232,' + (0.55 * ce) + ')');
          g.addColorStop(1, 'rgba(255,255,255,' + ce + ')');
          ctx.strokeStyle = g;
          ctx.lineWidth = 3;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(comet.x, comet.y);
          ctx.stroke();
          ctx.fillStyle = '#fff';
          ctx.globalAlpha = ce;
          sparkle(ctx, comet.x, comet.y, 14, comet.age * 5);
          ctx.globalAlpha = 1;
          if (Math.random() < 0.5 && sparkles.length < 24) sparkles.push({ x: comet.x - comet.vx * 0.04 + rand(-6, 6), y: comet.y - comet.vy * 0.04 + rand(-6, 6), age: 0, life: 0.7, r: rand(3, 7), rot: 0, c: '#FFE9A8' });
        }
      }

      // Speedlines-Burst
      if (!burst && now >= nextBurst) {
        burst = { age: 0, life: 0.7, lines: [], sfx: SFX[Math.floor(rand(0, SFX.length))], sx: rand(0.22, 0.78), sy: rand(0.2, 0.36), rot: rand(-0.22, 0.22) };
        for (var k = 0; k < 52; k++) burst.lines.push({ a: rand(0, TAU), wd: rand(0.004, 0.018), in: rand(0, 0.08) });
        nextBurst = now + rand(14000, 22000);
      }
      if (burst) {
        burst.age += dt;
        if (burst.age > burst.life) burst = null;
        else drawBurst(Math.sin(Math.PI * burst.age / burst.life));
      }
    }

    resize();
    host._anxTrigger = function () { nextComet = 0; nextBurst = 0; };
    window.addEventListener('resize', function () {
      if (!host.isConnected) return;
      resize();
      if (reduced) petals.forEach(function (p) { drawPetal(ctx, p); });
    });
    if (reduced) { petals.forEach(function (p) { drawPetal(ctx, p); }); return; }
    requestAnimationFrame(frame);
  }

  window.AzbukaAnimeFx = { start: start, bgHtml: bgHtml };
  var existing = document.getElementById('azAnimeFx');
  if (existing) start(existing);
})();
