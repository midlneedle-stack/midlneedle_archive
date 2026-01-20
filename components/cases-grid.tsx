"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import { useMedia } from "./media-context";

interface CaseItem {
  src: string;
  title: string;
}

interface CasesGridProps {
  cases: CaseItem[];
}

function CaseCard({ caseItem }: { caseItem: CaseItem }) {
  const id = useId();
  const { hoveredId, expandedId, setHoveredId, setExpandedId } = useMedia();
  
  const isHovered = hoveredId === id;
  const isExpanded = expandedId === id;

  const handleClick = () => {
    if (isExpanded) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <>
      {/* Expanded view */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-8 cursor-zoom-out"
          onClick={() => setExpandedId(null)}
        >
          <div 
            className="relative overflow-hidden bg-card border border-black/10 w-[80vw] max-w-6xl aspect-video cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={caseItem.src}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
            />
            
            {/* Title overlay inside the video */}
            <div className="absolute inset-0 flex items-end p-6">
              <h3 
                className="text-white"
                style={{ fontSize: 24, fontWeight: 440, letterSpacing: '-0.04em' }}
              >
                {caseItem.title}
              </h3>
            </div>
          </div>
        </div>
      )}

      <div
        className="relative"
        onMouseEnter={() => !expandedId && setHoveredId(id)}
        onMouseLeave={() => !expandedId && setHoveredId(null)}
        onClick={handleClick}
      >
        <div
          className={cn(
            "relative overflow-hidden bg-card border border-black/10 aspect-video transition-transform duration-300 ease-out cursor-zoom-in",
            isHovered && !expandedId && "scale-105 z-40"
          )}
        >
          <video
            src={caseItem.src}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          />
          
          {/* Title overlay inside the video */}
          <div className="absolute inset-0 flex items-end p-6">
            <h3 
              className="text-white"
              style={{ fontSize: 24, fontWeight: 440, letterSpacing: '-0.04em' }}
            >
              {caseItem.title}
            </h3>
          </div>
        </div>
      </div>
    </>
  );
}

export function CasesGrid({ cases }: CasesGridProps) {
  return (
    <div className="flex flex-col gap-16">
      {cases.map((caseItem, index) => (
        <CaseCard key={index} caseItem={caseItem} />
      ))}
    </div>
  );
}
