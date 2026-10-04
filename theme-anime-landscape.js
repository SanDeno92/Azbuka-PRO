/* Azbuka PRO – Anime-Theme: gemalte Frühlingslandschaft im Anime-Stil
   (großer Kirschbaum mit überhängender Blütenkrone, Fuji, kleiner Schrein, Felsen, Zaun, Weg im Lichtfleck-Schatten)
   plus Effekte darüber (fliegende Blüten, Lichtstaub, Funkeln, Manga-Speedlines mit Lautmalerei). */
(function () {
  'use strict';

  var TAU = Math.PI * 2, DW = 1920, DH = 1080; // feste Zeichengröße, wird per CSS (cover) an das Fenster angepasst
  var SPARKLE = ['#FFFFFF', '#FFF3B8', '#CDEBFF', '#FFD0E4'];

  function mulberry(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function rand(a, b) { return a + Math.random() * (b - a); }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  function hex(c) { var h = c.replace('#', ''); return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)]; }
  function makeRamp(stops) {
    var P = stops.map(function (s) { return [s[0], hex(s[1])]; });
    return function (t) {
      t = clamp(t, 0, 1);
      for (var i = 1; i < P.length; i++) {
        if (t <= P[i][0]) {
          var a = P[i - 1], b = P[i], k = (t - a[0]) / (b[0] - a[0]);
          return 'rgb(' + Math.round(lerp(a[1][0], b[1][0], k)) + ',' + Math.round(lerp(a[1][1], b[1][1], k)) + ',' + Math.round(lerp(a[1][2], b[1][2], k)) + ')';
        }
      }
      var l = P[P.length - 1][1];
      return 'rgb(' + l[0] + ',' + l[1] + ',' + l[2] + ')';
    };
  }

  // Value-Noise mit mehreren Oktaven (für Lücken im Laub, Schattenflecken)
  function makeNoise(seed) {
    var R = mulberry(seed), G = [], M = 64, i;
    for (i = 0; i < M * M; i++) G.push(R());
    function v(ix, iy) { return G[((iy % M + M) % M) * M + ((ix % M + M) % M)]; }
    function sm(t) { return t * t * (3 - 2 * t); }
    function n2(x, y) {
      var ix = Math.floor(x), iy = Math.floor(y), fx = sm(x - ix), fy = sm(y - iy);
      var a = v(ix, iy), b = v(ix + 1, iy), c = v(ix, iy + 1), d = v(ix + 1, iy + 1);
      return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
    }
    return function (x, y, oct) {
      var s = 0, a = 0.5, f = 1;
      for (var o = 0; o < oct; o++) { s += a * n2(x * f, y * f); f *= 2; a *= 0.5; }
      return s / (1 - Math.pow(0.5, oct));
    };
  }

  function bez(p, t) {
    var u = 1 - t;
    return [u * u * u * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t * t * t * p[3][0],
      u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1]];
  }

  function newCtx(cv) {
    cv.width = DW; cv.height = DH;
    var ctx = cv.getContext('2d');
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    return ctx;
  }

  /* ---------- Äste und Zweige ---------- */

  // Verjüngter Ast mit Licht von links: dunkler Kern, warme Lichtkante, Rindenflecken
  function drawLimb(ctx, R, p, w0, w1) {
    var N = 36, C = [], Nn = [], W = [], i, k;
    for (i = 0; i <= N; i++) {
      var t = i / N, c = bez(p, t), c2 = bez(p, Math.min(1, t + 0.012)), c1 = bez(p, Math.max(0, t - 0.012));
      var dx = c2[0] - c1[0], dy = c2[1] - c1[1], len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
      if (nx > 0) { nx = -nx; ny = -ny; }
      C.push(c); Nn.push([nx, ny]); W.push((w0 + (w1 - w0) * Math.pow(t, 0.85)) / 2 * (1 + 0.05 * Math.sin(i * 1.7 + w0)));
    }
    function rib(sc, off) {
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
    }
    [[1, 0, '#2E1A28'], [0.86, 0.1, '#4A2A3A'], [0.62, 0.24, '#6E4048'], [0.34, 0.4, '#9A6258'], [0.14, 0.55, '#C99278']].forEach(function (l) {
      rib(l[0], l[1]); ctx.fillStyle = l[2]; ctx.fill();
    });
    rib(1, 0);
    ctx.save(); ctx.clip();
    for (var j = 0, n = Math.round(N * (0.8 + w0 / 14)); j < n; j++) {
      var f = (R() * 2 - 1) * 0.85, k0 = (R() * (N - 7)) | 0, len2 = 3 + ((R() * 5) | 0);
      ctx.beginPath();
      for (k = k0; k <= k0 + len2; k++) {
        var x = C[k][0] + Nn[k][0] * W[k] * f, y = C[k][1] + Nn[k][1] * W[k] * f;
        if (k === k0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = f < -0.1 ? '#C99278' : '#241420';
      ctx.globalAlpha = 0.42; ctx.lineWidth = 1 + R() * 1.6; ctx.stroke();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // Dünne Zweige, rekursiv verzweigt
  function twig(ctx, R, x, y, ang, len, wd, depth, col) {
    var x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
    var cx = (x + x2) / 2 + (R() - 0.5) * len * 0.5, cy = (y + y2) / 2 + (R() - 0.5) * len * 0.5;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(cx, cy, x2, y2);
    ctx.strokeStyle = col; ctx.lineWidth = Math.max(0.7, wd); ctx.stroke();
    if (depth > 0) {
      for (var i = 0, k = 2 + (R() < 0.4 ? 1 : 0); i < k; i++) {
        var t = 0.45 + R() * 0.55;
        twig(ctx, R, x + (x2 - x) * t, y + (y2 - y) * t, ang + (R() - 0.5) * 1.5, len * (0.5 + R() * 0.25), wd * 0.68, depth - 1, col);
      }
    }
  }

  /* ---------- Himmel, Berg, Stadt ---------- */

  function softCloud(ctx, R, cx, cy, r) {
    for (var i = 0; i < 16; i++) {
      var x = cx + (R() - 0.5) * r * 1.7, y = cy + (R() - 0.5) * r * 0.32, rad = r * (0.16 + R() * 0.22);
      var g = ctx.createRadialGradient(x, y, 0, x, y, rad);
      g.addColorStop(0, 'rgba(255,255,255,0.7)'); g.addColorStop(0.55, 'rgba(255,236,214,0.32)'); g.addColorStop(1, 'rgba(255,236,214,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rad, 0, TAU); ctx.fill();
    }
  }

  function mountain(ctx, R, N) {
    var B = DH * 0.645, mx = DW * 0.45, my = DH * 0.4, hw = DW * 0.25, H = B - my, i;
    function path() {
      ctx.beginPath();
      ctx.moveTo(mx - hw, B + 12);
      ctx.quadraticCurveTo(mx - hw * 0.5, B - H * 0.2, mx - hw * 0.13, my + H * 0.06);
      ctx.lineTo(mx - hw * 0.02, my);
      ctx.lineTo(mx + hw * 0.07, my + H * 0.02);
      ctx.lineTo(mx + hw * 0.16, my + H * 0.09);
      ctx.quadraticCurveTo(mx + hw * 0.55, B - H * 0.24, mx + hw, B + 12);
      ctx.closePath();
    }
    var g = ctx.createLinearGradient(0, my, 0, B);
    g.addColorStop(0, '#6C93B6'); g.addColorStop(0.6, '#8AAAC4'); g.addColorStop(1, '#B9CBD8');
    path(); ctx.fillStyle = g; ctx.fill();
    ctx.save(); path(); ctx.clip();
    // Schattenseite rechts mit Grat
    ctx.beginPath(); ctx.moveTo(mx + hw * 0.0, my);
    for (i = 1; i <= 9; i++) ctx.lineTo(mx + hw * (0.02 + i * 0.07) + (R() - 0.5) * hw * 0.06, my + H * (i / 9));
    ctx.lineTo(mx + hw * 1.1, B + 12); ctx.lineTo(mx + hw * 0.3, my - 10); ctx.closePath();
    ctx.fillStyle = 'rgba(62,98,138,0.5)'; ctx.fill();
    for (i = 0; i < 16; i++) {
      var sx = mx + (R() - 0.5) * hw * 1.4, sy = my + H * (0.25 + R() * 0.7);
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(sx + (R() - 0.5) * 30, sy + 25, sx + (R() - 0.5) * 40, sy + 70 + R() * 40);
      ctx.strokeStyle = 'rgba(70,108,146,0.45)'; ctx.lineWidth = 2 + R() * 3; ctx.stroke();
    }
    // Schneekappe mit gezacktem Rand, rechte Seite im Schatten
    ctx.beginPath(); ctx.moveTo(mx - hw * 0.45, my - 20); ctx.lineTo(mx - hw * 0.4, my + H * 0.3);
    for (i = 0; i <= 12; i++) ctx.lineTo(mx - hw * 0.4 + hw * 0.9 * i / 12, my + H * (0.2 + 0.16 * N(i * 0.9, 3, 2) + (i % 2) * 0.05));
    ctx.lineTo(mx + hw * 0.5, my - 20); ctx.closePath();
    ctx.fillStyle = '#F6FAFF'; ctx.fill();
    ctx.save(); ctx.clip();
    ctx.beginPath(); ctx.moveTo(mx, my - 10); ctx.lineTo(mx + hw * 0.05, my + H * 0.4); ctx.lineTo(mx + hw * 0.6, my + H * 0.4); ctx.lineTo(mx + hw * 0.6, my - 10); ctx.closePath();
    ctx.fillStyle = 'rgba(160,190,226,0.65)'; ctx.fill();
    ctx.restore();
    ctx.restore();
    var hz = ctx.createLinearGradient(0, my + H * 0.45, 0, B);
    hz.addColorStop(0, 'rgba(255,238,222,0)'); hz.addColorStop(1, 'rgba(255,238,222,0.85)');
    path(); ctx.fillStyle = hz; ctx.fill();
  }

  function town(ctx, R) {
    var cols = ['#E9CFD6', '#D6BFCB', '#F3E0DA', '#C9B6C6'], x = DW * 0.27, i;
    while (x < DW * 0.66) {
      var bw = 14 + R() * 26, bh = 10 + R() * 42, by = DH * 0.695 + (x - DW * 0.27) * 0.01;
      ctx.fillStyle = cols[(R() * cols.length) | 0]; ctx.globalAlpha = 0.92;
      ctx.fillRect(x, by - bh, bw, bh + 40);
      ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(x, by - bh, bw, 3);
      for (i = 0; i < 4; i++) ctx.fillRect(x + 3 + R() * (bw - 8), by - bh + 8 + R() * (bh - 10), 2, 3);
      x += bw + R() * 4;
    }
    ctx.globalAlpha = 1;
    var hz = ctx.createLinearGradient(0, DH * 0.6, 0, DH * 0.72);
    hz.addColorStop(0, 'rgba(255,240,224,0.7)'); hz.addColorStop(1, 'rgba(255,240,224,0.25)');
    ctx.fillStyle = hz; ctx.fillRect(DW * 0.25, DH * 0.6, DW * 0.45, DH * 0.13);
    // kleine dunkle Kiefer
    ctx.fillStyle = '#35564A';
    for (i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(DW * 0.405, DH * (0.655 + i * 0.012)); ctx.lineTo(DW * (0.405 - 0.016 + i * 0.002), DH * (0.675 + i * 0.012)); ctx.lineTo(DW * (0.405 + 0.016 - i * 0.002), DH * (0.675 + i * 0.012)); ctx.closePath(); ctx.fill(); }
  }

  /* ---------- Hintere Kirschbäume (hell, weich) ---------- */

  function farTree(ctx, R, N, cx, cy, r, pink) {
    twig(ctx, R, cx, cy + r * 1.35, -Math.PI / 2 + (R() - 0.5) * 0.3, r * 1.35, r * 0.1, 2, '#4A2E3C');
    var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.5);
    g.addColorStop(0, 'rgba(255,255,255,0.4)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r * 1.5, 0, TAU); ctx.fill();
    var pal = pink ? ['#FFE3EE', '#FFD0E2', '#FFFFFF', '#FFB9D3'] : ['#FFFFFF', '#FFF1F7', '#FFE0EC', '#FFFFFF'];
    for (var i = 0, n = Math.round(r * r / 9); i < n; i++) {
      var a = R() * TAU, d = Math.sqrt(R()) * r, x = cx + Math.cos(a) * d * 1.3, y = cy + Math.sin(a) * d * 0.9;
      if (N(x * 0.02, y * 0.02, 2) < 0.34) continue;
      ctx.fillStyle = pal[(R() * pal.length) | 0]; ctx.globalAlpha = 0.85;
      ctx.beginPath(); ctx.arc(x, y, 2 + R() * 3.5, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
    for (i = 0; i < 6; i++) twig(ctx, R, cx + (R() - 0.5) * r, cy + (R() - 0.2) * r * 0.8, -Math.PI / 2 + (R() - 0.5) * 2.2, r * (0.3 + R() * 0.3), 1.4, 1, '#4A2E3C');
  }

  /* ---------- Schrein ---------- */

  function shrine(ctx, R, sx, sy) {
    var u = DW * 0.07;
    function poly(pts, fill) { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); }
    // Sockel und Wand
    ctx.fillStyle = '#B9B2C2'; ctx.fillRect(sx - 1.25 * u, sy - 0.12 * u, 2.5 * u, 0.14 * u);
    ctx.fillStyle = '#F2E5DF'; ctx.fillRect(sx - 0.9 * u, sy - 0.95 * u, 1.8 * u, 0.85 * u);
    ctx.fillStyle = '#D8C4BE'; ctx.fillRect(sx + 0.45 * u, sy - 0.95 * u, 0.45 * u, 0.85 * u);
    [-0.9, -0.45, 0.45, 0.82].forEach(function (o) { ctx.fillStyle = '#B6414C'; ctx.fillRect(sx + o * u, sy - 0.95 * u, 0.09 * u, 0.85 * u); });
    ctx.fillStyle = '#6B3A34'; ctx.fillRect(sx - 0.3 * u, sy - 0.8 * u, 0.6 * u, 0.7 * u);
    ctx.strokeStyle = '#3F2220'; ctx.lineWidth = 1.5;
    for (var i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(sx - 0.3 * u + i * 0.15 * u, sy - 0.8 * u); ctx.lineTo(sx - 0.3 * u + i * 0.15 * u, sy - 0.1 * u); ctx.stroke(); }
    ctx.fillStyle = '#E3C16A'; ctx.beginPath(); ctx.arc(sx - 0.06 * u, sy - 0.45 * u, 3, 0, TAU); ctx.arc(sx + 0.06 * u, sy - 0.45 * u, 3, 0, TAU); ctx.fill();
    // obere Etage
    ctx.fillStyle = '#F0DDD5'; ctx.fillRect(sx - 0.5 * u, sy - 1.95 * u, 1.0 * u, 0.55 * u);
    ctx.fillStyle = '#B6414C'; ctx.fillRect(sx - 0.5 * u, sy - 1.75 * u, 1.0 * u, 0.1 * u);
    // Dächer: geschwungene Traufen, oben hell, Unterseite dunkel
    function roof(cx, cy, hwid, ht) {
      var g = ctx.createLinearGradient(0, cy - ht * 1.4, 0, cy);
      g.addColorStop(0, '#46A6AE'); g.addColorStop(1, '#1F6470');
      ctx.beginPath();
      ctx.moveTo(cx - hwid, cy - ht * 0.9);
      ctx.quadraticCurveTo(cx - hwid * 0.55, cy - ht * 1.05, cx - hwid * 0.0, cy - ht * 1.55);
      ctx.quadraticCurveTo(cx + hwid * 0.55, cy - ht * 1.05, cx + hwid, cy - ht * 0.9);
      ctx.lineTo(cx + hwid * 0.86, cy - ht * 0.55);
      ctx.quadraticCurveTo(cx + hwid * 0.5, cy - ht * 0.72, cx, cy - ht * 0.78);
      ctx.quadraticCurveTo(cx - hwid * 0.5, cy - ht * 0.72, cx - hwid * 0.86, cy - ht * 0.55);
      ctx.closePath();
      ctx.fillStyle = g; ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx - hwid * 0.86, cy - ht * 0.55);
      ctx.quadraticCurveTo(cx - hwid * 0.5, cy - ht * 0.72, cx, cy - ht * 0.78);
      ctx.quadraticCurveTo(cx + hwid * 0.5, cy - ht * 0.72, cx + hwid * 0.86, cy - ht * 0.55);
      ctx.lineTo(cx + hwid * 0.8, cy - ht * 0.38); ctx.lineTo(cx - hwid * 0.8, cy - ht * 0.38); ctx.closePath();
      ctx.fillStyle = '#15424C'; ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx - hwid, cy - ht * 0.9);
      ctx.quadraticCurveTo(cx - hwid * 0.55, cy - ht * 1.05, cx, cy - ht * 1.55);
      ctx.strokeStyle = '#A5E6DE'; ctx.lineWidth = 2; ctx.stroke();
    }
    roof(sx, sy - 0.85 * u, 1.65 * u, 0.55 * u);
    roof(sx, sy - 1.95 * u, 1.0 * u, 0.42 * u);
    ctx.strokeStyle = '#8A7A5C'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx, sy - 2.55 * u); ctx.lineTo(sx, sy - 2.95 * u); ctx.stroke();
    ctx.fillStyle = '#D9B35A'; ctx.beginPath(); ctx.arc(sx, sy - 2.72 * u, 5, 0, TAU); ctx.fill();
  }

  /* ---------- Boden, Weg, Lichtflecken ---------- */

  function ground(ctx, R, N) {
    var g = ctx.createLinearGradient(0, DH * 0.72, 0, DH);
    g.addColorStop(0, '#EBCFD9'); g.addColorStop(1, '#CFA0C2');
    ctx.fillStyle = g; ctx.fillRect(0, DH * 0.72, DW, DH * 0.28);
    // Weg: schmal am Schrein, breit unten
    function pathShape() {
      ctx.beginPath();
      ctx.moveTo(DW * 0.585, DH * 0.775);
      ctx.bezierCurveTo(DW * 0.5, DH * 0.86, DW * 0.3, DH * 0.94, DW * 0.2, DH + 4);
      ctx.lineTo(DW * 0.88, DH + 4);
      ctx.bezierCurveTo(DW * 0.76, DH * 0.94, DW * 0.7, DH * 0.86, DW * 0.668, DH * 0.775);
      ctx.closePath();
    }
    var pg = ctx.createLinearGradient(0, DH * 0.77, 0, DH);
    pg.addColorStop(0, '#F9E0E8'); pg.addColorStop(1, '#EBB9D2');
    pathShape(); ctx.fillStyle = pg; ctx.fill();
    ctx.save(); pathShape(); ctx.clip();
    function blob(x, y, rx, ry, col, a) {
      ctx.beginPath();
      for (var i = 0; i <= 16; i++) {
        var ang = i / 16 * TAU, k = 0.4 + N(x * 0.01 + i * 0.45, y * 0.01, 2) * 1.0;
        var px = x + Math.cos(ang) * rx * k, py = y + Math.sin(ang) * ry * k;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath(); ctx.fillStyle = col; ctx.globalAlpha = a; ctx.fill(); ctx.globalAlpha = 1;
    }
    var i, v, pf, x;
    for (i = 0; i < 170; i++) {
      v = 0.79 + R() * 0.21; pf = (v - 0.77) / 0.23; x = DW * (0.3 + R() * 0.5);
      blob(x, DH * v, (14 + R() * 70) * (0.25 + pf), (4 + R() * 12) * (0.25 + pf), '#8D8CC8', 0.34);
    }
    for (i = 0; i < 120; i++) {
      v = 0.79 + R() * 0.21; pf = (v - 0.77) / 0.23; x = DW * (0.3 + R() * 0.5);
      blob(x, DH * v, (10 + R() * 50) * (0.25 + pf), (3 + R() * 9) * (0.25 + pf), '#FFF1F5', 0.5);
    }
    ctx.restore();
    // Blütenblätter auf dem Boden
    var pc = ['#FFD1E3', '#FFFFFF', '#FFB0CF'];
    for (i = 0; i < 520; i++) {
      v = 0.78 + Math.pow(R(), 0.8) * 0.22; pf = (v - 0.77) / 0.23; x = DW * (0.18 + R() * 0.7);
      ctx.save(); ctx.translate(x, DH * v); ctx.rotate(R() * TAU);
      ctx.beginPath(); ctx.ellipse(0, 0, (2 + R() * 4) * (0.3 + pf), (1.2 + R() * 2) * (0.3 + pf), 0, 0, TAU);
      ctx.fillStyle = pc[(R() * 3) | 0]; ctx.globalAlpha = 0.9; ctx.fill(); ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  function paintBack(cv) {
    var ctx = newCtx(cv), R = mulberry(11), N = makeNoise(5), i;
    var g = ctx.createLinearGradient(0, 0, DW * 0.7, DH * 0.8);
    g.addColorStop(0, '#86C6EA'); g.addColorStop(0.35, '#C9E6EB'); g.addColorStop(0.62, '#FFF2D8'); g.addColorStop(1, '#FFE0D4');
    ctx.fillStyle = g; ctx.fillRect(0, 0, DW, DH);
    [[0.42, 0.42, 0.3], [0.62, 0.3, 0.24], [0.3, 0.55, 0.2], [0.74, 0.5, 0.22], [0.5, 0.2, 0.2]].forEach(function (c) { softCloud(ctx, R, DW * c[0], DH * c[1], DW * c[2]); });
    mountain(ctx, R, N);
    town(ctx, R);
    [[0.52, 0.54, 0.07], [0.58, 0.5, 0.08], [0.67, 0.52, 0.09], [0.75, 0.57, 0.08], [0.8, 0.5, 0.1], [0.34, 0.6, 0.08, 1], [0.44, 0.66, 0.05, 1], [0.5, 0.66, 0.05, 1]].forEach(function (t) {
      farTree(ctx, R, N, DW * t[0], DH * t[1], DW * t[2], t[3]);
    });
    ground(ctx, R, N);
    shrine(ctx, R, DW * 0.625, DH * 0.775);
    for (i = 0; i < 3; i++) farTree(ctx, R, N, DW * (0.58 + i * 0.07), DH * 0.68, DW * 0.04, 1);
  }

  /* ---------- Krone: Baum rechts, Baum links, Blütendächer ---------- */

  var BLOOM = makeRamp([[0, '#A5205F'], [0.2, '#D93A7C'], [0.4, '#F5649B'], [0.6, '#FF9DC0'], [0.8, '#FFD3E3'], [1, '#FFFFFF']]);
  var SUN = [DW * 0.3, DH * 0.1];

  function lightAt(x, y) {
    var ds = Math.hypot(x - SUN[0], (y - SUN[1]) * 1.15) / (DW * 0.85);
    var L = 1 - ds * 1.2;
    L -= clamp(x / DW - 0.6, 0, 1) * 0.35;
    L -= (1 - clamp(y / (DH * 0.16), 0, 1)) * 0.18;
    return L;
  }

  function bloomAt(ctx, R, N, x, y, r) {
    var n = Math.round(r * r / 38), i, a, d, px, py, nz, rr;
    // dunkle Unterlage für Tiefe
    for (i = 0; i < n * 0.3; i++) {
      a = R() * TAU; d = Math.sqrt(R()) * r; px = x + Math.cos(a) * d; py = y + Math.sin(a) * d * 0.8;
      nz = N(px * 0.011, py * 0.011, 3); if (nz < 0.3) continue;
      ctx.fillStyle = BLOOM(lightAt(px, py) - 0.28 + (nz - 0.5) * 0.3); ctx.globalAlpha = 0.9;
      ctx.beginPath(); ctx.arc(px, py, 5 + R() * 5, 0, TAU); ctx.fill();
    }
    for (i = 0; i < n; i++) {
      a = R() * TAU; d = Math.sqrt(R()) * r; px = x + Math.cos(a) * d; py = y + Math.sin(a) * d * 0.8;
      nz = N(px * 0.011, py * 0.011, 3); if (nz < 0.27) continue;
      rr = 2.6 + R() * 4.2;
      ctx.fillStyle = BLOOM(lightAt(px, py) + (nz - 0.5) * 0.45 + (R() - 0.5) * 0.2); ctx.globalAlpha = 0.93;
      ctx.beginPath(); ctx.arc(px, py, rr, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function paintCanopy(cv) {
    var ctx = newCtx(cv), R = mulberry(77), N = makeNoise(9), i, j;
    var W = function (f) { return f * DW; }, H = function (f) { return f * DH; };
    function P(a) { return a.map(function (q) { return [W(q[0]), H(q[1])]; }); }
    var limbs = [
      [[[0.84, 0.40], [0.78, 0.30], [0.66, 0.24], [0.50, 0.14]], 0.045, 0.014],
      [[[0.50, 0.14], [0.40, 0.08], [0.30, 0.07], [0.20, 0.10]], 0.014, 0.006],
      [[[0.83, 0.44], [0.76, 0.42], [0.68, 0.36], [0.58, 0.38]], 0.028, 0.008],
      [[[0.86, 0.40], [0.90, 0.28], [0.96, 0.16], [0.99, 0.02]], 0.03, 0.009],
      [[[0.88, 0.46], [0.94, 0.40], [1.0, 0.32], [1.06, 0.30]], 0.02, 0.006],
      [[[-0.04, 0.8], [0.03, 0.62], [0.10, 0.5], [0.16, 0.40]], 0.06, 0.03],
      [[[0.16, 0.40], [0.22, 0.32], [0.28, 0.24], [0.34, 0.16]], 0.025, 0.008],
      [[[0.14, 0.42], [0.20, 0.44], [0.28, 0.46], [0.36, 0.44]], 0.02, 0.006],
      [[[0.08, 0.5], [0.05, 0.38], [0.04, 0.26], [0.08, 0.14]], 0.02, 0.006]
    ];
    // Hauptstamm mit Wurzelanlauf
    var trunk = P([[0.87, 1.04], [0.79, 0.75], [0.91, 0.58], [0.84, 0.40]]);
    ctx.fillStyle = '#2E1A28';
    ctx.beginPath(); ctx.moveTo(W(0.74), DH + 6); ctx.quadraticCurveTo(W(0.8), H(0.9), W(0.805), H(0.8)); ctx.lineTo(W(0.92), H(0.8)); ctx.quadraticCurveTo(W(0.94), H(0.92), W(1.0), DH + 6); ctx.closePath(); ctx.fill();
    drawLimb(ctx, R, trunk, W(0.125), W(0.055));
    [[[0.84, 0.9], [0.8, 0.95], [0.76, 1.0], [0.7, 1.03]], [[0.88, 0.92], [0.93, 0.96], [0.97, 1.0], [1.02, 1.03]]].forEach(function (rp) { drawLimb(ctx, R, P(rp), W(0.04), W(0.008)); });
    var attractors = [];
    limbs.forEach(function (l) {
      var p = P(l[0]);
      drawLimb(ctx, R, p, W(l[1]), W(l[2]));
      for (var t = 0.2; t <= 1.001; t += 0.14) {
        var q = bez(p, t);
        attractors.push([q[0], q[1], W(0.05 + R() * 0.035)]);
        for (j = 0; j < 3; j++) twig(ctx, R, q[0], q[1], -Math.PI / 2 + (R() - 0.5) * 3.0, W(0.03 + R() * 0.05), W(l[2]) * 0.8, 2, '#33202C');
      }
    });
    // Blütendach quer über das Bild
    for (i = 0; i < 26; i++) attractors.push([W(0.02 + i * 0.04) + (R() - 0.5) * 30, H(0.01 + R() * 0.11), W(0.07 + R() * 0.04)]);
    for (i = 0; i < 6; i++) attractors.push([W(0.04 + R() * 0.2), H(0.3 + R() * 0.3), W(0.07 + R() * 0.04)]);
    attractors.sort(function (a, b) { return a[1] - b[1]; });
    attractors.forEach(function (a) { bloomAt(ctx, R, N, a[0], a[1], a[2]); });
    // Zweige noch einmal teilweise vor den Blüten
    attractors.forEach(function (a) {
      if (R() < 0.35) twig(ctx, R, a[0], a[1], R() * TAU, W(0.025 + R() * 0.03), 2, 2, '#33202C');
    });
    // Gegenlicht
    ctx.globalCompositeOperation = 'lighter';
    var gl = ctx.createRadialGradient(SUN[0], SUN[1], 0, SUN[0], SUN[1], W(0.34));
    gl.addColorStop(0, 'rgba(255,240,240,0.45)'); gl.addColorStop(1, 'rgba(255,240,240,0)');
    ctx.fillStyle = gl; ctx.fillRect(0, 0, DW, DH);
    ctx.globalCompositeOperation = 'source-over';
    // Ketten aus fallenden Blütenblättern unter der Krone
    for (i = 0; i < 9; i++) {
      var sx = W(0.28 + R() * 0.35), sy = H(0.18 + R() * 0.2), sl = (R() - 0.3) * 0.5;
      for (j = 0; j < 24; j++) {
        var t2 = j / 24;
        ctx.fillStyle = R() < 0.7 ? '#FFFFFF' : '#FFD3E3'; ctx.globalAlpha = 0.95 * (1 - t2);
        ctx.beginPath(); ctx.arc(sx + sl * t2 * H(0.3) + (R() - 0.5) * 9, sy + t2 * H(0.3), 2 + R() * 3 * (1 - t2 * 0.5), 0, TAU); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  /* ---------- Vordergrund: Felsen, Zaun, Moos, Blumen, Lichtstrahlen ---------- */

  function rockMass(ctx, R, pts, base, light, dark) {
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.closePath();
    var xs = pts.map(function (q) { return q[0]; }), ys = pts.map(function (q) { return q[1]; });
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
    var g = ctx.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, light); g.addColorStop(1, dark);
    ctx.fillStyle = g; ctx.fill();
    ctx.save(); ctx.clip();
    for (i = 0; i < 46; i++) {
      var cx = x0 + R() * (x1 - x0), cy = y0 + R() * (y1 - y0), s = 20 + R() * 80, a = R() * TAU;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * s, cy + Math.sin(a) * s);
      ctx.lineTo(cx + Math.cos(a + 2.1) * s * (0.6 + R() * 0.6), cy + Math.sin(a + 2.1) * s * (0.6 + R() * 0.6));
      ctx.lineTo(cx + Math.cos(a + 4.2) * s * (0.6 + R() * 0.6), cy + Math.sin(a + 4.2) * s * (0.6 + R() * 0.6));
      ctx.closePath();
      var lit = Math.cos(a - 4.0) * 0.5 + 0.5; // Licht von links oben
      ctx.fillStyle = lit > 0.55 ? light : dark; ctx.globalAlpha = 0.18 + R() * 0.22; ctx.fill();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.strokeStyle = base; ctx.lineWidth = 2.5; ctx.stroke();
  }

  function moss(ctx, R, x, y, wd) {
    var cols = ['#9DB654', '#C2D86A', '#6E9440'];
    for (var i = 0; i < wd / 6; i++) {
      var px = x + R() * wd, py = y + (R() - 0.5) * 8;
      ctx.fillStyle = cols[(R() * 3) | 0]; ctx.globalAlpha = 0.9;
      ctx.beginPath(); ctx.ellipse(px, py, 5 + R() * 9, 3 + R() * 5, 0, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.moveTo(px, py); ctx.quadraticCurveTo(px + (R() - 0.5) * 10, py - 10, px + (R() - 0.5) * 16, py - 14 - R() * 12);
      ctx.strokeStyle = cols[(R() * 2) | 0]; ctx.lineWidth = 2; ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  function paintFront(cv) {
    var ctx = newCtx(cv), R = mulberry(303), i, j;
    var W = function (f) { return f * DW; }, H = function (f) { return f * DH; };
    // linke Felswand
    var cliff = [[-10, 0.52], [0.06, 0.5], [0.12, 0.56], [0.18, 0.63], [0.22, 0.72], [0.26, 0.8], [0.31, 0.9], [0.36, 1.02], [-10, 1.02]].map(function (q) { return [q[0] < 0 ? q[0] : W(q[0]), H(q[1])]; });
    rockMass(ctx, R, cliff, '#2E2C44', '#8F8CAA', '#3F3D5C');
    for (i = 0; i < 6; i++) moss(ctx, R, W(0.0 + i * 0.045), H(0.5 + i * 0.045), 70);
    // rechte Felsen mit Moos und Blumen
    [[[0.7, 1.02], [0.72, 0.92], [0.77, 0.86], [0.83, 0.84], [0.88, 0.77], [0.95, 0.73], [1.02, 0.7], [1.02, 1.02]],
      [[0.6, 1.02], [0.62, 0.95], [0.68, 0.92], [0.73, 0.94], [0.76, 1.02]],
      [[0.8, 1.02], [0.83, 0.93], [0.9, 0.9], [0.97, 0.92], [1.02, 1.02]]].forEach(function (poly, idx) {
      rockMass(ctx, R, poly.map(function (q) { return [W(q[0]), H(q[1])]; }), '#5F5C7E', '#D9D6E6', '#8A88A4');
    });
    for (i = 0; i < 5; i++) moss(ctx, R, W(0.72 + i * 0.06), H(0.86 - i * 0.025), 90);
    for (i = 0; i < 16; i++) {
      var fx = W(0.76 + R() * 0.2), fy = H(0.8 + R() * 0.14);
      for (j = 0; j < 5; j++) { ctx.fillStyle = R() < 0.6 ? '#FF8DB5' : '#FFFFFF'; ctx.beginPath(); ctx.arc(fx + (R() - 0.5) * 24, fy + (R() - 0.5) * 14, 3 + R() * 3, 0, TAU); ctx.fill(); }
    }
    // Holzzaun von links unten in die Bildmitte
    var A = [W(0.0), H(0.955)], B = [W(0.5), H(0.775)], posts = [], t;
    for (i = 0; i <= 9; i++) {
      t = Math.pow(i / 9, 1.1);
      posts.push({ x: lerp(A[0], B[0], t), y: lerp(A[1], B[1], t), h: H(0.15) * (1 - t * 0.7), w: W(0.013) * (1 - t * 0.55) });
    }
    [0.85, 0.5].forEach(function (rf) {
      ctx.beginPath();
      posts.forEach(function (p, k) { var y = p.y - p.h * rf; if (k === 0) ctx.moveTo(p.x, y); else ctx.lineTo(p.x, y); });
      ctx.strokeStyle = '#5C2C38'; ctx.lineWidth = 6; ctx.stroke();
      ctx.strokeStyle = '#B4687A'; ctx.lineWidth = 2;
      ctx.beginPath(); posts.forEach(function (p, k) { var y = p.y - p.h * rf - 2; if (k === 0) ctx.moveTo(p.x, y); else ctx.lineTo(p.x, y); }); ctx.stroke();
    });
    posts.forEach(function (p) {
      ctx.fillStyle = '#5C2C38'; ctx.fillRect(p.x - p.w / 2, p.y - p.h, p.w, p.h);
      ctx.fillStyle = '#B4687A'; ctx.fillRect(p.x - p.w / 2, p.y - p.h, p.w * 0.3, p.h);
      ctx.fillStyle = '#7E4352'; ctx.fillRect(p.x - p.w * 0.65, p.y - p.h - 3, p.w * 1.3, 4);
    });
    // Lichtstrahlen von oben links
    for (i = 0; i < 7; i++) {
      var a = 0.5 + i * 0.12, reach = Math.hypot(DW, DH) * 1.1;
      var g = ctx.createLinearGradient(SUN[0], SUN[1], SUN[0] + Math.cos(a) * reach, SUN[1] + Math.sin(a) * reach);
      g.addColorStop(0, 'rgba(255,248,226,0.2)'); g.addColorStop(1, 'rgba(255,248,226,0)');
      ctx.beginPath(); ctx.moveTo(SUN[0], SUN[1]);
      ctx.lineTo(SUN[0] + Math.cos(a - 0.03) * reach, SUN[1] + Math.sin(a - 0.03) * reach);
      ctx.lineTo(SUN[0] + Math.cos(a + 0.03) * reach, SUN[1] + Math.sin(a + 0.03) * reach);
      ctx.closePath(); ctx.fillStyle = g; ctx.fill();
    }
  }

  /* ---------- Einbindung ---------- */

  function bgHtml() {
    // Filter #azPencil: wackelige Zweitlinie an den Panel-Rahmen
    return '<svg class="anb-defs" width="0" height="0" aria-hidden="true"><defs>' +
      '<filter id="azPencil" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3.2"/></filter>' +
      '</defs></svg>' +
      '<img class="anb-art anb-illustration" src="bg-anime-sunset-hd.png" alt="" aria-hidden="true" decoding="async" fetchpriority="high"><div class="anb-light"></div>';
  }

  function paint() {
    var bg = document.getElementById('azAnimeBg');
    if (!bg || bg._painted) return;
    bg._painted = true;
    var image = bg.querySelector('.anb-illustration');
    var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!image || motion.matches) return;
    function beginWind() {
      if (!bg.isConnected || !image.naturalWidth) return;
      var canvas = document.createElement('canvas');
      canvas.className = 'anb-wind';
      canvas.setAttribute('aria-hidden', 'true');
      var gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false });
      if (!gl) return;
      function compile(type, source) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source); gl.compileShader(shader);
        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
        gl.deleteShader(shader);
        return null;
      }
      var vertex = compile(gl.VERTEX_SHADER,
        'attribute vec2 position; varying vec2 uv; void main(){uv=position*0.5+0.5;gl_Position=vec4(position,0.0,1.0);}');
      var fragment = compile(gl.FRAGMENT_SHADER,
        'precision mediump float; varying vec2 uv; uniform sampler2D artwork; uniform vec2 crop; uniform float time;' +
        'void main(){vec2 point=(uv-0.5)*crop+0.5;' +
        'float sides=smoothstep(0.12,0.40,abs(point.x-0.5));' +
        'float crown=smoothstep(0.40,0.92,point.y);float tree=sides*crown;' +
        'float breeze=sin(time*0.40)+0.28*sin(time*0.67+point.y*4.0);' +
        'point.x+=tree*0.005*breeze;' +
        'point.y+=tree*0.002*sin(time*0.35+point.x*5.0);' +
        'gl_FragColor=texture2D(artwork,clamp(point,0.001,0.999));}');
      if (!vertex || !fragment) return;
      var program = gl.createProgram();
      gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
      gl.useProgram(program);
      var buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
      var position = gl.getAttribLocation(program, 'position');
      gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      var texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      function dispose() {
        gl.deleteTexture(texture); gl.deleteBuffer(buffer); gl.deleteProgram(program);
        gl.deleteShader(vertex); gl.deleteShader(fragment);
      }
      try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image); }
      catch (error) { dispose(); return; }
      var crop = gl.getUniformLocation(program, 'crop');
      var time = gl.getUniformLocation(program, 'time');
      var started = performance.now(), previous = -Infinity;
      canvas.addEventListener('webglcontextlost', function (event) { event.preventDefault(); canvas.remove(); });
      bg.insertBefore(canvas, bg.querySelector('.anb-light'));
      function frame(now) {
        if (!bg.isConnected || !canvas.isConnected) { dispose(); return; }
        requestAnimationFrame(frame);
        if ((document.hidden && previous !== -Infinity) || now - previous < 33) return;
        previous = now;
        canvas.style.visibility = motion.matches ? 'hidden' : 'visible';
        if (motion.matches) return;
        var width = window.innerWidth, height = window.innerHeight;
        var ratio = Math.min(window.devicePixelRatio || 1, 1.5);
        var pixelWidth = Math.round(width * ratio), pixelHeight = Math.round(height * ratio);
        if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
          canvas.width = pixelWidth; canvas.height = pixelHeight;
          gl.viewport(0, 0, pixelWidth, pixelHeight);
        }
        var scale = Math.max(width / image.naturalWidth, height / image.naturalHeight) * 1.015;
        gl.uniform2f(crop, width / (image.naturalWidth * scale), height / (image.naturalHeight * scale));
        gl.uniform1f(time, (now - started) / 1000);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      frame(started);
    }
    if (image.complete) beginWind();
    else image.addEventListener('load', beginWind, { once: true });
  }

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
    // Bild erst nach dem ersten Frame malen, damit das Theme sofort reagiert
    setTimeout(paint, 30);
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var ctx = cv.getContext('2d'), glow = glowSprite();
    var sprites = [petalSprite('#FFFFFF', '#FFC4DA'), petalSprite('#FFF0F6', '#FF9EC4'), petalSprite('#FFE4EF', '#FFB0CF')];
    var w = 0, h = 0, petals = [], motes = [], sparkles = [], burst = null;
    var t0 = performance.now(), last = t0, nextSparkle = 0, nextBurst = t0 + rand(8000, 13000);

    // Blüten wehen von der Krone (oben) nach links unten – der Baum steht rechts
    function newPetal(anywhere) {
      var d = Math.random();
      return {
        x: anywhere ? rand(0.05 * w, w * 1.05) : rand(0.6 * w, 1.15 * w), y: anywhere ? rand(-20, h * 0.95) : rand(-0.05 * h, 0.4 * h),
        d: d, s: 3 + 8 * Math.pow(d, 1.6), vx: -rand(20, 55) * (0.7 + d * 0.8), vy: rand(16, 38) * (0.7 + d * 0.8),
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
      for (var i = 0, n2 = Math.max(16, Math.min(Math.round(w * h / 20000), 55)); i < n2; i++) petals.push(newPetal(true));
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
        if (p.x < -40 || p.y > h + 40) { var np = newPetal(false); np.d = p.d; np.s = p.s; np.a = p.a; petals[petals.indexOf(p)] = np; }
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

      if (!burst && now >= nextBurst) {
        burst = { age: 0, life: 0.7, lines: [] };
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
