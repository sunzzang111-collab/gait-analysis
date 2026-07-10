/** Shows a few representative annotated frames from the analysis as visual evidence. */
export function CaptureStrip({ snapshots, max = 4 }: { snapshots: string[]; max?: number }) {
  // Evenly sample up to `max` frames across the recording.
  const picked: string[] =
    snapshots.length <= max
      ? snapshots
      : Array.from({ length: max }, (_, i) =>
          snapshots[Math.round((i * (snapshots.length - 1)) / (max - 1))],
        )

  return (
    <div className="capture-strip">
      <h4>분석 캡처 (스켈레톤 오버레이)</h4>
      {picked.length ? (
        <div className="capture-strip__row">
          {picked.map((src, i) => (
            <figure key={i} className="capture-strip__item">
              <img src={src} alt={`분석 프레임 ${i + 1}`} />
              <figcaption>#{i + 1}</figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div className="capture-strip__placeholder">
          측정 중 자동 캡처된 분석 프레임(스켈레톤 오버레이)이 이 자리에 삽입됩니다.
          <br />
          상단 설정의 “결과지에 분석 캡처 이미지 포함”이 켜져 있어야 합니다.
        </div>
      )}
    </div>
  )
}
