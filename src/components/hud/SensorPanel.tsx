import { Eye, Thermometer, AudioWaveform, Cloud, Radio } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { MissionState, SensorReading } from '../../types/rubblex'
import { StatusChip, PanelHeader, C } from './ds'

interface Props { state: MissionState }

// Map each sensor to a Lucide icon
const SENSOR_ICONS: Record<string, LucideIcon> = {
  OPTICAL:     Eye,
  THERMAL:     Thermometer,
  ACOUSTIC:    AudioWaveform,
  'CO₂':       Cloud,
  INSTABILITY: Radio,
  LIDAR:       Radio,
}

function statusVariant(s: SensorReading['status']): 'nominal' | 'warning' | 'critical' | 'simulated' | 'active' | 'default' {
  if (s === 'SIGNAL' || s === 'PATTERN') return 'warning'
  if (s === 'WARNING')  return 'warning'
  if (s === 'ERROR')    return 'critical'
  if (s === 'ACTIVE')   return 'active'
  return 'default'
}

function readingColor(s: SensorReading['status']): string {
  if (s === 'SIGNAL' || s === 'PATTERN') return C.amber
  if (s === 'WARNING' || s === 'ERROR')  return C.red
  if (s === 'ACTIVE')                    return C.cyan
  return C.muted
}

function SensorCard({ reading }: { reading: SensorReading }) {
  const color = readingColor(reading.status)
  const val   = typeof reading.value === 'number'
    ? `${reading.value}`
    : String(reading.value)
  const Icon = SENSOR_ICONS[reading.label] ?? Eye

  return (
    <div className="bg-panel2 border border-line rounded-[8px] p-2.5 flex flex-col gap-1.5">
      {/* header row */}
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5">
          <Icon size={12} strokeWidth={2} style={{ color }} />
          <span className="text-[11px] font-semibold text-rx-text">{reading.label}</span>
        </div>
        <StatusChip variant="simulated" label="SIM" />
      </div>

      {/* value */}
      <div className="flex items-baseline gap-1">
        <strong className="text-[20px] font-bold tabular leading-none" style={{ color }}>{val}</strong>
        {typeof reading.value === 'number' && (
          <span className="text-[10px] text-muted">{reading.unit}</span>
        )}
      </div>

      {/* status chip */}
      <StatusChip variant={statusVariant(reading.status)} label={reading.status} size="sm" />
    </div>
  )
}

export default function SensorPanel({ state }: Props) {
  const { sensors } = state
  // 5-sensor strip per spec (drop instability, keep the main five)
  const five = [
    sensors.optical,
    sensors.thermal,
    sensors.acoustic,
    sensors.co2,
    sensors.lidar,
  ]

  return (
    <section className="bg-panel border border-line rounded-[12px] overflow-hidden">
      <PanelHeader
        section="03"
        title="Sensor Intelligence"
        right={<StatusChip variant="simulated" label="SIMULATED INPUTS" />}
      />
      {/* 5-card responsive strip */}
      <div className="grid grid-cols-5 gap-2 p-3 min-[500px]:grid-cols-5">
        {five.map(r => <SensorCard key={r.label} reading={r} />)}
      </div>
      {/* instability as a secondary row */}
      <div className="px-3 pb-3">
        <div className="bg-panel2 border border-line rounded-[8px] px-3 py-2 flex items-center gap-3">
          <span className="text-[10px] text-muted uppercase tracking-widest">Structural Instability</span>
          <strong className="tabular text-[14px] font-bold" style={{
            color: Number(sensors.instability.value) > 5 ? C.red : C.muted,
          }}>
            {sensors.instability.value} <span className="text-[10px] font-normal text-muted">{sensors.instability.unit}</span>
          </strong>
          <StatusChip
            variant={sensors.instability.status === 'WARNING' ? 'warning' : 'default'}
            label={sensors.instability.status}
          />
          <StatusChip variant="simulated" label="SIM" />
        </div>
      </div>
    </section>
  )
}
