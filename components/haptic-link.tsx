"use client"

import type { ComponentPropsWithoutRef, MouseEvent } from "react"
import { useWebHaptics } from "web-haptics/react"
import { HAPTIC_TRANSITION, HAPTIC_TRANSITION_OPTIONS } from "@/lib/haptics"

type HapticLinkProps = ComponentPropsWithoutRef<"a">

export function HapticLink({ onClick, ...props }: HapticLinkProps) {
  const { trigger } = useWebHaptics()

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (event.defaultPrevented) return
    trigger(HAPTIC_TRANSITION, HAPTIC_TRANSITION_OPTIONS)
  }

  return <a {...props} onClick={handleClick} />
}
