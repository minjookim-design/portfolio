import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { usePageTheme } from './context/PageThemeContext'
import {
  ErdDeckFadeUp as FadeUp,
  ErdDeckPhaseNav,
  ErdDeckShell,
  ErdDeckSlideChrome,
  ERD_DECK_BODY,
  ERD_DECK_DISPLAY_SIZE,
  ERD_DECK_DISPLAY_XL,
  ERD_DECK_META,
  ERD_DECK_OVERLINE,
  ERD_DECK_TITLE,
} from './pages/deck/erdDeckChrome'

/**
 * Standalone HOVR Driver Approval deck — rebuilt from
 * `HOVR driver approval system.pdf` (22 slides).
 * Type / stroke / nav match published `/hovr` project page.
 */

const HOVR_MINT = '#E4F4DE'
const HOVR_GREEN = '#2b3531'
const HOVR_INK = '#1a1917'
const HOVR_INK_MUTED = 'rgb(26 25 23 / 0.72)'
const HOVR_ACCENT = '#e11d48'
const HOVR_HAIRLINE = 'rgb(26 25 23 / 0.18)'
const HOVR_ON_DARK_INK = '#f2f0e6'
const HOVR_ON_DARK_MUTED = 'rgb(242 240 230 / 0.72)'
const HOVR_ON_DARK_ACCENT = '#fb7185'
const HOVR_ON_DARK_HAIRLINE = 'rgb(242 240 230 / 0.28)'

const TITLE = ERD_DECK_TITLE
const PROSE = `${ERD_DECK_BODY} [&_p]:pt-[0.35rem] [&_p:first-child]:pt-0 [&_h4]:mt-6 [&_h4]:mb-0 [&_h4]:text-[0.8125rem] [&_h4]:font-normal [&_h4]:uppercase [&_h4]:tracking-[0.06em] [&_h4]:leading-[1.2] [&_h4]:text-[color:var(--erd-hovr-ink)] [&_strong]:font-bold [&_strong]:text-[color:var(--erd-hovr-ink)]`
const META_SUIT = ERD_DECK_META
const BODY_SUIT_CAPS = ERD_DECK_META
const OVERLINE = ERD_DECK_OVERLINE
const FEATURE_TITLE = `${ERD_DECK_META}`
const FEATURE_CAPTION = ERD_DECK_BODY
const FEATURE_NUM =
  `w-[clamp(1.25rem,2.5vw,1.75rem)] shrink-0 ${ERD_DECK_META} tabular-nums`
const DISPLAY = ERD_DECK_DISPLAY_SIZE
const DISPLAY_XL = ERD_DECK_DISPLAY_XL
const MEDIA_FILL =
  'block h-full w-full max-h-full max-w-full object-contain object-center'

const UX_PHASES = [
  '1. Product Analysis',
  '2. User Interview',
  '3. Developer Meetings',
] as const

type UxPhaseIndex = 0 | 1 | 2

type SlideDef = {
  id: string
  label: string
  render: () => ReactNode
}

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
  tone?: 'cream' | 'white' | 'mint' | 'green'
  hero?: boolean
}) {
  const style =
    tone === 'green'
      ? {
          ['--erd-deck-slide-bg' as string]: HOVR_GREEN,
          ['--erd-deck-slide-fg' as string]: HOVR_ON_DARK_INK,
          ['--erd-deck-slide-muted' as string]: HOVR_ON_DARK_MUTED,
          ['--erd-deck-slide-accent' as string]: HOVR_ON_DARK_ACCENT,
          ['--erd-deck-slide-hairline' as string]: HOVR_ON_DARK_HAIRLINE,
        }
      : tone === 'mint'
        ? {
            ['--erd-deck-slide-bg' as string]: HOVR_MINT,
            ['--erd-deck-slide-fg' as string]: HOVR_INK,
            ['--erd-deck-slide-muted' as string]: HOVR_INK_MUTED,
            ['--erd-deck-slide-accent' as string]: HOVR_ACCENT,
            ['--erd-deck-slide-hairline' as string]: HOVR_HAIRLINE,
          }
        : {
            ['--erd-deck-slide-bg' as string]: '#ffffff',
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

function ImagePlaceholder({
  alt,
  caption,
  aspectClass = 'aspect-video',
  className = '',
}: {
  alt: string
  caption: string
  aspectClass?: string
  className?: string
}) {
  return (
    <figure
      className={`flex flex-col overflow-hidden rounded-none border border-[color:var(--erd-deck-slide-hairline,var(--erd-deck-hairline))] bg-zinc-100  dark:bg-zinc-800/70 ${className}`}
      role="img"
      aria-label={alt}
    >
      <div
        className={`flex ${aspectClass} w-full items-center justify-center bg-zinc-200/70 px-5 dark:bg-zinc-900/50`}
      >
        <p className={`${BODY_SUIT_CAPS} max-w-[42ch] text-center text-zinc-500 dark:text-zinc-400`}>
          {caption}
        </p>
      </div>
      <figcaption
        className={`${OVERLINE} border-t border-[color:var(--erd-deck-slide-hairline,var(--erd-deck-hairline))] px-3 py-2 text-black/45  dark:text-white/45`}
      >
        Placeholder · {alt}
      </figcaption>
    </figure>
  )
}

function UxPhaseNav({ active }: { active: UxPhaseIndex }) {
  return <ErdDeckPhaseNav phases={UX_PHASES} active={active} ariaLabel="UX phases" />
}

function InsightBadge({ children }: { children: ReactNode }) {
  return <span className={`${META_SUIT} inline-block`}>{children}</span>
}

const HOVR_HERO_MEDIA = {
  light: '/hovr/Thumbnail-light-sq.mp4',
  dark: '/hovr/Thumbnail-dark-sq.mp4',
} as const

function Slide01Title() {
  const { isDark } = usePageTheme()
  const videoRef = useRef<HTMLVideoElement>(null)
  const heroVideo = HOVR_HERO_MEDIA[isDark ? 'dark' : 'light']

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
              <p className="erd-shop-square-name">HOVR Admin</p>
              <p className="erd-shop-square-greeting">
                Driver Approval System · UX/UI Designer
              </p>
            </div>
            <div className="erd-shop-square-experience">
              <p className="erd-shop-square-experience-label">Overview</p>
              <p className="erd-shop-square-greeting erd-hovr-hero-square-dek">
                Product Design · UX/UI Design · Internal admin tools for driver onboarding
                approval.
              </p>
              <ul className="erd-shop-square-experience-list erd-hovr-hero-meta-list">
                <li>
                  <span className="erd-shop-square-experience-role">Focus</span>
                  <span className="erd-shop-square-experience-meta">Driver Approval System</span>
                </li>
                <li>
                  <span className="erd-shop-square-experience-role">Role</span>
                  <span className="erd-shop-square-experience-meta">UX/UI Designer @ HOVR</span>
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
              aria-label="HOVR Admin preview"
            />
          </div>
        </FadeUp>
      </section>
    </SlideShell>
  )
}

const PROCESS_PHASE_1 = [
  {
    title: 'Product Analysis',
    body: 'Conducted a thorough analysis of the existing product to identify issues based on reported pain points collected by the support team during their use of the current website.',
  },
] as const

const PROCESS_RESEARCH = [
  {
    title: 'User Interview',
    body: 'Had interviews and meetings with the support team, the primary users of the admin website, to gather valuable feedback and prioritize key tasks for improvement.',
  },
  {
    title: 'Developer Meetings',
    body: 'Collaborated with developers to understand the automation process and assess the accuracy of scanned documents by comparing them with the actual written information.',
  },
] as const

const PROCESS_PHASE_2 = [
  {
    title: 'Solution Sketch',
    body: 'Based on the gathered insights, I sketched out the solution and refined its validity through multiple design team meetings.',
  },
  {
    title: 'UI Design',
    body: 'Determining that the solution effectively aligned with the project goals, I completed the high-fidelity design.',
  },
  {
    title: 'Present',
    body: 'The finalized design was presented to stakeholders, including the support team (though I was not the one presenting), and received highly positive feedback.',
  },
] as const

function ProcessCard({ title, body, delay }: { title: string; body: string; delay: number }) {
  return (
    <FadeUp
      delay={delay}
      className="flex min-h-0 flex-col border border-[color:var(--erd-deck-slide-hairline,var(--erd-deck-hairline))] bg-white  dark:bg-[#1c1c1c]"
    >
      <div className={`${FEATURE_TITLE} border-b border-[color:var(--erd-deck-slide-hairline,var(--erd-deck-hairline))] bg-zinc-100 px-3 py-2  dark:bg-zinc-800`}>
        {title}
      </div>
      <p className={`${PROSE} px-3 py-2.5`}>
        {body}
      </p>
    </FadeUp>
  )
}

function Slide03Process() {
  return (
    <SlideShell tone="white">
      <FadeUp>
        <h2 className={TITLE}>
          Process
        </h2>
      </FadeUp>

      <div className="mt-8 flex flex-col gap-8">
        <div>
          <FadeUp delay={0.08}>
            <span
              className={`${OVERLINE} inline-block rounded-none border border-violet-300/80 bg-violet-50 px-3 py-1 !text-black dark:border-violet-400/40 dark:bg-violet-950/40 dark:!text-black`}
            >
              Week 1, 2 · Phase 1
            </span>
          </FadeUp>
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            {PROCESS_PHASE_1.map((s, i) => (
              <ProcessCard key={s.title} {...s} delay={0.12 + i * 0.07} />
            ))}
            <div className="flex flex-col gap-2">
              {PROCESS_RESEARCH.map((s, i) => (
                <ProcessCard key={s.title} {...s} delay={0.26 + i * 0.07} />
              ))}
            </div>
          </div>
        </div>

        <div>
          <FadeUp delay={0.35}>
            <span
              className={`${OVERLINE} inline-block rounded-none border border-violet-300/80 bg-violet-50 px-3 py-1 !text-black dark:border-violet-400/40 dark:bg-violet-950/40 dark:!text-black`}
            >
              Week 3 ~ · Phase 2
            </span>
          </FadeUp>
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
            {PROCESS_PHASE_2.map((s, i) => (
              <ProcessCard key={s.title} {...s} delay={0.4 + i * 0.07} />
            ))}
          </div>
        </div>
      </div>
    </SlideShell>
  )
}

function Slide04UxIndex() {
  return (
    <SlideShell tone="white">
      <div className="flex h-full min-h-[50vh] flex-col justify-center">
        <FadeUp>
          <h2
            className={DISPLAY_XL}
          >
            UX
          </h2>
        </FadeUp>
        <FadeUp delay={0.15} className="mt-8 flex flex-col gap-2">
          {UX_PHASES.map((label, i) => (
            <FadeUp
              key={label}
              delay={0.06 + i * 0.05}
              className={`${META_SUIT} w-fit rounded-full border border-[color:var(--erd-deck-slide-hairline,var(--erd-deck-hairline))] px-4 py-2 `}
            >
              {label}
            </FadeUp>
          ))}
        </FadeUp>
      </div>
    </SlideShell>
  )
}

function Slide07LookAtProduct() {
  return (
    <SlideShell tone="white">
      <div className="grid h-full grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="flex min-h-0 flex-col gap-6">
          <FadeUp>
            <h2 className={`${TITLE} whitespace-nowrap`}>
              Let&apos;s look at the product we have
            </h2>
          </FadeUp>
          <FadeUp delay={0.12} className="min-h-0 flex-1">
            <figure className="m-0 flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-none border border-[color:var(--erd-deck-slide-hairline,var(--erd-deck-hairline))] ">
              <div className="min-h-0 min-w-0 flex-1 overflow-hidden bg-black/5 dark:bg-black/40">
                <img
                  src="/hovr/product-research.jpg"
                  alt="Existing HOVR Admin driver approval product surface"
                  className={MEDIA_FILL}
                />
              </div>
            </figure>
          </FadeUp>
        </div>
        <FadeUp delay={0.1} className="sticky top-0 self-start justify-self-end">
          <UxPhaseNav active={0} />
        </FadeUp>
      </div>
    </SlideShell>
  )
}

function Slide08DriverApprovalPage() {
  return (
    <SlideShell tone="white">
      <div className="grid h-full min-h-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="flex min-h-0 min-w-0 flex-col gap-6">
          <FadeUp>
            <h2 className={TITLE}>Driver approval page</h2>
          </FadeUp>

          <div className="grid w-full grid-cols-1 items-stretch gap-6 md:grid-cols-3 md:grid-rows-[auto_1fr]">
            <CatalystQuoteCard index={1} title="Click-to-View Friction" delay={0.04}>
              <p className="m-0">
                The support team currently has to click the &quot;Click to View&quot; button to access
                each driver&apos;s document image, requiring them to repeat this process for all nine
                documents per driver. This results in significant time loss when reviewing multiple
                drivers.
              </p>
            </CatalystQuoteCard>
            <CatalystQuoteCard index={2} title="Popup Approval Flow" delay={0.1}>
              <p className="m-0">
                Clicking the &quot;View&quot; button opens a popup displaying the document information,
                where the support person decides whether to approve or reject it. This process
                requires three clicks per document.
              </p>
            </CatalystQuoteCard>
            <CatalystQuoteCard index={3} title="Opportunity: Zero-Click Preview" delay={0.16}>
              <p className="m-0">
                To speed up the approval process, document images should be visible without requiring
                a click. If the document image is directly visible on the detail page instead of in a
                popup, the extra step becomes unnecessary — reducing the approval process by one click
                per document.
              </p>
            </CatalystQuoteCard>
          </div>

          <FadeUp delay={0.2} className="min-h-0 flex-1">
            <figure className="m-0 flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-none border border-[color:var(--erd-deck-slide-hairline,var(--erd-deck-hairline))] ">
              <div className="min-h-0 min-w-0 flex-1 overflow-hidden bg-black/5 dark:bg-black/40">
                <video
                  src="/hovr/blured%20process1.mp4"
                  className={MEDIA_FILL}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                />
              </div>
            </figure>
          </FadeUp>
        </div>
        <FadeUp delay={0.1} className="sticky top-0 self-start justify-self-end">
          <UxPhaseNav active={0} />
        </FadeUp>
      </div>
    </SlideShell>
  )
}

function Slide10UserInterview() {
  return (
    <SlideShell tone="white">
      <div className="grid h-full min-h-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="flex min-h-0 min-w-0 flex-col">
          <FadeUp>
            <h2 className={TITLE}>User Interview</h2>
            <p className={`${PROSE} mt-6 max-w-2xl`}>
              The design team arranged interviews with developers and support team representatives,
              the primary users of the admin panel for driver approvals.
            </p>
          </FadeUp>

          <div className="mt-[6.25rem] flex min-h-0 flex-1 items-center">
            <div className="grid w-full grid-cols-1 items-stretch gap-6 md:grid-cols-3 md:grid-rows-[auto_1fr]">
              <FindingBox
                index={1}
                title="Key Support team(USER) Painpoints"
                items={KEY_PAIN_POINTS}
              />
              <CatalystQuoteCard index={2} title="Action: Technical Feasibility Sync" delay={0.08}>
                <p className="m-0">
                  Drivers already use in-app OCR when uploading documents — a photo is scanned and
                  fields fill in automatically. I asked whether that same capability could be
                  brought into the driver approval system to speed up review.
                </p>
              </CatalystQuoteCard>
              <CatalystQuoteCard index={3} title="Finding: OCR Automation Potential" delay={0.16}>
                <p className="m-0">
                  <strong>90%+ Auto-Scanning Accuracy:</strong> Engineering confirmed the OCR
                  technology will guarantee at least 90% accuracy for driver-uploaded documents,
                  creating an opportunity for automation.
                </p>
              </CatalystQuoteCard>
            </div>
          </div>
        </div>
        <FadeUp delay={0.1} className="sticky top-0 self-start justify-self-end">
          <UxPhaseNav active={1} />
        </FadeUp>
      </div>
    </SlideShell>
  )
}

function BlueprintBorderBox({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`relative min-h-0 min-w-0 flex-1 overflow-visible bg-transparent p-5 ${className}`}>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-[1px] bg-[color:var(--erd-deck-slide-hairline,var(--erd-deck-hairline))]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-[1px] bg-[color:var(--erd-deck-slide-hairline,var(--erd-deck-hairline))]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-[color:var(--erd-deck-slide-hairline,var(--erd-deck-hairline))]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[1px] bg-[color:var(--erd-deck-slide-hairline,var(--erd-deck-hairline))]"
      />
      {children}
    </div>
  )
}

function FindingBox({
  index,
  title,
  items,
  delay = 0,
}: {
  index: number
  title: string
  items: readonly { label: string; body: string }[]
  delay?: number
}) {
  const num = String(index).padStart(2, '0')

  return (
    <figure className="relative m-0 flex h-full min-h-0 min-w-0 flex-col gap-4 overflow-visible md:row-span-2 md:grid md:grid-rows-subgrid">
      <FadeUp
        delay={delay}
        className={`flex w-full shrink-0 flex-row items-start gap-3 ${FEATURE_CAPTION}`}
      >
        <span className={`${FEATURE_NUM} text-zinc-400`}>
          {num}
        </span>
        <h3 className="m-0 min-w-0 uppercase text-black dark:text-[#f2f2f2]">
          {title}
        </h3>
      </FadeUp>

      <FadeUp delay={delay + 0.1} className="flex min-h-0 flex-1 flex-col md:h-full">
        <BlueprintBorderBox className="flex h-full min-h-0 flex-col">
          <ul className={`${PROSE} m-0 list-none space-y-2 p-0`}>
            {items.map((item) => (
              <li key={item.label}>
                <strong className="font-bold text-black dark:text-[#f2f2f2]">{item.label}:</strong>{' '}
                {item.body}
              </li>
            ))}
          </ul>
        </BlueprintBorderBox>
      </FadeUp>
    </figure>
  )
}

/** Catalyst-style quote: numbered caption outside + blueprint body box (test-hovr). */
function CatalystQuoteCard({
  index,
  title,
  children,
  delay = 0,
}: {
  index: number
  title: string
  children: ReactNode
  delay?: number
}) {
  const num = String(index).padStart(2, '0')
  return (
    <figure className="relative m-0 flex h-full min-h-0 min-w-0 flex-col gap-4 overflow-visible md:row-span-2 md:grid md:grid-rows-subgrid">
      <FadeUp
        delay={delay}
        className={`flex w-full shrink-0 flex-row items-start gap-3 ${FEATURE_CAPTION}`}
      >
        <span className={`${FEATURE_NUM} text-zinc-400`}>
          {num}
        </span>
        <h3 className="m-0 min-w-0 uppercase text-black dark:text-[#f2f2f2]">
          {title}
        </h3>
      </FadeUp>
      <FadeUp delay={delay + 0.1} className="flex min-h-0 flex-1 flex-col md:h-full">
        <BlueprintBorderBox className="flex h-full min-h-0 flex-col">
          <div className={`${PROSE} m-0 [&_strong]:font-bold [&_strong]:text-black dark:[&_strong]:text-[#f2f2f2]`}>
            {children}
          </div>
        </BlueprintBorderBox>
      </FadeUp>
    </figure>
  )
}

const KEY_PAIN_POINTS = [
  {
    label: 'Cumbersome Review Process',
    body: 'Manually opening and verifying each document individually is highly inefficient and time-consuming.',
  },
  {
    label: 'High-Friction Rejection',
    body: 'The current rejection flow requires navigating clumsy popups and scrolling to find specific reasons, causing unnecessary delays.',
  },
  {
    label: 'Desire for Bulk Approval',
    body: 'Staff need a single-action option to approve all matching documents at once to drastically cut processing time.',
  },
] as const

function Slide16FinalSolution() {
  return (
    <SlideShell tone="green">
      <div className="grid h-full min-h-0 grid-cols-1 items-stretch gap-[52px] lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <FadeUp className="min-h-0 min-w-0 h-full">
          <figure className="m-0 flex h-full min-h-0 w-full flex-col overflow-hidden rounded-none border border-white/25 bg-white/10">
            <video
              src="/hovr/After-Approval.mp4"
              className={MEDIA_FILL}
              autoPlay
              loop
              muted
              playsInline
            />
          </figure>
        </FadeUp>
        <FadeUp delay={0.15} className="flex items-center lg:justify-end lg:text-right">
          <h2
            className={`${DISPLAY} text-white`}
          >
            Final
            <br />
            Solution
          </h2>
        </FadeUp>
      </div>
    </SlideShell>
  )
}

function SolutionFeatureSlide({
  badge,
  heading,
  body,
  placeholderAlt,
  placeholderCaption,
  mediaSrc,
}: {
  badge: string
  heading: string
  body?: string
  placeholderAlt: string
  placeholderCaption: string
  mediaSrc?: string
}) {
  const isVideo = Boolean(mediaSrc && /\.(mp4|webm|mov)(\?|$)/i.test(mediaSrc))

  return (
    <SlideShell tone="white">
      <div className="grid h-full min-h-0 grid-cols-1 items-stretch gap-[52px] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)]">
        <div className="flex min-h-0 min-w-0 flex-col justify-center">
          <FadeUp className="min-w-0">
            <InsightBadge>{badge}</InsightBadge>
            <h2 className={`${TITLE} mt-5 max-w-full break-words`}>
              {heading}
            </h2>
            {body ? (
              <p className={`${PROSE} mt-4`}>
                {body}
              </p>
            ) : null}
          </FadeUp>
        </div>
        <FadeUp delay={0.12} className="min-h-0 min-w-0 h-full">
          {mediaSrc ? (
            <figure className="m-0 flex h-full min-h-0 w-full flex-col overflow-hidden rounded-none border border-[color:var(--erd-deck-slide-hairline,var(--erd-deck-hairline))]  bg-black/5 dark:bg-black/40">
              {isVideo ? (
                <video
                  src={mediaSrc}
                  className={MEDIA_FILL}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={mediaSrc}
                  alt={placeholderAlt}
                  className={MEDIA_FILL}
                />
              )}
            </figure>
          ) : (
            <ImagePlaceholder
              alt={placeholderAlt}
              caption={placeholderCaption}
              aspectClass="h-full min-h-[min(40vh,20rem)]"
              className="h-full"
            />
          )}
        </FadeUp>
      </div>
    </SlideShell>
  )
}

function Slide22QA() {
  return (
    <SlideShell tone="mint">
      <div className="flex h-full min-h-[50vh] flex-col items-center justify-center text-center">
        <FadeUp>
          <h2
            className={DISPLAY_XL}
          >
            Q&A
          </h2>
          <p className={`${OVERLINE} mt-4 text-black/50 dark:text-white/55`}>
            HOVR Admin · Driver Approval
          </p>
        </FadeUp>
      </div>
    </SlideShell>
  )
}

const SLIDES: SlideDef[] = [
  { id: '01-title', label: 'Title', render: () => <Slide01Title /> },
  { id: '03-process', label: 'Process', render: () => <Slide03Process /> },
  { id: '04-ux', label: 'UX', render: () => <Slide04UxIndex /> },
  { id: '07-product', label: 'Product', render: () => <Slide07LookAtProduct /> },
  { id: '08-approval-page', label: 'Approval page', render: () => <Slide08DriverApprovalPage /> },
  { id: '10-interview', label: 'User Interview', render: () => <Slide10UserInterview /> },
  { id: '16-final', label: 'Final Solution', render: () => <Slide16FinalSolution /> },
  {
    id: '17-bulk-1',
    label: 'Bulk Approval',
    render: () => (
      <SolutionFeatureSlide
        badge="Bulk Approval"
        heading="The support team can quickly review all submitted documents at once."
        body="If the information appears correct, they can select all documents and approve them in a single action."
        placeholderAlt="Bulk Approval admin UI"
        placeholderCaption="Replace with: Driver Information UI showing Select All + Approve, document cards with match/mismatch states (as on PDF slide 17)."
        mediaSrc="/hovr/Bulk-approval.mp4"
      />
    ),
  },
  {
    id: '18-bulk-2',
    label: 'Bulk · Edit',
    render: () => (
      <SolutionFeatureSlide
        badge="Bulk Approval"
        heading="The support team can still edit documents after approval if needed."
        placeholderAlt="Post-approval edit UI"
        placeholderCaption="Replace with: Bulk Approval follow-up UI showing edit-after-approval (PDF slide 18)."
        mediaSrc="/hovr/After-Approval.mp4"
      />
    ),
  },
  {
    id: '19-individual-1',
    label: 'Approve Individually',
    render: () => (
      <SolutionFeatureSlide
        badge="Approve Documents Individually"
        heading="Support team members can review and approve documents one at a time as needed."
        body="If the scanned document and manually entered data don’t match, users can click each document card on the left to compare and verify the information."
        placeholderAlt="Individual document comparison UI"
        placeholderCaption="Replace with: split-view UI — document cards on the left, comparison of scanned vs typed data (PDF slide 19)."
        mediaSrc="/hovr/Approve-one.mp4"
      />
    ),
  },
  {
    id: '20-individual-2',
    label: 'Approve on screen',
    render: () => (
      <SolutionFeatureSlide
        badge="Approve Documents Individually"
        heading="Then, if the document looks legitimate, the support team can approve it directly on the same screen without seeing a popup or navigating to another page."
        placeholderAlt="Same-screen approve UI"
        placeholderCaption="Replace with: same-screen approve action UI without popup navigation (PDF slide 20)."
        mediaSrc="/hovr/solution1.mp4"
      />
    ),
  },
  {
    id: '21-reject',
    label: 'Rejection',
    render: () => (
      <SolutionFeatureSlide
        badge="Rejection Process"
        heading="The support team can reject submitted documents individually. To prevent mistakes, the rejection process includes a few additional steps."
        body="If a document is invalid, users can reject it by clicking the Reject button located above the document images. A rejection reason must be provided — from a predefined list or a custom entry — then sent to the driver via SMS so they can resubmit correctly."
        placeholderAlt="Rejection flow UI with reason + SMS"
        placeholderCaption="Replace with: Reject button above document images, rejection reason picker/custom field, and SMS-to-driver outcome (PDF slide 21)."
        mediaSrc="/hovr/Reject.mp4"
      />
    ),
  },
  { id: '22-qa', label: 'Q&A', render: () => <Slide22QA /> },
]

export function HovrDeck() {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  const go = useCallback((next: number) => {
    setIndex((prev) => {
      const clamped = Math.max(0, Math.min(SLIDES.length - 1, next))
      setDirection(clamped > prev ? 1 : clamped < prev ? -1 : 0)
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
        { id: 'hovr', label: 'HOVR', href: '/hovr-deck', active: true },
        { id: 'piik', label: 'Piik AI', href: '/piik-deck' },
      ]}
      counter={`${String(index + 1).padStart(2, '0')} / ${String(SLIDES.length).padStart(2, '0')} · ${SLIDES[index]?.label ?? ''}`}
      canPrev={index > 0}
      canNext={index < SLIDES.length - 1}
      onPrev={prev}
      onNext={next}
      direction={direction}
      slideKey={SLIDES[index]!.id}
      stageStyle={{ backgroundColor: HOVR_MINT }}
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
