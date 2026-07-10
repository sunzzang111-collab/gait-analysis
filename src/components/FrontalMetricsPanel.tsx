import type { FrontalFrame } from '../lib/frontalMetrics'

function deg(v: number): string {
  return Number.isFinite(v) ? `${v.toFixed(0)}°` : '—'
}

export function FrontalMetricsPanel({ f }: { f: FrontalFrame }) {
  const cells: { label: string; value: string }[] = [
    { label: '무릎외반 (좌)', value: deg(f.kneeValgusL) },
    { label: '무릎외반 (우)', value: deg(f.kneeValgusR) },
    { label: '회내 (좌)', value: deg(f.rearfootL) },
    { label: '회내 (우)', value: deg(f.rearfootR) },
    { label: '골반경사', value: deg(f.pelvicObliquity) },
    { label: '몸통기울기', value: deg(f.trunkLean) },
  ]
  return (
    <div className="metrics-panel">
      {cells.map(({ label, value }) => (
        <div className="metrics-panel__cell" key={label}>
          <span className="metrics-panel__label">{label}</span>
          <span className="metrics-panel__value">{value}</span>
        </div>
      ))}
    </div>
  )
}
