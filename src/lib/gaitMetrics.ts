import { LM, angleAt, type Point2D } from './landmarks'

export interface JointAngles {
  leftKnee: number
  rightKnee: number
  leftHip: number
  rightHip: number
  leftAnkle: number
  rightAnkle: number
}

export interface GaitFrame {
  /** seconds since recording start */
  t: number
  angles: JointAngles
  leftAnkle: Point2D
  rightAnkle: Point2D
  /** hip-to-ankle pixel distance, used as a scale-free reference for the leg */
  legScale: number
}

/**
 * Computes joint angles for one pose snapshot.
 * `swapSides` corrects for a mirrored (selfie-mode) camera feed, where
 * MediaPipe's anatomical left/right is flipped relative to the viewer.
 */
export function computeJointAngles(
  landmarks: Point2D[],
  swapSides: boolean,
): JointAngles | null {
  const get = (i: number) => landmarks[i]
  if (!get(LM.LEFT_HIP) || !get(LM.RIGHT_ANKLE)) return null

  const leftKnee = angleAt(get(LM.LEFT_HIP), get(LM.LEFT_KNEE), get(LM.LEFT_ANKLE))
  const rightKnee = angleAt(get(LM.RIGHT_HIP), get(LM.RIGHT_KNEE), get(LM.RIGHT_ANKLE))
  const leftHip = angleAt(get(LM.LEFT_SHOULDER), get(LM.LEFT_HIP), get(LM.LEFT_KNEE))
  const rightHip = angleAt(get(LM.RIGHT_SHOULDER), get(LM.RIGHT_HIP), get(LM.RIGHT_KNEE))
  const leftAnkle = angleAt(get(LM.LEFT_KNEE), get(LM.LEFT_ANKLE), get(LM.LEFT_FOOT_INDEX))
  const rightAnkle = angleAt(get(LM.RIGHT_KNEE), get(LM.RIGHT_ANKLE), get(LM.RIGHT_FOOT_INDEX))

  const raw: JointAngles = { leftKnee, rightKnee, leftHip, rightHip, leftAnkle, rightAnkle }
  if (!swapSides) return raw
  return {
    leftKnee: raw.rightKnee,
    rightKnee: raw.leftKnee,
    leftHip: raw.rightHip,
    rightHip: raw.leftHip,
    leftAnkle: raw.rightAnkle,
    rightAnkle: raw.leftAnkle,
  }
}

export function buildFrame(
  landmarks: Point2D[],
  t: number,
  swapSides: boolean,
): GaitFrame | null {
  const angles = computeJointAngles(landmarks, swapSides)
  if (!angles) return null
  const hip = landmarks[LM.LEFT_HIP]
  const ankleL = swapSides ? landmarks[LM.RIGHT_ANKLE] : landmarks[LM.LEFT_ANKLE]
  const ankleR = swapSides ? landmarks[LM.LEFT_ANKLE] : landmarks[LM.RIGHT_ANKLE]
  const legScale = Math.hypot(hip.x - ankleL.x, hip.y - ankleL.y) || 1
  return { t, angles, leftAnkle: ankleL, rightAnkle: ankleR, legScale }
}

interface StepEvent {
  t: number
  x: number
}

/** Finds local maxima (image-y, i.e. foot-near-ground moments) with a refractory gap. */
function detectStepEvents(
  frames: GaitFrame[],
  side: 'leftAnkle' | 'rightAnkle',
  minGapSec = 0.25,
): StepEvent[] {
  const ys = frames.map((f) => f[side].y)
  const events: StepEvent[] = []
  let lastT = -Infinity
  for (let i = 1; i < ys.length - 1; i++) {
    const isPeak = ys[i] >= ys[i - 1] && ys[i] >= ys[i + 1]
    if (isPeak && frames[i].t - lastT >= minGapSec) {
      events.push({ t: frames[i].t, x: frames[i][side].x })
      lastT = frames[i].t
    }
  }
  return events
}

export interface GaitSummary {
  durationSec: number
  cadenceStepsPerMin: number
  leftStepCount: number
  rightStepCount: number
  leftStepTimeSec: number | null
  rightStepTimeSec: number | null
  stepTimeSymmetryPct: number | null
  relativeStepLength: {
    left: number | null
    right: number | null
    symmetryPct: number | null
  }
  romSymmetryPct: {
    knee: number | null
    hip: number | null
    ankle: number | null
  }
  rom: {
    leftKnee: number
    rightKnee: number
    leftHip: number
    rightHip: number
    leftAnkle: number
    rightAnkle: number
  }
}

function mean(xs: number[]): number | null {
  const valid = xs.filter((x) => Number.isFinite(x))
  if (!valid.length) return null
  return valid.reduce((a, b) => a + b, 0) / valid.length
}

function avgGap(events: StepEvent[]): number | null {
  if (events.length < 2) return null
  const gaps = []
  for (let i = 1; i < events.length; i++) gaps.push(events[i].t - events[i - 1].t)
  return mean(gaps)
}

function symmetryPct(l: number | null, r: number | null): number | null {
  if (l == null || r == null || l + r === 0) return null
  return (Math.abs(l - r) / (0.5 * (l + r))) * 100
}

function rangeOf(frames: GaitFrame[], pick: (a: JointAngles) => number): number {
  const vals = frames.map((f) => pick(f.angles)).filter((v) => Number.isFinite(v))
  if (!vals.length) return NaN
  return Math.max(...vals) - Math.min(...vals)
}

export function summarize(frames: GaitFrame[]): GaitSummary | null {
  if (frames.length < 4) return null
  const durationSec = frames[frames.length - 1].t - frames[0].t
  if (durationSec <= 0) return null

  const leftEvents = detectStepEvents(frames, 'leftAnkle')
  const rightEvents = detectStepEvents(frames, 'rightAnkle')
  const totalSteps = leftEvents.length + rightEvents.length
  const cadenceStepsPerMin = (totalSteps / durationSec) * 60

  const leftStepTimeSec = avgGap(leftEvents)
  const rightStepTimeSec = avgGap(rightEvents)

  const legScale = mean(frames.map((f) => f.legScale)) || 1
  const leftStepDist = mean(
    leftEvents.slice(1).map((e, i) => Math.abs(e.x - leftEvents[i].x)),
  )
  const rightStepDist = mean(
    rightEvents.slice(1).map((e, i) => Math.abs(e.x - rightEvents[i].x)),
  )
  const relLeft = leftStepDist != null ? leftStepDist / legScale : null
  const relRight = rightStepDist != null ? rightStepDist / legScale : null

  const rom = {
    leftKnee: rangeOf(frames, (a) => a.leftKnee),
    rightKnee: rangeOf(frames, (a) => a.rightKnee),
    leftHip: rangeOf(frames, (a) => a.leftHip),
    rightHip: rangeOf(frames, (a) => a.rightHip),
    leftAnkle: rangeOf(frames, (a) => a.leftAnkle),
    rightAnkle: rangeOf(frames, (a) => a.rightAnkle),
  }

  return {
    durationSec,
    cadenceStepsPerMin,
    leftStepCount: leftEvents.length,
    rightStepCount: rightEvents.length,
    leftStepTimeSec,
    rightStepTimeSec,
    stepTimeSymmetryPct: symmetryPct(leftStepTimeSec, rightStepTimeSec),
    relativeStepLength: {
      left: relLeft,
      right: relRight,
      symmetryPct: symmetryPct(relLeft, relRight),
    },
    romSymmetryPct: {
      knee: symmetryPct(rom.leftKnee, rom.rightKnee),
      hip: symmetryPct(rom.leftHip, rom.rightHip),
      ankle: symmetryPct(rom.leftAnkle, rom.rightAnkle),
    },
    rom,
  }
}
