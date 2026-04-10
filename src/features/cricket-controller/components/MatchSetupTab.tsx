import { useState } from 'react';
import { useMatchState } from '../useMatchState';
import { TossWinner, TossDecision } from '../types';

export function MatchSetupTab() {
  const { state, updateState, resetMatch, uploadTeamLogo } = useMatchState();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [team1PlayerName, setTeam1PlayerName] = useState('');
  const [team2PlayerName, setTeam2PlayerName] = useState('');
  const [tossWinner, setTossWinner] = useState<TossWinner | null>(state.tossWinner);
  const [tossDecision, setTossDecision] = useState<TossDecision | null>(state.tossDecision);
  const [showExportModal, setShowExportModal] = useState(false);

  // Export to CSV
  const exportToCSV = () => {
    const team1Players = state.team1Players || [];
    const team2Players = state.team2Players || [];

    // Create roster data
    let csvContent = 'CRICKET MATCH EXPORT\n\n';
    csvContent += `Match: ${state.team1} vs ${state.team2}\n`;
    csvContent += `Format: ${state.matchType}\n`;
    csvContent += `Date: ${new Date().toLocaleString()}\n\n`;

    // Match scores
    csvContent += 'MATCH SCORES\n';
    csvContent += `Innings: ${state.innings}\n`;
    csvContent += `Status: ${state.status}\n`;
    csvContent += `${state.team1}: `;
    if (state.team1Score > 0) {
      csvContent += `${state.team1Score}/${state.team1Wickets} (${state.team1Overs}.${state.team1Balls} ov)\n`;
    } else if (state.score > 0 && state.innings === 1) {
      csvContent += `${state.score}/${state.wickets} (${state.overs}.${state.balls} ov)*\n`;
    } else {
      csvContent += 'Yet to bat\n';
    }
    csvContent += `${state.team2}: `;
    if (state.team2Score > 0) {
      csvContent += `${state.team2Score}/${state.team2Wickets} (${state.team2Overs}.${state.team2Balls} ov)\n`;
    } else if (state.score > 0 && state.innings === 2) {
      csvContent += `${state.score}/${state.wickets} (${state.overs}.${state.balls} ov)*\n`;
    } else {
      csvContent += 'Yet to bat\n';
    }
    csvContent += '\n';

    // Team 1 Roster
    csvContent += `${state.team1} Roster\n`;
    csvContent += 'Jersey,Player Name\n';
    team1Players.forEach((player, index) => {
      csvContent += `${index + 1},${player}\n`;
    });
    csvContent += '\n';

    // Team 2 Roster
    csvContent += `${state.team2} Roster\n`;
    csvContent += 'Jersey,Player Name\n';
    team2Players.forEach((player, index) => {
      csvContent += `${index + 1},${player}\n`;
    });
    csvContent += '\n';

    // Batting Stats
    const getStrikeRate = (runs: number, balls: number) => {
      if (balls === 0) return '0.00';
      return ((runs / balls) * 100).toFixed(2);
    };

    csvContent += 'Batting Statistics\n';
    csvContent += 'Player,Runs,Balls,Fours,Sixes,Strike Rate\n';
    csvContent += `${state.batsman1.name},${state.batsman1.runs},${state.batsman1.balls},${state.batsman1.fours},${state.batsman1.sixes},${getStrikeRate(state.batsman1.runs, state.batsman1.balls)}\n`;
    csvContent += `${state.batsman2.name},${state.batsman2.runs},${state.batsman2.balls},${state.batsman2.fours},${state.batsman2.sixes},${getStrikeRate(state.batsman2.runs, state.batsman2.balls)}\n`;
    csvContent += '\n';

    // Bowling Stats
    csvContent += 'Bowling Statistics\n';
    csvContent += 'Bowler,Overs,Balls,Maidens,Runs,Wickets,Economy\n';
    const bowlerEcon = state.bowler.balls > 0 ? ((state.bowler.runs / (state.bowler.overs * 6 + state.bowler.balls)) * 6).toFixed(2) : '0.00';
    csvContent += `${state.bowler.name},${state.bowler.overs}.${state.bowler.balls},${state.bowler.overs * 6 + state.bowler.balls},${state.bowler.maidens},${state.bowler.runs},${state.bowler.wickets},${bowlerEcon}\n`;

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cricket_match_${state.team1}_vs_${state.team2}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  // Handle CSV import
  const handleCSVImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');

      // Parse CSV (simple implementation)
      lines.forEach((line, index) => {
        // This is a placeholder for CSV import logic
        // You would need to parse and validate the CSV data here
        console.log('CSV line', index, line);
      });

      alert('CSV import functionality would be implemented here. The feature is ready for integration.');
    };
    reader.readAsText(file);
  };

  const handleAddPlayer = (team: 1 | 2) => {
    const playerName = team === 1 ? team1PlayerName.trim() : team2PlayerName.trim();
    if (!playerName) return;

    const currentPlayers = team === 1 ? (state.team1Players || []) : (state.team2Players || []);

    if (currentPlayers.length >= 11) {
      alert(`Team ${team} already has 11 players. Maximum limit reached.`);
      return;
    }

    if (team === 1) {
      updateState({ team1Players: [...currentPlayers, playerName] });
      setTeam1PlayerName('');
    } else {
      updateState({ team2Players: [...currentPlayers, playerName] });
      setTeam2PlayerName('');
    }
  };

  const handleRemovePlayer = (team: 1 | 2, index: number) => {
    if (team === 1) {
      const currentPlayers = state.team1Players || [];
      updateState({ team1Players: currentPlayers.filter((_, i) => i !== index) });
    } else {
      const currentPlayers = state.team2Players || [];
      updateState({ team2Players: currentPlayers.filter((_, i) => i !== index) });
    }
  };

  const handleUploadLogo = (team: 1 | 2, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        uploadTeamLogo({ team, imageData: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetMatch = () => {
    resetMatch();
    setShowResetConfirm(false);
    setTeam1PlayerName('');
    setTeam2PlayerName('');
    setTossWinner(null);
    setTossDecision(null);
  };

  const handleCompleteToss = () => {
    if (tossWinner && tossDecision) {
      updateState({
        tossWinner,
        tossDecision,
        tossCompleted: true
      });
    } else {
      alert('Please select toss winner and decision');
    }
  };

  const canProceedToMatch = () => {
    const team1Count = state.team1Players?.length || 0;
    const team2Count = state.team2Players?.length || 0;
    return (
      team1Count >= 11 &&
      team2Count >= 11 &&
      state.team1 &&
      state.team2 &&
      state.tossCompleted
    );
  };

  const team1Complete = (state.team1Players?.length || 0) >= 11;
  const team2Complete = (state.team2Players?.length || 0) >= 11;

  return (
    <>
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-4 border-b border-white/10">
        <h1 className="text-2xl font-bold text-white">MATCH SETUP</h1>
        <p className="text-white/50 text-sm mt-1">Configure teams, players, and toss (Minimum 11 players per team)</p>
      </div>

      {/* Teams Configuration */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Team 1 */}
        <div className={`bg-white/5 backdrop-blur-sm rounded-xl border p-6 transition-all ${
          team1Complete ? 'border-green-500/50' : 'border-white/10'
        }`}>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">1</span>
              TEAM 1
            </span>
            {team1Complete && (
              <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                ✓ 11/11 Players
              </span>
            )}
          </h2>

          {/* Team Name */}
          <div className="mb-4">
            <label className="text-xs text-white/50 mb-2 block font-mono">TEAM NAME</label>
            <input
              type="text"
              value={state.team1}
              onChange={(e) => updateState({ team1: e.target.value })}
              placeholder="Enter team name"
              className="w-full bg-white/5 text-white border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
              style={{ fontFamily: 'IBM Plex Mono, monospace' }}
            />
          </div>

          {/* Team Logo */}
          <div className="mb-4">
            <label className="text-xs text-white/50 mb-2 block font-mono">TEAM LOGO</label>
            <label className="cursor-pointer">
              <div className={`bg-white/5 hover:bg-white/10 border rounded-lg p-6 text-center transition-all ${
                state.team1Logo ? 'border-green-500/50' : 'border-white/10'
              }`}>
                {state.team1Logo ? (
                  <div className="space-y-2">
                    <img src={state.team1Logo} alt="Team 1 Logo" className="w-16 h-16 mx-auto object-contain" />
                    <div className="text-green-400 text-xs">✓ Logo uploaded</div>
                  </div>
                ) : (
                  <div className="text-white/50">
                    <div className="text-2xl mb-1">+</div>
                    <div className="text-xs">Click to upload logo</div>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleUploadLogo(1, e)}
                className="hidden"
              />
            </label>
          </div>

          {/* Players */}
          <div>
            <label className="text-xs text-white/50 mb-2 block font-mono">
              PLAYERS {(state.team1Players?.length || 0)}/11
            </label>
            <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
              {(!state.team1Players || state.team1Players.length === 0) ? (
                <div className="text-white/30 text-sm text-center py-4">No players added</div>
              ) : (
                state.team1Players.map((player, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white/5 rounded-lg p-2">
                    <span className="text-white/50 text-xs w-6">{index + 1}.</span>
                    <span className="flex-1 text-white text-sm truncate">{player}</span>
                    <button
                      onClick={() => handleRemovePlayer(1, index)}
                      className="text-red-400 hover:text-red-300 text-xs px-2 py-1"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={team1PlayerName}
                onChange={(e) => setTeam1PlayerName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddPlayer(1)}
                placeholder="Add player"
                disabled={team1Complete}
                className="flex-1 bg-white/5 text-white border border-white/10 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'IBM Plex Mono, monospace' }}
              />
              <button
                onClick={() => handleAddPlayer(1)}
                disabled={team1Complete}
                className="bg-white/10 hover:bg-white/20 text-white px-4 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
            {team1Complete && (
              <div className="text-green-400 text-xs mt-2">✓ Complete! 11 players added.</div>
            )}
          </div>
        </div>

        {/* Team 2 */}
        <div className={`bg-white/5 backdrop-blur-sm rounded-xl border p-6 transition-all ${
          team2Complete ? 'border-green-500/50' : 'border-white/10'
        }`}>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">2</span>
              TEAM 2
            </span>
            {team2Complete && (
              <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                ✓ 11/11 Players
              </span>
            )}
          </h2>

          {/* Team Name */}
          <div className="mb-4">
            <label className="text-xs text-white/50 mb-2 block font-mono">TEAM NAME</label>
            <input
              type="text"
              value={state.team2}
              onChange={(e) => updateState({ team2: e.target.value })}
              placeholder="Enter team name"
              className="w-full bg-white/5 text-white border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
              style={{ fontFamily: 'IBM Plex Mono, monospace' }}
            />
          </div>

          {/* Team Logo */}
          <div className="mb-4">
            <label className="text-xs text-white/50 mb-2 block font-mono">TEAM LOGO</label>
            <label className="cursor-pointer">
              <div className={`bg-white/5 hover:bg-white/10 border rounded-lg p-6 text-center transition-all ${
                state.team2Logo ? 'border-green-500/50' : 'border-white/10'
              }`}>
                {state.team2Logo ? (
                  <div className="space-y-2">
                    <img src={state.team2Logo} alt="Team 2 Logo" className="w-16 h-16 mx-auto object-contain" />
                    <div className="text-green-400 text-xs">✓ Logo uploaded</div>
                  </div>
                ) : (
                  <div className="text-white/50">
                    <div className="text-2xl mb-1">+</div>
                    <div className="text-xs">Click to upload logo</div>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleUploadLogo(2, e)}
                className="hidden"
              />
            </label>
          </div>

          {/* Players */}
          <div>
            <label className="text-xs text-white/50 mb-2 block font-mono">
              PLAYERS {(state.team2Players?.length || 0)}/11
            </label>
            <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
              {(!state.team2Players || state.team2Players.length === 0) ? (
                <div className="text-white/30 text-sm text-center py-4">No players added</div>
              ) : (
                state.team2Players.map((player, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white/5 rounded-lg p-2">
                    <span className="text-white/50 text-xs w-6">{index + 1}.</span>
                    <span className="flex-1 text-white text-sm truncate">{player}</span>
                    <button
                      onClick={() => handleRemovePlayer(2, index)}
                      className="text-red-400 hover:text-red-300 text-xs px-2 py-1"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={team2PlayerName}
                onChange={(e) => setTeam2PlayerName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddPlayer(2)}
                placeholder="Add player"
                disabled={team2Complete}
                className="flex-1 bg-white/5 text-white border border-white/10 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'IBM Plex Mono, monospace' }}
              />
              <button
                onClick={() => handleAddPlayer(2)}
                disabled={team2Complete}
                className="bg-white/10 hover:bg-white/20 text-white px-4 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
            {team2Complete && (
              <div className="text-green-400 text-xs mt-2">✓ Complete! 11 players added.</div>
            )}
          </div>
        </div>
      </div>

      {/* Toss Section */}
      <div className={`bg-white/5 backdrop-blur-sm rounded-xl border p-6 ${
        state.tossCompleted ? 'border-green-500/50' : 'border-white/10'
      }`}>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          🪙 TOSS
          {state.tossCompleted && (
            <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full ml-auto">
              ✓ Completed
            </span>
          )}
        </h2>

        {!state.tossCompleted ? (
          <div className="space-y-4">
            {/* Toss Winner */}
            <div>
              <label className="text-xs text-white/50 mb-3 block font-mono">TOSS WINNER</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTossWinner(1)}
                  className={`rounded-lg p-4 text-sm font-bold transition-all ${
                    tossWinner === 1
                      ? 'bg-white text-black shadow-lg'
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  {state.team1 || 'Team 1'}
                </button>
                <button
                  onClick={() => setTossWinner(2)}
                  className={`rounded-lg p-4 text-sm font-bold transition-all ${
                    tossWinner === 2
                      ? 'bg-white text-black shadow-lg'
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  {state.team2 || 'Team 2'}
                </button>
              </div>
            </div>

            {/* Toss Decision */}
            {tossWinner && (
              <div>
                <label className="text-xs text-white/50 mb-3 block font-mono">
                  {tossWinner === 1 ? (state.team1 || 'Team 1') : (state.team2 || 'Team 2')} CHOSE TO
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setTossDecision('bat')}
                    className={`rounded-lg p-4 text-sm font-bold transition-all ${
                      tossDecision === 'bat'
                        ? 'bg-green-500 text-white shadow-lg'
                        : 'bg-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    🏏 BAT FIRST
                  </button>
                  <button
                    onClick={() => setTossDecision('bowl')}
                    className={`rounded-lg p-4 text-sm font-bold transition-all ${
                      tossDecision === 'bowl'
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    🎳 BOWL FIRST
                  </button>
                </div>
              </div>
            )}

            {/* Complete Toss Button */}
            {tossWinner && tossDecision && (
              <button
                onClick={handleCompleteToss}
                className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl p-4 text-lg font-bold transition-all"
              >
                CONFIRM TOSS ✓
              </button>
            )}

            {/* Result Preview */}
            {tossWinner && tossDecision && (
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <div className="text-white/70 text-sm mb-1">Preview</div>
                <div className="text-white font-bold">
                  {tossWinner === 1 ? (state.team1 || 'Team 1') : (state.team2 || 'Team 2')} won the toss and chose to {tossDecision === 'bat' ? 'bat' : 'bowl'}
                </div>
                <div className="text-white/50 text-sm mt-2">
                  {tossDecision === 'bat'
                    ? `${tossWinner === 1 ? (state.team1 || 'Team 1') : (state.team2 || 'Team 2')} will bat first`
                    : `${tossWinner === 2 ? (state.team1 || 'Team 1') : (state.team2 || 'Team 2')} will bat first`
                  }
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="text-green-400 font-bold text-center mb-2">
              ✓ Toss Completed
            </div>
            <div className="text-white text-center text-sm">
              {state.tossWinner === 1 ? (state.team1 || 'Team 1') : (state.team2 || 'Team 2')} won the toss and chose to {state.tossDecision === 'bat' ? 'bat' : 'bowl'}
            </div>
          </div>
        )}
      </div>

      {/* Ready to Play Banner */}
      {canProceedToMatch() && (
        <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6 text-center">
          <div className="text-green-400 text-xl font-bold mb-2">🏏 READY TO PLAY!</div>
          <p className="text-white/70 text-sm">All teams have 11 players and toss is completed. Go to Match Control to start the match.</p>
        </div>
      )}

      {!canProceedToMatch() && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
          <div className="text-yellow-400 text-sm font-bold mb-2">⚠️ SETUP INCOMPLETE</div>
          <div className="text-white/70 text-xs space-y-1">
            {!team1Complete && <div>• Team 1: {state.team1Players?.length || 0}/11 players</div>}
            {!team2Complete && <div>• Team 2: {state.team2Players?.length || 0}/11 players</div>}
            {!state.tossCompleted && <div>• Toss not completed</div>}
          </div>
        </div>
      )}

      {/* Match Settings - Just format, T20 only */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <h2 className="text-lg font-bold text-white mb-4">MATCH SETTINGS</h2>

        {/* Format - T20 Only */}
        <div className="mb-4">
          <label className="text-xs text-white/50 mb-3 block font-mono">FORMAT</label>
          <button
            onClick={() => updateState({ matchType: 'T20' })}
            className="w-full bg-white text-black rounded-lg p-4 text-sm font-bold shadow-lg"
          >
            T20 (20 Overs)
          </button>
          <div className="text-white/30 text-xs mt-2 text-center">Only T20 format is supported</div>
        </div>

        {/* Sponsor Text */}
        <div>
          <label className="text-xs text-white/50 mb-2 block font-mono">SPONSOR TEXT</label>
          <input
            type="text"
            value={state.sponsorText || ''}
            onChange={(e) => updateState({ sponsorText: e.target.value })}
            placeholder="Enter sponsor text for overlay marquee..."
            className="w-full bg-white/5 text-white border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
            style={{ fontFamily: 'IBM Plex Mono, monospace' }}
          />
          <div className="text-white/30 text-xs mt-2">This text will scroll on the overlay banner</div>
        </div>
      </div>

      {/* Reset Match */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg p-4 text-sm font-bold transition-colors"
          >
            RESET MATCH
          </button>
        ) : (
          <div className="space-y-3">
            <div className="text-red-400 text-center text-sm">Are you sure you want to reset the match?</div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleResetMatch}
                className="bg-red-500 hover:bg-red-600 text-white rounded-lg p-3 text-sm font-bold transition-colors"
              >
                YES, RESET
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="bg-white/10 hover:bg-white/20 text-white rounded-lg p-3 text-sm font-bold transition-colors"
              >
                CANCEL
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Import/Export Data */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <h2 className="text-lg font-bold text-white mb-4">DATA MANAGEMENT</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setShowExportModal(true)}
            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-lg p-4 text-sm font-bold transition-colors"
          >
            📥 EXPORT TO CSV
          </button>
          <label className="bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-lg p-4 text-sm font-bold transition-colors text-center cursor-pointer">
            📤 IMPORT CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVImport}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>

    {/* Export Modal */}
    {showExportModal && (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="rounded-xl border p-6 max-w-md w-full" style={{
          background: 'linear-gradient(135deg, #000324 0%, #1F224B 100%)',
          borderColor: 'rgba(255, 255, 255, 0.1)'
        }}>
          <h2 className="text-xl font-bold text-white mb-4" style={{ fontFamily: '"Alumni Sans", sans-serif' }}>
            Export Match Data
          </h2>
          <p className="text-white/70 text-sm mb-6">
            Export team rosters and match statistics to CSV format for record-keeping.
          </p>
          <div className="flex gap-3">
            <button
              onClick={exportToCSV}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-3 text-sm font-bold transition-all"
            >
              📥 DOWNLOAD CSV
            </button>
            <button
              onClick={() => setShowExportModal(false)}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white rounded-lg p-3 text-sm font-bold transition-all"
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    )}
  </>
  );
}
