/**
 * About Me under `/test-home-3/about` — same ERD popup chrome / open system as HOVR & Piik.
 */
import { useCallback, useRef, useState, type CSSProperties } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { TestProjectBody } from '../TestProjectBody'
import { TestProjectDetailShell } from '../TestProjectDetailShell'
import { usePageTheme } from '../context/PageThemeContext'
import { ErdSiteNav } from './testHome3/ErdChrome'
import { useErdHomePaths } from './testHome3/useErdHomePaths'
import './testHomePage3.css'
import './testHome3Hovr.css'

export const ERD_ABOUT_SQUARE_LAYOUT_ID = 'erd-shop-about-square'
export const ERD_ABOUT_LAYOUT_EASE = [0.16, 1, 0.3, 1] as const

const ERD_BLACK_HEX = '#1a1917'
const ABOUT_BG_HERO = 'erd-about-bg-hero'
const ABOUT_BG_LEAD = 'erd-about-bg-lead'
const ABOUT_BG_EXPERIENCE = 'erd-about-bg-experience'
const ABOUT_BG_EDUCATION = 'erd-about-bg-education'
const ABOUT_BG_INTERESTS = 'erd-about-bg-interests'

const lightModeColors = ['#ffffff', '#ffffff', '#ffffff', ERD_BLACK_HEX, '#ffffff'] as const

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

const darkModeColors = lightModeColors.map(invertLightnessToDark)
const heroLightModeColor = lightModeColors[0]
const heroDarkModeColor = invertLightnessToDark(ERD_BLACK_HEX)

const ABOUT_BG_COLOR_INDEX: Record<string, number> = {
  [ABOUT_BG_HERO]: 0,
  [ABOUT_BG_LEAD]: 1,
  [ABOUT_BG_EXPERIENCE]: 2,
  [ABOUT_BG_EDUCATION]: 3,
  [ABOUT_BG_INTERESTS]: 4,
}

const ABOUT_SECTION_BG: Record<string, string> = {
  Experience: ABOUT_BG_EXPERIENCE,
  Education: ABOUT_BG_EDUCATION,
  Interests: ABOUT_BG_INTERESTS,
}

const ABOUT_SECTION_THEME: Record<string, 'light' | 'dark'> = {
  Experience: 'light',
  Education: 'dark',
  Interests: 'light',
}

const ABOUT_EXPERIENCE = [
  { role: 'UX/UI Designer', company: 'BMAD', period: '2025 – Present' },
  { role: 'AI/ML Software Designer', company: 'PM Accelerator', period: '2025' },
  { role: 'UX/UI Designer', company: 'HOVR', period: '2024 – 2025' },
  { role: 'Product Designer', company: 'Piik AI', period: '2024' },
  { role: 'Multimedia Designer', company: 'Freelance', period: '2020 – 2023' },
] as const

const ABOUT_HERO_IMAGE = '/me/2.jpg'
const ABOUT_DISPLAY_NAME = 'Minjoo Kim'
const ABOUT_PROJECT_LINE = 'Product & UX Designer'
const ABOUT_OVERVIEW =
  'Crafting UX solutions grounded in Data and communication'

const ABOUT_MARKDOWN = `### Profile

#### Crafting UX solutions grounded in Data and communication.

I design product experiences at the intersection of data, communication, and accessibility — across AI tooling, rideshare ops, and creator platforms.

### Experience

#### Roles spanning product, AI/ML tooling, and multimedia design.

- **UX/UI Designer:** BMAD · 2025 – Present
- **AI/ML Software Designer:** PM Accelerator · 2025
- **UX/UI Designer:** HOVR · 2024 – 2025
- **Product Designer:** Piik AI · 2024
- **Multimedia Designer:** Freelance · 2020 – 2023

### Education

#### Formal design training across university and college programs.

- **Bachelor of Design:** York University · 2020 – 2025
- **Diploma, Multimedia Design and Development:** Humber College · 2018 – 2020

### Interests

#### Outside of work — the things that keep me curious.

Cats · Travel · Mechanical keyboards · Drawing & painting · K-drama
`

const ERD_HERO_EASE = [0.45, 0, 0.55, 1] as const
const ERD_HERO_TILE_TRANSITION = {
  duration: 0.95,
  ease: ERD_HERO_EASE,
} as const

const ERD_LAYOUT_TRANSITION = {
  duration: 0.85,
  ease: ERD_ABOUT_LAYOUT_EASE,
} as const

function ErdAboutHero() {
  const reduceMotion = useReducedMotion()

  return (
    <section
      className="erd-hovr-hero-section erd-shop-row erd-hovr-hero-grid"
      data-bg={ABOUT_BG_HERO}
      data-theme="light"
    >
      <motion.div
        layoutId={ERD_ABOUT_SQUARE_LAYOUT_ID}
        transition={ERD_LAYOUT_TRANSITION}
        className="erd-shop-square erd-hovr-hero-adjacent-square"
      >
        <div className="erd-shop-square-inner">
          <div className="erd-shop-square-intro">
            <p className="erd-shop-square-name">{ABOUT_DISPLAY_NAME}</p>
            <p className="erd-shop-square-greeting">
              {[ABOUT_PROJECT_LINE, 'Portfolio'].join(' · ')}
            </p>
          </div>
          <div className="erd-shop-square-experience">
            <p className="erd-shop-square-experience-label">Overview</p>
            <p className="erd-shop-square-greeting erd-hovr-hero-square-dek">{ABOUT_OVERVIEW}</p>
            <ul className="erd-shop-square-experience-list erd-hovr-hero-meta-list">
              {ABOUT_EXPERIENCE.slice(0, 2).map((job) => (
                <li key={`${job.company}-${job.period}`}>
                  <span className="erd-shop-square-experience-role">{job.role}</span>
                  <span className="erd-shop-square-experience-meta">
                    {job.company} · {job.period}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="erd-shop-card erd-hovr-hero-card"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...ERD_HERO_TILE_TRANSITION, delay: reduceMotion ? 0 : 0.28 }}
      >
        <div className="erd-shop-card-media">
          <img
            className="erd-shop-card-video erd-hovr-hero-video"
            src={ABOUT_HERO_IMAGE}
            alt={`${ABOUT_DISPLAY_NAME} portrait`}
            decoding="async"
          />
        </div>
      </motion.div>
    </section>
  )
}

export function TestHome3About({
  backTo,
}: {
  backTo?: string
} = {}) {
  const { homePath } = useErdHomePaths()
  const resolvedBackTo = backTo ?? homePath
  const scrollRef = useRef<HTMLDivElement>(null)
  const { isDark } = usePageTheme()
  const [bgColor, setBgColor] = useState(ABOUT_BG_HERO)
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>('light')

  const handleScrollBg = useCallback((nextBg: string, nextTheme: 'light' | 'dark') => {
    setBgColor((previous) => (previous === nextBg ? previous : nextBg))
    setActiveTheme((previous) => (previous === nextTheme ? previous : nextTheme))
  }, [])

  const surfaceDark = isDark || activeTheme === 'dark'
  const currentColors = isDark ? darkModeColors : lightModeColors
  const activeColorIndex = ABOUT_BG_COLOR_INDEX[bgColor] ?? 0
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
        title="About Me"
        role="Product & UX Designer"
        headline={ABOUT_OVERVIEW}
        content={ABOUT_MARKDOWN}
        assetBasePath="/me"
        scrollRoot={scrollRef}
        heroLayout="above"
        hero={<ErdAboutHero />}
        spyTheme={isDark ? 'dark' : activeTheme}
        scrollBg={{
          hero: ABOUT_BG_HERO,
          heroTheme: 'light',
          lead: ABOUT_BG_LEAD,
          leadTheme: 'light',
          bySectionTitle: ABOUT_SECTION_BG,
          bySectionTheme: ABOUT_SECTION_THEME,
          fallback: ABOUT_BG_LEAD,
          fallbackTheme: 'light',
          onChange: handleScrollBg,
        }}
      />
    </TestProjectDetailShell>
  )
}
