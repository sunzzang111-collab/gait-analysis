// Small numeric helpers shared by the metric summaries.

/** Moving-average smoothing over a numeric series (window is odd; NaNs ignored). */
export function movingAverage(xs: number[], window = 5): number[] {
  const half = Math.floor(window / 2)
  return xs.map((_, i) => {
    let sum = 0
    let n = 0
    for (let j = i - half; j <= i + half; j++) {
      const v = xs[j]
      if (j >= 0 && j < xs.length && Number.isFinite(v)) {
        sum += v
        n++
      }
    }
    return n ? sum / n : NaN
  })
}

/** p-th percentile (0–100) of finite values; null if none. Robust alternative to max/min. */
export function percentile(xs: number[], p: number): number | null {
  const valid = xs.filter((x) => Number.isFinite(x)).sort((a, b) => a - b)
  if (!valid.length) return null
  const idx = (p / 100) * (valid.length - 1)
  const lo = Math.floor(idx)
  const hi = Math.ceil(idx)
  if (lo === hi) return valid[lo]
  return valid[lo] + (valid[hi] - valid[lo]) * (idx - lo)
}

export function meanOf(xs: number[]): number | null {
  const valid = xs.filter((x) => Number.isFinite(x))
  if (!valid.length) return null
  return valid.reduce((a, b) => a + b, 0) / valid.length
}
