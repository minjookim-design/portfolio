import type { ReactNode } from 'react'
import {
  TEST_PROJECT_PROSE_CLASS,
  TEST_PROJECT_SECTION_TITLE_CLASS,
} from '../TestProjectBody'
import { MD_ARTICLE, MD_COLS, MD_GUTTER, MD_MEDIA_FULL } from '../testMd3Layout'

function Prose({ children }: { children: ReactNode }) {
  return <div className={`${MD_ARTICLE} ${TEST_PROJECT_PROSE_CLASS}`}>{children}</div>
}

function ResearchGroup({
  children,
  first,
}: {
  children: ReactNode
  first?: boolean
}) {
  return (
    <div
      className={`${MD_ARTICLE} ${TEST_PROJECT_PROSE_CLASS} erd-jojo-research-group ${
        first ? 'erd-jojo-research-prose -mt-[7px]' : ''
      }`}
    >
      {children}
    </div>
  )
}

function SlideHead({ children }: { children: string }) {
  return (
    <header className="erd-jojo-slide-head">
      <p className="erd-jojo-research-kicker">{children}</p>
    </header>
  )
}

function FindingCard({
  split,
  children,
}: {
  split?: boolean
  children: ReactNode
}) {
  return (
    <div
      className={
        split
          ? `${MD_MEDIA_FULL} erd-jojo-research-card erd-jojo-research-card--split`
          : `${MD_MEDIA_FULL} erd-jojo-research-card`
      }
    >
      {children}
    </div>
  )
}

function SlideInsight({
  index,
  title,
  body,
}: {
  index: string
  title: string
  body: string
}) {
  return (
    <li className="erd-jojo-slide-insight">
      <span className="erd-jojo-slide-index">{index}</span>
      <div>
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
    </li>
  )
}

function SlideRow({
  count,
  title,
  body,
}: {
  count: string
  title: string
  body: string
}) {
  return (
    <li className="erd-jojo-slide-row">
      <span className="erd-jojo-slide-count">{count}</span>
      <div>
        <h5>{title}</h5>
        <p>{body}</p>
      </div>
    </li>
  )
}

export function JojoResearchSection() {
  return (
    <div className={`erd-jojo-research ${MD_COLS} ${MD_GUTTER} w-full`}>
      <h1 className={`${MD_ARTICLE} ${TEST_PROJECT_SECTION_TITLE_CLASS} mb-0`}>Research</h1>
      <ResearchGroup first>
        <h4>Research Question</h4>
        <p>
          How can conversational AI be designed as a complementary tool to engage
          critical thinking and address cognitive accessibility challenges for
          adults aged 18 to 35, reducing the effects of over-reliance on digital
          technology?
        </p>
        <p>
          As someone who grew up immersed in digital technology, I often feel that
          it has negatively impacted our generation&apos;s cognitive abilities. This
          project aims to explore whether there is a correlation between digital
          technology and cognitive challenges and to investigate how conversational
          AI can be leveraged to address these issues.
        </p>
      </ResearchGroup>
      <ResearchGroup>
        <h4>Why conversational AI specifically?</h4>
        <p>
          Over the past two years, AI has revolutionized the tech industry and
          become an integral part of daily life. Efforts to implement AI in the
          existing products are increasing rapidly, and I&apos;ve noticed both
          myself and those around me frequently relying on AI tools. Since the use
          of digital technology is inevitable, I want to explore ways to optimize
          its implementation, ensuring it serves as a solution rather than
          exacerbating existing problems.
        </p>
        <p>
          This project is dedicated to answering this research question and finding
          ways to design conversational AI that supports critical thinking and
          cognitive health.
        </p>
      </ResearchGroup>
      <ResearchGroup>
        <h4>Research Findings</h4>
        <p>
          Does digital technology truly cause cognitive issues, or is it merely a
          delusion?
        </p>
        <p>The answer is yes, it does cause cognitive issues.</p>
      </ResearchGroup>

        <FindingCard split>
          <div className="erd-jojo-research-col">
            <SlideHead>Primary research</SlideHead>
            <ol className="erd-jojo-slide-insights">
              <SlideInsight
                index="01"
                title="Excessive device use harms cognition"
                body="Memory loss, attention deficits, difficulty in decision making, and a decline in communication skills. Digital platforms promote instant gratification and discourage slower cognitive work."
              />
              <SlideInsight
                index="02"
                title="Exposure is no longer optional"
                body="Work and school now require digital devices. Since the pandemic, online classes and remote work are the new normal."
              />
            </ol>
          </div>
          <div className="erd-jojo-research-col erd-jojo-research-col--interview">
            <SlideHead>Interview · n=8</SlideHead>
            <p className="erd-jojo-slide-hero">
              <span className="erd-jojo-slide-hero-stat">
                <span className="erd-jojo-slide-hero-num">7/8</span>
                <span className="erd-jojo-slide-hero-unit">participants</span>
              </span>
              <span className="erd-jojo-slide-hero-label">
                reported noticing changes in their cognitive functions
              </span>
            </p>
            <ul className="erd-jojo-slide-rows">
              <SlideRow
                count="4"
                title="Digital dementia"
                body="Forgetting what they intended to search for, or tasks they needed to complete."
              />
              <SlideRow
                count="2"
                title="Short attention span"
                body="Difficulty maintaining motivation and struggling to stay focused."
              />
              <SlideRow
                count="2"
                title="Difficulty in critical thinking"
                body="A tendency to avoid deep thinking and rely on AI instead of their own effort."
              />
            </ul>
            <ul className="erd-jojo-slide-notes">
              <li>One participant mentioned multiple symptoms.</li>
              <li>
                Six noticed changes about two years ago; one tied it to first
                smartphone use. All have used AI for one to two years.
              </li>
              <li>
                Turning devices off or deleting social apps was not an option —
                work and study depend on them.
              </li>
            </ul>
          </div>
        </FindingCard>

      <Prose>
        <p>So what do we do when we can&apos;t focus?</p>
        <p>
          Maybe it&apos;s not the online environment itself that&apos;s the
          problem—it&apos;s how we&apos;re using it. What if we approached it
          differently?
        </p>
        <p>
          Passive listening or just making prompts isn&apos;t enough. The key is to
          engage actively. Talk, chat, participate—make it interactive. When you
          treat the online environment like a physical one and actively join in, it
          can actually work just as well.
        </p>
      </Prose>

        <FindingCard split>
          <div className="erd-jojo-research-col">
            <SlideHead>Primary research</SlideHead>
            <ol className="erd-jojo-slide-insights">
              <SlideInsight
                index="01"
                title="Active discussion beats passive listening"
                body="Talking with peers and teachers — versus sitting through lectures — makes a significant difference in critical thinking. The same rule applies to digital tech: prompts alone are not enough."
              />
            </ol>
          </div>
          <div className="erd-jojo-research-col erd-jojo-research-col--interview">
            <SlideHead>Interview · n=8</SlideHead>
            <p className="erd-jojo-slide-hero">
              <span className="erd-jojo-slide-hero-stat">
                <span className="erd-jojo-slide-hero-num">6/8</span>
                <span className="erd-jojo-slide-hero-unit">participants</span>
              </span>
              <span className="erd-jojo-slide-hero-label">
                try to engage others when they feel checked out in online meetings or class
              </span>
            </p>
            <ul className="erd-jojo-slide-rows">
              <SlideRow
                count="4"
                title="Camera or microphone on"
                body="Turned on camera or mic to raise their own engagement."
              />
              <SlideRow
                count="2"
                title="Chat or emoji reactions"
                body="Used chat or reactions to stay present in the room."
              />
            </ul>
            <ul className="erd-jojo-slide-notes">
              <li>All reported lower engagement in online class, meetings, or chat.</li>
              <li>
                Those actions simulate face-to-face cues — instant reaction, facial
                expression, being seen as a person.
              </li>
            </ul>
          </div>
        </FindingCard>

      <Prose>
        <p>And AI, a new digital technology, isn&apos;t actually all that bad!</p>
        <p>
          The key isn&apos;t to avoid AI but to use it actively and in a balanced
          way, making technology a powerful ally rather than a threat.
        </p>
      </Prose>

        <FindingCard>
          <SlideHead>Primary research</SlideHead>
          <h3>
            Augmented intelligence tends to make the better choice, particularly in
            complex decision-making scenarios
          </h3>
          <p>
            Using technology and AI is not inherently bad—in fact, it can be highly
            beneficial. In complex decision-making, combining human intelligence
            with AI, also known as augmented intelligence, often leads to better
            outcomes compared to relying solely on humans or AI.
          </p>
          <p>
            AI tends to outperform humans in high-confidence situations where clear
            and consistent patterns exist.
          </p>
          <p>
            However, humans excel in mid-confidence cases, drawing on broader
            contextual understanding and adapting to unique, rare, or complex
            scenarios.
          </p>
          <p>
            By leveraging AI at a moderate and thoughtful level, we can enhance the
            decision-making process by balancing the strengths of both humans and
            AI. Therefore, using AI is not harmful if it is approached actively and
            in a balanced manner.
          </p>
        </FindingCard>

      <Prose>
        <p>Then which one is better Speech-based or text-based AI?</p>
        <p>Well… both! Each has its own strengths.</p>
      </Prose>

        <FindingCard>
          <SlideHead>Primary research</SlideHead>
          <h3>
            Speech-based AI with text-based AI has even greater potential to
            enhance critical thinking.
          </h3>
          <p>
            The answer is not so simple—both have their own unique strengths. Voice
            assistants are more efficient and engaging for goal-directed tasks,
            offering quick, hands-free solutions that enhance productivity. On the
            other hand, chatbots are more effective for exploratory or experiential
            activities, where users can dive deeper into learning or
            problem-solving at their own pace. Combining these two approaches has
            the potential to create a more balanced and impactful tool,
            particularly for fostering critical thinking.
          </p>
          <p>
            This raised another question for me: what do people think about
            interacting with AI? Understanding user perspectives became an
            important part of my research.
          </p>
        </FindingCard>

      <Prose>
        <p>
          Alright, let&apos;s dive into what people really think about interacting
          with AI!
        </p>
        <p>Many find talking to GPT kind of boring.</p>
      </Prose>

        <FindingCard>
          <SlideHead>Primary research</SlideHead>
          <h3>Talking to GPT is boring.</h3>
          <p>
            Many people find interacting with ChatGPT dull and uninspiring.
            Participants in studies noted that ChatGPT lacked human-like
            &quot;personal visualization,&quot; which made the interaction feel
            less engaging and impersonal. Some suggested that incorporating a
            visual character alongside the text could make the experience more
            personal and enjoyable—an idea I found particularly interesting. This
            highlights a potential gap in conversational AI, where adding visual
            and interactive elements could improve user engagement and make the
            interaction more dynamic.
          </p>
          <h3>Robot? It&apos;s fun, but creepy.</h3>
          <p>
            On the other hand, studies comparing conversational AI with robot
            interfaces revealed that participants found interacting with robots
            enjoyable and fun, largely due to their expressive facial features and
            engaging interfaces. However, the robot&apos;s blinking and its eyes
            were often cited as sources of discomfort, with some participants
            describing them as &quot;creepy.&quot; While robots bring a more
            entertaining and interactive experience, their human-like traits can
            evoke unease, emphasizing the need for careful design to balance
            engagement with user comfort.
          </p>
        </FindingCard>

      <Prose>
        <p>
          So... you&apos;re addressing a problem caused by digital technology using
          more digital technology?
        </p>
        <p>Isn&apos;t This a Paradox?</p>
        <p>
          There&apos;s definitely a risk of worsening the problem by relying on the
          same digital technology that contributed to it.
        </p>
        <p>
          However, over half of the interview participants reported experiencing
          cognitive issues and stated that they use AI to address these challenges.
        </p>
        <p>
          Five out of seven participants who noticed changes in their cognitive
          functions mentioned relying on AI tools like ChatGPT, Copilot, and
          Perplexity to stay focused. These tools have become essential for
          managing their daily lives, whether for work or study. People are already
          turning to digital technology, through AI, to solve the problems it has
          created.
        </p>
      </Prose>
    </div>
  )
}
