import { useCallback, useEffect, useRef, useState } from 'react'
import { HOVR_SECTIONS } from './HovrProjectPage'
import { PIIK_SECTIONS, PiikCaseStudyCarouselBlock } from './PiikProjectPage'
import { AR_FITTING_SECTIONS } from './arFittingHomeData'
import { toDeckVisualSections } from './deck/toDeckVisualSections'

const CREAM = 'bg-[#faf7f0]'
const DECK_BORDER = 'border-[0.5px] border-[#c0bcb0]'
/** Deck `SectionSlide` only: consistent media band height across slides (pair / carousel / single). */
const DECK_SECTION_MEDIA_FRAME =
  'flex min-h-[min(38dvh,340px)] min-w-0 flex-1 flex-col overflow-hidden'
const INSTRUMENT = "font-['Instrument_Serif',serif]"
const MONO = "font-['IBM_Plex_Mono',monospace]"
/** Deck `TitleSlide` hero H1 only (+2px vs default clamp). */
const DECK_TITLE_H1 =
  `${INSTRUMENT} mt-6 max-w-full text-[clamp(calc(2.1rem+2px),calc(7.5vw+2px),calc(3.75rem+2px))] font-normal leading-[0.92] tracking-[-0.035em] text-black not-italic dark:text-neutral-100 sm:mt-8 md:text-[calc(3.25rem+2px)]`

/** `toDeckVisualSections` ids: top-level `takeaway` or expanded `takeaway--…`. */
function deckSectionIsTakeaway(sectionId: string): boolean {
  return sectionId === 'takeaway' || sectionId.startsWith('takeaway--')
}

/** Title (1) + PSI (1) + one slide per visual section + Q&A (1). */
export function slideCountForProject(p: DeckProject): number {
  return p.visualSections.length + 3
}

function slideKind(
  slideIndex: number,
  sectionCount: number,
): 'title' | 'psi' | 'section' | 'qa' {
  if (slideIndex === 0) return 'title'
  if (slideIndex === 1) return 'psi'
  if (slideIndex >= 2 && slideIndex < 2 + sectionCount) return 'section'
  return 'qa'
}

export type DeckVisualSection = {
  id: string
  label: string
  heading: string
  body: string
  image: string
  /** Deck-only (e.g. Piik overview): same URLs as case-study carousel, one slide. */
  carousel?: string[]
  /** Deck-only: second asset (e.g. AR `mediaBeside` gif) shown next to `image`, same row height. */
  imageBeside?: string
  mediaBesideGapPx?: number
}

export type DeckPsiBlock = {
  metric: string
  heading: string
  body: string
}

export type DeckProject = {
  id: string
  navLabel: string
  name: string
  /** Hero H1 when different from `name` (e.g. matches home column). */
  heroDisplayName?: string
  year: string
  role: string
  platform: string
  /** Home-style mono line under the hero title (scope · context). */
  heroMetaLine: string
  visualSections: DeckVisualSection[]
  psi: {
    problem: DeckPsiBlock
    solution: DeckPsiBlock
    impact: DeckPsiBlock
  }
}

export const deckData: DeckProject[] = [
  {
    id: 'hovr',
    navLabel: '[ HOVR ]',
    name: 'HOVR',
    heroDisplayName: 'HOVR Admin',
    year: '2024',
    role: 'UX/UI Designer',
    platform: 'Web Admin · Mobile',
    heroMetaLine: 'UX/UI Design · Internal Tools',
    visualSections: toDeckVisualSections(HOVR_SECTIONS as unknown as readonly Record<string, unknown>[], 'hovr'),
    psi: {
      problem: {
        metric: '48.08s',
        heading: 'Manual review bottlenecks',
        body: 'Driver onboarding was delayed due to manual data validation and fragmented inputs.',
      },
      solution: {
        metric: 'OCR core',
        heading: 'Automated verification',
        body: 'Structured OCR pipelines with human-in-the-loop exceptions cut repetitive checks.',
      },
      impact: {
        metric: '84.9%',
        heading: 'Time removed',
        body: 'Approval path reduced from 48.08s to 7.26s on the restructured admin experience.',
      },
    },
  },
  {
    id: 'piik',
    navLabel: '[ Piik AI ]',
    name: 'Piik AI',
    year: '2024',
    role: 'UX/UI Designer',
    platform: 'Web · Editor',
    heroMetaLine: 'Product Design · AI Knowledge Platform · Early-Stage Startup Team Member',
    visualSections: toDeckVisualSections(PIIK_SECTIONS as unknown as readonly Record<string, unknown>[], 'piik'),
    psi: {
      problem: {
        metric: 'High load',
        heading: 'Editor friction',
        body: 'Unclear states and missing affordances concentrated support load on the same flows.',
      },
      solution: {
        metric: 'IA rebuild',
        heading: 'End-to-end redesign',
        body: 'Research-led structure, explicit states, and calmer density for long editing sessions.',
      },
      impact: {
        metric: '75%',
        heading: 'Fewer complaints',
        body: 'Editor-related complaints dropped after shipping the redesigned experience.',
      },
    },
  },
  {
    id: 'ar-fitting',
    navLabel: '[ AR Fitting Room ]',
    name: 'AR Fitting Room',
    year: '2024',
    role: 'UX/UI Designer',
    platform: 'AR · Mobile Web',
    heroMetaLine: 'Award-winning · Product Design · Accessibility Design',
    visualSections: toDeckVisualSections(
      AR_FITTING_SECTIONS as unknown as readonly Record<string, unknown>[],
      'ar-fitting',
    ),
    psi: {
      problem: {
        metric: 'Access gap',
        heading: 'Physical barriers',
        body: 'Many users could not rely on in-store try-on; digital mirrors rarely addressed mobility needs.',
      },
      solution: {
        metric: 'AR room',
        heading: 'At-home fitting',
        body: 'Room-scale AR with sizing logic tuned for seated use and reduced motor precision.',
      },
      impact: {
        metric: 'Pilot',
        heading: 'Validated flows',
        body: 'Higher completion on try-on tasks with fewer abandonments in moderated sessions.',
      },
    },
  },
]

const SWIPE_PX = 48

function PsiColumn({ label, block }: { label: string; block: DeckPsiBlock }) {
  return (
    <div className={`flex min-h-0 min-w-0 flex-col ${CREAM}`}>
      <div className={`${DECK_BORDER} border-b border-[#c0bcb0] px-2.5 py-1.5 sm:px-3`}>
        <p className={`${MONO} text-[9px] font-medium uppercase tracking-[0.16em] text-black/50`}>{label}</p>
      </div>
      <div className="flex flex-col gap-3 px-2.5 py-3 sm:gap-4 sm:px-3 sm:py-4">
        <p
          className={`${INSTRUMENT} text-[clamp(1.75rem,4vw,2.75rem)] font-normal leading-none tracking-[-0.03em] text-black`}
        >
          {block.metric}
        </p>
        <h3
          className={`${INSTRUMENT} text-[clamp(1.05rem,2.2vw,1.35rem)] font-normal leading-[1.12] tracking-[-0.02em] text-black`}
        >
          {block.heading}
        </h3>
        <p className={`${MONO} text-[11px] font-normal leading-[1.55] text-black/78 sm:text-[12px]`}>{block.body}</p>
      </div>
    </div>
  )
}

function TitleSlideMetaCell({ label, value }: { label: string; value: string }) {
  return (
    <div className={`flex min-h-0 flex-col px-3 py-3 sm:px-4 sm:py-3.5 ${CREAM}`}>
      <p className={`${MONO} text-[8px] font-medium uppercase tracking-[0.16em] text-black/45 dark:text-white/50`}>
        {label}
      </p>
      <p className={`${MONO} mt-1.5 text-[10px] font-normal leading-snug text-black dark:text-white/95 sm:text-[11px]`}>
        {value}
      </p>
    </div>
  )
}

function TitleSlide({ project, ordinal }: { project: DeckProject; ordinal: string }) {
  const displayName = project.heroDisplayName ?? project.name

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <div className="mx-auto flex h-full min-h-0 w-full min-w-0 max-w-[min(100%,46rem)] flex-1 flex-col justify-between overflow-hidden px-4 py-5 sm:px-7 sm:py-7 md:px-10 md:py-9">
        <div className="flex w-full min-w-0 flex-1 flex-col justify-between gap-6 sm:gap-8">
          <div className="flex min-h-0 w-full min-w-0 flex-col">
            <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
              <p className={`${MONO} text-[9px] font-normal uppercase tracking-[0.2em] text-black/50 dark:text-white/55`}>
                [ TITLE · {ordinal} ]
              </p>
              <p className={`${MONO} text-[9px] font-normal tabular-nums uppercase tracking-[0.14em] text-black/40 dark:text-white/45`}>
                {project.year}
              </p>
            </div>

            <h1 className={DECK_TITLE_H1}>
              {displayName}
            </h1>

            <p
              className={`${MONO} mt-5 max-w-[min(100%,52ch)] text-[11px] font-normal leading-[1.45] tracking-[0.02em] text-black/78 dark:text-white/80 sm:mt-6 sm:text-[12px]`}
            >
              {project.heroMetaLine}
            </p>
          </div>

          <div className="mt-auto w-full max-w-[52ch] shrink-0">
            <div
              className={`grid grid-cols-1 divide-y divide-[#c0bcb0] overflow-hidden rounded-none ${DECK_BORDER} border border-[#c0bcb0] sm:grid-cols-3 sm:divide-x sm:divide-y-0 dark:divide-white/20`}
            >
              <TitleSlideMetaCell label="Year" value={project.year} />
              <TitleSlideMetaCell label="Role" value={project.role} />
              <TitleSlideMetaCell label="Platform" value={project.platform} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PsiSlide({ project }: { project: DeckProject }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className={`${DECK_BORDER} border-b border-[#c0bcb0] px-2.5 py-2 sm:px-3`}>
        <p className={`${MONO} text-[9px] font-medium uppercase tracking-[0.14em] text-black/50 sm:text-[10px]`}>
          {project.name} · Problem · Solution · Impact
        </p>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-[0.5px] bg-[#c0bcb0] p-[0.5px] md:grid-cols-3">
        <PsiColumn label="PROBLEM" block={project.psi.problem} />
        <PsiColumn label="SOLUTION" block={project.psi.solution} />
        <PsiColumn label="IMPACT" block={project.psi.impact} />
      </div>
    </div>
  )
}

function SectionSlide({ project, section }: { project: DeckProject; section: DeckVisualSection }) {
  const takeawayOnly = deckSectionIsTakeaway(section.id)
  const hideMediaPanel =
    takeawayOnly || (project.id === 'ar-fitting' && section.id === 'overview')

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        className={`${DECK_BORDER} border-b border-[#c0bcb0] px-2.5 py-2 sm:px-4 sm:py-3 ${takeawayOnly ? 'min-h-0 flex-1 overflow-y-auto' : ''}`}
      >
        <p className={`${MONO} text-[9px] font-medium uppercase tracking-[0.12em] text-black/45 sm:text-[10px]`}>
          {project.name} · {section.label}
        </p>
        <h2
          className={`${INSTRUMENT} mt-1 text-[clamp(1.5rem,4.5vw,2.5rem)] font-normal leading-[1.05] tracking-[-0.03em] text-black`}
        >
          {section.heading}
        </h2>
        <p className={`${MONO} mt-2 max-w-[60ch] text-[11px] font-normal leading-relaxed text-black/72 sm:text-[12px]`}>
          {section.body}
        </p>
      </div>
      {!hideMediaPanel ? (
        <div
          className={`${DECK_SECTION_MEDIA_FRAME} ${DECK_BORDER} m-2 border border-[#c0bcb0] sm:m-3 md:m-4`}
        >
          <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-black/[0.04] p-1 sm:p-2">
            {section.carousel && section.carousel.length > 0 ? (
              <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden">
                <PiikCaseStudyCarouselBlock srcs={section.carousel} fullWidthSlides />
              </div>
            ) : section.imageBeside?.trim() && section.image.trim() ? (
              <div
                className="flex min-h-0 min-w-0 flex-1 flex-row items-stretch justify-center"
                style={{ gap: `${section.mediaBesideGapPx ?? 10}px` }}
              >
                <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden">
                  {section.image.toLowerCase().endsWith('.mp4') ? (
                    <video
                      src={section.image}
                      className="max-h-full w-full object-contain"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={section.image}
                      alt=""
                      className="max-h-full w-full object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                </div>
                <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden">
                  {section.imageBeside.toLowerCase().endsWith('.mp4') ? (
                    <video
                      src={section.imageBeside}
                      className="max-h-full w-full object-contain"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={section.imageBeside}
                      alt=""
                      className="max-h-full w-full object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                </div>
              </div>
            ) : section.image.trim() ? (
              <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden">
                {section.image.toLowerCase().endsWith('.mp4') ? (
                  <video
                    src={section.image}
                    className="max-h-full max-w-full object-contain"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={section.image}
                    alt=""
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function QaSlide({ project }: { project: DeckProject }) {
  return (
    <div className={`flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-10 text-center`}>
      <p className={`${MONO} text-[9px] font-medium uppercase tracking-[0.2em] text-black/40`}>Close</p>
      <p
        className={`${INSTRUMENT} mt-4 text-[clamp(2.5rem,10vw,5rem)] font-normal leading-none tracking-[-0.03em] text-black`}
      >
        Q&amp;A
      </p>
      <p className={`${MONO} mt-4 text-[11px] font-normal text-black/55 sm:text-[12px]`}>
        {project.name} · Discussion
      </p>
    </div>
  )
}

export function Deck() {
  const [projectIndex, setProjectIndex] = useState(0)
  const [slideIndex, setSlideIndex] = useState(0)
  const touchRef = useRef<{ x: number; y: number } | null>(null)

  const project = deckData[projectIndex]
  const n = project.visualSections.length
  const totalSlides = slideCountForProject(project)
  const kind = slideKind(slideIndex, n)

  const next = useCallback(() => {
    setSlideIndex((s) => Math.min(s + 1, totalSlides - 1))
  }, [totalSlides])

  const prev = useCallback(() => {
    setSlideIndex((s) => Math.max(s - 1, 0))
  }, [])

  const canPrev = slideIndex > 0
  const canNext = slideIndex < totalSlides - 1

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        next()
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prev()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.changedTouches[0]
    touchRef.current = { x: t.clientX, y: t.clientY }
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchRef.current
    touchRef.current = null
    if (!start) return
    const t = e.changedTouches[0]
    const dx = t.clientX - start.x
    const dy = t.clientY - start.y
    if (Math.abs(dx) < Math.abs(dy) * 1.2) return
    if (dx < -SWIPE_PX && canNext) next()
    if (dx > SWIPE_PX && canPrev) prev()
  }

  const selectProject = (pi: number) => {
    setProjectIndex(pi)
    setSlideIndex(0)
  }

  const section = kind === 'section' ? project.visualSections[slideIndex - 2] : null

  const counter = `${String(slideIndex + 1).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`

  const footerLabel =
    kind === 'title'
      ? 'TITLE'
      : kind === 'psi'
        ? 'PSI'
        : kind === 'section'
          ? (section?.label ?? '')
          : 'Q&A'

  return (
    <div
      className={`fixed inset-0 z-0 flex min-h-[100dvh] w-full min-w-0 flex-col ${CREAM} text-black`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <header
        className={`flex shrink-0 flex-wrap items-center gap-2 ${CREAM} ${DECK_BORDER} border-b border-[#c0bcb0] px-2 py-2 sm:gap-3 sm:px-3 sm:py-2.5`}
      >
        <nav className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 sm:gap-2" aria-label="Projects">
          {deckData.map((p, pi) => {
            const active = pi === projectIndex
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => selectProject(pi)}
                aria-current={active ? 'page' : undefined}
                className={`${MONO} shrink-0 rounded-none border border-transparent px-2 py-1.5 text-left text-[10px] font-normal uppercase leading-snug tracking-[0.06em] outline-none transition-colors sm:text-[11px] ${
                  active
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'bg-transparent text-black/80 hover:bg-black hover:text-white focus-visible:bg-black focus-visible:text-white dark:text-white/80 dark:hover:bg-white dark:hover:text-black dark:focus-visible:bg-white dark:focus-visible:text-black'
                }`}
              >
                {p.navLabel}
              </button>
            )
          })}
        </nav>
      </header>

      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div
          className={`relative flex min-h-0 flex-1 flex-col px-2 py-2 sm:px-3 sm:py-3 md:px-5 md:py-4 ${
            kind === 'title' ? 'overflow-hidden' : 'overflow-auto'
          }`}
        >
          <div
            className={`relative z-[1] mx-auto flex w-full max-w-[1200px] flex-1 flex-col ${CREAM} ${DECK_BORDER} border border-[#c0bcb0] ${
              kind === 'title' ? 'min-h-[80%]' : 'min-h-[min(100%,480px)]'
            }`}
          >
            <div
              key={`${project.id}-${slideIndex}`}
              className={`flex min-h-0 flex-1 flex-col ${kind === 'title' ? 'h-full min-h-0 overflow-hidden' : ''}`}
            >
              {kind === 'title' ? (
                <TitleSlide project={project} ordinal={String(slideIndex + 1).padStart(2, '0')} />
              ) : kind === 'psi' ? (
                <PsiSlide project={project} />
              ) : kind === 'section' && section ? (
                <SectionSlide project={project} section={section} />
              ) : (
                <QaSlide project={project} />
              )}
            </div>
          </div>
        </div>

        <footer
          className={`flex shrink-0 flex-wrap items-center justify-between gap-3 ${DECK_BORDER} border-t border-[#c0bcb0] px-2.5 py-2.5 sm:px-4 sm:py-3`}
        >
          <span className={`${MONO} text-[9px] font-normal uppercase tracking-[0.08em] text-black/50 sm:text-[10px]`}>
            {project.navLabel} · {footerLabel}
          </span>
          <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-4">
            <span className={`${MONO} text-[10px] font-medium tabular-nums text-black sm:text-[11px]`} aria-live="polite">
              {counter}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={!canPrev}
                onClick={prev}
                className={`${MONO} ${DECK_BORDER} border border-[#c0bcb0] bg-transparent px-2.5 py-1.5 text-[10px] font-normal tracking-[0.06em] text-black transition-opacity hover:bg-black/[0.03] disabled:pointer-events-none disabled:opacity-30 sm:px-3 sm:text-[11px]`}
              >
                [ PREV ]
              </button>
              <button
                type="button"
                disabled={!canNext}
                onClick={next}
                className={`${MONO} ${DECK_BORDER} border border-[#c0bcb0] bg-transparent px-2.5 py-1.5 text-[10px] font-normal tracking-[0.06em] text-black transition-opacity hover:bg-black/[0.03] disabled:pointer-events-none disabled:opacity-30 sm:px-3 sm:text-[11px]`}
              >
                [ NEXT ]
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
