import { HapticLink } from "@/components/haptic-link"

interface CaseItem {
  title: string
  date: string
  href?: string
}

interface CasesGridProps {
  cases: CaseItem[]
}

function CaseCard({ title, date, href }: CaseItem) {
  const content = (
    <div className="flex w-full items-center gap-[calc(var(--space-text)*0.5)] py-[8px] transition-[padding] duration-100 ease-out group-hover/item:pr-[4px]">
      <span className="cases-item-title type-body min-w-0">
        {title}
      </span>
      <span aria-hidden="true" className="h-px flex-1 min-w-[12px] bg-[var(--stroke)] transition-colors duration-100 ease-out group-hover/item:bg-foreground" />
      <span className="cases-item-date type-body shrink-0 w-[2.6em] text-right">
        {date}
      </span>
    </div>
  )

  return href ? (
    <HapticLink href={href} className="cases-item group/item block w-full">
      {content}
    </HapticLink>
  ) : (
    <div className="cases-item group/item">
      {content}
    </div>
  )
}

export function CasesGrid({ cases }: CasesGridProps) {
  return (
    <div className="cases-list group/list flex flex-col -mt-[8px]">
      {cases.map((item, index) => (
        <CaseCard key={`${item.title}-${index}`} {...item} />
      ))}
    </div>
  )
}
