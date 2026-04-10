import { useState } from 'react';
import { useMatchState } from '../useMatchState';
import { BallType } from '../types';

export function BallEntry() {
  const { emit, addBall, undoLast } = useMatchState();
  const [stagedBall, setStagedBall] = useState<{ type: BallType; value?: number } | null>(null);

  const handleBallClick = (type: BallType, value?: number) => {
    setStagedBall({ type, value });
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

  const handleQuickAction = (type: BallType, value?: number) => {
    addBall({ type, value });
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-[#0c0c0c] border border-gray-800">
      <h3 className="text-sm font-bold text-white mb-2" style={{ fontFamily: 'IBM Plex Sans Condensed, sans-serif' }}>
        BALL ENTRY
      </h3>

      {/* Staged delivery display */}
      {stagedBall && (
        <div className="bg-[#1a1a1a] border border-yellow-600 rounded p-3 mb-3">
          <div className="text-yellow-500 text-xs mb-1">STAGED:</div>
          <div className="text-white text-lg font-mono">
            {stagedBall.type === 'run' && stagedBall.value !== undefined ? (
              stagedBall.value === 0 ? 'DOT (•)' : `${stagedBall.value} RUN${stagedBall.value > 1 ? 'S' : ''}`
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
      <div className="mb-3">
        <div className="text-xs text-gray-500 mb-2 font-mono">RUNS</div>
        <div className="grid grid-cols-6 gap-2">
          {[0, 1, 2, 3, 4, 6].map((run) => (
            <button
              key={run}
              onClick={() => handleBallClick('run', run)}
              className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white border border-gray-700 rounded p-3 font-mono text-lg transition-colors"
            >
              {run === 0 ? '•' : run}
            </button>
          ))}
        </div>
      </div>

      {/* Wickets */}
      <div className="mb-3">
        <div className="text-xs text-gray-500 mb-2 font-mono">WICKETS</div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleBallClick('wicket')}
            className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-red-400 border border-gray-700 rounded p-3 font-mono text-sm transition-colors"
          >
            W (OUT)
          </button>
          <button
            onClick={() => handleBallClick('runout')}
            className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-red-400 border border-gray-700 rounded p-3 font-mono text-sm transition-colors"
          >
            RO (RUN OUT)
          </button>
        </div>
      </div>

      {/* Extras */}
      <div className="mb-3">
        <div className="text-xs text-gray-500 mb-2 font-mono">EXTRAS</div>
        <div className="grid grid-cols-6 gap-2">
          <button
            onClick={() => handleBallClick('wide')}
            className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white border border-gray-700 rounded p-2 font-mono text-xs transition-colors"
          >
            Wd
          </button>
          <button
            onClick={() => handleBallClick('noball')}
            className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white border border-gray-700 rounded p-2 font-mono text-xs transition-colors"
          >
            Nb
          </button>
          <button
            onClick={() => handleBallClick('bye', 1)}
            className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white border border-gray-700 rounded p-2 font-mono text-xs transition-colors"
          >
            1b
          </button>
          <button
            onClick={() => handleBallClick('bye', 2)}
            className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white border border-gray-700 rounded p-2 font-mono text-xs transition-colors"
          >
            2b
          </button>
          <button
            onClick={() => handleBallClick('legbye', 1)}
            className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white border border-gray-700 rounded p-2 font-mono text-xs transition-colors"
          >
            1lb
          </button>
          <button
            onClick={() => handleBallClick('legbye', 2)}
            className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white border border-gray-700 rounded p-2 font-mono text-xs transition-colors"
          >
            2lb
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <button
          onClick={handleCommit}
          disabled={!stagedBall}
          className="bg-green-700 hover:bg-green-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded p-3 font-bold transition-colors"
          style={{ fontFamily: 'IBM Plex Sans Condensed, sans-serif' }}
        >
          COMMIT
        </button>
        <button
          onClick={handleClear}
          disabled={!stagedBall}
          className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded p-3 font-bold transition-colors"
          style={{ fontFamily: 'IBM Plex Sans Condensed, sans-serif' }}
        >
          CLR
        </button>
      </div>

      {/* Quick actions */}
      <div className="mb-3">
        <div className="text-xs text-gray-500 mb-2 font-mono">QUICK (NO STAGING)</div>
        <div className="grid grid-cols-6 gap-2">
          <button
            onClick={() => handleQuickAction('run', 0)}
            className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white border border-gray-700 rounded p-2 font-mono transition-colors"
          >
            •
          </button>
          <button
            onClick={() => handleQuickAction('run', 1)}
            className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white border border-gray-700 rounded p-2 font-mono transition-colors"
          >
            +1
          </button>
          <button
            onClick={() => handleQuickAction('run', 4)}
            className="bg-green-900/50 hover:bg-green-800/50 text-white border border-gray-700 rounded p-2 font-mono transition-colors"
          >
            +4
          </button>
          <button
            onClick={() => handleQuickAction('run', 6)}
            className="bg-blue-900/50 hover:bg-blue-800/50 text-white border border-gray-700 rounded p-2 font-mono transition-colors"
          >
            +6
          </button>
          <button
            onClick={() => handleQuickAction('wide')}
            className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white border border-gray-700 rounded p-2 font-mono text-xs transition-colors"
          >
            Wd
          </button>
          <button
            onClick={() => handleQuickAction('wicket')}
            className="bg-red-900/30 hover:bg-red-800/30 text-red-400 border border-gray-700 rounded p-2 font-mono text-xs transition-colors"
          >
            W
          </button>
        </div>
      </div>

      {/* Undo */}
      <button
        onClick={undoLast}
        className="w-full bg-orange-700 hover:bg-orange-600 text-white rounded p-3 font-bold transition-colors"
        style={{ fontFamily: 'IBM Plex Sans Condensed, sans-serif' }}
      >
        UNDO LAST BALL
      </button>
    </div>
  );
}
