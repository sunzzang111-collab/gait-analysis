import { useState } from 'react'
import { fmtMetric, type Metric, type SavedRecord } from '../lib/records'

function fmtDate(iso: string): string {
  const d = new Date(iso)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

function viewLabel(v: SavedRecord['view']): string {
  return v === 'sagittal' ? '측면' : v === 'frontal' ? '후면' : '발'
}

function findMetric(list: Metric[], label: string): Metric | undefined {
  return list.find((m) => m.label === label)
}

function ComparisonTable({ a, b }: { a: SavedRecord; b: SavedRecord }) {
  const labels = Array.from(new Set([...a.metrics, ...b.metrics].map((m) => m.label)))
  return (
    <div className="records__compare">
      <div className="records__compare-head">
        비교: <strong>{fmtDate(a.dateISO)}</strong> → <strong>{fmtDate(b.dateISO)}</strong>
      </div>
      <table className="records__table">
        <thead>
          <tr>
            <th>지표</th>
            <th>{fmtDate(a.dateISO).slice(5)}</th>
            <th>{fmtDate(b.dateISO).slice(5)}</th>
            <th>변화</th>
          </tr>
        </thead>
        <tbody>
          {labels.map((label) => {
            const ma = findMetric(a.metrics, label)
            const mb = findMetric(b.metrics, label)
            const delta =
              ma?.value != null && mb?.value != null ? mb.value - ma.value : null
            const arrow = delta == null ? '' : delta > 0.05 ? '▲' : delta < -0.05 ? '▼' : '—'
            const unit = (mb ?? ma)?.unit ?? ''
            return (
              <tr key={label}>
                <td>{label}</td>
                <td>{ma ? fmtMetric(ma) : '—'}</td>
                <td>{mb ? fmtMetric(mb) : '—'}</td>
                <td className={delta == null ? '' : delta > 0 ? 'delta-up' : delta < 0 ? 'delta-down' : ''}>
                  {delta == null ? '—' : `${arrow} ${Math.abs(delta).toFixed(1)}${unit === '%' ? '%' : ''}`}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="hint" style={{ textAlign: 'left' }}>
        변화는 두 번째 − 첫 번째 값입니다. 지표 방향(증가가 좋은지 나쁜지)은 항목마다 다르니 임상적으로
        해석하세요.
      </p>
    </div>
  )
}

export function Records({
  records,
  onRemove,
}: {
  records: SavedRecord[]
  onRemove: (id: string) => void
}) {
  const [selected, setSelected] = useState<string[]>([])

  function toggle(id: string) {
    setSelected((cur) => {
      if (cur.includes(id)) return cur.filter((x) => x !== id)
      if (cur.length >= 2) return [cur[1], id] // keep last two
      return [...cur, id]
    })
  }

  const [a, b] = selected
    .map((id) => records.find((r) => r.id === id))
    .filter((r): r is SavedRecord => !!r)
    // order chronologically (older first) for a sensible before→after
    .sort((x, y) => x.dateISO.localeCompare(y.dateISO))

  if (!records.length) return null

  return (
    <details className="records">
      <summary>저장된 측정 · 비교 ({records.length})</summary>
      <div className="records__body">
        <p className="hint" style={{ textAlign: 'left' }}>
          비교할 측정 2개를 체크하세요 (치료 전 → 후).
        </p>
        <ul className="records__list">
          {records.map((r) => (
            <li key={r.id} className="records__item">
              <label>
                <input
                  type="checkbox"
                  checked={selected.includes(r.id)}
                  onChange={() => toggle(r.id)}
                />
                <span className="records__date">{fmtDate(r.dateISO)}</span>
                <span className="records__view">{viewLabel(r.view)}</span>
                {r.memo && <span className="records__memo">{r.memo}</span>}
              </label>
              <button type="button" className="linkish" onClick={() => onRemove(r.id)}>
                삭제
              </button>
            </li>
          ))}
        </ul>
        {a && b && <ComparisonTable a={a} b={b} />}
      </div>
    </details>
  )
}
