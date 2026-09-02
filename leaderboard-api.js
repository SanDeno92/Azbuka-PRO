// Supabase Leaderboard API (Direct Frontend)
const SUPABASE_URL = 'https://ivfkjsemrygskblepfrn.supabase.co';
const SUPABASE_KEY = 'sb_publishable_56eLZ-zIM_ItXl6rNe44Xw_8lxtp2Xc';

let leaderboardCache = [];
let lastLeaderboardFetch = 0;
const browserFetch = window.fetch.bind(window);

// Route the bundled app's legacy leaderboard path directly through Supabase.
window.fetch = async (input, init) => {
  const requestUrl = typeof input === 'string' ? input : input.url;
  const pathname = new URL(requestUrl, window.location.href).pathname;

  if (!pathname.endsWith('/functions/leaderboard')) {
    return browserFetch(input, init);
  }

  if (init && init.method === 'POST' && typeof init.body === 'string') {
    const result = await saveToLeaderboard(JSON.parse(init.body));
    return new Response(JSON.stringify(result), {
      status: result === false ? 502 : 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify(await fetchLeaderboard()), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

async function fetchLeaderboard() {
  const now = Date.now();
  if (now - lastLeaderboardFetch < 3000 && leaderboardCache.length > 0) {
    return leaderboardCache;
  }
  
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/leaderboard?select=*&order=correct.desc,xp.desc&limit=50`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    );
    
    if (!res.ok) {
      console.error('Leaderboard fetch failed:', res.status);
      return leaderboardCache;
    }
    
    const data = await res.json();
    leaderboardCache = Array.isArray(data) ? data : [];
    lastLeaderboardFetch = now;
    
    // Speicher lokal
    try {
      localStorage.setItem('azbuka_leaderboard', JSON.stringify(leaderboardCache));
    } catch (e) {}
    
    return leaderboardCache;
  } catch (e) {
    console.error('Leaderboard fetch error:', e.message);
    
    // Fallback zu lokalstorage
    try {
      const cached = localStorage.getItem('azbuka_leaderboard');
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    
    return leaderboardCache;
  }
}

async function saveToLeaderboard(playerData) {
  const { name, correct, xp, lvl, streak, bestStreak } = playerData;
  
  if (!name || name.trim() === '') {
    console.error('Player name required');
    return false;
  }
  
  const cleanName = String(name).slice(0, 18).replace(/[<>]/g, '') || 'Anon';
  const entry = {
    name: cleanName,
    correct: Math.max(0, Number(correct) || 0),
    xp: Math.max(0, Number(xp) || 0),
    lvl: Math.max(1, Number(lvl) || 1),
    streak: Number(streak) || 0,
    beststreak: Number(bestStreak) || 0,
    date: Math.floor(Date.now())
  };
  
  console.log('Saving entry:', entry);
  
  try {
    // Check if player already exists
    const checkRes = await fetch(
      `${SUPABASE_URL}/rest/v1/leaderboard?name=eq.${encodeURIComponent(cleanName)}&select=id,correct,xp`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    );
    
    if (checkRes.ok) {
      const existing = await checkRes.json();
      console.log('Existing entries for', cleanName, ':', existing);
      
      if (Array.isArray(existing) && existing.length > 0) {
        const best = existing[0]; // Beste Einträge zuerst
        
        // Vergleich: Neue Score ist besser?
        const newScoreIsWorse = (entry.correct < best.correct) || 
                                (entry.correct === best.correct && entry.xp < best.xp);
        
        if (newScoreIsWorse) {
          console.log('New score is worse than existing best. Skipping save.');
          return await fetchLeaderboard(); // Return existing without change
        }
        
        // Neue Score ist gleich oder besser → alte löschen
        if ((entry.correct > best.correct) || (entry.correct === best.correct && entry.xp > best.xp)) {
          try {
            await fetch(
              `${SUPABASE_URL}/rest/v1/leaderboard?id=eq.${best.id}`,
              {
                method: 'DELETE',
                headers: {
                  'apikey': SUPABASE_KEY,
                  'Content-Type': 'application/json'
                }
              }
            );
            console.log('Deleted old entry:', best.id);
          } catch (e) {
            console.error('Delete failed:', e.message);
          }
        }
      }
    }
    
    // Insert new entry
    const postRes = await fetch(
      `${SUPABASE_URL}/rest/v1/leaderboard`,
      {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(entry)
      }
    );
    
    console.log('POST response status:', postRes.status);
    
    if (!postRes.ok) {
      const errText = await postRes.text();
      console.error('POST failed:', postRes.status, errText);
      return false;
    }
    
    // Refresh leaderboard after save
    lastLeaderboardFetch = 0; // Force refresh
    const updated = await fetchLeaderboard();
    console.log('Leaderboard after save:', updated.length, 'entries');
    return updated;
  } catch (e) {
    console.error('Save to leaderboard error:', e.message);
    return false;
  }
}

// Auto-load leaderboard on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    fetchLeaderboard();
  });
} else {
  fetchLeaderboard();
}

// Periodically refresh
setInterval(fetchLeaderboard, 10000);
