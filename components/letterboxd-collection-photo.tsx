"use client"

import { animate } from "motion"
import Image from "next/image"
import { useCallback, useEffect, useRef } from "react"
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react"
import { withBasePath } from "@/lib/base-path"

const IMAGE_SRC = withBasePath("/cases/letterboxd/i_really_like_movies.webp")
const POSTER_SHADOW = "-4px 20px 34px rgb(0 0 0 / 0.16)"
const POSTER_DRAG_SHADOW = "-4px 20px 34px rgb(0 0 0 / 0.2)"
const TILT_PERSPECTIVE = 900
const TILT_MAX_DEGREES = 3.5
const IDLE_TILT_X = 1.2
const IDLE_TILT_Y = 1.8
const IDLE_TILT_DURATION = 5.6
const RETURN_TO_CENTER_SPRING = {
  type: "spring" as const,
  stiffness: 160,
  damping: 18,
  mass: 0.8,
}

export function LetterboxdCollectionPhoto({ alt = "" }: { alt?: string }) {
  const shouldReduceMotion = useReducedMotion()
  const isHoveringRef = useRef(false)
  const isDraggingRef = useRef(false)
  const idleTiltRef = useRef<null | { stop: () => void }>(null)
  const returnXRef = useRef<null | { stop: () => void }>(null)
  const returnYRef = useRef<null | { stop: () => void }>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotate = useSpring(-8, { stiffness: 180, damping: 20, mass: 0.8 })
  const rotateX = useSpring(0, { stiffness: 140, damping: 18, mass: 0.8 })
  const rotateY = useSpring(0, { stiffness: 140, damping: 18, mass: 0.8 })
  const idleEnabled = shouldReduceMotion === false

  const resetTilt = useCallback(() => {
    rotateX.set(0)
    rotateY.set(0)
  }, [rotateX, rotateY])

  const stopIdleTilt = useCallback(() => {
    idleTiltRef.current?.stop()
    idleTiltRef.current = null
  }, [])

  const stopReturnToCenter = useCallback(() => {
    returnXRef.current?.stop()
    returnYRef.current?.stop()
    returnXRef.current = null
    returnYRef.current = null
  }, [])

  const returnToCenter = useCallback(() => {
    stopReturnToCenter()
    returnXRef.current = animate(x, 0, RETURN_TO_CENTER_SPRING)
    returnYRef.current = animate(y, 0, RETURN_TO_CENTER_SPRING)
  }, [stopReturnToCenter, x, y])

  const startIdleTilt = useCallback(() => {
    if (
      !idleEnabled ||
      idleTiltRef.current ||
      isHoveringRef.current ||
      isDraggingRef.current
    ) {
      return
    }

    idleTiltRef.current = animate(0, Math.PI * 2, {
      duration: IDLE_TILT_DURATION,
      ease: "linear",
      repeat: Infinity,
      onUpdate: (angle) => {
        rotateX.set(Math.sin(angle) * IDLE_TILT_X)
        rotateY.set(Math.cos(angle) * IDLE_TILT_Y)
      },
    })
  }, [idleEnabled, rotateX, rotateY])

  const setPointerTilt = (
    element: HTMLDivElement,
    clientX: number,
    clientY: number,
  ) => {
    const rect = element.getBoundingClientRect()
    const offsetX = (clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
    const offsetY = (clientY - (rect.top + rect.height / 2)) / (rect.height / 2)

    rotateX.set(Math.max(-1, Math.min(1, -offsetY)) * TILT_MAX_DEGREES)
    rotateY.set(Math.max(-1, Math.min(1, offsetX)) * TILT_MAX_DEGREES)
  }

  useEffect(() => {
    if (!idleEnabled) {
      stopIdleTilt()
      resetTilt()
      return
    }

    startIdleTilt()

    return stopIdleTilt
  }, [idleEnabled, resetTilt, startIdleTilt, stopIdleTilt])

  useEffect(() => stopReturnToCenter, [stopReturnToCenter])

  return (
    <div className="aspect-square">
      <div
        className="stroke relative h-full w-full overflow-hidden"
        style={{
          borderRadius: "var(--radius-card)",
          backgroundColor: "#F1F1F1",
        }}
      >
        <div className="absolute top-1/2 left-1/2 w-[68%] -translate-x-1/2 -translate-y-1/2">
          <motion.div
            drag
            dragMomentum={false}
            whileDrag={{ scale: 1.09, cursor: "grabbing", boxShadow: POSTER_DRAG_SHADOW }}
            onDragStart={() => {
              isDraggingRef.current = true
              stopIdleTilt()
              stopReturnToCenter()
              rotate.set(0)
            }}
            onPointerEnter={(event) => {
              isHoveringRef.current = true
              stopIdleTilt()
              setPointerTilt(event.currentTarget, event.clientX, event.clientY)
            }}
            onPointerMove={(event) => {
              setPointerTilt(event.currentTarget, event.clientX, event.clientY)
            }}
            onPointerLeave={() => {
              isHoveringRef.current = false
              startIdleTilt()
            }}
            onPointerCancel={() => {
              isHoveringRef.current = false
              if (!isDraggingRef.current) {
                resetTilt()
                startIdleTilt()
              }
            }}
            onDragEnd={() => {
              isDraggingRef.current = false
              rotate.set(-8)
              resetTilt()
              returnToCenter()
              if (!isHoveringRef.current) {
                startIdleTilt()
              }
            }}
            className="cursor-grab touch-none will-change-transform"
            style={{
              x,
              y,
              rotate,
              rotateX,
              rotateY,
              boxShadow: POSTER_SHADOW,
              transformPerspective: TILT_PERSPECTIVE,
              transformStyle: "preserve-3d",
            }}
          >
            <Image
              src={IMAGE_SRC}
              alt={alt}
              width={3840}
              height={3840}
              sizes="(min-width: 768px) 640px, 100vw"
              unoptimized
              draggable={false}
              className="block h-auto w-full select-none"
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
