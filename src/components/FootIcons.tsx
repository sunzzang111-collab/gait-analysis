/** Shared, higher-fidelity concept illustrations for foot metrics. */

/** Top-down foot silhouette (with toes) showing the foot progression angle. */
export function FootProgressionIcon() {
  return (
    <svg viewBox="0 0 160 150" role="img" aria-label="발끝 방향(足진행각) 개념도">
      <rect width="160" height="150" fill="#f8f9fb" rx="8" />
      {/* line of progression */}
      <line x1="70" y1="140" x2="70" y2="18" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 4" />
      <path d="M70 18 l-5 9 h10 z" fill="#94a3b8" />
      <text x="8" y="26" fontSize="9" fill="#6b7280">걷는 방향</text>
      {/* foot, toed out ~15° about the heel */}
      <g transform="rotate(15 70 118)">
        <path
          d="M70 58
             C 81 58, 87 68, 86 80
             C 85 92, 83 100, 82 108
             C 81 118, 78 128, 70 130
             C 62 128, 59 118, 58 108
             C 57 100, 55 92, 54 80
             C 53 68, 59 58, 70 58 Z"
          fill="#2563eb"
          opacity="0.9"
        />
        {/* toes: big (medial) → little */}
        <ellipse cx="60" cy="53" rx="4.6" ry="6" fill="#2563eb" opacity="0.9" />
        <ellipse cx="68" cy="50" rx="4" ry="5.4" fill="#2563eb" opacity="0.9" />
        <ellipse cx="75" cy="52" rx="3.4" ry="4.6" fill="#2563eb" opacity="0.9" />
        <ellipse cx="81" cy="55" rx="2.8" ry="3.8" fill="#2563eb" opacity="0.9" />
        <ellipse cx="86" cy="59" rx="2.3" ry="3.2" fill="#2563eb" opacity="0.9" />
      </g>
      {/* angle arc between progression line and foot axis */}
      <path d="M70 78 A 40 40 0 0 1 80 80" fill="none" stroke="#ea580c" strokeWidth="2" />
      <text x="83" y="74" fontSize="12" fill="#ea580c" fontWeight="700">θ</text>
    </svg>
  )
}

/** Posterior view of the lower leg + heel showing rearfoot eversion. */
export function EversionIcon() {
  return (
    <svg viewBox="0 0 160 150" role="img" aria-label="회내(발뒤꿈치 외반) 개념도">
      <rect width="160" height="150" fill="#f8f9fb" rx="8" />
      {/* shank (calf), gray, tapering to the ankle */}
      <path
        d="M68 18 C 65 44, 66 66, 72 84 L 88 84 C 94 66, 95 44, 92 18 Z"
        fill="#d5dbe3"
      />
      {/* vertical reference through the ankle */}
      <line x1="80" y1="84" x2="80" y2="138" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 3" />
      {/* calcaneus / heel, tilted (everted) */}
      <g transform="rotate(17 80 92)">
        <path
          d="M72 84
             C 69 100, 71 118, 80 124
             C 89 118, 91 100, 88 84 Z"
          fill="#2563eb"
          opacity="0.9"
        />
        {/* ground */}
        <ellipse cx="80" cy="126" rx="15" ry="4" fill="#2563eb" opacity="0.35" />
      </g>
      <path d="M80 104 A 22 22 0 0 0 91 114" fill="none" stroke="#ea580c" strokeWidth="2" />
      <text x="94" y="116" fontSize="12" fill="#ea580c" fontWeight="700">θ</text>
    </svg>
  )
}
