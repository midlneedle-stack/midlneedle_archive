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
        className={cn(
          "relative flex flex-col transition-transform duration-300 ease-out transform-gpu origin-center",
          isHovered && !expandedId && "scale-[1.04]",
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
            "cursor-zoom-in mb-[var(--space-card-media)]",
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
              "relative h-full w-full overflow-hidden border border-border bg-black"
            )}
          >
            <video
              src={src}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover transform-gpu scale-[1.01]"
            />
          </div>
        </MorphingMedia>
        <div>
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
