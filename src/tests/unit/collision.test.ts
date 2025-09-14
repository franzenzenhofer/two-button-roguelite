// Collision detection tests - TDD - max 50 lines
import { describe, it, expect } from 'vitest';
import { checkCollision, checkCoinCollection } from '@/utils/collision';
import type { Entity } from '@/types';

describe('Collision Detection', () => {
  it('should detect obstacle collision', () => {
    const obstacle: Entity = {
      id: '1',
      kind: 'obstacle',
      lane: 1,
      x: 100,
      y: 100,
      width: 40,
      height: 30,
    };

    expect(checkCollision(100, 100, 20, 20, obstacle)).toBe(true);
    expect(checkCollision(200, 100, 20, 20, obstacle)).toBe(false);
    expect(checkCollision(100, 200, 20, 20, obstacle)).toBe(false);
  });

  it('should detect coin collection', () => {
    const coin: Entity = {
      id: '2',
      kind: 'coin',
      lane: 1,
      x: 100,
      y: 100,
      width: 18,
      height: 18,
    };

    expect(checkCoinCollection(100, 100, coin, 0)).toBe(true);
    expect(checkCoinCollection(110, 100, coin, 0)).toBe(true);
    expect(checkCoinCollection(150, 100, coin, 0)).toBe(false);
  });

  it('should extend coin collection range with magnet', () => {
    const coin: Entity = {
      id: '3',
      kind: 'coin',
      lane: 1,
      x: 100,
      y: 100,
      width: 18,
      height: 18,
    };

    expect(checkCoinCollection(140, 100, coin, 0)).toBe(false);
    expect(checkCoinCollection(140, 100, coin, 50)).toBe(true);
  });
});