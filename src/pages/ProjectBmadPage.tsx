import { ScrollSection } from '../components/ScrollSection'
import { CASE_STUDY_MOBILE_DETAILS_SCROLL_CLASS } from './caseStudyMobileShell'

const NEON = '#39ff14'

export function ProjectBmadPage() {
  return (
    <div
      className={`${CASE_STUDY_MOBILE_DETAILS_SCROLL_CLASS} min-h-[100dvh] overflow-x-hidden bg-[#111111] pr-4 pt-[max(3.5rem,env(safe-area-inset-top,0px)+0.25rem)] pb-24 text-[#cccccc]`}
    >
      <ScrollSection id="bmad-overview">
        <div className="max-w-[674px]">
          <p className="font-bold" style={{ fontSize: 40, lineHeight: '44px', marginBottom: 24 }}>
            Currently working on it...
          </p>

          {[
            'Designed AI-driven products across VR, web, and mobile by leveraging 3D spatial principles, translating immersive spatial experiences into intuitive 2D interfaces.',
            'Built a scalable multi-platform design system including accessible components and interaction guidelines.',
            'Accelerated development cycles by leveraging AI tools to optimize VR spatial parameters (e.g., legibility distance, ergonomic sizing).',
            'Streamlined the implementation process by establishing direct feedback loops with engineers to provide immediate guidance.',
          ].map((bullet, i) => (
            <div key={i} className="flex items-start gap-3" style={{ marginBottom: 16 }}>
              <span
                style={{
                  color: NEON,
                  width: 9,
                  height: 9,
                  borderRadius: '50%',
                  background: NEON,
                  flexShrink: 0,
                  marginTop: 6,
                }}
              />
              <p style={{ color: '#cccccc', lineHeight: '28px' }}>{bullet}</p>
            </div>
          ))}
        </div>
      </ScrollSection>
    </div>
  )
}
