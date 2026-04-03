import type { ReactNode } from 'react'

const CASE_STUDY_RAIL_LABEL_W = 130

/**
 * Horizontal gap (px) between the rail label and body from the case-study column width.
 * Uses space after the fixed rail so the gap tightens as the column narrows (split panes, resize).
 */
export function caseStudyHomeRailGapPx(columnWidth: number): number {
  if (!Number.isFinite(columnWidth) || columnWidth <= 0) return 161
  const minGap = 14
  const maxGap = 161
  const remaining = Math.max(0, columnWidth - CASE_STUDY_RAIL_LABEL_W)
  const raw = remaining * 0.19
  return Math.round(Math.max(minGap, Math.min(maxGap, raw)))
}

type CaseStudyRailTitleProps = {
  className: string
  children: ReactNode
}

/** Section rail title in the scrollable column — fixed full opacity. */
export function CaseStudyRailTitle({ className, children }: CaseStudyRailTitleProps) {
  return <p className={`${className} opacity-100`}>{children}</p>
}
