import { EversionIcon, FootProgressionIcon } from './FootIcons'

/** Educational illustration + text explaining the foot metrics. */
export function FootExplainer() {
  return (
    <div className="explainer">
      <h4>지표 설명</h4>
      <div className="explainer__grid">
        <figure className="explainer__item">
          <FootProgressionIcon />
          <figcaption>
            <strong>발끝 방향 (foot progression angle)</strong>
            <span>
              걷는 방향 대비 발끝이 벌어진 각도. 정상은 약간 바깥(~7°). 안쪽으로 모이면
              내족보행(in-toeing), 과도하게 벌어지면 외족보행(out-toeing)으로 봅니다.
            </span>
          </figcaption>
        </figure>

        <figure className="explainer__item">
          <EversionIcon />
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
