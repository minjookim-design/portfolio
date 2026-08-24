import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { usePageTheme } from './context/PageThemeContext'
import { PiikFeedbackEmailCollage } from './PiikFeedbackEmailCollage'
import { PiikImpactStoryGraph } from './TestPiik'
import { TEST_HOME_PROJECT_TITLE_SERIF } from './pages/testHomeTypography'

/**
 * Standalone Piik AI deck — HovrDeck architecture + TestPiik / PiikProjectPage content & media.
 * Independent of test-piik case study. Do not modify those pages from this file.
 */

const CREAM = '#faf7f0'
const PIIK_STAGE = '#E6EEFF'
const EASE = [0.22, 1, 0.36, 1] as const
const EASE_EXPO = [0.87, 0, 0.13, 1] as const

/** Fluid deck typography / media — scales with viewport. */
const TITLE =
  "font-['ChosunIlboMyungjo',serif] text-[clamp(1.15rem,3.2vw,1.8125rem)] font-normal not-italic leading-[1.1] tracking-[-0.06em]"
const SUBHEAD =
  "font-['SUIT_Variable',sans-serif] text-[clamp(0.75rem,1.8vw,0.9375rem)] font-semibold leading-[1.2] tracking-[-0.02em] text-black dark:text-[#f2f2f2]"
const PROSE =
  "font-['SUIT_Variable',sans-serif] text-[clamp(0.6875rem,1.5vw,0.8125rem)] font-normal leading-[1.2] tracking-[-0.02em] text-[color:var(--color-muted,#666666)] dark:text-white/75 [&_p]:pt-4 [&_p:first-child]:pt-0 [&_h4]:mt-6 [&_h4]:mb-0 [&_h4]:font-['SUIT_Variable',sans-serif] [&_h4]:text-[clamp(0.75rem,1.8vw,0.9375rem)] [&_h4]:font-semibold [&_h4]:leading-[1.2] [&_h4]:tracking-[-0.02em] [&_h4]:text-black dark:[&_h4]:text-[#f2f2f2] [&_strong]:font-bold [&_strong]:text-black dark:[&_strong]:text-[#f2f2f2]"
const META_SUIT =
  "font-['SUIT_Variable',sans-serif] text-[clamp(0.5625rem,1.2vw,0.75rem)] font-bold not-italic uppercase leading-[1.2] tracking-[-0.02em]"
const BODY_SUIT_CAPS =
  "font-['SUIT_Variable',sans-serif] text-[clamp(0.5625rem,1.2vw,0.75rem)] font-normal uppercase leading-[1.2] tracking-[-0.02em]"
const OVERLINE =
  "font-['SUIT_Variable',sans-serif] text-[clamp(0.45rem,1vw,0.675rem)] font-normal uppercase leading-snug tracking-[0.06em]"
const FEATURE_TITLE =
  "font-['SUIT_Variable',sans-serif] text-[clamp(0.625rem,1.4vw,0.75rem)] font-bold uppercase leading-[1.2] tracking-[-0.02em] text-black dark:text-[#f2f2f2]"
const FEATURE_CAPTION =
  "font-['SUIT_Variable',sans-serif] text-[clamp(0.625rem,1.5vw,0.8125rem)] font-normal leading-[1.2] tracking-[-0.02em]"
const FEATURE_NUM =
  "w-[clamp(1.25rem,2.5vw,1.75rem)] shrink-0 font-['SUIT_Variable',sans-serif] text-[clamp(0.625rem,1.3vw,0.75rem)] font-normal tabular-nums leading-[1.2] tracking-[-0.02em]"
const DISPLAY =
  `text-[clamp(1.5rem,5.5vw,3rem)] ${TEST_HOME_PROJECT_TITLE_SERIF}`
const DISPLAY_XL =
  `text-[clamp(1.875rem,9vw,5.5rem)] ${TEST_HOME_PROJECT_TITLE_SERIF}`
const DECK_HEADER_TYPE =
  "font-['SUIT_Variable',sans-serif] text-[clamp(0.4rem,0.85vw,0.54rem)] font-normal uppercase leading-snug tracking-[0.06em] text-black/45 dark:text-white/50"
const CHROME_BTN =
  'rounded-none border px-[clamp(0.5rem,1.2vw,0.75rem)] py-[clamp(0.3rem,0.7vw,0.45rem)]'
/** Phase rail — 70% of META_SUIT + CHROME_BTN. */
const PHASE_NAV_TYPE =
  "font-['SUIT_Variable',sans-serif] text-[clamp(0.39375rem,0.84vw,0.525rem)] font-bold not-italic uppercase leading-[1.2] tracking-[-0.02em]"
const PHASE_NAV_BTN =
  'rounded-none border px-[clamp(0.35rem,0.84vw,0.525rem)] py-[clamp(0.21rem,0.49vw,0.315rem)]'
const MEDIA_FILL =
  'block h-full w-full max-h-full max-w-full object-contain object-center'

type SlideTone = 'cream' | 'white' | 'hero' | 'lead' | 'navy' | 'navy2' | 'navy3'

type SlideDef = {
  id: string
  label: string
  render: () => ReactNode
}

const EDITOR_TOOL_CLIPS = [
  {
    src: '/piikai/1.mp4',
    title: 'Accessing the Editing Tool',
  },
  {
    src: '/piikai/2.mp4',
    title: 'Text Formatting Options',
  },
  {
    src: '/piikai/3.mp4',
    title: 'Code Block Support',
  },
  {
    src: '/piikai/4.mp4',
    title: 'Media Captioning',
  },
  {
    src: '/piikai/5.mp4',
    title: 'Interactive Polling Feature',
  },
] as const

function FadeUp({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const reduceMotion = useReducedMotion()
  if (reduceMotion) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.65, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

function DeckHeader() {
  return (
    <div className="flex shrink-0 items-center justify-between gap-3 px-1">
      <p className={DECK_HEADER_TYPE}>Minjoo Kim</p>
      <p className={DECK_HEADER_TYPE}>2026</p>
      <p className={DECK_HEADER_TYPE}>Portfolio project</p>
    </div>
  )
}

function SlideShell({
  children,
  footer,
  className = '',
  tone = 'cream',
}: {
  children: ReactNode
  footer?: ReactNode
  className?: string
  tone?: SlideTone
}) {
  const bg =
    tone === 'hero'
      ? 'bg-[#E6EEFF] text-black dark:bg-[#121A2A] dark:text-[#f2f2f2]'
      : tone === 'lead'
        ? 'bg-[#F7F9FF] text-black dark:bg-[#141414] dark:text-[#f2f2f2]'
        : tone === 'navy'
          ? 'bg-[#121A2A] text-white'
          : tone === 'navy2'
            ? 'bg-[#18243A] text-white'
            : tone === 'navy3'
              ? 'bg-[#22314D] text-white'
              : tone === 'white'
                ? 'bg-white text-black dark:bg-[#161616] dark:text-[#f2f2f2]'
                : 'bg-[#faf7f0] text-black dark:bg-[#141414] dark:text-[#f2f2f2]'

  const hairline =
    tone === 'navy' || tone === 'navy2' || tone === 'navy3'
      ? 'border-white/20'
      : 'border-[#c0bcb0] dark:border-white/15'

  return (
    <div
      className={`flex h-full min-h-0 w-full flex-col overflow-hidden rounded-none border border-[#c0bcb0] dark:border-white/15 ${bg} ${className}`}
    >
      <div className={`shrink-0 border-b px-[clamp(1rem,3vw,2rem)] py-[clamp(0.35rem,0.9vh,0.5rem)] ${hairline}`}>
        <DeckHeader />
      </div>
      <div className="relative min-h-0 flex-1 overflow-y-auto px-[clamp(1rem,3vw,2rem)] py-[clamp(0.85rem,2.5vh,1.6rem)]">{children}</div>
      {footer ? (
        <div className={`shrink-0 border-t px-[clamp(1rem,3vw,2rem)] py-2 ${hairline}`}>{footer}</div>
      ) : null}
    </div>
  )
}

function MediaFrame({
  children,
  caption,
  className = '',
  onDark = false,
}: {
  children: ReactNode
  caption?: string
  className?: string
  onDark?: boolean
}) {
  // Match HovrDeck media frames: cream stroke + light fill on light slides;
  // white/25 stroke + white/10 fill on dark slides (Final Solution style).
  const frame = onDark
    ? 'border-white/25 bg-white/10'
    : 'border-[#c0bcb0] bg-black/5 dark:border-white/15 dark:bg-black/40'
  const captionTone = onDark
    ? 'border-t border-white/20 text-white/50'
    : 'border-t border-[#c0bcb0] text-black/45 dark:border-white/15 dark:text-white/45'

  return (
    <figure
      className={`m-0 flex h-full min-h-0 min-w-0 w-full flex-col overflow-hidden rounded-none border ${frame} ${className}`}
    >
      <div className="min-h-0 min-w-0 flex-1 overflow-hidden">{children}</div>
      {caption ? (
        <figcaption className={`${OVERLINE} shrink-0 px-3 py-2 ${captionTone}`}>
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}

function DeckImage({
  src,
  alt,
  caption,
  className = '',
  onDark = false,
}: {
  src: string
  alt: string
  caption?: string
  className?: string
  onDark?: boolean
}) {
  return (
    <MediaFrame caption={caption} className={className} onDark={onDark}>
      <img src={src} alt={alt} className={MEDIA_FILL} />
    </MediaFrame>
  )
}

function DeckVideo({
  src,
  caption,
  className = '',
  playbackRate = 1,
  onDark = false,
}: {
  src: string
  caption?: string
  className?: string
  playbackRate?: number
  onDark?: boolean
}) {
  return (
    <MediaFrame caption={caption} className={className} onDark={onDark}>
      <video
        src={src}
        className={MEDIA_FILL}
        autoPlay
        loop
        muted
        playsInline
        ref={(el) => {
          if (el && playbackRate !== 1) el.playbackRate = playbackRate
        }}
      />
    </MediaFrame>
  )
}

function PhaseNav({
  active,
  onDark = false,
}: {
  active: 0 | 1 | 2
  onDark?: boolean
}) {
  const phases = ['1. Impact', '2. Challenge', '3. Solutions'] as const
  return (
    <div className="flex w-max flex-col items-stretch gap-[clamp(0.14rem,0.35vw,0.21rem)]">
      {phases.map((label, i) => {
        const on = i === active
        return (
          <span
            key={label}
            className={`${PHASE_NAV_TYPE} ${PHASE_NAV_BTN} w-full text-left ${
              on
                ? onDark
                  ? 'border-white bg-white text-black'
                  : 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                : onDark
                  ? 'border-white/25 bg-transparent text-white/65'
                  : 'border-[#c0bcb0] bg-transparent text-black/70 dark:border-white/25 dark:text-white/65'
            }`}
          >
            {label}
          </span>
        )
      })}
    </div>
  )
}

/* ─── Slides ─────────────────────────────────────────────────────────────── */

function Slide01Title() {
  const { isDark } = usePageTheme()
  return (
    <SlideShell tone="hero">
      <div className="relative h-full min-h-0 w-full overflow-hidden">
        <FadeUp delay={0.08} className="absolute inset-0">
          <img
            src={isDark ? '/piikai/Thumbnail-dark.jpg' : '/piikai/Thumbnail-light.jpg'}
            alt="Piik AI editor product thumbnail"
            className="block h-full w-full object-cover object-center"
          />
        </FadeUp>
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[min(100%,42rem)] bg-gradient-to-r from-[#E6EEFF] via-[#E6EEFF]/85 to-transparent dark:from-[#121A2A] dark:via-[#121A2A]/85"
          aria-hidden
        />

        <div className="relative z-10 flex h-full min-h-0 max-w-[min(36rem,92%)] flex-col justify-center pr-[clamp(1rem,3vw,1.5rem)]">
          <FadeUp>
            <h1 className={DISPLAY}>Piik AI</h1>
            <p className={`${SUBHEAD} mt-4 max-w-[min(36ch,90%)] text-black/75 dark:text-white/75`}>
              Reducing creator complaints by 75%: How a high-density, fail-safe editor transformed
              an early-stage AI knowledge platform into a professional creative workspace
            </p>
          </FadeUp>
          <FadeUp delay={0.15} className="mt-8 flex flex-wrap gap-2">
            {['Product Design', 'AI Knowledge Platform', 'Early-Stage Startup'].map((tag) => (
              <span
                key={tag}
                className={`${META_SUIT} rounded-none border border-black/20 bg-white/70 px-3 py-1.5 dark:border-white/25 dark:bg-white/5`}
              >
                {tag}
              </span>
            ))}
          </FadeUp>
        </div>
      </div>
    </SlideShell>
  )
}

function Slide02Impact() {
  return (
    <SlideShell tone="lead">
      <div className="grid h-full grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0">
          <FadeUp>
            <h2 className={TITLE}>The Impact</h2>
            <h3 className={`${SUBHEAD} mt-6`}>
              75% Drop in Complaints & Rapid Creator Adoption
            </h3>
            <p className={`${PROSE} mt-4 max-w-3xl`}>
              For an AI knowledge-sharing platform, the creator&apos;s writing experience is the
              product&apos;s core engine. By completely reconstructing the restrictive MVP editor
              into a scalable, professional-grade workspace, A new solution reduced user complaints
              by 75%. This frictionless environment dramatically boosted platform adoption,
              acquiring over 50+ unique creators within just days of the launch.
            </p>
          </FadeUp>
          <FadeUp delay={0.12} className="mt-10">
            <PiikImpactStoryGraph />
          </FadeUp>
        </div>
        <FadeUp delay={0.1} className="sticky top-0 self-start justify-self-end">
          <PhaseNav active={0} />
        </FadeUp>
      </div>
    </SlideShell>
  )
}

function Slide04Listening() {
  return (
    <SlideShell tone="white">
      <div className="grid h-full grid-cols-1 gap-[52px] lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)_auto]">
        <FadeUp className="flex min-w-0 flex-col justify-center">
          <p className={OVERLINE}>Problems</p>
          <h2 className={`${TITLE} mt-3`}>Listening to Our Users</h2>
          <p className={`${PROSE} mt-4 max-w-[40ch]`}>
            We didn&apos;t just guess the pain points. We synthesized our problem statements
            directly from actual emails and feedback received from our creators.
          </p>
        </FadeUp>

        <div className="flex min-h-0 min-w-0 items-center self-center">
          <PiikFeedbackEmailCollage mode="mount" className="mt-[clamp(2rem,10vh,6.25rem)] w-full max-w-none lg:h-full" />
        </div>

        <FadeUp delay={0.1} className="sticky top-0 self-start justify-self-end">
          <PhaseNav active={1} />
        </FadeUp>
      </div>
    </SlideShell>
  )
}

function Slide05Problem01() {
  return (
    <SlideShell tone="white">
      <div className="grid h-full grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="flex min-h-0 min-w-0 flex-col">
          <FadeUp>
            <p className={OVERLINE}>Problems</p>
            <h2 className={`${TITLE} mt-3`}>The Core Challenge: Restrictive MVP</h2>
            <p className={`${PROSE} mt-4 max-w-3xl`}>
              This transformation began by investigating critical user complaints regarding the
              MVP&apos;s article editor. Analyzing user feedback revealed deeper issues: a
              paralyzing lack of editing tools and devastating data loss.
            </p>
          </FadeUp>
          <FadeUp delay={0.12} className="mt-8 grid min-h-0 flex-1 grid-cols-1 items-stretch gap-[44px] lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <DeckImage
              src="/piikai/problem1.png"
              alt="Bare-minimum editing tools in the MVP"
              caption="Problem 01 · Lack of editing tools"
              className="h-full min-h-[min(36vh,18rem)]"
            />
            <div className="self-center">
              <p className={FEATURE_TITLE}>01 · Bare-minimum toolkit</p>
              <p className={`${PROSE} mt-3 m-0`}>
                The editing tool only performed the bare minimum. Creators asked for dividers, font
                size, font selection, and styling — essentials they expected from a writing product.
              </p>
            </div>
          </FadeUp>
        </div>
        <FadeUp delay={0.1} className="sticky top-0 self-start justify-self-end">
          <PhaseNav active={1} />
        </FadeUp>
      </div>
    </SlideShell>
  )
}

function Slide05Problem02() {
  return (
    <SlideShell tone="white">
      <div className="grid h-full grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="flex min-h-0 min-w-0 flex-col">
          <FadeUp>
            <p className={OVERLINE}>Problems · 02</p>
            <h2 className={`${TITLE} mt-3`}>660px text area</h2>
          </FadeUp>
          <FadeUp delay={0.12} className="mt-8 grid min-h-0 flex-1 grid-cols-1 items-stretch gap-[44px] lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <DeckImage
              src="/piikai/problem2.png"
              alt="Narrow 660px editor text area"
              caption="Problem 02 · Narrow canvas"
              className="h-full min-h-[min(36vh,18rem)]"
            />
            <div className="self-center">
              <p className={FEATURE_TITLE}>02 · Narrow canvas</p>
              <p className={`${PROSE} mt-3 m-0`}>
                While the industry standard is ~700px, the MVP editor was only 660px.
              </p>
            </div>
          </FadeUp>
        </div>
        <FadeUp delay={0.1} className="sticky top-0 self-start justify-self-end">
          <PhaseNav active={1} />
        </FadeUp>
      </div>
    </SlideShell>
  )
}

function Slide05Problem03() {
  return (
    <SlideShell tone="white">
      <div className="grid h-full grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
        <FadeUp className="flex min-h-[40vh] max-w-3xl flex-col justify-center">
          <p className={OVERLINE}>Problems · 03</p>
          <h2 className={`${TITLE} mt-3`}>No draft save · The timeout catastrophe</h2>
          <p className={`${PROSE} mt-6`}>
            One creator took a day off work to write a complex AI article, only to lose everything
            due to a security auto-logout. Without save-draft, asynchronous writing was unsafe — a
            critical flaw for the next phase.
          </p>
        </FadeUp>
        <FadeUp delay={0.1} className="sticky top-0 self-start justify-self-end">
          <PhaseNav active={1} />
        </FadeUp>
      </div>
    </SlideShell>
  )
}

function Slide06Research() {
  return (
    <SlideShell tone="lead">
      <div className="grid h-full grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="flex min-h-0 min-w-0 flex-col gap-6">
          <FadeUp>
            <p className={OVERLINE}>Research</p>
            <h2 className={`${TITLE} mt-3`}>Why Do Our Users Want More Features?</h2>
          </FadeUp>

          <FadeUp delay={0.08} className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="border border-[#c0bcb0] px-4 py-4 dark:border-white/15">
              <p className={`${META_SUIT} text-black/45 dark:text-white/45`}>01 · Method</p>
              <p className={`${FEATURE_TITLE} mt-3`}>Naver Blog analysis</p>
              <p className={`${PROSE} mt-2 m-0`}>
                Studied Korea&apos;s dominant publishing platform — a visible, exhaustive editing suite
                that has shaped creator expectations for decades.
              </p>
            </div>
            <div className="border border-[#c0bcb0] px-4 py-4 dark:border-white/15">
              <p className={`${META_SUIT} text-black/45 dark:text-white/45`}>02 · Finding</p>
              <p className={`${FEATURE_TITLE} mt-3`}>Minimalism ≠ power</p>
              <p className={`${PROSE} mt-2 m-0`}>
                For Korean users, minimalism often reads as a lack of functionality. They expect a
                &quot;versatile toolbox&quot; with high-density, high-precision control.
              </p>
            </div>
            <div className="border border-[#c0bcb0] px-4 py-4 dark:border-white/15">
              <p className={`${META_SUIT} text-black/45 dark:text-white/45`}>03 · Pivot</p>
              <p className={`${FEATURE_TITLE} mt-3`}>Design objective</p>
              <p className={`${PROSE} mt-2 m-0`}>
                Shifted from a simple UI tweak to building a{' '}
                <strong className="font-bold">high-density, fail-safe creative environment.</strong>
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.14} className="min-h-0 min-w-0 flex-1">
            <DeckImage
              src="/piikai/naver.png"
              alt="Naver Blog editor research reference"
              caption="Research · Naver Blog mental model"
              className="h-full w-full"
            />
          </FadeUp>
        </div>
        <FadeUp delay={0.1} className="sticky top-0 self-start justify-self-end">
          <PhaseNav active={1} />
        </FadeUp>
      </div>
    </SlideShell>
  )
}

function SlideFinalSolution() {
  const pillars = [
    {
      index: '01',
      title: 'More Editing Tools',
      body: 'A variety of editing tools are now available — high-density formatting and rich media blocks for technical creators.',
    },
    {
      index: '02',
      title: 'Wider Text Area',
      body: 'Maximum width increased to 1080px — a scalable canvas that replaces the restrictive 660px MVP layout.',
    },
    {
      index: '03',
      title: 'Save-Draft Feature',
      body: 'Creators can save drafts anytime while writing — a fail-safe that protects work through auto-logout.',
    },
  ] as const

  return (
    <SlideShell tone="navy">
      <div className="grid h-full grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="flex min-h-0 min-w-0 flex-col justify-center gap-8">
          <FadeUp>
            <p className={`${OVERLINE} text-yellow-300`}>Final Solution</p>
            <h2 className={`${TITLE} mt-3 text-white`}>Three pillars of the redesign</h2>
            <p className={`${PROSE} mt-4 max-w-3xl text-white/80`}>
              The restrictive MVP became a professional-grade creative workspace through three
              focused interventions — each tied directly to a creator pain point.
            </p>
          </FadeUp>
          <FadeUp delay={0.12} className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {pillars.map((pillar) => (
              <div key={pillar.index} className="border border-white/20 px-4 py-4">
                <p className="flex items-start gap-3">
                  <span className={`${FEATURE_NUM} text-yellow-300`}>
                    {pillar.index}
                  </span>
                  <span className={`${FEATURE_TITLE} text-white`}>{pillar.title}</span>
                </p>
                <p className={`${PROSE} mt-3 m-0 pl-9 text-white/70`}>{pillar.body}</p>
              </div>
            ))}
          </FadeUp>
        </div>
        <FadeUp delay={0.1} className="sticky top-0 self-start justify-self-end">
          <PhaseNav active={2} onDark />
        </FadeUp>
      </div>
    </SlideShell>
  )
}

function Slide07Solution01() {
  const features = [
    {
      title: 'High-Density Formatting',
      description:
        'Introduced robust text formatting options, font size adjustments, and precise styling controls to give creators immediate, high-precision control over their narratives.',
    },
    {
      title: 'Rich Media Integration',
      description:
        'Integrated specialized blocks specifically designed for technical creators, including Code Block support, Media Captioning, and Interactive Polling features.',
    },
  ] as const

  return (
    <SlideShell tone="navy">
      <div className="grid h-full grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="flex min-h-0 min-w-0 flex-col gap-6">
          <FadeUp>
            <p className={`${OVERLINE} text-yellow-300`}>Unpacking the Solution 01</p>
            <h2 className={`${TITLE} mt-3 text-white`}>
              The “More is More” Editor Architecture
            </h2>
            <p className={`${PROSE} mt-4 max-w-3xl text-white/80`}>
              To align with the local mental model, I abandoned the restrictive North-American style
              minimalism and architected a comprehensive, professional-grade toolkit.
            </p>
          </FadeUp>

          <FadeUp delay={0.1} className="flex min-w-0 flex-col gap-6">
            <figure className="relative m-0 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
              {features.map((feature, i) => (
                <figcaption
                  key={feature.title}
                  className={`m-0 flex flex-row items-start gap-3 ${FEATURE_CAPTION} text-white/75`}
                >
                  <span className={`${FEATURE_NUM} text-yellow-300`}>{1 + i}</span>
                  <span className="min-w-0">
                    <strong className="block font-bold uppercase tracking-[-0.02em] text-white opacity-90">
                      {feature.title}
                    </strong>
                    <span className="mt-1 block font-normal">{feature.description}</span>
                  </span>
                </figcaption>
              ))}
            </figure>

            <figure className="relative m-0 w-full min-w-0 self-stretch">
              <div className="flex w-full gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {EDITOR_TOOL_CLIPS.map((clip) => (
                  <div
                    key={clip.src}
                    className="flex w-[calc((100%-1rem)/2)] min-w-[calc((100%-1rem)/2)] shrink-0 flex-col gap-3 sm:w-[calc((100%-2rem)/3)] sm:min-w-[calc((100%-2rem)/3)] lg:w-[calc((100%-3rem)/4)] lg:min-w-[calc((100%-3rem)/4)]"
                  >
                    <div className="flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-none bg-white">
                      <video
                        src={clip.src}
                        className="h-full w-full object-contain"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    </div>
                    <p className={`m-0 ${FEATURE_TITLE} tracking-tight text-white`}>
                      {clip.title}
                    </p>
                  </div>
                ))}
              </div>
            </figure>
          </FadeUp>
        </div>
        <FadeUp delay={0.1} className="sticky top-0 self-start justify-self-end">
          <PhaseNav active={2} onDark />
        </FadeUp>
      </div>
    </SlideShell>
  )
}

function Slide08Solution02() {
  const features = [
    {
      title: 'Breaking the MVP Constraints',
      description:
        'The original text area was confined to a narrow 660px (below the 700px industry standard). I expanded the maximum width to 1080px, providing a scalable and comfortable reading/writing layout.',
    },
  ] as const

  return (
    <SlideShell tone="navy2">
      <div className="grid h-full grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="flex min-h-0 min-w-0 flex-col gap-6">
          <FadeUp>
            <p className={`${OVERLINE} text-yellow-300`}>Unpacking the Solution 02</p>
            <h2 className={`${TITLE} mt-3 text-white`}>Expanding to a 1080px Canvas</h2>
            <p className={`${PROSE} mt-4 max-w-3xl text-white/80`}>
              Knowledge sharing shouldn&apos;t feel claustrophobic. When creators write an article,
              they need spatial freedom.
            </p>
          </FadeUp>

          <FadeUp
            delay={0.12}
            className="min-h-0 flex-1 grid grid-cols-1 items-stretch gap-[28px] md:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]"
          >
            <figure className="relative m-0 h-full min-h-0 min-w-0 md:order-1">
              <DeckVideo src="/piikai/max-width-faster.mp4" playbackRate={0.7} onDark />
            </figure>
            <figure className="relative m-0 flex min-w-0 flex-col items-stretch gap-3 self-center md:order-2">
              {features.map((feature, i) => (
                <figcaption
                  key={feature.title}
                  className={`flex flex-row items-start gap-3 ${FEATURE_CAPTION} text-white/75 ${
                    i > 0 ? 'mt-[clamp(0.15rem,0.4vw,0.25rem)]' : ''
                  }`}
                >
                  <span className={`${FEATURE_NUM} text-yellow-300`}>{3 + i}</span>
                  <span className="min-w-0">
                    <strong className="block font-bold uppercase tracking-[-0.02em] text-white opacity-90">
                      {feature.title}
                    </strong>
                    <span className="mt-1 block font-normal">{feature.description}</span>
                  </span>
                </figcaption>
              ))}
            </figure>
          </FadeUp>
        </div>
        <FadeUp delay={0.1} className="sticky top-0 self-start justify-self-end">
          <PhaseNav active={2} onDark />
        </FadeUp>
      </div>
    </SlideShell>
  )
}

function Slide09Solution03() {
  const features = [
    {
      title: 'Continuous Saving Architecture',
      description:
        'Engineered a seamless Save-Draft feature that allows creators to archive their work-in-progress at any time.',
    },
    {
      title: 'Security vs. Usability',
      description:
        "This system perfectly balances the platform's strict auto-logout security requirements with the creator's need for a safe, asynchronous writing process.",
    },
  ] as const

  return (
    <SlideShell tone="navy3">
      <div className="grid h-full grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="flex min-h-0 min-w-0 flex-col gap-6">
          <FadeUp>
            <p className={`${OVERLINE} text-yellow-300`}>Unpacking the Solution 03</p>
            <h2 className={`${TITLE} mt-3 text-white`}>Fail-Safe Draft System</h2>
            <p className={`${PROSE} mt-4 max-w-3xl text-white/80`}>
              To prevent the devastating loss of user data, implementing a robust saving architecture
              was non-negotiable.
            </p>
          </FadeUp>

          <FadeUp
            delay={0.12}
            className="min-h-0 flex-1 grid grid-cols-1 items-stretch gap-[28px] md:grid-cols-[minmax(0,3fr)_minmax(0,7fr)]"
          >
            <figure className="relative m-0 flex min-w-0 flex-col items-stretch gap-3 self-center">
              {features.map((feature, i) => (
                <figcaption
                  key={feature.title}
                  className={`flex flex-row items-start gap-3 ${FEATURE_CAPTION} text-white/75 ${
                    i > 0 ? 'mt-[clamp(0.15rem,0.4vw,0.25rem)]' : ''
                  }`}
                >
                  <span className={`${FEATURE_NUM} text-yellow-300`}>{4 + i}</span>
                  <span className="min-w-0">
                    <strong className="block font-bold uppercase tracking-[-0.02em] text-white opacity-90">
                      {feature.title}
                    </strong>
                    <span className="mt-1 block font-normal">{feature.description}</span>
                  </span>
                </figcaption>
              ))}
            </figure>
            <figure className="relative m-0 h-full min-h-0 min-w-0">
              <DeckVideo src="/piikai/Save-Draft%20faster.mp4" playbackRate={0.7} onDark />
            </figure>
          </FadeUp>
        </div>
        <FadeUp delay={0.1} className="sticky top-0 self-start justify-self-end">
          <PhaseNav active={2} onDark />
        </FadeUp>
      </div>
    </SlideShell>
  )
}

function Slide11QA() {
  return (
    <SlideShell tone="hero">
      <div className="flex h-full min-h-[50vh] flex-col items-center justify-center text-center">
        <FadeUp>
          <h2 className={DISPLAY_XL}>Q&A</h2>
          <p className={`${OVERLINE} mt-4 text-black/50 dark:text-white/55`}>
            Piik AI · Product Design
          </p>
        </FadeUp>
      </div>
    </SlideShell>
  )
}

const SLIDES: SlideDef[] = [
  { id: '01-title', label: 'Title', render: () => <Slide01Title /> },
  { id: '02-impact', label: 'Impact', render: () => <Slide02Impact /> },
  { id: '04-listening', label: 'Listening', render: () => <Slide04Listening /> },
  { id: '05-problem-01', label: 'Problem 01', render: () => <Slide05Problem01 /> },
  { id: '05-problem-02', label: 'Problem 02', render: () => <Slide05Problem02 /> },
  { id: '05-problem-03', label: 'Problem 03', render: () => <Slide05Problem03 /> },
  { id: '06-research', label: 'Research', render: () => <Slide06Research /> },
  { id: '06b-final', label: 'Final Solution', render: () => <SlideFinalSolution /> },
  { id: '07-solution-01', label: 'Solution 01', render: () => <Slide07Solution01 /> },
  { id: '08-solution-02', label: 'Solution 02', render: () => <Slide08Solution02 /> },
  { id: '09-solution-03', label: 'Solution 03', render: () => <Slide09Solution03 /> },
  { id: '11-qa', label: 'Q&A', render: () => <Slide11QA /> },
]

export function PiikDeck() {
  const { isDark } = usePageTheme()
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  const go = useCallback((next: number) => {
    setIndex((prev) => {
      const clamped = Math.max(0, Math.min(SLIDES.length - 1, next))
      if (clamped === prev) return prev
      setDirection(clamped > prev ? 1 : -1)
      return clamped
    })
  }, [])

  const next = useCallback(() => go(index + 1), [go, index])
  const prev = useCallback(() => go(index - 1), [go, index])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault()
        go(index + 1)
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        go(index - 1)
      } else if (e.key === 'Home') {
        e.preventDefault()
        go(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        go(SLIDES.length - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, index])

  const variants = reduceMotion
    ? { enter: { opacity: 1 }, center: { opacity: 1 }, exit: { opacity: 1 } }
    : {
        enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40, scale: 0.985 }),
        center: { opacity: 1, x: 0, scale: 1 },
        exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -28 : 28, scale: 0.99 }),
      }

  return (
    <div
      className="theme-surface-transition relative flex h-[100dvh] min-h-[100dvh] w-full flex-col overflow-hidden"
      style={{ backgroundColor: isDark ? '#111111' : CREAM }}
    >
      <header className="flex shrink-0 items-center justify-between gap-4 px-[clamp(0.75rem,2vw,1.5rem)] py-[clamp(0.4rem,1vh,0.6rem)]">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/"
            className={`${OVERLINE} text-black/50 no-underline transition-colors hover:text-black dark:text-white/50 dark:hover:text-white`}
          >
            ← Portfolio
          </Link>
          <span className="hidden text-black/20 dark:text-white/25 sm:inline">·</span>
          <nav className="flex items-center gap-1" aria-label="Case study decks">
            <Link
              to="/hovr-deck"
              className={`${META_SUIT} ${CHROME_BTN} border-[#c0bcb0] bg-transparent text-black/70 no-underline transition-colors hover:border-black hover:text-black dark:border-white/25 dark:text-white/65 dark:hover:border-white dark:hover:text-white`}
            >
              HOVR
            </Link>
            <Link
              to="/piik-deck"
              aria-current="page"
              className={`${META_SUIT} ${CHROME_BTN} border-black bg-black text-white no-underline dark:border-white dark:bg-white dark:text-black`}
            >
              Piik AI
            </Link>
          </nav>
        </div>
        <p className={`${BODY_SUIT_CAPS} tabular-nums text-black/40 dark:text-white/40`}>
          {String(index + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')} ·{' '}
          {SLIDES[index]?.label}
        </p>
      </header>

      <main className="relative flex min-h-0 w-full flex-1 flex-col px-3 pb-3 sm:px-5 sm:pb-4">
        <div
          className="relative min-h-0 flex-1 overflow-hidden"
          style={{ backgroundColor: isDark ? '#0c0c0c' : PIIK_STAGE }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={SLIDES[index]!.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: reduceMotion ? 0 : 0.5, ease: EASE_EXPO }}
              className="absolute inset-0 p-3 sm:p-4"
            >
              {SLIDES[index]!.render()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <footer className="flex shrink-0 items-center justify-between gap-3 px-[clamp(0.75rem,2vw,1.5rem)] py-[clamp(0.3rem,0.8vh,0.5rem)]">
        <button
          type="button"
          onClick={prev}
          disabled={index === 0}
          className={`${META_SUIT} ${CHROME_BTN} border-[#c0bcb0] bg-transparent text-black transition-opacity disabled:opacity-30 dark:border-white/20 dark:text-white`}
        >
          Prev
        </button>

        <div className="flex max-w-[55vw] flex-wrap items-center justify-center gap-1 overflow-hidden sm:max-w-none">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Go to slide ${i + 1}: ${slide.label}`}
              aria-current={i === index ? 'true' : undefined}
              onClick={() => go(i)}
              className={`h-[clamp(0.25rem,0.5vw,0.3rem)] rounded-none transition-all ${
                i === index
                  ? 'w-4 bg-black dark:bg-white'
                  : 'w-[clamp(0.25rem,0.5vw,0.3rem)] bg-black/20 hover:bg-black/40 dark:bg-white/20 dark:hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          disabled={index === SLIDES.length - 1}
          className={`${META_SUIT} ${CHROME_BTN} border-[#c0bcb0] bg-transparent text-black transition-opacity disabled:opacity-30 dark:border-white/20 dark:text-white`}
        >
          Next
        </button>
      </footer>
    </div>
  )
}
