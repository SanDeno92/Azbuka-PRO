
console.log('[Wortsuche] v10 FINAL MERGED - Shiny + Branding + ExtremFix');
(function () {
  'use strict';
  var STORAGE_LEVEL = 'azbuka_wortsuche_level';
  var STORAGE_DIFF = 'azbuka_wortsuche_diff';
  var CONFIG = {
    leicht: { size: 8, count: 5, dirs: ['H','V'], label: 'Leicht', info: 'Nur → waagerecht & ↓ senkrecht' },
    mittel: { size: 10, count: 7, dirs: ['H','V','D','D2'], label: 'Mittel', info: '→ ↓ + ↘ ↙ diagonal' },
    schwer: { size: 12, count: 9, dirs: ['H','V','D','D2','HR','VR'], label: 'Schwer', info: 'Alle Richtungen + rückwärts ← ↑' },
    extrem: { size: 15, count: 12, dirs: ['H','V','D','D2','HR','VR','DR','DR2'], label: 'Extrem', info: 'Alle 8 Richtungen ↕ ↔ ⤡ ⤢' }
  };
  var DIRS = { 'H': [0,1], 'HR': [0,-1], 'V': [1,0], 'VR': [-1,0], 'D': [1,1], 'D2': [1,-1], 'DR': [-1,-1], 'DR2': [-1,1] };
  var CYR = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'.split('');
  var state = { level: 1, diff: 'auto', grid: [], placed: [], found: new Set(), selecting: [], timer: 0, timerId: null, vocabMap: {} };

  function loadPersisted(){ try{ var l=parseInt(localStorage.getItem(STORAGE_LEVEL)||'1',10); if(l>=1) state.level=l; var d=localStorage.getItem(STORAGE_DIFF); if(d && (d==='auto'||CONFIG[d])) state.diff=d; }catch(e){} }
  function saveLevel(){ try{ localStorage.setItem(STORAGE_LEVEL, String(state.level)); }catch(e){} }
  function saveDiff(){ try{ localStorage.setItem(STORAGE_DIFF, state.diff); }catch(e){} }

  function getVocabEntries(){
    var raw = window.AZBUKA_VOKABELN || window.VOKABELN_DATA || [];
    if (!Array.isArray(raw) || raw.length===0) return [];
    var map={}, list=[];
    raw.forEach(function(entry){
      if (!entry || !entry.ru) return;
      var ru = String(entry.ru).trim().toLowerCase();
      if (!ru || ru.indexOf(' ')!==-1) return;
      if (ru.length<2 || ru.length>12) return;
      if (!/^[а-яё]+$/i.test(ru)) return;
      if (map[ru]) return;
      var de = entry.de ? String(entry.de).trim() : '—';
      map[ru] = { de: de, pron: entry.pron||'', kategorie: entry.kategorie||'' };
      list.push(ru);
    });
    state.vocabMap = map;
    return list;
  }

  function getCurrentConfig(){
    if (state.diff!=='auto') return CONFIG[state.diff];
    if (state.level<=2) return CONFIG.leicht;
    if (state.level<=5) return CONFIG.mittel;
    if (state.level<=8) return CONFIG.schwer;
    return CONFIG.extrem;
  }
  function getDiffInfo(){
    var cfg = getCurrentConfig();
    if (state.diff==='auto') return 'AUTO LVL '+state.level+' • '+cfg.info;
    return cfg.label.toUpperCase()+' • '+cfg.info;
  }

  function generateGrid(words, size, allowedDirKeys){
    for (var outer=0; outer<15; outer++){
      var grid = Array.from({length:size}, function(){ return Array(size).fill(null); });
      var placed=[];
      var dirs = allowedDirKeys.map(function(k){ return {key:k, vec:DIRS[k]}; }).filter(function(d){return d.vec;});
      var sorted = words.slice().sort(function(a,b){return b.length-a.length;});
      var ok=true;
      for (var wi=0; wi<sorted.length; wi++){
        var word=sorted[wi];
        var placedWord=false;
        for (var attempt=0; attempt<400; attempt++){
          var dirObj = dirs[Math.floor(Math.random()*dirs.length)];
          if(!dirObj) continue;
          var dr=dirObj.vec[0], dc=dirObj.vec[1];
          var minR=0,maxR=size-1,minC=0,maxC=size-1;
          if(dr===1) maxR=size-word.length;
          if(dr===-1) minR=word.length-1;
          if(dc===1) maxC=size-word.length;
          if(dc===-1) minC=word.length-1;
          if(minR>maxR||minC>maxC) continue;
          var r=minR+Math.floor(Math.random()*(maxR-minR+1));
          var c=minC+Math.floor(Math.random()*(maxC-minC+1));
          var can=true;
          for(var i=0;i<word.length;i++){ var rr=r+dr*i, cc=c+dc*i; if(grid[rr][cc]!==null && grid[rr][cc]!==word[i]){can=false;break;} }
          if(!can) continue;
          for(var j=0;j<word.length;j++){ var r2=r+dr*j,c2=c+dc*j; grid[r2][c2]=word[j]; }
          placed.push({word:word});
          placedWord=true; break;
        }
        if(!placedWord){ ok=false; break; }
      }
      if(ok && placed.length===words.length){
        for(var r=0;r<size;r++) for(var c=0;c<size;c++) if(grid[r][c]===null) grid[r][c]=CYR[Math.floor(Math.random()*CYR.length)];
        return {grid:grid, placed:placed};
      }
    }
    var grid2 = Array.from({length:size}, function(){ return Array(size).fill(null); });
    var placed2=[];
    var dirs2 = allowedDirKeys.map(function(k){ return {key:k, vec:DIRS[k]}; }).filter(function(d){return d.vec;});
    words.slice().sort(function(a,b){return b.length-a.length;}).forEach(function(word){
      for(var attempt=0; attempt<400; attempt++){
        var dirObj = dirs2[Math.floor(Math.random()*dirs2.length)];
        var dr=dirObj.vec[0], dc=dirObj.vec[1];
        var minR=0,maxR=size-1,minC=0,maxC=size-1;
        if(dr===1) maxR=size-word.length;
        if(dr===-1) minR=word.length-1;
        if(dc===1) maxC=size-word.length;
        if(dc===-1) minC=word.length-1;
        if(minR>maxR||minC>maxC) continue;
        var r=minR+Math.floor(Math.random()*(maxR-minR+1));
        var c=minC+Math.floor(Math.random()*(maxC-minC+1));
        var can=true;
        for(var i=0;i<word.length;i++){ var rr=r+dr*i, cc=c+dc*i; if(grid2[rr][cc]!==null && grid2[rr][cc]!==word[i]){can=false;break;} }
        if(!can) continue;
        for(var j=0;j<word.length;j++){ var r2=r+dr*j,c2=c+dc*j; grid2[r2][c2]=word[j]; }
        placed2.push({word:word}); break;
      }
    });
    for(var r=0;r<size;r++) for(var c=0;c<size;c++) if(grid2[r][c]===null) grid2[r][c]=CYR[Math.floor(Math.random()*CYR.length)];
    return {grid:grid2, placed:placed2};
  }

  function renderGame(container){
    if(!container) return;
    if(state.timerId){ clearInterval(state.timerId); state.timerId=null; }
    var vocabList=getVocabEntries();
    if(vocabList.length<5){
      container.innerHTML='<div style="padding:32px;text-align:center;color:#fff;"><div style="background:rgba(255,255,255,0.06);padding:18px;border-radius:16px;">Zu wenig Vokabeln: '+vocabList.length+'<br><small style="opacity:0.5">Brauche 5 ru: Wörter</small></div></div>';
      return;
    }
    var cfg=getCurrentConfig();
    var shuffled=vocabList.slice().sort(function(){return Math.random()-0.5;}).filter(function(w){return w.length<=cfg.size;});
    var chosen=shuffled.slice(0,cfg.count);
    if(chosen.length<cfg.count){
      var more=vocabList.filter(function(w){return w.length<=cfg.size && chosen.indexOf(w)===-1;}).slice(0,cfg.count-chosen.length);
      chosen=chosen.concat(more);
    }
    var gen=generateGrid(chosen,cfg.size,cfg.dirs);
    state.grid=gen.grid; state.placed=gen.placed; state.found=new Set(); state.selecting=[]; state.timer=0;
    var diffInfo=getDiffInfo();

    var html='<div class="ws-wrap ws-size-'+cfg.size+'">'
      +'<div class="ws-top">'
        +'<div class="ws-top-left">'
          +'<div class="ws-brand">'
            +'<img src="icon-512_1.png" class="ws-logo" onerror="this.src=\'icon-512.png\';this.onerror=null" alt="Azbuka PRO">'
            +'<div class="ws-brand-text"><div class="ws-brand-title">Азбука <span>PRO</span></div><div class="ws-brand-sub">WORTSUCHE • '+gen.placed.length+' WÖRTER • '+diffInfo+'</div></div>'
          +'</div>'
        +'</div>'
        +'<div class="ws-top-right">'
          +'<div class="ws-pill" id="wsTimer">00:00</div>'
          +'<div class="ws-pill"><span id="wsFound">0</span> / '+gen.placed.length+'</div>'
          +'<div class="ws-pill ws-pill-diff">'+(state.diff==='auto' ? 'AUTO LVL '+state.level : cfg.label.toUpperCase())+'</div>'
        +'</div>'
      +'</div>'
      +'<div class="ws-controls">'
        +'<div class="ws-diffbar">'
          +['auto','leicht','mittel','schwer','extrem'].map(function(d){
            var lbl=d==='auto'?'Auto':CONFIG[d].label;
            var act=state.diff===d?' ws-db-active':'';
            var title=d==='auto'?'Passt sich an dein Level an':CONFIG[d].info;
            return '<button class="ws-db'+act+'" data-diff="'+d+'" title="'+title+'">'+lbl+'</button>';
          }).join('')
        +'</div>'
        +'<button class="ws-new" id="wsNewBtn">Neues Gitter</button>'
      +'</div>'
      +'<div class="ws-info">ℹ️ '+diffInfo+'</div>'
      +'<div class="ws-main">'
        +'<div class="ws-grid" id="wsGrid" style="--ws-size:'+cfg.size+'">'
          +gen.grid.map(function(row,r){ return row.map(function(ch,c){ return '<div class="ws-cell" data-r="'+r+'" data-c="'+c+'">'+ch+'</div>'; }).join(''); }).join('')
        +'</div>'
        +'<div class="ws-side">'
          +'<div class="ws-side-head"><div class="ws-side-title">FINDE '+gen.placed.length+'</div><div class="ws-side-progress"><div class="ws-progress"><div class="ws-progress-fill" id="wsProgress"></div></div></div></div>'
          +'<div class="ws-wordlist">'
            +gen.placed.map(function(p){
              var info = state.vocabMap[p.word];
              var de = info ? info.de : '';
              return '<div class="ws-w" data-w="'+p.word+'"><div class="ws-w-left"><span class="ws-w-ru">'+p.word+'</span><span class="ws-w-de">'+de+'</span></div><span class="ws-w-check">✓</span></div>';
            }).join('')
          +'</div>'
          +'<div class="ws-hint">Ziehe über die Buchstaben, um Wörter zu markieren</div>'
        +'</div>'
      +'</div>'
    +'</div>';

    container.innerHTML=html;
    bindEvents(container);
    startTimer(container);
  }

  function bindEvents(root){
    var gridEl=root.querySelector('#wsGrid'); if(!gridEl) return;
    var isDown=false,startCell=null;
    function cellAt(x,y){ var el=document.elementFromPoint(x,y); return el?el.closest('.ws-cell'):null; }
    function lineBetween(a,b){
      if(!a||!b) return [a].filter(Boolean);
      var r1=parseInt(a.dataset.r,10),c1=parseInt(a.dataset.c,10),r2=parseInt(b.dataset.r,10),c2=parseInt(b.dataset.c,10);
      var dr=Math.sign(r2-r1),dc=Math.sign(c2-c1),dR=Math.abs(r2-r1),dC=Math.abs(c2-c1);
      if(!(r1===r2||c1===c2||dR===dC)) return [a];
      var len=Math.max(dR,dC),cells=[];
      for(var i=0;i<=len;i++){ var rr=r1+dr*i,cc=c1+dc*i; var cel=gridEl.querySelector('.ws-cell[data-r="'+rr+'"][data-c="'+cc+'"]'); if(cel) cells.push(cel); }
      return cells;
    }
    function clearSelecting(){ gridEl.querySelectorAll('.ws-cell.ws-sel').forEach(function(c){c.classList.remove('ws-sel');}); }

    gridEl.addEventListener('pointerdown', function(e){
      var cell=e.target.closest('.ws-cell'); if(!cell) return;
      isDown=true; startCell=cell; try{gridEl.setPointerCapture(e.pointerId);}catch(e){}
      clearSelecting(); state.selecting=[cell]; cell.classList.add('ws-sel'); e.preventDefault();
    });
    gridEl.addEventListener('pointermove', function(e){
      if(!isDown||!startCell) return;
      var over=cellAt(e.clientX,e.clientY); if(!over) return;
      var line=lineBetween(startCell,over); clearSelecting(); line.forEach(function(c){c.classList.add('ws-sel');}); state.selecting=line;
    });
    function onPointerUp(){
      if(!isDown) return;
      isDown=false;
      var currentSelection = state.selecting.slice();
      var word=currentSelection.map(function(c){return c.textContent;}).join('');
      var rev=word.split('').reverse().join('');
      var match=null;
      state.placed.forEach(function(p){ if(!state.found.has(p.word) && (p.word===word||p.word===rev)) match=p; });
      if(match){
        currentSelection.forEach(function(c,i){
          c.classList.remove('ws-sel');
          c.classList.add('ws-found');
          c.style.animationDelay = (i*0.06)+'s';
          setTimeout(function(){ c.style.animationDelay=''; }, 1000);
        });
        state.found.add(match.word);
        var row=root.querySelector('.ws-w[data-w="'+match.word+'"]');
        if(row){ row.classList.add('ws-w-done'); }
        var foundEl=root.querySelector('#wsFound'); if(foundEl) foundEl.textContent=String(state.found.size);
        var prog=root.querySelector('#wsProgress'); if(prog) prog.style.width=(state.found.size/state.placed.length*100)+'%';
        if(state.found.size===state.placed.length){ setTimeout(function(){ state.level++; saveLevel(); renderGame(root); },800); }
      }else{
        currentSelection.forEach(function(c){c.classList.add('ws-bad');});
        setTimeout(function(){
          currentSelection.forEach(function(c){ c.classList.remove('ws-bad','ws-sel'); });
        }, 500);
      }
      state.selecting=[]; startCell=null;
    }
    gridEl.addEventListener('pointerup', onPointerUp);
    gridEl.addEventListener('pointercancel', function(){ isDown=false; clearSelecting(); state.selecting=[]; startCell=null; });

    root.querySelectorAll('.ws-db').forEach(function(btn){
      btn.addEventListener('click', function(){
        state.diff=btn.dataset.diff; saveDiff();
        if(state.diff!=='auto'){state.level=1;saveLevel();}
        renderGame(root);
      });
    });
    var newBtn=root.querySelector('#wsNewBtn'); if(newBtn) newBtn.addEventListener('click', function(){ renderGame(root); });
  }

  function startTimer(root){
    if(state.timerId) clearInterval(state.timerId);
    state.timer=0;
    var el=root.querySelector('#wsTimer');
    state.timerId=setInterval(function(){
      state.timer++;
      if(!el) el=root.querySelector('#wsTimer');
      if(!el) return;
      var m=String(Math.floor(state.timer/60)).padStart(2,'0');
      var s=String(state.timer%60).padStart(2,'0');
      el.textContent=m+':'+s;
    },1000);
  }

  function init(){
    loadPersisted();
  }

  var GAMES = [
    { icon: '🔎', title: 'Wortsuche', desc: 'Finde russische Wörter im Buchstabengitter', play: true },
    { icon: '🔒', title: 'Bald', desc: 'Neues Spiel in Arbeit' },
    { icon: '🔒', title: 'Bald', desc: 'Neues Spiel in Arbeit' }
  ];

  function el(tag, cls, text){
    var n=document.createElement(tag);
    if(cls) n.className=cls;
    if(text!=null) n.textContent=text;
    return n;
  }

  function showHub(overlay){
    if(state.timerId){ clearInterval(state.timerId); state.timerId=null; }
    overlay.textContent='';
    var inner=el('div','az-view-inner az-spiele-hub');
    inner.appendChild(el('h1',null,'Spiele'));
    inner.appendChild(el('p','az-view-sub','Welches Spiel möchtest du spielen?'));
    GAMES.forEach(function(g){
      var card=el(g.play?'button':'div','az-shop-item az-hub-item'+(g.play?'':' az-hub-soon'));
      if(g.play) card.type='button';
      card.appendChild(el('div','az-shop-icon',g.icon));
      var info=el('div','az-shop-info');
      info.appendChild(el('div','az-shop-title',g.title));
      info.appendChild(el('div','az-shop-desc',g.desc));
      card.appendChild(info);
      if(g.play) card.addEventListener('click',function(){ showGame(overlay); });
      inner.appendChild(card);
    });
    overlay.appendChild(inner);
    overlay.scrollTop=0;
  }

  function showGame(overlay){
    overlay.textContent='';
    var inner=el('div','az-view-inner');
    inner.style.maxWidth='1080px';
    var back=el('button','az-learn-back','‹ Spiele');
    back.type='button';
    back.style.marginBottom='12px';
    back.addEventListener('click',function(){ showHub(overlay); });
    inner.appendChild(back);
    var gameRoot=el('div');
    gameRoot.id='spieleGameRoot';
    inner.appendChild(gameRoot);
    overlay.appendChild(inner);
    renderGame(gameRoot);
  }

  window.AzbukaSpieleView={
    render:function(overlay){
      try{
        if(!overlay) return;
        overlay.classList.add('open');
        overlay.style.display='block';
        overlay.style.background='var(--theme-bg, #0A1E0A)';
        showHub(overlay);
      }catch(e){
        console.error(e);
        overlay.textContent='Fehler: '+e.message;
      }
    }
  };
  window.AzbukaWortsucheView=window.AzbukaSpieleView;
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
