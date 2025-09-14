// Renderer utility - max 50 lines
import type { GameState } from '@/types';

export function drawGame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: GameState,
): void {
  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Draw background
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#0d1117');
  gradient.addColorStop(1, '#0a0d12');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Draw lanes
  drawLanes(ctx, width, height);

  // Draw entities
  state.entities.forEach((entity) => {
    if (entity.kind === 'obstacle') {
      ctx.fillStyle = entity.hit ? '#ff4d6d' : '#ffffff22';
      ctx.fillRect(entity.x - entity.width / 2, entity.y, entity.width, entity.height);
    } else if (entity.kind === 'coin' && !entity.taken) {
      ctx.beginPath();
      ctx.arc(entity.x, entity.y, entity.width / 2, 0, Math.PI * 2);
      ctx.fillStyle = '#ffd166';
      ctx.fill();
    }
  });

  // Draw player
  const playerX = width / 2 + (state.lane - 1) * 100;
  const playerY = height * 0.78;
  ctx.fillStyle = '#8df18d';
  ctx.fillRect(playerX - 21, playerY - 14, 42, 28);
}

function drawLanes(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  ctx.strokeStyle = '#ffffff22';
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 16]);

  for (let i = 0; i < 3; i++) {
    const x = width / 2 + (i - 1) * 100;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
}