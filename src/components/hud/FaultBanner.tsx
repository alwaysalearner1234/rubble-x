import { OctagonAlert, Zap, WifiOff, Hand } from 'lucide-react'
import type { MissionState } from '../../types/rubblex'
import { store } from '../../simulation/missionStore'
import { StatusChip } from './ds'

interface Props { state: MissionState }

export default function FaultBanner({ state }: Props) {
  const { robot, missionPhase } = state
  if (!robot.stopped && !robot.fault && missionPhase !== 'STOPPED') return null

  const isFault = robot.fault !== null
  const Icon = isFault
    ? robot.fault === 'COMMS_LOSS' ? WifiOff : Zap
    : OctagonAlert

  const label = isFault
    ? `FAULT: ${robot.fault?.replace('_', ' ')} — movement disabled`
    : 'EMERGENCY STOP ENGAGED — movement and scanning disabled'

  const cls = isFault
    ? 'border-amber/50 bg-amber/5 text-amber'
    : 'border-red/50 bg-red/5 text-red'

  return (
    <div className={`border rounded-[8px] px-4 py-2.5 flex items-center justify-between gap-3 ${cls}`}>
      <div className="flex items-center gap-2">
        <Icon size={16} strokeWidth={2} className="shrink-0" />
        <span className="text-[12px] font-semibold">{label}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {isFault
          ? <StatusChip variant="warning" Icon={Zap} label="FAULT" />
          : <StatusChip variant="critical" Icon={OctagonAlert} label="E-STOP" />
        }
        <button
          className="inline-flex items-center gap-1.5 border border-current rounded-[4px] px-2.5 py-1 text-[11px] font-semibold hover:opacity-80 transition-opacity"
          onClick={() => store.releaseStop()}
        >
          <Hand size={12} strokeWidth={2} />
          Release
        </button>
      </div>
    </div>
  )
}
