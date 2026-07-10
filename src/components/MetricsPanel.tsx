import type { JointAngles } from '../lib/gaitMetrics'

const ROWS: { key: keyof JointAngles; label: string }[] = [
  { key: 'leftKnee', label: '무릎 (좌)' },
  { key: 'rightKnee', label: '무릎 (우)' },
  { key: 'leftHip', label: '골반 (좌)' },
  { key: 'rightHip', label: '골반 (우)' },
  { key: 'leftAnkle', label: '발목 (좌)' },
  { key: 'rightAnkle', label: '발목 (우)' },
]

export function MetricsPanel({ angles }: { angles: JointAngles }) {
  return (
    <div className="metrics-panel">
      {ROWS.map(({ key, label }) => (
        <div className="metrics-panel__cell" key={key}>
          <span className="metrics-panel__label">{label}</span>
          <span className="metrics-panel__value">
            {Number.isFinite(angles[key]) ? `${angles[key].toFixed(0)}°` : '—'}
          </span>
        </div>
      ))}
    </div>
  )
}
