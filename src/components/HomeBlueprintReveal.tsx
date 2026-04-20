/* eslint-disable react-refresh/only-export-components -- constants + session helpers ship with motion primitives */
import type { ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'

/** Mechanical blueprint easing (architectural reveal). */
export const BLUEPRINT_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1]

export const BLUEPRINT_DURATION = 0.8

/** Time to wait after mount before starting intro copy, so column strokes finish first. */
export const BLUEPRINT_COLUMN_LINES_INTRO_DELAY_MS = Math.round(BLUEPRINT_DURATION * 1000) + 120

export const blueprintLineTransition = (delay = 0) => ({
  duration: BLUEPRINT_DURATION,
  ease: BLUEPRINT_EASE,
  delay,
})

export type BlueprintPhase = 'lines' | 'headlines' | 'data' | 'off'

export function getBlueprintRevealSessionKey(splitWidthsStorageKey: string): string {
  return `portfolio-home-blueprint-${splitWidthsStorageKey}`
}

export function readBlueprintRevealSkipped(sessionKey: string): boolean {
  if (typeof window === 'undefined') return true
  try {
    return sessionStorage.getItem(sessionKey) === '1'
  } catch {
    return true
  }
}

export function markBlueprintRevealComplete(sessionKey: string): void {
  try {
    sessionStorage.setItem(sessionKey, '1')
  } catch {
    /* ignore */
  }
}

/**
 * Parent orchestration: `animate={phase}` on this node ties Phase 1 → 3 sequencing
 * (line children use {@link blueprintLineTransition} while `phase === "lines"`).
 */
export const blueprintRevealOrchestratorVariants: Variants = {
  lines: {
    opacity: 1,
    transition: { duration: 0 },
  },
  headlines: {
    opacity: 1,
    transition: { duration: 0 },
  },
  data: {
    opacity: 1,
    transition: { duration: 0 },
  },
  off: {
    opacity: 1,
    transition: { duration: 0 },
  },
}

/** Horizontal rule draws left → right (Phase 1). */
export function BlueprintHorizontalRule({
  className,
  skip,
  phase,
  delay = 0,
}: {
  className?: string
  skip: boolean
  phase: BlueprintPhase
  delay?: number
}) {
  if (skip) {
    return <div className={className} aria-hidden />
  }
  return (
    <motion.div
      aria-hidden
      className={className}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={phase === 'lines' ? blueprintLineTransition(delay) : { duration: 0 }}
      style={{ transformOrigin: 'left center' }}
    />
  )
}

/** Vertical stroke draws top → bottom (Phase 1). */
export function BlueprintVerticalStroke({
  className,
  skip,
  phase,
  delay = 0,
}: {
  className: string
  skip: boolean
  phase: BlueprintPhase
  delay?: number
}) {
  if (skip) {
    return <span className={className} aria-hidden />
  }
  return (
    <motion.span
      aria-hidden
      className={className}
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={phase === 'lines' ? blueprintLineTransition(delay) : { duration: 0 }}
      style={{ transformOrigin: 'top center', display: 'block' }}
    />
  )
}

/** Masked slide-up + slight rotation for serif headlines (Phase 2). */
export function BlueprintMaskedHeadline({
  children,
  phase,
  skip,
  className,
}: {
  children: ReactNode
  phase: BlueprintPhase
  skip: boolean
  className?: string
}) {
  if (skip) {
    return <div className={className}>{children}</div>
  }
  const show = phase === 'headlines' || phase === 'data' || phase === 'off'
  return (
    <div className={`overflow-hidden ${className ?? ''}`}>
      <motion.div
        initial={{ y: '100%', rotate: 2 }}
        animate={show ? { y: '0%', rotate: 0 } : { y: '100%', rotate: 2 }}
        transition={{ duration: BLUEPRINT_DURATION, ease: BLUEPRINT_EASE }}
      >
        {children}
      </motion.div>
    </div>
  )
}

/** Phase 3: monospace / meta “terminal” pop-in with global stagger index (0.05s steps). */
export function BlueprintDataPop({
  phase,
  skip,
  staggerIndex,
  className,
  lang,
  children,
}: {
  phase: BlueprintPhase
  skip: boolean
  staggerIndex: number
  className?: string
  /** Improves `hyphens-auto` dictionary hyphenation when set (e.g. `"en"`). */
  lang?: string
  children: ReactNode
}) {
  if (skip) {
    return (
      <span className={className} lang={lang}>
        {children}
      </span>
    )
  }
  const show = phase === 'data' || phase === 'off'
  return (
    <motion.span
      className={className}
      lang={lang}
      initial={{ opacity: 0, y: 6 }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
      transition={{ duration: 0.35, ease: BLUEPRINT_EASE, delay: staggerIndex * 0.05 }}
    >
      {children}
    </motion.span>
  )
}
