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

const TITLE_RU = "Letterboxd — Case Study"

export default async function LetterboxdCasePage() {
  const rawRu = await readFile(ARTICLE_PATH_RU, "utf8")

  const { content: ruContent } = await compileMDX({
    source: rawRu,
    components: caseArticleMdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  })

  return (
    <MediaProvider>
      <CaseArticle
        content={{
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
