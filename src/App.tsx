import { useState } from 'react'
import { LiveCamera } from './components/LiveCamera'
import { VideoUpload } from './components/VideoUpload'
import { ReferencesSection } from './components/ReferencesSection'
import type { ViewMode } from './lib/rawFrame'
import type { PoseModel } from './lib/pose'

type Mode = 'live' | 'upload'

function todayStr(): string {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

function App() {
  const [mode, setMode] = useState<Mode>('live')
  const [view, setView] = useState<ViewMode>('sagittal')
  const [model, setModel] = useState<PoseModel>('full')
  const [swapSides, setSwapSides] = useState(false)
  const [treadmill, setTreadmill] = useState(false)
  const [captureImages, setCaptureImages] = useState(true)
  const [memo, setMemo] = useState('')

  return (
    <div className="app">
      <header className="app__header">
        <h1>보행 분석 (참고용)</h1>
        <p className="disclaimer">
          이 도구는 카메라 영상으로부터 추정한 보행 지표를 보여주는 <strong>참고용 소프트웨어</strong>
          입니다. 진단 기기가 아니며, 모든 수치는 의료진의 임상적 판단을 보조하는 목적으로만
          사용해야 합니다. 특히 후면(정면 평면) 지표는 측정값이 아닌 <strong>선별용 상대 지표</strong>
          로만 해석하세요.
        </p>
      </header>

      {/* Printed report header (visible only when printing / saving as PDF) */}
      <div className="print-header">
        <strong>보행 분석 결과 (참고용)</strong>
        <span>측정일시: {todayStr()}</span>
        {memo && <span>메모: {memo}</span>}
        <span>촬영: {view === 'sagittal' ? '측면' : '후면/정면'}{treadmill ? ' · 러닝머신' : ''}</span>
      </div>

      <nav className="mode-switch">
        <button className={mode === 'live' ? 'active' : ''} onClick={() => setMode('live')}>
          실시간 카메라
        </button>
        <button className={mode === 'upload' ? 'active' : ''} onClick={() => setMode('upload')}>
          영상 업로드
        </button>
        <label className="swap-toggle">
          <input
            type="checkbox"
            checked={swapSides}
            onChange={(e) => setSwapSides(e.target.checked)}
          />
          카메라가 좌우 반전(셀카 모드)됨
        </label>
      </nav>

      <div className="view-switch">
        <span className="view-switch__label">촬영 방향</span>
        <button className={view === 'sagittal' ? 'active' : ''} onClick={() => setView('sagittal')}>
          측면 (옆모습)
        </button>
        <button className={view === 'frontal' ? 'active' : ''} onClick={() => setView('frontal')}>
          후면/정면
        </button>
      </div>

      <div className="settings-row">
        <label>
          정밀도
          <select value={model} onChange={(e) => setModel(e.target.value as PoseModel)}>
            <option value="full">정밀 (권장)</option>
            <option value="lite">빠름 (저사양 기기)</option>
          </select>
        </label>
        <label className="swap-toggle">
          <input type="checkbox" checked={treadmill} onChange={(e) => setTreadmill(e.target.checked)} />
          러닝머신에서 촬영 (측면 보폭 측정 제외)
        </label>
        <label className="swap-toggle">
          <input
            type="checkbox"
            checked={captureImages}
            onChange={(e) => setCaptureImages(e.target.checked)}
          />
          결과지에 분석 캡처 이미지 포함
        </label>
        <label className="memo-field">
          환자 메모/ID
          <input
            type="text"
            value={memo}
            placeholder="예: 환자번호·비고 (선택)"
            onChange={(e) => setMemo(e.target.value)}
          />
        </label>
        <button className="secondary print-btn" onClick={() => window.print()}>
          인쇄 / PDF 저장
        </button>
      </div>

      <main>
        {mode === 'live' ? (
          <LiveCamera
            view={view}
            model={model}
            swapSides={swapSides}
            treadmill={treadmill}
            captureImages={captureImages}
          />
        ) : (
          <VideoUpload
            view={view}
            model={model}
            swapSides={swapSides}
            treadmill={treadmill}
            captureImages={captureImages}
          />
        )}
      </main>

      <footer className="app__footer">
        <p className="hint">
          {view === 'sagittal' ? (
            <>
              측면 촬영: 환자의 옆모습이 프레임에 온전히 들어오도록, 카메라를 허리 높이 정도에
              고정하고 5~10걸음 걷는 모습을 촬영하세요. 관절 각도·보폭·케이던스를 분석합니다.
            </>
          ) : (
            <>
              후면/정면 촬영: 카메라를 환자의 정후면에 수직으로 두고 걷는(또는 러닝머신 위) 모습을
              촬영하세요. 무릎 외반·회내·골반 하강·몸통 흔들림을 분석합니다. 케이던스·보폭은 측면
              촬영이 더 정확합니다.
            </>
          )}{' '}
          절대 거리(cm)는 카메라 보정 없이는 제공하지 않으며, 상대적 지표만 표시합니다.
        </p>
        <ReferencesSection />
      </footer>
    </div>
  )
}

export default App
