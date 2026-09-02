# 🐴 Азбука PRO - Cyrillic Alphabet Learning Game

[![Deploy to GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-blue)](https://sandeno92.github.io/Azbuka-PRO/)

A fun, interactive PWA (Progressive Web App) for learning the Russian Cyrillic alphabet with:
- 📚 Interactive alphabet cards with flip animations
- 🎮 Quiz mode with difficulty levels (Easy, Medium, Hard)
- ⭐ XP and Level system
- 🔥 Streak tracking
- 🏆 Global Leaderboard (via Supabase)
- 📱 Works offline with Service Worker caching
- 🎨 Beautiful gradient UI

## 🚀 Live Demo
**[Play Азбука PRO](https://sandeno92.github.io/Azbuka-PRO/)**

## 📋 Features

### Learning Modes
- **LERNEN** - Learn alphabet cards with flip animations
- **QUIZ** - Test your knowledge with multiple choice questions
- **RANGLISTE** - View global leaderboard (saved via Supabase)

### Game Mechanics
- **XP System** - Earn XP for correct answers
- **Levels** - Level up as you progress (1-35+)
- **Streaks** - Maintain answer streaks for bonus XP
- **Difficulty** - Game adjusts difficulty based on learned letters

### Technical Features
- ✅ PWA Support (installable on mobile)
- ✅ Offline Playable (Service Worker)
- ✅ Supabase Integration (Cloud Leaderboard)
- ✅ Local Storage (Game Progress)
- ✅ Responsive Design (Mobile-first)

## 🛠️ Tech Stack
- **Frontend:** HTML5, CSS3, JavaScript (React)
- **Backend:** Supabase PostgreSQL
- **Hosting:** GitHub Pages (Static)
- **PWA:** Service Workers + Web Manifest

## 📁 Project Structure
```
Azbuka-PRO/
├── index.html              # Main app
├── manifest.json           # PWA manifest
├── service-worker.js       # Offline caching
├── leaderboard-api.js      # Supabase integration
├── icon-*.png              # App icons
├── apple-touch-icon.png    # iOS icon
└── README.md               # This file
```

## 🔧 Setup & Deployment

### Local Development
```bash
# Clone repository
git clone https://github.com/SanDeno92/Azbuka-PRO.git
cd Azbuka-PRO

# Serve locally (use any HTTP server)
python -m http.server 8000
# Then open http://localhost:8000
```

### GitHub Pages Deployment
1. Push changes to `main` branch
2. GitHub automatically deploys to: `https://sandeno92.github.io/Azbuka-PRO/`
3. No additional setup needed!

## 🎯 Leaderboard Feature
The leaderboard is powered by **Supabase**:
- Real-time global scores
- Auto-saves top 50 players
- Cached locally for offline support
- Prevents duplicate entries (10-second cooldown)

### How Leaderboard Sends Data
When you finish a game:
```javascript
await saveToLeaderboard({
  name: 'YourName',
  correct: 50,
  xp: 1000,
  lvl: 5,
  streak: 10,
  bestStreak: 15
});
```

All data goes directly to Supabase (no backend required).

## 📱 Installation
### On Desktop
- Just open the link and bookmark it

### On Mobile (iOS)
1. Open in Safari
2. Tap Share → Add to Home Screen
3. Launch from home screen
4. Works offline!

### On Mobile (Android)
1. Open in Chrome
2. Menu → Install app
3. Launch from home screen
4. Works offline!

## 🐛 Troubleshooting

**Leaderboard not updating?**
- Check browser console (F12)
- Clear localStorage: `localStorage.clear()`
- Refresh page (Ctrl+Shift+R)

**App not working offline?**
- Ensure service worker is installed (first load)
- Check Application tab in DevTools

**Stuck on loading?**
- Clear cache and reload
- Try incognito mode

## 📊 Performance
- **Load Time:** < 1s
- **Offline:** Instant
- **Leaderboard Sync:** Every 10 seconds
- **Bundle Size:** ~400KB (minified)

## 📜 License
MIT License - Free to use and modify

## 👨‍💻 Author
**SanDeno92** - [GitHub Profile](https://github.com/SanDeno92)

---

**Удачи в изучении русского алфавита!** 🚀
(Good luck learning the Russian alphabet!)
