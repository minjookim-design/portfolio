import type { ReactNode } from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { IMAGE_SIZES, OptimizedImage } from './OptimizedImage'

const PREVIEW_ANCHOR_X = 22
const PREVIEW_ANCHOR_Y = 16
const HIDE_DELAY_MS = 95

const SPRING = { stiffness: 500, damping: 32, mass: 0.36 }
const SPRING_REDUCED = { stiffness: 8200, damping: 92, mass: 0.35 }

const VIDEO_RE = /\.(mp4|webm|mov)(\?|#|$)/i

function isRasterPreviewPath(src: string): boolean {
  if (!src || !String(src).trim()) return false
  return !VIDEO_RE.test(src)
}

export function useHomeFinePointer(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === 'undefined') return () => {}
      const mq = window.matchMedia('(pointer: fine)')
      mq.addEventListener('change', onStoreChange)
      return () => mq.removeEventListener('change', onStoreChange)
    },
    () => (typeof window !== 'undefined' ? window.matchMedia('(pointer: fine)').matches : false),
    () => false,
  )
}

type HoverPreviewApi = {
  startHover: (imageSrc: string, clientX: number, clientY: number) => void
  endHover: () => void
  /** Close preview immediately (e.g. when moving onto scroll-spy rows with no preview). */
  hideImmediately: () => void
}

const ProjectListHoverPreviewContext = createContext<HoverPreviewApi | null>(null)

export function useProjectListHoverPreviewOptional(): HoverPreviewApi | null {
  return useContext(ProjectListHoverPreviewContext)
}

export function ProjectListHoverPreviewProvider({
  enabled,
  reduceMotion,
  children,
}: {
  enabled: boolean
  reduceMotion: boolean
  children: ReactNode
}) {
  const [open, setOpen] = useState<{ src: string } | null>(null)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const baseX = useMotionValue(0)
  const baseY = useMotionValue(0)
  const springCfg = reduceMotion ? SPRING_REDUCED : SPRING
  const x = useSpring(baseX, springCfg)
  const y = useSpring(baseY, springCfg)

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current != null) {
      clearTimeout(hideTimerRef.current)
      hideTimerRef.current = null
    }
  }, [])

  const startHover = useCallback(
    (imageSrc: string, clientX: number, clientY: number) => {
      if (!enabled || !isRasterPreviewPath(imageSrc)) return
      clearHideTimer()
      const nx = clientX + PREVIEW_ANCHOR_X
      const ny = clientY + PREVIEW_ANCHOR_Y
      baseX.jump(nx)
      baseY.jump(ny)
      setOpen({ src: imageSrc })
    },
    [enabled, baseX, baseY, clearHideTimer],
  )

  const endHover = useCallback(() => {
    clearHideTimer()
    hideTimerRef.current = window.setTimeout(() => {
      hideTimerRef.current = null
      setOpen(null)
    }, HIDE_DELAY_MS)
  }, [clearHideTimer])

  const hideImmediately = useCallback(() => {
    clearHideTimer()
    setOpen(null)
  }, [clearHideTimer])

  useEffect(() => {
    if (!enabled) {
      clearHideTimer()
      setOpen(null)
    }
  }, [enabled, clearHideTimer])

  useEffect(() => {
    if (!open || !enabled) return
    const onMove = (e: PointerEvent) => {
      baseX.set(e.clientX + PREVIEW_ANCHOR_X)
      baseY.set(e.clientY + PREVIEW_ANCHOR_Y)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [open, enabled, baseX, baseY])

  useEffect(() => () => clearHideTimer(), [clearHideTimer])

  const ctx = useMemo<HoverPreviewApi>(
    () => ({
      startHover,
      endHover,
      hideImmediately,
    }),
    [startHover, endHover, hideImmediately],
  )

  const portalNode =
    enabled && typeof document !== 'undefined' ? (
      <AnimatePresence>
        {open ? (
          <motion.div
            key={open.src}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{
              duration: reduceMotion ? 0.1 : 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="pointer-events-none fixed z-[9980] w-[276px] max-w-[min(276px,calc(100vw-24px))] -translate-y-full rounded-none"
            style={{ left: x, top: y }}
            aria-hidden
          >
            <div className="overflow-hidden rounded-none bg-neutral-200 dark:bg-[#1f1f1f]">
              <div className="relative aspect-[16/10] w-full">
                <OptimizedImage
                  src={open.src}
                  alt=""
                  className="absolute inset-0 h-full w-full rounded-none object-cover"
                  sizes={IMAGE_SIZES.projectListHoverPreview}
                  placeholder="blur"
                />
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    ) : null

  return (
    <ProjectListHoverPreviewContext.Provider value={enabled ? ctx : null}>
      {children}
      {portalNode ? createPortal(portalNode, document.body) : null}
    </ProjectListHoverPreviewContext.Provider>
  )
}
