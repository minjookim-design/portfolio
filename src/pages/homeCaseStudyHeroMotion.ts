import type { Variants } from 'framer-motion'

/** Shared spring: menu snap, unfold, HOVR/Piik hero stagger. */
export const HOME_ENTRANCE_SPRING = {
  type: 'spring' as const,
  stiffness: 120,
  damping: 18,
}

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
          delayChildren: reduceMotion ? 0 : 0.06,
          staggerChildren: reduceMotion ? 0 : 0.065,
        },
      },
    },
    heroItem: {
      hidden: { opacity: 0, x: reduceMotion ? 0 : -48 },
      visible: {
        opacity: 1,
        x: 0,
        transition: spring,
      },
    },
  }
}
