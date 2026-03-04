import styles from './case-article.module.css'

interface CaseMediaPlaceholderProps {
  label: string
  aspect?: string
}

export function CaseMediaPlaceholder({ label, aspect = 'aspect-video' }: CaseMediaPlaceholderProps) {
  return (
    <div className={`${styles.placeholder} ${aspect}`}>
      <span className="type-card-caption text-muted-foreground">{label}</span>
    </div>
  )
}
