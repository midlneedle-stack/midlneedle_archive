"use client"

import { useEffect, useRef } from "react"
import { Leva, button, folder, useControls } from "leva"

const monochromeTheme = {
  colors: {
    elevation1: "#ffffff",
    elevation2: "#f2f2f2",
    elevation3: "#ededed",
    accent1: "#000000",
    accent2: "#141414",
    accent3: "#2a2a2a",
    highlight1: "#6b6f74",
    highlight2: "#2a2a2a",
    highlight3: "#111111",
    vivid1: "#000000",
  },
  radii: {
    xs: "0px",
    sm: "0px",
    lg: "0px",
  },
  fontSizes: {
    root: "12px",
  },
  fontWeights: {
    label: "500",
    folder: "600",
    button: "500",
  },
} as const

const defaults = {
  pageX: 64,
  pageY: 128,
  section: 64,
  stack: 32,
  gridX: 16,
  casesGap: 16,
  titleText: 16,
  headingTop: 0,
  headingBottom: 24,
  cardMedia: 8,
  cardText: 0,
  caseTitleX: 16,
  caseTitleY: 16,
  connectGap: 8,
  foreground: "#353b42",
  mutedForeground: "#5d6268",
  background: "#ffffff",
  border: "#353b42",
  card: "#ffffff",
  cardForeground: "#353b42",
  popover: "#ffffff",
  popoverForeground: "#353b42",
  primary: "#353b42",
  primaryForeground: "#ffffff",
  secondary: "#f5f5f5",
  secondaryForeground: "#353b42",
  muted: "#f5f5f5",
  accent: "#f5f5f5",
  accentForeground: "#353b42",
  destructive: "oklch(0.577 0.245 27.325)",
  destructiveForeground: "oklch(0.577 0.245 27.325)",
  input: "#f5f5f5",
  ring: "#e0e0e0",
  titleEnabled: true,
  titleSize: 1.2,
  titleLineHeight: 0,
  titleWeight: 500,
  titleLetterSpacing: 0,
  titleWordSpacing: -0.04,
  bodyTextEnabled: true,
  bodyTextSize: 1.1,
  bodyTextLineHeight: 1.5,
  bodyTextWeight: 440,
  bodyTextLetterSpacing: 0.01,
  bodyTextWordSpacing: -0.04,
}

const typeConfigs = [
  { key: "title", selector: ".type-title" },
  { key: "bodyText", selector: ".type-body" },
] as const

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
    `--space-case-title-x: ${values.caseTitleX}px`,
    `--space-case-title-y: ${values.caseTitleY}px`,
    `--space-connect-gap: ${values.connectGap}px`,
    `--foreground: ${values.foreground}`,
    `--muted-foreground: ${values.mutedForeground}`,
    `--background: ${values.background}`,
    `--border: ${values.border}`,
    `--card: ${values.card}`,
    `--card-foreground: ${values.cardForeground}`,
    `--popover: ${values.popover}`,
    `--popover-foreground: ${values.popoverForeground}`,
    `--primary: ${values.primary}`,
    `--primary-foreground: ${values.primaryForeground}`,
    `--secondary: ${values.secondary}`,
    `--secondary-foreground: ${values.secondaryForeground}`,
    `--muted: ${values.muted}`,
    `--accent: ${values.accent}`,
    `--accent-foreground: ${values.accentForeground}`,
    `--destructive: ${values.destructive}`,
    `--destructive-foreground: ${values.destructiveForeground}`,
    `--input: ${values.input}`,
    `--ring: ${values.ring}`,
  ].join("\n")
}

function buildTypeSpecs(values: typeof defaults) {
  const payload = {
    titles: {
      enabled: values.titleEnabled,
      sizeEm: values.titleSize,
      lineHeightEm: values.titleLineHeight,
      weight: values.titleWeight,
      letterSpacingEm: values.titleLetterSpacing,
      wordSpacingEm: values.titleWordSpacing,
    },
    body: {
      enabled: values.bodyTextEnabled,
      sizeEm: values.bodyTextSize,
      lineHeightEm: values.bodyTextLineHeight,
      weight: values.bodyTextWeight,
      letterSpacingEm: values.bodyTextLetterSpacing,
      wordSpacingEm: values.bodyTextWordSpacing,
    },
  }
  return JSON.stringify(payload, null, 2)
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

  const [values, setValues] = useControls(
    () => ({
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
        caseTitleX: { value: defaults.caseTitleX, min: 0, max: 120, step: 1, label: "Case title pad X" },
        caseTitleY: { value: defaults.caseTitleY, min: 0, max: 120, step: 1, label: "Case title pad Y" },
        connectGap: { value: defaults.connectGap, min: 0, max: 80, step: 1, label: "Connect gap" },
        copySpecs: button(() => copyToClipboard(buildSpecs(valuesRef.current))),
      }),
      Colors: folder({
        Typography: folder({
          foreground: { value: defaults.foreground, label: "Foreground" },
          mutedForeground: { value: defaults.mutedForeground, label: "Muted foreground" },
        }),
        Surfaces: folder({
          background: { value: defaults.background, label: "Background" },
          card: { value: defaults.card, label: "Card" },
          popover: { value: defaults.popover, label: "Popover" },
          secondary: { value: defaults.secondary, label: "Secondary" },
          muted: { value: defaults.muted, label: "Muted" },
          accent: { value: defaults.accent, label: "Accent" },
        }),
        Accents: folder({
          primary: { value: defaults.primary, label: "Primary" },
          primaryForeground: { value: defaults.primaryForeground, label: "Primary foreground" },
          secondaryForeground: { value: defaults.secondaryForeground, label: "Secondary foreground" },
          accentForeground: { value: defaults.accentForeground, label: "Accent foreground" },
          cardForeground: { value: defaults.cardForeground, label: "Card foreground" },
          popoverForeground: { value: defaults.popoverForeground, label: "Popover foreground" },
        }),
        Lines: folder({
          border: { value: defaults.border, label: "Border" },
          input: { value: defaults.input, label: "Input" },
          ring: { value: defaults.ring, label: "Ring" },
        }),
        Status: folder({
          destructive: { value: defaults.destructive, label: "Destructive" },
          destructiveForeground: { value: defaults.destructiveForeground, label: "Destructive foreground" },
        }),
      }),
      Typography: folder({
        Titles: folder({
          titleEnabled: { value: defaults.titleEnabled, label: "Enable overrides" },
          titleSize: { value: defaults.titleSize, min: 0.8, max: 5, step: 0.01, label: "Size (em)" },
          titleLineHeight: { value: defaults.titleLineHeight, min: 0, max: 3.5, step: 0.01, label: "Line height (em, 0 = auto)" },
          titleWeight: { value: defaults.titleWeight, min: 300, max: 800, step: 10, label: "Weight" },
          titleLetterSpacing: { value: defaults.titleLetterSpacing, min: -0.2, max: 0.2, step: 0.001, label: "Letter spacing (em)" },
          titleWordSpacing: { value: defaults.titleWordSpacing, min: -0.3, max: 0.3, step: 0.001, label: "Word spacing (em)" },
        }),
        "Body text": folder({
          bodyTextEnabled: { value: defaults.bodyTextEnabled, label: "Enable overrides" },
          bodyTextSize: { value: defaults.bodyTextSize, min: 0.6, max: 2.4, step: 0.01, label: "Size (em)" },
          bodyTextLineHeight: { value: defaults.bodyTextLineHeight, min: 0, max: 3, step: 0.01, label: "Line height (em, 0 = auto)" },
          bodyTextWeight: { value: defaults.bodyTextWeight, min: 300, max: 800, step: 10, label: "Weight" },
          bodyTextLetterSpacing: { value: defaults.bodyTextLetterSpacing, min: -0.2, max: 0.2, step: 0.001, label: "Letter spacing (em)" },
          bodyTextWordSpacing: { value: defaults.bodyTextWordSpacing, min: -0.3, max: 0.3, step: 0.001, label: "Word spacing (em)" },
        }),
        copyTypography: button(() => copyToClipboard(buildTypeSpecs(valuesRef.current))),
      }),
    }),
    { collapsed: false }
  )

  useEffect(() => {
    valuesRef.current = { ...defaults, ...values }
  }, [values])

  const baseSyncedRef = useRef(false)

  useEffect(() => {
    const parseLineHeight = (value: string) => {
      if (value === "normal") return 0
      const parsed = Number.parseFloat(value)
      return Number.isNaN(parsed) ? 0 : parsed
    }
    const parseWeight = (value: string) => {
      const parsed = Number.parseFloat(value)
      return Number.isNaN(parsed) ? 400 : parsed
    }
    const parseSpacingEm = (value: string, fontSize: number) => {
      if (value === "normal") return 0
      const parsed = Number.parseFloat(value)
      if (Number.isNaN(parsed)) return 0
      if (value.endsWith("em")) return parsed
      if (Number.isNaN(fontSize) || fontSize === 0) return 0
      return parsed / fontSize
    }
    const syncBase = async () => {
      if (baseSyncedRef.current) return
      if (document.fonts?.ready) {
        try {
          await document.fonts.ready
        } catch {
          // Ignore font loading errors; fall back to current metrics.
        }
      }
      const updates: Record<string, number> = {}
      typeConfigs.forEach(({ key, selector }) => {
        const el = document.querySelector<HTMLElement>(selector)
        if (!el) return
        const computed = window.getComputedStyle(el)
        const parent = el.parentElement
          ? window.getComputedStyle(el.parentElement)
          : window.getComputedStyle(document.body)
        const parentSize = Number.parseFloat(parent.fontSize) || 16
        const size = Number.parseFloat(computed.fontSize)
        const lineHeight = parseLineHeight(computed.lineHeight)
        const weight = parseWeight(computed.fontWeight)
        const letterSpacing = parseSpacingEm(computed.letterSpacing, size)
        const wordSpacing = parseSpacingEm(computed.wordSpacing, size)
        if (!Number.isNaN(size) && size > 0 && parentSize !== 0) {
          updates[`${key}Size`] = size / parentSize
        }
        updates[`${key}LineHeight`] =
          lineHeight === 0 || Number.isNaN(lineHeight) || Number.isNaN(size) || size === 0
            ? 0
            : lineHeight / size
        if (!Number.isNaN(weight)) {
          updates[`${key}Weight`] = weight
        }
        updates[`${key}LetterSpacing`] = Number.isNaN(letterSpacing) ? 0 : letterSpacing
        updates[`${key}WordSpacing`] = Number.isNaN(wordSpacing) ? 0 : wordSpacing
      })
      if (Object.keys(updates).length > 0) {
        setValues(updates)
      }
      baseSyncedRef.current = true
    }
    void syncBase()
  }, [setValues])

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
    root.style.setProperty("--space-case-title-x", `${values.caseTitleX}px`)
    root.style.setProperty("--space-case-title-y", `${values.caseTitleY}px`)
    root.style.setProperty("--space-connect-gap", `${values.connectGap}px`)
    root.style.setProperty("--foreground", values.foreground)
    root.style.setProperty("--muted-foreground", values.mutedForeground)
    root.style.setProperty("--background", values.background)
    root.style.setProperty("--border", values.border)
    root.style.setProperty("--card", values.card)
    root.style.setProperty("--card-foreground", values.cardForeground)
    root.style.setProperty("--popover", values.popover)
    root.style.setProperty("--popover-foreground", values.popoverForeground)
    root.style.setProperty("--primary", values.primary)
    root.style.setProperty("--primary-foreground", values.primaryForeground)
    root.style.setProperty("--secondary", values.secondary)
    root.style.setProperty("--secondary-foreground", values.secondaryForeground)
    root.style.setProperty("--muted", values.muted)
    root.style.setProperty("--accent", values.accent)
    root.style.setProperty("--accent-foreground", values.accentForeground)
    root.style.setProperty("--destructive", values.destructive)
    root.style.setProperty("--destructive-foreground", values.destructiveForeground)
    root.style.setProperty("--input", values.input)
    root.style.setProperty("--ring", values.ring)
    const setInlineSize = (el: HTMLElement, size: number, lineHeight: number) => {
      if (Number.isNaN(size) || size === 0) {
        el.style.removeProperty("font-size")
      } else {
        el.style.fontSize = `${size}em`
      }
      if (Number.isNaN(lineHeight) || lineHeight === 0) {
        el.style.removeProperty("line-height")
      } else {
        el.style.lineHeight = `${lineHeight}em`
      }
    }
    const clearInlineSize = (el: HTMLElement) => {
      el.style.removeProperty("font-size")
      el.style.removeProperty("line-height")
    }
    const setInlineWeight = (el: HTMLElement, weight: number) => {
      if (Number.isNaN(weight) || weight === 0) {
        el.style.removeProperty("font-weight")
        el.style.removeProperty("font-variation-settings")
        return
      }
      el.style.fontWeight = `${weight}`
      el.style.fontVariationSettings = `'wght' ${weight}, var(--sans-variation)`
    }
    const clearInlineWeight = (el: HTMLElement) => {
      el.style.removeProperty("font-weight")
      el.style.removeProperty("font-variation-settings")
    }
    const setInlineSpacing = (el: HTMLElement, letterSpacing: number, wordSpacing: number) => {
      if (Number.isNaN(letterSpacing)) {
        el.style.removeProperty("letter-spacing")
      } else {
        el.style.letterSpacing = `${letterSpacing}em`
      }
      if (Number.isNaN(wordSpacing)) {
        el.style.removeProperty("word-spacing")
      } else {
        el.style.wordSpacing = `${wordSpacing}em`
      }
    }
    const clearInlineSpacing = (el: HTMLElement) => {
      el.style.removeProperty("letter-spacing")
      el.style.removeProperty("word-spacing")
    }
    const getValue = (name: string) => (values as Record<string, number | boolean>)[name]
    typeConfigs.forEach(({ key, selector }) => {
      const enabled = Boolean(getValue(`${key}Enabled`))
      const size = Number(getValue(`${key}Size`))
      const lineHeight = Number(getValue(`${key}LineHeight`))
      const weight = Number(getValue(`${key}Weight`))
      const letterSpacing = Number(getValue(`${key}LetterSpacing`))
      const wordSpacing = Number(getValue(`${key}WordSpacing`))
      document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        if (!enabled) {
          clearInlineSize(el)
          clearInlineWeight(el)
          clearInlineSpacing(el)
          return
        }
        setInlineSize(el, size, lineHeight)
        setInlineWeight(el, weight)
        setInlineSpacing(el, letterSpacing, wordSpacing)
      })
    })
  }, [values])

  return (
    <div
      className="fixed right-2 top-2 z-[1000] opacity-0 transition-opacity duration-200 ease-out hover:opacity-100 [&_.leva-c__panel]:shadow-none [&_.leva-c__panel]:border [&_.leva-c__panel]:border-black/20"
    >
      <Leva collapsed={false} theme={monochromeTheme} />
    </div>
  )
}
