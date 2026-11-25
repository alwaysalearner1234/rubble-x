/**
 * RUBBLE-X — Magnetic Module Bay Selector
 * Allows operator to dock/detach mission pods.
 * All module state is SIMULATED.
 */
import { Package, Stethoscope, Wrench, Unplug } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { MissionState, ModulePod } from '../../types/rubblex'
import { store } from '../../simulation/missionStore'
import { StatusChip, PanelHeader, C } from './ds'

interface Props { state: MissionState }

interface PodOption {
  id: ModulePod
  label: string
  description: string
  Icon: LucideIcon
  requiresExploration?: boolean
}

const PODS: PodOption[] = [
  {
    id: 'DETACHED',
    label: 'No Pod',
    description: 'No mission module docked.',
    Icon: Unplug,
  },
  {
    id: 'MEDICAL_POD',
    label: 'Medical Pod',
    description: 'First-aid kit deployment only. No surgical actions.',
    Icon: Stethoscope,
  },
  {
    id: 'DEBRIS_GRIPPER_POD',
    label: 'Debris Gripper',
    description: 'Loose, non-structural debris only. HitL approval required.',
    Icon: Wrench,
  },
]

export default function ModuleBaySelector({ state }: Props) {
  const { moduleBay, robot } = state
  const canDock = robot.deployed && !robot.stopped && !robot.fault

  return (
    <section className="bg-panel border border-line rounded-[12px] overflow-hidden">
      <PanelHeader
        title="Magnetic Module Bay"
        right={
          <div className="flex items-center gap-2">
            <StatusChip variant="simulated" label="SIM" />
            <StatusChip
              variant={moduleBay.docked === 'DETACHED' ? 'default' : 'nominal'}
              Icon={Package}
              label={moduleBay.docked === 'DETACHED' ? 'DETACHED' : 'DOCKED'}
            />
          </div>
        }
      />

      <div className="p-3 space-y-2">
        {/* scope guardrail */}
        <div className="bg-amber/5 border border-amber/20 rounded-[8px] px-3 py-2 text-[10px] text-amber flex items-start gap-2">
          <span className="shrink-0 mt-0.5">⚠</span>
          <span>Loose non-structural debris only · First-aid reachback only — no surgery · Simulated prototype</span>
        </div>

        {/* pod selector */}
        <div className="grid gap-2">
          {PODS.map(pod => {
            const active = moduleBay.docked === pod.id
            const Icon = pod.Icon
            return (
              <button
                key={pod.id}
                onClick={() => canDock && store.dockModule(pod.id)}
                disabled={!canDock}
                className={`w-full text-left border rounded-[8px] px-3 py-2.5 flex items-center gap-3 transition-all duration-100 disabled:opacity-40 disabled:cursor-not-allowed ${
                  active
                    ? 'border-cyan/40 bg-cyan/5 text-rx-text'
                    : 'border-line bg-panel2 text-muted hover:border-line/80 hover:text-rx-text'
                }`}
              >
                <Icon
                  size={16}
                  strokeWidth={2}
                  style={{ color: active ? C.cyan : C.muted, flexShrink: 0 }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold">{pod.label}</div>
                  <div className="text-[10px] text-muted truncate">{pod.description}</div>
                </div>
                {active && (
                  <StatusChip variant="active" label="ACTIVE" />
                )}
              </button>
            )
          })}
        </div>

        {!canDock && (
          <p className="text-[9px] text-muted">Deploy the robot to enable module docking.</p>
        )}
      </div>
    </section>
  )
}
