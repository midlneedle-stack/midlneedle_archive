'use client'

import { usePathname } from 'next/navigation'

export function ScrollGradientOverlay() {
  const pathname = usePathname()

  // Показываем только на страницах статей (например, /cases/watchface)
  const showOverlay =
    pathname.startsWith('/cases/') &&
    pathname !== '/cases/yandex-tovary/presentation'

  if (!showOverlay) return null

  return (
    <div
      aria-hidden="true"
      className="scroll-gradient-overlay scroll-gradient-overlay--visible scroll-gradient-overlay--top scroll-gradient-overlay--active pointer-events-none fixed left-0 right-0 top-0 z-50"
    />
  )
}
