import { useState, useEffect, useRef, useCallback, Fragment } from 'react'
import { useIsNarrow } from '../hooks/useIsNarrow'
import { motion, AnimatePresence } from 'framer-motion'

// ── Section data ───────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    id: 'who-is-minjoo',
    spyLabel: 'Hello',
    label: "Hello I'm Minjoo!",
    title: 'A Toronto-based product designer',
    body: 'specialized in B2B ecosystems, delivering consistent UX across Web, Mobile, and VR through scalable design systems.',
  },
  {
    id: 'career',
    label: 'Career',
    title: '',
    body: '',
    jobs: [
      { role: 'UX/UI Designer',                        company: 'BMAD • Montreal, QC • Remote',                               period: 'Jul 2025 – Present'    },
      { role: 'AI/ML Software Designer',               company: 'Product Manager Accelerator • Boston, USA • Remote',         period: 'Jun 2025 – Sep 2025'   },
      { role: 'UX/UI Designer',                        company: 'HOVR • Toronto, ON • Remote',                              period: 'Sep 2024 – Jul 2025'   },
      { role: 'Product Designer',                      company: 'Piik AI • Seoul, Kor • Remote',                              period: 'Apr 2024 – Sep 2024'   },
    ],
  },
  {
    id: 'fun-works',
    label: 'Fun Works I do',
    title: 'I make Framer Components using AI and monetize them',
    body: '',
    funWorks: true as const,
  },
  {
    id: 'i-studied-at',
    label: 'I studied at',
    title: '',
    body: '',
    degrees: [
      { degree: 'Bachelor of Design., Spec. Hons., Design', school: 'York University',   period: '2020 – 2025' },
      { degree: 'Diploma, Multimedia Design and Development', school: 'Humber College', period: '2018 – 2020' },
    ],
  },
  {
    id: 'i-like',
    label: 'I like',
    title: 'Cats · Travel · Mechanical keyboards · Drawing & Painting · K-Drama',
    body: '',
  },
]

// ── 3D wheel variants ──────────────────────────────────────────────────────────

const EASE = [0.44, 0, 0.3, 0.99] as const

const VARIANTS = {
  // dir > 0 = scrolling down: enter from bottom; dir < 0 = scrolling up: enter from top
  enter: (dir: number) => ({
    y: dir > 0 ? 40 : -40,
    opacity: 0,
    scale: 1.02,
    rotateX: dir > 0 ? -5 : 5,
  }),
  center: {
    y: 0,
    opacity: 1,
    scale: 1,
    rotateX: 0,
    transition: { duration: 0.7, ease: EASE },
  },
  // dir > 0 = scrolling down: exit to top; dir < 0 = scrolling up: exit to bottom
  exit: (dir: number) => ({
    y: dir > 0 ? -40 : 40,
    opacity: 0,
    scale: 0.98,
    rotateX: dir > 0 ? 5 : -5,
    transition: { duration: 0.6, ease: EASE },
  }),
}

// ── About page ─────────────────────────────────────────────────────────────────

export function AboutPage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [hasNavigated, setHasNavigated] = useState(false)
  const [meImg, setMeImg] = useState(1)
  const isAnimating = useRef(false)
  const isNarrow = useIsNarrow()
  const isMobile = useIsNarrow(768)
  const [spyRight, setSpyRight] = useState<string | number>(window.innerWidth < 1700 ? 16 : 'calc(8.33% + 15px)')

  useEffect(() => {
    const check = () => setSpyRight(window.innerWidth < 1700 ? 16 : 'calc(8.33% + 15px)')
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setMeImg(n => n === 1 ? 2 : 1), 2500)
    return () => clearInterval(id)
  }, [])

  const navigate = useCallback(
    (nextIndex: number) => {
      if (nextIndex < 0 || nextIndex >= SECTIONS.length || isAnimating.current) return
      setDirection(nextIndex > activeIndex ? 1 : -1)
      setActiveIndex(nextIndex)
      setHasNavigated(true)
      isAnimating.current = true
      setTimeout(() => { isAnimating.current = false }, 650)
    },
    [activeIndex],
  )

  // Wheel → section change
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      navigate(activeIndex + (e.deltaY > 0 ? 1 : -1))
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [activeIndex, navigate])

  const section = SECTIONS[activeIndex]

  return (
    <>
      {/* ── 3D wheel ──────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Flex container vertically centers content; perspective creates 3D context */}
        <div
          className="absolute inset-0 flex items-center px-4"
          style={isNarrow
            ? { left: '50%', transform: 'translateX(-50%)', width: 'min(800px, calc(100% - 80px))', right: 'auto', perspective: '1200px' }
            : { left: 'calc(25% + 12px)', perspective: '1200px' }
          }
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={section.id}
              custom={direction}
              variants={VARIANTS}
              initial={hasNavigated ? 'enter' : { y: 30, opacity: 0, scale: 1, rotateX: 0 }}
              animate="center"
              exit="exit"
              className="flex items-start text-black not-italic"
              style={{
                flexDirection: isMobile ? 'column' : 'row',
                alignItems:    'flex-start',
                gap:           isMobile ? 20 : 161,
                fontSize:      14,
                lineHeight:    '16px',
                fontFamily:    'Arial, sans-serif',
              }}
            >
              {/* Left column — fixed 130px so every section's right column
                  starts at the same horizontal offset (130 + gap:161 = 291px) */}
              <p className="font-bold whitespace-nowrap shrink-0" style={{ width: isMobile ? '100%' : 130 }}>{section.label}</p>

              {/* Right column — branches on section type */}
              {'jobs' in section && section.jobs ? (
                // ── Career ──────────────────────────────────────────────────
                <div
                  className="grid max-w-[700px] w-full"
                  style={{ gridTemplateColumns: '1fr auto', columnGap: 40, rowGap: 18 }}
                >
                  {section.jobs.map((job) => (
                    <Fragment key={job.role}>
                      <div className="flex flex-col" style={{ gap: 4 }}>
                        <p className="font-bold">{job.role}</p>
                        <p className="font-normal">{job.company}</p>
                      </div>
                      <p className="font-normal whitespace-nowrap text-right self-start">{job.period}</p>
                    </Fragment>
                  ))}
                </div>
              ) : 'degrees' in section && section.degrees ? (
                // ── I studied at ────────────────────────────────────────────
                <div className="flex flex-col min-w-0 max-w-[700px] w-full" style={{ gap: 18 }}>
                  <div
                    className="grid w-full"
                    style={{ gridTemplateColumns: '1fr auto', columnGap: 40, rowGap: 18 }}
                  >
                    {section.degrees.map((edu) => (
                      <Fragment key={edu.degree}>
                        <div className="flex flex-col" style={{ gap: 4 }}>
                          <p className="font-bold">{edu.degree}</p>
                          <p className="font-normal">{edu.school}</p>
                        </div>
                        <p className="font-normal whitespace-nowrap text-right self-start">{edu.period}</p>
                      </Fragment>
                    ))}
                  </div>
                  <img src="/me/gradphoto-portfolio.jpg" alt="" style={{ width: 600, height: 'auto', display: 'block' }} />
                </div>
              ) : 'funWorks' in section ? (
                // ── Fun Works I do ──────────────────────────────────────────
                <div className="flex flex-col min-w-0" style={{ gap: 10, maxWidth: isMobile ? '100%' : 578, width: isMobile ? '100%' : undefined }}>
                  <p className="font-bold">{section.title}</p>
                  <button
                    className="flex items-center gap-2 font-normal hover:font-bold cursor-pointer self-start"
                    onClick={() => window.open('https://www.framer.com/@minjoo-kim-j8bshr/', '_blank')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
                      <path d="M7 17C5.61667 17 4.43767 16.5123 3.463 15.537C2.48833 14.5617 2.00067 13.3827 2 12C1.99933 10.6173 2.487 9.43833 3.463 8.463C4.439 7.48767 5.618 7 7 7H10C10.2833 7 10.521 7.096 10.713 7.288C10.905 7.48 11.0007 7.71733 11 8C10.9993 8.28267 10.9033 8.52033 10.712 8.713C10.5207 8.90567 10.2833 9.00133 10 9H7C6.16667 9 5.45833 9.29167 4.875 9.875C4.29167 10.4583 4 11.1667 4 12C4 12.8333 4.29167 13.5417 4.875 14.125C5.45833 14.7083 6.16667 15 7 15H10C10.2833 15 10.521 15.096 10.713 15.288C10.905 15.48 11.0007 15.7173 11 16C10.9993 16.2827 10.9033 16.5203 10.712 16.713C10.5207 16.9057 10.2833 17.0013 10 17H7ZM9 13C8.71667 13 8.47933 12.904 8.288 12.712C8.09667 12.52 8.00067 12.2827 8 12C7.99933 11.7173 8.09533 11.48 8.288 11.288C8.48067 11.096 8.718 11 9 11H15C15.2833 11 15.521 11.096 15.713 11.288C15.905 11.48 16.0007 11.7173 16 12C15.9993 12.2827 15.9033 12.5203 15.712 12.713C15.5207 12.9057 15.2833 13.0013 15 13H9ZM14 17C13.7167 17 13.4793 16.904 13.288 16.712C13.0967 16.52 13.0007 16.2827 13 16C12.9993 15.7173 13.0953 15.48 13.288 15.288C13.4807 15.096 13.718 15 14 15H17C17.8333 15 18.5417 14.7083 19.125 14.125C19.7083 13.5417 20 12.8333 20 12C20 11.1667 19.7083 10.4583 19.125 9.875C18.5417 9.29167 17.8333 9 17 9H14C13.7167 9 13.4793 8.904 13.288 8.712C13.0967 8.52 13.0007 8.28267 13 8C12.9993 7.71733 13.0953 7.48 13.288 7.288C13.4807 7.096 13.718 7 14 7H17C18.3833 7 19.5627 7.48767 20.538 8.463C21.5133 9.43833 22.0007 10.6173 22 12C21.9993 13.3827 21.5117 14.562 20.537 15.538C19.5623 16.514 18.3833 17.0013 17 17H14Z" fill="black"/>
                    </svg>
                    Look What I Made
                  </button>
                </div>
              ) : (
                // ── All other sections: title only ──────────────────────────
                <div className="flex flex-col min-w-0" style={{ gap: 10, maxWidth: isMobile ? '100%' : 578, width: isMobile ? '100%' : undefined }}>
                  <p className="font-bold">{section.title}</p>
                  {section.body && <p className="font-normal">{section.body}</p>}
                  {section.id === 'who-is-minjoo' && (
                    <img src={`/me/me${meImg}.png`} alt="Minjoo" style={{ display: 'block', width: '40%', height: 'auto', borderRadius: 10 }} />
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Right scroll spy ──────────────────────────────────────────────── */}
      <div
        className="fixed top-1/2 -translate-y-1/2 flex flex-col items-end gap-3 text-black not-italic"
        style={{
          display:    isMobile ? 'none' : undefined,
          right:      spyRight,
          fontSize:   14,
          lineHeight: '16px',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        {SECTIONS.map((s, i) => (
          <span
            key={s.id}
            onClick={() => navigate(i)}
            style={{ whiteSpace: 'nowrap' }}
            className={`cursor-pointer select-none hover:font-bold ${
              i === activeIndex ? 'font-bold' : 'font-normal'
            }`}
          >
            {'spyLabel' in s && s.spyLabel ? s.spyLabel : s.label}
          </span>
        ))}
      </div>
    </>
  )
}
