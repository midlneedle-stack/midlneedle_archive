import { readFile } from "node:fs/promises"
import path from "node:path"
import styles from "./styles.module.css"

type ArticleBlock =
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "media"; label: string; aspect: string }

const ARTICLE_PATH = path.join(
  process.cwd(),
  "resourses",
  "cases",
  "watchface",
  "watchface_case.md"
)

function parseArticle(raw: string) {
  const blocks: ArticleBlock[] = []
  const footnotes: string[] = []
  let title = ""

  const chunks = raw
    .trim()
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)

  for (const chunk of chunks) {
    const headingMatch = chunk.match(/^\*\*([\s\S]+)\*\*$/)
    if (headingMatch) {
      const text = headingMatch[1].trim()
      if (!title) {
        title = text
      } else {
        blocks.push({ type: "heading", text })
      }
      continue
    }

    const normalized = chunk.replace(/\n+/g, " ").trim()
    const subheadingMatch = normalized.match(/^\*\*(.+?)\*\*\s*(.+)$/)
    if (subheadingMatch) {
      blocks.push({ type: "subheading", text: subheadingMatch[1].trim() })
      blocks.push({ type: "paragraph", text: subheadingMatch[2].trim() })
      continue
    }

    const footnoteMatch = normalized.match(/^\\?\*(?!\*)\s*(.+)$/)
    if (footnoteMatch) {
      footnotes.push(footnoteMatch[1].trim())
      continue
    }

    blocks.push({ type: "paragraph", text: normalized })
  }

  const withMedia: ArticleBlock[] = []
  for (const block of blocks) {
    withMedia.push(block)

    if (block.type === "subheading") {
      if (block.text.includes("Анимация запуска")) {
        withMedia.push({
          type: "media",
          label: "Видео · Анимация запуска",
          aspect: "aspect-video",
        })
      }
    }

    if (block.type === "paragraph") {
      if (block.text.includes("картинка, к которой я хотел прийти")) {
        withMedia.push({
          type: "media",
          label: "Фото · Первый вотчфейс",
          aspect: "aspect-[4/3]",
        })
      }

      if (block.text.includes("я постарался привести все к более привычному современному пользователю интерфейсу")) {
        withMedia.push({
          type: "media",
          label: "Фото · Экран настроек",
          aspect: "aspect-[16/10]",
        })
      }
    }

    if (block.type === "heading" && block.text === "Детали") {
      withMedia.push({
        type: "media",
        label: "Фото · Общий вид вотчфейса",
        aspect: "aspect-[3/2]",
      })
    }
  }

  return { title, blocks: withMedia, footnotes }
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

      nodes.push(
        <a
          key={`fn-${footnoteCounter.current}-${nodes.length}`}
          id={`fnref-${footnoteCounter.current}`}
          href={`#fn-${footnoteCounter.current}`}
          data-footnote-ref
          aria-label={`Сноска ${footnoteCounter.current}`}
          className={styles.footnoteRef}
        >
          {precedingText}
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

export default async function WatchfaceCasePage() {
  const raw = await readFile(ARTICLE_PATH, "utf8")
  const { title, blocks, footnotes } = parseArticle(raw)
  const footnoteCounter = { current: 0 }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl">
        <section>
          <header className="flex flex-col gap-[var(--space-text)]">
            <h1 className={`type-title text-foreground ${styles.title}`}>
              {title}
            </h1>
            <div className={`type-card-caption text-muted-foreground ${styles.meta}`}>
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
  )
}
