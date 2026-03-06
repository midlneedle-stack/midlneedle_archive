"use client"

import { useId } from "react"
import { cn } from "@/lib/utils"
import { useMedia } from "./media-context"
import { MorphingMedia } from "./morphing-media"
import { useVideoAutoplay } from "@/hooks/use-video-autoplay"
import { OptimizedVideoPlayer } from "./optimized-video-player"
import { withBasePath } from "@/lib/base-path"
import { VIDEO_PLACEHOLDER_COLOR } from "@/lib/video-placeholders"

interface ArticleImageProps {
  src: string
  alt?: string
}

export function ArticleImage({ src, alt = "" }: ArticleImageProps) {
  const id = useId()
  const { expandedId, isClosing, setExpandedId } = useMedia()
  const isExpanded = expandedId === id
  const layoutId = `media-${id}`
  const isTall = src.includes("1920_1360")
  const aspectClass = isTall ? "aspect-[24/17]" : "aspect-video"

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
    </MorphingMedia>
  )
}

interface ArticleVideoProps {
  src: string
}

export function ArticleVideo({ src }: ArticleVideoProps) {
  const id = useId()
  const { expandedId, isClosing, setExpandedId } = useMedia()
  const allowAutoplay = useVideoAutoplay()
  const isExpanded = expandedId === id
  const hasExpandedMedia = expandedId !== null
  const shouldAutoplay =
    isExpanded || (allowAutoplay && !hasExpandedMedia && !isClosing)
  const layoutId = `media-${id}`

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

interface ArticleIphoneVideoProps {
  src: string
  paddingY?: number
  framePadding?: number
  showFrame?: boolean
}

export function ArticleIphoneVideo({
  src,
  paddingY = 20,
  framePadding = 18,
  showFrame = false,
}: ArticleIphoneVideoProps) {
  const id = useId()
  const { expandedId, isClosing, setExpandedId } = useMedia()
  const allowAutoplay = useVideoAutoplay()
  const isExpanded = expandedId === id
  const hasExpandedMedia = expandedId !== null
  const shouldAutoplay =
    isExpanded || (allowAutoplay && !hasExpandedMedia && !isClosing)
  const layoutId = `media-${id}`

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
        <div
          className="flex h-full w-full items-center justify-center bg-[rgb(38_41_44_/0.02)]"
          style={{ paddingTop: paddingY, paddingBottom: paddingY }}
        >
          <div className="relative h-full aspect-[9/16] overflow-hidden rounded-[20px]">
            <div className="absolute inset-0" style={{ padding: framePadding }}>
              <div className="relative h-full w-full overflow-hidden rounded-[20px]">
                <OptimizedVideoPlayer
                  src={src}
                  shouldAutoplay={shouldAutoplay}
                  keepMounted={isExpanded || isClosing}
                  className="relative h-full w-full"
                />
              </div>
            </div>
            {showFrame ? (
              <div className="pointer-events-none absolute inset-0">
                <img
                  src={withBasePath("/videos/iPhone17_frame.webp")}
                  alt=""
                  className="h-full w-full object-contain"
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </MorphingMedia>
  )
}
