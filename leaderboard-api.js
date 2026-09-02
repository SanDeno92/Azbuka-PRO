// Supabase Leaderboard API (Direct Frontend)
const SUPABASE_URL = 'https://ivfkjsemrygskblepfrn.supabase.co';
const SUPABASE_KEY = 'sb_publishable_56eLZ-zIM_ItXl6rNe44Xw_8lxtp2Xc';

let leaderboardCache = [];
let lastLeaderboardFetch = 0;

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
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        }
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
  
  try {
    // Delete old entry for this player (within last 10s)
    try {
      await fetch(
        `${SUPABASE_URL}/rest/v1/leaderboard?name=eq.${encodeURIComponent(cleanName)}&date=gt.${Date.now() - 10000}`,
        {
          method: 'DELETE',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (e) {}
    
    // Insert new entry
    const postRes = await fetch(
      `${SUPABASE_URL}/rest/v1/leaderboard`,
      {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(entry)
      }
    );
    
    if (!postRes.ok) {
      const errText = await postRes.text();
      console.error('POST failed:', postRes.status, errText);
      return false;
    }
    
    // Fetch updated leaderboard
    const updated = await fetchLeaderboard();
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
