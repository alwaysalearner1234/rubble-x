/**
 * RUBBLE-X — Medical Reachback Panel (05)
 * Unlocked when a survivor signature is detected.
 * All data is SIMULATED — not a medical diagnosis.
 */
import {
  Stethoscope, Radio, Package, Thermometer, Heart,
  AlertTriangle, Video, User,
} from 'lucide-react'
import type { MissionState } from '../../types/rubblex'
import { store } from '../../simulation/missionStore'
import { StatusChip, PanelHeader, Btn } from './ds'

interface Props { state: MissionState }

function AssessmentRow({ icon: Icon, label, value }: {
  icon: typeof Thermometer; label: string; value: string
}) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-line/50 last:border-0">
      <div className="flex items-center gap-2 text-[11px] text-muted">
        <Icon size={12} strokeWidth={2} />
        {label}
      </div>
      <span className="text-[11px] text-rx-text font-medium tabular">{value}</span>
    </div>
  )
}

export default function MedicalReachbackPanel({ state }: Props) {
  const { medicalReachback, moduleBay, survivors } = state
  const mr = medicalReachback
  const hasMedialPod = moduleBay.docked === 'MEDICAL_POD'
  const survivorConfidence = survivors[0]?.confidence ?? 0
  const pct = Math.round(survivorConfidence * 100)

  if (!mr.unlocked) {
    return (
      <section className="bg-panel border border-line rounded-[12px] overflow-hidden">
        <PanelHeader
          section="05"
          title="Medical Reachback"
          right={<StatusChip variant="default" label="LOCKED" />}
        />
        <div className="p-4 flex flex-col items-center gap-3 text-center">
          <User size={32} strokeWidth={1} className="text-muted opacity-30" />
          <p className="text-muted text-[11px]">Medical reachback unlocks after a survivor signature is detected via sensor scan.</p>
          <StatusChip variant="simulated" label="SIMULATED · NOT A MEDICAL SYSTEM" size="md" />
        </div>
      </section>
    )
  }

  return (
    <section className="bg-panel border border-line rounded-[12px] overflow-hidden">
      <PanelHeader
        section="05"
        title="Medical Reachback"
        right={
          <div className="flex items-center gap-2">
            <StatusChip variant="simulated" label="SIM" />
            <StatusChip variant="warning" Icon={User} label="SURVIVOR LOCATED" pulse />
          </div>
        }
      />

      <div className="p-3 space-y-3">
        {/* disclaimer */}
        <div className="bg-red/5 border border-red/20 rounded-[8px] px-3 py-2 text-[10px] text-red flex items-start gap-2">
          <AlertTriangle size={12} strokeWidth={2} className="shrink-0 mt-0.5" />
          <span>
            <strong>Simulated Telemetry — Not a Medical Diagnosis.</strong> All patient indicators are mock data
            generated for demonstration only. No real patient data is captured or transmitted.
          </span>
        </div>

        {/* patient assessment */}
        <div className="bg-panel2 border border-line rounded-[8px] p-3">
          <div className="flex items-center gap-2 mb-2">
            <Stethoscope size={13} strokeWidth={2} className="text-cyan" />
            <span className="text-[11px] font-semibold text-rx-text uppercase tracking-wide">Visual Patient Assessment</span>
            <StatusChip variant="simulated" label="SIM" />
          </div>
          {mr.patientAssessment.generatedAt ? (
            <>
              <AssessmentRow icon={User}        label="Posture / Movement" value={mr.patientAssessment.postureStatus} />
              <AssessmentRow icon={Heart}       label="Responsiveness"     value={mr.patientAssessment.responsiveness} />
              <AssessmentRow icon={Thermometer} label="Thermal Reading"    value={mr.patientAssessment.thermalReading} />
              <AssessmentRow icon={Heart}       label="Respiratory Rate"   value={mr.patientAssessment.respiratoryRate} />
              {/* confidence callout */}
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] text-muted">Survivor confidence:</span>
                <span
                  className="text-[14px] font-bold tabular"
                  style={{ color: pct > 60 ? '#F59E0B' : '#38BDF8' }}
                >
                  {pct}%
                </span>
                <span className="text-[9px] text-muted">— ILLUSTRATIVE</span>
              </div>
            </>
          ) : (
            <p className="text-[11px] text-muted">Run a scan to generate patient assessment data.</p>
          )}
        </div>

        {/* doctor relay */}
        <div className="bg-panel2 border border-line rounded-[8px] p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Video size={13} strokeWidth={2} className={mr.doctorRelayActive ? 'text-green' : 'text-muted'} />
              <span className="text-[11px] font-semibold text-rx-text uppercase tracking-wide">Remote Medical Professional Link</span>
            </div>
            {mr.doctorRelayActive && (
              <StatusChip variant="nominal" Icon={Radio} label="CONNECTED" pulse />
            )}
          </div>
          <p className="text-[10px] text-muted mb-2">
            Simulated audio/video triage relay to remote medical professional. No real connection established.
          </p>
          <Btn
            variant={mr.doctorRelayActive ? 'warn' : 'primary'}
            onClick={() => store.toggleDoctorRelay()}
            Icon={Radio}
            className="w-full"
          >
            {mr.doctorRelayActive ? 'Disconnect Relay' : 'Connect Doctor Relay'}
          </Btn>
        </div>

        {/* first-aid delivery */}
        <div className="bg-panel2 border border-line rounded-[8px] p-3">
          <div className="flex items-center gap-2 mb-2">
            <Package size={13} strokeWidth={2} className={hasMedialPod ? 'text-amber' : 'text-muted'} />
            <span className="text-[11px] font-semibold text-rx-text uppercase tracking-wide">Deliver First-Aid Supplies</span>
          </div>
          {!hasMedialPod && (
            <p className="text-[10px] text-amber mb-2">Requires MEDICAL POD docked in Module Bay.</p>
          )}
          {mr.suppliesDelivered && (
            <StatusChip variant="nominal" label="SUPPLIES DELIVERED" size="md" />
          )}
          {!mr.suppliesDelivered && (
            <>
              <p className="text-[10px] text-muted mb-2">
                First-aid kit deployment only. Operator approval required. No surgical actions permitted.
              </p>
              <Btn
                variant="primary"
                onClick={() => store.requestSupplyDelivery()}
                disabled={!hasMedialPod || mr.supplyDeliveryRequest.pending}
                Icon={Package}
                className="w-full"
              >
                {mr.supplyDeliveryRequest.pending ? 'Awaiting Approval…' : 'Deliver First-Aid Supplies'}
              </Btn>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
