"use client"

interface CaseItem {
  src: string
  title: string
}

interface CasesGridProps {
  cases: CaseItem[]
}

function CaseCard() {
  return (
    <div className="aspect-video w-full rounded-[var(--radius-card)] border border-border bg-white transition-transform duration-300 ease-out transform-gpu hover:scale-[1.02]" />
  )
}

export function CasesGrid({ cases }: CasesGridProps) {
  return (
    <div className="flex flex-col gap-[var(--space-stack)]">
      {cases.map((_, index) => (
        <CaseCard key={index} />
      ))}
    </div>
  )
}
