import { ScrambleText } from './ScrambleText'
import { NavMenu } from './NavMenu'

const NEON = '#39ff14'

export function LeftPanel() {
  return (
    <div className="flex flex-col h-full px-6 py-8" style={{ gap: 24 }}>
      {/* Name / Role */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <p className="font-bold text-white whitespace-nowrap">
          <ScrambleText text="MINJOO KIM" delay={200} />
        </p>
        <p className="font-bold whitespace-nowrap" style={{ color: NEON }}>
          <ScrambleText text="PRODUCT DESIGNER" delay={600} />
        </p>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }} />

      {/* Navigation */}
      <NavMenu />
    </div>
  )
}
