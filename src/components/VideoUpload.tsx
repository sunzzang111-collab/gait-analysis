import { useRef, useState } from 'react'
import { VideoStage } from './VideoStage'
import { useGaitSession } from '../hooks/useGaitSession'
import { GaitCharts, GaitReport } from './GaitReport'
import { FrontalReport } from './FrontalReport'
import { buildSagittalFrames, summarizeSagittal } from '../lib/gaitMetrics'
import { summarizeFrontal } from '../lib/frontalMetrics'
import type { ViewMode } from '../lib/rawFrame'

export function VideoUpload({ view, swapSides }: { view: ViewMode; swapSides: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [srcUrl, setSrcUrl] = useState<string | null>(null)
  const [playing, setPlaying] = useState(false)
  const [recording, setRecording] = useState(false)
  const [done, setDone] = useState(false)

  const { ready, frames, resetFrames } = useGaitSession({
    videoRef,
    canvasRef,
    view,
    swapSides,
    recording,
    active: playing,
  })

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (srcUrl) URL.revokeObjectURL(srcUrl)
    setSrcUrl(URL.createObjectURL(file))
    setDone(false)
    resetFrames()
  }

  function startAnalysis() {
    const video = videoRef.current
    if (!video) return
    resetFrames()
    setDone(false)
    video.currentTime = 0
    setRecording(true)
    setPlaying(true)
    video.play()
  }

  function onEnded() {
    setPlaying(false)
    setRecording(false)
    setDone(true)
  }

  const ready2 = done && frames.length > 0
  const sagittalSummary = ready2 && view === 'sagittal' ? summarizeSagittal(frames, swapSides) : null
  const frontalSummary = ready2 && view === 'frontal' ? summarizeFrontal(frames, swapSides) : null

  return (
    <div className="panel">
      <input type="file" accept="video/*" onChange={onFile} />
      {srcUrl && (
        <>
          <VideoStage
            videoRef={videoRef}
            canvasRef={canvasRef}
            videoProps={{ src: srcUrl, onEnded, controls: false }}
          />
          <div className="controls">
            <button onClick={startAnalysis} disabled={!ready || playing}>
              {playing ? '분석 중...' : '분석 시작'}
            </button>
          </div>
          {!ready && <p className="hint">분석 모델을 불러오는 중입니다...</p>}
        </>
      )}
      {sagittalSummary && (
        <>
          <GaitReport frames={buildSagittalFrames(frames, swapSides)} summary={sagittalSummary} />
          <GaitCharts frames={buildSagittalFrames(frames, swapSides)} />
        </>
      )}
      {frontalSummary && <FrontalReport summary={frontalSummary} />}
    </div>
  )
}
