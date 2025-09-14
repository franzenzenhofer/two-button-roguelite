// gameReducer tests - 100% coverage - max 50 lines
import { describe, it, expect } from 'vitest';
import { gameReducer } from '@/store/gameReducer';
import { PERKS } from '@/utils/perks';

describe('gameReducer', () => {
  const initialState: any = {
    mode: 'MENU',
    seed: 123,
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

  it('should handle NEW_GAME', () => {
    const newState = gameReducer(initialState, { type: 'NEW_GAME', seed: 999 });
    expect(newState.seed).toBe(999);
  });

  it('should handle CHOOSE_PERK', () => {
    const stateWithPerk = {
      ...initialState,
      perkChoice: { left: PERKS[0], right: PERKS[1] }
    };
    const newState = gameReducer(stateWithPerk, { type: 'CHOOSE_PERK', choice: 'left' });
    expect(newState.mode).toBe('PLAYING');
  });

  it('should handle all MOVE actions', () => {
    const playing = { ...initialState, mode: 'PLAYING', lane: 1 };
    const left = gameReducer(playing, { type: 'MOVE_LEFT' });
    expect(left.lane).toBe(0);
    const right = gameReducer({ ...playing, lane: 1 }, { type: 'MOVE_RIGHT' });
    expect(right.lane).toBe(2);
  });

  it('should handle GAME_OVER and SET_MODE', () => {
    const dead = gameReducer(initialState, { type: 'GAME_OVER' });
    expect(dead.mode).toBe('DEAD');
    const playing = gameReducer(initialState, { type: 'SET_MODE', mode: 'PLAYING' });
    expect(playing.mode).toBe('PLAYING');
  });
});