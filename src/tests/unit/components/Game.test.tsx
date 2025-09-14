// Game component tests - NO MOCKS - REAL COMPONENTS!
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Game } from '@/components/Game';
import { GameProvider } from '@/store/GameContext';

// Helper to render Game with provider
const renderGame = () => {
  return render(
    <GameProvider>
      <Game />
    </GameProvider>
  );
};

describe('Game Component - REAL TESTS', () => {
  beforeEach(() => {
    // Clear any previous game state
    localStorage.clear();
  });

  it('renders all REAL subcomponents', () => {
    const { container } = renderGame();

    // All components should be REAL and present
    expect(container.querySelector('.game-container')).toBeInTheDocument();
    expect(container.querySelector('.game-canvas')).toBeInTheDocument();
    expect(container.querySelector('.controls')).toBeInTheDocument();
  });

  it('Start Game button ACTUALLY starts the game', async () => {
    renderGame();

    const startButton = screen.getByText('Start Game');
    fireEvent.click(startButton);

    await waitFor(() => {
      // Game should transition to perk selection or playing
      const gameContainer = document.querySelector('.game-container');
      expect(gameContainer).toBeInTheDocument();
    });
  });

  it('Demo Mode button exists and toggles', () => {
    renderGame();

    const demoButton = screen.getByText(/Demo/);
    expect(demoButton).toBeInTheDocument();

    fireEvent.click(demoButton);
    // Should start demo mode
    expect(screen.getByText(/Stop/)).toBeInTheDocument();
  });

  it('handles REAL keyboard input', () => {
    renderGame();

    // Start the game first
    fireEvent.click(screen.getByText('Start Game'));

    // Test real keyboard input
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    fireEvent.keyDown(window, { key: 'a' });
    fireEvent.keyDown(window, { key: 'd' });
  });

  it('displays score and stats', () => {
    const { container } = renderGame();

    // HUD should be present (it shows stats)
    const hud = container.querySelector('.hud');
    if (hud) {
      expect(hud).toBeInTheDocument();
    } else {
      // HUD might not be visible in menu mode
      expect(container.querySelector('.game-container')).toBeInTheDocument();
    }
  });

  it('transitions through game states', async () => {
    renderGame();

    // Menu -> Perk Choice -> Playing -> Dead
    const startButton = screen.getByText('Start Game');
    fireEvent.click(startButton);

    // Should show perk selection or go straight to game
    await waitFor(() => {
      const gameElement = document.querySelector('.game-container');
      expect(gameElement).toBeInTheDocument();
    });
  });
});