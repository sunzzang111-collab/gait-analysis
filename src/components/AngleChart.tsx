import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { GaitFrame } from '../lib/gaitMetrics'

interface Props {
  title: string
  frames: GaitFrame[]
  leftKey: 'leftKnee' | 'leftHip' | 'leftAnkle'
  rightKey: 'rightKnee' | 'rightHip' | 'rightAnkle'
}

export function AngleChart({ title, frames, leftKey, rightKey }: Props) {
  const data = frames.map((f) => ({
    t: Number(f.t.toFixed(2)),
    left: Number(f.angles[leftKey].toFixed(1)),
    right: Number(f.angles[rightKey].toFixed(1)),
  }))

  return (
    <div className="angle-chart">
      <h4>{title}</h4>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e6e8ec" />
          <XAxis dataKey="t" tick={{ fontSize: 11, fill: '#6b7280' }} stroke="#d6d9de" label={{ value: '초', position: 'insideBottomRight', fontSize: 11, fill: '#6b7280' }} />
          <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} stroke="#d6d9de" unit="°" width={40} />
          <Tooltip formatter={(v) => `${v}°`} labelFormatter={(v) => `${v}s`} />
          <Legend />
          <Line type="monotone" dataKey="left" name="좌" stroke="#2563eb" dot={false} strokeWidth={2} />
          <Line type="monotone" dataKey="right" name="우" stroke="#ea580c" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
