import { useEffect, useReducer } from 'react'
import { store } from './missionStore'
import type { MissionState } from '../types/rubblex'

export function useMission(): [MissionState, typeof store] {
  const [, forceUpdate] = useReducer(x => x + 1, 0)

  useEffect(() => {
    const unsub = store.subscribe(() => forceUpdate())
    return unsub
  }, [])

  return [store.getState(), store]
}
