// Canvas component - max 50 lines
import { useRef, useEffect } from 'react';
import { useGame } from '@/store/GameContext';
import { drawGame } from '@/utils/renderer';

export function Canvas(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state } = useGame();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = (): void => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    drawGame(ctx, canvas.width, canvas.height, state);
  }, [state]);

  return (
    <canvas
      ref={canvasRef}
      className="game-canvas"
      aria-label="Game Canvas"
    />
  );
}