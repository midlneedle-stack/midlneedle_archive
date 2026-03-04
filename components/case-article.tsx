'use client'

import { useState, type ReactNode } from 'react'
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

          <article data-article-content className={`mt-[var(--space-text)] ${styles.article}`}>
            {body}
          </article>
        </section>
      </div>
    </main>
  )
}
