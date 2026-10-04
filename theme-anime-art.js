/* Azbuka PRO – Anime-Theme: Hintergrundbild, das zur Laufzeit Strich für Strich wie mit Buntstiften gemalt wird.
   Himmel-Schraffur, Fuji, Hügel, großer Kirschblütenbaum, Cel-Shading-Wolken, Sakura-Ast. */
(function () {
  'use strict';

  var TAU = Math.PI * 2;

  function mulberry(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  /* ---------- Buntstift-Werkzeuge ---------- */

  // Wackelige Linie aus vielen kurzen Segmenten
  function pline(ctx, R, x1, y1, x2, y2, color, lw, alpha, wob) {
    var dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy) || 1;
    var n = Math.max(2, Math.round(len / 14)), nx = -dy / len, ny = dx / len;
    ctx.beginPath();
    ctx.moveTo(x1 + nx * (R() - 0.5) * wob, y1 + ny * (R() - 0.5) * wob);
    for (var i = 1; i <= n; i++) {
      var t = i / n;
      ctx.lineTo(x1 + dx * t + nx * (R() - 0.5) * wob, y1 + dy * t + ny * (R() - 0.5) * wob);
    }
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = lw;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // Schnittbereich einer Geraden mit einem Rechteck (Slab-Methode)
  function clipT(sx, sy, dx, dy, b) {
    var t0 = -1e9, t1 = 1e9;
    if (Math.abs(dx) < 1e-6) { if (sx < b[0] || sx > b[0] + b[2]) return null; }
    else { var a = (b[0] - sx) / dx, c = (b[0] + b[2] - sx) / dx; t0 = Math.max(t0, Math.min(a, c)); t1 = Math.min(t1, Math.max(a, c)); }
    if (Math.abs(dy) < 1e-6) { if (sy < b[1] || sy > b[1] + b[3]) return null; }
    else { var a2 = (b[1] - sy) / dy, c2 = (b[1] + b[3] - sy) / dy; t0 = Math.max(t0, Math.min(a2, c2)); t1 = Math.min(t1, Math.max(a2, c2)); }
    return t0 < t1 ? [t0, t1] : null;
  }

  // Schraffur: parallele, unterbrochene Buntstiftstriche in wechselnden Farben
  function hatch(ctx, R, bbox, angle, spacing, colors, lw, alpha, len) {
    var cx = bbox[0] + bbox[2] / 2, cy = bbox[1] + bbox[3] / 2, diag = Math.hypot(bbox[2], bbox[3]);
    var ca = Math.cos(angle), sa = Math.sin(angle), px = -sa, py = ca;
    for (var o = -diag / 2; o < diag / 2; o += spacing * (0.7 + R() * 0.6)) {
      var sx = cx + px * o, sy = cy + py * o, r = clipT(sx, sy, ca, sa, bbox);
      if (!r) continue;
      var t = r[0] - len * R() * 0.5;
      while (t < r[1]) {
        var seg = len * (0.5 + R());
        pline(ctx, R, sx + ca * t, sy + sa * t, sx + ca * (t + seg), sy + sa * (t + seg),
          colors[(R() * colors.length) | 0], lw * (0.85 + R() * 0.3), alpha * (0.75 + R() * 0.5), 0.5);
        t += seg + len * R() * 0.25;
      }
    }
  }

  /* ---------- Wolken (einzeln vorgerendert, CSS lässt sie ziehen) ---------- */

  function paintCloud(cv, seed) {
    var W = cv.width, H = cv.height, ctx = cv.getContext('2d'), R = mulberry(seed);
    var n = 6 + ((R() * 3) | 0), base = H * 0.78, circles = [];
    for (var i = 0; i < n; i++) {
      var t = (i + 0.5) / n, r = H * (0.17 + R() * 0.2) * (1.15 - Math.abs(t - 0.5) * 1.1);
      circles.push([W * (0.12 + 0.76 * t), base - r * 0.65, r]);
    }
    function path() {
      ctx.beginPath();
      circles.forEach(function (c) { ctx.moveTo(c[0] + c[2], c[1]); ctx.arc(c[0], c[1], c[2], 0, TAU); });
      ctx.moveTo(W * 0.9, base); ctx.ellipse(W * 0.5, base, W * 0.4, H * 0.1, 0, 0, TAU);
    }
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    // Kontur zuerst, dann Füllung: übrig bleibt nur der äußere Rand der Vereinigung
    path();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 4;
    ctx.stroke();
    var g = ctx.createLinearGradient(0, H * 0.15, 0, H * 0.95);
    g.addColorStop(0, '#FFF6FA'); g.addColorStop(0.5, '#F9CFE8'); g.addColorStop(1, '#B99AF0');
    path();
    ctx.fillStyle = g;
    ctx.fill();
    // Schatten (unten, violett) und Licht (oben, warm) als Schraffur
    ctx.save();
    path(); ctx.clip();
    ctx.save(); ctx.beginPath(); ctx.rect(0, H * 0.5, W, H); ctx.clip();
    hatch(ctx, R, [0, H * 0.5, W, H * 0.5], 0.6, 4, ['#8E6FD8', '#A683E8', '#7A5BC4'], 1.3, 0.3, 26);
    ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H * 0.38); ctx.clip();
    hatch(ctx, R, [0, 0, W, H * 0.38], -0.5, 6, ['#FFE9B8', '#FFFFFF', '#FFD1E3'], 1.3, 0.35, 24);
    ctx.restore();
    ctx.restore();
    // Skizzierte Doppelkontur
    [['#FF9ED0', 1.6, 1.6], ['#FFFFFF', -0.6, -0.9]].forEach(function (o) {
      ctx.save(); ctx.translate(o[1], o[2]); path();
      ctx.strokeStyle = o[0]; ctx.globalAlpha = 0.5; ctx.lineWidth = 1.4; ctx.stroke();
      ctx.restore();
    });
  }

  /* ---------- Sakura-Ast ---------- */

  var BLOSSOMS = [[362, 30, 1.3], [322, 50, 1], [288, 68, 1.4], [252, 94, 1.1], [212, 112, 1.3], [172, 134, 1], [132, 150, 1.2], [96, 158, 1.4],
    [300, 38, 0.9], [242, 76, 1.2], [192, 98, 0.9], [142, 126, 1.1], [334, 72, 1.1], [272, 92, 0.9], [222, 132, 1.2], [112, 176, 1], [350, 52, 0.8], [180, 160, 0.8]];

  function bez(p, t) {
    var u = 1 - t;
    return [u * u * u * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t * t * t * p[3][0],
      u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1]];
  }

  function branchStroke(ctx, R, p, k, lw) {
    ctx.beginPath();
    ctx.moveTo(p[0][0] * k, p[0][1] * k);
    ctx.bezierCurveTo(p[1][0] * k, p[1][1] * k, p[2][0] * k, p[2][1] * k, p[3][0] * k, p[3][1] * k);
    ctx.strokeStyle = '#4E3052'; ctx.lineWidth = lw * k; ctx.stroke();
    // Rinde: kurze Striche entlang des Astes
    for (var j = 0; j < 36; j++) {
      var t = R(), a = bez(p, t), b = bez(p, Math.min(1, t + 0.05));
      var off = (R() - 0.5) * lw * k * 0.7;
      pline(ctx, R, a[0] * k + off, a[1] * k + off * 0.4, b[0] * k + off, b[1] * k + off * 0.4, R() < 0.5 ? '#8E5E8E' : '#2E1A34', 1.2, 0.6, 0.8);
    }
    var t1 = bez(p, 0.3), t2 = bez(p, 0.7);
    pline(ctx, R, t1[0] * k, t1[1] * k - lw * k * 0.25, t2[0] * k, t2[1] * k - lw * k * 0.25, '#C79BCB', 1.4, 0.55, 1);
  }

  function blossom(ctx, R, x, y, s) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(R() * TAU);
    for (var i = 0; i < 5; i++) {
      ctx.save();
      ctx.rotate(i * TAU / 5);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-s * 0.9, -s * 0.5, -s * 0.8, -s * 1.5, -s * 0.18, -s * 1.55);
      ctx.lineTo(0, -s * 1.35);
      ctx.lineTo(s * 0.18, -s * 1.55);
      ctx.bezierCurveTo(s * 0.8, -s * 1.5, s * 0.9, -s * 0.5, 0, 0);
      ctx.closePath();
      ctx.fillStyle = R() < 0.5 ? '#FFD6E6' : '#FFC2DA';
      ctx.fill();
      ctx.strokeStyle = '#FF7FB0'; ctx.lineWidth = 1; ctx.stroke();
      for (var j = -1; j <= 1; j++) pline(ctx, R, 0, -s * 0.3, j * s * 0.25, -s * 1.05, '#FF6FA8', 0.8, 0.5, 0.5);
      ctx.restore();
    }
    ctx.fillStyle = '#FFE066';
    ctx.beginPath(); ctx.arc(0, 0, s * 0.24, 0, TAU); ctx.fill();
    for (var m = 0; m < 6; m++) {
      var a = m * TAU / 6 + 0.3;
      pline(ctx, R, 0, 0, Math.cos(a) * s * 0.55, Math.sin(a) * s * 0.55, '#E8A93A', 0.8, 0.9, 0.3);
      ctx.fillStyle = '#E8A93A';
      ctx.beginPath(); ctx.arc(Math.cos(a) * s * 0.55, Math.sin(a) * s * 0.55, s * 0.07, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }

  function paintBranch(cv, vw) {
    var cw = Math.round(Math.min(420, vw * 0.62)), ch = Math.round(cw * 0.75), k = cw / 400, R = mulberry(7);
    cv.width = cw; cv.height = ch; cv.style.width = cw + 'px';
    var ctx = cv.getContext('2d');
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    // Bokeh im Vordergrund
    [[0.5, 0.78, 46], [0.78, 0.62, 30], [0.3, 0.9, 38], [0.9, 0.9, 26]].forEach(function (b) {
      var g = ctx.createRadialGradient(cw * b[0], ch * b[1], 0, cw * b[0], ch * b[1], b[2] * k);
      g.addColorStop(0, 'rgba(255,214,232,0.38)'); g.addColorStop(0.8, 'rgba(255,190,220,0.2)'); g.addColorStop(1, 'rgba(255,190,220,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cw * b[0], ch * b[1], b[2] * k, 0, TAU); ctx.fill();
    });
    branchStroke(ctx, R, [[400, 20], [330, 40], [290, 70], [240, 100]], k, 9);
    branchStroke(ctx, R, [[240, 100], [190, 130], [150, 150], [90, 162]], k, 7);
    branchStroke(ctx, R, [[290, 70], [280, 100], [260, 120], [245, 150]], k, 4);
    branchStroke(ctx, R, [[190, 128], [180, 150], [170, 170], [150, 190]], k, 3.5);
    BLOSSOMS.forEach(function (b) { blossom(ctx, R, b[0] * k, b[1] * k, 9 * b[2] * k); });
  }

  /* ---------- Hauptbild ---------- */

  /* ---------- Kirschblütenbaum ---------- */

  // Verjüngter Ast: glatte Form, Schattierung wie ein Zylinder (Licht von rechts), fließende Rindenlinien, feine Tuschekontur
  function limb(ctx, R, p, w0, w1) {
    var N = 36, C = [], Nn = [], W = [], i, k;
    for (i = 0; i <= N; i++) {
      var t = i / N, c = bez(p, t), c2 = bez(p, Math.min(1, t + 0.015)), c1 = bez(p, Math.max(0, t - 0.015));
      var dx = c2[0] - c1[0], dy = c2[1] - c1[1], len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
      if (nx < 0) { nx = -nx; ny = -ny; }
      C.push(c); Nn.push([nx, ny]); W.push((w0 + (w1 - w0) * Math.pow(t, 0.8)) / 2);
    }
    function ribbon(sc, off) {
      var A = [], B = [];
      for (k = 0; k <= N; k++) {
        var cx = C[k][0] + Nn[k][0] * W[k] * off, cy = C[k][1] + Nn[k][1] * W[k] * off, hw = W[k] * sc;
        A.push([cx + Nn[k][0] * hw, cy + Nn[k][1] * hw]);
        B.push([cx - Nn[k][0] * hw, cy - Nn[k][1] * hw]);
      }
      ctx.beginPath();
      ctx.moveTo(A[0][0], A[0][1]);
      for (k = 1; k <= N; k++) ctx.lineTo(A[k][0], A[k][1]);
      for (k = N; k >= 0; k--) ctx.lineTo(B[k][0], B[k][1]);
      ctx.closePath();
      return [A, B];
    }
    [[1, 0, '#3A2246', 1], [0.8, 0.12, '#583660', 1], [0.55, 0.25, '#7C5084', 1], [0.28, 0.4, '#B58AB8', 0.7]].forEach(function (l) {
      ribbon(l[0], l[1]);
      ctx.fillStyle = l[2]; ctx.globalAlpha = l[3]; ctx.fill(); ctx.globalAlpha = 1;
    });
    // Rindenlinien folgen dem Ast
    var edges = ribbon(1, 0);
    ctx.save();
    ctx.clip();
    for (var j = 0, n = Math.round(N * (1 + w0 / 30)); j < n; j++) {
      var f = (R() * 2 - 1) * 0.85, k0 = (R() * (N - 8)) | 0, len2 = 4 + ((R() * 5) | 0);
      ctx.beginPath();
      for (k = k0; k <= k0 + len2; k++) {
        var x = C[k][0] + Nn[k][0] * W[k] * f, y = C[k][1] + Nn[k][1] * W[k] * f;
        if (k === k0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = f < 0 ? '#1F1028' : '#D6B0D6';
      ctx.globalAlpha = f < 0 ? 0.3 : 0.22;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
    edges.forEach(function (E) {
      ctx.beginPath();
      ctx.moveTo(E[0][0], E[0][1]);
      for (k = 1; k <= N; k++) ctx.lineTo(E[k][0], E[k][1]);
      ctx.strokeStyle = '#20102B'; ctx.globalAlpha = 0.85; ctx.lineWidth = 1.4; ctx.stroke(); ctx.globalAlpha = 1;
    });
  }

  // Ast wächst, verzweigt sich rekursiv; merkt sich Spitzen und Mittelpunkte für Blütenmassen
  function grow(ctx, R, p0, ang, len, w0, depth, tips) {
    var wob = (R() - 0.5) * 0.5, a1 = ang + wob, a2 = ang - wob * 0.6 + (R() - 0.5) * 0.4;
    var p3 = [p0[0] + Math.cos(ang) * len, p0[1] + Math.sin(ang) * len];
    var p = [p0, [p0[0] + Math.cos(a1) * len * 0.35, p0[1] + Math.sin(a1) * len * 0.35],
      [p0[0] + Math.cos(a2) * len * 0.7, p0[1] + Math.sin(a2) * len * 0.7 + len * 0.06], p3];
    var w1 = Math.max(1.6, w0 * 0.55);
    limb(ctx, R, p, w0, w1);
    tips.push({ x: p3[0], y: p3[1], d: depth });
    var mid = bez(p, 0.6);
    tips.push({ x: mid[0], y: mid[1], d: depth + 0.5 });
    if (depth > 0) {
      var kids = 2 + (R() < 0.5 ? 1 : 0);
      for (var k = 0; k < kids; k++) {
        var pv = bez(p, 0.4 + 0.5 * k / kids);
        grow(ctx, R, pv, ang + (k % 2 ? 1 : -1) * (0.4 + R() * 0.5), len * (0.55 + R() * 0.15), w1 * 0.9, depth - 1, tips);
      }
    }
  }

  function mixC(a, b, t) {
    return 'rgb(' + Math.round(a[0] + (b[0] - a[0]) * t) + ',' + Math.round(a[1] + (b[1] - a[1]) * t) + ',' + Math.round(a[2] + (b[2] - a[2]) * t) + ')';
  }

  // Blütenkrone als weiche Malerei: Schattenglanz, viele Einzelblüten (unten dunkler, oben heller), Glanzlicht, lose Blütenblätter
  function canopy(ctx, R, cx, cy, rc) {
    var SHADE = [238, 98, 160], MID = [255, 178, 210], LIGHT = [255, 245, 250];
    var sh = ctx.createRadialGradient(cx + rc * 0.1, cy + rc * 0.15, rc * 0.2, cx + rc * 0.1, cy + rc * 0.15, rc * 1.2);
    sh.addColorStop(0, 'rgba(200,60,130,0.5)'); sh.addColorStop(1, 'rgba(200,60,130,0)');
    ctx.fillStyle = sh;
    ctx.beginPath(); ctx.arc(cx + rc * 0.1, cy + rc * 0.15, rc * 1.2, 0, TAU); ctx.fill();
    var fl = [];
    for (var i = 0, n = Math.max(24, Math.min(70, Math.round(rc * rc / 32))); i < n; i++) {
      var a = R() * TAU, d = Math.sqrt(R()) * rc;
      fl.push([cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.82, rc * (0.09 + R() * 0.05), R() * TAU]);
    }
    fl.sort(function (p, q) { return p[1] - q[1]; });
    fl.forEach(function (f) {
      var lit = Math.max(0, Math.min(1, 0.55 + ((cx - f[0]) * 0.35 + (cy - f[1]) * 0.55) / rc));
      ctx.fillStyle = lit < 0.5 ? mixC(SHADE, MID, lit * 2) : mixC(MID, LIGHT, (lit - 0.5) * 2);
      ctx.beginPath();
      for (var k = 0; k < 5; k++) {
        var ang = f[3] + k * TAU / 5, px = f[0] + Math.cos(ang) * f[2] * 0.55, py = f[1] + Math.sin(ang) * f[2] * 0.55;
        ctx.moveTo(px + f[2] * 0.6, py);
        ctx.arc(px, py, f[2] * 0.6, 0, TAU);
      }
      ctx.fill();
      ctx.strokeStyle = 'rgba(214,72,140,0.45)'; ctx.lineWidth = 0.7; ctx.stroke();
      if (lit > 0.4 && f[3] < 3.8) { ctx.fillStyle = '#FFD95E'; ctx.beginPath(); ctx.arc(f[0], f[1], f[2] * 0.17, 0, TAU); ctx.fill(); }
    });
    var gl = ctx.createRadialGradient(cx - rc * 0.3, cy - rc * 0.35, 0, cx - rc * 0.3, cy - rc * 0.35, rc * 0.6);
    gl.addColorStop(0, 'rgba(255,255,255,0.35)'); gl.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gl;
    ctx.beginPath(); ctx.arc(cx - rc * 0.3, cy - rc * 0.35, rc * 0.6, 0, TAU); ctx.fill();
    for (var s = 0; s < 8; s++) {
      var sa = R() * TAU, sd = rc * (1 + R() * 0.4);
      ctx.save(); ctx.translate(cx + Math.cos(sa) * sd, cy + Math.sin(sa) * sd * 0.85); ctx.rotate(R() * TAU);
      ctx.beginPath(); ctx.ellipse(0, 0, rc * 0.07, rc * 0.04, 0, 0, TAU);
      ctx.fillStyle = '#FFD6E6'; ctx.globalAlpha = 0.85; ctx.fill(); ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  // Weiche Lichtstrahlen von der Sonne durch die Krone
  function rays(ctx, w, h) {
    var sx = w * 0.72, sy = h * 0.83, reach = Math.hypot(w, h) * 1.1;
    for (var i = 0; i < 6; i++) {
      var a = -2.85 + i * 0.2, wd = 0.045;
      var g = ctx.createLinearGradient(sx, sy, sx + Math.cos(a) * reach, sy + Math.sin(a) * reach);
      g.addColorStop(0, 'rgba(255,240,200,0.16)'); g.addColorStop(1, 'rgba(255,240,200,0)');
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + Math.cos(a - wd) * reach, sy + Math.sin(a - wd) * reach);
      ctx.lineTo(sx + Math.cos(a + wd) * reach, sy + Math.sin(a + wd) * reach);
      ctx.closePath();
      ctx.fillStyle = g; ctx.fill();
    }
  }

  function sakuraTree(ctx, R, w, h) {
    var u = Math.min(w, h), tips = [], T = [w * 0.22, h * 0.52], x0 = w * 0.2, wMain = Math.min(w * 0.075, h * 0.065);
    limb(ctx, R, [[x0, h + 30], [x0 - w * 0.04, h * 0.8], [x0 + w * 0.07, h * 0.66], T], Math.min(w * 0.17, h * 0.15), Math.min(w * 0.08, h * 0.07));
    [[-2.35, 0.5], [-1.85, 0.58], [-1.35, 0.72], [-0.8, 0.9], [-0.3, 0.85]].forEach(function (m) {
      grow(ctx, R, T, m[0], m[1] * u, wMain, 2, tips);
    });
    var spots = [];
    tips.forEach(function (t) {
      var isMid = t.d % 1 !== 0;
      if (isMid && R() < 0.3) return;
      var f = isMid ? 0.07 : (t.d === 0 ? 0.12 : 0.1);
      spots.push([t.x, t.y, u * (f + R() * 0.03)]);
    });
    // Von oben nach unten malen: untere Kronen liegen vorn
    spots.sort(function (a, b) { return a[1] - b[1]; }).forEach(function (s) { canopy(ctx, R, s[0], s[1], s[2]); });
    // Hängende Blütenzweige
    tips.filter(function (t) { return t.d === 0; }).forEach(function (t) {
      if (R() < 0.45) return;
      var len = u * 0.12 * (0.6 + R()), prev = [t.x, t.y];
      for (var s = 1; s <= 6; s++) {
        var nx = t.x + Math.sin(s * 0.9 + t.x) * 4, ny = t.y + len * s / 6;
        pline(ctx, R, prev[0], prev[1], nx, ny, '#6B4470', 1.4, 0.9, 0.6);
        if (s % 2 === 0) blossom(ctx, R, nx, ny, 3.6 + R() * 1.5);
        prev = [nx, ny];
      }
    });
  }

  // Hügel mit Gras, Umriss und gefallenen Blüten
  function hills(ctx, R, w, h) {
    function hill(baseY, amp, phase, color, hatchCols, grass) {
      var pts = [], x;
      for (x = -10; x <= w + 10; x += 12) pts.push([x, baseY + Math.sin(x / w * TAU * 1.1 + phase) * amp + Math.sin(x / w * TAU * 2.7 + phase * 2) * amp * 0.35]);
      ctx.beginPath();
      ctx.moveTo(-10, h + 10);
      pts.forEach(function (p) { ctx.lineTo(p[0], p[1]); });
      ctx.lineTo(w + 10, h + 10);
      ctx.closePath();
      ctx.fillStyle = color; ctx.fill();
      ctx.save(); ctx.clip();
      hatch(ctx, R, [0, baseY - amp * 1.4, w, h - baseY + amp * 1.4], 1.45, 6, hatchCols, 1.2, 0.15, 40);
      ctx.restore();
      for (var i = 1; i < pts.length; i++) pline(ctx, R, pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], '#FF9ED0', 1.2, 0.4, 0.4);
      if (grass) pts.forEach(function (p) {
        for (var g = 0; g < 2; g++) {
          var gx = p[0] + R() * 12, lean = (R() - 0.5) * 5;
          pline(ctx, R, gx, p[1] + 3, gx + lean, p[1] - 6 - R() * 8, R() < 0.5 ? '#7A5BC4' : '#4E3A9A', 1.3, 0.8, 0.5);
        }
      });
      return pts;
    }
    hill(h * 0.88, h * 0.025, 0.8, '#5A3EA0', ['#7A5BC4', '#4B3290'], false);
    var near = hill(h * 0.94, h * 0.02, 2.4, '#34206F', ['#4B3290', '#1B0F4A'], true);
    // Gefallene Blüten auf dem Boden
    for (var i = 0; i < 90; i++) {
      var p = near[(R() * near.length) | 0], px = p[0] + (R() - 0.5) * 20, py = p[1] + R() * (h - p[1]) * 0.5;
      ctx.save(); ctx.translate(px, py); ctx.rotate(R() * TAU);
      ctx.beginPath(); ctx.ellipse(0, 0, 3 + R() * 2, 1.8 + R(), 0, 0, TAU);
      ctx.fillStyle = R() < 0.5 ? '#FFD1E3' : '#FFB3D1'; ctx.globalAlpha = 0.85; ctx.fill(); ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  function paintArt(cv, w, h) {
    cv.width = w; cv.height = h;
    var ctx = cv.getContext('2d'), R = mulberry(20241004);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // 1) Himmel: nur Buntstift-Struktur über dem CSS-Verlauf
    [[0, 0.22, ['#5B49C8', '#3B2A86', '#7C6BE0']], [0.22, 0.45, ['#8A4FB0', '#A56BD0', '#6F4AB8']],
      [0.45, 0.65, ['#C45FA8', '#FF7FA8', '#B25AB8']], [0.65, 0.82, ['#FF8FA8', '#FFAA8A', '#FF7FA8']],
      [0.82, 1, ['#FFB27A', '#FFD9A0', '#FF9E7A']]].forEach(function (b) {
      hatch(ctx, R, [0, h * b[0], w, h * (b[1] - b[0])], 1.3, 8, b[2], 1.5, 0.1, 90);
    });

    // 2) Sonne mit Ringen
    var sx = w * 0.72, sy = h * 0.83, sr = Math.min(w, h) * 0.085;
    var sg = ctx.createRadialGradient(sx, sy, sr * 0.2, sx, sy, sr);
    sg.addColorStop(0, '#FFFBE0'); sg.addColorStop(1, '#FFE59A');
    ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(sx, sy, sr, 0, TAU); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(sx, sy, sr, 0, TAU); ctx.clip();
    hatch(ctx, R, [sx - sr, sy - sr, sr * 2, sr * 2], -0.6, 5, ['#FFB86B', '#FF9ED0', '#FFFFFF'], 1.2, 0.35, 40);
    ctx.restore();
    [1.35, 1.8].forEach(function (m) {
      for (var p = 0; p < 2; p++) {
        ctx.beginPath(); ctx.arc(sx + (R() - 0.5) * 2, sy + (R() - 0.5) * 2, sr * m, 0, TAU);
        ctx.strokeStyle = '#FFF1B8'; ctx.globalAlpha = 0.3; ctx.lineWidth = 1.4; ctx.stroke(); ctx.globalAlpha = 1;
      }
    });

    // 3) Fuji
    var base = h * 0.8, fx = w * 0.88, fh = h * 0.24, fw = Math.min(w * 0.2, h * 0.36);
    function fuji() {
      ctx.beginPath();
      ctx.moveTo(fx - fw, base + 4);
      ctx.quadraticCurveTo(fx - fw * 0.35, base - fh * 0.25, fx - fw * 0.1, base - fh);
      ctx.lineTo(fx + fw * 0.1, base - fh);
      ctx.quadraticCurveTo(fx + fw * 0.35, base - fh * 0.25, fx + fw, base + 4);
      ctx.closePath();
    }
    var fg = ctx.createLinearGradient(0, base - fh, 0, base);
    fg.addColorStop(0, '#9A7BDA'); fg.addColorStop(1, '#6A4BB0');
    fuji(); ctx.fillStyle = fg; ctx.fill();
    ctx.save(); fuji(); ctx.clip();
    ctx.save(); ctx.beginPath(); ctx.rect(fx, base - fh, fw, fh + 6); ctx.clip();
    hatch(ctx, R, [fx, base - fh, fw, fh], 1.0, 5, ['#4B3290', '#3B2A86'], 1.4, 0.3, 50);
    ctx.restore();
    ctx.beginPath(); ctx.moveTo(fx - fw, base - fh * 1.2);
    for (var sxp = -0.4; sxp <= 0.4; sxp += 0.07) ctx.lineTo(fx + fw * sxp, base - fh * (0.7 + R() * 0.12));
    ctx.lineTo(fx + fw, base - fh * 1.2); ctx.closePath();
    ctx.fillStyle = '#FFF0F6'; ctx.fill();
    ctx.save(); ctx.clip();
    hatch(ctx, R, [fx, base - fh, fw, fh * 0.4], 1.0, 5, ['#D9B6F0', '#E8C9F5'], 1.2, 0.3, 30);
    ctx.restore();
    ctx.restore();
    [['#FFC2E0', 0.7], ['#2B1B66', 0.35]].forEach(function (o, idx) {
      ctx.save(); ctx.translate(idx * 1.2, idx * 1.2);
      ctx.beginPath(); ctx.moveTo(fx - fw, base + 4);
      ctx.quadraticCurveTo(fx - fw * 0.35, base - fh * 0.25, fx - fw * 0.1, base - fh);
      ctx.lineTo(fx + fw * 0.1, base - fh);
      ctx.quadraticCurveTo(fx + fw * 0.35, base - fh * 0.25, fx + fw, base + 4);
      ctx.strokeStyle = o[0]; ctx.globalAlpha = o[1]; ctx.lineWidth = 1.5; ctx.stroke(); ctx.globalAlpha = 1;
      ctx.restore();
    });

    // 4) Hügel mit Gras und gefallenen Blüten
    hills(ctx, R, w, h);

    // 5) Großer Kirschblütenbaum
    sakuraTree(ctx, R, w, h);
    rays(ctx, w, h);

    // 6) Vignette lenkt den Blick zur Mitte
    var vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.hypot(w, h) * 0.6);
    vg.addColorStop(0, 'rgba(10,5,35,0)'); vg.addColorStop(1, 'rgba(10,5,35,0.5)');
    ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
  }

  /* ---------- Einbindung ---------- */

  function cloudTag(top, width, dur, delay, op, seed) {
    return '<canvas class="anb-cloud" data-w="' + width + '" data-seed="' + seed + '" style="top:' + top + '%;opacity:' + op +
      ';animation-duration:' + dur + 's;animation-delay:' + delay + 's"></canvas>';
  }

  function bgHtml() {
    return '<svg class="anb-defs" width="0" height="0" aria-hidden="true"><defs>' +
      '<filter id="azPencil" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3.2"/></filter>' +
      '</defs></svg>' +
      '<div class="anb-sky"></div><div class="anb-sun"></div><div class="anb-tone"></div>' +
      cloudTag(8, 340, 110, -20, 0.85, 11) + cloudTag(22, 220, 150, -90, 0.6, 23) + cloudTag(36, 420, 95, -55, 0.75, 37) + cloudTag(52, 260, 130, -10, 0.5, 41) +
      '<canvas class="anb-art"></canvas><canvas class="anb-branch"></canvas>';
  }

  function paint() {
    var bg = document.getElementById('azAnimeBg');
    if (!bg) return;
    var w = window.innerWidth, h = window.innerHeight;
    bg._paintSize = [w, h];
    paintArt(bg.querySelector('.anb-art'), w, h);
    bg.querySelectorAll('.anb-cloud').forEach(function (c) {
      var cw = Math.min(+c.dataset.w, w * 0.9);
      c.width = Math.round(cw); c.height = Math.round(cw * 0.42); c.style.width = cw + 'px';
      paintCloud(c, +c.dataset.seed);
    });
    paintBranch(bg.querySelector('.anb-branch'), w);
  }

  // Bei deutlich geänderter Fenstergröße neu malen (entprellt)
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

  window.AzbukaAnimeArt = { bgHtml: bgHtml, paint: paint };
})();
