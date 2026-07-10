import { useRef, useState } from 'react'
import { VideoStage } from './VideoStage'
import { useGaitSession } from '../hooks/useGaitSession'
import { MetricsPanel } from './MetricsPanel'
import { FrontalMetricsPanel } from './FrontalMetricsPanel'
import { GaitCharts, GaitReport } from './GaitReport'
import { FrontalReport } from './FrontalReport'
import { buildSagittalFrames, summarizeSagittal } from '../lib/gaitMetrics'
import { summarizeFrontal } from '../lib/frontalMetrics'
import type { ViewMode } from '../lib/rawFrame'
import type { PoseModel } from '../lib/pose'

interface Props {
  view: ViewMode
  model: PoseModel
  swapSides: boolean
  treadmill: boolean
}

export function LiveCamera({ view, model, swapSides, treadmill }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [streaming, setStreaming] = useState(false)
  const [recording, setRecording] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { ready, liveSagittal, liveFrontal, frames, frameCount, resetFrames } = useGaitSession({
    videoRef,
    canvasRef,
    view,
    model,
    swapSides,
    recording,
    active: streaming,
  })

  async function start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setStreaming(true)
      setError(null)
    } catch {
      setError('카메라 접근에 실패했습니다. 브라우저 카메라 권한을 확인하세요.')
    }
  }

  function stop() {
    const stream = videoRef.current?.srcObject as MediaStream | null
    stream?.getTracks().forEach((track) => track.stop())
    if (videoRef.current) videoRef.current.srcObject = null
    setStreaming(false)
    setRecording(false)
  }

  function toggleRecording() {
    if (!recording) resetFrames()
    setRecording((r) => !r)
  }

  const done = !recording && frames.length > 0
  const sagittalSummary =
    done && view === 'sagittal' ? summarizeSagittal(frames, swapSides, { treadmill }) : null
  const frontalSummary = done && view === 'frontal' ? summarizeFrontal(frames, swapSides) : null

  return (
    <div className="panel">
      <VideoStage videoRef={videoRef} canvasRef={canvasRef} />
      <div className="controls">
        {!streaming && <button onClick={start}>카메라 시작</button>}
        {streaming && (
          <button className="secondary" onClick={stop}>
            카메라 정지
          </button>
        )}
        {streaming && (
          <button onClick={toggleRecording} disabled={!ready}>
            {recording ? `측정 종료 (${frameCount} 프레임 기록됨)` : '보행 측정 시작'}
          </button>
        )}
      </div>
      {error && <p className="error">{error}</p>}
      {!ready && <p className="hint">분석 모델을 불러오는 중입니다...</p>}
      {view === 'sagittal' && liveSagittal && <MetricsPanel angles={liveSagittal} />}
      {view === 'frontal' && liveFrontal && <FrontalMetricsPanel f={liveFrontal} />}
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
