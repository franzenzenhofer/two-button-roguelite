// Controls component - max 50 lines
import { useCallback } from 'react';
import { useGame } from '@/store/GameContext';

export function Controls(): JSX.Element {
  const { state, dispatch } = useGame();

  const handleLeft = useCallback((): void => {
    if (state.mode === 'PERK_CHOICE') {
      dispatch({ type: 'CHOOSE_PERK', choice: 'left' });
    } else if (state.mode === 'PLAYING') {
      dispatch({ type: 'MOVE_LEFT' });
    } else if (state.mode === 'DEAD') {
      dispatch({ type: 'NEW_GAME', seed: state.seed });
    }
  }, [state.mode, state.seed, dispatch]);

  const handleRight = useCallback((): void => {
    if (state.mode === 'PERK_CHOICE') {
      dispatch({ type: 'CHOOSE_PERK', choice: 'right' });
    } else if (state.mode === 'PLAYING') {
      dispatch({ type: 'MOVE_RIGHT' });
    } else if (state.mode === 'DEAD') {
      dispatch({ type: 'NEW_GAME', seed: Date.now() });
    }
  }, [state.mode, dispatch]);

  return (
    <div className="controls">
      <button
        className="btn btn-left"
        onClick={handleLeft}
        aria-label="Move Left"
      >
        ◀
      </button>
      <button
        className="btn btn-right"
        onClick={handleRight}
        aria-label="Move Right"
      >
        ▶
      </button>
    </div>
  );
}