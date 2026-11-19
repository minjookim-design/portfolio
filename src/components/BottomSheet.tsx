import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type PanInfo,
} from 'framer-motion'
import {
  APPLE_SHEET_ENTER,
  APPLE_SHEET_EXIT,
  APPLE_SHEET_SPRING,
} from '../motion/appleFluid'

const DISMISS_DISTANCE_RATIO = 0.22
const DISMISS_VELOCITY = 900
const DISMISS_SOFT_VELOCITY = 280
const DISMISS_SOFT_DISTANCE_RATIO = 0.1
/** Rubber-band resistance when dragging above the open rest position. */
const OVERDRAG_RESISTANCE = 0.28

export type BottomSheetProps = {
  open: boolean
  onClose: () => void
  children: ReactNode
  /** Accessible title for the dialog. */
  title?: string
  /** Optional leading content in the grabber row (e.g. custom title node). */
  header?: ReactNode
  className?: string
  style?: CSSProperties
  /** Max height of the sheet panel. Default `min(92dvh, 40rem)`. */
  maxHeight?: string
  /** Called after exit motion finishes and the portal unmounts. */
  onExitComplete?: () => void
}

/**
 * Apple Fluid bottom sheet — drag to dismiss; fling carries inertia into the close.
 * Only `transform` + `opacity` are animated. Motion values keep gestures interruptible.
 */
export function BottomSheet({
  open,
  onClose,
  children,
  title = 'Sheet',
  header,
  className,
  style,
  maxHeight = 'min(92dvh, 40rem)',
  onExitComplete,
}: BottomSheetProps) {
  const reduceMotion = useReducedMotion()
  const titleId = useId()
  const sheetRef = useRef<HTMLDivElement>(null)
  const closingRef = useRef(false)
  const openRef = useRef(open)
  openRef.current = open

  /** Keep portal mounted through the exit spring. */
  const [present, setPresent] = useState(open)

  const y = useMotionValue(0)
  const sheetScale = useMotionValue(1)
  const sheetHeightRef = useRef(480)

  const backdropOpacity = useTransform(y, (value) => {
    const h = Math.max(sheetHeightRef.current, 1)
    const progress = Math.min(1, Math.max(0, value / h))
    return 0.48 * (1 - progress)
  })

  const measure = useCallback(() => {
    const el = sheetRef.current
    if (!el) return 0
    const height = el.getBoundingClientRect().height
    sheetHeightRef.current = height
    return height
  }, [])

  const finishClose = useCallback(() => {
    setPresent(false)
    closingRef.current = false
    onExitComplete?.()
    // Notify parent only when they still consider the sheet open (gesture / backdrop / Escape).
    if (openRef.current) onClose()
  }, [onClose, onExitComplete])

  const dismiss = useCallback(
    async (velocity = 0) => {
      if (closingRef.current) return
      closingRef.current = true
      const height = measure() || sheetHeightRef.current
      const target = height + 48

      if (reduceMotion) {
        y.set(target)
        finishClose()
        return
      }

      // Carry fling velocity into the exit spring (inertia → settle off-screen).
      await Promise.all([
        animate(y, target, {
          ...APPLE_SHEET_EXIT,
          velocity: Math.max(velocity, 0),
        }),
        animate(sheetScale, 0.98, APPLE_SHEET_EXIT),
      ])
      finishClose()
    },
    [finishClose, measure, reduceMotion, sheetScale, y],
  )

  const settleOpen = useCallback(
    (velocity = 0) => {
      closingRef.current = false
      return Promise.all([
        animate(y, 0, {
          ...(reduceMotion ? { type: 'tween' as const, duration: 0.01 } : APPLE_SHEET_SPRING),
          velocity,
        }),
        animate(sheetScale, 1, APPLE_SHEET_SPRING),
      ])
    },
    [reduceMotion, sheetScale, y],
  )

  // Mount + enter when `open` becomes true.
  useLayoutEffect(() => {
    if (!open) return
    setPresent(true)
    closingRef.current = false

    const id = requestAnimationFrame(() => {
      const height = measure() || window.innerHeight * 0.7
      if (reduceMotion) {
        y.set(0)
        sheetScale.set(1)
        return
      }
      // From below + slight underscale — never scale(0).
      y.set(height)
      sheetScale.set(0.98)
      void animate(y, 0, APPLE_SHEET_ENTER)
      void animate(sheetScale, 1, APPLE_SHEET_ENTER)
    })
    return () => cancelAnimationFrame(id)
  }, [open, measure, reduceMotion, sheetScale, y])

  // Parent closed via `open={false}` — run exit if still on screen.
  useEffect(() => {
    if (open || !present || closingRef.current) return
    void dismiss(0)
  }, [open, present, dismiss])

  useEffect(() => {
    if (!present) return
    const el = sheetRef.current
    if (!el) return
    const ro = new ResizeObserver(() => measure())
    ro.observe(el)
    return () => ro.disconnect()
  }, [present, measure])

  useEffect(() => {
    if (!present) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [present])

  useEffect(() => {
    if (!present) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') void dismiss(0)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [present, dismiss])

  const onDrag = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.y < 0) {
        y.set(info.offset.y * OVERDRAG_RESISTANCE)
      }
    },
    [y],
  )

  const onDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const h = Math.max(sheetHeightRef.current, 1)
      const offsetY = Math.max(0, info.offset.y)
      const velocityY = info.velocity.y
      // Projected end if the fling continued — Apple-style inertia preview.
      const projected = offsetY + velocityY * 0.18
      const shouldDismiss =
        velocityY > DISMISS_VELOCITY ||
        offsetY > h * DISMISS_DISTANCE_RATIO ||
        (velocityY > DISMISS_SOFT_VELOCITY && offsetY > h * DISMISS_SOFT_DISTANCE_RATIO) ||
        projected > h * DISMISS_DISTANCE_RATIO

      if (shouldDismiss) {
        void dismiss(velocityY)
      } else {
        void settleOpen(velocityY)
      }
    },
    [dismiss, settleOpen],
  )

  const handleBackdropPointerDown = useCallback(
    (e: ReactPointerEvent) => {
      if (e.target !== e.currentTarget) return
      void dismiss(0)
    },
    [dismiss],
  )

  if (typeof document === 'undefined' || !present) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[var(--portfolio-popup-z,100001)] flex items-end justify-center"
      style={{ touchAction: 'none' }}
    >
      <motion.button
        type="button"
        aria-label="Dismiss"
        className="absolute inset-0 cursor-default border-0 bg-black p-0"
        style={{
          opacity: reduceMotion ? 0.48 : backdropOpacity,
          transformOrigin: 'var(--transform-origin, center)',
        }}
        onPointerDown={handleBackdropPointerDown}
      />

      <motion.div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={[
          'relative z-[1] flex w-full max-w-[40rem] flex-col overflow-hidden rounded-t-[1.25rem]',
          'bg-[var(--color-bg-base,#faf7f0)] text-black shadow-[0_-0.5rem_2.5rem_rgb(0_0_0_/_18%)]',
          'dark:bg-[#161616] dark:text-[#f2f2f2] dark:shadow-[0_-0.5rem_2.5rem_rgb(0_0_0_/_45%)]',
          className ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
        style={{
          y,
          scale: sheetScale,
          maxHeight,
          transformOrigin: 'var(--transform-origin, center bottom)',
          fontOpticalSizing: 'auto',
          ...style,
        }}
        drag={reduceMotion ? false : 'y'}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.12, bottom: 0.55 }}
        dragMomentum={false}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
      >
        <div className="flex shrink-0 flex-col items-center pt-[0.625rem]">
          <div
            className="h-[0.3125rem] w-[2.25rem] rounded-full bg-black/20 dark:bg-white/25"
            aria-hidden
          />
          <div className="flex w-full items-center justify-between gap-[0.75rem] px-[1.25rem] pb-[0.5rem] pt-[0.75rem]">
            <h2
              id={titleId}
              className="min-w-0 flex-1 truncate text-[1.0625rem] font-semibold leading-[1.2] tracking-[-0.02em]"
            >
              {header ?? title}
            </h2>
            <button
              type="button"
              className="shrink-0 rounded-full px-[0.75rem] py-[0.375rem] text-[0.8125rem] font-medium tracking-[0] text-black/55 transition-[opacity] duration-150 ease-out hover:opacity-70 dark:text-white/55"
              onClick={() => void dismiss(0)}
            >
              Close
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-[1.25rem] pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))]">
          {children}
        </div>
      </motion.div>
    </div>,
    document.body,
  )
}
