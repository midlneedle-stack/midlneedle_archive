"use client"

import { useId } from "react"
import { cn } from "@/lib/utils"
import { useMedia } from "./media-context"
import { MorphingMedia } from "./morphing-media"
import { useVideoAutoplay } from "@/hooks/use-video-autoplay"
import { OptimizedVideoPlayer } from "./optimized-video-player"
import { withBasePath } from "@/lib/base-path"

interface ScreencastCardProps {
  src: string
  title: string
  description?: string
  orientation?: "vertical" | "horizontal"
  showTitle?: boolean
  showDescription?: boolean
  className?: string
  blurDataURL?: string
}

export function ScreencastCard({
  src,
  title,
  description,
  orientation = "vertical",
  showTitle = true,
  showDescription = true,
  className,
  blurDataURL,
}: ScreencastCardProps) {
  const id = useId()
  const { expandedId, isClosing, setExpandedId } = useMedia()
  const allowAutoplay = useVideoAutoplay()

  const isExpanded = expandedId === id
  const hasExpandedMedia = expandedId !== null
  const shouldAutoplay =
    isExpanded || (allowAutoplay && !hasExpandedMedia && !isClosing)
  const layoutId = `media-${id}`

  const handleOpen = () => {
    setExpandedId(id)
  }
  const handleClose = () => {
    setExpandedId(null)
  }

  return (
    <div className={cn("relative flex flex-col origin-center", className)}>
      <MorphingMedia
        layoutId={layoutId}
        isOpen={isExpanded}
        onOpen={handleOpen}
        onClose={handleClose}
        triggerClassName={cn(
          "cursor-zoom-in mb-[var(--space-inset)]",
          !expandedId &&
            !isClosing &&
            "transition-transform duration-200 ease-out hover:scale-[1.01]",
          orientation === "vertical" ? "aspect-[9/16]" : "aspect-video"
        )}
        expandedVariant={orientation}
      >
        <div
          className="stroke relative h-full w-full overflow-hidden"
          style={{
            backgroundColor: blurDataURL || "#000",
            borderRadius: "var(--radius-card)",
          }}
        >
          <div className="flex h-full w-full items-center px-[44px] bg-[rgb(38_41_44_/0.02)]">
            <div className="relative w-full aspect-[18/39] overflow-hidden rounded-[42px] md:rounded-[20px]">
              <OptimizedVideoPlayer
                src={src}
                shouldAutoplay={shouldAutoplay}
                keepMounted={isExpanded || isClosing}
                className="relative h-full w-full"
              />
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 p-[12px] md:p-[18px]">
            <img
              src={withBasePath("/videos/iPhone17_frame.webp")}
              alt=""
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      </MorphingMedia>

      <div>
        {showTitle && (
          <h3 className="type-card-title mb-0 text-foreground">
            {title}
          </h3>
        )}
        {showDescription && description && (
          <p className="type-body mt-[var(--space-card-text)] text-faint-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
