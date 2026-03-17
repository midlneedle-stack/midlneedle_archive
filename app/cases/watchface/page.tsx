import { readFile } from "node:fs/promises"
import path from "node:path"
import { compileMDX } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import { CaseArticle } from "@/components/case-article"
import { getCaseArticleMdxComponents } from "@/components/case-article-mdx-components"
import { MediaProvider } from "@/components/media-context"

const ARTICLE_PATH_RU = path.join(
  process.cwd(),
  "resourses",
  "cases",
  "watchface",
  "watchface_case.md"
)

const ARTICLE_PATH_EN = path.join(
  process.cwd(),
  "resourses",
  "cases",
  "watchface",
  "watchface_case_en.md"
)

const TITLE_EN = "How I built a Pebble watchface and got noticed by the company's founder"
const TITLE_RU = "Как я сделал вотчфейс для Pebble и привлек внимание фаундера компании"

export default async function WatchfaceCasePage() {
  const [rawRu, rawEn] = await Promise.all([
    readFile(ARTICLE_PATH_RU, "utf8"),
    readFile(ARTICLE_PATH_EN, "utf8"),
  ])

  const [{ content: ruContent }, { content: engContent }] = await Promise.all([
    compileMDX({
      source: rawRu,
      components: getCaseArticleMdxComponents("ru"),
      options: {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
        },
      },
    }),
    compileMDX({
      source: rawEn,
      components: getCaseArticleMdxComponents("eng"),
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
            publishedAt: "December 18, 2025",
          },
          ru: {
            title: TITLE_RU,
            body: ruContent,
            publishedAt: "18 декабря 2025",
          },
        }}
      />
    </MediaProvider>
  )
}
