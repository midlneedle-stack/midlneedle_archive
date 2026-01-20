import { VideoCard } from "@/components/video-card";
import { ConnectSection } from "@/components/connect-section";
import { SectionHeader } from "@/components/section-header";
import { CasesGrid } from "@/components/cases-grid";
import { MediaProvider } from "@/components/media-context";

export default function Home() {
  return (
    <MediaProvider>
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-6 py-24">
          {/* Hero Section */}
          <section className="mb-32">
            <h1 className="mb-4 text-foreground" style={{ fontSize: 24, fontWeight: 440, letterSpacing: '-0.04em' }}>
              Vladislav Ivanov
            </h1>
            <p className="text-muted-foreground" style={{ fontSize: 24, fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.4 }}>
              {"I'm a product designer curious about technology and digital products. \nI prototype in code and enjoy solving complex problems that bring value to users and businesses."}
            </p>
          </section>

          {/* Playground Section */}
          <section className="mb-32">
            <SectionHeader title="Playground" />

            {/* Stack 1: 3 vertical videos */}
            <div className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              <VideoCard
                src="/videos/prototype-1.mp4"
                title="Interactive List"
                description="Gesture-driven list interactions in SwiftUI"
                orientation="vertical"
                showTitle={false}
              />
              <VideoCard
                src="/videos/prototype-2.mp4"
                title="Haptic Feedback"
                description="Custom haptic patterns for UI feedback"
                orientation="vertical"
                showTitle={false}
              />
              <VideoCard
                src="/videos/prototype-3.mp4"
                title="Scroll Animation"
                description="Parallax scrolling effects"
                orientation="vertical"
                showTitle={false}
              />
            </div>

            {/* Stack 2: 3 vertical videos */}
            <div className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              <VideoCard
                src="/videos/prototype-4.mp4"
                title="Tab Bar Transition"
                description="Fluid navigation transitions between views"
                orientation="vertical"
                showTitle={false}
              />
              <VideoCard
                src="/videos/prototype-5.mp4"
                title="Card Stack"
                description="Stackable card interface pattern"
                orientation="vertical"
                showTitle={false}
              />
              <VideoCard
                src="/videos/prototype-6.mp4"
                title="Animation Library"
                description="Reusable animation components"
                orientation="vertical"
                showTitle={false}
              />
            </div>

            {/* Stack 3: 3 vertical videos */}
            <div className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              <VideoCard
                src="/videos/prototype-7.mp4"
                title="Gesture Recognition"
                description="Advanced touch gesture handling"
                orientation="vertical"
                showTitle={false}
              />
              <VideoCard
                src="/videos/prototype-8.mp4"
                title="State Management"
                description="Complex state transitions"
                orientation="vertical"
                showTitle={false}
              />
              <VideoCard
                src="/videos/prototype-9.mp4"
                title="Performance Tuning"
                description="Optimized rendering techniques"
                orientation="vertical"
                showTitle={false}
              />
            </div>

            {/* Horizontal video */}
            <div>
              <VideoCard
                src="/videos/prototype-horizontal.mp4"
                title="Full Design System"
                description="Complete component library and design system implementation"
                orientation="horizontal"
                showTitle={false}
              />
            </div>
          </section>

          {/* Cases Section */}
          <section className="mb-32">
            <SectionHeader title="Cases" />

            <CasesGrid
              cases={[
                { src: "/videos/case-1.mp4", title: "Finance App Redesign" },
                { src: "/videos/case-2.mp4", title: "E-commerce Checkout" },
                { src: "/videos/case-3.mp4", title: "Health Tracking Dashboard" },
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
  );
}
