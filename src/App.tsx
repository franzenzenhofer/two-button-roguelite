// Main App component - max 50 lines
import { GameProvider } from '@/store/GameContext';
import { Game } from '@/components/Game';
import './App.css';

export default function App(): JSX.Element {
  return (
    <GameProvider>
      <div className="app">
        <Game />
      </div>
    </GameProvider>
  );
}