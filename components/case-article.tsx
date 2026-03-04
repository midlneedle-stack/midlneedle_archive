'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import styles from './case-article.module.css'

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
  const [language, setLanguage] = useState<'eng' | 'ru'>(hasEnglish ? 'eng' : 'ru')
  const currentContent = language === 'eng' && content.eng ? content.eng : content.ru
  const { title, body, publishedAt } = currentContent
  const articleRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const article = articleRef.current
    if (!article) return

    const footnotesSections = Array.from(
      article.querySelectorAll<HTMLElement>('section[data-footnotes]')
    )

    if (footnotesSections.length === 0) return

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

      destination.scrollIntoView({ behavior: 'smooth', block: 'center' })
      window.history.pushState(null, '', href)
      event.preventDefault()
    }

    footnotesSections.forEach((section) =>
      section.addEventListener('click', handleFootnoteClick)
    )

    return () => {
      footnotesSections.forEach((section) =>
        section.removeEventListener('click', handleFootnoteClick)
      )
    }
  }, [language])

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
