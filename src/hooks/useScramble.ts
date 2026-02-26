import { useState, useEffect, useRef } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*_-+='

interface UseScrambleOptions {
  text: string
  speed?: number       // ms per tick
  scrambleCycles?: number // how many random chars to show before settling
  delay?: number       // ms before starting
}

export function useScramble({
  text,
  speed = 40,
  scrambleCycles = 6,
  delay = 200,
}: UseScrambleOptions) {
  const [display, setDisplay] = useState('')
  const frameRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    let cancelled = false

    timerRef.current = setTimeout(() => {
      if (cancelled) return

      // Track how many cycles each character has been scrambled
      const cycles = new Array(text.length).fill(0)
      let settled = new Array(text.length).fill(false)

      function tick() {
        if (cancelled) return

        let next = ''
        let allDone = true

        for (let i = 0; i < text.length; i++) {
          if (text[i] === ' ' || text[i] === '\n') {
            next += text[i]
            settled[i] = true
            continue
          }
          if (settled[i]) {
            next += text[i]
            continue
          }

          allDone = false

          if (cycles[i] >= scrambleCycles) {
            settled[i] = true
            next += text[i]
          } else {
            cycles[i]++
            next += CHARS[Math.floor(Math.random() * CHARS.length)]
          }
        }

        setDisplay(next)

        if (!allDone) {
          frameRef.current = window.setTimeout(tick, speed)
        }
      }

      tick()
    }, delay)

    return () => {
      cancelled = true
      if (timerRef.current) clearTimeout(timerRef.current)
      clearTimeout(frameRef.current)
    }
  }, [text, speed, scrambleCycles, delay])

  return display
}
