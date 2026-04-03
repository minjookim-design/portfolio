import React, { Fragment, useState, useEffect, useLayoutEffect, useRef } from 'react'
import { CaseStudyRailTitle } from '../components/CaseStudyRailTitle'
import { useCaseStudyHomeRailGap } from '../hooks/useCaseStudyHomeRailGap'
import { useIsNarrow } from '../hooks/useIsNarrow'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { usePageTheme } from '../context/PageThemeContext'

// ── Section data ───────────────────────────────────────────────────────────────

export const PIIK_SECTIONS = [
  {
    id: 'overview',
    label: 'Overview',
    heading: <>Redesigning the core creator experience for an AI knowledge-sharing platform, bridging cross-cultural UX gaps and reducing user complaints by <span style={{ color: '#FF7262', fontSize: '1.5em', position: 'relative', zIndex: 1, verticalAlign: 'top', lineHeight: 1 }}>75%</span>.</>,
    body: 'As the end-to-end Product Designer for Piik AI (an online community for sharing AI knowledge), I led the redesign of the core article editor to empower creators.\n\nMy primary challenge was navigating cross-cultural UX gaps to build an intuitive workspace that resonated with a diverse, global audience. By grounding design decisions in localized research and maintaining agile, real-time collaboration with developers to ensure technical feasibility, we successfully transformed a restrictive MVP into a professional-grade tool.\n\nUltimately, this builder-led execution aligned the UI with actual creator workflows, achieving a 75% reduction in editor-related complaints and significantly elevating the platform\'s content creation experience.',
    media: '',
    carousel: ['/piikai/article1.png', '/piikai/article2.png', '/piikai/article3.png', '/piikai/article4.png'],
  },
  {
    id: 'the-goal',
    label: 'The Goal',
    heading: 'Enable creators to write articles in the most effective way to convey their knowledge to readers.',
    body: 'Knowledge sharing shouldn\'t be limited by clunky interfaces. When creators are explaining complex AI concepts, their primary focus must be on the narrative, not fighting with a restrictive tool. Our goal was to eliminate these friction points, empowering experts to translate their insights into clear, engaging content that truly resonates with readers.',
    media: '',
  },
  {
    id: 'problems',
    label: 'Problems',
    heading: '',
    body: '',
    media: '',
    subSections: [
      {
        heading: <><span style={{ color: 'red' }}>Problem 1: the lack of editing tools.</span></>,
        body: 'The editing tool currently only performs the bare minimum for writing an article. Users mentioned that essential features they would like to see include a divider, font size adjustment, font selection, and font styling.',
        media: '/piikai/problem1.png',
      },
      {
        heading: <><span style={{ color: 'red', fontWeight: 700 }}>Problem 2: The Maximum Width of the MVP Was Only 660px.</span></>,
        body: 'While the industry standard for editor text areas is 700px, the editor in our MVP was only 660px. This narrower width caused discomfort for creators when writing articles.\n\nOn mobile screens, unnecessary double padding further reduced the already limited text area, making the writing experience even more restrictive.',
        media: '/piikai/problem2.png',
      },
      {
        heading: <><span style={{ color: 'red', fontWeight: 700 }}>Problem 3: No draft-save feature</span></>,
        subheading: 'It Causes Significant Inconveniences for Users When Writing Articles.',
        body: 'What if creators aren\'t ready to publish? What if they just want to archive their article? Some creators have even experienced losing their work due to log-in timeouts while writing an article.\n\nThe auto log-out feature after inactivity is necessary for security reasons. However, writing an article can take a significant amount of time—sometimes even an entire day. One creator shared that they took a day off from work to dedicate themselves to writing an article on our platform. Unfortunately, due to the lack of an auto-save or save-draft feature, their work was lost when they were automatically logged out after the session timed out.\n\nThis highlights a major flaw in the current system. The absence of a draft-saving feature is a critical issue and has been identified as a must-have for the next phase of development.',
        media: '',
      },
    ],
  },
  {
    id: 'research',
    label: 'Why Do Our Users Want More Features?',
    spyLabel: 'Research',
    heading: 'Market Insight & The "Aha!" Moment',
    body: 'To understand why minimalism created friction, I analyzed Naver Blog, Korea\'s dominant publishing platform. Unlike Western tools that hide secondary features, Naver provides a visible, exhaustive suite of editing tools that has shaped the mental model of Korean creators for decades. This research led to a critical realization: for Korean users, minimalism is often perceived as a lack of functionality. Accustomed to a "versatile toolbox," they expect a high-density interface that offers immediate, high-precision control over their content.',
    media: '/piikai/naver.png',
    postContent: [
      {
        heading: 'Prioritizing the "More is More" Mental Model',
        body: 'Recognizing that Piik AI\'s primary audience values a feature-rich environment, I pivoted from a Western-style minimalist UI to a comprehensive, professional-grade toolkit. By integrating an extensive array of formatting options—inspired by local standards—I ensured the platform felt powerful and tailored to the specific creative habits of Korean creators. This shift transformed the writing process from a restrictive task into an expressive, frictionless journey, aligning the product with the cultural expectations of its core users.',
      },
    ],
  },
  {
    id: 'final-solution',
    label: 'Final Solution',
    heading: '',
    body: '',
    media: '',
    subSections: [
      {
        heading: <>More Editing Tools</>,
        body: 'A Variety of Editing Tools Are Now Available',
        media: '',
        phoneCarousel: {
          srcs: ['/piikai/1.mp4', '/piikai/2.mp4', '/piikai/3.mp4', '/piikai/4.mp4', '/piikai/5.mp4'],
          captions: [
            { title: 'Accessing the Editing Tool', body: 'Users can access the editing tool from the bottom toolbar or by tapping the plus button. Additionally, hovering over the simplified toolbar icon on the left side of the cursor line reveals a streamlined tool bar for quick access.' },
            { title: 'Text Formatting Options', body: 'Users have various text tools to customize their content, including font size and style changes, basic text formatting like bold, italic, underline, and strikethrough. Options for text colour and background colour, alignment changes, line spacing adjustments, and the creation of bulleted or numbered lists are also available. Additionally, four divider options enhance storytelling, and the quote feature allows users to highlight important quotes effectively.' },
            { title: 'Code Block Support', body: 'The tool includes functionality to insert code blocks, catering to technical writers and developers.' },
            { title: 'Media Captioning', body: 'Users can add captions below images, videos, and embedded posts. Captions are optional, allowing flexibility depending on the content.' },
            { title: 'Interactive Polling Feature', body: 'The polling feature enables creators to engage directly with their audience, fostering interaction and increasing platform usage. Polls can be customized with options to set the voting duration, limit the number of selectable answers, and enable anonymous voting, emphasizing the community-focused aspect of the platform.' },
          ],
        },
      },
      {
        heading: <>Wider Text Area</>,
        body: 'Maximum Width Increased to 1080px',
        media: '/piikai/max-width-faster.mp4',
        mediaPlaybackRate: 0.7,
      },
      {
        heading: <>Save-Draft Feature</>,
        body: 'Creators Can Save Drafts Anytime While Writing',
        media: '/piikai/Save-Draft faster.mp4',
      },
    ],
  },
  {
    id: 'takeaway',
    label: 'Takeaway',
    heading: 'Transforming User Pain Points into Product Robustness',
    body: 'Through this project, I realized that the most effective way to build a robust service is not through the constant addition of new features, but through a deep commitment to resolving existing user friction. By treating every complaint as a critical design challenge rather than a minor inconvenience, I learned to navigate the art of strategic prioritization, balancing technical feasibility with the high-impact needs of our creators. Seeing a 75% reduction in editor-related complaints reinforced my belief in the power of real user feedback and gave me a profound sense of pride in delivering a solution that truly advocates for the user\'s creative journey.',
    media: '',
  },
]

export const PIIK_META_ROWS = [
  {
    label: 'Team / Role',
    value: 'Piik AI Design team\u00a0\u00a0·\u00a0\u00a0Product Designer',
  },
  {
    label: 'Problem',
    value:
      'A restrictive UI with bare-minimum features limited creator freedom and created critical usability bottlenecks.',
  },
  {
    label: 'Solution',
    value:
      'Redesigned a scalable 1080px editing environment, introducing robust formatting capabilities and a fail-safe draft system.',
  },
  {
    label: 'Impact',
    value:
      'Reduced user complaints by 75% and significantly boosted platform adoption, acquiring 50+ unique creators within days.',
  },
]

/** Match `HomePage` HOVR third-column case study typography. */
const PIIK_HOME_INSTRUMENT = "font-['Instrument_Serif',serif]"
const PIIK_HOME_META_LABEL_CLASS = `${PIIK_HOME_INSTRUMENT} text-[16px] leading-tight font-bold`
const PIIK_HOME_META_BODY_CLASS = 'font-mono text-[12px] font-medium leading-[1.2]'
const PIIK_HOME_SECTION_LABEL_CLASS = `${PIIK_HOME_INSTRUMENT} text-[18px] leading-tight font-bold`
const PIIK_HOME_SECTION_BODY_CLASS = "font-['Arial',sans-serif] text-[14px] font-normal leading-[1.2]"

/** Piik hero / thumbnails — files in `public/piikai/`. */
export const PIIK_HERO_THUMB_DARK = '/piikai/Thumbnail-dark.jpg'
export const PIIK_HERO_THUMB_LIGHT = '/piikai/Thumbnail-light.jpg'

// ── Lightbox ───────────────────────────────────────────────────────────────────

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

function PiikCarouselSlideMedia({
  src,
  onMediaClick,
  style,
  className,
}: {
  src: string
  onMediaClick?: (src: string) => void
  style?: React.CSSProperties
  className?: string
}) {
  const cn = className ?? 'cursor-zoom-in'
  if (src.endsWith('.mp4')) {
    return (
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className={cn}
        style={style}
        onClick={() => onMediaClick?.(src)}
      />
    )
  }
  return <img src={src} alt="" className={cn} style={style} onClick={() => onMediaClick?.(src)} />
}

export function PiikCaseStudyCarouselBlock({
  srcs,
  onMediaClick,
  fullWidthSlides,
  fullWidthImageScale = 1,
  fullWidthSlideGap = 0,
  fullWidthEdgeAlign = false,
  fullWidthTwoUp = false,
}: {
  srcs: string[]
  onMediaClick?: (src: string) => void
  /** One slide = full column width; images use natural height (`height: auto`). */
  fullWidthSlides?: boolean
  /** Width fraction inside each slide when `fullWidthSlides` (e.g. 0.6 → 60% wide, centered). */
  fullWidthImageScale?: number
  /** Horizontal padding between adjacent slides (split across slide edges; does not change slide snapping). */
  fullWidthSlideGap?: number
  /** First slide left-aligned, last right-aligned, middle centered (for scaled images). */
  fullWidthEdgeAlign?: boolean
  /** Show two slides at once (50% / 50% minus gap) so the next image is visible before advancing. */
  fullWidthTwoUp?: boolean
}) {
  const [index, setIndex] = useState(0)
  const n = srcs.length
  const outerRef = useRef<HTMLDivElement>(null)
  const [viewportW, setViewportW] = useState(0)
  const gapPx = fullWidthSlideGap
  const twoUp = Boolean(fullWidthSlides && fullWidthTwoUp && n >= 2)
  const maxIdx = twoUp ? Math.max(0, n - 2) : n - 1
  /** Half-viewport column (two-up); image hugs `cellW * scale` width. */
  const cellW = twoUp && viewportW > 0 && gapPx >= 0 ? (viewportW - gapPx) / 2 : 0
  const twoUpScaleClamped = Math.min(1.5, fullWidthImageScale)
  const imgW = twoUp && cellW > 0 ? cellW * twoUpScaleClamped : 0
  const stepPx = imgW + gapPx

  useLayoutEffect(() => {
    if (!twoUp) return
    const el = outerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setViewportW(el.getBoundingClientRect().width))
    ro.observe(el)
    setViewportW(el.getBoundingClientRect().width)
    return () => ro.disconnect()
  }, [twoUp, n])

  useEffect(() => {
    setIndex((i) => Math.min(i, maxIdx))
  }, [maxIdx])

  const translateXFull = `-${(index * 100) / n}%`
  const translateX80 =
    index === n - 1
      ? `calc(${-(index * 80 - 20)}% - ${index * 16}px)`
      : `calc(-${index * 80}% - ${index * 16}px)`
  const translateX = fullWidthSlides ? translateXFull : translateX80
  const arrowStyle: React.CSSProperties = {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%',
    width: 32, height: 32, cursor: 'pointer', fontSize: 16, display: 'flex',
    alignItems: 'center', justifyContent: 'center', color: '#fff',
  }
  if (fullWidthSlides && n > 0) {
    if (twoUp) {
      return (
        <div
          ref={outerRef}
          style={{ position: 'relative', overflow: 'hidden', borderRadius: 0, width: '100%', height: 'fit-content' }}
        >
          {imgW > 0 ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: gapPx,
                width: n * imgW + (n - 1) * gapPx,
                transition: 'transform 0.4s ease',
                transform: `translateX(-${index * stepPx}px)`,
              }}
            >
              {srcs.map((src, ci) => {
                const justify = fullWidthEdgeAlign
                  ? ci === 0
                    ? 'flex-start'
                    : ci === n - 1
                      ? 'flex-end'
                      : 'center'
                  : 'center'
                return src ? (
                  <div
                    key={src + ci}
                    style={{
                      flex: `0 0 ${imgW}px`,
                      width: imgW,
                      boxSizing: 'border-box',
                      display: 'flex',
                      justifyContent: justify,
                      alignItems: 'flex-start',
                    }}
                  >
                    <PiikCarouselSlideMedia
                      src={src}
                      onMediaClick={onMediaClick}
                      className="cursor-zoom-in"
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        borderRadius: 0,
                      }}
                    />
                  </div>
                ) : (
                  <div
                    key={`ph-${ci}`}
                    className="flex flex-shrink-0 items-center justify-center border border-black/10 bg-neutral-200/80 text-[12px] text-black/45"
                    style={{ flex: `0 0 ${imgW}px`, width: imgW, minHeight: 220, borderRadius: 0, boxSizing: 'border-box' }}
                  >
                    Image placeholder
                  </div>
                )
              })}
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                width: `${n * 100}%`,
                transition: 'transform 0.4s ease',
                transform: `translateX(${translateXFull})`,
              }}
            >
              {srcs.map((src, ci) => (
                <div
                  key={src ? src + ci : `ph-${ci}`}
                  style={{
                    flex: `0 0 ${100 / n}%`,
                    width: `${100 / n}%`,
                    maxWidth: `${100 / n}%`,
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    alignSelf: 'flex-start',
                    height: 'fit-content',
                    minHeight: 0,
                  }}
                >
                  {src ? (
                    <PiikCarouselSlideMedia
                      src={src}
                      onMediaClick={onMediaClick}
                      className="cursor-zoom-in"
                      style={{
                        width: `${Math.min(1, fullWidthImageScale) * 100}%`,
                        maxWidth: '100%',
                        height: 'auto',
                        display: 'block',
                        borderRadius: 0,
                        flexShrink: 0,
                        objectFit: 'contain',
                      }}
                    />
                  ) : (
                    <div
                      className="flex flex-shrink-0 items-center justify-center border border-black/10 bg-neutral-200/80 text-[12px] text-black/45"
                      style={{ flex: `0 0 ${100 / n}%`, minHeight: 220, borderRadius: 0 }}
                    >
                      Image placeholder
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {index > 0 && (
            <button type="button" onClick={() => setIndex(index - 1)} style={{ ...arrowStyle, left: 8 }}>
              ‹
            </button>
          )}
          {index < maxIdx && (
            <button type="button" onClick={() => setIndex(index + 1)} style={{ ...arrowStyle, right: 8 }}>
              ›
            </button>
          )}
        </div>
      )
    }

    return (
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 0,
          width: '100%',
          height: 'fit-content',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            width: `${n * 100}%`,
            transition: 'transform 0.4s ease',
            transform: `translateX(${translateX})`,
          }}
        >
          {srcs.map((src, ci) => {
            const g = fullWidthSlideGap
            const padL = !twoUp && g > 0 && ci > 0 ? g / 2 : 0
            const padR = !twoUp && g > 0 && ci < n - 1 ? g / 2 : 0
            const justify = fullWidthEdgeAlign
              ? ci === 0
                ? 'flex-start'
                : ci === n - 1
                  ? 'flex-end'
                  : 'center'
              : 'center'
            const columnAlign =
              justify === 'flex-start' ? 'flex-start' : justify === 'flex-end' ? 'flex-end' : 'center'
            return src ? (
              <div
                key={src + ci}
                style={{
                  flex: `0 0 ${100 / n}%`,
                  width: `${100 / n}%`,
                  maxWidth: `${100 / n}%`,
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: columnAlign,
                  justifyContent: 'flex-start',
                  alignSelf: 'flex-start',
                  height: 'fit-content',
                  minHeight: 0,
                  paddingLeft: padL,
                  paddingRight: padR,
                }}
              >
                <PiikCarouselSlideMedia
                  src={src}
                  onMediaClick={onMediaClick}
                  className="cursor-zoom-in"
                  style={{
                    width: `${Math.min(1, fullWidthImageScale) * 100}%`,
                    maxWidth: '100%',
                    height: 'auto',
                    display: 'block',
                    borderRadius: 0,
                    flexShrink: 0,
                    objectFit: 'contain',
                  }}
                />
              </div>
            ) : (
              <div
                key={`ph-${ci}`}
                className="flex flex-shrink-0 items-center justify-center border border-black/10 bg-neutral-200/80 text-[12px] text-black/45"
                style={{
                  flex: `0 0 ${100 / n}%`,
                  minHeight: 220,
                  borderRadius: 0,
                  paddingLeft: padL,
                  paddingRight: padR,
                  boxSizing: 'border-box',
                }}
              >
                Image placeholder
              </div>
            )
          })}
        </div>
        {index > 0 && (
          <button type="button" onClick={() => setIndex(index - 1)} style={{ ...arrowStyle, left: 8 }}>
            ‹
          </button>
        )}
        {index < maxIdx && (
          <button type="button" onClick={() => setIndex(index + 1)} style={{ ...arrowStyle, right: 8 }}>
            ›
          </button>
        )}
      </div>
    )
  }
  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 0 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          transition: 'transform 0.4s ease',
          transform: `translateX(${translateX})`,
          gap: 16,
        }}
      >
        {srcs.map((src, ci) =>
          src ? (
            <PiikCarouselSlideMedia
              key={src + ci}
              src={src}
              onMediaClick={onMediaClick}
              className="cursor-zoom-in flex-shrink-0"
              style={{ width: '80%', height: 'auto', borderRadius: 0 }}
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
        <button type="button" onClick={() => setIndex(index - 1)} style={{ ...arrowStyle, left: 8 }}>
          ‹
        </button>
      )}
      {index < srcs.length - 1 && (
        <button type="button" onClick={() => setIndex(index + 1)} style={{ ...arrowStyle, right: 8 }}>
          ›
        </button>
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

// ── Home (/) third column — same case study content as PiikProjectPage ─────────

function piikSectionNavLabel(s: (typeof PIIK_SECTIONS)[number]): string {
  return 'spyLabel' in s && s.spyLabel != null ? String(s.spyLabel) : s.label
}

export function HomePiikCaseStudy({
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
        <img
          key={isDark ? 'piik-thumb-dark' : 'piik-thumb-light'}
          src={isDark ? PIIK_HERO_THUMB_DARK : PIIK_HERO_THUMB_LIGHT}
          alt="Piik AI"
          className="mb-[30px] block h-auto w-full max-w-full rounded-none"
        />
        <h1 className="mb-[26px] mt-0 text-[38px] font-bold italic leading-none font-['Instrument_Serif',serif]">
          Piik AI
        </h1>
        <div className="flex w-full flex-col gap-y-2">
          <div className="flex w-full items-center gap-x-[20px]">
            <span className={`shrink-0 whitespace-nowrap ${PIIK_HOME_META_LABEL_CLASS}`}>{PIIK_META_ROWS[0].label}</span>
            <span className={`min-w-0 flex-1 ${PIIK_HOME_META_BODY_CLASS}`}>{PIIK_META_ROWS[0].value}</span>
          </div>
          <div className="h-[10px] shrink-0" aria-hidden />
          <div className="grid w-full grid-cols-[auto_1fr] items-start gap-x-[20px] gap-y-2">
            {PIIK_META_ROWS.slice(1).map(({ label, value }) => (
              <Fragment key={label}>
                <span className={`whitespace-nowrap ${PIIK_HOME_META_LABEL_CLASS}`}>{label}</span>
                <span className={`min-w-0 ${PIIK_HOME_META_BODY_CLASS}`}>{value}</span>
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      {PIIK_SECTIONS.map((section, i) => (
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
              className={`shrink-0 whitespace-nowrap italic ${PIIK_HOME_SECTION_LABEL_CLASS} ${isMobile ? 'w-full' : 'w-[130px]'}`}
            >
              {piikSectionNavLabel(section)}
            </CaseStudyRailTitle>

            <div
              className={`flex min-w-0 w-full flex-col gap-4 ${PIIK_HOME_SECTION_BODY_CLASS}`}
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
                    <div key={si} className={`flex flex-col gap-4 ${si === 2 && section.id !== 'problems' ? 'mt-10' : ''}`}>
                      {sub.heading && <p className={PIIK_HOME_SECTION_LABEL_CLASS}>{sub.heading}</p>}
                      {sub.subheading != null && sub.subheading !== '' && (
                        <p
                          className={`${PIIK_HOME_SECTION_LABEL_CLASS}${sub.heading ? ' -mt-[10px]' : ''}`}
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
                          {pc.heading && <p className={`mt-20 ${PIIK_HOME_SECTION_LABEL_CLASS}`}>{pc.heading}</p>}
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
                  {section.heading && <p className={PIIK_HOME_SECTION_LABEL_CLASS}>{section.heading}</p>}
                  {section.body.split('\n\n').map((para, idx) => (
                    <p key={idx} className={section.heading && idx === 0 ? '-mt-[10px]' : undefined}>
                      {para}
                    </p>
                  ))}
                  {Array.isArray(section.media)
                    ? section.media.map((m) => <PiikCaseStudyMediaBlock key={m} src={m} onMediaClick={onMediaClick} />)
                    : section.media && <PiikCaseStudyMediaBlock src={section.media} onMediaClick={onMediaClick} />}
                  {'carousel' in section && section.carousel && (
                    <PiikCaseStudyCarouselBlock srcs={section.carousel as string[]} onMediaClick={onMediaClick} />
                  )}
                  {'postContent' in section &&
                    section.postContent &&
                    (section.postContent as { heading?: React.ReactNode; body?: string; media?: string }[]).map((pc, pi) => (
                      <Fragment key={pi}>
                        {pc.heading && <p className={`mt-20 ${PIIK_HOME_SECTION_LABEL_CLASS}`}>{pc.heading}</p>}
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
                </>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// ── Piik AI project page ───────────────────────────────────────────────────────

export function PiikProjectPage() {
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

  // sectionRefs[0] = hero, sectionRefs[1..N] = PIIK_SECTIONS
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
      const researchEl = sectionRefs.current[4]
      const finalEl    = sectionRefs.current[5]
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
          backgroundImage:    `url('${isDark ? PIIK_HERO_THUMB_DARK : PIIK_HERO_THUMB_LIGHT}')`,
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
                fontSize:     isMobile ? 'clamp(2.5rem, 14vw, 3.5rem)' : 100,
                fontWeight:   800,
                lineHeight:   1,
                color:        '#000000',
                marginBottom: 26,
                marginTop:    0,
                fontFamily:   'Arial, sans-serif',
              }}
            >
              Piik AI
            </h1>

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
              <React.Fragment key={PIIK_META_ROWS[0].label}>
                <span style={{ fontWeight: 700, whiteSpace: isMobile ? 'normal' : 'nowrap', paddingBottom: 8 }}>{PIIK_META_ROWS[0].label}</span>
                <span style={{ fontWeight: 700, paddingBottom: 8, wordBreak: 'break-word' }}>{PIIK_META_ROWS[0].value}</span>
              </React.Fragment>
              <div style={{ paddingTop: 10 }} />
              <div style={{ paddingTop: 10 }} />
              {PIIK_META_ROWS.slice(1).map(({ label, value }, i) => (
                <React.Fragment key={label}>
                  <span style={{ fontWeight: 700, whiteSpace: isMobile ? 'normal' : 'nowrap', paddingBottom: i < PIIK_META_ROWS.length - 2 ? 8 : 0 }}>{label}</span>
                  <span style={{ fontWeight: 700, paddingBottom: i < PIIK_META_ROWS.length - 2 ? 8 : 0, wordBreak: 'break-word' }}>{value}</span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* ── Sections ─────────────────────────────────────────────────────── */}
          {PIIK_SECTIONS.map((section, i) => (
            <motion.div
              key={section.id}
              ref={(el) => { sectionRefs.current[i + 1] = el; if (section.id === 'the-goal') goalRef.current = el; if (section.id === 'overview') overviewRef.current = el }}
              style={{ marginTop: i === 0 ? '25vh' : 0, marginBottom: i < PIIK_SECTIONS.length - 1 ? '10vh' : 0, transformOrigin: 'top center' }}
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
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 40, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.05, root: scrollRef }}
                  transition={{ duration: 0.8, ease: [0.44, 0, 0.3, 0.99] }}
                  style={{
                    display:       'flex',
                    flexDirection: (!isNarrow && section.id !== 'the-goal' && section.id !== 'research' && section.id !== 'final-solution') ? 'row' : 'column',
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
                    color:         (section.id === 'research' || section.id === 'final-solution') ? '#FFFFFF' : '#000000',
                    fontFamily:    'Arial, sans-serif',
                    gap:           (!isNarrow && section.id !== 'the-goal' && section.id !== 'research' && section.id !== 'final-solution') ? 60 : '1.5rem',
                  }}
                >
                  <p style={{ fontFamily: 'Arial, sans-serif', fontWeight: 800, fontSize: section.id === 'final-solution' ? (isMobile ? 32 : 56) : isMobile ? 28 : 40, lineHeight: 1, margin: 0, marginBottom: section.id === 'final-solution' ? (isMobile ? 40 : 100) : 0, flexShrink: 0, width: (!isNarrow && section.id !== 'the-goal' && section.id !== 'research' && section.id !== 'final-solution') ? 200 : undefined }}>
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
                      {'carousel' in section && section.carousel && (
                        <PiikCaseStudyCarouselBlock srcs={section.carousel as string[]} onMediaClick={setSelectedMedia} />
                      )}
                      {'postContent' in section && section.postContent && (section.postContent as { heading?: string; body?: string; media?: string }[]).map((pc, pi) => (
                        <React.Fragment key={pi}>
                          {pc.heading && <p style={{ fontWeight: 700, fontSize: 20, lineHeight: '22px', margin: 0, marginTop: 24 }}>{pc.heading}</p>}
                          {pc.body && pc.body.split('\n\n').map((para, ri) => (
                            <p key={ri} style={{ fontWeight: 400, margin: 0 }}>{para}</p>
                          ))}
                          {pc.media && <PiikCaseStudyMediaBlock src={pc.media} onMediaClick={setSelectedMedia} />}
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
        {PIIK_SECTIONS.map((s, i) => (
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
