'use client'

import { useEffect, useRef, useState, type ReactNode, type RefObject, type DependencyList } from 'react'
import { useWebHaptics } from 'web-haptics/react'
import styles from './case-article.module.css'
import { HAPTIC_TRANSITION, HAPTIC_TRANSITION_OPTIONS } from '@/lib/haptics'

interface CaseArticleLanguageContent {
  title: string
  body: ReactNode
  publishedAt: string
}

interface CaseArticleProps {
  content: {
    eng?: CaseArticleLanguageContent
    ru: CaseArticleLanguageContent
  }
}

export function CaseArticle({ content }: CaseArticleProps) {
  const hasEnglish = Boolean(content.eng)
  const [language, setLanguage] = useState<'eng' | 'ru'>('ru')
  const currentContent = language === 'eng' && content.eng ? content.eng : content.ru
  const { title, body, publishedAt } = currentContent
  const articleRef = useRef<HTMLElement | null>(null)
  const { trigger } = useWebHaptics()

  const triggerFootnoteHaptic = () => {
    trigger(HAPTIC_TRANSITION, HAPTIC_TRANSITION_OPTIONS)
  }

  useFootnoteScroll(articleRef, [language], triggerFootnoteHaptic)

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl">
        <section>
          <header className="flex flex-col">
            <h2 className="type-title text-foreground">{title}</h2>
            <div className={`type-card-caption ${styles.meta}`}>
              <span>{publishedAt}</span>
              {hasEnglish ? (
                <>
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
                </>
              ) : null}
            </div>
          </header>

          <article
            ref={articleRef}
            data-article-content
            className={`mt-[var(--space-text)] ${styles.article}`}
          >
            {body}
          </article>
        </section>
      </div>
    </main>
  )
}

function useFootnoteScroll(
  articleRef: RefObject<HTMLElement | null>,
  deps: DependencyList,
  onHaptic?: () => void
) {
  useEffect(() => {
    const article = articleRef.current
    if (!article) return

    const footnotesSections = Array.from(
      article.querySelectorAll<HTMLElement>('section[data-footnotes]')
    )

    if (footnotesSections.length === 0) return

    const handleFootnoteLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      if (!target) return

      const link = target.closest('a[data-footnote-ref], a[data-footnote-backref]')
      if (!link) return

      onHaptic?.()

      if (!link.hasAttribute('data-footnote-ref')) {
        return
      }

      const href = link.getAttribute('href')
      if (!href || !href.startsWith('#')) return

      const destination = document.querySelector<HTMLElement>(href)
      if (!destination) return

      destination.scrollIntoView({ behavior: 'smooth', block: 'center' })
      window.history.replaceState(null, '', href)
      event.preventDefault()
    }

    const handleFootnoteClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      if (!target) return

      const link = target.closest('a[href]')
      if (link && !link.hasAttribute('data-footnote-backref')) {
        return
      }

      const item = target.closest('li')
      if (!item) return

      const backref = item.querySelector<HTMLAnchorElement>(
        'a[data-footnote-backref]'
      )
      if (!backref) return

      const href = backref.getAttribute('href')
      if (!href || !href.startsWith('#')) return

      const destination = document.querySelector<HTMLElement>(href)
      if (!destination) return

      onHaptic?.()
      destination.scrollIntoView({ behavior: 'smooth', block: 'center' })
      window.history.replaceState(null, '', href)
      event.preventDefault()
    }

    article.addEventListener('click', handleFootnoteLinkClick)

    footnotesSections.forEach((section) =>
      section.addEventListener('click', handleFootnoteClick)
    )

    return () => {
      article.removeEventListener('click', handleFootnoteLinkClick)
      footnotesSections.forEach((section) =>
        section.removeEventListener('click', handleFootnoteClick)
      )
    }
  }, [...deps, onHaptic])
}
