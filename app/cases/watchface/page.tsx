import { readFile } from "node:fs/promises"
import path from "node:path"
import PageClient from "./page-client"

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

      if (block.text.includes("как лучше пользоваться нейронкой, чтобы ускорить перенос визуала в код")) {
        withMedia.push({
          type: "media",
          label: "Фото · Общий вид вотчфейса",
          aspect: "aspect-[3/2]",
        })
      }

      if (block.text.includes("стоит сказать, что большая часть времени была потрачена именно в попытках оптимизировать и отполировать анимацию")) {
        withMedia.push({
          type: "media",
          label: "Видео · Анимация запуска",
          aspect: "aspect-video",
        })
      }
    }
  }

  return { title, blocks: withMedia, footnotes }
}

export default async function WatchfaceCasePage() {
  const raw = await readFile(ARTICLE_PATH, "utf8")
  const { title, blocks, footnotes } = parseArticle(raw)

  return <PageClient title={title} blocks={blocks} footnotes={footnotes} />
}
