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

- Figma tokens applied throughout: `#0B1117` bg, `#111922` panel, `#18222F` panel2, `#263342` border, `#F8FAFC` text-primary, `#94A3B8` text-secondary, `#F59E0B` amber, `#38BDF8` cyan, `#10B981` green, `#EF4444` red, Inter font (400/500/600/700), tabular-nums for metrics
- `public/logo.png` wired into `MissionHeader` as `<img>` and `index.html` favicon
- `src/components/hud/ds.tsx` — shared design primitives: `StatusChip` (icon+label tinted pill, 4 variants), `PanelHeader`, `Btn` (6 variants, `border-radius: 8px`), `ProgressBar` (Emerald/Amber/Red thresholds)
- `TelemetryPanel` — large tabular readouts, ProgressBar per metric, StatusChip with Lucide icons, body-mode chip
- `SensorPanel` — 5-card strip (Optical/Thermal/Acoustic/CO₂/LiDAR) each with SIMULATED chip + Lucide icon + status chip; instability in secondary row
- `AIIntelPanel` — large % confidence gauge with 10-segment bar + level label, evidence tags with Lucide icons, route/hazard cards
- `ControlPanel` — Lucide icons on all buttons, E-Stop toggles between solid red "EMERGENCY STOP [SPACE]" and outlined "STOP ENGAGED — RELEASE [SPACE]", fault triggers with Zap/WifiOff icons
- `EventLog` — monospace timestamps, severity StatusChips (INFO/WARNING/CRITICAL/OK) with Lucide icons
- `ConfirmationModal` — `1px solid #F59E0B` border, amber glow shadow, APPROVAL REQUIRED chip, risk warning summary, survivor confidence callout, Reject (secondary) + Approve and execute (solid amber)
- `FaultBanner` — OctagonAlert/Zap/WifiOff icons, amber (fault) vs red (e-stop) styling
- `MissionHeader` — logo.png, four status chips with Lucide icons, PROTOTYPE·SIM badge
- `npm run build` passes with zero TypeScript or bundling errors

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

## Extended in this pass (modular rescue workflow)

- `src/types/rubblex.ts` — added `ModulePod`, `ModuleBay`, `MedicalReachback`, `ApprovalRecord`, `MissionReport` types; extended `MissionState` with `moduleBay`, `medicalReachback`, `approvalLog`, `deploymentStartedAt`, `debrisInterventionCount`, `transformationEvents`, `dockingEvents`
- `src/simulation/missionStore.ts` — added `dockModule()`, `toggleDoctorRelay()`, `requestSupplyDelivery()`, `confirmSupplyDelivery()`, `generateReport()`; debris confirmation now writes to `approvalLog`; body mode changes log to `transformationEvents`; scan unlocks `medicalReachback` with simulated patient assessment
- `src/components/hud/ModuleBaySelector.tsx` — docks MEDICAL_POD / DEBRIS_GRIPPER_POD / DETACHED with scope guardrail banner
- `src/components/hud/MedicalReachbackPanel.tsx` — patient assessment (SIM, NOT A DIAGNOSIS), doctor relay toggle, first-aid supply delivery (HitL modal), confidence callout
- `src/components/hud/MissionReportModal.tsx` — structured JSON report: deployment, transformation/docking events, survivor signals, medical reachback, debris interventions, approval audit log; Copy JSON + Download JSON
- `src/components/hud/ConfirmationModal.tsx` — routes approval to correct store method (debris vs supply delivery)
- `src/App.tsx` — 6-view filter nav (All Command / Mission Control / Robot & Transform / Sensors & Detection / Rescue & Medical / Mission Report); scope guardrails bar; Generate Report button in header; panels shown/hidden per active view
- `npm run build` passes with zero TypeScript or CSS errors
