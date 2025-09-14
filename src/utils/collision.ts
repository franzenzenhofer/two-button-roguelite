// Collision detection - max 50 lines
import type { Entity } from '@/types';

export function checkCollision(
  px: number,
  py: number,
  pw: number,
  ph: number,
  entity: Entity,
): boolean {
  if (entity.kind !== 'obstacle' || entity.hit) {
    return false;
  }

  const ex = entity.x - entity.width / 2;
  const ey = entity.y;

  return (
    px < ex + entity.width &&
    px + pw > ex &&
    py < ey + entity.height &&
    py + ph > ey
  );
}

export function checkCoinCollection(
  px: number,
  py: number,
  coin: Entity,
  magnetRange: number,
): boolean {
  if (coin.kind !== 'coin' || coin.taken) {
    return false;
  }

  const radius = coin.width / 2;
  const distance = Math.hypot(coin.x - px, coin.y - py);
  const collectRange = Math.max(radius + 14, magnetRange);

  return distance <= collectRange;
}