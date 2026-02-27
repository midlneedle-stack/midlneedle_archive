import { readFile } from "node:fs/promises"
import path from "node:path"
import { compileMDX } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import { mdxComponents } from "@/components/mdx-components"
import { MediaProvider } from "@/components/media-context"
import type { Metadata } from "next"

const ARTICLE_PATH = path.join(
  process.cwd(),
  "resourses",
  "cases",
  "yandex_tovary",
  "yandex_tovary.md"
)

export const metadata: Metadata = {
  title: "Yandex Tovary — Onboarding",
  description:
    "Кейс по проектированию онбординга для Яндекс Товаров: исследование, интервью, бенчмаркинг и макеты.",
}

export default async function YandexTovaryCasePage() {
  const source = await readFile(ARTICLE_PATH, "utf8")

  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  })

  return (
    <MediaProvider>
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl">
          <section>
            <header className="flex flex-col">
              <h2 className="type-card-title text-foreground">
                Yandex Tovary — Onboarding
              </h2>
              <div className="type-card-caption" style={{ marginTop: "var(--article-meta-gap)", color: "var(--faint-foreground)" }}>
                15 октября 2025
              </div>
            </header>

            <article className="mt-[var(--space-text)]">{content}</article>
          </section>
        </div>
      </main>
    </MediaProvider>
  )
}
