// HUD component - max 50 lines
import { useGame } from '@/store/GameContext';

export function HUD(): JSX.Element {
  const { state } = useGame();

  const formatDistance = (distance: number): string => {
    return `${Math.floor(distance)} m`;
  };

  const totalShards = state.shards + (state.replay?.finalState.shards || 0);

  return (
    <div className="hud">
      <div className="hud-item score">
        {formatDistance(state.distance)}
      </div>
      <div className="hud-item shards">
        Shards: {totalShards}
      </div>
      <div className="hud-item seed">
        Seed: {state.seed}
      </div>
      {state.shield > 0 && (
        <div className="hud-item shield">
          Shield: {state.shield}
        </div>
      )}
    </div>
  );
}