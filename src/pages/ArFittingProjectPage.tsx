import React, { Fragment, useState, useEffect, useRef } from 'react'
import { CaseStudyRailTitle } from '../components/CaseStudyRailTitle'
import { useCaseStudyHomeRailGap } from '../hooks/useCaseStudyHomeRailGap'
import { useIsNarrow } from '../hooks/useIsNarrow'
import { motion, useScroll, useTransform } from 'framer-motion'
import { usePageTheme } from '../context/PageThemeContext'
import { IMAGE_SIZES, OptimizedImage } from '../components/OptimizedImage'
import { Lightbox } from './HovrProjectPage'
import {
  AR_FITTING_SECTIONS,
  AR_FITTING_META_ROWS,
  AR_FITTING_THUMB_LIGHT,
  AR_FITTING_THUMB_DARK,
} from './arFittingHomeData'

/** Match `HomePage` third-column case study typography (same as Piik). */
const AR_HOME_INSTRUMENT = "font-['Instrument_Serif',serif]"
const AR_HOME_META_LABEL_CLASS = `${AR_HOME_INSTRUMENT} text-[16px] leading-tight font-bold`
const AR_HOME_META_BODY_CLASS = 'font-mono text-[12px] font-medium leading-[1.2]'
const AR_HOME_SECTION_LABEL_CLASS = `${AR_HOME_INSTRUMENT} text-[18px] leading-tight font-bold`
const AR_HOME_SECTION_BODY_CLASS = "font-['Arial',sans-serif] text-[14px] font-normal leading-[1.2]"

// ── Media block ────────────────────────────────────────────────────────────────

export function PiikCaseStudyMediaBlock({ src, onMediaClick, playbackRate }: { src: string; onMediaClick?: (src: string) => void; playbackRate?: number }) {
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
          onLoadedMetadata={(e) => { if (playbackRate) (e.target as HTMLVideoElement).playbackRate = playbackRate }}
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
          quality={85}
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

export function PiikCaseStudyCarouselBlock({ srcs, onMediaClick }: { srcs: string[]; onMediaClick?: (src: string) => void }) {
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
        {srcs.map((src, ci) =>
          src ? (
            <OptimizedImage
              key={src + ci}
              src={src}
              alt=""
              className="cursor-zoom-in flex-shrink-0"
              style={{ width: '80%', height: 'auto', borderRadius: 0 }}
              sizes={IMAGE_SIZES.carouselSlide80}
              placeholder="blur"
              quality={85}
              priority={ci === 0}
              onClick={() => onMediaClick?.(src)}
            />
          ) : (
            <div
              key={`ph-${ci}`}
              className="flex flex-shrink-0 items-center justify-center border border-black/10 bg-neutral-200/80 text-[12px] text-black/45"
              style={{ width: '80%', minHeight: 220, borderRadius: 0 }}
            >
              Image placeholder
            </div>
          ),
        )}
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

/** Captions for `phoneCarousel` clips (title shown under each phone; body used in data / a11y if extended). */
interface PhoneCaption { title: string; body: string }

export function PiikCaseStudyPhoneCarousel({ srcs, captions, onMediaClick }: { srcs: string[]; captions: PhoneCaption[]; onMediaClick?: (src: string) => void }) {
  const [index, setIndex] = useState(0)
  const maxIndex = Math.max(0, srcs.length - 2)
  const isLast = index === maxIndex
  const translateX = isLast
    ? `calc(-${srcs.length * 40 - 100}% - ${(srcs.length - 1) * 16}px)`
    : `calc(-${index * 40}% - ${index * 16}px)`
  const arrowStyle: React.CSSProperties = {
    position: 'absolute', top: '20%', transform: 'translateY(-50%)',
    background: 'rgba(0,0,0,0.4)', border: 'none', borderRadius: '50%',
    width: 32, height: 32, cursor: 'pointer', fontSize: 16, display: 'flex',
    alignItems: 'center', justifyContent: 'center', color: '#fff', zIndex: 1,
  }
  return (
    <div style={{ position: 'relative', overflow: 'hidden', marginBottom: 100 }}>
      <div style={{ display: 'flex', gap: 16, transition: 'transform 0.4s ease', transform: `translateX(${translateX})` }}>
        {srcs.map((src, i) => (
          <div key={src} className="flex-shrink-0" style={{ width: '40%', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div
              style={{ aspectRatio: '3/4', background: '#fff', borderRadius: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'zoom-in' }}
              onClick={() => onMediaClick?.(src)}
            >
              <video src={src} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            {captions[i] && (
              <p style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 12, margin: 0, textAlign: 'left' }}>{captions[i].title}</p>
            )}
          </div>
        ))}
      </div>
      {index > 0 && <button onClick={() => setIndex(index - 1)} style={{ ...arrowStyle, left: 8 }}>‹</button>}
      {index < maxIndex && <button onClick={() => setIndex(index + 1)} style={{ ...arrowStyle, right: 8 }}>›</button>}
    </div>
  )
}

// ── Home (/) third column — same case study content as ArFittingProjectPage ─────────

function arSectionNavLabel(s: (typeof AR_FITTING_SECTIONS)[number]): string {
  return 'spyLabel' in s && s.spyLabel != null ? String(s.spyLabel) : s.label
}

export function HomeArFittingCaseStudy({
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
      <div className="mb-[150px] w-full">
        <OptimizedImage
          key={isDark ? 'ar-thumb-dark' : 'ar-thumb-light'}
          src={isDark ? AR_FITTING_THUMB_DARK : AR_FITTING_THUMB_LIGHT}
          alt="AR Fitting Room"
          className="mb-[30px] block h-auto w-full max-w-full rounded-none"
          sizes={IMAGE_SIZES.caseStudyFull}
          priority
          placeholder="blur"
          quality={85}
        />
        <h1 className="mb-[10px] mt-0 text-[38px] font-bold italic leading-none font-['Instrument_Serif',serif]">
          AR Fitting Room
        </h1>
        <p className={`mb-[26px] mt-0 ${AR_HOME_META_BODY_CLASS}`}>Product Design · Accessibility Design</p>
        <div className="flex w-full flex-col gap-y-2">
          <div className="flex w-full items-center gap-x-[20px]">
            <span className={`shrink-0 whitespace-nowrap ${AR_HOME_META_LABEL_CLASS}`}>{AR_FITTING_META_ROWS[0].label}</span>
            <span className={`min-w-0 flex-1 ${AR_HOME_META_BODY_CLASS}`}>{AR_FITTING_META_ROWS[0].value}</span>
          </div>
          <div className="h-[10px] shrink-0" aria-hidden />
          <div className="grid w-full grid-cols-[auto_1fr] items-start gap-x-[20px] gap-y-2">
            {AR_FITTING_META_ROWS.slice(1).map(({ label, value }) => (
              <Fragment key={label}>
                <span className={`whitespace-nowrap ${AR_HOME_META_LABEL_CLASS}`}>{label}</span>
                <span className={`min-w-0 ${AR_HOME_META_BODY_CLASS}`}>{value}</span>
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      {AR_FITTING_SECTIONS.map((section, i) => (
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
              className={`shrink-0 whitespace-nowrap italic ${AR_HOME_SECTION_LABEL_CLASS} ${isMobile ? 'w-full' : 'w-[130px]'}`}
            >
              {arSectionNavLabel(section)}
            </CaseStudyRailTitle>

            <div
              className={`flex min-w-0 w-full flex-col gap-4 ${AR_HOME_SECTION_BODY_CLASS}`}
              style={{ width: isMobile ? '100%' : undefined }}
            >
              {'subSections' in section && section.subSections ? (
                <div className="flex flex-col gap-10">
                  {(
                    section.subSections as {
                      heading?: React.ReactNode
                      body?: string
                      subheading?: string
                      bodyStyle?: React.CSSProperties
                      media?: string
                      mediaPlaybackRate?: number
                      phoneCarousel?: { srcs: string[]; captions: PhoneCaption[] }
                      postContent?: { heading?: React.ReactNode; body?: string; media?: string }[]
                    }[]
                  ).map((sub, si) => (
                    <div key={si} className={`flex flex-col gap-4 ${si === 2 && section.id !== 'user-testings' ? 'mt-10' : ''}`}>
                      {sub.heading && <p className={AR_HOME_SECTION_LABEL_CLASS}>{sub.heading}</p>}
                      {sub.subheading != null && sub.subheading !== '' && (
                        <p
                          className={`${AR_HOME_SECTION_LABEL_CLASS}${sub.heading ? ' -mt-[10px]' : ''}`}
                        >
                          {sub.subheading}
                        </p>
                      )}
                      {sub.body &&
                        sub.body.split('\n\n').map((para, pi) => (
                          <p
                            key={pi}
                            className={
                              (sub.heading || (sub.subheading != null && sub.subheading !== '')) && pi === 0
                                ? '-mt-[10px]'
                                : undefined
                            }
                            style={sub.bodyStyle}
                          >
                            {para}
                          </p>
                        ))}
                      {sub.media && (
                        <PiikCaseStudyMediaBlock
                          src={sub.media}
                          onMediaClick={onMediaClick}
                          playbackRate={sub.mediaPlaybackRate}
                        />
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
                          {pc.heading && <p className={`mt-20 ${AR_HOME_SECTION_LABEL_CLASS}`}>{pc.heading}</p>}
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
                          {pc.media && <PiikCaseStudyMediaBlock src={pc.media} onMediaClick={onMediaClick} />}
                        </Fragment>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {section.heading && <p className={AR_HOME_SECTION_LABEL_CLASS}>{section.heading}</p>}
                  {section.body.split('\n\n').map((para, idx) => (
                    <p key={idx} className={section.heading && idx === 0 ? '-mt-[10px]' : undefined}>
                      {para}
                    </p>
                  ))}
                  {Array.isArray(section.media)
                    ? section.media.map((m) => <PiikCaseStudyMediaBlock key={m} src={m} onMediaClick={onMediaClick} />)
                    : section.media && <PiikCaseStudyMediaBlock src={section.media} onMediaClick={onMediaClick} />}
                </>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// ── AR Fitting Room project page ────────────────────────────────────────────────

export function ArFittingProjectPage() {
  const colRight = 'calc(8.33% + 15px)'
  const isNarrow = useIsNarrow(1200)
  const isMedium = useIsNarrow(1000)
  const isMobile = useIsNarrow(768)

  const [activeSection, setActiveSection] = useState(0)
  const [selectedMedia, setSelectedMedia]     = useState<string | null>(null)
  const [isDark, setIsDarkLocal]              = useState(false)
  const [sectionBgVisible, setSectionBgVisible] = useState(false)
  const [sectionBgColor, setSectionBgColor]     = useState('#C7D0DD')

  const scrollRef    = useRef<HTMLDivElement>(null)
  const heroRef      = useRef<HTMLDivElement>(null)
  const goalRef      = useRef<HTMLDivElement>(null)
  const overviewRef  = useRef<HTMLDivElement>(null)

  const { scrollYProgress: overviewProgress } = useScroll({ container: scrollRef, target: overviewRef, offset: ['start end', 'start start'] })
  const imageOpacity = useTransform(overviewProgress, [0, 1], [1, 0])

  const { scrollYProgress: goalProgress }     = useScroll({ container: scrollRef, target: goalRef, offset: ['start end', 'start center'] })
  const bgColor = useTransform(goalProgress, [0, 1], ['#3D4E6D', '#E8E8E8'])

  // sectionRefs[0] = hero, sectionRefs[1..N] = AR_FITTING_SECTIONS
  const { setIsDark } = usePageTheme()
  const sectionRefs   = useRef<(HTMLDivElement | null)[]>([])
  const scrollSpyRef  = useRef<HTMLDivElement>(null)
  const [spyRight, setSpyRight] = useState<string | number>(window.innerWidth < 1700 ? 16 : colRight)

  // Sync isDark to global context
  useEffect(() => { setIsDark(isDark) }, [isDark, setIsDark])
  useEffect(() => { return () => setIsDark(true) }, [setIsDark])

  // Force body/html transparent so fixed backgrounds show through
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
      const vh            = container.clientHeight
      const scrollTop     = container.scrollTop
      const containerCenter = scrollTop + vh / 2
      const bandTop         = scrollTop + vh * 0.4
      const bandBottom      = scrollTop + vh * 0.6

      let best = 0
      let minDist = Infinity

      // Hero at index 0
      if (heroRef.current) {
        const el = heroRef.current
        const elCenter = el.offsetTop + el.offsetHeight / 2
        const dist = Math.abs(elCenter - containerCenter)
        if (dist < minDist) { minDist = dist; best = 0 }
      }

      sectionRefs.current.forEach((el, i) => {
        if (!el) return
        const elTop    = el.offsetTop
        const elBottom = elTop + el.offsetHeight
        const elCenter = elTop + el.offsetHeight / 2

        if (el.offsetHeight > vh) {
          if (elTop <= bandBottom && elBottom >= bandTop) {
            if (0 < minDist) { minDist = 0; best = i }
          }
        } else {
          const dist = Math.abs(elCenter - containerCenter)
          if (dist < minDist) { minDist = dist; best = i }
        }
      })

      setActiveSection(best)

      // Dark bg + isDark: scroll-position-based to avoid gap flicker
      const overviewEl = sectionRefs.current[1]
      const overviewDark = overviewEl
        ? (() => { const c = overviewEl.offsetTop + overviewEl.offsetHeight / 2; return c >= bandTop && c <= bandBottom })()
        : false
      const problemsEl = sectionRefs.current[3]
      const researchEl = sectionRefs.current[6]
      const finalEl    = sectionRefs.current[9]
      let inDark = false
      if (problemsEl && researchEl && finalEl) {
        const overlayStart = problemsEl.offsetTop - vh * 0.4
        const overlayEnd   = finalEl.offsetTop + finalEl.offsetHeight - vh * 0.4
        const inOverlay    = scrollTop >= overlayStart && scrollTop <= overlayEnd
        setSectionBgVisible(inOverlay)
        if (inOverlay) {
          if (scrollTop >= finalEl.offsetTop - vh * 0.4) setSectionBgColor('#111111')
          else if (scrollTop >= researchEl.offsetTop - vh * 0.4) setSectionBgColor('#1E2E49')
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
    const el        = sectionRefs.current[index]
    const container = scrollRef.current
    if (!el || !container) return
    const vh = container.clientHeight
    // Sections have paddingTop: 30vh on their inner content div.
    // Target: content label lands at bandTop (40%), so scrollTop = el.offsetTop + 0.3vh - 0.4vh
    const targetScrollTop = el.offsetTop - vh * 0.1
    container.scrollTo({ top: targetScrollTop, behavior: 'smooth' })
  }

  return (
    <>
      {/* ── Color background layer (behind image) ────────────────────────────── */}
      <motion.div
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -2, backgroundColor: bgColor }}
      />

      {/* ── Image background layer (fades out on scroll) ──────────────────────── */}
      <motion.div
        style={{
          position:           'fixed',
          top:                0,
          left:               0,
          width:              '100vw',
          height:             '100vh',
          zIndex:             -1,
          backgroundImage:    `url('${isDark ? AR_FITTING_THUMB_DARK : AR_FITTING_THUMB_LIGHT}')`,
          backgroundSize:     'cover',
          backgroundPosition: 'center',
          opacity:            imageOpacity,
        }}
      />

      {/* ── Unified section background overlay (Problems → Research → Final Solution) */}
      <motion.div
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, pointerEvents: 'none' }}
        animate={{ backgroundColor: sectionBgColor, opacity: sectionBgVisible ? 1 : 0 }}
        transition={{ duration: 0.6, ease: [0.44, 0, 0.3, 0.99] }}
      />

      {/* ── Scrollable content ───────────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="absolute overflow-y-auto"
        style={isMobile
          ? { left: 16, right: 16, top: 0, bottom: 0, overflowX: 'hidden', position: 'absolute', zIndex: 1 }
          : isMedium
          ? { left: 100, right: 100, top: 0, bottom: 0, overflowX: 'hidden', position: 'absolute', zIndex: 1 }
          : isNarrow
          ? { left: '50%', transform: 'translateX(-50%)', width: 'min(800px, calc(100% - 80px))', right: 'auto', top: 0, bottom: 0, position: 'absolute', zIndex: 1 }
          : { left: '50%', transform: 'translateX(-50%)', width: 'min(1100px, calc(100% - 80px))', right: 'auto', top: 0, bottom: 0, position: 'absolute', zIndex: 1 }
        }
      >
        <div
          style={{
            paddingTop: 0,
            paddingLeft: isMobile ? 0 : 10,
            paddingRight: isMobile ? 0 : undefined,
            paddingBottom: isMobile ? 'max(6rem, calc(4rem + env(safe-area-inset-bottom, 0px)))' : 0,
            fontFamily: 'Arial, sans-serif',
          }}
        >

          {/* ── Hero section ─────────────────────────────────────────────────── */}
          <div
            ref={heroRef}
            style={{
              minHeight:      '100dvh',
              display:        'flex',
              flexDirection:  'column',
              justifyContent: 'center',
              alignItems:     'flex-start',
              textAlign:      'left',
              padding:        isMobile ? 16 : 40,
            }}
          >
            <h1
              style={{
                fontSize:     isMobile ? 'clamp(1.75rem, 8vw, 2.75rem)' : 100,
                fontWeight:   800,
                lineHeight:   1,
                color:        '#000000',
                marginBottom: 26,
                marginTop:    0,
                fontFamily:   'Arial, sans-serif',
              }}
            >
              AR Fitting Room
            </h1>
            <p
              style={{
                fontFamily: 'Arial, sans-serif',
                fontSize: isMobile ? 14 : 16,
                fontWeight: 700,
                lineHeight: '20px',
                color: '#000000',
                margin: 0,
                marginBottom: 20,
              }}
            >
              Product Design · Accessibility Design
            </p>

            <div
              style={{
                display:             'grid',
                gridTemplateColumns: isMobile ? 'minmax(0,1fr)' : 'auto 1fr',
                columnGap:           isMobile ? 12 : 28,
                rowGap:              isMobile ? 4 : undefined,
                fontSize:            isMobile ? 13 : 14,
                lineHeight:          '20px',
                color:               '#000000',
                alignItems:          'start',
                marginBottom:        32,
                fontFamily:          'Arial, sans-serif',
              }}
            >
              <React.Fragment key={AR_FITTING_META_ROWS[0].label}>
                <span style={{ fontWeight: 700, whiteSpace: isMobile ? 'normal' : 'nowrap', paddingBottom: 8 }}>{AR_FITTING_META_ROWS[0].label}</span>
                <span style={{ fontWeight: 700, paddingBottom: 8, wordBreak: 'break-word' }}>{AR_FITTING_META_ROWS[0].value}</span>
              </React.Fragment>
              <div style={{ paddingTop: 10 }} />
              <div style={{ paddingTop: 10 }} />
              {AR_FITTING_META_ROWS.slice(1).map(({ label, value }, i) => (
                <React.Fragment key={label}>
                  <span style={{ fontWeight: 700, whiteSpace: isMobile ? 'normal' : 'nowrap', paddingBottom: i < AR_FITTING_META_ROWS.length - 2 ? 8 : 0 }}>{label}</span>
                  <span style={{ fontWeight: 700, paddingBottom: i < AR_FITTING_META_ROWS.length - 2 ? 8 : 0, wordBreak: 'break-word' }}>{value}</span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* ── Sections ─────────────────────────────────────────────────────── */}
          {AR_FITTING_SECTIONS.map((section, i) => (
            <motion.div
              key={section.id}
              ref={(el) => { sectionRefs.current[i + 1] = el; if (section.id === 'goal') goalRef.current = el; if (section.id === 'overview') overviewRef.current = el }}
              style={{ marginTop: i === 0 ? '25vh' : 0, marginBottom: i < AR_FITTING_SECTIONS.length - 1 ? '10vh' : 0, transformOrigin: 'top center' }}
              animate={i + 1 === activeSection
                ? { opacity: 1, scale: 1 }
                : { opacity: 0.3, scale: 0.97 }
              }
              transition={{ duration: 0.5, ease: [0.44, 0, 0.3, 0.99] }}
            >
              {section.id === 'overview' ? (
                <motion.div
                  initial={{ opacity: 0, y: 40, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.05, root: scrollRef }}
                  transition={{ duration: 0.8, ease: [0.44, 0, 0.3, 0.99] }}
                  style={{
                    display:       'flex',
                    flexDirection: 'column',
                    alignItems:    'flex-start',
                    textAlign:     'left',
                    paddingTop:    isMobile ? '12vh' : '30vh',
                    paddingBottom: isMobile ? '12vh' : '30vh',
                    color:         isDark ? '#FFFFFF' : '#000000',
                    fontFamily:    'Arial, sans-serif',
                  }}
                >
                  <p style={{ fontFamily: 'Arial, sans-serif', fontWeight: 800, fontSize: isMobile ? 28 : 40, lineHeight: 1, margin: 0, marginBottom: '1.5rem' }}>
                    {section.label}
                  </p>
                  <p style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: isMobile ? 16 : 20, lineHeight: '22px', margin: 0, maxWidth: '800px' }}>
                    {section.heading}
                  </p>
                  {section.body
                    ? section.body.split('\n\n').map((para, oi) => (
                        <p
                          key={oi}
                          style={{
                            fontFamily: 'Arial, sans-serif',
                            fontWeight: 400,
                            fontSize: 16,
                            lineHeight: '22px',
                            margin: 0,
                            marginTop: oi === 0 ? '1.25rem' : '1rem',
                            maxWidth: '800px',
                          }}
                        >
                          {para}
                        </p>
                      ))
                    : null}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 40, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.05, root: scrollRef }}
                  transition={{ duration: 0.8, ease: [0.44, 0, 0.3, 0.99] }}
                  style={{
                    display:       'flex',
                    flexDirection: (!isNarrow && section.id !== 'goal' && section.id !== 'user-testings' && section.id !== 'final-solution') ? 'row' : 'column',
                    alignItems:    'flex-start',
                    textAlign:     'left',
                    paddingTop:    isMobile ? '12vh' : '30vh',
                    paddingBottom:
                      section.id === 'final-solution'
                        ? isMobile
                          ? 'calc(12vh + 120px)'
                          : 'calc(30vh + 200px)'
                        : isMobile
                          ? '12vh'
                          : '30vh',
                    color:         (section.id === 'user-testings' || section.id === 'final-solution') ? '#FFFFFF' : '#000000',
                    fontFamily:    'Arial, sans-serif',
                    gap:           (!isNarrow && section.id !== 'goal' && section.id !== 'user-testings' && section.id !== 'final-solution') ? 60 : '1.5rem',
                  }}
                >
                  <p style={{ fontFamily: 'Arial, sans-serif', fontWeight: 800, fontSize: section.id === 'final-solution' ? (isMobile ? 32 : 56) : isMobile ? 28 : 40, lineHeight: 1, margin: 0, marginBottom: section.id === 'final-solution' ? (isMobile ? 40 : 100) : 0, flexShrink: 0, width: (!isNarrow && section.id !== 'goal' && section.id !== 'user-testings' && section.id !== 'final-solution') ? 200 : undefined }}>
                    {section.label}
                  </p>

                  {'subSections' in section && section.subSections ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 40, flex: 1 }}>
                      {(section.subSections as { heading: React.ReactNode; body: string; media: string }[]).map((sub, si) => (
                        <div key={si} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                          {sub.heading && <p style={{ fontWeight: 700, fontSize: 20, lineHeight: '22px', margin: 0 }}>{sub.heading}</p>}
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
                          {sub.body && sub.body.split('\n\n').map((para, pi) => (
                            <p key={pi} style={{ fontWeight: 400, margin: 0, ...('bodyStyle' in sub ? sub.bodyStyle as React.CSSProperties : {}) }}>{para}</p>
                          ))}
                          {sub.media && <PiikCaseStudyMediaBlock src={sub.media} onMediaClick={setSelectedMedia} playbackRate={'mediaPlaybackRate' in sub ? sub.mediaPlaybackRate as number : undefined} />}
                          {'phoneCarousel' in sub && sub.phoneCarousel ? (
                            <PiikCaseStudyPhoneCarousel
                              srcs={(sub.phoneCarousel as { srcs: string[]; captions: PhoneCaption[] }).srcs}
                              captions={(sub.phoneCarousel as { srcs: string[]; captions: PhoneCaption[] }).captions}
                              onMediaClick={setSelectedMedia}
                            />
                          ) : null}
                          {'postContent' in sub && (sub.postContent as { heading?: React.ReactNode; body?: string; media?: string }[]).map((pc, pi) => (
                            <React.Fragment key={pi}>
                              {pc.heading && <p style={{ fontWeight: 700, fontSize: 20, lineHeight: '22px', margin: 0, marginTop: 40 }}>{pc.heading}</p>}
                              {pc.body && pc.body.split('\n\n').map((para, ri) => (
                                <p key={ri} style={{ fontWeight: 400, margin: 0 }}>{para}</p>
                              ))}
                              {pc.media && <PiikCaseStudyMediaBlock src={pc.media} onMediaClick={setSelectedMedia} />}
                            </React.Fragment>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                      {section.heading && <p style={{ fontWeight: 700, fontSize: 20, lineHeight: '22px', margin: 0 }}>{section.heading}</p>}
                      {section.body.split('\n\n').map((para, pi) => (
                        <p key={pi} style={{ fontWeight: 400, margin: 0 }}>{para}</p>
                      ))}
                      {Array.isArray(section.media)
                        ? section.media.map((m) => <PiikCaseStudyMediaBlock key={m} src={m} onMediaClick={setSelectedMedia} />)
                        : section.media && <PiikCaseStudyMediaBlock src={section.media} onMediaClick={setSelectedMedia} />}
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}

        </div>
      </div>

      {/* ── Right scroll spy ─────────────────────────────────────────────────── */}
      <div
        ref={scrollSpyRef}
        className="fixed top-1/2 -translate-y-1/2 flex flex-col items-end gap-3 not-italic"
        style={{
          display:    isMobile ? 'none' : undefined,
          right:      spyRight,
          fontSize:   14,
          lineHeight: '16px',
          fontFamily: 'Arial, sans-serif',
          zIndex:     10,
          color:      isDark ? '#FFFFFF' : '#000000',
          transition: 'color 0.6s cubic-bezier(0.44,0,0.3,0.99)',
        }}
      >
        {AR_FITTING_SECTIONS.map((s, i) => (
          <span
            key={s.id}
            onClick={() => scrollToSection(i + 1)}
            style={{ whiteSpace: 'nowrap' }}
            className={`cursor-pointer select-none hover:font-bold ${
              i + 1 === activeSection ? 'font-bold' : 'font-normal'
            }`}
          >
            {'spyLabel' in s ? s.spyLabel : s.label}
          </span>
        ))}
      </div>

      {/* ── Lightbox ─────────────────────────────────────────────────────────── */}
      {selectedMedia && <Lightbox src={selectedMedia} onClose={() => setSelectedMedia(null)} />}
    </>
  )
}
