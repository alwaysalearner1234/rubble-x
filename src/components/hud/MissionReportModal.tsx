/**
 * RUBBLE-X — Mission Report Modal / Drawer
 * Compiles a structured end-to-end mission summary from live state.
 * Report data is SIMULATED.
 */
import { useState } from 'react'
import { FileText, X, Copy, Download, CheckCircle, ClipboardList } from 'lucide-react'
import type { MissionReport } from '../../types/rubblex'
import { StatusChip } from './ds'

interface Props {
  report: MissionReport
  onClose: () => void
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-line rounded-[8px] overflow-hidden">
      <div className="bg-panel2 px-3 py-2 border-b border-line">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted">{title}</span>
      </div>
      <div className="px-3 py-2 space-y-1">{children}</div>
    </div>
  )
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between items-baseline py-0.5">
      <span className="text-[11px] text-muted">{label}</span>
      <span
        className="text-[11px] font-semibold tabular"
        style={{ color: accent ? '#F59E0B' : '#F8FAFC' }}
      >
        {value}
      </span>
    </div>
  )
}

function fmtTs(ts: number | null) {
  if (!ts) return '—'
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function fmtDuration(sec: number) {
  const m = Math.floor(sec / 60), s = sec % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

export default function MissionReportModal({ report, onClose }: Props) {
  const [copied, setCopied] = useState(false)

  const json = JSON.stringify(report, null, 2)

  function handleCopy() {
    navigator.clipboard.writeText(json).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function handleDownload() {
    const blob = new Blob([json], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `rubble-x-report-${report.missionId}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const sv = report.survivorSignals[0]

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-4 pb-4"
      style={{ background: 'rgba(5,10,16,0.88)', backdropFilter: 'blur(4px)', overflowY: 'auto' }}
    >
      <div
        className="bg-panel rounded-[12px] w-full max-w-2xl mx-4 overflow-hidden flex flex-col"
        style={{ border: '1px solid #263342', maxHeight: 'calc(100vh - 32px)' }}
      >
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-line shrink-0">
          <div className="flex items-center gap-3">
            <FileText size={18} strokeWidth={2} className="text-cyan" />
            <div>
              <h2 className="text-[14px] font-bold text-rx-text tracking-wide">Mission Report</h2>
              <p className="text-[10px] text-muted">Mission {report.missionId} · Generated {fmtTs(report.generatedAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusChip variant="simulated" label="SIMULATED DATA" />
            <button
              onClick={onClose}
              className="p-1.5 rounded-[4px] text-muted hover:text-rx-text hover:bg-panel2 transition-colors"
            >
              <X size={16} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* scrollable body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* disclaimer */}
          <div className="bg-amber/5 border border-amber/20 rounded-[8px] px-3 py-2 text-[10px] text-amber">
            {report.disclaimer}
          </div>

          {/* deployment */}
          <Section title="Deployment Summary">
            <Row label="Mission ID"            value={report.missionId} />
            <Row label="Deployment started"    value={fmtTs(report.deploymentStartedAt)} />
            <Row label="Duration"              value={fmtDuration(report.deploymentDurationSec)} />
            <Row label="Distance travelled"    value={`${report.distanceTravelledM} m`} />
            <Row label="Cells explored"        value={`${report.cellsExplored}`} />
            <Row label="Area coverage"         value={`${report.missionProgress}%`} accent />
          </Section>

          {/* transformation & docking */}
          <Section title="Transformation & Docking Events">
            {report.transformationEvents.length === 0 && report.dockingEvents.length === 0 && (
              <p className="text-[11px] text-muted py-1">No events recorded.</p>
            )}
            {[...report.transformationEvents, ...report.dockingEvents]
              .sort()
              .map((e, i) => (
                <div key={i} className="text-[11px] text-muted font-mono py-0.5">{e}</div>
              ))
            }
          </Section>

          {/* survivor signals */}
          <Section title="Survivor Signals">
            {sv ? (
              <>
                <Row label="Signal ID"          value={sv.id} />
                <Row label="Simulated confidence" value={`${Math.round(sv.confidence * 100)}%`} accent />
                <Row label="Position (X/Y/Z)"   value={sv.position.map(n => n.toFixed(1)).join(' / ')} />
                <Row label="Thermal evidence"   value={sv.thermalEvidence ? 'YES (SIM)' : 'NO'} />
                <Row label="Acoustic evidence"  value={sv.acousticEvidence ? 'YES (SIM)' : 'NO'} />
                <Row label="Operator confirmed" value={sv.confirmedByOperator ? 'YES' : 'NOT YET'} />
              </>
            ) : (
              <p className="text-[11px] text-muted py-1">No survivor signals detected this mission.</p>
            )}
          </Section>

          {/* medical reachback */}
          <Section title="Medical Reachback">
            <Row label="Doctor relay used"      value={report.medicalReachback.doctorRelayUsed ? 'YES' : 'NO'} />
            <Row label="Supplies delivered"     value={report.medicalReachback.suppliesDelivered ? 'YES (SIM)' : 'NO'} />
          </Section>

          {/* debris */}
          <Section title="Debris Interventions">
            <Row label="Loose debris interventions (HitL approved)" value={`${report.debrisInterventions}`} />
          </Section>

          {/* approval audit log */}
          <Section title="Human Approval Audit Log">
            {report.approvalAuditLog.length === 0 && (
              <p className="text-[11px] text-muted py-1">No approval actions recorded.</p>
            )}
            {report.approvalAuditLog.map(r => (
              <div key={r.id} className="border border-line/50 rounded-[4px] px-2 py-1.5 space-y-0.5">
                <div className="flex items-center gap-2">
                  <ClipboardList size={11} strokeWidth={2} className="text-muted shrink-0" />
                  <span className="text-[11px] text-rx-text">{r.action}</span>
                  <StatusChip variant={r.approved ? 'nominal' : 'critical'} label={r.approved ? 'APPROVED' : 'REJECTED'} />
                </div>
                <div className="text-[10px] text-muted font-mono">{fmtTs(r.timestamp)} — {r.operatorNote}</div>
              </div>
            ))}
          </Section>
        </div>

        {/* footer actions */}
        <div className="shrink-0 px-5 py-4 border-t border-line flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 inline-flex items-center justify-center gap-2 border border-line bg-panel2 text-muted rounded-[8px] px-4 py-2.5 text-[12px] font-semibold hover:border-cyan hover:text-rx-text transition-colors"
          >
            {copied ? <CheckCircle size={14} strokeWidth={2} /> : <Copy size={14} strokeWidth={2} />}
            {copied ? 'Copied!' : 'Copy JSON'}
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 inline-flex items-center justify-center gap-2 border border-amber bg-amber text-[#1b1208] rounded-[8px] px-4 py-2.5 text-[12px] font-bold hover:opacity-90 transition-opacity"
          >
            <Download size={14} strokeWidth={2} />
            Download JSON
          </button>
        </div>
      </div>
    </div>
  )
}
