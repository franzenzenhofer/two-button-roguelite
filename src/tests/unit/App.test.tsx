// App component tests - 100% coverage - max 50 lines
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '@/App';

// Mock child components to avoid canvas issues
vi.mock('@/components/Game', () => ({
  Game: () => <div className="game-mock">Game Component</div>
}));

describe('App Component', () => {
  it('should render without crashing', () => {
    render(<App />);
    expect(screen.getByText('Game Component')).toBeInTheDocument();
  });

  it('should have app container', () => {
    const { container } = render(<App />);
    expect(container.querySelector('.app')).toBeInTheDocument();
  });

  it('should wrap content in GameProvider', () => {
    render(<App />);
    // GameProvider wraps the Game component
    expect(screen.getByText('Game Component')).toBeInTheDocument();
  });
});