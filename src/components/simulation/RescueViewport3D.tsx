// ============================================================
// RUBBLE-X — 3D Collapsed-Building Simulation Viewport
// Rendered with @react-three/fiber + @react-three/drei
// All geometry is SIMULATED. No real structure depicted.
// ============================================================
import { Suspense, useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Line, Html, GizmoHelper, GizmoViewport } from '@react-three/drei'
import * as THREE from 'three'
import type { MissionState } from '../../types/rubblex'
import { OBSTACLES, HAZARD_ZONES, NARROW_PASSAGES, SURVIVOR_BEACONS, WORLD_HALF, ROBOT_BODY } from '../../simulation/worldConfig'

// ---- Rubble slab ----
function RubbleSlab({ obs }: { obs: (typeof OBSTACLES)[0] }) {
  const color = obs.unstable ? '#c0683a' : '#4a5a65'
  const edgeColor = obs.unstable ? '#ff9d42' : '#697780'
  return (
    <group position={obs.position}>
      <mesh receiveShadow castShadow>
        <boxGeometry args={obs.size} />
        <meshStandardMaterial color={color} roughness={0.9} metalness={0.1} />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(...obs.size)]} />
        <lineBasicMaterial color={edgeColor} />
      </lineSegments>
      {obs.unstable && (
        <Html center distanceFactor={6} style={{ pointerEvents: 'none', userSelect: 'none' }}>
          <div style={{ color: '#ff9d42', fontSize: 11, fontWeight: 700, background: '#1a1200cc', padding: '2px 5px', borderRadius: 4, whiteSpace: 'nowrap' }}>
            ⚠ UNSTABLE
          </div>
        </Html>
      )}
    </group>
  )
}

// ---- Narrow passage tunnel ----
function NarrowPassage({ passage }: { passage: (typeof NARROW_PASSAGES)[0] }) {
  return (
    <group position={passage.position}>
      {/* left wall */}
      <mesh position={[-passage.size[0] / 2 - 0.1, 0, 0]}>
        <boxGeometry args={[0.2, passage.size[1] * 2, passage.size[2]]} />
        <meshStandardMaterial color="#2d4050" roughness={1} transparent opacity={0.7} />
      </mesh>
      {/* right wall */}
      <mesh position={[passage.size[0] / 2 + 0.1, 0, 0]}>
        <boxGeometry args={[0.2, passage.size[1] * 2, passage.size[2]]} />
        <meshStandardMaterial color="#2d4050" roughness={1} transparent opacity={0.7} />
      </mesh>
      {/* ceiling */}
      <mesh position={[0, passage.size[1], 0]}>
        <boxGeometry args={[passage.size[0] + 0.4, 0.15, passage.size[2]]} />
        <meshStandardMaterial color="#3a4f5c" roughness={1} />
      </mesh>
      <Html center distanceFactor={5} position={[0, passage.size[1] + 0.4, 0]} style={{ pointerEvents: 'none' }}>
        <div style={{ color: '#48d6e8', fontSize: 10, background: '#0b1016cc', padding: '2px 6px', borderRadius: 4, whiteSpace: 'nowrap' }}>
          COMPACT MODE REQUIRED
        </div>
      </Html>
    </group>
  )
}

// ---- Hazard zone ----
function HazardZone({ hz }: { hz: (typeof HAZARD_ZONES)[0] }) {
  const meshRef = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial
      mat.opacity = 0.15 + 0.1 * Math.sin(clock.getElapsedTime() * 2)
    }
  })
  return (
    <group position={hz.position}>
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[hz.radius, 32]} />
        <meshStandardMaterial color="#ff5e62" transparent opacity={0.2} depthWrite={false} />
      </mesh>
      <Html center distanceFactor={6} style={{ pointerEvents: 'none' }}>
        <div style={{ color: '#ff5e62', fontSize: 11, fontWeight: 700, background: '#1a0000cc', padding: '2px 5px', borderRadius: 4 }}>
          ▲ HAZARD
        </div>
      </Html>
    </group>
  )
}

// ---- Survivor beacon ----
function SurvivorBeacon({ beacon, detected }: { beacon: (typeof SURVIVOR_BEACONS)[0]; detected: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = 0.6 + Math.sin(clock.getElapsedTime() * 2) * 0.08
      const mat = meshRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = detected ? 0.6 + 0.4 * Math.sin(clock.getElapsedTime() * 3) : 0.3
    }
  })
  return (
    <group position={beacon.position}>
      {/* thermal shimmer ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.6, 0.9, 32]} />
        <meshStandardMaterial color="#ff9d42" transparent opacity={detected ? 0.5 : 0.15} depthWrite={false} />
      </mesh>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color={detected ? '#ff9d42' : '#8b6a3a'} emissive="#ff6600" emissiveIntensity={0.4} />
      </mesh>
      {detected && (
        <Html center distanceFactor={5} position={[0, 1.1, 0]} style={{ pointerEvents: 'none' }}>
          <div style={{ color: '#ff9d42', fontSize: 11, fontWeight: 700, background: '#1a0d00cc', padding: '3px 7px', borderRadius: 4, whiteSpace: 'nowrap', border: '1px solid #ff9d4255' }}>
            ◆ POSSIBLE SURVIVOR
          </div>
        </Html>
      )}
    </group>
  )
}

// ---- Robot body ----
function RobotMesh({ state }: { state: MissionState }) {
  const groupRef = useRef<THREE.Group>(null)
  const armRef = useRef<THREE.Mesh>(null)
  const { robot } = state
  const { x, y, z, heading } = robot.position
  const compact = robot.bodyMode === 'COMPACT'
  const dims = compact ? ROBOT_BODY.COMPACT : ROBOT_BODY.EXPLORATION
  const bodyColor = robot.stopped ? '#ff5e62' : robot.fault ? '#ff9d42' : '#48d6e8'

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.set(x, y, z)
      groupRef.current.rotation.y = heading
    }
    if (armRef.current) {
      const target = robot.armExtended ? 1.2 : 0
      armRef.current.position.x += (target - armRef.current.position.x) * 0.12
    }
  })

  return (
    <group ref={groupRef}>
      {/* main chassis */}
      <mesh castShadow>
        <boxGeometry args={[dims.halfW * 2, dims.halfH * 2, dims.halfD * 2]} />
        <meshStandardMaterial color={bodyColor} roughness={0.4} metalness={0.6} emissive={bodyColor} emissiveIntensity={0.15} />
      </mesh>
      {/* sensor dome */}
      <mesh position={[0, dims.halfH + 0.12, 0]}>
        <sphereGeometry args={[0.15, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#c8f0f4" roughness={0.1} metalness={0.3} transparent opacity={0.8} />
      </mesh>
      {/* left track */}
      <mesh position={[-dims.halfW - 0.07, -dims.halfH + 0.06, 0]} castShadow>
        <boxGeometry args={[0.14, dims.halfH * 0.6, dims.halfD * 1.8]} />
        <meshStandardMaterial color="#2a3a44" roughness={1} />
      </mesh>
      {/* right track */}
      <mesh position={[dims.halfW + 0.07, -dims.halfH + 0.06, 0]} castShadow>
        <boxGeometry args={[0.14, dims.halfH * 0.6, dims.halfD * 1.8]} />
        <meshStandardMaterial color="#2a3a44" roughness={1} />
      </mesh>
      {/* manipulator arm (not compact) */}
      {!compact && (
        <group position={[0, dims.halfH * 0.5, -dims.halfD]}>
          <mesh ref={armRef} position={[0, 0, -0.4]}>
            <boxGeometry args={[0.08, 0.08, 0.8]} />
            <meshStandardMaterial color="#48d6e8" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, robot.armExtended ? -1.0 : -0.1]}>
            <coneGeometry args={[0.07, 0.18, 8]} />
            <meshStandardMaterial color="#ff9d42" metalness={0.5} />
          </mesh>
        </group>
      )}
      {/* glow point light */}
      <pointLight color={bodyColor} intensity={1.2} distance={3} />
      {/* label */}
      <Html center distanceFactor={6} position={[0, dims.halfH + 0.5, 0]} style={{ pointerEvents: 'none' }}>
        <div style={{ color: bodyColor, fontSize: 10, fontWeight: 700, background: '#0b1016cc', padding: '1px 5px', borderRadius: 3, whiteSpace: 'nowrap' }}>
          RUBBLE-X
        </div>
      </Html>
    </group>
  )
}

// ---- Explored path ----
function ExploredPath({ history }: { history: [number, number, number][] }) {
  if (history.length < 2) return null
  const points = history.map(([x, y, z]) => new THREE.Vector3(x, y + 0.05, z))
  return <Line points={points} color="#48d6e860" lineWidth={1.5} />
}

// ---- Floor grid ----
function FloorGrid() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[WORLD_HALF * 2, WORLD_HALF * 2, 24, 24]} />
        <meshStandardMaterial color="#131e28" roughness={1} />
      </mesh>
      <gridHelper args={[WORLD_HALF * 2, 24, '#1e3040', '#1e3040']} position={[0, 0.01, 0]} />
    </>
  )
}

// ---- Keyboard handler (attached to canvas) ----
function KeyboardControls({ state }: { state: MissionState }) {
  const { gl } = useThree()
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return
      const key = e.key.toLowerCase()
      const map: Record<string, () => void> = {
        w: () => { import('../../simulation/missionStore').then(m => m.store.move('forward')) },
        s: () => { import('../../simulation/missionStore').then(m => m.store.move('backward')) },
        a: () => { import('../../simulation/missionStore').then(m => m.store.move('left')) },
        d: () => { import('../../simulation/missionStore').then(m => m.store.move('right')) },
        q: () => { import('../../simulation/missionStore').then(m => m.store.rotate('ccw')) },
        e: () => { import('../../simulation/missionStore').then(m => m.store.rotate('cw')) },
        ' ': () => { e.preventDefault(); import('../../simulation/missionStore').then(m => m.store.emergencyStop()) },
      }
      if (map[key]) { e.preventDefault(); map[key]() }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [gl])
  return null
}

// ---- Scene ----
function Scene({ state }: { state: MissionState }) {
  const detectedBeacons = new Set(state.survivors.map(s => s.id))
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[8, 12, 8]} intensity={0.8} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-8, 6, -8]} intensity={0.4} color="#4466ff" />
      <FloorGrid />
      {OBSTACLES.map(obs => <RubbleSlab key={obs.id} obs={obs} />)}
      {NARROW_PASSAGES.map(p => <NarrowPassage key={p.id} passage={p} />)}
      {HAZARD_ZONES.map(hz => <HazardZone key={hz.id} hz={hz} />)}
      {SURVIVOR_BEACONS.map(b => <SurvivorBeacon key={b.id} beacon={b} detected={detectedBeacons.has(b.id)} />)}
      {state.robot.deployed && <RobotMesh state={state} />}
      {state.robot.deployed && <ExploredPath history={state.robot.pathHistory} />}
      <OrbitControls makeDefault minDistance={3} maxDistance={30} maxPolarAngle={Math.PI / 2.1} />
      <GizmoHelper alignment="bottom-right" margin={[60, 60]}>
        <GizmoViewport />
      </GizmoHelper>
      <KeyboardControls state={state} />
    </>
  )
}

// ---- Public component ----
export default function RescueViewport3D({ state }: { state: MissionState }) {
  return (
    <div style={{ width: '100%', height: '100%', background: '#0b1016', borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
      <Canvas
        shadows
        camera={{ position: [-5, 10, 14], fov: 52 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <Suspense fallback={null}>
          <Scene state={state} />
        </Suspense>
      </Canvas>
      {/* overlay badges */}
      <div style={{ position: 'absolute', top: 10, left: 12, display: 'flex', gap: 7, flexWrap: 'wrap', pointerEvents: 'none' }}>
        <span style={{ fontSize: 10, border: '1px solid #285b4a', borderRadius: 99, padding: '3px 8px', color: '#53d69a', background: '#0b1016cc' }}>
          ● ENVIRONMENT SIMULATED
        </span>
        <span style={{ fontSize: 10, border: '1px solid #263746', borderRadius: 99, padding: '3px 8px', color: '#91a2b3', background: '#0b1016cc' }}>
          W/A/S/D MOVE · Q/E ROTATE · SPACE E-STOP
        </span>
      </div>
      {/* legend */}
      <div style={{ position: 'absolute', bottom: 10, left: 12, display: 'flex', gap: 12, background: '#0b1016dd', padding: '5px 10px', border: '1px solid #263746', borderRadius: 6, fontSize: 10, color: '#91a2b3', pointerEvents: 'none', flexWrap: 'wrap' }}>
        <span style={{ color: '#4a5a65' }}>▰ RUBBLE</span>
        <span style={{ color: '#c0683a' }}>▰ UNSTABLE</span>
        <span style={{ color: '#48d6e8' }}>● ROBOT</span>
        <span style={{ color: '#ff9d42' }}>◆ POSSIBLE SURVIVOR</span>
        <span style={{ color: '#ff5e62' }}>▲ HAZARD</span>
      </div>
    </div>
  )
}
