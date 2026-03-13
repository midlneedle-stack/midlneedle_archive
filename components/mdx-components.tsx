import type { MDXComponents } from "mdx/types"
import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { Children, isValidElement } from "react"
import { withBasePath } from "@/lib/base-path"
import { AudioPlayer } from "@/components/audio-player"
import { ArticleImage, ArticleVideo } from "@/components/article-media"
import styles from "./yandex-article.module.css"
import caseArticleStyles from "./case-article.module.css"
import { HapticLink } from "@/components/haptic-link"

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

export const mdxComponents: MDXComponents = {
  h1: ({ children }: ComponentPropsWithoutRef<"h1">) => (
    <h2 className={`type-title text-foreground ${styles.sectionTitle}`}>{children}</h2>
  ),
  h2: ({ children }: ComponentPropsWithoutRef<"h2">) => (
    <h3 className={`type-card-title text-foreground ${styles.subsectionTitle}`}>{children}</h3>
  ),
  h3: ({ children }: ComponentPropsWithoutRef<"h3">) => (
    <h4 className={`type-card-title text-foreground ${styles.subsectionTitle}`}>{children}</h4>
  ),
  p: ({ children }: ComponentPropsWithoutRef<"p">) => {
    if (hasBlockContent(children)) {
      return <div className={`type-body text-foreground ${styles.paragraph}`}>{children}</div>
    }
    return <p className={`type-body text-foreground ${styles.paragraph}`}>{children}</p>
  },
  ul: ({ children, className, ...props }: ComponentPropsWithoutRef<"ul">) => (
    <ul
      {...props}
      className={[className, styles.list].filter(Boolean).join(" ")}
    >
      {children}
    </ul>
  ),
  ol: ({ children, className, ...props }: ComponentPropsWithoutRef<"ol">) => (
    <ol
      {...props}
      className={[className, styles.list].filter(Boolean).join(" ")}
    >
      {children}
    </ol>
  ),
  li: ({ children, className, ...props }: ComponentPropsWithoutRef<"li">) => (
    <li
      {...props}
      className={[className, styles.listItem].filter(Boolean).join(" ")}
    >
      {children}
    </li>
  ),
  a: ({ href, children, className, ...props }: ComponentPropsWithoutRef<"a">) => {
    const isFootnoteRef = "data-footnote-ref" in props
    const isFootnoteBackref = "data-footnote-backref" in props
    const renderedChildren = isFootnoteBackref ? null : children
    const isExternal = typeof href === "string" && /^https?:\/\//.test(href)
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
  table: ({ children }: ComponentPropsWithoutRef<"table">) => (
    <div className={styles.tableWrapper}>
      <div className={styles.tableScroll}>
        <table className={styles.table}>{children}</table>
      </div>
    </div>
  ),
  th: ({ children }: ComponentPropsWithoutRef<"th">) => (
    <th className={`type-body ${styles.th}`}>{children}</th>
  ),
  td: ({ children }: ComponentPropsWithoutRef<"td">) => (
    <td className={`type-body ${styles.td}`}>{children}</td>
  ),
  img: ({ src, alt }: ComponentPropsWithoutRef<"img">) => (
    <div className={styles.imageWrapper}>
      <ArticleImage
        src={typeof src === "string" ? withBasePath(src) : ""}
        alt={alt ?? ""}
      />
    </div>
  ),
  SquareImage: ({ src, alt }: { src: string; alt?: string }) => (
    <div className={styles.imageWrapper}>
      <ArticleImage
        src={withBasePath(src)}
        alt={alt ?? ""}
        aspect="square"
        interactive={false}
      />
    </div>
  ),
  AudioPlayer: ({ src }: { src: string }) => (
    <AudioPlayer src={src} />
  ),
  InterviewHeading: ({ title, src }: { title: string; src?: string }) => (
    <div className={styles.interviewName}>
      <h3 className="type-title text-foreground" style={{ flexShrink: 0 }}>{title}</h3>
      <span aria-hidden="true" className={styles.interviewRule} />
      {src && <AudioPlayer src={src} />}
    </div>
  ),
  VideoPlayer: ({ src }: { src: string }) => (
    <div className={styles.videoCard}>
      <ArticleVideo src={withBasePath(src)} />
    </div>
  ),
  HypothesisCard: ({ title, body }: { title: string; body: string }) => (
    <div className={styles.hypothesisCard}>
      <div className={`type-body text-balance text-foreground ${styles.hypothesisTitle}`}>{title}</div>
      <div className={`type-body text-foreground ${styles.hypothesisBody}`}>{body}</div>
    </div>
  ),
  section: ({ children, ...props }: ComponentPropsWithoutRef<"section"> & { "data-footnotes"?: string | boolean }) => {
    if (props["data-footnotes"] !== undefined) {
      const className = props.className
        ? `${caseArticleStyles.footnotes} ${styles.footnotesReset} ${props.className}`
        : `${caseArticleStyles.footnotes} ${styles.footnotesReset}`
      return (
        <section {...props} className={className}>
          {children}
        </section>
      )
    }
    return <section {...props}>{children}</section>
  },
}
