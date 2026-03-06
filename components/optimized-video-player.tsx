"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { PixelLoadingSpinner } from "./pixel-loading-spinner"

const subscribeHydration = () => () => {}

function useIsHydrated() {
  return useSyncExternalStore(subscribeHydration, () => true, () => false)
}

function isSafariUserAgent(userAgent: string) {
  return (
    /Safari/i.test(userAgent) &&
    !/(Chrome|Chromium|CriOS|Edg|OPR|Firefox|FxiOS)/i.test(userAgent)
  )
}

interface OptimizedVideoPlayerProps {
  src: string
  shouldAutoplay?: boolean
  keepMounted?: boolean
  className?: string
  preload?: "auto" | "metadata" | "none"
  forceVisible?: boolean
}

export function OptimizedVideoPlayer({
  src,
  shouldAutoplay = false,
  keepMounted = false,
  className,
  preload,
  forceVisible = false,
}: OptimizedVideoPlayerProps) {
  const isHydrated = useIsHydrated()
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasIntersected, setHasIntersected] = useState(false)
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null)
  const [playbackIssueSrc, setPlaybackIssueSrc] = useState<string | null>(null)
  const shouldLoad = shouldAutoplay || hasIntersected
  const isVideoLoaded = loadedSrc === src
  const hasPlaybackIssue = playbackIssueSrc === src

  const shouldRenderVideo =
    forceVisible ||
    shouldLoad ||
    keepMounted ||
    isVideoLoaded ||
    hasPlaybackIssue
  const isSafari =
    isHydrated &&
    typeof navigator !== "undefined" &&
    isSafariUserAgent(navigator.userAgent)

  useEffect(() => {
    if (shouldLoad || shouldRenderVideo) return

    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setHasIntersected(true)
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
  }, [shouldLoad, shouldRenderVideo])

  useEffect(() => {
    if (!shouldRenderVideo) return

    const video = videoRef.current
    if (!video) return

    if (!shouldAutoplay) {
      try {
        video.pause()
      } catch {
        // Ignore pause errors for unsupported media states.
      }
      return
    }

    const maybePromise = video.play()
    if (maybePromise && typeof maybePromise.catch === "function") {
      maybePromise.catch(() => {
        // Safari may block immediate playback while media state is transitioning.
      })
    }
  }, [shouldAutoplay, shouldRenderVideo, src])

  useEffect(() => {
    if (!isSafari || !shouldRenderVideo || isVideoLoaded || hasPlaybackIssue) return

    const timeoutId = window.setTimeout(() => {
      const video = videoRef.current
      if (!video) return

      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        setLoadedSrc(src)
        setPlaybackIssueSrc(null)
        return
      }

      try {
        video.load()
        if (shouldAutoplay) {
          const maybePromise = video.play()
          if (maybePromise && typeof maybePromise.catch === "function") {
            maybePromise.catch(() => {})
          }
        }
      } catch {
        setPlaybackIssueSrc(src)
        setLoadedSrc(src)
      }
    }, 2500)

    return () => window.clearTimeout(timeoutId)
  }, [hasPlaybackIssue, isSafari, isVideoLoaded, shouldAutoplay, shouldRenderVideo, src])

  const markLoaded = () => {
    setLoadedSrc(src)
    setPlaybackIssueSrc(null)
  }

  const handleStall = () => {
    const video = videoRef.current
    if (!video) return
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      markLoaded()
    }
  }

  const handleError = () => {
    setPlaybackIssueSrc(src)
    setLoadedSrc(src)
  }

  return (
    <div ref={containerRef} className={className}>
      {!isVideoLoaded && shouldRenderVideo && !hasPlaybackIssue && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <PixelLoadingSpinner />
        </div>
      )}

      {shouldRenderVideo && (
        <video
          ref={videoRef}
          src={src}
          preload={preload ?? (shouldAutoplay && !isSafari ? "auto" : "metadata")}
          loop={shouldAutoplay}
          muted
          playsInline
          data-autoplay={shouldAutoplay ? "true" : "false"}
          onLoadedData={markLoaded}
          onCanPlay={markLoaded}
          onLoadedMetadata={markLoaded}
          onStalled={handleStall}
          onSuspend={handleStall}
          onError={handleError}
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            opacity: forceVisible || isVideoLoaded ? 1 : 0,
            transition: "opacity 220ms ease-out",
          }}
        />
      )}
    </div>
  )
}
