import { lazy, Suspense, useState } from 'react'
import { Bot, Radio, Zap, FileText } from 'lucide-react'
import { useMission } from './simulation/useMission'
import TelemetryPanel from './components/hud/TelemetryPanel'
import SensorPanel from './components/hud/SensorPanel'
import AIIntelPanel from './components/hud/AIIntelPanel'
import TacticalMap from './components/hud/TacticalMap'
import EventLog from './components/hud/EventLog'
import ControlPanel from './components/hud/ControlPanel'
import ConfirmationModal from './components/hud/ConfirmationModal'
import FaultBanner from './components/hud/FaultBanner'
import ModuleBaySelector from './components/hud/ModuleBaySelector'
import MedicalReachbackPanel from './components/hud/MedicalReachbackPanel'
import MissionReportModal from './components/hud/MissionReportModal'
import { StatusChip } from './components/hud/ds'
import { store } from './simulation/missionStore'

const RescueViewport3D = lazy(() => import('./components/simulation/RescueViewport3D'))

// ── View filter types ────────────────────────────────────────
type ViewFilter =
  | 'all'
  | 'mission-control'
  | 'robot-transform'
  | 'sensors-detection'
  | 'rescue-medical'
  | 'mission-report'

const VIEW_LABELS: Record<ViewFilter, string> = {
  'all':              'All Command',
  'mission-control':  'Mission Control',
  'robot-transform':  'Robot & Transform',
  'sensors-detection':'Sensors & Detection',
  'rescue-medical':   'Rescue & Medical',
  'mission-report':   'Mission Report',
}

// ── Header ───────────────────────────────────────────────────
function MissionHeader({
  phase, onReport,
}: {
  phase: string
  onReport: () => void
}) {
  const isFault   = phase === 'FAULT'
  const isStopped = phase === 'STOPPED'
  const isNominal = !isFault && !isStopped
  const statusVariant = isFault || isStopped ? 'critical' as const : 'nominal' as const
  const StatusIcon = isFault || isStopped ? Zap : Radio
  const statusLabel = isFault ? 'FAULT ACTIVE' : isStopped ? 'E-STOP' : 'SIMULATION ONLINE'

  return (
    <header className="h-16 border-b border-line bg-panel sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="RUBBLE-X logo" className="w-9 h-9 rounded-[8px] object-contain shrink-0" />
        <div>
          <strong className="tracking-[2.5px] text-[14px] text-rx-text font-bold">RUBBLE-X</strong>
          <small className="block text-muted text-[9px] tracking-[1.6px] uppercase font-medium">Rescue Command System</small>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <StatusChip variant={statusVariant} Icon={StatusIcon} label={statusLabel} pulse={isNominal} />
        <span className="hidden sm:flex items-center gap-1.5 border border-line rounded-[4px] px-2 py-0.5 text-[10px] text-muted font-medium">
          <Bot size={11} strokeWidth={2} className="text-cyan" /> RX-042
        </span>
        <span className="hidden md:flex items-center gap-1.5 border border-line rounded-[4px] px-2 py-0.5 text-[10px] text-muted font-medium">
          OPERATOR
        </span>
        {/* report button */}
        <button
          onClick={onReport}
          className="hidden sm:inline-flex items-center gap-1.5 border border-line rounded-[4px] px-2 py-0.5 text-[10px] text-muted font-medium hover:border-cyan hover:text-rx-text transition-colors"
        >
          <FileText size={11} strokeWidth={2} className="text-cyan" /> Report
        </button>
        <StatusChip variant="warning" label="PROTOTYPE · SIM" />
      </div>
    </header>
  )
}

// ── View filter nav ──────────────────────────────────────────
function ViewNav({
  active, onChange,
}: {
  active: ViewFilter
  onChange: (v: ViewFilter) => void
}) {
  const views = Object.keys(VIEW_LABELS) as ViewFilter[]
  return (
    <div className="max-w-[1600px] w-full mx-auto px-3 md:px-5 pt-3 pb-0">
      <div className="flex gap-1.5 flex-wrap">
        {views.map(v => (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={`text-[11px] font-semibold px-3 py-1.5 rounded-[4px] border transition-colors ${
              active === v
                ? 'border-cyan/40 bg-cyan/10 text-cyan'
                : 'border-line bg-panel2 text-muted hover:border-line/80 hover:text-rx-text'
            }`}
          >
            {VIEW_LABELS[v]}
          </button>
        ))}
      </div>
      {/* scope guardrails */}
      <div className="mt-2 flex gap-2 flex-wrap">
        <span className="text-[9px] text-muted border border-line/50 rounded-[4px] px-2 py-0.5">
          ⚠ Simulated prototype
        </span>
        <span className="text-[9px] text-muted border border-line/50 rounded-[4px] px-2 py-0.5">
          Loose non-structural debris only
        </span>
        <span className="text-[9px] text-muted border border-line/50 rounded-[4px] px-2 py-0.5">
          First-aid reachback only — no surgery
        </span>
      </div>
    </div>
  )
}

// ── Visibility helpers ───────────────────────────────────────
function show(view: ViewFilter, panels: ViewFilter[]): boolean {
  return view === 'all' || panels.includes(view)
}

// ── Root ─────────────────────────────────────────────────────
export default function App() {
  const [state] = useMission()
  const [activeView, setActiveView] = useState<ViewFilter>('all')
  const [showReport, setShowReport] = useState(false)

  const report = showReport ? store.generateReport() : null

  return (
    <div className="min-h-screen bg-bg text-rx-text font-sans flex flex-col">
      <MissionHeader phase={state.missionPhase} onReport={() => setShowReport(true)} />

      <ViewNav active={activeView} onChange={setActiveView} />

      <main
        className="flex-1 max-w-[1600px] w-full mx-auto px-3 md:px-5 py-4 grid gap-4"
        style={{ gridTemplateColumns: 'minmax(0,1.65fr) minmax(280px,0.85fr)' }}
      >
        {/* ── LEFT COLUMN ── */}
        <div className="flex flex-col gap-4 min-w-0">

          {/* 01 / 3D Viewport — Mission Control + All */}
          {show(activeView, ['mission-control', 'robot-transform']) && (
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
          )}

          {/* fault banner — always visible */}
          <FaultBanner state={state} />

          {/* 03 / Sensors */}
          {show(activeView, ['sensors-detection', 'mission-control']) && (
            <SensorPanel state={state} />
          )}

          {/* 04 / AI Intel */}
          {show(activeView, ['sensors-detection', 'rescue-medical']) && (
            <AIIntelPanel state={state} />
          )}

          {/* 05 / Medical Reachback */}
          {show(activeView, ['rescue-medical']) && (
            <MedicalReachbackPanel state={state} />
          )}

          {/* Map + Log */}
          {show(activeView, ['mission-control', 'sensors-detection', 'rescue-medical']) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TacticalMap state={state} />
              <EventLog state={state} />
            </div>
          )}

          {/* Mission Report placeholder tab */}
          {activeView === 'mission-report' && (
            <section className="bg-panel border border-line rounded-[12px] overflow-hidden">
              <div className="flex justify-between items-center px-4 py-3 border-b border-line">
                <h2 className="text-[11px] font-semibold tracking-[1.4px] uppercase">06 / Mission Report</h2>
                <StatusChip variant="simulated" label="SIMULATED DATA" />
              </div>
              <div className="p-4 flex flex-col items-center gap-4">
                <FileText size={36} strokeWidth={1} className="text-muted opacity-40" />
                <p className="text-muted text-[12px] text-center max-w-xs">
                  Generate a structured end-to-end mission summary including deployment, transformation, survivor signals, medical reachback, and human approval audit log.
                </p>
                <button
                  onClick={() => setShowReport(true)}
                  className="inline-flex items-center gap-2 border border-amber bg-amber text-[#1b1208] rounded-[8px] px-4 py-2.5 text-[12px] font-bold hover:opacity-90 transition-opacity"
                >
                  <FileText size={14} strokeWidth={2} />
                  Generate Mission Report
                </button>
              </div>
            </section>
          )}
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="flex flex-col gap-4 min-w-0">
          {show(activeView, ['mission-control', 'robot-transform']) && (
            <TelemetryPanel state={state} />
          )}
          {show(activeView, ['mission-control', 'robot-transform']) && (
            <ControlPanel state={state} />
          )}
          {show(activeView, ['robot-transform', 'rescue-medical']) && (
            <ModuleBaySelector state={state} />
          )}
          {show(activeView, ['rescue-medical']) && (
            /* right column echo of medical panel for the rescue-medical view */
            <section className="bg-panel border border-line rounded-[12px] p-3">
              <p className="text-[10px] text-muted text-center">Medical reachback visible in left column.</p>
            </section>
          )}
          {/* always show event log in right column when sensor/robot views */}
          {show(activeView, ['robot-transform', 'sensors-detection']) && (
            <EventLog state={state} />
          )}
        </div>
      </main>

      {/* prototype disclaimer */}
      <footer className="max-w-[1600px] w-full mx-auto px-4 md:px-6 pb-6 pt-2">
        <p className="text-[10px] text-muted border-t border-line pt-3 leading-relaxed">
          RUBBLE-X is a concept-stage software prototype. Robot movement, body-mode switching, telemetry, sensor
          detections, medical assessments and module operations are entirely simulated and not connected to physical
          hardware. Confidence values are illustrative and not validated probabilities. Do not use this simulation
          to make real-world rescue or medical decisions.
        </p>
      </footer>

      {/* overlays */}
      <ConfirmationModal state={state} />
      {report && (
        <MissionReportModal report={report} onClose={() => setShowReport(false)} />
      )}
    </div>
  )
}
