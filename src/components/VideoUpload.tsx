import { useRef, useState } from 'react'
import { VideoStage } from './VideoStage'
import { useGaitSession } from '../hooks/useGaitSession'
import { GaitCharts, GaitReport } from './GaitReport'
import { FrontalReport } from './FrontalReport'
import { FootReport } from './FootReport'
import { CaptureStrip } from './CaptureStrip'
import { SaveResultButton } from './SaveResultButton'
import { buildSagittalFrames, summarizeSagittal } from '../lib/gaitMetrics'
import { summarizeFrontal } from '../lib/frontalMetrics'
import { summarizeFoot } from '../lib/footMetrics'
import { footMetricList, frontalMetricList, sagittalMetrics, type RecordInput } from '../lib/records'
import type { ViewMode } from '../lib/rawFrame'
import type { PoseModel } from '../lib/pose'

interface Props {
  view: ViewMode
  model: PoseModel
  swapSides: boolean
  treadmill: boolean
  treadmillSpeed: number
  captureImages: boolean
  memo: string
  onSave: (r: RecordInput) => void
}

export function VideoUpload({
  view,
  model,
  swapSides,
  treadmill,
  treadmillSpeed,
  captureImages,
  memo,
  onSave,
}: Props) {
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
  const footSummary = ready2 && view === 'foot' ? summarizeFoot(frames, swapSides) : null

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
          <SaveResultButton
            onSave={() =>
              onSave({ memo, view, treadmill, metrics: sagittalMetrics(sagittalSummary) })
            }
          />
        </>
      )}
      {frontalSummary && (
        <>
          <FrontalReport summary={frontalSummary} />
          <CaptureStrip snapshots={snapshots} />
          <SaveResultButton
            onSave={() =>
              onSave({ memo, view, treadmill, metrics: frontalMetricList(frontalSummary) })
            }
          />
        </>
      )}
      {footSummary && (
        <>
          <FootReport summary={footSummary} />
          <CaptureStrip snapshots={snapshots} />
          <SaveResultButton
            onSave={() => onSave({ memo, view, treadmill, metrics: footMetricList(footSummary) })}
          />
        </>
      )}
    </div>
  )
}
