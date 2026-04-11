import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Serve static files from dist directory (production build)
app.use(express.static(path.join(__dirname, "dist")));

// SPA fallback - return index.html for all routes
app.get("*", (req, res) => {
  // Don't serve index.html for requests that look like files
  if (req.path.includes(".")) {
    return res.status(404).send("Not Found");
  }
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Default match state
const defaultMatchState = {
  matchType: "T20",
  team1: "Team A",
  team2: "Team B",
  team1Logo: "",
  team2Logo: "",
  team1Players: [],
  team2Players: [],
  tossWinner: null,
  tossDecision: null,
  tossCompleted: false,
  innings: 1,
  score: 0,
  wickets: 0,
  overs: 0,
  balls: 0,
  team1Score: 0,
  team1Wickets: 0,
  team1Overs: 0,
  team1Balls: 0,
  team2Score: 0,
  team2Wickets: 0,
  team2Overs: 0,
  team2Balls: 0,
  batsman1: { name: "Batsman 1", runs: 0, balls: 0, fours: 0, sixes: 0 },
  batsman2: { name: "Batsman 2", runs: 0, balls: 0, fours: 0, sixes: 0 },
  onStrike: 1,
  bowler: {
    name: "Bowler",
    overs: 0,
    balls: 0,
    maidens: 0,
    runs: 0,
    wickets: 0,
  },
  extras: { total: 0, wides: 0, noBalls: 0, byes: 0, legByes: 0 },
  thisOver: [],
  partnership: { runs: 0, balls: 0 },
  fallOfWickets: [],
  target: 0,
  isChasing: false,
  crr: "0.00",
  rrr: "0.00",
  status: "Live",
  lastEvent: null,
  showStatsOverlay: false,
  entryMode: "staged",
  sponsorText:
    "THIS IS A SPONSOR TEXT SPONSORED BY: XYZ MEDIA PRODUCTION, PRODUCTION: ESABAI DIGITAL SERVICES, EVENT PARTNER: ABC MEDIA, INTERNET..",
};

// Current match state (in-memory)
let matchState = { ...defaultMatchState };
let lastSnapshot = null;

// Helper function to calculate CRR
function calculateCRR(score, totalBalls) {
  if (totalBalls === 0) return "0.00";
  return ((score / totalBalls) * 6).toFixed(2);
}

// Helper function to calculate RRR
function calculateRRR(score, target, totalBalls, matchType) {
  if (!matchState.isChasing || target === 0) return "0.00";

  const maxOvers = { T20: 20, ODI: 50, T10: 10, Test: 90 }[matchType] || 20;
  const ballsLeft = maxOvers * 6 - totalBalls;
  const runsNeeded = target - score;

  if (ballsLeft <= 0 || runsNeeded <= 0) return "0.00";
  return ((runsNeeded / ballsLeft) * 6).toFixed(2);
}

// Helper function to get total balls
function getTotalBalls() {
  return matchState.overs * 6 + matchState.balls;
}

// Helper function to get current batsman (on strike)
function getStriker() {
  return matchState.onStrike === 1 ? matchState.batsman1 : matchState.batsman2;
}

// Helper function to get non-striker
function getNonStriker() {
  return matchState.onStrike === 1 ? matchState.batsman2 : matchState.batsman1;
}

// Helper function to rotate strike
function rotateStrike() {
  matchState.onStrike = matchState.onStrike === 1 ? 2 : 1;
}

// Recalculate and update rates
function recalculateRates() {
  const totalBalls = getTotalBalls();
  matchState.crr = calculateCRR(matchState.score, totalBalls);
  matchState.rrr = calculateRRR(
    matchState.score,
    matchState.target,
    totalBalls,
    matchState.matchType,
  );
}

// Broadcast state to all clients
function broadcastState() {
  io.emit("stateUpdate", matchState);
}

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Send current state to newly connected client
  socket.emit("stateUpdate", matchState);

  // Update state (partial update)
  socket.on("updateState", (payload) => {
    // Check if innings is changing from 1 to 2
    if (payload.innings === 2 && matchState.innings === 1) {
      // Determine which team was batting in innings 1
      const tossWinner = matchState.tossWinner;
      const tossDecision = matchState.tossDecision;
      let innings1Team = 1;

      if (tossWinner && tossDecision) {
        if (tossDecision === "bat") {
          innings1Team = tossWinner;
        } else {
          innings1Team = tossWinner === 1 ? 2 : 1;
        }
      }

      // Save the first innings score
      if (innings1Team === 1) {
        matchState.team1Score = matchState.score;
        matchState.team1Wickets = matchState.wickets;
        matchState.team1Overs = matchState.overs;
        matchState.team1Balls = matchState.balls;
      } else {
        matchState.team2Score = matchState.score;
        matchState.team2Wickets = matchState.wickets;
        matchState.team2Overs = matchState.overs;
        matchState.team2Balls = matchState.balls;
      }

      // Reset current score for innings 2
      matchState.score = 0;
      matchState.wickets = 0;
      matchState.overs = 0;
      matchState.balls = 0;
      matchState.thisOver = [];
      matchState.partnership = { runs: 0, balls: 0 };

      // Set target for second innings
      matchState.target =
        matchState.team1Score > 0 || matchState.team2Score > 0
          ? (matchState.team1Score || matchState.team2Score) + 1
          : 0;
      matchState.isChasing = true;
    }

    matchState = { ...matchState, ...payload };
    recalculateRates();
    broadcastState();
  });

  // Add ball - main scoring logic
  socket.on("addBall", (payload) => {
    // Save snapshot before processing
    lastSnapshot = JSON.parse(JSON.stringify(matchState));

    const { type, value = 0 } = payload;

    // Reset lastEvent
    matchState.lastEvent = null;

    // Determine lastEvent based on outcome
    if (type === "run" && value === 4) {
      matchState.lastEvent = "four";
    } else if (type === "run" && value === 6) {
      matchState.lastEvent = "six";
    } else if (type === "wicket" || type === "runout") {
      matchState.lastEvent = "wicket";
    }

    const striker = getStriker();
    const isLegal = !["wide", "noball"].includes(type);

    switch (type) {
      case "run":
        // Update score and batsman stats
        matchState.score += value;
        striker.runs += value;
        striker.balls += 1;
        matchState.bowler.balls += 1;

        if (value === 4) striker.fours += 1;
        if (value === 6) striker.sixes += 1;

        // Update bowler
        matchState.bowler.runs += value;

        // Update partnership
        matchState.partnership.runs += value;
        matchState.partnership.balls += 1;

        // Add to this over
        matchState.thisOver.push(value === 0 ? "•" : String(value));

        // Rotate strike on odd runs
        if (value % 2 !== 0) {
          rotateStrike();
        }
        break;

      case "wide":
        matchState.score += 1;
        matchState.extras.wides += 1;
        matchState.extras.total += 1;
        matchState.bowler.runs += 1;
        // Wide is not a legal delivery - don't increment balls or add to this over
        break;

      case "noball":
        matchState.score += 1;
        matchState.extras.noBalls += 1;
        matchState.extras.total += 1;
        matchState.bowler.runs += 1;
        // No ball is not a legal delivery - don't increment balls or add to this over
        break;

      case "bye":
        matchState.score += value;
        matchState.extras.byes += value;
        matchState.extras.total += value;
        matchState.bowler.balls += 1;
        // Byes don't go to bowler
        matchState.thisOver.push(`${value}b`);
        break;

      case "legbye":
        matchState.score += value;
        matchState.extras.legByes += value;
        matchState.extras.total += value;
        matchState.bowler.balls += 1;
        // Leg byes don't go to bowler
        matchState.thisOver.push(`${value}lb`);
        break;

      case "wicket":
      case "runout":
        matchState.wickets += 1;
        striker.balls += 1;
        matchState.bowler.balls += 1;
        matchState.bowler.wickets += (type === "wicket" ? 1 : 0);
        matchState.thisOver.push("W");

        // Add to fall of wickets
        matchState.fallOfWickets.push({
          score: matchState.score,
          wicket: matchState.wickets,
          overs: `${matchState.overs}.${matchState.balls}`,
        });

        // Reset partnership
        matchState.partnership = { runs: 0, balls: 0 };
        break;
    }

    // Increment balls for legal deliveries
    if (isLegal) {
      matchState.balls += 1;

      // Check for end of over
      if (matchState.balls === 6) {
        // End of over
        matchState.overs += 1;
        matchState.balls = 0;
        matchState.thisOver = [];

        // Rotate strike at end of over
        rotateStrike();

        // Update bowler stats
        matchState.bowler.overs += 1;
        matchState.bowler.balls = 0;
      }
    }

    recalculateRates();
    broadcastState();
  });

  // Reset match
  socket.on("resetMatch", () => {
    matchState = {
      matchType: "T20",
      team1: "Team A",
      team2: "Team B",
      team1Logo: "",
      team2Logo: "",
      team1Players: [],
      team2Players: [],
      tossWinner: null,
      tossDecision: null,
      tossCompleted: false,
      innings: 1,
      score: 0,
      wickets: 0,
      overs: 0,
      balls: 0,
      team1Score: 0,
      team1Wickets: 0,
      team1Overs: 0,
      team1Balls: 0,
      team2Score: 0,
      team2Wickets: 0,
      team2Overs: 0,
      team2Balls: 0,
      batsman1: { name: "Batsman 1", runs: 0, balls: 0, fours: 0, sixes: 0 },
      batsman2: { name: "Batsman 2", runs: 0, balls: 0, fours: 0, sixes: 0 },
      onStrike: 1,
      bowler: {
        name: "Bowler",
        overs: 0,
        balls: 0,
        maidens: 0,
        runs: 0,
        wickets: 0,
      },
      extras: { total: 0, wides: 0, noBalls: 0, byes: 0, legByes: 0 },
      thisOver: [],
      partnership: { runs: 0, balls: 0 },
      fallOfWickets: [],
      target: 0,
      isChasing: false,
      crr: "0.00",
      rrr: "0.00",
      status: "Live",
      lastEvent: null,
      showStatsOverlay: false,
      entryMode: "staged",
      sponsorText:
        "THIS IS A SPONSOR TEXT SPONSORED BY: XYZ MEDIA PRODUCTION, PRODUCTION: ESABAI DIGITAL SERVICES, EVENT PARTNER: ABC MEDIA, INTERNET..",
    };
    lastSnapshot = null;
    broadcastState();
  });

  // Undo last ball
  socket.on("undoLast", () => {
    if (lastSnapshot) {
      matchState = lastSnapshot;
      lastSnapshot = null;
      broadcastState();
    }
  });

  // Upload team logo
  socket.on("uploadTeamLogo", (payload) => {
    const { team, imageData } = payload;
    if (team === 1) {
      matchState.team1Logo = imageData;
    } else {
      matchState.team2Logo = imageData;
    }
    broadcastState();
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
