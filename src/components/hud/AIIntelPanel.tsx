import type { MissionState } from '../../types/rubblex'

interface Props { state: MissionState }

function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100)
  const color = pct > 60 ? '#F59E0B' : pct > 30 ? '#38BDF8' : '#10B981'
  return (
    <div className="mt-2">
      <div className="flex justify-between text-[10px] mb-1">
        <span className="text-muted">SIMULATED CONFIDENCE — ILLUSTRATIVE ONLY</span>
        <span style={{ color }} className="font-bold">{pct}%</span>
      </div>
      <div className="h-1.5 bg-panel2 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

export default function AIIntelPanel({ state }: Props) {
  const { ai, survivors } = state
  const hasSurvivor = survivors.length > 0
  return (
    <section className="bg-panel border border-line rounded-xl overflow-hidden">
      <div className="flex justify-between items-center px-4 py-3 border-b border-line">
        <h2 className="text-[11px] font-semibold tracking-[1.4px] uppercase">04 / Survivor Intelligence</h2>
        <span className={`text-[10px] border rounded-full px-2.5 py-1 font-semibold ${hasSurvivor ? 'text-amber border-amber/40 bg-amber/5' : 'border-line text-muted'}`}>
          {hasSurvivor ? '◆ SIGNAL DETECTED' : 'NO SIGNAL'}
        </span>
      </div>
      <div className="p-3 space-y-3">
        {hasSurvivor && (
          <div className="border border-amber/30 bg-[#2a2119] rounded-lg p-3">
            <p className="text-amber text-[11px] font-bold">◆ POSSIBLE SURVIVOR SIGNATURE</p>
            <p className="text-[10px] text-[#c7b7a4] mt-1">
              Simulated heat and acoustic indicators detected. This is a training event — not a real-world detection.
            </p>
            <ConfidenceBar value={ai.survivorConfidence} />
          </div>
        )}
        <div className="bg-panel2 border border-line rounded-lg p-2.5 text-[11px]">
          <span className="text-muted text-[9px] uppercase tracking-widest block mb-1">Recommended Mode</span>
          <span className="text-cyan font-bold">{ai.recommendedMode}</span>
        </div>
        <div className="bg-panel2 border border-line rounded-lg p-2.5 text-[11px]">
          <span className="text-muted text-[9px] uppercase tracking-widest block mb-1">Route Guidance</span>
          <span className="text-rx-text">{ai.recommendedRoute}</span>
        </div>
        <div className="bg-panel2 border border-line rounded-lg p-2.5 text-[11px]">
          <span className="text-muted text-[9px] uppercase tracking-widest block mb-1">Hazard Summary</span>
          <span className={ai.hazardSummary.includes('High') ? 'text-red' : 'text-rx-text'}>{ai.hazardSummary}</span>
        </div>
        {ai.evidenceTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {ai.evidenceTags.map(tag => (
              <span key={tag} className="text-[10px] text-cyan border border-cyan/30 rounded px-1.5 py-0.5">{tag}</span>
            ))}
          </div>
        )}
        <p className="text-[9px] text-muted border-t border-line pt-2">
          AI-style alerts are advisory only. A trained rescue professional must verify all findings.
        </p>
      </div>
    </section>
  )
}
