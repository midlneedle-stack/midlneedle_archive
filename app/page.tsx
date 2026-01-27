import { ConnectSection } from "@/components/connect-section"
import { SectionHeader } from "@/components/section-header"
import { CasesGrid } from "@/components/cases-grid"
import { MediaProvider } from "@/components/media-context"
import { VideoCard } from "@/components/video-card"
import { withBasePath } from "@/lib/base-path"

const videos = {
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
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl">
          {/* Hero Section */}
          <section className="mb-[var(--space-section)]">
            <div className="group">
              <h1 className="type-title mb-[var(--space-hero-text)] inline-flex items-center gap-0 text-foreground">
                <span>Vladislav Ivanov</span>
                <span className="pointer-events-none ml-0 translate-x-0 opacity-0 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-[0.2em]">
                  <img src={icons.vladislav} alt="" className="h-[1em] w-[1em]" />
                </span>
              </h1>
              <p className="type-body mt-0 text-muted-foreground">
                I'm a product designer curious about technology and digital products.
                {'\n'}I prototype in code and enjoy solving complex problems that bring value to users and businesses.
              </p>
            </div>
          </section>

          {/* Playground Section */}
          <section className="mb-[var(--space-section)] group">
            <SectionHeader title="Playground" iconSrc={icons.playground} />

            <div className="flex flex-col gap-[var(--space-grid)] sm:gap-0">
              {/* Stack 1: 2 vertical videos */}
              <div className="grid grid-cols-1 gap-[var(--space-grid)] sm:mb-[var(--space-stack)] sm:grid-cols-2">
                <VideoCard
                  src={videos.cummera}
                  title="Interactive List"
                  description="Gesture-driven list interactions in SwiftUI"
                  orientation="vertical"
                  showTitle={true}
                />
                <VideoCard
                  src={videos.winxp}
                  title="Haptic Feedback"
                  description="Custom haptic patterns for UI feedback"
                  orientation="vertical"
                  showTitle={true}
                />
              </div>

              {/* Horizontal video */}
              <div className="sm:mb-[var(--space-stack)]">
                <VideoCard
                  src={videos.winxp}
                  title="Full Design System"
                  description="Complete component library and design system implementation"
                  orientation="horizontal"
                  showTitle={true}
                />
              </div>

              {/* Stack 2: 2 vertical videos */}
              <div className="grid grid-cols-1 gap-[var(--space-grid)] sm:mb-[var(--space-stack)] sm:grid-cols-2">
                <VideoCard
                  src={videos.winxp}
                  title="Tab Bar Transition"
                  description="Fluid navigation transitions between views"
                  orientation="vertical"
                  showTitle={true}
                />
                <VideoCard
                  src={videos.cummera}
                  title="Card Stack"
                  description="Stackable card interface pattern"
                  orientation="vertical"
                  showTitle={true}
                />
              </div>

              {/* Stack 3: 2 vertical videos */}
              <div className="grid grid-cols-1 gap-[var(--space-grid)] sm:mb-[var(--space-stack)] sm:grid-cols-2">
                <VideoCard
                  src={videos.cummera}
                  title="Gesture Recognition"
                  description="Advanced touch gesture handling"
                  orientation="vertical"
                  showTitle={true}
                />
                <VideoCard
                  src={videos.winxp}
                  title="State Management"
                  description="Complex state transitions"
                  orientation="vertical"
                  showTitle={true}
                />
              </div>

              {/* Horizontal video */}
              <div>
                <VideoCard
                  src={videos.winxp}
                  title="Full Design System"
                  description="Complete component library and design system implementation"
                  orientation="horizontal"
                  showTitle={true}
                />
              </div>
            </div>
          </section>

          {/* Cases Section */}
          <section className="mb-[var(--space-section)] group">
            <SectionHeader title="Cases" iconSrc={icons.cases} />

            <CasesGrid
              cases={[
                { src: videos.cummera, title: "Finance App Redesign" },
                { src: videos.winxp, title: "E-commerce Checkout" },
                { src: videos.cummera, title: "Health Tracking Dashboard" },
              ]}
            />
          </section>

          {/* Connect Section */}
          <section className="group">
            <SectionHeader title="Connect" iconSrc={icons.connect} />
            <ConnectSection />
          </section>
        </div>
      </main>
    </MediaProvider>
  )
}
