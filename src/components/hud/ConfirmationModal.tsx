import { AlertTriangle, Hand, User, CheckCircle, XCircle } from 'lucide-react'
import type { MissionState } from '../../types/rubblex'
import { store } from '../../simulation/missionStore'
import { StatusChip } from './ds'

interface Props { state: MissionState }

export default function ConfirmationModal({ state }: Props) {
  const { debrisRequest, medicalReachback, ai } = state
  if (!debrisRequest.pending) return null

  // Route approval to the right store method
  const isSupplyDelivery = medicalReachback.supplyDeliveryRequest.pending
  const handleApprove = () => isSupplyDelivery ? store.confirmSupplyDelivery(true)  : store.confirmDebrisAction(true)
  const handleReject  = () => isSupplyDelivery ? store.confirmSupplyDelivery(false) : store.confirmDebrisAction(false)

  const pct = Math.round(ai.survivorConfidence * 100)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(5,10,16,0.88)', backdropFilter: 'blur(4px)' }}
    >
      {/* modal — 1px solid #F59E0B border per Figma spec */}
      <div
        className="bg-panel rounded-[12px] max-w-[480px] w-full mx-4 overflow-hidden"
        style={{
          border: '1px solid #F59E0B',
          boxShadow: '0 0 48px rgba(245,158,11,0.15), 0 24px 48px rgba(0,0,0,0.5)',
        }}
      >
        {/* header */}
        <div className="px-5 py-4 border-b border-line flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={16} strokeWidth={2} className="text-amber shrink-0" />
              <h3 className="text-amber font-bold tracking-[1.6px] text-[13px] uppercase">
                Human-in-the-Loop Confirmation
              </h3>
            </div>
            <p className="text-[10px] text-muted tracking-widest uppercase">Operator approval required before proceeding</p>
          </div>
          <StatusChip variant="warning" Icon={Hand} label="APPROVAL REQUIRED" size="md" />
        </div>

        <div className="px-5 py-4 space-y-3">
          {/* action description */}
          <p className="text-rx-text text-[13px] leading-relaxed">{debrisRequest.description}</p>

          {/* risk warning summary */}
          <div className="bg-panel2 border border-line rounded-[8px] p-3 space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={13} strokeWidth={2} className="text-amber" />
              <strong className="text-amber text-[11px] uppercase tracking-wide">Risk Warning</strong>
            </div>
            <p className="text-[11px] text-muted">
              Debris manipulation must be approved by a qualified rescue professional.
              This simulation does not validate physical access, structural stability, or safety.
            </p>
            <p className="text-[11px] text-muted">
              Principle: Human operators remain in control of all consequential actions.
            </p>
          </div>

          {/* survivor confidence callout */}
          {pct > 0 && (
            <div
              className="rounded-[8px] p-3 flex items-center gap-3"
              style={{ background: '#1e1a0f', border: '1px solid rgba(245,158,11,0.3)' }}
            >
              <User size={20} strokeWidth={1.5} className="text-amber shrink-0" />
              <div>
                <span className="text-[10px] text-muted uppercase tracking-widest block">Simulated survivor confidence</span>
                <span className="text-amber text-[22px] font-bold tabular">{pct}%</span>
                <span className="text-muted text-[10px] ml-1">— ILLUSTRATIVE ONLY</span>
              </div>
            </div>
          )}
        </div>

        {/* actions */}
        <div className="px-5 py-4 border-t border-line flex gap-3">
          {/* secondary Reject */}
          <button
            className="flex-1 inline-flex items-center justify-center gap-2 border border-line bg-panel2 text-muted rounded-[8px] px-4 py-2.5 text-[12px] font-semibold hover:border-red hover:text-red transition-colors"
            onClick={handleReject}
          >
            <XCircle size={14} strokeWidth={2} />
            Reject
          </button>

          {/* solid amber Approve */}
          <button
            className="flex-1 inline-flex items-center justify-center gap-2 border border-amber bg-amber text-[#1b1208] rounded-[8px] px-4 py-2.5 text-[12px] font-bold hover:opacity-90 transition-opacity"
            onClick={handleApprove}
          >
            <CheckCircle size={14} strokeWidth={2} />
            Approve and execute
          </button>
        </div>
      </div>
    </div>
  )
}
