import { withBasePath } from "@/lib/base-path"

export interface PresentationImage {
  src: string
  assetPath: string
  alt: string
  caption: string
}

interface SlideBase {
  id: string
  label: string
  title: string
}

export interface CoverSlide extends SlideBase {
  kind: "cover"
  eyebrow: string
  lead: string
  footer: string
}

export interface BulletsSlide extends SlideBase {
  kind: "bullets"
  lead?: string
  bullets: string[]
}

export interface CardsSlide extends SlideBase {
  kind: "cards"
  lead?: string
  columns: 2 | 3
  cards: Array<{
    title: string
    body: string
  }>
}

export interface QuoteSlide extends SlideBase {
  kind: "quote"
  quote: string
  source: string
  body: string
}

export interface StepsSlide extends SlideBase {
  kind: "steps"
  lead?: string
  steps: Array<{
    title: string
    body: string
  }>
}

export interface GallerySlide extends SlideBase {
  kind: "gallery"
  lead?: string
  images: PresentationImage[]
}

export interface ClosingSlide extends SlideBase {
  kind: "closing"
  lead: string
  footer: string
}

export type PresentationSlide =
  | CoverSlide
  | BulletsSlide
  | CardsSlide
  | QuoteSlide
  | StepsSlide
  | GallerySlide
  | ClosingSlide

export const yandexPresentationDownloadName = "yandex-tovary-onboarding-presentation.pdf"
export const yandexPresentationDownloadHref = withBasePath(
  "/cases/yandex-tovary/presentation/download"
)

export const yandexPresentationSlides: PresentationSlide[] = [
  {
    id: "cover",
    kind: "cover",
    label: "Старт",
    eyebrow: "Тестовое / Яндекс Товары",
    title: "Онбординг в Яндекс Товарах",
    lead: "Сделать сервис понятнее и доступнее на каждом этапе взаимодействия",
    footer: "Первый запуск в сложном B2B сервисе",
  },
  {
    id: "problem",
    kind: "bullets",
    label: "Проблема",
    title: "Зачем вообще делать онбординг",
    bullets: [
      "Сервис довольно сложный, много терминологии и требований",
      "Если не объяснить пользователю что делать на каждом экране, он начнет теряться",
      "Онбординг помогает вовлекать и удерживать пользователей",
    ],
  },
  {
    id: "audience",
    kind: "cards",
    label: "Аудитория",
    title: "Сегменты аудитории",
    columns: 3,
    cards: [
      {
        title: "Малый бизнес",
        body: "Впервые пробуют настроить продажи через Яндекс Товары",
      },
      {
        title: "Специалисты",
        body: "Приходят настроить и уйти",
      },
      {
        title: "Возвращенцы",
        body: "Сервис знаком, но появились новые фичи и UX изменился",
      },
    ],
  },
  {
    id: "discovery",
    kind: "quote",
    label: "Вывод",
    title: "Что показали интервью",
    quote: "Огромные пласты текста это всегда ужас",
    source: "Диана, маркетолог",
    body: "Встроенные обучалки раздражают и сразу скипаются",
  },
  {
    id: "evidence",
    kind: "cards",
    label: "Ресерч",
    title: "Что говорят исследования",
    columns: 3,
    cards: [
      {
        title: "Nielsen Norman Group",
        body: "Контекстные подсказки и обучение по месту работают гораздо эффективнее",
      },
      {
        title: "Growth Design",
        body: "Мини карточки прямо на интерфейсе помогают быстрее освоиться",
      },
      {
        title: "Mobbin",
        body: "Пошаговый чеклист ускоряет освоение сервиса",
      },
    ],
  },
  {
    id: "principles",
    kind: "cards",
    label: "Принципы",
    title: "Каким должно быть обучение",
    columns: 2,
    cards: [
      {
        title: "От задачи и опыта",
        body: "Для новичка полнее, для опытного короче",
      },
      {
        title: "Простой язык",
        body: "Использовать простой язык вместо профтерминов",
      },
      {
        title: "Выбор у пользователя",
        body: "Пропускать или закрывать обучение",
      },
      {
        title: "Локально",
        body: "Показывать обучалки ровно в момент столкновения",
      },
    ],
  },
  {
    id: "solution",
    kind: "steps",
    label: "Решение",
    title: "Из чего состоит решение",
    steps: [
      {
        title: "Вопрос на входе",
        body: "Что человек хочет сделать и насколько он знаком с сервисом",
      },
      {
        title: "Чеклист",
        body: "Путь, прогресс и aha момент",
      },
      {
        title: "Подсказки по месту",
        body: "Короткие карточки рядом с нужным элементом",
      },
      {
        title: "Возврат после паузы",
        body: "Короткое что нового вместо нового старта",
      },
    ],
  },
  {
    id: "mockups",
    kind: "gallery",
    label: "Макеты",
    title: "Макеты",
    images: [
      {
        src: withBasePath("/cases/yandex-tovary/first_one.webp"),
        assetPath: "/cases/yandex-tovary/first_one.webp",
        alt: "Стартовый экран онбординга",
        caption: "Один понятный следующий шаг",
      },
      {
        src: withBasePath("/cases/yandex-tovary/2second.webp"),
        assetPath: "/cases/yandex-tovary/2second.webp",
        alt: "Контекстные подсказки в интерфейсе",
        caption: "Коротко и по месту",
      },
      {
        src: withBasePath("/cases/yandex-tovary/sdsfff.webp"),
        assetPath: "/cases/yandex-tovary/sdsfff.webp",
        alt: "Чеклист шагов в интерфейсе",
        caption: "Видно прогресс и цель",
      },
    ],
  },
  {
    id: "closing",
    kind: "closing",
    label: "Финал",
    title: "Итог",
    lead: "Нужно помочь человеку сделать первые шаги",
    footer: "И тогда сервис станет понятнее и доступнее",
  },
]
