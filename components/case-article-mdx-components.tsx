import type { MDXComponents } from "mdx/types"
import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { Children, isValidElement } from "react"
import styles from "./case-article.module.css"
import { CaseMediaPlaceholder } from "@/components/case-media-placeholder"
import { HapticLink } from "@/components/haptic-link"
import { ArticleImage, ArticleVideo } from "@/components/article-media"
import { PebbleWatchface } from "@/components/pebble-watchface"
import { withBasePath } from "@/lib/base-path"

const BLOCK_TYPES = new Set(["img", "div", "figure", "table", "video", "audio"])

function hasBlockContent(children: ReactNode): boolean {
  return Children.toArray(children).some(
    (child) =>
      isValidElement(child) &&
      (typeof child.type === "string"
        ? BLOCK_TYPES.has(child.type)
        : true)
  )
}

export const caseArticleMdxComponents: MDXComponents = {
  h1: ({ children }: ComponentPropsWithoutRef<"h1">) => (
    <h2 className={`type-title text-foreground ${styles.sectionTitle}`}>{children}</h2>
  ),
  h2: ({ children }: ComponentPropsWithoutRef<"h2">) => (
    <h2 className={`type-title text-foreground ${styles.sectionTitle}`}>{children}</h2>
  ),
  h3: ({ children }: ComponentPropsWithoutRef<"h3">) => (
    <h2 className={`type-title text-foreground ${styles.sectionTitle}`}>{children}</h2>
  ),
  p: ({ children }: ComponentPropsWithoutRef<"p">) => {
    if (hasBlockContent(children)) {
      return (
        <div className={`type-body ${styles.paragraph}`}>
          {children}
        </div>
      )
    }
    return (
      <p className={`type-body ${styles.paragraph}`}>
        {children}
      </p>
    )
  },
  a: ({ href, children, className, ...props }: ComponentPropsWithoutRef<"a">) => {
    const isFootnoteRef = "data-footnote-ref" in props
    const isFootnoteBackref = "data-footnote-backref" in props
    const renderedChildren = isFootnoteBackref ? null : children
    const isExternal =
      typeof href === "string" && /^https?:\/\//.test(href)
    const resolvedClassName = [
      className,
      !isFootnoteRef && !isFootnoteBackref ? styles.inlineLink : null,
    ]
      .filter(Boolean)
      .join(" ")

    if (isFootnoteRef || isFootnoteBackref) {
      return (
        <a
          href={href}
          className={resolvedClassName || undefined}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          {...props}
        >
          {renderedChildren}
        </a>
      )
    }

    return (
      <HapticLink
        href={href}
        className={resolvedClassName || undefined}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        {...props}
      >
        {renderedChildren}
      </HapticLink>
    )
  },
  strong: ({ children }: ComponentPropsWithoutRef<"strong">) => (
    <strong>{children}</strong>
  ),
  img: ({ src, alt }: ComponentPropsWithoutRef<"img">) => (
    <div className={styles.mediaBlock}>
      <ArticleImage
        src={typeof src === "string" ? withBasePath(src) : ""}
        alt={alt ?? ""}
      />
    </div>
  ),
  SquareImage: ({ src, alt }: { src: string; alt?: string }) => (
    <div className={styles.mediaBlock}>
      <ArticleImage
        src={withBasePath(src)}
        alt={alt ?? ""}
        aspect="square"
        interactive={false}
      />
    </div>
  ),
  section: ({ children, ...props }: ComponentPropsWithoutRef<"section"> & { "data-footnotes"?: string | boolean }) => {
    if (props["data-footnotes"] !== undefined) {
      const className = props.className
        ? `${styles.footnotes} ${props.className}`
        : styles.footnotes
      return (
        <section {...props} className={className}>
          {children}
        </section>
      )
    }
    return <section {...props}>{children}</section>
  },
  PebbleWatchface: () => (
    <div className={styles.mediaBlock}>
      <PebbleWatchface />
    </div>
  ),
  MediaPlaceholder: CaseMediaPlaceholder,
  VideoPlayer: ({ src }: { src: string }) => (
    <div className={styles.videoCard}>
      <ArticleVideo src={withBasePath(src)} variant="just_video" />
    </div>
  ),
  IphoneVideo: ({
    src,
  }: {
    src: string
  }) => (
    <div className={styles.mediaBlock}>
      <ArticleVideo src={withBasePath(src)} variant="iphone" />
    </div>
  ),
  Screencast: ({
    src,
  }: {
    src: string
  }) => (
    <div className={styles.mediaBlock}>
      <ArticleVideo src={withBasePath(src)} variant="screencast" />
    </div>
  ),
}
