import { LM, type Point2D } from './landmarks'
import { landmarksVisible, type Landmark, type RawFrame } from './rawFrame'
import { movingAverage, percentile, meanOf } from './stats'

// Close-up rear/overhead foot view. Gated only on foot landmarks so it works
// even when the upper body is out of frame.
const FOOT_CORE = [
  LM.LEFT_ANKLE,
  LM.RIGHT_ANKLE,
  LM.LEFT_HEEL,
  LM.RIGHT_HEEL,
  LM.LEFT_FOOT_INDEX,
  LM.RIGHT_FOOT_INDEX,
]

export interface FootFrame {
  /** Foot progression angle: + out-toeing (toe away from midline), − in-toeing. */
  fpaLeft: number
  fpaRight: number
  /** Rearfoot (calcaneus) tilt from vertical — pronation/eversion indicator, degrees. */
  everLeft: number
  everRight: number
}

/** |angle| of vector from->to measured from the downward vertical, degrees. */
function tiltFromVertical(from: Point2D, to: Point2D): number {
  return Math.abs((Math.atan2(to.x - from.x, to.y - from.y) * 180) / Math.PI)
}

/** Signed foot progression: heel→toe axis deviation from vertical, + when toe points away from midline. */
function footProgression(heel: Point2D, toe: Point2D, midX: number): number {
  const dx = toe.x - heel.x
  const dy = toe.y - heel.y
  const len = Math.hypot(dx, dy)
  if (len < 1e-4) return NaN
  const mag = (Math.acos(Math.min(1, Math.abs(dy) / len)) * 180) / Math.PI
  const away = Math.sign(heel.x - midX) === Math.sign(dx)
  return away ? mag : -mag
}

export function computeFootFrame(lm: Landmark[], swapSides: boolean): FootFrame | null {
  if (!landmarksVisible(lm, FOOT_CORE)) return null
  const ankleL = lm[LM.LEFT_ANKLE]
  const ankleR = lm[LM.RIGHT_ANKLE]
  const heelL = lm[LM.LEFT_HEEL]
  const heelR = lm[LM.RIGHT_HEEL]
  const toeL = lm[LM.LEFT_FOOT_INDEX]
  const toeR = lm[LM.RIGHT_FOOT_INDEX]

  const midX = (ankleL.x + ankleR.x) / 2
  const frame: FootFrame = {
    fpaLeft: footProgression(heelL, toeL, midX),
    fpaRight: footProgression(heelR, toeR, midX),
    everLeft: tiltFromVertical(ankleL, heelL),
    everRight: tiltFromVertical(ankleR, heelR),
  }
  if (!swapSides) return frame
  return {
    fpaLeft: frame.fpaRight,
    fpaRight: frame.fpaLeft,
    everLeft: frame.everRight,
    everRight: frame.everLeft,
  }
}

export interface FootSummary {
  footProgression: { left: number | null; right: number | null; symmetryPct: number | null }
  eversion: { left: number | null; right: number | null; symmetryPct: number | null }
  frameCount: number
}

function symmetryPct(l: number | null, r: number | null): number | null {
  if (l == null || r == null || l + r === 0) return null
  return (Math.abs(l - r) / (0.5 * Math.abs(l + r))) * 100
}

function robustPeak(xs: number[]): number | null {
  return percentile(movingAverage(xs, 5), 90)
}

export function computeFootFrames(raw: RawFrame[], swapSides: boolean): FootFrame[] {
  return raw
    .map((r) => computeFootFrame(r.lm, swapSides))
    .filter((f): f is FootFrame => f !== null)
}

export function summarizeFoot(raw: RawFrame[], swapSides: boolean): FootSummary | null {
  const frames = computeFootFrames(raw, swapSides)
  if (frames.length < 3) return null

  const fpaL = percentile(frames.map((f) => f.fpaLeft), 50)
  const fpaR = percentile(frames.map((f) => f.fpaRight), 50)
  const everL = robustPeak(frames.map((f) => f.everLeft))
  const everR = robustPeak(frames.map((f) => f.everRight))

  return {
    footProgression: {
      left: fpaL,
      right: fpaR,
      symmetryPct: symmetryPct(fpaL != null ? Math.abs(fpaL) : null, fpaR != null ? Math.abs(fpaR) : null),
    },
    eversion: { left: everL, right: everR, symmetryPct: symmetryPct(everL, everR) },
    frameCount: meanOf([frames.length]) != null ? frames.length : 0,
  }
}
