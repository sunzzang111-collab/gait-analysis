import type { Point2D } from './landmarks'

/** One captured pose: timestamp (s) plus the raw 33 landmarks in image-normalized coords. */
export interface RawFrame {
  t: number
  lm: Point2D[]
}

export type ViewMode = 'sagittal' | 'frontal'
