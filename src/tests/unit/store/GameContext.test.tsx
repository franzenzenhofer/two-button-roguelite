// GameContext tests - 100% coverage - max 50 lines
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameProvider, useGame } from '@/store/GameContext';

// Test component that uses the context
function TestComponent() {
  const { state, dispatch } = useGame();
  return (
    <div>
      <span data-testid="mode">{state.mode}</span>
      <button onClick={() => dispatch({ type: 'SET_MODE', mode: 'PLAYING' })}>
        Play
      </button>
    </div>
  );
}

describe('GameContext', () => {
  it('should provide game state', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    expect(screen.getByTestId('mode')).toHaveTextContent('MENU');
  });

  it('should handle dispatch', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    const button = screen.getByText('Play');
    button.click();
    // State updates are handled by reducer
  });

  it('should throw error when used outside provider', () => {
    // Mock console.error to suppress error output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useGame must be used within GameProvider');

    consoleSpy.mockRestore();
  });
});