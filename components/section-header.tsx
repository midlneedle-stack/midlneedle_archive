interface SectionHeaderProps {
  title: string
}

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <h2 className="font-semibold text-foreground">
      {title}
    </h2>
  )
}
