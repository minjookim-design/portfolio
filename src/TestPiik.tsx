import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { motion, useReducedMotion, type TargetAndTransition, type Transition } from 'framer-motion'
import piikMarkdown from '../_content/Piik AI.md?raw'
import {
  enrichVaultBody,
  TestProjectBody,
  TEST_PROJECT_PROSE_CLASS,
  type TestProjectSectionContent,
} from './TestProjectBody'
import { TestProjectDetailShell } from './TestProjectDetailShell'
import { PiikFeedbackEmailCollage } from './PiikFeedbackEmailCollage'
import { MD_ARTICLE, MD_BORDER, MD_COLS, MD_GUTTER, MD_INK, MD_INK_FAINT, MD_PAGE_MARGIN, MD_SHAPE_LARGE, MD_SURFACE_CONTAINER_LOW } from './testMd3Layout'
import { usePageTheme } from './context/PageThemeContext'

const PIIK_BG_HERO = 'bg-[#E6EEFF]'
const PIIK_BG_LIGHT = 'bg-[#F7F9FF]'
const PIIK_BG_CATALYST = 'bg-[#24324A]'
const PIIK_BG_SOLUTION_1 = 'bg-[#121A2A]'
const PIIK_BG_SOLUTION_2 = 'bg-[#18243A]'
const PIIK_BG_SOLUTION_3 = 'bg-[#22314D]'

const piikLightModeColors = [
  '#E6EEFF',
  '#F7F9FF',
  '#24324A',
  '#121A2A',
  '#18243A',
  '#22314D',
] as const

function invertLightnessToDark(hex: string): string {
  const value = hex.replace('#', '')
  const r = Number.parseInt(value.slice(0, 2), 16) / 255
  const g = Number.parseInt(value.slice(2, 4), 16) / 255
  const b = Number.parseInt(value.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  const lightness = (max + min) / 2

  let hue = 0
  if (delta !== 0) {
    if (max === r) hue = ((g - b) / delta) % 6
    else if (max === g) hue = (b - r) / delta + 2
    else hue = (r - g) / delta + 4
    hue *= 60
    if (hue < 0) hue += 360
  }

  const saturation =
    delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1))
  const invertedLightness = 100 - lightness * 100
  const darkLightness = Math.min(15, Math.max(10, invertedLightness))

  return `hsl(${hue.toFixed(3)} ${Number((saturation * 100).toFixed(3))}% ${Number(
    darkLightness.toFixed(3),
  )}%)`
}

const piikDarkModeColors = piikLightModeColors.map(invertLightnessToDark)
const piikHeroDarkColor = invertLightnessToDark('#24324A')

const PIIK_BG_COLOR_INDEX: Record<string, number> = {
  [PIIK_BG_HERO]: 0,
  [PIIK_BG_LIGHT]: 1,
  [PIIK_BG_CATALYST]: 2,
  [PIIK_BG_SOLUTION_1]: 3,
  [PIIK_BG_SOLUTION_2]: 4,
  [PIIK_BG_SOLUTION_3]: 5,
}

const PIIK_SECTION_BG: Record<string, string> = {
  'The Catalyst': PIIK_BG_CATALYST,
  'Why Do Our Users Want More Features?': PIIK_BG_LIGHT,
  'Unpacking the Solution 01': PIIK_BG_SOLUTION_1,
  'Unpacking the Solution 02': PIIK_BG_SOLUTION_2,
  'Unpacking the Solution 03': PIIK_BG_SOLUTION_3,
  Takeaway: PIIK_BG_HERO,
}

const PIIK_SECTION_THEME: Record<string, 'light' | 'dark'> = {
  'The Catalyst': 'dark',
  'Why Do Our Users Want More Features?': 'light',
  'Unpacking the Solution 01': 'dark',
  'Unpacking the Solution 02': 'dark',
  'Unpacking the Solution 03': 'dark',
  Takeaway: 'light',
}

const IMPACT_VIEWPORT = { once: true, margin: '-100px' } as const

type ImpactRevealTransition = Transition
type ImpactRevealTarget = TargetAndTransition

/** Off-scroll embeds (gallery hover) — use `animate` on mount instead of `whileInView`. */
function impactRevealProps(
  animateOnMount: boolean,
  reduceMotion: boolean | null,
  viewport: typeof IMPACT_VIEWPORT,
  visible: ImpactRevealTarget,
  hidden: ImpactRevealTarget = { opacity: 0 },
  transition?: ImpactRevealTransition,
) {
  if (reduceMotion) return { initial: false as const }
  if (animateOnMount) return { initial: hidden, animate: visible, transition }
  return { initial: hidden, whileInView: visible, viewport, transition }
}

/** Scale full graph to fit a narrow column (gallery preview). */
function FitToWidthShell({
  children,
  onLayoutChange,
}: {
  children: ReactNode
  onLayoutChange?: () => void
}) {
  const shellRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [layout, setLayout] = useState({ scale: 1, height: 0 })

  useLayoutEffect(() => {
    const shell = shellRef.current
    const content = contentRef.current
    if (!shell || !content) return

    const update = () => {
      const available = shell.clientWidth
      const naturalW = content.offsetWidth
      const naturalH = content.offsetHeight
      const scale = naturalW > 0 ? Math.min(1, available / naturalW) : 1
      setLayout({ scale, height: naturalH * scale })
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(shell)
    ro.observe(content)
    return () => ro.disconnect()
  }, [])

  useLayoutEffect(() => {
    onLayoutChange?.()
  }, [layout.scale, layout.height, onLayoutChange])

  return (
    <div
      ref={shellRef}
      className="w-full max-w-full overflow-hidden"
      style={layout.height > 0 ? { height: layout.height } : undefined}
    >
      <div
        ref={contentRef}
        className="inline-block w-max max-w-none origin-top-left"
        style={{ transform: `scale(${layout.scale})` }}
      >
        {children}
      </div>
    </div>
  )
}

/** Map a marker's visual center into `root`'s local SVG coordinate space. */
function markerPointInRoot(marker: HTMLElement, root: HTMLElement) {
  const markerRect = marker.getBoundingClientRect()
  const rootRect = root.getBoundingClientRect()
  const scaleX = root.offsetWidth > 0 ? rootRect.width / root.offsetWidth : 1
  const scaleY = root.offsetHeight > 0 ? rootRect.height / root.offsetHeight : 1
  return {
    x: (markerRect.left + markerRect.width / 2 - rootRect.left) / scaleX,
    y: (markerRect.top + markerRect.height / 2 - rootRect.top) / scaleY,
  }
}

/** Strongest ease-in-out (expo) for graph storytelling motion. */
const GRAPH_EASE = [0.87, 0, 0.13, 1] as const

const IMPACT_MAPPINGS = [
  {
    pain: 'Lack of editing tools',
    solution: 'Maximize the editing tools',
  },
  {
    pain: 'Editor area is too narrow',
    solution: 'Set text area to the industry standard',
  },
  {
    pain: 'No archiving feature before publishing the article',
    solution: 'Give Save Draft option for better publishing experience',
  },
] as const

const PIIK_MORE_EDITING_TOOLS_CAROUSEL = {
  srcs: ['/piikai/1.mp4', '/piikai/2.mp4', '/piikai/3.mp4', '/piikai/4.mp4', '/piikai/5.mp4'],
  captions: [
    {
      title: 'Accessing the Editing Tool',
      body: 'Users can access the editing tool from the bottom toolbar or by tapping the plus button. Additionally, hovering over the simplified toolbar icon on the left side of the cursor line reveals a streamlined tool bar for quick access.',
    },
    {
      title: 'Text Formatting Options',
      body: 'Users have various text tools to customize their content, including font size and style changes, basic text formatting like bold, italic, underline, and strikethrough. Options for text colour and background colour, alignment changes, line spacing adjustments, and the creation of bulleted or numbered lists are also available. Additionally, four divider options enhance storytelling, and the quote feature allows users to highlight important quotes effectively.',
    },
    {
      title: 'Code Block Support',
      body: 'The tool includes functionality to insert code blocks, catering to technical writers and developers.',
    },
    {
      title: 'Media Captioning',
      body: 'Users can add captions below images, videos, and embedded posts. Captions are optional, allowing flexibility depending on the content.',
    },
    {
      title: 'Interactive Polling Feature',
      body: 'The polling feature enables creators to engage directly with their audience, fostering interaction and increasing platform usage. Polls can be customized with options to set the voting duration, limit the number of selectable answers, and enable anonymous voting, emphasizing the community-focused aspect of the platform.',
    },
  ],
} as const

const PIIK_CORE_PROBLEM_MEDIA = ['/piikai/problem1.png', '/piikai/problem2.png', null] as const

const PIIK_FEATURE_TITLE =
  "font-['SUIT_Variable',sans-serif] text-[11pt] font-bold uppercase leading-[1.2] tracking-[-0.02em] text-black dark:text-[#f2f2f2]"
const PIIK_META_SUIT =
  "font-['SUIT_Variable',sans-serif] text-[clamp(0.5625rem,1.2vw,0.75rem)] font-bold not-italic uppercase leading-[1.2] tracking-[-0.02em] text-black/45 dark:text-white/45"

const PIIK_RESEARCH_CARDS = [
  {
    eyebrow: '01 · Method',
    title: 'Naver Blog analysis',
    body: (
      <>
        Studied Korea&apos;s dominant publishing platform — a visible, exhaustive editing suite that
        has shaped creator expectations for decades.
      </>
    ),
  },
  {
    eyebrow: '02 · Finding',
    title: 'Minimalism ≠ power',
    body: (
      <>
        For Korean users, minimalism often reads as a lack of functionality. They expect a
        &quot;versatile toolbox&quot; with high-density, high-precision control.
      </>
    ),
  },
  {
    eyebrow: '03 · Pivot',
    title: 'Design objective',
    body: (
      <>
        Shifted from a simple UI tweak to building a{' '}
        <strong className="font-bold">high-density, fail-safe creative environment.</strong>
      </>
    ),
  },
] as const

/** Research findings — Naver reference + three insight cards (deck Slide06). */
function PiikResearchFindings() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="flex w-full flex-col gap-8 sm:gap-10">
      <motion.figure
        className="m-0 w-full overflow-hidden rounded-none"
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{
          duration: reduceMotion ? 0 : 0.55,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <img
          src="/piikai/naver.png"
          alt="Naver Blog editor research reference"
          className="block h-auto w-full object-contain object-top"
        />
      </motion.figure>

      <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-3">
        {PIIK_RESEARCH_CARDS.map((card, i) => (
          <motion.div
            key={card.eyebrow}
            className="border border-[#c0bcb0] px-4 py-4 dark:border-white/15"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: reduceMotion ? 0 : 0.55,
              delay: reduceMotion ? 0 : 0.08 + i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <p className={PIIK_META_SUIT}>{card.eyebrow}</p>
            <p className={`${PIIK_FEATURE_TITLE} mt-3`}>{card.title}</p>
            <p className={`${TEST_PROJECT_PROSE_CLASS} mt-2 m-0`}>{card.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/** Deck-style problem rows — vertical stack, article-column width/alignment. */
function PiikCoreChallengeProblems({
  features,
}: {
  features: TestProjectSectionContent['features']
}) {
  const reduceMotion = useReducedMotion()

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.45,
        delayChildren: reduceMotion ? 0 : 0.08,
      },
    },
  }

  const itemVariants = {
    hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.55,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  }

  return (
    <div className={`grid w-full ${MD_COLS} ${MD_GUTTER}`}>
      <motion.div
        className={`${MD_ARTICLE} flex flex-col gap-10 sm:gap-14`}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
      >
        {features.map((feature, i) => {
          const mediaSrc = PIIK_CORE_PROBLEM_MEDIA[i] ?? null
          const indexLabel = String(i + 1).padStart(2, '0')

          return (
            <motion.div
              key={`${feature.title}-${i}`}
              className="flex w-full flex-col items-start gap-4"
              variants={itemVariants}
            >
              {mediaSrc ? (
                <img
                  src={mediaSrc}
                  alt={feature.title || `Problem ${indexLabel}`}
                  className="block h-auto w-full min-w-0 object-contain"
                />
              ) : null}
              <div className="min-w-0">
                <p className={PIIK_FEATURE_TITLE}>
                  {indexLabel} · {feature.title}
                </p>
                {feature.description ? (
                  <p className={`${TEST_PROJECT_PROSE_CLASS} mt-3 m-0`}>{feature.description}</p>
                ) : null}
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}

/** Solution 01 — feature copy on top; full-bleed carousel below. */
function PiikSolution01FeatureMedia({
  features,
  featureStartIndex = 1,
}: {
  features: TestProjectSectionContent['features']
  featureStartIndex?: number
}) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }, [])

  useEffect(() => {
    updateArrows()
    const el = scrollerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => updateArrows())
    ro.observe(el)
    return () => ro.disconnect()
  }, [updateArrows])

  const scrollByDir = (dir: -1 | 1) => {
    const el = scrollerRef.current
    if (!el) return
    const slide = el.querySelector<HTMLElement>('[data-carousel-slide]')
    const delta = slide ? slide.offsetWidth + 16 : el.clientWidth * 0.45
    el.scrollBy({ left: dir * delta, behavior: 'smooth' })
  }

  return (
    <div className="relative left-1/2 flex w-[100dvw] max-w-none -translate-x-1/2 flex-col gap-6 px-4 sm:px-6">
      <figure className="relative m-0 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
        {features[0] ? (
          <figcaption className="flex flex-row items-start gap-3 font-['SUIT_Variable',sans-serif] text-[11pt] leading-[1.2] tracking-[-0.02em] text-[color:var(--color-muted,#666666)] dark:text-white/75">
            <span className="w-6 shrink-0 tabular-nums text-yellow-300">{featureStartIndex}</span>
            <span className="min-w-0">
              <strong className="block font-bold uppercase tracking-[-0.02em] text-black opacity-90 dark:text-[#f2f2f2]">
                {features[0].title}
              </strong>
              <span className="mt-1 block font-normal">{features[0].description}</span>
            </span>
          </figcaption>
        ) : null}
        {features[1] ? (
          <figcaption className="flex flex-row items-start gap-3 font-['SUIT_Variable',sans-serif] text-[11pt] leading-[1.2] tracking-[-0.02em] text-[color:var(--color-muted,#666666)] dark:text-white/75">
            <span className="w-6 shrink-0 tabular-nums text-yellow-300">
              {featureStartIndex + 1}
            </span>
            <span className="min-w-0">
              <strong className="block font-bold uppercase tracking-[-0.02em] text-black opacity-90 dark:text-[#f2f2f2]">
                {features[1].title}
              </strong>
              <span className="mt-1 block font-normal">{features[1].description}</span>
            </span>
          </figcaption>
        ) : null}
      </figure>

      <figure className="relative m-0 w-full min-w-0 self-stretch">
        <div className="relative w-full min-w-0">
          <div className="pointer-events-none absolute inset-x-0 top-0 bottom-8 z-10 flex items-center justify-between px-2">
            {canPrev ? (
              <button
                type="button"
                aria-label="Previous slides"
                className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-base text-white"
                onClick={() => scrollByDir(-1)}
              >
                ‹
              </button>
            ) : (
              <span />
            )}
            {canNext ? (
              <button
                type="button"
                aria-label="Next slides"
                className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-base text-white"
                onClick={() => scrollByDir(1)}
              >
                ›
              </button>
            ) : (
              <span />
            )}
          </div>
          <div
            ref={scrollerRef}
            onScroll={updateArrows}
            className="flex w-full gap-4 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {PIIK_MORE_EDITING_TOOLS_CAROUSEL.srcs.map((src, i) => (
              <div
                key={src}
                data-carousel-slide
                className="flex w-[calc((100%-1rem)/2)] min-w-[calc((100%-1rem)/2)] shrink-0 flex-col gap-3 sm:w-[calc((100%-2rem)/3)] sm:min-w-[calc((100%-2rem)/3)] lg:w-[calc((100%-3rem)/4)] lg:min-w-[calc((100%-3rem)/4)]"
              >
                <div className="flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-none bg-white">
                  <video
                    src={src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-contain"
                  />
                </div>
                {PIIK_MORE_EDITING_TOOLS_CAROUSEL.captions[i] ? (
                  <p className="m-0 font-['SUIT_Variable',sans-serif] text-[12px] font-bold tracking-tight text-black dark:text-[#f2f2f2]">
                    {PIIK_MORE_EDITING_TOOLS_CAROUSEL.captions[i].title}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </figure>
    </div>
  )
}

/** Impact graph: 16 tickets → pains → 4 tickets → solutions → line → −75%. */
export function PiikImpactStoryGraph({
  hideCaption = false,
  embed = false,
}: {
  hideCaption?: boolean
  /** Gallery column embed: same graph as the Piik page, animate on mount, scale to fit width. */
  embed?: boolean
} = {}) {
  const reduceMotion = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const beforeBarRef = useRef<HTMLSpanElement>(null)
  const afterBarRef = useRef<HTMLSpanElement>(null)
  const [line, setLine] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(
    null,
  )

  const updateConnector = useCallback(() => {
    const root = rootRef.current
    const before = beforeBarRef.current
    const after = afterBarRef.current
    if (!root || !before || !after) return
    const start = markerPointInRoot(before, root)
    const end = markerPointInRoot(after, root)
    setLine({
      x1: start.x,
      y1: start.y,
      x2: end.x,
      y2: end.y,
    })
  }, [])

  /**
   * Sequence:
   * 1) 16-ticket bar → 2) pain points → 3) 4-ticket bar →
   * 4) solution boxes → 5) connector line → 6) −75% badge
   * Pace: base timings ÷ (1.2 × 0.8) — 0.80× current speed vs prior 1.2×.
   */
  const pace = 1.2 * 0.8
  const t = (seconds: number) => seconds / pace
  const beforeBarDelay = reduceMotion ? 0 : 0
  const beforeBarDuration = t(0.7)
  const painDelay = reduceMotion ? 0 : beforeBarDelay + beforeBarDuration + t(0.15)
  const painStagger = t(0.1)
  const painDuration = t(0.4)
  const beforeSlideDelay = reduceMotion ? 0 : painDelay + t(0.55)
  const beforeSlideDuration = t(0.75)
  const afterBarDelay = reduceMotion ? 0 : beforeSlideDelay + t(0.15)
  const afterBarDuration = t(0.55)
  const solutionDelay = reduceMotion ? 0 : afterBarDelay + afterBarDuration + t(0.1)
  const solutionStagger = t(0.1)
  const solutionDuration = t(0.45)
  const lineDelay = reduceMotion ? 0 : solutionDelay + t(0.7)
  const lineDuration = t(0.8)
  const endDotDelay = lineDelay + lineDuration - t(0.05)
  const badgeDelay = lineDelay + lineDuration + t(0.05)
  const badgeDuration = t(0.45)
  const captionDelay = badgeDelay + t(0.45)
  const fadeDuration = t(0.35)
  const afterGroupDuration = t(0.55)

  useLayoutEffect(() => {
    updateConnector()
    const msMarks = [
      0,
      beforeBarDuration * 1000,
      painDelay * 1000,
      beforeSlideDelay * 1000,
      afterBarDelay * 1000,
      (afterBarDelay + afterBarDuration) * 1000,
      solutionDelay * 1000,
      lineDelay * 1000,
      (lineDelay + lineDuration) * 1000,
    ]
    const timers = msMarks.map((ms) => window.setTimeout(updateConnector, ms))
    window.addEventListener('resize', updateConnector)
    const rootEl = rootRef.current
    const ro = rootEl ? new ResizeObserver(updateConnector) : null
    if (rootEl && ro) ro.observe(rootEl)
    return () => {
      timers.forEach((id) => window.clearTimeout(id))
      window.removeEventListener('resize', updateConnector)
      ro?.disconnect()
    }
  }, [
    afterBarDelay,
    afterBarDuration,
    beforeBarDuration,
    beforeSlideDelay,
    lineDelay,
    lineDuration,
    painDelay,
    solutionDelay,
    updateConnector,
  ])

  useEffect(() => {
    if (reduceMotion) return
    let frame = 0
    let raf = 0
    const tick = () => {
      updateConnector()
      frame += 1
      if (frame < 150) raf = window.requestAnimationFrame(tick)
    }
    // Track bar tops while Before slides left and After grows.
    const start = window.setTimeout(() => {
      raf = window.requestAnimationFrame(tick)
    }, beforeSlideDelay * 1000)
    return () => {
      window.clearTimeout(start)
      window.cancelAnimationFrame(raf)
    }
  }, [beforeSlideDelay, reduceMotion, updateConnector])

  const badgeMid = line
    ? { left: (line.x1 + line.x2) / 2, top: (line.y1 + line.y2) / 2 }
    : null

  const reveal = (
    visible: ImpactRevealTarget,
    hidden?: ImpactRevealTarget,
    transition?: ImpactRevealTransition,
  ) => impactRevealProps(embed, reduceMotion, IMPACT_VIEWPORT, visible, hidden, transition)

  const painColClass = 'flex w-[190px] flex-col gap-2 md:w-[220px]'
  const graphRootClass =
    'relative mx-auto flex h-[400px] w-full max-w-5xl items-end justify-center gap-10 overflow-visible md:gap-16'
  const graphGroupClass = 'relative z-10 flex items-end gap-4'
  const labelType =
    "font-['IBM_Plex_Mono',monospace] text-[9px] uppercase tracking-[0.08em]"
  const bodyType =
    "font-['SUIT_Variable',sans-serif] text-[11pt] font-medium tracking-tight"
  const solutionBodyType =
    "font-['SUIT_Variable',sans-serif] text-[11pt] font-semibold tracking-tight"
  const beforeBarClass =
    'relative flex h-[320px] w-12 origin-bottom flex-col items-center bg-zinc-800 pt-2 dark:bg-zinc-200'
  const afterBarClass =
    'relative flex h-[80px] w-12 origin-bottom flex-col items-center bg-blue-600 pt-1.5'
  const barLabelClass =
    "pointer-events-none absolute top-2 left-1/2 z-[1] w-[4.5rem] -translate-x-1/2 text-center font-['SUIT_Variable',sans-serif] text-[10px] font-bold leading-tight tracking-tight"
  const axisLabelClass =
    "absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap font-['IBM_Plex_Mono',monospace] text-[10px] uppercase tracking-[0.08em]"

  const graph = (
    <div className="w-full">
      <div ref={rootRef} className={graphRootClass}>
        <motion.div
          className={graphGroupClass}
          {...reveal(
            { opacity: 1, x: '0%' },
            { opacity: 0, x: '40%' },
            {
              opacity: { duration: fadeDuration, delay: beforeBarDelay, ease: GRAPH_EASE },
              x: { duration: beforeSlideDuration, delay: beforeSlideDelay, ease: GRAPH_EASE },
            },
          )}
        >
          <div className={painColClass}>
            {IMPACT_MAPPINGS.map((item, index) => (
              <motion.div
                key={item.pain}
                className="rounded-none border border-black/10 bg-zinc-100 px-3 py-2.5 dark:border-white/15 dark:bg-zinc-800"
                {...reveal(
                  { opacity: 1, x: 0 },
                  { opacity: 0, x: 28 },
                  {
                    delay: painDelay + index * painStagger,
                    duration: painDuration,
                    ease: GRAPH_EASE,
                  },
                )}
              >
                <p className={`${labelType} text-black/45 dark:text-white/45`}>
                  Pain point {index + 1}
                </p>
                <p className={`mt-0.5 ${bodyType} text-black dark:text-[#f2f2f2]`}>
                  {item.pain}
                </p>
              </motion.div>
            ))}
          </div>
          <div className="relative shrink-0">
            <motion.span
              className={`${axisLabelClass} text-black/50 dark:text-white/50`}
              {...reveal({ opacity: 1 }, { opacity: 0 }, {
                delay: beforeBarDelay + t(0.15),
                duration: fadeDuration,
                ease: GRAPH_EASE,
              })}
            >
              Before · 100%
            </motion.span>
            <div className="relative">
              <motion.div
                className={beforeBarClass}
                {...reveal(
                  { scaleY: 1 },
                  { scaleY: 0 },
                  { duration: beforeBarDuration, ease: GRAPH_EASE, delay: beforeBarDelay },
                )}
              >
                <span
                  ref={beforeBarRef}
                  className="pointer-events-none absolute top-0 left-1/2 size-0 -translate-x-1/2"
                  aria-hidden
                />
                <span className={`${barLabelClass} text-white dark:text-zinc-900`}>
                  16 Tickets
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {line ? (
          <svg
            className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible"
            aria-hidden
          >
            <motion.path
              d={`M ${line.x1} ${line.y1} L ${line.x2} ${line.y2}`}
              fill="none"
              stroke="#EF4444"
              strokeWidth="1.33"
              strokeLinecap="round"
              strokeDasharray="5 5"
              {...(reduceMotion
                ? { initial: { pathLength: 1 }, transition: { duration: 0 } }
                : {
                    ...reveal(
                      { pathLength: 1 },
                      { pathLength: 0 },
                      { delay: lineDelay, duration: lineDuration, ease: GRAPH_EASE },
                    ),
                  })}
            />
            <motion.circle
              cx={line.x1}
              cy={line.y1}
              r="5"
              fill="#EF4444"
              {...reveal(
                { opacity: 1, scale: 1 },
                { opacity: 0, scale: 0 },
                reduceMotion
                  ? { duration: 0 }
                  : { delay: lineDelay, duration: fadeDuration, ease: GRAPH_EASE },
              )}
            />
            <motion.circle
              cx={line.x2}
              cy={line.y2}
              r="5"
              fill="#EF4444"
              {...reveal(
                { opacity: 1, scale: 1 },
                { opacity: 0, scale: 0 },
                reduceMotion
                  ? { duration: 0 }
                  : { delay: endDotDelay, duration: fadeDuration, ease: GRAPH_EASE },
              )}
            />
          </svg>
        ) : null}

        {badgeMid ? (
          <motion.div
            className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-none border border-[#EF4444]/25 bg-white px-3 py-2 dark:border-[#EF4444]/35 dark:bg-zinc-900"
            style={{ left: badgeMid.left - 10, top: badgeMid.top }}
            {...reveal(
              { opacity: 1, y: 0 },
              { opacity: 0, y: 16 },
              reduceMotion
                ? { duration: 0 }
                : { delay: badgeDelay, duration: badgeDuration, ease: GRAPH_EASE },
            )}
          >
            <p className={`${labelType} text-[#EF4444]/70`}>Impact</p>
            <p className={`mt-0.5 ${solutionBodyType} text-[#EF4444]`}>−75% Reduced</p>
          </motion.div>
        ) : null}

        <motion.div
          className={graphGroupClass}
          {...reveal(
            { opacity: 1, x: 0 },
            { opacity: 0, x: 20 },
            {
              opacity: { delay: afterBarDelay, duration: fadeDuration, ease: GRAPH_EASE },
              x: { delay: afterBarDelay, duration: afterGroupDuration, ease: GRAPH_EASE },
            },
          )}
        >
          <div className="relative shrink-0">
            <motion.span
              className={`${axisLabelClass} text-blue-600 dark:text-blue-400`}
              {...reveal({ opacity: 1 }, { opacity: 0 }, {
                delay: afterBarDelay + t(0.1),
                duration: fadeDuration,
                ease: GRAPH_EASE,
              })}
            >
              After · 25%
            </motion.span>
            <div className="relative">
              <motion.div
                className={afterBarClass}
                {...reveal(
                  { scaleY: 1 },
                  { scaleY: 0 },
                  { delay: afterBarDelay, duration: afterBarDuration, ease: GRAPH_EASE },
                )}
              >
                <span
                  ref={afterBarRef}
                  className="pointer-events-none absolute top-0 left-1/2 size-0 -translate-x-1/2"
                  aria-hidden
                />
                <span className={`${barLabelClass} text-white`}>4 Tickets</span>
              </motion.div>
            </div>
          </div>
          <div className={painColClass}>
            {IMPACT_MAPPINGS.map((item, index) => (
              <motion.div
                key={item.solution}
                className="rounded-none bg-blue-600 px-3 py-2.5 text-white"
                {...reveal(
                  { opacity: 1, x: 0 },
                  { opacity: 0, x: -28 },
                  {
                    delay: solutionDelay + index * solutionStagger,
                    duration: solutionDuration,
                    ease: GRAPH_EASE,
                  },
                )}
              >
                <p className={`${labelType} text-white/70`}>Solution {index + 1}</p>
                <p className={`mt-0.5 ${solutionBodyType}`}>{item.solution}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {!hideCaption ? (
      <div className={`mt-6 ${MD_COLS} ${MD_GUTTER}`}>
        <motion.p
          className={`${MD_ARTICLE} font-['SUIT_Variable',sans-serif] text-[10pt] font-normal leading-snug tracking-tight text-zinc-500 dark:text-zinc-400`}
          {...reveal(
            { opacity: 1, y: 0 },
            { opacity: 0, y: 8 },
            { delay: captionDelay, duration: afterGroupDuration, ease: GRAPH_EASE },
          )}
        >
          The remaining 4 complaint tickets were related to internal policy constraints that could
          not be resolved immediately. Effectively, 100% of the user complaints directly related to
          the Editor Tool&apos;s UX/UI design were resolved through this update.
        </motion.p>
      </div>
      ) : null}
    </div>
  )

  return embed ? (
    <FitToWidthShell onLayoutChange={updateConnector}>{graph}</FitToWidthShell>
  ) : (
    graph
  )
}

function parseObsidianMarkdown(raw: unknown) {
  if (raw == null) {
    throw new Error(
      'Missing file: raw import is undefined. Verify `../_content/Piik AI.md?raw` exists and Vite includes `_content/`.',
    )
  }

  if (typeof raw !== 'string') {
    throw new Error(`Parsing error: expected a string from ?raw import, got ${typeof raw}.`)
  }

  const trimmed = raw.trim()
  if (trimmed.length === 0) {
    throw new Error(
      'Missing file: raw markdown is an empty string. The file may be missing, unreadable, or not bundled.',
    )
  }

  const frontmatterMatch = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/u.exec(trimmed)
  if (!frontmatterMatch) {
    throw new Error(
      'Parsing error: no YAML frontmatter block found. Expected opening `---`, fields, closing `---`, then body.',
    )
  }

  const [, frontmatter, body] = frontmatterMatch
  const titleMatch = /^title:\s*(.+)$/m.exec(frontmatter)
  const roleMatch = /^role:\s*(.+)$/m.exec(frontmatter)
  const thumbnailLightMatch = /^thumbnail_light:\s*(.+)$/m.exec(frontmatter)
  const thumbnailDarkMatch = /^thumbnail_dark:\s*(.+)$/m.exec(frontmatter)
  const highlightMatch = /^highlight:\s*(.+)$/m.exec(frontmatter)

  const title = titleMatch?.[1]?.trim() ?? ''
  const role = roleMatch?.[1]?.trim() ?? ''
  const thumbnailLight = thumbnailLightMatch?.[1]?.trim() ?? '/piikai/Thumbnail-light.jpg'
  const thumbnailDark = thumbnailDarkMatch?.[1]?.trim() ?? '/piikai/Thumbnail-dark.jpg'
  const highlight = highlightMatch?.[1]?.trim().replace(/^["']|["']$/g, '') ?? ''

  if (!title) {
    throw new Error('Parsing error: frontmatter is missing a `title:` field.')
  }

  return {
    ...enrichVaultBody(title, role, body.trim()),
    thumbnailLight,
    thumbnailDark,
    highlight,
  }
}

function errorKind(message: string): 'missing' | 'parse' | 'runtime' {
  if (/missing file/i.test(message)) return 'missing'
  if (/parsing error/i.test(message)) return 'parse'
  return 'runtime'
}

function TestPiikErrorPanel({
  error,
  rawPreview,
}: {
  error: Error
  rawPreview: unknown
}) {
  const kind = errorKind(error.message)
  const kindLabel =
    kind === 'missing' ? 'MISSING FILE' : kind === 'parse' ? 'PARSING ERROR' : 'RUNTIME ERROR'

  const preview =
    typeof rawPreview === 'string'
      ? rawPreview.slice(0, 480) + (rawPreview.length > 480 ? '\n… [truncated]' : '')
      : rawPreview == null
        ? '(import returned null/undefined)'
        : String(rawPreview)

  return (
    <TestProjectDetailShell>
      <header className={`${MD_PAGE_MARGIN} border-b ${MD_BORDER} py-6 sm:py-8`}>
        <p className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${MD_INK_FAINT}`}>
          /test-piik-ai · error state
        </p>
        <h1 className={`mt-4 text-[clamp(1.75rem,5vw,2.5rem)] font-semibold leading-[1.05] tracking-[-0.06em] ${MD_INK}`}>
          Error Loading Markdown
        </h1>
        <p className={`mt-3 text-[11px] font-bold uppercase tracking-[0.08em] ${MD_INK}`}>
          [{kindLabel}]
        </p>
      </header>

      <section className={`${MD_PAGE_MARGIN} border-b ${MD_BORDER} py-6 sm:py-8`}>
        <p className={`text-[12px] font-normal leading-relaxed text-black/85 dark:text-white/85`}>{error.message}</p>
        {error.stack ? (
          <pre
            className={`mt-4 overflow-x-auto border ${MD_BORDER} ${MD_SURFACE_CONTAINER_LOW} ${MD_SHAPE_LARGE} p-3 text-[10px] font-normal leading-relaxed text-black/70 dark:text-white/70`}
          >
            {error.stack}
          </pre>
        ) : null}
      </section>

      <section className={`${MD_PAGE_MARGIN} py-6 sm:py-8`}>
        <p className={`mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-black/55 dark:text-white/55`}>
          Raw import preview
        </p>
        <pre
          className={`overflow-x-auto border ${MD_BORDER} bg-black/[0.04] dark:bg-white/[0.06] ${MD_SHAPE_LARGE} p-3 text-[10px] font-normal leading-relaxed text-black/75 dark:text-white/75`}
        >
          {preview}
        </pre>
      </section>
    </TestProjectDetailShell>
  )
}

export function TestPiik() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { isDark } = usePageTheme()
  const [bgColor, setBgColor] = useState(PIIK_BG_HERO)
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>('light')

  const handleScrollBg = useCallback((nextBg: string, nextTheme: 'light' | 'dark') => {
    setBgColor((previous) => (previous === nextBg ? previous : nextBg))
    setActiveTheme((previous) => (previous === nextTheme ? previous : nextTheme))
  }, [])

  try {
    const vault = parseObsidianMarkdown(piikMarkdown)
    const surfaceDark = isDark || activeTheme === 'dark'
    const currentColors = isDark ? piikDarkModeColors : piikLightModeColors
    const activeColorIndex = PIIK_BG_COLOR_INDEX[bgColor] ?? 0
    const heroBackgroundColor = isDark ? piikHeroDarkColor : piikLightModeColors[0]
    const activeBgColor =
      activeColorIndex === 0
        ? heroBackgroundColor
        : (currentColors[activeColorIndex] ?? heroBackgroundColor)

    return (
      <TestProjectDetailShell
        scrollRef={scrollRef}
        backTo="/"
        popupChrome="portfolio"
        popupTitle={vault.title}
        popupTitleBarClassName="bg-[#24324A] dark:bg-[#24324A]"
        popupTitleBarTitleClassName="text-[#f2f2f2]"
        sheetClassName={`rounded-none bg-[var(--active-section-bg)] transition-colors duration-500 ease-in-out will-change-colors ${
          surfaceDark ? 'dark' : ''
        }`}
        sheetStyle={
          {
            '--active-section-bg': activeBgColor,
            transition: 'background-color 500ms ease-in-out',
            willChange: 'background-color',
          } as CSSProperties
        }
      >
        <TestProjectBody
          title={vault.title}
          role={vault.role}
          subtitle={vault.subtitle}
          headline={vault.highlight || vault.headline}
          tagline={vault.tagline}
          content={vault.content}
          assetBasePath="/piikai"
          scrollRoot={scrollRef}
          leadExtra={<PiikImpactStoryGraph />}
          fullWidthSectionContainers={[
            'Listening to Our Users',
            'Why Do Our Users Want More Features?',
            'Unpacking the Solution 01',
            'Unpacking the Solution 02',
            'Unpacking the Solution 03',
          ]}
          featureMediaRightSections={[
            'Unpacking the Solution 02',
            'Unpacking the Solution 03',
          ]}
          replaceFeatureMediaRight={{
            'Listening to Our Users': () => (
              <div className="relative left-1/2 w-[100dvw] max-w-none -translate-x-1/2 px-4 sm:px-6">
                <PiikFeedbackEmailCollage mode="inView" className="max-w-[36.4rem]" />
              </div>
            ),
            'The Core Challenge: Restrictive MVP': (section) => (
              <PiikCoreChallengeProblems features={section.features} />
            ),
            'Why Do Our Users Want More Features?': () => <PiikResearchFindings />,
            'Unpacking the Solution 01': (section) => (
              <PiikSolution01FeatureMedia features={section.features} featureStartIndex={1} />
            ),
          }}
          slideUpTextSections={[
            'Unpacking the Solution 01',
            'Unpacking the Solution 02',
            'Unpacking the Solution 03',
          ]}
          delayedFeatureMediaSections={[
            'The Core Challenge: Restrictive MVP',
            'Why Do Our Users Want More Features?',
            'Unpacking the Solution 01',
            'Unpacking the Solution 02',
            'Unpacking the Solution 03',
          ]}
          featureStartIndexBySection={{
            'Unpacking the Solution 02': 3,
            'Unpacking the Solution 03': 4,
          }}
          heroLayout="aside"
          hero={
            <img
              src={isDark ? vault.thumbnailDark : vault.thumbnailLight}
              alt=""
              className="block h-auto w-full rounded-none object-cover"
            />
          }
          spyTheme={isDark ? 'dark' : activeTheme}
          scrollBg={{
            hero: PIIK_BG_HERO,
            heroTheme: 'light',
            lead: PIIK_BG_LIGHT,
            leadTheme: 'light',
            bySectionTitle: PIIK_SECTION_BG,
            bySectionTheme: PIIK_SECTION_THEME,
            fallback: PIIK_BG_LIGHT,
            fallbackTheme: 'light',
            onChange: handleScrollBg,
          }}
        />
      </TestProjectDetailShell>
    )
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    console.error('[TestPiik] Failed to load or parse markdown:', error)
    return <TestPiikErrorPanel error={error} rawPreview={piikMarkdown} />
  }
}
