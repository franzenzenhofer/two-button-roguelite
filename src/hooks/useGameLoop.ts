// Game loop hook - max 50 lines
import { useRef, useCallback } from 'react';
import { useGame } from '@/store/GameContext';

export function useGameLoop(): {
  startLoop: () => void;
  stopLoop: () => void;
} {
  const { state, dispatch } = useGame();
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  const loop = useCallback(
    (timestamp: number): void => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }

      const dt = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      // Update game state
      if (state.mode === 'PLAYING') {
        dispatch({ type: 'UPDATE', dt });
      }

      animationRef.current = requestAnimationFrame(loop);
    },
    [state.mode, dispatch],
  );

  const startLoop = useCallback((): void => {
    if (!animationRef.current) {
      animationRef.current = requestAnimationFrame(loop);
    }
  }, [loop]);

  const stopLoop = useCallback((): void => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
      lastTimeRef.current = 0;
    }
  }, []);

  return { startLoop, stopLoop };
}