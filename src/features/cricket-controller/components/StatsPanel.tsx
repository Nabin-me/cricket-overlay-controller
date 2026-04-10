import { useMatchState } from '../useMatchState';

export function StatsPanel() {
  const { state } = useMatchState();

  return (
    <div className="flex flex-col gap-3 p-4 bg-[#0c0c0c] border border-gray-800">
      <h3 className="text-sm font-bold text-white mb-2" style={{ fontFamily: 'IBM Plex Sans Condensed, sans-serif' }}>
        STATS
      </h3>

      {/* Live Score */}
      <div className="bg-[#1a1a1a] border border-gray-700 rounded p-4 mb-3">
        <div className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
          {state.score}/{state.wickets}
        </div>
        <div className="text-sm text-gray-400 font-mono">
          {state.overs}.{state.balls} OVERS
        </div>
      </div>

      {/* Run Rates */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-[#1a1a1a] border border-gray-700 rounded p-3">
          <div className="text-xs text-gray-500 mb-1 font-mono">CRR</div>
          <div className="text-xl font-bold text-white" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
            {state.crr}
          </div>
        </div>
        {state.isChasing && state.target > 0 && (
          <div className="bg-[#1a1a1a] border border-gray-700 rounded p-3">
            <div className="text-xs text-gray-500 mb-1 font-mono">RRR</div>
            <div className="text-xl font-bold text-white" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
              {state.rrr}
            </div>
          </div>
        )}
      </div>

      {/* Partnership */}
      <div className="bg-[#1a1a1a] border border-gray-700 rounded p-3 mb-3">
        <div className="text-xs text-gray-500 mb-1 font-mono">PARTNERSHIP</div>
        <div className="text-lg font-bold text-white" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
          {state.partnership.runs} ({state.partnership.balls})
        </div>
      </div>

      {/* Extras */}
      <div className="mb-3">
        <div className="text-xs text-gray-500 mb-2 font-mono">EXTRAS</div>
        <div className="bg-[#1a1a1a] border border-gray-700 rounded p-3 mb-2">
          <div className="text-lg font-bold text-white" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
            {state.extras.total}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#1a1a1a] border border-gray-700 rounded p-2">
            <div className="text-xs text-gray-500 font-mono">WIDES</div>
            <div className="text-sm font-bold text-white font-mono">{state.extras.wides}</div>
          </div>
          <div className="bg-[#1a1a1a] border border-gray-700 rounded p-2">
            <div className="text-xs text-gray-500 font-mono">NO BALLS</div>
            <div className="text-sm font-bold text-white font-mono">{state.extras.noBalls}</div>
          </div>
          <div className="bg-[#1a1a1a] border border-gray-700 rounded p-2">
            <div className="text-xs text-gray-500 font-mono">BYES</div>
            <div className="text-sm font-bold text-white font-mono">{state.extras.byes}</div>
          </div>
          <div className="bg-[#1a1a1a] border border-gray-700 rounded p-2">
            <div className="text-xs text-gray-500 font-mono">LEG BYES</div>
            <div className="text-sm font-bold text-white font-mono">{state.extras.legByes}</div>
          </div>
        </div>
      </div>

      {/* Fall of Wickets */}
      <div className="mb-3">
        <div className="text-xs text-gray-500 mb-2 font-mono">FALL OF WICKETS</div>
        {state.fallOfWickets.length === 0 ? (
          <div className="bg-[#1a1a1a] border border-gray-700 rounded p-3 text-sm text-gray-500 text-center">
            No wickets yet
          </div>
        ) : (
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {state.fallOfWickets.map((fow, index) => (
              <div
                key={index}
                className="bg-[#1a1a1a] border border-gray-700 rounded p-2 text-xs font-mono"
              >
                <span className="text-white">{fow.wicket} wkt</span>
                <span className="text-gray-500 ml-2">@ {fow.score}</span>
                <span className="text-gray-600 ml-2">({fow.overs} ov)</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* This Over */}
      {state.thisOver.length > 0 && (
        <div>
          <div className="text-xs text-gray-500 mb-2 font-mono">THIS OVER</div>
          <div className="flex gap-2 flex-wrap">
            {state.thisOver.map((ball, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono border ${
                  ball === '4' || ball === '6'
                    ? 'bg-green-900/50 text-green-400 border-green-700'
                    : ball === 'W'
                    ? 'bg-red-900/50 text-red-400 border-red-700'
                    : ball === 'Wd' || ball === 'Nb'
                    ? 'bg-yellow-900/50 text-yellow-400 border-yellow-700'
                    : 'bg-[#1a1a1a] text-white border-gray-700'
                }`}
              >
                {ball}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
