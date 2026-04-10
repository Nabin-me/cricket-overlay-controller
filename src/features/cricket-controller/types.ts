// Ball types for scoring
export type BallType = 'run' | 'wide' | 'noball' | 'bye' | 'legbye' | 'wicket' | 'runout';

// Match format types
export type MatchFormat = 'T20' | 'ODI' | 'T10' | 'Test';

// Innings type
export type InningsType = 1 | 2;

// Match status
export type MatchStatus = 'Live' | 'Drinks Break' | 'Innings Break' | 'Rain Delay' | 'Tea' | 'Stumps';

// Batsman stats
export interface Batsman {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
}

// Bowler stats
export interface Bowler {
  name: string;
  overs: number;
  balls: number;
  maidens: number;
  runs: number;
  wickets: number;
}

// Extras
export interface Extras {
  total: number;
  wides: number;
  noBalls: number;
  byes: number;
  legByes: number;
}

// Partnership
export interface Partnership {
  runs: number;
  balls: number;
}

// Fall of wicket
export interface FallOfWicket {
  score: number;
  wicket: number;
  overs: string;
}

// Toss decision type
export type TossDecision = 'bat' | 'bowl';

// Toss winner type
export type TossWinner = 1 | 2;

// Main match state
export interface MatchState {
  matchType: MatchFormat;
  team1: string;
  team2: string;
  team1Logo: string; // base64 or URL
  team2Logo: string; // base64 or URL
  team1Players: string[]; // list of player names
  team2Players: string[]; // list of player names
  tossWinner: TossWinner | null; // which team won the toss
  tossDecision: TossDecision | null; // what they chose
  tossCompleted: boolean; // whether toss has been done
  innings: InningsType;
  score: number; // current batting team's score
  wickets: number; // current innings wickets
  overs: number;
  balls: number; // balls in current over 0-5
  team1Score: number; // Team 1's final score (0 if not batted yet)
  team1Wickets: number; // Team 1's final wickets
  team1Overs: number; // Team 1's final overs
  team1Balls: number; // Team 1's final balls
  team2Score: number; // Team 2's final score (0 if not batted yet)
  team2Wickets: number; // Team 2's final wickets
  team2Overs: number; // Team 2's final overs
  team2Balls: number; // Team 2's final balls
  batsman1: Batsman;
  batsman2: Batsman;
  onStrike: 1 | 2; // which batsman is on strike
  bowler: Bowler;
  extras: Extras;
  thisOver: string[]; // ball-by-ball for current over
  partnership: Partnership;
  fallOfWickets: FallOfWicket[];
  target: number;
  isChasing: boolean;
  crr: string; // current run rate
  rrr: string; // required run rate
  status: MatchStatus;
  lastEvent: 'four' | 'six' | 'wicket' | null;
  showStatsOverlay: boolean; // whether to show stats overlay instead of live score
  entryMode: 'staged' | 'quick'; // ball entry mode preference
  sponsorText: string; // scrolling sponsor text
}

// Socket event payloads
export interface UpdateStatePayload {
  [key: string]: any;
}

export interface AddBallPayload {
  type: BallType;
  value?: number;
}

export interface UploadTeamLogoPayload {
  team: 1 | 2;
  imageData: string;
}
