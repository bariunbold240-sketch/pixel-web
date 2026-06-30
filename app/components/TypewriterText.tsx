'use client'
import { useTypewriter } from './useTypewriter'
import { useMediaQuery } from '../hooks/useMediaQuery'

interface TypewriterTextProps {
  text: string
  active: boolean
  speed?: number
  delay?: number
}

export default function TypewriterText({
  text,
  active,
  speed = 38,
  delay = 0,
}: TypewriterTextProps) {
  // On mobile, all sections are mounted simultaneously — start typing regardless of active
  const isMobile = useMediaQuery('(max-width: 767px)')

  const { displayed, done } = useTypewriter(text, active || isMobile, speed, delay)

  return (
    <>
      {displayed}
      <span className={`tw-cursor${done ? ' tw-cursor--done' : ''}`} aria-hidden="true" />
    </>
  )
}
