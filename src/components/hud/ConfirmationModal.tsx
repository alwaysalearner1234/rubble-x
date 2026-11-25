import type { MissionState } from '../../types/rubblex'
import { store } from '../../simulation/missionStore'

interface Props { state: MissionState }

export default function ConfirmationModal({ state }: Props) {
  const { debrisRequest } = state
  if (!debrisRequest.pending) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(5,10,16,0.82)', backdropFilter: 'blur(3px)' }}
    >
      <div className="bg-panel border-2 border-amber rounded-2xl max-w-md w-full mx-4 shadow-2xl"
           style={{ boxShadow: '0 0 40px rgba(245,158,11,0.18)' }}>
        <div className="px-5 py-4 border-b border-line">
          <div className="flex items-center gap-2">
            <span className="text-amber text-lg">⚠</span>
            <h3 className="text-amber font-bold tracking-widest text-sm uppercase">
              Human-in-the-Loop Confirmation Required
            </h3>
          </div>
          <p className="text-muted text-[10px] mt-1 tracking-widest uppercase">Operator approval required before proceeding</p>
        </div>
        <div className="px-5 py-4 space-y-3">
          <p className="text-rx-text text-[13px]">{debrisRequest.description}</p>
          <div className="bg-panel2 border border-line rounded-lg p-3 text-[11px] text-muted">
            <strong className="text-amber block mb-1">Operator Action Required</strong>
            Debris manipulation must be approved by a qualified rescue professional before execution.
            This simulation does not validate physical access, structural stability, or safety.
          </div>
          <div className="bg-[#1a0d00] border border-amber/30 rounded-lg p-3 text-[11px] text-[#c7b7a4]">
            Principle 1: Human operators remain in control of all consequential actions.
          </div>
        </div>
        <div className="px-5 py-4 border-t border-line flex gap-3">
          <button
            className="flex-1 border border-red/50 bg-[#3a1d24] text-[#ffb4b5] rounded-lg px-4 py-2.5 text-[12px] font-semibold hover:border-red transition-colors"
            onClick={() => store.confirmDebrisAction(false)}
          >
            ✕ Deny / Cancel
          </button>
          <button
            className="flex-1 border border-amber bg-amber text-[#1b1208] rounded-lg px-4 py-2.5 text-[12px] font-semibold hover:opacity-90 transition-opacity"
            onClick={() => store.confirmDebrisAction(true)}
          >
            ✓ Confirm Action
          </button>
        </div>
      </div>
    </div>
  )
}
