import type { FootFrame } from '../lib/footMetrics'

function fpa(v: number): string {
  if (!Number.isFinite(v)) return '—'
  const dir = v > 3 ? '바깥' : v < -3 ? '안쪽' : '중립'
  return `${v.toFixed(0)}° ${dir}`
}

function deg(v: number): string {
  return Number.isFinite(v) ? `${v.toFixed(0)}°` : '—'
}

export function FootMetricsPanel({ f }: { f: FootFrame }) {
  const cells = [
    { label: '발끝 방향 (좌)', value: fpa(f.fpaLeft) },
    { label: '발끝 방향 (우)', value: fpa(f.fpaRight) },
    { label: '회내 (좌)', value: deg(f.everLeft) },
    { label: '회내 (우)', value: deg(f.everRight) },
  ]
  return (
    <div className="metrics-panel metrics-panel--4">
      {cells.map(({ label, value }) => (
        <div className="metrics-panel__cell" key={label}>
          <span className="metrics-panel__label">{label}</span>
          <span className="metrics-panel__value">{value}</span>
        </div>
      ))}
    </div>
  )
}
