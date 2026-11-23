# RUBBLE-X Rescue Command

A browser-based, interactive **simulation prototype** for an earthquake search-and-rescue robot concept.

## What this prototype demonstrates

- A 2D rubble-field environment
- Operator-controlled robot movement
- Simulated compact/extended mode
- Simulated sensor scan and survivor marker
- Mission telemetry, event log and safety stop
- A command-centre interface for an operator

> **Important:** This is a software demonstration. Robot movement, contraction, sensor readings, survivor detections and telemetry are simulated. This repository does not contain a physically validated robot controller, real thermal/acoustic sensing, or a clinically/operationally validated survivor-detection model.

## Run locally (React + Vite build)

```bash
npm install
npm run dev        # development server at http://localhost:5173
npm run build      # production build to dist/
npm run preview    # preview the production build
```

The original `index.html` standalone prototype remains in the repo root for reference.

## Operator walkthrough

1. **Open the app** — the 3D environment loads automatically. All data is labelled SIMULATED.
2. **Deploy the robot** — click *Deploy Robot* (or press `Deploy` button in the Controls panel). The robot appears in the bottom-left of the 3D scene.
3. **Move** — use `W/A/S/D` keys or the on-screen d-pad. `Q`/`E` rotate the heading. The 2D tactical map and explored-path trail update in real time.
4. **Compact mode** — click *Compact Mode* to shrink the robot chassis. Use this near the narrow tunnel passage (centre of the scene).
5. **Sensor scan** — click *◎ Run Sensor Scan* to fire all six simulated sensors. Thermal, acoustic, CO₂ and LiDAR values update. If the robot is within range of the survivor beacon, the AI panel shows a confidence score and evidence tags.
6. **Review AI intelligence** — the *04 / Survivor Intelligence* panel shows the illustrative confidence, recommended body mode, route guidance and hazard summary. These are advisory — a qualified operator must verify all findings.
7. **Extend the manipulator arm** — click *Extend Arm*. A Human-in-the-Loop confirmation modal requires operator approval before proceeding.
8. **Fault simulation** — click *Motor Fault* or *Comms Loss* to inject a simulated fault. The fault banner appears and movement is disabled. Click *Release* to clear.
9. **Emergency stop** — press `Space` or click *⬛ EMERGENCY STOP* at any time. All movement and scanning halt immediately. Click *Release Stop / Clear Fault* to resume.
10. **Reset** — click *Reset Mission* to return the robot to the start position and clear all events.

## Kiro project structure

- `.kiro/steering/` — persistent product, technical and repository guidance.
- `.kiro/specs/rescue-command/` — feature requirements, design and implementation tasks.

Use these files as the initial Kiro context. Update the spec as the implementation evolves; do not mark tasks complete unless the corresponding behavior exists and has been tested.

## Current scope and next milestones

1. Preserve the working single-page simulation.
2. Separate the UI, simulation state and sensor-event logic into maintainable modules.
3. Add an interactive 3D rubble environment.
4. Add clearly labelled simulated camera, thermal and acoustic feeds.
5. Add explainable AI-assisted event summaries with confidence and uncertainty.
6. Add automated tests and a short demo walkthrough.

## Safety and responsible claims

RUBBLE-X is a concept under development. Do not describe simulated detections as confirmed survivors or simulated controls as real robot actuation. Any future physical prototype must have independent safety controls, human supervision, engineering validation and controlled testing before deployment.

## License

MIT. See `LICENSE`.
