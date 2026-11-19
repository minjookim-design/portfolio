import type { Variants } from 'framer-motion'
import { appleSpring } from '../motion/appleFluid'

/**
 * Case-study hero / menu unfold — Apple translation spring (damping 1.0).
 * response 0.28 keeps perceived UI under the 300ms rule while staying in the
 * translation family (core token is 0.4; tightened for one-shot page chrome).
 */
export const HOME_ENTRANCE_SPRING = appleSpring(0.28, 1)

/** Scroll / carousel UI reveals — ease-out, sub-300ms, GPU-only. */
export const CASE_STUDY_UI_EASE = [0.22, 1, 0.36, 1] as const
export const CASE_STUDY_UI_TRANSITION = {
  duration: 0.22,
  ease: CASE_STUDY_UI_EASE,
} as const

/** Section focus — slightly longer but still under 300ms. */
export const CASE_STUDY_FOCUS_TRANSITION = {
  duration: 0.28,
  ease: CASE_STUDY_UI_EASE,
} as const

export function buildCaseStudyHeroEntranceVariants(reduceMotion: boolean): {
  heroContainer: Variants
  heroItem: Variants
} {
  const spring = reduceMotion ? ({ duration: 0 } as const) : HOME_ENTRANCE_SPRING
  return {
    heroContainer: {
      hidden: {},
      visible: {
        transition: {
          when: 'beforeChildren',
          delayChildren: reduceMotion ? 0 : 0.04,
          staggerChildren: reduceMotion ? 0 : 0.05,
        },
      },
    },
    heroItem: {
      // Physical appear: opacity + translate — never scale(0).
      hidden: { opacity: 0, x: reduceMotion ? 0 : -32 },
      visible: {
        opacity: 1,
        x: 0,
        transition: spring,
      },
    },
  }
}
