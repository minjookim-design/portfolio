import { useEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import hovrMarkdown from '../_content/hovr.md?raw'
import piikMarkdown from '../_content/Piik AI.md?raw'
import { enrichVaultBody, TestProjectBody, type ParsedVaultFields } from './TestProjectBody'
import { usePageTheme } from './context/PageThemeContext'
import { useTestProjectSheetChrome } from './context/TestProjectSheetChromeContext'
import {
  MD_CTA,
  MD_DETAIL_HEADER,
  MD_DETAIL_SHEET,
  MD_ICON_BUTTON,
  MD_INK,
  MD_PAGE_MARGIN,
  MD_SHAPE_LARGE,
  MD_SHEET_EXPAND,
  MD_TOP_APP_BAR,
  MD_TYPEFACE_CLASS,
} from './testMd3Layout'

const SUIT = "'SUIT Variable', sans-serif"
const EASE = [0.4, 0, 0.2, 1] as const
/** Scroll distance (px) to fully expand sheet → page. */
const EXPAND_SCROLL_PX = 160
/** Expand progress at which chrome treats the sheet as a full page. */
const FULL_PAGE_THRESHOLD = 0.85

const revealTransition = { duration: 0.55, ease: EASE }

export type TestProjectSheetItem = {
  id: string
  title: string
  path: string
  thumbnail: string
  /** Optional dark-mode gallery / hero asset (swapped via `dark:` or theme). */
  thumbnailDark?: string
  tags: readonly string[]
}

function parseVaultBody(raw: string): ParsedVaultFields | null {
  try {
    const trimmed = raw.trim()
    const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/u.exec(trimmed)
    if (!match) return null
    const [, frontmatter, body] = match
    const title = /^title:\s*(.+)$/m.exec(frontmatter)?.[1]?.trim() ?? ''
    const role = /^role:\s*(.+)$/m.exec(frontmatter)?.[1]?.trim() ?? ''
    return enrichVaultBody(title, role, body.trim())
  } catch {
    return null
  }
}

function vaultBodyForProject(id: string): ParsedVaultFields | null {
  if (id === 'hovr') return parseVaultBody(hovrMarkdown)
  if (id === 'piikai') return parseVaultBody(piikMarkdown)
  return null
}

function CloseGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  )
}

type TestProjectSheetProps = {
  project: TestProjectSheetItem
  nextProject: TestProjectSheetItem | null
  onClose: () => void
  onOpenNext: (id: string) => void
  children?: ReactNode
}

/**
 * Material 3 inset sheet → full-page detail. Typography unchanged.
 */
export function TestProjectSheet({
  project,
  nextProject,
  onClose,
  onOpenNext,
}: TestProjectSheetProps) {
  const vault = vaultBodyForProject(project.id)
  const scrollRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { isDark } = usePageTheme()
  const sheetChrome = useTestProjectSheetChrome()
  const setSheetFullPage = sheetChrome?.setSheetFullPage
  const stageThumb =
    isDark && project.thumbnailDark ? project.thumbnailDark : project.thumbnail

  const headerReveal = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: revealTransition,
      }

  const expandRaw = useMotionValue(0)
  const expand = useSpring(expandRaw, { stiffness: 140, damping: 28, mass: 0.85 })

  const marginX = useTransform(expand, [0, 1], [MD_SHEET_EXPAND.marginX, 0])
  const marginBottom = useTransform(expand, [0, 1], [MD_SHEET_EXPAND.marginBottom, 0])
  const marginTop = useTransform(expand, [0, 1], [MD_SHEET_EXPAND.marginTop, 0])
  /** Sharp sheet corners for the full expand. */
  const radius = MD_SHEET_EXPAND.radius
  const stageFade = useTransform(expand, [0, 1], [1, 0])
  const chromeBg = useTransform(
    expand,
    [0, 1],
    isDark
      ? ['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.1)']
      : ['rgba(255,255,255,0.12)', 'rgba(0,0,0,0.08)'],
  )
  const chromeFg = useTransform(expand, [0, 1], ['#ffffff', isDark ? '#f2f2f2' : '#000000'])
  const nextOpacity = useTransform(expand, [0, FULL_PAGE_THRESHOLD - 0.05, FULL_PAGE_THRESHOLD], [0, 0, 1])
  const nextPointerEvents = useTransform(expand, (v) =>
    v >= FULL_PAGE_THRESHOLD ? 'auto' : 'none',
  )

  useEffect(() => {
    expandRaw.set(0)
    setSheetFullPage?.(false)
    return () => {
      setSheetFullPage?.(null)
    }
  }, [project.id, expandRaw, setSheetFullPage])

  useMotionValueEvent(expand, 'change', (value) => {
    setSheetFullPage?.(value >= FULL_PAGE_THRESHOLD)
  })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <motion.div
      className={`fixed inset-0 z-[200] flex flex-col bg-black text-white ${MD_TYPEFACE_CLASS}`}
      style={{ fontFamily: SUIT }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: EASE }}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ opacity: stageFade }}
        aria-hidden
      >
        <img
          src={stageThumb}
          alt=""
          className="absolute inset-0 h-full w-full scale-[1.12] object-cover"
          style={{ filter: 'blur(4px)' }}
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/60" />
      </motion.div>

      <div
        className={`pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center ${MD_TOP_APP_BAR}`}
      >
        <motion.button
          type="button"
          onClick={onClose}
          className={`pointer-events-auto flex ${MD_ICON_BUTTON} cursor-pointer items-center justify-center ${MD_SHAPE_LARGE}`}
          style={{ backgroundColor: chromeBg, color: chromeFg }}
          aria-label="Close project"
        >
          <CloseGlyph />
        </motion.button>
      </div>

      {nextProject ? (
        <motion.button
          type="button"
          onClick={() => onOpenNext(nextProject.id)}
          className={`fixed top-1/2 right-[max(1rem,env(safe-area-inset-right,0px))] z-20 flex -translate-y-1/2 cursor-pointer items-center gap-2 ${MD_SHAPE_LARGE} px-3 py-2 text-[12px] font-semibold whitespace-nowrap`}
          style={{
            backgroundColor: chromeBg,
            color: chromeFg,
            opacity: nextOpacity,
            pointerEvents: nextPointerEvents,
          }}
        >
          <span className="opacity-70">Next</span>
          <span>{nextProject.title}</span>
        </motion.button>
      ) : null}

      <motion.div
        layoutId={`test-project-card-${project.id}`}
        className={`theme-surface-transition relative flex min-h-0 flex-1 flex-col overflow-hidden ${MD_INK} ${MD_DETAIL_SHEET}`}
        style={{
          marginLeft: marginX,
          marginRight: marginX,
          marginBottom,
          marginTop,
          borderRadius: radius,
        }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <div
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-y-auto"
          onScroll={() => {
            const el = scrollRef.current
            if (!el) return
            expandRaw.set(Math.min(1, Math.max(0, el.scrollTop / EXPAND_SCROLL_PX)))
          }}
        >
          {vault ? (
            <TestProjectBody
              title={vault.title}
              role={vault.role}
              subtitle={vault.subtitle}
              headline={vault.headline}
              tagline={vault.tagline}
              content={vault.content}
              scrollRoot={scrollRef}
              hero={
                project.thumbnailDark ? (
                  <motion.div
                    layoutId={`test-project-thumb-${project.id}`}
                    className="relative w-full overflow-hidden"
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="block min-h-[50vh] w-full object-cover dark:hidden md:min-h-[70vh]"
                      draggable={false}
                    />
                    <img
                      src={project.thumbnailDark}
                      alt=""
                      className="hidden min-h-[50vh] w-full object-cover dark:block md:min-h-[70vh]"
                      aria-hidden
                      draggable={false}
                    />
                  </motion.div>
                ) : (
                  <motion.img
                    layoutId={`test-project-thumb-${project.id}`}
                    src={project.thumbnail}
                    alt={project.title}
                    className="block min-h-[50vh] w-full object-cover md:min-h-[70vh]"
                    transition={{ duration: 0.45, ease: EASE }}
                  />
                )
              }
            />
          ) : (
            <>
              <header className={`${MD_PAGE_MARGIN} ${MD_DETAIL_HEADER}`}>
                <motion.h1
                  className="max-w-[10ch] text-[clamp(2.5rem,6.5vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.045em]"
                  {...headerReveal}
                >
                  {project.title}
                </motion.h1>
                <motion.div
                  className="sm:pt-1"
                  {...headerReveal}
                  transition={{ ...revealTransition, delay: 0.06 }}
                >
                  <p className="max-w-[32ch] text-lg font-medium leading-[1.12] tracking-[-0.018em] lg:text-2xl">
                    {project.tags.join(' · ')}
                  </p>
                  <Link
                    to={project.path}
                    className={`mt-8 inline-flex w-fit cursor-pointer ${MD_SHAPE_LARGE} ${MD_CTA} px-4 py-2.5 text-[14px] font-semibold transition-opacity hover:opacity-80`}
                  >
                    Open case study
                  </Link>
                </motion.div>
              </header>
              {project.thumbnailDark ? (
                <motion.div
                  layoutId={`test-project-thumb-${project.id}`}
                  className="relative w-full overflow-hidden"
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="block min-h-[50vh] w-full object-cover dark:hidden md:min-h-[70vh]"
                    draggable={false}
                  />
                  <img
                    src={project.thumbnailDark}
                    alt=""
                    className="hidden min-h-[50vh] w-full object-cover dark:block md:min-h-[70vh]"
                    aria-hidden
                    draggable={false}
                  />
                </motion.div>
              ) : (
                <motion.img
                  layoutId={`test-project-thumb-${project.id}`}
                  src={project.thumbnail}
                  alt={project.title}
                  className="block min-h-[50vh] w-full object-cover md:min-h-[70vh]"
                  transition={{ duration: 0.45, ease: EASE }}
                />
              )}
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

type TestProjectSheetLayerProps = {
  project: TestProjectSheetItem | null
  projects: readonly TestProjectSheetItem[]
  onClose: () => void
  onOpen: (id: string) => void
}

export function TestProjectSheetLayer({
  project,
  projects,
  onClose,
  onOpen,
}: TestProjectSheetLayerProps) {
  const index = project ? projects.findIndex((p) => p.id === project.id) : -1
  const nextProject =
    index >= 0 ? projects[(index + 1) % projects.length] ?? null : null

  return (
    <AnimatePresence mode="sync">
      {project ? (
        <TestProjectSheet
          key={project.id}
          project={project}
          nextProject={nextProject && nextProject.id !== project.id ? nextProject : null}
          onClose={onClose}
          onOpenNext={onOpen}
        />
      ) : null}
    </AnimatePresence>
  )
}
