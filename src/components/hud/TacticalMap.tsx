import { useRef, useEffect } from 'react'
import type { MissionState } from '../../types/rubblex'
import { OBSTACLES, HAZARD_ZONES, SURVIVOR_BEACONS, WORLD_HALF } from '../../simulation/worldConfig'

interface Props { state: MissionState }

function worldToCanvas(wx: number, wz: number, cw: number, ch: number): [number, number] {
  const scale = cw / (WORLD_HALF * 2)
  return [(wx + WORLD_HALF) * scale, (wz + WORLD_HALF) * scale]
}

export default function TacticalMap({ state }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const cw = canvas.width, ch = canvas.height
    ctx.clearRect(0, 0, cw, ch)
    // background
    ctx.fillStyle = '#0d1922'
    ctx.fillRect(0, 0, cw, ch)
    // grid
    ctx.strokeStyle = '#1e3040'
    ctx.lineWidth = 0.5
    const step = cw / 12
    for (let i = 0; i <= 12; i++) { ctx.beginPath(); ctx.moveTo(i * step, 0); ctx.lineTo(i * step, ch); ctx.stroke() }
    for (let i = 0; i <= 12; i++) { ctx.beginPath(); ctx.moveTo(0, i * step); ctx.lineTo(cw, i * step); ctx.stroke() }
    // obstacles
    OBSTACLES.forEach(obs => {
      const [ox, , oz] = obs.position
      const [sw, , sd] = obs.size
      const scale = cw / (WORLD_HALF * 2)
      const px = (ox - sw / 2 + WORLD_HALF) * scale
      const py = (oz - sd / 2 + WORLD_HALF) * scale
      ctx.fillStyle = obs.unstable ? '#c0683a88' : '#4a5a6588'
      ctx.strokeStyle = obs.unstable ? '#ff9d42' : '#697780'
      ctx.lineWidth = 1
      ctx.fillRect(px, py, sw * scale, sd * scale)
      ctx.strokeRect(px, py, sw * scale, sd * scale)
    })
    // hazard zones
    HAZARD_ZONES.forEach(hz => {
      const [hx, , hz2] = hz.position
      const [cx2, cy2] = worldToCanvas(hx, hz2, cw, ch)
      const r = hz.radius * (cw / (WORLD_HALF * 2))
      ctx.beginPath(); ctx.arc(cx2, cy2, r, 0, Math.PI * 2)
      ctx.fillStyle = '#ff5e6230'; ctx.fill()
      ctx.strokeStyle = '#ff5e62'; ctx.lineWidth = 1; ctx.stroke()
    })
    // explored path
    const path = state.robot.pathHistory
    if (path.length > 1) {
      ctx.beginPath()
      const [x0, , z0] = path[0]
      const [sx, sy] = worldToCanvas(x0, z0, cw, ch)
      ctx.moveTo(sx, sy)
      for (let i = 1; i < path.length; i++) {
        const [xi, , zi] = path[i]
        const [px, py] = worldToCanvas(xi, zi, cw, ch)
        ctx.lineTo(px, py)
      }
      ctx.strokeStyle = '#48d6e860'; ctx.lineWidth = 1.5; ctx.stroke()
    }
    // survivor beacons
    SURVIVOR_BEACONS.forEach(b => {
      const detected = state.survivors.some(s => s.id === b.id)
      const [bx, cy2] = worldToCanvas(b.position[0], b.position[2], cw, ch)
      ctx.beginPath(); ctx.arc(bx, cy2, 5, 0, Math.PI * 2)
      ctx.fillStyle = detected ? '#ff9d42' : '#8b6a3a'; ctx.fill()
      if (detected) {
        ctx.strokeStyle = '#ff9d42'; ctx.lineWidth = 2
        ctx.beginPath(); ctx.arc(bx, cy2, 9, 0, Math.PI * 2); ctx.stroke()
        ctx.fillStyle = '#ff9d42'; ctx.font = '9px Inter,sans-serif'
        ctx.fillText('POSSIBLE SURVIVOR', bx + 11, cy2 + 3)
      }
    })
    // robot
    if (state.robot.deployed) {
      const { x, z } = state.robot.position
      const [rx, ry] = worldToCanvas(x, z, cw, ch)
      ctx.beginPath(); ctx.arc(rx, ry, 5, 0, Math.PI * 2)
      const rColor = state.robot.stopped ? '#ff5e62' : '#48d6e8'
      ctx.fillStyle = rColor; ctx.fill()
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.stroke()
      // heading arrow
      const h = state.robot.position.heading
      ctx.beginPath(); ctx.moveTo(rx, ry)
      ctx.lineTo(rx + Math.sin(h) * 10, ry - Math.cos(h) * 10)
      ctx.strokeStyle = rColor; ctx.lineWidth = 1.5; ctx.stroke()
    }
  }, [state])

  return (
    <section className="bg-panel border border-line rounded-xl overflow-hidden">
      <div className="flex justify-between items-center px-4 py-3 border-b border-line">
        <h2 className="text-[11px] font-semibold tracking-[1.4px] uppercase">05 / Search and Rescue Map</h2>
        <span className="text-[10px] border border-cyan/30 rounded px-2 py-0.5 text-cyan">SECTOR 04</span>
      </div>
      <div className="p-3">
        <canvas
          ref={canvasRef}
          width={360}
          height={240}
          style={{ width: '100%', height: 'auto', borderRadius: 6, border: '1px solid #263746', display: 'block' }}
          aria-label="Simulated 2D tactical rescue map"
        />
        <div className="mt-2 flex gap-3 flex-wrap text-[9px] text-muted">
          <span className="text-[#4a5a65]">▰ RUBBLE</span>
          <span className="text-[#c0683a]">▰ UNSTABLE</span>
          <span className="text-cyan">● ROBOT</span>
          <span className="text-orange">◆ SURVIVOR</span>
          <span className="text-red">● HAZARD</span>
        </div>
        <p className="text-[9px] text-muted mt-1">Simulated positions only. No real GPS or structural data.</p>
      </div>
    </section>
  )
}
