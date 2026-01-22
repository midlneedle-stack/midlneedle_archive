import { VideoCard } from "@/components/video-card"
import { ConnectSection } from "@/components/connect-section"
import { SectionHeader } from "@/components/section-header"
import { CasesGrid } from "@/components/cases-grid"
import { MediaProvider } from "@/components/media-context"

export default function Home() {
  return (
    <MediaProvider>
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl">
          {/* Hero Section */}
          <section className="mb-[var(--space-section)]">
            <h1 className="font-semibold text-foreground">
              Vladislav Ivanov
            </h1>
            <p className="text-muted-foreground">
              I'm a product designer curious about technology and digital products.
              {'\n'}I prototype in code and enjoy solving complex problems that bring value to users and businesses.
            </p>
          </section>

          {/* Playground Section */}
          <section className="mb-[var(--space-section)]">
            <SectionHeader title="Playground" />

            {/* Stack 1: 3 vertical videos */}
            <div className="mb-[var(--space-stack)] grid grid-cols-1 gap-[var(--space-grid-x)] sm:grid-cols-2 md:grid-cols-3">
              <VideoCard
                src="/videos/cummera.mp4"
                title="Interactive List"
                description="Gesture-driven list interactions in SwiftUI"
                orientation="vertical"
                showTitle={false}
              />
              <VideoCard
                src="/videos/winxp.mp4"
                title="Haptic Feedback"
                description="Custom haptic patterns for UI feedback"
                orientation="vertical"
                showTitle={false}
              />
              <VideoCard
                src="/videos/cummera.mp4"
                title="Scroll Animation"
                description="Parallax scrolling effects"
                orientation="vertical"
                showTitle={false}
              />
            </div>

            {/* Stack 2: 3 vertical videos */}
            <div className="mb-[var(--space-stack)] grid grid-cols-1 gap-[var(--space-grid-x)] sm:grid-cols-2 md:grid-cols-3">
              <VideoCard
                src="/videos/winxp.mp4"
                title="Tab Bar Transition"
                description="Fluid navigation transitions between views"
                orientation="vertical"
                showTitle={false}
              />
              <VideoCard
                src="/videos/cummera.mp4"
                title="Card Stack"
                description="Stackable card interface pattern"
                orientation="vertical"
                showTitle={false}
              />
              <VideoCard
                src="/videos/winxp.mp4"
                title="Animation Library"
                description="Reusable animation components"
                orientation="vertical"
                showTitle={false}
              />
            </div>

            {/* Stack 3: 3 vertical videos */}
            <div className="mb-[var(--space-stack)] grid grid-cols-1 gap-[var(--space-grid-x)] sm:grid-cols-2 md:grid-cols-3">
              <VideoCard
                src="/videos/cummera.mp4"
                title="Gesture Recognition"
                description="Advanced touch gesture handling"
                orientation="vertical"
                showTitle={false}
              />
              <VideoCard
                src="/videos/winxp.mp4"
                title="State Management"
                description="Complex state transitions"
                orientation="vertical"
                showTitle={false}
              />
              <VideoCard
                src="/videos/cummera.mp4"
                title="Performance Tuning"
                description="Optimized rendering techniques"
                orientation="vertical"
                showTitle={false}
              />
            </div>

            {/* Horizontal video */}
            <div>
              <VideoCard
                src="/videos/winxp.mp4"
                title="Full Design System"
                description="Complete component library and design system implementation"
                orientation="horizontal"
                showTitle={false}
              />
            </div>
          </section>

          {/* Cases Section */}
          <section className="mb-[var(--space-section)]">
            <SectionHeader title="Cases" />

            <CasesGrid
              cases={[
                { src: "/videos/cummera.mp4", title: "Finance App Redesign" },
                { src: "/videos/winxp.mp4", title: "E-commerce Checkout" },
                { src: "/videos/cummera.mp4", title: "Health Tracking Dashboard" },
              ]}
            />
          </section>

          {/* Connect Section */}
          <section>
            <SectionHeader title="Connect" />
            <ConnectSection />
          </section>
        </div>
      </main>
    </MediaProvider>
  )
}
