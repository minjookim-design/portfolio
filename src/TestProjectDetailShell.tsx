import type { CSSProperties, ReactNode, RefObject } from 'react'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useTestProjectSheetChrome } from './context/TestProjectSheetChromeContext'
import {
  MD_DETAIL_SHEET,
  MD_INK,
  MD_SHEET_EXPAND,
  MD_TOP_APP_BAR,
} from './testMd3Layout'

const EASE = [0.4, 0, 0.2, 1] as const
/** Scroll distance (px) to fully expand sheet → page. */
const EXPAND_SCROLL_PX = 160
/** Expand progress at which chrome treats the sheet as a full page. */
const FULL_PAGE_THRESHOLD = 0.85

/** Match SYSTEM_CORE chrome: hairline border + invert on hover. */
const BACK_CONTROL = 'pointer-events-auto system-core-button'

function CloseGlyph() {
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

type TestProjectDetailShellProps = {
  children: ReactNode
  scrollRef?: RefObject<HTMLDivElement | null>
  /** Accessible label for the back control */
  backLabel?: string
  /** Route for close / back (default: `/` homepage). */
  backTo?: string
  /** Extra classes on the expanding sheet (e.g. scroll-driven transitions). */
  sheetClassName?: string
  /** Inline styles on the expanding sheet (e.g. `--active-section-bg`). */
  sheetStyle?: CSSProperties
}

/**
 * Home-theme inset sheet → full-page detail on scroll.
 * Stage is transparent so `/` stays visible behind until the sheet expands.
 */
export function TestProjectDetailShell({
  children,
  scrollRef: scrollRefProp,
  backLabel = 'Back to home',
  backTo = '/',
  sheetClassName,
  sheetStyle,
}: TestProjectDetailShellProps) {
  const localScrollRef = useRef<HTMLDivElement>(null)
  const scrollRef = scrollRefProp ?? localScrollRef
  const reduceMotion = useReducedMotion()
  const sheetChrome = useTestProjectSheetChrome()
  const setSheetFullPage = sheetChrome?.setSheetFullPage

  const expandRaw = useMotionValue(0)
  const expand = useSpring(expandRaw, { stiffness: 140, damping: 28, mass: 0.85 })

  const marginX = useTransform(expand, [0, 1], [MD_SHEET_EXPAND.marginX, 0])
  const marginBottom = useTransform(expand, [0, 1], [MD_SHEET_EXPAND.marginBottom, 0])
  const marginTop = useTransform(expand, [0, 1], [MD_SHEET_EXPAND.marginTop, 0])
  const radius = MD_SHEET_EXPAND.radius
  const stageFade = useTransform(expand, [0, 1], [1, 0])

  useEffect(() => {
    expandRaw.set(0)
    setSheetFullPage?.(false)
    return () => {
      setSheetFullPage?.(null)
    }
  }, [expandRaw, setSheetFullPage])

  useEffect(() => {
    if (!reduceMotion) return
    expandRaw.set(1)
    setSheetFullPage?.(true)
  }, [reduceMotion, expandRaw, setSheetFullPage])

  useMotionValueEvent(expand, 'change', (value) => {
    setSheetFullPage?.(value >= FULL_PAGE_THRESHOLD)
  })

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-transparent text-white">
      {/* Soft scrim over the live homepage; clears as the sheet expands to full page. */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-black/45"
        style={{ opacity: stageFade }}
        aria-hidden
      />

      <div
        className={`pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center ${MD_TOP_APP_BAR}`}
      >
        <Link to={backTo} className={BACK_CONTROL} aria-label={backLabel}>
          <CloseGlyph />
        </Link>
      </div>

      <motion.div
        className={`theme-surface-transition relative flex min-h-0 flex-1 flex-col overflow-hidden @container/project-popup ${MD_INK} ${
          sheetClassName ?? MD_DETAIL_SHEET
        }`}
        style={{
          marginLeft: marginX,
          marginRight: marginX,
          marginBottom,
          marginTop,
          borderRadius: radius,
          ...sheetStyle,
        }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <div
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-y-auto scroll-smooth"
          onScroll={() => {
            if (reduceMotion) return
            const el = scrollRef.current
            if (!el) return
            expandRaw.set(Math.min(1, Math.max(0, el.scrollTop / EXPAND_SCROLL_PX)))
          }}
        >
          {children}
        </div>
      </motion.div>
    </div>
  )
}
