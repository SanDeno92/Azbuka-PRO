/* Shop-View THEMED Fix – replaces hardcoded fallbacks with CSS vars */
(function () {
  'use strict';
  var items = [
    { id: 'streak-shield', icon: '🛡️', title: 'Tages-Schild', desc: 'Schützt deine Tages-Streak vor einem verpassten Lerntag. Maximal 3 Stück.', prices: [{ currency: 'xp', label: '50.000 XP', cost: 50000 }], max: 3, inventory: 'shields' },
    { id: 'week-streak-shield', icon: '🏰', title: '7-Tage-Schild', desc: 'Schützt deine Streak bei bis zu 7 verpassten Tagen. Maximal 1 Stück.', prices: [{ currency: 'xp', label: '200.000 XP', cost: 200000 }], max: 1, inventory: 'weekShields' },
    { id: 'premium', icon: '⭐', title: 'Premium-Abo', desc: 'Werbefrei, unbegrenzte Leben & exklusive Lektionen.', prices: [] },
    { id: 'extra-life', icon: '❤️', title: 'Extra Leben', desc: 'Sofort wieder volle Leben, um direkt weiterzulernen.', prices: [] }
  ];
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function getThemeSystem(){return window.AzbukaThemeSystem||null;}
  function render(container){
    var api=window.AzbukaProfiles;
    var stats=api?api.getStats():{xp:0,shields:0,weekShields:0,dayStreak:0};
    var themeSystem=getThemeSystem();
    var catalog=themeSystem&&themeSystem.buildShopCatalog?themeSystem.buildShopCatalog():{themes:[],skins:[]};
    var cards=items.map(function(it){
      var priceBtns=it.prices.length?it.prices.map(function(p){return '<button type="button" class="az-btn az-shop-buy" data-item="'+esc(it.id)+'" data-currency="'+p.currency+'" data-cost="'+p.cost+'">'+p.label+'</button>';}).join(''):'<button type="button" class="az-btn az-btn-ghost" disabled>Bald</button>';
      return '<div class="az-shop-item"><div class="az-shop-icon" style="background:var(--theme-primary); color:var(--theme-bg);">'+it.icon+'</div><div class="az-shop-info"><div class="az-shop-title">'+esc(it.title)+'</div><div class="az-shop-desc">'+esc(it.desc)+'</div></div><div class="az-shop-actions">'+priceBtns+'</div></div>';
    }).join('');
    var themesSections='';
    if(catalog){
      if(catalog.themes&&catalog.themes.length){
        themesSections+='<div class="az-shop-section"><div class="az-shop-section-title">Themes</div>';
        for(var i=0;i<catalog.themes.length;i++){var t=catalog.themes[i];var isActive=themeSystem.getActiveTheme&&themeSystem.getActiveTheme().id===t.id;var isUnlocked=t.id==='standard'||(themeSystem.isUnlocked&&themeSystem.isUnlocked('theme',t.id));themesSections+='<div class="az-shop-item az-theme-item"><div class="az-shop-icon" style="background:'+((t.colors&&t.colors.primary)||'var(--theme-primary)')+'; color:var(--theme-bg);">🎨</div><div class="az-shop-info"><div class="az-shop-title">'+esc(t.name)+'</div><div class="az-shop-desc">'+esc(t.description)+'</div><div class="az-swatch-row"><span style="background:'+(t.colors.primary||'#fff')+';"></span><span style="background:'+(t.colors.accent||'#fff')+';"></span><span style="background:'+(t.colors.panel||'#fff')+';"></span></div></div><div class="az-shop-actions">'+(isActive?'<button class="az-btn az-btn-ghost" disabled>Aktiv</button>':isUnlocked?'<button class="az-btn az-theme-buy" data-type="theme" data-id="'+t.id+'">Aktivieren</button>':'<button class="az-btn az-theme-buy" data-type="theme" data-id="'+t.id+'" data-price="'+t.price+'">'+Number(t.price).toLocaleString('de-DE')+' XP</button>')+'</div></div>';}
        themesSections+='</div>';
      }
      if(catalog.skins&&catalog.skins.length){
        themesSections+='<div class="az-shop-section"><div class="az-shop-section-title">Skins</div>';
        for(var j=0;j<catalog.skins.length;j++){var s=catalog.skins[j];var isActiveSkin=themeSystem.getActiveSkin&&themeSystem.getActiveSkin().id===s.id;var isUnlockedSkin=s.id==='classic'||(themeSystem.isUnlocked&&themeSystem.isUnlocked('skin',s.id));themesSections+='<div class="az-shop-item az-theme-item"><div class="az-shop-icon" style="background:'+(s.accent||'var(--theme-primary)')+'; color:var(--theme-bg);">✨</div><div class="az-shop-info"><div class="az-shop-title">'+esc(s.name)+'</div><div class="az-shop-desc">'+esc(s.description)+'</div></div><div class="az-shop-actions">'+(isActiveSkin?'<button class="az-btn az-btn-ghost" disabled>Aktiv</button>':isUnlockedSkin?'<button class="az-btn az-theme-buy" data-type="skin" data-id="'+s.id+'">Aktivieren</button>':'<button class="az-btn az-theme-buy" data-type="skin" data-id="'+s.id+'" data-price="'+s.price+'">'+Number(s.price).toLocaleString('de-DE')+' XP</button>')+'</div></div>';}
        themesSections+='</div>';
      }
    }
    container.innerHTML='<div class="az-view-inner"><h1>Shop</h1><p class="az-view-sub">Schütze deine Lernserie und tausche deine Belohnungen ein.</p><div class="az-wallet"><span>🔥 '+esc(stats.dayStreak)+' Tage</span><span>🛡️ '+esc(stats.shields)+'/3 Tages-Schilde</span><span>🏰 '+esc(stats.weekShields)+'/1 Wochen-Schild</span><span>XP '+esc(stats.xp)+'</span></div>'+cards+themesSections+'</div>';
    container.querySelectorAll('.az-shop-buy').forEach(function(button){button.addEventListener('click',function(){var result=api&&api.purchase(button.getAttribute('data-item'),button.getAttribute('data-currency'),button.getAttribute('data-cost'));if(!result||!result.ok){var message=result&&result.reason==='daily_limit'?'Du kannst maximal 3 Tages-Schilde besitzen.':result&&result.reason==='weekly_limit'?'Du kannst maximal 1 Wochen-Schild besitzen.':'Nicht genug XP.';window.alert(message);return;}render(container);});});
    container.querySelectorAll('.az-theme-buy').forEach(function(button){button.addEventListener('click',function(){var themeSystem=getThemeSystem();if(!themeSystem)return;var type=button.getAttribute('data-type');var id=button.getAttribute('data-id');var price=Number(button.getAttribute('data-price')||0);if(type==='theme'&&themeSystem.isUnlocked('theme',id)){themeSystem.setActiveTheme(id);render(container);return;}if(type==='skin'&&themeSystem.isUnlocked('skin',id)){themeSystem.setActiveSkin(id);render(container);return;}var buyResult=themeSystem.purchaseWithXP(type,id,price);if(!buyResult||!buyResult.ok){var reason=buyResult&&buyResult.reason==='insufficient_xp'?'Nicht genug XP.':buyResult&&buyResult.reason==='already_unlocked'?'Bereits freigeschaltet.':'Kauf fehlgeschlagen.';window.alert(reason);return;}render(container);});});
  }
  window.AzbukaShopView={render:render};
})();
