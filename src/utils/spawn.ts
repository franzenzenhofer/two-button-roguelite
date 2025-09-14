// Spawn logic - max 50 lines
import type { Entity, Lane } from '@/types';
import type { PRNG } from './prng';

export function shiftSafeLane(rng: PRNG, current: Lane): Lane {
  const dirs: number[] = [];

  for (let d = -1; d <= 1; d++) {
    const newLane = current + d;
    if (newLane >= 0 && newLane <= 2) {
      dirs.push(d);
    }
  }

  const step = rng.pick(dirs);
  return Math.max(0, Math.min(2, current + step)) as Lane;
}

export function spawnRow(
  rng: PRNG,
  safeLane: Lane,
  yPosition: number,
): Entity[] {
  const entities: Entity[] = [];
  const LANES = 3;
  const BASE_COIN_RATE = 0.45;

  // Spawn obstacles on non-safe lanes
  for (let lane = 0; lane < LANES; lane++) {
    if (lane === safeLane) continue;

    entities.push({
      id: `obs-${Date.now()}-${lane}`,
      kind: 'obstacle',
      lane: lane as Lane,
      x: 100 + lane * 100, // Will be calculated properly in game
      y: yPosition,
      width: 60,
      height: 36,
    });
  }

  // Maybe spawn coin on safe lane
  if (rng.next() < BASE_COIN_RATE) {
    entities.push({
      id: `coin-${Date.now()}`,
      kind: 'coin',
      lane: safeLane,
      x: 100 + safeLane * 100,
      y: yPosition,
      width: 18,
      height: 18,
    });
  }

  return entities;
}