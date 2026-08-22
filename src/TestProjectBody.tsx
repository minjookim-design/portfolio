import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  Children,
  isValidElement,
  type ReactNode,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { usePageTheme } from './context/PageThemeContext'
import { useTestProjectSheetChrome } from './context/TestProjectSheetChromeContext'
import {
  MD_ARTICLE,
  MD_COLS,
  MD_GUTTER,
  MD_INK,
  MD_INK_FAINT,
  MD_MEDIA_FULL,
  MD_PAGE_MARGIN,
  MD_PROJECT_PAGE_MAX,
} from './testMd3Layout'
import {
  BLUEPRINT_DURATION,
  BLUEPRINT_EASE,
} from './components/HomeBlueprintReveal'
import {
  TEST_HOME_PROJECT_TITLE_SERIF,
} from './pages/testHomeTypography'

/** Section titles (`###`) — Chosun, 2pt over home content heading (27→29). */
const SECTION_H3 =
  "font-['ChosunIlboMyungjo',serif] text-[29px] font-normal not-italic leading-[1.1] tracking-[-0.06em]"

const EASE = [0.4, 0, 0.2, 1] as const
const revealTransition = { duration: 0.55, ease: EASE }

/** Article text band — 8 centered cols on expanded Material grid. */
const TEXT_COL = MD_ARTICLE
/** Media row spans full Material grid width inside page margins. */
const MEDIA_FULL = MD_MEDIA_FULL
const MEDIA_ROW = `${MEDIA_FULL} mt-12 md:mt-16`

/** Feature titles / meta — IBM Plex Mono. */
const HOME_BODY_MONO =
  "font-['IBM_Plex_Mono',monospace] text-[12px] font-normal leading-[1.2] tracking-[-0.02em]"
const HOME_META_MONO =
  "font-['IBM_Plex_Mono',monospace] text-[12px] font-bold not-italic uppercase leading-[1.2]"
/** Project page prose body — SUIT Variable, 12pt, muted. */
const HOME_BODY_FREE =
  "font-['SUIT_Variable',sans-serif] text-[12pt] font-normal leading-[1.2] tracking-[-0.02em] text-[color:var(--color-muted,#666666)] dark:text-white/75"
/** Prose `####` / lead subhead — SUIT 14pt semibold. */
const HOME_H4 =
  "font-['SUIT_Variable',sans-serif] text-[14pt] font-semibold leading-[1.2] tracking-[-0.02em] text-black dark:text-[#f2f2f2]"

/** Shared prose spacing — lead block + markdown sections. */
const PROSE_BLOCK = `${HOME_BODY_FREE} [&_p]:pt-4 [&_p:first-child]:pt-0 [&_h4]:mt-6 [&_h4]:mb-0 [&_h4]:font-['SUIT_Variable',sans-serif] [&_h4]:text-[14pt] [&_h4]:font-semibold [&_h4]:leading-[1.2] [&_h4]:tracking-[-0.02em] [&_h4]:text-black dark:[&_h4]:text-[#f2f2f2] [&_strong]:font-bold [&_strong]:text-black dark:[&_strong]:text-[#f2f2f2]`

/** Public typography tokens for project-specific section renderers. */
export const TEST_PROJECT_SECTION_TITLE_CLASS = SECTION_H3
export const TEST_PROJECT_SUBHEADING_CLASS = HOME_H4
export const TEST_PROJECT_PROSE_CLASS = PROSE_BLOCK

const MARKDOWN_MEDIA_CLASS =
  'block h-auto w-full rounded-none object-contain'

function getMarkdownChildNodes(children: ReactNode): ReactNode[] {
  return Children.toArray(children).filter(
    (child) => !(typeof child === 'string' && !child.trim()),
  )
}

function isMarkdownMediaElement(node: ReactNode): boolean {
  if (!isValidElement(node)) return false
  if (node.type === 'img' || node.type === 'video') return true
  const props = node.props as { src?: unknown }
  return typeof props.src === 'string' && /\.(mp4|webm)(?:\?|#|$)/i.test(props.src)
}

function mediaAltLabel(node: ReactNode): string {
  if (!isValidElement(node)) return ''
  const props = node.props as { alt?: string; 'aria-label'?: string; 'data-alt'?: string }
  return (props['aria-label'] || props['data-alt'] || props.alt || '').trim()
}

function mediaSrc(node: ReactNode): string {
  if (!isValidElement(node)) return ''
  const props = node.props as { src?: unknown }
  return typeof props.src === 'string' ? props.src : ''
}

/**
 * Before/after pair: start together; left stays at 0.5×; right holds last frame
 * until left finishes, then both restart in sync.
 */
/** Original (left) starts this many ms before New Solution (right). */
const SYNCED_PAIR_LEFT_LEAD_MS = 1000

function SyncedBeforeAfterPair({
  left,
  right,
}: {
  left: { src: string; label: string }
  right: { src: string; label: string }
}) {
  const leftRef = useRef<HTMLVideoElement>(null)
  const rightRef = useRef<HTMLVideoElement>(null)
  const startedRef = useRef(false)
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rightDelayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const seekingRef = useRef(false)

  const playBothNow = useCallback(() => {
    const a = leftRef.current
    const b = rightRef.current
    if (!a || !b) return
    a.playbackRate = 0.5
    b.playbackRate = 1
    if (rightDelayTimerRef.current) {
      clearTimeout(rightDelayTimerRef.current)
      rightDelayTimerRef.current = null
    }
    // Left leads by 1s wall-clock so Original starts earlier than New Solution.
    requestAnimationFrame(() => {
      void a.play().catch(() => {})
      rightDelayTimerRef.current = setTimeout(() => {
        rightDelayTimerRef.current = null
        void b.play().catch(() => {})
      }, SYNCED_PAIR_LEFT_LEAD_MS)
    })
  }, [])

  const seekBothToStart = useCallback(() => {
    const a = leftRef.current
    const b = rightRef.current
    if (!a || !b || seekingRef.current) return
    seekingRef.current = true
    a.pause()
    b.pause()
    if (rightDelayTimerRef.current) {
      clearTimeout(rightDelayTimerRef.current)
      rightDelayTimerRef.current = null
    }

    const seekToZero = (video: HTMLVideoElement) =>
      new Promise<void>((resolve) => {
        if (video.currentTime < 0.05) {
          video.currentTime = 0
          resolve()
          return
        }
        let settled = false
        const done = () => {
          if (settled) return
          settled = true
          video.removeEventListener('seeked', done)
          resolve()
        }
        video.addEventListener('seeked', done)
        video.currentTime = 0
        window.setTimeout(done, 250)
      })

    void Promise.all([seekToZero(a), seekToZero(b)]).then(() => {
      seekingRef.current = false
      playBothNow()
    })
  }, [playBothNow])

  const tryStart = useCallback(() => {
    const a = leftRef.current
    const b = rightRef.current
    if (!a || !b) return
    // Wait until both can play current frame (HAVE_CURRENT_DATA+).
    if (a.readyState < 2 || b.readyState < 2) return
    if (startedRef.current) return
    startedRef.current = true
    seekBothToStart()
  }, [seekBothToStart])

  useEffect(() => {
    startedRef.current = false
    seekingRef.current = false
    const a = leftRef.current
    const b = rightRef.current
    if (!a || !b) return

    const onLeftEnded = () => {
      // Hold both last frames, pause 2s, then restart in sync.
      a.pause()
      b.pause()
      if (rightDelayTimerRef.current) {
        clearTimeout(rightDelayTimerRef.current)
        rightDelayTimerRef.current = null
      }
      if (Number.isFinite(a.duration) && a.duration > 0) {
        a.currentTime = Math.max(0, a.duration - 0.05)
      }
      if (Number.isFinite(b.duration) && b.duration > 0) {
        b.currentTime = Math.max(0, b.duration - 0.05)
      }
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current)
      pauseTimerRef.current = setTimeout(() => {
        pauseTimerRef.current = null
        seekBothToStart()
      }, 2000)
    }
    const onRightEnded = () => {
      const r = rightRef.current
      if (!r) return
      r.pause()
      if (Number.isFinite(r.duration) && r.duration > 0) {
        r.currentTime = Math.max(0, r.duration - 0.05)
      }
    }

    const onCanPlay = () => tryStart()

    a.addEventListener('ended', onLeftEnded)
    b.addEventListener('ended', onRightEnded)
    a.addEventListener('canplay', onCanPlay)
    b.addEventListener('canplay', onCanPlay)
    a.addEventListener('loadeddata', onCanPlay)
    b.addEventListener('loadeddata', onCanPlay)
    tryStart()
    return () => {
      a.removeEventListener('ended', onLeftEnded)
      b.removeEventListener('ended', onRightEnded)
      a.removeEventListener('canplay', onCanPlay)
      b.removeEventListener('canplay', onCanPlay)
      a.removeEventListener('loadeddata', onCanPlay)
      b.removeEventListener('loadeddata', onCanPlay)
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current)
        pauseTimerRef.current = null
      }
      if (rightDelayTimerRef.current) {
        clearTimeout(rightDelayTimerRef.current)
        rightDelayTimerRef.current = null
      }
    }
  }, [left.src, right.src, seekBothToStart, tryStart])

  const items = [
    { ref: leftRef, ...left, rate: 0.5 },
    { ref: rightRef, ...right, rate: 1 },
  ] as const

  return (
    <div className="my-8 grid grid-cols-1 items-start gap-[4px] md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-start">
      {items.map((item, i) => (
        <figure key={item.src} className="flex min-w-0 flex-col items-stretch gap-3 self-start">
          <div className="w-full overflow-hidden rounded-none bg-[#ebe8dc] p-[8.4px] dark:bg-white/[0.08] md:p-[11.2px]">
            <video
              ref={item.ref}
              src={item.src}
              muted
              playsInline
              preload="auto"
              className={MARKDOWN_MEDIA_CLASS}
              aria-label={item.label || undefined}
              data-alt={item.label || undefined}
              onLoadedMetadata={(e) => {
                e.currentTarget.playbackRate = item.rate
                tryStart()
              }}
              onCanPlay={() => tryStart()}
            />
          </div>
          {item.label ? (
            <figcaption className="flex flex-row items-start gap-3 font-['SUIT_Variable',sans-serif] text-[11pt] font-bold leading-[1.2] tracking-[-0.02em] text-[color:var(--color-muted,#666666)] dark:text-white/75">
              <span className="w-6 shrink-0 opacity-60 tabular-nums">{i + 1}</span>
              <span className="min-w-0 uppercase tracking-[-0.02em] text-black opacity-90 dark:text-[#f2f2f2]">
                {item.label}
              </span>
            </figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  )
}

/** CMS embeds video via `![alt](/path/video.mp4)` — render inline with grid support. */
function createProjectMarkdownComponents(options?: {
  reduceMotion?: boolean | null
  scrollRoot?: RefObject<HTMLElement | null>
  /** When set, each blockquote increments this for wave stagger. */
  staggerRef?: { current: number }
}): Components {
  const reduceMotion = options?.reduceMotion ?? false
  const scrollRoot = options?.scrollRoot
  const staggerRef = options?.staggerRef

  return {
    img: ({ node: _node, ...props }) => {
      const src = typeof props.src === 'string' ? props.src : undefined
      const alt = typeof props.alt === 'string' ? props.alt : ''
      if (src && (src.endsWith('.mp4') || src.endsWith('.webm') || /\.(mp4|webm)(?:\?|#|$)/i.test(src))) {
        return (
          <video
            src={src}
            autoPlay
            loop
            muted
            playsInline
            className={MARKDOWN_MEDIA_CLASS}
            aria-label={alt || undefined}
            data-alt={alt || undefined}
          />
        )
      }
      return (
        <img
          {...props}
          alt={alt}
          className={MARKDOWN_MEDIA_CLASS}
          data-alt={alt || undefined}
        />
      )
    },
    blockquote: ({ children }) => {
      const staggerIndex = staggerRef ? staggerRef.current++ : 0
      return (
        <BlueprintTimelineCard
          staggerIndex={staggerIndex}
          reduceMotion={reduceMotion}
          scrollRoot={scrollRoot}
        >
          {children}
        </BlueprintTimelineCard>
      )
    },
    p({ children }) {
      const nodes = getMarkdownChildNodes(children)
      const mediaNodes = nodes.filter(isMarkdownMediaElement)
      const mediaOnly = mediaNodes.length > 0 && mediaNodes.length === nodes.length

      // Before/after pair: synced start; right waits for left; left stays 0.5×.
      if (mediaOnly && mediaNodes.length === 2) {
        const leftSrc = mediaSrc(mediaNodes[0]!)
        const rightSrc = mediaSrc(mediaNodes[1]!)
        if (leftSrc && rightSrc) {
          return (
            <SyncedBeforeAfterPair
              left={{ src: leftSrc, label: mediaAltLabel(mediaNodes[0]!) || 'Original' }}
              right={{ src: rightSrc, label: mediaAltLabel(mediaNodes[1]!) || 'New Solution' }}
            />
          )
        }
      }

      if (mediaOnly && mediaNodes.length > 1) {
        return (
          <div className="my-8 grid grid-cols-1 gap-[4px] md:grid-cols-2">
            {mediaNodes.map((node, i) => (
              <div
                key={i}
                className="w-full overflow-hidden rounded-none bg-[#ebe8dc] p-2 dark:bg-white/[0.08] md:p-2.5"
              >
                {node}
              </div>
            ))}
          </div>
        )
      }

      if (mediaOnly && mediaNodes.length === 1) {
        return (
          <div className="my-8 w-full overflow-hidden rounded-none bg-[#ebe8dc] p-2 dark:bg-white/[0.08] md:p-2.5">
            {mediaNodes[0]}
          </div>
        )
      }

      return <p className="mb-4">{children}</p>
    },
  }
}

type MarkdownSegment =
  | { kind: 'md'; text: string }
  | { kind: 'quotes'; quotes: string[] }

/** Peel `>` prefixes so inner markdown (headings, lists) can parse. */
function unwrapBlockquoteSource(quote: string): string {
  return quote
    .split('\n')
    .map((line) => line.replace(/^>\s?/, ''))
    .join('\n')
    .trim()
}

/** Split timeline quote into caption title (`###`) vs body (everything after). */
function splitQuoteTitleAndBody(md: string): { title: string; body: string } {
  const lines = md.split('\n')
  const first = lines[0]?.trim() ?? ''
  const heading = /^(#{1,6})\s+(.+)$/.exec(first)
  if (heading) {
    return {
      title: heading[2]!.trim(),
      body: lines.slice(1).join('\n').trim(),
    }
  }
  return { title: '', body: md.trim() }
}

/** Group consecutive Obsidian blockquotes for a shared blueprint card grid. */
function splitBlockquoteGroups(src: string): MarkdownSegment[] {
  const lines = src.split('\n')
  const segments: MarkdownSegment[] = []
  let proseBuf: string[] = []
  let quotes: string[] = []
  let currentQuote: string[] = []
  let i = 0

  const flushProse = () => {
    const text = proseBuf.join('\n')
    if (text.trim()) segments.push({ kind: 'md', text })
    proseBuf = []
  }

  const flushCurrentQuote = () => {
    if (currentQuote.length === 0) return
    quotes.push(currentQuote.join('\n'))
    currentQuote = []
  }

  const flushQuotes = () => {
    flushCurrentQuote()
    if (quotes.length === 0) return
    flushProse()
    segments.push({ kind: 'quotes', quotes })
    quotes = []
  }

  while (i < lines.length) {
    const line = lines[i]!
    if (/^>/.test(line)) {
      while (i < lines.length && /^>/.test(lines[i]!)) {
        currentQuote.push(lines[i]!)
        i++
      }
      flushCurrentQuote()
      // Blank lines between `>` blocks keep them in one timeline grid.
      while (
        i < lines.length &&
        lines[i]!.trim() === '' &&
        i + 1 < lines.length &&
        /^>/.test(lines[i + 1]!)
      ) {
        i++
      }
      if (i >= lines.length || !/^>/.test(lines[i]!)) flushQuotes()
    } else {
      flushQuotes()
      proseBuf.push(line)
      i++
    }
  }
  flushQuotes()
  flushProse()
  return segments
}

function ProjectMarkdown({
  children,
  reduceMotion = false,
  scrollRoot,
  /** When true, emit grid children: prose → TEXT_COL, quote grids → MEDIA_FULL. */
  asGridChildren = false,
  reveal,
  proseClassName = '',
}: {
  children: string
  reduceMotion?: boolean | null
  scrollRoot?: RefObject<HTMLElement | null>
  asGridChildren?: boolean
  reveal?: Record<string, unknown>
  proseClassName?: string
}) {
  const staggerRef = useRef(0)
  const segments = useMemo(() => splitBlockquoteGroups(children), [children])

  const proseComponents = useMemo(
    () => createProjectMarkdownComponents({ reduceMotion, scrollRoot, staggerRef }),
    [reduceMotion, scrollRoot],
  )

  const innerCardComponents = useMemo(() => {
    const base = createProjectMarkdownComponents({ reduceMotion, scrollRoot })
    return {
      ...base,
      // Inner card markdown is already unwrapped — don't nest another card.
      blockquote: ({ children: c }: { children?: ReactNode }) => <>{c}</>,
      ul: ({ children }) => (
        <ul className="m-0 list-none space-y-3 p-0 [counter-reset:tl-item]">{children}</ul>
      ),
      li: ({ children }) => (
        <li className="flex items-start gap-3 [counter-increment:tl-item]">
          <span
            aria-hidden
            className={`w-7 shrink-0 tabular-nums text-zinc-400 dark:text-zinc-500 before:content-[counter(tl-item,decimal-leading-zero)] ${HOME_BODY_MONO}`}
          />
          <div className="min-w-0 flex-1 leading-[1.2]">{children}</div>
        </li>
      ),
    } satisfies Components
  }, [reduceMotion, scrollRoot])

  return (
    <>
      {segments.map((segment, si) => {
        if (segment.kind === 'md') {
          const md = (
            <ReactMarkdown rehypePlugins={[rehypeRaw]} components={proseComponents}>
              {segment.text}
            </ReactMarkdown>
          )
          if (!asGridChildren) return <Fragment key={`md-${si}`}>{md}</Fragment>
          return (
            <motion.div
              key={`md-${si}`}
              className={`${TEXT_COL} ${proseClassName} ${PROSE_BLOCK}`}
              {...(reveal ?? {})}
            >
              {md}
            </motion.div>
          )
        }

        staggerRef.current = 0
        const grid = (
          <TimelineQuoteGrid
            quotes={segment.quotes}
            reduceMotion={reduceMotion}
            scrollRoot={scrollRoot}
            bodyComponents={innerCardComponents}
          />
        )
        if (!asGridChildren) return <Fragment key={`quotes-${si}`}>{grid}</Fragment>
        return (
          <div key={`quotes-${si}`} className={MEDIA_FULL}>
            {grid}
          </div>
        )
      })}
    </>
  )
}

function stripInlineMd(text: string) {
  return text.replace(/\*\*(.*?)\*\*/g, '$1').trim()
}

/** Split trailing `![...](...)` / `<video>` lines out of a lead prose blob. */
function splitLeadTextAndMedia(text: string): { lead: string; mediaMd: string } {
  const lines = text.split('\n')
  const mediaStart = lines.findIndex((line) =>
    /^\s*(?:!\[[^\]]*\]\([^)]+\)|<video\b)/i.test(line),
  )
  if (mediaStart < 0) {
    return { lead: stripInlineMd(text.replace(/\n/g, ' ')), mediaMd: '' }
  }
  const lead = stripInlineMd(lines.slice(0, mediaStart).join('\n').replace(/\n/g, ' '))
  const mediaMd = lines.slice(mediaStart).join('\n').trim()
  return { lead, mediaMd }
}

/** Pull opening `####` heading + following body from section prose for the lead block. */
function extractLeadFromProse(prose: string): { h4: string; lead: string; restProse: string } {
  const chunks = prose
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
  if (chunks.length === 0) return { h4: '', lead: '', restProse: '' }

  const first = chunks[0]!
  const h4Block = /^#{4}\s+([^\n]+)(?:\n([\s\S]*))?$/.exec(first)
  if (h4Block) {
    const h4 = h4Block[1]!.trim()
    const afterH4 = (h4Block[2] ?? '').trim()
    if (afterH4) {
      const { lead, mediaMd } = splitLeadTextAndMedia(afterH4)
      const rest = [mediaMd, ...chunks.slice(1)].filter(Boolean).join('\n\n')
      return { h4, lead, restProse: rest }
    }
    const next = chunks[1] ?? ''
    if (next) {
      const { lead, mediaMd } = splitLeadTextAndMedia(next)
      const rest = [mediaMd, ...chunks.slice(2)].filter(Boolean).join('\n\n')
      return { h4, lead, restProse: rest }
    }
    return { h4, lead: '', restProse: chunks.slice(1).join('\n\n') }
  }

  const { lead, mediaMd } = splitLeadTextAndMedia(first)
  const rest = [mediaMd, ...chunks.slice(1)].filter(Boolean).join('\n\n')
  return { h4: '', lead, restProse: rest }
}

/** Bottom-of-screen scroll spy — homepage spy invert aesthetic + 500ms transitions. */
const SPY_BAR =
  'pointer-events-none fixed left-1/2 bottom-[30px] z-[99998] flex w-max max-w-[calc(100%-1rem)] -translate-x-1/2'
/** Match HomePage `HOME_COL1_SUIT_TYPO` spy label type. */
const SPY_TYPO =
  "font-['SUIT_Variable',sans-serif] text-[9pt] font-normal uppercase leading-snug tracking-[0.06em]"

function spyItemClass(active: boolean, surfaceDark: boolean) {
  return `pointer-events-auto inline-flex h-auto min-h-0 w-auto shrink-0 items-center justify-center whitespace-nowrap rounded-none border-0 px-2 py-1.5 text-left outline-none transition-all duration-500 ease-in-out ${SPY_TYPO} ${
    active
      ? surfaceDark
        ? 'bg-white text-black'
        : 'bg-black text-white'
      : surfaceDark
        ? 'bg-transparent text-inherit hover:bg-white hover:text-black focus-visible:bg-white focus-visible:text-black'
        : 'bg-transparent text-inherit hover:bg-black hover:text-white focus-visible:bg-black focus-visible:text-white'
  }`
}

/** Index of a section whose vertical center is closest to the middle 20% band of `container`. */
function getActiveSectionIndex(container: HTMLElement, sectionEls: (HTMLElement | null)[]): number {
  const c = container.getBoundingClientRect()
  const bandTop = c.top + c.height * 0.4
  const bandBottom = c.top + c.height * 0.6
  const mid = c.top + c.height * 0.5

  let bestInBand = -1
  let bestInBandDist = Infinity
  let bestFallback = 0
  let bestFallbackDist = Infinity

  sectionEls.forEach((el, i) => {
    if (!el) return
    const r = el.getBoundingClientRect()
    const elCenter = r.top + r.height / 2
    const distMid = Math.abs(elCenter - mid)
    if (elCenter >= bandTop && elCenter <= bandBottom && distMid < bestInBandDist) {
      bestInBandDist = distMid
      bestInBand = i
    }
    if (distMid < bestFallbackDist) {
      bestFallbackDist = distMid
      bestFallback = i
    }
  })

  return bestInBand >= 0 ? bestInBand : bestFallback
}

export type ParsedVaultFields = {
  title: string
  role: string
  subtitle: string
  /** Opening `##` dek / case-study headline from Obsidian body. */
  headline: string
  tagline: string
  content: string
}

type FeatureItem = { title: string; description: string }
type SectionImage = { src: string; alt: string }
type SectionMedia =
  | { kind: 'image'; src: string; alt: string }
  | { kind: 'video'; src: string }

type ProjectSection = {
  title: string
  /** Markdown for prose paragraphs (lists/media stripped into structured fields). */
  prose: string
  features: FeatureItem[]
  images: SectionImage[]
  media: SectionMedia[]
  /** When true, media sits between title and body (matches Obsidian order). */
  mediaFirst: boolean
}

export type TestProjectSectionContent = Pick<
  ProjectSection,
  'title' | 'prose' | 'features' | 'media'
>

type ParsedProjectLayout = {
  leadTitle: string
  /** Obsidian `####` under the opening `###`, if present. */
  leadH4: string
  lead: string
  /** Trailing markdown in the opening section (inline media, etc.). */
  leadRestProse: string
  /** Legacy `<video>` tags extracted from the opening section. */
  leadMedia: SectionMedia[]
  /** True when Obsidian places media before the lead body paragraph (after `####`). */
  leadMediaFirst: boolean
  sections: ProjectSection[]
}

/** Pull subtitle, headline, and tagline out of markdown body so the header/hero can use them. */
export function enrichVaultBody(title: string, role: string, rawBody: string): ParsedVaultFields {
  let content = rawBody.trim()
  let subtitle = ''
  let headline = ''
  let tagline = ''

  const h1 = /^#\s+(.+)\r?\n/.exec(content)
  if (h1) {
    subtitle = h1[1].trim()
    content = content.slice(h1[0].length).trimStart()
  }

  const h2 = /^##\s+(.+)\r?\n/.exec(content)
  if (h2) {
    headline = h2[1].trim()
    content = content.slice(h2[0].length).trimStart()
  }

  const boldLine = /^\*\*(.+?)\*\*\s*\r?\n/.exec(content)
  if (boldLine) {
    tagline = boldLine[1].trim()
    content = content.slice(boldLine[0].length).trimStart()
  }

  content = content.replace(/^!\[[^\]]*\]\([^)]+\)\s*/u, '').trimStart()

  return { title, role, subtitle, headline, tagline, content }
}

function parseFeatureLine(raw: string): FeatureItem | null {
  const text = raw.replace(/^\s*[-*+]\s+/, '').replace(/^\s*\d+\.\s+/, '').trim()
  const m = /^\*\*(.+?)\*\*[:：]?\s*(.*)$/u.exec(text)
  if (m) {
    return { title: m[1].trim(), description: m[2].trim() }
  }
  if (!text) return null
  return { title: '', description: text }
}

function parseProjectLayout(content: string, assetBasePath = ''): ParsedProjectLayout {
  const cleaned = content.replace(/^---\s*$/gm, '').trim()
  const parts = cleaned.split(/^###\s+/m).filter((p) => p.trim().length > 0)

  const sections: ProjectSection[] = parts.map((part) => {
    const newline = part.indexOf('\n')
    const title = (newline === -1 ? part : part.slice(0, newline)).trim()
    let body = newline === -1 ? '' : part.slice(newline + 1).trim()

    const images: SectionImage[] = []
    const media: SectionMedia[] = []
    const mediaFirst = /^\s*(?:!\[[^\]]*\]\([^)]+\)|<video\b)/i.test(body)

    body = body.replace(/!\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, (_full, file: string) => {
      const name = file.trim()
      if (!name) return ''
      const base = assetBasePath.replace(/\/$/, '')
      const src = name.startsWith('/') ? name : `${base}/${name.replace(/^\.\//, '')}`
      media.push({ kind: 'image', src, alt: name.replace(/\.[^.]+$/, '') })
      return ''
    })

    // Keep `![alt](path)` in prose for ReactMarkdown; only strip legacy `<video>` tags.
    body = body.replace(
      /<video\b([^>]*)>(?:[\s\S]*?<\/video>)?/gi,
      (_full, attrs: string) => {
        const src = /\bsrc=["']([^"']+)["']/i.exec(attrs)?.[1]?.trim()
        if (src) {
          const base = assetBasePath.replace(/\/$/, '')
          const resolvedSrc = src.startsWith('/')
            ? src
            : `${base}/${src.replace(/^\.\//, '')}`
          media.push({ kind: 'video', src: resolvedSrc })
        }
        return ''
      },
    )

    const features: FeatureItem[] = []
    const lines = body.split('\n')
    const proseLines: string[] = []
    let inList = false
    const listBuf: string[] = []

    const flushList = () => {
      if (!inList) return
      for (const line of listBuf) {
        const item = parseFeatureLine(line)
        if (item) features.push(item)
      }
      listBuf.length = 0
      inList = false
    }

    for (const line of lines) {
      if (/^\s*([-*+]|\d+\.)\s+/.test(line)) {
        inList = true
        listBuf.push(line)
      } else if (inList && /^\s+\S/.test(line)) {
        listBuf[listBuf.length - 1] = `${listBuf[listBuf.length - 1]} ${line.trim()}`
      } else {
        flushList()
        proseLines.push(line)
      }
    }
    flushList()

    return {
      title,
      prose: proseLines.join('\n').trim(),
      features,
      images,
      media,
      mediaFirst,
    }
  })

  const leadTitle = sections[0]?.title ?? ''
  const {
    h4: leadH4,
    lead,
    restProse,
  } = extractLeadFromProse(sections[0]?.prose ?? '')

  let leadRestProse = ''
  let leadMedia: SectionMedia[] = []
  let leadMediaFirst = false

  if (sections[0] && (lead || leadH4)) {
    leadRestProse = restProse
    leadMedia = sections[0].media
    leadMediaFirst = sections[0].mediaFirst
    sections.shift()
  }

  return { leadTitle, leadH4, lead, leadRestProse, leadMedia, leadMediaFirst, sections }
}

function useReveal(scrollRoot?: RefObject<HTMLElement | null>, reduceMotion?: boolean | null) {
  return useMemo(() => {
    if (reduceMotion || !scrollRoot) return {}
    return {
      initial: { opacity: 0, y: 22 },
      whileInView: { opacity: 1, y: 0 },
      viewport: {
        root: scrollRoot,
        once: true,
        amount: 0.15,
        margin: '0px 0px -6% 0px',
      } as const,
      transition: revealTransition,
    }
  }, [scrollRoot, reduceMotion])
}

function SectionMediaPanel({
  item,
  reveal,
  playbackRate = 1,
  embedded = false,
  showControls = true,
}: {
  item: SectionMedia
  reveal: Record<string, unknown>
  playbackRate?: number
  embedded?: boolean
  showControls?: boolean
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = videoRef.current
    if (!el || item.kind !== 'video') return
    el.playbackRate = playbackRate
  }, [item.kind, item.src, playbackRate])

  return (
    <motion.div
      className={
        embedded
          ? 'min-w-0 overflow-hidden rounded-none bg-[#ebe8dc] p-2 dark:bg-white/[0.08] md:p-2.5'
          : `${MEDIA_FULL} mt-6 md:mt-8 rounded-none`
      }
      {...reveal}
    >
      {item.kind === 'image' ? (
        <img src={item.src} alt={item.alt} className="block h-auto w-full object-contain" />
      ) : (
        <video
          ref={videoRef}
          src={item.src}
          className="block h-auto w-full"
          controls={showControls}
          autoPlay
          loop
          muted
          playsInline
          onLoadedMetadata={(e) => {
            e.currentTarget.playbackRate = playbackRate
          }}
        />
      )}
    </motion.div>
  )
}

/** System-core hairline used for drawn blueprint card edges. */
const BLUEPRINT_BORDER_FILL = 'bg-[color:var(--color-blueprint-hairline)]'
/**
 * Timeline beat per card (no arrows):
 * Caption → Number flash → Borders → Text
 * Base times at 1×; TIMELINE_SPEED scales playback (1.5 = 50% faster).
 */
const TIMELINE_SPEED = 1.5
const timelineT = (seconds: number) => seconds / TIMELINE_SPEED
const TIMELINE_BASE_STEP = timelineT(3.5)
const TIMELINE_CAPTION_OFFSET = timelineT(0)
const TIMELINE_FLASH_OFFSET = timelineT(0.8)
const TIMELINE_BORDER_OFFSET = timelineT(1.8)
const TIMELINE_TEXT_OFFSET = timelineT(2.6)
const TIMELINE_CAPTION_DURATION = timelineT(0.8)
const TIMELINE_FLASH_DURATION = timelineT(1.0)
const TIMELINE_BORDER_DURATION = timelineT(1.2)
const TIMELINE_TEXT_DURATION = timelineT(0.8)
/** Calm ease — premium, deliberate motion at slower paces. */
const TIMELINE_EASE: [number, number, number, number] = [0.25, 1, 0.5, 1]
/** Legacy feature-list cards keep a tighter stagger. */
const FEATURE_CARD_STAGGER = 0.15
const FEATURE_TEXT_OFFSET = BLUEPRINT_DURATION * 0.45

/** Start when the grid is in the comfortable center band of the viewport. */
const TIMELINE_MOTION_VIEWPORT = {
  once: true,
  margin: '-20% 0px -20% 0px' as const,
}

function timelineBaseTime(index: number) {
  return index * TIMELINE_BASE_STEP
}

/** Blueprint box only — borders + body. Caption lives outside (TimelineQuoteCard). */
function BlueprintBox({
  children,
  reduceMotion,
  sequenceActive,
  borderDelay,
  textDelay,
  borderDuration = BLUEPRINT_DURATION,
  textDuration = BLUEPRINT_DURATION * 0.85,
  ease = BLUEPRINT_EASE,
}: {
  children: ReactNode
  reduceMotion?: boolean | null
  sequenceActive: boolean
  borderDelay: number
  textDelay: number
  borderDuration?: number
  textDuration?: number
  ease?: [number, number, number, number]
}) {
  const show = Boolean(reduceMotion) || sequenceActive

  const borderTransition = (delay: number) =>
    reduceMotion
      ? { duration: 0 }
      : { duration: borderDuration, ease, delay }

  return (
    <div className="relative min-w-0 overflow-visible bg-transparent p-6 [&_div]:outline-none">
      <motion.div
        aria-hidden
        className={`pointer-events-none absolute bottom-0 left-0 z-[2] w-[1px] ${BLUEPRINT_BORDER_FILL}`}
        initial={{ height: '0%' }}
        animate={{ height: show ? '100%' : '0%' }}
        transition={borderTransition(borderDelay)}
      />
      <motion.div
        aria-hidden
        className={`pointer-events-none absolute top-0 right-0 z-[2] w-[1px] ${BLUEPRINT_BORDER_FILL}`}
        initial={{ height: '0%' }}
        animate={{ height: show ? '100%' : '0%' }}
        transition={borderTransition(borderDelay)}
      />
      <motion.div
        aria-hidden
        className={`pointer-events-none absolute bottom-0 left-0 z-[2] h-[1px] ${BLUEPRINT_BORDER_FILL}`}
        initial={{ width: '0%' }}
        animate={{ width: show ? '100%' : '0%' }}
        transition={borderTransition(borderDelay)}
      />
      <motion.div
        aria-hidden
        className={`pointer-events-none absolute top-0 right-0 z-[2] h-[1px] ${BLUEPRINT_BORDER_FILL}`}
        initial={{ width: '0%' }}
        animate={{ width: show ? '100%' : '0%' }}
        transition={borderTransition(borderDelay)}
      />

      <motion.div
        className={`relative z-[1] ${HOME_BODY_FREE} [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:mt-0 [&_ul]:list-none [&_ul]:space-y-2 [&_ul]:p-0 [&_strong]:font-bold [&_strong]:text-black dark:[&_strong]:text-[#f2f2f2]`}
        initial={{ opacity: 0 }}
        animate={{ opacity: show ? 1 : 0 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: textDuration, ease, delay: textDelay }
        }
      >
        {children}
      </motion.div>
    </div>
  )
}

/**
 * Timeline quote — caption OUTSIDE the box, sequence:
 * Caption slide → Yellow number flash → Borders → Inner text
 */
function TimelineQuoteCard({
  staggerIndex,
  title,
  body,
  reduceMotion,
  sequenceActive,
  bodyComponents,
}: {
  staggerIndex: number
  title: string
  body: string
  reduceMotion?: boolean | null
  sequenceActive: boolean
  bodyComponents: Components
}) {
  const num = String(staggerIndex + 1).padStart(2, '0')
  const base = timelineBaseTime(staggerIndex)
  const show = Boolean(reduceMotion) || sequenceActive
  const numberRest = '#a1a1aa'
  const numberFlash = '#eab308'
  const numberGlow = '0px 0px 8px rgba(234, 179, 8, 0.8)'
  /** Yellow holds from flash start through border draw end, then eases back. */
  const flashFadeIn = TIMELINE_FLASH_DURATION * 0.35
  const flashFadeOut = TIMELINE_FLASH_DURATION * 0.45
  const glowUntilBoxEnd =
    TIMELINE_BORDER_OFFSET + TIMELINE_BORDER_DURATION - TIMELINE_FLASH_OFFSET
  const numberGlowDuration = glowUntilBoxEnd + flashFadeOut
  const numberGlowTimes = [
    0,
    Math.min(flashFadeIn / numberGlowDuration, 0.2),
    Math.max(glowUntilBoxEnd / numberGlowDuration, 0.55),
    1,
  ] as const

  return (
    <figure className="relative m-0 flex min-w-0 flex-col overflow-visible">
      {/* Caption OUTSIDE + ABOVE the blueprint box — animates first via BaseTime delays. */}
      {title ? (
        <motion.div
          className="mb-4 flex gap-3"
          initial={{ opacity: 0, y: 15 }}
          animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  duration: TIMELINE_CAPTION_DURATION,
                  ease: TIMELINE_EASE,
                  delay: base + TIMELINE_CAPTION_OFFSET,
                }
          }
        >
          <figcaption className="flex w-full flex-row items-start gap-3 font-['SUIT_Variable',sans-serif] text-[11pt] font-bold leading-[1.2] tracking-[-0.02em]">
            <motion.span
              className={`w-7 shrink-0 tabular-nums ${HOME_BODY_MONO}`}
              initial={{ color: numberRest, textShadow: 'none' }}
              animate={
                show
                  ? {
                      color: [numberRest, numberFlash, numberFlash, numberRest],
                      textShadow: ['none', numberGlow, numberGlow, 'none'],
                    }
                  : { color: numberRest, textShadow: 'none' }
              }
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      duration: numberGlowDuration,
                      ease: TIMELINE_EASE,
                      delay: base + TIMELINE_FLASH_OFFSET,
                      times: [...numberGlowTimes],
                    }
              }
            >
              {num}
            </motion.span>
            <h3 className="m-0 min-w-0 text-[11pt] font-bold uppercase leading-[1.2] tracking-[-0.02em] text-black dark:text-[#f2f2f2]">
              {title}
            </h3>
          </figcaption>
        </motion.div>
      ) : null}

      <BlueprintBox
        reduceMotion={reduceMotion}
        sequenceActive={sequenceActive}
        borderDelay={base + TIMELINE_BORDER_OFFSET}
        textDelay={base + TIMELINE_TEXT_OFFSET}
        borderDuration={TIMELINE_BORDER_DURATION}
        textDuration={TIMELINE_TEXT_DURATION}
        ease={TIMELINE_EASE}
      >
        {body ? (
          <ReactMarkdown rehypePlugins={[rehypeRaw]} components={bodyComponents}>
            {body}
          </ReactMarkdown>
        ) : null}
      </BlueprintBox>
    </figure>
  )
}

/** One in-view clock for the whole 2×2 so cascading delays stay ordered. */
function TimelineQuoteGrid({
  quotes,
  reduceMotion,
  bodyComponents,
}: {
  quotes: string[]
  reduceMotion?: boolean | null
  scrollRoot?: RefObject<HTMLElement | null>
  bodyComponents: Components
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, TIMELINE_MOTION_VIEWPORT)
  const sequenceActive = Boolean(reduceMotion) || inView

  return (
    <div
      ref={rootRef}
      className="relative my-8 grid grid-cols-1 gap-x-6 gap-y-10 overflow-visible md:grid-cols-2 md:gap-y-12"
    >
      {quotes.map((quote, qi) => {
        const { title, body } = splitQuoteTitleAndBody(unwrapBlockquoteSource(quote))
        return (
          <TimelineQuoteCard
            key={`q-${qi}`}
            staggerIndex={qi}
            title={title}
            body={body}
            reduceMotion={reduceMotion}
            sequenceActive={sequenceActive}
            bodyComponents={bodyComponents}
          />
        )
      })}
    </div>
  )
}

function BlueprintTimelineCard({
  staggerIndex,
  children,
  reduceMotion,
  scrollRoot: _scrollRoot,
  as: CardTag = 'blockquote',
  staggerStep = FEATURE_CARD_STAGGER,
  textOffset = FEATURE_TEXT_OFFSET,
}: {
  staggerIndex: number
  children: ReactNode
  reduceMotion?: boolean | null
  scrollRoot?: RefObject<HTMLElement | null>
  as?: 'blockquote' | 'figure' | 'div'
  staggerStep?: number
  textOffset?: number
}) {
  const hitRef = useRef<HTMLElement>(null)
  const inView = useInView(hitRef, TIMELINE_MOTION_VIEWPORT)
  const sequenceActive = Boolean(reduceMotion) || inView
  const base = staggerIndex * staggerStep

  return (
    <CardTag
      ref={hitRef as never}
      className="relative m-0 min-w-0 overflow-visible bg-transparent not-italic"
    >
      <BlueprintBox
        reduceMotion={reduceMotion}
        sequenceActive={sequenceActive}
        borderDelay={base}
        textDelay={base + textOffset}
      >
        {children}
      </BlueprintBox>
    </CardTag>
  )
}

function FeatureFigure({
  index,
  staggerIndex,
  title,
  description,
  media,
  reduceMotion,
  scrollRoot,
}: {
  index: number
  staggerIndex: number
  title: string
  description: string
  media?: SectionMedia
  reduceMotion: boolean | null
  scrollRoot?: RefObject<HTMLElement | null>
}) {
  return (
    <BlueprintTimelineCard
      as="figure"
      staggerIndex={staggerIndex}
      reduceMotion={reduceMotion}
      scrollRoot={scrollRoot}
      staggerStep={FEATURE_CARD_STAGGER}
      textOffset={FEATURE_TEXT_OFFSET}
    >
      {media?.kind === 'image' ? (
        <div className="mb-6 w-full overflow-hidden rounded-none bg-[#ebe8dc] p-2 dark:bg-white/[0.08]">
          <img src={media.src} alt={media.alt} className="block h-auto w-full object-contain" />
        </div>
      ) : null}
      <figcaption className="flex flex-row gap-4">
        <div className={`w-8 shrink-0 opacity-60 tabular-nums ${HOME_BODY_MONO}`}>{index}</div>
        <div className="min-w-0 max-w-[40vw] lg:max-w-none">
          {title ? (
            <div className="mb-1 font-medium uppercase text-black opacity-90 dark:text-[#f2f2f2]">
              {title}
            </div>
          ) : null}
          {description ? <div>{description}</div> : null}
        </div>
      </figcaption>
    </BlueprintTimelineCard>
  )
}

type TestProjectBodyProps = {
  title: string
  role?: string
  subtitle?: string
  /** Opening `##` from Obsidian — shown in aside hero left column. */
  headline?: string
  tagline?: string
  content: string
  /** Base URL for Obsidian `![[asset]]` embeds. */
  assetBasePath?: string
  scrollRoot?: RefObject<HTMLElement | null>
  /** Hero media slot (keeps layoutId FLIP in the sheet). Default: under the title row. */
  hero?: ReactNode
  /**
   * Hero placement:
   * - `below` (default): title row, then hero
   * - `above`: hero, then title row
   * - `aside`: left column = title/role/meta, right = hero (home split)
   */
  heroLayout?: 'below' | 'above' | 'aside'
  /** @deprecated Prefer `heroLayout="above"`. */
  heroFirst?: boolean
  headerExtra?: ReactNode
  /** Optional visual injected into the lead (“The Impact”) block after prose/media. */
  leadExtra?: ReactNode
  /** Project-specific renderer that receives parsed Obsidian section content. */
  sectionContentOverrides?: Record<
    string,
    (section: TestProjectSectionContent) => ReactNode
  >
  /** Full-width section shell with its existing inner project grid preserved. */
  fullWidthSectionContainers?: string[]
  /** Reference-style row with feature boxes left and section media right. */
  featureMediaRightSections?: string[]
  /**
   * Full-width media row that replaces default features + media for a section
   * (e.g. a phone carousel instead of the 7/3 feature–media grid).
   */
  replaceFeatureMediaRight?: Record<
    string,
    ReactNode | ((section: TestProjectSectionContent) => ReactNode)
  >
  /** Section titles and prose that reveal with a stronger bottom-to-top entrance. */
  slideUpTextSections?: string[]
  /** Full-width feature/media rows that fade in after their section text. */
  delayedFeatureMediaSections?: string[]
  /**
   * Optional per-feature images keyed by markdown `###` section title.
   * Index aligns with that section’s parsed feature list.
   */
  featureMediaBySection?: Record<string, Array<string | undefined | null>>
  /**
   * Optional override for the first yellow feature number in a section
   * (e.g. Solution 02 → 3, Solution 03 → 5).
   */
  featureStartIndexBySection?: Record<string, number>
  /**
   * Scroll-driven sheet background: `data-bg` + `data-theme` on hero/lead/sections.
   * `onChange` fires when a section crosses mid-viewport (~50%).
   */
  scrollBg?: {
    hero?: string
    heroTheme?: 'light' | 'dark'
    lead?: string
    leadTheme?: 'light' | 'dark'
    /** Keyed by markdown `###` section title. */
    bySectionTitle?: Record<string, string>
    bySectionTheme?: Record<string, 'light' | 'dark'>
    fallback?: string
    fallbackTheme?: 'light' | 'dark'
    onChange: (bgClass: string, theme: 'light' | 'dark') => void
  }
  /** Scroll-spy ink follows this theme (synced with immersive section surfaces). */
  spyTheme?: 'light' | 'dark'
}

/**
 * Project page layout — home theme (Chosun titles + IBM Plex Mono body, 10px media radius).
 * Left scroll spy under the hero matches original home second-column spy stack.
 */
export function TestProjectBody({
  title,
  role,
  subtitle,
  headline,
  tagline,
  content,
  assetBasePath,
  scrollRoot,
  hero,
  heroLayout,
  heroFirst = false,
  headerExtra,
  leadExtra,
  sectionContentOverrides,
  fullWidthSectionContainers,
  featureMediaRightSections,
  replaceFeatureMediaRight,
  slideUpTextSections,
  delayedFeatureMediaSections,
  featureMediaBySection,
  featureStartIndexBySection,
  scrollBg,
  spyTheme,
}: TestProjectBodyProps) {
  const resolvedHeroLayout: 'below' | 'above' | 'aside' =
    heroLayout ?? (heroFirst ? 'above' : 'below')
  const reduceMotion = useReducedMotion()
  const { isDark } = usePageTheme()
  const sheetChrome = useTestProjectSheetChrome()
  const sheetFullPage = sheetChrome?.sheetFullPage === true
  const reveal = useReveal(scrollRoot, reduceMotion)
  const { leadTitle, leadH4, lead, leadRestProse, leadMedia, leadMediaFirst, sections } = useMemo(
    () => parseProjectLayout(content, assetBasePath),
    [content, assetBasePath],
  )
  const scrollBgRootRef = useRef<HTMLDivElement>(null)
  /** True while spy-driven programmatic scroll runs — skip IO bg updates to avoid flash. */
  const isAutoScrolling = useRef(false)
  const autoScrollUnlockTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  /** Prefer scroll-surface theme for spy; fall back to page theme. */
  const spySurfaceDark = (spyTheme ?? (isDark ? 'dark' : 'light')) === 'dark'

  const spyItems = useMemo(() => {
    const items: { id: string; label: string }[] = []
    if (leadTitle) items.push({ id: 'lead', label: leadTitle })
    sections.forEach((section, i) => {
      const hasProse = section.prose.trim().length > 0
      if (!hasProse && section.features.length === 0 && section.media.length === 0) return
      if (!section.title.trim()) return
      items.push({ id: `section-${i}`, label: section.title })
    })
    return items
  }, [leadTitle, sections])

  const sectionElsRef = useRef<(HTMLElement | null)[]>([])
  const [activeSpyId, setActiveSpyId] = useState<string>(() => spyItems[0]?.id ?? '')

  useEffect(() => {
    sectionElsRef.current = sectionElsRef.current.slice(0, spyItems.length)
    if (spyItems.length === 0) return
    setActiveSpyId((prev) => (spyItems.some((s) => s.id === prev) ? prev : spyItems[0]!.id))
  }, [spyItems])

  const setSectionEl = useCallback((index: number, el: HTMLElement | null) => {
    sectionElsRef.current[index] = el
  }, [])

  const updateSpyFromScroll = useCallback(() => {
    if (isAutoScrolling.current) return
    const container = scrollRoot?.current
    if (!container || spyItems.length === 0) return
    const idx = getActiveSectionIndex(container, sectionElsRef.current)
    const next = spyItems[idx]?.id
    if (next) setActiveSpyId(next)
  }, [scrollRoot, spyItems])

  useEffect(() => {
    const container = scrollRoot?.current
    if (!container || spyItems.length === 0) return
    updateSpyFromScroll()
    container.addEventListener('scroll', updateSpyFromScroll, { passive: true })
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateSpyFromScroll) : null
    ro?.observe(container)
    return () => {
      container.removeEventListener('scroll', updateSpyFromScroll)
      ro?.disconnect()
    }
  }, [scrollRoot, spyItems, updateSpyFromScroll])

  const scrollBgOnChange = scrollBg?.onChange
  useEffect(() => {
    if (!scrollBgOnChange) return
    const root = scrollRoot?.current ?? null
    const scope = scrollBgRootRef.current
    if (!scope) return

    const nodes = scope.querySelectorAll<HTMLElement>('[data-bg]')
    if (nodes.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (isAutoScrolling.current) return
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        const top = visible[0]
        if (!top) return
        const bg = top.target.getAttribute('data-bg')
        const themeAttr = top.target.getAttribute('data-theme')
        const theme: 'light' | 'dark' = themeAttr === 'dark' ? 'dark' : 'light'
        if (bg) scrollBgOnChange(bg, theme)
      },
      // 0.5 = mid-viewport for typical sections; lower steps keep tall sections working.
      { root, threshold: [0.15, 0.35, 0.5, 0.75] },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [scrollRoot, scrollBgOnChange, leadTitle, sections, resolvedHeroLayout, hero])

  useEffect(() => {
    return () => {
      if (autoScrollUnlockTimer.current) clearTimeout(autoScrollUnlockTimer.current)
    }
  }, [])

  const scrollToSpy = useCallback(
    (id: string) => {
      const idx = spyItems.findIndex((s) => s.id === id)
      if (idx < 0) return
      const target = sectionElsRef.current[idx]
      if (!target) return

      setActiveSpyId(id)

      // Lock first so IntersectionObserver cannot flash intermediate section colors.
      isAutoScrolling.current = true
      if (autoScrollUnlockTimer.current) clearTimeout(autoScrollUnlockTimer.current)

      const bg = target.getAttribute('data-bg')
      const themeAttr = target.getAttribute('data-theme')
      const theme: 'light' | 'dark' = themeAttr === 'dark' ? 'dark' : 'light'
      if (bg && scrollBgOnChange) scrollBgOnChange(bg, theme)

      const container = scrollRoot?.current
      let unlocked = false

      const unlock = () => {
        if (unlocked) return
        unlocked = true
        isAutoScrolling.current = false
        if (autoScrollUnlockTimer.current) {
          clearTimeout(autoScrollUnlockTimer.current)
          autoScrollUnlockTimer.current = null
        }
        container?.removeEventListener('scroll', onScrollDuringAuto)
        container?.removeEventListener('scrollend', unlock)
        updateSpyFromScroll()
      }

      const onScrollDuringAuto = () => {
        // Keep lock until smooth scroll goes idle (covers long jumps past 1s).
        if (autoScrollUnlockTimer.current) clearTimeout(autoScrollUnlockTimer.current)
        autoScrollUnlockTimer.current = setTimeout(unlock, 160)
      }

      if (!reduceMotion && container) {
        container.addEventListener('scroll', onScrollDuringAuto, { passive: true })
        container.addEventListener('scrollend', unlock, { once: true })
      }

      target.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      })

      // Fallback when already in view (no scroll events) or `scrollend` unsupported.
      autoScrollUnlockTimer.current = setTimeout(unlock, reduceMotion ? 0 : 1000)
    },
    [spyItems, reduceMotion, scrollBgOnChange, scrollRoot, updateSpyFromScroll],
  )

  const headerReveal =
    reduceMotion || !scrollRoot
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: revealTransition,
        }

  const metaPrimary = [subtitle, tagline].find(
    (line) => line && line.toLowerCase() !== title.toLowerCase(),
  )
  const metaSecondary = [role, tagline]
    .filter((line): line is string => Boolean(line))
    .filter((line) => line.toLowerCase() !== title.toLowerCase())
    .filter((line) => line !== metaPrimary)
    .filter((line, i, arr) => arr.indexOf(line) === i)

  let figureIndex = 0

  const heroBlock = hero ? (
    <div className="relative h-full min-h-0 w-full overflow-hidden rounded-none">{hero}</div>
  ) : null

  const metaStack = (
    <motion.div className="sm:pt-1" {...headerReveal} transition={{ ...revealTransition, delay: 0.06 }}>
      {metaPrimary ? (
        <p className={`max-w-[40ch] ${HOME_META_MONO}`}>{metaPrimary}</p>
      ) : null}
      {metaSecondary.map((line) => (
        <p key={line} className={`mt-3 max-w-[40ch] ${HOME_BODY_MONO} ${MD_INK_FAINT}`}>
          {line}
        </p>
      ))}
      {headerExtra}
    </motion.div>
  )

  /** Aside hero stack: title → role → body `#` h1 → frontmatter highlight (all SUIT unless noted). */
  const HERO_SUIT = "font-['SUIT_Variable',sans-serif]"
  const HERO_OVERLINE = `${HERO_SUIT} text-[9pt] font-normal uppercase leading-snug tracking-[0.06em]`

  const asideHeroText = (
    <motion.div
      className="flex max-w-[36ch] flex-col"
      {...headerReveal}
      transition={{ ...revealTransition, delay: 0.06 }}
    >
      <h1 className={HOME_H4}>{title}</h1>
      {role ? <p className={`mt-2 ${HERO_OVERLINE} ${MD_INK_FAINT}`}>{role}</p> : null}
      {subtitle ? <h2 className={`mt-4 ${SECTION_H3}`}>{subtitle}</h2> : null}
      {headline ? (
        <p
          className={`mt-4 ${SECTION_H3} @max-[800px]/project-popup:text-[14pt]`}
        >
          {headline}
        </p>
      ) : null}
      {headerExtra}
    </motion.div>
  )

  const titleHeading = (
    <motion.h1
      className={`max-w-[18ch] text-[clamp(2.1rem,8.4vw,3rem)] md:text-[48px] ${TEST_HOME_PROJECT_TITLE_SERIF}`}
      {...headerReveal}
    >
      {title}
    </motion.h1>
  )

  const headlineBlock = headline ? (
    <motion.p
      className={`max-w-[36ch] ${SECTION_H3}`}
      {...headerReveal}
      transition={{ ...revealTransition, delay: 0.04 }}
    >
      {headline}
    </motion.p>
  ) : null

  const titleHeader = (
    <div className={MD_PROJECT_PAGE_MAX}>
      <header
        className={`${MD_PAGE_MARGIN} grid grid-cols-1 gap-6 pb-8 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] sm:gap-6 lg:pb-10 ${
          hero && resolvedHeroLayout === 'above' ? 'mt-8 pt-0 md:mt-12' : 'pt-0'
        }`}
      >
        {titleHeading}
        <div className="flex flex-col gap-4">
          {headlineBlock}
          {metaStack}
        </div>
      </header>
    </div>
  )

  const splitHero = hero && resolvedHeroLayout === 'aside' ? (
    <section
      className="system-core-local w-full"
      data-bg={scrollBg?.hero}
      data-theme={scrollBg?.heroTheme ?? 'light'}
    >
      <div className="system-core-grid" aria-hidden />
      <div className="relative z-[1] grid w-full grid-cols-1 md:grid-cols-[minmax(0,20%)_minmax(0,80%)] md:items-start">
        <aside className={`flex w-full flex-col justify-between gap-10 px-4 py-8 sm:px-6 md:py-10 ${MD_INK}`}>
          {asideHeroText}
        </aside>
        <div className="relative min-w-0 w-full pr-4 sm:pr-6 md:pt-10">{heroBlock}</div>
      </div>
    </section>
  ) : null

  return (
    <div ref={scrollBgRootRef} className={`pb-24 ${MD_INK} md:pb-32`}>
      {splitHero}
      {!splitHero && resolvedHeroLayout === 'above' ? (
        <>
          {heroBlock}
          {titleHeader}
        </>
      ) : null}
      {!splitHero && resolvedHeroLayout === 'below' ? (
        <>
          {titleHeader}
          {heroBlock}
        </>
      ) : null}

      <div className="relative w-full">
        {sheetFullPage && spyItems.length > 0 && typeof document !== 'undefined'
          ? createPortal(
              <nav
                aria-label="Section"
                className={`${SPY_BAR} bg-transparent ${
                  spySurfaceDark ? 'text-[#f2f2f2]' : 'text-black'
                }`}
              >
                <div className="pointer-events-auto relative z-[1] flex w-max items-stretch gap-2 bg-transparent">
                  {spyItems.map((item) => {
                    const active = item.id === activeSpyId
                    return (
                      <button
                        key={item.id}
                        type="button"
                        title={item.label}
                        aria-label={item.label}
                        aria-current={active ? 'true' : undefined}
                        onClick={() => scrollToSpy(item.id)}
                        className={spyItemClass(active, spySurfaceDark)}
                      >
                        <span>{item.label.toUpperCase()}</span>
                      </button>
                    )
                  })}
                </div>
              </nav>,
              document.body,
            )
          : null}

        <main className="w-full">
          <div
            className={`${MD_PROJECT_PAGE_MAX} ${MD_PAGE_MARGIN} ${MD_COLS} gap-x-2 gap-y-0 sm:gap-x-4 lg:gap-x-6 mt-0`}
          >
            {leadTitle ? (
              <section
                ref={(el) => setSectionEl(0, el)}
                id="lead"
                data-bg={scrollBg?.lead ?? scrollBg?.fallback}
                data-theme={scrollBg?.leadTheme ?? scrollBg?.fallbackTheme ?? 'light'}
                className="col-span-4 sm:col-span-8 min-[840px]:col-span-12 mt-[calc(4rem*1.3*1.4*0.8*1.15*1.2)] scroll-mt-24 md:mt-[calc(6rem*1.3*1.4*0.8*1.15*1.2)]"
              >
                <div className={`${MD_COLS} ${MD_GUTTER}`}>
                  <motion.p
                    className={`${TEXT_COL} mb-0 ${SECTION_H3}`}
                    {...reveal}
                  >
                    {leadTitle}
                  </motion.p>
                  {leadH4 || lead ? (
                    leadMediaFirst ? (
                      <>
                        {leadH4 ? (
                          <motion.div
                            className={`${TEXT_COL} ${leadTitle ? '-mt-[7px]' : ''} ${PROSE_BLOCK}`}
                            {...reveal}
                          >
                            <h4>{leadH4}</h4>
                          </motion.div>
                        ) : null}
                        {leadMedia.map((item, i) => (
                          <SectionMediaPanel key={`lead-media-${i}`} item={item} reveal={reveal} />
                        ))}
                        {lead ? (
                          <motion.div className={`${TEXT_COL} ${PROSE_BLOCK}`} {...reveal}>
                            <ProjectMarkdown reduceMotion={reduceMotion} scrollRoot={scrollRoot}>
                              {lead}
                            </ProjectMarkdown>
                          </motion.div>
                        ) : null}
                      </>
                    ) : (
                      <>
                        <motion.div
                          className={`${TEXT_COL} ${leadTitle ? '-mt-[7px]' : ''} ${PROSE_BLOCK}`}
                          {...reveal}
                        >
                          {leadH4 ? <h4>{leadH4}</h4> : null}
                          {lead ? (
                            <ProjectMarkdown reduceMotion={reduceMotion} scrollRoot={scrollRoot}>
                              {lead}
                            </ProjectMarkdown>
                          ) : null}
                        </motion.div>
                        {leadMedia.map((item, i) => (
                          <SectionMediaPanel key={`lead-media-${i}`} item={item} reveal={reveal} />
                        ))}
                      </>
                    )
                  ) : leadMedia.length > 0 ? (
                    leadMedia.map((item, i) => (
                      <SectionMediaPanel key={`lead-media-${i}`} item={item} reveal={reveal} />
                    ))
                  ) : null}
                  {leadExtra ? (
                    <motion.div className={`${MEDIA_FULL} mt-6 md:mt-8`} {...reveal}>
                      {leadExtra}
                    </motion.div>
                  ) : null}
                  {leadRestProse ? (
                    <motion.div className={`${MEDIA_FULL} ${PROSE_BLOCK}`} {...reveal}>
                      <ProjectMarkdown reduceMotion={reduceMotion} scrollRoot={scrollRoot}>
                        {leadRestProse}
                      </ProjectMarkdown>
                    </motion.div>
                  ) : null}
                </div>
              </section>
            ) : leadH4 || lead || leadMedia.length > 0 || leadRestProse || leadExtra ? (
              <>
                {leadMediaFirst ? (
                  <>
                    {leadH4 ? (
                      <motion.div
                        className={`${TEXT_COL} mt-16 md:mt-24 ${PROSE_BLOCK}`}
                        {...reveal}
                      >
                        <h4>{leadH4}</h4>
                      </motion.div>
                    ) : null}
                    {leadMedia.map((item, i) => (
                      <SectionMediaPanel key={`lead-media-${i}`} item={item} reveal={reveal} />
                    ))}
                    {lead ? (
                      <motion.div className={`${TEXT_COL} ${PROSE_BLOCK}`} {...reveal}>
                        <ProjectMarkdown reduceMotion={reduceMotion} scrollRoot={scrollRoot}>
                          {lead}
                        </ProjectMarkdown>
                      </motion.div>
                    ) : null}
                  </>
                ) : (
                  <>
                    {leadH4 || lead ? (
                      <motion.div
                        className={`${TEXT_COL} mt-16 md:mt-24 ${PROSE_BLOCK}`}
                        {...reveal}
                      >
                        {leadH4 ? <h4>{leadH4}</h4> : null}
                        {lead ? (
                          <ProjectMarkdown reduceMotion={reduceMotion} scrollRoot={scrollRoot}>
                            {lead}
                          </ProjectMarkdown>
                        ) : null}
                      </motion.div>
                    ) : null}
                    {leadMedia.map((item, i) => (
                      <SectionMediaPanel key={`lead-media-${i}`} item={item} reveal={reveal} />
                    ))}
                  </>
                )}
                {leadExtra ? (
                  <motion.div
                    className={`${MEDIA_FULL} ${leadH4 || lead || leadMedia.length > 0 ? 'mt-6 md:mt-8' : 'mt-16 md:mt-24'}`}
                    {...reveal}
                  >
                    {leadExtra}
                  </motion.div>
                ) : null}
                {leadRestProse ? (
                  <motion.div className={`${MEDIA_FULL} ${PROSE_BLOCK}`} {...reveal}>
                    <ProjectMarkdown reduceMotion={reduceMotion} scrollRoot={scrollRoot}>
                      {leadRestProse}
                    </ProjectMarkdown>
                  </motion.div>
                ) : null}
              </>
            ) : null}

            {sections.map((section, sectionIndex) => {
              const hasProse = section.prose.trim().length > 0
              if (
                !hasProse &&
                section.features.length === 0 &&
                section.media.length === 0
              ) {
                return null
              }

              const spyId = section.title.trim() ? `section-${sectionIndex}` : ''
              const spyIdx = spyId ? spyItems.findIndex((s) => s.id === spyId) : -1

              const mediaBlocks = section.media.map((item, i) => (
                <SectionMediaPanel
                  key={`${section.title}-media-${i}`}
                  item={item}
                  reveal={reveal}
                  playbackRate={item.kind === 'video' ? 0.7 : 1}
                  showControls={
                    !(
                      ['Unpacking the Solution 02', 'Unpacking the Solution 03'].includes(
                        section.title,
                      ) && item.kind === 'video'
                    )
                  }
                />
              ))
              const featureMediaReplacementRaw = replaceFeatureMediaRight?.[section.title]
              const featureMediaReplacement =
                typeof featureMediaReplacementRaw === 'function'
                  ? featureMediaReplacementRaw(section)
                  : featureMediaReplacementRaw
              const isFeatureMediaRight =
                !featureMediaReplacement &&
                featureMediaRightSections?.includes(section.title) === true &&
                section.features.length > 0 &&
                section.media.length > 0
              const slideTextAlignmentClass =
                slideUpTextSections?.includes(section.title) === true
                  ? '[--solution-text-x:0px] min-[840px]:[--solution-text-x:calc(-16.6667vw+1.5rem)] min-[1200px]:[--solution-text-x:calc(-30vw+1.5rem)]'
                  : ''
              const solutionTitleMatch = /^(.*?)(\d{2})$/.exec(section.title)
              const slideTextViewport = {
                root: scrollRoot,
                once: true,
                amount: 0.35,
                margin: '0px 0px -10% 0px',
              } as const
              const slideTextEase = [0.22, 1, 0.36, 1] as const
              const makeSlideTextReveal = (appearDelay: number) =>
                slideUpTextSections?.includes(section.title) && !reduceMotion && scrollRoot
                  ? {
                      initial: { opacity: 0, y: 56, x: 0 },
                      whileInView: {
                        opacity: 1,
                        y: 0,
                        x: 'var(--solution-text-x, 0px)',
                      },
                      viewport: slideTextViewport,
                      transition: {
                        opacity: {
                          delay: appearDelay,
                          duration: 0.8,
                          ease: slideTextEase,
                        },
                        y: {
                          delay: appearDelay,
                          duration: 0.8,
                          ease: slideTextEase,
                        },
                        x: {
                          delay: appearDelay + 0.9,
                          duration: 0.65,
                          ease: slideTextEase,
                        },
                      },
                    }
                  : reveal
              const titleReveal = makeSlideTextReveal(0)
              const proseReveal = makeSlideTextReveal(0.35)

              const proseBlock = hasProse ? (
                <ProjectMarkdown
                  asGridChildren
                  reduceMotion={reduceMotion}
                  scrollRoot={scrollRoot}
                  reveal={proseReveal}
                  proseClassName={
                    `${section.title && !section.mediaFirst ? '-mt-[7px]' : ''} ${slideTextAlignmentClass}`.trim()
                  }
                >
                  {section.prose}
                </ProjectMarkdown>
              ) : null

              const featureLeftMedia = section.media.find((item) => item.kind === 'image')
              const featureRightMedia =
                section.media.find((item) => item.kind === 'video') ??
                section.media.find((item) => item !== featureLeftMedia)
              const featureTextMedia = section.media.find(
                (item) => item !== featureLeftMedia && item !== featureRightMedia,
              )
              const featureTextOnLeft =
                Boolean(featureLeftMedia) || section.title === 'Unpacking the Solution 03'
              const sectionFeatureStartIndex =
                featureStartIndexBySection?.[section.title] ?? figureIndex + 1
              const sectionFeatureMedia = featureMediaBySection?.[section.title]
              const featureFigures = featureMediaReplacement
                ? []
                : section.features.map((feature, i) => {
                figureIndex += 1
                const mappedSrc = sectionFeatureMedia?.[i]?.trim()
                const mappedMedia: SectionMedia | undefined = mappedSrc
                  ? { kind: 'image', src: mappedSrc, alt: feature.title || `Feature ${figureIndex}` }
                  : undefined
                return (
                  <FeatureFigure
                    key={`${section.title}-f-${i}`}
                    index={
                      featureStartIndexBySection?.[section.title] != null
                        ? featureStartIndexBySection[section.title]! + i
                        : figureIndex
                    }
                    staggerIndex={i}
                    title={feature.title}
                    description={feature.description}
                    media={
                      mappedMedia ??
                      (isFeatureMediaRight && i === 0 ? featureLeftMedia : undefined)
                    }
                    reduceMotion={reduceMotion}
                    scrollRoot={scrollRoot}
                  />
                )
              })
              // Keep figureIndex aligned when a section uses an explicit start index.
              if (
                featureStartIndexBySection?.[section.title] != null &&
                section.features.length > 0
              ) {
                figureIndex = Math.max(
                  figureIndex,
                  featureStartIndexBySection[section.title]! + section.features.length - 1,
                )
              }
              // Replacement UIs that still show numbered solution features (e.g. Solution 01)
              // must advance the global figure index for later sections.
              if (
                featureMediaReplacement &&
                section.features.length > 0 &&
                section.title.startsWith('Unpacking the Solution') &&
                featureStartIndexBySection?.[section.title] == null
              ) {
                figureIndex += section.features.length
              }
              const featureBlock =
                featureFigures.length > 0 && !isFeatureMediaRight ? (
                  <div
                    className={`${MEDIA_ROW} grid ${MD_GUTTER} ${
                      featureFigures.length >= 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'
                    }`}
                  >
                    {featureFigures}
                  </div>
                ) : null
              const delayFeatureMedia =
                delayedFeatureMediaSections?.includes(section.title) === true
              const featureRevealBaseDelay = featureLeftMedia ? 1.25 : 0
              const sequentialMediaReveal = (delay: number) =>
                delayFeatureMedia && !reduceMotion
                  ? {
                      initial: { opacity: 0, y: 30 },
                      whileInView: { opacity: 1, y: 0 },
                      transition: {
                        duration: 0.5,
                        ease: 'easeOut' as const,
                        delay: featureRevealBaseDelay + delay,
                      },
                      viewport: { once: true, margin: '-100px' as const },
                    }
                  : {}
              const sequentialNumberGlow = (delay: number) =>
                delayFeatureMedia && !reduceMotion
                  ? {
                      initial: { textShadow: '0 0 10px rgba(253,224,71,0.9)' },
                      whileInView: { textShadow: '0 0 0 rgba(253,224,71,0)' },
                      transition: {
                        duration: 0.5,
                        ease: 'easeOut' as const,
                        delay: featureRevealBaseDelay + delay,
                      },
                      viewport: { once: true, margin: '-100px' as const },
                    }
                  : {}
              const firstFeatureDelay = featureLeftMedia
                ? 2.05 - featureRevealBaseDelay
                : 2.15
              const secondFeatureDelay = featureLeftMedia
                ? 2.3 - featureRevealBaseDelay
                : 2.45
              const shareRightPairReveal =
                Boolean(featureLeftMedia) && delayFeatureMedia && !reduceMotion
              const rightPairVariants = {
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    ease: 'easeOut' as const,
                    delay: featureRevealBaseDelay + secondFeatureDelay + 0.5,
                  },
                },
              }
              const rightPairTextVariants = {
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    ease: 'easeOut' as const,
                    delay: featureRevealBaseDelay + secondFeatureDelay,
                  },
                },
              }
              const featureMediaReplacementBlock = featureMediaReplacement ? (
                <motion.div
                  className={`${MEDIA_FULL} mt-[2.193rem] md:mt-[2.924rem]`}
                  {...sequentialMediaReveal(1.95)}
                >
                  {featureMediaReplacement}
                </motion.div>
              ) : null
              const featureMediaRightBlock = isFeatureMediaRight ? (
                <div
                  className={`${MEDIA_FULL} relative left-1/2 mt-[2.193rem] grid w-[100dvw] max-w-none -translate-x-1/2 grid-cols-1 items-start gap-2 px-4 sm:px-6 md:mt-[2.924rem] ${
                    featureTextOnLeft
                      ? 'md:grid-cols-[minmax(0,3fr)_minmax(0,7fr)]'
                      : 'md:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]'
                  }`}
                >
                  <figure
                    className={`relative flex min-w-0 flex-col items-stretch gap-3 self-start ${
                      featureTextOnLeft ? '' : 'md:order-2'
                    }`}
                  >
                    {!featureLeftMedia && featureTextMedia ? (
                      <motion.div {...sequentialMediaReveal(1.95)}>
                        <SectionMediaPanel
                          item={featureTextMedia}
                          reveal={{}}
                          playbackRate={featureTextMedia.kind === 'video' ? 0.7 : 1}
                          embedded
                          showControls={false}
                        />
                      </motion.div>
                    ) : null}
                    {featureLeftMedia ? (
                      <motion.div {...sequentialMediaReveal(0)}>
                        <SectionMediaPanel
                          item={featureLeftMedia}
                          reveal={delayFeatureMedia ? {} : reveal}
                          embedded
                        />
                      </motion.div>
                    ) : null}
                    {section.features[0] ? (
                      <motion.div {...sequentialMediaReveal(firstFeatureDelay)}>
                        <figcaption className="flex flex-row items-start gap-3 font-['SUIT_Variable',sans-serif] text-[11pt] leading-[1.2] tracking-[-0.02em] text-[color:var(--color-muted,#666666)] dark:text-white/75">
                          <motion.span
                            className="w-6 shrink-0 tabular-nums text-yellow-300"
                            {...sequentialNumberGlow(firstFeatureDelay)}
                          >
                            {sectionFeatureStartIndex}
                          </motion.span>
                          <span className="min-w-0">
                            <strong className="block font-bold uppercase tracking-[-0.02em] text-black opacity-90 dark:text-[#f2f2f2]">
                              {section.features[0].title}
                            </strong>
                            <span className="mt-1 block font-normal">
                              {section.features[0].description}
                            </span>
                          </span>
                        </figcaption>
                      </motion.div>
                    ) : null}
                    {!featureLeftMedia && section.features[1] ? (
                      <motion.div
                        className="mt-[2.4px]"
                        {...sequentialMediaReveal(secondFeatureDelay)}
                      >
                        <figcaption className="flex flex-row items-start gap-3 font-['SUIT_Variable',sans-serif] text-[11pt] leading-[1.2] tracking-[-0.02em] text-[color:var(--color-muted,#666666)] dark:text-white/75">
                          <motion.span
                            className="w-6 shrink-0 tabular-nums text-yellow-300"
                            {...sequentialNumberGlow(
                              secondFeatureDelay + (shareRightPairReveal ? 0.5 : 0),
                            )}
                          >
                            {sectionFeatureStartIndex + 1}
                          </motion.span>
                          <span className="min-w-0">
                            <strong className="block font-bold uppercase tracking-[-0.02em] text-black opacity-90 dark:text-[#f2f2f2]">
                              {section.features[1].title}
                            </strong>
                            <span className="mt-1 block font-normal">
                              {section.features[1].description}
                            </span>
                          </span>
                        </figcaption>
                      </motion.div>
                    ) : null}
                  </figure>
                  <motion.figure
                    className={`flex min-w-0 flex-col items-stretch gap-3 self-start ${
                      featureTextOnLeft ? '' : 'md:order-1'
                    }`}
                    initial={shareRightPairReveal ? 'hidden' : undefined}
                    whileInView={shareRightPairReveal ? 'visible' : undefined}
                    viewport={
                      shareRightPairReveal ? { once: true, margin: '-100px' } : undefined
                    }
                  >
                    {featureRightMedia ? (
                      <motion.div
                        variants={shareRightPairReveal ? rightPairVariants : undefined}
                        {...(shareRightPairReveal
                          ? {}
                          : featureLeftMedia
                            ? sequentialMediaReveal(0.5)
                            : sequentialMediaReveal(1.55))}
                      >
                        <SectionMediaPanel
                          item={featureRightMedia}
                          reveal={delayFeatureMedia ? {} : reveal}
                          playbackRate={featureRightMedia.kind === 'video' ? 0.7 : 1}
                          embedded
                          showControls={false}
                        />
                      </motion.div>
                    ) : null}
                    {featureLeftMedia && section.features[1] ? (
                      <motion.div
                        variants={shareRightPairReveal ? rightPairTextVariants : undefined}
                        {...(shareRightPairReveal
                          ? {}
                          : sequentialMediaReveal(secondFeatureDelay))}
                      >
                        <figcaption className="flex flex-row items-start gap-3 font-['SUIT_Variable',sans-serif] text-[11pt] leading-[1.2] tracking-[-0.02em] text-[color:var(--color-muted,#666666)] dark:text-white/75 md:w-[42.857%]">
                          <motion.span
                            className="w-6 shrink-0 tabular-nums text-yellow-300"
                            {...sequentialNumberGlow(secondFeatureDelay)}
                          >
                            {sectionFeatureStartIndex + 1}
                          </motion.span>
                          <span className="min-w-0">
                            <strong className="block font-bold uppercase tracking-[-0.02em] text-black opacity-90 dark:text-[#f2f2f2]">
                              {section.features[1].title}
                            </strong>
                            <span className="mt-1 block font-normal">
                              {section.features[1].description}
                            </span>
                          </span>
                        </figcaption>
                      </motion.div>
                    ) : null}
                  </motion.figure>
                </div>
              ) : null

              const isTakeaway = section.title.trim() === 'Takeaway'
              const customSectionRenderer = sectionContentOverrides?.[section.title]
              const customSectionContent = customSectionRenderer?.(section)
              const isFullWidthContainer =
                fullWidthSectionContainers?.includes(section.title) === true

              return (
                <section
                  key={section.title || `section-${sectionIndex}`}
                  ref={spyIdx >= 0 ? (el) => setSectionEl(spyIdx, el) : undefined}
                  id={spyId || undefined}
                  data-bg={
                    scrollBg?.bySectionTitle?.[section.title] ?? scrollBg?.fallback
                  }
                  data-theme={
                    scrollBg?.bySectionTheme?.[section.title] ??
                    scrollBg?.fallbackTheme ??
                    'light'
                  }
                  className={`col-span-4 sm:col-span-8 min-[840px]:col-span-12 mt-[calc(10rem*1.3*1.4*0.8*1.15*1.2)] scroll-mt-24 md:mt-[calc(14rem*1.3*1.4*0.8*1.15*1.2)] ${
                    isTakeaway
                      ? 'pb-[clamp(3.15rem,calc((38dvh-3.5rem)*0.63),11.34rem)] sm:pb-[clamp(3.78rem,calc((44dvh-4.5rem)*0.63),13.86rem)] lg:pb-[clamp(5.04rem,calc((50dvh-5.5rem)*0.63),17.64rem)]'
                      : ''
                  }`}
                >
                  <div
                    className={`${MD_COLS} ${MD_GUTTER} ${
                      isFullWidthContainer
                        ? 'relative left-1/2 w-[100dvw] max-w-none -translate-x-1/2'
                        : ''
                    }`}
                  >
                    <div
                      className={
                        isFullWidthContainer
                          ? `${MEDIA_FULL} ${MD_PROJECT_PAGE_MAX} ${MD_PAGE_MARGIN}`
                          : 'contents'
                      }
                    >
                      <div
                        className={
                          isFullWidthContainer ? `${MD_COLS} ${MD_GUTTER}` : 'contents'
                        }
                      >
                    {section.title && !customSectionContent ? (
                      <motion.h2
                        className={`${TEXT_COL} mb-0 ${SECTION_H3} ${slideTextAlignmentClass}`}
                        {...titleReveal}
                      >
                        {slideUpTextSections?.includes(section.title) && solutionTitleMatch ? (
                          <>
                            {solutionTitleMatch[1]}
                            <span
                              className={`text-yellow-300 transition-[text-shadow] duration-300 ${
                                activeSpyId === spyId
                                  ? '[text-shadow:0_0_12px_rgba(253,224,71,0.9)]'
                                  : '[text-shadow:none]'
                              }`}
                            >
                              {solutionTitleMatch[2]}
                            </span>
                          </>
                        ) : (
                          section.title
                        )}
                      </motion.h2>
                    ) : null}

                    {customSectionContent ? (
                      <div
                        className={`${MEDIA_FULL} relative left-1/2 w-[100dvw] max-w-none -translate-x-1/2 px-4 sm:px-6`}
                      >
                        {customSectionContent}
                      </div>
                    ) : section.mediaFirst ? (
                      <>
                        {featureMediaReplacement ? null : isFeatureMediaRight ? null : mediaBlocks}
                        {proseBlock}
                        {featureMediaReplacementBlock}
                        {featureBlock}
                        {featureMediaRightBlock}
                      </>
                    ) : (
                      <>
                        {proseBlock}
                        {featureMediaReplacementBlock}
                        {featureBlock}
                        {featureMediaRightBlock}
                        {featureMediaReplacement ? null : isFeatureMediaRight ? null : mediaBlocks}
                      </>
                    )}
                      </div>
                    </div>
                  </div>
                </section>
              )
            })}
          </div>
        </main>
      </div>
    </div>
  )
}
