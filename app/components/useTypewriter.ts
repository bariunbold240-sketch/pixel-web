'use client'
import { useState, useEffect, useRef } from 'react'

export function useTypewriter(
  text: string,
  active: boolean,
  speed = 38,
  delay = 0,
) {
  const [count, setCount] = useState(0)
  const startRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tickRef  = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (startRef.current) clearTimeout(startRef.current)
    if (tickRef.current)  clearInterval(tickRef.current)

    if (!active) {
      setCount(0)
      return
    }

    setCount(0)
    let i = 0

    startRef.current = setTimeout(() => {
      tickRef.current = setInterval(() => {
        i += 1
        setCount(i)
        if (i >= text.length) {
          clearInterval(tickRef.current!)
          tickRef.current = null
        }
      }, speed)
    }, delay)

    return () => {
      if (startRef.current) clearTimeout(startRef.current)
      if (tickRef.current)  clearInterval(tickRef.current)
    }
  }, [active, text, speed, delay])

  return {
    displayed: text.slice(0, count),
    done: count >= text.length && text.length > 0,
  }
}
