import { ScrambleText } from './ScrambleText'
import { NavMenu } from './NavMenu'

export function HeroSection() {
  return (
    <section className="w-full min-h-screen bg-black font-mono text-[14px] leading-[16px]">

      <div className="flex p-[16px] gap-[24px]">

        {/* ── Left column: Name / Title ──────────────────────────────────── */}
        <div className="w-[150px] flex-shrink-0 whitespace-nowrap">
          <p className="font-bold text-white">
            <ScrambleText text="MINJOO KIM" delay={200} />
          </p>
          <p className="font-bold text-[#00FF00]">
            <ScrambleText text="PRODUCT DESIGNER" delay={600} />
          </p>
        </div>

        {/* ── Right column: Content ──────────────────────────────────────── */}
        <div className="text-white">

          {/* CORE_FOCUS */}
          <p className="font-bold">// CORE_FOCUS</p>
          <p><span className="text-[#00FF00] cursor-blink">●</span> Web &amp; Mobile Interfaces</p>
          <p><span className="text-[#00FF00] cursor-blink">●</span> VR &amp; Spatial Design</p>

          {/* SYS_INFO */}
          <p>================================================</p>
          <p>&gt; SYS_INFO: PORTFOLIO ARCHITECTURE</p>
          <p>&gt; DESIGNED BY : MINJOO</p>
          <p>&gt; CODED BY    : MINJOO (VIA AGENTIC WORKFLOW)</p>
          <p>&gt; POWERED BY  : CLAUDE AI + FIGMA MCP</p>
          <p>================================================</p>

          {/* SEE MORE */}
          <p className="mt-[16px]">[+] SEE MORE</p>

          {/* Nav Menu */}
          <div className="mt-[16px]">
            <NavMenu />
          </div>

        </div>

      </div>

    </section>
  )
}
