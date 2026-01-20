interface SectionHeaderProps {
  title: string;
}

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <h2 className="mb-6 text-foreground" style={{ fontSize: 24, fontWeight: 440, letterSpacing: '-0.04em' }}>{title}</h2>
  );
}
