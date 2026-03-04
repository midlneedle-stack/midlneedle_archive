import { NotFoundHaptics } from "@/components/not-found-haptics"

export default function NotFound() {
  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
      <NotFoundHaptics />
      <div className="flex flex-col items-start">
        <p className="type-card-caption text-muted-foreground">
          well, i guess it&rsquo;s 404
        </p>
        <p className="type-card-caption mt-[var(--space-text)] text-muted-foreground">
          nothing to see here
        </p>
      </div>
    </div>
  )
}
