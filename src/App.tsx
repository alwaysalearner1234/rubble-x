import { lazy, Suspense } from 'react'
import { Bot, Radio, Zap } from 'lucide-react'
import { useMission } from './simulation/useMission'
import TelemetryPanel from './components/hud/TelemetryPanel'
import SensorPanel from './components/hud/SensorPanel'
import AIIntelPanel from './components/hud/AIIntelPanel'
import TacticalMap from './components/hud/TacticalMap'
import EventLog from './components/hud/EventLog'
import ControlPanel from './components/hud/ControlPanel'
import ConfirmationModal from './components/hud/ConfirmationModal'
import FaultBanner from './components/hud/FaultBanner'
import { StatusChip } from './components/hud/ds'

const RescueViewport3D = lazy(() => import('./components/simulation/RescueViewport3D'))

function MissionHeader({ phase }: { phase: string }) {
  const isFault   = phase === 'FAULT'
  const isStopped = phase === 'STOPPED'
  const isNominal = !isFault && !isStopped

  const statusVariant = isFault || isStopped ? 'critical' as const : 'nominal' as const
  const StatusIcon = isFault ? Zap : isStopped ? Zap : Radio
  const statusLabel = isFault ? 'FAULT ACTIVE' : isStopped ? 'E-STOP' : 'SIMULATION ONLINE'

  return (
    <header className="h-16 border-b border-line bg-panel sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 shrink-0">
      {/* brand: logo.png + wordmark */}
      <div className="flex items-center gap-3">
        <img
          src="/logo.png"
          alt="RUBBLE-X logo"
          className="w-9 h-9 rounded-[8px] object-contain shrink-0"
        />
        <div>
          <strong className="tracking-[2.5px] text-[14px] text-rx-text font-bold">RUBBLE-X</strong>
          <small className="block text-muted text-[9px] tracking-[1.6px] uppercase font-medium">
            Rescue Command System
          </small>
        </div>
      </div>

      {/* status chips */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* system status */}
        <StatusChip
          variant={statusVariant}
          Icon={StatusIcon}
          label={statusLabel}
          pulse={isNominal}
        />
        {/* mission id */}
        <span className="hidden sm:flex items-center gap-1.5 border border-line rounded-[4px] px-2 py-0.5 text-[10px] text-muted font-medium">
          <Bot size={11} strokeWidth={2} className="text-cyan" />
          RX-042
        </span>
        {/* operator */}
        <span className="hidden md:flex items-center gap-1.5 border border-line rounded-[4px] px-2 py-0.5 text-[10px] text-muted font-medium">
          OPERATOR
        </span>
        {/* prototype badge */}
        <StatusChip variant="warning" label="PROTOTYPE · SIM" />
      </div>
    </header>
  )
}

export default function App() {
  const [state] = useMission()

  return (
    <div className="min-h-screen bg-bg text-rx-text font-sans flex flex-col">
      <MissionHeader phase={state.missionPhase} />

      <main
        className="flex-1 max-w-[1600px] w-full mx-auto px-3 md:px-5 py-4 grid gap-4"
        style={{ gridTemplateColumns: 'minmax(0,1.65fr) minmax(280px,0.85fr)' }}
      >
        {/* ── LEFT COLUMN ── */}
        <div className="flex flex-col gap-4 min-w-0">

          {/* 01 / 3D Viewport */}
          <section className="bg-panel border border-line rounded-[12px] overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 border-b border-line">
              <div>
                <div className="text-[9px] text-muted tracking-[1.4px] uppercase mb-0.5">LIVE SIMULATION / SECTOR 04</div>
                <h2 className="text-[11px] font-semibold tracking-[1.4px] uppercase">01 / Live Environment Simulation</h2>
              </div>
              <StatusChip
                variant={state.robot.bodyMode === 'COMPACT' ? 'info' : 'warning'}
                label={`${state.robot.bodyMode} MODE`}
              />
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

          {/* fault / e-stop banner */}
          <FaultBanner state={state} />

          {/* 03 / Sensors */}
          <SensorPanel state={state} />

          {/* 04 / AI Intel */}
          <AIIntelPanel state={state} />

          {/* 05 Map + 06 Log */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TacticalMap state={state} />
            <EventLog state={state} />
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="flex flex-col gap-4 min-w-0">
          <TelemetryPanel state={state} />
          <ControlPanel state={state} />
        </div>
      </main>

      {/* prototype disclaimer footer */}
      <footer className="max-w-[1600px] w-full mx-auto px-4 md:px-6 pb-6 pt-2">
        <p className="text-[10px] text-muted border-t border-line pt-3 leading-relaxed">
          RUBBLE-X is a concept-stage software prototype. Robot movement, body-mode switching, telemetry and sensor
          detections are entirely simulated and not connected to physical hardware. Confidence values are illustrative
          and not validated probabilities. Do not use this simulation to make real-world rescue decisions.
        </p>
      </footer>

      {/* Human-in-the-loop approval modal */}
      <ConfirmationModal state={state} />
    </div>
  )
}
