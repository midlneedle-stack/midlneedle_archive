"use client"

import styles from "./case-article.module.css"
import { ArticleIphoneVideo, type IphoneVideoVariant } from "@/components/article-media"
import { useIsMobile } from "@/hooks/use-mobile"
import { withBasePath } from "@/lib/base-path"

interface IphoneVideoBlockProps {
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

function normalizeSources({
  src,
  src2,
  src3,
  srcs,
}: IphoneVideoBlockProps): string[] {
  const resolved: string[] = []

  if (srcs) {
    if (Array.isArray(srcs)) {
      resolved.push(...srcs)
    } else if (typeof srcs === "string") {
      resolved.push(srcs)
    } else if (typeof srcs === "object") {
      resolved.push(
        ...Object.values(srcs).filter(
          (value): value is string =>
            typeof value === "string" && value.length > 0
        )
      )
    }
  }

  if (resolved.length === 0) {
    if (src) resolved.push(src)
    if (src2) resolved.push(src2)
    if (src3) resolved.push(src3)
  }

  return resolved
    .filter((item): item is string => typeof item === "string" && item.length > 0)
    .map((item) => (item.startsWith("http") ? item : withBasePath(item)))
    .slice(0, 3)
}

function normalizeVariants(
  variants: IphoneVideoBlockProps["variants"],
  variant: IphoneVideoBlockProps["variant"],
  count: number
): IphoneVideoVariant[] {
  const normalized = Array.isArray(variants) ? variants : []
  const fallback: IphoneVideoVariant = variant ?? "square"

  return Array.from({ length: count }, (_, index) => {
    const value = normalized[index]
    if (value === "screenrecord" || value === "iphonevideo" || value === "square") {
      return value
    }
    return fallback
  })
}

export function IphoneVideoBlock(props: IphoneVideoBlockProps) {
  const {
    paddingY,
    paddingYByVariant,
    framePadding,
    framePaddingByVariant,
    showFrame,
    variant,
    variants,
  } = props
  const isMobile = useIsMobile()
  const normalizedSrcs = normalizeSources(props)
  const normalizedVariants = normalizeVariants(
    variants,
    variant,
    normalizedSrcs.length
  )

  if (normalizedSrcs.length === 0) {
    return null
  }

  if (isMobile && normalizedSrcs.length > 1) {
    return (
      <>
        {normalizedSrcs.map((videoSrc, index) => (
          <div key={`${videoSrc}-${index}`} className={styles.mediaBlock}>
            <ArticleIphoneVideo
              src={videoSrc}
              variant={normalizedVariants[index]}
              paddingY={
                paddingYByVariant?.[normalizedVariants[index]] ?? paddingY
              }
              framePadding={
                framePaddingByVariant?.[normalizedVariants[index]] ?? framePadding
              }
              showFrame={showFrame}
            />
          </div>
        ))}
      </>
    )
  }

  return (
    <div className={styles.mediaBlock}>
      <ArticleIphoneVideo
        srcs={normalizedSrcs}
        variants={normalizedVariants}
        paddingY={paddingY}
        paddingYByVariant={paddingYByVariant}
        framePadding={framePadding}
        framePaddingByVariant={framePaddingByVariant}
        showFrame={showFrame}
      />
    </div>
  )
}
