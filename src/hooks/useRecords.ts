import { useCallback, useState } from 'react'
import type { RecordInput, SavedRecord } from '../lib/records'

const KEY = 'ga.records'
const MAX = 100

function load(): SavedRecord[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as SavedRecord[]) : []
  } catch {
    return []
  }
}

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `r_${Date.now()}_${Math.floor(Math.random() * 1e6)}`
}

/** Locally-stored measurement history (per browser) for before/after comparison. */
export function useRecords() {
  const [records, setRecords] = useState<SavedRecord[]>(() => load())

  const persist = useCallback((next: SavedRecord[]) => {
    setRecords(next)
    try {
      localStorage.setItem(KEY, JSON.stringify(next.slice(0, MAX)))
    } catch {
      /* ignore quota errors */
    }
  }, [])

  const add = useCallback(
    (input: RecordInput) => {
      const record: SavedRecord = { ...input, id: newId(), dateISO: new Date().toISOString() }
      persist([record, ...records])
      return record
    },
    [records, persist],
  )

  const remove = useCallback(
    (id: string) => persist(records.filter((r) => r.id !== id)),
    [records, persist],
  )

  return { records, add, remove }
}
