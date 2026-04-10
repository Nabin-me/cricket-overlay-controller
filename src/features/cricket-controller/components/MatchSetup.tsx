import { useState } from 'react';
import { useMatchState } from '../useMatchState';
import { MatchFormat, InningsType, MatchStatus } from '../types';

export function MatchSetup() {
  const { state, updateState, resetMatch, uploadTeamLogo } = useMatchState();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSetTeams = () => {
    // Teams are already set via individual inputs
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
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-[#0c0c0c] border border-gray-800">
      <h3 className="text-sm font-bold text-white mb-2" style={{ fontFamily: 'IBM Plex Sans Condensed, sans-serif' }}>
        MATCH SETUP
      </h3>

      {/* Team Names */}
      <div className="space-y-2 mb-4">
        <input
          type="text"
          value={state.team1}
          onChange={(e) => updateState({ team1: e.target.value })}
          placeholder="Team 1 Name"
          className="w-full bg-[#1a1a1a] text-white border border-gray-700 rounded p-2 text-sm"
          style={{ fontFamily: 'IBM Plex Mono, monospace' }}
        />
        <input
          type="text"
          value={state.team2}
          onChange={(e) => updateState({ team2: e.target.value })}
          placeholder="Team 2 Name"
          className="w-full bg-[#1a1a1a] text-white border border-gray-700 rounded p-2 text-sm"
          style={{ fontFamily: 'IBM Plex Mono, monospace' }}
        />
        <button
          onClick={handleSetTeams}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded p-2 text-sm font-bold transition-colors"
          style={{ fontFamily: 'IBM Plex Sans Condensed, sans-serif' }}
        >
          SET TEAMS
        </button>
      </div>

      {/* Team Logos */}
      <div className="space-y-2 mb-4">
        <div className="text-xs text-gray-500 font-mono">TEAM LOGOS</div>
        <div className="grid grid-cols-2 gap-2">
          <label className="cursor-pointer">
            <div className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white border border-gray-700 rounded p-3 text-center text-xs transition-colors">
              <div>TEAM 1 LOGO</div>
              <div className="text-gray-500 mt-1">{state.team1Logo ? '✓ Uploaded' : 'Click to upload'}</div>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleUploadLogo(1, e)}
              className="hidden"
            />
          </label>
          <label className="cursor-pointer">
            <div className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white border border-gray-700 rounded p-3 text-center text-xs transition-colors">
              <div>TEAM 2 LOGO</div>
              <div className="text-gray-500 mt-1">{state.team2Logo ? '✓ Uploaded' : 'Click to upload'}</div>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleUploadLogo(2, e)}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Format */}
      <div className="mb-4">
        <div className="text-xs text-gray-500 mb-2 font-mono">FORMAT</div>
        <div className="grid grid-cols-4 gap-2">
          {(Object.keys(['T20', 'ODI', 'T10', 'Test']) as MatchFormat[]).map((format) => (
            <button
              key={format}
              onClick={() => updateState({ matchType: format })}
              className={`rounded p-2 text-xs font-bold transition-colors ${
                state.matchType === format
                  ? 'bg-white text-black'
                  : 'bg-[#1a1a1a] text-white border border-gray-700'
              }`}
              style={{ fontFamily: 'IBM Plex Sans Condensed, sans-serif' }}
            >
              {format}
            </button>
          ))}
        </div>
      </div>

      {/* Innings */}
      <div className="mb-4">
        <div className="text-xs text-gray-500 mb-2 font-mono">INNINGS</div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => updateState({ innings: 1 })}
            className={`rounded p-2 text-sm font-bold transition-colors ${
              state.innings === 1
                ? 'bg-white text-black'
                : 'bg-[#1a1a1a] text-white border border-gray-700'
            }`}
            style={{ fontFamily: 'IBM Plex Sans Condensed, sans-serif' }}
          >
            1ST
          </button>
          <button
            onClick={() => updateState({ innings: 2 })}
            className={`rounded p-2 text-sm font-bold transition-colors ${
              state.innings === 2
                ? 'bg-white text-black'
                : 'bg-[#1a1a1a] text-white border border-gray-700'
            }`}
            style={{ fontFamily: 'IBM Plex Sans Condensed, sans-serif' }}
          >
            2ND
          </button>
        </div>
      </div>

      {/* Target (only in 2nd innings) */}
      {state.innings === 2 && (
        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-2 font-mono">TARGET</div>
          <input
            type="number"
            value={state.target || ''}
            onChange={(e) => updateState({ target: parseInt(e.target.value) || 0, isChasing: true })}
            placeholder="Target Score"
            className="w-full bg-[#1a1a1a] text-white border border-gray-700 rounded p-2 text-sm font-mono"
          />
        </div>
      )}

      {/* Status */}
      <div className="mb-4">
        <div className="text-xs text-gray-500 mb-2 font-mono">STATUS</div>
        <select
          value={state.status}
          onChange={(e) => updateState({ status: e.target.value as MatchStatus })}
          className="w-full bg-[#1a1a1a] text-white border border-gray-700 rounded p-2 text-sm font-mono"
        >
          <option value="Live">Live</option>
          <option value="Drinks Break">Drinks Break</option>
          <option value="Innings Break">Innings Break</option>
          <option value="Rain Delay">Rain Delay</option>
          <option value="Tea">Tea</option>
          <option value="Stumps">Stumps</option>
        </select>
      </div>

      {/* Reset Match */}
      <div className="mt-auto">
        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full bg-red-900/50 hover:bg-red-800/50 text-red-400 border border-red-800 rounded p-3 text-sm font-bold transition-colors"
            style={{ fontFamily: 'IBM Plex Sans Condensed, sans-serif' }}
          >
            RESET MATCH
          </button>
        ) : (
          <div className="space-y-2">
            <div className="text-xs text-red-400 text-center font-mono">CONFIRM RESET?</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleResetMatch}
                className="bg-red-700 hover:bg-red-600 text-white rounded p-2 text-sm font-bold transition-colors"
                style={{ fontFamily: 'IBM Plex Sans Condensed, sans-serif' }}
              >
                YES
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white rounded p-2 text-sm font-bold transition-colors"
                style={{ fontFamily: 'IBM Plex Sans Condensed, sans-serif' }}
              >
                NO
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
