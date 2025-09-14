// Spawn logic tests - TDD - max 50 lines
import { describe, it, expect } from 'vitest';
import { spawnRow, shiftSafeLane } from '@/utils/spawn';
import { createPRNG } from '@/utils/prng';
import type { Lane } from '@/types';

describe('Spawn Logic', () => {
  it('should shift safe lane by max 1 step', () => {
    const rng = createPRNG(12345);
    let lane: Lane = 1;

    for (let i = 0; i < 20; i++) {
      const newLane = shiftSafeLane(rng, lane);
      expect(Math.abs(newLane - lane)).toBeLessThanOrEqual(1);
      expect(newLane).toBeGreaterThanOrEqual(0);
      expect(newLane).toBeLessThanOrEqual(2);
      lane = newLane;
    }
  });

  it('should spawn obstacles on non-safe lanes', () => {
    const rng = createPRNG(999);
    const safeLane: Lane = 1;
    const entities = spawnRow(rng, safeLane, 0);

    const obstacles = entities.filter(e => e.kind === 'obstacle');
    expect(obstacles.length).toBe(2); // 3 lanes - 1 safe = 2 obstacles

    obstacles.forEach(obs => {
      expect(obs.lane).not.toBe(safeLane);
    });
  });

  it('should sometimes spawn coins on safe lane', () => {
    const rng = createPRNG(777);
    let coinCount = 0;

    for (let i = 0; i < 100; i++) {
      const entities = spawnRow(rng, 1, i * 150);
      const coins = entities.filter(e => e.kind === 'coin');
      if (coins.length > 0) {
        coinCount++;
        expect(coins[0].lane).toBe(1);
      }
    }

    expect(coinCount).toBeGreaterThan(30);
    expect(coinCount).toBeLessThan(60);
  });
});