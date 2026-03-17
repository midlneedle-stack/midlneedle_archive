"use client"

import { useEffect, useEffectEvent, useRef } from "react"
import { animate } from "motion"
import { useReducedMotion } from "motion/react"
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
const HINT_DELAY_MS = 2200
const HINT_RETURN_DELAY_MS = 900
const HINT_LOOP_DURATION_MS = 6800
const HINT_TILT_LERP = 0.06
const HINT_TILT_FADE_PORTION = 0.14

type DeviceOrientationEventWithPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">
}

type Point = {
  x: number
  y: number
}

interface PebbleWatchfaceProps {
  language?: "ru" | "eng"
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function smoothstep(edge0: number, edge1: number, value: number) {
  if (edge0 === edge1) {
    return value < edge0 ? 0 : 1
  }

  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}

function pointOnCubicBezier(
  start: Point,
  controlA: Point,
  controlB: Point,
  end: Point,
  progress: number
): Point {
  const t = clamp(progress, 0, 1)
  const inverse = 1 - t
  const inverseSquared = inverse * inverse
  const inverseCubed = inverseSquared * inverse
  const tSquared = t * t
  const tCubed = tSquared * t

  return {
    x:
      inverseCubed * start.x +
      3 * inverseSquared * t * controlA.x +
      3 * inverse * tSquared * controlB.x +
      tCubed * end.x,
    y:
      inverseCubed * start.y +
      3 * inverseSquared * t * controlA.y +
      3 * inverse * tSquared * controlB.y +
      tCubed * end.y,
  }
}

export function PebbleWatchface({
  language: _language = "ru",
}: PebbleWatchfaceProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const watchRef = useRef<HTMLButtonElement | null>(null)
  const underlayRef = useRef<HTMLSpanElement | null>(null)
  const screenRef = useRef<HTMLSpanElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const engineRef = useRef<PebbleWatchfaceEngine | null>(null)
  const setHintTiltLocalRef = useRef<null | ((x: number, y: number) => void)>(
    null
  )
  const clearHintTiltRef = useRef<null | (() => void)>(null)
  const touchTiltPointerIdRef = useRef<number | null>(null)
  const touchTiltStartRef = useRef<{ x: number; y: number } | null>(null)
  const suppressTouchClickRef = useRef(false)
  const lastPointerTypeRef = useRef<string | null>(null)
  const motionTiltEnabledRef = useRef(false)
  const enableMotionTiltRef = useRef<null | (() => Promise<void>)>(null)
  const hintStartTimeoutRef = useRef<number | null>(null)
  const hintLoopAnimationRef = useRef<null | { stop: () => void }>(null)
  const hintRunningRef = useRef(false)
  const hintHoveredRef = useRef(false)
  const hintInViewRef = useRef(false)
  const engineStartedRef = useRef(false)
  const shouldReduceMotion = useReducedMotion()
  const { trigger } = useWebHaptics()

  const clearHintStartTimeout = () => {
    if (hintStartTimeoutRef.current !== null) {
      window.clearTimeout(hintStartTimeoutRef.current)
      hintStartTimeoutRef.current = null
    }
  }

  const stopHintLoop = useEffectEvent(() => {
    hintRunningRef.current = false
    clearHintStartTimeout()
    hintLoopAnimationRef.current?.stop()
    hintLoopAnimationRef.current = null
    engineRef.current?.clearPointer()
    clearHintTiltRef.current?.()
  })

  const startHintLoop = useEffectEvent(() => {
    if (
      shouldReduceMotion ||
      hintRunningRef.current ||
      hintHoveredRef.current ||
      !hintInViewRef.current
    ) {
      return
    }

    const viewport = viewportRef.current
    const watch = watchRef.current
    const engine = engineRef.current

    if (!viewport || !watch || !engine) {
      return
    }

    const supportsTutorialHint = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches

    if (!supportsTutorialHint) {
      return
    }

    const viewportWidth = viewport.clientWidth
    const viewportHeight = viewport.clientHeight
    const watchRect = watch.getBoundingClientRect()
    const viewportRect = viewport.getBoundingClientRect()
    const watchLocalLeft = watchRect.left - viewportRect.left
    const watchLocalTop = watchRect.top - viewportRect.top
    const watchWidth = watch.clientWidth
    const watchHeight = watch.clientHeight
    const screenLeft = watchLocalLeft + (watchWidth * SCREEN_LEFT) / 100
    const screenTop = watchLocalTop + (watchHeight * SCREEN_TOP) / 100
    const screenWidth = (watchWidth * SCREEN_WIDTH) / 100
    const screenHeight = (watchHeight * SCREEN_HEIGHT) / 100

    const startPoint = {
      x: watchLocalLeft + watchWidth * 0.04,
      y: watchLocalTop + watchHeight * 0.74,
    }
    const topLeftPoint = {
      x: watchLocalLeft + watchWidth * 0.24,
      y: watchLocalTop + watchHeight * 0.18,
    }
    const topRightPoint = {
      x: watchLocalLeft + watchWidth * 0.78,
      y: watchLocalTop + watchHeight * 0.18,
    }
    const screenExitPoint = {
      x: screenLeft + screenWidth * 0.18,
      y: screenTop + screenHeight * 0.64,
    }

    const pointForProgress = (progress: number): Point => {
      const clampedProgress = clamp(progress, 0, 1)

      if (clampedProgress < 0.28) {
        return pointOnCubicBezier(
          startPoint,
          {
            x: watchLocalLeft + watchWidth * 0.08,
            y: watchLocalTop + watchHeight * 0.58,
          },
          {
            x: watchLocalLeft + watchWidth * 0.16,
            y: watchLocalTop + watchHeight * 0.24,
          },
          topLeftPoint,
          clampedProgress / 0.28
        )
      }

      if (clampedProgress < 0.56) {
        return pointOnCubicBezier(
          topLeftPoint,
          {
            x: watchLocalLeft + watchWidth * 0.38,
            y: watchLocalTop + watchHeight * 0.04,
          },
          {
            x: watchLocalLeft + watchWidth * 0.66,
            y: watchLocalTop + watchHeight * 0.06,
          },
          topRightPoint,
          (clampedProgress - 0.28) / 0.28
        )
      }

      if (clampedProgress < 0.82) {
        return pointOnCubicBezier(
          topRightPoint,
          {
            x: screenLeft + screenWidth * 1.04,
            y: screenTop + screenHeight * 0.18,
          },
          {
            x: screenLeft + screenWidth * 0.76,
            y: screenTop + screenHeight * 0.92,
          },
          screenExitPoint,
          (clampedProgress - 0.56) / 0.26
        )
      }

      return pointOnCubicBezier(
        screenExitPoint,
        {
          x: watchLocalLeft + watchWidth * 0.18,
          y: watchLocalTop + watchHeight * 0.9,
        },
        {
          x: watchLocalLeft - Math.min(viewportWidth * 0.03, 16),
          y: Math.min(
            viewportHeight - 24,
            watchLocalTop + watchHeight * 0.88
          ),
        },
        startPoint,
        (clampedProgress - 0.82) / 0.18
      )
    }

    hintRunningRef.current = true
    let smoothedTiltX = watchWidth / 2
    let smoothedTiltY = watchHeight / 2
    setHintTiltLocalRef.current?.(
      smoothedTiltX,
      smoothedTiltY
    )

    hintLoopAnimationRef.current = animate(0, 1, {
      duration: HINT_LOOP_DURATION_MS / 1000,
      ease: "linear",
      repeat: Infinity,
      onUpdate: (latest) => {
        if (!hintRunningRef.current || hintHoveredRef.current) {
          return
        }

        const point = pointForProgress(latest)
        const localX = point.x - watchLocalLeft
        const localY = point.y - watchLocalTop

        smoothedTiltX += (localX - smoothedTiltX) * HINT_TILT_LERP
        smoothedTiltY += (localY - smoothedTiltY) * HINT_TILT_LERP

        const fadeIn =
          latest < HINT_TILT_FADE_PORTION
            ? smoothstep(0, HINT_TILT_FADE_PORTION, latest)
            : 1
        const fadeOut =
          latest > 1 - HINT_TILT_FADE_PORTION
            ? smoothstep(1, 1 - HINT_TILT_FADE_PORTION, latest)
            : 1
        const tiltInfluence = Math.min(fadeIn, fadeOut)
        const tiltX =
          watchWidth / 2 + (smoothedTiltX - watchWidth / 2) * tiltInfluence
        const tiltY =
          watchHeight / 2 + (smoothedTiltY - watchHeight / 2) * tiltInfluence

        setHintTiltLocalRef.current?.(
          tiltX,
          tiltY
        )

        const insideScreen =
          point.x >= screenLeft &&
          point.x <= screenLeft + screenWidth &&
          point.y >= screenTop &&
          point.y <= screenTop + screenHeight

        if (!insideScreen) {
          engine.clearPointer()
          return
        }

        engine.setPointer(
          ((point.x - screenLeft) / screenWidth) * LOGICAL_SCREEN_WIDTH,
          ((point.y - screenTop) / screenHeight) * LOGICAL_SCREEN_HEIGHT
        )
      },
    })
  })

  const scheduleHintLoop = useEffectEvent((delay = HINT_DELAY_MS) => {
    if (shouldReduceMotion || hintHoveredRef.current || !hintInViewRef.current) {
      return
    }

    clearHintStartTimeout()
    hintStartTimeoutRef.current = window.setTimeout(() => {
      hintStartTimeoutRef.current = null
      startHintLoop()
    }, delay)
  })

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
          const isIntersecting = entries.some((entry) => entry.isIntersecting)
          hintInViewRef.current = isIntersecting

          if (!isIntersecting) {
            stopHintLoop()
            return
          }

          if (!engineStartedRef.current) {
            engineStartedRef.current = true
            engine.start()
            trigger(HAPTIC_PEBBLE_INTRO)
          }

          scheduleHintLoop()
        },
        {
          threshold: 0.35,
        }
      )
      observer.observe(viewport)
    } else {
      hintInViewRef.current = true
      engineStartedRef.current = true
      engine.start()
      scheduleHintLoop()
    }

    return () => {
      observer?.disconnect()
      hintInViewRef.current = false
      engineStartedRef.current = false
      stopHintLoop()
      resizeObserver.disconnect()
      engineRef.current = null
      engine.destroy()
    }
  }, [trigger])

  useEffect(() => {
    const viewport = viewportRef.current
    const watch = watchRef.current
    if (!viewport || !watch) {
      return
    }

    const handlePointerEnter = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return
      }
      hintHoveredRef.current = true
      stopHintLoop()
    }

    const handlePointerLeave = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return
      }
      hintHoveredRef.current = false
      scheduleHintLoop(HINT_RETURN_DELAY_MS)
    }

    const handleFocusIn = () => {
      stopHintLoop()
    }

    viewport.addEventListener("pointerenter", handlePointerEnter)
    viewport.addEventListener("pointerleave", handlePointerLeave)
    watch.addEventListener("focusin", handleFocusIn)

    return () => {
      viewport.removeEventListener("pointerenter", handlePointerEnter)
      viewport.removeEventListener("pointerleave", handlePointerLeave)
      watch.removeEventListener("focusin", handleFocusIn)
    }
  }, [])

  useEffect(() => {
    if (!shouldReduceMotion) {
      return
    }

    stopHintLoop()
  }, [shouldReduceMotion])

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
    let orientationBaseline: { beta: number; gamma: number } | null = null
    let ignore = false
    const screenOrientation = window.screen.orientation

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

    const setTiltFromLocalPoint = (x: number, y: number) => {
      const rect = watch.getBoundingClientRect()
      setTiltFromPoint(rect.left + x, rect.top + y)
    }

    const resetMotionBaseline = () => {
      orientationBaseline = null
      if (motionTiltEnabledRef.current) {
        setTiltTarget(0, 0)
      }
    }

    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (typeof event.beta !== "number" || typeof event.gamma !== "number") {
        return
      }

      if (!orientationBaseline) {
        orientationBaseline = {
          beta: event.beta,
          gamma: event.gamma,
        }
      }

      const normalizedBeta = clamp(
        (event.beta - orientationBaseline.beta) / 24,
        -1,
        1
      )
      const normalizedGamma = clamp(
        (event.gamma - orientationBaseline.gamma) / 24,
        -1,
        1
      )

      setTiltTarget(
        normalizedBeta * TILT_MAX_DEGREES,
        -normalizedGamma * TILT_MAX_DEGREES
      )
    }

    const enableMotionTilt = async () => {
      if (
        motionTiltEnabledRef.current ||
        typeof window === "undefined" ||
        typeof window.DeviceOrientationEvent === "undefined"
      ) {
        return
      }

      const orientationEvent =
        window.DeviceOrientationEvent as DeviceOrientationEventWithPermission

      if (typeof orientationEvent.requestPermission === "function") {
        try {
          const permission = await orientationEvent.requestPermission()
          if (permission !== "granted") {
            return
          }
        } catch {
          return
        }
      }

      if (ignore) {
        return
      }

      resetMotionBaseline()
      motionTiltEnabledRef.current = true
      window.addEventListener("deviceorientation", handleDeviceOrientation)
    }

    enableMotionTiltRef.current = enableMotionTilt
    setHintTiltLocalRef.current = setTiltFromLocalPoint

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return
      }
      setTiltFromPoint(event.clientX, event.clientY)
    }

    const resetTilt = () => {
      setTiltTarget(0, 0)
    }

    clearHintTiltRef.current = resetTilt

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

      stopHintLoop()

      if (motionTiltEnabledRef.current) {
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

      if (motionTiltEnabledRef.current) {
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

    viewport.addEventListener("pointermove", handlePointerMove)
    viewport.addEventListener("pointerleave", resetTilt)
    viewport.addEventListener("pointercancel", resetTilt)
    window.addEventListener("blur", resetTilt)
    screenOrientation?.addEventListener?.("change", resetMotionBaseline)
    window.addEventListener("orientationchange", resetMotionBaseline)
    watch.addEventListener("pointerdown", handleTouchPointerDown)
    watch.addEventListener("pointermove", handleTouchPointerMove)
    watch.addEventListener("pointerup", handleTouchPointerEnd)
    watch.addEventListener("pointercancel", handleTouchPointerEnd)

    return () => {
      ignore = true
      viewport.removeEventListener("pointermove", handlePointerMove)
      viewport.removeEventListener("pointerleave", resetTilt)
      viewport.removeEventListener("pointercancel", resetTilt)
      window.removeEventListener("blur", resetTilt)
      window.removeEventListener("deviceorientation", handleDeviceOrientation)
      screenOrientation?.removeEventListener?.("change", resetMotionBaseline)
      window.removeEventListener("orientationchange", resetMotionBaseline)
      watch.removeEventListener("pointerdown", handleTouchPointerDown)
      watch.removeEventListener("pointermove", handleTouchPointerMove)
      watch.removeEventListener("pointerup", handleTouchPointerEnd)
      watch.removeEventListener("pointercancel", handleTouchPointerEnd)
      enableMotionTiltRef.current = null
      setHintTiltLocalRef.current = null
      clearHintTiltRef.current = null
      motionTiltEnabledRef.current = false
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
        className="relative flex h-full w-full items-center justify-center"
      >
        <button
          type="button"
          ref={watchRef}
          onPointerDown={(event) => {
            lastPointerTypeRef.current = event.pointerType
          }}
          onClick={async (event) => {
            if (suppressTouchClickRef.current) {
              suppressTouchClickRef.current = false
              return
            }

            const watch = watchRef.current
            if (!watch) {
              return
            }

            const { detail, clientX, clientY } = event

            if (
              lastPointerTypeRef.current === "touch" &&
              !motionTiltEnabledRef.current
            ) {
              await enableMotionTiltRef.current?.()
            }

            const rect = watch.getBoundingClientRect()
            const clickX =
              detail === 0
                ? SCREEN_LEFT + SCREEN_WIDTH / 2
                : ((clientX - rect.left) / rect.width) * 100
            const clickY =
              detail === 0
                ? SCREEN_TOP + SCREEN_HEIGHT / 2
                : ((clientY - rect.top) / rect.height) * 100
            const clampedX = clamp(
              clickX,
              SCREEN_LEFT,
              SCREEN_LEFT + SCREEN_WIDTH
            )
            const clampedY = clamp(
              clickY,
              SCREEN_TOP,
              SCREEN_TOP + SCREEN_HEIGHT
            )

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
