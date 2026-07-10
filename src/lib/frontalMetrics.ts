import { LM, angleAt, type Point2D } from './landmarks'
import { landmarksVisible, type Landmark, type RawFrame } from './rawFrame'
import { movingAverage, percentile, meanOf } from './stats'

// Landmarks that must be visible to trust a frontal-plane frame.
const FRONTAL_CORE = [
  LM.LEFT_HIP,
  LM.RIGHT_HIP,
  LM.LEFT_KNEE,
  LM.RIGHT_KNEE,
  LM.LEFT_ANKLE,
  LM.RIGHT_ANKLE,
]

// Frontal-plane (front/rear view) gait measures. Image coords are normalized
// with x to the right and y downward, so "vertical, downward" is (0, +1).

export interface FrontalFrame {
  t: number
  /** Frontal-plane knee alignment, degrees from straight. + = valgus (knee toward midline), − = varus. */
  kneeValgusL: number
  kneeValgusR: number
  /** Rearfoot (calcaneus) tilt from vertical, degrees. Approximate pronation/eversion indicator. */
  rearfootL: number
  rearfootR: number
  /** Pelvic obliquity: hip-line tilt from horizontal, degrees (signed). */
  pelvicObliquity: number
  /** Trunk lateral lean from vertical, degrees (signed, + = leaning to image-right). */
  trunkLean: number
  /** Ankle horizontal separation ÷ shoulder width (dimensionless base-of-support proxy). */
  stepWidthRel: number
}

function midpoint(a: Point2D, b: Point2D): Point2D {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}

/** Signed angle of vector from->to measured from the downward vertical, degrees. + = tilts image-right. */
function angleFromVertical(from: Point2D, to: Point2D): number {
  const dx = to.x - from.x
  const dy = to.y - from.y
  return (Math.atan2(dx, dy) * 180) / Math.PI
}

/**
 * Tilt of the line from->to relative to horizontal, folded into [-90, 90] so a
 * level line reads 0 regardless of which end is passed first. + / − indicate
 * the two drop directions.
 */
function tiltFromHorizontal(from: Point2D, to: Point2D): number {
  let a = (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI
  while (a > 90) a -= 180
  while (a < -90) a += 180
  return a
}

/** Lateral lean of the torso (hip→shoulder) from the upright vertical, degrees. + = leans image-right. */
function trunkLeanDeg(hipMid: Point2D, shoulderMid: Point2D): number {
  return (Math.atan2(shoulderMid.x - hipMid.x, hipMid.y - shoulderMid.y) * 180) / Math.PI
}

/**
 * Frontal-plane knee alignment. Magnitude is the deviation of hip-knee-ankle
 * from a straight line; sign is + when the knee deviates toward the body
 * midline (dynamic valgus) and − when it bows outward (varus).
 */
function signedKneeValgus(hip: Point2D, knee: Point2D, ankle: Point2D, midX: number): number {
  const magnitude = 180 - angleAt(hip, knee, ankle)
  if (!Number.isFinite(magnitude)) return NaN
  // Horizontal position of the hip→ankle line at the knee's height.
  const span = ankle.y - hip.y
  const t = Math.abs(span) < 1e-6 ? 0 : (knee.y - hip.y) / span
  const lineX = hip.x + t * (ankle.x - hip.x)
  const dev = knee.x - lineX
  const towardMid = Math.sign(midX - lineX) === Math.sign(dev)
  return towardMid ? magnitude : -magnitude
}

export function computeFrontalFrame(lm: Landmark[], t: number, swapSides: boolean): FrontalFrame | null {
  if (!landmarksVisible(lm, FRONTAL_CORE)) return null
  const shoulderL = lm[LM.LEFT_SHOULDER]
  const shoulderR = lm[LM.RIGHT_SHOULDER]
  const hipL = lm[LM.LEFT_HIP]
  const hipR = lm[LM.RIGHT_HIP]
  const kneeL = lm[LM.LEFT_KNEE]
  const kneeR = lm[LM.RIGHT_KNEE]
  const ankleL = lm[LM.LEFT_ANKLE]
  const ankleR = lm[LM.RIGHT_ANKLE]
  const heelL = lm[LM.LEFT_HEEL]
  const heelR = lm[LM.RIGHT_HEEL]
  if (!shoulderL || !hipR || !ankleL || !heelR) return null

  const midX = (hipL.x + hipR.x) / 2
  const shoulderWidth = Math.abs(shoulderL.x - shoulderR.x) || 1e-6

  const valgusLeft = signedKneeValgus(hipL, kneeL, ankleL, midX)
  const valgusRight = signedKneeValgus(hipR, kneeR, ankleR, midX)
  // Rearfoot tilt: calcaneus (ankle→heel) deviation from vertical, magnitude.
  const rearLeft = Math.abs(angleFromVertical(ankleL, heelL))
  const rearRight = Math.abs(angleFromVertical(ankleR, heelR))

  const pelvicObliquity = tiltFromHorizontal(hipL, hipR)
  const trunkLean = trunkLeanDeg(midpoint(hipL, hipR), midpoint(shoulderL, shoulderR))
  const stepWidthRel = Math.abs(ankleL.x - ankleR.x) / shoulderWidth

  const frame: FrontalFrame = {
    t,
    kneeValgusL: valgusLeft,
    kneeValgusR: valgusRight,
    rearfootL: rearLeft,
    rearfootR: rearRight,
    pelvicObliquity,
    trunkLean,
    stepWidthRel,
  }
  if (!swapSides) return frame
  return {
    ...frame,
    kneeValgusL: frame.kneeValgusR,
    kneeValgusR: frame.kneeValgusL,
    rearfootL: frame.rearfootR,
    rearfootR: frame.rearfootL,
    pelvicObliquity: -frame.pelvicObliquity,
    trunkLean: -frame.trunkLean,
  }
}

export interface FrontalSummary {
  durationSec: number
  /** Peak dynamic valgus (max positive deviation toward midline), degrees. */
  peakValgus: { left: number | null; right: number | null; symmetryPct: number | null }
  /** Peak rearfoot tilt, degrees. */
  peakRearfoot: { left: number | null; right: number | null; symmetryPct: number | null }
  /** Peak pelvic drop (max |obliquity|) and mean, degrees. */
  pelvicDropPeak: number | null
  /** Trunk lateral sway = range of lean, and peak |lean|, degrees. */
  trunkSwayRange: number | null
  trunkLeanPeak: number | null
  /** Mean base-of-support (ankle sep ÷ shoulder width). */
  stepWidthRelMean: number | null
}

// Robust "peak" = 90th percentile after smoothing, so a single jittery frame
// can't inflate the reported value. Applied to positive-direction series.
function robustPeak(xs: number[]): number | null {
  return percentile(movingAverage(xs, 5), 90)
}

/** Robust peak of |x|: smooth, take magnitude, then 90th percentile. */
function robustPeakAbs(xs: number[]): number | null {
  return percentile(movingAverage(xs, 5).map((v) => (Number.isFinite(v) ? Math.abs(v) : NaN)), 90)
}

function symmetryPct(l: number | null, r: number | null): number | null {
  if (l == null || r == null || l + r === 0) return null
  return (Math.abs(l - r) / (0.5 * Math.abs(l + r))) * 100
}

export function computeFrontalFrames(raw: RawFrame[], swapSides: boolean): FrontalFrame[] {
  return raw
    .map((r) => computeFrontalFrame(r.lm, r.t, swapSides))
    .filter((f): f is FrontalFrame => f !== null)
}

export function summarizeFrontal(raw: RawFrame[], swapSides: boolean): FrontalSummary | null {
  const frames = computeFrontalFrames(raw, swapSides)
  if (frames.length < 3) return null
  const durationSec = frames[frames.length - 1].t - frames[0].t

  const valgusL = robustPeak(frames.map((f) => f.kneeValgusL))
  const valgusR = robustPeak(frames.map((f) => f.kneeValgusR))
  const rearL = robustPeak(frames.map((f) => f.rearfootL))
  const rearR = robustPeak(frames.map((f) => f.rearfootR))
  const leansSmooth = movingAverage(frames.map((f) => f.trunkLean), 5).filter((v) => Number.isFinite(v))

  return {
    durationSec,
    peakValgus: { left: valgusL, right: valgusR, symmetryPct: symmetryPct(valgusL, valgusR) },
    peakRearfoot: { left: rearL, right: rearR, symmetryPct: symmetryPct(rearL, rearR) },
    pelvicDropPeak: robustPeakAbs(frames.map((f) => f.pelvicObliquity)),
    trunkSwayRange: leansSmooth.length ? Math.max(...leansSmooth) - Math.min(...leansSmooth) : null,
    trunkLeanPeak: robustPeakAbs(frames.map((f) => f.trunkLean)),
    stepWidthRelMean: meanOf(frames.map((f) => f.stepWidthRel)),
  }
}
