// Overlay component tests - 100% coverage - max 50 lines
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Overlay } from '@/components/Overlay';
import * as GameContext from '@/store/GameContext';

describe('Overlay Component', () => {
  const mockDispatch = vi.fn();

  it('should render menu overlay', () => {
    vi.spyOn(GameContext, 'useGame').mockReturnValue({
      state: { mode: 'MENU' } as any,
      dispatch: mockDispatch,
    });

    render(<Overlay />);
    expect(screen.getByText('Two-Button Roguelite')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Start Game'));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'NEW_GAME',
      seed: expect.any(Number),
    });
  });

  it('should render perk choice overlay', () => {
    vi.spyOn(GameContext, 'useGame').mockReturnValue({
      state: {
        mode: 'PERK_CHOICE',
        perkChoice: {
          left: { name: 'Shield', description: 'Block damage' },
          right: { name: 'Speed', description: 'Go fast' },
        },
      } as any,
      dispatch: mockDispatch,
    });

    render(<Overlay />);
    expect(screen.getByText(/Shield/)).toBeInTheDocument();
    expect(screen.getByText(/Speed/)).toBeInTheDocument();
  });

  it('should render game over overlay', () => {
    vi.spyOn(GameContext, 'useGame').mockReturnValue({
      state: { mode: 'DEAD', distance: 100, shards: 5 } as any,
      dispatch: mockDispatch,
    });

    render(<Overlay />);
    expect(screen.getByText('Game Over')).toBeInTheDocument();
    expect(screen.getByText(/100 m/)).toBeInTheDocument();
  });
});