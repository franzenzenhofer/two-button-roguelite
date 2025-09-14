// Controls component tests - 100% coverage - max 50 lines
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Controls } from '@/components/Controls';
import * as GameContext from '@/store/GameContext';

describe('Controls Component', () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    mockDispatch.mockClear();
  });

  it('should handle all modes for left button', () => {
    // PLAYING mode
    vi.spyOn(GameContext, 'useGame').mockReturnValue({
      state: { mode: 'PLAYING' } as any,
      dispatch: mockDispatch,
    });
    const { rerender } = render(<Controls />);
    fireEvent.click(screen.getByLabelText('Move Left'));
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'MOVE_LEFT' });

    // PERK_CHOICE mode
    vi.spyOn(GameContext, 'useGame').mockReturnValue({
      state: { mode: 'PERK_CHOICE' } as any,
      dispatch: mockDispatch,
    });
    rerender(<Controls />);
    fireEvent.click(screen.getByLabelText('Move Left'));
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'CHOOSE_PERK', choice: 'left' });

    // DEAD mode
    vi.spyOn(GameContext, 'useGame').mockReturnValue({
      state: { mode: 'DEAD', seed: 123 } as any,
      dispatch: mockDispatch,
    });
    rerender(<Controls />);
    fireEvent.click(screen.getByLabelText('Move Left'));
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'NEW_GAME', seed: 123 });
  });

  it('should handle right button in DEAD mode', () => {
    vi.spyOn(GameContext, 'useGame').mockReturnValue({
      state: { mode: 'DEAD' } as any,
      dispatch: mockDispatch,
    });
    render(<Controls />);
    fireEvent.click(screen.getByLabelText('Move Right'));
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'NEW_GAME', seed: expect.any(Number) });
  });
});