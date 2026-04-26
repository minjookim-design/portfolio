/**
 * `/test` home: Chosun Ilbo Myeongjo for project names and case-study rail headings (single regular master).
 */
export const TEST_HOME_PROJECT_TITLE_SERIF =
  "font-['ChosunIlboMyungjo',serif] font-normal not-italic uppercase leading-[1.1] tracking-[-0.06em]"

/**
 * `/test` home: hero meta row labels (Team/Role, Problem, …) — IBM Plex Mono, bold, same `text-[12px]` / `leading-[1.2]` as value column.
 */
export const TEST_HOME_HERO_META_LABEL_SERIF =
  "font-mono text-[12px] font-bold not-italic uppercase leading-[1.2]"

/**
 * `/test` home: in-column section headings only (`text-[27px]` Chosun), no `uppercase`.
 */
export const TEST_HOME_SECTION_CONTENT_HEADING_SERIF =
  "font-['ChosunIlboMyungjo',serif] text-[27px] font-normal not-italic leading-[1.1] tracking-[-0.06em]"

/**
 * `/test` home: left-rail `CaseStudyRailTitle` only (`text-[20px]` Chosun), same rhythm as content heading.
 */
export const TEST_HOME_SECTION_RAIL_TITLE_SERIF =
  "font-['ChosunIlboMyungjo',serif] text-[20px] font-normal not-italic leading-[1.1] tracking-[-0.06em]"

/**
 * `/test` details column: same inverted surface as active `humanSpyRow` in the project list
 * (`bg-black text-white` light / `bg-white text-black` dark).
 */
export function testHomeDetailsSectionHighlightClass(isDark: boolean, active: boolean): string {
  if (!active) return ''
  return `px-3 py-4 transition-colors ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`
}
