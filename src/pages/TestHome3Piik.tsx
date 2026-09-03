/**
 * Piik AI case study under `/test-home-3/piik-ai` — same ERD popup chrome / skin as HOVR.
 * Published `/piik-ai` (`TestPiik`) is unchanged.
 */
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import piikMarkdown from '../../_content/Piik AI.md?raw'
import {
  enrichVaultBody,
  TestProjectBody,
  type ParsedVaultFields,
} from '../TestProjectBody'
import { TestProjectDetailShell } from '../TestProjectDetailShell'
import {
  PiikCoreChallengeProblems,
  PiikImpactStoryGraph,
  PiikResearchFindings,
  PiikSolution01FeatureMedia,
} from '../TestPiik'
import { PiikFeedbackEmailCollage } from '../PiikFeedbackEmailCollage'
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

/** Same ERD white/black scroll surfaces as HOVR (no Piik blues). */
const ERD_BLACK_HEX = '#1a1917'
const PIIK_BG_HERO = 'erd-piik-bg-hero'
const PIIK_BG_LIGHT = 'erd-piik-bg-lead'
const PIIK_BG_LISTENING = 'erd-piik-bg-listening'
const PIIK_BG_CATALYST = 'erd-piik-bg-catalyst'
const PIIK_BG_SOLUTION_1 = 'erd-piik-bg-solution-01'
const PIIK_BG_SOLUTION_2 = 'erd-piik-bg-solution-02'
const PIIK_BG_SOLUTION_3 = 'erd-piik-bg-solution-03'
const PIIK_BG_RESEARCH = 'erd-piik-bg-research'

const PIIK_BASE_PALETTE = [
  '#ffffff',
  '#ffffff',
  '#ffffff',
  ERD_BLACK_HEX,
  ERD_BLACK_HEX,
  ERD_BLACK_HEX,
  ERD_BLACK_HEX,
  ERD_BLACK_HEX,
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

  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1))
  const invertedLightness = 100 - lightness * 100
  const darkLightness = Math.min(15, Math.max(10, invertedLightness))

  return `hsl(${hue.toFixed(3)} ${Number((saturation * 100).toFixed(3))}% ${Number(
    darkLightness.toFixed(3),
  )}%)`
}

const lightModeColors = [...PIIK_BASE_PALETTE]
const darkModeColors = PIIK_BASE_PALETTE.map(invertLightnessToDark)
const heroLightModeColor = lightModeColors[0]
const heroDarkModeColor = invertLightnessToDark(ERD_BLACK_HEX)

const PIIK_BG_COLOR_INDEX: Record<string, number> = {
  [PIIK_BG_HERO]: 0,
  [PIIK_BG_LIGHT]: 1,
  [PIIK_BG_LISTENING]: 2,
  [PIIK_BG_CATALYST]: 3,
  [PIIK_BG_SOLUTION_1]: 4,
  [PIIK_BG_SOLUTION_2]: 5,
  [PIIK_BG_SOLUTION_3]: 6,
  [PIIK_BG_RESEARCH]: 7,
}

const PIIK_SECTION_BG: Record<string, string> = {
  'User Analysis': PIIK_BG_LISTENING,
  'The Catalyst': PIIK_BG_CATALYST,
  'Cross-Cultural UX': PIIK_BG_RESEARCH,
  'Unpacking the Solution 01': PIIK_BG_SOLUTION_1,
  'Unpacking the Solution 02': PIIK_BG_SOLUTION_2,
  'Unpacking the Solution 03': PIIK_BG_SOLUTION_3,
  Takeaway: PIIK_BG_HERO,
}

const PIIK_SECTION_THEME: Record<string, 'light' | 'dark'> = {
  'User Analysis': 'light',
  'The Catalyst': 'dark',
  'Cross-Cultural UX': 'dark',
  'Unpacking the Solution 01': 'dark',
  'Unpacking the Solution 02': 'dark',
  'Unpacking the Solution 03': 'dark',
  Takeaway: 'light',
}

const PIIK_HERO_MEDIA = {
  light: '/piikai/Thumbnail-light-sq.mp4',
  dark: '/piikai/Thumbnail-dark-sq.mp4',
} as const
const PIIK_DISPLAY_NAME = 'Piik AI'
const PIIK_PROJECT_LINE = 'Creator Editor'

const ERD_HERO_EASE = [0.45, 0, 0.55, 1] as const
const ERD_HERO_TILE_TRANSITION = {
  duration: 0.95,
  ease: ERD_HERO_EASE,
} as const

function ErdPiikHero({
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
  const heroVideo = PIIK_HERO_MEDIA[isDark ? 'dark' : 'light']

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
      data-bg={PIIK_BG_HERO}
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
            <p className="erd-shop-square-name">{PIIK_DISPLAY_NAME}</p>
            {[PIIK_PROJECT_LINE, role].filter(Boolean).length > 0 ? (
              <p className="erd-shop-square-greeting">
                {[PIIK_PROJECT_LINE, role].filter(Boolean).join(' · ')}
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

type PiikVault = ParsedVaultFields & {
  thumbnailLight: string
  thumbnailDark: string
  highlight: string
}

function parseObsidianMarkdown(raw: unknown): PiikVault {
  if (typeof raw !== 'string') {
    throw new Error('Missing file: Piik markdown import is not a string.')
  }
  const trimmed = raw.trim()
  if (!trimmed) {
    throw new Error('Missing file: raw markdown is an empty string.')
  }

  const frontmatterMatch = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/u.exec(trimmed)
  if (!frontmatterMatch) {
    throw new Error('Parsing error: no YAML frontmatter block found.')
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

function PiikErrorPanel({ error, rawPreview }: { error: Error; rawPreview: unknown }) {
  const preview =
    typeof rawPreview === 'string'
      ? rawPreview.slice(0, 480) + (rawPreview.length > 480 ? '\n… [truncated]' : '')
      : String(rawPreview)

  return (
    <TestProjectDetailShell>
      <header className={`${MD_PAGE_MARGIN} border-b ${MD_BORDER} py-6 sm:py-8`}>
        <p className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${MD_INK_FAINT}`}>
          /test-home-3/piik-ai · error state
        </p>
        <h1 className={`mt-4 text-[clamp(1.75rem,5vw,2.5rem)] font-semibold leading-[1.05] tracking-[-0.06em] ${MD_INK}`}>
          Error Loading Markdown
        </h1>
        <p className={`mt-3 text-[12px] font-normal leading-relaxed text-black/85 dark:text-white/85`}>
          {error.message}
        </p>
      </header>
      <section className={`${MD_PAGE_MARGIN} py-6 sm:py-8`}>
        <pre
          className={`overflow-x-auto border ${MD_BORDER} ${MD_SURFACE_CONTAINER_LOW} ${MD_SHAPE_LARGE} p-3 text-[10px] font-normal leading-relaxed text-black/75 dark:text-white/75`}
        >
          {preview}
        </pre>
      </section>
    </TestProjectDetailShell>
  )
}

export function TestHome3Piik({
  backTo,
}: {
  backTo?: string
} = {}) {
  const { homePath, projectPath } = useErdHomePaths()
  const resolvedBackTo = backTo ?? homePath
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
    const currentColors = isDark ? darkModeColors : lightModeColors
    const activeColorIndex = PIIK_BG_COLOR_INDEX[bgColor] ?? 0
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
          subtitle={vault.subtitle}
          headline={vault.highlight || vault.headline}
          tagline={vault.tagline}
          content={vault.content}
          assetBasePath="/piikai"
          scrollRoot={scrollRef}
          leadExtra={<PiikImpactStoryGraph />}
          fullWidthSectionContainers={[
            'User Analysis',
            'Cross-Cultural UX',
            'Unpacking the Solution 01',
            'Unpacking the Solution 02',
            'Unpacking the Solution 03',
          ]}
          featureMediaRightSections={[
            'Unpacking the Solution 02',
            'Unpacking the Solution 03',
          ]}
          replaceFeatureMediaRight={{
            'User Analysis': () => (
              <div className="relative left-1/2 w-[100dvw] max-w-none -translate-x-1/2 px-4 sm:px-6">
                <PiikFeedbackEmailCollage mode="inView" className="max-w-[36.4rem]" />
              </div>
            ),
            'The Core Challenge': (section) => (
              <PiikCoreChallengeProblems features={section.features} />
            ),
            'Cross-Cultural UX': (section) => (
              <PiikResearchFindings features={section.features} />
            ),
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
            'The Core Challenge',
            'Cross-Cultural UX',
            'Unpacking the Solution 01',
            'Unpacking the Solution 02',
            'Unpacking the Solution 03',
          ]}
          featureStartIndexBySection={{
            'Unpacking the Solution 02': 3,
            'Unpacking the Solution 03': 4,
          }}
          heroLayout="above"
          hero={
            <ErdPiikHero
              title={vault.title}
              role={vault.role}
              headline={vault.highlight || vault.headline}
              subtitle={vault.subtitle}
              tagline={vault.tagline}
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
    console.error('[TestHome3Piik] Failed to load or parse markdown:', error)
    return <PiikErrorPanel error={error} rawPreview={piikMarkdown} />
  }
}
