import { useCallback, useState } from 'react'

const NAME_KEY = 'ga.hospitalName'
const LOGO_KEY = 'ga.hospitalLogo'
const MAX_LOGO_BYTES = 400_000 // keep the data URL comfortably within localStorage limits

/**
 * Per-clinic branding (name + logo) persisted in the browser. Empty by default;
 * each clinic sets its own once and it appears on the printed report header.
 */
export function useHospital() {
  const [name, setNameState] = useState<string>(() => localStorage.getItem(NAME_KEY) ?? '')
  const [logo, setLogoState] = useState<string>(() => localStorage.getItem(LOGO_KEY) ?? '')
  const [error, setError] = useState<string | null>(null)

  const setName = useCallback((value: string) => {
    setNameState(value)
    if (value) localStorage.setItem(NAME_KEY, value)
    else localStorage.removeItem(NAME_KEY)
  }, [])

  const setLogoFile = useCallback((file: File | undefined) => {
    setError(null)
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드할 수 있습니다.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = String(reader.result)
      if (dataUrl.length > MAX_LOGO_BYTES) {
        setError('로고 이미지가 너무 큽니다. 200KB 이하 이미지를 사용하세요.')
        return
      }
      setLogoState(dataUrl)
      localStorage.setItem(LOGO_KEY, dataUrl)
    }
    reader.readAsDataURL(file)
  }, [])

  const clearLogo = useCallback(() => {
    setLogoState('')
    localStorage.removeItem(LOGO_KEY)
  }, [])

  return { name, logo, error, setName, setLogoFile, clearLogo }
}
