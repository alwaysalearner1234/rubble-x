// ============================================================
// RUBBLE-X — central mission state store (no external lib)
// All values are SIMULATED. No real robot or sensors.
// ============================================================
import type {
  MissionState, RobotState, SensorBundle, AIIntelligence,
  MissionEvent, BodyMode, FaultTrigger, SurvivorSignal
} from '../types/rubblex'
import { SPAWN_POSITION, OBSTACLES, HAZARD_ZONES, ROBOT_BODY, SURVIVOR_BEACONS } from './worldConfig'

type Listener = (state: MissionState) => void

function makeSensorBundle(): SensorBundle {
  const now = Date.now()
  return {
    optical:     { label: 'OPTICAL',      unit: 'lux',  value: 'IDLE', status: 'IDLE', simulated: true, updatedAt: now },
    thermal:     { label: 'THERMAL',      unit: '°C',   value: 'IDLE', status: 'IDLE', simulated: true, updatedAt: now },
    acoustic:    { label: 'ACOUSTIC',     unit: 'dB',   value: 'IDLE', status: 'IDLE', simulated: true, updatedAt: now },
    co2:         { label: 'CO₂',          unit: 'ppm',  value: 'IDLE', status: 'IDLE', simulated: true, updatedAt: now },
    instability: { label: 'INSTABILITY',  unit: '/10',  value: 'IDLE', status: 'IDLE', simulated: true, updatedAt: now },
    lidar:       { label: 'LIDAR',        unit: 'm',    value: 'IDLE', status: 'IDLE', simulated: true, updatedAt: now },
  }
}

function makeAI(): AIIntelligence {
  return {
    survivorConfidence: 0,
    recommendedMode: 'EXPLORATION',
    recommendedRoute: 'No route computed yet.',
    hazardSummary: 'No hazards flagged.',
    evidenceTags: [],
    lastUpdated: Date.now(),
  }
}

function makeRobot(): RobotState {
  return {
    position: { x: SPAWN_POSITION[0], y: SPAWN_POSITION[1], z: SPAWN_POSITION[2], heading: 0 },
    bodyMode: 'EXPLORATION',
    deployed: false,
    stopped: false,
    fault: null,
    battery: 98,
    linkQuality: 100,
    distanceTravelled: 0,
    exploredCells: new Set(),
    pathHistory: [[SPAWN_POSITION[0], SPAWN_POSITION[1], SPAWN_POSITION[2]]],
    armExtended: false,
  }
}

function initialState(): MissionState {
  return {
    robot: makeRobot(),
    sensors: makeSensorBundle(),
    ai: makeAI(),
    survivors: [],
    events: [{ id: 'init', timestamp: Date.now(), message: 'System ready. Awaiting deployment.', level: 'info' }],
    missionPhase: 'STANDBY',
    missionProgress: 0,
    debrisRequest: { pending: false, description: '', confirmed: null },
    tick: 0,
  }
}

// ---- AAB collision check ----
function collidesWithObstacle(nx: number, ny: number, nz: number, mode: BodyMode): boolean {
  const { halfW, halfD } = ROBOT_BODY[mode]
  for (const obs of OBSTACLES) {
    const [ox, , oz] = obs.position
    const [sw, , sd] = obs.size
    if (
      nx > ox - sw / 2 - halfW && nx < ox + sw / 2 + halfW &&
      nz > oz - sd / 2 - halfD && nz < oz + sd / 2 + halfD
    ) return true
  }
  return false
}

function inHazard(x: number, z: number): boolean {
  return HAZARD_ZONES.some(hz => {
    const dx = x - hz.position[0], dz = z - hz.position[2]
    return Math.sqrt(dx * dx + dz * dz) < hz.radius
  })
}

function distToNearestObstacle(x: number, z: number): number {
  let min = 99
  for (const obs of OBSTACLES) {
    const dx = x - obs.position[0], dz = z - obs.position[2]
    const d = Math.sqrt(dx * dx + dz * dz) - Math.max(obs.size[0], obs.size[2]) / 2
    if (d < min) min = d
  }
  return Math.max(0, min)
}

function distToSurvivor(x: number, z: number): number {
  const sv = SURVIVOR_BEACONS[0].position
  const dx = x - sv[0], dz = z - sv[2]
  return Math.sqrt(dx * dx + dz * dz)
}

function addEvent(state: MissionState, message: string, level: MissionEvent['level']): MissionEvent[] {
  const ev: MissionEvent = { id: `ev-${Date.now()}-${Math.random()}`, timestamp: Date.now(), message, level }
  return [ev, ...state.events].slice(0, 80)
}

// ---- Store ----
class MissionStore {
  private state: MissionState = initialState()
  private listeners: Listener[] = []

  getState() { return this.state }

  subscribe(fn: Listener) {
    this.listeners.push(fn)
    return () => { this.listeners = this.listeners.filter(l => l !== fn) }
  }

  private notify() {
    const s = { ...this.state }
    this.listeners.forEach(l => l(s))
  }

  private set(patch: Partial<MissionState>) {
    this.state = { ...this.state, ...patch, tick: this.state.tick + 1 }
    this.notify()
  }

  // ---- Public actions ----

  deploy() {
    if (this.state.robot.deployed) return
    const robot: RobotState = { ...this.state.robot, deployed: true, stopped: false, fault: null }
    this.set({
      robot,
      missionPhase: 'DEPLOYED',
      events: addEvent(this.state, 'Robot deployed into simulated environment.', 'success'),
    })
  }

  move(dir: 'forward' | 'backward' | 'left' | 'right') {
    const { robot, missionPhase } = this.state
    if (!robot.deployed || robot.stopped || robot.fault) return
    const step = robot.bodyMode === 'COMPACT' ? 0.5 : 0.65
    const { x, y, z, heading } = robot.position
    let nx = x, nz = z
    if (dir === 'forward')  { nx += Math.sin(heading) * step; nz -= Math.cos(heading) * step }
    if (dir === 'backward') { nx -= Math.sin(heading) * step; nz += Math.cos(heading) * step }
    if (dir === 'left')  { nx -= Math.cos(heading) * step; nz -= Math.sin(heading) * step }
    if (dir === 'right') { nx += Math.cos(heading) * step; nz += Math.sin(heading) * step }
    nx = Math.max(-11.5, Math.min(11.5, nx))
    nz = Math.max(-11.5, Math.min(11.5, nz))
    if (collidesWithObstacle(nx, y, nz, robot.bodyMode)) {
      this.set({ events: addEvent(this.state, 'Obstacle detected — route blocked.', 'warn') })
      return
    }
    const dist = Math.hypot(nx - x, nz - z)
    const cell = `${Math.floor(nx / 2)},${Math.floor(nz / 2)}`
    const exploredCells = new Set(robot.exploredCells)
    exploredCells.add(cell)
    const pathHistory = [...robot.pathHistory, [nx, y, nz] as [number, number, number]].slice(-200)
    const newBattery = Math.max(0, robot.battery - dist * 0.15)
    const updatedRobot: RobotState = {
      ...robot,
      position: { x: nx, y, z: nz, heading },
      battery: newBattery,
      distanceTravelled: robot.distanceTravelled + dist,
      exploredCells,
      pathHistory,
    }
    const hazardNow = inHazard(nx, nz)
    let evs = this.state.events
    if (hazardNow) evs = addEvent({ ...this.state, events: evs }, '⚠ Entered hazard zone — structural instability detected.', 'warn')
    const progress = Math.min(100, Math.round((exploredCells.size / 60) * 100))
    this.set({ robot: updatedRobot, events: evs, missionProgress: progress, missionPhase: missionPhase === 'STANDBY' ? 'DEPLOYED' : missionPhase })
    this.updateProximitySensors(nx, nz)
  }

  rotate(dir: 'cw' | 'ccw') {
    const { robot } = this.state
    if (!robot.deployed || robot.stopped || robot.fault) return
    const delta = dir === 'cw' ? 0.15 : -0.15
    this.set({ robot: { ...robot, position: { ...robot.position, heading: robot.position.heading + delta } } })
  }

  toggleBodyMode() {
    const { robot } = this.state
    if (!robot.deployed || robot.stopped || robot.fault) return
    const newMode: BodyMode = robot.bodyMode === 'EXPLORATION' ? 'COMPACT' : 'EXPLORATION'
    this.set({
      robot: { ...robot, bodyMode: newMode },
      events: addEvent(this.state, `Body mode switched to ${newMode}.`, 'info'),
    })
  }

  toggleArm() {
    const { robot } = this.state
    if (!robot.deployed || robot.stopped || robot.fault) return
    const armExtended = !robot.armExtended
    if (armExtended) {
      // Human-in-the-loop: request confirmation before extending arm into debris
      this.set({
        debrisRequest: { pending: true, description: 'Extend manipulator arm toward debris field. Confirm operator-approved action.', confirmed: null },
        events: addEvent(this.state, 'Awaiting operator confirmation before arm extension.', 'warn'),
      })
    } else {
      this.set({
        robot: { ...robot, armExtended: false },
        events: addEvent(this.state, 'Manipulator arm retracted.', 'info'),
      })
    }
  }

  confirmDebrisAction(approved: boolean) {
    const { robot } = this.state
    if (approved) {
      this.set({
        robot: { ...robot, armExtended: true },
        debrisRequest: { pending: false, description: '', confirmed: true },
        events: addEvent(this.state, 'Operator approved — manipulator arm extended.', 'success'),
      })
    } else {
      this.set({
        debrisRequest: { pending: false, description: '', confirmed: false },
        events: addEvent(this.state, 'Operator cancelled arm extension.', 'info'),
      })
    }
  }

  scan() {
    const { robot } = this.state
    if (!robot.deployed || robot.stopped || robot.fault) return
    const { x, z } = robot.position
    const dist = distToSurvivor(x, z)
    const confidence = Math.max(0, Math.min(0.97, 1 - dist / 18))
    const thermal = confidence > 0.3
    const acoustic = confidence > 0.5
    const co2Val = 400 + Math.round(confidence * 1800)
    const thermalVal = thermal ? +(32 + confidence * 5).toFixed(1) : 20
    const acousticVal = acoustic ? Math.round(45 + confidence * 30) : 20
    const lidarDist = distToNearestObstacle(x, z)
    const instability = inHazard(x, z) ? +(4 + Math.random() * 4).toFixed(1) : +(Math.random() * 3).toFixed(1)
    const now = Date.now()
    const sensors: SensorBundle = {
      optical:     { label: 'OPTICAL',     unit: 'lux',  value: 'ACTIVE',       status: 'ACTIVE',   simulated: true, updatedAt: now },
      thermal:     { label: 'THERMAL',     unit: '°C',   value: thermalVal,     status: thermal ? 'SIGNAL' : 'ACTIVE',  simulated: true, updatedAt: now },
      acoustic:    { label: 'ACOUSTIC',    unit: 'dB',   value: acousticVal,    status: acoustic ? 'PATTERN' : 'ACTIVE', simulated: true, updatedAt: now },
      co2:         { label: 'CO₂',         unit: 'ppm',  value: co2Val,         status: co2Val > 1000 ? 'WARNING' : 'ACTIVE', simulated: true, updatedAt: now },
      instability: { label: 'INSTABILITY', unit: '/10',  value: instability,    status: +instability > 5 ? 'WARNING' : 'ACTIVE', simulated: true, updatedAt: now },
      lidar:       { label: 'LIDAR',       unit: 'm',    value: +lidarDist.toFixed(2), status: lidarDist < 1.5 ? 'WARNING' : 'ACTIVE', simulated: true, updatedAt: now },
    }
    const tags: string[] = []
    if (thermal)  tags.push('THERMAL-HIT')
    if (acoustic) tags.push('ACOUSTIC-PATTERN')
    if (co2Val > 1200) tags.push('ELEVATED-CO₂')
    if (instability > 5) tags.push('UNSTABLE-DEBRIS')
    const ai: AIIntelligence = {
      survivorConfidence: confidence,
      recommendedMode: lidarDist < 1.2 ? 'COMPACT' : 'EXPLORATION',
      recommendedRoute: confidence > 0.5 ? 'Advance toward east corridor — survivor signal strongest.' : 'Continue sweep — no strong signal yet.',
      hazardSummary: instability > 5 ? 'High structural instability. Proceed with caution.' : 'No critical hazards at current position.',
      evidenceTags: tags,
      lastUpdated: now,
    }
    let survivors = [...this.state.survivors]
    if (confidence > 0.25 && !survivors.some(s => s.id === 'survivor-1')) {
      const sv: SurvivorSignal = {
        id: 'survivor-1',
        position: SURVIVOR_BEACONS[0].position,
        confidence,
        thermalEvidence: thermal,
        acousticEvidence: acoustic,
        confirmedByOperator: false,
        markedAt: now,
      }
      survivors = [sv]
    }
    const level: MissionEvent['level'] = confidence > 0.5 ? 'warn' : 'info'
    this.set({
      sensors,
      ai,
      survivors,
      missionPhase: confidence > 0.25 ? 'ALERT' : 'DEPLOYED',
      events: addEvent(this.state, `Scan complete — simulated confidence ${Math.round(confidence * 100)}%. ${tags.join(', ') || 'No strong signatures.'}`, level),
    })
  }

  confirmSurvivor(id: string) {
    this.set({
      survivors: this.state.survivors.map(s => s.id === id ? { ...s, confirmedByOperator: true } : s),
      events: addEvent(this.state, `Survivor marker ${id} confirmed by operator.`, 'success'),
    })
  }

  emergencyStop() {
    this.set({
      robot: { ...this.state.robot, stopped: true },
      missionPhase: 'STOPPED',
      events: addEvent(this.state, 'EMERGENCY STOP — robot simulation halted.', 'danger'),
    })
  }

  releaseStop() {
    if (!this.state.robot.deployed) return
    this.set({
      robot: { ...this.state.robot, stopped: false, fault: null },
      missionPhase: 'DEPLOYED',
      events: addEvent(this.state, 'Emergency stop released — robot resuming.', 'info'),
    })
  }

  triggerFault(fault: FaultTrigger) {
    this.set({
      robot: { ...this.state.robot, stopped: true, fault },
      missionPhase: 'FAULT',
      sensors: {
        ...this.state.sensors,
        ...(fault === 'COMMS_LOSS' ? {
          optical:  { ...this.state.sensors.optical,  status: 'ERROR', value: 'NO SIGNAL', updatedAt: Date.now() },
          acoustic: { ...this.state.sensors.acoustic, status: 'ERROR', value: 'NO SIGNAL', updatedAt: Date.now() },
        } : {}),
      },
      events: addEvent(this.state, `FAULT: ${fault.replace('_', ' ')} detected.`, 'danger'),
    })
  }

  reset() {
    this.state = initialState()
    this.notify()
  }

  private updateProximitySensors(x: number, z: number) {
    const lidarDist = distToNearestObstacle(x, z)
    const co2Base = 420 + Math.round(Math.random() * 80)
    const now = Date.now()
    this.state = {
      ...this.state,
      sensors: {
        ...this.state.sensors,
        lidar:   { ...this.state.sensors.lidar,   value: +lidarDist.toFixed(2), status: lidarDist < 1.5 ? 'WARNING' : 'IDLE', updatedAt: now },
        co2:     { ...this.state.sensors.co2,     value: co2Base,               status: 'IDLE', updatedAt: now },
        optical: { ...this.state.sensors.optical, value: 'ACTIVE',              status: 'ACTIVE', updatedAt: now },
      },
    }
  }
}

export const store = new MissionStore()
