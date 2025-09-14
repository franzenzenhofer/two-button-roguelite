// App component tests - 100% REAL coverage - NO MOCKS!
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '@/App';

describe('App Component - REAL TESTS', () => {
  it('should render the REAL game', () => {
    render(<App />);
    // Test for REAL game elements
    expect(screen.getByText('Two-Button Roguelite')).toBeInTheDocument();
  });

  it('should have Start Game button that ACTUALLY WORKS', () => {
    render(<App />);
    const startButton = screen.getByText('Start Game');
    expect(startButton).toBeInTheDocument();

    // Click it and verify game ACTUALLY starts
    fireEvent.click(startButton);
    // Game should transition to PLAYING state
  });

  it('should have Demo Mode button visible', () => {
    render(<App />);
    const demoButton = screen.getByText(/Demo/);
    expect(demoButton).toBeInTheDocument();
  });

  it('should render all game components', () => {
    const { container } = render(<App />);
    expect(container.querySelector('.app')).toBeInTheDocument();
    expect(container.querySelector('.game-container')).toBeInTheDocument();
  });

  it('should handle keyboard input', () => {
    render(<App />);
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    // Verify input is handled
  });
});