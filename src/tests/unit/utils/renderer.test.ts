// Renderer tests - 100% coverage - max 50 lines
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { drawGame } from '@/utils/renderer';
import type { GameState } from '@/types';

describe('Renderer', () => {
  let ctx: any;
  let mockState: GameState;

  beforeEach(() => {
    ctx = {
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      fillStyle: '',
      strokeStyle: '',
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      setLineDash: vi.fn(),
      lineWidth: 0,
      createLinearGradient: vi.fn(() => ({
        addColorStop: vi.fn(),
      })),
    };

    mockState = {
      mode: 'PLAYING',
      entities: [
        { id: '1', kind: 'obstacle', x: 100, y: 100, width: 50, height: 30, lane: 1, hit: false },
        { id: '2', kind: 'coin', x: 200, y: 200, width: 20, height: 20, lane: 0, taken: false },
      ],
      lane: 1,
    } as GameState;
  });

  it('should clear and draw background', () => {
    drawGame(ctx, 800, 600, mockState);
    expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 800, 600);
    expect(ctx.createLinearGradient).toHaveBeenCalled();
  });

  it('should draw entities', () => {
    drawGame(ctx, 800, 600, mockState);
    expect(ctx.fillRect).toHaveBeenCalled(); // For obstacle
    expect(ctx.arc).toHaveBeenCalled(); // For coin
  });
});