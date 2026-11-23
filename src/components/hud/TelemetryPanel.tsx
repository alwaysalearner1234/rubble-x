import type { MissionState } from '../../types/rubblex'

interface Props { state: MissionState }

function Metric({ label, value, sub }: { label: string; value: string | number; sub: string }) {
  return (
    <div className="bg-panel2 border border-line rounded-lg p-3">
      <span className="block text-muted text-[10px] tracking-widest uppercase">{label}</span>
      <strong className="block text-xl mt-1 leading-none">{value}</strong>
      <small className="text-muted text-[10px]">{sub}</small>
    </div>
  )
}

export default function TelemetryPanel({ state }: Props) {
  const { robot, missionPhase } = state
  const phaseColor = missionPhase === 'STOPPED' || missionPhase === 'FAULT' ? 'text-red' : missionPhase === 'ALERT' ? 'text-orange' : robot.deployed ? 'text-green' : 'text-muted'
  const phaseLabel = robot.fault ? `FAULT: ${robot.fault}` : missionPhase
  return (
    <section className="bg-panel border border-line rounded-xl overflow-hidden">
      <div className="flex justify-between items-center px-4 py-3 border-b border-line">
        <h2 className="text-[11px] font-semibold tracking-[1.4px] uppercase">02 / Robot Telemetry</h2>
        <span className={`text-[10px] border border-line rounded-full px-2 py-0.5 ${phaseColor}`}>
          {phaseLabel}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 p-3">
        <Metric label="Battery"       value={`${Math.round(robot.battery)}%`}               sub="Simulated charge" />
        <Metric label="Link"          value={`${robot.linkQuality}%`}                        sub="Signal quality (sim)" />
        <Metric label="Body Mode"     value={robot.bodyMode}                                 sub="Configuration (sim)" />
        <Metric label="Travel"        value={`${robot.distanceTravelled.toFixed(1)} m`}      sub="Est. distance (sim)" />
        <Metric label="Position X"    value={robot.position.x.toFixed(1)}                   sub="World units" />
        <Metric label="Position Z"    value={robot.position.z.toFixed(1)}                   sub="World units" />
      </div>
      <div className="px-3 pb-3">
        <div className="bg-panel2 border border-line rounded-lg px-3 py-2 text-[10px] text-muted">
          <span className="text-[9px] tracking-widest text-muted uppercase">Explored cells — </span>
          <span className="text-rx-text">{robot.exploredCells.size}</span>
          <span className="ml-4 text-[9px] tracking-widest text-muted uppercase">Progress — </span>
          <span className="text-cyan">{state.missionProgress}%</span>
        </div>
      </div>
    </section>
  )
}
