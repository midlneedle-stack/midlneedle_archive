"use client"

import { useId } from "react"
import { cn } from "@/lib/utils"
import { useMedia } from "./media-context"
import { MorphingMedia } from "./morphing-media"

interface CaseItem {
  src: string
  title: string
}

interface CasesGridProps {
  cases: CaseItem[]
}

function CaseCard({ caseItem }: { caseItem: CaseItem }) {
  const id = useId()
  const { hoveredId, expandedId, setHoveredId, setExpandedId } = useMedia()

  const isHovered = hoveredId === id
  const isExpanded = expandedId === id
  const layoutId = `case-${id}`

  const handleOpen = () => {
    setHoveredId(null)
    setExpandedId(id)
  }
  const handleClose = () => {
    setHoveredId(null)
    setExpandedId(null)
  }

  return (
    <>
      <div
        className={cn(
          "relative transition-transform duration-300 ease-out transform-gpu origin-center",
          isHovered && !expandedId && "scale-[1.04]",
          isHovered && !expandedId && "z-40"
        )}
        onMouseEnter={() => !expandedId && setHoveredId(id)}
        onMouseLeave={() => !expandedId && setHoveredId(null)}
      >
        <MorphingMedia
          layoutId={layoutId}
          isOpen={isExpanded}
          onOpen={handleOpen}
          onClose={handleClose}
          triggerClassName={cn(
            "aspect-video cursor-zoom-in"
          )}
          expandedClassName="w-[80vw] max-w-6xl aspect-video"
        >
          <div
            className={cn(
              "relative h-full w-full overflow-hidden border border-border bg-black"
            )}
          >
            <video
              src={caseItem.src}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover transform-gpu scale-[1.01]"
            />
            <div className="absolute inset-0 flex items-end px-[var(--space-case-title-x)] py-[var(--space-case-title-y)] z-10">
              <h3 className="m-0 font-semibold leading-none text-white">
                {caseItem.title}
              </h3>
            </div>
          </div>
        </MorphingMedia>
      </div>
    </>
  )
}

export function CasesGrid({ cases }: CasesGridProps) {
  return (
    <div className="flex flex-col gap-[var(--space-cases-gap)]">
      {cases.map((caseItem, index) => (
        <CaseCard key={index} caseItem={caseItem} />
      ))}
    </div>
  )
}
