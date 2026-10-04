/* Azbuka PRO – Gewitter-Effekte (Regen + Blitze) auf einem Canvas in #azStormFx.
   Wird von theme-system.js gestartet, sobald das Gewitter-Theme aktiv ist; endet, wenn der Layer entfernt wird. */
(function () {
  'use strict';

  var SLANT = 0.18; // Windneigung: seitlicher Versatz pro Pixel Fallweg
  // Helligkeit des Blitzes nach dem Einschlag (ms, 0..1): Hauptblitz + Nachflackern
  var FLICKER = [[0, 0], [90, 1], [140, 0.3], [190, 1], [250, 0.25], [320, 0.7], [430, 0.15], [620, 0]];

  function rand(a, b) { return a + Math.random() * (b - a); }

  // Mittelpunkt-Verschiebung: erzeugt einen zackigen, natürlichen Blitzverlauf
  function jag(x1, y1, x2, y2, disp, iter) {
    var pts = [[x1, y1], [x2, y2]];
    for (var i = 0; i < iter; i++) {
      var next = [pts[0]];
      for (var j = 1; j < pts.length; j++) {
        var a = pts[j - 1], b = pts[j];
        var dx = b[0] - a[0], dy = b[1] - a[1];
        var len = Math.sqrt(dx * dx + dy * dy) || 1;
        var off = rand(-disp, disp);
        next.push([(a[0] + b[0]) / 2 - dy / len * off, (a[1] + b[1]) / 2 + dx / len * off]);
        next.push(b);
      }
      pts = next;
      disp *= 0.55;
    }
    return pts;
  }

  function branchFrom(lines, pts, idxMin, idxMax, count, wMin, wMax, lenMin, lenMax, at0, atScale) {
    var n = pts.length;
    for (var i = 0; i < count; i++) {
      var idx = Math.floor(rand(n * idxMin, n * idxMax));
      var p = pts[idx], q = pts[Math.min(n - 1, idx + 6)];
      var ang = Math.atan2(q[1] - p[1], q[0] - p[0]) + (Math.random() < 0.5 ? -1 : 1) * rand(0.35, 0.95);
      var len = rand(lenMin, lenMax);
      var bp = jag(p[0], p[1], p[0] + Math.cos(ang) * len, p[1] + Math.sin(ang) * len, len * 0.18, 5);
      lines.push({ pts: bp, w: rand(wMin, wMax), at: at0 + idx / (n - 1) * atScale });
    }
  }

  function makeBolt(w, h) {
    var x1 = rand(w * 0.12, w * 0.88);
    var main = jag(x1, -10, x1 + rand(-w * 0.18, w * 0.18), rand(h * 0.5, h * 0.88), h * 0.07, 7);
    var lines = [{ pts: main, w: 2.4, at: 0 }];
    branchFrom(lines, main, 0.15, 0.8, Math.floor(rand(3, 7)), 1.0, 1.7, h * 0.08, h * 0.28, 0, 1);
    // Nebenäste der Äste
    var firstBranches = lines.slice(1);
    firstBranches.forEach(function (b) {
      if (Math.random() < 0.5 && b.pts.length > 12) {
        branchFrom(lines, b.pts, 0.3, 0.8, 1, 0.6, 1.0, h * 0.04, h * 0.12, b.at, 0.1);
      }
    });
    return { lines: lines, x: x1 };
  }

  function intensity(t) {
    if (t <= 0) return 0;
    for (var i = 1; i < FLICKER.length; i++) {
      if (t <= FLICKER[i][0]) {
        var a = FLICKER[i - 1], b = FLICKER[i];
        return a[1] + (b[1] - a[1]) * (t - a[0]) / (b[0] - a[0]);
      }
    }
    return 0;
  }

  function strokeLine(ctx, pts, upto) {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i <= upto; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.stroke();
  }

  function drawBolt(ctx, bolt, reveal, alpha) {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    bolt.lines.forEach(function (L) {
      if (reveal < L.at) return;
      var frac = L.at === 0 ? reveal : Math.min(1, (reveal - L.at) * 4);
      var upto = Math.max(1, Math.floor(frac * (L.pts.length - 1)));
      ctx.shadowBlur = 0;
      ctx.lineWidth = L.w * 7;
      ctx.strokeStyle = 'rgba(110,130,255,' + (0.10 * alpha) + ')';
      strokeLine(ctx, L.pts, upto);
      ctx.lineWidth = L.w * 3.2;
      ctx.strokeStyle = 'rgba(165,182,255,' + (0.35 * alpha) + ')';
      strokeLine(ctx, L.pts, upto);
      ctx.shadowColor = 'rgba(150,170,255,1)';
      ctx.shadowBlur = 14;
      ctx.lineWidth = L.w;
      ctx.strokeStyle = 'rgba(255,255,255,' + alpha + ')';
      strokeLine(ctx, L.pts, upto);
    });
    ctx.shadowBlur = 0;
  }

  function start(host) {
    if (!host || host._sfx) return;
    var cv = host.querySelector('canvas');
    if (!cv) return;
    host._sfx = true;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var ctx = cv.getContext('2d');
    var w = 0, h = 0, layers = [];
    var strike = null, nextStrike = performance.now() + rand(1500, 3500), last = performance.now();

    var LAYER_DEFS = [
      { share: 1.2, speed: [700, 900], len: [8, 14], lw: 0.8, alpha: 0.18 },
      { share: 0.8, speed: [1000, 1300], len: [14, 22], lw: 1, alpha: 0.28 },
      { share: 0.4, speed: [1500, 1900], len: [22, 34], lw: 1.3, alpha: 0.42 }
    ];

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var base = Math.min(w * h / 12000, 240);
      layers = LAYER_DEFS.map(function (d) {
        var drops = [];
        for (var i = 0; i < Math.round(base * d.share); i++) {
          drops.push({ x: rand(0, w + h * SLANT), y: rand(-h, h), v: rand(d.speed[0], d.speed[1]), l: rand(d.len[0], d.len[1]) });
        }
        return { def: d, drops: drops };
      });
    }

    function newStrike(now) {
      var sheet = Math.random() < 0.4; // Wetterleuchten ohne sichtbaren Blitz
      var bolt = sheet ? null : makeBolt(w, h);
      strike = { bolt: bolt, x: bolt ? bolt.x : rand(w * 0.1, w * 0.9), t0: now, quick: false, repeat: !sheet && Math.random() < 0.45 };
    }

    function frame(now) {
      if (!host.isConnected) return;
      requestAnimationFrame(frame);
      var dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, w, h);

      if (!strike && now >= nextStrike) newStrike(now, false);

      var flash = 0, t = 0;
      if (strike) {
        t = now - strike.t0;
        flash = intensity(t);
        if (t > FLICKER[FLICKER.length - 1][0]) {
          if (strike.repeat) {
            // Nachschlag im selben Blitzkanal
            strike = { bolt: strike.bolt, x: strike.x, t0: now + rand(120, 320), quick: true, repeat: false };
          } else {
            strike = null;
            nextStrike = now + rand(3500, 9500);
          }
          flash = 0;
        }
      }

      // Himmelsaufhellung
      if (flash > 0.01 && strike) {
        var g = ctx.createRadialGradient(strike.x, 0, 0, strike.x, 0, Math.max(w, h) * 0.95);
        g.addColorStop(0, 'rgba(185,198,255,' + (0.42 * flash) + ')');
        g.addColorStop(0.45, 'rgba(100,112,230,' + (0.16 * flash) + ')');
        g.addColorStop(1, 'rgba(60,70,180,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = 'rgba(200,210,255,' + (0.06 * flash) + ')';
        ctx.fillRect(0, 0, w, h);
      }

      // Regen: pro Tiefenebene ein Strich-Pfad
      var boost = 1 + flash * 1.3;
      layers.forEach(function (L) {
        var d = L.def;
        ctx.lineWidth = d.lw;
        ctx.strokeStyle = 'rgba(190,205,255,' + Math.min(1, d.alpha * boost) + ')';
        ctx.lineCap = 'round';
        ctx.beginPath();
        L.drops.forEach(function (p) {
          p.y += p.v * dt;
          p.x -= p.v * dt * SLANT;
          if (p.y - p.l > h || p.x < -40) { p.y = -p.l; p.x = rand(0, w + h * SLANT); }
          ctx.moveTo(p.x + p.l * SLANT, p.y - p.l);
          ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
      });

      // Blitz
      if (strike && strike.bolt && flash > 0.01) {
        var reveal = strike.quick ? 1 : Math.min(1, t / 90);
        drawBolt(ctx, strike.bolt, reveal, Math.min(1, flash));
      }
    }

    resize();
    host._sfxTrigger = function () { if (!strike) nextStrike = 0; };
    window.addEventListener('resize', function () { if (host.isConnected) resize(); });
    requestAnimationFrame(frame);
  }

  window.AzbukaStormFx = { start: start };
  var existing = document.getElementById('azStormFx');
  if (existing) start(existing);
})();
