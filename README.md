# Cricket Overlay Controller

A professional real-time cricket overlay controller built for live sports broadcasting. Control your cricket overlay from any device with instant synchronization.

**Developed by:** Nabin
**Powered by:** [Esabai Digital Services](https://esabai.com)

## ✨ Features

- **Real-time Control:** Manage live cricket matches from any device
- **Cross-device Sync:** Use your phone, tablet, or laptop as a controller
- **Professional Overlay:** Broadcast-quality graphics with smooth animations
- **Toss Integration:** Automatic team positioning based on toss result
- **Complete Match Management:** Setup, control, and statistics in one place
- **Sponsor Support:** Customizable scrolling sponsor text marquee
- **Results Display:** Dedicated results page for OBS integration

## 🎯 Use Cases

- Live cricket match broadcasting
- Tournament live streaming
- Sports event production
- Cricket coaching analysis

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start both Vite dev server and Socket.io server
npm run dev:all

# Or start individually:
npm run dev      # Frontend only
npm run server   # Backend only
```

Access the application:
- **Controller:** http://localhost:5173
- **Overlay:** http://localhost:5173/overlay
- **Results:** http://localhost:5173/results

## 📱 How It Works

### 1. Match Setup
- Enter team names and upload logos
- Add player rosters (minimum 11 per team)
- Conduct toss (winner & decision)
- Configure match settings (T20 format)

### 2. Match Control
- Live ball-by-ball scoring
- Batsmen selection from roster
- Bowler management from fielding team
- Partnership tracking
- Real-time updates across all devices

### 3. Statistics
- Comprehensive batting & bowling stats
- Partnership breakdown
- Fall of wickets
- Over-by-over analysis

## 🎨 Features Breakdown

### Match Setup Tab
- Team configuration with logo upload
- Player management (11+ per team)
- Toss simulation with automatic batting team determination
- Match format selection (T20 only)

### Match Control Tab
- Status management (Live, Break, Innings Break, etc.)
- Ball entry (runs, wickets, extras)
- Batsmen dropdown from batting team roster
- Bowler selection from fielding team roster
- Strike rotation control
- Innings switching

### Results Page
- Optimized for 1920x1080 OBS canvas
- Real-time score display
- Team logos with automatic positioning
- Compact statistics layout
- Transparent background for overlay

## 🛠️ Technology Stack

- **Frontend:** React 18.3.1, TypeScript, Tailwind CSS v4
- **Real-time:** Socket.io 4.8.3
- **Animations:** Motion (Framer Motion) 12.23.24
- **Build:** Vite 6.3.5
- **Routing:** React Router DOM 6.30.3

## 📦 Deployment

### Railway (Recommended)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/esabai/cricket-overlay-controller)

1. Push code to GitHub
2. Import repository on Railway
3. Set start command: `npm start`
4. Deploy!

### Environment Variables

No environment variables required for basic deployment.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

© 2025 Esabai Digital Services. All rights reserved.

## 👨‍💻 Developer

**Developed by:** [Nabin](https://github.com/nabin)

**About Esabai Digital Services:**
We provide cutting-edge digital solutions for sports broadcasting and live event production.

---

<div align="center">

**Esabai Digital Services**

*Innovating Sports Broadcasting*

</div>
