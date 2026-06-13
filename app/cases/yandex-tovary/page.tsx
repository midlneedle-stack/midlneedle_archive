import { readFile } from "node:fs/promises"
import path from "node:path"
import { compileMDX } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import { CaseArticle } from "@/components/case-article"
import { mdxComponents } from "@/components/mdx-components"
import { MediaProvider } from "@/components/media-context"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

const ARTICLE_PATH_RU = path.join(
  process.cwd(),
  "resourses",
  "cases",
  "yandex_tovary",
  "yandex_tovary.md"
)

const ARTICLE_PATH_EN = path.join(
  process.cwd(),
  "resourses",
  "cases",
  "yandex_tovary",
  "yandex_tovary_en.md"
)

const TITLE_EN = "Yandex Tovary — Onboarding"
const TITLE_RU = "Онбординг в «Яндекс Товары»"

export const metadata: Metadata = {
  title: "Yandex Tovary — Onboarding",
  description:
    "Case study on designing onboarding for Yandex Tovary: research, interviews, benchmarking, and mockups.",
}

export default async function YandexTovaryCasePage() {
  notFound()

  const [rawRu, rawEn] = await Promise.all([
    readFile(ARTICLE_PATH_RU, "utf8"),
    readFile(ARTICLE_PATH_EN, "utf8"),
  ])

  const [{ content: ruContent }, { content: engContent }] = await Promise.all([
    compileMDX({
      source: rawRu,
      components: mdxComponents,
      options: {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
        },
      },
    }),
    compileMDX({
      source: rawEn,
      components: mdxComponents,
      options: {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
        },
      },
    }),
  ])

  return (
    <MediaProvider>
      <CaseArticle
        content={{
          eng: {
            title: TITLE_EN,
            body: engContent,
            publishedAt: "November 15, 2025",
          },
          ru: {
            title: TITLE_RU,
            body: ruContent,
            publishedAt: "15 ноября 2025",
          },
        }}
      />
    </MediaProvider>
  )
}
