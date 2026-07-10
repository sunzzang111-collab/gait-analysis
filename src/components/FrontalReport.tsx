import type { FrontalSummary } from '../lib/frontalMetrics'
import { THRESHOLDS, type Threshold } from '../lib/references'
import { RangeBar, lowerIsBetterStops } from './RangeBar'
import { FrontalExplainer } from './FrontalExplainer'

function fmtDeg(v: number | null): string {
  return v == null ? '측정 불가' : `${v.toFixed(1)}°`
}

function fmtPct(v: number | null): string {
  return v == null ? '—' : `${v.toFixed(0)}%`
}

function fmtNum(v: number | null): string {
  return v == null ? '측정 불가' : v.toFixed(2)
}

/** Foot progression angle → value + direction label. + out-toeing, − in-toeing. */
function fmtFPA(v: number | null): string {
  if (v == null) return '측정 불가'
  const dir = v > 3 ? '바깥' : v < -3 ? '안쪽' : '중립'
  return `${v.toFixed(0)}° ${dir}`
}

function fpaTone(v: number | null): string {
  if (v == null) return ''
  // Slight out-toeing (~0–15°) is typical; in-toeing or large out-toeing → caution.
  if (v < -5 || v > 20) return 'tone-warn'
  return 'tone-good'
}

function tone(v: number | null, th: Threshold): string {
  if (v == null) return ''
  if (v >= th.bad) return 'tone-bad'
  if (v >= th.warn) return 'tone-warn'
  return 'tone-good'
}

function GradeTag({ th }: { th: Threshold }) {
  return (
    <span className={`grade grade--${th.grade}`}>{th.grade === 'evidence' ? '근거기반' : '참고'}</span>
  )
}

/** Card with the normal-range band for a threshold-based, lower-is-better metric. */
function ThreshCard({ label, value, th }: { label: string; value: number | null; th: Threshold }) {
  return (
    <div className={`summary-card ${tone(value, th)}`}>
      <span className="summary-card__label">
        {label} <GradeTag th={th} />
      </span>
      <span className="summary-card__value">{fmtDeg(value)}</span>
      <RangeBar
        value={value}
        max={th.max}
        unit="°"
        stops={lowerIsBetterStops(th.warn, th.bad, th.max)}
        legend="◀ 정상 · 주의 · 확인 ▶"
      />
    </div>
  )
}

export function FrontalReport({ summary }: { summary: FrontalSummary }) {
  const kv = THRESHOLDS.kneeValgus
  const rf = THRESHOLDS.rearfoot
  const pd = THRESHOLDS.pelvicDrop
  const ts = THRESHOLDS.trunkSway

  return (
    <div className="gait-report">
      <h3>후면(정면 평면) 측정 결과</h3>
      <p className="hint">측정 시간 {summary.durationSec.toFixed(1)}초 · 값은 90퍼센타일(잡음 제거) 피크</p>

      <div className="summary-grid">
        <ThreshCard label="최대 무릎 외반 (좌)" value={summary.peakValgus.left} th={kv} />
        <ThreshCard label="최대 무릎 외반 (우)" value={summary.peakValgus.right} th={kv} />
        <div className="summary-card">
          <span className="summary-card__label">무릎 외반 좌우차</span>
          <span className="summary-card__value">{fmtPct(summary.peakValgus.symmetryPct)}</span>
        </div>

        <ThreshCard label="최대 회내 (좌)" value={summary.peakRearfoot.left} th={rf} />
        <ThreshCard label="최대 회내 (우)" value={summary.peakRearfoot.right} th={rf} />
        <div className="summary-card">
          <span className="summary-card__label">회내 좌우차</span>
          <span className="summary-card__value">{fmtPct(summary.peakRearfoot.symmetryPct)}</span>
        </div>

        <ThreshCard label="최대 골반 하강" value={summary.pelvicDropPeak} th={pd} />
        <ThreshCard label="몸통 측방 흔들림 (범위)" value={summary.trunkSwayRange} th={ts} />
        <div className="summary-card">
          <span className="summary-card__label">보폭 간격 (어깨폭 대비)</span>
          <span className="summary-card__value">{fmtNum(summary.stepWidthRelMean)}</span>
        </div>

        <div className={`summary-card ${fpaTone(summary.footProgression.left)}`}>
          <span className="summary-card__label">
            발끝 방향 (좌) <span className="grade grade--heuristic">참고</span>
          </span>
          <span className="summary-card__value">{fmtFPA(summary.footProgression.left)}</span>
        </div>
        <div className={`summary-card ${fpaTone(summary.footProgression.right)}`}>
          <span className="summary-card__label">
            발끝 방향 (우) <span className="grade grade--heuristic">참고</span>
          </span>
          <span className="summary-card__value">{fmtFPA(summary.footProgression.right)}</span>
        </div>
      </div>

      <p className="hint" style={{ textAlign: 'left', marginTop: '6px' }}>
        각 값 아래 막대는 정상(초록)·주의(노랑)·확인(빨강) 구간이며, 세로선이 측정값 위치입니다.
      </p>

      <FrontalExplainer />

      <ul className="metric-notes">
        <li>{pd.note}</li>
        <li>{kv.note}</li>
        <li>{rf.note}</li>
        <li>{ts.note}</li>
        <li>
          발끝 방향(+바깥/−안쪽): 정상은 약간의 바깥 벌어짐(~7°). 발 랜드마크 특성상 신뢰도가 낮으니,
          정밀 평가는 발을 크게 담은 근접 후면 촬영을 권장합니다.
        </li>
      </ul>
    </div>
  )
}
