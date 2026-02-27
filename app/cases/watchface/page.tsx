import { readFile } from "node:fs/promises"
import path from "node:path"
import { CaseArticle } from "@/components/case-article"
import {
  parseCaseArticle,
  type CaseArticleMediaInsertion,
} from "@/lib/case-article"

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

const WATCHFACE_MEDIA_INSERTIONS_RU: CaseArticleMediaInsertion[] = [
  {
    match:
      "Это история о том, как я выпустил в свет свой небольшой продукт на весьма нишевый девайс, но ведь все когда-то начинается с малого не так ли?",
    label: "Фото · Обложка кейса",
    aspect: "aspect-video",
    position: "after",
  },
  {
    match: "картинка, к которой я хотел прийти",
    label: "Фото · Первый вотчфейс",
    aspect: "aspect-video",
  },
  {
    match:
      "С этими знаниями я подошёл к созданию своего последнего, на момент написания статьи, вотчфейса.",
    label: "Видео · Первый вотчфейс",
    aspect: "aspect-video",
  },
  {
    match: "я постарался привести все к более привычному современному пользователю интерфейсу",
    label: "Фото · Экран настроек",
    aspect: "aspect-video",
  },
  {
    match: "как лучше пользоваться нейронкой, чтобы ускорить перенос визуала в код",
    label: "Фото · Общий вид вотчфейса",
    aspect: "aspect-video",
  },
  {
    match: "стоит сказать, что большая часть времени была потрачена именно в попытках оптимизировать и отполировать анимацию",
    label: "Видео · Анимация запуска",
    aspect: "aspect-video",
  },
  {
    match: "несколько человек даже поделились фотографиями своих часов с моим вотчфейсом",
    label: "Фото · Discord",
    aspect: "aspect-video",
  },
  {
    match:
      "В целом реакция была положительной и я подумал почему бы не запостить про это в Twitter – перед сном решил набросать небольшое сообщение, отметил аккаунт Эрика Магиковски и нажал на кнопку “Post”.",
    label: "Фото · Пост в Twitter",
    aspect: "aspect-video",
  },
]

const WATCHFACE_MEDIA_INSERTIONS_EN: CaseArticleMediaInsertion[] = [
  {
    match: "This is a story about launching a small product for a niche device.",
    label: "Photo · Case cover",
    aspect: "aspect-video",
    position: "after",
  },
  {
    match:
      "With all that behind me, I took on my latest watchface.",
    label: "Video · First watchface",
    aspect: "aspect-video",
  },
  {
    match: "I also put some work into the settings page itself.",
    label: "Photo · Settings screen",
    aspect: "aspect-video",
  },
  {
    match:
      "The visual design was the easy part – I already had a mockup in Figma and knew how to use AI to speed up getting from design to code.",
    label: "Photo · General watchface view",
    aspect: "aspect-video",
  },
  {
    match: "worth noting that most of my time went into optimizing and polishing this animation.",
    label: "Video · Launch animation",
    aspect: "aspect-video",
  },
  {
    match: "A few people even shared photos of their watches with my watchface running.",
    label: "Photo · Discord",
    aspect: "aspect-video",
  },
  {
    match:
      "The response was positive, so I figured why not tweet about it. Right before bed, I put together a quick post, tagged Eric Migicovsky, and hit publish.",
    label: "Photo · Twitter post",
    aspect: "aspect-video",
  },
]

export default async function WatchfaceCasePage() {
  const [rawRu, rawEn] = await Promise.all([
    readFile(ARTICLE_PATH_RU, "utf8"),
    readFile(ARTICLE_PATH_EN, "utf8"),
  ])

  const ru = parseCaseArticle(rawRu, {
    mediaInsertions: WATCHFACE_MEDIA_INSERTIONS_RU,
  })
  const eng = parseCaseArticle(rawEn, {
    mediaInsertions: WATCHFACE_MEDIA_INSERTIONS_EN,
  })

  return (
    <CaseArticle
      content={{
        eng: {
          title: eng.title,
          blocks: eng.blocks,
          footnotes: eng.footnotes,
          publishedAt: "December 18, 2025",
        },
        ru: {
          title: ru.title,
          blocks: ru.blocks,
          footnotes: ru.footnotes,
          publishedAt: "18 декабря 2025",
        },
      }}
    />
  )
}
