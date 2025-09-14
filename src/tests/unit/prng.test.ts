// PRNG tests - TDD approach - max 50 lines
import { describe, it, expect } from 'vitest';
import { createPRNG } from '@/utils/prng';

describe('PRNG', () => {
  it('should create a PRNG with a seed', () => {
    const rng = createPRNG(12345);
    expect(rng).toBeDefined();
    expect(rng.next).toBeDefined();
    expect(rng.nextInt).toBeDefined();
    expect(rng.pick).toBeDefined();
  });

  it('should generate deterministic values', () => {
    const rng1 = createPRNG(12345);
    const rng2 = createPRNG(12345);

    expect(rng1.next()).toBe(rng2.next());
    expect(rng1.next()).toBe(rng2.next());
    expect(rng1.next()).toBe(rng2.next());
  });

  it('should generate values between 0 and 1', () => {
    const rng = createPRNG(42);
    for (let i = 0; i < 100; i++) {
      const value = rng.next();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it('should generate integers within range', () => {
    const rng = createPRNG(999);
    for (let i = 0; i < 100; i++) {
      const value = rng.nextInt(0, 10);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(10);
      expect(Number.isInteger(value)).toBe(true);
    }
  });

  it('should pick random array elements', () => {
    const rng = createPRNG(777);
    const arr = ['a', 'b', 'c', 'd'];
    for (let i = 0; i < 20; i++) {
      const picked = rng.pick(arr);
      expect(arr).toContain(picked);
    }
  });
});