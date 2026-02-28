"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { withBasePath } from "@/lib/base-path"

interface AudioPlayerProps {
  src: string
}

const PAUSE_EVENT = "audio-player:pause-others"

export function AudioPlayer({ src }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const idRef = useRef(Math.random().toString(36).slice(2))
  const [playing, setPlaying] = useState(false)
  const [hovered, setHovered] = useState(false)

  const handlePauseOthers = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail
    if (detail !== idRef.current) {
      audioRef.current?.pause()
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onPause = () => setPlaying(false)
    const onPlay = () => setPlaying(true)
    const onEnded = () => setPlaying(false)
    audio.addEventListener("pause", onPause)
    audio.addEventListener("play", onPlay)
    audio.addEventListener("ended", onEnded)
    window.addEventListener(PAUSE_EVENT, handlePauseOthers)
    return () => {
      audio.removeEventListener("pause", onPause)
      audio.removeEventListener("play", onPlay)
      audio.removeEventListener("ended", onEnded)
      window.removeEventListener(PAUSE_EVENT, handlePauseOthers)
    }
  }, [handlePauseOthers])

  function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
    } else {
      window.dispatchEvent(new CustomEvent(PAUSE_EVENT, { detail: idRef.current }))
      audio.play()
    }
  }

  const showButton = hovered || playing

  return (
    <span
      style={{ display: "inline-flex", alignItems: "center" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <audio ref={audioRef} src={withBasePath(src)} preload="metadata" />
      <button
        onClick={toggle}
        aria-label={playing ? "Pause" : "Play"}
        style={{
          width: showButton ? 28 : 0,
          minWidth: showButton ? 28 : 0,
          height: 28,
          borderRadius: "50%",
          border: showButton ? "1px solid var(--stroke)" : "none",
          background: "rgb(53 59 66 / 0.02)",
          color: "var(--foreground)",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          flexShrink: 0,
          opacity: showButton ? 1 : 0,
          marginRight: showButton ? 8 : 0,
          transition: "opacity 0.2s ease, width 0.2s ease, margin-right 0.2s ease, background 0.15s ease",
          overflow: "hidden",
        }}
      >
        {playing ? (
          <svg width="8" height="10" viewBox="0 0 10 12" fill="currentColor">
            <rect x="1" y="0" width="3" height="12" rx="0.5" />
            <rect x="6" y="0" width="3" height="12" rx="0.5" />
          </svg>
        ) : (
          <svg
            width="8"
            height="10"
            viewBox="0 0 10 12"
            fill="currentColor"
            style={{ marginLeft: 1 }}
          >
            <path d="M1 0.5L9.5 6L1 11.5V0.5Z" />
          </svg>
        )}
      </button>
      <span
        onClick={toggle}
        style={{
          cursor: "pointer",
          textDecorationLine: "underline",
          textDecorationThickness: "1px",
          textUnderlineOffset: "0.16em",
          textDecorationColor: "var(--stroke)",
          transition: "text-decoration-color 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.textDecorationColor = "var(--foreground)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.textDecorationColor = "var(--stroke)"
        }}
      >
        Прослушать отрывок из интервью
      </span>
    </span>
  )
}
