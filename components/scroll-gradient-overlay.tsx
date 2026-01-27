'use client'

import { useEffect, useRef, useState } from 'react'
import cn from 'clsx'

type ScrollDirection = 'up' | 'down'

export function ScrollGradientOverlay() {
  const [direction, setDirection] = useState<ScrollDirection>('down')
  const [visible, setVisible] = useState(false)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    const showId = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setVisible(true))
    })
    lastScrollY.current = window.scrollY

    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true

      window.requestAnimationFrame(() => {
        const currentY = window.scrollY
        const delta = currentY - lastScrollY.current

        if (Math.abs(delta) > 2) {
          setDirection(delta > 0 ? 'down' : 'up')
          lastScrollY.current = currentY
        }

        ticking.current = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.cancelAnimationFrame(showId)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <>
      <div
        aria-hidden="true"
        className={cn(
          'scroll-gradient-overlay pointer-events-none fixed left-0 right-0 top-0 z-50',
          visible && 'scroll-gradient-overlay--visible',
          'scroll-gradient-overlay--top',
          direction === 'up' && 'scroll-gradient-overlay--active'
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          'scroll-gradient-overlay pointer-events-none fixed left-0 right-0 bottom-0 z-50',
          visible && 'scroll-gradient-overlay--visible',
          'scroll-gradient-overlay--bottom',
          direction === 'down' && 'scroll-gradient-overlay--active'
        )}
      />
    </>
  )
}
