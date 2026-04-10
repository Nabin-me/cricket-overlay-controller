import { useMatchState } from '../useMatchState';

export function ScoreBar() {
  const { state, connected } = useMatchState();

  return (
    <div className="sticky top-0 z-50 bg-[#0c0c0c] border-b border-gray-800 px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Teams + Score */}
        <div className="flex items-center gap-4">
          <div className="text-sm font-mono text-white">
            <span className="font-bold">{state.team1}</span>
            <span className="text-gray-500 mx-1">vs</span>
            <span className="font-bold">{state.team2}</span>
          </div>
          <div className="text-xl font-bold text-white" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
            {state.score}/{state.wickets}
          </div>
          <div className="text-sm text-gray-400 font-mono">
            {state.overs}.{state.balls}
          </div>
        </div>

        {/* Center: This Over */}
        {state.thisOver.length > 0 && (
          <div className="flex gap-1">
            {state.thisOver.map((ball, index) => (
              <div
                key={index}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono ${
                  ball === '4' || ball === '6'
                    ? 'bg-green-900/50 text-green-400'
                    : ball === 'W'
                    ? 'bg-red-900/50 text-red-400'
                    : ball === 'Wd' || ball === 'Nb'
                    ? 'bg-yellow-900/50 text-yellow-400'
                    : 'bg-[#1a1a1a] text-white'
                }`}
              >
                {ball}
              </div>
            ))}
          </div>
        )}

        {/* Right: CRR + Connection */}
        <div className="flex items-center gap-4">
          <div className="text-sm font-mono">
            <span className="text-gray-500">CRR:</span>
            <span className="text-white font-bold ml-1">{state.crr}</span>
          </div>
          {state.isChasing && state.target > 0 && (
            <div className="text-sm font-mono">
              <span className="text-gray-500">RRR:</span>
              <span className="text-white font-bold ml-1">{state.rrr}</span>
            </div>
          )}
          <div
            className={`flex items-center gap-2 px-2 py-1 rounded text-xs font-mono ${
              connected ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`} />
            {connected ? 'LIVE' : 'OFFLINE'}
          </div>
        </div>
      </div>
    </div>
  );
}
