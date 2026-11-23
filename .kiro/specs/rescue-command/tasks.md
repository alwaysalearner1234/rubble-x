# Implementation Tasks

Status convention: `[ ]` not started, `[x]` completed only after implementation and verification. The existing prototype is a starting point; verify each item against the actual code before marking it complete.

- [x] Review and run the existing `index.html` prototype in a browser.
- [x] Verify movement controls and collision behavior.
- [x] Verify compact/extended mode interaction and its visual state.
- [x] Verify scan event, possible-survivor marker and event log.
- [x] Verify emergency-stop behavior and reset flow.
- [x] Audit every telemetry and sensor value for clear simulation labelling.
- [x] Add a short operator walkthrough to the README.
- [ ] Add automated tests for core simulation state transitions.
- [ ] Add a browser end-to-end test for deploy, scan and emergency stop.
- [x] Only after the 2D MVP is stable, plan the 3D environment as a separate spec.
- [ ] Record a short demo showing the actual working build and disclose simulated behavior.

## Completed in this implementation

- Vite + React 18 + TypeScript + Tailwind CSS + Three.js / @react-three/fiber / @react-three/drei scaffold
- Shared state contracts: `src/types/rubblex.ts`
- World geometry config: `src/simulation/worldConfig.ts` (obstacles, hazards, passages, survivor beacons)
- Central mission store: `src/simulation/missionStore.ts` (deploy, move, rotate, scan, E-stop, faults, arm, reset)
- React hook: `src/simulation/useMission.ts`
- 3D viewport: `src/components/simulation/RescueViewport3D.tsx`
  - Rubble slabs (stable + unstable), narrow low-clearance tunnel, hazard zones, survivor thermal/acoustic beacon
  - OrbitControls, GizmoViewport, keyboard W/A/S/D + Q/E rotate + Space E-stop
  - Multi-segment robot with EXPLORATION / COMPACT body modes and extendable manipulator arm
  - Explored path trajectory line
- HUD panels: TelemetryPanel, SensorPanel, AIIntelPanel, TacticalMap, EventLog, ControlPanel
- Safety: FaultBanner, ConfirmationModal (Human-in-the-Loop), Motor Fault + Comms Loss fault triggers
- Responsive layout (desktop two-column, mobile single-column)
- Prototype disclaimer footer
- `npm run build` passes with zero TypeScript or bundling errors
