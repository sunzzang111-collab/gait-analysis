import { useState } from 'react'
import { LiveCamera } from './components/LiveCamera'
import { VideoUpload } from './components/VideoUpload'

type Mode = 'live' | 'upload'

function App() {
  const [mode, setMode] = useState<Mode>('live')
  const [swapSides, setSwapSides] = useState(false)

  return (
    <div className="app">
      <header className="app__header">
        <h1>보행 분석 (참고용)</h1>
        <p className="disclaimer">
          이 도구는 카메라 영상으로부터 추정한 보행 지표를 보여주는 <strong>참고용 소프트웨어</strong>
          입니다. 진단 기기가 아니며, 모든 수치는 의료진의 임상적 판단을 보조하는 목적으로만
          사용해야 합니다.
        </p>
      </header>

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

      <main>
        {mode === 'live' ? <LiveCamera swapSides={swapSides} /> : <VideoUpload swapSides={swapSides} />}
      </main>

      <footer className="app__footer">
        <p className="hint">
          권장 촬영: 환자의 옆모습(측면)이 프레임에 온전히 들어오도록, 카메라를 허리 높이 정도에
          고정하고 5~10걸음 정도 걷는 모습을 촬영하세요. 절대 거리(cm 단위 보폭 등)는 카메라
          보정 없이는 제공하지 않으며, 상대적 지표만 표시합니다.
        </p>
      </footer>
    </div>
  )
}

export default App
