import type { MissionState, SensorReading } from '../../types/rubblex'

interface Props { state: MissionState }

function statusColor(status: SensorReading['status']) {
  if (status === 'SIGNAL' || status === 'PATTERN') return '#ff9d42'
  if (status === 'WARNING') return '#ff5e62'
  if (status === 'ERROR') return '#ff5e62'
  if (status === 'ACTIVE') return '#48d6e8'
  return '#91a2b3'
}

function SensorCard({ reading }: { reading: SensorReading }) {
  const color = statusColor(reading.status)
  const val = typeof reading.value === 'number' ? `${reading.value} ${reading.unit}` : String(reading.value)
  return (
    <div className="bg-panel2 border border-line rounded-lg p-2.5">
      <div className="flex justify-between items-center">
        <span className="text-[11px] font-semibold">{reading.label}</span>
        <span className="text-[9px] border border-line rounded px-1 py-0.5 text-muted">SIM</span>
      </div>
      <span className="text-[10px] text-muted block">{reading.unit}</span>
      <strong className="block mt-1.5 text-base" style={{ color }}>{val}</strong>
      <span className="text-[9px]" style={{ color }}>{reading.status}</span>
    </div>
  )
}

export default function SensorPanel({ state }: Props) {
  const { sensors } = state
  const all = [sensors.optical, sensors.thermal, sensors.acoustic, sensors.co2, sensors.instability, sensors.lidar]
  return (
    <section className="bg-panel border border-line rounded-xl overflow-hidden">
      <div className="flex justify-between items-center px-4 py-3 border-b border-line">
        <h2 className="text-[11px] font-semibold tracking-[1.4px] uppercase">03 / Sensor Intelligence</h2>
        <span className="text-[10px] border border-line rounded-full px-2 py-0.5 text-muted">SIMULATED INPUTS</span>
      </div>
      <div className="grid grid-cols-3 gap-2 p-3">
        {all.map(r => <SensorCard key={r.label} reading={r} />)}
      </div>
    </section>
  )
}
