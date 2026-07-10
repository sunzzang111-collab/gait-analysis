import type { FrontalSummary } from '../lib/frontalMetrics'
import { THRESHOLDS, type Threshold } from '../lib/references'

function fmtDeg(v: number | null): string {
  return v == null ? '측정 불가' : `${v.toFixed(1)}°`
}

function fmtPct(v: number | null): string {
  return v == null ? '—' : `${v.toFixed(0)}%`
}

function fmtNum(v: number | null): string {
  return v == null ? '측정 불가' : v.toFixed(2)
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
        <div className={`summary-card ${tone(summary.peakValgus.left, kv)}`}>
          <span className="summary-card__label">최대 무릎 외반 (좌) <GradeTag th={kv} /></span>
          <span className="summary-card__value">{fmtDeg(summary.peakValgus.left)}</span>
        </div>
        <div className={`summary-card ${tone(summary.peakValgus.right, kv)}`}>
          <span className="summary-card__label">최대 무릎 외반 (우) <GradeTag th={kv} /></span>
          <span className="summary-card__value">{fmtDeg(summary.peakValgus.right)}</span>
        </div>
        <div className="summary-card">
          <span className="summary-card__label">무릎 외반 좌우차</span>
          <span className="summary-card__value">{fmtPct(summary.peakValgus.symmetryPct)}</span>
        </div>

        <div className={`summary-card ${tone(summary.peakRearfoot.left, rf)}`}>
          <span className="summary-card__label">최대 회내 (좌) <GradeTag th={rf} /></span>
          <span className="summary-card__value">{fmtDeg(summary.peakRearfoot.left)}</span>
        </div>
        <div className={`summary-card ${tone(summary.peakRearfoot.right, rf)}`}>
          <span className="summary-card__label">최대 회내 (우) <GradeTag th={rf} /></span>
          <span className="summary-card__value">{fmtDeg(summary.peakRearfoot.right)}</span>
        </div>
        <div className="summary-card">
          <span className="summary-card__label">회내 좌우차</span>
          <span className="summary-card__value">{fmtPct(summary.peakRearfoot.symmetryPct)}</span>
        </div>

        <div className={`summary-card ${tone(summary.pelvicDropPeak, pd)}`}>
          <span className="summary-card__label">최대 골반 하강 <GradeTag th={pd} /></span>
          <span className="summary-card__value">{fmtDeg(summary.pelvicDropPeak)}</span>
        </div>
        <div className={`summary-card ${tone(summary.trunkSwayRange, ts)}`}>
          <span className="summary-card__label">몸통 측방 흔들림 (범위) <GradeTag th={ts} /></span>
          <span className="summary-card__value">{fmtDeg(summary.trunkSwayRange)}</span>
        </div>
        <div className="summary-card">
          <span className="summary-card__label">보폭 간격 (어깨폭 대비)</span>
          <span className="summary-card__value">{fmtNum(summary.stepWidthRelMean)}</span>
        </div>
      </div>

      <ul className="metric-notes">
        <li>{pd.note}</li>
        <li>{kv.note}</li>
        <li>{rf.note}</li>
        <li>{ts.note}</li>
      </ul>
    </div>
  )
}
