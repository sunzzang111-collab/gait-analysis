import {
  FilesetResolver,
  PoseLandmarker,
  type PoseLandmarkerResult,
} from '@mediapipe/tasks-vision'

const WASM_BASE =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm'

const MODEL_URLS = {
  // Higher accuracy, a bit heavier — the default for clinical reference use.
  full: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task',
  // Lighter/faster fallback for low-powered devices.
  lite: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
} as const

export type PoseModel = keyof typeof MODEL_URLS

const cache = new Map<PoseModel, Promise<PoseLandmarker>>()

/** Lazily creates (and caches) a PoseLandmarker for the requested model, in VIDEO mode. */
export function getPoseLandmarker(model: PoseModel = 'full'): Promise<PoseLandmarker> {
  const existing = cache.get(model)
  if (existing) return existing

  const created = (async () => {
    const vision = await FilesetResolver.forVisionTasks(WASM_BASE)
    const modelAssetPath = MODEL_URLS[model]
    try {
      return await PoseLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath, delegate: 'GPU' },
        runningMode: 'VIDEO',
        numPoses: 1,
        minPoseDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6,
      })
    } catch {
      // Some devices/browsers lack a working WebGL backend for the GPU delegate.
      return PoseLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath, delegate: 'CPU' },
        runningMode: 'VIDEO',
        numPoses: 1,
        minPoseDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6,
      })
    }
  })()

  cache.set(model, created)
  return created
}

export type { PoseLandmarkerResult }
export { PoseLandmarker }
