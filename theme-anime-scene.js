/* Azbuka PRO – Anime-Theme: gemalte Manga-Szene (Himmel, Wolken, Wiese mit hohem Gras, naher Kirschbaum in der Ecke)
   plus Effekte darüber (fliegende Blüten, Lichtstaub, Funkeln, Manga-Speedlines mit Lautmalerei). */
(function () {
  'use strict';

  var TAU = Math.PI * 2, INK = '#2B1740';
  var SFX = ['ドンッ!', 'キラッ!', 'ゴゴゴ', 'パァァっ!', 'バリッ!'];
  var SPARKLE = ['#FFFFFF', '#FFF3B8', '#CDEBFF', '#FFD0E4'];
  var S = 1; // Zeichenmaßstab für scharfe Linien auf Retina-Displays

  function mulberry(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function rand(a, b) { return a + Math.random() * (b - a); }

  function bez(p, t) {
    var u = 1 - t;
    return [u * u * u * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t * t * t * p[3][0],
      u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1]];
  }

  /* ---------- Cel-Shading: Vereinigung von Kreisen in mehreren Tönen ----------
     Jede Ebene ist die gleiche Form, verschoben und nur dort sichtbar, wo schon Farbe liegt (source-atop):
     übrig bleibt ein scharfer Schattenrand wie in Anime-Hintergründen. */
  function celUnion(ctx, cs, tones, offs, sc) {
    var minx = 1e9, miny = 1e9, maxx = -1e9, maxy = -1e9, i;
    cs.forEach(function (c) {
      minx = Math.min(minx, c[0] - c[2]); miny = Math.min(miny, c[1] - c[2]);
      maxx = Math.max(maxx, c[0] + c[2]); maxy = Math.max(maxy, c[1] + c[2]);
    });
    var pad = 4;
    offs.forEach(function (o) { pad = Math.max(pad, Math.abs(o[0]) + Math.abs(o[1]) + 4); });
    pad = Math.ceil(pad);
    var W = Math.ceil(maxx - minx) + pad * 2, H = Math.ceil(maxy - miny) + pad * 2;
    var oc = document.createElement('canvas');
    oc.width = Math.ceil(W * sc); oc.height = Math.ceil(H * sc);
    var o = oc.getContext('2d');
    o.scale(sc, sc);
    function path(dx, dy) {
      o.beginPath();
      cs.forEach(function (c) { var x = c[0] - minx + pad + dx, y = c[1] - miny + pad + dy; o.moveTo(x + c[2], y); o.arc(x, y, c[2], 0, TAU); });
    }
    path(0, 0); o.fillStyle = tones[0]; o.fill();
    o.globalCompositeOperation = 'source-atop';
    for (i = 1; i < tones.length; i++) { path(offs[i - 1][0], offs[i - 1][1]); o.fillStyle = tones[i]; o.fill(); }
    ctx.drawImage(oc, minx - pad, miny - pad, W, H);
  }

  function flower(ctx, x, y, r, rot, fill, stroke) {
    ctx.beginPath();
    for (var k = 0; k < 5; k++) {
      var a = rot + k * TAU / 5, px = x + Math.cos(a) * r * 0.55, py = y + Math.sin(a) * r * 0.55;
      ctx.moveTo(px + r * 0.6, py);
      ctx.arc(px, py, r * 0.6, 0, TAU);
    }
    ctx.fillStyle = fill; ctx.fill();
    ctx.strokeStyle = stroke; ctx.lineWidth = 0.8; ctx.stroke();
    ctx.fillStyle = '#FFD95E';
    ctx.beginPath(); ctx.arc(x, y, r * 0.2, 0, TAU); ctx.fill();
  }

  function setup(cv, w, h) {
    cv.width = Math.round(w * S); cv.height = Math.round(h * S);
    var ctx = cv.getContext('2d');
    ctx.scale(S, S);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    return ctx;
  }

  /* ---------- Wolken ---------- */

  function paintCloud(cv, seed) {
    var W = cv.width, H = cv.height, ctx = cv.getContext('2d'), R = mulberry(seed), cs = [], i;
    var n = 6 + ((R() * 3) | 0), base = H * 0.78;
    for (i = 0; i < n; i++) {
      var t = (i + 0.5) / n, r = H * (0.17 + R() * 0.2) * (1.15 - Math.abs(t - 0.5) * 1.1);
      cs.push([W * (0.12 + 0.76 * t), base - r * 0.65, r]);
    }
    for (i = 0; i < 5; i++) cs.push([W * (0.2 + 0.15 * i), base - H * 0.05, H * 0.13]);
    ctx.beginPath();
    cs.forEach(function (c) { ctx.moveTo(c[0] + c[2], c[1]); ctx.arc(c[0], c[1], c[2], 0, TAU); });
    ctx.strokeStyle = '#9DC7EA'; ctx.lineWidth = 3; ctx.stroke();
    celUnion(ctx, cs, ['#B4D3F0', '#E4F1FC', '#FFFFFF'], [[0, -H * 0.07], [H * 0.03, -H * 0.16]], 1);
  }

  /* ---------- Hügel und Wiese ---------- */

  function ridge(ctx, w, h, baseY, amp, phase, c1, c2) {
    ctx.beginPath();
    ctx.moveTo(-10, h + 10);
    for (var x = -10; x <= w + 10; x += 10) {
      ctx.lineTo(x, baseY + Math.sin(x / w * TAU * 0.9 + phase) * amp + Math.sin(x / w * TAU * 2.3 + phase * 2) * amp * 0.4);
    }
    ctx.lineTo(w + 10, h + 10);
    ctx.closePath();
    var g = ctx.createLinearGradient(0, baseY - amp, 0, h);
    g.addColorStop(0, c1); g.addColorStop(1, c2);
    ctx.fillStyle = g; ctx.fill();
  }

  function paintHills(cv, w, h) {
    var ctx = setup(cv, w, h), R = mulberry(31), i, n;
    ridge(ctx, w, h, h * 0.63, h * 0.03, 0.5, '#C4E8E4', '#A5D8D2');
    ridge(ctx, w, h, h * 0.69, h * 0.035, 2.1, '#A4DBAE', '#7FC792');
    ridge(ctx, w, h, h * 0.77, h * 0.02, 4, '#92D372', '#4FA047');
    // Lichtflecken auf der Wiese
    for (i = 0; i < 7; i++) {
      var lx = R() * w, ly = h * (0.8 + R() * 0.15);
      var lg = ctx.createRadialGradient(lx, ly, 0, lx, ly, w * 0.12);
      lg.addColorStop(0, 'rgba(236,255,170,0.35)'); lg.addColorStop(1, 'rgba(236,255,170,0)');
      ctx.fillStyle = lg; ctx.beginPath(); ctx.ellipse(lx, ly, w * 0.12, w * 0.04, 0, 0, TAU); ctx.fill();
    }
    // Wildblumen, nach vorn größer (Perspektive)
    var cols = ['#FFFFFF', '#FFE27A', '#FFC2DA', '#FFFFFF'];
    for (i = 0, n = Math.round(w * h / 2600); i < n; i++) {
      var y = h * 0.78 + R() * h * 0.2, k = (y - h * 0.78) / (h * 0.2);
      ctx.fillStyle = cols[(R() * cols.length) | 0];
      ctx.beginPath(); ctx.arc(R() * w, y, 0.8 + k * 3.2, 0, TAU); ctx.fill();
    }
  }
  /* ---------- Kirschbaum: nah, in der Ecke angeschnitten ---------- */

  // Äste werden gesammelt und in zwei Durchgängen gemalt: erst alle Tusche-Konturen, dann alle Füllungen –
  // so verschmelzen die Ast-Ansätze ohne Trennlinien.
  var limbs = [];

  function limb(ctx, R, p, w0, w1) {
    var N = 30, C = [], Nn = [], W = [], i;
    for (i = 0; i <= N; i++) {
      var t = i / N, c = bez(p, t), c2 = bez(p, Math.min(1, t + 0.015)), c1 = bez(p, Math.max(0, t - 0.015));
      var dx = c2[0] - c1[0], dy = c2[1] - c1[1], len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
      if (nx < 0) { nx = -nx; ny = -ny; }
      C.push(c); Nn.push([nx, ny]); W.push((w0 + (w1 - w0) * Math.pow(t, 0.8)) / 2);
    }
    limbs.push({ C: C, Nn: Nn, W: W, N: N, w0: w0 });
  }

  function ribbonPath(ctx, s, sc, off) {
    var A = [], B = [], k;
    for (k = 0; k <= s.N; k++) {
      var cx = s.C[k][0] + s.Nn[k][0] * s.W[k] * off, cy = s.C[k][1] + s.Nn[k][1] * s.W[k] * off, hw = s.W[k] * sc;
      A.push([cx + s.Nn[k][0] * hw, cy + s.Nn[k][1] * hw]);
      B.push([cx - s.Nn[k][0] * hw, cy - s.Nn[k][1] * hw]);
    }
    ctx.beginPath();
    ctx.moveTo(A[0][0], A[0][1]);
    for (k = 1; k <= s.N; k++) ctx.lineTo(A[k][0], A[k][1]);
    for (k = s.N; k >= 0; k--) ctx.lineTo(B[k][0], B[k][1]);
    ctx.closePath();
  }

  function drawLimbs(ctx, R) {
    limbs.forEach(function (s) {
      ribbonPath(ctx, s, 1, 0);
      ctx.fillStyle = INK; ctx.fill();
      ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.stroke();
    });
    limbs.forEach(function (s) {
      // Licht kommt von oben rechts: rechte Seite heller
      [[1, 0, '#3F2548'], [0.82, 0.12, '#5C3A63'], [0.55, 0.26, '#7F5588'], [0.26, 0.42, '#B38BB5']].forEach(function (l) {
        ribbonPath(ctx, s, l[0], l[1]); ctx.fillStyle = l[2]; ctx.fill();
      });
      ribbonPath(ctx, s, 1, 0);
      ctx.save(); ctx.clip();
      for (var j = 0, n2 = Math.round(s.N * 0.25 + s.w0 / 10); j < n2; j++) {
        var f = (R() * 2 - 1) * 0.8, k0 = (R() * (s.N - 8)) | 0, len2 = 4 + ((R() * 6) | 0);
        ctx.beginPath();
        for (var k = k0; k <= k0 + len2; k++) {
          var x = s.C[k][0] + s.Nn[k][0] * s.W[k] * f, y = s.C[k][1] + s.Nn[k][1] * s.W[k] * f;
          if (k === k0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = '#2A1632'; ctx.globalAlpha = 0.4; ctx.lineWidth = 1.2; ctx.stroke();
      }
      ctx.restore();
      ctx.globalAlpha = 1;
    });
  }

  function grow(ctx, R, p0, ang, len, w0, depth, tips) {
    var wob = (R() - 0.5) * 0.9, a1 = ang + wob, a2 = ang - wob * 0.6 + (R() - 0.5) * 0.5;
    var p3 = [p0[0] + Math.cos(ang) * len, p0[1] + Math.sin(ang) * len];
    var p = [p0, [p0[0] + Math.cos(a1) * len * 0.35, p0[1] + Math.sin(a1) * len * 0.35],
      [p0[0] + Math.cos(a2) * len * 0.7, p0[1] + Math.sin(a2) * len * 0.7 + len * 0.1], p3];
    var w1 = Math.max(1.8, w0 * 0.42);
    limb(ctx, R, p, w0, w1);
    tips.push({ x: p3[0], y: p3[1], d: depth });
    var mid = bez(p, 0.6);
    tips.push({ x: mid[0], y: mid[1], d: depth + 0.5 });
    if (depth > 0) {
      var kids = 2 + (R() < 0.5 ? 1 : 0);
      for (var k = 0; k < kids; k++) {
        grow(ctx, R, bez(p, 0.4 + 0.5 * k / kids), ang + (k % 2 ? 1 : -1) * (0.4 + R() * 0.5), len * (0.55 + R() * 0.15), w1 * 0.9, depth - 1, tips);
      }
    }
  }

  // Blütenwolke: Kontur, 4-stufiges Cel-Shading, Einzelblüten im Licht, dunkle Punkte im Schatten
  function clump(ctx, R, cx, cy, rc) {
    var n2 = 8 + ((R() * 4) | 0), cs = [], i, a, d;
    for (i = 0; i < n2; i++) {
      a = R() * TAU; d = Math.sqrt(R()) * rc * 0.62;
      cs.push([cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.85, rc * (0.36 + R() * 0.26)]);
    }
    ctx.beginPath();
    cs.forEach(function (c) { ctx.moveTo(c[0] + c[2], c[1]); ctx.arc(c[0], c[1], c[2], 0, TAU); });
    ctx.strokeStyle = '#C94A85'; ctx.lineWidth = 2.4; ctx.stroke();
    celUnion(ctx, cs, ['#EC83B1', '#FFB1CF', '#FFD6E6', '#FFF1F7'],
      [[rc * 0.04, -rc * 0.12], [rc * 0.09, -rc * 0.27], [rc * 0.14, -rc * 0.42]], S);
    var nf = Math.max(6, Math.min(22, Math.round(rc / 5)));
    for (i = 0; i < nf; i++) {
      a = R() * TAU; d = Math.sqrt(R()) * rc * 0.55;
      flower(ctx, cx + rc * 0.15 + Math.cos(a) * d, cy - rc * 0.25 + Math.sin(a) * d, rc * (0.07 + R() * 0.03), R() * TAU, R() < 0.5 ? '#FFFFFF' : '#FFEAF3', '#F08DB8');
    }
    ctx.fillStyle = 'rgba(204,70,130,0.55)';
    for (i = 0; i < Math.round(rc / 6); i++) {
      a = R() * TAU; d = Math.sqrt(R()) * rc * 0.5;
      ctx.beginPath(); ctx.arc(cx - rc * 0.2 + Math.cos(a) * d, cy + rc * 0.3 + Math.sin(a) * d * 0.6, rc * 0.035, 0, TAU); ctx.fill();
    }
    for (i = 0; i < 5; i++) {
      a = R() * TAU;
      flower(ctx, cx + Math.cos(a) * rc * (0.75 + R() * 0.2), cy + Math.sin(a) * rc * (0.7 + R() * 0.2), rc * 0.075, R() * TAU, '#FFD0E2', '#F08DB8');
    }
  }

  function strand(ctx, R, x, y, len) {
    var px = x, py = y;
    for (var s = 1; s <= 8; s++) {
      var nx = x + Math.sin(s * 0.7 + x) * 5, ny = y + len * s / 8;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(nx, ny);
      ctx.strokeStyle = '#5C3A63'; ctx.lineWidth = 1.4; ctx.stroke();
      if (s >= 3 && R() < 0.75) flower(ctx, nx, ny, 4 + R() * 3, R() * TAU, '#FFD6E6', '#F08DB8');
      px = nx; py = ny;
    }
  }

  function paintTree(cv, w, h) {
    var ctx = setup(cv, w, h), R = mulberry(2024), tips = [], u = Math.min(w, h * 1.05), tw = u * 0.24, reach = Math.min(u, w * 0.62);
    limbs = [];
    // Stamm wird von der linken Kante angeschnitten, die Krone wächst in die Bildmitte
    var trunk = [[w * 0.0, h + 20], [-w * 0.05, h * 0.82], [w * 0.12, h * 0.62], [w * 0.06, h * 0.42]];
    limb(ctx, R, trunk, tw, tw * 0.5);
    var T = trunk[3];
    [[-2.95, 0.5], [-2.35, 0.62], [-1.7, 0.78], [-1.1, 1.0], [-0.6, 1.0], [-0.2, 0.8]].forEach(function (m) {
      grow(ctx, R, T, m[0], m[1] * reach, tw * 0.34, 2, tips);
    });
    grow(ctx, R, bez(trunk, 0.62), -0.15, 0.9 * reach, tw * 0.3, 2, tips);
    drawLimbs(ctx, R);
    var spots = [], i;
    tips.forEach(function (t) {
      var isMid = t.d % 1 !== 0;
      if (isMid && R() < 0.25) return;
      spots.push([t.x, t.y, u * ((isMid ? 0.09 : t.d === 0 ? 0.1 : 0.13) + R() * 0.04)]);
    });
    for (i = 0; i < 10; i++) spots.push([T[0] + (R() - 0.3) * u * 0.7, T[1] - R() * u * 0.6, u * (0.12 + R() * 0.05)]);
    spots.sort(function (a, b) { return a[1] - b[1]; }).forEach(function (s) { clump(ctx, R, s[0], s[1], s[2]); });
    spots.forEach(function (s) { if (s[1] > h * 0.25 && R() < 0.35) strand(ctx, R, s[0] + (R() - 0.5) * s[2], s[1] + s[2] * 0.7, u * (0.08 + R() * 0.1)); });
  }

  /* ---------- Hohes Gras ---------- */

  function paintGrass(cv, w, h, cfg) {
    var ctx = setup(cv, w, h), R = mulberry(cfg.seed), blades = [], k = Math.max(h / 800, Math.min(1.7, 900 / w)), i, n;
    for (i = 0, n = Math.round(w * cfg.density); i < n; i++) {
      var x = R() * w * 1.06 - w * 0.03, boost = 1 + Math.max(0, 0.5 - x / w) * cfg.treeBoost;
      var hgt = h * (cfg.h0 + R() * (cfg.h1 - cfg.h0)) * boost;
      blades.push({ x: x, y: h * (cfg.y0 + R() * (cfg.y1 - cfg.y0)), h: hgt, w: (cfg.w0 + R() * (cfg.w1 - cfg.w0)) * k,
        lean: (R() - 0.35) * hgt * 0.35, pal: cfg.pal[(R() * cfg.pal.length) | 0] });
    }
    blades.sort(function (a, b) { return a.y - b.y; }).forEach(function (b) {
      var tx = b.x + b.lean, ty = b.y - b.h;
      ctx.beginPath();
      ctx.moveTo(b.x - b.w / 2, b.y);
      ctx.quadraticCurveTo(b.x - b.w / 2 + b.lean * 0.15, b.y - b.h * 0.55, tx, ty);
      ctx.quadraticCurveTo(b.x + b.w / 2 + b.lean * 0.55, b.y - b.h * 0.5, b.x + b.w / 2, b.y);
      ctx.closePath();
      var g = ctx.createLinearGradient(0, b.y, 0, ty);
      g.addColorStop(0, b.pal[0]); g.addColorStop(1, b.pal[1]);
      ctx.fillStyle = g; ctx.fill();
      if (cfg.ink) { ctx.strokeStyle = 'rgba(20,64,40,0.6)'; ctx.lineWidth = 1; ctx.stroke(); }
      if (b.h > 30) {
        ctx.beginPath();
        ctx.moveTo(b.x + b.w * 0.15, b.y);
        ctx.quadraticCurveTo(b.x + b.lean * 0.35, b.y - b.h * 0.5, tx, ty + 3);
        ctx.strokeStyle = 'rgba(255,255,200,0.38)'; ctx.lineWidth = Math.max(1, b.w * 0.25); ctx.stroke();
      }
    });
    // Blumen zwischen dem Gras
    var fc = ['#FFFFFF', '#FFC2DA', '#FFE27A'];
    for (i = 0; i < (cfg.flowers || 0); i++) {
      var fx = R() * w, fy = h * (cfg.y0 + R() * (cfg.y1 - cfg.y0)), top = fy - h * (0.1 + R() * 0.2);
      ctx.beginPath(); ctx.moveTo(fx, fy); ctx.quadraticCurveTo(fx + (R() - 0.5) * 20, (fy + top) / 2, fx + (R() - 0.5) * 12, top);
      ctx.strokeStyle = '#2F7A3F'; ctx.lineWidth = 1.6 * k; ctx.stroke();
      flower(ctx, fx + (R() - 0.5) * 12, top, (5 + R() * 4) * k, R() * TAU, fc[(R() * fc.length) | 0], 'rgba(60,60,90,0.5)');
    }
  }

  /* ---------- Einbindung ---------- */

  function cloudTag(top, width, dur, delay, op, seed) {
    return '<canvas class="anb-cloud" data-w="' + width + '" data-seed="' + seed + '" style="top:' + top + '%;opacity:' + op +
      ';animation-duration:' + dur + 's;animation-delay:' + delay + 's"></canvas>';
  }

  function bgHtml() {
    // Filter #azPencil: wackelige Zweitlinie an den Panel-Rahmen
    return '<svg class="anb-defs" width="0" height="0" aria-hidden="true"><defs>' +
      '<filter id="azPencil" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3.2"/></filter>' +
      '</defs></svg>' +
      '<div class="anb-sky"></div><div class="anb-sun"></div>' +
      cloudTag(6, 360, 120, -20, 0.95, 11) + cloudTag(18, 240, 160, -90, 0.8, 23) + cloudTag(30, 440, 100, -55, 0.9, 37) + cloudTag(42, 280, 140, -10, 0.7, 41) +
      '<canvas class="anb-layer anb-hills"></canvas><canvas class="anb-layer anb-tree"></canvas>' +
      '<canvas class="anb-layer anb-grass-back"></canvas><canvas class="anb-layer anb-grass-front"></canvas>' +
      '<div class="anb-light"></div>';
  }

  function paint() {
    var bg = document.getElementById('azAnimeBg');
    if (!bg) return;
    var w = window.innerWidth, h = window.innerHeight;
    S = Math.min(window.devicePixelRatio || 1, 1.5);
    bg._paintSize = [w, h];
    bg.querySelectorAll('.anb-cloud').forEach(function (c) {
      var cw = Math.min(+c.dataset.w, w * 0.9);
      c.width = Math.round(cw); c.height = Math.round(cw * 0.42); c.style.width = cw + 'px';
      paintCloud(c, +c.dataset.seed);
    });
    paintHills(bg.querySelector('.anb-hills'), w, h);
    paintTree(bg.querySelector('.anb-tree'), w, h);
    paintGrass(bg.querySelector('.anb-grass-back'), w, h, { seed: 5, density: 0.9, y0: 0.8, y1: 0.93, h0: 0.05, h1: 0.12, w0: 3, w1: 6, treeBoost: 0.5,
      pal: [['#2F7F43', '#9BDD74'], ['#3A8F4A', '#B7E884'], ['#2B7040', '#86CF6C']], ink: false, flowers: 0 });
    paintGrass(bg.querySelector('.anb-grass-front'), w, h, { seed: 9, density: 0.38, y0: 0.95, y1: 1.03, h0: 0.14, h1: 0.34, w0: 5, w1: 10, treeBoost: 0.9,
      pal: [['#1F6A38', '#A5E06E'], ['#2A7C41', '#C8F08A'], ['#1B5C33', '#8ED16A'], ['#3B8A45', '#E4F59A']], ink: true, flowers: 26 });
  }

  var repaintTimer = 0;
  window.addEventListener('resize', function () {
    var bg = document.getElementById('azAnimeBg');
    if (!bg || !bg._paintSize) return;
    clearTimeout(repaintTimer);
    repaintTimer = setTimeout(function () {
      var s = bg._paintSize;
      if (Math.abs(window.innerWidth - s[0]) > s[0] * 0.15 || Math.abs(window.innerHeight - s[1]) > s[1] * 0.25) paint();
    }, 250);
  });

  /* ---------- Effekte: fliegende Blüten, Lichtstaub, Funkeln, Speedlines ---------- */

  // Blütenblatt mit Verlauf, Kontur, Mittelrippe und Glanzlicht (einmal gezeichnet, dann nur noch kopiert)
  function petalSprite(c1, c2) {
    var P = 64, c = document.createElement('canvas');
    c.width = c.height = P;
    var g = c.getContext('2d');
    g.translate(P / 2, P / 2);
    g.beginPath();
    g.moveTo(0, -26);
    g.bezierCurveTo(10, -34, 24, -26, 22, -6);
    g.bezierCurveTo(20, 12, 8, 24, 0, 30);
    g.bezierCurveTo(-8, 24, -20, 12, -22, -6);
    g.bezierCurveTo(-24, -26, -10, -34, 0, -26);
    g.closePath();
    var gr = g.createLinearGradient(0, -26, 0, 30);
    gr.addColorStop(0, c1); gr.addColorStop(1, c2);
    g.fillStyle = gr; g.fill();
    g.lineWidth = 1.4; g.strokeStyle = 'rgba(222,92,150,0.55)'; g.stroke();
    g.beginPath(); g.moveTo(0, -18); g.quadraticCurveTo(1, 4, 0, 24);
    g.lineWidth = 1; g.strokeStyle = 'rgba(222,92,150,0.35)'; g.stroke();
    g.beginPath(); g.ellipse(-6, -8, 5, 9, -0.3, 0, TAU);
    g.fillStyle = 'rgba(255,255,255,0.4)'; g.fill();
    return c;
  }

  function glowSprite() {
    var P = 32, c = document.createElement('canvas');
    c.width = c.height = P;
    var g = c.getContext('2d'), gr = g.createRadialGradient(P / 2, P / 2, 0, P / 2, P / 2, P / 2);
    gr.addColorStop(0, 'rgba(255,255,230,1)'); gr.addColorStop(0.35, 'rgba(255,250,200,0.45)'); gr.addColorStop(1, 'rgba(255,250,200,0)');
    g.fillStyle = gr; g.fillRect(0, 0, P, P);
    return c;
  }

  function sparkle(ctx, x, y, r, rot) {
    ctx.save();
    ctx.translate(x, y); ctx.rotate(rot);
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.quadraticCurveTo(0, 0, 0, r);
    ctx.quadraticCurveTo(0, 0, -r, 0);
    ctx.quadraticCurveTo(0, 0, 0, -r);
    ctx.fill();
    ctx.restore();
  }

  function start(host) {
    if (!host || host._anx) return;
    var cv = host.querySelector('canvas');
    if (!cv) return;
    host._anx = true;
    // Szene erst nach dem ersten Frame malen, damit das Theme sofort reagiert
    setTimeout(paint, 30);
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var ctx = cv.getContext('2d'), glow = glowSprite();
    var sprites = [petalSprite('#FFFFFF', '#FFC4DA'), petalSprite('#FFF0F6', '#FF9EC4'), petalSprite('#FFE4EF', '#FFB0CF')];
    var w = 0, h = 0, petals = [], motes = [], sparkles = [], burst = null;
    var t0 = performance.now(), last = t0, nextSparkle = 0, nextBurst = t0 + rand(8000, 13000);

    // Blüten wehen vom Baum (links oben) nach rechts unten
    function newPetal(anywhere) {
      var d = Math.random();
      return {
        x: anywhere ? rand(-0.05 * w, w * 0.95) : rand(-0.15 * w, 0.3 * w), y: anywhere ? rand(-20, h * 0.95) : rand(-0.05 * h, 0.5 * h),
        d: d, s: 6 + 14 * Math.pow(d, 1.6), vx: rand(50, 120) * (0.7 + d * 0.8), vy: rand(22, 55) * (0.7 + d * 0.8),
        ph: rand(0, TAU), amp: rand(14, 36), fr: rand(0.5, 1.2), rot: rand(0, TAU), rs: rand(-2, 2), flip: rand(0, TAU), fs: rand(1.5, 4),
        sp: sprites[(Math.random() * sprites.length) | 0], a: d > 0.85 ? 0.55 : 0.92
      };
    }

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      var regen = !petals.length || Math.abs(window.innerWidth - w) > w * 0.2 || Math.abs(window.innerHeight - h) > h * 0.4;
      w = window.innerWidth; h = window.innerHeight;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!regen) return;
      petals = [];
      for (var i = 0, n2 = Math.max(30, Math.min(Math.round(w * h / 9000), 110)); i < n2; i++) petals.push(newPetal(true));
      petals.sort(function (a, b) { return a.d - b.d; });
      motes = [];
      for (i = 0; i < 28; i++) motes.push({ x: rand(0, w), y: rand(0, h), r: rand(5, 14), ph: rand(0, TAU), sp: rand(0.4, 1.2), v: rand(4, 14) });
    }

    function drawPetal(p) {
      var flip = 0.22 + Math.abs(Math.cos(p.flip)) * 0.78;
      ctx.globalAlpha = p.a;
      ctx.save();
      ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(flip, 1);
      ctx.drawImage(p.sp, -p.s, -p.s * 1.1, p.s * 2, p.s * 2.2);
      ctx.restore();
    }

    function drawBurst(env) {
      var cx = w / 2, cy = h / 2, diag = Math.hypot(w, h), r0 = diag * 0.3, r1 = diag * 0.56;
      ctx.fillStyle = 'rgba(255,255,255,' + (0.35 * env) + ')';
      burst.lines.forEach(function (L) {
        var inner = r0 + L.in * diag;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(L.a) * inner, cy + Math.sin(L.a) * inner);
        ctx.lineTo(cx + Math.cos(L.a - L.wd) * r1, cy + Math.sin(L.a - L.wd) * r1);
        ctx.lineTo(cx + Math.cos(L.a + L.wd) * r1, cy + Math.sin(L.a + L.wd) * r1);
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
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
      ctx.lineWidth = size * 0.2; ctx.strokeStyle = '#1B1038';
      ctx.strokeText(burst.sfx, 4, 5);
      ctx.fillStyle = '#FF6FA8'; ctx.fillText(burst.sfx, 4, 5);
      ctx.strokeText(burst.sfx, 0, 0);
      ctx.fillStyle = '#FFE066'; ctx.fillText(burst.sfx, 0, 0);
      ctx.restore();
    }

    function frame(now) {
      if (!host.isConnected) return;
      requestAnimationFrame(frame);
      var dt = Math.min(0.05, (now - last) / 1000), t = (now - t0) / 1000;
      last = now;
      ctx.clearRect(0, 0, w, h);

      // Lichtstaub schwebt langsam nach oben
      motes.forEach(function (m) {
        m.y -= m.v * dt; m.x += Math.sin(t * m.sp + m.ph) * 6 * dt;
        if (m.y < -20) { m.y = h + 20; m.x = rand(0, w); }
        ctx.globalAlpha = 0.25 + 0.3 * (0.5 + 0.5 * Math.sin(t * m.sp * 2 + m.ph));
        ctx.drawImage(glow, m.x - m.r, m.y - m.r, m.r * 2, m.r * 2);
      });

      // Wind mit Böen
      var gust = Math.pow(Math.max(0, Math.sin(t * 0.17)), 3);
      petals.forEach(function (p) {
        p.x += (p.vx * (1 + gust * 1.2) + Math.cos(t * p.fr + p.ph) * p.amp * 0.5) * dt;
        p.y += (p.vy * (1 + gust * 0.5) + Math.sin(t * p.fr * 1.3 + p.ph) * p.amp * 0.6) * dt;
        p.rot += p.rs * dt;
        p.flip += p.fs * dt;
        if (p.x > w + 40 || p.y > h + 40) { var np = newPetal(false); np.d = p.d; np.s = p.s; np.a = p.a; petals[petals.indexOf(p)] = np; }
        drawPetal(p);
      });
      ctx.globalAlpha = 1;

      // Funkeln
      if (now >= nextSparkle && sparkles.length < 14) {
        sparkles.push({ x: rand(0, w), y: rand(0, h * 0.7), age: 0, life: rand(0.9, 1.6), r: rand(5, 12), rot: rand(-0.3, 0.3), c: SPARKLE[(Math.random() * SPARKLE.length) | 0] });
        nextSparkle = now + rand(150, 380);
      }
      for (var i = sparkles.length - 1; i >= 0; i--) {
        var sp = sparkles[i];
        sp.age += dt;
        if (sp.age > sp.life) { sparkles.splice(i, 1); continue; }
        var env = Math.sin(Math.PI * sp.age / sp.life);
        ctx.fillStyle = sp.c; ctx.globalAlpha = 0.9 * env;
        sparkle(ctx, sp.x, sp.y, sp.r * (0.4 + 0.6 * env), sp.rot + sp.age * 0.8);
      }
      ctx.globalAlpha = 1;

      // Speedlines-Burst mit Lautmalerei
      if (!burst && now >= nextBurst) {
        burst = { age: 0, life: 0.7, lines: [], sfx: SFX[(Math.random() * SFX.length) | 0], sx: rand(0.22, 0.78), sy: rand(0.2, 0.36), rot: rand(-0.22, 0.22) };
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
    host._anxTrigger = function () { nextBurst = 0; };
    window.addEventListener('resize', function () {
      if (!host.isConnected) return;
      resize();
      if (reduced) petals.forEach(drawPetal);
    });
    if (reduced) { petals.forEach(drawPetal); return; }
    requestAnimationFrame(frame);
  }

  window.AzbukaAnimeFx = { start: start, bgHtml: bgHtml, paint: paint };
  var existing = document.getElementById('azAnimeFx');
  if (existing) start(existing);
})();
