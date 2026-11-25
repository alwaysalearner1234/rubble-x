/**
 * RUBBLE-X Design System primitives
 * Implements the Figma component library (Skq7zUZGFShDqDajR72UIK).
 * No simulation logic lives here — purely presentational.
 */
import type { ReactNode } from 'react'
import { type LucideIcon } from 'lucide-react'

// ── Color token map ──────────────────────────────────────────
export const C = {
  amber: '#F59E0B',
  cyan:  '#38BDF8',
  green: '#10B981',
  red:   '#EF4444',
  muted: '#94A3B8',
  text:  '#F8FAFC',
  bg:    '#0B1117',
  panel: '#111922',
  panel2:'#18222F',
  line:  '#263342',
} as const

// ── Status chip variants ─────────────────────────────────────
type ChipVariant = 'nominal' | 'warning' | 'critical' | 'simulated' | 'info' | 'active' | 'default'

const CHIP_STYLES: Record<ChipVariant, string> = {
  nominal:   'text-green  border-green/30  bg-green/10',
  warning:   'text-amber  border-amber/30  bg-amber/10',
  critical:  'text-red    border-red/30    bg-red/10',
  simulated: 'text-cyan   border-cyan/30   bg-cyan/10',
  info:      'text-cyan   border-cyan/20   bg-cyan/5',
  active:    'text-cyan   border-cyan/30   bg-cyan/10',
  default:   'text-muted  border-line      bg-panel2',
}

interface ChipProps {
  variant?: ChipVariant
  Icon?: LucideIcon
  label: string
  pulse?: boolean
  size?: 'sm' | 'md'
}

/** StatusChip: always shows Lucide icon + uppercase label on tinted pill */
export function StatusChip({ variant = 'default', Icon, label, pulse = false, size = 'sm' }: ChipProps) {
  const cls = CHIP_STYLES[variant]
  const textSize = size === 'md' ? 'text-[11px]' : 'text-[10px]'
  return (
    <span className={`inline-flex items-center gap-1.5 border rounded-[4px] px-2 py-0.5 font-semibold tracking-wide uppercase ${textSize} ${cls}`}>
      {Icon && <Icon size={12} strokeWidth={2} />}
      {pulse && (
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      )}
      {label}
    </span>
  )
}

// ── Panel header ─────────────────────────────────────────────
interface PanelHeaderProps {
  section?: string   // e.g. "02"
  title: string
  right?: ReactNode
}

export function PanelHeader({ section, title, right }: PanelHeaderProps) {
  return (
    <div className="flex justify-between items-center px-4 py-3 border-b border-line shrink-0">
      <div>
        {section && (
          <div className="text-[9px] text-muted tracking-[1.6px] uppercase mb-0.5">{section}</div>
        )}
        <h2 className="text-[11px] font-semibold tracking-[1.4px] uppercase text-rx-text">{title}</h2>
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </div>
  )
}

// ── Button ───────────────────────────────────────────────────
type BtnVariant = 'default' | 'primary' | 'danger' | 'danger-engaged' | 'warn' | 'ghost'

const BTN_STYLES: Record<BtnVariant, string> = {
  default:        'border-line      bg-panel2         text-rx-text  hover:border-cyan',
  primary:        'border-amber     bg-amber           text-[#1b1208] hover:opacity-90',
  danger:         'border-red       bg-red             text-white    hover:opacity-90',
  'danger-engaged':'border-red/60   bg-red/10          text-red      hover:bg-red/20',
  warn:           'border-amber/50  bg-amber/10        text-amber    hover:border-amber',
  ghost:          'border-line      bg-transparent     text-muted    hover:text-rx-text hover:border-line',
}

interface BtnProps {
  children: ReactNode
  onClick: () => void
  variant?: BtnVariant
  disabled?: boolean
  className?: string
  Icon?: LucideIcon
}

export function Btn({ children, onClick, variant = 'default', disabled = false, className = '', Icon }: BtnProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 border rounded-[8px] px-3 py-2 text-[12px] font-semibold cursor-pointer transition-all duration-100 disabled:opacity-40 disabled:cursor-not-allowed ${BTN_STYLES[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && <Icon size={14} strokeWidth={2} />}
      {children}
    </button>
  )
}

// ── Progress bar ─────────────────────────────────────────────
interface ProgressBarProps { value: number; max?: number }

export function ProgressBar({ value, max = 100 }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const color = pct > 50 ? '#10B981' : pct > 15 ? '#F59E0B' : '#EF4444'
  const label = pct > 50 ? 'NOMINAL' : pct > 15 ? 'LOW' : 'CRITICAL'
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px]">
        <span className="text-muted tabular">{Math.round(pct)}%</span>
        <span style={{ color }} className="font-semibold">{label}</span>
      </div>
      <div className="h-1.5 bg-panel2 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}
