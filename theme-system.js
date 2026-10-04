(function () {
  'use strict';

  var STORAGE_KEY = 'azbuka_theme_state_v1';
  var DEFAULT_THEME = 'standard';
  var DEFAULT_SKIN = 'classic';
  /* true = alle Themes und Skins gratis; Preise bleiben im Katalog erhalten. */
  var ALL_FREE = true;

  var themeCatalog = [
    {
      id: 'standard',
      type: 'theme',
      name: 'Standard',
      price: 0,
      description: 'Das originale Design: transparentes Dunkelgrün mit Glow-Effekt.',
      colors: {
        primary: '#D4FF00',
        primaryStrong: '#7AFF8A',
        accent: '#7AFF8A',
        bg: '#081B0F',
        panel: '#0F1F13',
        panelAlt: '#162D1F',
        text: '#F5F7FA',
        textSoft: '#D6E0F0',
        success: '#7AFF8A',
        warning: '#FFC62A',
        danger: '#FF6B9D'
      }
    },
    {
      id: 'violet',
      type: 'theme',
      name: 'Violet',
      price: 2500,
      description: 'Dunkles Violet mit ruhigem Premium-Effekt.',
      colors: {
        primary: '#A78BFA',
        primaryStrong: '#7C3AED',
        accent: '#DDD6FE',
        bg: '#0E0820',
        panel: '#1F1533',
        panelAlt: '#2D1B47',
        text: '#F3F0FF',
        textSoft: '#E9D5FF',
        success: '#6EE7B7',
        warning: '#FCD34D',
        danger: '#F472B6'
      }
    },
    {
      id: 'pink',
      type: 'theme',
      name: 'Pink',
      price: 3200,
      description: 'Weiches Rosa mit warmem, freundlich wirkendem Stil.',
      colors: {
        primary: '#F472B6',
        primaryStrong: '#DB2777',
        accent: '#FBCFE8',
        bg: '#2A1420',
        panel: '#3B1D30',
        panelAlt: '#512E42',
        text: '#FEF2F5',
        textSoft: '#FBCFE8',
        success: '#34D399',
        warning: '#FCD34D',
        danger: '#FB7185'
      }
    },
    {
      id: 'ocean',
      type: 'theme',
      name: 'Ocean',
      price: 3800,
      description: 'Klares Blau mit coolen, digitalen Akzenten.',
      colors: {
        primary: '#22D3EE',
        primaryStrong: '#0891B2',
        accent: '#CFFAFE',
        bg: '#051929',
        panel: '#0E3B4A',
        panelAlt: '#164E5E',
        text: '#ECFDF5',
        textSoft: '#A5F3FC',
        success: '#34D399',
        warning: '#FBBF24',
        danger: '#38BDF8'
      }
    },
    {
      id: 'cyberpunk',
      type: 'theme',
      name: 'Cyberpunk',
      price: 8000,
      description: 'Neon-Cyan und Magenta mit bewegten Lichtstrahlen, Scanlines und Glow.',
      colors: {
        primary: '#00F0FF',
        primaryStrong: '#00B8D4',
        accent: '#FF2BD6',
        bg: '#080314',
        panel: '#120726',
        panelAlt: '#1E0B3D',
        text: '#F2F6FF',
        textSoft: '#B4B9FF',
        success: '#39FF88',
        warning: '#FCEE0A',
        danger: '#FF2A6D'
      }
    },
    {
      id: 'storm',
      type: 'theme',
      name: 'Gewitter',
      price: 9000,
      description: 'Elektrisches Gelb und Indigo mit Blitzen, Regen und ziehenden Gewitterwolken.',
      colors: {
        primary: '#FFE81F',
        primaryStrong: '#FFB020',
        accent: '#8F9BFF',
        bg: '#050816',
        panel: '#0C1230',
        panelAlt: '#141C48',
        text: '#F4F7FF',
        textSoft: '#AEB8FF',
        success: '#5CFFB1',
        warning: '#FFB020',
        danger: '#FF4D6D'
      }
    },
    {
      id: 'space',
      type: 'theme',
      name: 'Weltall',
      price: 10000,
      description: 'Tiefschwarz mit Planetenhorizont, Nebeln, funkelnden Sternen und Sternschnuppen.',
      colors: {
        primary: '#7FB4FF',
        primaryStrong: '#4C86E0',
        accent: '#FFB86B',
        bg: '#000005',
        panel: '#07080F',
        panelAlt: '#0E1020',
        text: '#EEF2FF',
        textSoft: '#98A2C8',
        success: '#6BFFB8',
        warning: '#FFB86B',
        danger: '#FF6B8A'
      }
    },
    {
      id: 'anime',
      type: 'theme',
      name: 'Anime',
      price: 11000,
      description: 'Kirschbl\u00fctenwiese im Sonnenuntergang, sanft bewegte Baumkronen und schwebende Bl\u00fcten.',
      colors: {
        primary: '#FF8FB8',
        primaryStrong: '#FF5C9E',
        accent: '#7FD7FF',
        bg: '#150F33',
        panel: '#221A4A',
        panelAlt: '#2E2460',
        text: '#FFF8FB',
        textSoft: '#D9CCFF',
        success: '#8DF0B5',
        warning: '#FFD36B',
        danger: '#FF6B7A'
      }
    }
  ];

  var skinCatalog = [
    { id: 'classic', type: 'skin', name: 'Classic', price: 0, description: 'Der Standard-Skin ohne Extras.', accent: '#D4FF00', shadow: '0 12px 32px rgba(0,0,0,0.35)', borderRadius: '18px', glow: 0, animation: 'none' },
    { id: 'neon', type: 'skin', name: 'Neon', price: 2000, description: 'Leuchtende Konturen und leichter Glanz-Effekt.', accent: '#8B5CF6', shadow: '0 0 18px rgba(139, 92, 246, 0.5), 0 12px 32px rgba(0,0,0,0.25)', borderRadius: '22px', glow: 16, animation: 'pulse' },
    { id: 'glass', type: 'skin', name: 'Glass', price: 3000, description: 'Sanfte Glasoberfläche mit leichtem Frost-Effekt.', accent: '#38BDF8', shadow: '0 14px 34px rgba(56, 189, 248, 0.22), 0 10px 24px rgba(15, 23, 42, 0.18)', borderRadius: '20px', glow: 12, animation: 'float' },
    { id: 'sunset', type: 'skin', name: 'Sunset', price: 5000, description: 'Warmes Gold-Orange mit Glow und stärkerem Fokus.', accent: '#F59E0B', shadow: '0 0 22px rgba(245, 158, 11, 0.5), 0 18px 40px rgba(24, 19, 8, 0.28)', borderRadius: '24px', glow: 22, animation: 'shine' }
  ];

  function readState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var parsed = raw ? JSON.parse(raw) : {};
      if (!parsed || typeof parsed !== 'object') return { activeTheme: DEFAULT_THEME, activeSkin: DEFAULT_SKIN, unlocked: { themes: ['standard'], skins: ['classic'] } };
      return {
        activeTheme: parsed.activeTheme || DEFAULT_THEME,
        activeSkin: parsed.activeSkin || DEFAULT_SKIN,
        unlocked: {
          themes: Array.isArray(parsed.unlocked && parsed.unlocked.themes) ? parsed.unlocked.themes : ['standard'],
          skins: Array.isArray(parsed.unlocked && parsed.unlocked.skins) ? parsed.unlocked.skins : ['classic']
        }
      };
    } catch (e) {
      return { activeTheme: DEFAULT_THEME, activeSkin: DEFAULT_SKIN, unlocked: { themes: ['standard'], skins: ['classic'] } };
    }
  }
  function writeState(nextState) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState)); } catch (e) {} }
  function findItem(list, id) { return list.filter(function (item) { return item && item.id === id; })[0] || null; }
  function ensureDefaults() {
    var current = readState(); var needsSave = false;
    if (current.unlocked.themes.indexOf('standard') === -1) { current.unlocked.themes.push('standard'); needsSave = true; }
    if (current.unlocked.skins.indexOf('classic') === -1) { current.unlocked.skins.push('classic'); needsSave = true; }
    if (!findItem(themeCatalog, current.activeTheme)) { current.activeTheme = DEFAULT_THEME; needsSave = true; }
    if (!findItem(skinCatalog, current.activeSkin)) { current.activeSkin = DEFAULT_SKIN; needsSave = true; }
    if (needsSave) writeState(current);
    return current;
  }
  function getThemeCatalog() { return themeCatalog.slice(); }
  function getSkinCatalog() { return skinCatalog.slice(); }
  function getThemeById(id) { return findItem(themeCatalog, id); }
  function getSkinById(id) { return findItem(skinCatalog, id); }
  function getActiveTheme() { var state = ensureDefaults(); return getThemeById(state.activeTheme) || getThemeById(DEFAULT_THEME); }
  function getActiveSkin() { var state = ensureDefaults(); return getSkinById(state.activeSkin) || getSkinById(DEFAULT_SKIN); }
  function isUnlocked(type, id) {
    if (id === 'standard' || id === 'classic' || ALL_FREE) return true;
    var state = readState();
    if (type === 'theme') return state.unlocked.themes.indexOf(id) !== -1;
    if (type === 'skin') return state.unlocked.skins.indexOf(id) !== -1;
    return false;
  }
  function unlock(type, id) {
    var state = readState();
    if (type === 'theme' && state.unlocked.themes.indexOf(id) === -1) state.unlocked.themes.push(id);
    if (type === 'skin' && state.unlocked.skins.indexOf(id) === -1) state.unlocked.skins.push(id);
    writeState(state);
  }
  function setActiveTheme(id) {
    var item = getThemeById(id); if (!item) return false;
    var state = readState(); state.activeTheme = id; writeState(state);
    applyActiveTheme();
    try { window.dispatchEvent(new CustomEvent('azbuka-theme-change', { detail: { theme: id } })); } catch(e){}
    return true;
  }
  function setActiveSkin(id) {
    var item = getSkinById(id); if (!item) return false;
    var state = readState(); state.activeSkin = id; writeState(state);
    applyActiveTheme();
    try { window.dispatchEvent(new CustomEvent('azbuka-skin-change', { detail: { skin: id } })); } catch(e){}
    return true;
  }
  function hexToRgba(hex, alpha) {
    if (!hex) return 'rgba(0,0,0,'+alpha+')';
    var h = String(hex).replace('#','').trim();
    if (h.length === 3) h = h.split('').map(function(c){ return c + c; }).join('');
    if (h.length !== 6) return hex;
    var r = parseInt(h.substr(0,2),16); var g = parseInt(h.substr(2,2),16); var b = parseInt(h.substr(4,2),16);
    if (isNaN(r)||isNaN(g)||isNaN(b)) return hex;
    return 'rgba('+r+','+g+','+b+','+alpha+')';
  }
  function hexToRgbString(hex) {
    if (!hex) return '0,0,0';
    var h = String(hex).replace('#','').trim();
    if (h.length === 3) h = h.split('').map(function(c){ return c + c; }).join('');
    if (h.length !== 6) return '0,0,0';
    var r = parseInt(h.substr(0,2),16); var g = parseInt(h.substr(2,2),16); var b = parseInt(h.substr(4,2),16);
    return r+','+g+','+b;
  }
  function buildThemeCssVariables(theme, skin) {
    var c = theme.colors || {}; var s = skin || {};
    return {
      '--theme-primary': c.primary || '#D4FF00',
      '--theme-primary-strong': c.primaryStrong || c.primary || '#D4FF00',
      '--theme-accent': c.accent || '#7AFF8A',
      '--theme-bg': c.bg || '#081B0F',
      '--theme-panel': c.panel || '#0F1F13',
      '--theme-panel-alt': c.panelAlt || '#162D1F',
      '--theme-text': c.text || '#F5F7FA',
      '--theme-text-soft': c.textSoft || '#D6E0F0',
      '--theme-success': c.success || '#7AFF8A',
      '--theme-warning': c.warning || '#FFC62A',
      '--theme-danger': c.danger || '#FF6B9D',
      '--theme-primary-rgb': hexToRgbString(c.primary),
      '--theme-accent-rgb': hexToRgbString(c.accent),
      '--theme-bg-rgb': hexToRgbString(c.bg),
      '--theme-panel-rgb': hexToRgbString(c.panel),
      '--theme-panel-alt-rgb': hexToRgbString(c.panelAlt),
      '--skin-accent': s.accent || c.primary || '#D4FF00',
      '--skin-shadow': s.shadow || '0 12px 32px rgba(0,0,0,0.3)',
      '--skin-radius': s.borderRadius || '18px',
      '--skin-glow': (s.glow || 0) + 'px',
      '--skin-animation': s.animation || 'none'
    };
  }

  function ensureThemeCss() {
    var id = 'azbuka-theme-dynamic';
    var style = document.getElementById(id);
    if (!style) {
      style = document.createElement('style');
      style.id = id;
      document.head.appendChild(style);
    }
    // Dieses CSS überschreibt ALLE Hardcoded Tailwind-Klassen
    var cssText = [
      ':root { color-scheme: dark; }',
      'html, body, #root { background-color: var(--theme-bg) !important; color: var(--theme-text) !important; }',
      'body {',
      '  background: radial-gradient(1200px 600px at 15% -10%, rgba(var(--theme-primary-rgb),0.18) 0%, transparent 60%),',
      '              radial-gradient(900px 500px at 85% 0%, rgba(var(--theme-primary-rgb),0.12) 0%, transparent 55%),',
      '              linear-gradient(180deg, var(--theme-bg) 0%, color-mix(in srgb, var(--theme-bg) 88%, black) 100%) !important;',
      '}',
      '#root > div, .min-h-screen { background: transparent !important; background-color: transparent !important; }',
      '/* === Bundle-Klassen: [class~=] trifft nur exakte Tokens, damit hover:/focus:-Varianten und /Opacity-Stufen nicht mitgefaerbt werden === */',
      '[class~=\"bg-[#0A1E0A]\"] { background-color: var(--theme-bg) !important; }',
      '[class~=\"bg-[#0A1E0A]/80\"], [class~=\"bg-black/80\"] { background-color: rgba(var(--theme-bg-rgb),0.8) !important; }',
      '[class~=\"bg-[rgba(10,30,10,0.92)]\"] { background-color: rgba(var(--theme-bg-rgb),0.92) !important; }',
      '[class~=\"bg-[#0E1E0E]\"], [class~=\"bg-[#111f11]\"] { background-color: var(--theme-panel) !important; }',
      '[class~=\"bg-[#1e2a1e]\"], [class~=\"bg-[#162616]\"], [class~=\"hover:bg-[#162616]\"]:hover { background-color: var(--theme-panel-alt) !important; }',
      '[class~=\"bg-[#2a1515]\"] { background-color: color-mix(in srgb, var(--theme-danger) 14%, var(--theme-bg)) !important; }',
      '/* === Primärfarbe #D4FF00 -> var(--theme-primary) === */',
      '[class~=\"bg-[#D4FF00]\"] { background-color: var(--theme-primary) !important; }',
      '[class~=\"hover:bg-[#e0ff33]\"]:hover { background-color: color-mix(in srgb, var(--theme-primary) 82%, white) !important; }',
      '[class~=\"bg-[#D4FF00]/5\"] { background-color: rgba(var(--theme-primary-rgb),0.05) !important; }',
      '[class~=\"bg-[#D4FF00]/10\"] { background-color: rgba(var(--theme-primary-rgb),0.10) !important; }',
      '[class~=\"bg-[#D4FF00]/12\"] { background-color: rgba(var(--theme-primary-rgb),0.12) !important; }',
      '[class~=\"bg-[#D4FF00]/15\"] { background-color: rgba(var(--theme-primary-rgb),0.15) !important; }',
      '[class~=\"text-[#D4FF00]\"] { color: var(--theme-primary) !important; }',
      '[class~=\"text-[#D4FF00]/90\"] { color: rgba(var(--theme-primary-rgb),0.9) !important; }',
      '[class~=\"border-[#D4FF00]\"] { border-color: var(--theme-primary) !important; }',
      '[class~=\"border-[#D4FF00]/15\"] { border-color: rgba(var(--theme-primary-rgb),0.15) !important; }',
      '[class~=\"border-[#D4FF00]/20\"] { border-color: rgba(var(--theme-primary-rgb),0.20) !important; }',
      '[class~=\"border-[#D4FF00]/25\"] { border-color: rgba(var(--theme-primary-rgb),0.25) !important; }',
      '[class~=\"border-[#D4FF00]/30\"], [class~=\"hover:border-[#D4FF00]/30\"]:hover { border-color: rgba(var(--theme-primary-rgb),0.30) !important; }',
      '[class~=\"focus:border-[#D4FF00]/60\"]:focus, [class~=\"border-[#D4FF00]/60\"] { border-color: rgba(var(--theme-primary-rgb),0.60) !important; }',
      '[class~=\"ring-[#D4FF00]/20\"], [class~=\"focus:ring-[#D4FF00]/20\"]:focus { --tw-ring-color: rgba(var(--theme-primary-rgb),0.20) !important; }',
      '[class~=\"selection:bg-[#D4FF00]\"]::selection, [class~=\"selection:bg-[#D4FF00]\"] ::selection { background-color: var(--theme-primary) !important; }',
      '.bonus-answer { color: var(--theme-primary) !important; text-shadow: 0 0 8px rgba(var(--theme-primary-rgb),0.6), 0 2px 4px rgba(0,0,0,0.9) !important; }',
      '[class*=\"shadow-[0_0_18px_rgba(212\"] , [class*=\"shadow-[0_0_20px_rgba(212\"], [class*=\"shadow-[0_0_24px_rgba(212\"], [class*=\"shadow-[0_0_30px_rgba(212\"], [class*=\"shadow-[0_0_80px_rgba(212\"] { --tw-shadow-color: rgba(var(--theme-primary-rgb),0.35) !important; box-shadow: 0 0 20px rgba(var(--theme-primary-rgb),0.35), var(--skin-shadow) !important; }',
      '/* === Sekundär #7AFF8A -> accent === */',
      '[class~=\"bg-[#7AFF8A]\"] { background-color: var(--theme-accent) !important; }',
      '[class~=\"text-[#7AFF8A]\"] { color: var(--theme-accent) !important; }',
      '/* === Danger #FF6B9D === */',
      '[class~=\"bg-[#FF6B9D]\"] { background-color: var(--theme-danger) !important; }',
      '[class~=\"bg-[#FF6B9D]/10\"] { background-color: color-mix(in srgb, var(--theme-danger) 10%, transparent) !important; }',
      '[class~=\"text-[#FF6B9D]\"] { color: var(--theme-danger) !important; }',
      '[class~=\"border-[#FF6B9D]\"] { border-color: var(--theme-danger) !important; }',
      '[class~=\"border-[#FF6B9D]/30\"] { border-color: color-mix(in srgb, var(--theme-danger) 30%, transparent) !important; }',
      '/* === Cards & Panels === */',
      '.card-front, .card-back {',
      '  background: linear-gradient(165deg, color-mix(in srgb, var(--theme-panel) 78%, transparent) 0%, color-mix(in srgb, var(--theme-panel-alt) 85%, transparent) 55%, color-mix(in srgb, var(--theme-bg) 92%, transparent) 100%) !important;',
      '  border: 1px solid rgba(var(--theme-primary-rgb),0.14) !important;',
      '  box-shadow: 0 0 0 1px rgba(var(--theme-primary-rgb),0.06), var(--skin-shadow) !important;',
      '  border-radius: var(--skin-radius) !important;',
      '}',
      '.az-view-inner, .az-card, .az-shop-item, .az-stat-box, .prof-card, .news-card, .ws-wrap, .ws-side, .tabs-extra-wrap, .vocab-card, .aufgaben-card { border-color: rgba(var(--theme-primary-rgb),0.18) !important; border-radius: var(--skin-radius) !important; }',
      '.az-view-inner { background: radial-gradient(600px 300px at 10% 0%, rgba(var(--theme-primary-rgb),0.06), transparent), var(--theme-panel) !important; }',
      '.az-card { background: color-mix(in srgb, var(--theme-panel) 90%, var(--theme-panel-alt)) !important; }',
      '.az-shop-item, .az-stat-box, .ws-w { background: color-mix(in srgb, var(--theme-panel) 88%, var(--theme-bg)) !important; }',
      '.prof-overlay, .news-overlay { background: rgba(var(--theme-bg-rgb),0.92) !important; }',
      '.prof-card, .news-card { background: var(--theme-panel) !important; border: 1px solid rgba(var(--theme-primary-rgb),0.28) !important; box-shadow: 0 0 80px rgba(var(--theme-primary-rgb),0.25), var(--skin-shadow) !important; border-radius: calc(var(--skin-radius) + 8px) !important; }',
      'header { background: color-mix(in srgb, var(--theme-panel) 82%, transparent) !important; border-bottom: 1px solid rgba(var(--theme-primary-rgb),0.18) !important; backdrop-filter: blur(12px); }',
      '.mobile-nav, .az-bottom-nav, nav.fixed.bottom-0, .bottom-0.fixed { background: color-mix(in srgb, var(--theme-panel) 92%, black) !important; border-top: 1px solid rgba(var(--theme-primary-rgb),0.15) !important; }',
      '.prof-save, .az-btn-primary, .ws-new, .ws-db-active, .az-btn.az-theme-buy:not(:disabled), .az-btn.az-shop-buy:not(:disabled), .tabs-extra-tab.active, .tabs-extra-btn { background: var(--theme-primary) !important; color: color-mix(in srgb, var(--theme-bg) 85%, black) !important; box-shadow: 0 0 20px rgba(var(--theme-primary-rgb),0.35) !important; }',
      '.ws-wrap { background: radial-gradient(1000px 500px at 15% -10%, rgba(var(--theme-primary-rgb),0.10) 0%, transparent 60%), radial-gradient(700px 400px at 85% 0%, rgba(var(--theme-primary-rgb),0.10) 0%, transparent 50%), linear-gradient(180deg, var(--theme-panel) 0%, var(--theme-bg) 100%) !important; }',
      '.ws-brand-title span, .ws-pill-diff { color: var(--theme-primary) !important; }',
      '.ws-cell { background: color-mix(in srgb, var(--theme-panel) 75%, white 5%) !important; border-color: rgba(var(--theme-primary-rgb),0.10) !important; color: var(--theme-text-soft) !important; }',
      '.ws-cell.ws-sel, .ws-cell.ws-found { background: var(--theme-primary) !important; color: var(--theme-bg) !important; }',
      '.ws-w-done { background: rgba(var(--theme-primary-rgb),0.14) !important; }',
      '.ws-w-done .ws-w-ru { color: var(--theme-primary) !important; }',
      '.ws-progress-fill { background: linear-gradient(90deg, var(--theme-primary), var(--theme-danger)) !important; }',
      '.az-shop-icon { background: var(--theme-primary) !important; color: var(--theme-bg) !important; }',
      '.az-stat-box b { color: var(--theme-primary) !important; }',
      '.tabs-extra-wrap { background: var(--theme-panel) !important; border: 1px solid rgba(var(--theme-primary-rgb),0.18) !important; }',
      '/* === Wortsuche: bisher fehlende Stellen === */',
      '.ws-diffbar { background: var(--theme-bg) !important; }',
      '.ws-info { background: rgba(var(--theme-primary-rgb),0.08) !important; border-color: rgba(var(--theme-primary-rgb),0.15) !important; color: var(--theme-primary) !important; }',
      '.ws-cell:hover { background: rgba(var(--theme-primary-rgb),0.1) !important; border-color: rgba(var(--theme-primary-rgb),0.28) !important; }',
      '.ws-w-done .ws-w-check { background: var(--theme-primary) !important; border-color: var(--theme-primary) !important; box-shadow: 0 0 10px rgba(var(--theme-primary-rgb),0.4) !important; }',
      '.ws-logo { background: var(--theme-bg) !important; }',
      '@keyframes wsFoundGlow { 0% { box-shadow: 0 0 0px rgba(var(--theme-primary-rgb),0), 0 0 0px rgba(var(--theme-primary-rgb),0); filter: brightness(1); } 30% { box-shadow: 0 0 30px rgba(var(--theme-primary-rgb),0.9), 0 0 60px rgba(var(--theme-primary-rgb),0.4); filter: brightness(1.4); } 100% { box-shadow: 0 0 12px rgba(var(--theme-primary-rgb),0.3); filter: brightness(1); } }',
      '/* === Quiz: Timer-Karte & -Balken + Streak-Punkte (Inline-Styles im Bundle) === */',
      '.quiz-card, #q-card { background: linear-gradient(180deg, var(--theme-panel) 0%, var(--theme-bg) 100%) !important; }',
      '.timer-bar { background: linear-gradient(90deg, var(--theme-accent), var(--theme-primary)) !important; }',
      '.streak-dots .dot.filled, .streak-dots .dot.filling { background: var(--theme-primary) !important; }'
    ].join('\n');
    if (style.textContent !== cssText) style.textContent = cssText;
  }

  /* Inline-Styles (React-Bundle, JS-Views) lassen sich per CSS nicht ueberschreiben:
     feste Gruentoene im style-Attribut werden auf Theme-Variablen umgeschrieben. */
  var INLINE_COLOR_MAP = (function () {
    function rgbParts(hex) { var h = hex.replace('#', ''); return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)]; }
    function entry(hex, solidVar, rgbVar) {
      var p = rgbParts(hex);
      var list = [[new RegExp('#' + hex.replace('#', '') + '\\b|rgb\\(\\s*' + p.join(',\\s*') + '\\s*\\)', 'gi'), 'var(' + solidVar + ')']];
      if (rgbVar) list.push([new RegExp('rgba\\(\\s*' + p.join(',\\s*') + '\\s*,', 'gi'), 'rgba(var(' + rgbVar + '),']);
      return list;
    }
    return [].concat(
      entry('#D4FF00', '--theme-primary', '--theme-primary-rgb'),
      entry('#7AFF8A', '--theme-accent', '--theme-accent-rgb'),
      entry('#FF6B9D', '--theme-danger'),
      entry('#111c11', '--theme-panel', '--theme-panel-rgb'),
      entry('#142214', '--theme-panel'),
      entry('#1a2a1a', '--theme-panel-alt'),
      entry('#1a2e1a', '--theme-panel-alt'),
      entry('#0A1E0A', '--theme-bg', '--theme-bg-rgb'),
      entry('#132213', '--theme-bg')
    );
  })();
  var INLINE_TEST = /#(?:d4ff00|7aff8a|ff6b9d|111c11|142214|1a2a1a|1a2e1a|0a1e0a|132213)\b|rgba?\(\s*(?:212,\s*255,\s*0|122,\s*255,\s*138|255,\s*107,\s*157|17,\s*28,\s*17|20,\s*34,\s*20|26,\s*42,\s*26|26,\s*46,\s*26|10,\s*30,\s*10|19,\s*34,\s*19)\s*[,)]/i;

  function recolorInlineStyles() {
    var nodes = document.querySelectorAll('[style]');
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (node === document.documentElement) continue; // dort stehen die --theme-* Werte selbst
      var css = node.getAttribute('style');
      if (!css || !INLINE_TEST.test(css)) continue;
      var next = css;
      for (var j = 0; j < INLINE_COLOR_MAP.length; j++) next = next.replace(INLINE_COLOR_MAP[j][0], INLINE_COLOR_MAP[j][1]);
      if (next !== css) node.setAttribute('style', next);
    }
  }

  function applyAppThemeVisuals(theme, skin) {
    ensureThemeCss();
    var root = document.getElementById('root');
    if (root) {
      root.style.backgroundColor = 'transparent';
    }
    var body = document.body;
    if (body) {
      body.style.backgroundColor = theme.colors.bg;
      body.style.color = theme.colors.text;
    }
    document.querySelectorAll('header').forEach(function (headerNode) {
      headerNode.style.background = hexToRgba(theme.colors.panel, 0.82);
    });
    document.querySelectorAll('.card-front, .card-back').forEach(function (cardNode) {
      cardNode.style.setProperty('background', 'linear-gradient(165deg, ' + hexToRgba(theme.colors.panel, 0.85) + ' 0%, ' + hexToRgba(theme.colors.panelAlt, 0.90) + ' 55%, ' + hexToRgba(theme.colors.bg, 0.96) + ' 100%)', 'important');
    });
    recolorInlineStyles();
  }

  /* Bewegte Lichteffekte pro Theme (Styling in theme-<name>.css); nur das aktive Theme hat seinen Layer im DOM. */
  var THEME_FX = {
    cyberpunk: {
      id: 'azCyberFx',
      html: '<i class="cfx-blob cfx-b1"></i><i class="cfx-blob cfx-b2"></i><i class="cfx-blob cfx-b3"></i>' +
        '<i class="cfx-beam"></i><i class="cfx-beam cfx-beam2"></i><i class="cfx-scan"></i>'
    },
    storm: {
      id: 'azStormFx',
      html: '<i class="sfx-cloud sfx-c1"></i><i class="sfx-cloud sfx-c2"></i><canvas class="sfx-canvas"></canvas>',
      start: function (node) { if (window.AzbukaStormFx) window.AzbukaStormFx.start(node); }
    },
    space: {
      id: 'azSpaceFx',
      html: '<canvas class="spx-canvas"></canvas>',
      start: function (node) { if (window.AzbukaSpaceFx) window.AzbukaSpaceFx.start(node); }
    },
    anime: {
      id: 'azAnimeFx',
      html: '<canvas class="anx-canvas"></canvas>',
      bgId: 'azAnimeBg', // Hintergrund-Layer hinter der App (z-index -1)
      bgHtml: function () { return window.AzbukaAnimeFx ? window.AzbukaAnimeFx.bgHtml() : ''; },
      start: function (node) { if (window.AzbukaAnimeFx) window.AzbukaAnimeFx.start(node); }
    }
  };
  function syncThemeFx(themeId) {
    Object.keys(THEME_FX).forEach(function (key) {
      var cfg = THEME_FX[key];
      var node = document.getElementById(cfg.id);
      var bg = cfg.bgId ? document.getElementById(cfg.bgId) : null;
      if (key !== themeId) { if (node) node.remove(); if (bg) bg.remove(); return; }
      if (!document.body) return;
      if (cfg.bgId && !bg) {
        bg = document.createElement('div');
        bg.id = cfg.bgId;
        bg.setAttribute('aria-hidden', 'true');
        bg.innerHTML = cfg.bgHtml();
        document.body.appendChild(bg);
      }
      if (node) return;
      node = document.createElement('div');
      node.id = cfg.id;
      node.setAttribute('aria-hidden', 'true');
      node.innerHTML = cfg.html;
      document.body.appendChild(node);
      if (cfg.start) cfg.start(node);
    });
  }

  function applyActiveTheme() {
    var theme = getActiveTheme(); var skin = getActiveSkin();
    var root = document.documentElement; if (!root) return;
    ensureThemeCss();
    var vars = buildThemeCssVariables(theme, skin);
    Object.keys(vars).forEach(function (key) { root.style.setProperty(key, vars[key]); });
    // Auch meta theme-color updaten
    try {
      var meta = document.querySelector('meta[name=\"theme-color\"]');
      if (meta) meta.setAttribute('content', theme.colors.primary);
    } catch(e){}
    applyAppThemeVisuals(theme, skin);
    root.setAttribute('data-theme-id', theme.id);
    root.setAttribute('data-skin-id', skin.id);
    syncThemeFx(theme.id);
    // Force reflow für Tailwind bg overrides
    try { document.body.offsetHeight; } catch(e){}
  }

  function buildShopCatalog() {
    return {
      themes: getThemeCatalog().map(function (item) {
        return { id: item.id, type: item.type, name: item.name, price: item.price, description: item.description, colors: item.colors, unlocked: item.id === 'standard' || isUnlocked('theme', item.id) };
      }),
      skins: getSkinCatalog().map(function (item) {
        return { id: item.id, type: item.type, name: item.name, price: item.price, description: item.description, accent: item.accent, shadow: item.shadow, unlocked: item.id === 'classic' || isUnlocked('skin', item.id) };
      })
    };
  }
  function registerTheme(theme) { if (!theme || !theme.id || !theme.name) return null; var current = getThemeById(theme.id); if (current) { Object.keys(theme).forEach(function (key) { current[key] = theme[key]; }); return current; } themeCatalog.push(theme); return theme; }
  function registerSkin(skin) { if (!skin || !skin.id || !skin.name) return null; var current = getSkinById(skin.id); if (current) { Object.keys(skin).forEach(function (key) { current[key] = skin[key]; }); return current; } skinCatalog.push(skin); return skin; }
  function purchaseWithXP(type, id, xpAmount) {
    var item = type === 'theme' ? getThemeById(id) : getSkinById(id);
    if (!item) return { ok: false, reason: 'item_not_found' };
    if (id === 'standard' || id === 'classic') { if (type === 'theme') setActiveTheme(id); if (type === 'skin') setActiveSkin(id); return { ok: true, item: id, free: true }; }
    if (isUnlocked(type, id)) return { ok: false, reason: 'already_unlocked' };
    var xpState = null; try { xpState = JSON.parse(localStorage.getItem('azbuka_xp') || '{}'); } catch (e) { xpState = {}; }
    var currentXP = Number(xpState.xp || 0);
    // Fallback: nutze AzbukaProfiles XP wenn vorhanden
    try { if (window.AzbukaProfiles && window.AzbukaProfiles.getStats) { var s = window.AzbukaProfiles.getStats(); if (s && typeof s.xp === 'number') currentXP = s.xp; } } catch(e){}
    if (currentXP < Number(item.price || 0)) { return { ok: false, reason: 'insufficient_xp' }; }
    xpState.xp = currentXP - Number(item.price || 0);
    try { localStorage.setItem('azbuka_xp', JSON.stringify(xpState)); } catch (e) {}
    try { if (window.AzbukaProfiles && window.AzbukaProfiles.addXP) { window.AzbukaProfiles.addXP(-Number(item.price||0)); } } catch(e){}
    unlock(type, id);
    if (type === 'theme') setActiveTheme(id); if (type === 'skin') setActiveSkin(id);
    return { ok: true, item: item.id };
  }
  function init() {
    var state = readState();
    if (!state.activeTheme || !getThemeById(state.activeTheme)) state.activeTheme = DEFAULT_THEME;
    if (!state.activeSkin || !getSkinById(state.activeSkin)) state.activeSkin = DEFAULT_SKIN;
    if (state.unlocked && Array.isArray(state.unlocked.themes) && state.unlocked.themes.indexOf(DEFAULT_THEME) === -1) state.unlocked.themes.push(DEFAULT_THEME);
    if (state.unlocked && Array.isArray(state.unlocked.skins) && state.unlocked.skins.indexOf(DEFAULT_SKIN) === -1) state.unlocked.skins.push(DEFAULT_SKIN);
    writeState(state); ensureDefaults(); applyActiveTheme();
    try {
      var scheduled = false;
      var obs = new MutationObserver(function () {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(function () { scheduled = false; applyActiveTheme(); });
      });
      if (document.body) obs.observe(document.body, { childList: true, subtree: true });
    } catch(e){}
    // Nochmals nach 500ms für React
    setTimeout(applyActiveTheme, 500);
    setTimeout(applyActiveTheme, 1500);
  }
  window.AzbukaThemeSystem = {
    getThemeCatalog: getThemeCatalog, getSkinCatalog: getSkinCatalog, getThemeById: getThemeById, getSkinById: getSkinById,
    getActiveTheme: getActiveTheme, getActiveSkin: getActiveSkin, isUnlocked: isUnlocked, registerTheme: registerTheme, registerSkin: registerSkin,
    setActiveTheme: setActiveTheme, setActiveSkin: setActiveSkin, applyActiveTheme: applyActiveTheme, applyAppThemeVisuals: applyAppThemeVisuals,
    buildShopCatalog: buildShopCatalog, purchaseWithXP: purchaseWithXP, init: init
  };
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
