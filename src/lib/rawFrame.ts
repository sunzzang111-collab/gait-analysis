import type { Point2D } from './landmarks'

/** One landmark: image-normalized position plus MediaPipe visibility (0–1). */
export interface Landmark extends Point2D {
  v: number
}

/** One captured pose: timestamp (s) plus the raw 33 landmarks. */
export interface RawFrame {
  t: number
  lm: Landmark[]
}

export type ViewMode = 'sagittal' | 'frontal' | 'foot'

/** Minimum landmark visibility to trust a measurement using it. */
export const MIN_VISIBILITY = 0.5

/** True when every listed landmark index is present and above the visibility floor. */
export function landmarksVisible(lm: Landmark[], indices: number[]): boolean {
  return indices.every((i) => lm[i] && lm[i].v >= MIN_VISIBILITY)
}
