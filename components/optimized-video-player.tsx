"use client"

import { useRef, useEffect, useState } from "react"
import { PixelLoadingSpinner } from "./pixel-loading-spinner"

interface OptimizedVideoPlayerProps {
  src: string
  shouldAutoplay?: boolean
  className?: string
  blurDataURL?: string
}

export function OptimizedVideoPlayer({
  src,
  shouldAutoplay = false,
  className,
  blurDataURL,
}: OptimizedVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  // Intersection Observer — lazy loading за 200px до viewport
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: "200px 0px",
        threshold: 0.1,
      }
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className={className}>
      {/* Placeholder - преобладающий цвет с opacity 0.05 */}
      {blurDataURL && !isVideoLoaded && (
        <>
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: blurDataURL,
            }}
          />
          {/* Loading spinner поверх placeholder */}
          {shouldLoad && (
            <div className="absolute inset-0 flex items-center justify-center">
              <PixelLoadingSpinner size={3} />
            </div>
          )}
        </>
      )}

      {/* Video */}
      {shouldLoad && (
        <video
          ref={videoRef}
          src={src}
          autoPlay={shouldAutoplay}
          loop={shouldAutoplay}
          muted
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            opacity: isVideoLoaded ? 1 : 0,
            transition: "opacity 300ms ease-in-out",
          }}
        />
      )}
    </div>
  )
}
