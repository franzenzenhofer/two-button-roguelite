// Canvas component tests - REAL RENDERING - NO MOCKS!
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Canvas } from '@/components/Canvas';
import { GameProvider } from '@/store/GameContext';

// Helper to render Canvas with provider
const renderCanvas = () => {
  return render(
    <GameProvider>
      <Canvas />
    </GameProvider>
  );
};


describe('Canvas Component - REAL TESTS', () => {
  it('renders canvas element', () => {
    const { container } = renderCanvas();
    const canvas = container.querySelector('canvas');

    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveClass('game-canvas');
  });

  it('gets 2D rendering context', () => {
    const { container } = renderCanvas();
    const canvas = container.querySelector('canvas') as HTMLCanvasElement;

    const ctx = canvas?.getContext('2d');
    expect(ctx).toBeTruthy();
  });

  it('renders with dimensions', () => {
    const { container } = renderCanvas();
    const canvas = container.querySelector('canvas') as HTMLCanvasElement;

    // Canvas will be sized based on window size
    expect(canvas).toBeInTheDocument();
    expect(canvas.width).toBeGreaterThan(0);
    expect(canvas.height).toBeGreaterThan(0);
  });

  it('has aria label', () => {
    const { container } = renderCanvas();
    const canvas = container.querySelector('canvas');

    expect(canvas).toHaveAttribute('aria-label', 'Game Canvas');
  });

  it('handles resize', () => {
    renderCanvas();

    // Trigger resize
    window.dispatchEvent(new Event('resize'));

    // Canvas should still be present
    expect(document.querySelector('canvas')).toBeInTheDocument();
  });
});