"use client"

import { useEffect, useRef } from "react"
import { useWebHaptics } from "web-haptics/react"
import { withBasePath } from "@/lib/base-path"
import {
  createPebbleWatchfaceEngine,
  type PebbleWatchfaceEngine,
} from "./pebble-watchface-engine"
import { HAPTIC_PEBBLE_INTRO } from "@/lib/haptics"
import { ScreencastFrame } from "./screencast-frame"

const FRAME_WIDTH = 984
const FRAME_HEIGHT = 1040
const SCREEN_LEFT = (204 / FRAME_WIDTH) * 100
const SCREEN_TOP = (184 / FRAME_HEIGHT) * 100
const SCREEN_WIDTH = (576 / FRAME_WIDTH) * 100
const SCREEN_HEIGHT = (672 / FRAME_HEIGHT) * 100
const LOGICAL_SCREEN_WIDTH = 144
const LOGICAL_SCREEN_HEIGHT = 168
const FRAME_SRC = withBasePath("/cases/pebble_case/frame_pebble.webp")
const TILT_MAX_DEGREES = 20
const TILT_PERSPECTIVE = 900
const TILT_RADIUS_MULTIPLIER = 2
const TILT_LERP = 0.16
const UNDERLAY_DEPTH = 6
const UNDERLAY_MAX_OFFSET = 8
const UNDERLAY_SCALE = 0.84

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function PebbleWatchface() {
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const watchRef = useRef<HTMLDivElement | null>(null)
  const underlayRef = useRef<HTMLDivElement | null>(null)
  const screenRef = useRef<HTMLButtonElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const engineRef = useRef<PebbleWatchfaceEngine | null>(null)
  const { trigger } = useWebHaptics()

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
          trigger(HAPTIC_PEBBLE_INTRO)
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
  }, [trigger])

  useEffect(() => {
    const viewport = viewportRef.current
    const watch = watchRef.current
    const underlay = underlayRef.current
    if (!viewport || !watch || !underlay) {
      return
    }

    let rafId: number | null = null
    let currentX = 0
    let currentY = 0
    let targetX = 0
    let targetY = 0

    const applyTilt = (rotateX: number, rotateY: number) => {
      watch.style.transform = `perspective(${TILT_PERSPECTIVE}px) rotateX(${rotateX.toFixed(3)}deg) rotateY(${rotateY.toFixed(3)}deg)`

      const offsetX = (-rotateY / TILT_MAX_DEGREES) * UNDERLAY_MAX_OFFSET
      const offsetY = (rotateX / TILT_MAX_DEGREES) * UNDERLAY_MAX_OFFSET
      underlay.style.transform = `translateZ(-${UNDERLAY_DEPTH}px) translateX(${offsetX.toFixed(3)}px) translateY(${offsetY.toFixed(3)}px) scale(${UNDERLAY_SCALE})`
    }

    const renderTilt = () => {
      currentX += (targetX - currentX) * TILT_LERP
      currentY += (targetY - currentY) * TILT_LERP

      applyTilt(currentX, currentY)

      if (
        Math.abs(currentX - targetX) > 0.01 ||
        Math.abs(currentY - targetY) > 0.01
      ) {
        rafId = window.requestAnimationFrame(renderTilt)
        return
      }

      currentX = targetX
      currentY = targetY
      rafId = null
    }

    const scheduleTilt = () => {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(renderTilt)
      }
    }

    const setTiltTarget = (rotateX: number, rotateY: number) => {
      targetX = rotateX
      targetY = rotateY
      scheduleTilt()
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return
      }

      const rect = watch.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const dx = event.clientX - centerX
      const dy = event.clientY - centerY
      const distance = Math.hypot(dx, dy)
      const activationRadius =
        Math.max(rect.width, rect.height) * TILT_RADIUS_MULTIPLIER
      const proximity = clamp(1 - distance / activationRadius, 0, 1) ** 2

      const normalizedX = clamp(dx / (rect.width * 0.8), -1, 1)
      const normalizedY = clamp(dy / (rect.height * 0.8), -1, 1)

      setTiltTarget(
        -normalizedY * TILT_MAX_DEGREES * proximity,
        normalizedX * TILT_MAX_DEGREES * proximity
      )
    }

    const resetTilt = () => {
      setTiltTarget(0, 0)
    }

    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerleave", resetTilt)
    window.addEventListener("pointercancel", resetTilt)
    window.addEventListener("blur", resetTilt)

    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerleave", resetTilt)
      window.removeEventListener("pointercancel", resetTilt)
      window.removeEventListener("blur", resetTilt)
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId)
      }
      applyTilt(0, 0)
    }
  }, [])

  return (
    <ScreencastFrame inset={0}>
      <div
        ref={viewportRef}
        className="flex h-full w-full items-center justify-center"
      >
        <div
          ref={watchRef}
          className="relative w-[42%] max-w-[252px] min-w-[132px] sm:w-[29%] sm:max-w-[178px] sm:min-w-[94px]"
          style={{
            aspectRatio: `${FRAME_WIDTH} / ${FRAME_HEIGHT}`,
            transformStyle: "preserve-3d",
            transformOrigin: "center center",
            transform: `perspective(${TILT_PERSPECTIVE}px) rotateX(0deg) rotateY(0deg)`,
            willChange: "transform",
          }}
        >
          <div
            ref={underlayRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              transform: `translateZ(-${UNDERLAY_DEPTH}px) translateX(0px) translateY(0px) scale(${UNDERLAY_SCALE})`,
              transformOrigin: "center center",
              willChange: "transform",
            }}
          >
            <img
              src={FRAME_SRC}
              alt=""
              aria-hidden="true"
              draggable={false}
              className="block h-auto w-full select-none"
            />
            <img
              src={FRAME_SRC}
              alt=""
              aria-hidden="true"
              draggable={false}
              className="absolute inset-0 block h-auto w-full select-none [filter:brightness(0)]"
              style={{ opacity: 0.1 }}
            />
          </div>
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
            onClick={() => {
              engineRef.current?.restart()
              trigger(HAPTIC_PEBBLE_INTRO)
            }}
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
