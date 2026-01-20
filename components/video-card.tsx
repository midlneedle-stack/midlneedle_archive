"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import { useMedia } from "./media-context";

interface VideoCardProps {
  src: string;
  title: string;
  description?: string;
  orientation?: "vertical" | "horizontal";
  showTitle?: boolean;
  showDescription?: boolean;
  className?: string;
}

export function VideoCard({
  src,
  title,
  description,
  orientation = "vertical",
  showTitle = true,
  showDescription = true,
  className,
}: VideoCardProps) {
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
            className={cn(
              "relative overflow-hidden bg-card border border-black/10 cursor-default",
              orientation === "vertical" ? "h-[80vh] aspect-[9/16]" : "w-[80vw] max-w-6xl aspect-video"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={src}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}

      <div 
        className={cn("flex flex-col gap-4", className)}
        onMouseEnter={() => !expandedId && setHoveredId(id)}
        onMouseLeave={() => !expandedId && setHoveredId(null)}
        onClick={handleClick}
      >
        <div
          className={cn(
            "relative overflow-hidden bg-card border border-black/10 transition-transform duration-300 ease-out cursor-zoom-in",
            orientation === "vertical" ? "aspect-[9/16]" : "aspect-video",
            isHovered && !expandedId && "scale-105 z-40"
          )}
        >
          <video
            src={src}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          />
        </div>
        <div className={cn("transition-all duration-300 ease-out", isHovered && !expandedId && "relative z-40")}>
          {showTitle && <h3 className="text-foreground" style={{ fontSize: 24, fontWeight: 440, letterSpacing: '-0.04em' }}>{title}</h3>}
          {showDescription && description && (
            <p className="text-muted-foreground" style={{ fontSize: 24, fontWeight: 400, letterSpacing: '-0.02em' }}>{description}</p>
          )}
        </div>
      </div>
    </>
  );
}
