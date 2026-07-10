import { useState } from 'react'

/** Saves the current result to local history, with brief confirmation feedback. */
export function SaveResultButton({ onSave }: { onSave: () => void }) {
  const [saved, setSaved] = useState(false)
  return (
    <div className="controls save-row">
      <button
        className="secondary"
        onClick={() => {
          onSave()
          setSaved(true)
          setTimeout(() => setSaved(false), 2500)
        }}
      >
        {saved ? '✓ 저장됨' : '이 측정 기록 저장'}
      </button>
    </div>
  )
}
