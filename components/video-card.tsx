"use client"

import { useId } from "react"
import { cn } from "@/lib/utils"
import { useMedia } from "./media-context"
import { MorphingMedia } from "./morphing-media"

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

  const isHovered = hoveredId === id
  const isExpanded = expandedId === id
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
        className={cn("flex flex-col", className)}
        onMouseEnter={() => !expandedId && setHoveredId(id)}
        onMouseLeave={() => !expandedId && setHoveredId(null)}
      >
        <MorphingMedia
          layoutId={layoutId}
          isOpen={isExpanded}
          onOpen={handleOpen}
          onClose={handleClose}
          triggerClassName={cn(
            "cursor-zoom-in mb-[var(--space-card-media)]",
            orientation === "vertical" ? "aspect-[9/16]" : "aspect-video",
            isHovered && !expandedId && "z-40"
          )}
          expandedClassName={cn(
            orientation === "vertical"
              ? "h-[80vh] aspect-[9/16]"
              : "w-[80vw] max-w-6xl aspect-video"
          )}
        >
          <div
            className={cn(
              "h-full w-full border border-black/20 transition-transform duration-300 ease-out transform-gpu",
              isHovered && !expandedId && "scale-[1.01]",
              hoveredId && !isHovered && !expandedId && "scale-[0.98]"
            )}
          >
            <video
              src={src}
              autoPlay
              loop
              muted
              playsInline
              className="block h-full w-full object-cover"
            />
          </div>
        </MorphingMedia>
        <div className={cn(
          "transition-all duration-300 ease-out",
          isHovered && !expandedId && "relative z-40 scale-[1.01]",
          hoveredId && !isHovered && !expandedId && "scale-[0.98] opacity-60"
        )}>
          {showTitle && (
            <h3 className="font-semibold text-foreground">
              {title}
            </h3>
          )}
          {showDescription && description && (
            <p className="mt-[var(--space-card-text)] text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
    </>
  )
}
