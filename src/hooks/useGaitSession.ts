import { useCallback, useEffect, useRef, useState } from 'react'
import { DrawingUtils, PoseLandmarker } from '@mediapipe/tasks-vision'
import { getPoseLandmarker, type PoseModel } from '../lib/pose'
import { computeJointAngles, type JointAngles } from '../lib/gaitMetrics'
import { computeFrontalFrame, type FrontalFrame } from '../lib/frontalMetrics'
import type { Landmark, RawFrame, ViewMode } from '../lib/rawFrame'

interface Options {
  videoRef: React.RefObject<HTMLVideoElement | null>
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  /** Which plane is being filmed. */
  view: ViewMode
  /** Pose model quality (accuracy vs speed). */
  model: PoseModel
  /** Correct for a mirrored (selfie-mode) camera feed. */
  swapSides: boolean
  /** While true, detected frames are appended to the session buffer. */
  recording: boolean
  /** Whether the video source is actively producing frames. */
  active: boolean
  /** Capture representative annotated frames (video + skeleton) for the report. */
  captureImages: boolean
}

const SNAPSHOT_INTERVAL_SEC = 0.8
const MAX_SNAPSHOTS = 30

export function useGaitSession({
  videoRef,
  canvasRef,
  view,
  model,
  swapSides,
  recording,
  active,
  captureImages,
}: Options) {
  const [ready, setReady] = useState(false)
  const [liveSagittal, setLiveSagittal] = useState<JointAngles | null>(null)
  const [liveFrontal, setLiveFrontal] = useState<FrontalFrame | null>(null)
  const framesRef = useRef<RawFrame[]>([])
  const [frameCount, setFrameCount] = useState(0)
  const recordStartRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  // Annotated snapshots (JPEG data URLs) captured during recording.
  const snapshotsRef = useRef<string[]>([])
  const lastSnapRef = useRef<number>(-Infinity)
  const snapCanvasRef = useRef<HTMLCanvasElement | null>(null)

  const resetFrames = useCallback(() => {
    framesRef.current = []
    recordStartRef.current = null
    snapshotsRef.current = []
    lastSnapRef.current = -Infinity
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
        const landmarker = await getPoseLandmarker(model)
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
          const raw = result.landmarks[0]
          if (raw) {
            drawer.drawConnectors(raw, PoseLandmarker.POSE_CONNECTIONS, {
              color: '#22d3ee',
              lineWidth: 3,
            })
            drawer.drawLandmarks(raw, { color: '#f97316', radius: 3 })

            if (recordStartRef.current === null) recordStartRef.current = video.currentTime
            const t = video.currentTime - recordStartRef.current
            const lm: Landmark[] = raw.map((p) => ({ x: p.x, y: p.y, v: p.visibility ?? 1 }))

            if (view === 'sagittal') {
              const angles = computeJointAngles(lm, swapSides)
              if (angles) setLiveSagittal(angles)
            } else {
              const ff = computeFrontalFrame(lm, t, swapSides)
              if (ff) setLiveFrontal(ff)
            }

            if (recording) {
              framesRef.current.push({ t, lm })
              setFrameCount(framesRef.current.length)

              // Composite the video frame + skeleton overlay into a snapshot.
              if (
                captureImages &&
                snapshotsRef.current.length < MAX_SNAPSHOTS &&
                t - lastSnapRef.current >= SNAPSHOT_INTERVAL_SEC
              ) {
                const snap = snapCanvasRef.current ?? document.createElement('canvas')
                snapCanvasRef.current = snap
                snap.width = video.videoWidth
                snap.height = video.videoHeight
                const sctx = snap.getContext('2d')
                if (sctx) {
                  sctx.drawImage(video, 0, 0, snap.width, snap.height)
                  sctx.drawImage(canvas, 0, 0, snap.width, snap.height)
                  snapshotsRef.current.push(snap.toDataURL('image/jpeg', 0.7))
                  lastSnapRef.current = t
                }
              }
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
  }, [ready, active, recording, view, model, swapSides, captureImages, videoRef, canvasRef])

  return {
    ready,
    liveSagittal,
    liveFrontal,
    frames: framesRef.current,
    snapshots: snapshotsRef.current,
    frameCount,
    resetFrames,
  }
}
