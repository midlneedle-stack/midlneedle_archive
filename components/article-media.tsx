"use client"

import { useId } from "react"
import { cn } from "@/lib/utils"
import { useMedia } from "./media-context"
import { MorphingMedia } from "./morphing-media"
import { useVideoAutoplay } from "@/hooks/use-video-autoplay"
import { OptimizedVideoPlayer } from "./optimized-video-player"
import { VIDEO_PLACEHOLDER_COLOR } from "@/lib/video-placeholders"

interface ArticleImageProps {
  src: string
  alt?: string
  aspect?: "video" | "square" | "tall"
  interactive?: boolean
}

export function ArticleImage({
  src,
  alt = "",
  aspect,
  interactive = true,
}: ArticleImageProps) {
  const id = useId()
  const { expandedId, isClosing, setExpandedId } = useMedia()
  const isExpanded = expandedId === id
  const layoutId = `media-${id}`
  const isTall = src.includes("1920_1360")
  const aspectClass = aspect
    ? aspect === "square"
      ? "aspect-square"
      : aspect === "tall"
        ? "aspect-[24/17]"
        : "aspect-video"
    : isTall
      ? "aspect-[24/17]"
      : "aspect-video"

  const imageFrame = (
    <div
      className="stroke relative h-full w-full overflow-hidden"
      style={{
        borderRadius: "var(--radius-card)",
        backgroundColor: "var(--card)",
      }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  )

  if (!interactive) {
    return <div className={aspectClass}>{imageFrame}</div>
  }

  return (
    <MorphingMedia
      layoutId={layoutId}
      isOpen={isExpanded}
      onOpen={() => setExpandedId(id)}
      onClose={() => setExpandedId(null)}
      triggerClassName={cn(
        "cursor-zoom-in",
        !expandedId &&
          !isClosing &&
          "transition-transform duration-200 ease-out hover:scale-[1.01]",
        aspectClass
      )}
      expandedVariant="horizontal"
    >
      {imageFrame}
    </MorphingMedia>
  )
}

interface ArticleVideoProps {
  src: string
  variant?: "just_video" | "screencast"
}

export function ArticleVideo({
  src,
  variant = "just_video",
}: ArticleVideoProps) {
  const id = useId()
  const { expandedId, isClosing, setExpandedId } = useMedia()
  const allowAutoplay = useVideoAutoplay()
  const isExpanded = expandedId === id
  const hasExpandedMedia = expandedId !== null
  const shouldAutoplay =
    variant === "screencast"
      ? allowAutoplay && !hasExpandedMedia && !isClosing
      : isExpanded || (allowAutoplay && !hasExpandedMedia && !isClosing)
  const layoutId = `media-${id}`

  if (variant === "screencast") {
    return (
      <div
        className="stroke relative h-full w-full overflow-hidden aspect-square"
        style={{
          borderRadius: "var(--radius-card)",
          backgroundColor: VIDEO_PLACEHOLDER_COLOR,
        }}
      >
        <div className="absolute inset-0 bg-[rgb(38_41_44_/0.02)]" />
        <div className="absolute inset-[20px] overflow-hidden rounded-[10px]">
          <div className="relative h-full w-full overflow-hidden rounded-[10px]">
            <OptimizedVideoPlayer
              src={src}
              shouldAutoplay={shouldAutoplay}
              className="relative h-full w-full"
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <MorphingMedia
      layoutId={layoutId}
      isOpen={isExpanded}
      onOpen={() => setExpandedId(id)}
      onClose={() => setExpandedId(null)}
      triggerClassName={cn(
        "cursor-zoom-in",
        !expandedId &&
          !isClosing &&
          "transition-transform duration-200 ease-out hover:scale-[1.01]",
        "aspect-video"
      )}
      expandedVariant="horizontal"
    >
      <div
        className="stroke relative h-full w-full overflow-hidden"
        style={{
          borderRadius: "var(--radius-card)",
          backgroundColor: VIDEO_PLACEHOLDER_COLOR,
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
  )
}
