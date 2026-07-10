import type { RefObject, VideoHTMLAttributes } from 'react'

interface Props {
  videoRef: RefObject<HTMLVideoElement | null>
  canvasRef: RefObject<HTMLCanvasElement | null>
  videoProps?: VideoHTMLAttributes<HTMLVideoElement>
}

export function VideoStage({ videoRef, canvasRef, videoProps }: Props) {
  return (
    <div className="video-stage">
      <video ref={videoRef} playsInline muted className="video-stage__video" {...videoProps} />
      <canvas ref={canvasRef} className="video-stage__canvas" />
    </div>
  )
}
