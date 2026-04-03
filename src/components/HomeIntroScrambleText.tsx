import { useEffect, useRef, useState } from 'react'

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*'

export function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fn = () => setReduce(mq.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])
  return reduce
}

function noiseForLength(text: string) {
  return text
    .split('')
    .map((c) => (/\s/.test(c) ? c : CHARSET[Math.floor(Math.random() * CHARSET.length)]))
    .join('')
}

type HomeIntroScrambleTextProps = {
  text: string
  className?: string
  as?: 'p' | 'span'
  durationMs?: number
  onComplete?: () => void
}

/** Sequential reveal + scramble for the home left-column intro only. */
export function HomeIntroScrambleText({
  text,
  className,
  as: Tag = 'span',
  durationMs = 1000,
  onComplete,
}: HomeIntroScrambleTextProps) {
  const reduceMotion = usePrefersReducedMotion()
  const [display, setDisplay] = useState(() => (reduceMotion ? text : noiseForLength(text)))
  const [settled, setSettled] = useState(reduceMotion)
  const onCompleteRef = useRef(onComplete)
  const firedRef = useRef(false)
  onCompleteRef.current = onComplete

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(text)
      setSettled(true)
      if (!firedRef.current) {
        firedRef.current = true
        onCompleteRef.current?.()
      }
      return
    }

    firedRef.current = false
    setSettled(false)
    setDisplay(noiseForLength(text))
    let raf = 0
    const start = performance.now()
    const len = text.length
    const safeLen = Math.max(1, len)

    const tick = (now: number) => {
      const elapsed = now - start
      const t = Math.min(1, elapsed / durationMs)
      let out = ''
      for (let i = 0; i < len; i++) {
        const c = text[i]!
        if (c === ' ' || c === '\n' || c === '\t') {
          out += c
          continue
        }
        const revealAt = (i / safeLen) * durationMs * 0.92
        if (elapsed >= revealAt) {
          out += c
        } else {
          out += CHARSET[Math.floor(Math.random() * CHARSET.length)]!
        }
      }
      setDisplay(out)

      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setDisplay(text)
        setSettled(true)
        if (!firedRef.current) {
          firedRef.current = true
          onCompleteRef.current?.()
        }
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [text, durationMs, reduceMotion])

  return (
    <Tag className={className} aria-hidden={!settled}>
      {display}
    </Tag>
  )
}
