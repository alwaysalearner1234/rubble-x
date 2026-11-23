import type { MissionState } from '../../types/rubblex'
import { store } from '../../simulation/missionStore'

interface Props { state: MissionState }

function Btn({ children, onClick, variant = 'default', disabled = false, className = '' }: {
  children: React.ReactNode; onClick: () => void; variant?: 'default' | 'primary' | 'danger' | 'warn'; disabled?: boolean; className?: string
}) {
  const base = 'border rounded-lg px-3 py-2 text-[12px] font-semibold cursor-pointer transition-all duration-100 disabled:opacity-40 disabled:cursor-not-allowed'
  const styles: Record<string, string> = {
    default:  'border-line bg-[#1b2a38] text-rx-text hover:border-cyan',
    primary:  'border-orange bg-orange text-[#1b1208] hover:opacity-90',
    danger:   'border-[#73323b] bg-[#3a1d24] text-[#ffb4b5] hover:border-red',
    warn:     'border-orange/50 bg-[#2a2010] text-orange hover:border-orange',
  }
  return (
    <button className={`${base} ${styles[variant]} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

export default function ControlPanel({ state }: Props) {
  const { robot } = state
  const canMove = robot.deployed && !robot.stopped && !robot.fault
  const canScan = canMove
  const isCompact = robot.bodyMode === 'COMPACT'

  return (
    <section className="bg-panel border border-line rounded-xl overflow-hidden">
      <div className="flex justify-between items-center px-4 py-3 border-b border-line">
        <h2 className="text-[11px] font-semibold tracking-[1.4px] uppercase">Robot Controls</h2>
        <span className="text-[10px] text-muted">W/A/S/D · SPACE</span>
      </div>
      <div className="p-3 space-y-3">
        {/* deploy / mode / arm */}
        <div className="grid grid-cols-2 gap-2">
          <Btn variant="primary" onClick={() => store.deploy()} disabled={robot.deployed}>
            {robot.deployed ? 'Deployed' : 'Deploy Robot'}
          </Btn>
          <Btn onClick={() => store.toggleBodyMode()} disabled={!canMove}>
            {isCompact ? 'Extended Mode' : 'Compact Mode'}
          </Btn>
          <Btn onClick={() => store.scan()} disabled={!canScan} className="col-span-2">
            ◎ Run Sensor Scan
          </Btn>
          <Btn onClick={() => store.toggleArm()} disabled={!canMove} variant={robot.armExtended ? 'warn' : 'default'}>
            {robot.armExtended ? 'Retract Arm' : 'Extend Arm'}
          </Btn>
          <Btn onClick={() => store.reset()} variant="default">
            Reset Mission
          </Btn>
        </div>

        {/* d-pad */}
        <div>
          <p className="text-[9px] text-muted uppercase tracking-widest mb-1.5">Movement</p>
          <div className="grid grid-cols-3 gap-1.5 max-w-[160px] mx-auto">
            <span />
            <Btn onClick={() => store.move('forward')}  disabled={!canMove}>▲</Btn>
            <span />
            <Btn onClick={() => store.move('left')}     disabled={!canMove}>◀</Btn>
            <Btn onClick={() => store.move('backward')} disabled={!canMove}>▼</Btn>
            <Btn onClick={() => store.move('right')}    disabled={!canMove}>▶</Btn>
            <Btn onClick={() => store.rotate('ccw')}    disabled={!canMove}>↺</Btn>
            <span />
            <Btn onClick={() => store.rotate('cw')}     disabled={!canMove}>↻</Btn>
          </div>
        </div>

        {/* fault triggers */}
        <div>
          <p className="text-[9px] text-muted uppercase tracking-widest mb-1.5">Fault Simulation</p>
          <div className="grid grid-cols-2 gap-2">
            <Btn variant="warn" onClick={() => store.triggerFault('MOTOR_FAULT')} disabled={robot.fault !== null}>
              Motor Fault
            </Btn>
            <Btn variant="warn" onClick={() => store.triggerFault('COMMS_LOSS')} disabled={robot.fault !== null}>
              Comms Loss
            </Btn>
          </div>
        </div>

        {/* release stop (shown when stopped/fault) */}
        {(robot.stopped || robot.fault) && (
          <Btn variant="default" onClick={() => store.releaseStop()} className="w-full">
            ↺ Release Stop / Clear Fault
          </Btn>
        )}

        {/* E-STOP */}
        <Btn variant="danger" onClick={() => store.emergencyStop()} className="w-full">
          ⬛ EMERGENCY STOP
        </Btn>

        <p className="text-[9px] text-muted border-t border-line pt-2">
          SPACE key triggers emergency stop. All controls are software simulation only.
        </p>
      </div>
    </section>
  )
}
