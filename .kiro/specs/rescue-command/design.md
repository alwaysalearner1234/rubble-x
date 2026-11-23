# Design: RUBBLE-X Rescue Command MVP

## Current architecture
The current MVP is a single-page static web application:
- HTML provides the application structure.
- CSS provides layout and visual styling.
- JavaScript manages the interactive simulation.
- Canvas-based rendering presents the 2D rubble environment.
- Simulated events provide robot telemetry and sensor feedback.

There is no physical robot connection, backend service, persistent database or production AI inference in this MVP.

## Main operator flow
1. Open the command interface.
2. Review the rubble environment and robot status.
3. Deploy or move the simulated robot.
4. Switch between compact and extended modes.
5. Trigger a sensor scan.
6. Review a possible-survivor alert and its illustrative confidence.
7. Use emergency stop if required.
8. Reset the scenario for another demonstration.

## Safety model
The simulation should always communicate that the operator is interacting with a mock environment. In a future physical system, a separate safety controller must own actuator limits and emergency-stop behavior; AI recommendations must not bypass it.

## Evolution path
When the single-file prototype becomes difficult to maintain, split it into modules while preserving the same user workflow and acceptance criteria. A future 3D scene should be introduced only after the current interaction flow remains stable.
