import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import hovrMarkdown from '../../_content/HOVR.md?raw'
import {
  enrichVaultBody,
  TestProjectBody,
  TEST_PROJECT_PROSE_CLASS,
  TEST_PROJECT_SECTION_TITLE_CLASS,
  TEST_PROJECT_SUBHEADING_CLASS,
  type ParsedVaultFields,
  type TestProjectSectionContent,
} from '../TestProjectBody'
import { TestProjectDetailShell } from '../TestProjectDetailShell'
import {
  MD_BORDER,
  MD_INK,
  MD_INK_FAINT,
  MD_PAGE_MARGIN,
  MD_SHAPE_LARGE,
  MD_SURFACE_CONTAINER_LOW,
} from '../testMd3Layout'
import { usePageTheme } from '../context/PageThemeContext'
import { ErdSiteNav } from './testHome3/ErdChrome'
import { useErdHomePaths } from './testHome3/useErdHomePaths'
import './testHomePage3.css'
import './testHome3Hovr.css'

const ERD_HOVR_SUIT = "font-['SUIT_Variable',sans-serif]"
const ERD_HOVR_STEP_INDEX = `${ERD_HOVR_SUIT} w-7 shrink-0 text-[9pt] font-normal uppercase leading-snug tracking-[0.06em] text-zinc-400`

/** ERD / test-home-3 scroll surfaces — white + black, no HOVR green. */
const ERD_BLACK_HEX = '#1a1917'
const HOVR_BG_HERO = 'erd-hovr-bg-hero'
const HOVR_BG_LIGHT = 'erd-hovr-bg-lead'
const HOVR_DARK_GREEN_HEX = ERD_BLACK_HEX
const HOVR_BG_DARK_GREEN = 'erd-hovr-bg-catalyst'
const HOVR_BG_DARK = 'erd-hovr-bg-solution-01'
const HOVR_BG_DARK_STEP_2 = 'erd-hovr-bg-solution-02'
const HOVR_BG_DARK_STEP_3 = 'erd-hovr-bg-solution-03'

/** Exact user-customized colors, in scroll order. */
const HOVR_BASE_PALETTE = [
  '#ffffff',
  '#ffffff',
  ERD_BLACK_HEX,
  ERD_BLACK_HEX,
  ERD_BLACK_HEX,
  ERD_BLACK_HEX,
] as const

/** Preserve hue/saturation exactly; invert and clamp only HSL lightness into a dark range. */
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

const lightModeColors = [...HOVR_BASE_PALETTE]
const darkModeColors = HOVR_BASE_PALETTE.map(invertLightnessToDark)
const heroLightModeColor = lightModeColors[0]
const heroDarkModeColor = invertLightnessToDark(HOVR_DARK_GREEN_HEX)

const HOVR_BG_COLOR_INDEX: Record<string, number> = {
  [HOVR_BG_HERO]: 0,
  [HOVR_BG_LIGHT]: 1,
  [HOVR_BG_DARK_GREEN]: 2,
  [HOVR_BG_DARK]: 3,
  [HOVR_BG_DARK_STEP_2]: 4,
  [HOVR_BG_DARK_STEP_3]: 5,
}

const HOVR_SECTION_BG: Record<string, string> = {
  'The Catalyst': HOVR_BG_DARK_GREEN,
  'Unpacking the Solution 01': HOVR_BG_DARK,
  'Unpacking the Solution 02': HOVR_BG_DARK_STEP_2,
  'Unpacking the Solution 03': HOVR_BG_DARK_STEP_3,
  Takeaway: HOVR_BG_HERO,
}

const HOVR_SECTION_THEME: Record<string, 'light' | 'dark'> = {
  'The Catalyst': 'dark',
  'Unpacking the Solution 01': 'dark',
  'Unpacking the Solution 02': 'dark',
  'Unpacking the Solution 03': 'dark',
  Takeaway: 'light',
}

const HOVR_HERO_MEDIA = {
  light: '/hovr/Thumbnail-light-sq.mp4',
  dark: '/hovr/Thumbnail-dark-sq.mp4',
} as const
const HOVR_DISPLAY_NAME = 'HOVR Admin'
const HOVR_PROJECT_LINE = 'Driver Approval System'

/** Apple-like ease for hero tile stagger. */
const ERD_HERO_EASE = [0.45, 0, 0.55, 1] as const
const ERD_HERO_TILE_TRANSITION = {
  duration: 0.95,
  ease: ERD_HERO_EASE,
} as const

function ErdHovrHero({
  title,
  role,
  headline,
  subtitle,
  tagline,
}: {
  title: string
  role?: string
  headline?: string
  subtitle?: string
  tagline?: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduceMotion = useReducedMotion()
  const { isDark } = usePageTheme()
  const heroVideo = HOVR_HERO_MEDIA[isDark ? 'dark' : 'light']

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.src = heroVideo
    video.load()
    void video.play().catch(() => {})
  }, [heroVideo])

  const heroMeta = [
    subtitle ? { label: 'Focus', value: subtitle } : null,
    tagline ? { label: 'Outcome', value: tagline } : null,
  ].filter((item): item is { label: string; value: string } => Boolean(item))

  const tileInitial = reduceMotion ? false : { opacity: 0, y: 28, scale: 0.985 }
  const tileAnimate = { opacity: 1, y: 0, scale: 1 }

  return (
    <section
      className="erd-hovr-hero-section erd-shop-row erd-hovr-hero-grid"
      data-bg={HOVR_BG_HERO}
      data-theme="light"
    >
      <motion.div
        className="erd-shop-square erd-hovr-hero-adjacent-square"
        initial={tileInitial}
        animate={tileAnimate}
        transition={{ ...ERD_HERO_TILE_TRANSITION, delay: reduceMotion ? 0 : 0.22 }}
      >
        <div className="erd-shop-square-inner">
          <div className="erd-shop-square-intro">
            <p className="erd-shop-square-name">{HOVR_DISPLAY_NAME}</p>
            {[HOVR_PROJECT_LINE, role].filter(Boolean).length > 0 ? (
              <p className="erd-shop-square-greeting">
                {[HOVR_PROJECT_LINE, role].filter(Boolean).join(' · ')}
              </p>
            ) : null}
          </div>
          <div className="erd-shop-square-experience">
            <p className="erd-shop-square-experience-label">Overview</p>
            {headline ? (
              <p className="erd-shop-square-greeting erd-hovr-hero-square-dek">{headline}</p>
            ) : null}
            {heroMeta.length > 0 ? (
              <ul className="erd-shop-square-experience-list erd-hovr-hero-meta-list">
                {heroMeta.map((item) => (
                  <li key={item.label}>
                    <span className="erd-shop-square-experience-role">{item.label}</span>
                    <span className="erd-shop-square-experience-meta">{item.value}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </motion.div>

      <motion.div
        className="erd-shop-card erd-hovr-hero-card"
        initial={tileInitial}
        animate={tileAnimate}
        transition={{ ...ERD_HERO_TILE_TRANSITION, delay: reduceMotion ? 0 : 0.34 }}
      >
        <div className="erd-shop-card-media">
          <video
            ref={videoRef}
            className="erd-shop-card-video erd-hovr-hero-video"
            src={heroVideo}
            muted
            playsInline
            loop
            autoPlay
            preload="auto"
            aria-label={`${title} preview`}
          />
        </div>
      </motion.div>
    </section>
  )
}

type HovrVault = ParsedVaultFields & {
  thumbnail_light: string
  thumbnail_dark: string
  hero_images: string[]
  /** Obsidian `highlight` / `highlights` — project hero dek. */
  highlight: string
}

/** Resolve CMS paths that omit a leading `/hovr/` (or other folder). */
function normalizeAssetPath(path: string, baseDir = '/hovr'): string {
  const p = path.trim().replace(/^["']|["']$/g, '')
  if (!p) return p
  if (p.startsWith('/') || /^https?:\/\//i.test(p)) return p
  return `${baseDir.replace(/\/$/, '')}/${p.replace(/^\.\//, '')}`
}

function parseFrontmatterScalar(frontmatter: string, key: string): string {
  const m = new RegExp(`^${key}:\\s*(.+)$`, 'm').exec(frontmatter)
  return m?.[1]?.trim().replace(/^["']|["']$/g, '') ?? ''
}

/** YAML list under `key:` — `- item` lines (Obsidian CMS arrays). */
function parseFrontmatterStringList(frontmatter: string, key: string): string[] {
  const block = new RegExp(`^${key}:\\s*\\r?\\n((?:[ \\t]*-[ \\t]*.+\\r?\\n?)*)`, 'm').exec(
    frontmatter,
  )
  if (block?.[1]) {
    return block[1]
      .split(/\r?\n/)
      .map((line) => {
        const item = /^\s*-\s+(.+)$/.exec(line)
        return item ? normalizeAssetPath(item[1]!.trim()) : ''
      })
      .filter(Boolean)
  }

  const inline = new RegExp(`^${key}:\\s*\\[(.*)\\]\\s*$`, 'm').exec(frontmatter)
  if (inline?.[1]) {
    return inline[1]
      .split(',')
      .map((s) => normalizeAssetPath(s.trim()))
      .filter(Boolean)
  }

  return []
}

function parseObsidianMarkdown(raw: unknown): HovrVault {
  if (raw == null) {
    throw new Error(
      'Missing file: raw import is undefined. Verify `../../_content/HOVR.md?raw` exists and Vite includes `_content/`.',
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
  const title = parseFrontmatterScalar(frontmatter, 'title')
  const role = parseFrontmatterScalar(frontmatter, 'role')

  if (!title) {
    throw new Error('Parsing error: frontmatter is missing a `title:` field.')
  }

  const thumbnail_light = normalizeAssetPath(parseFrontmatterScalar(frontmatter, 'thumbnail_light'))
  const thumbnail_dark = normalizeAssetPath(parseFrontmatterScalar(frontmatter, 'thumbnail_dark'))
  const fromImages = parseFrontmatterStringList(frontmatter, 'hero_images')
  const fromMedia = parseFrontmatterStringList(frontmatter, 'hero_media')
  const hero_images = fromImages.length > 0 ? fromImages : fromMedia
  const highlightList = parseFrontmatterStringList(frontmatter, 'highlights')
  const highlightScalar = parseFrontmatterScalar(frontmatter, 'highlight')
  const highlight = highlightList.length > 0 ? highlightList.join(' · ') : highlightScalar

  if (!thumbnail_light) {
    throw new Error('Parsing error: frontmatter is missing `thumbnail_light`.')
  }
  if (!thumbnail_dark) {
    throw new Error('Parsing error: frontmatter is missing `thumbnail_dark`.')
  }

  const enriched = enrichVaultBody(title, role, body.trim())

  return {
    ...enriched,
    // Frontmatter `highlight` wins over body `##` for the hero dek.
    headline: highlight || enriched.headline,
    thumbnail_light,
    thumbnail_dark,
    hero_images,
    highlight,
  }
}

function errorKind(message: string): 'missing' | 'parse' | 'runtime' {
  if (/missing file/i.test(message)) return 'missing'
  if (/parsing error/i.test(message)) return 'parse'
  return 'runtime'
}

function HovrErrorPanel({
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
          /hovr · error state
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

/** Bespoke solution layout; intentionally bypasses the generic markdown renderer. */
export function HovrSolutionOneSection({ section }: { section: TestProjectSectionContent }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const proseBlocks = section.prose.split(/\n\s*\n/).filter((block) => block.trim())
  const subheadingMatch = /^\*\*(.+)\*\*$/.exec(proseBlocks[0]?.trim() ?? '')
  const subheading = subheadingMatch?.[1] ?? ''
  const bodyMarkdown = proseBlocks
    .slice(subheading ? 1 : 0)
    .join('\n\n')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim()
  const video = section.media.find((item) => item.kind === 'video')
  const explanationOneText =
    section.features[0]?.description || section.features[0]?.title || 'Design explanation 1'
  const explanationTwoText =
    section.features[1]?.description || section.features[1]?.title || 'Design explanation 2'
  const splitExplanation = (text: string) => {
    const separator = text.indexOf(':')
    return separator < 0
      ? { title: text, body: '' }
      : {
          title: text.slice(0, separator).trim(),
          body: text.slice(separator + 1).trim(),
        }
  }
  const explanationOne = splitExplanation(explanationOneText)
  const explanationTwo = splitExplanation(explanationTwoText)

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 0.7
  }, [])

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start relative w-full max-w-7xl mx-auto my-32"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-150px' }}
    >
      {/* 1. Left Text Block */}
      <motion.div
        className={`relative z-10 min-w-0 w-full lg:max-w-[32rem] ${TEST_PROJECT_PROSE_CLASS}`}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: ERD_HERO_EASE }}
        viewport={{ once: true, margin: '-100px' }}
      >
        <h3 className={`${TEST_PROJECT_SECTION_TITLE_CLASS} mb-0`}>
          {section.title}
        </h3>
        {subheading ? (
          <h4 className={`${TEST_PROJECT_SUBHEADING_CLASS} mt-6 mb-0`}>{subheading}</h4>
        ) : null}
        <ReactMarkdown>{bodyMarkdown}</ReactMarkdown>
      </motion.div>

      {/* 2. Right Video & Annotations Block */}
      <motion.div
        className="relative z-50"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: ERD_HERO_EASE, delay: 0.6 }}
        viewport={{ once: true, margin: '-100px' }}
      >
        <video
          ref={videoRef}
          src={video?.src ?? '/hovr/Document-list.mp4'}
          autoPlay
          loop
          muted
          playsInline
          className="block h-auto w-full rounded-none"
          onLoadedMetadata={(event) => {
            event.currentTarget.playbackRate = 0.7
          }}
        />

        {/* 3. Top Annotation (01 SPLIT-VIEW INSPECTION) */}
        {/* Connecting Line */}
        <motion.div
          className="absolute -top-16 left-1/2 w-[1px] h-16 bg-zinc-300 dark:bg-zinc-700 origin-bottom"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          viewport={{ once: true }}
        />
        {/* Caption above the blueprint body box */}
        <motion.div
          className="absolute -top-16 left-1/2 -translate-x-1/2 -translate-y-full w-80 bg-transparent"
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-4 flex items-start gap-3"
          >
            <span className={ERD_HOVR_STEP_INDEX}>
              01
            </span>
            <h4 className={`m-0 min-w-0 ${ERD_HOVR_SUIT} text-[11pt] font-bold uppercase leading-[1.2] tracking-[-0.02em] text-black dark:text-[#f2f2f2]`}>
              {explanationOne.title}
            </h4>
          </motion.div>

          <div className={`relative p-6 bg-transparent ${TEST_PROJECT_PROSE_CLASS}`}>
            <motion.div
              className="absolute top-0 left-0 right-0 h-[1px] bg-zinc-300 dark:bg-zinc-700 origin-left"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              viewport={{ once: true }}
            />
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-[1px] bg-zinc-300 dark:bg-zinc-700 origin-right"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              viewport={{ once: true }}
            />
            <motion.div
              className="absolute top-0 bottom-0 left-0 w-[1px] bg-zinc-300 dark:bg-zinc-700 origin-bottom"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              viewport={{ once: true }}
            />
            <motion.div
              className="absolute top-0 bottom-0 right-0 w-[1px] bg-zinc-300 dark:bg-zinc-700 origin-top"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              viewport={{ once: true }}
            />
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.5 }}
              viewport={{ once: true }}
            >
              {explanationOne.body ? <p>{explanationOne.body}</p> : null}
            </motion.div>
          </div>
        </motion.div>

        {/* 4. Left Annotation (02 COGNITIVE LOAD REDUCTION) */}
        {/* Connecting Line */}
        <motion.div
          className="absolute top-[60%] -left-12 h-[1px] w-12 bg-zinc-300 dark:bg-zinc-700 origin-right"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ delay: 2.6, duration: 0.5 }}
          viewport={{ once: true }}
        />
        {/* Caption above the blueprint body box */}
        <motion.div
          className="absolute top-[60%] -left-12 -translate-y-1/2 -translate-x-full w-80 bg-transparent"
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 3.4, duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-4 flex items-start gap-3"
          >
            <span className={ERD_HOVR_STEP_INDEX}>
              02
            </span>
            <h4 className={`m-0 min-w-0 ${ERD_HOVR_SUIT} text-[11pt] font-bold uppercase leading-[1.2] tracking-[-0.02em] text-black dark:text-[#f2f2f2]`}>
              {explanationTwo.title}
            </h4>
          </motion.div>

          <div className={`relative p-6 bg-transparent ${TEST_PROJECT_PROSE_CLASS}`}>
            <motion.div
              className="absolute top-0 left-0 right-0 h-[1px] bg-zinc-300 dark:bg-zinc-700 origin-left"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ delay: 3.0, duration: 0.6 }}
              viewport={{ once: true }}
            />
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-[1px] bg-zinc-300 dark:bg-zinc-700 origin-right"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ delay: 3.0, duration: 0.6 }}
              viewport={{ once: true }}
            />
            <motion.div
              className="absolute top-0 bottom-0 left-0 w-[1px] bg-zinc-300 dark:bg-zinc-700 origin-bottom"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              transition={{ delay: 3.0, duration: 0.6 }}
              viewport={{ once: true }}
            />
            <motion.div
              className="absolute top-0 bottom-0 right-0 w-[1px] bg-zinc-300 dark:bg-zinc-700 origin-top"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              transition={{ delay: 3.0, duration: 0.6 }}
              viewport={{ once: true }}
            />
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 3.4, duration: 0.5 }}
              viewport={{ once: true }}
            >
              {explanationTwo.body ? <p>{explanationTwo.body}</p> : null}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export function TestHome3Hovr({
  backTo,
}: {
  backTo?: string
  backLabel?: string
} = {}) {
  const { homePath, projectPath } = useErdHomePaths()
  const resolvedBackTo = backTo ?? homePath
  const scrollRef = useRef<HTMLDivElement>(null)
  const { isDark } = usePageTheme()
  const [bgColor, setBgColor] = useState(HOVR_BG_HERO)
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>('light')

  const handleScrollBg = useCallback((bgClass: string, theme: 'light' | 'dark') => {
    setBgColor((prev) => (prev === bgClass ? prev : bgClass))
    setActiveTheme((prev) => (prev === theme ? prev : theme))
  }, [])

  try {
    const vault = parseObsidianMarkdown(hovrMarkdown)
    const surfaceDark = isDark || activeTheme === 'dark'
    const currentColors = isDark ? darkModeColors : lightModeColors
    const activeColorIndex = HOVR_BG_COLOR_INDEX[bgColor] ?? 0
    const heroBackgroundColor = isDark ? heroDarkModeColor : heroLightModeColor
    const activeBgColor =
      activeColorIndex === 0
        ? heroBackgroundColor
        : (currentColors[activeColorIndex] ?? heroBackgroundColor)

    return (
      <TestProjectDetailShell
        scrollRef={scrollRef}
        backTo={resolvedBackTo}
        backLabel="Close"
        popupChrome="erd"
        popupPortal={false}
        erdPopupNav={<ErdSiteNav logoTo={homePath} aboutSectionId="about" aboutPath={homePath} />}
        overlayClassName={`erd-site erd-site--${isDark ? 'dark' : 'light'} erd-project-popup-shell`}
        sheetClassName={`erd-hovr-page erd-hovr-sheet rounded-none ${
          surfaceDark ? 'dark erd-hovr-sheet--surface-dark' : 'erd-hovr-sheet--surface-light'
        }`}
        sheetStyle={
          {
            '--active-section-bg': activeBgColor,
          } as CSSProperties
        }
      >
        <TestProjectBody
          title={vault.title}
          role={vault.role}
          // Body `#` h1 (e.g. HOVR ADMIN PANEL…) — 3rd in aside hero stack
          subtitle={vault.subtitle}
          // Frontmatter `highlight` — 4th in aside hero stack
          headline={vault.highlight || vault.headline}
          tagline={vault.tagline}
          content={vault.content}
          assetBasePath="/hovr"
          scrollRoot={scrollRef}
          fullWidthSectionContainers={[
            'Unpacking the Solution 01',
            'Unpacking the Solution 02',
            'Unpacking the Solution 03',
          ]}
          featureMediaRightSections={[
            'Unpacking the Solution 01',
            'Unpacking the Solution 02',
            'Unpacking the Solution 03',
          ]}
          slideUpTextSections={[
            'Unpacking the Solution 01',
            'Unpacking the Solution 02',
            'Unpacking the Solution 03',
          ]}
          delayedFeatureMediaSections={[
            'Unpacking the Solution 01',
            'Unpacking the Solution 02',
            'Unpacking the Solution 03',
          ]}
          heroLayout="above"
          hero={
            <ErdHovrHero
              title={vault.title}
              role={vault.role}
              headline={vault.highlight || vault.headline}
              subtitle={vault.subtitle}
              tagline={vault.tagline}
            />
          }
          spyTheme={isDark ? 'dark' : activeTheme}
          scrollBg={{
            hero: HOVR_BG_HERO,
            heroTheme: 'light',
            lead: HOVR_BG_LIGHT,
            leadTheme: 'light',
            bySectionTitle: HOVR_SECTION_BG,
            bySectionTheme: HOVR_SECTION_THEME,
            fallback: HOVR_BG_LIGHT,
            fallbackTheme: 'light',
            onChange: handleScrollBg,
          }}
        />
      </TestProjectDetailShell>
    )
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    console.error('[TestHome3Hovr] Failed to load or parse markdown:', error)
    return <HovrErrorPanel error={error} rawPreview={hovrMarkdown} />
  }
}
