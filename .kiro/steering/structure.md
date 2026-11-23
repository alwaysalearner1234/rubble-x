# Repository Structure Guidance

## Current structure
- `index.html`: standalone browser prototype.
- `.kiro/steering/`: product, technical and repository-wide guidance.
- `.kiro/specs/rescue-command/`: feature specification for the current MVP.

## Future structure if the app is modularised
- `src/app/`: application shell and screens
- `src/components/`: reusable interface components
- `src/simulation/`: world state, robot state, obstacles and simulation rules
- `src/sensors/`: simulated sensor events and interpretation
- `src/safety/`: emergency-stop and operator-approval workflows
- `tests/`: unit and end-to-end tests

Keep the actual repository structure and documentation aligned. Do not claim folders or services exist before creating them.
