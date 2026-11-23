import type { MissionState, MissionEvent } from '../../types/rubblex'

interface Props { state: MissionState }

function levelColor(level: MissionEvent['level']) {
  if (level === 'danger')  return '#ff5e62'
  if (level === 'warn')    return '#ff9d42'
  if (level === 'success') return '#53d69a'
  return '#91a2b3'
}

function fmtTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export default function EventLog({ state }: Props) {
  return (
    <section className="bg-panel border border-line rounded-xl overflow-hidden flex flex-col">
      <div className="flex justify-between items-center px-4 py-3 border-b border-line shrink-0">
        <h2 className="text-[11px] font-semibold tracking-[1.4px] uppercase">06 / Mission Event Log</h2>
        <span className="text-[10px] text-muted">LOCAL SESSION</span>
      </div>
      <div className="overflow-y-auto max-h-52 px-3 py-2 space-y-0 flex-1">
        {state.events.map(ev => (
          <div key={ev.id} className="py-1.5 border-b border-[#22313e] text-[11px]">
            <time className="text-[#6f8497] mr-2 text-[10px]">{fmtTime(ev.timestamp)}</time>
            <span style={{ color: levelColor(ev.level) }} className="font-semibold">{ev.message}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
