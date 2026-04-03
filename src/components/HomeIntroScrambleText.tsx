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

type HomeIntroTypewriterTextProps = {
  text: string
  className?: string
  as?: 'p' | 'span'
  durationMs?: number
  /** Blinking cursor after full text, before `completeDelayMs` / `onComplete`. */
  postTypeCursorMs?: number
  /** Wait after post-cursor phase before calling `onComplete`. */
  completeDelayMs?: number
  onComplete?: () => void
}

/** Smooth “easy ease” (cubic in-out) — slow at start & end of each segment. */
function easeInOutCubic(t: number): number {
  const x = Math.min(1, Math.max(0, t))
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

/** Sentence spans in original `text` (split on `. ` / `! ` / `? `). */
function sentenceRanges(text: string): { start: number; end: number }[] {
  const parts = text.split(/(?<=[.!?])\s+/)
  if (parts.length <= 1) {
    return [{ start: 0, end: text.length }]
  }
  const ranges: { start: number; end: number }[] = []
  let pos = 0
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i]!
    ranges.push({ start: pos, end: pos + p.length })
    pos += p.length
    if (i < parts.length - 1) pos += 1
  }
  return ranges
}

/** Map elapsed time → visible character count (per-sentence ease-in-out). */
function visibleLengthAtElapsed(elapsed: number, text: string, durationMs: number): number {
  const len = text.length
  if (len === 0) return 0
  if (elapsed >= durationMs) return len

  const ranges = sentenceRanges(text)
  const weights = ranges.map((r) => r.end - r.start)
  const totalW = weights.reduce((a, b) => a + b, 0)
  if (totalW <= 0) return 0

  const segmentDurations = weights.map((w) => (w / totalW) * durationMs)
  let remaining = elapsed

  for (let i = 0; i < ranges.length; i++) {
    const sd = segmentDurations[i]!
    const { start, end } = ranges[i]!
    const segLen = end - start
    if (remaining < sd || i === ranges.length - 1) {
      const localT = sd <= 0 ? 1 : Math.min(1, remaining / sd)
      const eased = easeInOutCubic(localT)
      const charsInSeg = Math.max(0, Math.ceil(eased * segLen))
      return Math.min(len, start + charsInSeg)
    }
    remaining -= sd
  }
  return len
}

/** Typewriter reveal + blinking cursor (uses `.cursor-blink` in index.css). */
export function HomeIntroTypewriterText({
  text,
  className,
  as: Tag = 'span',
  durationMs = 2600,
  postTypeCursorMs = 600,
  completeDelayMs = 0,
  onComplete,
}: HomeIntroTypewriterTextProps) {
  const reduceMotion = usePrefersReducedMotion()
  const [visibleLen, setVisibleLen] = useState(() => (reduceMotion ? text.length : 0))
  const [trailingCursorBlink, setTrailingCursorBlink] = useState(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const textFullyVisible = visibleLen >= text.length
  const showCursor = !textFullyVisible || trailingCursorBlink

  useEffect(() => {
    let raf = 0
    let completeTimer: ReturnType<typeof setTimeout> | null = null
    let postCursorTimer: ReturnType<typeof setTimeout> | null = null
    let completeDispatched = false

    const dispatchComplete = () => {
      if (completeDispatched) return
      completeDispatched = true
      onCompleteRef.current?.()
    }

    const scheduleComplete = () => {
      if (completeDelayMs <= 0) {
        dispatchComplete()
        return
      }
      completeTimer = window.setTimeout(() => {
        completeTimer = null
        dispatchComplete()
      }, completeDelayMs)
    }

    const afterTypingFinished = () => {
      const pauseMs = reduceMotion ? 0 : postTypeCursorMs
      if (pauseMs <= 0) {
        setTrailingCursorBlink(false)
        scheduleComplete()
        return
      }
      setTrailingCursorBlink(true)
      postCursorTimer = window.setTimeout(() => {
        postCursorTimer = null
        setTrailingCursorBlink(false)
        scheduleComplete()
      }, pauseMs)
    }

    const cleanup = () => {
      cancelAnimationFrame(raf)
      if (completeTimer != null) {
        clearTimeout(completeTimer)
        completeTimer = null
      }
      if (postCursorTimer != null) {
        clearTimeout(postCursorTimer)
        postCursorTimer = null
      }
    }

    if (reduceMotion) {
      setVisibleLen(text.length)
      setTrailingCursorBlink(false)
      scheduleComplete()
      return cleanup
    }

    setTrailingCursorBlink(false)
    setVisibleLen(0)
    const len = text.length
    if (len === 0) {
      scheduleComplete()
      return cleanup
    }

    const start = performance.now()

    const tick = (now: number) => {
      const elapsed = now - start
      if (elapsed >= durationMs) {
        setVisibleLen(len)
        afterTypingFinished()
        return
      }
      const next = visibleLengthAtElapsed(elapsed, text, durationMs)
      setVisibleLen(next)
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return cleanup
  }, [text, durationMs, postTypeCursorMs, completeDelayMs, reduceMotion])

  const visible = text.slice(0, visibleLen)

  return (
    <Tag className={className} aria-hidden={!textFullyVisible}>
      <span className="break-words">{visible}</span>
      {showCursor && (
        <span
          className="cursor-blink ml-px inline-block h-[1.05em] w-[2px] shrink-0 translate-y-[0.08em] bg-current align-baseline"
          aria-hidden
        />
      )}
    </Tag>
  )
}
