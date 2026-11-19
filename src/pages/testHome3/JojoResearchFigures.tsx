import type { ReactNode } from 'react'
import { MD_BORDER, MD_COLS, MD_GUTTER, MD_INK, MD_INK_MUTED } from '../../testMd3Layout'

const META =
  "font-['IBM_Plex_Mono',monospace] text-[0.75rem] font-bold uppercase leading-[1.2] tracking-[-0.02em]"
const BODY =
  "font-['SUIT_Variable',sans-serif] text-[12pt] font-normal leading-[1.2] tracking-[-0.02em] [font-optical-sizing:auto]"
const QUOTE = `${BODY} m-0 italic ${MD_INK_MUTED} dark:text-white/75`

type Tag = { label: string; count: number }

function CountChip({ count }: { count: number }) {
  return (
    <span
      className={`${META} inline-flex min-w-[1.5rem] items-center justify-center rounded-[0.25rem] bg-[#ddf21a] px-2 py-1 text-black tabular-nums`}
    >
      {count}
    </span>
  )
}

function TagRow({ tags }: { tags: Tag[] }) {
  return (
    <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
      {tags.map((tag) => (
        <li
          key={tag.label}
          className={`inline-flex items-center gap-2 rounded-[0.25rem] border ${MD_BORDER} px-2 py-1`}
        >
          <span className={`${BODY} ${MD_INK}`}>{tag.label}</span>
          <CountChip count={tag.count} />
        </li>
      ))}
    </ul>
  )
}

function FindingPanel({
  source,
  tags,
  quote,
}: {
  source: string
  tags: Tag[]
  quote: string
}) {
  return (
    <article
      className={`flex min-w-0 flex-col gap-4 border ${MD_BORDER} p-4 sm:p-5`}
    >
      <p className={`${META} m-0 ${MD_INK_MUTED}`}>{source}</p>
      <TagRow tags={tags} />
      <blockquote className={QUOTE}>“{quote}”</blockquote>
    </article>
  )
}

function FindingGrid({ children }: { children: ReactNode }) {
  return <div className={`${MD_COLS} ${MD_GUTTER} w-full`}>{children}</div>
}

const HALF = 'col-span-4 sm:col-span-8 min-[840px]:col-span-6'
const FULL = 'col-span-4 sm:col-span-8 min-[840px]:col-span-12'

export function JojoResearchFinding1() {
  return (
    <FindingGrid>
      <div className={HALF}>
        <FindingPanel
          source="# Primary research"
          tags={[
            { label: 'Digital dementia', count: 4 },
            { label: 'Short attention span', count: 2 },
            { label: 'Difficulty in critical thinking', count: 2 },
          ]}
          quote="I know I can't think like before, but I have to keep using it because that's how the world works now."
        />
      </div>
      <div className={HALF}>
        <FindingPanel
          source="# Interview"
          tags={[
            { label: 'Digital dementia', count: 4 },
            { label: 'Short attention span', count: 2 },
            { label: 'Difficulty in critical thinking', count: 2 },
          ]}
          quote="It's like I have to fight with myself to stay focused. I know what I should do, but I just… don't."
        />
      </div>
    </FindingGrid>
  )
}

export function JojoResearchFinding2() {
  return (
    <FindingGrid>
      <div className={HALF}>
        <FindingPanel
          source="# Primary research"
          tags={[
            { label: 'Turn on camera', count: 4 },
            { label: 'Turn on microphone', count: 4 },
          ]}
          quote="I started turning on my camera and mic, and suddenly I was actually part of the conversation. It felt more real, more like being there."
        />
      </div>
      <div className={HALF}>
        <FindingPanel
          source="# Interview"
          tags={[
            { label: 'Chat', count: 2 },
            { label: 'Emojis', count: 2 },
          ]}
          quote="Even just typing in the chat or sending an emoji made me feel more involved. It's not much, but it keeps you from zoning out."
        />
      </div>
    </FindingGrid>
  )
}

export function JojoResearchFinding3() {
  return (
    <FindingGrid>
      <div className={FULL}>
        <FindingPanel
          source="# Primary research"
          tags={[
            { label: 'Use AI every day', count: 4 },
            { label: 'AI can be good', count: 2 },
            { label: 'Need a break', count: 1 },
          ]}
          quote="I use ChatGPT every day for work, and it's actually helped me think through problems faster. It's not replacing my thinking—it's supporting it."
        />
      </div>
    </FindingGrid>
  )
}

export function JojoResearchFinding5() {
  return (
    <FindingGrid>
      <div className={FULL}>
        <FindingPanel
          source="# Primary research"
          tags={[
            { label: 'Speech-based', count: 3 },
            { label: 'Text-based', count: 3 },
          ]}
          quote="Sometimes I just want to talk it out, other times I need to write it down. Both work, just for different moments."
        />
      </div>
    </FindingGrid>
  )
}

export function JojoResearchFinding4() {
  return (
    <FindingGrid>
      <div className={FULL}>
        <FindingPanel
          source="# Interview"
          tags={[
            { label: 'GPT is boring', count: 4 },
            { label: 'Robot is fun', count: 2 },
            { label: 'Robot is creepy', count: 1 },
          ]}
          quote="Talking to ChatGPT feels like filling out a form. But when there's a character or personality, even if it's a bit weird, at least it's interesting."
        />
      </div>
    </FindingGrid>
  )
}

const STATUS = [
  { label: 'Student', count: 4, color: '#ddf21a' },
  { label: 'Full-time', count: 3, color: '#9aa31a' },
  { label: 'Unemployed', count: 1, color: '#51590e' },
] as const

const STATUS_TOTAL = STATUS.reduce((sum, item) => sum + item.count, 0)

function statusConic(): string {
  let cursor = 0
  const stops: string[] = []
  for (const item of STATUS) {
    const start = (cursor / STATUS_TOTAL) * 100
    cursor += item.count
    const end = (cursor / STATUS_TOTAL) * 100
    stops.push(`${item.color} ${start}% ${end}%`)
  }
  return `conic-gradient(${stops.join(', ')})`
}

export function JojoUserInterviewFigure() {
  return (
    <FindingGrid>
      <article className={`${HALF} flex flex-col gap-5 border ${MD_BORDER} p-4 sm:p-5`}>
        <p className={`${META} m-0 ${MD_INK}`}>Status</p>
        <div className="grid grid-cols-2 items-center gap-4">
          <div className="relative mx-auto aspect-square w-full max-w-[12.5rem]">
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: statusConic() }}
              aria-hidden
            />
            <div className="absolute inset-[22%] flex flex-col items-center justify-center rounded-full bg-white dark:bg-[#1a1917]">
              <p className={`${META} m-0 text-[#51590e] dark:text-[#ddf21a]`}>Yes</p>
              <p className={`${BODY} m-0 ${MD_INK} tabular-nums`}>6 / 8</p>
              <p className={`${META} m-0 mt-1 ${MD_INK_MUTED}`}>AI daily</p>
            </div>
          </div>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {STATUS.map((item) => (
              <li key={item.label} className="flex items-center gap-2">
                <span
                  className="size-2.5 shrink-0 rounded-[0.25rem]"
                  style={{ background: item.color }}
                  aria-hidden
                />
                <span className={`${BODY} ${MD_INK}`}>{item.label}</span>
                <span className={`${META} ${MD_INK_MUTED} tabular-nums`}>{item.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </article>

      <article className={`${HALF} flex flex-col gap-4 border ${MD_BORDER} p-4 sm:p-5`}>
        <p className={`${META} m-0 ${MD_INK}`}>Purpose of using AI</p>
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {[
            'Just for fun!',
            "It's a convenient tool.",
            "It's a good way to get inspired.",
          ].map((line) => (
            <li key={line}>
              <blockquote className={QUOTE}>“{line}”</blockquote>
            </li>
          ))}
        </ul>
      </article>

      <article className={`${HALF} flex flex-col gap-4 border ${MD_BORDER} p-4 sm:p-5`}>
        <p className={`${META} m-0 ${MD_INK}`}>Pain points</p>
        <ul className="m-0 flex list-none flex-col gap-4 p-0">
          {[
            {
              key: 'A',
              title: 'Over-reliance',
              quote: 'I just ask AI without thinking anymore.',
            },
            {
              key: 'B',
              title: 'Distraction',
              quote: 'I open ChatGPT and end up on Instagram.',
            },
            {
              key: 'C',
              title: 'Vicious cycle',
              quote: "The more I use it, the less I can focus without it.",
            },
          ].map((item) => (
            <li key={item.key} className="flex gap-3">
              <span
                className={`${META} flex size-7 shrink-0 items-center justify-center rounded-[0.25rem] bg-[#ddf21a] leading-none text-black`}
              >
                {item.key}
              </span>
              <div className="min-w-0">
                <p className={`${BODY} m-0 font-semibold ${MD_INK}`}>{item.title}</p>
                <blockquote className={`${QUOTE} mt-1`}>“{item.quote}”</blockquote>
              </div>
            </li>
          ))}
        </ul>
      </article>

      <article className={`${HALF} flex flex-col gap-4 border ${MD_BORDER} p-4 sm:p-5`}>
        <p className={`${META} m-0 ${MD_INK}`}>Needs</p>
        <ul className="m-0 flex list-none flex-col gap-4 p-0">
          {[
            {
              key: 'A',
              quote: 'I want AI to ask me questions back.',
            },
            {
              key: 'B',
              quote: 'Help me stay focused, not just give answers.',
            },
          ].map((item) => (
            <li key={item.key} className="flex gap-3">
              <span
                className={`${META} flex size-7 shrink-0 items-center justify-center rounded-[0.25rem] border ${MD_BORDER} ${MD_INK}`}
              >
                {item.key}
              </span>
              <blockquote className={`${QUOTE} min-w-0`}>“{item.quote}”</blockquote>
            </li>
          ))}
        </ul>
      </article>
    </FindingGrid>
  )
}

export const JOJO_INLINE_FIGURES: Record<string, ReactNode> = {
  '/jojo/research1.png': <JojoResearchFinding1 />,
  '/jojo/research2.png': <JojoResearchFinding2 />,
  '/jojo/research3.png': <JojoResearchFinding3 />,
  '/jojo/research5.png': <JojoResearchFinding5 />,
  '/jojo/research4.png': <JojoResearchFinding4 />,
  '/jojo/user interview.jpg': <JojoUserInterviewFigure />,
  '/jojo/user%20interview.jpg': <JojoUserInterviewFigure />,
}
