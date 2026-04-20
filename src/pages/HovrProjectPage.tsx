import React, { Fragment, useMemo, useState, useEffect, useRef } from 'react'
import { useIsNarrow } from '../hooks/useIsNarrow'
import { useCaseStudyHomeRailGap } from '../hooks/useCaseStudyHomeRailGap'
import { usePageTheme } from '../context/PageThemeContext'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { IMAGE_SIZES, OptimizedImage } from '../components/OptimizedImage'
import { CaseStudyRailTitle } from '../components/CaseStudyRailTitle'
import {
  TEST_HOME_PROJECT_TITLE_SERIF,
  TEST_HOME_HERO_META_LABEL_SERIF,
  TEST_HOME_SECTION_CONTENT_HEADING_SERIF,
  testHomeDetailsSectionHighlightClass,
} from './testHomeTypography'
import { CASE_STUDY_MOBILE_DETAILS_SCROLL_CLASS } from './caseStudyMobileShell'
import { buildCaseStudyHeroEntranceVariants } from './homeCaseStudyHeroMotion'

/** Home third column + `HomeHovrCaseStudy` / mobile `/projects/hovr` typography. */
const INSTRUMENT_SERIF = "font-['Instrument_Serif',serif]"
const HOVR_CASE_LABEL_CLASS = `${INSTRUMENT_SERIF} text-[20px] leading-tight font-bold`
const HOVR_CASE_BODY_CLASS = 'font-mono text-[12px] font-normal leading-[1.2]'
const HOVR_SECTION_LABEL_CLASS = `${INSTRUMENT_SERIF} text-[22px] leading-tight font-bold`
const HOVR_SECTION_BODY_CLASS = 'text-[12px] font-normal font-mono leading-[1.2] tracking-[-0.02em]'

/** Bump `?v=` when replacing these files in `public/hovr/` so cached clients load the new PNGs. */
const HOVR_RESEARCH_IMAGE = '/hovr/Research.png?v=2'
const HOVR_SOLUTION_SKETCH_IMAGE = '/hovr/solution-sketch.png?v=2'

// ── Section data ───────────────────────────────────────────────────────────────

export const HOVR_SECTIONS = [
  {
    id: 'overview',
    label: 'Overview',
    heading: <>On the original website, the driver approval process took 48.08 seconds. This lengthy process was reduced to 7.26 seconds, achieving an <span style={{ color: 'red' }}>84.9%</span> time savings.</>,
    body: 'Restructured the flow to give permissions all required documents for driver approval. Organized a vast amount of driver data to ensure it was easily scannable at a glance.',
    media: '/hovr/Workflow-time.mp4',
  },
  {
    id: 'the-goal',
    label: 'The Goal',
    heading: 'The goal is to improve efficiency and reduce the time required for approvals.',
    body: 'In the existing admin panel, support staff must manually click on each uploaded document to review them, making the driver approval process time-consuming.',
    media: '/hovr/product-research.jpg',
  },
  {
    id: 'research',
    label: 'Research',
    heading: 'The Approval system should be simplified.',
    body: 'User research and interview revealed that manual document verification was the primary friction point, forcing admin staff to spend nearly 48 seconds on every single approval',
    media: HOVR_RESEARCH_IMAGE,
  },
  {
    id: 'solution-sketch',
    label: 'Solution Sketch',
    heading: 'Split-View Inspection System',
    body: 'Implemented a dual-panel workflow where clicking a card triggers an instant document preview on the right. This side-by-side layout ensures that the support team can validate complex information within a single screen, significantly reducing the number of clicks required for a full driver approval.',
    media: [HOVR_SOLUTION_SKETCH_IMAGE, '/hovr/card-design 1.jpg'],
    carousel: ['/hovr/card-design2.jpg', '/hovr/card-design3.jpg'],
  },
  {
    id: 'final-solution',
    label: 'Final Solution',
    heading: '',
    body: '',
    media: '',
    subSections: [
      {
        heading: <><span style={{ color: 'red' }}>Bulk Approval</span>: The support team can quickly review all submitted documents at once.</>,
        body: 'If the information appears correct, they can select all documents and approve them in a single action.',
        media: '/hovr/Bulk-approval.mp4',
      },
      {
        heading: 'The support team can still edit documents after approval if needed.',
        body: '',
        media: '/hovr/After-Approval.mp4',
      },
      {
        heading: <><span style={{ color: 'red' }}>Approve Documents Individually</span>: Support team members can review and approve documents one at a time as needed.</>,
        body: 'If the scanned document and manually entered data don\'t match, users can click each document card on the left to compare and verify the information.',
        media: '/hovr/Document-list.mp4',
        postContent: [
          { body: 'Then, if the document looks legitimate, the support team can approve it directly on the same screen without seeing a popup or navigating to another page.', media: '/hovr/Approve-one.mp4' },
          {
            heading: <><span style={{ color: 'red' }}>Rejection Process</span>: The support team can reject submitted documents individually. To prevent mistakes, the rejection process includes a few additional steps.</>,
            body: 'If a document is invalid, users can reject it by clicking the Reject button located above the document images.\n\nA rejection reason must be provided to complete the process. Users can either select a reason from a predefined list or enter a custom reason manually.\n\nThe rejection reason is then sent to the driver via SMS, guiding them to resubmit the document correctly and avoid repeating the same mistake.',
            media: '/hovr/Reject.mp4',
          },
        ],
      },
    ],
  },
  {
    id: 'takeaway',
    label: 'Takeaway',
    heading: 'Understanding Users\' Needs and Identifying the Right Pain Points is Key to Product Design.',
    body: 'Unlike public-facing products, an admin website is designed specifically for internal teams, meaning efficient workflows take priority over aesthetic UI. The driver approval process was the biggest pain point for the support team because they had to manually review a massive number of submitted documents, making the process extremely time-consuming. Their need for a better workflow was more urgent than I initially expected, which I only fully realized through direct conversations and user empathy.\n\nAdditionally, at the design team\'s request, the support team provided a clear list of essential features and design requirements, which greatly streamlined the solution development process. This experience reinforced the importance of direct user communication and collaboration in UX design, particularly in a fast-paced startup environment where rapid problem-solving is crucial.',
    media: '',
  },
]

export const HOVR_META_ROWS: { label: string; value: React.ReactNode }[] = [
  {
    label: 'Team / Role',
    value: 'HOVR Internal tools\u00a0\u00a0·\u00a0\u00a0UX/UI Designer',
  },
  {
    label: 'Problem',
    value:
      'Manual document reviews in the admin panel created a severe operational bottleneck, taking ~48 seconds per driver approval.',
  },
  {
    label: 'Solution',
    value: (
      <>
        Designed and shipped{' '}
        <strong className="font-bold">an OCR-powered data validation system</strong> that automates user input verification.
      </>
    ),
  },
  {
    label: 'Impact',
    value: (
      <>
        Achieved an <strong className="font-bold">84.9% reduction</strong> in manual review time, significantly accelerating the driver onboarding pipeline.
      </>
    ),
  },
]

/** HOVR hero above the title — files in `public/hovr/`. */
export const HOVR_HERO_THUMB_DARK = '/hovr/thumbnail-test.jpg'
export const HOVR_HERO_THUMB_LIGHT = '/hovr/thumbnail-test2.jpg'

// ── Lightbox ───────────────────────────────────────────────────────────────────

export function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  const isVideo = src.endsWith('.mp4')
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      >
        <button
          className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-xl border border-white/40 text-white text-lg font-bold hover:bg-white/30 transition-colors"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
        <motion.div
          className="overflow-hidden rounded-none"
          style={{ maxWidth: '90%', maxHeight: '85vh' }}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {isVideo ? (
            <video
              src={src}
              autoPlay
              loop
              muted
              playsInline
              className="rounded-none object-contain"
              style={{ maxWidth: '100%', maxHeight: '85vh' }}
            />
          ) : (
            <OptimizedImage
              src={src}
              alt=""
              className="rounded-none object-contain"
              style={{ maxWidth: '100%', maxHeight: '85vh' }}
              sizes={IMAGE_SIZES.lightbox}
              priority
              placeholder="empty"
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ── Media block ────────────────────────────────────────────────────────────────

export function MediaBlock({ src, onMediaClick }: { src: string; onMediaClick?: (src: string) => void }) {
  if (src.endsWith('.mp4')) {
    return (
      <div className="overflow-hidden rounded-none">
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          className="w-full cursor-zoom-in"
          onClick={() => onMediaClick?.(src)}
        />
      </div>
    )
  }
  if (src) {
    return (
      <div className="overflow-hidden rounded-none">
        <OptimizedImage
          src={src}
          alt=""
          className="w-full h-auto cursor-zoom-in"
          sizes={IMAGE_SIZES.caseStudyFull}
          placeholder="blur"
          onClick={() => onMediaClick?.(src)}
        />
      </div>
    )
  }
  return (
    <div
      className="w-full rounded-none bg-white/20 backdrop-blur-xl border border-white/40"
      style={{ height: 280 }}
    />
  )
}

// ── Carousel block ─────────────────────────────────────────────────────────────

export function CarouselBlock({ srcs, onMediaClick }: { srcs: string[]; onMediaClick?: (src: string) => void }) {
  const [index, setIndex] = useState(0)
  const isLast = index === srcs.length - 1
  const translateX = isLast
    ? `calc(${-(index * 80 - 20)}% - ${index * 16}px)`
    : `calc(-${index * 80}% - ${index * 16}px)`
  const arrowStyle: React.CSSProperties = {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%',
    width: 32, height: 32, cursor: 'pointer', fontSize: 16, display: 'flex',
    alignItems: 'center', justifyContent: 'center', color: '#fff',
  }
  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 0 }}>
      <div
        style={{
          display: 'flex',
          transition: 'transform 0.4s ease',
          transform: `translateX(${translateX})`,
          gap: 16,
        }}
      >
        {srcs.map((src, ci) => (
          <OptimizedImage
            key={src}
            src={src}
            alt=""
            className="cursor-zoom-in flex-shrink-0"
            style={{ width: '80%', height: 'auto', borderRadius: 0 }}
            sizes={IMAGE_SIZES.carouselSlide80}
            placeholder="blur"
            priority={ci === 0}
            onClick={() => onMediaClick?.(src)}
          />
        ))}
      </div>
      {index > 0 && (
        <button onClick={() => setIndex(index - 1)} style={{ ...arrowStyle, left: 8 }}>‹</button>
      )}
      {index < srcs.length - 1 && (
        <button onClick={() => setIndex(index + 1)} style={{ ...arrowStyle, right: 8 }}>›</button>
      )}
    </div>
  )
}

// ── Home (/) third column — same case study content as HovrProjectPage (mobile route uses this too) ─

export function HomeHovrCaseStudy({
  isDark,
  isMobile,
  sectionRefs,
  onMediaClick,
  entranceActive,
  reduceMotion,
  onHeroEntranceComplete,
  testHomeProjectTitles,
  testHomeHighlightSectionId,
}: {
  isDark: boolean
  isMobile: boolean
  sectionRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
  onMediaClick: (src: string) => void
  entranceActive: boolean
  reduceMotion: boolean
  onHeroEntranceComplete?: () => void
  /** When set (e.g. `/test` home), hero + rail headings use upright Instrument Serif 400. */
  testHomeProjectTitles?: boolean
  /** `/test` home: scroll-synced section id — that section gets the same inverted panel as the active spy row. */
  testHomeHighlightSectionId?: string | null
}) {
  const fg = isDark ? '#FFFFFF' : '#000000'
  const { rootRef, railGapPx } = useCaseStudyHomeRailGap()
  const heroV = useMemo(() => buildCaseStudyHeroEntranceVariants(reduceMotion), [reduceMotion])
  const heroState = entranceActive ? 'visible' : 'hidden'
  const heroInitial = reduceMotion ? false : 'hidden'
  const heroMetaLabelClass = testHomeProjectTitles
    ? `text-[22px] ${TEST_HOME_HERO_META_LABEL_SERIF}`
    : HOVR_CASE_LABEL_CLASS
  const homeSectionContentHeadingClass = testHomeProjectTitles
    ? TEST_HOME_SECTION_CONTENT_HEADING_SERIF
    : HOVR_SECTION_LABEL_CLASS

  return (
    <div
      ref={rootRef}
      className="flex w-full min-w-0 flex-col pb-4 md:min-h-0"
      style={{ fontFamily: 'Arial, sans-serif', color: fg }}
    >
      <motion.div
        className="mb-0 w-full"
        variants={heroV.heroContainer}
        initial={heroInitial}
        animate={heroState}
      >
        <motion.div variants={heroV.heroItem} className="overflow-hidden">
          <OptimizedImage
            key={isDark ? 'hovr-thumb-dark' : 'hovr-thumb-light'}
            src={isDark ? HOVR_HERO_THUMB_DARK : HOVR_HERO_THUMB_LIGHT}
            alt="HOVR Admin"
            className="mb-[30px] block h-auto w-full max-w-full rounded-none"
            sizes={IMAGE_SIZES.caseStudyFull}
            priority
            placeholder="blur"
          />
        </motion.div>

        <motion.h1
          variants={heroV.heroItem}
          className={
            testHomeProjectTitles
              ? `mb-[10px] mt-0 text-[clamp(1.75rem,7vw,2.375rem)] md:text-[42px] ${TEST_HOME_PROJECT_TITLE_SERIF}`
              : "mb-[10px] mt-0 text-[clamp(1.75rem,7vw,2.375rem)] font-bold italic leading-none font-['Instrument_Serif',serif] md:text-[42px]"
          }
        >
          HOVR Admin
        </motion.h1>

        <motion.p variants={heroV.heroItem} className={`mb-[26px] mt-0 ${HOVR_CASE_BODY_CLASS}`}>
          UX/UI Design · Internal Tools
        </motion.p>

        <motion.div
          variants={heroV.heroItem}
          className="flex w-full flex-col gap-y-2"
          onAnimationComplete={() => {
            if (entranceActive) onHeroEntranceComplete?.()
          }}
        >
          <div className="flex w-full items-center gap-x-[20px]">
            <span className={`shrink-0 whitespace-nowrap ${heroMetaLabelClass}`}>{HOVR_META_ROWS[0].label}</span>
            <span className={`min-w-0 flex-1 ${HOVR_CASE_BODY_CLASS}`}>{HOVR_META_ROWS[0].value}</span>
          </div>
          <div className="h-[10px] shrink-0" aria-hidden />
          <div className="grid w-full grid-cols-[auto_1fr] items-start gap-x-[20px] gap-y-2">
            {HOVR_META_ROWS.slice(1).map(({ label, value }) => (
              <Fragment key={label}>
                <span className={`whitespace-nowrap ${heroMetaLabelClass}`}>{label}</span>
                <span className={`min-w-0 ${HOVR_CASE_BODY_CLASS}`}>{value}</span>
              </Fragment>
            ))}
          </div>
          <OptimizedImage
            src="/hovr/timeline.jpg"
            alt=""
            className="mt-6 mb-[150px] block h-auto w-full max-w-full cursor-zoom-in rounded-none"
            sizes={IMAGE_SIZES.caseStudyFull}
            placeholder="blur"
            onClick={() => onMediaClick('/hovr/timeline.jpg')}
          />
        </motion.div>
      </motion.div>

      {HOVR_SECTIONS.map((section, i) => {
        const sectionSpyActive =
          Boolean(testHomeProjectTitles) &&
          testHomeHighlightSectionId != null &&
          section.id === testHomeHighlightSectionId
        return (
        <motion.div
          key={section.id}
          ref={(el) => {
            sectionRefs.current[i] = el
          }}
          className={[
            'mb-[200px] last:mb-0',
            testHomeDetailsSectionHighlightClass(isDark, sectionSpyActive),
          ]
            .filter(Boolean)
            .join(' ')}
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
              className={
                testHomeProjectTitles
                  ? `shrink-0 whitespace-nowrap text-[22px] ${TEST_HOME_PROJECT_TITLE_SERIF} ${isMobile ? 'w-full' : 'w-[130px]'}`
                  : `shrink-0 whitespace-nowrap italic ${HOVR_SECTION_LABEL_CLASS} ${isMobile ? 'w-full' : 'w-[130px]'}`
              }
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
                      {sub.heading && <p className={homeSectionContentHeadingClass}>{sub.heading}</p>}
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
                            {pc.heading && <p className={`mt-20 ${homeSectionContentHeadingClass}`}>{pc.heading}</p>}
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
                  {section.heading && <p className={homeSectionContentHeadingClass}>{section.heading}</p>}
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
        )
      })}
    </div>
  )
}

// ── HOVR project page ──────────────────────────────────────────────────────────

export function HovrProjectPage() {
  const { isDark: themeIsDark } = usePageTheme()
  const reduceMotion = useReducedMotion()
  const colLeft  = 'calc(25% + 12px)'
  const colRight = 'calc(8.33% + 15px)'
  const isNarrow = useIsNarrow(1200)
  const isMedium = useIsNarrow(1000)
  const isMobile = useIsNarrow(768)

  const [activeSection, setActiveSection]   = useState(0)
  const [selectedMedia, setSelectedMedia]   = useState<string | null>(null)

  const scrollRef    = useRef<HTMLDivElement>(null)
  const sectionRefs  = useRef<(HTMLDivElement | null)[]>([])
  const mobileHovrSectionRefs = useRef<(HTMLDivElement | null)[]>([])
  const scrollSpyRef = useRef<HTMLDivElement>(null)
  const [spyRight, setSpyRight] = useState<string | number>(window.innerWidth < 1700 ? 16 : colRight)

  useEffect(() => {
    const check = () => setSpyRight(window.innerWidth < 1700 ? 16 : colRight)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (isMobile) return
    const container = scrollRef.current
    if (!container) return

    const update = () => {
      const vh             = container.clientHeight
      const scrollTop      = container.scrollTop
      const containerCenter = scrollTop + vh / 2
      const bandTop        = scrollTop + vh * 0.4
      const bandBottom     = scrollTop + vh * 0.6

      let best = 0
      let minDist = Infinity

      sectionRefs.current.forEach((el, i) => {
        if (!el) return
        const elTop    = el.offsetTop
        const elBottom = elTop + el.offsetHeight
        const elCenter = elTop + el.offsetHeight / 2

        if (el.offsetHeight > vh) {
          // Long section: active while its top–bottom span overlaps the central band
          if (elTop <= bandBottom && elBottom >= bandTop) {
            const dist = 0 // highest priority
            if (dist < minDist) { minDist = dist; best = i }
          }
        } else {
          const dist = Math.abs(elCenter - containerCenter)
          if (dist < minDist) { minDist = dist; best = i }
        }
      })

      setActiveSection(best)
    }

    update()
    container.addEventListener('scroll', update, { passive: true })
    return () => container.removeEventListener('scroll', update)
  }, [isMobile])

  const scrollToSection = (index: number) => {
    const el        = sectionRefs.current[index]
    const container = scrollRef.current
    if (!el || !container) return
    const vh = container.clientHeight
    const targetScrollTop = el.offsetHeight > vh
      ? el.offsetTop - vh * 0.4
      : el.offsetTop - vh / 2 + el.offsetHeight / 2
    container.scrollTo({ top: targetScrollTop, behavior: 'smooth' })
  }

  const mobileHovrText = themeIsDark ? 'text-[#FFFFFF]' : 'text-black'

  if (isMobile) {
    return (
      <>
        <div
          className={`fixed inset-0 z-0 flex min-h-0 flex-col md:hidden ${
            themeIsDark ? 'bg-[#111111]' : 'bg-[#faf7f0]'
          } pt-[max(3.5rem,env(safe-area-inset-top,0px)+0.25rem)] px-4 pb-[max(5.5rem,env(safe-area-inset-bottom,0px))]`}
        >
          <div
            className={`${CASE_STUDY_MOBILE_DETAILS_SCROLL_CLASS} ${mobileHovrText}`}
          >
            <HomeHovrCaseStudy
              isDark={themeIsDark}
              isMobile={isMobile}
              sectionRefs={mobileHovrSectionRefs}
              onMediaClick={setSelectedMedia}
              entranceActive
              reduceMotion={Boolean(reduceMotion)}
              testHomeProjectTitles
            />
          </div>
        </div>
        {selectedMedia && <Lightbox src={selectedMedia} onClose={() => setSelectedMedia(null)} />}
      </>
    )
  }

  return (
    <>
      {/* ── Scrollable content (md+ only) ─────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="absolute overflow-x-hidden overflow-y-auto"
        style={
          isMedium
            ? { left: 100, right: 100, top: 0, bottom: 0, overflowX: 'hidden' }
            : isNarrow
              ? {
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 'min(800px, calc(100% - 80px))',
                  right: 'auto',
                  top: 0,
                  bottom: 0,
                }
              : { left: colLeft, right: colRight, top: 0, bottom: 0 }
        }
      >
        <div
          style={{
            paddingTop: 32,
            paddingLeft: 10,
            paddingBottom: '50vh',
            fontFamily: 'Arial, sans-serif',
          }}
        >

          {/* Title image */}
          <OptimizedImage
            key={themeIsDark ? 'hovr-thumb-dark' : 'hovr-thumb-light'}
            src={themeIsDark ? HOVR_HERO_THUMB_DARK : HOVR_HERO_THUMB_LIGHT}
            alt="HOVR Admin"
            style={{ width: '100%', maxWidth: 1000, height: 'auto', display: 'block', marginBottom: 30, borderRadius: 0 }}
            sizes={IMAGE_SIZES.caseStudyFull}
            priority
            placeholder="blur"
          />

          {/* Title */}
          <h1
            style={{
              fontSize:     44,
              fontWeight:   700,
              lineHeight:   '36px',
              color:        '#000',
              marginBottom: 26,
              marginTop:    0,
            }}
          >
            HOVR Admin
          </h1>

          {/* Metadata */}
          <div
            style={{
              display:   'grid',
              gridTemplateColumns: 'auto 1fr',
              columnGap: 28,
              rowGap: undefined,
              fontSize:  14,
              lineHeight: '20px',
              color:     '#000',
              alignItems: 'start',
              marginBottom: 32,
            }}
          >
            {/* Team / Role */}
            <React.Fragment key={HOVR_META_ROWS[0].label}>
              <span style={{ fontWeight: 700, whiteSpace: 'nowrap', paddingBottom: 8 }}>{HOVR_META_ROWS[0].label}</span>
              <span style={{ fontWeight: 400, paddingBottom: 8, wordBreak: 'break-word' }}>{HOVR_META_ROWS[0].value}</span>
            </React.Fragment>

            {/* 10px gap before grouped rows */}
            <div style={{ paddingTop: 10 }} />
            <div style={{ paddingTop: 10 }} />

            {/* Problem / Solution / Impact */}
            {HOVR_META_ROWS.slice(1).map(({ label, value }, i) => (
              <React.Fragment key={label}>
                <span style={{ fontWeight: 700, whiteSpace: 'nowrap', paddingBottom: i < HOVR_META_ROWS.length - 2 ? 8 : 0 }}>{label}</span>
                <span style={{ fontWeight: 400, paddingBottom: i < HOVR_META_ROWS.length - 2 ? 8 : 0, wordBreak: 'break-word' }}>{value}</span>
              </React.Fragment>
            ))}
          </div>

          {/* Process image */}
          <OptimizedImage
            src="/hovr/process.png"
            alt=""
            style={{ width: '100%', maxWidth: 1000, height: 'auto', marginTop: 50, marginBottom: 200, borderRadius: 0, cursor: 'zoom-in' }}
            sizes={IMAGE_SIZES.caseStudyFull}
            placeholder="blur"
            onClick={() => setSelectedMedia('/hovr/process.png')}
          />

          {/* Sections */}
          {HOVR_SECTIONS.map((section, i) => (
            <motion.div
              key={section.id}
              ref={(el) => { sectionRefs.current[i] = el }}
              style={{ marginBottom: i < HOVR_SECTIONS.length - 1 ? 200 : 0, transformOrigin: 'top center' }}
              animate={i === activeSection
                ? { opacity: 1, scale: 1 }
                : { opacity: 0.3, scale: 0.97 }
              }
              transition={{ duration: 0.5, ease: [0.44, 0, 0.3, 0.99] }}
            >
              <motion.div
                initial={{ y: 40, opacity: 0, scale: 1.02, rotateX: -5 }}
                whileInView={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
                viewport={{ once: true, amount: 0.2, root: scrollRef }}
                transition={{ duration: 0.7, ease: [0.44, 0, 0.3, 0.99] }}
              >
                <div
                  style={{
                    display:       'flex',
                    flexDirection: 'row',
                    alignItems:    'flex-start',
                    gap:           161,
                    fontSize:      14,
                    lineHeight:    '16px',
                    color:         '#000',
                  }}
                >
                  {/* Left label */}
                  <p style={{ fontWeight: 700, width: 130, flexShrink: 0, whiteSpace: 'nowrap' }}>
                    {section.label}
                  </p>

                  {/* Right content */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 578, minWidth: 0 }}>
                    {'subSections' in section && section.subSections ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
                        {(section.subSections as { heading: React.ReactNode; body: string; media: string }[]).map((sub, si) => (
                          <div key={si} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: si === 2 ? 40 : 0 }}>
                            {sub.heading && <p style={{ fontWeight: 700 }}>{sub.heading}</p>}
                            {sub.body && sub.body.split('\n\n').map((para, pi) => (
                              <p key={pi} style={{ fontWeight: 400 }}>{para}</p>
                            ))}
                            <MediaBlock src={sub.media} onMediaClick={setSelectedMedia} />
                            {'postContent' in sub && (sub.postContent as { heading?: React.ReactNode; body?: string; media?: string }[]).map((pc, pi) => (
                              <React.Fragment key={pi}>
                                {pc.heading && <p style={{ fontWeight: 700, marginTop: 80 }}>{pc.heading}</p>}
                                {pc.body && pc.body.split('\n\n').map((para, ri) => (
                                  <p key={ri} style={{ fontWeight: 400, marginTop: !pc.heading && ri === 0 ? 40 : 0 }}>{para}</p>
                                ))}
                                {pc.media && <MediaBlock src={pc.media} onMediaClick={setSelectedMedia} />}
                              </React.Fragment>
                            ))}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        {section.heading && (
                          <p style={{ fontWeight: 700 }}>{section.heading}</p>
                        )}
                        {section.body.split('\n\n').map((para, i) => (
                          <p key={i} style={{ fontWeight: 400 }}>{para}</p>
                        ))}
                        {Array.isArray(section.media)
                          ? section.media.map((m) => <MediaBlock key={m} src={m} onMediaClick={setSelectedMedia} />)
                          : section.media && <MediaBlock src={section.media} onMediaClick={setSelectedMedia} />}
                        {'carousel' in section && section.carousel && (
                          <CarouselBlock srcs={section.carousel as string[]} onMediaClick={setSelectedMedia} />
                        )}
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}

        </div>
      </div>

      {/* ── Right scroll spy ─────────────────────────────────────────────────── */}
      <div
        ref={scrollSpyRef}
        className="fixed top-1/2 -translate-y-1/2 hidden gap-3 text-black not-italic md:flex md:flex-col md:items-end"
        style={{
          right:      spyRight,
          fontSize:   14,
          lineHeight: '16px',
          fontFamily: 'Arial, sans-serif',
          zIndex:     10,
        }}
      >
        {HOVR_SECTIONS.map((s, i) => (
          <span
            key={s.id}
            onClick={() => scrollToSection(i)}
            style={{ whiteSpace: 'nowrap' }}
            className={`cursor-pointer select-none hover:font-bold ${
              i === activeSection ? 'font-bold' : 'font-normal'
            }`}
          >
            {s.label}
          </span>
        ))}
      </div>

      {/* ── Lightbox ─────────────────────────────────────────────────────────── */}
      {selectedMedia && <Lightbox src={selectedMedia} onClose={() => setSelectedMedia(null)} />}
    </>
  )
}
