import { useRef, useState } from 'react'
import { VideoStage } from './VideoStage'
import { useGaitSession } from '../hooks/useGaitSession'
import { MetricsPanel } from './MetricsPanel'
import { GaitCharts, GaitReport } from './GaitReport'
import { summarize } from '../lib/gaitMetrics'

export function LiveCamera({ swapSides }: { swapSides: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [streaming, setStreaming] = useState(false)
  const [recording, setRecording] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { ready, liveAngles, frames, frameCount, resetFrames } = useGaitSession({
    videoRef,
    canvasRef,
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

  const summary = !recording && frames.length > 0 ? summarize(frames) : null

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
      {liveAngles && <MetricsPanel angles={liveAngles} />}
      {summary && (
        <>
          <GaitReport frames={frames} summary={summary} />
          <GaitCharts frames={frames} />
        </>
      )}
    </div>
  )
}
