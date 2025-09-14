// Perks system - max 50 lines
import type { Perk, GameState } from '@/types';
import type { PRNG } from './prng';

export const PERKS: Perk[] = [
  {
    id: 'shield',
    name: 'Shield',
    description: 'Ignore the first hit.',
    apply: (state: GameState): GameState => ({
      ...state,
      shield: 1,
    }),
  },
  {
    id: 'calm',
    name: 'Calm Start',
    description: 'Start 15% slower.',
    apply: (state: GameState): GameState => ({
      ...state,
      speed: state.speed * 0.85,
    }),
  },
  {
    id: 'magnet',
    name: 'Magnet',
    description: 'Pull nearby shards.',
    apply: (state: GameState): GameState => ({
      ...state,
      magnet: 52,
    }),
  },
  {
    id: 'focus',
    name: 'Focus',
    description: '+10% score gain.',
    apply: (state: GameState): GameState => ({
      ...state,
      scoreMult: 1.1,
    }),
  },
];

export function applyPerk(state: GameState, perk: Perk): GameState {
  return perk.apply(state);
}

export function getRandomPerks(rng: PRNG): [Perk, Perk] {
  const first = rng.pick(PERKS);
  let second = rng.pick(PERKS);

  while (second.id === first.id) {
    second = rng.pick(PERKS);
  }

  return [first, second];
}