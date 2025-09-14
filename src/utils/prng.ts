// PRNG implementation - max 50 lines
export interface PRNG {
  next: () => number;
  nextInt: (min: number, max: number) => number;
  pick: <T>(array: T[]) => T;
}

export function createPRNG(seed: number): PRNG {
  let s = (seed >>> 0) || 123456789;

  const next = (): number => {
    // LCG constants from Numerical Recipes
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 4294967296;
  };

  const nextInt = (min: number, max: number): number => {
    return Math.floor(next() * (max - min + 1)) + min;
  };

  const pick = <T>(array: T[]): T => {
    return array[Math.floor(next() * array.length)];
  };

  return { next, nextInt, pick };
}