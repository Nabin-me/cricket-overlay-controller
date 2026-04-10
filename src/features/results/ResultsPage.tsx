import { useMatchState } from '../cricket-controller/useMatchState';
import { BrandFooter } from '../components/BrandFooter';

export default function ResultsPage() {
  const { state } = useMatchState();

  // Calculate strike rates
  const getStrikeRate = (runs: number, balls: number) => {
    if (balls === 0) return '0.00';
    return ((runs / balls) * 100).toFixed(2);
  };

  // Get batting team based on toss and innings
  const getBattingTeam = () => {
    if (!state.tossCompleted) return 1;
    if (state.tossDecision === 'bat') {
      return state.innings === 1 ? state.tossWinner : (state.tossWinner === 1 ? 2 : 1);
    } else {
      return state.innings === 1 ? (state.tossWinner === 1 ? 2 : 1) : state.tossWinner;
    }
  };

  const battingTeam = getBattingTeam();
  const battingTeamName = battingTeam === 1 ? state.team1 : state.team2;
  const battingTeamLogo = battingTeam === 1 ? state.team1Logo : state.team2Logo;
  const fieldingTeamName = battingTeam === 1 ? state.team2 : state.team1;
  const fieldingTeamLogo = battingTeam === 1 ? state.team2Logo : state.team1Logo;

  // Status indicator styles
  const getStatusStyles = () => {
    if (state.status === 'Live') {
      return 'bg-green-500/20 border-green-500/30 text-green-400';
    } else if (state.status.includes('Break') || state.status.includes('Delay')) {
      return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
    } else if (state.status.includes('Innings') || state.status === 'Stumps') {
      return 'bg-red-500/20 border-red-500/30 text-red-400';
    } else {
      return 'bg-white/5 border-white/10 text-white';
    }
  };

  return (
    <div className="min-h-screen" style={{
      background: 'transparent',
      fontFamily: '"Inter", sans-serif'
    }}>
      {/* Status Banner */}
      <div className={`sticky top-0 z-50 border-b border-white/10 backdrop-blur-sm px-4 py-2 ${getStatusStyles()}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              state.status === 'Live' ? 'bg-green-400' : 'bg-current'
            }`} />
            <span className="font-bold text-xs">
              {state.status === 'Live' ? 'LIVE' : state.status.toUpperCase()}
            </span>
          </div>
          <div className="text-xs font-mono opacity-70">
            Innings {state.innings}
          </div>
        </div>
      </div>

      {/* Content - Optimized for 1920x1080 OBS */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Main Score Card */}
        <div className="rounded-xl border p-4 mb-3" style={{
          background: 'linear-gradient(135deg, rgba(0, 3, 36, 0.85) 0%, rgba(31, 34, 75, 0.85) 100%)',
          borderColor: 'rgba(255, 255, 255, 0.1)'
        }}>
          <div className="grid grid-cols-3 gap-4 text-center items-center">
            {/* Team 1 */}
            <div className="space-y-1">
              {state.team1Logo && (
                <div className="flex justify-center">
                  <img
                    src={state.team1Logo}
                    alt={state.team1}
                    className="w-12 h-12 rounded-full object-contain"
                    style={{ clipPath: 'circle(24px at 24px 24px)' }}
                  />
                </div>
              )}
              <div className="text-white/70 text-xs">{state.team1}</div>
              <div className="text-4xl font-bold text-white" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                {(() => {
                  if (battingTeam === 1) return `${state.score}/${state.wickets}`;
                  if (state.innings === 2 && state.team1Score > 0) return `${state.team1Score}/${state.team1Wickets}`;
                  return '-';
                })()}
              </div>
            </div>

            {/* VS */}
            <div className="text-2xl font-bold text-white/30">VS</div>

            {/* Team 2 */}
            <div className="space-y-1">
              {state.team2Logo && (
                <div className="flex justify-center">
                  <img
                    src={state.team2Logo}
                    alt={state.team2}
                    className="w-12 h-12 rounded-full object-contain"
                    style={{ clipPath: 'circle(24px at 24px 24px)' }}
                  />
                </div>
              )}
              <div className="text-white/70 text-xs">{state.team2}</div>
              <div className="text-4xl font-bold text-white" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                {(() => {
                  if (battingTeam === 2) return `${state.score}/${state.wickets}`;
                  if (state.innings === 2 && state.team2Score > 0) return `${state.team2Score}/${state.team2Wickets}`;
                  return '-';
                })()}
              </div>
            </div>
          </div>

          {/* Match Info - Compact */}
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <div className="text-white/50 text-xs">OVERS</div>
                <div className="text-xl font-bold text-white" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                  {state.overs}.{state.balls}
                </div>
              </div>
              <div>
                <div className="text-white/50 text-xs">CRR</div>
                <div className="text-xl font-bold text-white" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                  {state.crr}
                </div>
              </div>
              {state.isChasing && state.target > 0 && (
                <>
                  <div>
                    <div className="text-white/50 text-xs">NEED</div>
                    <div className="text-xl font-bold text-white" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                      {state.target - state.score}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/50 text-xs">RRR</div>
                    <div className="text-xl font-bold text-white" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                      {state.rrr}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Two Column Layout for Stats */}
        <div className="grid grid-cols-2 gap-3">
          {/* Batting Stats */}
          <div className="rounded-xl border p-3" style={{
            background: 'linear-gradient(135deg, rgba(0, 3, 36, 0.85) 0%, rgba(31, 34, 75, 0.85) 100%)',
            borderColor: 'rgba(255, 255, 255, 0.1)'
          }}>
            <h2 className="text-sm font-bold text-white mb-2" style={{ fontFamily: '"Alumni Sans", sans-serif' }}>
              BATTING
            </h2>
            <div className="space-y-2">
              <div className={`flex items-center justify-between p-2 rounded ${state.onStrike === 1 ? 'bg-white/10' : ''}`}>
                <div className="flex items-center gap-2">
                  {battingTeamLogo && (
                    <img
                      src={battingTeamLogo}
                      alt={battingTeamName}
                      className="w-6 h-6 rounded-full object-contain"
                      style={{ clipPath: 'circle(12px at 12px 12px)' }}
                    />
                  )}
                  <div>
                    <div className="text-white font-bold text-sm">{state.batsman1.name}</div>
                    {state.onStrike === 1 && <div className="text-green-400 text-xs">⭐</div>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-mono font-bold">{state.batsman1.runs}</div>
                  <div className="text-white/50 text-xs">{state.batsman1.balls}b</div>
                </div>
              </div>

              <div className={`flex items-center justify-between p-2 rounded ${state.onStrike === 2 ? 'bg-white/10' : ''}`}>
                <div className="flex items-center gap-2">
                  <div className="w-6" />
                  <div>
                    <div className="text-white font-bold text-sm">{state.batsman2.name}</div>
                    {state.onStrike === 2 && <div className="text-green-400 text-xs">⭐</div>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-mono font-bold">{state.batsman2.runs}</div>
                  <div className="text-white/50 text-xs">{state.batsman2.balls}b</div>
                </div>
              </div>

              <div className="flex justify-between pt-2 border-t border-white/10 text-center">
                <div>
                  <div className="text-green-400 font-bold text-lg" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>{state.partnership.runs}</div>
                  <div className="text-white/50 text-xs">PARTNERSHIP</div>
                </div>
                <div>
                  <div className="text-white font-bold text-lg" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>{state.extras.total}</div>
                  <div className="text-white/50 text-xs">EXTRAS</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bowling Stats */}
          <div className="rounded-xl border p-3" style={{
            background: 'linear-gradient(135deg, rgba(0, 3, 36, 0.85) 0%, rgba(31, 34, 75, 0.85) 100%)',
            borderColor: 'rgba(255, 255, 255, 0.1)'
          }}>
            <h2 className="text-sm font-bold text-white mb-2" style={{ fontFamily: '"Alumni Sans", sans-serif' }}>
              BOWLING
            </h2>
            <div className="p-2 rounded" style={{ background: 'rgba(0, 0, 0, 0.2)' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {fieldingTeamLogo && (
                    <img
                      src={fieldingTeamLogo}
                      alt={fieldingTeamName}
                      className="w-6 h-6 rounded-full object-contain opacity-60"
                      style={{ clipPath: 'circle(12px at 12px 12px)' }}
                    />
                  )}
                  <div>
                    <div className="text-white font-bold text-sm">{state.bowler.name}</div>
                    <div className="text-white/50 text-xs">{fieldingTeamName}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-white font-mono font-bold">{state.bowler.overs}.{state.bowler.balls}</div>
                  <div className="text-white/50 text-xs">OV</div>
                </div>
                <div>
                  <div className="text-red-400 font-mono font-bold">{state.bowler.wickets}</div>
                  <div className="text-white/50 text-xs">WKTS</div>
                </div>
                <div>
                  <div className="text-white font-mono font-bold">{state.bowler.runs}</div>
                  <div className="text-white/50 text-xs">RUNS</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center mt-2">
                <div>
                  <div className="text-white font-mono font-bold">{state.bowler.maidens}</div>
                  <div className="text-white/50 text-xs">MAID</div>
                </div>
                <div>
                  <div className="text-white font-mono font-bold">
                    {state.bowler.balls > 0 ? ((state.bowler.runs / (state.bowler.overs * 6 + state.bowler.balls)) * 6).toFixed(1) : '0.0'}
                  </div>
                  <div className="text-white/50 text-xs">ECO</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* This Over - Compact */}
        {state.thisOver.length > 0 && (
          <div className="rounded-xl border p-3 mt-3" style={{
            background: 'linear-gradient(135deg, rgba(0, 3, 36, 0.85) 0%, rgba(31, 34, 75, 0.85) 100%)',
            borderColor: 'rgba(255, 255, 255, 0.1)'
          }}>
            <h2 className="text-sm font-bold text-white mb-2" style={{ fontFamily: '"Alumni Sans", sans-serif' }}>
              THIS OVER
            </h2>
            <div className="flex gap-2 flex-wrap justify-center">
              {state.thisOver.map((ball, index) => (
                <div
                  key={index}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                    ball === '4' || ball === '6'
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : ball === 'W'
                      ? 'bg-red-500/20 text-red-400 border-red-500/30'
                      : ball === 'Wd' || ball === 'Nb'
                      ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      : 'bg-white/5 text-white border-white/10'
                  }`}
                >
                  {ball}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fall of Wickets - Compact */}
        {state.fallOfWickets.length > 0 && (
          <div className="rounded-xl border p-3 mt-3" style={{
            background: 'linear-gradient(135deg, rgba(0, 3, 36, 0.85) 0%, rgba(31, 34, 75, 0.85) 100%)',
            borderColor: 'rgba(255, 255, 255, 0.1)'
          }}>
            <h2 className="text-sm font-bold text-white mb-2" style={{ fontFamily: '"Alumni Sans", sans-serif' }}>
              FALL OF WICKETS
            </h2>
            <div className="flex gap-2 flex-wrap">
              {state.fallOfWickets.slice(-5).map((fow, index) => (
                <div key={index} className="flex items-center gap-2 bg-white/5 rounded px-2 py-1">
                  <div className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs font-bold">
                    {fow.wicket}
                  </div>
                  <div className="text-white text-xs">
                    {fow.score} ({fow.overs})
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Brand Footer */}
      <BrandFooter />
    </div>
  );
}
