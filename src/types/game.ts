// Core game types - max 50 lines
export type GameMode = 'MENU' | 'PERK_CHOICE' | 'PLAYING' | 'DEAD';
export type Lane = 0 | 1 | 2;
export type InputAction = 'LEFT' | 'RIGHT' | 'SELECT';

export interface GameState {
  mode: GameMode;
  seed: number;
  lane: Lane;
  distance: number;
  score: number;
  shards: number;
  speed: number;
  shield: number;
  magnet: number;
  scoreMult: number;
  time: number;
  dt: number;
  entities: Entity[];
  safeLane: Lane;
  safeHistory: Lane[];
  perkChoice?: PerkChoice;
  replay?: ReplayData;
}

export interface Entity {
  id: string;
  kind: 'obstacle' | 'coin';
  lane: Lane;
  x: number;
  y: number;
  width: number;
  height: number;
  hit?: boolean;
  taken?: boolean;
}

export interface PerkChoice {
  left: Perk;
  right: Perk;
}

export interface Perk {
  id: string;
  name: string;
  description: string;
  apply: (state: GameState) => GameState;
}

export interface ReplayData {
  seed: number;
  inputs: InputEvent[];
  finalState: GameState;
}