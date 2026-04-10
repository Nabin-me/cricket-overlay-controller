import { useMatchState } from '../useMatchState';

export function StatsDisplayTab() {
  const { state } = useMatchState();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-4 border-b border-white/10">
        <h1 className="text-2xl font-bold text-white">MATCH STATISTICS</h1>
        <p className="text-white/50 text-sm mt-1">Comprehensive match analysis</p>
      </div>

      {/* Live Score Display */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <h2 className="text-lg font-bold text-white mb-4">LIVE SCORE</h2>
        <div className="text-center py-6">
          <div className="text-6xl font-bold text-white mb-2" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
            {state.score}/{state.wickets}
          </div>
          <div className="text-xl text-white/70 font-mono">
            {state.overs}.{state.balls} OVERS
          </div>
        </div>
      </div>

      {/* Run Rates */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <h3 className="text-xs text-white/50 mb-2 font-mono">CURRENT RUN RATE</h3>
          <div className="text-4xl font-bold text-white" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
            {state.crr}
          </div>
        </div>
        {state.isChasing && state.target > 0 && (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <h3 className="text-xs text-white/50 mb-2 font-mono">REQUIRED RUN RATE</h3>
            <div className="text-4xl font-bold text-white" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
              {state.rrr}
            </div>
            <div className="text-sm text-white/50 mt-2">Need {state.target - state.score} runs from {(state.matchType === 'T20' ? 20 : state.matchType === 'ODI' ? 50 : state.matchType === 'T10' ? 10 : 90) - state.overs - 1} overs</div>
          </div>
        )}
      </div>

      {/* Partnership */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <h3 className="text-sm font-bold text-white mb-4">CURRENT PARTNERSHIP</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-5xl font-bold text-white" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
              {state.partnership.runs}
            </div>
            <div className="text-sm text-white/50 mt-1">RUNS</div>
          </div>
          <div>
            <div className="text-5xl font-bold text-white" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
              {state.partnership.balls}
            </div>
            <div className="text-sm text-white/50 mt-1">BALLS</div>
          </div>
        </div>
      </div>

      {/* Batsmen Stats */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <h3 className="text-sm font-bold text-white mb-4">BATSMEN STATISTICS</h3>
        <div className="space-y-4">
          <div className={`p-4 rounded-xl ${state.onStrike === 1 ? 'bg-white/10 border-2 border-white/30' : ''}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="font-bold text-white text-lg">{state.batsman1.name} *</div>
              {state.onStrike === 1 && (
                <div className="px-2 py-1 bg-white/20 text-white text-xs font-bold rounded">ON STRIKE</div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{state.batsman1.runs}</div>
                <div className="text-xs text-white/50">RUNS</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{state.batsman1.balls}</div>
                <div className="text-xs text-white/50">BALLS</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{state.batsman1.fours}</div>
                <div className="text-xs text-white/50">FOURS</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">{state.batsman1.sixes}</div>
                <div className="text-xs text-white/50">SIXES</div>
              </div>
            </div>
            <div className="text-sm text-white/50 mt-2">
              SR: {state.batsman1.balls > 0 ? ((state.batsman1.runs / state.batsman1.balls) * 100).toFixed(2) : '0.00'}
            </div>
          </div>

          <div className={`p-4 rounded-xl ${state.onStrike === 2 ? 'bg-white/10 border-2 border-white/30' : ''}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="font-bold text-white text-lg">{state.batsman2.name}</div>
              {state.onStrike === 2 && (
                <div className="px-2 py-1 bg-white/20 text-white text-xs font-bold rounded">ON STRIKE</div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{state.batsman2.runs}</div>
                <div className="text-xs text-white/50">RUNS</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{state.batsman2.balls}</div>
                <div className="text-xs text-white/50">BALLS</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{state.batsman2.fours}</div>
                <div className="text-xs text-white/50">FOURS</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">{state.batsman2.sixes}</div>
                <div className="text-xs text-white/50">SIXES</div>
              </div>
            </div>
            <div className="text-sm text-white/50 mt-2">
              SR: {state.batsman2.balls > 0 ? ((state.batsman2.runs / state.batsman2.balls) * 100).toFixed(2) : '0.00'}
            </div>
          </div>
        </div>
      </div>

      {/* Bowler Stats */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <h3 className="text-sm font-bold text-white mb-4">BOWLER STATISTICS</h3>
        <div className="text-center p-4 bg-white/5 rounded-xl mb-4">
          <div className="font-bold text-white text-xl mb-1">{state.bowler.name}</div>
          <div className="text-white/50 text-sm">Current Bowler</div>
        </div>
        <div className="grid grid-cols-5 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white">{state.bowler.overs}.{state.bowler.balls}</div>
            <div className="text-xs text-white/50">OVERS</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{state.bowler.maidens}</div>
            <div className="text-xs text-white/50">MAIDENS</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{state.bowler.runs}</div>
            <div className="text-xs text-white/50">RUNS</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-400">{state.bowler.wickets}</div>
            <div className="text-xs text-white/50">WICKETS</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              {state.bowler.balls > 0 ? ((state.bowler.runs / (state.bowler.overs * 6 + state.bowler.balls)) * 6).toFixed(2) : '0.00'}
            </div>
            <div className="text-xs text-white/50">ECON</div>
          </div>
        </div>
      </div>

      {/* Extras Breakdown */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <h3 className="text-sm font-bold text-white mb-4">EXTRAS BREAKDOWN</h3>
        <div className="text-center mb-4">
          <div className="text-4xl font-bold text-white" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
            {state.extras.total}
          </div>
          <div className="text-sm text-white/50">TOTAL EXTRAS</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="text-xl font-bold text-white">{state.extras.wides}</div>
            <div className="text-xs text-white/50 mt-1">WIDES</div>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="text-xl font-bold text-white">{state.extras.noBalls}</div>
            <div className="text-xs text-white/50 mt-1">NO BALLS</div>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="text-xl font-bold text-white">{state.extras.byes}</div>
            <div className="text-xs text-white/50 mt-1">BYES</div>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="text-xl font-bold text-white">{state.extras.legByes}</div>
            <div className="text-xs text-white/50 mt-1">LEG BYES</div>
          </div>
        </div>
      </div>

      {/* Fall of Wickets */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <h3 className="text-sm font-bold text-white mb-4">FALL OF WICKETS</h3>
        {state.fallOfWickets.length === 0 ? (
          <div className="text-center py-8 text-white/30">
            No wickets fallen yet
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {state.fallOfWickets.map((fow, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-sm font-bold">
                    {fow.wicket}
                  </div>
                  <div className="text-white">{fow.score} runs</div>
                </div>
                <div className="text-white/50 text-sm font-mono">{fow.overs} overs</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* This Over */}
      {state.thisOver.length > 0 && (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <h3 className="text-sm font-bold text-white mb-4">THIS OVER</h3>
          <div className="flex gap-3 flex-wrap justify-center">
            {state.thisOver.map((ball, index) => (
              <div
                key={index}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-2 ${
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
          <div className="mt-4 text-center text-white/50 text-sm">
            {state.thisOver.filter(b => b !== 'Wd' && b !== 'Nb' && b !== 'W').length} legal balls
          </div>
        </div>
      )}
    </div>
  );
}
