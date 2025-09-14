// Game context - max 50 lines
import React, { createContext, useContext, useReducer } from 'react';
import type { GameState } from '@/types';
import { gameReducer, type GameAction } from './gameReducer';

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function useGame(): GameContextType {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}

interface GameProviderProps {
  children: React.ReactNode;
}

export function GameProvider({ children }: GameProviderProps): JSX.Element {
  const [state, dispatch] = useReducer(gameReducer, {
    mode: 'MENU',
    seed: Date.now(),
    lane: 1,
    distance: 0,
    score: 0,
    shards: 0,
    speed: 240,
    shield: 0,
    magnet: 0,
    scoreMult: 1,
    time: 0,
    dt: 0,
    entities: [],
    safeLane: 1,
    safeHistory: [],
  });

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}