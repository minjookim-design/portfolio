import {
  type ReactNode,
  type CSSProperties,
} from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { usePageTheme } from '../../context/PageThemeContext'
import {
  ERD_ENTER_TWEEN,
  ERD_UI_EASE,
  ERD_UI_MS,
} from '../testHome3/erdMotion'
import '../testHomePage3.css'
import './erdDeck.css'
/** Shared Univers type classes for deck slides (sizes in erdDeck.css = home scale). */
export const ERD_DECK_DISPLAY = 'erd-deck-type-display'
export const ERD_DECK_DISPLAY_XL = 'erd-deck-type-display-xl'
export const ERD_DECK_TITLE = 'erd-deck-type-title'
export const ERD_DECK_SUBHEAD = 'erd-deck-type-subhead'
export const ERD_DECK_BODY = 'erd-deck-type-body'
export const ERD_DECK_META = 'erd-deck-type-meta'
export const ERD_DECK_OVERLINE = 'erd-deck-type-overline'
export const ERD_DECK_LABEL = 'erd-deck-type-label'
export const ERD_DECK_CAPTION = 'erd-deck-type-caption'

/** @deprecated use ERD_DECK_DISPLAY — kept for call sites */
export const ERD_DECK_DISPLAY_SIZE = ERD_DECK_DISPLAY
/** @deprecated use ERD_DECK_DISPLAY_XL */
export const ERD_DECK_DISPLAY_XL_SIZE = ERD_DECK_DISPLAY_XL

const SLIDE_TRANSITION = {
  duration: ERD_UI_MS,
  ease: ERD_UI_EASE,
} as const

export function ErdDeckFadeUp({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const reduceMotion = useReducedMotion()
  if (reduceMotion) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...ERD_ENTER_TWEEN, delay }}
      style={{ transformOrigin: 'var(--transform-origin, center center)' }}
    >
      {children}
    </motion.div>
  )
}

export function ErdDeckSlideChrome({
  children,
  footer,
  className = '',
  style,
  hero = false,
}: {
  children: ReactNode
  footer?: ReactNode
  className?: string
  style?: CSSProperties
  /** Flush body + project-hero layout (matches `/hovr` ErdHovrHero). */
  hero?: boolean
}) {
  return (
    <div
      className={`erd-deck-slide${hero ? ' erd-deck-slide--hero' : ''}${className ? ` ${className}` : ''}`}
      style={style}
    >
      <div className="erd-deck-slide-header">
        <div className="erd-deck-slide-header-meta">
          <p>Minjoo Kim</p>
          <p>2026</p>
          <p>Portfolio project</p>
        </div>
      </div>
      <div className="erd-deck-slide-body">{children}</div>
      {footer ? <div className="erd-deck-slide-footer">{footer}</div> : null}
    </div>
  )
}

/** Same pill markup/classes as project-page `ErdScrollSpyPill` (inline sticky placement). */
export function ErdDeckPhaseNav({
  phases,
  active,
  onDark = false,
  ariaLabel = 'Phase',
}: {
  phases: readonly string[]
  active: number
  /** Dark slide surface — omit `is-light-surface` (matches HOVR spy). */
  onDark?: boolean
  ariaLabel?: string
}) {
  return (
    <div
      className={`erd-scroll-spy-stack${onDark ? '' : ' is-light-surface'}`}
      role="tablist"
      aria-label={ariaLabel}
    >
      {phases.map((label, i) => {
        const isActive = i === active
        return (
          <div
            key={label}
            className={`erd-scroll-spy-item-pill${isActive ? ' is-active' : ''}`}
          >
            <button
              type="button"
              role="tab"
              aria-selected={isActive}
              title={label}
              className="erd-scroll-spy-item-pill-btn"
              tabIndex={-1}
            >
              <span className="break-words">{label.toUpperCase()}</span>
            </button>
          </div>
        )
      })}
    </div>
  )
}

export type ErdDeckTab = {
  id: string
  label: string
  href?: string
  active?: boolean
  onSelect?: () => void
}

type ErdDeckShellProps = {
  tabs: ErdDeckTab[]
  counter: string
  canPrev: boolean
  canNext: boolean
  onPrev: () => void
  onNext: () => void
  dots?: { id: string; label: string; active: boolean; onSelect: () => void }[]
  stageStyle?: CSSProperties
  children: ReactNode
  slideKey: string
  direction?: number
  onTouchStart?: (e: React.TouchEvent) => void
  onTouchEnd?: (e: React.TouchEvent) => void
}

export function ErdDeckShell({
  tabs,
  counter,
  canPrev,
  canNext,
  onPrev,
  onNext,
  dots,
  stageStyle,
  children,
  slideKey,
  direction = 1,
  onTouchStart,
  onTouchEnd,
}: ErdDeckShellProps) {
  const { isDark } = usePageTheme()
  const reduceMotion = useReducedMotion()

  const variants = reduceMotion
    ? { enter: { opacity: 1 }, center: { opacity: 1 }, exit: { opacity: 1 } }
    : {
        enter: (dir: number) => ({
          opacity: 0,
          x: dir > 0 ? 24 : -24,
          scale: 0.95,
        }),
        center: { opacity: 1, x: 0, scale: 1 },
        exit: (dir: number) => ({
          opacity: 0,
          x: dir > 0 ? -16 : 16,
          scale: 0.98,
        }),
      }

  return (
    <div
      className={`erd-site erd-deck${isDark ? ' erd-site--dark' : ''}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <header className="erd-deck-header">
        <nav className="erd-nav-pill erd-deck-nav-pill" aria-label="Deck">
          {tabs.map((tab) => {
            const className = `erd-nav-pill-link${tab.active ? ' is-active' : ''}`
            if (tab.href) {
              return (
                <Link
                  key={tab.id}
                  to={tab.href}
                  aria-current={tab.active ? 'page' : undefined}
                  className={className}
                >
                  {tab.label}
                </Link>
              )
            }
            return (
              <button
                key={tab.id}
                type="button"
                aria-current={tab.active ? 'page' : undefined}
                className={className}
                onClick={tab.onSelect}
              >
                {tab.label}
              </button>
            )
          })}
        </nav>
        <p className="erd-deck-counter">{counter}</p>
      </header>

      <main className="erd-deck-main">
        <div className="erd-deck-stage" style={stageStyle}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={slideKey}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={reduceMotion ? { duration: 0 } : SLIDE_TRANSITION}
              className="absolute inset-0 p-3 sm:p-4"
              style={{ transformOrigin: 'var(--transform-origin, center center)' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <footer className="erd-deck-footer">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canPrev}
          className="erd-nav-pill erd-deck-control-pill"
          aria-label="Previous slide"
        >
          <span className="erd-nav-pill-link">Prev</span>
        </button>

        {dots && dots.length > 0 ? (
          <div className="erd-deck-dots" role="tablist" aria-label="Slides">
            {dots.map((dot) => (
              <button
                key={dot.id}
                type="button"
                aria-label={`Go to slide: ${dot.label}`}
                aria-current={dot.active ? 'true' : undefined}
                onClick={dot.onSelect}
                className={`erd-deck-dot${dot.active ? ' is-active' : ''}`}
              />
            ))}
          </div>
        ) : (
          <span />
        )}

        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          className="erd-nav-pill erd-deck-control-pill"
          aria-label="Next slide"
        >
          <span className="erd-nav-pill-link">Next</span>
        </button>
      </footer>
    </div>
  )
}
