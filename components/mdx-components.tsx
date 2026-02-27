import type { MDXComponents } from "mdx/types"
import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { Children, isValidElement } from "react"
import { withBasePath } from "@/lib/base-path"
import { AudioPlayer } from "@/components/audio-player"
import { ArticleImage, ArticleVideo } from "@/components/article-media"
import styles from "./yandex-article.module.css"

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
    <h2 className={`type-card-title text-foreground ${styles.sectionTitle}`}>{children}</h2>
  ),
  h2: ({ children }: ComponentPropsWithoutRef<"h2">) => (
    <h3 className={`type-card-title text-foreground ${styles.subsectionTitle}`}>{children}</h3>
  ),
  h3: ({ children }: ComponentPropsWithoutRef<"h3">) => (
    <h4 className={`type-card-title text-foreground ${styles.subsectionTitle}`}>{children}</h4>
  ),
  p: ({ children }: ComponentPropsWithoutRef<"p">) => {
    if (hasBlockContent(children)) {
      return <div className={`type-article text-foreground ${styles.paragraph}`}>{children}</div>
    }
    return <p className={`type-article text-foreground ${styles.paragraph}`}>{children}</p>
  },
  ul: ({ children }: ComponentPropsWithoutRef<"ul">) => (
    <ul className={styles.list} style={{ listStyleType: "disc" }}>
      {children}
    </ul>
  ),
  ol: ({ children }: ComponentPropsWithoutRef<"ol">) => (
    <ol className={styles.list} style={{ listStyleType: "decimal" }}>
      {children}
    </ol>
  ),
  li: ({ children }: ComponentPropsWithoutRef<"li">) => (
    <li className={styles.listItem}>{children}</li>
  ),
  a: ({ href, children }: ComponentPropsWithoutRef<"a">) => (
    <a
      href={href}
      className={styles.inlineLink}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
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
    <th className={styles.th}>{children}</th>
  ),
  td: ({ children }: ComponentPropsWithoutRef<"td">) => (
    <td className={styles.td}>{children}</td>
  ),
  img: ({ src, alt }: ComponentPropsWithoutRef<"img">) => (
    <div className={styles.imageWrapper}>
      <ArticleImage
        src={typeof src === "string" ? withBasePath(src) : ""}
        alt={alt ?? ""}
      />
    </div>
  ),
  AudioPlayer: ({ src, label }: { src: string; label?: string }) => (
    <div className={styles.audioCard}>
      <AudioPlayer src={src} label={label} />
    </div>
  ),
  VideoPlayer: ({ src }: { src: string }) => (
    <div className={styles.videoCard}>
      <ArticleVideo src={withBasePath(src)} />
    </div>
  ),
}
