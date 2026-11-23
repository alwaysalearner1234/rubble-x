# Technical Steering

## Current implementation
The current prototype is a standalone HTML, CSS and JavaScript application in `index.html`. Keep it runnable without a build system unless the team deliberately approves a migration.

## Engineering principles
- Use readable, modular code; avoid unnecessary dependencies.
- Keep simulation state separate from presentation as the app grows.
- Treat all current sensor and telemetry values as mock/simulated data.
- Never present a mock AI response as a real model inference.
- Handle invalid or unavailable sensor data visibly.
- Make safety-stop behavior deterministic in the simulation.
- Document setup and test steps.

## Potential future stack (not yet implemented)
- TypeScript + React/Next.js for a larger dashboard
- Three.js / React Three Fiber for 3D scene rendering
- Node.js for a service layer
- WebSockets for live telemetry
- Vitest and Playwright for automated tests

Do not add these technologies merely for appearance. Introduce them only when a working requirement needs them.
