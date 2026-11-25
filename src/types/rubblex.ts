// ============================================================
// RUBBLE-X — shared state contracts
// All sensor/telemetry values are SIMULATED. No real hardware.
// ============================================================

export type BodyMode = 'EXPLORATION' | 'COMPACT'

export type FaultType = 'MOTOR_FAULT' | 'COMMS_LOSS' | null

// ── Magnetic Module Bay ──────────────────────────────────────
export type ModulePod = 'DETACHED' | 'MEDICAL_POD' | 'DEBRIS_GRIPPER_POD'

export interface ModuleBay {
  docked: ModulePod
  dockingAt: number | null   // timestamp of last dock/detach
}

// ── Medical Reachback ────────────────────────────────────────
export interface MedicalReachback {
  unlocked: boolean          // true once a survivor is located
  doctorRelayActive: boolean
  doctorRelayConnectedAt: number | null
  suppliesDelivered: boolean
  supplyDeliveryRequest: {
    pending: boolean
    confirmed: boolean | null
  }
  // simulated patient assessment (explicitly NOT a diagnosis)
  patientAssessment: {
    postureStatus: string      // e.g. "Supine — motionless (SIM)"
    responsiveness: string     // e.g. "Unresponsive (SIM)"
    thermalReading: string     // e.g. "36.4 °C (SIM)"
    respiratoryRate: string    // e.g. "14 bpm (SIM)"
    generatedAt: number | null
  }
}

// ── Approval audit log entry ─────────────────────────────────
export interface ApprovalRecord {
  id: string
  timestamp: number
  action: string
  approved: boolean
  operatorNote: string
}

// ── Mission Report ───────────────────────────────────────────
export interface MissionReport {
  missionId: string
  generatedAt: number
  deploymentStartedAt: number | null
  deploymentDurationSec: number
  distanceTravelledM: number
  cellsExplored: number
  missionProgress: number
  transformationEvents: string[]
  dockingEvents: string[]
  survivorSignals: Array<{
    id: string
    confidence: number
    position: [number, number, number]
    thermalEvidence: boolean
    acousticEvidence: boolean
    confirmedByOperator: boolean
  }>
  medicalReachback: {
    doctorRelayUsed: boolean
    suppliesDelivered: boolean
  }
  debrisInterventions: number
  approvalAuditLog: ApprovalRecord[]
  disclaimer: string
}

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
  // new fields
  moduleBay: ModuleBay
  medicalReachback: MedicalReachback
  approvalLog: ApprovalRecord[]
  deploymentStartedAt: number | null
  debrisInterventionCount: number
  transformationEvents: string[]
  dockingEvents: string[]
}
