import { REFERENCES, refUrl } from '../lib/references'

export function ReferencesSection() {
  return (
    <section className="references">
      <details>
        <summary>정확도·한계 및 참고문헌</summary>

        <div className="references__body">
          <h4>측정 방법의 한계 (반드시 참고)</h4>
          <p>
            이 도구는 단일 2D 카메라 + 마커리스 자세추정(MediaPipe)을 사용합니다. 검증 연구에 따르면
            이 방식은 <strong>보행 시간·공간 지표(케이던스·보폭 등)는 임상적으로 쓸 만하지만</strong>,
            관절 각도 오차가 시상면(옆모습)에서 엉덩이 ~4°, 무릎 ~5.6°, 발목 ~7.4° 수준이며
            <strong> 정면 평면(골반 하강·무릎 외반·회내·몸통 기울기)은 오차가 더 크고 아직 임상적
            정확도에 이르지 못했습니다</strong>. 따라서 후면 지표는 측정값이 아니라{' '}
            <strong>선별·상대 비교용 스크리닝 지표</strong>로만 해석하세요 (Stenum 2021; Wade 2022;
            Needham 2021).
          </p>

          <h4>색상 기준의 근거 등급</h4>
          <ul>
            <li>
              <strong>골반 하강 · 무릎 외반 · 케이던스</strong>: 아래 논문 값에 근거해 설정(근거 기반).
              단, 무릎 외반은 8° 미만 차이가 측정오차 범위라는 점에 유의.
            </li>
            <li>
              <strong>회내 · 측방 몸통 흔들림 · 좌우 대칭 %</strong>: 방향성은 근거가 있으나 정확한
              각도/퍼센트 컷오프는 검증되지 않아 <strong>임의(휴리스틱) 기준</strong>으로 표시합니다.
            </li>
          </ul>

          <h4>참고문헌</h4>
          <ol className="references__list">
            {REFERENCES.map((r) => (
              <li key={r.id}>
                {r.citation}{' '}
                <a href={refUrl(r)} target="_blank" rel="noreferrer">
                  {r.doi ? `doi:${r.doi}` : r.pmid ? `PMID ${r.pmid}` : '링크'}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </details>
    </section>
  )
}
