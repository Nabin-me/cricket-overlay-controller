import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { MatchState, UpdateStatePayload, AddBallPayload, UploadTeamLogoPayload } from './types';

// Socket.io server URL
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || window.location.origin;

export function useMatchState() {
  const [state, setState] = useState<MatchState>({
    matchType: 'T20',
    team1: 'Team A',
    team2: 'Team B',
    team1Logo: '',
    team2Logo: '',
    team1Players: [],
    team2Players: [],
    tossWinner: null,
    tossDecision: null,
    tossCompleted: false,
    innings: 1,
    score: 0,
    wickets: 0,
    overs: 0,
    balls: 0,
    team1Score: 0,
    team1Wickets: 0,
    team1Overs: 0,
    team1Balls: 0,
    team2Score: 0,
    team2Wickets: 0,
    team2Overs: 0,
    team2Balls: 0,
    batsman1: { name: 'Batsman 1', runs: 0, balls: 0, fours: 0, sixes: 0 },
    batsman2: { name: 'Batsman 2', runs: 0, balls: 0, fours: 0, sixes: 0 },
    onStrike: 1,
    bowler: { name: 'Bowler', overs: 0, balls: 0, maidens: 0, runs: 0, wickets: 0 },
    extras: { total: 0, wides: 0, noBalls: 0, byes: 0, legByes: 0 },
    thisOver: [],
    partnership: { runs: 0, balls: 0 },
    fallOfWickets: [],
    target: 0,
    isChasing: false,
    crr: '0.00',
    rrr: '0.00',
    status: 'Live',
    lastEvent: null,
    showStatsOverlay: false,
    entryMode: 'staged',
    sponsorText: 'THIS IS A SPONSOR TEXT SPONSORED BY: XYZ MEDIA PRODUCTION, PRODUCTION: ESABAI DIGITAL SERVICES, EVENT PARTNER: ABC MEDIA, INTERNET..',
  });

  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Create socket instance only once
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
      });

      socketRef.current.on('connect', () => {
        setConnected(true);
      });

      socketRef.current.on('disconnect', () => {
        setConnected(false);
      });

      socketRef.current.on('stateUpdate', (newState: MatchState) => {
        setState(newState);
      });
    }

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // Wrapper function for emitting events
  const emit = <T extends any>(event: string, payload?: T) => {
    if (socketRef.current && connected) {
      socketRef.current.emit(event, payload);
    }
  };

  // Convenience functions
  const updateState = (payload: UpdateStatePayload) => {
    emit('updateState', payload);
  };

  const addBall = (payload: AddBallPayload) => {
    emit('addBall', payload);
  };

  const resetMatch = () => {
    emit('resetMatch');
  };

  const undoLast = () => {
    emit('undoLast');
  };

  const uploadTeamLogo = (payload: UploadTeamLogoPayload) => {
    emit('uploadTeamLogo', payload);
  };

  return {
    state,
    connected,
    emit,
    updateState,
    addBall,
    resetMatch,
    undoLast,
    uploadTeamLogo,
  };
}
