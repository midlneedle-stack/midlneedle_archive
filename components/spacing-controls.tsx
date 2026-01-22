"use client"

import { useEffect, useRef } from "react"
import { Leva, button, folder, useControls } from "leva"

const defaults = {
  pageX: 64,
  pageY: 64,
  section: 64,
  stack: 32,
  gridX: 12,
  casesGap: 16,
  titleText: 16,
  headingTop: 0,
  headingBottom: 24,
  cardMedia: 8,
  cardText: 0,
  connectGap: 8,
}

function buildSpecs(values: typeof defaults) {
  return [
    `--space-page-x: ${values.pageX}px`,
    `--space-page-y: ${values.pageY}px`,
    `--space-section: ${values.section}px`,
    `--space-stack: ${values.stack}px`,
    `--space-grid-x: ${values.gridX}px`,
    `--space-cases-gap: ${values.casesGap}px`,
    `--space-title-text: ${values.titleText}px`,
    `--space-heading-top: ${values.headingTop}px`,
    `--space-heading-bottom: ${values.headingBottom}px`,
    `--space-card-media: ${values.cardMedia}px`,
    `--space-card-text: ${values.cardText}px`,
    `--space-connect-gap: ${values.connectGap}px`,
  ].join("\n")
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const textarea = document.createElement("textarea")
    textarea.value = text
    textarea.style.position = "fixed"
    textarea.style.opacity = "0"
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand("copy")
    document.body.removeChild(textarea)
  }
}

export function SpacingControls() {
  const valuesRef = useRef(defaults)

  const values = useControls(
    {
      Spacing: folder({
        pageX: { value: defaults.pageX, min: 0, max: 200, step: 1, label: "Page padding X" },
        pageY: { value: defaults.pageY, min: 0, max: 200, step: 1, label: "Page padding Y" },
        section: { value: defaults.section, min: 0, max: 240, step: 1, label: "Section spacing" },
        stack: { value: defaults.stack, min: 0, max: 200, step: 1, label: "Stack spacing" },
        gridX: { value: defaults.gridX, min: 0, max: 120, step: 1, label: "Grid gap X" },
        casesGap: { value: defaults.casesGap, min: 0, max: 200, step: 1, label: "Cases gap" },
        titleText: { value: defaults.titleText, min: 0, max: 120, step: 1, label: "Title to text" },
        headingTop: { value: defaults.headingTop, min: 0, max: 200, step: 1, label: "Heading top" },
        headingBottom: { value: defaults.headingBottom, min: 0, max: 200, step: 1, label: "Heading bottom" },
        cardMedia: { value: defaults.cardMedia, min: 0, max: 120, step: 1, label: "Card media" },
        cardText: { value: defaults.cardText, min: 0, max: 120, step: 1, label: "Card text" },
        connectGap: { value: defaults.connectGap, min: 0, max: 80, step: 1, label: "Connect gap" },
        copySpecs: button(() => copyToClipboard(buildSpecs(valuesRef.current))),
      }),
    },
    { collapsed: false }
  )

  useEffect(() => {
    valuesRef.current = { ...defaults, ...values }
  }, [values])

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty("--space-page-x", `${values.pageX}px`)
    root.style.setProperty("--space-page-y", `${values.pageY}px`)
    root.style.setProperty("--space-section", `${values.section}px`)
    root.style.setProperty("--space-stack", `${values.stack}px`)
    root.style.setProperty("--space-grid-x", `${values.gridX}px`)
    root.style.setProperty("--space-cases-gap", `${values.casesGap}px`)
    root.style.setProperty("--space-title-text", `${values.titleText}px`)
    root.style.setProperty("--space-heading-top", `${values.headingTop}px`)
    root.style.setProperty("--space-heading-bottom", `${values.headingBottom}px`)
    root.style.setProperty("--space-card-media", `${values.cardMedia}px`)
    root.style.setProperty("--space-card-text", `${values.cardText}px`)
    root.style.setProperty("--space-connect-gap", `${values.connectGap}px`)
  }, [values])

  return <Leva collapsed={false} />
}
