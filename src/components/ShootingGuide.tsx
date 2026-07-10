import type { ViewMode } from '../lib/rawFrame'

/** Top-down schematic: camera to the side, patient walking across the view. */
function SagittalDiagram() {
  return (
    <svg viewBox="0 0 260 140" className="guide__diagram" role="img" aria-label="측면 촬영 배치도">
      <rect x="0" y="0" width="260" height="140" fill="#f8f9fb" rx="8" />
      {/* walkway */}
      <line x1="40" y1="46" x2="240" y2="46" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="6 5" />
      <line x1="40" y1="94" x2="240" y2="94" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="6 5" />
      {/* patient + walk arrow */}
      <circle cx="120" cy="70" r="9" fill="#2563eb" />
      <line x1="150" y1="70" x2="212" y2="70" stroke="#2563eb" strokeWidth="3" />
      <path d="M212 70 l-9 -5 v10 z" fill="#2563eb" />
      <text x="120" y="112" fontSize="11" fill="#6b7280" textAnchor="middle">걷는 방향 →</text>
      {/* camera */}
      <rect x="118" y="8" width="24" height="16" rx="3" fill="#111827" />
      <circle cx="130" cy="16" r="4" fill="#f8f9fb" />
      <line x1="130" y1="24" x2="130" y2="60" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
      <text x="130" y="6" fontSize="10" fill="#111827" textAnchor="middle">📷 고정</text>
    </svg>
  )
}

/** Top-down schematic: camera behind, patient walking away (or on a treadmill). */
function FrontalDiagram() {
  return (
    <svg viewBox="0 0 260 140" className="guide__diagram" role="img" aria-label="후면 촬영 배치도">
      <rect x="0" y="0" width="260" height="140" fill="#f8f9fb" rx="8" />
      {/* camera at bottom */}
      <rect x="118" y="112" width="24" height="16" rx="3" fill="#111827" />
      <circle cx="130" cy="120" r="4" fill="#f8f9fb" />
      <text x="130" y="138" fontSize="10" fill="#111827" textAnchor="middle">📷 고정</text>
      {/* line of sight */}
      <line x1="130" y1="112" x2="130" y2="40" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
      {/* patient walking away */}
      <circle cx="130" cy="70" r="9" fill="#2563eb" />
      <line x1="130" y1="58" x2="130" y2="30" stroke="#2563eb" strokeWidth="3" />
      <path d="M130 30 l-5 9 h10 z" fill="#2563eb" />
      <text x="176" y="60" fontSize="11" fill="#6b7280">멀어지며 걷기 ↑</text>
    </svg>
  )
}

const CONTENT: Record<
  ViewMode,
  { title: string; orientation: string; steps: string[]; measures: string }
> = {
  sagittal: {
    title: '측면(옆모습) 촬영 방법',
    orientation: '📱 가로(landscape)로 촬영 — 걷는 경로를 넓게 담아 여러 걸음이 들어오게',
    steps: [
      '카메라(휴대폰/태블릿)를 환자 옆 3~4m에 삼각대 등으로 고정. 렌즈 높이는 허리 정도.',
      '따라가지 말고 고정한 채로, 환자가 카메라 앞을 가로질러 5~10걸음 자연스럽게 걷게 합니다.',
      '머리부터 발끝까지 전신이 프레임에 들어오도록 거리를 맞춥니다.',
      '러닝머신을 쓰면 카메라를 옆에 고정하고 "러닝머신에서 촬영"을 켜세요.',
    ],
    measures: '분석 항목: 무릎·골반·발목 관절 각도, 케이던스, 보폭 대칭',
  },
  frontal: {
    title: '후면/정면 촬영 방법',
    orientation: '📱 세로(portrait)로 촬영 — 머리~발끝 전신이 크고 온전하게 들어오게',
    steps: [
      '카메라를 환자의 정후면(또는 정면)에 똑바로 고정. 무릎~어깨가 프레임에 들어오게 합니다.',
      '지상 촬영이면 환자가 카메라에서 멀어지며 5~8걸음 걷습니다(멀어질수록 작아져 정확도가 떨어집니다).',
      '러닝머신이 더 정확합니다 — 제자리에서 여러 걸음을 같은 거리로 촬영할 수 있어요.',
      '몸이 좌우로 치우치지 않게, 카메라를 환자 정중앙에 맞춥니다.',
    ],
    measures: '분석 항목: 무릎 외반 · 회내 · 골반 하강 · 몸통 흔들림 (선별용 상대 지표)',
  },
}

export function ShootingGuide({ view }: { view: ViewMode }) {
  const c = CONTENT[view]
  return (
    <details className="guide" open>
      <summary>촬영 방법 가이드 · {view === 'sagittal' ? '측면' : '후면/정면'}</summary>
      <div className="guide__body">
        <div className="guide__text">
          <strong>{c.title}</strong>
          <p className="guide__orientation">{c.orientation}</p>
          <ol>
            {c.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
          <p className="hint guide__measures">{c.measures}</p>
        </div>
        {view === 'sagittal' ? <SagittalDiagram /> : <FrontalDiagram />}
      </div>
    </details>
  )
}
