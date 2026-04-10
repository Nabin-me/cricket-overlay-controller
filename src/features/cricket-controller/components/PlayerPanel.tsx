import { useState } from 'react';
import { useMatchState } from '../useMatchState';

export function PlayerPanel() {
  const { state, updateState } = useMatchState();
  const [newBatterName, setNewBatterName] = useState('');
  const [newBowlerName, setNewBowlerName] = useState('');

  const handleSetBatter1 = (name: string) => {
    updateState({ batsman1: { ...state.batsman1, name } });
  };

  const handleSetBatter2 = (name: string) => {
    updateState({ batsman2: { ...state.batsman2, name } });
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

  const handleNewBatter = () => {
    if (newBatterName.trim()) {
      const newBatter = {
        name: newBatterName,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
      };

      // Replace non-striker
      if (state.onStrike === 1) {
        updateState({ batsman2: newBatter });
      } else {
        updateState({ batsman1: newBatter });
      }
      setNewBatterName('');
    }
  };

  const handleSwapEnds = () => {
    updateState({ onStrike: state.onStrike === 1 ? 2 : 1 });
  };

  const handleNewPartnership = () => {
    updateState({
      partnership: { runs: 0, balls: 0 },
    });
  };

  const handleSetStrike = (batsman: 1 | 2) => {
    updateState({ onStrike: batsman });
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-[#0c0c0c] border border-gray-800">
      <h3 className="text-sm font-bold text-white mb-2" style={{ fontFamily: 'IBM Plex Sans Condensed, sans-serif' }}>
        PLAYERS
      </h3>

      {/* Batsmen */}
      <div className="space-y-2 mb-4">
        {/* Batsman 1 */}
        <div
          className={`p-3 rounded border transition-colors cursor-pointer ${
            state.onStrike === 1
              ? 'bg-white text-black border-white'
              : 'bg-[#1a1a1a] text-white border-gray-700'
          }`}
          onClick={() => handleSetStrike(1)}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono opacity-70">BATSMAN 1</span>
            {state.onStrike === 1 && (
              <div className="w-2 h-2 bg-white rounded-full border-2 border-black"></div>
            )}
          </div>
          <div className="text-lg font-bold truncate" style={{ fontFamily: 'IBM Plex Sans Condensed, sans-serif' }}>
            {state.batsman1.name}
          </div>
          <div className="text-sm font-mono mt-1">
            {state.batsman1.runs}* ({state.batsman1.balls})
          </div>
        </div>

        {/* Batsman 2 */}
        <div
          className={`p-3 rounded border transition-colors cursor-pointer ${
            state.onStrike === 2
              ? 'bg-white text-black border-white'
              : 'bg-[#1a1a1a] text-white border-gray-700'
          }`}
          onClick={() => handleSetStrike(2)}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono opacity-70">BATSMAN 2</span>
            {state.onStrike === 2 && (
              <div className="w-2 h-2 bg-black rounded-full border-2 border-white"></div>
            )}
          </div>
          <div className="text-lg font-bold truncate" style={{ fontFamily: 'IBM Plex Sans Condensed, sans-serif' }}>
            {state.batsman2.name}
          </div>
          <div className="text-sm font-mono mt-1">
            {state.batsman2.runs} ({state.batsman2.balls})
          </div>
        </div>
      </div>

      {/* Batter name inputs */}
      <div className="space-y-2 mb-4">
        <input
          type="text"
          placeholder="Batter 1 Name"
          defaultValue={state.batsman1.name}
          onBlur={(e) => handleSetBatter1(e.target.value)}
          className="w-full bg-[#1a1a1a] text-white border border-gray-700 rounded p-2 text-sm"
          style={{ fontFamily: 'IBM Plex Mono, monospace' }}
        />
        <input
          type="text"
          placeholder="Batter 2 Name"
          defaultValue={state.batsman2.name}
          onBlur={(e) => handleSetBatter2(e.target.value)}
          className="w-full bg-[#1a1a1a] text-white border border-gray-700 rounded p-2 text-sm"
          style={{ fontFamily: 'IBM Plex Mono, monospace' }}
        />
        <button
          className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded p-2 text-sm font-bold transition-colors"
          style={{ fontFamily: 'IBM Plex Sans Condensed, sans-serif' }}
        >
          SET NAMES
        </button>
      </div>

      {/* New Batter */}
      <div className="mb-4">
        <div className="text-xs text-gray-500 mb-2 font-mono">NEW BATSMAN IN</div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newBatterName}
            onChange={(e) => setNewBatterName(e.target.value)}
            placeholder="New Batter Name"
            className="flex-1 bg-[#1a1a1a] text-white border border-gray-700 rounded p-2 text-sm"
            style={{ fontFamily: 'IBM Plex Mono, monospace' }}
          />
          <button
            onClick={handleNewBatter}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 rounded font-bold transition-colors"
            style={{ fontFamily: 'IBM Plex Sans Condensed, sans-serif' }}
          >
            IN
          </button>
        </div>
        <div className="text-xs text-gray-600 mt-1">
          Replaces {state.onStrike === 1 ? 'Batter 2' : 'Batter 1'}
        </div>
      </div>

      {/* Bowler */}
      <div className="mb-4">
        <div className="text-xs text-gray-500 mb-2 font-mono">BOWLER</div>
        <div className="bg-[#1a1a1a] border border-gray-700 rounded p-3 mb-2">
          <div className="text-lg font-bold text-white mb-1" style={{ fontFamily: 'IBM Plex Sans Condensed, sans-serif' }}>
            {state.bowler.name}
          </div>
          <div className="text-sm font-mono text-gray-400">
            {state.bowler.overs}.{state.bowler.balls} ov | {state.bowler.runs} runs | {state.bowler.wickets} wkts
          </div>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newBowlerName}
            onChange={(e) => setNewBowlerName(e.target.value)}
            placeholder="New Bowler"
            className="flex-1 bg-[#1a1a1a] text-white border border-gray-700 rounded p-2 text-sm"
            style={{ fontFamily: 'IBM Plex Mono, monospace' }}
          />
          <button
            onClick={handleSetBowler}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 rounded font-bold transition-colors"
            style={{ fontFamily: 'IBM Plex Sans Condensed, sans-serif' }}
          >
            SET
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleSwapEnds}
          className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white border border-gray-700 rounded p-2 text-sm font-bold transition-colors"
          style={{ fontFamily: 'IBM Plex Sans Condensed, sans-serif' }}
        >
          SWAP ENDS
        </button>
        <button
          onClick={handleNewPartnership}
          className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white border border-gray-700 rounded p-2 text-sm font-bold transition-colors"
          style={{ fontFamily: 'IBM Plex Sans Condensed, sans-serif' }}
        >
          NEW PARTNERSHIP
        </button>
      </div>
    </div>
  );
}
