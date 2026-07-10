/** Educational illustration + text explaining the foot metrics. */
export function FootExplainer() {
  return (
    <div className="explainer">
      <h4>지표 설명</h4>
      <div className="explainer__grid">
        <figure className="explainer__item">
          <svg viewBox="0 0 160 150" role="img" aria-label="발끝 방향 설명">
            <rect width="160" height="150" fill="#f8f9fb" rx="8" />
            {/* walking direction */}
            <line x1="80" y1="140" x2="80" y2="20" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 4" />
            <path d="M80 20 l-5 9 h10 z" fill="#94a3b8" />
            <text x="86" y="30" fontSize="9" fill="#6b7280">걷는 방향</text>
            {/* foot (top-down), toed out ~14° */}
            <g transform="rotate(14 80 100)">
              <ellipse cx="80" cy="95" rx="15" ry="40" fill="#2563eb" opacity="0.85" />
              <ellipse cx="80" cy="58" rx="12" ry="12" fill="#2563eb" opacity="0.85" />
            </g>
            {/* angle arc */}
            <path d="M80 70 A 30 30 0 0 1 88 72" fill="none" stroke="#ea580c" strokeWidth="2" />
            <text x="92" y="66" fontSize="11" fill="#ea580c" fontWeight="700">θ</text>
          </svg>
          <figcaption>
            <strong>발끝 방향 (足진행각)</strong>
            <span>
              걷는 방향 대비 발끝이 벌어진 각도. 정상은 약간 바깥(~7°). 안쪽으로 모이면
              내족보행(in-toeing), 과도하게 벌어지면 외족보행(out-toeing)으로 봅니다.
            </span>
          </figcaption>
        </figure>

        <figure className="explainer__item">
          <svg viewBox="0 0 160 150" role="img" aria-label="회내 설명">
            <rect width="160" height="150" fill="#f8f9fb" rx="8" />
            {/* shank */}
            <line x1="80" y1="20" x2="80" y2="95" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
            {/* everted heel (tilted) */}
            <g transform="rotate(16 80 100)">
              <rect x="70" y="95" width="20" height="34" rx="8" fill="#2563eb" opacity="0.85" />
            </g>
            {/* vertical reference */}
            <line x1="80" y1="95" x2="80" y2="135" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 3" />
            <path d="M80 108 A 22 22 0 0 0 92 118" fill="none" stroke="#ea580c" strokeWidth="2" />
            <text x="96" y="120" fontSize="11" fill="#ea580c" fontWeight="700">θ</text>
          </svg>
          <figcaption>
            <strong>회내 (발뒤꿈치 외반)</strong>
            <span>
              뒤에서 볼 때 발뒤꿈치가 안쪽으로 무너지는 정도. 과회내(overpronation)는 평발·정강이·
              무릎 통증과 연관될 수 있어 러닝화·교정 판단에 참고합니다.
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
