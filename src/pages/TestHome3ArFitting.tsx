/**
 * AR Fitting Room case study under `/test-home-3/ar-fitting-room`.
 * Clones HOVR ERD popup chrome / skin / scroll-spy. Published `/projects/ar-fitting-room` unchanged.
 */
import { useCallback, useRef, useState, type CSSProperties } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import arFittingMarkdown from '../../_content/AR Fitting Room.md?raw'
import {
  enrichVaultBody,
  TestProjectBody,
  type ParsedVaultFields,
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
import { ArFittingStatsGraph } from './ArFittingStatsGraph'
import { ArCaseStudyMediaWithBeside } from './ArFittingProjectPage'
import './testHomePage3.css'
import './testHome3Hovr.css'

const ERD_BLACK_HEX = '#1a1917'
/** Light pinkish red — The Challenge scroll background (ERD rose tint). */
const AR_CHALLENGE_PINK_HEX = '#FFE4E6'
/** Light orange — User Testing & Iterations scroll background. */
const AR_TESTING_ORANGE_HEX = '#FFEDD5'
/** Light violet — The Solution Sketch scroll background. */
const AR_SOLUTION_VIOLET_HEX = '#EDE9FE'
const AR_BG_HERO = 'erd-ar-bg-hero'
const AR_BG_LIGHT = 'erd-ar-bg-lead'
const AR_BG_BACKGROUND = 'erd-ar-bg-background'
const AR_BG_PROBLEM = 'erd-ar-bg-problem'
const AR_BG_SOLUTION = 'erd-ar-bg-solution'
const AR_BG_CHALLENGE = 'erd-ar-bg-challenge'
const AR_BG_TESTING = 'erd-ar-bg-testing'
const AR_BG_FINAL = 'erd-ar-bg-final'
const AR_BG_TAKEAWAY = 'erd-ar-bg-takeaway'

const AR_BASE_PALETTE = [
  '#ffffff',
  '#ffffff',
  '#ffffff',
  '#ffffff',
  AR_SOLUTION_VIOLET_HEX,
  AR_CHALLENGE_PINK_HEX,
  AR_TESTING_ORANGE_HEX,
  ERD_BLACK_HEX,
  '#ffffff',
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

const lightModeColors = [...AR_BASE_PALETTE]
const darkModeColors = AR_BASE_PALETTE.map(invertLightnessToDark)
const heroLightModeColor = lightModeColors[0]
const heroDarkModeColor = invertLightnessToDark(ERD_BLACK_HEX)

const AR_BG_COLOR_INDEX: Record<string, number> = {
  [AR_BG_HERO]: 0,
  [AR_BG_LIGHT]: 1,
  [AR_BG_BACKGROUND]: 2,
  [AR_BG_PROBLEM]: 3,
  [AR_BG_SOLUTION]: 4,
  [AR_BG_CHALLENGE]: 5,
  [AR_BG_TESTING]: 6,
  [AR_BG_FINAL]: 7,
  [AR_BG_TAKEAWAY]: 8,
}

const AR_SECTION_BG: Record<string, string> = {
  Background: AR_BG_BACKGROUND,
  'The Problem': AR_BG_PROBLEM,
  'The Solution Sketch': AR_BG_SOLUTION,
  'The Challenge': AR_BG_CHALLENGE,
  'User Testing & Iterations': AR_BG_TESTING,
  'Unpacking The Solution': AR_BG_FINAL,
  'Pre-Setting Stage': AR_BG_FINAL,
  "Let's Do Shopping": AR_BG_FINAL,
  'Experience AR Fitting Room': AR_BG_FINAL,
  'Key Takeaways': AR_BG_TAKEAWAY,
}

const AR_SECTION_THEME: Record<string, 'light' | 'dark'> = {
  Background: 'light',
  'The Problem': 'light',
  'The Solution Sketch': 'light',
  'The Challenge': 'light',
  'User Testing & Iterations': 'light',
  'Unpacking The Solution': 'dark',
  'Pre-Setting Stage': 'dark',
  "Let's Do Shopping": 'dark',
  'Experience AR Fitting Room': 'dark',
  'Key Takeaways': 'light',
}

const AR_HERO_IMAGE = '/arfittingroom/Thumbnail-light-sq.png'
const AR_DISPLAY_NAME = 'AR Fitting Room'

const ERD_HERO_EASE = [0.45, 0, 0.55, 1] as const
const ERD_HERO_TILE_TRANSITION = {
  duration: 0.95,
  ease: ERD_HERO_EASE,
} as const

function ErdArFittingHero({
  title,
  headline,
  awards,
  categories,
}: {
  title: string
  headline?: string
  awards?: string[]
  categories?: string[]
}) {
  const reduceMotion = useReducedMotion()

  const tileInitial = reduceMotion ? false : { opacity: 0, y: 28, scale: 0.985 }
  const tileAnimate = { opacity: 1, y: 0, scale: 1 }
  const awardList = (awards ?? []).filter(Boolean)
  const categoryLine = (categories ?? []).filter(Boolean).join(' · ')

  return (
    <section
      className="erd-hovr-hero-section erd-shop-row erd-hovr-hero-grid"
      data-bg={AR_BG_HERO}
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
            <p className="erd-shop-square-name">{AR_DISPLAY_NAME}</p>
            {categoryLine ? <p className="erd-shop-square-greeting">{categoryLine}</p> : null}
            {awardList.length > 0 ? (
              <div className="erd-hovr-hero-awards">
                <ul className="erd-hovr-hero-awards-list">
                  {awardList.map((award) => (
                    <li key={award}>{award}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
          <div className="erd-shop-square-experience">
            <p className="erd-shop-square-experience-label">Overview</p>
            {headline ? (
              <p className="erd-shop-square-greeting erd-hovr-hero-square-dek">{headline}</p>
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
          <img
            className="erd-shop-card-video erd-hovr-hero-video"
            src={AR_HERO_IMAGE}
            alt={`${title} preview`}
            decoding="async"
          />
        </div>
      </motion.div>
    </section>
  )
}

type ArVault = ParsedVaultFields & {
  highlight: string
  awards: string[]
  categories: string[]
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
        return item?.[1]?.trim().replace(/^["']|["']$/g, '') ?? ''
      })
      .filter(Boolean)
  }

  const inline = new RegExp(`^${key}:\\s*\\[(.*)\\]\\s*$`, 'm').exec(frontmatter)
  if (inline?.[1]) {
    return inline[1]
      .split(',')
      .map((s) => s.trim().replace(/^["']|["']$/g, ''))
      .filter(Boolean)
  }

  return []
}

function parseObsidianMarkdown(raw: unknown): ArVault {
  if (typeof raw !== 'string') {
    throw new Error('Missing file: AR Fitting Room markdown import is not a string.')
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
  const title = parseFrontmatterScalar(frontmatter, 'title')
  const role = parseFrontmatterScalar(frontmatter, 'role')
  if (!title) {
    throw new Error('Parsing error: frontmatter is missing a `title:` field.')
  }

  const awards = parseFrontmatterStringList(frontmatter, 'awards')
  const categories = parseFrontmatterStringList(frontmatter, 'category')

  const impactHook =
    /^###\s+Impact\s*\r?\n+####\s+(.+)$/m.exec(body)?.[1]?.trim() ??
    parseFrontmatterScalar(frontmatter, 'highlight')

  const enriched = enrichVaultBody(title, role, body.trim())

  return {
    ...enriched,
    headline: impactHook || enriched.headline,
    highlight: impactHook,
    awards,
    categories,
  }
}

function ArErrorPanel({ error, rawPreview }: { error: Error; rawPreview: unknown }) {
  const preview =
    typeof rawPreview === 'string'
      ? rawPreview.slice(0, 480) + (rawPreview.length > 480 ? '\n… [truncated]' : '')
      : String(rawPreview)

  return (
    <TestProjectDetailShell>
      <header className={`${MD_PAGE_MARGIN} border-b ${MD_BORDER} py-6 sm:py-8`}>
        <p className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${MD_INK_FAINT}`}>
          /test-home-3/ar-fitting-room · error state
        </p>
        <h1
          className={`mt-4 text-[clamp(1.75rem,5vw,2.5rem)] font-semibold leading-[1.05] tracking-[-0.06em] ${MD_INK}`}
        >
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

export function TestHome3ArFitting({
  backTo,
}: {
  backTo?: string
} = {}) {
  const { homePath, projectPath } = useErdHomePaths()
  const resolvedBackTo = backTo ?? homePath
  const scrollRef = useRef<HTMLDivElement>(null)
  const { isDark } = usePageTheme()
  const [bgColor, setBgColor] = useState(AR_BG_HERO)
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>('light')

  const handleScrollBg = useCallback((nextBg: string, nextTheme: 'light' | 'dark') => {
    setBgColor((previous) => (previous === nextBg ? previous : nextBg))
    setActiveTheme((previous) => (previous === nextTheme ? previous : nextTheme))
  }, [])

  try {
    const vault = parseObsidianMarkdown(arFittingMarkdown)
    const surfaceDark = isDark || activeTheme === 'dark'
    const currentColors = isDark ? darkModeColors : lightModeColors
    const activeColorIndex = AR_BG_COLOR_INDEX[bgColor] ?? 0
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
          assetBasePath="/arfittingroom"
          scrollRoot={scrollRef}
          fullWidthSectionContainers={[
            'User Testing & Iterations',
            'Unpacking The Solution',
            'Pre-Setting Stage',
            "Let's Do Shopping",
            'Experience AR Fitting Room',
          ]}
          slideUpTextSections={[
            'Unpacking The Solution',
            'Pre-Setting Stage',
            "Let's Do Shopping",
            'Experience AR Fitting Room',
          ]}
          delayedFeatureMediaSections={[
            'User Testing & Iterations',
            'Unpacking The Solution',
            'Pre-Setting Stage',
            "Let's Do Shopping",
            'Experience AR Fitting Room',
          ]}
          stackedFeatureSections={['User Testing & Iterations']}
          featureMediaBySection={{
            'User Testing & Iterations': [
              '/arfittingroom/ut1.png',
              '/arfittingroom/ut2.png',
              '/arfittingroom/ut3.png',
            ],
          }}
          scrollSpyHiddenSections={[
            'Pre-Setting Stage',
            "Let's Do Shopping",
            'Experience AR Fitting Room',
          ]}
          proseMediaLeftBySection={{
            'Unpacking The Solution': (
              <img
                src="/arfittingroom/poster.png"
                alt="AR Fitting Room poster"
                className="block h-auto w-[98%] max-w-[98%] object-contain"
                decoding="async"
              />
            ),
            'Pre-Setting Stage': (
              <ArCaseStudyMediaWithBeside
                primarySrc="/arfittingroom/final3.png"
                besideSrc="/arfittingroom/setting.gif"
                gapPx={10}
              />
            ),
            "Let's Do Shopping": (
              <ArCaseStudyMediaWithBeside
                primarySrc="/arfittingroom/final4.png"
                besideSrc="/arfittingroom/long%20press%20copy.gif"
                gapPx={10}
              />
            ),
            'Experience AR Fitting Room': (
              <ArCaseStudyMediaWithBeside
                primarySrc="/arfittingroom/final1.png"
                besideSrc="/arfittingroom/timer.gif"
                gapPx={10}
              />
            ),
          }}
          proseMediaLeftBelowBySection={{
            'Unpacking The Solution': (
              <img
                src="/arfittingroom/final2.png"
                alt="UI concept screen"
                className="block h-auto w-full object-contain"
                decoding="async"
              />
            ),
          }}
          sectionExtras={{
            Background: <ArFittingStatsGraph />,
          }}
          leadMediaCrop={{ left: 0.3 }}
          heroLayout="above"
          hero={
            <ErdArFittingHero
              title={vault.title}
              headline={vault.highlight || vault.headline}
              awards={vault.awards}
              categories={vault.categories}
            />
          }
          spyTheme={isDark ? 'dark' : activeTheme}
          scrollBg={{
            hero: AR_BG_HERO,
            heroTheme: 'light',
            lead: AR_BG_LIGHT,
            leadTheme: 'light',
            bySectionTitle: AR_SECTION_BG,
            bySectionTheme: AR_SECTION_THEME,
            fallback: AR_BG_LIGHT,
            fallbackTheme: 'light',
            onChange: handleScrollBg,
          }}
        />
      </TestProjectDetailShell>
    )
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    console.error('[TestHome3ArFitting] Failed to load or parse markdown:', error)
    return <ArErrorPanel error={error} rawPreview={arFittingMarkdown} />
  }
}
