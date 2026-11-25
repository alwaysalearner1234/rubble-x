import { Info, AlertTriangle, OctagonAlert, CheckCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { MissionState, MissionEvent } from '../../types/rubblex'
import { StatusChip, PanelHeader } from './ds'

interface Props { state: MissionState }

type ChipVariant = 'nominal' | 'warning' | 'critical' | 'info' | 'default'

function levelChip(level: MissionEvent['level']): { variant: ChipVariant; Icon: LucideIcon; label: string } {
  if (level === 'danger')  return { variant: 'critical', Icon: OctagonAlert, label: 'CRITICAL' }
  if (level === 'warn')    return { variant: 'warning',  Icon: AlertTriangle, label: 'WARNING'  }
  if (level === 'success') return { variant: 'nominal',  Icon: CheckCircle,   label: 'OK'       }
  return                          { variant: 'info',     Icon: Info,          label: 'INFO'     }
}

function fmtTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export default function EventLog({ state }: Props) {
  return (
    <section className="bg-panel border border-line rounded-[12px] overflow-hidden flex flex-col">
      <PanelHeader
        section="06"
        title="Mission Event Log"
        right={<span className="text-[10px] text-muted">LOCAL SESSION</span>}
      />
      <div className="overflow-y-auto max-h-56 flex-1">
        {state.events.map(ev => {
          const { variant, Icon, label } = levelChip(ev.level)
          return (
            <div key={ev.id} className="flex items-start gap-2 px-3 py-2 border-b border-line/60 hover:bg-panel2/50 transition-colors">
              <time className="font-mono text-[10px] text-muted shrink-0 mt-0.5 tabular">{fmtTime(ev.timestamp)}</time>
              <StatusChip variant={variant} Icon={Icon} label={label} />
              <span className="text-[11px] text-rx-text flex-1 leading-snug">{ev.message}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
