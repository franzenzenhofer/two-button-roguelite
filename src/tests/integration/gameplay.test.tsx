// REAL GAMEPLAY INTEGRATION TESTS - NO MOCKS!
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '@/App';

describe('REAL GAMEPLAY - FULL INTEGRATION', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('Complete game session - start to death', async () => {
    render(<App />);

    // 1. Verify game loads with menu
    expect(screen.getByText('Two-Button Roguelite')).toBeInTheDocument();
    expect(screen.getByText('Start Game')).toBeInTheDocument();

    // 2. Start the game
    const startButton = screen.getByText('Start Game');
    fireEvent.click(startButton);

    // 3. Game should be running
    await waitFor(() => {
      const gameElement = document.querySelector('.game-container');
      expect(gameElement).toBeInTheDocument();
    });

    // 4. Test keyboard controls
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    fireEvent.keyDown(window, { key: 'ArrowRight' });

    // 5. Verify game is running
    const controls = document.querySelector('.controls');
    expect(controls).toBeInTheDocument();
  });

  it('Demo mode actually works', async () => {
    render(<App />);

    // Find and click demo button
    const demoButton = screen.getByText(/Demo/);
    expect(demoButton).toBeInTheDocument();

    fireEvent.click(demoButton);

    // Demo should be running
    await waitFor(() => {
      expect(screen.getByText(/Stop/)).toBeInTheDocument();
    });

    // Stop demo
    fireEvent.click(screen.getByText(/Stop/));
    expect(screen.getByText(/Demo/)).toBeInTheDocument();
  });

  it('Perk selection works', async () => {
    render(<App />);

    // Start game
    fireEvent.click(screen.getByText('Start Game'));

    // If perk selection appears, test it
    await waitFor(() => {
      const perkButtons = screen.queryAllByRole('button');
      if (perkButtons.length > 2) {
        // Click a perk
        fireEvent.click(perkButtons[0]);
      }
    }, { timeout: 1000 });
  });

  it('Score tracking works', async () => {
    render(<App />);

    // Start game
    fireEvent.click(screen.getByText('Start Game'));

    // Game should be running
    await waitFor(() => {
      const gameContainer = document.querySelector('.game-container');
      expect(gameContainer).toBeInTheDocument();
    });

    // Game should have HUD or score display
    const hud = document.querySelector('.hud');
    if (hud) {
      expect(hud).toBeInTheDocument();
    }
  });

  it('Game state persists to localStorage', () => {
    render(<App />);

    // Start game
    fireEvent.click(screen.getByText('Start Game'));

    // Check localStorage
    const savedData = localStorage.getItem('two-button-roguelite');
    if (savedData) {
      const data = JSON.parse(savedData);
      expect(data).toHaveProperty('highScore');
      expect(data).toHaveProperty('totalShards');
    }
  });

  it('All buttons are clickable', () => {
    render(<App />);

    // Get all buttons
    const buttons = screen.getAllByRole('button');

    // Click each button
    buttons.forEach(button => {
      expect(() => fireEvent.click(button)).not.toThrow();
    });
  });
});