# Cricket Scoring System

A real-time cricket scoring system with Socket.io backend, React controller UI, and OBS overlay.

## Features

- **Live Cricket Scoring** - Real-time score updates with Socket.io
- **OBS Overlay** - Beautiful cricket scoreboard for streaming
- **Controller Panel** - Desktop and mobile-friendly scoring interface
- **Event Animations** - FOUR!, SIX!, OUT! animations with particle effects
- **Team Logo Upload** - Support for custom team logos
- **Match Statistics** - CRR, RRR, partnerships, extras, fall of wickets
- **Ball-by-Ball Tracking** - Complete over history with visual pips

## Quick Start

### Development Mode

Run both the React dev server and Socket.io backend:

```bash
npm run dev:all
```

This starts:
- React dev server on `http://localhost:5173`
- Socket.io server on `http://localhost:3000`

### Production Mode

1. Build the React app:
```bash
npm run build
```

2. Start the server:
```bash
npm run server
```

3. Access the application at `http://localhost:3000`

## Routes

- **`/`** or **`/controller`** - Scoring control panel
- **`/overlay`** - OBS browser source (transparent background, no scrollbars)

## OBS Setup

1. Build and start the production server
2. In OBS Studio, add a **Browser Source**
3. Set URL to: `http://your-server-ip:3000/overlay`
4. Set width to `1920` and height to `1080`
5. Check "Control audio via OBS" (optional)
6. Click OK

The overlay has a transparent background and will display over your video feed.

## Controller Features

### Column 1: Match Setup
- Set team names and logos
- Choose match format (T20, ODI, T10, Test)
- Toggle between innings
- Set target score (2nd innings)
- Match status (Live, Drinks Break, Innings Break, etc.)
- Reset match (with confirmation)

### Column 2: Players
- View and set batsmen names
- Tap batsman to set strike
- Add new batsman (replaces non-striker)
- Set bowler name
- Swap ends, reset partnership

### Column 3: Ball Entry
- **Staged Delivery**: Tap a ball button, then COMMIT
- **Runs**: Dot (•), 1, 2, 3, 4, 6
- **Wickets**: Out, Run Out
- **Extras**: Wide, No Ball, Bye, Leg Bye
- **Quick Actions**: Instant commit without staging
- **Undo Last Ball**: Revert to previous state

### Column 4: Stats
- Live score (runs/wickets)
- Overs, CRR, RRR (when chasing)
- Partnership
- Extras breakdown
- Fall of wickets
- This over (ball-by-ball pips)

## Mobile Support

On screens smaller than 900px, the controller switches to a bottom-tab layout with 4 tabs:
- **BALL** - Ball entry controls
- **PLAYERS** - Batsmen and bowler management
- **STATS** - Live statistics
- **MATCH** - Match setup options

## Technologies

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, Socket.io
- **Build**: Vite

## Environment Variables

Create a `.env` file in the project root:

```
VITE_SOCKET_URL=http://localhost:3000
```

For production, this defaults to the same origin as the server.

## License

MIT
