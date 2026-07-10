export interface Stop {
  to: number
  tone: 'good' | 'warn' | 'bad'
}

interface Props {
  value: number | null
  min?: number
  max: number
  stops: Stop[]
  /** Unit appended to the boundary tick labels (e.g. "°"). */
  unit?: string
  /** Override which values get tick labels (defaults to the internal zone boundaries). */
  tickValues?: number[]
  /** Short caption under the bar. */
  legend?: string
}

const FILL: Record<Stop['tone'], string> = {
  good: '#bbf7d0',
  warn: '#fde68a',
  bad: '#fecaca',
}

/** A compact normal-range gauge: colored zones, boundary ticks, and a pin at the measured value. */
export function RangeBar({ value, min = 0, max, stops, unit = '', tickValues, legend }: Props) {
  const span = max - min || 1
  const pct = (v: number) => Math.max(0, Math.min(100, ((v - min) / span) * 100))

  let prev = min
  const segments = stops.map((s, i) => {
    const width = pct(s.to) - pct(prev)
    prev = s.to
    return <span key={i} className="rangebar__seg" style={{ width: `${width}%`, background: FILL[s.tone] }} />
  })

  // Internal boundaries (exclude the final max) become tick labels, unless overridden.
  const boundaries = tickValues ?? stops.slice(0, -1).map((s) => s.to)
  const markerPct = value == null || !Number.isFinite(value) ? null : pct(value)

  return (
    <div className="rangebar">
      <div className="rangebar__bar">
        <div className="rangebar__zones">{segments}</div>
        {markerPct != null && <span className="rangebar__marker" style={{ left: `${markerPct}%` }} />}
      </div>
      <div className="rangebar__ticks">
        {boundaries.map((bnd, i) => (
          <span key={i} className="rangebar__tick" style={{ left: `${pct(bnd)}%` }}>
            {bnd}
            {unit}
          </span>
        ))}
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
