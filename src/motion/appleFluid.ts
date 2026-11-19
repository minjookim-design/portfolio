import type { Transition } from 'framer-motion'

/**
 * Apple Fluid Interface spring tokens (.cursorrules).
 * UIKit-style `response` + `damping` → Framer Motion stiffness/damping.
 *
 * ω = 2π / response
 * stiffness = ω²
 * damping = 2 · ζ · ω
 */
export function appleSpring(response: number, dampingRatio: number): Transition {
  const omega = (Math.PI * 2) / response
  return {
    type: 'spring',
    stiffness: omega * omega,
    damping: 2 * dampingRatio * omega,
    mass: 1,
  }
}

/** Translation / layout — no bounce. damping 1.0, response 0.4 */
export const APPLE_TRANSLATION_SPRING = appleSpring(0.4, 1)

/** Rotation — damping 0.8, response 0.4 */
export const APPLE_ROTATION_SPRING = appleSpring(0.4, 0.8)

/** Drawer / sheet — light resistance & settle. damping 0.8, response 0.3 */
export const APPLE_SHEET_SPRING = appleSpring(0.3, 0.8)

/** Physical enter scale — never scale(0). */
export const APPLE_SHEET_ENTER_SCALE = 0.95

/** Enter: system response — snappier than exit (asymmetric). */
export const APPLE_SHEET_ENTER: Transition = {
  ...appleSpring(0.28, 0.86),
}

/** Exit: intentional finish — slightly softer settle. */
export const APPLE_SHEET_EXIT: Transition = {
  ...appleSpring(0.32, 0.82),
}

/** Backdrop opacity — ease-out, sub-300ms. */
export const APPLE_BACKDROP_ENTER: Transition = {
  duration: 0.22,
  ease: [0.22, 1, 0.36, 1],
}

export const APPLE_BACKDROP_EXIT: Transition = {
  duration: 0.18,
  ease: [0.4, 0, 1, 1],
}
