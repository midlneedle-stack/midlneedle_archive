import { ViewTransition } from 'react'
import { ConnectSection } from "@/components/connect-section"
import { SectionHeader } from "@/components/section-header"
import { CasesGrid } from "@/components/cases-grid"
import { MediaProvider } from "@/components/media-context"
import { VideoCard } from "@/components/video-card"
import { withBasePath } from "@/lib/base-path"

const videos = {
  film_segment: withBasePath("/videos/film_segment.mp4"),
  fofocus: withBasePath("/videos/fofocus.mp4"),
  wheeel: withBasePath("/videos/wheeel.mp4"),
  xmbb: withBasePath("/videos/xmbb.mov"),
  lumon: withBasePath("/videos/lumon_trimmmed.mov"),
  cummera: withBasePath("/videos/cummera.mp4"),
  winxp: withBasePath("/videos/winxp.mp4"),
}
const icons = {
  playground: withBasePath("/resourses/icons/playground.png"),
  cases: withBasePath("/resourses/icons/casses.png"),
  connect: withBasePath("/resourses/icons/connect.png"),
  vladislav: withBasePath("/resourses/icons/vladislav.png"),
}

export default function Home() {
  return (
    <MediaProvider>
      <ViewTransition>
        <main className="min-h-screen bg-background">
          <div className="mx-auto max-w-2xl">
          {/* Hero Section */}
          <section className="mb-[var(--space-section)]">
            <div className="group">
              <h1 className="type-title mb-[var(--space-hero-text)] text-foreground">
                Vladislav Ivanov
              </h1>
              <p className="type-body mt-0 text-muted-foreground">
                I'm a product designer curious about technology and digital products. I prototype in code, enjoy solving complex problems and deeply care about craft.
              </p>
            </div>
          </section>

          {/* Playground Section */}
          <section className="mb-[var(--space-section)] group">
            <SectionHeader title="Playground" pixelVariant="playground" />

            <div className="flex flex-col gap-[var(--space-grid)] sm:gap-0">
              {/* Stack 1: 2 vertical videos */}
              <div className="grid grid-cols-1 gap-[var(--space-grid)] sm:mb-[var(--space-stack)] sm:grid-cols-2">
                <VideoCard
                  src={videos.film_segment}
                  title="Film Segment"
                  description="Cinematic UI transitions"
                  orientation="vertical"
                  showTitle={true}
                />
                <VideoCard
                  src={videos.fofocus}
                  title="Focus Animation"
                  description="Smooth focus state transitions"
                  orientation="vertical"
                  showTitle={true}
                />
              </div>

              {/* Horizontal video */}
              <div className="sm:mb-[var(--space-stack)]">
                <VideoCard
                  src={videos.xmbb}
                  title="XMB Interface"
                  description="Cross Media Bar navigation system"
                  orientation="horizontal"
                  showTitle={true}
                />
              </div>

              {/* Stack 2: 2 vertical videos */}
              <div className="grid grid-cols-1 gap-[var(--space-grid)] sm:mb-[var(--space-stack)] sm:grid-cols-2">
                <VideoCard
                  src={videos.wheeel}
                  title="Wheel Interaction"
                  description="Rotary picker interface"
                  orientation="vertical"
                  showTitle={true}
                />
                <VideoCard
                  src={videos.cummera}
                  title="Interactive List"
                  description="Gesture-driven list interactions"
                  orientation="vertical"
                  showTitle={true}
                />
              </div>

              {/* Stack 3: 2 vertical videos */}
              <div className="grid grid-cols-1 gap-[var(--space-grid)] sm:mb-[var(--space-stack)] sm:grid-cols-2">
                <VideoCard
                  src={videos.winxp}
                  title="Haptic Feedback"
                  description="Custom haptic patterns for UI feedback"
                  orientation="vertical"
                  showTitle={true}
                />
                <VideoCard
                  src={videos.film_segment}
                  title="Film Segment"
                  description="Cinematic UI transitions"
                  orientation="vertical"
                  showTitle={true}
                />
              </div>

              {/* Horizontal video */}
              <div>
                <VideoCard
                  src={videos.lumon}
                  title="Lumon Interface"
                  description="Modern dashboard design system"
                  orientation="horizontal"
                  showTitle={true}
                />
              </div>
            </div>
          </section>

          {/* Cases Section */}
          <section className="mb-[var(--space-section)] group">
            <SectionHeader title="Cases" pixelVariant="cases" />

            <CasesGrid
              cases={[
                { title: "Finance App Redesign" },
                { title: "How I Built a Pebble Watchface That Caught the Founder's Attention", href: "/cases/watchface" },
                { title: "Health Tracking Dashboard" },
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
      </ViewTransition>
    </MediaProvider>
  )
}
