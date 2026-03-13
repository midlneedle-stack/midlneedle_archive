import { readFile } from "node:fs/promises"
import path from "node:path"
import { compileMDX } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import { CaseArticle } from "@/components/case-article"
import { caseArticleMdxComponents } from "@/components/case-article-mdx-components"
import { MediaProvider } from "@/components/media-context"

const ARTICLE_PATH_RU = path.join(
  process.cwd(),
  "resourses",
  "cases",
  "letterboxd",
  "Letterboxd_case_study.md"
)

const ARTICLE_PATH_EN = path.join(
  process.cwd(),
  "resourses",
  "cases",
  "letterboxd",
  "Letterboxd_case_study_en.md"
)

const TITLE_EN = "Letterboxd — Case Study"
const TITLE_RU = "Редизайн Letterboxd: социальной сети для любителей кино"

export default async function LetterboxdCasePage() {
  const [rawRu, rawEn] = await Promise.all([
    readFile(ARTICLE_PATH_RU, "utf8"),
    readFile(ARTICLE_PATH_EN, "utf8"),
  ])

  const [{ content: ruContent }, { content: engContent }] = await Promise.all([
    compileMDX({
      source: rawRu,
      components: caseArticleMdxComponents,
      options: {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
        },
      },
    }),
    compileMDX({
      source: rawEn,
      components: caseArticleMdxComponents,
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
            publishedAt: "February 28, 2026",
          },
          ru: {
            title: TITLE_RU,
            body: ruContent,
            publishedAt: "28 февраля 2026",
          },
        }}
      />
    </MediaProvider>
  )
}
