import type { ReactNode } from 'react'
import {
  TEST_PROJECT_PROSE_CLASS,
  TEST_PROJECT_SECTION_TITLE_CLASS,
} from '../TestProjectBody'
import { MD_ARTICLE, MD_COLS, MD_GUTTER, MD_MEDIA_FULL } from '../testMd3Layout'

function SlideHead({ children }: { children: string }) {
  return (
    <header className="erd-jojo-slide-head">
      <p className="erd-jojo-research-kicker">{children}</p>
    </header>
  )
}

function InterviewCard({ children }: { children: ReactNode }) {
  return (
    <div className={`${MD_MEDIA_FULL} erd-jojo-research-card erd-jojo-research-card--split`}>
      {children}
    </div>
  )
}

function QuoteRow({
  letter,
  kicker,
  quotes,
  tools,
}: {
  letter: string
  kicker: string
  quotes: string[]
  tools?: string
}) {
  return (
    <li className="erd-jojo-slide-insight">
      <span className="erd-jojo-slide-index">{letter}</span>
      <div>
        <h3>{kicker}</h3>
        {quotes.map((quote) => (
          <p key={quote}>“{quote}”</p>
        ))}
        {tools ? (
          <p>
            <strong>Frequently used tools: </strong>
            {tools}
          </p>
        ) : null}
      </div>
    </li>
  )
}

export function JojoUserInterviewFigure() {
  return (
    <>
      <InterviewCard>
        <div className="erd-jojo-research-col">
          <SlideHead>What is your current status?</SlideHead>
          <img
            src="/jojo/interview-graph.svg"
            alt="Current status: 4 students, 3 full-time workers, 1 unemployed. Six of eight participants use AI daily."
            className="erd-jojo-interview-chart"
          />
        </div>
        <div className="erd-jojo-research-col erd-jojo-research-col--interview">
          <SlideHead>What purpose do you use AI tools for?</SlideHead>
          <ol className="erd-jojo-slide-insights">
            <QuoteRow
              letter="S"
              kicker="Student"
              quotes={['I mostly use it for research purposes, like searching for papers.']}
              tools="Perplexity, ChatGPT, Research Rabbit"
            />
            <QuoteRow
              letter="F"
              kicker="Full-time worker"
              quotes={[
                'I mainly use it for drafting work emails and translations.',
                'I work from home, so I use a voice assistant for small tasks like setting reminders.',
              ]}
              tools="Copilot, ChatGPT, Alexa"
            />
            <QuoteRow
              letter="U"
              kicker="Unemployed"
              quotes={['I mainly use it to extract keywords for my resume and analyze job postings.']}
              tools="ChatGPT"
            />
          </ol>
        </div>
      </InterviewCard>

      <InterviewCard>
        <div className="erd-jojo-research-col">
          <SlideHead>What are the biggest pain points you face when using AI tools?</SlideHead>
          <p className="erd-jojo-interview-sub">
            in relation to the cognitive issues you&apos;ve experienced
          </p>
          <ol className="erd-jojo-slide-insights">
            <QuoteRow
              letter="A"
              kicker="Common pain points A"
              quotes={[
                "It's convenient that AI tools provide answers instantly when I ask something, but sometimes I feel like it takes away the opportunity for me to think on my own.",
              ]}
            />
            <QuoteRow
              letter="B"
              kicker="Common pain points B"
              quotes={[
                "When I'm studying with books and open my laptop to use an AI tool, I often find myself checking social media without realizing it. I know it's an issue with my willpower and focus, but I can't avoid using the laptop since it's necessary for accessing the tools.",
              ]}
            />
            <QuoteRow
              letter="C"
              kicker="Common pain points C"
              quotes={[
                'Knowing that AI will organize my meeting notes later makes me less focused during the meeting. This reduced focus leads to relying even more on AI tools, creating a vicious cycle.',
              ]}
            />
          </ol>
        </div>
        <div className="erd-jojo-research-col erd-jojo-research-col--interview">
          <SlideHead>
            Have you ever had specific desires or expectations regarding the use of AI tools related to these pain points?
          </SlideHead>
          <ol className="erd-jojo-slide-insights">
            <QuoteRow
              letter="A"
              kicker="Common needs A"
              quotes={[
                "I wish AI wouldn't just give me the answer right away but instead guide me toward finding the answer myself—of course, only when I want it to. Sometimes, when I'm busy, I do appreciate AI providing instant answers.",
              ]}
            />
            <QuoteRow
              letter="B"
              kicker="Common needs B"
              quotes={[
                "I haven't thought about the exact method, but I just wish it could help me focus more on my work. Am I asking too much from a machine?",
              ]}
            />
          </ol>
        </div>
      </InterviewCard>
    </>
  )
}

const INTERVIEW_PAIN_POINTS = [
  {
    label: 'Over-Reliance, Distractions, and Vicious Cycle',
    value:
      'Participants expressed concerns that instant answers from AI tools often reduced their opportunities to think critically.',
  },
  {
    label: 'Laptop distraction',
    value:
      'Some found it challenging to stay focused when accessing AI tools via laptops, often ending up distracted by social media.',
  },
  {
    label: 'Automated notes',
    value:
      'Features like automated meeting notes made participants less focused during meetings, leading to greater reliance on AI.',
  },
] as const

function MapImage({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className={`${MD_MEDIA_FULL} mt-4 block h-auto w-full rounded-none object-contain`}
    />
  )
}

export function JojoUserInterviewSection() {
  return (
    <div className={`erd-jojo-research ${MD_COLS} ${MD_GUTTER} w-full`}>
      <h2 className={`${MD_ARTICLE} ${TEST_PROJECT_SECTION_TITLE_CLASS} mb-0`}>User Interview</h2>
      <div className={`${MD_ARTICLE} ${TEST_PROJECT_PROSE_CLASS} -mt-[7px]`}>
        <h4>Common pain points</h4>
        <p>
          Participants highlighted concerns about over-reliance on AI, as instant
          answers often diminish opportunities for critical thinking. They
          emphasized the need for AI tools to strike a balance between convenience
          and engagement by supporting focus and offering guided solutions.
        </p>
      </div>
      <ul className={`${MD_ARTICLE} rc-prev erd-hovr-hero-meta-list erd-jojo-interview-timeline`}>
        {INTERVIEW_PAIN_POINTS.map((item) => (
          <li key={item.label}>
            <span className="erd-jojo-interview-timeline-lead">
              <span className="rc-prev-dot" aria-hidden />
              <span className="rc-prev-role">{item.label}</span>
            </span>
            <span className="rc-prev-meta">{item.value}</span>
          </li>
        ))}
      </ul>
      <JojoUserInterviewFigure />
      <MapImage src="/jojo/map1.png" alt="Affinity map 1" />
      <MapImage src="/jojo/map2.png" alt="Affinity map 2" />
      <MapImage src="/jojo/map3.png" alt="Affinity map 3" />
    </div>
  )
}
