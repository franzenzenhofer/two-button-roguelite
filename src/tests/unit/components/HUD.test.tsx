// HUD component tests - 100% coverage - max 50 lines
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HUD } from '@/components/HUD';
import * as GameContext from '@/store/GameContext';

describe('HUD Component', () => {
  it('should display distance', () => {
    vi.spyOn(GameContext, 'useGame').mockReturnValue({
      state: {
        mode: 'PLAYING',
        distance: 150.5,
        shards: 0,
        seed: 123,
        shield: 0,
        entities: [],
        lane: 1,
        score: 0,
        speed: 240,
        magnet: 0,
        scoreMult: 1,
        time: 0,
        dt: 0,
        safeLane: 1,
        safeHistory: [],
      } as any,
      dispatch: vi.fn(),
    });

    render(<HUD />);
    expect(screen.getByText('150 m')).toBeInTheDocument();
    expect(screen.getByText('Shards: 0')).toBeInTheDocument();
    expect(screen.getByText('Seed: 123')).toBeInTheDocument();
  });

  it('should display shield when active', () => {
    vi.spyOn(GameContext, 'useGame').mockReturnValue({
      state: {
        distance: 0,
        shards: 5,
        seed: 456,
        shield: 1,
        entities: [],
      } as any,
      dispatch: vi.fn(),
    });

    render(<HUD />);
    expect(screen.getByText('Shield: 1')).toBeInTheDocument();
  });
});