import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { DRAFT_COLUMN_RESIZE_ATTR } from '../constants/draftingCursorDom'
import { ZOOMABLE_IMAGE_CLASS } from '../constants/zoomableImage'
import { useHomeFinePointer } from './ProjectListHoverPreview'
import { useDraftingCursor } from '../context/DraftingCursorContext'

const MECH = { duration: 0.22, ease: [0.76, 0, 0.24, 1] as const }

/** Snappy spring shared by full-screen lines and hub (one motion source → consistent CAD feel). */
const SPRING = { stiffness: 2400, damping: 58, mass: 0.18 }

const RESIZE_CURSORS = new Set([
  'col-resize',
  'row-resize',
  'ew-resize',
  'ns-resize',
  'nwse-resize',
  'nesw-resize',
])

/**
 * Last known mouse client position, updated as early as possible (capture on `window`)
 * so we can sync motion values on mount instead of leaving the cursor stuck at (0, 0).
 */
const LAST_CLIENT_MOUSE = { x: 0, y: 0 }

if (typeof window !== 'undefined') {
  window.addEventListener(
    'mousemove',
    (e: MouseEvent) => {
      LAST_CLIENT_MOUSE.x = e.clientX
      LAST_CLIENT_MOUSE.y = e.clientY
    },
    { passive: true, capture: true },
  )
}

function elementIsZoomableTarget(el: Element | null): boolean {
  let n: Element | null = el
  for (let depth = 0; n && n !== document.documentElement && depth < 48; depth++, n = n.parentElement) {
    if (!(n instanceof HTMLElement)) continue
    if (n.dataset.zoomable === 'true') return true
    if (n.classList.contains(ZOOMABLE_IMAGE_CLASS)) return true
    if (n.classList.contains('cursor-zoom-in')) return true
    if (n.style.cursor === 'zoom-in') return true
    if (getComputedStyle(n).cursor === 'zoom-in') return true
  }
  return false
}

function elementIsResizeHandle(el: Element | null): boolean {
  let n: Element | null = el
  for (let depth = 0; n && n !== document.documentElement && depth < 48; depth++, n = n.parentElement) {
    if (!(n instanceof HTMLElement)) continue
    if (n.hasAttribute(DRAFT_COLUMN_RESIZE_ATTR)) return true
    if (n.getAttribute('role') === 'separator') {
      const label = (n.getAttribute('aria-label') ?? '').toLowerCase()
      if (label.includes('resize')) return true
    }
    if (
      n.classList.contains('cursor-col-resize') ||
      n.classList.contains('cursor-row-resize') ||
      n.classList.contains('cursor-ew-resize') ||
      n.classList.contains('cursor-ns-resize')
    ) {
      return true
    }
    const cur = getComputedStyle(n).cursor
    if (RESIZE_CURSORS.has(cur)) return true
  }
  return false
}

type CenterKey = 'default' | 'zoom' | 'resize' | 'view'

/** Full-screen CAD drafting crosshair + hub label (fine pointer only). */
export function DraftingCursor() {
  const finePointer = useHomeFinePointer()
  const { mode } = useDraftingCursor()

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, SPRING)
  const sy = useSpring(y, SPRING)

  const [zoomHit, setZoomHit] = useState(false)
  const [resizeHit, setResizeHit] = useState(false)
  const pointerFlushRafRef = useRef(0)
  const pointerPendingRef = useRef({ x: 0, y: 0 })

  /** `ZOOM` > `RESIZE` > `VIEW` > default (CAD lines). */
  const centerKey: CenterKey = zoomHit
    ? 'zoom'
    : resizeHit
      ? 'resize'
      : mode === 'project-hover'
        ? 'view'
        : 'default'

  useLayoutEffect(() => {
    if (!finePointer) return
    const lx = LAST_CLIENT_MOUSE.x
    const ly = LAST_CLIENT_MOUSE.y
    x.set(lx)
    y.set(ly)
    const hit = document.elementFromPoint(lx, ly)
    setZoomHit(elementIsZoomableTarget(hit))
    setResizeHit(elementIsResizeHandle(hit))
  }, [finePointer, x, y])

  useEffect(() => {
    if (!finePointer) return

    const flushPointerHits = () => {
      pointerFlushRafRef.current = 0
      const { x: px, y: py } = pointerPendingRef.current
      const hit = document.elementFromPoint(px, py)
      const z = elementIsZoomableTarget(hit)
      const r = elementIsResizeHandle(hit)
      setZoomHit((prev) => (prev === z ? prev : z))
      setResizeHit((prev) => (prev === r ? prev : r))
    }

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      pointerPendingRef.current = { x: e.clientX, y: e.clientY }
      if (pointerFlushRafRef.current === 0) {
        pointerFlushRafRef.current = requestAnimationFrame(flushPointerHits)
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (pointerFlushRafRef.current !== 0) {
        cancelAnimationFrame(pointerFlushRafRef.current)
        pointerFlushRafRef.current = 0
      }
    }
  }, [finePointer, x, y])

  useEffect(() => {
    if (!finePointer) return
    document.documentElement.classList.add('drafting-cursor-active')
    return () => document.documentElement.classList.remove('drafting-cursor-active')
  }, [finePointer])

  if (!finePointer || typeof document === 'undefined' || document.body == null) {
    return null
  }

  /** Hub layout (colour per state). */
  const hubLabelBaseClass =
    'flex h-6 shrink-0 select-none items-center justify-center whitespace-nowrap font-mono font-medium leading-none tracking-wide w-auto min-w-0 px-2 text-[10px]'

  const hubZoomResizeClass = `${hubLabelBaseClass} text-black dark:text-white`
  const hubViewClass = `${hubLabelBaseClass} text-white dark:text-black`

  /** Thinner than home column rules (`0.5px`); colour matches `TestHomePage` column borders. */
  const lineHairline = { width: '0.25px', height: '0.25px' } as const

  const lineColourClass = 'bg-black/[0.18] dark:bg-white/[0.14]'

  const showCadLines = centerKey === 'default'

  const cursor = (
    <div className="drafting-cursor-root" aria-hidden>
      {showCadLines ? (
        <>
          <motion.div
            className={`fixed left-0 top-0 z-[1] rounded-none will-change-transform ${lineColourClass}`}
            style={{ x: sx, width: lineHairline.width, height: '100vh' }}
          />
          <motion.div
            className={`fixed left-0 top-0 z-[1] w-[100vw] rounded-none will-change-transform ${lineColourClass}`}
            style={{ y: sy, height: lineHairline.height }}
          />
        </>
      ) : null}
      {centerKey !== 'default' ? (
        <motion.div
          className="pointer-events-none fixed left-0 top-0 z-[2] size-0 overflow-visible rounded-none will-change-transform"
          /* Raw motion values: hub must sit on the real pointer (springs on `sx`/`sy` lag — obvious on resize drags). */
          style={{ x, y }}
        >
          <div className="-translate-x-1/2 -translate-y-1/2 overflow-visible">
            <AnimatePresence initial={false} mode="wait">
              {centerKey === 'zoom' ? (
                <motion.div
                  key="zoom"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={MECH}
                  className={hubZoomResizeClass}
                >
                  [ ZOOM ]
                </motion.div>
              ) : centerKey === 'resize' ? (
                <motion.div
                  key="resize"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={MECH}
                  className={hubZoomResizeClass}
                >
                  [ RESIZE ]
                </motion.div>
              ) : (
                <motion.div
                  key="view"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={MECH}
                  className={hubViewClass}
                >
                  [ VIEW ]
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      ) : null}
    </div>
  )

  return createPortal(cursor, document.body)
}

/** @alias Same as {@link DraftingCursor} — matches common `<Cursor />` naming. */
export const Cursor = DraftingCursor
