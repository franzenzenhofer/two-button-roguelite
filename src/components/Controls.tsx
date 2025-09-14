// Controls component with Demo Mode - max 75 lines
import { useCallback, useState, useEffect, useRef } from 'react';
import { useGame } from '@/store/GameContext';
import { DemoPlayer } from '@/services/demo';

export function Controls(): JSX.Element {
  const { state, dispatch } = useGame();
  const [demoMode, setDemoMode] = useState(false);
  const demoPlayerRef = useRef<DemoPlayer>();
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (demoMode && !demoPlayerRef.current) {
      const logger = (msg: string): void => {
        console.log(msg);
        setLogs(prev => [...prev.slice(-10), msg]);
      };
      demoPlayerRef.current = new DemoPlayer(logger);
      demoPlayerRef.current.start((action) => {
        if (action === 'CHOOSE_LEFT') {
          dispatch({ type: 'CHOOSE_PERK', choice: 'left' });
        } else if (action === 'MOVE_LEFT') {
          dispatch({ type: 'MOVE_LEFT' });
        } else if (action === 'MOVE_RIGHT') {
          dispatch({ type: 'MOVE_RIGHT' });
        }
      });
    } else if (!demoMode && demoPlayerRef.current) {
      demoPlayerRef.current.stop();
      demoPlayerRef.current = undefined;
    }

    return () => {
      if (demoPlayerRef.current) {
        demoPlayerRef.current.stop();
      }
    };
  }, [demoMode, dispatch]);

  const handleLeft = useCallback((): void => {
    if (state.mode === 'PERK_CHOICE') {
      dispatch({ type: 'CHOOSE_PERK', choice: 'left' });
    } else if (state.mode === 'PLAYING') {
      dispatch({ type: 'MOVE_LEFT' });
    } else if (state.mode === 'DEAD') {
      dispatch({ type: 'NEW_GAME', seed: state.seed });
    }
  }, [state.mode, state.seed, dispatch]);

  const handleRight = useCallback((): void => {
    if (state.mode === 'PERK_CHOICE') {
      dispatch({ type: 'CHOOSE_PERK', choice: 'right' });
    } else if (state.mode === 'PLAYING') {
      dispatch({ type: 'MOVE_RIGHT' });
    } else if (state.mode === 'DEAD') {
      dispatch({ type: 'NEW_GAME', seed: Date.now() });
    }
  }, [state.mode, dispatch]);

  return (
    <>
      <div className="controls">
        <button className="btn btn-left" onClick={handleLeft} aria-label="Move Left">◀</button>
        <button className="btn btn-demo" onClick={() => setDemoMode(!demoMode)}>
          {demoMode ? '⏸️ Stop' : '🎮 Demo'}
        </button>
        <button className="btn btn-right" onClick={handleRight} aria-label="Move Right">▶</button>
      </div>
      {demoMode && logs.length > 0 && (
        <div className="demo-logs">
          {logs.map((log, i) => <div key={i}>{log}</div>)}
        </div>
      )}
    </>
  );
}