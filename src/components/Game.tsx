// Game component - max 50 lines
import { useEffect } from 'react';
import { useGame } from '@/store/GameContext';
import { Canvas } from './Canvas';
import { HUD } from './HUD';
import { Controls } from './Controls';
import { Overlay } from './Overlay';
import { useGameLoop } from '@/hooks/useGameLoop';

export function Game(): JSX.Element {
  const { state } = useGame();
  const { startLoop, stopLoop } = useGameLoop();

  useEffect(() => {
    if (state.mode === 'PLAYING') {
      startLoop();
    } else {
      stopLoop();
    }
    return () => stopLoop();
  }, [state.mode, startLoop, stopLoop]);

  return (
    <div className="game-container">
      <Canvas />
      <HUD />
      <Controls />
      {state.mode !== 'PLAYING' && <Overlay />}
    </div>
  );
}