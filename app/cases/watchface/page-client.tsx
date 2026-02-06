'use client'

import { ViewTransition } from 'react'
import styles from "./styles.module.css"

type ArticleBlock =
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "media"; label: string; aspect: string }

interface PageClientProps {
  title: string
  blocks: ArticleBlock[]
  footnotes: string[]
}

function renderInline(text: string, footnoteCounter: { current: number }) {
  const segments = text.split(/(\\\*)/)
  const nodes: React.ReactNode[] = []

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]

    if (segment === "\\*") {
      footnoteCounter.current += 1

      // Захватываем предыдущий текстовый узел и извлекаем последнее слово/фразу
      let precedingText = ""
      if (nodes.length > 0) {
        const lastNode = nodes[nodes.length - 1]
        if (typeof lastNode === "string") {
          const match = lastNode.match(/(\S+(?:\s+\S+)?)$/)
          if (match) {
            precedingText = match[1]
            nodes[nodes.length - 1] = lastNode.slice(0, -precedingText.length)
          }
        }
      }

      if (precedingText) {
        nodes.push(precedingText)
        nodes.push(" ")
      }

      nodes.push(
        <a
          key={`fn-${footnoteCounter.current}-${nodes.length}`}
          id={`fnref-${footnoteCounter.current}`}
          href={`#fn-${footnoteCounter.current}`}
          data-footnote-ref
          aria-label={`Сноска ${footnoteCounter.current}`}
          className={styles.footnoteRef}
        >
          <span className={styles.footnoteNumber}>
            {footnoteCounter.current}
          </span>
        </a>
      )
      continue
    }

    const boldRegex = /\*\*(.+?)\*\*/g
    let lastIndex = 0
    let match: RegExpExecArray | null

    while ((match = boldRegex.exec(segment))) {
      if (match.index > lastIndex) {
        nodes.push(segment.slice(lastIndex, match.index))
      }
      nodes.push(
        <strong key={`b-${match.index}-${nodes.length}`}>
          {match[1]}
        </strong>
      )
      lastIndex = match.index + match[0].length
    }

    if (lastIndex < segment.length) {
      nodes.push(segment.slice(lastIndex))
    }
  }

  return nodes
}

export default function PageClient({ title, blocks, footnotes }: PageClientProps) {
  const footnoteCounter = { current: 0 }

  return (
    <ViewTransition>
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl">
          <section>
            <header className="flex flex-col gap-[var(--space-text)]">
              <h2 className="type-title text-foreground">
                {title}
              </h2>
              <div className={`type-card-caption ${styles.meta}`}>
                18 декабря 2025
              </div>
            </header>

            <article className={`mt-[var(--space-text)] ${styles.article}`}>
              {blocks.map((block, index) => {
                if (block.type === "heading") {
                  return (
                    <h2
                      key={`h-${index}`}
                      className={`type-title text-foreground ${styles.sectionTitle}`}
                    >
                      {block.text}
                    </h2>
                  )
                }

                if (block.type === "subheading") {
                  return (
                    <h3
                      key={`h3-${index}`}
                      className={`type-card-title text-foreground ${styles.cardTitle}`}
                    >
                      {block.text}
                    </h3>
                  )
                }

                if (block.type === "media") {
                  return (
                    <div
                      key={`m-${index}`}
                      className={`${styles.placeholder} ${block.aspect}`}
                    >
                      <span className="type-card-caption text-muted-foreground">
                        {block.label}
                      </span>
                    </div>
                  )
                }

                return (
                  <p
                    key={`p-${index}`}
                    className={`type-article text-foreground ${styles.paragraph}`}
                  >
                    {renderInline(block.text, footnoteCounter)}
                  </p>
                )
              })}
            </article>

            {footnotes.length > 0 ? (
              <section className={styles.footnotes} data-footnotes>
                <ol className={styles.footnotesList} data-prose-type="list">
                  {footnotes.map((note, index) => (
                    <li
                      key={`fn-item-${index}`}
                      className={styles.footnoteItem}
                      id={`fn-${index + 1}`}
                      data-index={index + 1}
                      data-prose-type="text"
                    >
                      {renderInline(note, { current: 0 })}
                      <a
                        href={`#fnref-${index + 1}`}
                        data-footnote-backref
                        className={styles.footnoteBackref}
                        aria-label={`Назад к упоминанию сноски ${index + 1}`}
                      >
                        ↩
                      </a>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}
          </section>
        </div>
      </main>
    </ViewTransition>
  )
}
