import "server-only"

import { readFile } from "node:fs/promises"
import path from "node:path"
import { deflateSync } from "node:zlib"
import sharp from "sharp"
import {
  type GallerySlide,
  type PresentationSlide,
  yandexPresentationSlides,
} from "@/lib/yandex-presentation-data"

const PAGE_WIDTH = 1600
const PAGE_HEIGHT = 900
const FRAME_X = 24
const FRAME_Y = 24
const FRAME_WIDTH = PAGE_WIDTH - FRAME_X * 2
const FRAME_HEIGHT = PAGE_HEIGHT - FRAME_Y * 2
const CONTENT_X = 72
const TITLE_Y = 140
const TEXT_COLOR = "#26292c"
const MUTED_COLOR = "#67696b"
const STROKE_COLOR = "#eceef0"
const PANEL_COLOR = "#f8f9fa"
const FONT_FAMILY = "Arial, Helvetica, sans-serif"
const META_FONT_SIZE = 22
const META_LINE_HEIGHT = 28
const BODY_FONT_SIZE = 30
const BODY_LINE_HEIGHT = 38
const TITLE_FONT_SIZE = 64
const TITLE_LINE_HEIGHT = 70

interface PdfPage {
  width: number
  height: number
  data: Buffer
}

export async function buildYandexPresentationPdf() {
  const assets = await loadImageAssets(yandexPresentationSlides)
  const pages = await Promise.all(
    yandexPresentationSlides.map((slide, index) =>
      renderSlidePage(slide, index, yandexPresentationSlides.length, assets)
    )
  )

  return createPdfFromPages(pages)
}

async function renderSlidePage(
  slide: PresentationSlide,
  index: number,
  total: number,
  assets: Map<string, string>
) {
  const svg = renderSlideSvg(slide, index, total, assets)
  const { data, info } = await sharp(Buffer.from(svg))
    .flatten({ background: "#ffffff" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  return {
    width: info.width,
    height: info.height,
    data,
  }
}

async function loadImageAssets(slides: PresentationSlide[]) {
  const assetPaths = new Set<string>()

  slides.forEach((slide) => {
    if (slide.kind !== "gallery") return
    slide.images.forEach((image) => assetPaths.add(image.assetPath))
  })

  const assets = new Map<string, string>()

  await Promise.all(
    Array.from(assetPaths).map(async (assetPath) => {
      const absolutePath = path.join(
        process.cwd(),
        "public",
        assetPath.replace(/^\/+/, "")
      )
      const buffer = await readFile(absolutePath)
      assets.set(
        assetPath,
        `data:${mimeForPath(assetPath)};base64,${buffer.toString("base64")}`
      )
    })
  )

  return assets
}

function mimeForPath(assetPath: string) {
  if (assetPath.endsWith(".webp")) return "image/webp"
  if (assetPath.endsWith(".png")) return "image/png"
  if (assetPath.endsWith(".jpg") || assetPath.endsWith(".jpeg")) {
    return "image/jpeg"
  }
  return "application/octet-stream"
}

function renderSlideSvg(
  slide: PresentationSlide,
  index: number,
  total: number,
  assets: Map<string, string>
) {
  const inner = (() => {
    switch (slide.kind) {
      case "cover":
        return renderCoverSlide(slide)
      case "bullets":
        return renderBulletsSlide(slide)
      case "cards":
        return renderCardsSlide(slide)
      case "quote":
        return renderQuoteSlide(slide)
      case "steps":
        return renderStepsSlide(slide)
      case "gallery":
        return renderGallerySlide(slide, assets)
      case "closing":
        return renderClosingSlide(slide)
      default:
        return ""
    }
  })()

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg width="${PAGE_WIDTH}" height="${PAGE_HEIGHT}" viewBox="0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}" xmlns="http://www.w3.org/2000/svg">`,
    `<rect width="${PAGE_WIDTH}" height="${PAGE_HEIGHT}" fill="#ffffff" />`,
    `<rect x="${FRAME_X}" y="${FRAME_Y}" width="${FRAME_WIDTH}" height="${FRAME_HEIGHT}" rx="28" fill="#ffffff" stroke="${STROKE_COLOR}" />`,
    renderMeta(slide.label, index, total),
    inner,
    "</svg>",
  ].join("")
}

function renderMeta(label: string, index: number, total: number) {
  const slideNumber = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`

  return [
    `<text x="${CONTENT_X}" y="76" fill="${MUTED_COLOR}" font-family="${FONT_FAMILY}" font-size="21" letter-spacing="1.6">${escapeXml(
      label.toUpperCase()
    )}</text>`,
    `<text x="${PAGE_WIDTH - CONTENT_X}" y="76" fill="${MUTED_COLOR}" font-family="${FONT_FAMILY}" font-size="21" text-anchor="end">${slideNumber}</text>`,
  ].join("")
}

function renderCoverSlide(slide: Extract<PresentationSlide, { kind: "cover" }>) {
  return [
    textBlock({
      x: CONTENT_X,
      y: 164,
      fontSize: META_FONT_SIZE,
      lineHeight: META_LINE_HEIGHT,
      fill: MUTED_COLOR,
      lines: [slide.eyebrow],
      letterSpacing: 1.2,
    }),
    textBlock({
      x: CONTENT_X,
      y: 290,
      fontSize: TITLE_FONT_SIZE,
      lineHeight: TITLE_LINE_HEIGHT,
      fill: TEXT_COLOR,
      weight: 700,
      lines: wrapText(slide.title, 24),
    }),
    textBlock({
      x: CONTENT_X,
      y: 480,
      fontSize: BODY_FONT_SIZE,
      lineHeight: BODY_LINE_HEIGHT,
      fill: MUTED_COLOR,
      lines: wrapText(slide.lead, 42),
    }),
    `<line x1="${CONTENT_X}" x2="${PAGE_WIDTH - CONTENT_X}" y1="748" y2="748" stroke="${STROKE_COLOR}" />`,
    textBlock({
      x: CONTENT_X,
      y: 788,
      fontSize: META_FONT_SIZE,
      lineHeight: META_LINE_HEIGHT,
      fill: MUTED_COLOR,
      lines: wrapText(slide.footer, 48),
    }),
  ].join("")
}

function renderBulletsSlide(
  slide: Extract<PresentationSlide, { kind: "bullets" }>
) {
  const parts = [
    titleBlock(slide.title),
  ]

  let currentY = 224

  if (slide.lead) {
    parts.push(
      textBlock({
        x: CONTENT_X,
        y: currentY,
        fontSize: BODY_FONT_SIZE,
        lineHeight: BODY_LINE_HEIGHT,
        fill: MUTED_COLOR,
        lines: wrapText(slide.lead, 54),
      })
    )
    currentY += 106
  }

  slide.bullets.forEach((bullet) => {
    const lines = wrapText(bullet, 46)

    parts.push(
      `<circle cx="${CONTENT_X + 12}" cy="${currentY - 12}" r="6" fill="${TEXT_COLOR}" />`
    )
    parts.push(
      textBlock({
        x: CONTENT_X + 38,
        y: currentY,
        fontSize: BODY_FONT_SIZE,
        lineHeight: BODY_LINE_HEIGHT,
        fill: TEXT_COLOR,
        lines,
      })
    )

    currentY += lines.length * BODY_LINE_HEIGHT + 34
  })

  return parts.join("")
}

function renderCardsSlide(slide: Extract<PresentationSlide, { kind: "cards" }>) {
  const parts = [titleBlock(slide.title)]
  let currentY = 220

  if (slide.lead) {
    parts.push(
      textBlock({
        x: CONTENT_X,
        y: currentY,
        fontSize: BODY_FONT_SIZE,
        lineHeight: BODY_LINE_HEIGHT,
        fill: MUTED_COLOR,
        lines: wrapText(slide.lead, 56),
      })
    )
    currentY += 96
  }

  const gap = 22
  const columns = slide.columns
  const rows = Math.ceil(slide.cards.length / columns)
  const cardWidth = (FRAME_WIDTH - 96 - gap * (columns - 1)) / columns
  const cardHeight = rows === 1 ? 340 : 208

  slide.cards.forEach((card, index) => {
    const column = index % columns
    const row = Math.floor(index / columns)
    const x = CONTENT_X + column * (cardWidth + gap)
    const y = currentY + row * (cardHeight + gap)
    const bodyChars = columns === 3 ? 28 : 38

    parts.push(
      renderCard({
        x,
        y,
        width: cardWidth,
        height: cardHeight,
        title: card.title,
        body: card.body,
        bodyChars,
      })
    )
  })

  return parts.join("")
}

function renderQuoteSlide(slide: Extract<PresentationSlide, { kind: "quote" }>) {
  return [
    titleBlock(slide.title),
    textBlock({
      x: CONTENT_X,
      y: 314,
      fontSize: TITLE_FONT_SIZE,
      lineHeight: TITLE_LINE_HEIGHT,
      fill: TEXT_COLOR,
      weight: 700,
      lines: wrapText(`«${slide.quote}»`, 34),
    }),
    textBlock({
      x: CONTENT_X,
      y: 676,
      fontSize: META_FONT_SIZE,
      lineHeight: META_LINE_HEIGHT,
      fill: MUTED_COLOR,
      lines: wrapText(slide.source, 58),
      letterSpacing: 0.6,
    }),
    textBlock({
      x: CONTENT_X,
      y: 732,
      fontSize: BODY_FONT_SIZE,
      lineHeight: BODY_LINE_HEIGHT,
      fill: MUTED_COLOR,
      lines: wrapText(slide.body, 54),
    }),
  ].join("")
}

function renderStepsSlide(slide: Extract<PresentationSlide, { kind: "steps" }>) {
  const parts = [titleBlock(slide.title)]
  let currentY = 220

  if (slide.lead) {
    parts.push(
      textBlock({
        x: CONTENT_X,
        y: currentY,
        fontSize: BODY_FONT_SIZE,
        lineHeight: BODY_LINE_HEIGHT,
        fill: MUTED_COLOR,
        lines: wrapText(slide.lead, 56),
      })
    )
    currentY += 92
  }

  const columns = 2
  const gap = 22
  const cardWidth = (FRAME_WIDTH - 96 - gap) / 2
  const cardHeight = 214

  slide.steps.forEach((step, index) => {
    const column = index % columns
    const row = Math.floor(index / columns)
    const x = CONTENT_X + column * (cardWidth + gap)
    const y = currentY + row * (cardHeight + gap)

    parts.push(
      renderCard({
        x,
        y,
        width: cardWidth,
        height: cardHeight,
        title: step.title,
        body: step.body,
        bodyChars: 42,
      })
    )
  })

  return parts.join("")
}

function renderGallerySlide(
  slide: GallerySlide,
  assets: Map<string, string>
) {
  const parts = [titleBlock(slide.title)]
  let currentY = 220

  if (slide.lead) {
    parts.push(
      textBlock({
        x: CONTENT_X,
        y: currentY,
        fontSize: BODY_FONT_SIZE,
        lineHeight: BODY_LINE_HEIGHT,
        fill: MUTED_COLOR,
        lines: wrapText(slide.lead, 56),
      })
    )
    currentY += 98
  }

  const gap = 22
  const imageWidth = (FRAME_WIDTH - 96 - gap * 2) / 3
  const imageHeight = 320

  slide.images.forEach((image, index) => {
    const x = CONTENT_X + index * (imageWidth + gap)
    const clipId = `clip-${slide.id}-${index}`
    const href = assets.get(image.assetPath)

    parts.push(
      `<defs><clipPath id="${clipId}"><rect x="${x}" y="${currentY}" width="${imageWidth}" height="${imageHeight}" rx="18" /></clipPath></defs>`
    )
    parts.push(
      `<rect x="${x}" y="${currentY}" width="${imageWidth}" height="${imageHeight}" rx="18" fill="${PANEL_COLOR}" stroke="${STROKE_COLOR}" />`
    )

    if (href) {
      parts.push(
        `<image href="${href}" x="${x}" y="${currentY}" width="${imageWidth}" height="${imageHeight}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${clipId})" />`
      )
    }

    parts.push(
      textBlock({
        x,
        y: currentY + imageHeight + 48,
        fontSize: META_FONT_SIZE,
        lineHeight: META_LINE_HEIGHT,
        fill: MUTED_COLOR,
        lines: wrapText(image.caption, 25),
      })
    )
  })

  return parts.join("")
}

function renderClosingSlide(
  slide: Extract<PresentationSlide, { kind: "closing" }>
) {
  return [
    titleBlock(slide.title),
    textBlock({
      x: CONTENT_X,
      y: 336,
      fontSize: TITLE_FONT_SIZE,
      lineHeight: TITLE_LINE_HEIGHT,
      fill: TEXT_COLOR,
      weight: 700,
      lines: wrapText(slide.lead, 34),
    }),
    `<line x1="${CONTENT_X}" x2="${PAGE_WIDTH - CONTENT_X}" y1="716" y2="716" stroke="${STROKE_COLOR}" />`,
    textBlock({
      x: CONTENT_X,
      y: 770,
      fontSize: BODY_FONT_SIZE,
      lineHeight: BODY_LINE_HEIGHT,
      fill: MUTED_COLOR,
      lines: wrapText(slide.footer, 60),
    }),
  ].join("")
}

function titleBlock(title: string) {
  return textBlock({
    x: CONTENT_X,
    y: TITLE_Y,
    fontSize: TITLE_FONT_SIZE,
    lineHeight: TITLE_LINE_HEIGHT,
    fill: TEXT_COLOR,
    weight: 700,
    lines: wrapText(title, 32),
  })
}

function renderCard({
  x,
  y,
  width,
  height,
  title,
  body,
  bodyChars,
}: {
  x: number
  y: number
  width: number
  height: number
  title: string
  body: string
  bodyChars: number
}) {
  const titleLines = wrapText(title, 22)
  const bodyLines = wrapText(body, bodyChars)
  const titleY = y + 40
  const bodyY = titleY + titleLines.length * 36 + 22

  return [
    `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="20" fill="${PANEL_COLOR}" stroke="${STROKE_COLOR}" />`,
    textBlock({
      x: x + 24,
      y: titleY,
      fontSize: BODY_FONT_SIZE,
      lineHeight: BODY_LINE_HEIGHT,
      fill: TEXT_COLOR,
      weight: 700,
      lines: titleLines,
    }),
    textBlock({
      x: x + 24,
      y: bodyY,
      fontSize: BODY_FONT_SIZE,
      lineHeight: BODY_LINE_HEIGHT,
      fill: MUTED_COLOR,
      lines: bodyLines,
    }),
  ].join("")
}

function textBlock({
  x,
  y,
  lines,
  fontSize,
  lineHeight,
  fill,
  weight = 400,
  letterSpacing = 0,
}: {
  x: number
  y: number
  lines: string[]
  fontSize: number
  lineHeight: number
  fill: string
  weight?: number
  letterSpacing?: number
}) {
  const tspans = lines
    .map((line, index) => {
      const dy = index === 0 ? 0 : lineHeight
      return `<tspan x="${x}" dy="${dy}">${escapeXml(line)}</tspan>`
    })
    .join("")

  return `<text x="${x}" y="${y}" fill="${fill}" font-family="${FONT_FAMILY}" font-size="${fontSize}" font-weight="${weight}" letter-spacing="${letterSpacing}">${tspans}</text>`
}

function wrapText(text: string, maxChars: number) {
  const words = text.trim().split(/\s+/)
  const lines: string[] = []
  let current = ""

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word
    if (next.length <= maxChars) {
      current = next
      return
    }

    if (current) {
      lines.push(current)
      current = word
      return
    }

    lines.push(word)
  })

  if (current) {
    lines.push(current)
  }

  return lines
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

function createPdfFromPages(pages: PdfPage[]) {
  const totalObjects = 2 + pages.length * 3
  const objects = new Array<Buffer | undefined>(totalObjects + 1)
  const pageRefs: string[] = []

  pages.forEach((page, index) => {
    const pageObjectNumber = 3 + index * 3
    const imageObjectNumber = pageObjectNumber + 1
    const contentObjectNumber = pageObjectNumber + 2
    const compressedImage = deflateSync(page.data)
    const contentStream = Buffer.from(
      `q\n${page.width} 0 0 ${page.height} 0 0 cm\n/Im0 Do\nQ\n`,
      "binary"
    )

    pageRefs.push(`${pageObjectNumber} 0 R`)
    objects[pageObjectNumber] = Buffer.from(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${page.width} ${page.height}] /Resources << /XObject << /Im0 ${imageObjectNumber} 0 R >> >> /Contents ${contentObjectNumber} 0 R >>`,
      "binary"
    )
    objects[imageObjectNumber] = streamObject(
      `<< /Type /XObject /Subtype /Image /Width ${page.width} /Height ${page.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode /Length ${compressedImage.length} >>`,
      compressedImage
    )
    objects[contentObjectNumber] = streamObject(
      `<< /Length ${contentStream.length} >>`,
      contentStream
    )
  })

  objects[1] = Buffer.from("<< /Type /Catalog /Pages 2 0 R >>", "binary")
  objects[2] = Buffer.from(
    `<< /Type /Pages /Kids [${pageRefs.join(" ")}] /Count ${pages.length} >>`,
    "binary"
  )

  const parts: Buffer[] = []
  const offsets: number[] = [0]
  let cursor = 0

  const push = (value: string | Buffer, encoding: BufferEncoding = "binary") => {
    const buffer = Buffer.isBuffer(value) ? value : Buffer.from(value, encoding)
    parts.push(buffer)
    cursor += buffer.length
  }

  push("%PDF-1.4\n%\xFF\xFF\xFF\xFF\n")

  for (let index = 1; index <= totalObjects; index += 1) {
    const object = objects[index]
    if (!object) continue

    offsets[index] = cursor
    push(`${index} 0 obj\n`)
    push(object)
    push("\nendobj\n")
  }

  const xrefOffset = cursor
  push(`xref\n0 ${totalObjects + 1}\n`)
  push("0000000000 65535 f \n")

  for (let index = 1; index <= totalObjects; index += 1) {
    push(`${String(offsets[index] ?? 0).padStart(10, "0")} 00000 n \n`)
  }

  push(`trailer\n<< /Size ${totalObjects + 1} /Root 1 0 R >>\n`)
  push(`startxref\n${xrefOffset}\n%%EOF`)

  return Buffer.concat(parts)
}

function streamObject(dictionary: string, body: Buffer) {
  return Buffer.concat([
    Buffer.from(`${dictionary}\nstream\n`, "binary"),
    body,
    Buffer.from("\nendstream", "binary"),
  ])
}
