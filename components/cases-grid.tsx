"use client"

import Link from 'next/link'
import { ViewTransition } from 'react'
import { useRouter } from 'next/navigation'
import { startTransition } from 'react'

interface CaseItem {
  title: string
  href?: string
}

interface CasesGridProps {
  cases: CaseItem[]
}

function CaseCard({ title, href }: CaseItem) {
  const router = useRouter()

  const content = (
    <div className="flex h-full w-full flex-col justify-end gap-1 p-[var(--space-inset)]">
      <span className="type-card-title text-foreground">{title}</span>
    </div>
  )

  const handleClick = (e: React.MouseEvent) => {
    if (href) {
      e.preventDefault()
      startTransition(() => {
        router.push(href)
      })
    }
  }

  return (
    <ViewTransition>
      <div className="aspect-video w-full overflow-hidden rounded-[var(--radius-card)] border border-border bg-card transition-transform duration-300 ease-out transform-gpu hover:scale-[1.02]">
        {href ? (
          <Link href={href} prefetch={true} onClick={handleClick} className="block h-full w-full">
            {content}
          </Link>
        ) : (
          content
        )}
      </div>
    </ViewTransition>
  )
}

export function CasesGrid({ cases }: CasesGridProps) {
  return (
    <div className="flex flex-col gap-[var(--space-stack)]">
      {cases.map((item, index) => (
        <CaseCard key={`${item.title}-${index}`} {...item} />
      ))}
    </div>
  )
}
