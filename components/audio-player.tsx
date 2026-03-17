"use client"

import { useRef, useState, useEffect, useCallback, useId } from "react"
import { PauseIcon, PlayIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { withBasePath } from "@/lib/base-path"
import { Button } from "@/components/ui/button"

interface AudioPlayerProps {
  src: string
}

const PAUSE_EVENT = "audio-player:pause-others"

export function AudioPlayer({ src }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const playerId = useId()
  const [playing, setPlaying] = useState(false)

  const handlePauseOthers = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail
    if (detail !== playerId) {
      audioRef.current?.pause()
    }
  }, [playerId])

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
      window.dispatchEvent(new CustomEvent(PAUSE_EVENT, { detail: playerId }))
      audio.play()
    }
  }

  return (
    <>
      <audio ref={audioRef} src={withBasePath(src)} preload="metadata" />
      <Button
        type="button"
        onClick={toggle}
        variant="outline"
        size="icon-sm"
        aria-label={playing ? "Pause" : "Play"}
        className="size-7 shrink-0 rounded-full border-[var(--stroke)] bg-[rgb(53_59_66_/0.02)] text-foreground shadow-none transition-colors duration-150 ease-out hover:bg-[rgb(53_59_66_/0.06)] hover:text-foreground"
      >
        <span className="relative flex size-3.5 items-center justify-center">
          <AnimatePresence mode="sync" initial={false}>
            <motion.span
              key={playing ? "pause" : "play"}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 28,
                mass: 0.7,
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {playing ? (
                <PauseIcon className="size-3.5 fill-current stroke-[2.2]" />
              ) : (
                <PlayIcon className="size-3.5 translate-x-[0.5px] fill-current stroke-[2.2]" />
              )}
            </motion.span>
          </AnimatePresence>
        </span>
      </Button>
    </>
  )
}
