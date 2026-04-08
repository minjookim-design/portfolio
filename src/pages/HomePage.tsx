import React, { Fragment, useState, useCallback, useMemo, useRef, useEffect } from 'react'
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
import { useHomeSplitColumnGuide } from '../components/HomeSplitOnboarding'
import { HOME_ENTRANCE_SPRING } from './homeCaseStudyHeroMotion'

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

const INSTRUMENT_SERIF = "font-['Instrument_Serif',serif]"
const HOME_INTRO_SERIF = `${INSTRUMENT_SERIF} text-[22px] leading-tight md:text-[25.2px]`
const CAREER_ROLE_SERIF = `${INSTRUMENT_SERIF} text-[18px] leading-tight`
const HOME_MONO_SM = 'text-[12px] font-medium font-mono'
/** Project column: section links (12px mono, 500 idle / 800 active). */
const PROJECT_SPY_LINK = 'font-mono text-[12px]'

const HOME_INTRO_BIO =
  'I design multi-platform experiences by turning complex spatial and product challenges into simple, intuitive interactions. I focus on creating clear, human-centered flows across web, mobile, and VR, making emerging technologies feel approachable and usable. By collaborating closely with engineers, including Unity developers, I help bridge design intent with technical feasibility and real-world implementation.'

/** Bio typewriter total duration; 0.7× speed → multiply prior ~3250ms baseline by 1/0.7 (each sentence’s share scales with this). */
const HOME_INTRO_TYPEWRITER_MS = Math.round(3250 / 0.7)

const SPLIT_DIVIDER_PX = 8
const MIN_COL1_PX = 240
const MIN_COL2_PX = 260
const MIN_COL3_PX = 300
const INITIAL_COL1_PX = 420
const INITIAL_COL2_PX = 340
const SPLIT_WIDTH_STORAGE_KEY = 'home-split-widths'

/** Pause after HOVR sub-menu finishes before the project column appears. */
const MENU_UNFOLD_TO_REVEAL_DELAY_MS = 400

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

function readSplitWidthsFromSession(): { c1: number; c2: number } | null {
  try {
    const raw = sessionStorage.getItem(SPLIT_WIDTH_STORAGE_KEY)
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
  route: string
  label: string
  desc: string
  heroImage: string
  spy: SpyItem[]
}

const HOME_PROJECTS: HomeProject[] = [
  {
    id: 'hovr',
    route: '/projects/hovr',
    label: 'HOVR',
    desc: '84.9% Faster Driver Approvals via OCR Automation',
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
    route: '/projects/piik',
    label: 'Piik AI',
    desc: '75% Support Ticket Drop through Behavioral Analysis',
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
    route: '/projects/ar-fitting-room',
    label: 'AR Fitting Room',
    desc: 'Award-Winning Accessible Design: AR Solution for Inclusive Fashion',
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

export function HomePage() {
  const { isDark } = usePageTheme()
  const isMobile = useIsNarrow(768)
  const { detailOpen: mobileProjectDetailOpen, setDetailOpen: setMobileProjectDetailOpen } =
    useHomeMobileProject()
  const mobileProjectDetailOpenRef = useRef(mobileProjectDetailOpen)
  mobileProjectDetailOpenRef.current = mobileProjectDetailOpen
  const isSplitDesktop = !useIsNarrow(767)
  const [openProjectId, setOpenProjectId] = useState<string | null>(HOME_PROJECTS[0].id)
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
    const stored = readSplitWidthsFromSession()
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
      setOpenProjectId((id) => id ?? HOME_PROJECTS[0].id)
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
      sessionStorage.setItem(SPLIT_WIDTH_STORAGE_KEY, JSON.stringify(colWidths))
    } catch {
      /* ignore quota / private mode */
    }
  }, [colWidths, isSplitDesktop])

  const getSplitInnerWidth = useCallback(() => {
    const el = splitContainerRef.current
    if (!el) return 1200
    return Math.max(0, el.getBoundingClientRect().width - 2 * SPLIT_DIVIDER_PX)
  }, [])

  const clampColWidthsToContainer = useCallback(() => {
    const innerW = getSplitInnerWidth()
    setColWidths((prev) => {
      let c1 = Math.max(MIN_COL1_PX, Math.min(prev.c1, innerW - prev.c2 - MIN_COL3_PX))
      let c2 = Math.max(MIN_COL2_PX, Math.min(prev.c2, innerW - c1 - MIN_COL3_PX))
      if (c1 + c2 + MIN_COL3_PX > innerW) {
        c2 = Math.max(MIN_COL2_PX, innerW - c1 - MIN_COL3_PX)
        if (c1 + c2 + MIN_COL3_PX > innerW) {
          c1 = Math.max(MIN_COL1_PX, innerW - c2 - MIN_COL3_PX)
        }
      }
      return { c1, c2 }
    })
  }, [getSplitInnerWidth])

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
        const dx = ev.clientX - startX
        if (which === 1) {
          const n1 = Math.max(MIN_COL1_PX, Math.min(startC1 + dx, innerW - startC2 - MIN_COL3_PX))
          setColWidths({ c1: n1, c2: startC2 })
        } else {
          const n2 = Math.max(MIN_COL2_PX, Math.min(startC2 + dx, innerW - startC1 - MIN_COL3_PX))
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
    [getSplitInnerWidth],
  )

  const text = isDark ? 'text-[#FFFFFF]' : 'text-black'
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
          '[HomePage] menu reveal fallback: forcing menuSeqPhase done (hero entrance callback may not have fired)',
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
      if (menuSeqPhase === 'unfold' || menuSeqPhase === 'reveal') return projectId === 'hovr'
      return openProjectId === projectId
    },
    [introDone, reduceMotion, menuSeqPhase, openProjectId],
  )

  const detailsColumnEntrance = menuSeqPhase === 'reveal' || menuSeqPhase === 'done'
  const menuColumnInteractive = menuSeqPhase === 'done'

  const splitOnboardingDivider1Ref = useRef<HTMLDivElement>(null)
  const splitColumnGuide = useHomeSplitColumnGuide({
    entranceComplete: menuSeqPhase === 'done',
    isMobile,
    reduceMotion,
    isDark,
    firstDividerRef: splitOnboardingDivider1Ref,
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
          <p className="text-[clamp(1.75rem,8vw,2.5rem)] font-bold italic leading-none font-['Instrument_Serif',serif] md:text-[40px]">
            {displayProject.label}
          </p>
          <p className={`font-normal ${muted}`}>{displayProject.desc}</p>
        </motion.div>
        {activeSpy && (
          <motion.div variants={entranceV.genericRailItem} className="flex flex-col gap-2">
            <CaseStudyRailTitle className="font-bold">{activeSpy.label}</CaseStudyRailTitle>
            <p className={`font-normal ${muted}`}>{activeSpy.body}</p>
          </motion.div>
        )}
      </motion.div>
    )
  }

  return (
    <div
      className={`theme-surface-transition fixed inset-0 z-0 flex h-full w-full max-w-full min-h-0 flex-col px-4 pt-[max(1.25rem,env(safe-area-inset-top,0px)+0.25rem)] pb-[max(5.5rem,env(safe-area-inset-bottom,0px)+4rem)] max-md:overflow-x-hidden max-md:pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:overflow-x-hidden md:overflow-hidden md:pb-16 md:pt-5 ${isDark ? 'bg-[#111111]' : 'bg-[#e8e8e8]'} ${text}`}
    >
      {/* Mobile: full-page vertical scroll; intro is not sticky so name + bio scroll together */}
      <div
        ref={introScrollRef}
        className="flex min-h-0 w-full min-w-0 max-w-full max-h-full flex-1 flex-col max-md:overflow-x-hidden max-md:overflow-y-auto md:h-full md:min-h-0 md:max-h-full md:overflow-hidden"
      >
        <div
          ref={splitContainerRef}
          className="grid w-full min-w-0 max-w-full flex-1 grid-cols-1 gap-y-8 max-md:min-h-[100dvh] md:flex md:h-full md:min-h-0 md:max-h-full md:flex-row md:items-stretch md:gap-0 md:overflow-hidden"
        >
        <div
          className={`max-md:contents md:flex md:h-full md:min-h-0 md:max-h-full md:min-w-0 md:max-w-full md:shrink-0 md:flex-col md:gap-[150px] md:self-stretch md:overflow-y-auto ${bodyFont} md:w-full`}
          style={isSplitDesktop ? { width: colWidths.c1, minWidth: MIN_COL1_PX } : undefined}
        >
          {/* Mobile: intro column scrolls with parent (no sticky). Desktop: top of intro column */}
          <div className="max-md:col-start-1 max-md:row-start-1 md:shrink-0 md:border-0">
            <div className="flex min-w-0 w-full shrink-0 flex-col gap-[10px]">
              {introStage > 0 ? (
                <p className={`shrink-0 font-bold max-md:whitespace-normal md:whitespace-nowrap ${HOME_INTRO_SERIF}`}>Minjoo Kim</p>
              ) : (
                <HomeIntroScrambleText
                  as="p"
                  className={`shrink-0 font-bold max-md:whitespace-normal md:whitespace-nowrap ${HOME_INTRO_SERIF}`}
                  text="Minjoo Kim"
                  durationMs={1300}
                  onComplete={() => setIntroStage(1)}
                />
              )}
              {introStage >= 1 && (
                <div className="flex w-full flex-wrap items-center gap-x-2 gap-y-1">
                  {introStage >= 2 ? (
                    <p className={`shrink-0 font-bold ${HOME_INTRO_SERIF}`}>Product Designer</p>
                  ) : (
                    <HomeIntroScrambleText
                      as="p"
                      className={`shrink-0 font-bold ${HOME_INTRO_SERIF}`}
                      text="Product Designer"
                      durationMs={750}
                      onComplete={() => setIntroStage(2)}
                    />
                  )}
                  {introStage >= 2 && (
                    <div className="flex shrink-0 items-center">
                      <a
                        href={LINKEDIN_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`rounded-[10px] p-2 ${isDark ? 'hover:bg-white/[0.08]' : 'hover:bg-black/[0.06]'}`}
                        aria-label="LinkedIn profile"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="block shrink-0"
                          aria-hidden
                        >
                          <path
                            d="M19 3C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19ZM18.5 18.5V13.2C18.5 12.3354 18.1565 11.5062 17.5452 10.8948C16.9338 10.2835 16.1046 9.94 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17C14.6813 12.17 15.0374 12.3175 15.2999 12.5801C15.5625 12.8426 15.71 13.1987 15.71 13.57V18.5H18.5ZM6.88 8.56C7.32556 8.56 7.75288 8.383 8.06794 8.06794C8.383 7.75288 8.56 7.32556 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19C6.43178 5.19 6.00193 5.36805 5.68499 5.68499C5.36805 6.00193 5.19 6.43178 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56ZM8.27 18.5V10.13H5.5V18.5H8.27Z"
                            fill={iconFill}
                          />
                        </svg>
                      </a>
                      <a
                        href={RESUME_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`rounded-[10px] p-2 ${isDark ? 'hover:bg-white/[0.08]' : 'hover:bg-black/[0.06]'}`}
                        aria-label="Resume (opens in Google Drive)"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="block shrink-0"
                          aria-hidden
                        >
                          <path
                            d="M6.66637 22.7676H17.3335C19.4129 22.7676 20.4475 21.7129 20.4475 19.6236V10.5032C20.4475 9.20722 20.3069 8.64493 19.5034 7.82122L13.9585 2.18636C13.1957 1.40251 12.5725 1.23193 11.4377 1.23193H6.66637C4.59723 1.23193 3.55237 2.2965 3.55237 4.38622V19.6236C3.55237 21.7228 4.59723 22.7676 6.66637 22.7676ZM6.74651 21.1506C5.71194 21.1506 5.16937 20.5978 5.16937 19.5936V4.41622C5.16937 3.42193 5.71194 2.84893 6.7568 2.84893H11.2165V8.68522C11.2165 9.95079 11.8594 10.5735 13.1048 10.5735H18.8305V19.5936C18.8305 20.5978 18.2978 21.1506 17.2534 21.1506H6.74651ZM13.2857 9.05636C12.8939 9.05636 12.7328 8.89608 12.7328 8.49408V3.16051L18.5185 9.05679L13.2857 9.05636Z"
                            fill={iconFill}
                            stroke={iconFill}
                            strokeWidth={0.5}
                          />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              )}
              {introStage >= 2 && (
                <div className="flex w-full min-w-0 flex-col gap-2 max-md:mt-[10px]">
                  {introStage >= 3 ? (
                    <p className={`w-full ${HOME_MONO_SM} leading-[1.2] ${muted}`}>{HOME_INTRO_BIO}</p>
                  ) : (
                    <HomeIntroTypewriterText
                      as="p"
                      className={`w-full ${HOME_MONO_SM} leading-[1.2] ${muted}`}
                      text={HOME_INTRO_BIO}
                      durationMs={HOME_INTRO_TYPEWRITER_MS}
                      completeDelayMs={400}
                      onComplete={() => setIntroStage(3)}
                    />
                  )}
                </div>
              )}
              <motion.div
                initial={false}
                animate={{ opacity: introDone ? 1 : 0 }}
                transition={restRevealTransition}
                style={{ pointerEvents: introDone ? 'auto' : 'none' }}
                aria-hidden={!introDone}
                className="w-full"
              >
                <div
                  className="relative mt-2 w-[min(55%,220px)] min-w-[120px] shrink-0 max-md:w-[min(100%,220px)] md:w-[40%]"
                  role="img"
                  aria-label="Minjoo"
                >
                  <OptimizedImage
                    src="/me/me1.png"
                    alt=""
                    className="pointer-events-none block h-auto w-full rounded-[10px] opacity-0"
                    draggable={false}
                    aria-hidden
                    sizes={IMAGE_SIZES.homeIntroPhoto}
                    placeholder="empty"
                  />
                  {/* Blur + inline opacity fights Tailwind crossfade; keep empty placeholder. */}
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
          </div>

          {/* Career / education / interests — same block as desktop col 1; hidden on mobile until introDone via motion child */}
          <div className="flex w-full min-w-0 max-w-full flex-col gap-16 md:gap-[150px]">
            <motion.div
              initial={false}
              animate={{ opacity: introDone ? 1 : 0 }}
              transition={restRevealTransition}
              style={{ pointerEvents: introDone ? 'auto' : 'none' }}
              aria-hidden={!introDone}
              className="flex w-full flex-col gap-16 md:gap-[150px]"
            >
          <div className="flex flex-col gap-[10px]">
            <p className={`shrink-0 font-bold whitespace-nowrap ${HOME_INTRO_SERIF}`}>Career</p>
            <div className="flex flex-col gap-[18px]">
              {CAREER_JOBS.map((job) => (
                <div key={job.role + job.period} className={`flex w-full flex-col gap-2 ${muted}`}>
                  <p className={`font-bold ${CAREER_ROLE_SERIF}`}>{job.role}</p>
                  <div className="flex w-full flex-col gap-[6.4px] leading-[1.2]">
                    <p className={`w-full ${HOME_MONO_SM}`}>{job.company}</p>
                    <p className={`shrink-0 max-md:whitespace-normal md:whitespace-nowrap ${HOME_MONO_SM}`}>{job.period}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-[10px]">
            <p className={`shrink-0 font-bold whitespace-nowrap ${HOME_INTRO_SERIF}`}>Fun Works I do</p>
            <div className={`flex w-full flex-col gap-[10px] ${muted}`}>
              <p className={`w-full font-bold ${CAREER_ROLE_SERIF}`}>I make Framer Components using AI and monetize them</p>
              <button
                type="button"
                className={`flex cursor-pointer items-center gap-2 self-start leading-[1.2] ${HOME_MONO_SM} hover:font-extrabold`}
                onClick={() => window.open('https://www.framer.com/@minjoo-kim-j8bshr/', '_blank')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
                  <path
                    d="M7 17C5.61667 17 4.43767 16.5123 3.463 15.537C2.48833 14.5617 2.00067 13.3827 2 12C1.99933 10.6173 2.487 9.43833 3.463 8.463C4.439 7.48767 5.618 7 7 7H10C10.2833 7 10.521 7.096 10.713 7.288C10.905 7.48 11.0007 7.71733 11 8C10.9993 8.28267 10.9033 8.52033 10.712 8.713C10.5207 8.90567 10.2833 9.00133 10 9H7C6.16667 9 5.45833 9.29167 4.875 9.875C4.29167 10.4583 4 11.1667 4 12C4 12.8333 4.29167 13.5417 4.875 14.125C5.45833 14.7083 6.16667 15 7 15H10C10.2833 15 10.521 15.096 10.713 15.288C10.905 15.48 11.0007 15.7173 11 16C10.9993 16.2827 10.9033 16.5203 10.712 16.713C10.5207 16.9057 10.2833 17.0013 10 17H7ZM9 13C8.71667 13 8.47933 12.904 8.288 12.712C8.09667 12.52 8.00067 12.2827 8 12C7.99933 11.7173 8.09533 11.48 8.288 11.288C8.48067 11.096 8.718 11 9 11H15C15.2833 11 15.521 11.096 15.713 11.288C15.905 11.48 16.0007 11.7173 16 12C15.9993 12.2827 15.9033 12.5203 15.712 12.713C15.5207 12.9057 15.2833 13.0013 15 13H9ZM14 17C13.7167 17 13.4793 16.904 13.288 16.712C13.0967 16.52 13.0007 16.2827 13 16C12.9993 15.7173 13.0953 15.48 13.288 15.288C13.4807 15.096 13.718 15 14 15H17C17.8333 15 18.5417 14.7083 19.125 14.125C19.7083 13.5417 20 12.8333 20 12C20 11.1667 19.7083 10.4583 19.125 9.875C18.5417 9.29167 17.8333 9 17 9H14C13.7167 9 13.4793 8.904 13.288 8.712C13.0967 8.52 13.0007 8.28267 13 8C12.9993 7.71733 13.0953 7.48 13.288 7.288C13.4807 7.096 13.718 7 14 7H17C18.3833 7 19.5627 7.48767 20.538 8.463C21.5133 9.43833 22.0007 10.6173 22 12C21.9993 13.3827 21.5117 14.562 20.537 15.538C19.5623 16.514 18.3833 17.0013 17 17H14Z"
                    fill={iconFill}
                  />
                </svg>
                Look What I Made
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-[10px]">
            <p className={`shrink-0 font-bold whitespace-nowrap ${HOME_INTRO_SERIF}`}>I studied at</p>
            <div className="flex w-full flex-col gap-[18px]">
              <div className="grid w-full max-md:grid-cols-1 md:grid-cols-[1fr_auto]" style={{ columnGap: 40, rowGap: 18 }}>
                {DEGREES.map((edu) => (
                  <Fragment key={edu.degree}>
                    <div className={`flex flex-col gap-[6.4px] leading-[1.2] ${muted}`}>
                      <p className={`font-bold ${CAREER_ROLE_SERIF}`}>{edu.degree}</p>
                      <p className={`w-full ${HOME_MONO_SM}`}>{edu.school}</p>
                    </div>
                    <p className={`shrink-0 self-start max-md:pt-0 max-md:text-left md:text-right md:whitespace-nowrap ${HOME_MONO_SM} leading-[1.2] ${muted}`}>
                      {edu.period}
                    </p>
                  </Fragment>
                ))}
              </div>
              <OptimizedImage
                src="/me/gradphoto-portfolio.jpg"
                alt=""
                className="block h-auto w-full"
                sizes={IMAGE_SIZES.homeIntroFull}
                placeholder="blur"
              />
            </div>
          </div>

          <div className="flex flex-col gap-[10px]">
            <p className={`shrink-0 font-bold whitespace-nowrap ${HOME_INTRO_SERIF}`}>I like</p>
            <p className={`w-full font-bold ${CAREER_ROLE_SERIF} ${muted}`}>
              Cats · Travel · Mechanical keyboards · Drawing & Painting · K-Drama
            </p>
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
          </motion.div>
        </div>
        </div>

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
          className="relative z-[5] hidden shrink-0 cursor-col-resize touch-none select-none bg-transparent md:block md:w-2 md:self-stretch"
          onPointerDown={splitColumnGuide.wrapDividerPointerDown(handleDividerPointerDown(1))}
        >
          {splitColumnGuide.renderBarGlow()}
        </motion.div>

        <motion.div
          animate={{ opacity: introDone ? 1 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.22 }}
          style={{
            pointerEvents: menuColumnInteractive ? 'auto' : 'none',
            ...(isSplitDesktop ? { width: colWidths.c2, minWidth: MIN_COL2_PX } : {}),
          }}
          aria-hidden={!introDone}
          className={`max-md:hidden min-h-0 min-w-0 max-w-full overflow-y-auto md:h-full md:max-h-full md:shrink-0 md:self-stretch ${bodyFont} w-full`}
        >
          <motion.div
            variants={entranceV.menuSnapRoot}
            initial={menuSnapInitial}
            animate={menuSnapKey}
            onAnimationComplete={handleSnapStaggerComplete}
            className="flex w-full flex-col"
          >
            {HOME_PROJECTS.map((project) => {
              const isOpen = isFolderOpenUi(project.id)
              const isHovr = project.id === 'hovr'
              const useHovrStyleUnfold = isHovr || project.id === 'piikai'
              return (
                <motion.div key={project.id} variants={entranceV.menuSnapRow} className="w-full">
                  <div className="w-full">
                    <button
                      type="button"
                      onClick={() =>
                        isMobile ? openMobileProjectSheet(project.id) : toggleProject(project.id)
                      }
                      className={`box-border flex w-full items-center gap-2 p-1 text-left font-mono text-[14px] font-semibold leading-tight transition-colors bg-transparent ${
                        isDark ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.04]'
                      }`}
                    >
                      {isOpen ? (
                        <ProjectFolderOpenIcon className="shrink-0 text-current" />
                      ) : (
                        <ProjectFolderClosedIcon className="shrink-0 text-current" />
                      )}
                      {project.label}
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
                            <div className="flex flex-col gap-[10px] pt-1 pr-1 pb-2 pl-[22px]">
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
                                    className={`flex w-full items-center overflow-hidden px-1 text-left transition-colors ${PROJECT_SPY_LINK} ${
                                      active
                                        ? `font-extrabold ${isDark ? 'text-[#FF5C5C]' : 'text-red-600'}`
                                        : 'font-medium hover:font-semibold'
                                    }`}
                                  >
                                    <span className="max-md:whitespace-normal md:whitespace-nowrap">{s.label}</span>
                                  </motion.button>
                                )
                              })}
                            </div>
                          </motion.div>
                        ) : (
                          <div className="flex flex-col gap-[10px] pt-1 pr-1 pb-2 pl-[22px]">
                            {project.spy.map((s) => {
                              const active =
                                displayProject != null &&
                                project.id === displayProject.id &&
                                s.id === activeSpyId
                              return (
                                <button
                                  key={s.id}
                                  type="button"
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
                                  className={`flex w-full items-center px-1 text-left transition-colors ${PROJECT_SPY_LINK} ${
                                    active
                                      ? `font-extrabold ${isDark ? 'text-[#FF5C5C]' : 'text-red-600'}`
                                      : 'font-medium hover:font-semibold'
                                  }`}
                                >
                                  <span className="max-md:whitespace-normal md:whitespace-nowrap">{s.label}</span>
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>

        <motion.div
          initial={false}
          animate={{ opacity: introDone ? 1 : 0 }}
          transition={restRevealTransition}
          style={{ pointerEvents: introDone ? 'auto' : 'none' }}
          aria-hidden={!introDone}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize project list column"
          className="hidden shrink-0 cursor-col-resize touch-none select-none bg-transparent md:block md:w-2 md:self-stretch"
          onPointerDown={handleDividerPointerDown(2)}
        />

        {!isMobile && (
          <motion.div
            ref={detailsColumnRef}
            variants={entranceV.detailsColumnShell}
            initial={postIntroInitial}
            animate={detailsColumnEntrance ? 'visible' : 'hidden'}
            style={{ pointerEvents: detailsColumnEntrance ? 'auto' : 'none' }}
            aria-hidden={!detailsColumnEntrance}
            className="relative z-0 hidden min-h-0 min-w-0 max-w-full flex-1 flex-col gap-6 overflow-y-auto pl-[6px] md:flex md:h-full md:min-h-full md:max-h-full md:self-stretch md:pl-[10px]"
          >
            {renderDetailsColumnChildren()}
          </motion.div>
        )}
        </div>
      </div>

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
                isDark ? 'bg-[#111111]' : 'bg-[#e8e8e8]'
              } pt-[max(3.5rem,env(safe-area-inset-top,0px)+0.25rem)] px-4 pb-[max(5.5rem,env(safe-area-inset-bottom,0px))]`}
            >
              <div
                ref={detailsColumnRef}
                className={`theme-surface-transition min-h-0 flex-1 overflow-y-auto overflow-x-hidden ${text}`}
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
