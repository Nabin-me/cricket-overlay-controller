import { useState } from 'react';
import { MatchSetupTab } from './components/MatchSetupTab';
import { MatchControlTab } from './components/MatchControlTab';
import { StatsDisplayTab } from './components/StatsDisplayTab';
import { useMatchState } from './useMatchState';

type TabType = 'setup' | 'match' | 'stats';

export default function CricketController() {
  const { connected } = useMatchState();
  const [activeTab, setActiveTab] = useState<TabType>('setup');

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #000324 0%, #1F224B 100%)',
      fontFamily: 'IBM Plex Sans Condensed, sans-serif'
    }}>
      {/* Top Tab Navigation */}
      <div className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-sm" style={{
        background: 'linear-gradient(135deg, #000324 0%, #1F224B 100%)'
      }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => setActiveTab('setup')}
              className={`py-4 px-6 font-bold text-sm transition-all duration-200 border-b-2 ${
                activeTab === 'setup'
                  ? 'text-white border-white bg-white/5'
                  : 'text-white/50 border-transparent hover:text-white hover:bg-white/5'
              }`}
            >
              MATCH SETUP
            </button>
            <button
              onClick={() => setActiveTab('match')}
              className={`py-4 px-6 font-bold text-sm transition-all duration-200 border-b-2 ${
                activeTab === 'match'
                  ? 'text-white border-white bg-white/5'
                  : 'text-white/50 border-transparent hover:text-white hover:bg-white/5'
              }`}
            >
              MATCH CONTROL
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`py-4 px-6 font-bold text-sm transition-all duration-200 border-b-2 ${
                activeTab === 'stats'
                  ? 'text-white border-white bg-white/5'
                  : 'text-white/50 border-transparent hover:text-white hover:bg-white/5'
              }`}
            >
              STATS
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto p-4 pb-20">
        {activeTab === 'setup' && <MatchSetupTab />}
        {activeTab === 'match' && <MatchControlTab />}
        {activeTab === 'stats' && <StatsDisplayTab />}
      </div>

      {/* Connection Status Footer */}
      <div className="fixed bottom-4 right-4 items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono bg-white/5 backdrop-blur-sm border border-white/10">
        <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`} />
        <span className={connected ? 'text-green-400' : 'text-red-400'}>
          {connected ? 'CONNECTED' : 'DISCONNECTED'}
        </span>
      </div>
    </div>
  );
}
