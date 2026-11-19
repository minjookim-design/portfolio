import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { usePageTheme } from './context/PageThemeContext'
import { PiikFeedbackEmailCollage } from './PiikFeedbackEmailCollage'
import { PiikImpactStoryGraph } from './TestPiik'
import {
  ErdDeckFadeUp as FadeUp,
  ErdDeckPhaseNav,
  ErdDeckShell,
  ErdDeckSlideChrome,
  ERD_DECK_BODY,
  ERD_DECK_DISPLAY_XL,
  ERD_DECK_META,
  ERD_DECK_OVERLINE,
  ERD_DECK_SUBHEAD,
  ERD_DECK_TITLE,
} from './pages/deck/erdDeckChrome'

/**
 * Standalone Piik AI deck — content from TestPiik / PiikProjectPage.
 * Type / stroke / nav match published HOVR project page system.
 */

const PIIK_STAGE = '#E6EEFF'
const PIIK_NAVY = '#121A2A'
const PIIK_NAVY2 = '#18243A'
const PIIK_NAVY3 = '#22314D'
const PIIK_LEAD = '#F7F9FF'
const HOVR_INK = '#1a1917'
const HOVR_INK_MUTED = 'rgb(26 25 23 / 0.72)'
const HOVR_ACCENT = '#e11d48'
const HOVR_HAIRLINE = 'rgb(26 25 23 / 0.18)'
const HOVR_ON_DARK_INK = '#f2f0e6'
const HOVR_ON_DARK_MUTED = 'rgb(242 240 230 / 0.72)'
const HOVR_ON_DARK_ACCENT = '#fb7185'
const HOVR_ON_DARK_HAIRLINE = 'rgb(242 240 230 / 0.28)'

const TITLE = ERD_DECK_TITLE
const SUBHEAD = ERD_DECK_SUBHEAD
const PROSE = `${ERD_DECK_BODY} [&_p]:pt-[0.35rem] [&_p:first-child]:pt-0 [&_h4]:mt-6 [&_h4]:mb-0 [&_h4]:text-[0.8125rem] [&_h4]:font-normal [&_h4]:uppercase [&_h4]:tracking-[0.06em] [&_h4]:leading-[1.2] [&_h4]:text-[color:var(--erd-hovr-ink)] [&_strong]:font-bold [&_strong]:text-[color:var(--erd-hovr-ink)]`
const META_SUIT = ERD_DECK_META
const OVERLINE = ERD_DECK_OVERLINE
const FEATURE_TITLE = ERD_DECK_META
const FEATURE_CAPTION = ERD_DECK_BODY
const FEATURE_NUM =
  `w-[clamp(1.25rem,2.5vw,1.75rem)] shrink-0 ${ERD_DECK_META} tabular-nums`
const DISPLAY_XL = ERD_DECK_DISPLAY_XL
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

function SlideShell({
  children,
  footer,
  className = '',
  tone = 'cream',
  hero = false,
}: {
  children: ReactNode
  footer?: ReactNode
  className?: string
  tone?: SlideTone
  hero?: boolean
}) {
  const onDark = tone === 'navy' || tone === 'navy2' || tone === 'navy3'
  const bg =
    tone === 'hero'
      ? PIIK_STAGE
      : tone === 'lead'
        ? PIIK_LEAD
        : tone === 'navy'
          ? PIIK_NAVY
          : tone === 'navy2'
            ? PIIK_NAVY2
            : tone === 'navy3'
              ? PIIK_NAVY3
              : '#ffffff'

  const style = onDark
    ? {
        ['--erd-deck-slide-bg' as string]: bg,
        ['--erd-deck-slide-fg' as string]: HOVR_ON_DARK_INK,
        ['--erd-deck-slide-muted' as string]: HOVR_ON_DARK_MUTED,
        ['--erd-deck-slide-accent' as string]: HOVR_ON_DARK_ACCENT,
        ['--erd-deck-slide-hairline' as string]: HOVR_ON_DARK_HAIRLINE,
      }
    : {
        ['--erd-deck-slide-bg' as string]: bg,
        ['--erd-deck-slide-fg' as string]: HOVR_INK,
        ['--erd-deck-slide-muted' as string]: HOVR_INK_MUTED,
        ['--erd-deck-slide-accent' as string]: HOVR_ACCENT,
        ['--erd-deck-slide-hairline' as string]: HOVR_HAIRLINE,
      }

  return (
    <ErdDeckSlideChrome className={className} style={style} footer={footer} hero={hero}>
      {children}
    </ErdDeckSlideChrome>
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
    : 'border-[color:var(--erd-deck-slide-hairline,var(--erd-deck-hairline))] bg-black/5  dark:bg-black/40'
  const captionTone = onDark
    ? 'border-t border-white/20 text-white/50'
    : 'border-t border-[color:var(--erd-deck-slide-hairline,var(--erd-deck-hairline))] text-black/45  dark:text-white/45'

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
    <ErdDeckPhaseNav
      phases={phases}
      active={active}
      onDark={onDark}
      ariaLabel="Piik phases"
    />
  )
}

/* ─── Slides ─────────────────────────────────────────────────────────────── */

const PIIK_HERO_MEDIA = {
  light: '/piikai/Thumbnail-light-sq.mp4',
  dark: '/piikai/Thumbnail-dark-sq.mp4',
} as const

function Slide01Title() {
  const { isDark } = usePageTheme()
  const videoRef = useRef<HTMLVideoElement>(null)
  const heroVideo = PIIK_HERO_MEDIA[isDark ? 'dark' : 'light']

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.src = heroVideo
    video.load()
    void video.play().catch(() => {})
  }, [heroVideo])

  return (
    <SlideShell tone="white" hero>
      <section className="erd-hovr-hero-section erd-shop-row erd-hovr-hero-grid">
        <FadeUp className="erd-shop-square erd-hovr-hero-adjacent-square">
          <div className="erd-shop-square-inner">
            <div className="erd-shop-square-intro">
              <p className="erd-shop-square-name">Piik AI</p>
              <p className="erd-shop-square-greeting">Creator Editor · Product Design</p>
            </div>
            <div className="erd-shop-square-experience">
              <p className="erd-shop-square-experience-label">Overview</p>
              <p className="erd-shop-square-greeting erd-hovr-hero-square-dek">
                Reducing creator complaints by 75%: a high-density, fail-safe editor for an
                early-stage AI knowledge platform.
              </p>
              <ul className="erd-shop-square-experience-list erd-hovr-hero-meta-list">
                <li>
                  <span className="erd-shop-square-experience-role">Focus</span>
                  <span className="erd-shop-square-experience-meta">Creator writing experience</span>
                </li>
                <li>
                  <span className="erd-shop-square-experience-role">Outcome</span>
                  <span className="erd-shop-square-experience-meta">75% fewer editor complaints</span>
                </li>
              </ul>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.08} className="erd-shop-card erd-hovr-hero-card">
          <div className="erd-shop-card-media">
            <video
              ref={videoRef}
              className="erd-shop-card-video erd-hovr-hero-video"
              src={heroVideo}
              muted
              playsInline
              loop
              autoPlay
              preload="auto"
              aria-label="Piik AI preview"
            />
          </div>
        </FadeUp>
      </section>
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
            <div className="border border-[color:var(--erd-deck-slide-hairline,var(--erd-deck-hairline))] px-4 py-4 ">
              <p className={`${META_SUIT} text-[color:var(--erd-hovr-ink-muted)]`}>01 · Method</p>
              <p className={`${FEATURE_TITLE} mt-3`}>Naver Blog analysis</p>
              <p className={`${PROSE} mt-2 m-0`}>
                Studied Korea&apos;s dominant publishing platform — a visible, exhaustive editing suite
                that has shaped creator expectations for decades.
              </p>
              <div className="mt-3 min-w-0">
                <img
                  src="/piikai/medium-editing-tools.png"
                  alt="Medium editing tools"
                  className="block h-auto w-1/2 max-w-full object-contain object-left"
                  decoding="async"
                />
                <p
                  className={`${META_SUIT} mt-2 m-0 text-[color:var(--erd-hovr-ink-muted)]`}
                >
                  For example, Medium: Editing Tools
                </p>
              </div>
            </div>
            <div className="border border-[color:var(--erd-deck-slide-hairline,var(--erd-deck-hairline))] px-4 py-4 ">
              <p className={`${META_SUIT} text-[color:var(--erd-hovr-ink-muted)]`}>02 · Finding</p>
              <p className={`${FEATURE_TITLE} mt-3`}>Minimalism ≠ power</p>
              <p className={`${PROSE} mt-2 m-0`}>
                For Korean users, minimalism often reads as a lack of functionality. They expect a
                &quot;versatile toolbox&quot; with high-density, high-precision control.
              </p>
            </div>
            <div className="border border-[color:var(--erd-deck-slide-hairline,var(--erd-deck-hairline))] px-4 py-4 ">
              <p className={`${META_SUIT} text-[color:var(--erd-hovr-ink-muted)]`}>03 · Pivot</p>
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
            <p className={`${OVERLINE} text-[color:var(--erd-hovr-accent)]`}>Final Solution</p>
            <h2 className={`${TITLE} mt-3 !text-white`}>Three pillars of the redesign</h2>
            <p className={`${PROSE} mt-4 max-w-3xl text-white/80`}>
              The restrictive MVP became a professional-grade creative workspace through three
              focused interventions — each tied directly to a creator pain point.
            </p>
          </FadeUp>
          <FadeUp delay={0.12} className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {pillars.map((pillar) => (
              <div key={pillar.index} className="border border-white/20 px-4 py-4">
                <p className="flex items-start gap-3">
                  <span className={`${FEATURE_NUM} text-[color:var(--erd-hovr-accent)]`}>
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
  return (
    <SlideShell tone="navy">
      <div className="grid h-full grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="flex min-h-0 min-w-0 flex-col gap-6">
          <FadeUp>
            <p className={`${OVERLINE} text-[color:var(--erd-hovr-accent)]`}>Unpacking the Solution 01</p>
            <h2 className={`${TITLE} mt-3 !text-white`}>
              The “More is More” Editor Architecture
            </h2>
            <p className={`${PROSE} mt-4 max-w-3xl text-white/80`}>
              To align with the local mental model, I abandoned the restrictive North-American style
              minimalism and architected a comprehensive, professional-grade toolkit.
            </p>
          </FadeUp>

          <FadeUp delay={0.1} className="flex min-w-0 flex-col gap-6">
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
            <p className={`${OVERLINE} text-[color:var(--erd-hovr-accent)]`}>Unpacking the Solution 02</p>
            <h2 className={`${TITLE} mt-3 !text-white`}>Expanding to a 1080px Canvas</h2>
            <p className={`${PROSE} mt-4 max-w-3xl text-white/80`}>
              When creators write an article, they need spatial freedom.
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
            <p className={`${OVERLINE} text-[color:var(--erd-hovr-accent)]`}>Unpacking the Solution 03</p>
            <h2 className={`${TITLE} mt-3 !text-white`}>Fail-Safe Draft System</h2>
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

  return (
    <ErdDeckShell
      tabs={[
        { id: 'hovr', label: 'HOVR', href: '/hovr-deck' },
        { id: 'piik', label: 'Piik AI', href: '/piik-deck', active: true },
      ]}
      counter={`${String(index + 1).padStart(2, '0')} / ${String(SLIDES.length).padStart(2, '0')} · ${SLIDES[index]?.label ?? ''}`}
      canPrev={index > 0}
      canNext={index < SLIDES.length - 1}
      onPrev={prev}
      onNext={next}
      direction={direction}
      slideKey={SLIDES[index]!.id}
      stageStyle={{ backgroundColor: PIIK_STAGE }}
      dots={SLIDES.map((slide, i) => ({
        id: slide.id,
        label: slide.label,
        active: i === index,
        onSelect: () => go(i),
      }))}
    >
      {SLIDES[index]!.render()}
    </ErdDeckShell>
  )
}
