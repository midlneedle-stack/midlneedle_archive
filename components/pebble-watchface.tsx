"use client"

import { useEffect, useRef } from "react"
import { withBasePath } from "@/lib/base-path"
import {
  createPebbleWatchfaceEngine,
  type PebbleWatchfaceEngine,
} from "./pebble-watchface-engine"
import { ScreencastFrame } from "./screencast-frame"

const FRAME_WIDTH = 984
const FRAME_HEIGHT = 1040
const SCREEN_LEFT = (204 / FRAME_WIDTH) * 100
const SCREEN_TOP = (184 / FRAME_HEIGHT) * 100
const SCREEN_WIDTH = (576 / FRAME_WIDTH) * 100
const SCREEN_HEIGHT = (672 / FRAME_HEIGHT) * 100
const LOGICAL_SCREEN_WIDTH = 144
const LOGICAL_SCREEN_HEIGHT = 168
const FRAME_SRC = withBasePath("/cases/pebble_case/frame_pebble.png")

export function PebbleWatchface() {
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const screenRef = useRef<HTMLButtonElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const engineRef = useRef<PebbleWatchfaceEngine | null>(null)

  useEffect(() => {
    const viewport = viewportRef.current
    const screen = screenRef.current
    const canvas = canvasRef.current
    if (!viewport || !screen || !canvas) {
      return
    }

    const engine = createPebbleWatchfaceEngine(canvas)
    engineRef.current = engine
    const resizeObserver = new ResizeObserver(() => {
      engine.resize()
    })
    resizeObserver.observe(screen)
    engine.resize()

    let observer: IntersectionObserver | null = null

    if (typeof IntersectionObserver === "function") {
      observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) {
            return
          }

          engine.start()
          observer?.disconnect()
          observer = null
        },
        {
          threshold: 0.35,
        }
      )
      observer.observe(viewport)
    } else {
      engine.start()
    }

    return () => {
      observer?.disconnect()
      resizeObserver.disconnect()
      engineRef.current = null
      engine.destroy()
    }
  }, [])

  return (
    <ScreencastFrame inset={0}>
      <div
        ref={viewportRef}
        className="flex h-full w-full items-center justify-center"
      >
        <div
          className="relative w-[42%] max-w-[252px] min-w-[132px] sm:w-[29%] sm:max-w-[178px] sm:min-w-[94px]"
          style={{ aspectRatio: `${FRAME_WIDTH} / ${FRAME_HEIGHT}` }}
        >
          <img
            src={FRAME_SRC}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="block h-auto w-full select-none"
          />
          <button
            type="button"
            ref={screenRef}
            onClick={() => engineRef.current?.restart()}
            onPointerMove={(event) => {
              if (event.pointerType !== "mouse") {
                return
              }

              const rect = event.currentTarget.getBoundingClientRect()
              engineRef.current?.setPointer(
                ((event.clientX - rect.left) / rect.width) * LOGICAL_SCREEN_WIDTH,
                ((event.clientY - rect.top) / rect.height) * LOGICAL_SCREEN_HEIGHT
              )
            }}
            onPointerLeave={() => engineRef.current?.clearPointer()}
            onPointerCancel={() => engineRef.current?.clearPointer()}
            className="absolute flex cursor-pointer items-center justify-center overflow-hidden rounded-[6px] border-0 bg-black p-0 sm:rounded-[12px]"
            aria-label="Replay Pebble watchface animation"
            style={{
              left: `${SCREEN_LEFT}%`,
              top: `${SCREEN_TOP}%`,
              width: `${SCREEN_WIDTH}%`,
              height: `${SCREEN_HEIGHT}%`,
            }}
          >
            <canvas
              ref={canvasRef}
              className="block bg-black [image-rendering:pixelated]"
            />
          </button>
        </div>
      </div>
    </ScreencastFrame>
  )
}
