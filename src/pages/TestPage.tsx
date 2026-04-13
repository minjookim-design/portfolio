import { usePageTheme } from '../context/PageThemeContext'
import { HomePageView, HOME_PAGE_DESIGN_TEST_CONFIG } from './HomePage'

/**
 * Design test route (`/test`): same `HomePageView` pipeline as `/`, with isolated session keys and experimental UI.
 *
 * - Column widths: `sessionStorage` key `test-split-widths` (production uses `home-split-widths`).
 * - Split onboarding “seen”: `test-onboarding-v1` (production uses `portfolio-home-split-onboarding-v1`).
 *
 * **Production vs test:** `HOME_PAGE_PRODUCTION_CONFIG` sets `classicShellAndIntroColumn: true` (deployed gray
 * shell `#e8e8e8` + flat first column). This config sets `classicShellAndIntroColumn: false` so `/test` keeps
 * experimental first-column UI (framed collapsible panes, blue shell, etc.). Shared menu/details logic lives in
 * `HomePageView` for both routes.
 *
 * **Scoped CSS:** the shared root sets `data-design-test="1"` only for this config. Add rules here using
 * `[data-design-test="1"] …` so production `/` is never targeted.
 *
 * **Framer Motion:** animation code lives in `HomePageView`; changing it affects both routes. For motion-only
 * experiments, use a config flag in `HomePage.tsx` or temporarily fork—never edit production motion without
 * guarding behind config.
 */
function DesignTestModeBadge() {
  const { isDark } = usePageTheme()
  return (
    <div
      className="pointer-events-none fixed left-4 top-[max(2.75rem,env(safe-area-inset-top,0px)+0.35rem)] z-[60] select-none"
      role="status"
      aria-label="Design test page"
    >
      <span
        className={`inline-block rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] opacity-[0.72] ${
          isDark
            ? 'border-white/22 text-white/80 bg-black/30'
            : 'border-black/14 text-black/62 bg-white/50'
        }`}
      >
        TEST MODE
      </span>
    </div>
  )
}

export function TestPage() {
  return (
    <>
      <style>
        {`
          /* Design-test-only overrides — selectors must include [data-design-test="1"] */
        `}
      </style>
      <DesignTestModeBadge />
      <HomePageView config={HOME_PAGE_DESIGN_TEST_CONFIG} />
    </>
  )
}
