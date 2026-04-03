import React, { useState, useEffect, useRef } from 'react'
import { useIsNarrow } from '../hooks/useIsNarrow'
import { usePageTheme } from '../context/PageThemeContext'
import { motion, AnimatePresence } from 'framer-motion'

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
    media: '/hovr/Research.png',
  },
  {
    id: 'solution-sketch',
    label: 'Solution Sketch',
    heading: 'Split-View Inspection System',
    body: 'Implemented a dual-panel workflow where clicking a card triggers an instant document preview on the right. This side-by-side layout ensures that the support team can validate complex information within a single screen, significantly reducing the number of clicks required for a full driver approval.',
    media: ['/hovr/solution-sketch.png', '/hovr/card-design 1.jpg'],
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
            <img
              src={src}
              alt=""
              className="rounded-none object-contain"
              style={{ maxWidth: '100%', maxHeight: '85vh' }}
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
        <img
          src={src}
          alt=""
          className="w-full h-auto cursor-zoom-in"
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
        {srcs.map((src) => (
          <img
            key={src}
            src={src}
            alt=""
            className="cursor-zoom-in flex-shrink-0"
            style={{ width: '80%', height: 'auto', borderRadius: 0 }}
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

// ── HOVR project page ──────────────────────────────────────────────────────────

export function HovrProjectPage() {
  const { isDark } = usePageTheme()
  const colLeft  = 'calc(25% + 12px)'
  const colRight = 'calc(8.33% + 15px)'
  const isNarrow = useIsNarrow(1200)
  const isMedium = useIsNarrow(1000)
  const isMobile = useIsNarrow(768)

  const [activeSection, setActiveSection]   = useState(0)
  const [selectedMedia, setSelectedMedia]   = useState<string | null>(null)

  const scrollRef    = useRef<HTMLDivElement>(null)
  const sectionRefs  = useRef<(HTMLDivElement | null)[]>([])
  const scrollSpyRef = useRef<HTMLDivElement>(null)
  const [spyRight, setSpyRight] = useState<string | number>(window.innerWidth < 1700 ? 16 : colRight)

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
  }, [])

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

  return (
    <>
      {/* ── Scrollable content ───────────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="absolute overflow-y-auto"
        style={isMobile
          ? { left: 16, right: 16, top: 0, bottom: 0, overflowX: 'hidden' }
          : isMedium
          ? { left: 100, right: 100, top: 0, bottom: 0, overflowX: 'hidden' }
          : isNarrow
          ? { left: '50%', transform: 'translateX(-50%)', width: 'min(800px, calc(100% - 80px))', right: 'auto', top: 0, bottom: 0 }
          : { left: colLeft, right: colRight, top: 0, bottom: 0 }
        }
      >
        <div style={{ paddingTop: 32, paddingLeft: isMobile ? 0 : 10, paddingRight: isMobile ? 0 : undefined, paddingBottom: isMobile ? 'calc(50vh + 6rem + env(safe-area-inset-bottom, 0px))' : '50vh', fontFamily: 'Arial, sans-serif' }}>

          {/* Title image */}
          <img
            key={isDark ? 'hovr-thumb-dark' : 'hovr-thumb-light'}
            src={isDark ? HOVR_HERO_THUMB_DARK : HOVR_HERO_THUMB_LIGHT}
            alt="HOVR Admin"
            style={{ width: '100%', maxWidth: 1000, height: 'auto', display: 'block', marginBottom: 30, borderRadius: 0 }}
          />

          {/* Title */}
          <h1
            style={{
              fontSize:     isMobile ? 'clamp(1.75rem, 6vw, 2.25rem)' : 40,
              fontWeight:   700,
              lineHeight:   isMobile ? 1.1 : '32px',
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
              gridTemplateColumns: isMobile ? 'minmax(0,1fr)' : 'auto 1fr',
              columnGap: isMobile ? 12 : 28,
              rowGap: isMobile ? 4 : undefined,
              fontSize:  isMobile ? 13 : 14,
              lineHeight: '20px',
              color:     '#000',
              alignItems: 'start',
              marginBottom: 32,
            }}
          >
            {/* Team / Role */}
            <React.Fragment key={HOVR_META_ROWS[0].label}>
              <span style={{ fontWeight: 700, whiteSpace: isMobile ? 'normal' : 'nowrap', paddingBottom: 8 }}>{HOVR_META_ROWS[0].label}</span>
              <span style={{ fontWeight: 400, paddingBottom: 8, wordBreak: 'break-word' }}>{HOVR_META_ROWS[0].value}</span>
            </React.Fragment>

            {/* 10px gap before grouped rows */}
            <div style={{ paddingTop: 10 }} />
            <div style={{ paddingTop: 10 }} />

            {/* Problem / Solution / Impact */}
            {HOVR_META_ROWS.slice(1).map(({ label, value }, i) => (
              <React.Fragment key={label}>
                <span style={{ fontWeight: 700, whiteSpace: isMobile ? 'normal' : 'nowrap', paddingBottom: i < HOVR_META_ROWS.length - 2 ? 8 : 0 }}>{label}</span>
                <span style={{ fontWeight: 400, paddingBottom: i < HOVR_META_ROWS.length - 2 ? 8 : 0, wordBreak: 'break-word' }}>{value}</span>
              </React.Fragment>
            ))}
          </div>

          {/* Process image */}
          <img
            src="/hovr/process.png"
            alt=""
            style={{ width: '100%', maxWidth: 1000, height: 'auto', marginTop: 50, marginBottom: 200, borderRadius: 0, cursor: 'zoom-in' }}
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
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems:    'flex-start',
                    gap:           isMobile ? 20 : 161,
                    fontSize:      14,
                    lineHeight:    '16px',
                    color:         '#000',
                  }}
                >
                  {/* Left label */}
                  <p style={{ fontWeight: 700, width: isMobile ? '100%' : 130, flexShrink: 0, whiteSpace: isMobile ? 'normal' : 'nowrap' }}>
                    {section.label}
                  </p>

                  {/* Right content */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: isMobile ? '100%' : 578, width: isMobile ? '100%' : undefined, minWidth: 0 }}>
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
        className="fixed top-1/2 -translate-y-1/2 flex flex-col items-end gap-3 text-black not-italic"
        style={{
          display:    isMobile ? 'none' : undefined,
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
