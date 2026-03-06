"use client"

import { useId, type CSSProperties } from "react"
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

export type IphoneVideoVariant = "square" | "iphonevideo" | "screenrecord"

interface ArticleIphoneVideoProps {
  src?: string
  src2?: string
  src3?: string
  srcs?: string[] | string
  variant?: IphoneVideoVariant
  variants?: IphoneVideoVariant[]
  paddingY?: number
  paddingYByVariant?: Partial<Record<IphoneVideoVariant, number>>
  framePadding?: number
  framePaddingByVariant?: Partial<Record<IphoneVideoVariant, number>>
  showFrame?: boolean
}

export function ArticleIphoneVideo({
  src,
  src2,
  src3,
  srcs,
  variant,
  variants,
  paddingY = 120,
  paddingYByVariant,
  framePadding = 20,
  framePaddingByVariant,
  showFrame,
}: ArticleIphoneVideoProps) {
  const id = useId()
  const { expandedId, isClosing, setExpandedId } = useMedia()
  const allowAutoplay = useVideoAutoplay()
  const isExpanded = expandedId === id
  const hasExpandedMedia = expandedId !== null
  const shouldAutoplay =
    isExpanded || (allowAutoplay && !hasExpandedMedia && !isClosing)
  const layoutId = `media-${id}`
  const resolvedVariants = Array.isArray(variants) ? variants : []
  const fallbackVariant: IphoneVideoVariant = variant ?? "square"
  const primaryVariant: IphoneVideoVariant = resolvedVariants[0] ?? fallbackVariant
  const resolvedPaddingY =
    paddingYByVariant?.[primaryVariant] ?? paddingY

  const resolvedSrcs: string[] = []

  if (srcs) {
    if (Array.isArray(srcs)) {
      resolvedSrcs.push(...srcs)
    } else if (typeof srcs === "string") {
      resolvedSrcs.push(srcs)
    } else if (typeof srcs === "object") {
      resolvedSrcs.push(
        ...Object.values(srcs).filter(
          (value): value is string =>
            typeof value === "string" && value.length > 0
        )
      )
    }
  }

  if (resolvedSrcs.length === 0) {
    if (src) resolvedSrcs.push(src)
    if (src2) resolvedSrcs.push(src2)
    if (src3) resolvedSrcs.push(src3)
  }

  const normalizedSrcs = resolvedSrcs
    .filter((item): item is string => typeof item === "string" && item.length > 0)
    .slice(0, 3)

  if (normalizedSrcs.length === 0) {
    return null
  }
  const desktopItemWidth =
    normalizedSrcs.length >= 3
      ? 200
      : normalizedSrcs.length === 2
        ? 260
        : 320
  const desktopGap =
    normalizedSrcs.length >= 3
      ? 10
      : normalizedSrcs.length === 2
        ? 12
        : 16

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
          className="flex h-full w-full flex-col items-stretch justify-center bg-[rgb(38_41_44_/0.02)] py-0 gap-[10px] md:flex-row md:items-center md:justify-center md:[gap:var(--desktop-gap)] md:px-[20px]"
          style={
            {
              "--iphone-padding-y": `${resolvedPaddingY}px`,
              "--desktop-item-width": `${desktopItemWidth}px`,
              "--desktop-gap": `${desktopGap}px`,
            } as CSSProperties
          }
        >
          {normalizedSrcs.map((videoSrc, index) => {
            const itemVariant =
              resolvedVariants[index] ?? fallbackVariant
            const aspectClass =
              itemVariant === "screenrecord"
                ? "aspect-[18/39]"
                : itemVariant === "iphonevideo"
                  ? "aspect-[9/18]"
                  : "aspect-square"
            const shouldShowFrame =
              showFrame ?? (itemVariant === "screenrecord")
            const effectiveFramePadding = shouldShowFrame
              ? framePaddingByVariant?.[itemVariant] ?? framePadding
              : 0

            return (
            <div
              key={`${videoSrc}-${index}`}
              className={cn(
                "relative overflow-hidden rounded-[10px] mx-auto w-[120px] md:w-[var(--desktop-item-width)] md:flex-none",
                aspectClass
              )}
            >
              <div className="absolute inset-0" style={{ padding: effectiveFramePadding }}>
                <div className="stroke relative h-full w-full overflow-hidden rounded-[10px]">
                  <OptimizedVideoPlayer
                    src={videoSrc}
                    shouldAutoplay={shouldAutoplay}
                    keepMounted={isExpanded || isClosing}
                    className="relative h-full w-full"
                  />
                </div>
              </div>
              {shouldShowFrame ? (
                <div className="pointer-events-none absolute inset-0">
                  <img
                    src={withBasePath("/videos/iPhone17_frame.webp")}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : null}
            </div>
            )
          })}
        </div>
      </div>
    </MorphingMedia>
  )
}
