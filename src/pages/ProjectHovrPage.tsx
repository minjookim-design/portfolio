import { ScrollSection } from '../components/ScrollSection'

const NEON = '#39ff14'
const YELLOW = '#ffee00'
const RED = '#ff3131'

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-bold" style={{ fontSize: 40, lineHeight: '44px', marginBottom: 20 }}>
      {children}
    </p>
  )
}

function Bullet({
  children,
  color = NEON,
}: {
  children: React.ReactNode
  color?: string
}) {
  return (
    <div className="flex items-start gap-3" style={{ marginBottom: 12 }}>
      <span
        style={{
          width: 9,
          height: 9,
          borderRadius: '50%',
          background: color,
          flexShrink: 0,
          marginTop: 6,
        }}
      />
      <p style={{ color: '#cccccc', lineHeight: '28px' }}>{children}</p>
    </div>
  )
}

function ResearchCard({
  title,
  body,
}: {
  title: string
  body: string
}) {
  return (
    <div
      style={{
        background: '#ffffff',
        color: '#000000',
        padding: 16,
        flex: '1 1 200px',
      }}
    >
      <p className="font-bold" style={{ color: RED, marginBottom: 12, lineHeight: '24px' }}>
        {title}
      </p>
      <p style={{ lineHeight: '24px', fontSize: 14 }}>{body}</p>
    </div>
  )
}

function SolutionCard({
  title,
  body,
}: {
  title: string
  body: string
}) {
  return (
    <div
      style={{
        background: '#ffffff',
        color: '#000000',
        padding: 16,
        flex: '1 1 280px',
      }}
    >
      <p className="font-bold" style={{ color: RED, marginBottom: 12, lineHeight: '24px' }}>
        {title}
      </p>
      <p style={{ lineHeight: '24px', fontSize: 14 }}>{body}</p>
    </div>
  )
}

function VideoBlock({ src, style }: { src: string; style?: React.CSSProperties }) {
  return (
    <video
      src={`/hovr/${src}`}
      autoPlay
      loop
      muted
      playsInline
      style={{ width: '100%', objectFit: 'cover', ...style }}
    />
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function ProjectHovrPage() {
  return (
    <div style={{ paddingTop: 16, paddingLeft: 10, paddingBottom: 80 }}>

      {/* ── Overview ─────────────────────────────────────────────────── */}
      <ScrollSection id="overview">
        <div style={{ maxWidth: 674 }}>
          <SectionTitle>Hovr Admin</SectionTitle>
          <VideoBlock src="Bulk-approval.mp4" style={{ maxHeight: 420, marginBottom: 28 }} />

          <p className="font-bold" style={{ marginBottom: 16 }}>Project Objectives</p>

          <Bullet color={YELLOW}>
            On the original website, the driver approval process took 48.08 seconds. This lengthy
            process was reduced to 7.26 seconds, achieving an <strong>84.9% time savings</strong>.
          </Bullet>
          <Bullet color={YELLOW}>
            Restructured the flow to give permissions all required documents for driver approval.
          </Bullet>
          <Bullet color={YELLOW}>
            Organized a vast amount of driver data to ensure it was easily scannable at a glance.
          </Bullet>

          <VideoBlock src="Workflow-time.mp4" style={{ marginTop: 20 }} />
        </div>
      </ScrollSection>

      {/* ── The Goal ─────────────────────────────────────────────────── */}
      <ScrollSection id="the-goal">
        <div style={{ maxWidth: 674 }}>
          <SectionTitle>The Goal</SectionTitle>
          <p style={{ color: NEON, marginBottom: 16, lineHeight: '28px' }}>
            The goal is to improve efficiency and reduce the time required for approvals.
          </p>
          <p style={{ color: '#cccccc', lineHeight: '28px', marginBottom: 20 }}>
            In the existing admin panel, support staff must manually click on each uploaded document
            to review them, making the driver approval process time-consuming.
          </p>
          <img
            src="/hovr/Product-research.jpg"
            alt="Product research"
            style={{ width: '100%', objectFit: 'cover' }}
          />
        </div>
      </ScrollSection>

      {/* ── Research ─────────────────────────────────────────────────── */}
      <ScrollSection id="research">
        <div style={{ maxWidth: 674 }}>
          <SectionTitle>So I did some research &amp; Interview and found out</SectionTitle>
          <p style={{ color: NEON, marginBottom: 16 }}>
            The Approval system should be simplified.
          </p>
          <p style={{ color: '#cccccc', lineHeight: '28px', marginBottom: 24 }}>
            Support staff repeatedly emphasized the inefficiency of manually clicking each document
            to review them. Even with automation, they must verify the documents manually, making the
            process too time-consuming.
          </p>
          <div className="flex flex-wrap gap-3">
            <ResearchCard
              title="CUMBERSOME DOCUMENT REVIEW & REJECTION PROCESS"
              body="The current rejection process requires opening a popup and scrolling to the bottom to find rejection reasons, making it inconvenient."
            />
            <ResearchCard
              title="CONCERN ABOUT AUTOMATIC SCANNING ACCURACY"
              body="While developers stated that the automatic scanning technology has over 90% accuracy, support staff worried about potential errors."
            />
            <ResearchCard
              title="DESIRE FOR BULK APPROVAL"
              body="Support staff expressed the need to approve multiple documents at once. If all scanned and manually entered data match, they suggested an option to approve all nine required documents in a single action."
            />
          </div>
        </div>
      </ScrollSection>

      {/* ── Solution Sketch ──────────────────────────────────────────── */}
      <ScrollSection id="solution-sketch">
        <div style={{ maxWidth: 674 }}>
          <SectionTitle>Potential Solutions should be</SectionTitle>
          <p style={{ color: NEON, marginBottom: 16 }}>
            Minimize Clicks and Simplifying Approval and Rejection System.
          </p>
          <p style={{ color: '#cccccc', lineHeight: '28px', marginBottom: 24 }}>
            After meetings with the support team (primary users) and developers, I gained a clear
            understanding of both technical feasibility and user pain points. The support team needed
            a way to review all nine submitted documents with minimal clicks.
          </p>
          <div className="flex flex-wrap gap-3" style={{ marginBottom: 16 }}>
            <SolutionCard
              title="CARD DESIGN"
              body="All documents should be displayed as cards without requiring a click so they remain visible for easy review."
            />
            <SolutionCard
              title="BULK APPROVAL & APPROVAL ONE BY ONE"
              body="A checkbox or multi-selection option should be available for bulk approval. However, users must still verify the legitimacy of each document before approving in bulk."
            />
          </div>
          <div className="flex flex-wrap gap-3" style={{ marginBottom: 20 }}>
            <SolutionCard
              title="SIMPLE REJECTION PROCESS"
              body="Support staff suggested separating the rejection process from approval to allow for a more efficient and streamlined rejection flow."
            />
            <SolutionCard
              title="VISUAL CUES FOR CHECKING INFO ACCURACY"
              body="A visual cue showing whether the typed and scanned information matches will help users verify the document's accuracy before approval."
            />
          </div>
          <img
            src="/hovr/card-design 1.jpg"
            alt="Card design exploration"
            style={{ width: '100%', objectFit: 'cover' }}
          />
        </div>
      </ScrollSection>

      {/* ── Final Solution ───────────────────────────────────────────── */}
      <ScrollSection id="final-solution">
        <div style={{ maxWidth: 674 }}>
          <SectionTitle>Final Solution</SectionTitle>
          <img
            src="/hovr/final-solution.jpg"
            alt="Final solution"
            style={{ width: '100%', objectFit: 'cover', marginBottom: 40 }}
          />

          {/* Bulk Approval */}
          <p className="font-bold" style={{ fontSize: 28, lineHeight: '32px', marginBottom: 12 }}>
            Bulk approval
          </p>
          <p style={{ color: NEON, marginBottom: 12 }}>
            The support team can quickly review all submitted documents at once.
          </p>
          <p style={{ color: '#cccccc', lineHeight: '28px', marginBottom: 16 }}>
            If the information appears correct, they can select all documents and approve them in a
            single action.
          </p>
          <VideoBlock src="Bulk-approval.mp4" style={{ marginBottom: 12 }} />
          <p style={{ color: '#cccccc', lineHeight: '28px', marginBottom: 20 }}>
            The support team can still edit documents after approval if needed.
          </p>
          <VideoBlock src="After-Approval.mp4" style={{ marginBottom: 40 }} />

          {/* Individual Approval */}
          <p className="font-bold" style={{ fontSize: 28, lineHeight: '32px', marginBottom: 12 }}>
            Approve Documents Individually
          </p>
          <p style={{ color: NEON, marginBottom: 12 }}>
            Support team members can review and approve documents one at a time as needed.
          </p>
          <p style={{ color: '#cccccc', lineHeight: '28px', marginBottom: 16 }}>
            If the scanned document and manually entered data don't match, users can click each
            document card on the left to compare and verify the information.
          </p>
          <VideoBlock src="Document-list.mp4" style={{ marginBottom: 12 }} />
          <p style={{ color: '#cccccc', lineHeight: '28px', marginBottom: 16 }}>
            Then, if the document looks legitimate, the support team can approve it directly on the
            same screen without seeing a popup or navigating to another page.
          </p>
          <VideoBlock src="Approve-one.mp4" style={{ marginBottom: 40 }} />

          {/* Rejection */}
          <p className="font-bold" style={{ fontSize: 28, lineHeight: '32px', marginBottom: 12 }}>
            Rejection Process
          </p>
          <p style={{ color: NEON, marginBottom: 12, lineHeight: '28px' }}>
            The support team can reject submitted documents individually. To prevent mistakes, the
            rejection process includes a few additional steps.
          </p>
          <p style={{ color: '#cccccc', lineHeight: '28px', marginBottom: 16 }}>
            If a document is invalid, users can reject it by clicking the Reject button. A rejection
            reason must be provided to complete the process. The rejection reason is then sent to the
            driver via SMS.
          </p>
          <VideoBlock src="Reject.mp4" />
        </div>
      </ScrollSection>

      {/* ── Takeaway ─────────────────────────────────────────────────── */}
      <ScrollSection id="takeaway">
        <div style={{ maxWidth: 674 }}>
          <SectionTitle>Takeaway</SectionTitle>
          <p style={{ color: NEON, marginBottom: 16, lineHeight: '28px' }}>
            Understanding Users' Needs and Identifying the Right Pain Points is Key to Product Design.
          </p>
          <p style={{ color: '#cccccc', lineHeight: '28px' }}>
            Unlike public-facing products, an admin website is designed specifically for internal
            teams, meaning efficient workflows take priority over aesthetic UI. The driver approval
            process was the biggest pain point for the support team because they had to manually
            review a massive number of submitted documents, making the process extremely
            time-consuming. Their need for a better workflow was more urgent than I initially
            expected, which I only fully realized through direct conversations and user empathy.
            Additionally, at the design team's request, the support team provided a clear list of
            essential features and design requirements, which greatly streamlined the solution
            development process. This experience reinforced the importance of direct user
            communication and collaboration in UX design, particularly in a fast-paced startup
            environment where rapid problem-solving is crucial.
          </p>
        </div>
      </ScrollSection>

    </div>
  )
}
