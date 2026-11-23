import { lazy, Suspense } from 'react'
import { useMission } from './simulation/useMission'
import TelemetryPanel from './components/hud/TelemetryPanel'
import SensorPanel from './components/hud/SensorPanel'
import AIIntelPanel from './components/hud/AIIntelPanel'
import TacticalMap from './components/hud/TacticalMap'
import EventLog from './components/hud/EventLog'
import ControlPanel from './components/hud/ControlPanel'
import ConfirmationModal from './components/hud/ConfirmationModal'
import FaultBanner from './components/hud/FaultBanner'

const RescueViewport3D = lazy(() => import('./components/simulation/RescueViewport3D'))

function Header({ phase }: { phase: string }) {
  const online = phase !== 'FAULT'
  return (
    <header className="h-16 border-b border-line bg-[#0d141c] sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 border-2 border-orange flex items-center justify-center font-black text-orange rotate-45 rounded-lg shrink-0">
          <span className="-rotate-45 text-sm">R</span>
        </div>
        <div>
          <strong className="tracking-[2px] text-[15px] text-rx-text">RUBBLE-X</strong>
          <small className="block text-muted text-[9px] tracking-[1.8px]">RESCUE COMMAND SYSTEM</small>
        </div>
      </div>
      <div className="flex items-center gap-3 md:gap-5 text-[11px] text-muted">
        <span className={online ? 'text-green' : 'text-orange'}>
          <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${online ? 'bg-green' : 'bg-orange'}`} />
          {online ? 'SIMULATION ONLINE' : 'FAULT ACTIVE'}
        </span>
        <span className="hidden sm:block">MISSION RX-042</span>
        <span className="hidden md:block">OPERATOR CONSOLE</span>
        <span className="hidden lg:block border border-line rounded-full px-2 py-0.5 text-[10px] text-muted">
          PROTOTYPE — SIMULATED
        </span>
      </div>
    </header>
  )
}

export default function App() {
  const [state] = useMission()

  return (
    <div className="min-h-screen bg-bg text-rx-text font-sans flex flex-col">
      <Header phase={state.missionPhase} />

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-3 md:px-5 py-4 grid gap-4"
        style={{ gridTemplateColumns: 'minmax(0,1.65fr) minmax(280px,0.85fr)' }}>

        {/* ---- LEFT COLUMN ---- */}
        <div className="flex flex-col gap-4 min-w-0">
          {/* 3D viewport */}
          <section className="bg-panel border border-line rounded-xl overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 border-b border-line">
              <div>
                <div className="text-[9px] text-muted tracking-widest uppercase mb-0.5">LIVE SIMULATION / SECTOR 04</div>
                <h2 className="text-[11px] font-semibold tracking-[1.4px] uppercase">01 / Live Environment Simulation</h2>
              </div>
              <span className={`text-[10px] border rounded-full px-2 py-0.5 ${state.robot.bodyMode === 'COMPACT' ? 'text-cyan border-cyan/40' : 'text-orange border-orange/40'}`}>
                {state.robot.bodyMode} MODE
              </span>
            </div>
            <div style={{ height: 'clamp(280px, 42vw, 520px)', position: 'relative' }}>
              <Suspense fallback={
                <div className="flex items-center justify-center h-full text-muted text-sm">
                  Loading 3D environment…
                </div>
              }>
                <RescueViewport3D state={state} />
              </Suspense>
            </div>
          </section>

          {/* fault / estop banner */}
          <FaultBanner state={state} />

          {/* sensor + AI row */}
          <SensorPanel state={state} />
          <AIIntelPanel state={state} />

          {/* bottom row: map + log */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TacticalMap state={state} />
            <EventLog state={state} />
          </div>
        </div>

        {/* ---- RIGHT COLUMN ---- */}
        <div className="flex flex-col gap-4 min-w-0">
          <TelemetryPanel state={state} />
          <ControlPanel state={state} />
        </div>
      </main>

      {/* prototype disclaimer */}
      <footer className="max-w-[1600px] w-full mx-auto px-4 md:px-6 pb-5 pt-2">
        <p className="text-[10px] text-[#708294] border-t border-line pt-3">
          RUBBLE-X is a concept-stage software prototype. Robot movement, body-mode switching, telemetry and sensor detections are
          entirely simulated and are not connected to physical hardware. Confidence values are illustrative and not validated probabilities.
          Do not use this simulation to make real-world rescue decisions.
        </p>
      </footer>

      {/* Human-in-the-loop modal */}
      <ConfirmationModal state={state} />
    </div>
  )
}
