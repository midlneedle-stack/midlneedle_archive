interface SectionHeaderProps {
  title: string
}

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <h2 className="type-title text-foreground">
      {title}
    </h2>
  )
}
