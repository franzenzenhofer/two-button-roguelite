// Game component tests - 100% coverage - max 50 lines
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { Game } from '@/components/Game';
import * as GameContext from '@/store/GameContext';
import * as useGameLoop from '@/hooks/useGameLoop';

// Mock child components
vi.mock('@/components/Canvas', () => ({ Canvas: () => <div>Canvas</div> }));
vi.mock('@/components/HUD', () => ({ HUD: () => <div>HUD</div> }));
vi.mock('@/components/Controls', () => ({ Controls: () => <div>Controls</div> }));
vi.mock('@/components/Overlay', () => ({ Overlay: () => <div>Overlay</div> }));

describe('Game Component', () => {
  const mockStartLoop = vi.fn();
  const mockStopLoop = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(useGameLoop, 'useGameLoop').mockReturnValue({
      startLoop: mockStartLoop,
      stopLoop: mockStopLoop,
    });
  });

  afterEach(() => cleanup());

  it('should start loop when playing', () => {
    vi.spyOn(GameContext, 'useGame').mockReturnValue({
      state: { mode: 'PLAYING' } as any,
      dispatch: vi.fn(),
    });

    render(<Game />);
    expect(mockStartLoop).toHaveBeenCalled();
  });

  it('should stop loop when not playing', () => {
    vi.spyOn(GameContext, 'useGame').mockReturnValue({
      state: { mode: 'MENU' } as any,
      dispatch: vi.fn(),
    });

    render(<Game />);
    expect(mockStopLoop).toHaveBeenCalled();
  });

  it('should render game container', () => {
    vi.spyOn(GameContext, 'useGame').mockReturnValue({
      state: { mode: 'MENU' } as any,
      dispatch: vi.fn(),
    });
    const { container } = render(<Game />);
    expect(container.querySelector('.game-container')).toBeInTheDocument();
  });
});