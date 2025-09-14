// Input handling types - max 50 lines
export interface InputEvent {
  action: 'LEFT' | 'RIGHT' | 'SELECT';
  timestamp: number;
  frame: number;
}

export interface InputHandler {
  onLeft: () => void;
  onRight: () => void;
  onSelect: () => void;
  isLocked: boolean;
}

export interface TouchInput {
  x: number;
  y: number;
  timestamp: number;
}

export interface KeyboardInput {
  key: string;
  code: string;
  timestamp: number;
}

export type InputSource = 'keyboard' | 'touch' | 'gamepad' | 'replay';

export interface InputConfig {
  keyboardEnabled: boolean;
  touchEnabled: boolean;
  gamepadEnabled: boolean;
  inputDelay: number;
}