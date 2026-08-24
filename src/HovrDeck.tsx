import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { usePageTheme } from './context/PageThemeContext'
import { TEST_HOME_PROJECT_TITLE_SERIF } from './pages/testHomeTypography'

/**
 * Standalone HOVR Driver Approval deck — rebuilt from
 * `HOVR driver approval system.pdf` (22 slides). Independent of test-hovr case study.
 * Typography matches test-hovr / TestProjectBody exactly.
 */

const CREAM = '#faf7f0'
const HOVR_MINT = '#E4F4DE'
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
  "font-['SUIT_Variable',sans-serif] text-[clamp(0.625rem,1.5vw,0.8125rem)] font-bold leading-[1.2] tracking-[-0.02em]"
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
/** Intrinsic-size hug removed — media always fills its frame. */
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
  tone?: 'cream' | 'white' | 'mint' | 'green'
}) {
  const bg =
    tone === 'green'
      ? 'bg-[#2b3531] text-white'
      : tone === 'mint'
        ? 'bg-[#E4F4DE] text-black dark:bg-[#1a2420] dark:text-[#f2f2f2]'
        : tone === 'white'
          ? 'bg-white text-black dark:bg-[#161616] dark:text-[#f2f2f2]'
          : 'bg-[#faf7f0] text-black dark:bg-[#141414] dark:text-[#f2f2f2]'

  return (
    <div
      className={`flex h-full min-h-0 w-full flex-col overflow-hidden rounded-none border border-[#c0bcb0] dark:border-white/15 ${bg} ${className}`}
    >
      <div
        className={`shrink-0 border-b px-[clamp(1rem,3vw,2rem)] py-[clamp(0.35rem,0.9vh,0.5rem)] ${
          tone === 'green' ? 'border-white/20' : 'border-[#c0bcb0] dark:border-white/15'
        }`}
      >
        <DeckHeader />
      </div>
      <div className="relative min-h-0 flex-1 overflow-y-auto px-[clamp(1rem,3vw,2rem)] py-[clamp(0.85rem,2.5vh,1.6rem)]">{children}</div>
      {footer ? (
        <div
          className={`shrink-0 border-t px-[clamp(1rem,3vw,2rem)] py-2 ${
            tone === 'green' ? 'border-white/20' : 'border-[#c0bcb0] dark:border-white/15'
          }`}
        >
          {footer}
        </div>
      ) : null}
    </div>
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
      className={`flex flex-col overflow-hidden rounded-none border border-[#c0bcb0] bg-zinc-100 dark:border-white/15 dark:bg-zinc-800/70 ${className}`}
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
        className={`${OVERLINE} border-t border-[#c0bcb0] px-3 py-2 text-black/45 dark:border-white/15 dark:text-white/45`}
      >
        Placeholder · {alt}
      </figcaption>
    </figure>
  )
}

function UxPhaseNav({ active }: { active: UxPhaseIndex }) {
  return (
    <div className="flex w-max flex-col items-stretch gap-[clamp(0.14rem,0.35vw,0.21rem)]">
      {UX_PHASES.map((label, i) => {
        const on = i === active
        return (
          <span
            key={label}
            className={`${PHASE_NAV_TYPE} ${PHASE_NAV_BTN} w-full text-left ${
              on
                ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
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

function InsightBadge({ children }: { children: ReactNode }) {
  return (
    <span
      className={`${META_SUIT} inline-block rounded-none bg-black px-3 py-1.5 text-white dark:bg-white dark:text-black`}
    >
      {children}
    </span>
  )
}

function Slide01Title() {
  const { isDark } = usePageTheme()
  return (
    <SlideShell tone="mint">
      <div className="relative h-full min-h-0 w-full overflow-hidden">
        <FadeUp delay={0.08} className="absolute inset-0">
          <img
            src={isDark ? '/hovr/thumbnail-test.jpg' : '/hovr/thumbnail-test2.jpg'}
            alt="HOVR Admin driver approval product thumbnail"
            className="block h-full w-full object-cover object-center"
          />
        </FadeUp>
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[min(100%,42rem)] bg-gradient-to-r from-[#E4F4DE] via-[#E4F4DE]/85 to-transparent dark:from-[#1a2420] dark:via-[#1a2420]/85"
          aria-hidden
        />

        <div className="relative z-10 flex h-full min-h-0 max-w-[min(36rem,92%)] flex-col justify-center pr-[clamp(1rem,3vw,1.5rem)]">
          <FadeUp>
            <h1 className={DISPLAY}>HOVR Admin</h1>
            <p className={`${SUBHEAD} mt-4 max-w-[min(28ch,85%)] text-black/75 dark:text-white/75`}>
              Driver Approval System
            </p>
          </FadeUp>
          <FadeUp delay={0.15} className="mt-8 flex flex-wrap gap-2">
            {['Product Design', 'UX/UI Design', 'UX/UI Designer @ HOVR'].map((tag) => (
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: EASE }}
      className="flex min-h-0 flex-col border border-[#c0bcb0] bg-white dark:border-white/15 dark:bg-[#1c1c1c]"
    >
      <div className={`${FEATURE_TITLE} border-b border-[#c0bcb0] bg-zinc-100 px-3 py-2 dark:border-white/15 dark:bg-zinc-800`}>
        {title}
      </div>
      <p className={`${PROSE} px-3 py-2.5`}>
        {body}
      </p>
    </motion.div>
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
              className={`${OVERLINE} inline-block rounded-none border border-violet-300/80 bg-violet-50 px-3 py-1 text-violet-800 dark:border-violet-400/40 dark:bg-violet-950/40 dark:text-violet-200`}
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
              className={`${OVERLINE} inline-block rounded-none border border-violet-300/80 bg-violet-50 px-3 py-1 text-violet-800 dark:border-violet-400/40 dark:bg-violet-950/40 dark:text-violet-200`}
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
            <motion.span
              key={label}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.22 + i * 0.08, duration: 0.5, ease: EASE }}
              className={`${META_SUIT} w-fit rounded-none border border-[#c0bcb0] px-4 py-2 dark:border-white/25`}
            >
              {label}
            </motion.span>
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
            <h2 className={`${TITLE} max-w-[16ch]`}>
              Let&apos;s look at the product we have
            </h2>
          </FadeUp>
          <FadeUp delay={0.12} className="min-h-0 flex-1">
            <figure className="m-0 flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-none border border-[#c0bcb0] dark:border-white/15">
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
        <FadeUp delay={0.15} className="sticky top-0 self-start justify-self-end">
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

          <div className="grid w-full auto-rows-fr grid-cols-1 items-stretch gap-6 md:grid-cols-3">
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
            <figure className="m-0 flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-none border border-[#c0bcb0] dark:border-white/15">
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

          <div className="flex min-h-0 flex-1 items-center">
            <div className="grid w-full auto-rows-fr grid-cols-1 items-stretch gap-6 md:grid-cols-3">
              <FindingBox
                index={1}
                title="Key Support team(USER) Painpoints"
                items={KEY_PAIN_POINTS}
              />
              <CatalystQuoteCard index={2} title="Action: Technical Feasibility Sync" delay={0.08}>
                <p className="m-0">
                  Shared early problem-solving sketches with the engineering team to align on
                  technical constraints and explore the scope of automation capabilities.
                </p>
              </CatalystQuoteCard>
              <CatalystQuoteCard index={3} title="Finding: OCR Automation Potential" delay={0.16}>
                <p className="m-0">
                  <strong>90%+ Auto-Scanning Accuracy:</strong> Engineering confirmed the upcoming
                  OCR technology will guarantee at least 90% accuracy for driver-uploaded documents,
                  creating an opportunity for automation.
                </p>
              </CatalystQuoteCard>
            </div>
          </div>
        </div>
        <FadeUp delay={0.12} className="sticky top-0 self-start justify-self-end">
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
        className="pointer-events-none absolute inset-y-0 left-0 w-[1px] bg-[color:var(--color-blueprint-hairline,#c0bcb0)]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-[1px] bg-[color:var(--color-blueprint-hairline,#c0bcb0)]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-[color:var(--color-blueprint-hairline,#c0bcb0)]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[1px] bg-[color:var(--color-blueprint-hairline,#c0bcb0)]"
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
    <figure className="relative m-0 flex h-full min-h-0 min-w-0 flex-col overflow-visible">
      <FadeUp
        delay={delay}
        className={`mb-4 flex w-full shrink-0 flex-row items-start gap-3 ${FEATURE_CAPTION}`}
      >
        <span className={`${FEATURE_NUM} text-zinc-400`}>
          {num}
        </span>
        <h3 className="m-0 min-w-0 uppercase text-black dark:text-[#f2f2f2]">
          {title}
        </h3>
      </FadeUp>

      <FadeUp delay={delay + 0.1} className="flex min-h-0 flex-1 flex-col">
        <BlueprintBorderBox className="flex flex-col">
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
    <figure className="relative m-0 flex h-full min-h-0 min-w-0 flex-col overflow-visible">
      <FadeUp
        delay={delay}
        className={`mb-4 flex w-full shrink-0 flex-row items-start gap-3 ${FEATURE_CAPTION}`}
      >
        <span className={`${FEATURE_NUM} text-zinc-400`}>
          {num}
        </span>
        <h3 className="m-0 min-w-0 uppercase text-black dark:text-[#f2f2f2]">
          {title}
        </h3>
      </FadeUp>
      <FadeUp delay={delay + 0.1} className="flex min-h-0 flex-1 flex-col">
        <BlueprintBorderBox className="flex flex-col">
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
    body: 'Manually opening and verifying each document individually is highly inefficient and time-consuming, even with existing automation.',
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
        <div className="flex min-h-0 flex-col justify-center">
          <FadeUp>
            <InsightBadge>{badge}</InsightBadge>
            <h2 className={`${TITLE} mt-5`}>
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
            <figure className="m-0 flex h-full min-h-0 w-full flex-col overflow-hidden rounded-none border border-[#c0bcb0] dark:border-white/15 bg-black/5 dark:bg-black/40">
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
  const { isDark } = usePageTheme()
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(0)

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
              aria-current="page"
              className={`${META_SUIT} ${CHROME_BTN} border-black bg-black text-white no-underline dark:border-white dark:bg-white dark:text-black`}
            >
              HOVR
            </Link>
            <Link
              to="/piik-deck"
              className={`${META_SUIT} ${CHROME_BTN} border-[#c0bcb0] bg-transparent text-black/70 no-underline transition-colors hover:border-black hover:text-black dark:border-white/25 dark:text-white/65 dark:hover:border-white dark:hover:text-white`}
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
          style={{ backgroundColor: isDark ? '#0c0c0c' : HOVR_MINT }}
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
