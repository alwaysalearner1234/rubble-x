# Feature: RUBBLE-X Rescue Command MVP

## Overview
Deliver a browser-based command interface that demonstrates the core operator workflow for a simulated earthquake search-and-rescue robot.

## Requirements

### R1 — Launch and understand the simulation
**User story:** As a judge or operator, I want to open the app and understand that I am interacting with a simulation.

Acceptance criteria:
- The app loads in a modern browser without a build step.
- The interface identifies the project as RUBBLE-X Rescue Command.
- Simulated behavior and data are disclosed in the UI or README.

### R2 — Observe the rubble environment
**User story:** As an operator, I want to see the robot in a rubble environment.

Acceptance criteria:
- The environment displays obstacles and traversable space.
- The robot's current position is visible.
- The operator can distinguish the robot from obstacles and markers.

### R3 — Control simulated movement
**User story:** As an operator, I want to move the simulated robot.

Acceptance criteria:
- Movement can be triggered using on-screen controls and supported keyboard controls.
- Movement updates the displayed robot position.
- The robot does not pass through obstacles where collision handling is implemented.
- The interface exposes the robot's current mode/state.

### R4 — Demonstrate compact and extended modes
**User story:** As an operator, I want to switch between compact and extended configurations.

Acceptance criteria:
- The interface offers a compact/extended mode control.
- The current mode is visibly indicated.
- The UI describes this as a simulated configuration change, not a physically proven ability to fit through arbitrary gaps.

### R5 — Run a simulated sensor scan
**User story:** As an operator, I want to scan an area and receive a possible-survivor alert.

Acceptance criteria:
- The operator can trigger a scan.
- The app displays a scan event and a possible-survivor marker when the demo scenario calls for one.
- Any confidence value is explicitly illustrative and not a validated probability.
- The event log records the scan.

### R6 — Provide operator safety control
**User story:** As an operator, I want to stop the simulated robot immediately.

Acceptance criteria:
- An emergency-stop control is easy to locate.
- Activating it prevents further simulated movement until reset or release according to the implemented interaction.
- The UI visibly indicates the stopped state.
- The README explains that this is a software simulation control, not a certified physical emergency-stop system.

### R7 — Display mission status
**User story:** As an operator, I want to understand robot and mission status.

Acceptance criteria:
- The interface displays available telemetry and event history.
- Mock values are labelled as simulated.
- The interface does not imply live hardware connectivity.

## Quality requirements
- Core interactions work without a network connection.
- No secrets or API keys are committed.
- The app remains usable on a typical laptop browser.
- Errors and stopped states are visually apparent.
