import { buildYandexPresentationPdf } from "@/lib/yandex-presentation-pdf"
import { yandexPresentationDownloadName } from "@/lib/yandex-presentation-data"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const pdf = await buildYandexPresentationPdf()

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${yandexPresentationDownloadName}"`,
      "Cache-Control": "no-store",
    },
  })
}
