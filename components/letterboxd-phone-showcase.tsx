"use client"

import Image from "next/image"
import {
  motion,
  type MotionValue,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react"
import { withBasePath } from "@/lib/base-path"

const CYCLE_DURATION = 18
const PAIR_DURATION = 9
const CENTER_DURATION = 7
const PAIR_END = PAIR_DURATION / CYCLE_DURATION
const CENTER_START = PAIR_END
const CENTER_END = (PAIR_DURATION + CENTER_DURATION) / CYCLE_DURATION
const TAU = Math.PI * 2
const EDGE_SPEED_RATIO = 2.62
const CENTER_SPEED_RATIO = 0.38
const PRIMARY_FLOW = (EDGE_SPEED_RATIO - CENTER_SPEED_RATIO) / 2
const SECONDARY_FLOW = (EDGE_SPEED_RATIO + CENTER_SPEED_RATIO - 2) / 2
const PHONE_FADE_MASK =
  "linear-gradient(to bottom, rgb(0 0 0 / 0.2) 0%, rgb(0 0 0 / 0.42) 12%, rgb(0 0 0 / 0.7) 22%, rgb(0 0 0 / 0.9) 30%, rgb(0 0 0 / 1) 38%, rgb(0 0 0 / 1) 62%, rgb(0 0 0 / 0.9) 70%, rgb(0 0 0 / 0.7) 78%, rgb(0 0 0 / 0.42) 88%, rgb(0 0 0 / 0.2) 100%)"

const PHONE_LAYOUTS = [
  {
    key: "left",
    src: withBasePath("/cases/letterboxd/letter_phone_1.webp"),
    left: "29%",
    width: "39%",
    start: 0,
    end: PAIR_END,
    from: -118,
    to: 118,
  },
  {
    key: "right",
    src: withBasePath("/cases/letterboxd/letter_phone_2.webp"),
    left: "71%",
    width: "39%",
    start: 0,
    end: PAIR_END,
    from: 118,
    to: -118,
  },
  {
    key: "center",
    src: withBasePath("/cases/letterboxd/letter_phone_3.webp"),
    left: "50%",
    width: "38%",
    staticScale: 1.5,
    start: CENTER_START,
    end: CENTER_END,
    from: 172,
    to: -172,
  },
]

function shapeProgress(value: number) {
  return (
    value +
    (PRIMARY_FLOW * Math.sin(TAU * value)) / TAU +
    (SECONDARY_FLOW * Math.sin(TAU * 2 * value)) / (TAU * 2)
  )
}

function useLoopedProgress(duration: number, enabled: boolean, speed: MotionValue<number>) {
  const progress = useMotionValue(0)

  useAnimationFrame((_, delta) => {
    if (!enabled) {
      return
    }

    const velocity = Math.max(0, Math.min(1, speed.get()))
    const next = progress.get() + (delta / 1000 / duration) * velocity
    progress.set(next % 1)
  })

  return progress
}

function usePhoneY(
  progress: MotionValue<number>,
  {
    start,
    end,
    from,
    to,
  }: {
    start: number
    end: number
    from: number
    to: number
  },
) {
  return useTransform(progress, (value) => {
    if (value <= start) {
      return `${from}%`
    }

    if (value >= end) {
      return `${to}%`
    }

    const localProgress = (value - start) / (end - start)
    const shaped = shapeProgress(localProgress)
    const next = from + (to - from) * shaped

    return `${next}%`
  })
}

export function LetterboxdPhoneShowcase() {
  const shouldReduceMotion = useReducedMotion()
  const animationsEnabled = shouldReduceMotion !== true
  const speed = useSpring(1, {
    stiffness: 40,
    damping: 24,
    mass: 1,
  })
  const progress = useLoopedProgress(CYCLE_DURATION, animationsEnabled, speed)
  const phones = [
    { ...PHONE_LAYOUTS[0], y: usePhoneY(progress, PHONE_LAYOUTS[0]) },
    { ...PHONE_LAYOUTS[1], y: usePhoneY(progress, PHONE_LAYOUTS[1]) },
    { ...PHONE_LAYOUTS[2], y: usePhoneY(progress, PHONE_LAYOUTS[2]) },
  ]

  return (
    <div className="aspect-square">
      <div
        aria-hidden="true"
        className="stroke relative h-full w-full overflow-hidden"
        onPointerEnter={() => speed.set(0)}
        onPointerLeave={() => speed.set(1)}
        style={{
          borderRadius: "var(--radius-card)",
          backgroundColor: "#F1F1F1",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            WebkitMaskImage: PHONE_FADE_MASK,
            maskImage: PHONE_FADE_MASK,
          }}
        >
          <div className="pointer-events-none absolute top-1/2 left-1/2 hidden w-[38%] -translate-x-1/2 -translate-y-1/2 motion-reduce:block">
            <div className="origin-center scale-[1.5]">
              <Image
                src={PHONE_LAYOUTS[2].src}
                alt=""
                width={1640}
                height={3352}
                sizes="40vw"
                unoptimized
                className="block h-auto w-full select-none"
                draggable={false}
              />
            </div>
          </div>
          {phones.map((phone) => (
            <div
              key={phone.key}
              className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2 motion-reduce:hidden"
              style={{ left: phone.left, width: phone.width }}
            >
              <motion.div
                style={{ scale: phone.staticScale, y: phone.y }}
                className="will-change-transform"
              >
                <Image
                  src={phone.src}
                  alt=""
                  width={1640}
                  height={3352}
                  sizes="40vw"
                  unoptimized
                  className="block h-auto w-full select-none"
                  draggable={false}
                />
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
