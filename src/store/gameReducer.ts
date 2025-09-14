// Game reducer - max 50 lines
import type { GameState } from '@/types';

export type GameAction =
  | { type: 'NEW_GAME'; seed: number }
  | { type: 'CHOOSE_PERK'; choice: 'left' | 'right' }
  | { type: 'MOVE_LEFT' }
  | { type: 'MOVE_RIGHT' }
  | { type: 'UPDATE'; dt: number }
  | { type: 'GAME_OVER' }
  | { type: 'SET_MODE'; mode: GameState['mode'] };

export function gameReducer(
  state: GameState,
  action: GameAction,
): GameState {
  switch (action.type) {
    case 'NEW_GAME':
      return createInitialState(action.seed);

    case 'CHOOSE_PERK':
      if (!state.perkChoice) return state;
      const perk = state.perkChoice[action.choice];
      return perk.apply({ ...state, mode: 'PLAYING' });

    case 'MOVE_LEFT':
      if (state.mode !== 'PLAYING') return state;
      return { ...state, lane: Math.max(0, state.lane - 1) as any };

    case 'MOVE_RIGHT':
      if (state.mode !== 'PLAYING') return state;
      return { ...state, lane: Math.min(2, state.lane + 1) as any };

    case 'GAME_OVER':
      return { ...state, mode: 'DEAD' };

    case 'SET_MODE':
      return { ...state, mode: action.mode };

    default:
      return state;
  }
}

function createInitialState(seed: number): GameState {
  return {
    mode: 'MENU',
    seed,
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
  };
}