import type { GaitFrame, GaitSummary } from '../lib/gaitMetrics'
import { AngleChart } from './AngleChart'
import { CADENCE, THRESHOLDS } from '../lib/references'

function fmtPct(v: number | null): string {
  return v == null ? '측정 불가' : `${v.toFixed(1)}%`
}

function fmtSec(v: number | null): string {
  return v == null ? '측정 불가' : `${v.toFixed(2)}초`
}

const sym = THRESHOLDS.symmetry

function symmetryTone(v: number | null): string {
  if (v == null) return ''
  if (v >= sym.bad) return 'tone-bad'
  if (v >= sym.warn) return 'tone-warn'
  return 'tone-good'
}

function cadenceTone(v: number): string {
  if (v >= CADENCE.normalLow && v <= CADENCE.normalHigh) return 'tone-good'
  if (v >= CADENCE.normalLow - 10 && v <= CADENCE.normalHigh + 10) return 'tone-warn'
  return 'tone-bad'
}

export function GaitReport({ summary }: { frames: GaitFrame[]; summary: GaitSummary }) {
  return (
    <div className="gait-report">
      <h3>측정 결과 요약 (측면)</h3>
      <p className="hint">
        측정 시간 {summary.durationSec.toFixed(1)}초 · 좌 {summary.leftStepCount}걸음 · 우{' '}
        {summary.rightStepCount}걸음
      </p>

      <div className="summary-grid">
        <div className={`summary-card ${cadenceTone(summary.cadenceStepsPerMin)}`}>
          <span className="summary-card__label">케이던스 <span className="grade grade--evidence">근거기반</span></span>
          <span className="summary-card__value">{summary.cadenceStepsPerMin.toFixed(0)} 걸음/분</span>
        </div>
        <div className="summary-card">
          <span className="summary-card__label">보행 주기 (좌/우)</span>
          <span className="summary-card__value">
            {fmtSec(summary.leftStepTimeSec)} / {fmtSec(summary.rightStepTimeSec)}
          </span>
        </div>
        <div className={`summary-card ${symmetryTone(summary.stepTimeSymmetryPct)}`}>
          <span className="summary-card__label">보행주기 대칭성 차이 <span className="grade grade--heuristic">참고</span></span>
          <span className="summary-card__value">{fmtPct(summary.stepTimeSymmetryPct)}</span>
        </div>
        <div className={`summary-card ${symmetryTone(summary.relativeStepLength.symmetryPct)}`}>
          <span className="summary-card__label">상대 보폭 대칭성 차이 <span className="grade grade--heuristic">참고</span></span>
          <span className="summary-card__value">
            {summary.stepLengthMeasurable
              ? fmtPct(summary.relativeStepLength.symmetryPct)
              : '러닝머신: 측정 불가'}
          </span>
        </div>
        <div className={`summary-card ${symmetryTone(summary.romSymmetryPct.knee)}`}>
          <span className="summary-card__label">무릎 가동범위 대칭성 차이 <span className="grade grade--heuristic">참고</span></span>
          <span className="summary-card__value">{fmtPct(summary.romSymmetryPct.knee)}</span>
        </div>
        <div className={`summary-card ${symmetryTone(summary.romSymmetryPct.hip)}`}>
          <span className="summary-card__label">골반 가동범위 대칭성 차이 <span className="grade grade--heuristic">참고</span></span>
          <span className="summary-card__value">{fmtPct(summary.romSymmetryPct.hip)}</span>
        </div>
        <div className={`summary-card ${symmetryTone(summary.romSymmetryPct.ankle)}`}>
          <span className="summary-card__label">발목 가동범위 대칭성 차이 <span className="grade grade--heuristic">참고</span></span>
          <span className="summary-card__value">{fmtPct(summary.romSymmetryPct.ankle)}</span>
        </div>
      </div>

      <ul className="metric-notes">
        <li>{CADENCE.note}</li>
        <li>
          대칭성 차이 = |좌-우| ÷ 평균 × 100. {sym.note} (표시: 6% 미만 양호, 6–10% 주의, 10% 이상
          확인).
        </li>
        {!summary.stepLengthMeasurable && (
          <li>러닝머신에서는 발이 앞으로 이동하지 않아 광학 보폭을 측정할 수 없습니다(케이던스·보행주기는 유효).</li>
        )}
      </ul>
    </div>
  )
}

export function GaitCharts({ frames }: { frames: GaitFrame[] }) {
  return (
    <div className="gait-charts">
      <AngleChart title="무릎 각도" frames={frames} leftKey="leftKnee" rightKey="rightKnee" />
      <AngleChart title="골반 각도" frames={frames} leftKey="leftHip" rightKey="rightHip" />
      <AngleChart title="발목 각도" frames={frames} leftKey="leftAnkle" rightKey="rightAnkle" />
    </div>
  )
}
