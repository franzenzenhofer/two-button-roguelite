// Perks system tests - TDD - max 50 lines
import { describe, it, expect } from 'vitest';
import { PERKS, applyPerk, getRandomPerks } from '@/utils/perks';
import { createPRNG } from '@/utils/prng';
import type { GameState } from '@/types';

describe('Perks System', () => {
  const mockState: GameState = {
    mode: 'PLAYING',
    seed: 12345,
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

  it('should apply shield perk', () => {
    const shield = PERKS.find(p => p.id === 'shield')!;
    const newState = applyPerk(mockState, shield);
    expect(newState.shield).toBe(1);
  });

  it('should apply calm start perk', () => {
    const calm = PERKS.find(p => p.id === 'calm')!;
    const newState = applyPerk(mockState, calm);
    expect(newState.speed).toBeLessThan(mockState.speed);
  });

  it('should apply magnet perk', () => {
    const magnet = PERKS.find(p => p.id === 'magnet')!;
    const newState = applyPerk(mockState, magnet);
    expect(newState.magnet).toBeGreaterThan(0);
  });

  it('should get two different random perks', () => {
    const rng = createPRNG(999);
    const [left, right] = getRandomPerks(rng);

    expect(left).toBeDefined();
    expect(right).toBeDefined();
    expect(left.id).not.toBe(right.id);
  });
});