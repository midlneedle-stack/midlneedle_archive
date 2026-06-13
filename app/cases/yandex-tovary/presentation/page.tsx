import type { Metadata } from "next"
import { YandexPresentation } from "@/components/yandex-presentation"

export const metadata: Metadata = {
  title: "Презентация — Онбординг в «Яндекс Товарах»",
  description:
    "Закрытая презентация по кейсу онбординга в «Яндекс Товарах» для собеседования",
  robots: {
    index: false,
    follow: false,
  },
}

export default function YandexTovaryPresentationPage() {
  return <YandexPresentation />
}
