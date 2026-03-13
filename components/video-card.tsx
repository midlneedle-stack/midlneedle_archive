"use client"

import { useId } from "react"
import { cn } from "@/lib/utils"
import { useMedia } from "./media-context"
import { MorphingMedia } from "./morphing-media"
import { useVideoAutoplay } from "@/hooks/use-video-autoplay"
import { OptimizedVideoPlayer } from "./optimized-video-player"
import { ScreencastFrame } from "./screencast-frame"
import { PlaygroundCard } from "./playground-card"

interface VideoCardProps {
  src: string
  title: string
  description?: string
  descriptionHref?: string
  orientation?: "vertical" | "horizontal"
  cardVariant?: "standard" | "screencast"
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
  cardVariant = "standard",
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
  const isScreencast = cardVariant === "screencast"

  const handleOpen = () => {
    setExpandedId(id)
  }
  const handleClose = () => {
    setExpandedId(null)
  }

  return (
    <PlaygroundCard
      title={title}
      description={description}
      descriptionHref={descriptionHref}
      showTitle={showTitle}
      showDescription={showDescription}
      className={className}
    >
        <MorphingMedia
          layoutId={layoutId}
          isOpen={isExpanded}
          onOpen={handleOpen}
          onClose={handleClose}
          triggerClassName={cn(
            "cursor-zoom-in",
            !expandedId &&
              !isClosing &&
              "transition-transform duration-200 ease-out hover:scale-[1.01]",
            isScreencast
              ? "aspect-square"
              : orientation === "vertical"
                ? "aspect-[9/16]"
                : "aspect-video"
          )}
          expandedVariant={isScreencast ? "vertical" : orientation}
        >
          {isScreencast ? (
            <ScreencastFrame>
              <OptimizedVideoPlayer
                src={src}
                shouldAutoplay={shouldAutoplay}
                keepMounted={isExpanded || isClosing}
                className="relative h-full w-full"
              />
            </ScreencastFrame>
          ) : (
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
          )}
        </MorphingMedia>
    </PlaygroundCard>
  )
}
