import React, { Fragment, useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HomeIntroScrambleText, usePrefersReducedMotion } from '../components/HomeIntroScrambleText'
import { useIsNarrow } from '../hooks/useIsNarrow'
import { usePageTheme } from '../context/PageThemeContext'
import {
  HOVR_SECTIONS,
  HOVR_META_ROWS,
  HOVR_HERO_THUMB_DARK,
  HOVR_HERO_THUMB_LIGHT,
  MediaBlock,
  CarouselBlock,
  Lightbox,
} from './HovrProjectPage'
import { PIIK_SECTIONS, PIIK_HERO_THUMB_LIGHT, HomePiikCaseStudy } from './PiikProjectPage'
import { HomeArFittingCaseStudy } from './ArFittingProjectPage'
import { AR_FITTING_SECTIONS, AR_FITTING_THUMB_LIGHT, AR_FITTING_THUMB_DARK } from './arFittingHomeData'
import { HomeJojoCaseStudy } from './JojoProjectPage'
import { JOJO_SECTIONS, JOJO_HERO_THUMB_DARK, JOJO_HERO_THUMB_LIGHT } from './jojoHomeData'
import { CaseStudyRailTitle } from '../components/CaseStudyRailTitle'
import { useCaseStudyHomeRailGap } from '../hooks/useCaseStudyHomeRailGap'

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
/** HOVR home case study: meta grid (top). */
const HOVR_CASE_LABEL_CLASS = `${INSTRUMENT_SERIF} text-[16px] leading-tight font-bold`
const HOVR_CASE_BODY_CLASS = 'font-mono text-[12px] font-medium leading-[1.2]'
/** HOVR home case study: Overview → Takeaway scroll blocks (+2px vs meta grid). */
const HOVR_SECTION_LABEL_CLASS = `${INSTRUMENT_SERIF} text-[18px] leading-tight font-bold`
const HOVR_SECTION_BODY_CLASS = "font-['Arial',sans-serif] text-[14px] font-normal leading-[1.2]"

const HOME_INTRO_BIO =
  'I design multi-platform experiences by turning complex spatial and product challenges into simple, intuitive interactions. I focus on creating clear, human-centered flows across web, mobile, and VR, making emerging technologies feel approachable and usable. By collaborating closely with engineers, including Unity developers, I help bridge design intent with technical feasibility and real-world implementation.'

const SPLIT_DIVIDER_PX = 8
const MIN_COL1_PX = 240
const MIN_COL2_PX = 260
const MIN_COL3_PX = 300
const INITIAL_COL1_PX = 420
const INITIAL_COL2_PX = 340
const SPLIT_WIDTH_STORAGE_KEY = 'home-split-widths'

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
  /* {
    id: 'jojo',
    route: '/projects/jojo',
    label: 'JoJo',
    desc: 'Beyond Passive AI: Fostering Digital Balance & Critical Thinking',
    heroImage: JOJO_HERO_THUMB_LIGHT,
    spy: JOJO_SECTIONS.map((s) => ({
      id: s.id,
      label: 'spyLabel' in s && s.spyLabel != null ? String(s.spyLabel) : s.label,
      body:
        typeof s.body === 'string'
          ? s.body.slice(0, 160) + (s.body.length > 160 ? '…' : '')
          : '',
      media: undefined,
    })),
  },
  {
    id: 'ar-fitting-room',
    route: '/projects/ar-fitting-room',
    label: 'AR Fitting Room',
    desc: 'Award-Winning Accessible Design: AR Solution for Inclusive Fashion',
    heroImage: AR_FITTING_THUMB_LIGHT,
    spy: AR_FITTING_SECTIONS.map((s) => ({
      id: s.id,
      label: 'spyLabel' in s && s.spyLabel != null ? String(s.spyLabel) : s.label,
      body:
        typeof s.body === 'string'
          ? s.body.slice(0, 160) + (s.body.length > 160 ? '…' : '')
          : '',
      media: AR_FITTING_THUMB_LIGHT,
    })),
  }, */
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

function HomeHovrCaseStudy({
  isDark,
  isMobile,
  sectionRefs,
  onMediaClick,
}: {
  isDark: boolean
  isMobile: boolean
  sectionRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
  onMediaClick: (src: string) => void
}) {
  const fg = isDark ? '#FFFFFF' : '#000000'
  const { rootRef, railGapPx } = useCaseStudyHomeRailGap()

  return (
    <div ref={rootRef} className="flex w-full min-w-0 flex-col pb-8" style={{ fontFamily: 'Arial, sans-serif', color: fg }}>
      <div className="mb-0 w-full">
        <img
          key={isDark ? 'hovr-thumb-dark' : 'hovr-thumb-light'}
          src={isDark ? HOVR_HERO_THUMB_DARK : HOVR_HERO_THUMB_LIGHT}
          alt="HOVR Admin"
          className="mb-[30px] block h-auto w-full max-w-full rounded-none"
        />

        <h1 className="mb-[26px] mt-0 text-[clamp(1.75rem,7vw,2.375rem)] font-bold italic leading-none font-['Instrument_Serif',serif] md:text-[38px]">
          HOVR Admin
        </h1>

        <div className="flex w-full flex-col gap-y-2">
          <div className="flex w-full items-center gap-x-[20px]">
            <span className={`shrink-0 whitespace-nowrap ${HOVR_CASE_LABEL_CLASS}`}>{HOVR_META_ROWS[0].label}</span>
            <span className={`min-w-0 flex-1 ${HOVR_CASE_BODY_CLASS}`}>{HOVR_META_ROWS[0].value}</span>
          </div>
          <div className="h-[10px] shrink-0" aria-hidden />
          <div className="grid w-full grid-cols-[auto_1fr] items-start gap-x-[20px] gap-y-2">
            {HOVR_META_ROWS.slice(1).map(({ label, value }) => (
              <Fragment key={label}>
                <span className={`whitespace-nowrap ${HOVR_CASE_LABEL_CLASS}`}>{label}</span>
                <span className={`min-w-0 ${HOVR_CASE_BODY_CLASS}`}>{value}</span>
              </Fragment>
            ))}
          </div>
          <img
            src="/hovr/timeline.jpg"
            alt=""
            className="mt-6 mb-[150px] block h-auto w-full max-w-full cursor-zoom-in rounded-none"
            onClick={() => onMediaClick('/hovr/timeline.jpg')}
          />
        </div>
      </div>

      {HOVR_SECTIONS.map((section, i) => (
        <motion.div
          key={section.id}
          ref={(el) => {
            sectionRefs.current[i] = el
          }}
          className="mb-[200px] last:mb-0"
          style={{ transformOrigin: 'top center' }}
          initial={{ y: 24, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: [0.44, 0, 0.3, 0.99] }}
        >
          <div
            className="flex items-start gap-5"
            style={{
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? 20 : railGapPx,
            }}
          >
            <CaseStudyRailTitle
              className={`shrink-0 whitespace-nowrap italic ${HOVR_SECTION_LABEL_CLASS} ${isMobile ? 'w-full' : 'w-[130px]'}`}
            >
              {section.label}
            </CaseStudyRailTitle>

            <div
              className={`flex min-w-0 w-full flex-col gap-4 ${HOVR_SECTION_BODY_CLASS}`}
              style={{ width: isMobile ? '100%' : undefined }}
            >
              {'subSections' in section && section.subSections ? (
                <div className="flex flex-col gap-10">
                  {(section.subSections as { heading: React.ReactNode; body: string; media: string }[]).map((sub, si) => (
                    <div key={si} className={`flex flex-col gap-4 ${si === 2 ? 'mt-10' : ''}`}>
                      {sub.heading && <p className={HOVR_SECTION_LABEL_CLASS}>{sub.heading}</p>}
                      {sub.body &&
                        sub.body.split('\n\n').map((para, pi) => (
                          <p key={pi} className={sub.heading && pi === 0 ? '-mt-[10px]' : undefined}>
                            {para}
                          </p>
                        ))}
                      <MediaBlock src={sub.media} onMediaClick={onMediaClick} />
                      {'postContent' in sub &&
                        (sub.postContent as { heading?: React.ReactNode; body?: string; media?: string }[]).map((pc, pi) => (
                          <Fragment key={pi}>
                            {pc.heading && <p className={`mt-20 ${HOVR_SECTION_LABEL_CLASS}`}>{pc.heading}</p>}
                            {pc.body &&
                              pc.body.split('\n\n').map((para, ri) => (
                                <p
                                  key={ri}
                                  className={
                                    [
                                      !pc.heading && ri === 0 ? 'mt-10' : '',
                                      pc.heading && ri === 0 ? '-mt-[10px]' : '',
                                    ]
                                      .filter(Boolean)
                                      .join(' ') || undefined
                                  }
                                >
                                  {para}
                                </p>
                              ))}
                            {pc.media && <MediaBlock src={pc.media} onMediaClick={onMediaClick} />}
                          </Fragment>
                        ))}
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {section.heading && <p className={HOVR_SECTION_LABEL_CLASS}>{section.heading}</p>}
                  {section.body.split('\n\n').map((para, idx) => (
                    <p key={idx} className={section.heading && idx === 0 ? '-mt-[10px]' : undefined}>
                      {para}
                    </p>
                  ))}
                  {Array.isArray(section.media)
                    ? section.media.map((m) => <MediaBlock key={m} src={m} onMediaClick={onMediaClick} />)
                    : section.media && <MediaBlock src={section.media} onMediaClick={onMediaClick} />}
                  {'carousel' in section && section.carousel && (
                    <CarouselBlock srcs={section.carousel as string[]} onMediaClick={onMediaClick} />
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
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
  const isSplitDesktop = !useIsNarrow(767)
  const [openProjectId, setOpenProjectId] = useState<string | null>(HOME_PROJECTS[0].id)
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null)
  const hovrSectionRefs = useRef<(HTMLDivElement | null)[]>([])
  const piikSectionRefs = useRef<(HTMLDivElement | null)[]>([])
  const arFittingSectionRefs = useRef<(HTMLDivElement | null)[]>([])
  const jojoSectionRefs = useRef<(HTMLDivElement | null)[]>([])
  const detailsColumnRef = useRef<HTMLDivElement>(null)
  const splitContainerRef = useRef<HTMLDivElement>(null)
  const [colWidths, setColWidths] = useState(() => {
    const stored = readSplitWidthsFromSession()
    return stored ?? { c1: INITIAL_COL1_PX, c2: INITIAL_COL2_PX }
  })
  const colWidthsRef = useRef(colWidths)
  colWidthsRef.current = colWidths
  const [hovrSpyFromScroll, setHovrSpyFromScroll] = useState<string>(HOVR_SECTIONS[0].id)
  const [piikSpyFromScroll, setPiikSpyFromScroll] = useState<string>(PIIK_SECTIONS[0].id)
  const [arFittingSpyFromScroll, setArFittingSpyFromScroll] = useState<string>(AR_FITTING_SECTIONS[0].id)
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
    const idx = AR_FITTING_SECTIONS.findIndex((s) => s.id === spyId)
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
    const id = AR_FITTING_SECTIONS[idx]?.id
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

  return (
    <div
      className={`fixed inset-0 z-0 flex h-full w-full max-w-full min-h-0 flex-col px-4 pt-[max(1.25rem,env(safe-area-inset-top,0px)+0.25rem)] pb-[max(5.5rem,env(safe-area-inset-bottom,0px)+4rem)] max-md:overflow-visible md:overflow-x-hidden md:overflow-hidden md:pb-16 md:pt-5 ${isDark ? 'bg-[#111111]' : 'bg-[#e8e8e8]'} ${text}`}
    >
      {/* Mobile scroll lives here without overflow-x-hidden so the title bar can use position:sticky */}
      <div className="flex min-h-0 w-full min-w-0 max-w-full flex-1 flex-col max-md:overflow-y-auto md:h-full md:min-h-0 md:overflow-hidden">
        <div
          ref={splitContainerRef}
          className="grid w-full min-w-0 max-w-full flex-1 grid-cols-1 gap-y-8 max-md:min-h-[100dvh] max-md:grid-rows-[auto_auto_auto_auto] md:flex md:h-full md:min-h-0 md:flex-row md:gap-0 md:overflow-hidden"
        >
        <div
          className={`max-md:contents md:flex md:h-full md:min-h-0 md:min-w-0 md:max-w-full md:shrink-0 md:flex-col md:gap-[150px] md:overflow-y-auto ${bodyFont} md:w-full`}
          style={isSplitDesktop ? { width: colWidths.c1, minWidth: MIN_COL1_PX } : undefined}
        >
          {/* Mobile: order 1 — name + Product Designer (+ links); sticky title bar. Desktop: top of intro column */}
          <div
            className={`max-md:col-start-1 max-md:row-start-1 md:shrink-0 max-md:sticky max-md:top-0 max-md:z-40 max-md:-mx-4 max-md:px-4 max-md:pb-3 ${
              isDark
                ? 'max-md:bg-[#111111] max-md:shadow-[0_1px_0_0_rgba(255,255,255,0.08)]'
                : 'max-md:bg-[#e8e8e8] max-md:shadow-[0_1px_0_0_rgba(0,0,0,0.06)]'
            }`}
          >
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
                    <HomeIntroScrambleText
                      as="p"
                      className={`w-full ${HOME_MONO_SM} leading-[1.2] ${muted}`}
                      text={HOME_INTRO_BIO}
                      durationMs={2600}
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
                className="hidden w-full md:block"
              >
                <div
                  className="relative mt-2 w-[min(55%,220px)] min-w-[120px] shrink-0 md:w-[40%]"
                  role="img"
                  aria-label="Minjoo"
                >
                  <img
                    src="/me/me1.png"
                    alt=""
                    className="pointer-events-none block h-auto w-full rounded-[10px] opacity-0"
                    draggable={false}
                    aria-hidden
                  />
                  <img
                    src="/me/me1.png"
                    alt=""
                    draggable={false}
                    aria-hidden
                    className={`absolute left-0 top-0 h-auto w-full rounded-[10px] transition-opacity duration-700 ease-in-out ${
                      meImg === 1 ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  <img
                    src="/me/me2.png"
                    alt=""
                    draggable={false}
                    aria-hidden
                    className={`absolute left-0 top-0 h-auto w-full rounded-[10px] transition-opacity duration-700 ease-in-out ${
                      meImg === 2 ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Desktop only: career / education / interests (photo in sticky intro above this) */}
          <div className="hidden w-full min-w-0 max-w-full flex-col gap-16 md:flex md:gap-[150px]">
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
              <img src="/me/gradphoto-portfolio.jpg" alt="" className="block h-auto w-full" />
            </div>
          </div>

          <div className="flex flex-col gap-[10px]">
            <p className={`shrink-0 font-bold whitespace-nowrap ${HOME_INTRO_SERIF}`}>I like</p>
            <p className={`w-full font-bold ${CAREER_ROLE_SERIF} ${muted}`}>
              Cats · Travel · Mechanical keyboards · Drawing & Painting · K-Drama
            </p>
            <div className="flex w-full flex-col gap-0">
              <img src="/me/cat.jpg" alt="" className="block h-auto w-full" />
              <img src="/me/2.jpg" alt="" className="block h-auto w-full" />
              <img src="/me/3.jpg" alt="" className="block h-auto w-full" />
            </div>
          </div>
          </motion.div>
        </div>
        </div>

        <motion.div
          initial={false}
          animate={{ opacity: introDone ? 1 : 0 }}
          transition={restRevealTransition}
          style={{ pointerEvents: introDone ? 'auto' : 'none' }}
          aria-hidden={!introDone}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize intro column"
          className="hidden shrink-0 cursor-col-resize touch-none select-none bg-transparent md:block md:w-2 md:self-stretch"
          onPointerDown={handleDividerPointerDown(1)}
        />

        <motion.div
          initial={false}
          animate={{ opacity: introDone ? 1 : 0 }}
          transition={restRevealTransition}
          style={{
            pointerEvents: introDone ? 'auto' : 'none',
            ...(isSplitDesktop ? { width: colWidths.c2, minWidth: MIN_COL2_PX } : {}),
          }}
          aria-hidden={!introDone}
          className={`max-md:col-start-1 max-md:row-start-2 min-h-0 min-w-0 max-w-full overflow-y-auto max-md:overflow-visible md:h-full md:shrink-0 ${bodyFont} w-full`}
        >
          <div className="flex w-full flex-col">
            {HOME_PROJECTS.map((project) => {
              const isOpen = openProjectId === project.id
              return (
                <div key={project.id} className="w-full">
                  <div className="w-full">
                    <button
                      type="button"
                      onClick={() => toggleProject(project.id)}
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
                      className={`grid w-full transition-[grid-template-rows] duration-300 ease-in-out ${
                        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      }`}
                    >
                      <div className="min-h-0 overflow-hidden">
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
                                if (project.id === 'hovr') {
                                  setHovrSpyFromScroll(s.id)
                                  setSpyForProject(project.id, s.id)
                                  scrollHovrSection(s.id)
                                } else if (project.id === 'piikai') {
                                  setPiikSpyFromScroll(s.id)
                                  setSpyForProject(project.id, s.id)
                                  scrollPiikSection(s.id)
                                } else if (project.id === 'ar-fitting-room') {
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
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
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

        <motion.div
          ref={detailsColumnRef}
          initial={false}
          animate={{ opacity: introDone ? 1 : 0 }}
          transition={restRevealTransition}
          style={{ pointerEvents: introDone ? 'auto' : 'none' }}
          aria-hidden={!introDone}
          className={`relative z-0 max-md:col-start-1 max-md:row-start-3 flex min-h-0 min-w-0 max-w-full flex-1 flex-col gap-6 overflow-y-auto pl-[6px] max-md:h-auto max-md:flex-none max-md:overflow-visible max-md:pl-0 md:h-full md:pl-[10px]`}
        >
          {displayProject == null ? null : displayProject.id === 'hovr' ? (
            <HomeHovrCaseStudy
              isDark={isDark}
              isMobile={isMobile}
              sectionRefs={hovrSectionRefs}
              onMediaClick={setSelectedMedia}
            />
          ) : displayProject.id === 'piikai' ? (
            <HomePiikCaseStudy
              isDark={isDark}
              isMobile={isMobile}
              sectionRefs={piikSectionRefs}
              onMediaClick={setSelectedMedia}
            />
          ) : displayProject.id === 'ar-fitting-room' ? (
            <HomeArFittingCaseStudy
              isDark={isDark}
              isMobile={isMobile}
              sectionRefs={arFittingSectionRefs}
              onMediaClick={setSelectedMedia}
            />
          ) : displayProject.id === 'jojo' ? (
            <HomeJojoCaseStudy
              isDark={isDark}
              isMobile={isMobile}
              sectionRefs={jojoSectionRefs}
              onMediaClick={setSelectedMedia}
            />
          ) : (
            <>
              <div className="relative aspect-[577/277] w-full overflow-hidden rounded-none">
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
                  <img
                    key={genericHeroImgSrc}
                    src={genericHeroImgSrc}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-[clamp(1.75rem,8vw,2.5rem)] font-bold italic leading-none font-['Instrument_Serif',serif] md:text-[40px]">
                  {displayProject.label}
                </p>
                <p className={`font-normal ${muted}`}>{displayProject.desc}</p>
                {activeSpy && (
                  <div className="flex flex-col gap-2">
                    <CaseStudyRailTitle className="font-bold">
                      {activeSpy.label}
                    </CaseStudyRailTitle>
                    <p className={`font-normal ${muted}`}>{activeSpy.body}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>
        </div>
      </div>

      {selectedMedia && <Lightbox src={selectedMedia} onClose={() => setSelectedMedia(null)} />}
    </div>
  )
}
