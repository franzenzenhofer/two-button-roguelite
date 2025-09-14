// Canvas component tests - 100% coverage - max 50 lines
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { Canvas } from '@/components/Canvas';
import * as GameContext from '@/store/GameContext';

vi.mock('@/utils/renderer', () => ({
  drawGame: vi.fn()
}));

describe('Canvas Component', () => {
  const mockState = {
    mode: 'PLAYING' as const,
    seed: 123,
    lane: 1 as const,
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
    safeLane: 1 as const,
    safeHistory: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(GameContext, 'useGame').mockReturnValue({
      state: mockState,
      dispatch: vi.fn(),
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('should render canvas element', () => {
    const { container } = render(<Canvas />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveClass('game-canvas');
  });

  it('should setup canvas context', () => {
    render(<Canvas />);
    expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalled();
  });
});