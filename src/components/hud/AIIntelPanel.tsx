import { User, Thermometer, AudioWaveform, Cloud, AlertTriangle } from 'lucide-react'
import type { MissionState } from '../../types/rubblex'
import { StatusChip, PanelHeader, C } from './ds'

interface Props { state: MissionState }

// ── Survivor Confidence Gauge ────────────────────────────────
function ConfidenceGauge({ value }: { value: number }) {
  const pct = Math.round(value * 100)
  // segment count
  const SEGS = 10
  const filled = Math.round((pct / 100) * SEGS)
  const color  = pct > 60 ? C.amber : pct > 30 ? C.cyan : C.green
  const level  = pct > 60 ? 'HIGH' : pct > 30 ? 'MODERATE' : 'LOW'
  const levelVariant = pct > 60 ? 'warning' as const : pct > 30 ? 'info' as const : 'nominal' as const

  return (
    <div className="space-y-2 mt-1">
      {/* large readout */}
      <div className="flex items-end justify-between">
        <div>
          <span className="text-[42px] font-bold tabular leading-none" style={{ color }}>{pct}</span>
          <span className="text-[16px] text-muted ml-1">%</span>
        </div>
        <div className="text-right">
          <StatusChip variant={levelVariant} label={`CONFIDENCE ${level}`} size="md" />
          <p className="text-[9px] text-muted mt-1">SIMULATED · ILLUSTRATIVE ONLY</p>
        </div>
      </div>

      {/* segmented bar */}
      <div className="flex gap-0.5 h-2">
        {Array.from({ length: SEGS }).map((_, i) => (
          <div
            key={i}
            className="flex-1 rounded-[2px] transition-all duration-300"
            style={{
              background: i < filled ? color : '#263342',
              opacity: i < filled ? 1 : 0.4,
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ── Evidence tag ─────────────────────────────────────────────
const TAG_ICONS: Record<string, typeof Thermometer> = {
  'THERMAL-HIT':      Thermometer,
  'ACOUSTIC-PATTERN': AudioWaveform,
  'ELEVATED-CO₂':     Cloud,
  'UNSTABLE-DEBRIS':  AlertTriangle,
}

function EvidenceTag({ tag }: { tag: string }) {
  const Icon = TAG_ICONS[tag] ?? User
  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-cyan border border-cyan/30 bg-cyan/5 rounded-[4px] px-2 py-0.5 font-semibold uppercase">
      <Icon size={10} strokeWidth={2} />
      {tag}
    </span>
  )
}

// ── Main component ───────────────────────────────────────────
export default function AIIntelPanel({ state }: Props) {
  const { ai, survivors } = state
  const hasSurvivor = survivors.length > 0

  return (
    <section className="bg-panel border border-line rounded-[12px] overflow-hidden">
      <PanelHeader
        section="04"
        title="Survivor Intelligence"
        right={
          <StatusChip
            variant={hasSurvivor ? 'warning' : 'default'}
            Icon={User}
            label={hasSurvivor ? 'SIGNAL DETECTED' : 'NO SIGNAL'}
            pulse={hasSurvivor}
          />
        }
      />

      <div className="p-3 space-y-3">
        {/* survivor confidence callout */}
        {hasSurvivor ? (
          <div className="border border-amber/30 bg-[#1e1a0f] rounded-[8px] p-3">
            <div className="flex items-center gap-2 mb-2">
              <User size={14} strokeWidth={2} className="text-amber" />
              <span className="text-amber text-[11px] font-bold uppercase tracking-wide">Possible Survivor Signature</span>
            </div>
            <p className="text-[10px] text-[#c7b7a4] mb-3">
              Simulated heat and acoustic indicators detected. Training event only — not a real-world detection.
            </p>
            <ConfidenceGauge value={ai.survivorConfidence} />
          </div>
        ) : (
          <div className="bg-panel2 border border-line rounded-[8px] p-3 text-center text-muted text-[11px]">
            <User size={20} strokeWidth={1.5} className="mx-auto mb-1 opacity-30" />
            Deploy robot and run a scan to detect survivor signatures.
          </div>
        )}

        {/* recommendations */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-panel2 border border-line rounded-[8px] p-2.5">
            <span className="text-[9px] text-muted uppercase tracking-widest block mb-1">Recommended Mode</span>
            <span className="text-cyan text-[12px] font-bold">{ai.recommendedMode}</span>
          </div>
          <div className="bg-panel2 border border-line rounded-[8px] p-2.5">
            <span className="text-[9px] text-muted uppercase tracking-widest block mb-1">Hazard Level</span>
            <span
              className="text-[12px] font-bold"
              style={{ color: ai.hazardSummary.includes('High') ? C.red : C.muted }}
            >
              {ai.hazardSummary.includes('High') ? 'HIGH' : 'MODERATE'}
            </span>
          </div>
        </div>

        {/* route guidance */}
        <div className="bg-panel2 border border-line rounded-[8px] p-2.5">
          <span className="text-[9px] text-muted uppercase tracking-widest block mb-1">Route Guidance</span>
          <span className="text-rx-text text-[11px]">{ai.recommendedRoute}</span>
        </div>

        {/* hazard summary */}
        <div className="bg-panel2 border border-line rounded-[8px] p-2.5 flex items-start gap-2">
          <AlertTriangle
            size={14}
            strokeWidth={2}
            style={{ color: ai.hazardSummary.includes('High') ? C.red : C.muted }}
            className="mt-0.5 shrink-0"
          />
          <span
            className="text-[11px]"
            style={{ color: ai.hazardSummary.includes('High') ? C.red : C.muted }}
          >
            {ai.hazardSummary}
          </span>
        </div>

        {/* evidence tags */}
        {ai.evidenceTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {ai.evidenceTags.map(tag => <EvidenceTag key={tag} tag={tag} />)}
          </div>
        )}

        <p className="text-[9px] text-muted border-t border-line pt-2">
          AI-style alerts are advisory only. A trained rescue professional must verify all findings before acting.
        </p>
      </div>
    </section>
  )
}
