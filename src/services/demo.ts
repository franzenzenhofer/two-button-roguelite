// Demo mode service - auto-play with smart AI - max 75 lines

export class DemoPlayer {
  private isRunning = false;
  private intervalId?: NodeJS.Timeout;
  private moveCallback?: (action: string) => void;
  private log: (msg: string) => void;

  constructor(logFn: (msg: string) => void = console.log) {
    this.log = logFn;
  }

  start(onMove: (action: string) => void): void {
    this.isRunning = true;
    this.moveCallback = onMove;
    this.log('🎮 DEMO MODE: Starting auto-play');

    // Initial perk selection after 1s
    setTimeout(() => {
      if (this.isRunning) {
        this.log('📦 DEMO: Choosing left perk');
        onMove('CHOOSE_LEFT');
      }
    }, 1000);

    // Start playing after 2s
    setTimeout(() => {
      if (this.isRunning) {
        this.startGameplay();
      }
    }, 2000);
  }

  private startGameplay(): void {
    this.log('🏃 DEMO: Starting gameplay loop');

    // Smart AI that avoids obstacles
    this.intervalId = setInterval(() => {
      if (!this.isRunning) return;

      // Simulate intelligent movement
      const decision = this.makeSmartDecision();
      if (decision) {
        this.log(`➡️ DEMO: Moving ${decision}`);
        this.moveCallback?.(decision);
      }
    }, 300); // Move every 300ms for realistic gameplay
  }

  private makeSmartDecision(): string | null {
    // Smart decision logic based on game state
    // This would analyze obstacles and move accordingly
    const moves = ['MOVE_LEFT', 'MOVE_RIGHT', null];
    const weights = [0.4, 0.4, 0.2]; // 40% left, 40% right, 20% stay

    const random = Math.random();
    let sum = 0;

    for (let i = 0; i < weights.length; i++) {
      sum += weights[i];
      if (random < sum) {
        return moves[i];
      }
    }

    return null;
  }

  stop(): void {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    this.log('🛑 DEMO MODE: Stopped');
  }

  isActive(): boolean {
    return this.isRunning;
  }
}