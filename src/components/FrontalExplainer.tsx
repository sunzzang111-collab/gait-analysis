import { EversionIcon } from './FootIcons'

/** Educational illustrations + text for the frontal-plane metrics. */
export function FrontalExplainer() {
  return (
    <div className="explainer">
      <h4>지표 설명</h4>
      <div className="explainer__grid">
        <figure className="explainer__item">
          <svg viewBox="0 0 160 150" role="img" aria-label="무릎 외반 설명">
            <rect width="160" height="150" fill="#f8f9fb" rx="8" />
            {/* pelvis */}
            <line x1="46" y1="26" x2="114" y2="26" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
            {/* left leg: hip -> knee (in) -> ankle (out) */}
            <line x1="52" y1="28" x2="76" y2="82" stroke="#2563eb" strokeWidth="6" strokeLinecap="round" />
            <line x1="76" y1="82" x2="58" y2="134" stroke="#2563eb" strokeWidth="6" strokeLinecap="round" />
            {/* right leg */}
            <line x1="108" y1="28" x2="84" y2="82" stroke="#2563eb" strokeWidth="6" strokeLinecap="round" />
            <line x1="84" y1="82" x2="102" y2="134" stroke="#2563eb" strokeWidth="6" strokeLinecap="round" />
            {/* knees caving in */}
            <circle cx="76" cy="82" r="4" fill="#f97316" />
            <circle cx="84" cy="82" r="4" fill="#f97316" />
            <path d="M64 82 l8 0" stroke="#ea580c" strokeWidth="2" markerEnd="url(#ar)" />
            <path d="M96 82 l-8 0" stroke="#ea580c" strokeWidth="2" markerEnd="url(#ar)" />
            <defs>
              <marker id="ar" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0 0 L6 3 L0 6 z" fill="#ea580c" />
              </marker>
            </defs>
          </svg>
          <figcaption>
            <strong>무릎 외반 (dynamic knee valgus)</strong>
            <span>
              착지 시 무릎이 안쪽으로 무너지는 정도(FPPA). 러너 무릎·전방십자인대 손상 위험과 연관되어
              하지 정렬 평가에 참고합니다.
            </span>
          </figcaption>
        </figure>

        <figure className="explainer__item">
          <svg viewBox="0 0 160 150" role="img" aria-label="골반 하강 설명">
            <rect width="160" height="150" fill="#f8f9fb" rx="8" />
            {/* trunk */}
            <line x1="80" y1="18" x2="80" y2="60" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
            {/* horizontal reference */}
            <line x1="52" y1="64" x2="108" y2="64" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 3" />
            {/* tilted pelvis: swing (left) side dropped */}
            <line x1="58" y1="74" x2="102" y2="58" stroke="#2563eb" strokeWidth="6" strokeLinecap="round" />
            {/* stance leg (right) */}
            <line x1="102" y1="58" x2="104" y2="134" stroke="#2563eb" strokeWidth="6" strokeLinecap="round" />
            {/* swing leg (left, lifted) */}
            <line x1="58" y1="74" x2="70" y2="112" stroke="#2563eb" strokeWidth="6" strokeLinecap="round" opacity="0.5" />
            <path d="M92 61 A 16 16 0 0 0 100 70" fill="none" stroke="#ea580c" strokeWidth="2" />
            <text x="60" y="96" fontSize="9" fill="#6b7280">떨어짐</text>
          </svg>
          <figcaption>
            <strong>골반 하강 (pelvic drop)</strong>
            <span>
              한 다리로 설 때 반대쪽(들린 다리) 골반이 떨어지는 각도. 엉덩이 외전근(중둔근) 약화를
              시사할 수 있습니다.
            </span>
          </figcaption>
        </figure>

        <figure className="explainer__item">
          <svg viewBox="0 0 160 150" role="img" aria-label="몸통 흔들림 설명">
            <rect width="160" height="150" fill="#f8f9fb" rx="8" />
            {/* pelvis */}
            <line x1="60" y1="116" x2="100" y2="116" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
            {/* vertical reference */}
            <line x1="80" y1="116" x2="80" y2="30" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 3" />
            {/* trunk leaning right */}
            <line x1="80" y1="116" x2="98" y2="38" stroke="#2563eb" strokeWidth="6" strokeLinecap="round" />
            <circle cx="100" cy="30" r="9" fill="#2563eb" />
            {/* sway arrows */}
            <path d="M60 24 l-8 6 l8 6" fill="none" stroke="#ea580c" strokeWidth="2" />
            <path d="M108 24 l8 6 l-8 6" fill="none" stroke="#ea580c" strokeWidth="2" />
            <text x="82" y="70" fontSize="10" fill="#ea580c" fontWeight="700">θ</text>
          </svg>
          <figcaption>
            <strong>몸통 측방 흔들림 (trunk sway)</strong>
            <span>
              걸을 때 몸통이 좌우로 기우는 폭. 통증 회피나 균형 보상으로 커질 수 있어 좌우·추세
              비교에 참고합니다.
            </span>
          </figcaption>
        </figure>

        <figure className="explainer__item">
          <EversionIcon />
          <figcaption>
            <strong>회내 (발뒤꿈치 외반)</strong>
            <span>
              뒤에서 볼 때 발뒤꿈치가 안쪽으로 무너지는 정도. 과회내는 평발·정강이·무릎 통증과 연관될
              수 있습니다.
            </span>
          </figcaption>
        </figure>
      </div>
      <p className="hint" style={{ textAlign: 'left' }}>
        그림은 이해를 돕기 위한 개념도입니다. 실제 수치는 위 카드와 정상범위 밴드를 참고하세요.
      </p>
    </div>
  )
}
