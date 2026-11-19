import type { Transition, Variants } from 'framer-motion'
import {
  APPLE_SHEET_ENTER,
  APPLE_SHEET_ENTER_SCALE,
  APPLE_TRANSLATION_SPRING,
  appleSpring,
} from '../../motion/appleFluid'

/** ease-out for appear/disappear (rule 3). */
export const ERD_UI_EASE = [0.22, 1, 0.36, 1] as const

/** Sub-300ms UI motion (rule 4). */
export const ERD_UI_MS = 0.22
export const ERD_ENTER_MS = 0.28

export const ERD_UI_TWEEN: Transition = {
  duration: ERD_UI_MS,
  ease: ERD_UI_EASE,
}

export const ERD_ENTER_TWEEN: Transition = {
  duration: ERD_ENTER_MS,
  ease: ERD_UI_EASE,
}

/** Hero tile settle — translation spring (damping 1.0, response 0.4). */
export const ERD_HERO_TILE_TRANSITION: Transition = APPLE_TRANSLATION_SPRING

/** Popup sheet enter — sheet spring family + physical scale. */
export const ERD_SHEET_ENTER_SCALE = APPLE_SHEET_ENTER_SCALE
export const ERD_SHEET_ENTER_TRANSITION: Transition = APPLE_SHEET_ENTER
export const ERD_CHROME_ENTER_TRANSITION: Transition = appleSpring(0.22, 0.8)

/** Homepage archive entrance — transform/opacity only, ≤280ms, ease-out. */
export const erdNavEntranceVariants: Variants = {
  hidden: { opacity: 0, y: -16, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ...ERD_ENTER_TWEEN, delay: 0.06 },
  },
}

export const erdShopRowVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.04,
    },
  },
}

export const erdShopCardVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.04,
      when: 'beforeChildren',
    },
  },
}

/** Frame reveal via transform (GPU) instead of long clip-path tweens. */
export const erdShopCardMediaVariantsUp: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: ERD_ENTER_TWEEN,
  },
}

export const erdShopCardMediaVariantsDown: Variants = {
  hidden: { opacity: 0, y: -20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: ERD_ENTER_TWEEN,
  },
}

export const erdShopCardMediaRiseVariantsUp: Variants = {
  hidden: { y: '8%', scale: 1.04 },
  show: {
    y: '0%',
    scale: 1,
    transition: ERD_ENTER_TWEEN,
  },
}

export const erdShopCardMediaRiseVariantsDown: Variants = {
  hidden: { y: '-8%', scale: 1.04 },
  show: {
    y: '0%',
    scale: 1,
    transition: ERD_ENTER_TWEEN,
  },
}

export const erdShopCardLabelVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ...ERD_UI_TWEEN, delay: 0.04 },
  },
}

export const erdShopSquareVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: ERD_ENTER_TWEEN,
  },
}

export const erdShopSquareInnerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.04,
    },
  },
}

export const erdShopSquareTextVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: ERD_UI_TWEEN,
  },
}
