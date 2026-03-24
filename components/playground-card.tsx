"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { HapticLink } from "@/components/haptic-link"

interface PlaygroundCardProps {
  children: ReactNode
  title: string
  description?: string
  descriptionHref?: string
  mediaHref?: string
  showTitle?: boolean
  showDescription?: boolean
  className?: string
}

export function PlaygroundCard({
  children,
  title,
  description,
  descriptionHref,
  mediaHref,
  showTitle = true,
  showDescription = true,
  className,
}: PlaygroundCardProps) {
  const media = mediaHref ? (
    <HapticLink href={mediaHref} aria-label={title} className="block">
      {children}
    </HapticLink>
  ) : (
    children
  )

  return (
    <div className={cn("relative flex flex-col origin-center", className)}>
      <div className="mb-[var(--space-inset)]">{media}</div>
      <div className="flex flex-col gap-[var(--space-card-text)]">
        {showTitle && (
          <h3 className="type-body m-0 text-balance text-foreground">
            {title}
          </h3>
        )}
        {showDescription && description && (
          descriptionHref ? (
            <HapticLink
              href={descriptionHref}
              className="type-body m-0 block text-balance text-faint-foreground underline decoration-[var(--link-underline)] underline-offset-[0.16em] decoration-1 hover:decoration-foreground"
            >
              {description}
            </HapticLink>
          ) : (
            <p className="type-body m-0 text-balance text-faint-foreground">
              {description}
            </p>
          )
        )}
      </div>
    </div>
  )
}
