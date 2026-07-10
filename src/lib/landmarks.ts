// BlazePose 33-point topology used by MediaPipe Pose Landmarker.
export const LM = {
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
  LEFT_HEEL: 29,
  RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31,
  RIGHT_FOOT_INDEX: 32,
} as const

export interface Point2D {
  x: number
  y: number
}

/** Angle at vertex B formed by rays B->A and B->C, in degrees [0, 180]. */
export function angleAt(a: Point2D, b: Point2D, c: Point2D): number {
  const ab = { x: a.x - b.x, y: a.y - b.y }
  const cb = { x: c.x - b.x, y: c.y - b.y }
  const dot = ab.x * cb.x + ab.y * cb.y
  const magAB = Math.hypot(ab.x, ab.y)
  const magCB = Math.hypot(cb.x, cb.y)
  if (magAB === 0 || magCB === 0) return NaN
  const cos = Math.min(1, Math.max(-1, dot / (magAB * magCB)))
  return (Math.acos(cos) * 180) / Math.PI
}
