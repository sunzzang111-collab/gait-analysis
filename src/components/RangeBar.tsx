export interface Stop {
  to: number
  tone: 'good' | 'warn' | 'bad'
}

interface Props {
  value: number | null
  min?: number
  max: number
  stops: Stop[]
  /** Optional zone labels shown under the bar. */
  legend?: string
}

const FILL: Record<Stop['tone'], string> = {
  good: '#dcfce7',
  warn: '#fef3c7',
  bad: '#fee2e2',
}

/** A compact normal-range band: colored zones with a marker at the measured value. */
export function RangeBar({ value, min = 0, max, stops, legend }: Props) {
  const span = max - min || 1
  const pct = (v: number) => Math.max(0, Math.min(100, ((v - min) / span) * 100))

  let prev = min
  const segments = stops.map((s, i) => {
    const width = pct(s.to) - pct(prev)
    prev = s.to
    return <span key={i} className="rangebar__seg" style={{ width: `${width}%`, background: FILL[s.tone] }} />
  })

  const markerPct = value == null || !Number.isFinite(value) ? null : pct(value)

  return (
    <div className="rangebar">
      <div className="rangebar__track">
        {segments}
        {markerPct != null && <span className="rangebar__marker" style={{ left: `${markerPct}%` }} />}
      </div>
      {legend && <div className="rangebar__legend">{legend}</div>}
    </div>
  )
}

/** Zones for a "lower is better" metric (green up to warn, amber to bad, red beyond). */
export function lowerIsBetterStops(warn: number, bad: number, max: number): Stop[] {
  return [
    { to: warn, tone: 'good' },
    { to: bad, tone: 'warn' },
    { to: max, tone: 'bad' },
  ]
}
