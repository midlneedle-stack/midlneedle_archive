import { ConnectSection } from "@/components/connect-section"
import { SectionHeader } from "@/components/section-header"
import { CasesGrid } from "@/components/cases-grid"
import { MediaProvider } from "@/components/media-context"
import { VideoCard } from "@/components/video-card"
import { withBasePath } from "@/lib/base-path"
import { videoPlaceholders } from "@/lib/video-placeholders"

const videos = {
  general_magic: withBasePath("/videos/General_magic.mp4"),
  film_segment: withBasePath("/videos/film_segment.mp4"),
  fcn_awesome: withBasePath("/videos/fcn_awesome.mp4"),
  fofocus: withBasePath("/videos/fofocus.mp4"),
  fp_fd_transitionn: withBasePath("/videos/fp_fd_transitionn.mp4"),
  gestures: withBasePath("/videos/gestures.mp4"),
  skeuo: withBasePath("/videos/skeuo.mp4"),
  cummera: withBasePath("/videos/cummera.mp4"),
  wheeel: withBasePath("/videos/wheeel.mp4"),
  wiki25: withBasePath("/videos/wiki25.mp4"),
  xmbb: withBasePath("/videos/xmbb.mp4"),
}

type VideoKey = keyof typeof videos

const toTitle = (value: string) =>
  value
    .split("_")
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
    .join(" ")

const toSentence = (value: string) =>
  value
    .split("_")
    .map((word, index) => {
      if (!word) return word
      const lower = word.toLowerCase()
      return index === 0 ? lower[0].toUpperCase() + lower.slice(1) : lower
    })
    .join(" ")

const defaultMeta = (key: VideoKey) => ({
  title: toTitle(key),
  description: toSentence(key),
})

const videoMeta: Record<
  VideoKey,
  {
    title: string
    description: string
    orientation?: "vertical" | "horizontal"
  }
> = {
  general_magic: defaultMeta("general_magic"),
  film_segment: {
    title: "Film Segment",
    description: "Cinematic UI transitions",
  },
  fcn_awesome: defaultMeta("fcn_awesome"),
  fofocus: {
    title: "Focus Animation",
    description: "Smooth focus state transitions",
  },
  fp_fd_transitionn: defaultMeta("fp_fd_transitionn"),
  gestures: defaultMeta("gestures"),
  skeuo: defaultMeta("skeuo"),
  cummera: {
    title: "Interactive List",
    description: "Gesture-driven list interactions",
  },
  wheeel: {
    title: "Wheel Interaction",
    description: "Rotary picker interface",
  },
  wiki25: {
    title: "Wiki 25",
    description: "Experimental interface concept",
  },
  xmbb: {
    title: "XMB Interface",
    description: "Cross Media Bar navigation system",
    orientation: "horizontal",
  },
}

const verticalOrder: VideoKey[] = [
  "general_magic",
  "film_segment",
  "fcn_awesome",
  "fofocus",
  "fp_fd_transitionn",
  "gestures",
  "skeuo",
  "cummera",
  "wheeel",
  "wiki25",
]

const verticalPairs: VideoKey[][] = []
for (let i = 0; i < verticalOrder.length; i += 2) {
  verticalPairs.push(verticalOrder.slice(i, i + 2))
}

type PlaygroundGroup =
  | { type: "pair"; items: VideoKey[] }
  | { type: "full"; item: VideoKey }

const makePair = (items: VideoKey[]): PlaygroundGroup => ({ type: "pair", items })
const makeFull = (item: VideoKey): PlaygroundGroup => ({ type: "full", item })

const playgroundGroups: PlaygroundGroup[] = [
  ...(verticalPairs[0] ? [makePair(verticalPairs[0])] : []),
  makeFull("xmbb"),
  ...verticalPairs.slice(1).map((items) => makePair(items)),
]

export default function Home() {
  return (
    <MediaProvider>
      <main className="min-h-screen bg-background">
          <div className="mx-auto max-w-2xl">
          {/* Hero Section */}
          <section className="mb-[var(--space-section)]">
            <div className="group">
              <h1 className="type-title mb-[var(--space-hero-text)] text-foreground">
                Vladislav Ivanov
              </h1>
              <p className="type-body mt-0 text-faint-foreground">
                I&apos;m a product designer curious about technology and digital products. I prototype in code, enjoy solving complex problems and deeply care about craft.
              </p>
            </div>
          </section>

          {/* Playground Section */}
          <section className="mb-[var(--space-section)] group">
            <SectionHeader title="Playground" pixelVariant="playground" />

            <div className="flex flex-col gap-[var(--space-grid)] sm:gap-0">
              {playgroundGroups.map((group, index) => {
                const isLast = index === playgroundGroups.length - 1
                const groupSpacing = isLast ? "" : "sm:mb-[var(--space-stack)]"

                if (group.type === "full") {
                  const meta = videoMeta[group.item]
                  return (
                    <div key={group.item} className={groupSpacing}>
                      <VideoCard
                        src={videos[group.item]}
                        title={meta.title}
                        description={meta.description}
                        orientation={meta.orientation ?? "horizontal"}
                        showTitle={true}
                        blurDataURL={videoPlaceholders[group.item]}
                      />
                    </div>
                  )
                }

                return (
                  <div
                    key={group.items.join("-")}
                    className={`grid grid-cols-1 gap-[var(--space-grid)] sm:grid-cols-2 ${groupSpacing}`}
                  >
                    {group.items.map((key) => {
                      const meta = videoMeta[key]
                      const isSolo = group.items.length === 1
                      return (
                        <VideoCard
                          key={key}
                          src={videos[key]}
                          title={meta.title}
                          description={meta.description}
                          orientation={meta.orientation ?? "vertical"}
                          showTitle={true}
                          blurDataURL={videoPlaceholders[key]}
                          className={isSolo ? "sm:col-span-2" : undefined}
                        />
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </section>

          {/* Cases Section */}
          <section className="mb-[var(--space-section)] group">
            <SectionHeader title="Cases" pixelVariant="cases" />

            <CasesGrid
              cases={[
                { title: "Letterboxd — Case Study", date: "28/2", href: "/cases/letterboxd" },
                { title: "How I Built a Pebble Watchface That Caught the Founder's Attention", date: "18/12", href: "/cases/watchface" },
                { title: "Yandex Tovary — Onboarding", date: "15/11", href: "/cases/yandex-tovary" },
              ]}
            />
          </section>

          {/* Connect Section */}
          <section className="group">
            <SectionHeader title="Connect" pixelVariant="connect" />
            <ConnectSection />
          </section>
        </div>
      </main>
    </MediaProvider>
  )
}
