"use client"

import { useEffect } from "react"
import { useWebHaptics } from "web-haptics/react"
import { HAPTIC_404, HAPTIC_404_OPTIONS } from "@/lib/haptics"

export function NotFoundHaptics() {
  const { trigger } = useWebHaptics()

  useEffect(() => {
    trigger(HAPTIC_404, HAPTIC_404_OPTIONS)
  }, [trigger])

  return null
}
