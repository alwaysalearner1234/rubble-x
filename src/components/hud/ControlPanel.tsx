import {
  Bot, Upload, Move, Minimize2, Maximize2, Wrench,
  ScanSearch, Hand, Zap, WifiOff, OctagonAlert, RotateCcw,
} from 'lucide-react'
import type { MissionState } from '../../types/rubblex'
import { store } from '../../simulation/missionStore'
import { Btn, PanelHeader, StatusChip } from './ds'

interface Props { state: MissionState }

export default function ControlPanel({ state }: Props) {
  const { robot } = state
  const canMove  = robot.deployed && !robot.stopped && !robot.fault
  const canScan  = canMove
  const isCompact = robot.bodyMode === 'COMPACT'
  const isStopped = robot.stopped || robot.fault !== null

  return (
    <section className="bg-panel border border-line rounded-[12px] overflow-hidden">
      <PanelHeader
        title="Mission Controls"
        right={<StatusChip variant="simulated" label="W/A/S/D · SPACE" />}
      />

      <div className="p-3 space-y-3">

        {/* ── Primary actions ── */}
        <div className="grid grid-cols-2 gap-2">
          <Btn
            variant={robot.deployed ? 'ghost' : 'primary'}
            onClick={() => store.deploy()}
            disabled={robot.deployed}
            Icon={robot.deployed ? Bot : Upload}
            className="col-span-1"
          >
            {robot.deployed ? 'Deployed' : 'Deploy Robot'}
          </Btn>

          <Btn
            onClick={() => store.toggleBodyMode()}
            disabled={!canMove}
            Icon={isCompact ? Maximize2 : Minimize2}
          >
            {isCompact ? 'Extended' : 'Compact'}
          </Btn>

          <Btn
            onClick={() => store.scan()}
            disabled={!canScan}
            Icon={ScanSearch}
            className="col-span-2"
          >
            Run Sensor Scan
          </Btn>

          <Btn
            onClick={() => store.toggleArm()}
            disabled={!canMove}
            variant={robot.armExtended ? 'warn' : 'default'}
            Icon={Wrench}
          >
            {robot.armExtended ? 'Retract Arm' : 'Extend Arm'}
          </Btn>

          <Btn
            onClick={() => store.reset()}
            Icon={RotateCcw}
          >
            Reset
          </Btn>
        </div>

        {/* ── D-pad movement ── */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Move size={12} strokeWidth={2} className="text-muted" />
            <span className="text-[9px] text-muted uppercase tracking-widest">Movement</span>
          </div>
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

        {/* ── Fault simulation ── */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Zap size={12} strokeWidth={2} className="text-muted" />
            <span className="text-[9px] text-muted uppercase tracking-widest">Fault Simulation</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Btn
              variant="warn"
              onClick={() => store.triggerFault('MOTOR_FAULT')}
              disabled={robot.fault !== null}
              Icon={Zap}
            >
              Motor Fault
            </Btn>
            <Btn
              variant="warn"
              onClick={() => store.triggerFault('COMMS_LOSS')}
              disabled={robot.fault !== null}
              Icon={WifiOff}
            >
              Comms Loss
            </Btn>
          </div>
        </div>

        {/* release stop */}
        {isStopped && (
          <Btn
            variant="ghost"
            onClick={() => store.releaseStop()}
            Icon={Hand}
            className="w-full"
          >
            Release Stop / Clear Fault
          </Btn>
        )}

        {/* ── Emergency Stop ── */}
        <Btn
          variant={isStopped ? 'danger-engaged' : 'danger'}
          onClick={isStopped ? () => store.releaseStop() : () => store.emergencyStop()}
          Icon={OctagonAlert}
          className="w-full text-[13px] py-2.5"
        >
          {isStopped ? 'STOP ENGAGED — RELEASE [SPACE]' : 'EMERGENCY STOP [SPACE]'}
        </Btn>

        <p className="text-[9px] text-muted border-t border-line pt-2">
          SPACE key triggers emergency stop. All controls are software simulation only.
        </p>
      </div>
    </section>
  )
}
