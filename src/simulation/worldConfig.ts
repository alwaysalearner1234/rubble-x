// World geometry constants (Three.js units)
export const WORLD_HALF = 12
export const FLOOR_Y = 0

export interface ObstacleBox {
  id: string
  position: [number, number, number]
  size: [number, number, number]
  unstable?: boolean
}

export interface HazardZone {
  id: string
  position: [number, number, number]
  radius: number
}

export interface SurvivorBeacon {
  id: string
  position: [number, number, number]
}

export interface NarrowPassage {
  id: string
  position: [number, number, number]
  size: [number, number, number]
  maxWidth: number  // compact robot fits if bodyHalfWidth < maxWidth
}

export const OBSTACLES: ObstacleBox[] = [
  { id: 'slab-a', position: [-6,  0.6, -4], size: [4,  1.2, 3],  unstable: false },
  { id: 'slab-b', position: [ 5,  0.8, -5], size: [3,  1.6, 4],  unstable: false },
  { id: 'slab-c', position: [ 2,  0.5,  2], size: [5,  1.0, 2],  unstable: true  },
  { id: 'slab-d', position: [-8,  0.5,  3], size: [3,  1.0, 4],  unstable: false },
  { id: 'slab-e', position: [ 7,  0.5,  4], size: [4,  1.0, 3],  unstable: false },
  { id: 'rubble-pile-1', position: [-3,  0.4, -8], size: [2.5, 0.8, 2.5], unstable: false },
  { id: 'rubble-pile-2', position: [ 4,  0.4,  7], size: [3,   0.8, 2],   unstable: true  },
  { id: 'column-left',  position: [-9,  1.2,  0], size: [1.5, 2.4, 1.5], unstable: false },
  { id: 'column-right', position: [ 9,  1.2,  0], size: [1.5, 2.4, 1.5], unstable: false },
]

export const HAZARD_ZONES: HazardZone[] = [
  { id: 'hz-1', position: [ 2,  0, 2],  radius: 2.5 },
  { id: 'hz-2', position: [-5,  0, 6],  radius: 2.0 },
  { id: 'hz-3', position: [ 8,  0, -3], radius: 1.8 },
]

export const SURVIVOR_BEACONS: SurvivorBeacon[] = [
  { id: 'survivor-1', position: [6, 0.2, 2] },
]

export const NARROW_PASSAGES: NarrowPassage[] = [
  { id: 'tunnel-1', position: [0, 0.25, -2], size: [1.2, 0.5, 4], maxWidth: 0.65 },
]

// Robot body dimensions
export const ROBOT_BODY = {
  EXPLORATION: { halfW: 0.55, halfH: 0.4, halfD: 0.7 },
  COMPACT:     { halfW: 0.35, halfH: 0.25, halfD: 0.6 },
}

export const SPAWN_POSITION: [number, number, number] = [-10, 0.4, -9]
