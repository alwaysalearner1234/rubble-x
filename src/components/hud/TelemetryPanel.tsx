import { Bot, Zap, Radio, Move, Minimize2, Maximize2 } from 'lucide-react'
import type { MissionState } from '../../types/rubblex'
import { StatusChip, PanelHeader, ProgressBar } from './ds'

interface Props { state: MissionState }

function TelemetryCard({
  label, value, unit, sub, progress,
}: {
  label: string; value: string; unit?: string; sub: string; progress?: number
}) {
  return (
    <div className="bg-panel2 border border-line rounded-[8px] p-3 flex flex-col gap-1">
      <span className="text-[10px] text-muted tracking-[1.2px] uppercase font-medium">{label}</span>
      <div className="flex items-baseline gap-1">
        <strong className="text-[22px] font-bold tabular leading-none text-rx-text">{value}</strong>
        {unit && <span className="text-[11px] text-muted">{unit}</span>}
      </div>
      <span className="text-[10px] text-muted">{sub}</span>
      {progress !== undefined && <ProgressBar value={progress} />}
    </div>
  )
}

export default function TelemetryPanel({ state }: Props) {
  const { robot, missionPhase } = state

  const statusVariant =
    missionPhase === 'STOPPED' || missionPhase === 'FAULT' ? 'critical' as const
    : missionPhase === 'ALERT' ? 'warning' as const
    : robot.deployed ? 'nominal' as const
    : 'default' as const

  const StatusIcon =
    missionPhase === 'STOPPED' || missionPhase === 'FAULT' ? Zap
    : robot.deployed ? Bot
    : Radio

  const phaseLabel =
    robot.fault ? robot.fault.replace('_', ' ')
    : missionPhase === 'STOPPED' ? 'E-STOP'
    : missionPhase

  const ModeIcon = robot.bodyMode === 'COMPACT' ? Minimize2 : Maximize2

  return (
    <section className="bg-panel border border-line rounded-[12px] overflow-hidden">
      <PanelHeader
        section="02"
        title="Robot Telemetry"
        right={
          <StatusChip
            variant={statusVariant}
            Icon={StatusIcon}
            label={phaseLabel}
            pulse={robot.deployed && !robot.stopped && !robot.fault}
          />
        }
      />

      <div className="grid grid-cols-2 gap-2 p-3">
        <TelemetryCard
          label="Battery"
          value={`${Math.round(robot.battery)}`}
          unit="%"
          sub="Simulated charge"
          progress={robot.battery}
        />
        <TelemetryCard
          label="Comms Link"
          value={`${robot.linkQuality}`}
          unit="%"
          sub="Signal quality · SIM"
          progress={robot.linkQuality}
        />
        <TelemetryCard
          label="Travel Distance"
          value={robot.distanceTravelled.toFixed(1)}
          unit="m"
          sub="Estimated · SIM"
        />
        <TelemetryCard
          label="Explored"
          value={`${state.missionProgress}`}
          unit="%"
          sub={`${robot.exploredCells.size} cells`}
          progress={state.missionProgress}
        />
        <TelemetryCard
          label="Position X"
          value={robot.position.x.toFixed(1)}
          unit="wu"
          sub="World units"
        />
        <TelemetryCard
          label="Position Z"
          value={robot.position.z.toFixed(1)}
          unit="wu"
          sub="World units"
        />
      </div>

      {/* body mode chip */}
      <div className="px-3 pb-3 flex items-center gap-2">
        <ModeIcon size={14} strokeWidth={2} className={robot.bodyMode === 'COMPACT' ? 'text-cyan' : 'text-amber'} />
        <span className="text-[10px] text-muted uppercase tracking-widest">Body Mode</span>
        <StatusChip
          variant={robot.bodyMode === 'COMPACT' ? 'info' : 'warning'}
          label={robot.bodyMode}
        />
        <span className="ml-auto text-[9px] text-muted">SIM</span>
      </div>
    </section>
  )
}
