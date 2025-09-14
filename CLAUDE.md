# CLAUDE.md - Two-Button Roguelite TDD Project

## 🚨 ABSOLUTE NON-NEGOTIABLE RULES 🚨

### ❌ NO DEPLOYMENT WITHOUT:
1. **100% TEST COVERAGE** - NOT 99.9%, EXACTLY 100%!
2. **ZERO ESLINT WARNINGS** - NOT ONE WARNING ALLOWED!
3. **ZERO TYPESCRIPT ERRORS** - STRICT MODE ONLY!
4. **ALL FILES ≤50 LINES** - AUTOMATIC FAILURE IF EXCEEDED!
5. **ALL TESTS PASSING** - EVERY SINGLE TEST!

### 🔥 HARDCORE REQUIREMENTS
```bash
# THESE MUST ALL PASS OR BUILD/DEPLOY FAILS:
npm test          # MUST HAVE 100% COVERAGE
npm run lint      # MUST HAVE 0 WARNINGS
npm run typecheck # MUST HAVE 0 ERRORS
npm run build     # ONLY WORKS IF ALL ABOVE PASS
npm run deploy    # ONLY WORKS IF BUILD PASSES
```

## 🎯 PROJECT MISSION
**100% Test-Driven Development of a Two-Button Roguelite Game**
- Tests FIRST, code SECOND - ALWAYS!
- 100% code coverage is MANDATORY - NO EXCEPTIONS!
- Zero warnings, zero errors, zero compromises - EVER!
- Every file ≤50 lines (HARD RULE - build fails if violated!)
- Deploy to two-button.franzai.com

## 🏗️ ARCHITECTURE: PURE FUNCTIONAL TDD

### Core Principles
1. **SEPARATION OF CONCERNS**
   - Game logic: Pure functions only
   - Rendering: Separate from logic
   - State: Immutable updates via reducer
   - Side effects: Isolated in services

2. **TESTABILITY FIRST**
   - No function > 20 lines
   - No file > 50 lines
   - Every function must be pure where possible
   - Dependency injection for all services

3. **STATE ARCHITECTURE**
```typescript
GameState {
  mode: "MENU" | "PERK_CHOICE" | "PLAYING" | "DEAD"
  seed: number          // Deterministic gameplay
  lane: 0 | 1 | 2      // Current player position
  entities: Entity[]    // Obstacles & coins
  score: number
  shards: number
  perks: ActivePerks
  replay?: ReplayData   // For demo mode
}
```

## 📁 PROJECT STRUCTURE
```
/two-button-roguelite/
├── src/
│   ├── components/      # React components (≤50 lines each)
│   │   ├── Game.tsx
│   │   ├── Canvas.tsx
│   │   ├── HUD.tsx
│   │   ├── Controls.tsx
│   │   ├── Overlay.tsx
│   │   └── PerkChoice.tsx
│   ├── hooks/           # Custom React hooks
│   │   ├── useGameLoop.ts
│   │   ├── useCanvas.ts
│   │   └── useInput.ts
│   ├── utils/           # Pure game logic functions
│   │   ├── prng.ts      # Seeded random
│   │   ├── collision.ts # Collision detection
│   │   ├── spawn.ts     # Entity spawning
│   │   ├── movement.ts  # Player movement
│   │   └── perks.ts     # Perk system
│   ├── types/           # TypeScript definitions
│   │   ├── game.ts
│   │   ├── entities.ts
│   │   └── perks.ts
│   ├── store/           # State management
│   │   ├── gameReducer.ts
│   │   ├── actions.ts
│   │   └── context.tsx
│   ├── services/        # Side effects & I/O
│   │   ├── storage.ts   # LocalStorage
│   │   ├── replay.ts    # Demo mode
│   │   └── analytics.ts # Game analytics
│   └── tests/           # Test files
│       ├── unit/        # Unit tests
│       ├── integration/ # Integration tests
│       └── fixtures/    # Test data
├── e2e/                 # Playwright tests
├── scripts/             # Build & deploy
├── public/              # Static assets
└── docs/                # Documentation

```

## 🔧 STRICT LINTING RULES

### ESLint Configuration
```javascript
{
  "max-lines": ["error", 50],           // HARD LIMIT
  "max-lines-per-function": ["error", 20],
  "complexity": ["error", 5],           // Cyclomatic complexity
  "max-depth": ["error", 3],            // Nesting depth
  "max-params": ["error", 3],           // Function parameters
  "no-console": "error",                // No console.log
  "no-debugger": "error",               // No debugger
  "no-warning-comments": "error",       // No TODO/FIXME
  "@typescript-eslint/no-any": "error", // No any type
  "@typescript-eslint/strict": true     // Strict mode
}
```

## 🧪 TEST-DRIVEN DEVELOPMENT

### Testing Stack
- **Unit Tests**: Vitest with 100% coverage
- **E2E Tests**: Playwright
- **Property Tests**: fast-check for game logic
- **Snapshot Tests**: For UI components
- **Performance Tests**: For 60 FPS validation

### Test Requirements - NO COMPROMISE!
1. **TDD ONLY** - Write test FIRST, implementation SECOND
2. **EVERY** function, hook, component MUST have tests
3. **MANDATORY Coverage (enforced by CI/CD)**:
   - Statements: 100% (NOT 99%!)
   - Branches: 100% (EVERY IF/ELSE!)
   - Functions: 100% (EVERY FUNCTION!)
   - Lines: 100% (EVERY SINGLE LINE!)
4. **Build FAILS if coverage < 100%**
5. **Deploy BLOCKED if any test fails**

### Example TDD Flow
```typescript
// 1. Write test first (prng.test.ts)
test('PRNG generates deterministic values', () => {
  const rng = createPRNG(12345);
  expect(rng.next()).toBe(0.284);
  expect(rng.next()).toBe(0.825);
});

// 2. Implement minimal code (prng.ts)
export function createPRNG(seed: number) {
  let s = seed;
  return {
    next: () => {
      s = (1664525 * s + 1013904223) >>> 0;
      return s / 4294967296;
    }
  };
}
```

## 🎮 GAME FEATURES

### Core Mechanics
- **Two Buttons**: Left/Right movement only
- **Three Lanes**: Player moves between lanes
- **Obstacles**: Spawn on non-safe lanes
- **Coins/Shards**: Collectibles for meta-progression
- **Perks**: Choose at start of each run
- **Deterministic**: Seeded PRNG for reproducible runs

### Perk System
```typescript
interface Perk {
  id: string;
  name: string;
  description: string;
  apply: (state: GameState) => GameState;
}

// All perks must be pure functions
const SHIELD_PERK: Perk = {
  id: 'shield',
  name: 'Shield',
  description: 'Ignore first hit',
  apply: (state) => ({ ...state, shield: 1 })
};
```

## 🔄 DEMO MODE & REPLAY SYSTEM

### Replay Architecture
```typescript
interface ReplayData {
  seed: number;
  inputs: InputEvent[];
  timestamp: number;
  finalState: GameState;
}

// Record all inputs with timestamps
// Replay by re-running with same seed & inputs
// Used for: Testing, debugging, sharing runs
```

### Demo Mode Features
- Record gameplay to JSON
- Replay from JSON file
- Validate determinism
- Performance profiling
- Automated testing

## 📦 DEPLOYMENT

### Pre-deployment Checks
```bash
npm run predeploy
# Runs in sequence:
# 1. npm test          # All unit tests
# 2. npm run coverage  # 100% coverage check
# 3. npm run lint      # Zero warnings
# 4. npm run typecheck # TypeScript strict
# 5. npm run e2e       # Playwright tests
# 6. npm run perf      # Performance tests
```

### Deployment Process
```bash
npm run deploy
# 1. Run all pre-deployment checks
# 2. Build production bundle
# 3. Version bump (patch)
# 4. Git commit & tag
# 5. Deploy to Cloudflare Pages
# 6. Run post-deployment validation
# 7. Monitor for 5 minutes
```

### Post-deployment Validation
```javascript
// scripts/post-deploy.js
async function validateDeployment() {
  // 1. Check HTTP 200 response
  // 2. Verify game loads
  // 3. Test both buttons work
  // 4. Verify localStorage works
  // 5. Check performance metrics
  // 6. Send success notification
}
```

## 🚀 COMMANDS

### Development
```bash
npm run dev              # Start dev server (Vite)
npm run dev:debug        # With debug output
npm run dev:demo         # Demo mode with replay
```

### Testing - MUST ALWAYS PASS 100%
```bash
npm test                 # Run ALL tests with 100% coverage requirement
npm run test:unit        # Unit tests only (must be 100%)
npm run test:e2e         # E2E tests only
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report (MUST BE 100%)
npm run test:perf        # Performance tests
```

### HARDCORE TEST ENFORCEMENT
```bash
# npm test is configured to:
# 1. Run all unit tests
# 2. Check coverage is EXACTLY 100%
# 3. FAIL if coverage < 100%
# 4. FAIL if any test fails
# 5. Block build/deploy if failed
```

### Code Quality
```bash
npm run lint             # ESLint (must pass)
npm run lint:fix         # Auto-fix issues
npm run typecheck        # TypeScript check
npm run format           # Prettier format
npm run analyze          # Bundle analysis
```

### Deployment
```bash
npm run deploy           # Full deployment with checks
npm run deploy:preview   # Deploy to preview URL
npm run deploy:patch     # Deploy with patch bump
npm run deploy:minor     # Deploy with minor bump
npm run deploy:major     # Deploy with major bump
```

## 🔒 ENVIRONMENT VARIABLES

### .env Configuration
```bash
# Cloudflare
CLOUDFLARE_ACCOUNT_ID=ecf21e85812dfa5b2a35245257fc71f5
CLOUDFLARE_API_TOKEN=<from_secure_storage>
CLOUDFLARE_ZONE_ID=11bfe82c00e8c9e116e1e542b140f172

# Project
PROJECT_NAME=two-button-roguelite
DEPLOY_URL=two-button.franzai.com
PREVIEW_URL=preview.two-button.franzai.com

# Testing
TEST_SEED=12345
DEMO_MODE=false
DEBUG_PHYSICS=false
```

## 📊 PERFORMANCE REQUIREMENTS

### Metrics
- **FPS**: Consistent 60 FPS
- **Load Time**: < 2 seconds
- **Bundle Size**: < 100KB gzipped
- **Memory**: < 50MB usage
- **Input Lag**: < 16ms

### Monitoring
```javascript
// Automated performance monitoring
interface PerformanceMetrics {
  fps: number[];
  loadTime: number;
  memoryUsage: number;
  inputLatency: number[];
  renderTime: number[];
}
```

## 🎯 SUCCESS CRITERIA

### Must Have
- ✅ 100% test coverage
- ✅ Zero ESLint warnings/errors
- ✅ All files ≤50 lines
- ✅ TypeScript strict mode
- ✅ Deterministic gameplay
- ✅ Demo/replay mode
- ✅ Mobile responsive
- ✅ 60 FPS performance

### Quality Gates
1. **No deployment if ANY test fails**
2. **No deployment if coverage < 100%**
3. **No deployment if any lint warnings**
4. **No deployment if any file > 50 lines**
5. **No deployment if bundle > 100KB**

## 🔄 CONTINUOUS IMPROVEMENT

### Metrics Tracking
- Test execution time
- Bundle size trends
- Performance metrics
- Error rates
- User engagement

### Automated Reports
- Daily test coverage report
- Weekly performance report
- Deployment success rate
- Code quality metrics

## 🎮 CONTROLS

### Input Handling
```typescript
// Unified input system for keyboard/touch
interface InputHandler {
  onLeft: () => void;
  onRight: () => void;
  onSelect: () => void;
}

// Support:
// - Touch: Button taps
// - Keyboard: Arrow keys, A/D, WASD
// - Gamepad: D-pad, analog stick
```

## 📝 DOCUMENTATION

### Required Docs
- `/docs/ARCHITECTURE.md` - System design
- `/docs/TESTING.md` - Test strategy
- `/docs/DEPLOYMENT.md` - Deploy process
- `/docs/PERFORMANCE.md` - Perf guidelines
- `/docs/DEMO_MODE.md` - Replay system

## 🏆 DEPLOYMENT TARGET
**URL**: https://two-button.franzai.com

**Cloudflare Pages Configuration**:
- Build command: `npm run build`
- Build output: `/dist`
- Environment: Production
- Node version: 20.x

---

**This is a 100% TDD project. No code without tests. No compromises.**