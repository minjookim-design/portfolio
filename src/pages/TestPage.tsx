import { TestHomePage } from './TestHomePage'

/**
 * Design test route (`/test`): home UI is `TestHomePageView` from `TestHomePage.tsx` (same as `/`, different config).
 * Production `/` uses the same view via `HomePage.tsx` (different config only).
 *
 * - Column widths: `sessionStorage` key `test-split-widths` (production uses `home-split-widths`).
 * - Split onboarding “seen”: `test-onboarding-v1` (production uses `portfolio-home-split-onboarding-v1`).
 *
 * **Scoped CSS:** `TestHomePage` sets `data-design-test="1"` via `TEST_HOME_PAGE_CONFIG`. Add rules in the
 * `<style>` block below using `[data-design-test="1"] …` so production `/` is never targeted.
 */
function DesignTestModeBadge() {
  return (
    <div
      className="pointer-events-none fixed left-4 top-[max(2.75rem,env(safe-area-inset-top,0px)+0.35rem)] z-[60] select-none"
      role="status"
      aria-label="Design test page"
    >
      <span className="inline-block rounded border border-black/14 bg-white/50 px-1.5 py-0.5 font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-black/62 opacity-[0.72] dark:border-white/22 dark:bg-black/30 dark:text-white/80">
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
          /* Project name column: match Idx / table (IBM Plex Mono), not Chosun display */
          [data-design-test="1"] .test-project-title {
            font-family: "IBM Plex Mono", monospace;
            font-weight: 500;
            letter-spacing: 0.06em;
            line-height: 1.25;
            text-transform: uppercase;
            font-style: normal;
          }
        `}
      </style>
      <DesignTestModeBadge />
      <TestHomePage />
    </>
  )
}
