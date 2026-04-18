import React, { Fragment, useState, useEffect, useLayoutEffect, useRef } from 'react'
import { useIsNarrow } from '../hooks/useIsNarrow'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { IMAGE_SIZES, OptimizedImage } from '../components/OptimizedImage'
import { readStoredThemePrefersDark, usePageTheme } from '../context/PageThemeContext'
import { CaseStudyRailTitle } from '../components/CaseStudyRailTitle'
import {
  TEST_HOME_PROJECT_TITLE_SERIF,
  TEST_HOME_HERO_META_LABEL_SERIF,
  TEST_HOME_SECTION_CONTENT_HEADING_SERIF,
  testHomeDetailsSectionHighlightClass,
} from './testHomeTypography'
import { CASE_STUDY_MOBILE_DETAILS_COLUMN_CLASS, CASE_STUDY_MOBILE_DETAILS_SCROLL_CLASS } from './caseStudyMobileShell'
import { useCaseStudyHomeRailGap } from '../hooks/useCaseStudyHomeRailGap'
import { PiikCaseStudyMediaBlock, PiikCaseStudyCarouselBlock, PiikCaseStudyPhoneCarousel } from './PiikProjectPage'
import { JOJO_SECTIONS, JOJO_META_ROWS, JOJO_HERO_THUMB_DARK, JOJO_HERO_THUMB_LIGHT } from './jojoHomeData'

function jojoSectionRefIndex(id: string): number {
  const i = JOJO_SECTIONS.findIndex((s) => s.id === id)
  return i < 0 ? 0 : i + 1
}

const JOJO_HOME_INSTRUMENT = "font-['Instrument_Serif',serif]"
const JOJO_HOME_META_LABEL_CLASS = `${JOJO_HOME_INSTRUMENT} text-[16px] leading-tight font-bold`
const JOJO_HOME_META_BODY_CLASS = 'font-mono text-[12px] font-normal leading-[1.2]'
const JOJO_HOME_SECTION_LABEL_CLASS = `${JOJO_HOME_INSTRUMENT} text-[18px] leading-tight font-bold`
const JOJO_HOME_SECTION_BODY_CLASS = 'text-[12px] font-normal font-mono leading-[1.2] tracking-[-0.02em]'

/** Instrument Serif for JoJo Research `postContent` paragraphs (merged “And AI / The key” uses ri === 1 for “The key…”; “Then which / Well both” uses ri === 0 for the first line only). */
function jojoResearchPostContentInstrumentSerif(pi: number, ri: number): boolean {
  if (pi === 3 && ri === 1) return true
  if ((pi === 1 || pi === 2 || pi === 4 || pi === 5 || pi === 6) && ri === 0) return true
  return false
}

function jojoPostContentParagraphRed(pc: { redParagraphIndices?: number[] }, ri: number): boolean {
  return Array.isArray(pc.redParagraphIndices) && pc.redParagraphIndices.includes(ri)
}

function jojoPostContentMediaSrcs(media: string | string[] | undefined): string[] {
  if (media == null) return []
  return Array.isArray(media) ? media.filter(Boolean) : media ? [media] : []
}

/** Final Solution: space below `.mp4` blocks (home rail + full page). */
function jojoFinalSolutionVideoGapClass(sectionId: string, src: string): string {
  return sectionId === 'final-solution' && src.endsWith('.mp4') ? 'mb-[80px]' : ''
}

function jojoFinalSolutionVideoGapStyle(sectionId: string, src: string): React.CSSProperties | undefined {
  return sectionId === 'final-solution' && src.endsWith('.mp4') ? { marginBottom: 80 } : undefined
}

function jojoSectionNavLabel(s: (typeof JOJO_SECTIONS)[number]): string {
  return 'spyLabel' in s && s.spyLabel != null ? String(s.spyLabel) : s.label
}

function jojoCarouselFullWidth(sectionId: string) {
  return sectionId === 'user-interview' || sectionId === 'prototypes' || sectionId === 'final-solution'
}

function jojoCarouselImageScale(sectionId: string) {
  if (sectionId === 'prototypes') return 0.6
  if (sectionId === 'final-solution') return 1.44
  return 1
}

function jojoCarouselSlideGap(sectionId: string) {
  return sectionId === 'prototypes' || sectionId === 'final-solution' ? 10 : 0
}

function jojoCarouselEdgeAlign(sectionId: string) {
  return sectionId === 'prototypes' || sectionId === 'final-solution'
}

function jojoCarouselTwoUp(sectionId: string) {
  return sectionId === 'prototypes' || sectionId === 'final-solution'
}

// ── Lightbox (match Piik: sharp corners) ───────────────────────────────────────

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
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
          className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/20 text-lg font-bold text-white backdrop-blur-xl transition-colors hover:bg-white/30"
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

// ── Media block (empty src → Piik-style placeholder) ──────────────────────────

function MediaBlock({ src, onMediaClick, playbackRate }: { src: string; onMediaClick?: (src: string) => void; playbackRate?: number }) {
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
          onLoadedMetadata={(e) => {
            if (playbackRate) (e.target as HTMLVideoElement).playbackRate = playbackRate
          }}
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
          className="h-auto w-full cursor-zoom-in"
          sizes={IMAGE_SIZES.caseStudyFull}
          placeholder="blur"
          onClick={() => onMediaClick?.(src)}
        />
      </div>
    )
  }
  return (
    <div
      className="flex w-full items-center justify-center rounded-none border border-white/40 bg-white/20 text-center text-[13px] font-medium text-black/50 backdrop-blur-xl"
      style={{ minHeight: 280 }}
      aria-hidden
    >
      Image / video placeholder
    </div>
  )
}

// ── Project page (structure aligned with PiikProjectPage) ─────────────────────

export function JojoProjectPage() {
  const colRight = 'calc(8.33% + 15px)'
  const isNarrow = useIsNarrow(1200)
  const isMedium = useIsNarrow(1000)
  const isMobile = useIsNarrow(768)

  const [activeSection, setActiveSection] = useState(0)
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null)
  const [isDark, setIsDarkLocal] = useState(false)
  const [sectionBgVisible, setSectionBgVisible] = useState(false)
  const [sectionBgColor, setSectionBgColor] = useState('#C7D0DD')

  const scrollRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const goalRef = useRef<HTMLDivElement>(null)
  const overviewRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress: overviewProgress } = useScroll({
    container: scrollRef,
    target: overviewRef,
    offset: ['start end', 'start start'],
  })
  const imageOpacity = useTransform(overviewProgress, [0, 1], [1, 0])

  const { scrollYProgress: goalProgress } = useScroll({
    container: scrollRef,
    target: goalRef,
    offset: ['start end', 'start center'],
  })
  const bgColor = useTransform(goalProgress, [0, 1], ['#3D4E6D', '#E8E8E8'])

  const { setIsDark, isDark: pageIsDark } = usePageTheme()
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])
  const scrollSpyRef = useRef<HTMLDivElement>(null)
  const [spyRight, setSpyRight] = useState<string | number>(window.innerWidth < 1700 ? 16 : colRight)

  useLayoutEffect(() => {
    setIsDark(false)
  }, [setIsDark])

  useEffect(() => {
    return () => setIsDark(readStoredThemePrefersDark())
  }, [setIsDark])

  useEffect(() => {
    const root = document.getElementById('root') as HTMLElement | null
    const appWrapper = root?.firstElementChild as HTMLElement | null
    document.body.style.backgroundColor = 'transparent'
    document.documentElement.style.backgroundColor = 'transparent'
    if (root) root.style.backgroundColor = 'transparent'
    if (appWrapper) appWrapper.style.backgroundColor = 'transparent'
    return () => {
      document.body.style.backgroundColor = ''
      document.documentElement.style.backgroundColor = ''
      if (root) root.style.backgroundColor = ''
      if (appWrapper) appWrapper.style.backgroundColor = ''
    }
  }, [])

  useEffect(() => {
    const check = () => setSpyRight(window.innerWidth < 1700 ? 16 : colRight)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const update = () => {
      const vh = container.clientHeight
      const scrollTop = container.scrollTop
      const containerCenter = scrollTop + vh / 2
      const bandTop = scrollTop + vh * 0.4
      const bandBottom = scrollTop + vh * 0.6

      let best = 0
      let minDist = Infinity

      if (heroRef.current) {
        const el = heroRef.current
        const elCenter = el.offsetTop + el.offsetHeight / 2
        const dist = Math.abs(elCenter - containerCenter)
        if (dist < minDist) {
          minDist = dist
          best = 0
        }
      }

      sectionRefs.current.forEach((el, i) => {
        if (!el) return
        const elTop = el.offsetTop
        const elBottom = elTop + el.offsetHeight
        const elCenter = elTop + el.offsetHeight / 2

        if (el.offsetHeight > vh) {
          if (elTop <= bandBottom && elBottom >= bandTop) {
            if (0 < minDist) {
              minDist = 0
              best = i
            }
          }
        } else {
          const dist = Math.abs(elCenter - containerCenter)
          if (dist < minDist) {
            minDist = dist
            best = i
          }
        }
      })

      setActiveSection(best)

      const overviewEl = sectionRefs.current[1]
      const overviewDark = overviewEl
        ? (() => {
            const c = overviewEl.offsetTop + overviewEl.offsetHeight / 2
            return c >= bandTop && c <= bandBottom
          })()
        : false
      const researchEl = sectionRefs.current[jojoSectionRefIndex('research')]
      const problemsEl = sectionRefs.current[jojoSectionRefIndex('problems')]
      const finalEl = sectionRefs.current[jojoSectionRefIndex('final-solution')]
      let inDark = false
      if (researchEl && problemsEl && finalEl) {
        const overlayStart = researchEl.offsetTop - vh * 0.4
        const overlayEnd = finalEl.offsetTop + finalEl.offsetHeight - vh * 0.4
        const inOverlay = scrollTop >= overlayStart && scrollTop <= overlayEnd
        setSectionBgVisible(inOverlay)
        if (inOverlay) {
          if (scrollTop >= finalEl.offsetTop - vh * 0.4) setSectionBgColor('#111111')
          else if (scrollTop >= problemsEl.offsetTop - vh * 0.4) setSectionBgColor('#1E2E49')
          else setSectionBgColor('#C7D0DD')
        }
        inDark = scrollTop >= researchEl.offsetTop - vh * 0.4 && scrollTop <= overlayEnd
      }
      setIsDarkLocal(overviewDark || inDark)
    }

    update()
    container.addEventListener('scroll', update, { passive: true })
    return () => container.removeEventListener('scroll', update)
  }, [])

  const scrollToSection = (index: number) => {
    const el = sectionRefs.current[index]
    const container = scrollRef.current
    if (!el || !container) return
    const vh = container.clientHeight
    const targetScrollTop = el.offsetTop - vh * 0.1
    container.scrollTo({ top: targetScrollTop, behavior: 'smooth' })
  }

  const mobileJojoSectionRefs = useRef<(HTMLDivElement | null)[]>([])

  if (isMobile) {
    const mobileJojoText = pageIsDark ? 'text-[#FFFFFF]' : 'text-black'
    return (
      <>
        <div
          className={`fixed inset-0 z-0 flex min-h-0 flex-col md:hidden ${
            pageIsDark ? 'bg-[#111111]' : 'bg-[#faf7f0]'
          } pt-[max(3.5rem,env(safe-area-inset-top,0px)+0.25rem)] px-4 pb-[max(5.5rem,env(safe-area-inset-bottom,0px))]`}
        >
          <div className={`${CASE_STUDY_MOBILE_DETAILS_SCROLL_CLASS} ${mobileJojoText}`}>
            <HomeJojoCaseStudy
              isDark={pageIsDark}
              isMobile={isMobile}
              sectionRefs={mobileJojoSectionRefs}
              onMediaClick={setSelectedMedia}
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
      <motion.div
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -2, backgroundColor: bgColor }}
      />

      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          backgroundImage: `url('${isDark ? JOJO_HERO_THUMB_DARK : JOJO_HERO_THUMB_LIGHT}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: imageOpacity,
        }}
      />

      <motion.div
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, pointerEvents: 'none' }}
        animate={{ backgroundColor: sectionBgColor, opacity: sectionBgVisible ? 1 : 0 }}
        transition={{ duration: 0.6, ease: [0.44, 0, 0.3, 0.99] }}
      />

      <div
        ref={scrollRef}
        className={`absolute overflow-y-auto${isMobile ? ' flex min-h-0 flex-col' : ''}`}
        style={
          isMobile
          ? { left: 16, right: 16, top: 0, bottom: 0, overflowX: 'hidden', position: 'absolute', zIndex: 1 }
          : isMedium
          ? { left: 100, right: 100, top: 0, bottom: 0, overflowX: 'hidden', position: 'absolute', zIndex: 1 }
          : isNarrow
                ? {
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 'min(800px, calc(100% - 80px))',
                    right: 'auto',
                    top: 0,
                    bottom: 0,
                    position: 'absolute',
                    zIndex: 1,
                  }
                : {
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 'min(1100px, calc(100% - 80px))',
                    right: 'auto',
                    top: 0,
                    bottom: 0,
                    position: 'absolute',
                    zIndex: 1,
                  }
        }
      >
        <div
          className={isMobile ? `theme-surface-transition w-full ${CASE_STUDY_MOBILE_DETAILS_COLUMN_CLASS}` : undefined}
          style={{
            paddingTop: 0,
            paddingLeft: isMobile ? 0 : 10,
            paddingRight: isMobile ? 0 : undefined,
            paddingBottom: isMobile ? 'max(6rem, calc(4rem + env(safe-area-inset-bottom, 0px)))' : 0,
            fontFamily: 'Arial, sans-serif',
          }}
        >
          <div
            ref={heroRef}
            style={{
              minHeight: '100dvh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              textAlign: 'left',
              padding: isMobile ? 16 : 40,
            }}
          >
            <h1
              style={{
                fontSize: isMobile ? 'clamp(2.5rem, 14vw, 3.5rem)' : 100,
                fontWeight: 800,
                lineHeight: 1,
                color: '#000000',
                marginBottom: 26,
                marginTop: 0,
                fontFamily: 'Arial, sans-serif',
              }}
            >
              JoJo
            </h1>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? 'minmax(0,1fr)' : 'auto 1fr',
                columnGap: isMobile ? 12 : 28,
                rowGap: isMobile ? 4 : undefined,
                fontSize: isMobile ? 13 : 14,
                lineHeight: '20px',
                color: '#000000',
                alignItems: 'start',
                marginBottom: 32,
                fontFamily: 'Arial, sans-serif',
              }}
            >
              <React.Fragment key={String(JOJO_META_ROWS[0].label)}>
                <span style={{ fontWeight: 700, whiteSpace: isMobile ? 'normal' : 'nowrap', paddingBottom: 8 }}>{JOJO_META_ROWS[0].label}</span>
                <span style={{ fontWeight: 700, paddingBottom: 8, wordBreak: 'break-word' }}>{JOJO_META_ROWS[0].value}</span>
              </React.Fragment>
              <div style={{ paddingTop: 10 }} />
              <div style={{ paddingTop: 10 }} />
              {JOJO_META_ROWS.slice(1).map(({ label, value }, i) => (
                <React.Fragment key={label}>
                  <span style={{ fontWeight: 700, whiteSpace: isMobile ? 'normal' : 'nowrap', paddingBottom: i < JOJO_META_ROWS.length - 2 ? 8 : 0 }}>{label}</span>
                  <span style={{ fontWeight: 700, paddingBottom: i < JOJO_META_ROWS.length - 2 ? 8 : 0, wordBreak: 'break-word' }}>{value}</span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {JOJO_SECTIONS.map((section, i) => (
            <motion.div
              key={section.id}
              ref={(el) => {
                sectionRefs.current[i + 1] = el
                if (section.id === 'the-goal') goalRef.current = el
                if (section.id === 'overview') overviewRef.current = el
              }}
              style={{
                marginTop: i === 0 ? '25vh' : 0,
                marginBottom: i < JOJO_SECTIONS.length - 1 ? '10vh' : 0,
                transformOrigin: 'top center',
              }}
              animate={i + 1 === activeSection ? { opacity: 1, scale: 1 } : { opacity: 0.3, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.44, 0, 0.3, 0.99] }}
            >
              {section.id === 'overview' ? (
                <motion.div
                  initial={{ opacity: 0, y: 40, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.05, root: scrollRef }}
                  transition={{ duration: 0.8, ease: [0.44, 0, 0.3, 0.99] }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    textAlign: 'left',
                    paddingTop: isMobile ? '12vh' : '30vh',
                    paddingBottom: isMobile ? '12vh' : '30vh',
                    color: isDark ? '#FFFFFF' : '#000000',
                    fontFamily: 'Arial, sans-serif',
                  }}
                >
                  <p style={{ fontFamily: 'Arial, sans-serif', fontWeight: 800, fontSize: isMobile ? 28 : 40, lineHeight: 1, margin: 0, marginBottom: '1.5rem' }}>
                    {section.label}
                  </p>
                  <p style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: isMobile ? 16 : 20, lineHeight: '22px', margin: 0, maxWidth: '800px' }}>
                    {section.heading}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 40, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.05, root: scrollRef }}
                  transition={{ duration: 0.8, ease: [0.44, 0, 0.3, 0.99] }}
                    style={{
                    display: 'flex',
                    flexDirection:
                      !isNarrow && !['the-goal', 'research', 'design', 'user-interview', 'final-solution'].includes(section.id) ? 'row' : 'column',
                    alignItems: 'flex-start',
                    textAlign: 'left',
                    paddingTop: isMobile ? '12vh' : '30vh',
                    paddingBottom:
                      section.id === 'final-solution'
                        ? isMobile
                          ? 'calc(12vh + 120px)'
                          : 'calc(30vh + 200px)'
                        : isMobile
                          ? '12vh'
                          : '30vh',
                    color: section.id === 'research' || section.id === 'final-solution' ? '#FFFFFF' : '#000000',
                    fontFamily: 'Arial, sans-serif',
                    gap: !isNarrow && !['the-goal', 'research', 'design', 'user-interview', 'final-solution'].includes(section.id) ? 60 : '1.5rem',
                  }}
                >
                    <p
                      style={{
                      fontFamily: 'Arial, sans-serif',
                      fontWeight: 800,
                      fontSize: section.id === 'final-solution' ? (isMobile ? 32 : 56) : isMobile ? 28 : 40,
                      lineHeight: 1,
                      margin: 0,
                      marginBottom: section.id === 'final-solution' ? (isMobile ? 40 : 100) : 0,
                      flexShrink: 0,
                      width: !isNarrow && !['the-goal', 'research', 'design', 'user-interview', 'final-solution'].includes(section.id) ? 200 : undefined,
                      }}
                    >
                      {section.label}
                    </p>

                      {'subSections' in section && section.subSections ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 40, flex: 1 }}>
                      {(
                        section.subSections as {
                          heading?: React.ReactNode
                          body?: string
                          bodyStyle?: React.CSSProperties
                          media?: string
                          subsectionKey?: string
                          postContent?: {
                            heading?: React.ReactNode
                            body?: string
                            media?: string | string[]
                            carousel?: string[]
                          }[]
                          carousel?: string[]
                        }[]
                      ).map((sub, si) => (
                        <div
                          key={sub.subsectionKey ?? `${section.id}-sub-${si}`}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 16,
                            ...(section.id === 'problems' && si === 2 ? { marginBottom: 30 } : {}),
                          }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {sub.heading && <p style={{ fontWeight: 700, fontSize: 20, lineHeight: '22px', margin: 0 }}>{sub.heading}</p>}
                            {'headingMedia' in sub &&
                              (sub as { headingMedia?: string }).headingMedia &&
                              String((sub as { headingMedia: string }).headingMedia).length > 0 && (
                                <div
                                  style={jojoFinalSolutionVideoGapStyle(
                                    section.id,
                                    (sub as { headingMedia: string }).headingMedia,
                                  )}
                                >
                                  <MediaBlock
                                    src={(sub as { headingMedia: string }).headingMedia}
                                    onMediaClick={setSelectedMedia}
                                    playbackRate={
                                      'headingMediaPlaybackRate' in sub
                                        ? (sub as { headingMediaPlaybackRate?: number }).headingMediaPlaybackRate
                                        : undefined
                                    }
                                  />
                                </div>
                              )}
                            {'subheading' in sub && sub.subheading != null && (
                              <p
                                style={{
                                  fontWeight: 700,
                                  fontSize: 16,
                                  margin: 0,
                                  ...(sub.heading ? { marginTop: -10 } : {}),
                                }}
                              >
                                {String(sub.subheading)}
                              </p>
                            )}
                            {'bodyGroups' in sub &&
                            Array.isArray((sub as { bodyGroups?: { title: string; body: string }[] }).bodyGroups) &&
                            (sub as { bodyGroups?: { title: string; body: string }[] }).bodyGroups &&
                            (sub as { bodyGroups: { title: string; body: string }[] }).bodyGroups.length > 0 ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                                {(sub as { bodyGroups: { title: string; body: string }[] }).bodyGroups.map((g, gi) => (
                                  <div key={gi} style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: 0 }}>
                                    <p
                                      style={{
                                        fontWeight: 700,
                                        margin: 0,
                                        ...('bodyStyle' in sub ? (sub.bodyStyle as React.CSSProperties) : {}),
                                      }}
                                    >
                                      {g.title}
                                    </p>
                                    <p
                                      style={{
                                        fontWeight: 400,
                                        margin: 0,
                                        ...('bodyStyle' in sub ? (sub.bodyStyle as React.CSSProperties) : {}),
                                      }}
                                    >
                                      {g.body}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              sub.body &&
                              sub.body.split('\n\n').map((para, pi) => {
                                const boldIdx =
                                  'bodyBoldParagraphIndices' in sub &&
                                  Array.isArray((sub as { bodyBoldParagraphIndices?: number[] }).bodyBoldParagraphIndices) &&
                                  (sub as { bodyBoldParagraphIndices?: number[] }).bodyBoldParagraphIndices?.includes(pi)
                                return (
                                  <p
                                    key={pi}
                                    style={{
                                      fontWeight: boldIdx ? 700 : 400,
                                      margin: 0,
                                      ...('bodyStyle' in sub ? (sub.bodyStyle as React.CSSProperties) : {}),
                                    }}
                                  >
                                    {para}
                                  </p>
                                )
                              })
                            )}
                          </div>
                          {sub.media ? (
                            <div style={jojoFinalSolutionVideoGapStyle(section.id, sub.media)}>
                              <MediaBlock
                                src={sub.media}
                                onMediaClick={setSelectedMedia}
                                playbackRate={'mediaPlaybackRate' in sub ? (sub.mediaPlaybackRate as number) : undefined}
                              />
                            </div>
                          ) : null}
                          {'postContent' in sub &&
                            (sub.postContent as {
                              heading?: React.ReactNode
                              body?: string
                              media?: string | string[]
                              carousel?: string[]
                            }[]).map((pc, pi) => (
                                <React.Fragment key={pi}>
                                {pc.heading && (
                                  <p
                                    style={{
                                      fontWeight: 700,
                                      fontSize: 20,
                                      lineHeight: '22px',
                                      margin: 0,
                                      marginTop:
                                        section.id === 'final-solution' ? (pi === 0 ? 0 : 30) : 40,
                                    }}
                                  >
                                    {pc.heading}
                                  </p>
                                )}
                                {pc.body &&
                                  pc.body.split('\n\n').map((para, ri) => (
                                    <p key={ri} style={{ fontWeight: 400, margin: 0 }}>
                                      {para}
                                    </p>
                                  ))}
                                {jojoPostContentMediaSrcs(pc.media as string | string[] | undefined).map((src) => (
                                  <div key={src} style={jojoFinalSolutionVideoGapStyle(section.id, src)}>
                                    <MediaBlock src={src} onMediaClick={setSelectedMedia} />
                                  </div>
                                ))}
                                {'carousel' in pc && (pc as { carousel?: string[] }).carousel && (
                                  <PiikCaseStudyCarouselBlock
                                    srcs={(pc as { carousel: string[] }).carousel}
                                    onMediaClick={setSelectedMedia}
                                    fullWidthSlides={jojoCarouselFullWidth(section.id)}
                                    fullWidthImageScale={jojoCarouselImageScale(section.id)}
                                    fullWidthSlideGap={jojoCarouselSlideGap(section.id)}
                                    fullWidthEdgeAlign={jojoCarouselEdgeAlign(section.id)}
                                    fullWidthTwoUp={jojoCarouselTwoUp(section.id)}
                                  />
                                )}
                                </React.Fragment>
                              ))}
                          {'carousel' in sub &&
                            Array.isArray((sub as { carousel?: string[] }).carousel) &&
                            (sub as { carousel: string[] }).carousel.length > 0 && (
                              <div
                                className={
                                  section.id === 'final-solution' ? 'mt-6 w-full' : 'w-full'
                                }
                              >
                                <PiikCaseStudyCarouselBlock
                                  srcs={(sub as { carousel: string[] }).carousel}
                                  onMediaClick={setSelectedMedia}
                                  fullWidthSlides={jojoCarouselFullWidth(section.id)}
                                  fullWidthImageScale={jojoCarouselImageScale(section.id)}
                                  fullWidthSlideGap={jojoCarouselSlideGap(section.id)}
                                  fullWidthEdgeAlign={jojoCarouselEdgeAlign(section.id)}
                                  fullWidthTwoUp={jojoCarouselTwoUp(section.id)}
                                />
                              </div>
                            )}
                            </div>
                          ))}
                        </div>
                      ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                      {section.heading && <p style={{ fontWeight: 700, fontSize: 20, lineHeight: '22px', margin: 0 }}>{section.heading}</p>}
                      {section.body
                        ? section.body.split('\n\n').map((para, pi) => (
                            <p
                              key={pi}
                              style={{
                                fontWeight:
                                  (section.id === 'research' || section.id === 'the-goal' || section.id === 'design') &&
                                  pi === 0
                                    ? 700
                                    : 400,
                                margin: 0,
                                ...((section.id === 'research' || section.id === 'the-goal' || section.id === 'design') &&
                                pi === 0
                                  ? {
                                      fontFamily: "'Instrument Serif', serif",
                                      fontSize: 18,
                                      lineHeight: 1.2,
                                    }
                                  : {}),
                              }}
                            >
                              {para}
                            </p>
                          ))
                        : null}
                      {Array.isArray(section.media)
                        ? section.media.map((m) => <MediaBlock key={m || 'm'} src={m || ''} onMediaClick={setSelectedMedia} />)
                        : typeof section.media === 'string' && section.media ? (
                            <MediaBlock src={section.media} onMediaClick={setSelectedMedia} />
                          ) : null}
                      {(() => {
                        const c = (section as { carousel?: string[] }).carousel
                        return Array.isArray(c) ? (
                          <PiikCaseStudyCarouselBlock
                            srcs={c}
                            onMediaClick={setSelectedMedia}
                            fullWidthSlides={jojoCarouselFullWidth(section.id)}
                            fullWidthImageScale={jojoCarouselImageScale(section.id)}
                            fullWidthSlideGap={jojoCarouselSlideGap(section.id)}
                            fullWidthEdgeAlign={jojoCarouselEdgeAlign(section.id)}
                            fullWidthTwoUp={jojoCarouselTwoUp(section.id)}
                          />
                        ) : null
                      })()}
                      {'postContent' in section &&
                        section.postContent &&
                        (section.postContent as {
                          heading?: React.ReactNode
                          body?: string
                          media?: string | string[]
                          carousel?: string[]
                          redParagraphIndices?: number[]
                        }[]).map((pc, pi) => (
                          <React.Fragment key={pi}>
                            {pc.heading && (
                              <p
                                style={{
                                  fontWeight: 700,
                                  fontSize: 20,
                                  lineHeight: '22px',
                                  margin: 0,
                                  marginTop: section.id === 'user-interview' && pi === 0 ? 0 : 24,
                                }}
                              >
                                {pc.heading}
                              </p>
                            )}
                            {pc.body &&
                              pc.body.split('\n\n').map((para, ri) => (
                                <p
                                  key={ri}
                                  style={{
                                    fontWeight:
                                      section.id === 'research' && jojoResearchPostContentInstrumentSerif(pi, ri) ? 700 : 400,
                                    margin: 0,
                                    ...(section.id === 'research' && jojoResearchPostContentInstrumentSerif(pi, ri)
                                      ? {
                                          fontFamily: "'Instrument Serif', serif",
                                          fontSize: 18,
                                          lineHeight: 1.2,
                                        }
                                      : {}),
                                    ...(jojoPostContentParagraphRed(pc, ri)
                                      ? { color: 'red', fontWeight: 700 }
                                      : {}),
                                  }}
                                >
                                  {para}
                                </p>
                              ))}
                            {jojoPostContentMediaSrcs(pc.media as string | string[] | undefined).map((src) => (
                              <div key={src} style={jojoFinalSolutionVideoGapStyle(section.id, src)}>
                                <MediaBlock src={src} onMediaClick={setSelectedMedia} />
                              </div>
                            ))}
                            {'carousel' in pc && (pc as { carousel?: string[] }).carousel && (
                              <PiikCaseStudyCarouselBlock
                                srcs={(pc as { carousel: string[] }).carousel}
                                onMediaClick={setSelectedMedia}
                                fullWidthSlides={jojoCarouselFullWidth(section.id)}
                                fullWidthImageScale={jojoCarouselImageScale(section.id)}
                                fullWidthSlideGap={jojoCarouselSlideGap(section.id)}
                                fullWidthEdgeAlign={jojoCarouselEdgeAlign(section.id)}
                                fullWidthTwoUp={jojoCarouselTwoUp(section.id)}
                              />
                            )}
                          </React.Fragment>
                        ))}
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <div
        ref={scrollSpyRef}
        className="fixed top-1/2 flex -translate-y-1/2 flex-col items-end gap-3 not-italic"
        style={{
          display: isMobile ? 'none' : undefined,
          right: spyRight,
          fontSize: 14,
          lineHeight: '16px',
          fontFamily: 'Arial, sans-serif',
          zIndex: 10,
          color: isDark ? '#FFFFFF' : '#000000',
          transition: 'color 0.6s cubic-bezier(0.44,0,0.3,0.99)',
        }}
      >
        {JOJO_SECTIONS.map((s, i) => (
          <span
            key={s.id}
            role="button"
            tabIndex={0}
            onClick={() => scrollToSection(i + 1)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                scrollToSection(i + 1)
              }
            }}
            style={{ whiteSpace: 'nowrap' }}
            className={`cursor-pointer select-none hover:font-bold ${i + 1 === activeSection ? 'font-bold' : 'font-normal'}`}
          >
            {'spyLabel' in s && s.spyLabel != null ? String(s.spyLabel) : s.label}
          </span>
        ))}
      </div>

      {selectedMedia && <Lightbox src={selectedMedia} onClose={() => setSelectedMedia(null)} />}
    </>
  )
}

// ── Home (/) third column — same case study layout as HomePiikCaseStudy ────────

export function HomeJojoCaseStudy({
  isDark,
  isMobile,
  sectionRefs,
  onMediaClick,
  testHomeProjectTitles,
  testHomeHighlightSectionId,
}: {
  isDark: boolean
  isMobile: boolean
  sectionRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
  onMediaClick: (src: string) => void
  testHomeProjectTitles?: boolean
  testHomeHighlightSectionId?: string | null
}) {
  const fg = isDark ? '#FFFFFF' : '#000000'
  const { rootRef, railGapPx } = useCaseStudyHomeRailGap()
  const heroMetaLabelClass = testHomeProjectTitles
    ? `text-[18px] ${TEST_HOME_HERO_META_LABEL_SERIF}`
    : JOJO_HOME_META_LABEL_CLASS
  const homeSectionContentHeadingClass = testHomeProjectTitles
    ? TEST_HOME_SECTION_CONTENT_HEADING_SERIF
    : JOJO_HOME_SECTION_LABEL_CLASS

  return (
    <div ref={rootRef} className="flex w-full min-w-0 flex-col pb-8" style={{ fontFamily: 'Arial, sans-serif', color: fg }}>
      <div className="mb-[150px] w-full">
        <OptimizedImage
          key={isDark ? 'jojo-thumb-dark' : 'jojo-thumb-light'}
          src={isDark ? JOJO_HERO_THUMB_DARK : JOJO_HERO_THUMB_LIGHT}
          alt="JoJo"
          className="mb-[30px] block h-auto w-full max-w-full rounded-none"
          sizes={IMAGE_SIZES.caseStudyFull}
          priority
          placeholder="blur"
        />
        <h1
          className={
            testHomeProjectTitles
              ? `mb-2 mt-0 text-[38px] ${TEST_HOME_PROJECT_TITLE_SERIF}`
              : "mb-2 mt-0 text-[38px] font-bold italic leading-none font-['Instrument_Serif',serif]"
          }
        >
          JoJo
        </h1>
        <p className={`mb-[26px] ${JOJO_HOME_INSTRUMENT} text-[20px] font-bold italic leading-tight`}>Think Beyond AI</p>
        <div className="flex w-full flex-col gap-y-2">
          <div className="flex w-full items-center gap-x-[20px]">
            <span className={`shrink-0 whitespace-nowrap ${heroMetaLabelClass}`}>{JOJO_META_ROWS[0].label}</span>
            <span className={`min-w-0 flex-1 ${JOJO_HOME_META_BODY_CLASS}`}>{JOJO_META_ROWS[0].value}</span>
          </div>
          <div className="h-[10px] shrink-0" aria-hidden />
          <div className="grid w-full grid-cols-[auto_1fr] items-start gap-x-[20px] gap-y-2">
            {JOJO_META_ROWS.slice(1).map(({ label, value }) => (
              <Fragment key={label}>
                <span className={`whitespace-nowrap ${heroMetaLabelClass}`}>{label}</span>
                <span className={`min-w-0 ${JOJO_HOME_META_BODY_CLASS}`}>{value}</span>
              </Fragment>
            ))}
          </div>
          <div className="relative mt-6 aspect-video w-full max-w-full overflow-hidden rounded-none">
            <iframe
              src="https://www.youtube.com/embed/AbZmZJe7ve0?mute=0&autoplay=1&loop=1&playlist=AbZmZJe7ve0&playsinline=1"
              title="JoJo project video"
              className="absolute left-0 top-0 h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <OptimizedImage
            src="/jojo/timeline.jpg"
            alt=""
            className="mt-6 block h-auto w-full max-w-full cursor-zoom-in rounded-none"
            sizes={IMAGE_SIZES.caseStudyFull}
            placeholder="blur"
            onClick={() => onMediaClick('/jojo/timeline.jpg')}
          />
        </div>
      </div>

      {JOJO_SECTIONS.map((section, i) => {
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
                  ? `shrink-0 whitespace-nowrap text-[18px] ${TEST_HOME_PROJECT_TITLE_SERIF} ${isMobile ? 'w-full' : 'w-[130px]'}`
                  : `shrink-0 whitespace-nowrap italic ${JOJO_HOME_SECTION_LABEL_CLASS} ${isMobile ? 'w-full' : 'w-[130px]'}`
              }
            >
              {jojoSectionNavLabel(section)}
            </CaseStudyRailTitle>

            <div
              className={`flex min-w-0 w-full flex-col gap-4 ${JOJO_HOME_SECTION_BODY_CLASS}`}
              style={{ width: isMobile ? '100%' : undefined }}
            >
              {'subSections' in section && section.subSections ? (
                <div className="flex flex-col gap-10">
                  {(
                    section.subSections as {
                      subsectionKey?: string
                      heading?: React.ReactNode
                      body?: string
                      subheading?: string
                      bodyStyle?: React.CSSProperties
                      /** Paragraph indices (after `\\n\\n` split) to render bold */
                      bodyBoldParagraphIndices?: number[]
                      /** Pairs of bold title + body; when set, used instead of `body` split */
                      bodyGroups?: { title: string; body: string }[]
                      media?: string
                      /** Shown directly under subsection heading (e.g. looped video). */
                      headingMedia?: string
                      headingMediaPlaybackRate?: number
                      mediaPlaybackRate?: number
                      phoneCarousel?: { srcs: string[]; captions: { title: string; body: string }[] }
                      postContent?: {
                        heading?: React.ReactNode
                        body?: string
                        media?: string | string[]
                        carousel?: string[]
                      }[]
                      carousel?: string[]
                    }[]
                  ).map((sub, si) => (
                    <div
                      key={sub.subsectionKey ?? `${section.id}-sub-${si}`}
                      className={`flex flex-col gap-4 ${
                        (section.id === 'final-solution' ? si === 2 : si === 2 && section.id !== 'problems') ? 'mt-10' : ''
                      } ${section.id === 'problems' && si === 2 ? 'mb-[30px]' : ''}`.trim()}
                    >
                      <div className="flex flex-col gap-2">
                        {sub.heading && <p className={homeSectionContentHeadingClass}>{sub.heading}</p>}
                        {'headingMedia' in sub &&
                          (sub as { headingMedia?: string }).headingMedia &&
                          String((sub as { headingMedia: string }).headingMedia).length > 0 && (
                            <div
                              className={jojoFinalSolutionVideoGapClass(
                                section.id,
                                (sub as { headingMedia: string }).headingMedia,
                              )}
                            >
                              <PiikCaseStudyMediaBlock
                                src={(sub as { headingMedia: string }).headingMedia}
                                onMediaClick={onMediaClick}
                                playbackRate={
                                  'headingMediaPlaybackRate' in sub
                                    ? (sub as { headingMediaPlaybackRate?: number }).headingMediaPlaybackRate
                                    : undefined
                                }
                              />
                            </div>
                          )}
                        {sub.subheading != null && sub.subheading !== '' && (
                          <p className={`${homeSectionContentHeadingClass}${sub.heading ? ' -mt-[10px]' : ''}`}>{sub.subheading}</p>
                        )}
                        {sub.bodyGroups && sub.bodyGroups.length > 0 ? (
                          <div className="flex flex-col gap-8">
                            {sub.bodyGroups.map((g, gi) => (
                              <div key={gi} className="flex flex-col gap-1.5">
                                <p
                                  className={testHomeProjectTitles ? homeSectionContentHeadingClass : undefined}
                                  style={{
                                    ...(sub.bodyStyle ?? {}),
                                    ...(!testHomeProjectTitles ? { fontWeight: 700 } : {}),
                                  }}
                                >
                                  {g.title}
                                </p>
                                <p style={{ ...(sub.bodyStyle ?? {}), fontWeight: 400 }}>{g.body}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          sub.body &&
                          sub.body.split('\n\n').map((para, pi) => {
                            const boldIdx =
                              'bodyBoldParagraphIndices' in sub &&
                              Array.isArray(sub.bodyBoldParagraphIndices) &&
                              sub.bodyBoldParagraphIndices.includes(pi)
                            return (
                              <p
                                key={pi}
                                style={{
                                  ...(sub.bodyStyle ?? {}),
                                  ...(boldIdx ? { fontWeight: 700 } : {}),
                                }}
                              >
                                {para}
                              </p>
                            )
                          })
                        )}
                      </div>
                      {sub.media && (
                        <div className={jojoFinalSolutionVideoGapClass(section.id, sub.media)}>
                          <PiikCaseStudyMediaBlock
                            src={sub.media}
                            onMediaClick={onMediaClick}
                            playbackRate={sub.mediaPlaybackRate}
                          />
                        </div>
                      )}
                      {sub.phoneCarousel ? (
                        <PiikCaseStudyPhoneCarousel
                          srcs={sub.phoneCarousel.srcs}
                          captions={sub.phoneCarousel.captions}
                          onMediaClick={onMediaClick}
                        />
                      ) : null}
                      {sub.postContent?.map((pc, pi) => (
                        <Fragment key={pi}>
                          {pc.heading && (
                            <p
                              className={
                                section.id === 'final-solution'
                                  ? [pi === 0 ? '' : 'mt-[30px]', homeSectionContentHeadingClass].filter(Boolean).join(' ')
                                  : `mt-20 ${homeSectionContentHeadingClass}`
                              }
                            >
                              {pc.heading}
                            </p>
                          )}
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
                          {jojoPostContentMediaSrcs(pc.media as string | string[] | undefined).map((src) => (
                            <div key={src} className={jojoFinalSolutionVideoGapClass(section.id, src)}>
                              <PiikCaseStudyMediaBlock src={src} onMediaClick={onMediaClick} />
                            </div>
                          ))}
                          {'carousel' in pc && (pc as { carousel?: string[] }).carousel && (
                            <PiikCaseStudyCarouselBlock
                              srcs={(pc as { carousel: string[] }).carousel}
                              onMediaClick={onMediaClick}
                              fullWidthSlides={jojoCarouselFullWidth(section.id)}
                              fullWidthImageScale={jojoCarouselImageScale(section.id)}
                              fullWidthSlideGap={jojoCarouselSlideGap(section.id)}
                              fullWidthEdgeAlign={jojoCarouselEdgeAlign(section.id)}
                              fullWidthTwoUp={jojoCarouselTwoUp(section.id)}
                            />
                          )}
                        </Fragment>
                      ))}
                      {'carousel' in sub &&
                        Array.isArray((sub as { carousel?: string[] }).carousel) &&
                        (sub as { carousel: string[] }).carousel.length > 0 && (
                          <div className={section.id === 'final-solution' ? 'mt-6 w-full' : 'w-full'}>
                            <PiikCaseStudyCarouselBlock
                              srcs={(sub as { carousel: string[] }).carousel}
                              onMediaClick={onMediaClick}
                              fullWidthSlides={jojoCarouselFullWidth(section.id)}
                              fullWidthImageScale={jojoCarouselImageScale(section.id)}
                              fullWidthSlideGap={jojoCarouselSlideGap(section.id)}
                              fullWidthEdgeAlign={jojoCarouselEdgeAlign(section.id)}
                              fullWidthTwoUp={jojoCarouselTwoUp(section.id)}
                            />
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {section.heading && <p className={homeSectionContentHeadingClass}>{section.heading}</p>}
                  {section.body
                    ? section.body.split('\n\n').map((para, idx) => (
                        <p
                          key={idx}
                          className={
                            [
                              section.heading && idx === 0 ? '-mt-[10px]' : '',
                              (section.id === 'research' || section.id === 'the-goal' || section.id === 'design') &&
                              idx === 0
                                ? homeSectionContentHeadingClass
                                : '',
                            ]
                              .filter(Boolean)
                              .join(' ') || undefined
                          }
                        >
                          {para}
                        </p>
                      ))
                    : null}
                  {Array.isArray(section.media)
                    ? section.media.map((m) => <PiikCaseStudyMediaBlock key={m} src={m} onMediaClick={onMediaClick} />)
                    : section.media && <PiikCaseStudyMediaBlock src={section.media} onMediaClick={onMediaClick} />}
                  {'carousel' in section && section.carousel && (
                    <PiikCaseStudyCarouselBlock
                      srcs={section.carousel as string[]}
                      onMediaClick={onMediaClick}
                      fullWidthSlides={jojoCarouselFullWidth(section.id)}
                      fullWidthImageScale={jojoCarouselImageScale(section.id)}
                      fullWidthSlideGap={jojoCarouselSlideGap(section.id)}
                      fullWidthEdgeAlign={jojoCarouselEdgeAlign(section.id)}
                      fullWidthTwoUp={jojoCarouselTwoUp(section.id)}
                    />
                  )}
                  {'postContent' in section &&
                    section.postContent &&
                    (section.postContent as {
                      heading?: React.ReactNode
                      body?: string
                      media?: string | string[]
                      carousel?: string[]
                      redParagraphIndices?: number[]
                    }[]).map((pc, pi) => (
                      <Fragment key={pi}>
                        {pc.heading && (
                          <p
                            className={`${
                              section.id === 'user-interview' && pi === 0 ? '' : 'mt-20'
                            } ${homeSectionContentHeadingClass}`.trim()}
                          >
                            {pc.heading}
                          </p>
                        )}
                        {pc.body &&
                          pc.body.split('\n\n').map((para, ri) => (
                            <p
                              key={ri}
                              className={
                                [
                                  !pc.heading && ri === 0 ? 'mt-10' : '',
                                  pc.heading && ri === 0 ? '-mt-[10px]' : '',
                                  section.id === 'research' && jojoResearchPostContentInstrumentSerif(pi, ri)
                                    ? homeSectionContentHeadingClass
                                    : '',
                                ]
                                  .filter(Boolean)
                                  .join(' ') || undefined
                              }
                              style={
                                jojoPostContentParagraphRed(pc, ri)
                                  ? { color: 'red', fontWeight: 700 }
                                  : undefined
                              }
                            >
                              {para}
                            </p>
                          ))}
                        {jojoPostContentMediaSrcs(pc.media as string | string[] | undefined).map((src) => (
                          <div key={src} className={jojoFinalSolutionVideoGapClass(section.id, src)}>
                            <PiikCaseStudyMediaBlock src={src} onMediaClick={onMediaClick} />
                          </div>
                        ))}
                        {'carousel' in pc && (pc as { carousel?: string[] }).carousel && (
                          <PiikCaseStudyCarouselBlock
                            srcs={(pc as { carousel: string[] }).carousel}
                            onMediaClick={onMediaClick}
                            fullWidthSlides={jojoCarouselFullWidth(section.id)}
                            fullWidthImageScale={jojoCarouselImageScale(section.id)}
                            fullWidthSlideGap={jojoCarouselSlideGap(section.id)}
                            fullWidthEdgeAlign={jojoCarouselEdgeAlign(section.id)}
                            fullWidthTwoUp={jojoCarouselTwoUp(section.id)}
                          />
                        )}
                        </Fragment>
                      ))}
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
