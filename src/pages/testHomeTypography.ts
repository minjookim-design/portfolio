/**
 * `/test` home only: Instrument Serif for project names and case-study rail headings.
 * (Google Fonts family name is "Instrument Serif"; "Instrumental" is a common alternate spelling in stacks.)
 */
export const TEST_HOME_PROJECT_TITLE_SERIF =
  "font-['Instrument_Serif',serif] font-normal not-italic uppercase leading-[1.1] tracking-[-0.02em]"

/**
 * `/test` home: hero meta row labels (Team/Role, Problem, …) — one weight step above
 * `TEST_HOME_PROJECT_TITLE_SERIF` (family is 400-only; browsers synthesize ~500).
 */
export const TEST_HOME_HERO_META_LABEL_SERIF =
  "font-['Instrument_Serif',serif] font-medium not-italic uppercase leading-[1.1] tracking-[-0.02em]"

/** `/test` home: in-column section headings (+4px vs 18px rail), no `uppercase`. */
export const TEST_HOME_SECTION_CONTENT_HEADING_SERIF =
  "font-['Instrument_Serif',serif] text-[22px] font-normal not-italic leading-[1.1] tracking-[-0.02em]"

/**
 * `/test` details column: same inverted surface as active `humanSpyRow` in the project list
 * (`bg-black text-white` light / `bg-white text-black` dark).
 */
export function testHomeDetailsSectionHighlightClass(isDark: boolean, active: boolean): string {
  if (!active) return ''
  return `px-3 py-4 transition-colors ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`
}
