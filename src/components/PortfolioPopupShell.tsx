import { useEffect, useState, type CSSProperties, type ReactNode, type Ref } from 'react'
import { motion, useReducedMotion, type Transition } from 'framer-motion'
import { MD_INK } from '../testMd3Layout'

export const CRT_GLITCH_MS = 140

/** Strong initial punch — snaps from here into place. */
export const POPUP_ENTER_SCALE = 0.7

/** Magnetic snap — high stiffness, tight chewy bounce, zero lag. */
export const POPUP_ENTER_TRANSITION: Transition = {
  scale: {
    type: 'spring',
    stiffness: 750,
    damping: 35,
    mass: 0.75,
    velocity: 8,
  },
  opacity: {
    duration: 0.09,
    ease: [0.65, 0, 0.35, 1],
  },
}

export const POPUP_EXIT_TRANSITION: Transition = {
  scale: {
    type: 'spring',
    stiffness: 820,
    damping: 38,
    mass: 0.7,
  },
  opacity: { duration: 0.08, ease: [0.4, 0, 1, 1] },
}

/** @deprecated Use POPUP_ENTER_TRANSITION */
export const CRT_OPEN_TRANSITION: Transition = POPUP_ENTER_TRANSITION

/** @deprecated Use POPUP_EXIT_TRANSITION */
export const CRT_CLOSE_TRANSITION: Transition = POPUP_EXIT_TRANSITION

export const PORTFOLIO_POPUP_SHELL_CLASS = `relative flex flex-col box-border shrink-0 overflow-hidden rounded-none border-[0.5px] border-[color:var(--color-blueprint-hairline)] bg-[var(--color-bg-base,#faf7f0)] ${MD_INK}`

export const PORTFOLIO_POPUP_CLOSE_BUTTON_CLASS =
  'group relative box-border grid h-[calc(var(--portfolio-chrome-control-size)*0.8)] min-h-[calc(var(--portfolio-chrome-control-size)*0.8)] w-[calc(var(--portfolio-chrome-control-size)*0.8)] min-w-[calc(var(--portfolio-chrome-control-size)*0.8)] shrink-0 place-items-center rounded-none border border-red-600 bg-red-600 p-[1.65px] text-white outline-none transition-colors hover:border-red-800 hover:bg-red-800 hover:text-white focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-red-600/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf7f0] dark:border-red-500 dark:bg-red-600 dark:text-white dark:hover:border-red-900 dark:hover:bg-red-900 dark:focus-visible:ring-red-500/50 dark:focus-visible:ring-offset-[#111111]'

export const PORTFOLIO_POPUP_HOME_SUIT = "font-['SUIT_Variable',sans-serif]"

export const PORTFOLIO_POPUP_SECTION_TITLE_CLASS = `${PORTFOLIO_POPUP_HOME_SUIT} mb-[0.35em] font-extrabold uppercase tracking-[-0.02em] leading-[1.15] text-black dark:text-white`

export const PORTFOLIO_POPUP_LABEL_CLASS = `${PORTFOLIO_POPUP_HOME_SUIT} font-medium uppercase tracking-[-0.02em] leading-[1.15]`

const GALLERY_LABEL_SIZE_RATIO = 0.042

export function portfolioPopupLabelStyle(): CSSProperties {
  return {
    fontSize: `clamp(8px, calc(var(--gallery-cell-h, 10rem) * ${GALLERY_LABEL_SIZE_RATIO}), 12px)`,
  }
}

export function PortfolioPopupCloseGlyph() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
    >
      <path
        d="M2 14H0V12H2V14ZM14 14H12V12H14V14ZM4 10V12H2V10H4ZM12 12H10V10H12V12ZM6 10H4V8H6V10ZM10 10H8V8H10V10ZM8 8H6V6H8V8ZM6 6H4V4H6V6ZM10 6H8V4H10V6ZM4 4H2V2H4V4ZM12 4H10V2H12V4ZM2 2H0V0H2V2ZM14 2H12V0H14V2Z"
        fill="currentColor"
      />
    </svg>
  )
}

function PortfolioPopupCrtGlitchOverlay({ show }: { show: boolean }) {
  if (!show) return null

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-[4] overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: CRT_GLITCH_MS / 1000, ease: 'easeOut' }}
      aria-hidden
    >
      <div className="portfolio-popup-crt-scanlines absolute inset-0" />
      <motion.div
        className="portfolio-popup-crt-static absolute inset-0"
        initial={{ opacity: 0.42, x: 0 }}
        animate={{
          opacity: [0.42, 0.58, 0.28, 0.5, 0],
          x: [0, -4, 5, -2, 0],
        }}
        transition={{ duration: 0.26, times: [0, 0.22, 0.48, 0.72, 1], ease: 'linear' }}
      />
      <motion.div
        className="portfolio-popup-crt-sweep absolute inset-x-0 h-[2px] bg-white/80 mix-blend-screen"
        initial={{ top: '-4%' }}
        animate={{ top: ['-4%', '42%', '108%'] }}
        transition={{ duration: 0.24, ease: 'linear' }}
      />
    </motion.div>
  )
}

function usePortfolioPopupCrtMotion() {
  const reduceMotion = useReducedMotion()
  const [glitchOn, setGlitchOn] = useState(() => !reduceMotion)

  useEffect(() => {
    if (reduceMotion) {
      setGlitchOn(false)
      return
    }
    setGlitchOn(true)
    const timer = window.setTimeout(() => setGlitchOn(false), CRT_GLITCH_MS)
    return () => window.clearTimeout(timer)
  }, [reduceMotion])

  const crtInitial = reduceMotion
    ? { scale: 1, opacity: 1 }
    : { scale: POPUP_ENTER_SCALE, opacity: 0 }

  const crtAnimate = { scale: 1, opacity: 1 }

  const crtExit = reduceMotion
    ? { scale: 1, opacity: 0, transition: { duration: 0.12 } }
    : {
        scale: 0.9,
        opacity: 0,
        transition: POPUP_EXIT_TRANSITION,
      }

  return {
    reduceMotion,
    glitchOn,
    crtInitial,
    crtAnimate,
    crtExit,
    transition: reduceMotion ? ({ duration: 0.12 } as const) : POPUP_ENTER_TRANSITION,
  }
}

const PORTFOLIO_POPUP_TITLE_BAR_BASE =
  'relative z-[2] flex h-[var(--portfolio-chrome-control-size)] shrink-0 items-center justify-between border-b-[0.5px] border-[color:var(--color-blueprint-hairline)] pl-2 pr-1'

const PORTFOLIO_POPUP_TITLE_BAR_SURFACE = 'bg-[#C0C0C0] dark:bg-[#3A3838]'

const PORTFOLIO_POPUP_TITLE_BAR_LABEL_TYPE = `${PORTFOLIO_POPUP_HOME_SUIT} text-[9px] font-black uppercase leading-none tracking-[0.08em]`

const PORTFOLIO_POPUP_TITLE_BAR_LABEL_COLOR = 'text-black dark:text-[#f2f2f2]'

export function PortfolioPopupTitleBar({
  title,
  onClose,
  className,
  titleClassName,
}: {
  title: string
  onClose: () => void
  className?: string
  titleClassName?: string
}) {
  return (
    <div
      className={[PORTFOLIO_POPUP_TITLE_BAR_BASE, className ?? PORTFOLIO_POPUP_TITLE_BAR_SURFACE]
        .filter(Boolean)
        .join(' ')}
    >
      <span
        className={[
          `truncate ${PORTFOLIO_POPUP_TITLE_BAR_LABEL_TYPE}`,
          titleClassName ?? PORTFOLIO_POPUP_TITLE_BAR_LABEL_COLOR,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {title}
      </span>
      <button type="button" className={PORTFOLIO_POPUP_CLOSE_BUTTON_CLASS} onClick={onClose} aria-label="Close">
        <span className="pointer-events-none leading-none" aria-hidden>
          <PortfolioPopupCloseGlyph />
        </span>
      </button>
    </div>
  )
}

export function PortfolioPopupPanel({
  title,
  onClose,
  children,
  className,
  style,
  panelRef,
  originClass = 'origin-bottom-right',
  contentClassName,
  'aria-labelledby': ariaLabelledBy,
}: {
  title: string
  onClose: () => void
  children: ReactNode
  className?: string
  style?: CSSProperties
  panelRef?: Ref<HTMLDivElement>
  originClass?: string
  contentClassName?: string
  'aria-labelledby'?: string
}) {
  const { glitchOn, crtInitial, crtAnimate, crtExit, transition } = usePortfolioPopupCrtMotion()

  return (
    <motion.div
      ref={panelRef}
      data-portfolio-popup
      className={[PORTFOLIO_POPUP_SHELL_CLASS, originClass, className].filter(Boolean).join(' ')}
      style={style}
      initial={crtInitial}
      animate={crtAnimate}
      exit={crtExit}
      transition={transition}
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledBy}
    >
      <PortfolioPopupCrtGlitchOverlay show={glitchOn} />
      <PortfolioPopupTitleBar title={title} onClose={onClose} />
      <div
        className={[
          'relative z-[1] flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4 py-4 sm:px-5 sm:py-5',
          contentClassName,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </div>
    </motion.div>
  )
}
