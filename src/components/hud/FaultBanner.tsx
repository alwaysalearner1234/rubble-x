import type { MissionState } from '../../types/rubblex'
import { store } from '../../simulation/missionStore'

interface Props { state: MissionState }

export default function FaultBanner({ state }: Props) {
  const { robot, missionPhase } = state
  if (!robot.stopped && !robot.fault && missionPhase !== 'STOPPED') return null

  const isFault = robot.fault !== null
  const color = isFault ? 'border-amber/60 bg-[#2a1a00] text-amber' : 'border-red/60 bg-[#3a0a0a] text-red'
  const label = isFault
    ? `⚠ FAULT: ${robot.fault?.replace('_', ' ')} — Movement and scanning disabled.`
    : '⬛ EMERGENCY STOP ENGAGED — Movement and scanning disabled.'

  return (
    <div className={`border rounded-lg px-4 py-2.5 text-[12px] font-semibold flex justify-between items-center gap-3 ${color}`}>
      <span>{label}</span>
      <button
        className="shrink-0 border border-current rounded px-2 py-1 text-[10px] hover:opacity-80 transition-opacity"
        onClick={() => store.releaseStop()}
      >
        Release
      </button>
    </div>
  )
}
