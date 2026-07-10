import type { GaitSummary } from './gaitMetrics'
import type { FrontalSummary } from './frontalMetrics'
import type { FootSummary } from './footMetrics'
import type { ViewMode } from './rawFrame'

export interface Metric {
  label: string
  value: number | null
  unit: string
  digits: number
}

export interface RecordInput {
  memo: string
  view: ViewMode
  treadmill: boolean
  metrics: Metric[]
}

export interface SavedRecord extends RecordInput {
  id: string
  dateISO: string
}

export function sagittalMetrics(s: GaitSummary): Metric[] {
  const base: Metric[] = [
    { label: '케이던스', value: s.cadenceStepsPerMin, unit: '걸음/분', digits: 0 },
    { label: '보행주기 대칭차', value: s.stepTimeSymmetryPct, unit: '%', digits: 1 },
    { label: '무릎 ROM 대칭차', value: s.romSymmetryPct.knee, unit: '%', digits: 1 },
    { label: '골반 ROM 대칭차', value: s.romSymmetryPct.hip, unit: '%', digits: 1 },
    { label: '발목 ROM 대칭차', value: s.romSymmetryPct.ankle, unit: '%', digits: 1 },
  ]
  if (s.stepLengthCm) {
    base.push(
      { label: '보폭 좌', value: s.stepLengthCm.left, unit: 'cm', digits: 0 },
      { label: '보폭 우', value: s.stepLengthCm.right, unit: 'cm', digits: 0 },
    )
  } else {
    base.push({ label: '보폭 대칭차(상대)', value: s.relativeStepLength.symmetryPct, unit: '%', digits: 1 })
  }
  return base
}

export function frontalMetricList(s: FrontalSummary): Metric[] {
  return [
    { label: '무릎외반 좌', value: s.peakValgus.left, unit: '°', digits: 1 },
    { label: '무릎외반 우', value: s.peakValgus.right, unit: '°', digits: 1 },
    { label: '회내 좌', value: s.peakRearfoot.left, unit: '°', digits: 1 },
    { label: '회내 우', value: s.peakRearfoot.right, unit: '°', digits: 1 },
    { label: '골반 하강', value: s.pelvicDropPeak, unit: '°', digits: 1 },
    { label: '몸통 흔들림', value: s.trunkSwayRange, unit: '°', digits: 1 },
    { label: '발끝방향 좌', value: s.footProgression.left, unit: '°', digits: 0 },
    { label: '발끝방향 우', value: s.footProgression.right, unit: '°', digits: 0 },
  ]
}

export function footMetricList(s: FootSummary): Metric[] {
  return [
    { label: '발끝방향 좌', value: s.footProgression.left, unit: '°', digits: 0 },
    { label: '발끝방향 우', value: s.footProgression.right, unit: '°', digits: 0 },
    { label: '회내 좌', value: s.eversion.left, unit: '°', digits: 1 },
    { label: '회내 우', value: s.eversion.right, unit: '°', digits: 1 },
  ]
}

export function fmtMetric(m: Metric): string {
  return m.value == null ? '—' : `${m.value.toFixed(m.digits)}${m.unit === '%' ? '%' : ` ${m.unit}`}`
}
