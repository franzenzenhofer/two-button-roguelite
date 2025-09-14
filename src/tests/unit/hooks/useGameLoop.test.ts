// useGameLoop hook tests - 100% coverage - max 50 lines
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameLoop } from '@/hooks/useGameLoop';
import * as GameContext from '@/store/GameContext';

describe('useGameLoop Hook', () => {
  const mockDispatch = vi.fn();
  let rafCallback: any;

  beforeEach(() => {
    vi.clearAllMocks();
    rafCallback = null;
    global.requestAnimationFrame = vi.fn((cb) => {
      rafCallback = cb;
      return 1;
    });
    global.cancelAnimationFrame = vi.fn();
  });

  it('should start and stop game loop', () => {
    vi.spyOn(GameContext, 'useGame').mockReturnValue({
      state: { mode: 'PLAYING' } as any,
      dispatch: mockDispatch,
    });

    const { result } = renderHook(() => useGameLoop());

    act(() => {
      result.current.startLoop();
    });
    expect(global.requestAnimationFrame).toHaveBeenCalled();

    act(() => {
      result.current.stopLoop();
    });
    expect(global.cancelAnimationFrame).toHaveBeenCalled();
  });

  it('should dispatch UPDATE when playing', () => {
    vi.spyOn(GameContext, 'useGame').mockReturnValue({
      state: { mode: 'PLAYING' } as any,
      dispatch: mockDispatch,
    });

    const { result } = renderHook(() => useGameLoop());

    act(() => {
      result.current.startLoop();
      if (rafCallback) rafCallback(1000);
    });

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'UPDATE', dt: expect.any(Number) });
  });
});