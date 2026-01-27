"use client"

import { useId } from "react"
import { cn } from "@/lib/utils"
import { useMedia } from "./media-context"
import { MorphingMedia } from "./morphing-media"
import { useVideoAutoplay } from "@/hooks/use-video-autoplay"

interface VideoCardProps {
  src: string
  title: string
  description?: string
  orientation?: "vertical" | "horizontal"
  showTitle?: boolean
  showDescription?: boolean
  className?: string
}

export function VideoCard({
  src,
  title,
  description,
  orientation = "vertical",
  showTitle = true,
  showDescription = true,
  className,
}: VideoCardProps) {
  const id = useId()
  const { hoveredId, expandedId, setHoveredId, setExpandedId } = useMedia()
  const allowAutoplay = useVideoAutoplay()

  const isHovered = hoveredId === id
  const isExpanded = expandedId === id
  const shouldAutoplay = allowAutoplay || isExpanded
  const layoutId = `media-${id}`

  const handleOpen = () => {
    setHoveredId(null)
    setExpandedId(id)
  }
  const handleClose = () => {
    setHoveredId(null)
    setExpandedId(null)
  }

  return (
    <>
      <div
        className={cn(
          "relative flex flex-col transition-transform duration-300 ease-out transform-gpu origin-center",
          isHovered && !expandedId && "scale-[1.02]",
          isHovered && !expandedId && "z-40",
          className
        )}
        onMouseEnter={() => !expandedId && setHoveredId(id)}
        onMouseLeave={() => !expandedId && setHoveredId(null)}
      >
        <MorphingMedia
          layoutId={layoutId}
          isOpen={isExpanded}
          onOpen={handleOpen}
          onClose={handleClose}
          triggerClassName={cn(
            "cursor-zoom-in mb-[var(--space-inset)]",
            orientation === "vertical" ? "aspect-[9/16]" : "aspect-video"
          )}
          expandedClassName={cn(
            orientation === "vertical"
              ? "h-[80vh] aspect-[9/16]"
              : "w-[80vw] max-w-6xl aspect-video"
          )}
        >
          <div
            className={cn(
              "relative h-full w-full overflow-hidden rounded-[var(--radius-card)] border border-border bg-black"
            )}
          >
            <video
              src={src}
              data-autoplay={shouldAutoplay ? "true" : "false"}
              autoPlay={shouldAutoplay}
              loop={shouldAutoplay}
              muted
              playsInline
              preload={shouldAutoplay ? "auto" : "metadata"}
              onLoadedData={(event) => {
                if (shouldAutoplay) return
                const video = event.currentTarget
                if (video.currentTime === 0) {
                  try {
                    video.currentTime = 0.0001
                  } catch {
                    // Ignore seek errors; the browser will show the first frame if possible.
                  }
                }
              }}
              className="absolute inset-0 h-full w-full object-cover transform-gpu scale-[1.01]"
            />
            {!shouldAutoplay && (
              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/85 text-black shadow-sm backdrop-blur-sm">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-6 w-6 translate-x-[1px] fill-current"
                  >
                    <path d="M8 5.5v13l11-6.5-11-6.5z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </MorphingMedia>
        <div>
          {showTitle && (
            <h3 className="type-card-title mb-0 text-foreground">
              {title}
            </h3>
          )}
          {showDescription && description && (
            <p className="type-card-caption mt-[var(--space-card-text)] text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
    </>
  )
}
