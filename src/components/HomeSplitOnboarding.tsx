import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export const HOME_SPLIT_ONBOARDING_SESSION_KEY = 'portfolio-home-split-onboarding-v1'

/** Dev: ignore sessionStorage so the guide runs on every reload while testing. */
const ONBOARDING_DEV_IGNORE_SESSION = import.meta.env.DEV

const DEV_LOG = import.meta.env.DEV

const TOOLTIP_TEXT = 'Drag to resize sections'

/** Unified easing: smooth in-out “heartbeat” across bar, glow, and tooltip. */
const ONBOARD_EASE: [number, number, number, number] = [0.42, 0, 0.58, 1]

/** Single breath (0 → peak → 0); tooltip is scheduled as soon as this elapses after `pulse1` starts. */
const PULSE_DURATION_S = 0.4
const PULSE_DURATION_MS = Math.round(PULSE_DURATION_S * 1000)

/** Idle→done timeouts (ms). `pulse1` is held for exactly `PULSE_DURATION_MS`, then tooltip (no second pulse). */
const ONBOARD_PRE_FADE_MS = 400
const ONBOARD_FADE_BARS_MS = 380
const ONBOARD_TOOLTIP_MS = 2200
const ONBOARD_EXIT_MS = 390

const FADE_BAR_OPACITY_S = Math.min(0.34, ONBOARD_FADE_BARS_MS / 1000 - 0.02)

type GuidePhase = 'off' | 'fadeBars' | 'pulse1' | 'tooltip' | 'exit' | 'done'

type UseHomeSplitColumnGuideOptions = {
  entranceComplete: boolean
  isMobile: boolean
  reduceMotion: boolean
  isDark: boolean
  firstDividerRef: React.RefObject<HTMLElement | null>
  /** Dev-only: echoed when the guide arms (after `entranceComplete`) so you can correlate with menu sequence. */
  menuSeqPhaseForDev?: string
  /**
   * Persist “seen” separately from production (`HOME_SPLIT_ONBOARDING_SESSION_KEY`).
   * Pass a distinct key on `/test` so the guide does not leak state to the live home page.
   */
  sessionStorageKey?: string
}

export function useHomeSplitColumnGuide({
  entranceComplete,
  isMobile,
  reduceMotion,
  isDark,
  firstDividerRef,
  menuSeqPhaseForDev,
  sessionStorageKey = HOME_SPLIT_ONBOARDING_SESSION_KEY,
}: UseHomeSplitColumnGuideOptions) {
  const [phase, setPhase] = useState<GuidePhase>('off')
  const dismissed = useRef(false)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const phaseRef = useRef(phase)
  phaseRef.current = phase

  useEffect(() => {
    if (!DEV_LOG) return
    console.log('[SplitOnboarding] entranceComplete:', entranceComplete, {
      isMobile,
      reduceMotion,
      ignoreSession: ONBOARDING_DEV_IGNORE_SESSION,
    })
  }, [entranceComplete, isMobile, reduceMotion])

  useEffect(() => {
    if (!DEV_LOG || phase === 'off') return
    console.log('[SplitOnboarding] phase:', phase)
  }, [phase])

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }, [])

  const markSeenAndEnd = useCallback(() => {
    if (dismissed.current) return
    dismissed.current = true
    if (!ONBOARDING_DEV_IGNORE_SESSION) {
      try {
        sessionStorage.setItem(sessionStorageKey, '1')
      } catch {
        /* ignore */
      }
    }
    clearTimers()
    setPhase('done')
  }, [clearTimers, sessionStorageKey])

  const dismissFromUser = useCallback(() => {
    const p = phaseRef.current
    if (p === 'off' || p === 'done') return
    markSeenAndEnd()
  }, [markSeenAndEnd])

  useEffect(() => {
    if (!entranceComplete || isMobile || reduceMotion) {
      if (DEV_LOG && entranceComplete && (isMobile || reduceMotion)) {
        console.log('[SplitOnboarding] skip start: mobile or reduced motion')
      }
      return
    }
    if (phase !== 'off') return

    if (!ONBOARDING_DEV_IGNORE_SESSION) {
      try {
        if (sessionStorage.getItem(sessionStorageKey) === '1') {
          dismissed.current = true
          setPhase('done')
          if (DEV_LOG) console.log('[SplitOnboarding] skip: sessionStorage already seen')
          return
        }
      } catch {
        /* ignore */
      }
    } else if (DEV_LOG) {
      console.log('[SplitOnboarding] sessionStorage check bypassed (DEV)')
    }

    if (DEV_LOG) {
      console.log('Onboarding Triggered:', menuSeqPhaseForDev ?? '(menu phase not passed)')
      console.log('[SplitOnboarding] scheduling fadeBars in', ONBOARD_PRE_FADE_MS, 'ms')
    }
    const id = window.setTimeout(() => {
      if (dismissed.current) return
      setPhase('fadeBars')
    }, ONBOARD_PRE_FADE_MS)
    return () => clearTimeout(id)
  }, [entranceComplete, isMobile, reduceMotion, phase, sessionStorageKey, menuSeqPhaseForDev])

  useEffect(() => {
    if (phase === 'off' || phase === 'done') return

    clearTimers()
    const schedule = (ms: number, next: GuidePhase) => {
      timersRef.current.push(
        window.setTimeout(() => {
          if (dismissed.current && next !== 'done') return
          setPhase(next)
        }, ms),
      )
    }

    switch (phase) {
      case 'fadeBars':
        schedule(ONBOARD_FADE_BARS_MS, 'pulse1')
        break
      case 'pulse1':
        schedule(PULSE_DURATION_MS, 'tooltip')
        break
      case 'tooltip':
        schedule(ONBOARD_TOOLTIP_MS, 'exit')
        break
      case 'exit':
        schedule(ONBOARD_EXIT_MS, 'done')
        break
      default:
        break
    }

    return () => clearTimers()
  }, [phase, clearTimers])

  useEffect(() => {
    if (phase !== 'done') return
    markSeenAndEnd()
  }, [phase, markSeenAndEnd])

  const showBars =
    phase === 'fadeBars' || phase === 'pulse1' || phase === 'tooltip' || phase === 'exit'

  const barOpacity = phase === 'exit' || phase === 'done' ? 0 : showBars ? 1 : 0
  const pulseKey = phase === 'pulse1' ? 1 : 0
  const showTooltip = phase === 'tooltip'

  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number } | null>(null)

  useLayoutEffect(() => {
    if (!showTooltip) {
      setTooltipPos(null)
      return
    }

    let cancelled = false
    let raf = 0

    const measure = () => {
      const el = firstDividerRef.current
      if (!el) return false
      const r = el.getBoundingClientRect()
      if (r.width <= 0 && r.height <= 0) return false
      setTooltipPos({
        top: r.top + r.height / 2,
        left: r.right + 12,
      })
      return true
    }

    const sync = () => {
      if (cancelled) return
      if (measure()) return
      let n = 0
      const tick = () => {
        if (cancelled) return
        if (measure() || n++ > 45) {
          if (n > 45 && DEV_LOG && !firstDividerRef.current) {
            console.warn('[SplitOnboarding] firstDividerRef still null after rAF retries')
          }
          return
        }
        raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    sync()

    const onWin = () => {
      measure()
    }
    window.addEventListener('resize', onWin)
    window.addEventListener('scroll', onWin, true)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onWin)
      window.removeEventListener('scroll', onWin, true)
    }
  }, [showTooltip, firstDividerRef])

  const wrapDividerPointerDown =
    (handler: (e: React.PointerEvent<HTMLDivElement>) => void) =>
    (e: React.PointerEvent<HTMLDivElement>) => {
      dismissFromUser()
      handler(e)
    }

  return {
    wrapDividerPointerDown,
    renderBarGlow: () => (
      <SplitResizeGuideBarGlow barOpacity={barOpacity} pulseKey={pulseKey} isDark={isDark} />
    ),
    renderTooltip: () => (
      <SplitResizeGuideTooltip visible={showTooltip} position={tooltipPos} isDark={isDark} />
    ),
  }
}

function SplitResizeGuideBarGlow({
  barOpacity,
  pulseKey,
  isDark,
}: {
  barOpacity: number
  pulseKey: number
  isDark: boolean
}) {
  const line = isDark ? 'rgba(255,255,255,0.27)' : '#FFFFFF'
  const glowPeak = isDark ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.88)'

  const idleShadow = '0 0 0 0 rgba(255,255,255,0)'
  /** One smooth breath: idle → peak glow → idle (no remount `key`; avoids bar opacity flash into tooltip). */
  const pulseShadow =
    pulseKey > 0
      ? [idleShadow, `0 0 16px 7px ${glowPeak}`, idleShadow]
      : idleShadow

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-y-3 left-1/2 z-[1] hidden w-[2px] -translate-x-1/2 rounded-full md:block"
      style={{ background: line }}
      initial={{ opacity: 0, boxShadow: idleShadow }}
      animate={{
        opacity: barOpacity,
        boxShadow: pulseShadow,
      }}
      transition={{
        opacity: { duration: FADE_BAR_OPACITY_S, ease: ONBOARD_EASE },
        boxShadow:
          pulseKey > 0
            ? {
                duration: PULSE_DURATION_S,
                ease: ONBOARD_EASE,
                times: [0, 0.5, 1],
              }
            : { duration: 0.18, ease: ONBOARD_EASE },
      }}
    />
  )
}

function SplitResizeGuideTooltip({
  visible,
  position,
  isDark,
}: {
  visible: boolean
  position: { top: number; left: number } | null
  isDark: boolean
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || typeof document === 'undefined') return null
  if (!visible || position == null) return null

  return createPortal(
    <AnimatePresence>
      <div
        key="home-split-onboarding-tooltip"
        className="pointer-events-none fixed z-[200]"
        style={{
          top: position.top,
          left: position.left,
          transform: 'translateY(-50%)',
        }}
      >
        <motion.div
          role="tooltip"
          initial={{ opacity: 0, scale: 0.96, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 2 }}
          transition={{
            duration: 0.32,
            ease: ONBOARD_EASE,
          }}
          className={`max-w-[220px] rounded-none border-0 px-3 py-2 font-mono text-[11px] font-semibold leading-snug ${
            isDark ? 'bg-white text-black' : 'bg-black text-white'
          }`}
        >
          {TOOLTIP_TEXT}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body,
  )
}
