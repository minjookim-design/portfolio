/**
 * Home shell for `/` and `/test`: `HomePage` renders {@link TestHomePageView} with production
 * split keys; `TestHomePage` uses {@link TEST_HOME_PAGE_CONFIG} (e.g. `data-design-test`, separate widths).
 */
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import {
  HomeIntroScrambleText,
  HomeIntroTypewriterText,
  usePrefersReducedMotion,
} from '../components/HomeIntroScrambleText'
import { useIsNarrow } from '../hooks/useIsNarrow'
import { usePageTheme } from '../context/PageThemeContext'
import { useHomeFooterAttribution } from '../context/HomeFooterAttributionContext'
import { useHomeMobileProject } from '../context/HomeMobileProjectContext'
import { HOVR_SECTIONS, HomeHovrCaseStudy, Lightbox } from './HovrProjectPage'
import { PIIK_SECTIONS, PIIK_HERO_THUMB_LIGHT, HomePiikCaseStudy } from './PiikProjectPage'
import { HomeArFittingCaseStudy } from './ArFittingProjectPage'
import {
  AR_FITTING_THUMB_LIGHT,
  AR_FITTING_THUMB_DARK,
  getArFittingHomeSpyItems,
  AR_FITTING_HOME_SPY_FIRST_ID,
} from './arFittingHomeData'
import { HomeJojoCaseStudy } from './JojoProjectPage'
import { JOJO_SECTIONS, JOJO_HERO_THUMB_DARK, JOJO_HERO_THUMB_LIGHT } from './jojoHomeData'
import { IMAGE_SIZES, OptimizedImage } from '../components/OptimizedImage'
import { CaseStudyRailTitle } from '../components/CaseStudyRailTitle'
import { TEST_HOME_PROJECT_TITLE_SERIF } from './testHomeTypography'
import { useHomeSplitColumnGuide } from '../components/HomeSplitOnboarding'
import { HOME_ENTRANCE_SPRING } from './homeCaseStudyHeroMotion'
import {
  CASE_STUDY_MOBILE_DETAILS_SCROLL_CLASS,
  HOME_DESKTOP_DETAILS_COLUMN_SHELL_MERGED,
  HOME_DESKTOP_DETAILS_COLUMN_SHELL_UNFRAMED,
} from './caseStudyMobileShell'
import {
  ProjectListHoverPreviewProvider,
  useHomeFinePointer,
  useProjectListHoverPreviewOptional,
} from '../components/ProjectListHoverPreview'
import { FooterEmail } from '../components/FooterEmail'

const CAREER_JOBS = [
  { role: 'UX/UI Designer', company: 'BMAD • Montreal, QC • Remote', period: 'Jul 2025 – Present' },
  { role: 'AI/ML Software Designer', company: 'Product Manager Accelerator • Boston, USA • Remote', period: 'Jun 2025 – Sep 2025' },
  { role: 'UX/UI Designer', company: 'HOVR • Toronto, ON • Remote', period: 'Sep 2024 – Jul 2025' },
  { role: 'Product Designer', company: 'Piik AI • Seoul, Kor • Remote', period: 'Apr 2024 – Sep 2024' },
] as const

const DEGREES = [
  { degree: 'Bachelor of Design., Spec. Hons., Design', school: 'York University', period: '2020 – 2025' },
  { degree: 'Diploma, Multimedia Design and Development', school: 'Humber College', period: '2018 – 2020' },
] as const

/** LinkedIn profile; resume hosted on Google Drive. */
const LINKEDIN_URL = 'https://www.linkedin.com/in/minjoo-kim-kor/?skipRedirect=true'
const RESUME_URL = 'https://drive.google.com/file/d/1WRFvCfASQgqN4Utfcp4b-aEZtw2FzHY3/view'

/** Intro name + role: same Instrument treatment as `testHomeProjectTitles` case-study hero `h1`. */
const HOME_INTRO_SERIF_TEST_HERO = `text-[clamp(1.75rem,7vw,2.375rem)] md:text-[38px] ${TEST_HOME_PROJECT_TITLE_SERIF}`
const HOME_MONO_SM = 'text-[12px] font-normal font-mono'
const HOME_INTRO_BIO = `I design multi-platform experiences by transforming complex spatial and product challenges into simple, intuitive interactions. My focus is on creating clear, human-centered flows across web, mobile, and VR, ensuring that emerging technologies feel approachable and highly usable.

By collaborating closely with engineers, I bridge the gap between design intent and technical feasibility to ensure high-quality, real-world implementation. I thrive in 0 to 1 environments, owning the entire design lifecycle and building scalable systems that balance user needs with technical constraints.`

/** Bio typewriter total duration; 0.7× speed → multiply prior ~3250ms baseline by 1/0.7 (each sentence’s share scales with this). */
const HOME_INTRO_TYPEWRITER_MS = Math.round((3250 / 0.7) * (HOME_INTRO_BIO.length / 320))

const SPLIT_DIVIDER_PX = 8

/** Desktop home: hairline grid (column + row rules). */
const HOME_GRID_V_LINE =
  'pointer-events-none absolute inset-y-0 left-1/2 z-0 w-px -translate-x-1/2 bg-black/[0.18] dark:bg-white/[0.14]'
const HOME_GRID_ROW_LINE =
  'border-b-[0.5px] border-black/[0.18] dark:border-b-white/[0.14]'
const HOME_GRID_FRAME_H =
  'md:border-y md:border-black/[0.16] dark:md:border-white/[0.12]'
const HOME_GRID_CELL_PAD_X = 'px-2'
const HOME_GRID_CELL_PAD_Y = 'py-1.5'

const MIN_COL1_PX = 240
const MIN_COL2_PX = 260
const MIN_COL3_PX = 300
const INITIAL_COL1_PX = 420
const INITIAL_COL2_PX = 340

export type TestHomePageExperienceConfig = {
  splitWidthsStorageKey: string
  splitOnboardingSessionKey: string
  /** Root shell: `[data-design-test="1"]` for `TestPage.tsx` scoped CSS (production `/` leaves this unset). */
  designTestRootDataAttr?: boolean
  /**
   * Desktop: wrap project list + details in one flex row with `gap-0`, remove the second resize handle.
   * Split math uses one divider (intro | group) instead of two.
   */
  mergeProjectDetailsDesktop?: boolean
  /** Desktop project list: multiply stored `c2` width/minWidth (1 = production). */
  projectListColumnWidthScale?: number
  /** Desktop details column: 10px padding, 2px stroke, 10px radius (`/test` only). */
  desktopDetailsColumnFrame?: boolean
  /** Project spy link stacks: `#FBC900` fill + `text-black` for contrast (`/test` only). */
  projectSpyStackBrandBg?: boolean
  /** Open project row button: `#FBC900` background + black text (`/test` only). */
  projectFolderOpenBgBrand?: boolean
  /**
   * `true`: cream page shell (`#faf7f0` light) and original first-column layout (no framed collapsible panes).
   * Edit `TEST_HOME_PAGE_CONFIG` below to try `false` and other flags without touching `/`.
   */
  classicShellAndIntroColumn?: boolean
}

/** Matches production `/` layout; uses separate session keys and `data-design-test` for TestPage-only CSS. */
export const TEST_HOME_PAGE_CONFIG: TestHomePageExperienceConfig = {
  splitWidthsStorageKey: 'test-split-widths',
  splitOnboardingSessionKey: 'test-onboarding-v1',
  designTestRootDataAttr: true,
  classicShellAndIntroColumn: true,
}

/** Pause after HOVR sub-menu finishes before the project column appears. */
const MENU_UNFOLD_TO_REVEAL_DELAY_MS = 400

/** Desktop: optional single flex group for project + details (test route); drops the middle resize handle. */
function DesktopProjectDetailsLayout({
  merge,
  project,
  divider2,
  details,
}: {
  merge: boolean
  project: React.ReactNode
  divider2: React.ReactNode
  details: React.ReactNode
}) {
  if (merge) {
    return (
      <div className="max-md:contents md:flex md:h-full md:min-h-0 md:max-h-full md:min-w-0 md:flex-1 md:flex-row md:items-stretch md:gap-0 md:self-stretch">
        {project}
        {details}
      </div>
    )
  }
  return (
    <>
      {project}
      {divider2}
      {details}
    </>
  )
}

type HomeMenuSeqPhase = 'idle_before_intro' | 'snap' | 'unfold' | 'reveal' | 'done'

function getMenuSnapAnimateKey(
  introDone: boolean,
  reduceMotion: boolean,
  phase: HomeMenuSeqPhase,
): 'hidden' | 'snap' | 'settled' {
  if (!introDone) return 'hidden'
  if (reduceMotion) return 'settled'
  if (phase === 'snap') return 'snap'
  return 'settled'
}

function getHovrUnfoldAnimateKey(
  introDone: boolean,
  reduceMotion: boolean,
  phase: HomeMenuSeqPhase,
): 'closed' | 'open' {
  if (!introDone) return 'closed'
  if (reduceMotion) return 'open'
  if (phase === 'snap') return 'closed'
  return 'open'
}

function buildHomeEntranceVariants(reduceMotion: boolean): {
  menuSnapRoot: Variants
  menuSnapRow: Variants
  hovrUnfoldShell: Variants
  hovrUnfoldSpyItem: Variants
  detailsColumnShell: Variants
  genericRailItem: Variants
  genericRailContainer: Variants
} {
  const spring = reduceMotion ? ({ duration: 0 } as const) : HOME_ENTRANCE_SPRING
  return {
    menuSnapRoot: {
      hidden: { opacity: 1 },
      snap: {
        opacity: 1,
        transition: {
          when: 'beforeChildren',
          staggerChildren: reduceMotion ? 0 : 0.09,
          delayChildren: reduceMotion ? 0 : 0.04,
        },
      },
      settled: {
        opacity: 1,
        transition: { duration: 0 },
      },
    },
    menuSnapRow: {
      hidden: { opacity: 0, y: 72 },
      snap: {
        opacity: 1,
        y: 0,
        transition: spring,
      },
      settled: { opacity: 1, y: 0, transition: { duration: 0 } },
    },
    hovrUnfoldShell: {
      closed: { transition: { duration: 0 } },
      open: {
        transition: {
          when: 'beforeChildren',
          delayChildren: reduceMotion ? 0 : 0.1,
          staggerChildren: reduceMotion ? 0 : 0.052,
        },
      },
    },
    hovrUnfoldSpyItem: {
      closed: { opacity: 0, y: -16 },
      open: {
        opacity: 1,
        y: 0,
        transition: spring,
      },
    },
    detailsColumnShell: {
      hidden: { opacity: 0, x: -24 },
      visible: {
        opacity: 1,
        x: 0,
        transition: spring,
      },
    },
    genericRailItem: {
      hidden: { opacity: 0, x: -36 },
      visible: {
        opacity: 1,
        x: 0,
        transition: spring,
      },
    },
    genericRailContainer: {
      hidden: {},
      visible: {
        transition: {
          when: 'beforeChildren',
          delayChildren: reduceMotion ? 0 : 0.12,
          staggerChildren: reduceMotion ? 0 : 0.08,
        },
      },
    },
  }
}

function readSplitWidthsFromSession(storageKey: string): { c1: number; c2: number } | null {
  try {
    const raw = sessionStorage.getItem(storageKey)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { c1?: unknown; c2?: unknown }
    const c1 = Number(parsed.c1)
    const c2 = Number(parsed.c2)
    if (!Number.isFinite(c1) || !Number.isFinite(c2)) return null
    return { c1, c2 }
  } catch {
    return null
  }
}

type SpyItem = { id: string; label: string; body: string; media?: string }

type HomeProject = {
  id: string
  /** Row index label in the project list (e.g. PR01). */
  rowCode: string
  route: string
  label: string
  desc: string
  /** Services / roles — shown uppercase in the table. */
  roles: string
  heroImage: string
  spy: SpyItem[]
}

/** 4-column row: Framer link (icon + title + platform + em dash). */
const HUMAN_FOLD_BODY_LINK_GRID =
  'grid w-full grid-cols-[minmax(2.5rem,2.75rem)_minmax(0,1fr)_minmax(0,1fr)_minmax(10rem,1.15fr)] items-center gap-x-6 gap-y-0.5 text-left'

/** 2-column row: classic fold triggers (glyph + title only). */
const HUMAN_FOLD_TRIGGER_GRID =
  'grid w-full grid-cols-[minmax(2.5rem,2.75rem)_minmax(0,1fr)] items-center gap-x-6 gap-y-0.5 text-left'

/** 4-column fold body rows: role / org / locale / period (no leading placeholder column). */
const HUMAN_FOLD_BODY_ROW_GRID =
  'grid w-full grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(10rem,1.15fr)] items-center gap-x-6 gap-y-0.5 text-left'

/** Education fold: degree | school | period (no empty column). */
const HUMAN_FOLD_EDUCATION_BODY_ROW_GRID =
  'grid w-full grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(10rem,1.15fr)] items-center gap-x-6 gap-y-0.5 text-left'

/** 3-column project list / detail strip: code | name | services (no location/date, `/test` only). */
const HUMAN_PROJECT_LIST_ROW_GRID =
  'grid w-full grid-cols-[minmax(2.5rem,2.75rem)_minmax(0,1.15fr)_minmax(0,1.85fr)] items-start gap-x-4 md:gap-x-8 lg:gap-x-12 gap-y-0.5 text-left'

const HUMAN_PROJECT_LIST_TYPO =
  'font-mono text-[11px] font-normal uppercase leading-snug tracking-[0.06em] md:text-[12px]'

/** Static data rows inside classic folds (matches project list typography). */
const HUMAN_FOLD_BODY_ROW = `${HUMAN_FOLD_BODY_ROW_GRID} ${HUMAN_PROJECT_LIST_TYPO} ${HOME_GRID_ROW_LINE} ${HOME_GRID_CELL_PAD_X} ${HOME_GRID_CELL_PAD_Y} text-left rounded-none`

const HUMAN_FOLD_BODY_ROW_EDUCATION = `${HUMAN_FOLD_EDUCATION_BODY_ROW_GRID} ${HUMAN_PROJECT_LIST_TYPO} ${HOME_GRID_ROW_LINE} ${HOME_GRID_CELL_PAD_X} ${HOME_GRID_CELL_PAD_Y} text-left rounded-none`

/** Framer CTA row: 5 columns (icon + copy), same grid as fold triggers. */
const HUMAN_FOLD_BODY_LINK_ROW = `${HUMAN_FOLD_BODY_LINK_GRID} ${HUMAN_PROJECT_LIST_TYPO} ${HOME_GRID_ROW_LINE} ${HOME_GRID_CELL_PAD_X} ${HOME_GRID_CELL_PAD_Y} text-left rounded-none cursor-pointer no-underline text-inherit outline-none transition-colors hover:bg-black/[0.05] focus-visible:bg-black/[0.05] dark:hover:bg-white/[0.07] dark:focus-visible:bg-white/[0.07]`

function humanCompanyColumns(company: string): { org: string; locale: string } {
  const parts = company.split('•').map((s) => s.trim()).filter(Boolean)
  return {
    org: (parts[0] ?? company).toUpperCase(),
    locale: parts.slice(1).join(' · ').toUpperCase() || '—',
  }
}

const HOME_PROJECTS: HomeProject[] = [
  {
    id: 'hovr',
    rowCode: 'PR01',
    route: '/projects/hovr',
    label: 'HOVR',
    desc: '84.9% Faster Driver Approvals via OCR Automation',
    roles: 'UX/UI, Internal Tools, AI Automation',
    heroImage: '/hovr/final-solution.jpg',
    spy: HOVR_SECTIONS.map((s) => ({
      id: s.id,
      label: s.label,
      body: typeof s.body === 'string' ? s.body.slice(0, 160) + (s.body.length > 160 ? '…' : '') : '',
      media: Array.isArray(s.media) ? s.media[0] : s.media || undefined,
    })),
  },
  {
    id: 'piikai',
    rowCode: 'PR02',
    route: '/projects/piik',
    label: 'Piik AI',
    desc: '75% Support Ticket Drop through Behavioral Analysis',
    roles: 'Product Design, Start-up',
    heroImage: PIIK_HERO_THUMB_LIGHT,
    spy: [
      { id: 'overview', label: 'Overview', body: 'End-to-end redesign of the article editor for an AI knowledge community—75% drop in editor-related complaints.', media: PIIK_HERO_THUMB_LIGHT },
      { id: 'the-goal', label: 'The Goal', body: 'Let creators focus on narrative, not the tool—remove friction when explaining complex AI topics.', media: '/piikai/article1.png' },
      { id: 'problems', label: 'Problems', body: 'Bare-minimum editing, 660px max width, and no draft save caused lost work and a cramped writing experience.', media: '/piikai/problem1.png' },
      { id: 'research', label: 'Research', body: 'Compared to Naver Blog’s dense toolbars, minimalism read as “missing features” for Korean creators—validated a richer toolkit.', media: '/piikai/naver.png' },
      { id: 'final-solution', label: 'Final Solution', body: '1080px canvas, full formatting suite, polling, code blocks, media captions, and reliable save-draft.', media: '/piikai/article2.png' },
      { id: 'takeaway', label: 'Takeaway', body: 'Treating complaints as design challenges—and prioritizing with engineering—turned pain points into measurable product robustness.', media: PIIK_HERO_THUMB_LIGHT },
    ],
  },
  {
    id: 'ar-fitting-room',
    rowCode: 'PR03',
    route: '/projects/ar-fitting-room',
    label: 'AR Fitting Room',
    desc: 'Award-Winning Accessible Design: AR Solution for Inclusive Fashion',
    roles: 'Product Design, AR, Accessibility, Award-winning',
    heroImage: AR_FITTING_THUMB_LIGHT,
    spy: getArFittingHomeSpyItems().map((s) => ({
      id: s.id,
      label: s.label,
      body: s.body,
      media: AR_FITTING_THUMB_LIGHT,
    })),
  },
]

function ProjectFolderClosedIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={14.4}
      height={14.4}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M17.5 3.33333L17.5 2.5L10 2.5L10 1.66667L9.16667 1.66667L9.16667 0.833333L8.33333 0.833333L8.33333 0L0.833333 0L0.833333 0.833333L0 0.833333L0 15.8333L0.833333 15.8333L0.833333 16.6667L17.5 16.6667L17.5 15.8333L18.3333 15.8333L18.3333 3.33333L17.5 3.33333ZM16.6667 15L1.66667 15L1.66667 1.66667L7.5 1.66667L7.5 2.5L8.33333 2.5L8.33333 3.33333L9.16667 3.33333L9.16667 4.16667L16.6667 4.16667L16.6667 15Z"
        fill="currentColor"
      />
    </svg>
  )
}

function ProjectFolderOpenIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={14.4}
      height={14.4}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M1.66665 13.3334H0.833313V2.50002H1.66665V1.66669H7.49998V2.50002H8.33331V3.33335H15.8333V4.16669H16.6666V7.50002H4.16665V8.33335H3.33331V10H2.49998V11.6667H1.66665V13.3334Z"
        fill="currentColor"
      />
      <path
        d="M19.1667 8.33331V9.99998H18.3334V11.6666H17.5V13.3333H16.6667V15H15.8334V17.5H15V18.3333H2.50002V17.5H1.66669V15H2.50002V13.3333H3.33335V11.6666H4.16669V9.99998H5.00002V8.33331H19.1667Z"
        fill="currentColor"
      />
    </svg>
  )
}

/** Index of a case-study section whose vertical center is closest to the middle 20% band of `container`. */
function getHovrActiveSectionIndex(
  container: HTMLElement,
  sectionEls: (HTMLElement | null)[],
): number {
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

/** easeInOut — classic fold expand/collapse */
const INTRO_COLLAPSE_EASE: [number, number, number, number] = [0.42, 0, 0.58, 1]

/** Same folder glyphs as project rows: closed when collapsed, open when expanded. */
function ClassicColumnFoldGlyph({ open }: { open: boolean }) {
  return open ? (
    <ProjectFolderOpenIcon className="shrink-0 text-current" />
  ) : (
    <ProjectFolderClosedIcon className="shrink-0 text-current" />
  )
}

/** Career fold: desk-style glyph; resting 24×24 art, flatter 20×14 when hovered/focused or expanded. Display stays 14.4. */
function CareerFoldGlyphIdle({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={14.4}
      height={14.4}
      viewBox="0 0 24 24"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      className={['shrink-0 text-current', className].filter(Boolean).join(' ')}
      aria-hidden
    >
      <path
        d="M2 19V5H22V19H2ZM4 17H20V7H4V17ZM8 16H16V14H8V16ZM5 13H7V11H5V13ZM8 13H10V11H8V13ZM11 13H13V11H11V13ZM14 13H16V11H14V13ZM17 13H19V11H17V13ZM5 10H7V8H5V10ZM8 10H10V8H8V10ZM11 10H13V8H11V10ZM14 10H16V8H14V10ZM17 10H19V8H17V10Z"
        fill="currentColor"
      />
    </svg>
  )
}

function CareerFoldGlyphActive({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={14.4}
      height={14.4}
      viewBox="0 0 20 14"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      className={['shrink-0 text-current', className].filter(Boolean).join(' ')}
      aria-hidden
    >
      <path
        d="M0 14V0H20V14H0ZM6 11H14V9H6V11ZM3 8H5V6H3V8ZM6 8H8V6H6V8ZM9 8H11V6H9V8ZM12 8H14V6H12V8ZM15 8H17V6H15V8ZM3 5H5V3H3V5ZM6 5H8V3H6V5ZM9 5H11V3H9V5ZM12 5H14V3H12V5ZM15 5H17V3H15V5Z"
        fill="currentColor"
      />
    </svg>
  )
}

/** Fun Works fold: arcade glyph in 24×24 viewBox (art drawn in 22×22, centered). */
function FunWorksFoldGlyphIdle({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={14.4}
      height={14.4}
      viewBox="0 0 24 24"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      className={['shrink-0 text-current', className].filter(Boolean).join(' ')}
      aria-hidden
    >
      <g transform="translate(1 1)">
        <path
          d="M1.83333 5.50016H3.66667V3.66683H16.5V5.50016H18.3333V1.8335H1.83333V5.50016ZM0 20.1668H1.83333V12.8335H0V20.1668ZM1.83333 22.0002H18.3333V20.1668H1.83333V22.0002ZM7.33333 18.3335H9.16667V16.5002H7.33333V18.3335ZM1.83333 12.8335H3.66667V9.16683H1.83333V12.8335ZM11 18.3335H12.8333V16.5002H11V18.3335ZM9.16667 16.5002H11V14.6668H14.6667V12.8335H11V11.0002H9.16667V12.8335H5.5V14.6668H9.16667V16.5002ZM18.3333 20.1668H20.1667V12.8335H18.3333V20.1668ZM3.66667 9.16683H16.5V5.50016H3.66667V9.16683ZM16.5 12.8335H18.3333V9.16683H16.5V12.8335Z"
          fill="currentColor"
        />
      </g>
    </svg>
  )
}

/** Fun Works fold: active arcade glyph in 20×14 viewBox (22×22 art scaled to fit height). */
function FunWorksFoldGlyphActive({ className }: { className?: string }) {
  const s = 14 / 22
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={14.4}
      height={14.4}
      viewBox="0 0 20 14"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      className={['shrink-0 text-current', className].filter(Boolean).join(' ')}
      aria-hidden
    >
      <g transform={`translate(${(20 - 22 * s) / 2} 0) scale(${s})`}>
        <path
          d="M1.83333 22.0002H18.3333V20.1668H20.1667V12.8335H18.3333V9.16683H16.5V7.3335H3.66667V9.16683H1.83333V12.8335H0V20.1668H1.83333V22.0002ZM7.33333 18.3335V16.5002H9.16667V14.6668H5.5V12.8335H9.16667V11.0002H11V12.8335H14.6667V14.6668H11V16.5002H12.8333V18.3335H11V16.5002H9.16667V18.3335H7.33333ZM3.66667 5.50016H16.5V3.66683H18.3333V1.8335H1.83333V3.66683H3.66667V5.50016Z"
          fill="currentColor"
        />
      </g>
    </svg>
  )
}

/** Education (“I studied at”) fold: default glyph. */
function EducationFoldGlyphIdle({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={14.4}
      height={14.4}
      viewBox="0 0 22 22"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      className={['shrink-0 text-current', className].filter(Boolean).join(' ')}
      aria-hidden
    >
      <path
        d="M0 22.0002H16.5V20.1668H1.83333V3.66683H14.6667V5.50016H16.5V1.8335H0V22.0002ZM3.66667 18.3335H7.33333V16.5002H3.66667V18.3335ZM3.66667 14.6668H7.33333V12.8335H3.66667V14.6668ZM9.16667 18.3335H14.6667V16.5002H12.8333V14.6668H11V12.8335H9.16667V18.3335ZM3.66667 11.0002H9.16667V9.16683H3.66667V11.0002ZM14.6667 16.5002H16.5V14.6668H14.6667V16.5002ZM11 12.8335H12.8333V11.0002H11V12.8335ZM3.66667 7.3335H12.8333V5.50016H3.66667V7.3335ZM16.5 14.6668H18.3333V12.8335H16.5V14.6668ZM12.8333 11.0002H14.6667V9.16683H12.8333V11.0002ZM18.3333 12.8335H20.1667V9.16683H18.3333V12.8335ZM14.6667 9.16683H18.3333V7.3335H14.6667V9.16683Z"
        fill="currentColor"
      />
    </svg>
  )
}

/** Education fold: glyph while trigger is hovered/focused or section is expanded. */
function EducationFoldGlyphActive({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={14.4}
      height={14.4}
      viewBox="0 0 22 22"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      className={['shrink-0 text-current', className].filter(Boolean).join(' ')}
      aria-hidden
    >
      <path
        d="M0 22.0002H16.5V18.3335H14.6667V20.1668H7.33333V12.8335H9.16667V11.0002H1.83333V9.16683H9.16667V11.0002H11V9.16683H12.8333V7.3335H14.6667V5.50016H16.5V1.8335H0V22.0002ZM1.83333 18.3335V16.5002H5.5V18.3335H1.83333ZM1.83333 14.6668V12.8335H5.5V14.6668H1.83333ZM11 16.5002V14.6668H12.8333V16.5002H11ZM1.83333 7.3335V5.50016H11V7.3335H1.83333ZM9.16667 18.3335H14.6667V16.5002H16.5V14.6668H18.3333V12.8335H20.1667V9.16683H18.3333V7.3335H14.6667V9.16683H12.8333V11.0002H11V12.8335H9.16667V18.3335Z"
        fill="currentColor"
      />
    </svg>
  )
}

/** Interests (“I like”) fold: default glyph. */
function InterestsFoldGlyphIdle({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={14.4}
      height={14.4}
      viewBox="0 0 24 24"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      className={['shrink-0 text-current', className].filter(Boolean).join(' ')}
      aria-hidden
    >
      <path
        d="M22 20V19H21V18H20V17H19V16H17V15H18V13H19V7H18V5H17V4H16V3H15V2H13V1H7V2H5V3H4V4H3V5H2V7H1V13H2V15H3V16H4V17H5V18H7V19H13V18H15V17H16V19H17V20H18V21H19V22H20V23H22V22H23V20H22ZM12 15V16H8V15H6V14H5V12H4V8H5V6H6V5H8V4H12V5H14V6H15V8H16V12H15V14H14V15H12Z"
        fill="currentColor"
      />
    </svg>
  )
}

/** Interests fold: glyph while trigger is hovered/focused or section is expanded. */
function InterestsFoldGlyphActive({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={14.4}
      height={14.4}
      viewBox="0 0 24 24"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      className={['shrink-0 text-current', className].filter(Boolean).join(' ')}
      aria-hidden
    >
      <path
        d="M16 17H15V18H13V19H7V18H5V17H4V16H3V15H2V13H1V7H2V5H3V4H4V3H5V2H7V1H13V2H15V3H16V4H17V5H18V7H19V13H18V15H17V16H16V17ZM23 20V22H22V23H20V22H19V21H18V20H17V19H16V18H17V17H18V16H19V17H20V18H21V19H22V20H23Z"
        fill="currentColor"
      />
    </svg>
  )
}

function ClassicFoldSection({
  sectionId,
  title,
  open,
  onToggle,
  reduceMotion,
  isDark,
  folderBrandUnifiedFrame = false,
  careerDeskGlyphs = false,
  funWorksCustomGlyphs = false,
  educationCustomGlyphs = false,
  interestsCustomGlyphs = false,
  children,
}: {
  sectionId: string
  title: string
  open: boolean
  onToggle: () => void
  reduceMotion: boolean
  isDark: boolean
  /** `/test` only: match open project row (`#FBC900` frame + header hover) when both brand flags are on. */
  folderBrandUnifiedFrame?: boolean
  /** Career fold: desk SVG — 24×24 idle, 20×14 when hovered/focused or expanded. */
  careerDeskGlyphs?: boolean
  /** Fun Works fold: idle glyph by default; active when expanded or trigger hover/focus. */
  funWorksCustomGlyphs?: boolean
  /** Education fold: idle by default; active when expanded or trigger hover/focus. */
  educationCustomGlyphs?: boolean
  /** Interests fold: idle by default; active when expanded or trigger hover/focus. */
  interestsCustomGlyphs?: boolean
  children: React.ReactNode
}) {
  const [careerHot, setCareerHot] = useState(false)
  const [funWorksHot, setFunWorksHot] = useState(false)
  const [educationHot, setEducationHot] = useState(false)
  const [interestsHot, setInterestsHot] = useState(false)
  const toggleTransition = reduceMotion ? { duration: 0 } : { duration: 0.45, ease: INTRO_COLLAPSE_EASE }

  const outerClass = folderBrandUnifiedFrame
    ? open
      ? 'relative z-[5] box-border flex w-full flex-col gap-[10px] rounded-none border-2 border-solid border-black bg-[#FBC900] text-black dark:border-white/[0.22]'
      : 'flex w-full flex-col gap-[10px]'
    : 'flex flex-col gap-[10px]'

  const innerBodyClass = folderBrandUnifiedFrame
    ? 'box-border bg-transparent pl-[32px] pr-1 text-black'
    : 'box-border pl-0 pr-1'

  const foldGlyphEl =
    careerDeskGlyphs ? (
      open || careerHot ? (
        <CareerFoldGlyphActive />
      ) : (
        <CareerFoldGlyphIdle />
      )
    ) : funWorksCustomGlyphs ? (
      open || funWorksHot ? (
        <FunWorksFoldGlyphActive />
      ) : (
        <FunWorksFoldGlyphIdle />
      )
    ) : educationCustomGlyphs ? (
      open || educationHot ? (
        <EducationFoldGlyphActive />
      ) : (
        <EducationFoldGlyphIdle />
      )
    ) : interestsCustomGlyphs ? (
      open || interestsHot ? (
        <InterestsFoldGlyphActive />
      ) : (
        <InterestsFoldGlyphIdle />
      )
    ) : (
      <ClassicColumnFoldGlyph open={open} />
    )

  const humanFoldTriggerClass = [
    HUMAN_FOLD_TRIGGER_GRID,
    HUMAN_PROJECT_LIST_TYPO,
    `w-full cursor-pointer border-0 ${HOME_GRID_ROW_LINE} ${HOME_GRID_CELL_PAD_X} ${HOME_GRID_CELL_PAD_Y} text-left outline-none transition-colors rounded-none`,
    'focus-visible:ring-2 focus-visible:ring-black/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf7f0] dark:focus-visible:ring-white/30 dark:focus-visible:ring-offset-[#111111]',
    isDark ? 'text-[#f2f2f2]' : 'text-black',
    open ? (isDark ? 'bg-white text-black' : 'bg-black text-white') : '',
    open
      ? ''
      : isDark
        ? 'hover:bg-white hover:text-black active:bg-white active:text-black'
        : 'hover:bg-black hover:text-white active:bg-black active:text-white',
  ]
    .filter(Boolean)
    .join(' ')

  const brandFoldTriggerOpenClass = `box-border ${HUMAN_FOLD_TRIGGER_GRID} w-full cursor-pointer border-0 bg-transparent ${HOME_GRID_CELL_PAD_X} ${HOME_GRID_CELL_PAD_Y} text-left font-mono text-[12px] font-normal uppercase leading-snug tracking-[0.06em] text-black outline-none transition-colors rounded-none hover:bg-[#e6b800] active:bg-[#d9ae00] focus-visible:ring-2 focus-visible:ring-black/30 dark:border-white/[0.22]`
  const brandFoldTriggerClosedClass = `box-border ${HUMAN_FOLD_TRIGGER_GRID} w-full cursor-pointer border-2 border-black bg-transparent ${HOME_GRID_CELL_PAD_X} ${HOME_GRID_CELL_PAD_Y} text-left font-mono text-[12px] font-normal uppercase leading-snug tracking-[0.06em] text-black outline-none transition-colors rounded-none focus-visible:ring-2 focus-visible:ring-black/30 dark:border-white/[0.22] dark:text-white ${
    isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.04]'
  }`

  const onFoldTriggerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onToggle()
    }
  }

  return (
    <div className={outerClass}>
      <div
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-controls={`classic-fold-${sectionId}`}
        id={`classic-fold-trigger-${sectionId}`}
        className={
          folderBrandUnifiedFrame
            ? open
              ? brandFoldTriggerOpenClass
              : brandFoldTriggerClosedClass
            : humanFoldTriggerClass
        }
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation()
          onToggle()
        }}
        onKeyDown={onFoldTriggerKeyDown}
        {...(careerDeskGlyphs || funWorksCustomGlyphs || educationCustomGlyphs || interestsCustomGlyphs
          ? {
              onMouseEnter: () => {
                if (careerDeskGlyphs) setCareerHot(true)
                if (funWorksCustomGlyphs) setFunWorksHot(true)
                if (educationCustomGlyphs) setEducationHot(true)
                if (interestsCustomGlyphs) setInterestsHot(true)
              },
              onMouseLeave: () => {
                if (careerDeskGlyphs) setCareerHot(false)
                if (funWorksCustomGlyphs) setFunWorksHot(false)
                if (educationCustomGlyphs) setEducationHot(false)
                if (interestsCustomGlyphs) setInterestsHot(false)
              },
              onFocus: () => {
                if (careerDeskGlyphs) setCareerHot(true)
                if (funWorksCustomGlyphs) setFunWorksHot(true)
                if (educationCustomGlyphs) setEducationHot(true)
                if (interestsCustomGlyphs) setInterestsHot(true)
              },
              onBlur: () => {
                if (careerDeskGlyphs) setCareerHot(false)
                if (funWorksCustomGlyphs) setFunWorksHot(false)
                if (educationCustomGlyphs) setEducationHot(false)
                if (interestsCustomGlyphs) setInterestsHot(false)
              },
            }
          : {})}
      >
        <span className="flex shrink-0 items-center justify-start pl-[10px] [&>svg]:block" aria-hidden>
          {foldGlyphEl}
        </span>
        <span className="min-w-0 font-normal tracking-[0.04em]">{title.toUpperCase()}</span>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`classic-fold-${sectionId}`}
            role="region"
            aria-labelledby={`classic-fold-trigger-${sectionId}`}
            key={sectionId}
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={toggleTransition}
            style={{ overflow: 'hidden' }}
          >
            <div className={innerBodyClass}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Deployed `/` first column: flat list, gray-era layout (no collapsible chrome). */
function ClassicHomeFirstColumn({
  bodyFont,
  isSplitDesktop,
  col1Width,
  col1MinWidth,
  introStage,
  setIntroStage,
  introDone,
  muted,
  iconFill,
  restRevealTransition,
  meImg,
  isDark,
  folderBrandUnifiedFrame = false,
}: {
  bodyFont: string
  isSplitDesktop: boolean
  col1Width: number
  col1MinWidth: number
  introStage: 0 | 1 | 2 | 3
  setIntroStage: React.Dispatch<React.SetStateAction<0 | 1 | 2 | 3>>
  introDone: boolean
  muted: string
  iconFill: string
  restRevealTransition: { duration: number; ease: readonly [number, number, number, number] }
  meImg: 1 | 2
  isDark: boolean
  folderBrandUnifiedFrame?: boolean
}) {
  const reduceMotion = usePrefersReducedMotion()
  const foldBodyMuted = folderBrandUnifiedFrame ? 'text-black' : muted
  const foldFramerIconFill = folderBrandUnifiedFrame ? '#000000' : iconFill
  /** `/test`: sections start expanded (production home keeps them collapsed). */
  const [foldCareerOpen, setFoldCareerOpen] = useState(true)
  const [foldFunOpen, setFoldFunOpen] = useState(true)
  const [foldEducationOpen, setFoldEducationOpen] = useState(true)
  const [foldInterestsOpen, setFoldInterestsOpen] = useState(true)

  const careerFoldCellsTruncate = !isSplitDesktop || col1Width < INITIAL_COL1_PX
  const careerCellClip = 'min-w-0 overflow-hidden text-ellipsis whitespace-nowrap'

  const humanFoldLinkRowClass = [
    HUMAN_FOLD_TRIGGER_GRID,
    HUMAN_PROJECT_LIST_TYPO,
    `w-full cursor-pointer border-0 ${HOME_GRID_ROW_LINE} ${HOME_GRID_CELL_PAD_X} ${HOME_GRID_CELL_PAD_Y} text-left outline-none transition-colors no-underline rounded-none`,
    'focus-visible:ring-2 focus-visible:ring-black/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf7f0] dark:focus-visible:ring-white/30 dark:focus-visible:ring-offset-[#111111]',
    isDark
      ? 'text-[#f2f2f2] hover:bg-white hover:text-black active:bg-white active:text-black'
      : 'text-black hover:bg-black hover:text-white active:bg-black active:text-white',
  ].join(' ')

  return (
    <div
      className={`flex min-h-0 min-w-0 flex-col gap-[20px] overflow-y-auto md:h-full md:shrink-0 ${bodyFont} w-full max-w-full`}
      style={isSplitDesktop ? { width: col1Width, minWidth: col1MinWidth } : undefined}
    >
      <div className="flex w-full flex-col gap-0">
        {introStage > 0 ? (
          <p className={`shrink-0 whitespace-nowrap ${HOME_INTRO_SERIF_TEST_HERO}`}>Minjoo Kim</p>
        ) : (
          <HomeIntroScrambleText
            as="p"
            className={`shrink-0 whitespace-nowrap ${HOME_INTRO_SERIF_TEST_HERO}`}
            text="Minjoo Kim"
            durationMs={1300}
            onComplete={() => setIntroStage(1)}
          />
        )}
        {introStage >= 1 && (
          <div className="flex w-full flex-col gap-2">
            {introStage >= 2 ? (
              <p className={`shrink-0 ${HOME_INTRO_SERIF_TEST_HERO}`}>Product Designer</p>
            ) : (
              <HomeIntroScrambleText
                as="p"
                className={`shrink-0 ${HOME_INTRO_SERIF_TEST_HERO}`}
                text="Product Designer"
                durationMs={750}
                onComplete={() => setIntroStage(2)}
              />
            )}
            {introStage >= 2 && (
              <div className="flex w-full flex-col gap-0">
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={humanFoldLinkRowClass}
                  aria-label="LinkedIn profile"
                >
                  <span className="flex shrink-0 items-center justify-start pl-[10px] [&>svg]:block" aria-hidden>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={14.4}
                      height={14.4}
                      viewBox="0 0 19 19"
                      fill="none"
                      preserveAspectRatio="xMidYMid meet"
                      className="block shrink-0 text-current"
                    >
                      <path
                        d="M17.5 0.833333V0H0.833333V0.833333H0V17.5H0.833333V18.3333H17.5V17.5H18.3333V0.833333H17.5ZM10 9.16667V15.8333H7.5V6.66667H10V7.5H10.8333V6.66667H14.1667V7.5H15V15.8333H12.5V9.16667H10ZM2.5 5.83333V3.33333H5V5.83333H2.5ZM5 6.66667V15.8333H2.5V6.66667H5Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <span className="min-w-0 font-normal tracking-[0.04em]">LINKEDIN</span>
                </a>
                <a
                  href={RESUME_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={humanFoldLinkRowClass}
                  aria-label="Resume (opens in Google Drive)"
                >
                  <span className="flex shrink-0 items-center justify-start pl-[10px] [&>svg]:block" aria-hidden>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={14.4}
                      height={14.4}
                      viewBox="0 0 22 22"
                      fill="none"
                      preserveAspectRatio="xMidYMid meet"
                      className="block shrink-0 text-current"
                    >
                      <path
                        d="M19.25 3.6665V8.24984H18.3334V9.1665H17.4167V10.0832H16.5V10.9998H15.5834V11.9165H14.6667V12.8332H13.75V13.7498H12.8334V14.6665H11.9167V15.5832H11V16.4998H10.0834V17.4165H7.33337V16.4998H6.41671V15.5832H5.50004V12.8332H6.41671V11.9165H7.33337V10.9998H8.25004V10.0832H9.16671V9.1665H10.0834V8.24984H11V7.33317H11.9167V6.4165H12.8334V5.49984H13.75V4.58317H14.6667V5.49984H15.5834V7.33317H14.6667V8.24984H13.75V9.1665H12.8334V10.0832H11.9167V10.9998H11V11.9165H10.0834V12.8332H9.16671V13.7498H8.25004V14.6665H10.0834V13.7498H11V12.8332H11.9167V11.9165H12.8334V10.9998H13.75V10.0832H14.6667V9.1665H15.5834V8.24984H16.5V4.58317H15.5834V3.6665H12.8334V4.58317H11.9167V5.49984H11V6.4165H10.0834V7.33317H9.16671V8.24984H8.25004V9.1665H7.33337V10.0832H6.41671V10.9998H5.50004V11.9165H4.58337V16.4998H5.50004V17.4165H6.41671V18.3332H11V17.4165H11.9167V16.4998H12.8334V15.5832H13.75V14.6665H14.6667V13.7498H15.5834V12.8332H16.5V11.9165H17.4167V10.9998H18.3334V11.9165H19.25V13.7498H18.3334V14.6665H17.4167V15.5832H16.5V16.4998H15.5834V17.4165H14.6667V18.3332H13.75V19.2498H12.8334V20.1665H11.9167V21.0832H6.41671V20.1665H4.58337V19.2498H3.66671V18.3332H2.75004V16.4998H1.83337V10.9998H2.75004V10.0832H3.66671V9.1665H4.58337V8.24984H5.50004V7.33317H6.41671V6.4165H7.33337V5.49984H8.25004V4.58317H9.16671V3.6665H10.0834V2.74984H11V1.83317H12.8334V0.916504H16.5V1.83317H17.4167V2.74984H18.3334V3.6665H19.25Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <span className="min-w-0 font-normal tracking-[0.04em]">RESUME</span>
                </a>
              </div>
            )}
            {introStage >= 2 &&
              (introStage >= 3 ? (
                <p className={`w-full whitespace-pre-line ${HOME_MONO_SM} leading-[1.2] ${muted}`}>
                  {HOME_INTRO_BIO}
                </p>
              ) : (
                <HomeIntroTypewriterText
                  as="p"
                  className={`w-full whitespace-pre-line ${HOME_MONO_SM} leading-[1.2] ${muted}`}
                  text={HOME_INTRO_BIO}
                  durationMs={HOME_INTRO_TYPEWRITER_MS}
                  completeDelayMs={400}
                  onComplete={() => setIntroStage(3)}
                />
              ))}
          </div>
        )}
        <motion.div
          initial={false}
          animate={{ opacity: introDone ? 1 : 0 }}
          transition={restRevealTransition}
          style={{ pointerEvents: introDone ? 'auto' : 'none' }}
          aria-hidden={!introDone}
          className="mt-2 w-full"
        >
          <div className="relative mt-2 w-[40%] min-w-[120px] shrink-0 max-md:w-[min(100%,220px)]" role="img" aria-label="Minjoo">
            <OptimizedImage
              src="/me/me1.png"
              alt=""
              className="pointer-events-none block h-auto w-full rounded-[10px] opacity-0"
              draggable={false}
              aria-hidden
              sizes={IMAGE_SIZES.homeIntroPhoto}
              placeholder="empty"
            />
            <OptimizedImage
              src="/me/me1.png"
              alt=""
              draggable={false}
              aria-hidden
              priority
              placeholder="empty"
              className={`absolute left-0 top-0 h-auto w-full rounded-[10px] transition-opacity duration-700 ease-in-out ${
                meImg === 1 ? 'opacity-100' : 'opacity-0'
              }`}
              sizes={IMAGE_SIZES.homeIntroPhoto}
            />
            <OptimizedImage
              src="/me/me2.png"
              alt=""
              draggable={false}
              aria-hidden
              priority
              placeholder="empty"
              className={`absolute left-0 top-0 h-auto w-full rounded-[10px] transition-opacity duration-700 ease-in-out ${
                meImg === 2 ? 'opacity-100' : 'opacity-0'
              }`}
              sizes={IMAGE_SIZES.homeIntroPhoto}
            />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={false}
        animate={{ opacity: introDone ? 1 : 0 }}
        transition={restRevealTransition}
        style={{ pointerEvents: introDone ? 'auto' : 'none' }}
        aria-hidden={!introDone}
        className="flex w-full flex-col gap-0"
      >
        <ClassicFoldSection
          sectionId="career"
          title="Career"
          open={foldCareerOpen}
          onToggle={() => setFoldCareerOpen((v) => !v)}
          reduceMotion={reduceMotion}
          isDark={isDark}
          folderBrandUnifiedFrame={folderBrandUnifiedFrame}
          careerDeskGlyphs
        >
          <div className={`pt-[2px] pb-[20px] ${foldBodyMuted}`}>
            {CAREER_JOBS.map((job) => {
              const { org, locale } = humanCompanyColumns(job.company)
              return (
                <div key={`${job.role}-${job.period}`} className={HUMAN_FOLD_BODY_ROW}>
                  <span
                    className={
                      careerFoldCellsTruncate
                        ? `${careerCellClip} font-normal tracking-[0.04em]`
                        : 'min-w-0 font-normal tracking-[0.04em]'
                    }
                    title={careerFoldCellsTruncate ? job.role : undefined}
                  >
                    {job.role.toUpperCase()}
                  </span>
                  <span
                    className={
                      careerFoldCellsTruncate ? `${careerCellClip} opacity-90` : 'min-w-0 text-balance opacity-90'
                    }
                    title={careerFoldCellsTruncate ? org : undefined}
                  >
                    {org}
                  </span>
                  <span
                    className={careerFoldCellsTruncate ? `${careerCellClip} opacity-90` : 'min-w-0 opacity-90'}
                    title={careerFoldCellsTruncate ? locale : undefined}
                  >
                    {locale}
                  </span>
                  <span
                    className={
                      careerFoldCellsTruncate
                        ? `${careerCellClip} tabular-nums opacity-90`
                        : 'tabular-nums opacity-90 whitespace-nowrap'
                    }
                    title={careerFoldCellsTruncate ? job.period : undefined}
                  >
                    {job.period.toUpperCase()}
                  </span>
                </div>
              )
            })}
          </div>
        </ClassicFoldSection>

        <ClassicFoldSection
          sectionId="fun-works"
          title="Fun Works I do"
          open={foldFunOpen}
          onToggle={() => setFoldFunOpen((v) => !v)}
          reduceMotion={reduceMotion}
          isDark={isDark}
          folderBrandUnifiedFrame={folderBrandUnifiedFrame}
          funWorksCustomGlyphs
        >
          <div className={`flex w-full flex-col pt-[2px] pb-[20px] ${foldBodyMuted}`}>
            <div className={HUMAN_FOLD_BODY_ROW}>
              <span className="col-span-4 min-w-0 font-normal tracking-[0.04em]">
                I MAKE FRAMER COMPONENTS USING AI AND MONETIZE THEM
              </span>
            </div>
            <a
              href="https://www.framer.com/@minjoo-kim-j8bshr/"
              target="_blank"
              rel="noopener noreferrer"
              className={HUMAN_FOLD_BODY_LINK_ROW}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <span className="flex w-full items-center justify-center [&>svg]:block" aria-hidden>
                <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" className="shrink-0">
                  <path
                    d="M7 17C5.61667 17 4.43767 16.5123 3.463 15.537C2.48833 14.5617 2.00067 13.3827 2 12C1.99933 10.6173 2.487 9.43833 3.463 8.463C4.439 7.48767 5.618 7 7 7H10C10.2833 7 10.521 7.096 10.713 7.288C10.905 7.48 11.0007 7.71733 11 8C10.9993 8.28267 10.9033 8.52033 10.712 8.713C10.5207 8.90567 10.2833 9.00133 10 9H7C6.16667 9 5.45833 9.29167 4.875 9.875C4.29167 10.4583 4 11.1667 4 12C4 12.8333 4.29167 13.5417 4.875 14.125C5.45833 14.7083 6.16667 15 7 15H10C10.2833 15 10.521 15.096 10.713 15.288C10.905 15.48 11.0007 15.7173 11 16C10.9993 16.2827 10.9033 16.5203 10.712 16.713C10.5207 16.9057 10.2833 17.0013 10 17H7ZM9 13C8.71667 13 8.47933 12.904 8.288 12.712C8.09667 12.52 8.00067 12.2827 8 12C7.99933 11.7173 8.09533 11.48 8.288 11.288C8.48067 11.096 8.718 11 9 11H15C15.2833 11 15.521 11.096 15.713 11.288C15.905 11.48 16.0007 11.7173 16 12C15.9993 12.2827 15.9033 12.5203 15.712 12.713C15.5207 12.9057 15.2833 13.0013 15 13H9ZM14 17C13.7167 17 13.4793 16.904 13.288 16.712C13.0967 16.52 13.0007 16.2827 13 16C12.9993 15.7173 13.0953 15.48 13.288 15.288C13.4807 15.096 13.718 15 14 15H17C17.8333 15 18.5417 14.7083 19.125 14.125C19.7083 13.5417 20 12.8333 20 12C20 11.1667 19.7083 10.4583 19.125 9.875C18.5417 9.29167 17.8333 9 17 9H14C13.7167 9 13.4793 8.904 13.288 8.712C13.0967 8.52 13.0007 8.28267 13 8C12.9993 7.71733 13.0953 7.48 13.288 7.288C13.4807 7.096 13.718 7 14 7H17C18.3833 7 19.5627 7.48767 20.538 8.463C21.5133 9.43833 22.0007 10.6173 22 12C21.9993 13.3827 21.5117 14.562 20.537 15.538C19.5623 16.514 18.3833 17.0013 17 17H14Z"
                    fill={foldFramerIconFill}
                  />
                </svg>
              </span>
              <span className="min-w-0 font-normal tracking-[0.04em]">LOOK WHAT I MADE</span>
              <span className="min-w-0 opacity-90">FRAMER</span>
              <span className="tabular-nums opacity-90">—</span>
            </a>
          </div>
        </ClassicFoldSection>

        <ClassicFoldSection
          sectionId="education"
          title="I studied at"
          open={foldEducationOpen}
          onToggle={() => setFoldEducationOpen((v) => !v)}
          reduceMotion={reduceMotion}
          isDark={isDark}
          folderBrandUnifiedFrame={folderBrandUnifiedFrame}
          educationCustomGlyphs
        >
          <div className="flex w-full flex-col gap-[18px] pt-[2px]">
            <div className={foldBodyMuted}>
              {DEGREES.map((edu) => {
                return (
                  <div key={edu.degree} className={HUMAN_FOLD_BODY_ROW_EDUCATION}>
                    <span className="min-w-0 font-normal tracking-[0.04em]">{edu.degree.toUpperCase()}</span>
                    <span className="min-w-0 text-balance opacity-90">{edu.school.toUpperCase()}</span>
                    <span className="tabular-nums opacity-90 whitespace-nowrap">{edu.period.toUpperCase()}</span>
                  </div>
                )
              })}
            </div>
            <OptimizedImage
              src="/me/gradphoto-portfolio.jpg"
              alt=""
              className="mb-[20px] block h-auto w-full"
              sizes={IMAGE_SIZES.homeIntroFull}
              placeholder="blur"
            />
          </div>
        </ClassicFoldSection>

        <ClassicFoldSection
          sectionId="interests"
          title="I like"
          open={foldInterestsOpen}
          onToggle={() => setFoldInterestsOpen((v) => !v)}
          reduceMotion={reduceMotion}
          isDark={isDark}
          folderBrandUnifiedFrame={folderBrandUnifiedFrame}
          interestsCustomGlyphs
        >
          <div className="flex w-full flex-col gap-[10px] pt-[2px]">
            <div className={`${HUMAN_FOLD_BODY_ROW} ${foldBodyMuted}`}>
              <span className="col-span-4 min-w-0 opacity-90">
                CATS · TRAVEL · MECHANICAL KEYBOARDS · DRAWING & PAINTING · K-DRAMA
              </span>
            </div>
            <div className="flex w-full flex-col gap-0">
              <OptimizedImage
                src="/me/cat.jpg"
                alt=""
                className="block h-auto w-full"
                sizes={IMAGE_SIZES.homeIntroFull}
                placeholder="blur"
              />
              <OptimizedImage
                src="/me/2.jpg"
                alt=""
                className="block h-auto w-full"
                sizes={IMAGE_SIZES.homeIntroFull}
                placeholder="blur"
              />
              <OptimizedImage
                src="/me/3.jpg"
                alt=""
                className="block h-auto w-full"
                sizes={IMAGE_SIZES.homeIntroFull}
                placeholder="blur"
              />
            </div>
          </div>
        </ClassicFoldSection>
        </motion.div>
    </div>
  )
}

export function TestHomePageView({ config }: { config: TestHomePageExperienceConfig }) {
  const isMobileForPreview = useIsNarrow(768)
  const finePointer = useHomeFinePointer()
  const reduceMotionForPreview = usePrefersReducedMotion()
  return (
    <ProjectListHoverPreviewProvider
      enabled={!isMobileForPreview && finePointer}
      reduceMotion={reduceMotionForPreview}
    >
      <TestHomePageViewInner config={config} />
    </ProjectListHoverPreviewProvider>
  )
}

function TestHomePageViewInner({ config }: { config: TestHomePageExperienceConfig }) {
  const { isDark } = usePageTheme()
  const isMobile = useIsNarrow(768)
  const { detailOpen: mobileProjectDetailOpen, setDetailOpen: setMobileProjectDetailOpen } =
    useHomeMobileProject()
  const mobileProjectDetailOpenRef = useRef(mobileProjectDetailOpen)
  mobileProjectDetailOpenRef.current = mobileProjectDetailOpen
  const isSplitDesktop = !useIsNarrow(767)
  const homeShellRef = useRef<HTMLDivElement>(null)
  const [openProjectId, setOpenProjectId] = useState<string | null>(() => HOME_PROJECTS[0]?.id ?? null)
  const openProjectIdRef = useRef(openProjectId)
  openProjectIdRef.current = openProjectId
  const [menuFolderHoverId, setMenuFolderHoverId] = useState<string | null>(null)
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null)
  const hovrSectionRefs = useRef<(HTMLDivElement | null)[]>([])
  const piikSectionRefs = useRef<(HTMLDivElement | null)[]>([])
  const arFittingSectionRefs = useRef<(HTMLDivElement | null)[]>([])
  const jojoSectionRefs = useRef<(HTMLDivElement | null)[]>([])
  const detailsColumnRef = useRef<HTMLDivElement>(null)
  const introScrollRef = useRef<HTMLDivElement>(null)
  const splitContainerRef = useRef<HTMLDivElement>(null)
  const prevMobileRef = useRef<boolean | null>(null)
  const [colWidths, setColWidths] = useState(() => {
    const stored = readSplitWidthsFromSession(config.splitWidthsStorageKey)
    return stored ?? { c1: INITIAL_COL1_PX, c2: INITIAL_COL2_PX }
  })
  const colWidthsRef = useRef(colWidths)
  colWidthsRef.current = colWidths
  const [hovrSpyFromScroll, setHovrSpyFromScroll] = useState<string>(HOVR_SECTIONS[0].id)
  const [piikSpyFromScroll, setPiikSpyFromScroll] = useState<string>(PIIK_SECTIONS[0].id)
  const [arFittingSpyFromScroll, setArFittingSpyFromScroll] = useState<string>(AR_FITTING_HOME_SPY_FIRST_ID)
  const [jojoSpyFromScroll, setJojoSpyFromScroll] = useState<string>(JOJO_SECTIONS[0].id)
  const [meImg, setMeImg] = useState<1 | 2>(1)
  const reduceMotion = usePrefersReducedMotion()
  const projectListHover = useProjectListHoverPreviewOptional()
  const [introStage, setIntroStage] = useState<0 | 1 | 2 | 3>(() => {
    if (typeof window === 'undefined') return 0
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 3 : 0
  })
  useEffect(() => {
    if (reduceMotion) setIntroStage(3)
  }, [reduceMotion])

  const [spyByProject, setSpyByProject] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    HOME_PROJECTS.forEach((p) => {
      init[p.id] = p.spy[0]?.id ?? 'overview'
    })
    return init
  })

  const displayProject = useMemo((): HomeProject | null => {
    if (openProjectId == null) return null
    return HOME_PROJECTS.find((p) => p.id === openProjectId) ?? null
  }, [openProjectId])

  const activeSpyId =
    displayProject == null
      ? null
      : displayProject.id === 'hovr'
        ? hovrSpyFromScroll
        : displayProject.id === 'piikai'
          ? piikSpyFromScroll
          : displayProject.id === 'ar-fitting-room'
            ? arFittingSpyFromScroll
            : displayProject.id === 'jojo'
              ? jojoSpyFromScroll
          : (spyByProject[displayProject.id] ?? displayProject.spy[0]?.id)

  const activeSpy = useMemo(() => {
    if (displayProject == null || activeSpyId == null) return null
    return displayProject.spy.find((s) => s.id === activeSpyId) ?? displayProject.spy[0]
  }, [displayProject, activeSpyId])

  const genericHeroImgSrc = useMemo(() => {
    if (displayProject == null) return ''
    const raw = activeSpy?.media ?? displayProject.heroImage
    if (displayProject.id === 'jojo') {
      return isDark ? JOJO_HERO_THUMB_DARK : JOJO_HERO_THUMB_LIGHT
    }
    if (displayProject.id === 'ar-fitting-room') {
    return isDark ? AR_FITTING_THUMB_DARK : AR_FITTING_THUMB_LIGHT
    }
    return raw
  }, [displayProject, activeSpy, isDark])

  const setSpyForProject = useCallback((projectId: string, spyId: string) => {
    setSpyByProject((prev) => ({ ...prev, [projectId]: spyId }))
  }, [])

  const scrollHovrSection = useCallback((spyId: string) => {
    const idx = HOVR_SECTIONS.findIndex((s) => s.id === spyId)
    if (idx < 0) return
    requestAnimationFrame(() => {
      hovrSectionRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [])

  const scrollPiikSection = useCallback((spyId: string) => {
    const idx = PIIK_SECTIONS.findIndex((s) => s.id === spyId)
    if (idx < 0) return
    requestAnimationFrame(() => {
      piikSectionRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [])

  const scrollArFittingSection = useCallback((spyId: string) => {
    const idx = getArFittingHomeSpyItems().findIndex((s) => s.id === spyId)
    if (idx < 0) return
    requestAnimationFrame(() => {
      arFittingSectionRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [])

  const scrollJojoSection = useCallback((spyId: string) => {
    const idx = JOJO_SECTIONS.findIndex((s) => s.id === spyId)
    if (idx < 0) return
    requestAnimationFrame(() => {
      jojoSectionRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [])

  const toggleProject = useCallback((id: string) => {
    setOpenProjectId((prev) => (prev === id ? null : id))
    setSpyByProject((prev) => ({ ...prev, [id]: HOME_PROJECTS.find((p) => p.id === id)?.spy[0]?.id ?? 'overview' }))
  }, [])

  const openMobileProjectSheet = useCallback(
    (projectId: string) => {
      const p = HOME_PROJECTS.find((x) => x.id === projectId)
      const firstSpy = p?.spy[0]?.id ?? 'overview'
      setOpenProjectId(projectId)
      setSpyByProject((prev) => ({ ...prev, [projectId]: firstSpy }))
      if (projectId === 'hovr') setHovrSpyFromScroll(HOVR_SECTIONS[0]?.id ?? firstSpy)
      if (projectId === 'piikai') setPiikSpyFromScroll(PIIK_SECTIONS[0]?.id ?? firstSpy)
      if (projectId === 'ar-fitting-room') {
        setArFittingSpyFromScroll(AR_FITTING_HOME_SPY_FIRST_ID)
      }
      if (projectId === 'jojo') setJojoSpyFromScroll(JOJO_SECTIONS[0]?.id ?? firstSpy)
      setMobileProjectDetailOpen(true)
    },
    [setMobileProjectDetailOpen],
  )

  useEffect(() => {
    if (prevMobileRef.current === null) {
      prevMobileRef.current = isMobile
      if (isMobile) setOpenProjectId(null)
      return
    }
    if (prevMobileRef.current === isMobile) return
    prevMobileRef.current = isMobile
    if (isMobile) {
      setOpenProjectId(null)
      setMobileProjectDetailOpen(false)
    } else {
      setOpenProjectId((id) => id ?? HOME_PROJECTS[0]?.id ?? null)
      setMobileProjectDetailOpen(false)
    }
  }, [isMobile, setMobileProjectDetailOpen])

  useEffect(() => {
    if (!isMobile || mobileProjectDetailOpen) return
    introScrollRef.current?.scrollTo({
      top: 0,
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  }, [isMobile, mobileProjectDetailOpen, reduceMotion])

  useEffect(() => {
    const el = detailsColumnRef.current
    if (el) {
      el.scrollTop = 0
    }
  }, [openProjectId])

  const updateHovrSpyFromScroll = useCallback(() => {
    const container = detailsColumnRef.current
    if (!container || displayProject?.id !== 'hovr') return
    const idx = getHovrActiveSectionIndex(container, hovrSectionRefs.current)
    const id = HOVR_SECTIONS[idx]?.id
    if (id) setHovrSpyFromScroll(id)
  }, [displayProject?.id])

  const updatePiikSpyFromScroll = useCallback(() => {
    const container = detailsColumnRef.current
    if (!container || displayProject?.id !== 'piikai') return
    const idx = getHovrActiveSectionIndex(container, piikSectionRefs.current)
    const id = PIIK_SECTIONS[idx]?.id
    if (id) setPiikSpyFromScroll(id)
  }, [displayProject?.id])

  const updateArFittingSpyFromScroll = useCallback(() => {
    const container = detailsColumnRef.current
    if (!container || displayProject?.id !== 'ar-fitting-room') return
    const idx = getHovrActiveSectionIndex(container, arFittingSectionRefs.current)
    const id = getArFittingHomeSpyItems()[idx]?.id
    if (id) setArFittingSpyFromScroll(id)
  }, [displayProject?.id])

  const updateJojoSpyFromScroll = useCallback(() => {
    const container = detailsColumnRef.current
    if (!container || displayProject?.id !== 'jojo') return
    const idx = getHovrActiveSectionIndex(container, jojoSectionRefs.current)
    const id = JOJO_SECTIONS[idx]?.id
    if (id) setJojoSpyFromScroll(id)
  }, [displayProject?.id])

  useEffect(() => {
    const container = detailsColumnRef.current
    if (!container || displayProject?.id !== 'hovr') return
    const onScroll = () => updateHovrSpyFromScroll()
    container.addEventListener('scroll', onScroll, { passive: true })
    const ro = new ResizeObserver(() => updateHovrSpyFromScroll())
    ro.observe(container)
    requestAnimationFrame(() => updateHovrSpyFromScroll())
    return () => {
      container.removeEventListener('scroll', onScroll)
      ro.disconnect()
    }
  }, [displayProject?.id, updateHovrSpyFromScroll])

  useEffect(() => {
    const container = detailsColumnRef.current
    if (!container || displayProject?.id !== 'piikai') return
    const onScroll = () => updatePiikSpyFromScroll()
    container.addEventListener('scroll', onScroll, { passive: true })
    const ro = new ResizeObserver(() => updatePiikSpyFromScroll())
    ro.observe(container)
    requestAnimationFrame(() => updatePiikSpyFromScroll())
    return () => {
      container.removeEventListener('scroll', onScroll)
      ro.disconnect()
    }
  }, [displayProject?.id, updatePiikSpyFromScroll])

  useEffect(() => {
    const container = detailsColumnRef.current
    if (!container || displayProject?.id !== 'ar-fitting-room') return
    const onScroll = () => updateArFittingSpyFromScroll()
    container.addEventListener('scroll', onScroll, { passive: true })
    const ro = new ResizeObserver(() => updateArFittingSpyFromScroll())
    ro.observe(container)
    requestAnimationFrame(() => updateArFittingSpyFromScroll())
    return () => {
      container.removeEventListener('scroll', onScroll)
      ro.disconnect()
    }
  }, [displayProject?.id, updateArFittingSpyFromScroll])

  useEffect(() => {
    const container = detailsColumnRef.current
    if (!container || displayProject?.id !== 'jojo') return
    const onScroll = () => updateJojoSpyFromScroll()
    container.addEventListener('scroll', onScroll, { passive: true })
    const ro = new ResizeObserver(() => updateJojoSpyFromScroll())
    ro.observe(container)
    requestAnimationFrame(() => updateJojoSpyFromScroll())
    return () => {
      container.removeEventListener('scroll', onScroll)
      ro.disconnect()
    }
  }, [displayProject?.id, updateJojoSpyFromScroll])

  useEffect(() => {
    const id = setInterval(() => setMeImg((n) => (n === 1 ? 2 : 1)), 2500)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    ;['/me/me1.png', '/me/me2.png'].forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [])

  useEffect(() => {
    if (!isSplitDesktop) return
    try {
      sessionStorage.setItem(config.splitWidthsStorageKey, JSON.stringify(colWidths))
    } catch {
      /* ignore quota / private mode */
    }
  }, [colWidths, isSplitDesktop, config.splitWidthsStorageKey])

  const getSplitInnerWidth = useCallback(() => {
    const el = splitContainerRef.current
    if (!el) return 1200
    const dividerSlots = config.mergeProjectDetailsDesktop ? 1 : 2
    return Math.max(0, el.getBoundingClientRect().width - dividerSlots * SPLIT_DIVIDER_PX)
  }, [config.mergeProjectDetailsDesktop])

  const projectColWScale = config.projectListColumnWidthScale ?? 1

  const clampColWidthsToContainer = useCallback(() => {
    const innerW = getSplitInnerWidth()
    const s = projectColWScale
    setColWidths((prev) => {
      let c1 = Math.max(MIN_COL1_PX, Math.min(prev.c1, innerW - prev.c2 * s - MIN_COL3_PX))
      let c2 = Math.max(MIN_COL2_PX, Math.min(prev.c2, (innerW - c1 - MIN_COL3_PX) / s))
      if (c1 + c2 * s + MIN_COL3_PX > innerW) {
        c2 = Math.max(MIN_COL2_PX, (innerW - c1 - MIN_COL3_PX) / s)
        if (c1 + c2 * s + MIN_COL3_PX > innerW) {
          c1 = Math.max(MIN_COL1_PX, innerW - c2 * s - MIN_COL3_PX)
        }
      }
      return { c1, c2 }
    })
  }, [getSplitInnerWidth, projectColWScale])

  useEffect(() => {
    if (!isSplitDesktop) return
    const el = splitContainerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => clampColWidthsToContainer())
    ro.observe(el)
    requestAnimationFrame(() => clampColWidthsToContainer())
    return () => ro.disconnect()
  }, [isSplitDesktop, clampColWidthsToContainer])

  const handleDividerPointerDown = useCallback(
    (which: 1 | 2) => (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) return
      e.preventDefault()
      e.stopPropagation()
      const target = e.currentTarget
      target.setPointerCapture(e.pointerId)
      const startX = e.clientX
      const { c1: startC1, c2: startC2 } = colWidthsRef.current

      const onMove = (ev: PointerEvent) => {
        const innerW = getSplitInnerWidth()
        const s = projectColWScale
        const dx = ev.clientX - startX
        if (which === 1) {
          const n1 = Math.max(MIN_COL1_PX, Math.min(startC1 + dx, innerW - startC2 * s - MIN_COL3_PX))
          setColWidths({ c1: n1, c2: startC2 })
        } else {
          const n2 = Math.max(
            MIN_COL2_PX,
            Math.min(startC2 + dx, (innerW - startC1 - MIN_COL3_PX) / s),
          )
          setColWidths({ c1: startC1, c2: n2 })
        }
      }

      const end = (ev: PointerEvent) => {
        try {
          if (target.hasPointerCapture(ev.pointerId)) target.releasePointerCapture(ev.pointerId)
        } catch {
          /* ignore */
        }
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', end)
        window.removeEventListener('pointercancel', end)
      }
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', end)
      window.addEventListener('pointercancel', end)
    },
    [getSplitInnerWidth, projectColWScale],
  )

  const text = isDark ? 'text-[#FFFFFF]' : 'text-black'
  /** Both on (`/test`): one frame around yellow header + spy list; avoids clipped / covered partial borders. */
  const folderBrandUnifiedFrame =
    config.projectFolderOpenBgBrand === true && config.projectSpyStackBrandBg === true
  const muted = isDark ? 'text-[#FFFFFF]/85' : 'text-black'
  const bodyFont = "font-['Arial',sans-serif] text-[14px] leading-4 not-italic"
  const iconFill = isDark ? '#FFFFFF' : 'black'

  const introDone = introStage === 3
  const restRevealTransition = { duration: 1.6, ease: [0.45, 0, 0.55, 1] as const }
  const entranceV = useMemo(() => buildHomeEntranceVariants(reduceMotion), [reduceMotion])
  const postIntroInitial = reduceMotion ? false : 'hidden'

  const [menuSeqPhase, setMenuSeqPhase] = useState<HomeMenuSeqPhase>('idle_before_intro')
  const menuSeqPhaseRef = useRef(menuSeqPhase)
  menuSeqPhaseRef.current = menuSeqPhase

  useEffect(() => {
    if (!introDone) return
    if (reduceMotion) {
      setMenuSeqPhase('done')
      return
    }
    setMenuSeqPhase((p) => (p === 'idle_before_intro' ? 'snap' : p))
  }, [introDone, reduceMotion])

  const handleSnapStaggerComplete = useCallback(() => {
    if (menuSeqPhaseRef.current !== 'snap') return
    /** HOVR-only unfold/reveal needs a selected HOVR row; otherwise skip to done (all folders stay closed). */
    if (openProjectIdRef.current !== 'hovr') {
      setMenuSeqPhase('done')
      return
    }
    setMenuSeqPhase('unfold')
  }, [])

  const unfoldToRevealRef = useRef(false)
  const revealAfterUnfoldTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (revealAfterUnfoldTimeoutRef.current != null) {
        clearTimeout(revealAfterUnfoldTimeoutRef.current)
        revealAfterUnfoldTimeoutRef.current = null
      }
    },
    [],
  )

  const handleHovrLastSpyEntered = useCallback(() => {
    if (menuSeqPhaseRef.current !== 'unfold' || unfoldToRevealRef.current) return
    unfoldToRevealRef.current = true
    if (revealAfterUnfoldTimeoutRef.current != null) clearTimeout(revealAfterUnfoldTimeoutRef.current)
    const delayMs = reduceMotion ? 0 : MENU_UNFOLD_TO_REVEAL_DELAY_MS
    revealAfterUnfoldTimeoutRef.current = window.setTimeout(() => {
      revealAfterUnfoldTimeoutRef.current = null
      setMenuSeqPhase('reveal')
    }, delayMs)
  }, [reduceMotion])

  const heroSequenceDoneRef = useRef(false)
  const revealFallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleHeroEntranceComplete = useCallback(() => {
    if (menuSeqPhaseRef.current !== 'reveal' || heroSequenceDoneRef.current) return
    if (revealFallbackTimerRef.current != null) {
      clearTimeout(revealFallbackTimerRef.current)
      revealFallbackTimerRef.current = null
    }
    heroSequenceDoneRef.current = true
    setMenuSeqPhase('done')
  }, [])

  /** No details column / no project: skip reveal wait (HOVR hero never mounts). */
  useEffect(() => {
    if (menuSeqPhase !== 'reveal' || displayProject != null) return
    if (heroSequenceDoneRef.current) return
    heroSequenceDoneRef.current = true
    if (revealFallbackTimerRef.current != null) {
      clearTimeout(revealFallbackTimerRef.current)
      revealFallbackTimerRef.current = null
    }
    setMenuSeqPhase('done')
  }, [menuSeqPhase, displayProject])

  /** If hero `onAnimationComplete` never fires (wrong project, Framer edge case), still reach `done` so split onboarding can run. */
  useEffect(() => {
    if (menuSeqPhase !== 'reveal' || isMobile || reduceMotion) return
    if (revealFallbackTimerRef.current != null) {
      clearTimeout(revealFallbackTimerRef.current)
    }
    revealFallbackTimerRef.current = window.setTimeout(() => {
      revealFallbackTimerRef.current = null
      if (menuSeqPhaseRef.current !== 'reveal' || heroSequenceDoneRef.current) return
      if (import.meta.env.DEV) {
        console.warn(
          '[home] menu reveal fallback: forcing menuSeqPhase done (hero entrance callback may not have fired)',
        )
      }
      heroSequenceDoneRef.current = true
      setMenuSeqPhase('done')
    }, 6500)
    return () => {
      if (revealFallbackTimerRef.current != null) {
        clearTimeout(revealFallbackTimerRef.current)
        revealFallbackTimerRef.current = null
      }
    }
  }, [menuSeqPhase, isMobile, reduceMotion])

  const menuSnapKey = getMenuSnapAnimateKey(introDone, reduceMotion, menuSeqPhase)
  const hovrUnfoldKey = getHovrUnfoldAnimateKey(introDone, reduceMotion, menuSeqPhase)
  const menuSnapInitial = reduceMotion ? false : 'hidden'

  const isFolderOpenUi = useCallback(
    (projectId: string) => {
      if (!introDone) return false
      if (reduceMotion) return openProjectId === projectId
      if (menuSeqPhase === 'snap') return false
      if (menuSeqPhase === 'unfold' || menuSeqPhase === 'reveal') {
        return projectId === 'hovr' && openProjectId === 'hovr'
      }
      return openProjectId === projectId
    },
    [introDone, reduceMotion, menuSeqPhase, openProjectId],
  )

  const detailsColumnEntrance = menuSeqPhase === 'reveal' || menuSeqPhase === 'done'
  const menuColumnInteractive = menuSeqPhase === 'done'
  const classicHome = config.classicShellAndIntroColumn === true

  const splitOnboardingDivider1Ref = useRef<HTMLDivElement>(null)
  const splitColumnGuide = useHomeSplitColumnGuide({
    entranceComplete: menuSeqPhase === 'done',
    isMobile,
    reduceMotion,
    isDark,
    firstDividerRef: splitOnboardingDivider1Ref,
    sessionStorageKey: config.splitOnboardingSessionKey,
    ...(import.meta.env.DEV ? { menuSeqPhaseForDev: menuSeqPhase } : {}),
  })

  const homeFooterAttribution = useHomeFooterAttribution()
  const setHomeHovrAttributionReady =
    homeFooterAttribution?.setHomeHovrAttributionReady

  const HOVR_FOOTER_ATTRIBUTION_DELAY_MS = 300

  useEffect(() => {
    if (!setHomeHovrAttributionReady) return
    setHomeHovrAttributionReady(false)
    return () => setHomeHovrAttributionReady(false)
  }, [setHomeHovrAttributionReady])

  useEffect(() => {
    if (!setHomeHovrAttributionReady) return
    const hovrShowing =
      displayProject?.id === 'hovr' &&
      ((!isMobile && detailsColumnEntrance) || (isMobile && mobileProjectDetailOpen))
    if (!hovrShowing) return
    const id = window.setTimeout(() => {
      setHomeHovrAttributionReady(true)
    }, HOVR_FOOTER_ATTRIBUTION_DELAY_MS)
    return () => clearTimeout(id)
  }, [
    detailsColumnEntrance,
    displayProject?.id,
    isMobile,
    mobileProjectDetailOpen,
    setHomeHovrAttributionReady,
  ])

  const renderDetailsColumnChildren = () => {
    if (displayProject == null) return null
    if (displayProject.id === 'hovr') {
  return (
        <HomeHovrCaseStudy
          isDark={isDark}
          isMobile={isMobile}
          sectionRefs={hovrSectionRefs}
          onMediaClick={setSelectedMedia}
          entranceActive={detailsColumnEntrance}
          reduceMotion={reduceMotion}
          onHeroEntranceComplete={handleHeroEntranceComplete}
          testHomeProjectTitles
          testHomeHighlightSectionId={activeSpyId}
        />
      )
    }
    if (displayProject.id === 'piikai') {
      return (
        <HomePiikCaseStudy
          isDark={isDark}
          isMobile={isMobile}
          sectionRefs={piikSectionRefs}
          onMediaClick={setSelectedMedia}
          entranceActive={detailsColumnEntrance}
          reduceMotion={reduceMotion}
          onHeroEntranceComplete={handleHeroEntranceComplete}
          testHomeProjectTitles
          testHomeHighlightSectionId={activeSpyId}
        />
      )
    }
    if (displayProject.id === 'ar-fitting-room') {
      return (
        <HomeArFittingCaseStudy
          isDark={isDark}
          isMobile={isMobile}
          sectionRefs={arFittingSectionRefs}
          onMediaClick={setSelectedMedia}
          entranceActive={detailsColumnEntrance}
          reduceMotion={reduceMotion}
          onHeroEntranceComplete={handleHeroEntranceComplete}
          testHomeProjectTitles
          testHomeHighlightSectionId={activeSpyId}
        />
      )
    }
    if (displayProject.id === 'jojo') {
      return (
        <HomeJojoCaseStudy
          isDark={isDark}
          isMobile={isMobile}
          sectionRefs={jojoSectionRefs}
          onMediaClick={setSelectedMedia}
          testHomeProjectTitles
          testHomeHighlightSectionId={activeSpyId}
        />
      )
    }
    return (
      <motion.div
        className="flex flex-col gap-6"
        variants={entranceV.genericRailContainer}
        initial={postIntroInitial}
        animate={detailsColumnEntrance ? 'visible' : 'hidden'}
      >
        <motion.div variants={entranceV.genericRailItem} className="relative aspect-[577/277] w-full overflow-hidden rounded-none">
          {activeSpy?.media?.endsWith('.mp4') ? (
            <video
              key={activeSpy.media}
              className="h-full w-full object-cover"
              src={activeSpy.media}
              muted
              loop
              playsInline
              autoPlay
            />
          ) : (
            <OptimizedImage
              key={genericHeroImgSrc}
              src={genericHeroImgSrc}
              alt=""
              className="h-full w-full object-cover"
              sizes={IMAGE_SIZES.caseStudyFull}
              placeholder="blur"
            />
          )}
        </motion.div>

        <motion.div variants={entranceV.genericRailItem} className="flex flex-col gap-4">
          <p
            className={`text-[clamp(1.75rem,8vw,2.5rem)] md:text-[40px] ${TEST_HOME_PROJECT_TITLE_SERIF}`}
          >
            {displayProject.label}
          </p>
          <p className={`font-normal ${muted}`}>{displayProject.desc}</p>
        </motion.div>
        {activeSpy && (
          <motion.div variants={entranceV.genericRailItem} className="flex flex-col gap-2">
            <CaseStudyRailTitle className={`text-[18px] ${TEST_HOME_PROJECT_TITLE_SERIF}`}>
              {activeSpy.label}
            </CaseStudyRailTitle>
            <p className={`font-normal ${muted}`}>{activeSpy.body}</p>
          </motion.div>
        )}
      </motion.div>
    )
  }

  const homeSplitTail = (
    <>
        <motion.div
          ref={splitOnboardingDivider1Ref}
          initial={false}
          animate={{ opacity: introDone ? 1 : 0 }}
          transition={restRevealTransition}
          style={{ pointerEvents: introDone ? 'auto' : 'none' }}
          aria-hidden={!introDone}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize intro column"
          className="relative z-[5] hidden shrink-0 cursor-col-resize touch-none select-none bg-transparent md:flex md:w-2 md:flex-col md:items-stretch md:self-stretch"
          onPointerDown={splitColumnGuide.wrapDividerPointerDown(handleDividerPointerDown(1))}
        >
          <span className={HOME_GRID_V_LINE} aria-hidden />
          {splitColumnGuide.renderBarGlow()}
        </motion.div>

        <DesktopProjectDetailsLayout
          merge={Boolean(config.mergeProjectDetailsDesktop)}
          project={
            <motion.div
              animate={{ opacity: introDone ? 1 : 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.22 }}
              style={{
                pointerEvents: menuColumnInteractive ? 'auto' : 'none',
                ...(isSplitDesktop
                  ? {
                      width: Math.round(colWidths.c2 * projectColWScale),
                      minWidth: Math.round(MIN_COL2_PX * projectColWScale),
                    }
                  : {}),
              }}
              aria-hidden={!introDone}
              className={`max-md:hidden min-h-0 min-w-0 max-w-full overflow-y-auto md:h-full md:max-h-full md:shrink-0 md:self-stretch w-full ${HUMAN_PROJECT_LIST_TYPO} ${isDark ? 'text-[#f2f2f2]' : 'text-black'}`}
            >
              <motion.div
                variants={entranceV.menuSnapRoot}
                initial={menuSnapInitial}
                animate={menuSnapKey}
                onAnimationComplete={handleSnapStaggerComplete}
                className="flex w-full flex-col"
              >
                <div
                  className={`${HUMAN_PROJECT_LIST_ROW_GRID} ${HOME_GRID_ROW_LINE} ${HOME_GRID_CELL_PAD_X} ${HOME_GRID_CELL_PAD_Y} text-[10px] font-normal opacity-55 dark:opacity-50`}
                  aria-hidden
                >
                  <span>Idx</span>
                  <span>PRJCT</span>
                  <span>Services</span>
                </div>
                {HOME_PROJECTS.map((project) => {
                  const isOpen = isFolderOpenUi(project.id)
                  const isHovr = project.id === 'hovr'
                  const useHovrStyleUnfold = isHovr || project.id === 'piikai'
                  const isRowActive = displayProject?.id === project.id
                  const humanSpyRow = (active: boolean, isLastSpy: boolean) =>
                    `${HUMAN_PROJECT_LIST_ROW_GRID} border-0 ${isLastSpy ? '' : `${HOME_GRID_ROW_LINE} `}rounded-none ${HOME_GRID_CELL_PAD_X} ${HOME_GRID_CELL_PAD_Y} text-left outline-none transition-colors ${
                      active
                        ? isDark
                          ? 'bg-white text-black'
                          : 'bg-black text-white'
                        : isDark
                          ? 'text-inherit hover:bg-white hover:text-black focus-visible:bg-white focus-visible:text-black'
                          : 'text-inherit hover:bg-black hover:text-white focus-visible:bg-black focus-visible:text-white'
                    }`
                  return (
                    <motion.div
                      key={project.id}
                      variants={entranceV.menuSnapRow}
                      className="w-full"
                      onPointerLeave={(e) => {
                        const pv = projectListHover
                        if (!pv) return
                        const rt = e.relatedTarget as Node | null
                        if (rt && (e.currentTarget as HTMLElement).contains(rt)) return
                        pv.endHover()
                      }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          isMobile ? openMobileProjectSheet(project.id) : toggleProject(project.id)
                        }
                        onMouseEnter={() => setMenuFolderHoverId(project.id)}
                        onMouseLeave={() => setMenuFolderHoverId((id) => (id === project.id ? null : id))}
                        onPointerEnter={(e) => {
                          projectListHover?.startHover(project.heroImage, e.clientX, e.clientY)
                        }}
                        className={`${HUMAN_PROJECT_LIST_ROW_GRID} w-full border-0 ${HOME_GRID_ROW_LINE} ${HOME_GRID_CELL_PAD_X} ${HOME_GRID_CELL_PAD_Y} text-left transition-colors rounded-none outline-none ${
                          isRowActive || menuFolderHoverId === project.id
                            ? isDark
                              ? 'bg-white text-black'
                              : 'bg-black text-white'
                            : isOpen
                              ? isDark
                                ? 'bg-white/[0.04]'
                                : 'bg-black/[0.03]'
                              : ''
                        }`}
                      >
                        <span className="tabular-nums opacity-90">{project.rowCode.toUpperCase()}</span>
                        <span className="test-project-title min-w-0">{project.label}</span>
                        <span className="min-w-0 text-balance opacity-90">{project.roles.toUpperCase()}</span>
                      </button>
                      <div
                        className={`grid w-full transition-[grid-template-rows] duration-[380ms] ease-[cubic-bezier(0.2,0.85,0.25,1)] ${
                          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                        }`}
                      >
                        <div className="min-h-0 overflow-hidden">
                          {useHovrStyleUnfold ? (
                            <motion.div
                              variants={entranceV.hovrUnfoldShell}
                              initial={false}
                              animate={hovrUnfoldKey}
                              className="w-full will-change-transform"
                            >
                              <div className="flex flex-col gap-0 border-t-[0.5px] border-black/[0.14] dark:border-white/[0.12]">
                                {project.spy.map((s, idx) => {
                                  const active =
                                    displayProject != null &&
                                    project.id === displayProject.id &&
                                    s.id === activeSpyId
                                  const isLastSpy = idx === project.spy.length - 1
                                  return (
                                    <motion.button
                                      key={s.id}
                                      type="button"
                                      variants={entranceV.hovrUnfoldSpyItem}
                                      onPointerEnter={() => projectListHover?.hideImmediately()}
                                      onAnimationComplete={
                                        isHovr && isLastSpy ? handleHovrLastSpyEntered : undefined
                                      }
                                      onClick={() => {
                                        setOpenProjectId(project.id)
                                        if (isMobile) setMobileProjectDetailOpen(true)
                                        if (project.id === 'hovr') {
                                          setHovrSpyFromScroll(s.id)
                                          setSpyForProject(project.id, s.id)
                                          scrollHovrSection(s.id)
                                        } else if (project.id === 'piikai') {
                                          setPiikSpyFromScroll(s.id)
                                          setSpyForProject(project.id, s.id)
                                          scrollPiikSection(s.id)
                                        }
                                      }}
                                      className={humanSpyRow(active, isLastSpy)}
                                    >
                                      <span className="select-none opacity-25" aria-hidden>
                                        —
                                      </span>
                                      <span className="col-span-2 min-w-0">{s.label.toUpperCase()}</span>
                                    </motion.button>
                                  )
                                })}
                              </div>
                            </motion.div>
                          ) : (
                            <div className="flex flex-col gap-0 border-t-[0.5px] border-black/[0.14] dark:border-white/[0.12]">
                              {project.spy.map((s, spyIdx) => {
                                const active =
                                  displayProject != null &&
                                  project.id === displayProject.id &&
                                  s.id === activeSpyId
                                const isLastSpy = spyIdx === project.spy.length - 1
                                return (
                                  <button
                                    key={s.id}
                                    type="button"
                                    onPointerEnter={() => projectListHover?.hideImmediately()}
                                    onClick={() => {
                                      setOpenProjectId(project.id)
                                      if (isMobile) setMobileProjectDetailOpen(true)
                                      if (project.id === 'ar-fitting-room') {
                                        setArFittingSpyFromScroll(s.id)
                                        setSpyForProject(project.id, s.id)
                                        scrollArFittingSection(s.id)
                                      } else if (project.id === 'jojo') {
                                        setJojoSpyFromScroll(s.id)
                                        setSpyForProject(project.id, s.id)
                                        scrollJojoSection(s.id)
                                      } else {
                                        setSpyForProject(project.id, s.id)
                                      }
                                    }}
                                    className={humanSpyRow(active, isLastSpy)}
                                  >
                                    <span className="select-none opacity-25" aria-hidden>
                                      —
                                    </span>
                                    <span className="col-span-2 min-w-0">{s.label.toUpperCase()}</span>
                                  </button>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            </motion.div>
          }
          divider2={
            displayProject != null ? (
              <motion.div
                initial={false}
                animate={{ opacity: introDone ? 1 : 0 }}
                transition={restRevealTransition}
                style={{ pointerEvents: introDone ? 'auto' : 'none' }}
                aria-hidden={!introDone}
                role="separator"
                aria-orientation="vertical"
                aria-label="Resize project list column"
                className="relative hidden shrink-0 cursor-col-resize touch-none select-none bg-transparent md:flex md:w-2 md:flex-col md:items-stretch md:self-stretch"
                onPointerDown={handleDividerPointerDown(2)}
              >
                <span className={HOME_GRID_V_LINE} aria-hidden />
              </motion.div>
            ) : null
          }
          details={
            !isMobile && displayProject != null ? (
              <motion.div
                ref={detailsColumnRef}
                variants={entranceV.detailsColumnShell}
                initial={postIntroInitial}
                animate={detailsColumnEntrance ? 'visible' : 'hidden'}
                style={{ pointerEvents: detailsColumnEntrance ? 'auto' : 'none' }}
                aria-hidden={!detailsColumnEntrance}
                className={
                  config.desktopDetailsColumnFrame
                    ? 'relative z-0 hidden min-h-0 min-w-0 max-w-full flex-1 flex-col gap-5 overflow-y-auto md:flex md:h-full md:min-h-full md:max-h-full md:self-stretch box-border rounded-none border-2 border-black bg-[#faf7f0] p-[10px] dark:border-white/[0.22] dark:bg-[#252320]'
                    : config.mergeProjectDetailsDesktop
                      ? `${HOME_DESKTOP_DETAILS_COLUMN_SHELL_MERGED} md:border-l md:border-l-[0.5px] md:border-black/[0.18] dark:md:border-l-white/[0.14]`
                      : HOME_DESKTOP_DETAILS_COLUMN_SHELL_UNFRAMED
                }
              >
                {renderDetailsColumnChildren()}
              </motion.div>
            ) : null
          }
        />
    </>
  )

  return (
    <div
      ref={(el) => {
        homeShellRef.current = el
        if (classicHome) introScrollRef.current = el
      }}
      className={
        classicHome
          ? `theme-surface-transition fixed inset-0 z-0 flex h-full w-full max-w-full min-h-0 flex-col overflow-x-hidden px-2 pb-[4px] pt-2.5 max-md:overflow-x-hidden max-md:overflow-y-auto md:overflow-x-hidden md:overflow-hidden ${isDark ? 'bg-[#111111]' : 'bg-[#faf7f0]'} ${text}`
          : `theme-surface-transition fixed inset-0 z-0 flex h-full w-full max-w-full min-h-0 flex-col px-2 pt-[max(0.625rem,env(safe-area-inset-top,0px)+0.125rem)] pb-[max(2.75rem,env(safe-area-inset-bottom,0px)+2rem)] max-md:overflow-x-hidden max-md:pb-[calc(2.75rem+env(safe-area-inset-bottom,0px))] md:overflow-x-hidden md:overflow-hidden md:pb-[4px] md:pt-2.5 ${isDark ? 'bg-[#111111]' : 'bg-[#faf7f0]'} ${text}`
      }
      {...(config.designTestRootDataAttr ? { 'data-design-test': '1' } : {})}
    >
      {classicHome ? (
      <div
        ref={splitContainerRef}
          className={`flex w-full min-w-0 max-w-full flex-1 min-h-0 flex-col gap-y-8 max-md:min-h-[100dvh] md:h-full md:min-h-0 md:flex-row md:gap-0 md:overflow-hidden md:box-border ${HOME_GRID_FRAME_H}`}
        >
          <ClassicHomeFirstColumn
            bodyFont={bodyFont}
            isSplitDesktop={isSplitDesktop}
            col1Width={colWidths.c1}
            col1MinWidth={MIN_COL1_PX}
            introStage={introStage}
            setIntroStage={setIntroStage}
            introDone={introDone}
            muted={muted}
            iconFill={iconFill}
            restRevealTransition={restRevealTransition}
            meImg={meImg}
            isDark={isDark}
            folderBrandUnifiedFrame={folderBrandUnifiedFrame}
          />
          {homeSplitTail}
        </div>
      ) : (
      <>
      {/* Mobile: full-page vertical scroll; intro is not sticky so name + bio scroll together */}
      <div
        ref={(el) => {
          introScrollRef.current = el
        }}
        className="flex min-h-0 w-full min-w-0 max-w-full max-h-full flex-1 flex-col max-md:overflow-x-hidden max-md:overflow-y-auto md:h-full md:min-h-0 md:max-h-full md:overflow-hidden"
      >
        <div
          ref={splitContainerRef}
          className={`grid w-full min-w-0 max-w-full flex-1 grid-cols-1 gap-y-[10px] max-md:min-h-[100dvh] md:flex md:h-full md:min-h-0 md:max-h-full md:flex-row md:items-stretch md:gap-0 md:overflow-x-hidden md:overflow-hidden md:box-border ${HOME_GRID_FRAME_H}`}
        >
        <div className="max-md:contents md:flex md:h-full md:min-h-0 md:max-h-full md:min-w-0 md:max-w-full md:shrink-0 md:flex-col md:overflow-hidden md:self-stretch">
          <ClassicHomeFirstColumn
            bodyFont={bodyFont}
            isSplitDesktop={isSplitDesktop}
            col1Width={colWidths.c1}
            col1MinWidth={MIN_COL1_PX}
            introStage={introStage}
            setIntroStage={setIntroStage}
            introDone={introDone}
            muted={muted}
            iconFill={iconFill}
            restRevealTransition={restRevealTransition}
            meImg={meImg}
            isDark={isDark}
            folderBrandUnifiedFrame={folderBrandUnifiedFrame}
          />
        </div>

        {homeSplitTail}
        </div>
      </div>
        </>
      )}

      <FooterEmail variant="inline" />

      {isMobile && (
        <AnimatePresence
          onExitComplete={() => {
            if (!mobileProjectDetailOpenRef.current) setOpenProjectId(null)
          }}
        >
          {mobileProjectDetailOpen && displayProject != null && (
            <motion.div
              key="home-mobile-project"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { type: 'tween', duration: 0.34, ease: [0.4, 0, 0.2, 1] }
              }
              className={`fixed inset-0 z-[850] flex min-h-0 flex-col md:hidden ${
                isDark ? 'bg-[#111111]' : 'bg-[#faf7f0]'
              } pt-[max(1.75rem,env(safe-area-inset-top,0px)+0.125rem)] px-2 pb-[max(2.75rem,env(safe-area-inset-bottom,0px))]`}
            >
              <div
                ref={detailsColumnRef}
                className={`${CASE_STUDY_MOBILE_DETAILS_SCROLL_CLASS} ${text}`}
              >
                {renderDetailsColumnChildren()}
          </div>
        </motion.div>
          )}
        </AnimatePresence>
      )}

      {splitColumnGuide.renderTooltip()}
      {selectedMedia && <Lightbox src={selectedMedia} onClose={() => setSelectedMedia(null)} />}
    </div>
  )
}

/** Default `/test` entry — uses {@link TEST_HOME_PAGE_CONFIG}. */
export function TestHomePage() {
  return <TestHomePageView config={TEST_HOME_PAGE_CONFIG} />
}
