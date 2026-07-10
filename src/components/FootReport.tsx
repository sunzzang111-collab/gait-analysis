import type { FootSummary } from '../lib/footMetrics'
import { THRESHOLDS } from '../lib/references'
import { RangeBar, lowerIsBetterStops } from './RangeBar'

function fmtFPA(v: number | null): string {
  if (v == null) return '측정 불가'
  const dir = v > 3 ? '바깥' : v < -3 ? '안쪽' : '중립'
  return `${v.toFixed(0)}° ${dir}`
}

function fpaTone(v: number | null): string {
  if (v == null) return ''
  if (v < -5 || v > 20) return 'tone-warn'
  return 'tone-good'
}

function everTone(v: number | null): string {
  if (v == null) return ''
  const rf = THRESHOLDS.rearfoot
  if (v >= rf.bad) return 'tone-bad'
  if (v >= rf.warn) return 'tone-warn'
  return 'tone-good'
}

export function FootReport({ summary }: { summary: FootSummary }) {
  const rf = THRESHOLDS.rearfoot
  const fpaStops = lowerIsBetterStops(15, 25, 40) // out-toeing bands (deg)

  return (
    <div className="gait-report">
      <h3>근접 발 측정 결과</h3>
      <p className="hint">발을 크게 담은 근접 후면 촬영 기준 · {summary.frameCount} 프레임</p>

      <div className="summary-grid">
        <div className={`summary-card ${fpaTone(summary.footProgression.left)}`}>
          <span className="summary-card__label">발끝 방향 (좌) <span className="grade grade--heuristic">참고</span></span>
          <span className="summary-card__value">{fmtFPA(summary.footProgression.left)}</span>
          <RangeBar
            value={summary.footProgression.left != null ? Math.abs(summary.footProgression.left) : null}
            max={40}
            stops={fpaStops}
            legend="바깥 벌어짐 정상 ~7° · 과도(>25°)·안쪽(−)은 확인"
          />
        </div>
        <div className={`summary-card ${fpaTone(summary.footProgression.right)}`}>
          <span className="summary-card__label">발끝 방향 (우) <span className="grade grade--heuristic">참고</span></span>
          <span className="summary-card__value">{fmtFPA(summary.footProgression.right)}</span>
          <RangeBar
            value={summary.footProgression.right != null ? Math.abs(summary.footProgression.right) : null}
            max={40}
            stops={fpaStops}
            legend="바깥 벌어짐 정상 ~7° · 과도(>25°)·안쪽(−)은 확인"
          />
        </div>
        <div className="summary-card">
          <span className="summary-card__label">발끝 방향 좌우차</span>
          <span className="summary-card__value">
            {summary.footProgression.symmetryPct == null
              ? '—'
              : `${summary.footProgression.symmetryPct.toFixed(0)}%`}
          </span>
        </div>

        <div className={`summary-card ${everTone(summary.eversion.left)}`}>
          <span className="summary-card__label">회내 (좌) <span className="grade grade--heuristic">참고</span></span>
          <span className="summary-card__value">
            {summary.eversion.left == null ? '측정 불가' : `${summary.eversion.left.toFixed(1)}°`}
          </span>
          <RangeBar
            value={summary.eversion.left}
            max={rf.max}
            stops={lowerIsBetterStops(rf.warn, rf.bad, rf.max)}
            legend={`정상 <${rf.warn}° · 주의 ${rf.warn}–${rf.bad}° · 확인 >${rf.bad}°`}
          />
        </div>
        <div className={`summary-card ${everTone(summary.eversion.right)}`}>
          <span className="summary-card__label">회내 (우) <span className="grade grade--heuristic">참고</span></span>
          <span className="summary-card__value">
            {summary.eversion.right == null ? '측정 불가' : `${summary.eversion.right.toFixed(1)}°`}
          </span>
          <RangeBar
            value={summary.eversion.right}
            max={rf.max}
            stops={lowerIsBetterStops(rf.warn, rf.bad, rf.max)}
            legend={`정상 <${rf.warn}° · 주의 ${rf.warn}–${rf.bad}° · 확인 >${rf.bad}°`}
          />
        </div>
        <div className="summary-card">
          <span className="summary-card__label">회내 좌우차</span>
          <span className="summary-card__value">
            {summary.eversion.symmetryPct == null ? '—' : `${summary.eversion.symmetryPct.toFixed(0)}%`}
          </span>
        </div>
      </div>

      <ul className="metric-notes">
        <li>발끝 방향(+바깥/−안쪽): 정상은 약간의 바깥 벌어짐(~7°). 안쪽(내족보행)이나 과도한 바깥은 확인.</li>
        <li>{rf.note}</li>
        <li>
          발을 크게 담아 발뒤꿈치·발끝 랜드마크 정확도를 높인 모드입니다. 그래도 2D 추정이므로 좌우
          비교·추세 관찰 위주로 해석하세요.
        </li>
      </ul>
    </div>
  )
}
