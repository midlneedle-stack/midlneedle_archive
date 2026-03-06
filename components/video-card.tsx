"use client"

import { useId } from "react"
import { cn } from "@/lib/utils"
import { useMedia } from "./media-context"
import { MorphingMedia } from "./morphing-media"
import { useVideoAutoplay } from "@/hooks/use-video-autoplay"
import { OptimizedVideoPlayer } from "./optimized-video-player"
import { HapticLink } from "@/components/haptic-link"

interface VideoCardProps {
  src: string
  title: string
  description?: string
  descriptionHref?: string
  orientation?: "vertical" | "horizontal"
  showTitle?: boolean
  showDescription?: boolean
  className?: string
  blurDataURL?: string
}

export function VideoCard({
  src,
  title,
  description,
  descriptionHref,
  orientation = "vertical",
  showTitle = true,
  showDescription = true,
  className,
  blurDataURL,
}: VideoCardProps) {
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
    <>
      <div
        className={cn(
          "relative flex flex-col origin-center",
          className
        )}
      >
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
            className={cn(
              "stroke relative h-full w-full overflow-hidden"
            )}
            style={{
              backgroundColor: blurDataURL || "#000",
              borderRadius: "var(--radius-card)",
            }}
          >
            <OptimizedVideoPlayer
              src={src}
              shouldAutoplay={shouldAutoplay}
              keepMounted={isExpanded || isClosing}
              className="relative h-full w-full"
            />
          </div>
        </MorphingMedia>
        <div>
          {showTitle && (
            <h3 className="type-card-title mb-0 text-foreground">
              {title}
            </h3>
          )}
          {showDescription && description && (
            descriptionHref ? (
              <HapticLink
                href={descriptionHref}
                className="type-body mt-[var(--space-card-text)] text-faint-foreground underline decoration-[var(--link-underline)] underline-offset-[0.16em] decoration-1 hover:decoration-foreground"
              >
                {description}
              </HapticLink>
            ) : (
              <p className="type-body mt-[var(--space-card-text)] text-faint-foreground">
                {description}
              </p>
            )
          )}
        </div>
      </div>
    </>
  )
}
