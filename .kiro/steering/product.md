# Product Steering: RUBBLE-X

## Product vision
Build an operator-centred search-and-rescue intelligence system that helps responders explore dangerous, confined disaster spaces, interpret sensor observations and coordinate decisions.

## Primary users
- Search-and-rescue operators
- Incident commanders
- Robotics and field-test engineers

## User problem
After an earthquake, responders may face unstable debris, narrow voids, poor visibility and limited information about possible survivors. A remote robotic platform could help gather information before a human responder enters a hazardous area.

## Product principles
1. Human operators remain in control of consequential actions.
2. Display uncertainty; never turn a sensor signal into an unqualified claim that a person is alive or dead.
3. Make robot state, communications state and sensor freshness visible.
4. Prefer observation, mapping and communication over debris manipulation.
5. Clearly distinguish simulated data from real sensor data.
6. Provide an immediate emergency-stop interaction in the simulation.

## Hackathon MVP
The hackathon deliverable is a browser-based software simulation and command interface, not a physical robot. Prioritise a stable, understandable end-to-end demo over broad but unfinished features.

## Out of scope for this MVP
- Real-world autonomous navigation
- Real robot motor or actuator control
- Validated thermal/acoustic survivor detection
- Autonomous excavation or movement of load-bearing debris
- Claims of field readiness or rescue effectiveness

## Success criteria
A judge can launch the app, control the simulated robot, observe a scan event, see a possible-survivor alert with uncertainty, and activate the safety stop. The README and demo clearly disclose what is simulated.
