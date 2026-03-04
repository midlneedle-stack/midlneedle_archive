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
  "letterboxd",
  "Letterboxd_case_study.md"
)

const LETTERBOXD_MEDIA_INSERTIONS_RU: CaseArticleMediaInsertion[] = [
  {
    match: "Однако мобильное приложение, на мой взгляд, могло бы быть чуточку лучше.",
    label: "Фото · Обложка кейса",
    aspect: "aspect-video",
    position: "after",
  },
  {
    match:
      "Также я решил немного переосмыслить UI – без какой-либо привязки к нынешнему облику бренда – опираясь только на собственный вкус и собрал после этого прототип на SwiftUI.",
    label: "Видео · Прототип SwiftUI",
    aspect: "aspect-video",
  },
  {
    match:
      "Немного полистав блоки с горизонтальным скроллом пользователь спускается вниз и очень скоро упирается в конец ленты.",
    label: "Фото · Текущая главная",
    aspect: "aspect-video",
  },
  {
    match: "Я решил разделить ленту на две глобальные секции – All и Friends.",
    label: "Фото · Новая структура ленты",
    aspect: "aspect-video",
  },
  {
    match:
      "На самом-то деле в десктопной версии Letterboxd и нет этого деления на секции – в ней есть только одна лента в которой есть место и фильмам, и подборкам, и статьям – почему в мобильной версии решили пойти другим путем – вопрос.",
    label: "Видео · Десктопная лента",
    aspect: "aspect-video",
  },
  {
    match:
      "я решил это исправить и добавил раздел с мероприятиями – ведь круглый год один за другим проходят разные кинофестивали",
    label: "Фото · Секция мероприятий",
    aspect: "aspect-video",
  },
  {
    match: "кнопка оценки – теряется: она небольшая и скрывает за собой слишком много действий сразу.",
    label: "Фото · Страница фильма",
    aspect: "aspect-video",
  },
]

export default async function LetterboxdCasePage() {
  const rawRu = await readFile(ARTICLE_PATH_RU, "utf8")

  const ru = parseCaseArticle(rawRu, {
    mediaInsertions: LETTERBOXD_MEDIA_INSERTIONS_RU,
  })

  return (
    <CaseArticle
      content={{
        ru: {
          title: ru.title,
          blocks: ru.blocks,
          footnotes: ru.footnotes,
          publishedAt: "28 февраля 2026",
        },
      }}
    />
  )
}
