// Overlay component - max 50 lines
import { useGame } from '@/store/GameContext';

export function Overlay(): JSX.Element {
  const { state, dispatch } = useGame();

  if (state.mode === 'MENU') {
    return (
      <div className="overlay">
        <div className="card">
          <h1 className="title">Two-Button Roguelite</h1>
          <p className="subtitle">Every run is winnable.</p>
          <button
            className="btn-start"
            onClick={() => dispatch({ type: 'NEW_GAME', seed: Date.now() })}
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  if (state.mode === 'PERK_CHOICE' && state.perkChoice) {
    return (
      <div className="overlay">
        <div className="card">
          <h2 className="title">Choose Your Perk</h2>
          <div className="perk-row">
            <div className="perk">
              <h3>◀ {state.perkChoice.left.name}</h3>
              <p>{state.perkChoice.left.description}</p>
            </div>
            <div className="perk">
              <h3>▶ {state.perkChoice.right.name}</h3>
              <p>{state.perkChoice.right.description}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (state.mode === 'DEAD') {
    return (
      <div className="overlay">
        <div className="card">
          <h2 className="title">Game Over</h2>
          <p>Distance: {Math.floor(state.distance)} m</p>
          <p>Shards: {state.shards}</p>
          <p className="hint">◀ Retry · ▶ New Seed</p>
        </div>
      </div>
    );
  }

  return <></>;
}