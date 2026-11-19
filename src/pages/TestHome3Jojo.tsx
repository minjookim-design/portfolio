/**
 * Jojo case study overlay at `/jojo` — same ERD popup chrome / layout as HOVR.
 */
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import jojoMarkdown from '../../_content/Jojo.md?raw'
import {
  enrichVaultBody,
  TestProjectBody,
  type ParsedVaultFields,
} from '../TestProjectBody'
import { TestProjectDetailShell } from '../TestProjectDetailShell'
import { usePageTheme } from '../context/PageThemeContext'
import { JojoResearchSection } from './JojoResearchFindings'
import { JojoUserInterviewSection } from './JojoUserInterview'
import { ErdHeroMetaList } from './testHome3/ErdChrome'
import { useErdHomePaths } from './testHome3/useErdHomePaths'
import './testHomePage3.css'
import './testHome3Hovr.css'

const ERD_BLACK_HEX = '#1a1917'
/** Dark grey-green — User Interview scroll background. */
const JOJO_INTERVIEW_HEX = '#1e2621'
/** Greyish green — Design scroll background. */
const JOJO_DESIGN_HEX = '#4a5c52'
const JOJO_BG_HERO = 'erd-jojo-bg-hero'
const JOJO_BG_LIGHT = 'erd-jojo-bg-lead'
const JOJO_BG_RESEARCH = 'erd-jojo-bg-research'
const JOJO_BG_DESIGN = 'erd-jojo-bg-design'
const JOJO_BG_INTERVIEW = 'erd-jojo-bg-interview'
const JOJO_BG_SOLUTION_1 = 'erd-jojo-bg-solution-01'
const JOJO_BG_SOLUTION_2 = 'erd-jojo-bg-solution-02'
const JOJO_BG_SOLUTION_3 = 'erd-jojo-bg-solution-03'

const JOJO_BASE_PALETTE = [
  '#ffffff',
  '#ffffff',
  ERD_BLACK_HEX,
  ERD_BLACK_HEX,
  ERD_BLACK_HEX,
  ERD_BLACK_HEX,
  JOJO_INTERVIEW_HEX,
  JOJO_DESIGN_HEX,
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

const lightModeColors = [...JOJO_BASE_PALETTE]
const darkModeColors = JOJO_BASE_PALETTE.map(invertLightnessToDark)
const heroLightModeColor = lightModeColors[0]
const heroDarkModeColor = invertLightnessToDark(ERD_BLACK_HEX)

const JOJO_BG_COLOR_INDEX: Record<string, number> = {
  [JOJO_BG_HERO]: 0,
  [JOJO_BG_LIGHT]: 1,
  [JOJO_BG_RESEARCH]: 2,
  [JOJO_BG_SOLUTION_1]: 3,
  [JOJO_BG_SOLUTION_2]: 4,
  [JOJO_BG_SOLUTION_3]: 5,
  [JOJO_BG_INTERVIEW]: 6,
  [JOJO_BG_DESIGN]: 7,
}

const JOJO_SECTION_BG: Record<string, string> = {
  Research: JOJO_BG_RESEARCH,
  'The Goal': JOJO_BG_RESEARCH,
  Design: JOJO_BG_DESIGN,
  'User Interview': JOJO_BG_INTERVIEW,
  'Unpacking the Solution 01': JOJO_BG_SOLUTION_1,
  'Unpacking the Solution 02': JOJO_BG_SOLUTION_2,
  'Unpacking the Solution 03': JOJO_BG_SOLUTION_3,
  Takeaway: JOJO_BG_HERO,
}

const JOJO_SECTION_THEME: Record<string, 'light' | 'dark'> = {
  Research: 'dark',
  'The Goal': 'dark',
  Design: 'dark',
  'User Interview': 'dark',
  'Unpacking the Solution 01': 'dark',
  'Unpacking the Solution 02': 'dark',
  'Unpacking the Solution 03': 'dark',
  Takeaway: 'light',
}

const JOJO_HERO_MEDIA = {
  light: '/jojo/jojo-4k.mp4',
  dark: '/jojo/jojo-4k-dark.mp4',
} as const
const JOJO_DISPLAY_NAME = 'JoJo'
const JOJO_PROJECT_LINE = 'Think Beyond AI'

const ERD_HERO_EASE = [0.45, 0, 0.55, 1] as const
const ERD_HERO_TILE_TRANSITION = {
  duration: 0.95,
  ease: ERD_HERO_EASE,
} as const

function ErdJojoHero({
  title,
  role,
  subtitle,
  tagline,
}: {
  title: string
  role?: string
  subtitle?: string
  tagline?: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduceMotion = useReducedMotion()
  const { isDark } = usePageTheme()
  const heroVideo = JOJO_HERO_MEDIA[isDark ? 'dark' : 'light']

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
      data-bg={JOJO_BG_HERO}
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
            <p className="erd-shop-square-name">{JOJO_DISPLAY_NAME}</p>
            {[JOJO_PROJECT_LINE, role].filter(Boolean).length > 0 ? (
              <p className="erd-shop-square-greeting">
                {[JOJO_PROJECT_LINE, role].filter(Boolean).join(' · ')}
              </p>
            ) : null}
          </div>
          {heroMeta.length > 0 ? (
            <div className="erd-shop-square-experience">
              <ErdHeroMetaList items={heroMeta} />
            </div>
          ) : null}
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

type JojoVault = ParsedVaultFields & {
  thumbnailLight: string
  thumbnailDark: string
  highlight: string
}

function parseObsidianMarkdown(raw: unknown): JojoVault {
  if (typeof raw !== 'string') {
    throw new Error('Missing file: Jojo markdown import is not a string.')
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
  const thumbnailLight = thumbnailLightMatch?.[1]?.trim() ?? '/jojo/Thumbnail-light.jpg'
  const thumbnailDark = thumbnailDarkMatch?.[1]?.trim() ?? '/jojo/Thumbnail-dark.jpg'
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

export function TestHome3Jojo({
  backTo,
}: {
  backTo?: string
} = {}) {
  const { homePath } = useErdHomePaths()
  const resolvedBackTo = backTo ?? homePath
  const scrollRef = useRef<HTMLDivElement>(null)
  const { isDark } = usePageTheme()
  const [bgColor, setBgColor] = useState(JOJO_BG_HERO)
  const [sectionTheme, setSectionTheme] = useState<'light' | 'dark'>('light')

  const handleScrollBg = useCallback((nextBg: string, nextTheme: 'light' | 'dark') => {
    setBgColor((previous) => (previous === nextBg ? previous : nextBg))
    setSectionTheme((previous) => (previous === nextTheme ? previous : nextTheme))
  }, [])

  const vault = parseObsidianMarkdown(jojoMarkdown)
  const surfaceDark = isDark || sectionTheme === 'dark'
  const currentColors = isDark ? darkModeColors : lightModeColors
  const activeColorIndex = JOJO_BG_COLOR_INDEX[bgColor] ?? 0
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
      overlayClassName={`erd-site erd-site--${isDark ? 'dark' : 'light'} erd-project-popup-shell`}
      sheetClassName={`erd-hovr-page erd-jojo-page erd-hovr-sheet erd-hovr-text-measure rounded-none ${
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
        assetBasePath="/jojo"
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
        sectionContentOverrides={{
          Research: () => <JojoResearchSection />,
          'User Interview': () => <JojoUserInterviewSection />,
        }}
        h1SectionTitles={['Design']}
        heroLayout="above"
        hero={
          <ErdJojoHero
            title={vault.title}
            role={vault.role}
            subtitle={vault.subtitle}
            tagline={vault.tagline}
          />
        }
        spyTheme={surfaceDark ? 'dark' : 'light'}
        scrollBg={{
          hero: JOJO_BG_HERO,
          heroTheme: 'light',
          lead: JOJO_BG_LIGHT,
          leadTheme: 'light',
          bySectionTitle: JOJO_SECTION_BG,
          bySectionTheme: JOJO_SECTION_THEME,
          fallback: JOJO_BG_LIGHT,
          fallbackTheme: 'light',
          onChange: handleScrollBg,
        }}
      />
    </TestProjectDetailShell>
  )
}
