# Quick Start Guide

## Starting the Application

### Option 1: Development Mode (Recommended for testing)
```bash
npm run dev:all
```
This starts both servers:
- React Dev Server: http://localhost:5173 (or 5174, 5175 if ports are busy)
- Socket.io Server: http://localhost:3000

### Option 2: Production Mode
```bash
# Step 1: Build the React app
npm run build

# Step 2: Start the server
npm run server
```
Application will be available at: http://localhost:3000

## Access Points

| Route | Purpose | URL |
|-------|---------|-----|
| `/` or `/controller` | Scoring Control Panel | http://localhost:5173/ |
| `/overlay` | OBS Browser Source | http://localhost:5173/overlay |

## Using the Controller

### Step 1: Setup Match (Column 1 / Match Tab)
1. Enter team names and click "SET TEAMS"
2. Upload team logos (optional)
3. Select format (T20, ODI, T10, Test)
4. Select innings (1ST or 2ND)
5. If 2nd innings, enter target score
6. Set status to "Live"

### Step 2: Set Players (Column 2 / Players Tab)
1. Enter batsman names in the input fields
2. Click a batsman card to set who is on strike (white dot = striker)
3. Enter bowler name and click "SET"

### Step 3: Score Balls (Column 3 / Ball Tab)
**Staged Delivery (Recommended):**
1. Tap the ball type (runs, wide, wicket, etc.)
2. Review the staged delivery in yellow box
3. Click "COMMIT" to send the ball
4. Click "CLR" to cancel staging

**Quick Actions (Instant):**
- Use the bottom row for instant scoring without staging
- Perfect for common deliveries: dot, +1, +4, +6, wide, wicket

### Step 4: Monitor Stats (Column 4 / Stats Tab)
- Live score and wickets
- Current run rate (CRR)
- Required run rate (RRR) in 2nd innings
- Partnership stats
- Extras breakdown
- Fall of wickets
- This over ball-by-ball

## Setting Up OBS

### Step 1: Start Production Server
```bash
npm run build
npm run server
```

### Step 2: Add Browser Source in OBS
1. Open OBS Studio
2. In Sources panel, click **+** → **Browser**
3. Name it "Cricket Scoreboard"
4. Settings:
   - **URL**: `http://localhost:3000/overlay`
   - **Width**: 1920
   - **Height**: 1080
   - **Custom CSS**: (leave empty for transparent background)
5. Click **OK**

### Step 3: Position and Scale
- Drag the scoreboard to desired position
- Hold Alt key and drag edges to crop/scale

### For Remote Streaming
Replace `localhost` with your server IP:
```
http://YOUR-SERVER-IP:3000/overlay
```

## Controller Features

### Ball Entry
- **Runs**: • (dot), 1, 2, 3, 4, 6
- **Wickets**: W (out), RO (run out)
- **Extras**: Wd (wide), Nb (no ball), 1b/2b (bye), 1lb/2lb (leg bye)
- **Staging**: Stage → Review → Commit (prevents mistakes)
- **Quick Actions**: No staging, instant commit
- **Undo**: Revert last ball (restores previous state)

### Player Management
- Tap batsman to change strike
- Edit names in input fields
- "New Batter In" replaces non-striker
- "Swap Ends" changes strike
- "New Partnership" resets partnership counter

### Match Controls
- Change match format anytime
- Switch between innings
- Update match status (Live, Drinks, Rain Delay, etc.)
- Reset entire match (with confirmation)

## Animations

When scoring events happen:
- **FOUR!** - Green animation with particles
- **SIX!** - Blue animation with more particles
- **OUT!** - Red animation with scoreboard shake

Animations show on `/overlay` route only.

## Connection Status

- **Green dot** = Connected to server
- **Red dot** = Disconnected

Check the status indicator in the ScoreBar (top) or bottom-right corner.

## Keyboard Shortcuts

None currently - all touch/click based for mobile compatibility.

## Tips

1. **Always use staging** for important deliveries to avoid mistakes
2. **Check connection status** before starting a live match
3. **Test animations** on overlay before going live
4. **Undo last ball** works even after switching tabs
5. **Mobile friendly** - use tablet/phone for scoring on-the-go

## Troubleshooting

**Server won't start?**
- Check if port 3000 is already in use
- Kill existing Node processes: `taskkill /F /IM node.exe` (Windows)

**Can't connect to socket?**
- Ensure server is running: `npm run server`
- Check VITE_SOCKET_URL in .env file
- Try refreshing the browser

**Overlay has black background?**
- Make sure you're using `/overlay` route
- Don't use `/controller` route in OBS
- Check browser source settings in OBS

**Animations not showing?**
- Only works on `/overlay` route
- Check lastEvent is being set (check browser console)
- Ensure AnimationOverlay component is mounted

**Build errors?**
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf dist && npm run build`

## Support

For issues or questions, check the console logs:
- Server logs: Terminal where `npm run server` is running
- Client logs: Browser DevTools (F12 → Console)
