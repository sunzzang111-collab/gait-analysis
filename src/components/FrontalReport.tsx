import type { FrontalSummary } from '../lib/frontalMetrics'

function fmtDeg(v: number | null): string {
  return v == null ? '측정 불가' : `${v.toFixed(1)}°`
}

function fmtPct(v: number | null): string {
  return v == null ? '—' : `${v.toFixed(0)}%`
}

function fmtNum(v: number | null): string {
  return v == null ? '측정 불가' : v.toFixed(2)
}

/** Rough interpretation thresholds — reference only, not diagnostic cutoffs. */
function tone(v: number | null, warn: number, bad: number): string {
  if (v == null) return ''
  if (v >= bad) return 'tone-bad'
  if (v >= warn) return 'tone-warn'
  return 'tone-good'
}

export function FrontalReport({ summary }: { summary: FrontalSummary }) {
  return (
    <div className="gait-report">
      <h3>후면(정면 평면) 측정 결과</h3>
      <p className="hint">측정 시간 {summary.durationSec.toFixed(1)}초</p>

      <div className="summary-grid">
        <div className={`summary-card ${tone(summary.peakValgus.left, 8, 15)}`}>
          <span className="summary-card__label">최대 무릎 외반 (좌)</span>
          <span className="summary-card__value">{fmtDeg(summary.peakValgus.left)}</span>
        </div>
        <div className={`summary-card ${tone(summary.peakValgus.right, 8, 15)}`}>
          <span className="summary-card__label">최대 무릎 외반 (우)</span>
          <span className="summary-card__value">{fmtDeg(summary.peakValgus.right)}</span>
        </div>
        <div className="summary-card">
          <span className="summary-card__label">무릎 외반 좌우차</span>
          <span className="summary-card__value">{fmtPct(summary.peakValgus.symmetryPct)}</span>
        </div>

        <div className={`summary-card ${tone(summary.peakRearfoot.left, 8, 15)}`}>
          <span className="summary-card__label">최대 회내 (좌)</span>
          <span className="summary-card__value">{fmtDeg(summary.peakRearfoot.left)}</span>
        </div>
        <div className={`summary-card ${tone(summary.peakRearfoot.right, 8, 15)}`}>
          <span className="summary-card__label">최대 회내 (우)</span>
          <span className="summary-card__value">{fmtDeg(summary.peakRearfoot.right)}</span>
        </div>
        <div className="summary-card">
          <span className="summary-card__label">회내 좌우차</span>
          <span className="summary-card__value">{fmtPct(summary.peakRearfoot.symmetryPct)}</span>
        </div>

        <div className={`summary-card ${tone(summary.pelvicDropPeak, 5, 10)}`}>
          <span className="summary-card__label">최대 골반 하강</span>
          <span className="summary-card__value">{fmtDeg(summary.pelvicDropPeak)}</span>
        </div>
        <div className={`summary-card ${tone(summary.trunkSwayRange, 6, 12)}`}>
          <span className="summary-card__label">몸통 측방 흔들림 (범위)</span>
          <span className="summary-card__value">{fmtDeg(summary.trunkSwayRange)}</span>
        </div>
        <div className="summary-card">
          <span className="summary-card__label">보폭 간격 (어깨폭 대비)</span>
          <span className="summary-card__value">{fmtNum(summary.stepWidthRelMean)}</span>
        </div>
      </div>

      <p className="hint">
        무릎 외반(+) = 착지 시 무릎이 안쪽으로 무너짐 · 회내 = 발뒤꿈치 외반 정도 · 골반 하강 =
        한 다리 지지 시 반대쪽 골반이 떨어지는 각도 · 몸통 흔들림 = 좌우 기울기 변화 폭. 표시된
        색상 기준(양호/주의/확인 필요)은 참고용 근사치이며 임상 진단 기준이 아닙니다. 단일 2D
        카메라 추정이므로, 카메라를 환자 정후면에 수직으로 두고 촬영할 때 가장 신뢰할 수 있습니다.
      </p>
    </div>
  )
}
