import { useRef, useState } from 'react'
import { VideoStage } from './VideoStage'
import { useGaitSession } from '../hooks/useGaitSession'
import { GaitCharts, GaitReport } from './GaitReport'
import { FrontalReport } from './FrontalReport'
import { CaptureStrip } from './CaptureStrip'
import { buildSagittalFrames, summarizeSagittal } from '../lib/gaitMetrics'
import { summarizeFrontal } from '../lib/frontalMetrics'
import type { ViewMode } from '../lib/rawFrame'
import type { PoseModel } from '../lib/pose'

interface Props {
  view: ViewMode
  model: PoseModel
  swapSides: boolean
  treadmill: boolean
  treadmillSpeed: number
  captureImages: boolean
}

export function VideoUpload({ view, model, swapSides, treadmill, treadmillSpeed, captureImages }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [srcUrl, setSrcUrl] = useState<string | null>(null)
  const [playing, setPlaying] = useState(false)
  const [recording, setRecording] = useState(false)
  const [done, setDone] = useState(false)

  const { ready, frames, snapshots, resetFrames } = useGaitSession({
    videoRef,
    canvasRef,
    view,
    model,
    swapSides,
    recording,
    active: playing,
    captureImages,
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
  const sagittalSummary =
    ready2 && view === 'sagittal'
      ? summarizeSagittal(frames, swapSides, { treadmill, treadmillSpeedKmh: treadmillSpeed })
      : null
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
          <CaptureStrip snapshots={snapshots} />
          <GaitCharts frames={buildSagittalFrames(frames, swapSides)} />
        </>
      )}
      {frontalSummary && (
        <>
          <FrontalReport summary={frontalSummary} />
          <CaptureStrip snapshots={snapshots} />
        </>
      )}
    </div>
  )
}
