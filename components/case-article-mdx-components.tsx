import type { MDXComponents } from "mdx/types"
import type { ComponentPropsWithoutRef } from "react"
import styles from "./case-article.module.css"
import { CaseMediaPlaceholder } from "@/components/case-media-placeholder"
import { HapticLink } from "@/components/haptic-link"
import { ArticleIphoneVideo, ArticleVideo } from "@/components/article-media"
import { withBasePath } from "@/lib/base-path"

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
  p: ({ children }: ComponentPropsWithoutRef<"p">) => (
    <p className={`type-article text-foreground ${styles.paragraph}`}>{children}</p>
  ),
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
  MediaPlaceholder: CaseMediaPlaceholder,
  VideoPlayer: ({ src }: { src: string }) => (
    <ArticleVideo src={withBasePath(src)} />
  ),
  IphoneVideo: ({
    src,
    paddingY,
    framePadding,
    showFrame,
  }: {
    src: string
    paddingY?: number
    framePadding?: number
    showFrame?: boolean
  }) => (
    <ArticleIphoneVideo
      src={withBasePath(src)}
      paddingY={paddingY}
      framePadding={framePadding}
      showFrame={showFrame}
    />
  ),
}
