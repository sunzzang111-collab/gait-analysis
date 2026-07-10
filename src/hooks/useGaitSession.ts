import { useCallback, useEffect, useRef, useState } from 'react'
import { DrawingUtils, PoseLandmarker } from '@mediapipe/tasks-vision'
import { getPoseLandmarker } from '../lib/pose'
import { computeJointAngles, type JointAngles } from '../lib/gaitMetrics'
import { computeFrontalFrame, type FrontalFrame } from '../lib/frontalMetrics'
import type { RawFrame, ViewMode } from '../lib/rawFrame'

interface Options {
  videoRef: React.RefObject<HTMLVideoElement | null>
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  /** Which plane is being filmed. */
  view: ViewMode
  /** Correct for a mirrored (selfie-mode) camera feed. */
  swapSides: boolean
  /** While true, detected frames are appended to the session buffer. */
  recording: boolean
  /** Whether the video source is actively producing frames. */
  active: boolean
}

export function useGaitSession({ videoRef, canvasRef, view, swapSides, recording, active }: Options) {
  const [ready, setReady] = useState(false)
  const [liveSagittal, setLiveSagittal] = useState<JointAngles | null>(null)
  const [liveFrontal, setLiveFrontal] = useState<FrontalFrame | null>(null)
  const framesRef = useRef<RawFrame[]>([])
  const [frameCount, setFrameCount] = useState(0)
  const recordStartRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  const resetFrames = useCallback(() => {
    framesRef.current = []
    recordStartRef.current = null
    setFrameCount(0)
  }, [])

  useEffect(() => {
    let cancelled = false
    getPoseLandmarker().then(() => {
      if (!cancelled) setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!ready || !active) return
    let stopped = false

    const loop = async () => {
      if (stopped) return
      const video = videoRef.current
      const canvas = canvasRef.current
      if (video && canvas && video.videoWidth > 0) {
        const landmarker = await getPoseLandmarker()
        const result = landmarker.detectForVideo(video, performance.now())
        const ctx = canvas.getContext('2d')
        if (ctx) {
          if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
          }
          ctx.save()
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          const drawer = new DrawingUtils(ctx)
          const landmarks = result.landmarks[0]
          if (landmarks) {
            drawer.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS, {
              color: '#22d3ee',
              lineWidth: 3,
            })
            drawer.drawLandmarks(landmarks, { color: '#f97316', radius: 3 })

            if (recordStartRef.current === null) recordStartRef.current = video.currentTime
            const t = video.currentTime - recordStartRef.current

            if (view === 'sagittal') {
              const angles = computeJointAngles(landmarks, swapSides)
              if (angles) setLiveSagittal(angles)
            } else {
              const ff = computeFrontalFrame(landmarks, t, swapSides)
              if (ff) setLiveFrontal(ff)
            }

            if (recording) {
              framesRef.current.push({ t, lm: landmarks.map((p) => ({ x: p.x, y: p.y })) })
              setFrameCount(framesRef.current.length)
            }
          }
          ctx.restore()
        }
      }
      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => {
      stopped = true
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [ready, active, recording, view, swapSides, videoRef, canvasRef])

  return {
    ready,
    liveSagittal,
    liveFrontal,
    frames: framesRef.current,
    frameCount,
    resetFrames,
  }
}
