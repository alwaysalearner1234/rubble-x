// ============================================================
// RUBBLE-X — shared state contracts
// All sensor/telemetry values are SIMULATED. No real hardware.
// ============================================================

export type BodyMode = 'EXPLORATION' | 'COMPACT'

export type FaultType = 'MOTOR_FAULT' | 'COMMS_LOSS' | null

export interface RobotPosition {
  x: number  // world-space
  y: number
  z: number
  heading: number  // radians
}

export interface RobotState {
  position: RobotPosition
  bodyMode: BodyMode
  deployed: boolean
  stopped: boolean
  fault: FaultType
  battery: number       // 0–100 %  (simulated)
  linkQuality: number   // 0–100 %  (simulated)
  distanceTravelled: number  // metres (simulated)
  exploredCells: Set<string>
  pathHistory: [number, number, number][]
  armExtended: boolean
}

export type SensorStatus = 'IDLE' | 'ACTIVE' | 'SIGNAL' | 'PATTERN' | 'WARNING' | 'ERROR'

export interface SensorReading {
  label: string
  unit: string
  value: number | string
  status: SensorStatus
  simulated: true   // always true — this is mock data
  updatedAt: number  // Date.now()
}

export interface SensorBundle {
  optical:    SensorReading
  thermal:    SensorReading  // °C
  acoustic:   SensorReading  // dB
  co2:        SensorReading  // ppm
  instability:SensorReading  // 0–10 scale
  lidar:      SensorReading  // metres to nearest obstacle
}

export interface SurvivorSignal {
  id: string
  position: [number, number, number]
  confidence: number  // 0–1  — ILLUSTRATIVE, not validated
  thermalEvidence: boolean
  acousticEvidence: boolean
  confirmedByOperator: boolean
  markedAt: number
}

export interface AIIntelligence {
  survivorConfidence: number       // 0–1  illustrative
  recommendedMode: BodyMode
  recommendedRoute: string
  hazardSummary: string
  evidenceTags: string[]
  lastUpdated: number
}

export interface MissionEvent {
  id: string
  timestamp: number
  message: string
  level: 'info' | 'warn' | 'danger' | 'success'
}

export type FaultTrigger = 'MOTOR_FAULT' | 'COMMS_LOSS'

export interface DebrisManipulationRequest {
  pending: boolean
  description: string
  confirmed: boolean | null  // null = awaiting, true = approved, false = denied
}

export interface MissionState {
  robot: RobotState
  sensors: SensorBundle
  ai: AIIntelligence
  survivors: SurvivorSignal[]
  events: MissionEvent[]
  missionPhase: 'STANDBY' | 'DEPLOYED' | 'SCANNING' | 'ALERT' | 'STOPPED' | 'FAULT'
  missionProgress: number  // 0–100
  debrisRequest: DebrisManipulationRequest
  tick: number  // sim frame counter
}
