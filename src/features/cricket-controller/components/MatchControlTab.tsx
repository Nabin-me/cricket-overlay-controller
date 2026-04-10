import { useState } from 'react';
import { useMatchState } from '../useMatchState';
import { BallType } from '../types';

export function MatchControlTab() {
  const { state, updateState, addBall, undoLast } = useMatchState();
  const [stagedBall, setStagedBall] = useState<{ type: BallType; value?: number } | null>(null);
  const [replacementBatter, setReplacementBatter] = useState('');
  const [newBowlerName, setNewBowlerName] = useState('');

  const entryMode = state.entryMode || 'staged';

  // Determine which team is batting based on toss and innings
  const getBattingTeam = () => {
    if (!state.tossCompleted) return null;

    // If toss winner chose to bat
    if (state.tossDecision === 'bat') {
      // 1st innings: toss winner bats
      // 2nd innings: other team bats
      return state.innings === 1 ? state.tossWinner : (state.tossWinner === 1 ? 2 : 1);
    } else {
      // If toss winner chose to bowl
      // 1st innings: other team bats
      // 2nd innings: toss winner bats
      return state.innings === 1 ? (state.tossWinner === 1 ? 2 : 1) : state.tossWinner;
    }
  };

  const battingTeam = getBattingTeam(); // 1 or 2
  const fieldingTeam = battingTeam === 1 ? 2 : 1;

  // Get players based on which team is batting/fielding
  const battingPlayers = battingTeam === 1 ? (state.team1Players || []) : (state.team2Players || []);
  const fieldingPlayers = fieldingTeam === 1 ? (state.team1Players || []) : (state.team2Players || []);

  const battingTeamName = battingTeam === 1 ? state.team1 : state.team2;
  const fieldingTeamName = fieldingTeam === 1 ? state.team1 : state.team2;

  const handleSetEntryMode = (mode: 'staged' | 'quick') => {
    updateState({ entryMode: mode });
  };

  const handleBallClick = (type: BallType, value?: number) => {
    if (entryMode === 'staged') {
      setStagedBall({ type, value });
    } else {
      addBall({ type, value });
    }
  };

  const handleCommit = () => {
    if (stagedBall) {
      addBall(stagedBall);
      setStagedBall(null);
    }
  };

  const handleClear = () => {
    setStagedBall(null);
  };

  const handleSwapStrike = () => {
    updateState({ onStrike: state.onStrike === 1 ? 2 : 1 });
  };

  const handleReplaceBatter = () => {
    if (replacementBatter && replacementBatter !== 'Select a batsman') {
      const newBatter = {
        name: replacementBatter,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
      };
      updateState({ batsman1: newBatter });
      setReplacementBatter('');
    }
  };

  const handleSetBowler = () => {
    if (newBowlerName.trim()) {
      updateState({
        bowler: {
          name: newBowlerName,
          overs: 0,
          balls: 0,
          maidens: 0,
          runs: 0,
          wickets: 0,
        },
      });
      setNewBowlerName('');
    }
  };

  // Check if setup is complete
  const isSetupComplete = state.tossCompleted &&
    (state.team1Players?.length || 0) >= 11 &&
    (state.team2Players?.length || 0) >= 11;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-4 border-b border-white/10">
        <h1 className="text-2xl font-bold text-white">MATCH CONTROL</h1>
        <p className="text-white/50 text-sm mt-1">
          {isSetupComplete
            ? `${battingTeamName} batting vs ${fieldingTeamName} - Innings ${state.innings}`
            : '⚠️ Complete setup in Match Setup tab first'
          }
        </p>
      </div>

      {!isSetupComplete && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center">
          <div className="text-yellow-400 text-sm">
            ⚠️ Please complete match setup first (11 players per team + toss)
          </div>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Main Controls (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ball Entry - MOVED TO TOP */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">BALL ENTRY</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSetEntryMode('staged')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    entryMode === 'staged'
                      ? 'bg-white text-black'
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  STAGED
                </button>
                <button
                  onClick={() => handleSetEntryMode('quick')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    entryMode === 'quick'
                      ? 'bg-white text-black'
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  QUICK
                </button>
              </div>
            </div>

            {entryMode === 'staged' && stagedBall && (
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
                <div className="text-yellow-400 text-xs mb-1 font-mono">STAGED:</div>
                <div className="text-white text-xl font-mono font-bold">
                  {stagedBall.type === 'run' && stagedBall.value !== undefined ? (
                    stagedBall.value === 0 ? 'DOT BALL' : `${stagedBall.value} RUN${stagedBall.value > 1 ? 'S' : ''}`
                  ) : stagedBall.type === 'wide' ? (
                    'WIDE'
                  ) : stagedBall.type === 'noball' ? (
                    'NO BALL'
                  ) : stagedBall.type === 'bye' ? (
                    `${stagedBall.value} BYE`
                  ) : stagedBall.type === 'legbye' ? (
                    `${stagedBall.value} LEG BYE`
                  ) : stagedBall.type === 'wicket' ? (
                    'WICKET'
                  ) : (
                    'RUN OUT'
                  )}
                </div>
              </div>
            )}

            {/* Runs */}
            <div className="mb-4">
              <div className="text-xs text-white/50 mb-3 font-mono">RUNS</div>
              <div className="grid grid-cols-6 gap-3">
                {[0, 1, 2, 3, 4, 6].map((run) => (
                  <button
                    key={run}
                    onClick={() => handleBallClick('run', run)}
                    disabled={!isSetupComplete}
                    className={`aspect-square rounded-xl text-3xl font-mono font-bold transition-all ${
                      run === 4
                        ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border-2 border-green-500/30'
                        : run === 6
                        ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-2 border-blue-500/30'
                        : 'bg-white/5 hover:bg-white/10 text-white border-2 border-white/10'
                    } ${!isSetupComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {run === 0 ? '•' : run}
                  </button>
                ))}
              </div>
            </div>

            {/* Wickets */}
            <div className="mb-4">
              <div className="text-xs text-white/50 mb-3 font-mono">WICKETS</div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleBallClick('wicket')}
                  disabled={!isSetupComplete}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border-2 border-red-500/30 rounded-xl p-6 text-2xl font-mono font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  WICKET
                </button>
                <button
                  onClick={() => handleBallClick('runout')}
                  disabled={!isSetupComplete}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border-2 border-red-500/30 rounded-xl p-6 text-2xl font-mono font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  RUN OUT
                </button>
              </div>
            </div>

            {/* Extras */}
            <div className="mb-4">
              <div className="text-xs text-white/50 mb-3 font-mono">EXTRAS</div>
              <div className="grid grid-cols-6 gap-3">
                <button
                  onClick={() => handleBallClick('wide')}
                  disabled={!isSetupComplete}
                  className="bg-white/5 hover:bg-white/10 text-white border-2 border-white/10 rounded-xl p-4 text-lg font-mono font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Wd
                </button>
                <button
                  onClick={() => handleBallClick('noball')}
                  disabled={!isSetupComplete}
                  className="bg-white/5 hover:bg-white/10 text-white border-2 border-white/10 rounded-xl p-4 text-lg font-mono font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Nb
                </button>
                <button
                  onClick={() => handleBallClick('bye', 1)}
                  disabled={!isSetupComplete}
                  className="bg-white/5 hover:bg-white/10 text-white border-2 border-white/10 rounded-xl p-4 text-lg font-mono font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  1b
                </button>
                <button
                  onClick={() => handleBallClick('bye', 2)}
                  disabled={!isSetupComplete}
                  className="bg-white/5 hover:bg-white/10 text-white border-2 border-white/10 rounded-xl p-4 text-lg font-mono font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  2b
                </button>
                <button
                  onClick={() => handleBallClick('legbye', 1)}
                  disabled={!isSetupComplete}
                  className="bg-white/5 hover:bg-white/10 text-white border-2 border-white/10 rounded-xl p-4 text-lg font-mono font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  1lb
                </button>
                <button
                  onClick={() => handleBallClick('legbye', 2)}
                  disabled={!isSetupComplete}
                  className="bg-white/5 hover:bg-white/10 text-white border-2 border-white/10 rounded-xl p-4 text-lg font-mono font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  2lb
                </button>
              </div>
            </div>

            {/* Action buttons */}
            {entryMode === 'staged' && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={handleCommit}
                  disabled={!stagedBall}
                  className="bg-green-500 hover:bg-green-600 disabled:bg-white/10 disabled:text-white/30 text-white rounded-xl p-4 text-lg font-bold transition-all"
                >
                  COMMIT ✓
                </button>
                <button
                  onClick={handleClear}
                  disabled={!stagedBall}
                  className="bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-white/20 text-white rounded-xl p-4 text-lg font-bold transition-all"
                >
                  CLEAR ✕
                </button>
              </div>
            )}

            {/* Undo */}
            <button
              onClick={undoLast}
              className="w-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border-2 border-orange-500/30 rounded-xl p-4 text-lg font-bold transition-all"
            >
              UNDO LAST BALL
            </button>
          </div>

          {/* Current Batsmen */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <h2 className="text-lg font-bold text-white mb-2">
              CURRENT BATSMEN ({battingTeamName || 'Batting Team'})
            </h2>

            <div className="space-y-4">
              {/* Batter 1 Dropdown */}
              <div className="space-y-2">
                <label className="text-xs text-white/50 font-mono">BATSMAN 1 {state.onStrike === 1 && '⭐ ON STRIKE'}</label>
                <select
                  value={state.batsman1.name}
                  onChange={(e) => updateState({ batsman1: { ...state.batsman1, name: e.target.value } })}
                  disabled={!isSetupComplete}
                  className="w-full bg-white/5 text-white border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50"
                >
                  <option value="" className="bg-gray-900">Select batsman</option>
                  {battingPlayers.map((player) => (
                    <option key={player} value={player} className="bg-gray-900">
                      {player}
                    </option>
                  ))}
                  <option value={state.batsman1.name} className="bg-gray-900">
                    {state.batsman1.name}
                  </option>
                </select>
                <div className="text-white/50 text-xs font-mono">
                  {state.batsman1.runs} runs ({state.batsman1.balls} balls)
                  {state.batsman1.fours > 0 && <span className="ml-2 text-green-400">4s: {state.batsman1.fours}</span>}
                  {state.batsman1.sixes > 0 && <span className="ml-2 text-blue-400">6s: {state.batsman1.sixes}</span>}
                </div>
              </div>

              {/* Batter 2 Dropdown */}
              <div className="space-y-2">
                <label className="text-xs text-white/50 font-mono">BATSMAN 2 {state.onStrike === 2 && '⭐ ON STRIKE'}</label>
                <select
                  value={state.batsman2.name}
                  onChange={(e) => updateState({ batsman2: { ...state.batsman2, name: e.target.value } })}
                  disabled={!isSetupComplete}
                  className="w-full bg-white/5 text-white border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50"
                >
                  <option value="" className="bg-gray-900">Select batsman</option>
                  {battingPlayers.map((player) => (
                    <option key={player} value={player} className="bg-gray-900">
                      {player}
                    </option>
                  ))}
                  <option value={state.batsman2.name} className="bg-gray-900">
                    {state.batsman2.name}
                  </option>
                </select>
                <div className="text-white/50 text-xs font-mono">
                  {state.batsman2.runs} runs ({state.batsman2.balls} balls)
                  {state.batsman2.fours > 0 && <span className="ml-2 text-green-400">4s: {state.batsman2.fours}</span>}
                  {state.batsman2.sixes > 0 && <span className="ml-2 text-blue-400">6s: {state.batsman2.sixes}</span>}
                </div>
              </div>

              {/* Swap Strike Button */}
              <button
                onClick={handleSwapStrike}
                disabled={!isSetupComplete}
                className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl p-4 text-sm font-bold transition-all disabled:opacity-50"
              >
                🔄 SWAP STRIKE
              </button>
            </div>
          </div>

          {/* Replacement Batter */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <h2 className="text-lg font-bold text-white mb-4">REPLACEMENT BATSMAN</h2>
            <div className="space-y-3">
              <select
                value={replacementBatter}
                onChange={(e) => setReplacementBatter(e.target.value)}
                disabled={!isSetupComplete}
                className="w-full bg-white/5 text-white border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50"
              >
                <option value="">Select replacement batsman</option>
                {battingPlayers.map((player) => (
                  <option key={player} value={player} className="bg-gray-900">
                    {player}
                  </option>
                ))}
              </select>
              <button
                onClick={handleReplaceBatter}
                disabled={!replacementBatter || !isSetupComplete}
                className="w-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30 rounded-xl p-4 text-sm font-bold transition-all disabled:opacity-50"
              >
                REPLACE BATSMAN 1
              </button>
            </div>
          </div>

          {/* Current Bowler */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <h2 className="text-lg font-bold text-white mb-2">
              CURRENT BOWLER ({fieldingTeamName || 'Fielding Team'})
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
              <div className="text-white font-bold text-xl mb-2">{state.bowler.name}</div>
              <div className="text-white/70 text-sm font-mono">
                {state.bowler.overs}.{state.bowler.balls} overs | {state.bowler.runs} runs | {state.bowler.wickets} wickets | {state.bowler.maidens} maidens
              </div>
            </div>
            <div className="space-y-3">
              <select
                value={newBowlerName}
                onChange={(e) => setNewBowlerName(e.target.value)}
                disabled={!isSetupComplete}
                className="w-full bg-white/5 text-white border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50"
              >
                <option value="">Select bowler</option>
                {fieldingPlayers.map((player) => (
                  <option key={player} value={player} className="bg-gray-900">
                    {player}
                  </option>
                ))}
              </select>
              <button
                onClick={handleSetBowler}
                disabled={!newBowlerName || !isSetupComplete}
                className="w-full bg-white/10 hover:bg-white/20 text-white rounded-xl p-4 text-sm font-bold transition-all disabled:opacity-50"
              >
                SET BOWLER
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Small Controls (1/3 width) */}
        <div className="space-y-6">
          {/* Match Status */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <h2 className="text-sm font-bold text-white mb-4">MATCH STATUS</h2>
            <div className="space-y-2">
              <button
                onClick={() => updateState({ status: 'Live' })}
                className="w-full rounded-lg p-3 text-sm font-bold transition-all bg-green-500 text-white shadow-lg hover:bg-green-600"
              >
                🏏 LIVE
              </button>
              <button
                onClick={() => updateState({ status: 'Drinks Break' })}
                className="w-full rounded-lg p-3 text-sm font-bold transition-all bg-white/5 text-white hover:bg-white/10"
              >
                ⏸️ DRINKS BREAK
              </button>
              <button
                onClick={() => updateState({ status: 'Innings Break' })}
                className="w-full rounded-lg p-3 text-sm font-bold transition-all bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
              >
                🛑 END INNINGS
              </button>
            </div>
          </div>

          {/* Innings */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <h2 className="text-sm font-bold text-white mb-4">INNINGS</h2>
            <div className="space-y-2">
              <button
                onClick={() => updateState({ innings: 1 })}
                className={`w-full rounded-lg p-3 text-sm font-bold transition-all ${
                  state.innings === 1
                    ? 'bg-white text-black shadow-lg'
                    : 'bg-white/5 text-white hover:bg-white/10'
                }`}
              >
                1ST INNINGS
              </button>
              <button
                onClick={() => updateState({ innings: 2 })}
                className={`w-full rounded-lg p-3 text-sm font-bold transition-all ${
                  state.innings === 2
                    ? 'bg-white text-black shadow-lg'
                    : 'bg-white/5 text-white hover:bg-white/10'
                }`}
              >
                2ND INNINGS
              </button>
            </div>

            {/* Target (2nd innings only) */}
            {state.innings === 2 && (
              <div className="mt-4">
                <label className="text-xs text-white/50 mb-2 block font-mono">TARGET</label>
                <input
                  type="number"
                  value={state.target || ''}
                  onChange={(e) => updateState({ target: parseInt(e.target.value) || 0, isChasing: true })}
                  placeholder="Target Score"
                  className="w-full bg-white/5 text-white border border-white/10 rounded-lg p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
            )}
          </div>

          {/* Quick Info */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <h2 className="text-sm font-bold text-white mb-4">MATCH INFO</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/50">Format</span>
                <span className="text-white font-bold">{state.matchType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Score</span>
                <span className="text-white font-mono font-bold">{state.score}/{state.wickets}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Overs</span>
                <span className="text-white font-mono font-bold">{state.overs}.{state.balls}</span>
              </div>
              {state.isChasing && state.target > 0 && (
                <>
                  <div className="flex justify-between">
                    <span className="text-white/50">Need</span>
                    <span className="text-white font-mono font-bold">{state.target - state.score} runs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">RRR</span>
                    <span className="text-white font-mono font-bold">{state.rrr}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* View Stats Button */}
          <a
            href="/results"
            target="_blank"
            className="block bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-xl p-4 text-center text-sm font-bold transition-all"
          >
            📊 VIEW FULL STATS
          </a>
        </div>
      </div>
    </div>
  );
}
