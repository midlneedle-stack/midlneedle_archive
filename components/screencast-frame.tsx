"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { VIDEO_PLACEHOLDER_COLOR } from "@/lib/video-placeholders"

interface ScreencastFrameProps {
  children: ReactNode
  inset?: number
  innerStroke?: boolean
  className?: string
  innerClassName?: string
}

export function ScreencastFrame({
  children,
  inset = 20,
  innerStroke = false,
  className,
  innerClassName,
}: ScreencastFrameProps) {
  return (
    <div
      className={cn(
        "stroke relative h-full w-full overflow-hidden aspect-square",
        className
      )}
      style={{
        borderRadius: "var(--radius-card)",
        backgroundColor: VIDEO_PLACEHOLDER_COLOR,
      }}
    >
      <div className="absolute inset-0 bg-[rgb(38_41_44_/0.02)]" />
      <div
        className="absolute overflow-hidden rounded-[10px]"
        style={{ inset: `${inset}px` }}
      >
        <div
          className={cn(
            "relative h-full w-full overflow-hidden rounded-[10px]",
            innerStroke && "stroke",
            innerClassName
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
