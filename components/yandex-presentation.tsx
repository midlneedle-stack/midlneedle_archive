"use client"

import Image from "next/image"
import {
  startTransition,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ChevronLeft, ChevronRight, Download } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  type PresentationSlide,
  yandexPresentationDownloadHref,
  yandexPresentationDownloadName,
  yandexPresentationSlides,
} from "@/lib/yandex-presentation-data"
import { cn } from "@/lib/utils"
import styles from "./yandex-presentation.module.css"

type TabValue = "deck" | "download"

export function YandexPresentation() {
  const [activeTab, setActiveTab] = useState<TabValue>("deck")
  const [currentSlide, setCurrentSlide] = useState(0)
  const reduceMotion = useReducedMotion()
  const slides = yandexPresentationSlides
  const totalSlides = slides.length
  const slide = slides[currentSlide]

  const selectSlide = useCallback((index: number) => {
    const nextIndex = Math.max(0, Math.min(index, totalSlides - 1))
    startTransition(() => {
      setCurrentSlide(nextIndex)
    })
  }, [totalSlides])

  const moveSlide = (direction: -1 | 1) => {
    selectSlide(currentSlide + direction)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target
      if (
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return
      }

      if (event.key === "ArrowRight" || event.key === "PageDown") {
        event.preventDefault()
        selectSlide(currentSlide + 1)
      }

      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault()
        selectSlide(currentSlide - 1)
      }

      if (event.key === "Home") {
        event.preventDefault()
        selectSlide(0)
      }

      if (event.key === "End") {
        event.preventDefault()
        selectSlide(totalSlides - 1)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentSlide, totalSlides, selectSlide])

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerCopy}>
          <p className={styles.eyebrow}>Закрытый route для собеседования</p>
          <h1 className={styles.title}>Презентация по кейсу «Яндекс Товары»</h1>
        </div>
      </header>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TabValue)}
        className={styles.tabsRoot}
      >
        <div className={styles.tabsBar}>
          <TabsList className={styles.tabsList}>
            <TabsTrigger value="deck" className={styles.tabsTrigger}>
              Слайды
            </TabsTrigger>
            <TabsTrigger value="download" className={styles.tabsTrigger}>
              Скачать
            </TabsTrigger>
          </TabsList>
          <p className={styles.tabsHint}>← → для навигации</p>
        </div>

        <TabsContent value="deck" className={styles.tabsContent}>
          <section className={styles.deckShell}>
            <aside className={styles.navigator} aria-label="Список слайдов">
              {slides.map((item, index) => {
                const isActive = index === currentSlide

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={cn(
                      styles.navigatorItem,
                      isActive && styles.navigatorItemActive
                    )}
                    onClick={() => selectSlide(index)}
                    aria-current={isActive ? "true" : undefined}
                  >
                    <span className={styles.navigatorIndex}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.navigatorTitle}>{item.title}</span>
                  </button>
                )
              })}
            </aside>

            <div className={styles.stage}>
              <AnimatePresence initial={false} mode="wait">
                <motion.article
                  key={slide.id}
                  className={styles.stageFrame}
                  initial={
                    reduceMotion
                      ? { opacity: 1 }
                      : { opacity: 0, y: 10 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  exit={
                    reduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: -10 }
                  }
                  transition={{
                    duration: reduceMotion ? 0.1 : 0.22,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                >
                  <SlideView slide={slide} index={currentSlide} total={totalSlides} />
                </motion.article>
              </AnimatePresence>

              <footer className={styles.stageFooter}>
                <p className={styles.stageCount}>
                  {String(currentSlide + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
                </p>

                <div className={styles.controls}>
                  <button
                    type="button"
                    className={styles.controlButton}
                    onClick={() => moveSlide(-1)}
                    disabled={currentSlide === 0}
                    aria-label="Предыдущий слайд"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    className={styles.controlButton}
                    onClick={() => moveSlide(1)}
                    disabled={currentSlide === totalSlides - 1}
                    aria-label="Следующий слайд"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </footer>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="download" className={styles.tabsContent}>
          <section className={styles.downloadCard}>
            <p className={styles.downloadMeta}>
              PDF / {totalSlides} слайдов / файл готов
            </p>
            <h2 className={styles.downloadTitle}>Скачать всю презентацию</h2>
            <p className={styles.downloadLead}>
              Сразу скачивается вся колода
            </p>

            <a
              href={yandexPresentationDownloadHref}
              download={yandexPresentationDownloadName}
              className={styles.downloadButton}
            >
              <Download size={16} />
              Скачать PDF
            </a>

            <div className={styles.downloadList}>
              {slides.map((item, index) => (
                <span key={item.id} className={styles.downloadItem}>
                  {String(index + 1).padStart(2, "0")} {item.label}
                </span>
              ))}
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </main>
  )
}

function SlideView({
  slide,
  index,
  total,
}: {
  slide: PresentationSlide
  index: number
  total: number
}) {
  return (
    <div className={styles.slide}>
      <div className={styles.slideMeta}>
        <span>{slide.label}</span>
        <span>
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>

      {renderSlideContent(slide)}
    </div>
  )
}

function renderSlideContent(slide: PresentationSlide) {
  switch (slide.kind) {
    case "cover":
      return (
        <div className={cn(styles.slideBody, styles.coverLayout)}>
          <div>
            <p className={styles.coverEyebrow}>{slide.eyebrow}</p>
            <h2 className={styles.slideTitle}>{slide.title}</h2>
            <p className={styles.slideLead}>{slide.lead}</p>
          </div>
          <p className={styles.footerText}>{slide.footer}</p>
        </div>
      )

    case "bullets":
      return (
        <div className={styles.slideBody}>
          <h2 className={styles.slideTitle}>{slide.title}</h2>
          {slide.lead ? <p className={styles.slideLead}>{slide.lead}</p> : null}
          <ul className={styles.bulletList}>
            {slide.bullets.map((bullet) => (
              <li key={bullet} className={styles.bulletItem}>
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      )

    case "cards":
      return (
        <div className={styles.slideBody}>
          <h2 className={styles.slideTitle}>{slide.title}</h2>
          {slide.lead ? <p className={styles.slideLead}>{slide.lead}</p> : null}
          <div
            className={cn(
              styles.cardsGrid,
              slide.columns === 3 ? styles.cardsGridThree : styles.cardsGridTwo
            )}
          >
            {slide.cards.map((card) => (
              <Card key={card.title} title={card.title}>
                {card.body}
              </Card>
            ))}
          </div>
        </div>
      )

    case "quote":
      return (
        <div className={cn(styles.slideBody, styles.quoteLayout)}>
          <h2 className={styles.slideTitle}>{slide.title}</h2>
          <p className={styles.quoteText}>«{slide.quote}»</p>
          <div className={styles.quoteFooter}>
            <p className={styles.quoteSource}>{slide.source}</p>
            <p className={styles.slideLead}>{slide.body}</p>
          </div>
        </div>
      )

    case "steps":
      return (
        <div className={styles.slideBody}>
          <h2 className={styles.slideTitle}>{slide.title}</h2>
          {slide.lead ? <p className={styles.slideLead}>{slide.lead}</p> : null}
          <div className={cn(styles.cardsGrid, styles.cardsGridTwo)}>
            {slide.steps.map((step) => (
              <Card key={step.title} title={step.title}>
                {step.body}
              </Card>
            ))}
          </div>
        </div>
      )

    case "gallery":
      return (
        <div className={styles.slideBody}>
          <h2 className={styles.slideTitle}>{slide.title}</h2>
          {slide.lead ? <p className={styles.slideLead}>{slide.lead}</p> : null}
          <div className={styles.galleryGrid}>
            {slide.images.map((image) => (
              <figure key={image.src} className={styles.galleryCard}>
                <div className={styles.galleryMedia}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    unoptimized
                    sizes="(max-width: 900px) 100vw, 33vw"
                    className={styles.galleryImage}
                  />
                </div>
                <figcaption className={styles.galleryCaption}>
                  {image.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      )

    case "closing":
      return (
        <div className={cn(styles.slideBody, styles.closingLayout)}>
          <div>
            <h2 className={styles.slideTitle}>{slide.title}</h2>
            <p className={styles.closingLead}>{slide.lead}</p>
          </div>
          <p className={styles.footerText}>{slide.footer}</p>
        </div>
      )

    default:
      return null
  }
}

function Card({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <article className={styles.card}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardBody}>{children}</p>
    </article>
  )
}
