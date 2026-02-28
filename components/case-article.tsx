'use client'

import {
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react'
import styles from './case-article.module.css'
import type { CaseArticleBlock } from '@/lib/case-article'

interface CaseArticleProps {
  content: {
    eng: {
      title: string
      blocks: CaseArticleBlock[]
      footnotes: string[]
      publishedAt: string
    }
    ru: {
      title: string
      blocks: CaseArticleBlock[]
      footnotes: string[]
      publishedAt: string
    }
  }
}

function findNextInlineToken(text: string, from: number) {
  const nextBold = text.indexOf('**', from)
  const nextLink = text.indexOf('[', from)

  if (nextBold === -1 && nextLink === -1) {
    return -1
  }

  if (nextBold === -1) return nextLink
  if (nextLink === -1) return nextBold

  return Math.min(nextBold, nextLink)
}

function parseInlineSegment(segment: string, keyPrefix: string) {
  const nodes: ReactNode[] = []
  let cursor = 0

  while (cursor < segment.length) {
    if (segment.startsWith('**', cursor)) {
      const boldEnd = segment.indexOf('**', cursor + 2)
      if (boldEnd > cursor + 2) {
        nodes.push(
          <strong key={`${keyPrefix}-b-${cursor}`}>
            {segment.slice(cursor + 2, boldEnd)}
          </strong>
        )
        cursor = boldEnd + 2
        continue
      }
    }

    if (segment[cursor] === '[') {
      const labelEnd = segment.indexOf(']', cursor + 1)
      if (labelEnd > cursor + 1 && segment[labelEnd + 1] === '(') {
        let linkEnd = labelEnd + 2
        let nestedDepth = 1

        while (linkEnd < segment.length && nestedDepth > 0) {
          const char = segment[linkEnd]
          if (char === '(') nestedDepth += 1
          if (char === ')') nestedDepth -= 1
          linkEnd += 1
        }

        if (nestedDepth === 0) {
          const label = segment.slice(cursor + 1, labelEnd).trim()
          const href = segment.slice(labelEnd + 2, linkEnd - 1).trim()

          if (label && href) {
            nodes.push(
              <a
                key={`${keyPrefix}-l-${cursor}`}
                href={href}
                target="_blank"
                rel="noreferrer"
                className={styles.inlineLink}
              >
                {label}
              </a>
            )
            cursor = linkEnd
            continue
          }
        }
      }
    }

    const nextToken = findNextInlineToken(segment, cursor + 1)
    if (nextToken === -1) {
      nodes.push(segment.slice(cursor))
      break
    }

    nodes.push(segment.slice(cursor, nextToken))
    cursor = nextToken
  }

  return nodes
}

function renderInline(
  text: string,
  footnoteCounter: { current: number },
  onFootnoteNavigate: (event: MouseEvent<HTMLAnchorElement>) => void
) {
  const segments = text.split(/(\\\*)/)
  const nodes: ReactNode[] = []

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]

    if (segment === '\\*') {
      footnoteCounter.current += 1

      let precedingText = ''
      if (nodes.length > 0) {
        const lastNode = nodes[nodes.length - 1]
        if (typeof lastNode === 'string') {
          const match = lastNode.match(/(\S+(?:\s+\S+)?)$/)
          if (match) {
            precedingText = match[1]
            nodes[nodes.length - 1] = lastNode.slice(0, -precedingText.length)
          }
        }
      }

      if (precedingText) {
        nodes.push(precedingText)
        nodes.push(' ')
      }

      nodes.push(
        <a
          key={`fn-${footnoteCounter.current}-${nodes.length}`}
          id={`fnref-${footnoteCounter.current}`}
          href={`#fn-${footnoteCounter.current}`}
          data-footnote-ref
          aria-label={`Сноска ${footnoteCounter.current}`}
          className={styles.footnoteRef}
          onClick={onFootnoteNavigate}
        >
          <span className={styles.footnoteNumber}>{footnoteCounter.current}</span>
        </a>
      )
      continue
    }

    nodes.push(...parseInlineSegment(segment, `seg-${i}-${nodes.length}`))
  }

  return nodes
}

export function CaseArticle({ content }: CaseArticleProps) {
  const [language, setLanguage] = useState<'eng' | 'ru'>('eng')
  const currentContent = content[language]
  const { title, blocks, footnotes, publishedAt } = currentContent
  const footnoteCounter = { current: 0 }

  const navigateToHash = (hash: string) => {
    const target = document.querySelector<HTMLElement>(hash)
    if (!target) return false

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
    window.history.pushState(null, '', hash)
    return true
  }

  const handleFootnoteNavigate = (event: MouseEvent<HTMLAnchorElement>) => {
    const href = event.currentTarget.getAttribute('href')
    if (!href?.startsWith('#')) return

    if (!navigateToHash(href)) return

    event.preventDefault()
  }

  const handleFootnoteItemClick = (
    event: MouseEvent<HTMLLIElement>,
    index: number
  ) => {
    const target = event.target
    if (target instanceof Element && target.closest('a[href]')) return

    navigateToHash(`#fnref-${index + 1}`)
  }

  const firstParaIdx = blocks.findIndex(b => b.type === 'paragraph')

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl">
        <section>
            <header className="flex flex-col">
              <h2 className="type-title text-foreground">{title}</h2>
              <div className={`type-card-caption ${styles.meta}`}>
                <span>{publishedAt}</span>
                <span aria-hidden="true" className={styles.languageSeparator}> · </span>
                <button
                  type="button"
                  className={`${styles.languageButton} ${language === 'eng' ? styles.languageButtonActive : ''}`}
                  onClick={() => setLanguage('eng')}
                  aria-pressed={language === 'eng'}
                >
                  in english
                </button>
                <span aria-hidden="true" className={styles.languageSeparator}> / </span>
                <button
                  type="button"
                  className={`${styles.languageButton} ${language === 'ru' ? styles.languageButtonActive : ''}`}
                  onClick={() => setLanguage('ru')}
                  aria-pressed={language === 'ru'}
                >
                  на русском
                </button>
              </div>
            </header>

            <article data-article-content className={`mt-[var(--space-text)] ${styles.article}`}>
              {blocks.map((block, index) => {
                if (block.type === 'heading') {
                  return (
                    <h2
                      key={`h-${index}`}
                      className={`type-title text-foreground ${styles.sectionTitle}`}
                    >
                      {block.text}
                    </h2>
                  )
                }

                if (block.type === 'subheading') {
                  return (
                    <h3
                      key={`h3-${index}`}
                      className={`type-card-title text-foreground ${styles.cardTitle}`}
                    >
                      {block.text}
                    </h3>
                  )
                }

                if (block.type === 'media') {
                  return (
                    <div key={`m-${index}`} className={`${styles.placeholder} ${block.aspect}`}>
                      <span className="type-card-caption text-muted-foreground">{block.label}</span>
                    </div>
                  )
                }

                if (index === firstParaIdx) {
                  return (
                    <p key={`p-${index}`} className={`type-article text-foreground ${styles.paragraph}`}>
                      {renderInline(block.text, footnoteCounter, handleFootnoteNavigate)}
                    </p>
                  )
                }

                return (
                  <p
                    key={`p-${index}`}
                    className={`type-article text-foreground ${styles.paragraph}`}
                  >
                    {renderInline(block.text, footnoteCounter, handleFootnoteNavigate)}
                  </p>
                )
              })}
            </article>

            {footnotes.length > 0 ? (
              <section className={styles.footnotes} data-footnotes>
                <ol className={styles.footnotesList} data-prose-type="list">
                  {footnotes.map((note, index) => (
                    <li
                      key={`fn-item-${index}`}
                      className={styles.footnoteItem}
                      id={`fn-${index + 1}`}
                      data-index={index + 1}
                      data-prose-type="text"
                      onClick={(event) => handleFootnoteItemClick(event, index)}
                    >
                      {renderInline(note, { current: 0 }, handleFootnoteNavigate)}
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}
        </section>
      </div>
    </main>
  )
}
