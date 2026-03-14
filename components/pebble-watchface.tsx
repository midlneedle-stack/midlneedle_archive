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
const TILT_TOUCH_DRAG_THRESHOLD = 8
const UNDERLAY_DEPTH = 6
const UNDERLAY_MAX_OFFSET = 4
const UNDERLAY_SCALE = 1

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function PebbleWatchface() {
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const watchRef = useRef<HTMLButtonElement | null>(null)
  const underlayRef = useRef<HTMLSpanElement | null>(null)
  const screenRef = useRef<HTMLSpanElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const engineRef = useRef<PebbleWatchfaceEngine | null>(null)
  const touchTiltPointerIdRef = useRef<number | null>(null)
  const touchTiltStartRef = useRef<{ x: number; y: number } | null>(null)
  const suppressTouchClickRef = useRef(false)
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

    const getTiltTarget = (clientX: number, clientY: number) => {
      const rect = watch.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const dx = clientX - centerX
      const dy = clientY - centerY
      const distance = Math.hypot(dx, dy)
      const activationRadius =
        Math.max(rect.width, rect.height) * TILT_RADIUS_MULTIPLIER
      const rawProximity = clamp(1 - distance / activationRadius, 0, 1)
      const proximity = rawProximity * (1 - 0.4 * rawProximity * rawProximity)
      const normalizedX = clamp(dx / (rect.width * 0.36), -1, 1)
      const normalizedY = clamp(dy / (rect.height * 0.36), -1, 1)

      return {
        rotateX: -normalizedY * TILT_MAX_DEGREES * proximity,
        rotateY: normalizedX * TILT_MAX_DEGREES * proximity,
      }
    }

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

    const setTiltFromPoint = (clientX: number, clientY: number) => {
      const { rotateX, rotateY } = getTiltTarget(clientX, clientY)
      setTiltTarget(rotateX, rotateY)
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return
      }
      setTiltFromPoint(event.clientX, event.clientY)
    }

    const resetTilt = () => {
      setTiltTarget(0, 0)
    }

    const clearTouchTilt = (pointerId: number) => {
      if (watch.hasPointerCapture(pointerId)) {
        watch.releasePointerCapture(pointerId)
      }
      touchTiltPointerIdRef.current = null
      touchTiltStartRef.current = null
      resetTilt()
    }

    const handleTouchPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "touch") {
        return
      }

      touchTiltPointerIdRef.current = event.pointerId
      touchTiltStartRef.current = { x: event.clientX, y: event.clientY }
      suppressTouchClickRef.current = false
      watch.setPointerCapture(event.pointerId)
      setTiltFromPoint(event.clientX, event.clientY)
    }

    const handleTouchPointerMove = (event: PointerEvent) => {
      if (
        event.pointerType !== "touch" ||
        event.pointerId !== touchTiltPointerIdRef.current
      ) {
        return
      }

      const touchStart = touchTiltStartRef.current
      if (
        touchStart &&
        Math.hypot(event.clientX - touchStart.x, event.clientY - touchStart.y) >=
          TILT_TOUCH_DRAG_THRESHOLD
      ) {
        suppressTouchClickRef.current = true
      }

      setTiltFromPoint(event.clientX, event.clientY)
    }

    const handleTouchPointerEnd = (event: PointerEvent) => {
      if (
        event.pointerType !== "touch" ||
        event.pointerId !== touchTiltPointerIdRef.current
      ) {
        return
      }

      clearTouchTilt(event.pointerId)
    }

    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerleave", resetTilt)
    window.addEventListener("pointercancel", resetTilt)
    window.addEventListener("blur", resetTilt)
    watch.addEventListener("pointerdown", handleTouchPointerDown)
    watch.addEventListener("pointermove", handleTouchPointerMove)
    watch.addEventListener("pointerup", handleTouchPointerEnd)
    watch.addEventListener("pointercancel", handleTouchPointerEnd)

    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerleave", resetTilt)
      window.removeEventListener("pointercancel", resetTilt)
      window.removeEventListener("blur", resetTilt)
      watch.removeEventListener("pointerdown", handleTouchPointerDown)
      watch.removeEventListener("pointermove", handleTouchPointerMove)
      watch.removeEventListener("pointerup", handleTouchPointerEnd)
      watch.removeEventListener("pointercancel", handleTouchPointerEnd)
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
        <button
          type="button"
          ref={watchRef}
          onClick={(event) => {
            if (suppressTouchClickRef.current) {
              suppressTouchClickRef.current = false
              return
            }

            const rect = event.currentTarget.getBoundingClientRect()
            const clickX =
              event.detail === 0
                ? SCREEN_LEFT + SCREEN_WIDTH / 2
                : ((event.clientX - rect.left) / rect.width) * 100
            const clickY =
              event.detail === 0
                ? SCREEN_TOP + SCREEN_HEIGHT / 2
                : ((event.clientY - rect.top) / rect.height) * 100
            const clampedX = clamp(clickX, SCREEN_LEFT, SCREEN_LEFT + SCREEN_WIDTH)
            const clampedY = clamp(clickY, SCREEN_TOP, SCREEN_TOP + SCREEN_HEIGHT)

            engineRef.current?.restart(
              ((clampedX - SCREEN_LEFT) / SCREEN_WIDTH) * LOGICAL_SCREEN_WIDTH,
              ((clampedY - SCREEN_TOP) / SCREEN_HEIGHT) * LOGICAL_SCREEN_HEIGHT
            )
            trigger(HAPTIC_PEBBLE_INTRO)
          }}
          onPointerMove={(event) => {
            if (event.pointerType !== "mouse") {
              return
            }

            const rect = event.currentTarget.getBoundingClientRect()
            const localX = ((event.clientX - rect.left) / rect.width) * 100
            const localY = ((event.clientY - rect.top) / rect.height) * 100

            if (
              localX < SCREEN_LEFT ||
              localX > SCREEN_LEFT + SCREEN_WIDTH ||
              localY < SCREEN_TOP ||
              localY > SCREEN_TOP + SCREEN_HEIGHT
            ) {
              engineRef.current?.clearPointer()
              return
            }

            engineRef.current?.setPointer(
              ((localX - SCREEN_LEFT) / SCREEN_WIDTH) * LOGICAL_SCREEN_WIDTH,
              ((localY - SCREEN_TOP) / SCREEN_HEIGHT) * LOGICAL_SCREEN_HEIGHT
            )
          }}
          onPointerLeave={() => engineRef.current?.clearPointer()}
          onPointerCancel={() => engineRef.current?.clearPointer()}
          className="relative w-[42%] max-w-[252px] min-w-[132px] cursor-pointer border-0 bg-transparent p-0 sm:w-[29%] sm:max-w-[178px] sm:min-w-[94px]"
          aria-label="Replay Pebble watchface animation"
          style={{
            aspectRatio: `${FRAME_WIDTH} / ${FRAME_HEIGHT}`,
            touchAction: "pan-y pinch-zoom",
            transformStyle: "preserve-3d",
            transformOrigin: "center center",
            transform: `perspective(${TILT_PERSPECTIVE}px) rotateX(0deg) rotateY(0deg)`,
            willChange: "transform",
          }}
        >
          <span
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
          </span>
          <img
            src={FRAME_SRC}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="block h-auto w-full select-none"
          />
          <span
            ref={screenRef}
            aria-hidden="true"
            className="pointer-events-none absolute flex items-center justify-center overflow-hidden rounded-[6px] bg-black sm:rounded-[12px]"
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
          </span>
        </button>
      </div>
    </ScreencastFrame>
  )
}
