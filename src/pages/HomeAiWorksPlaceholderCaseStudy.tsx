import React, { Fragment, useMemo } from 'react'
import { motion } from 'framer-motion'
import { CaseStudyRailTitle } from '../components/CaseStudyRailTitle'
import { MediaBlock } from './HovrProjectPage'
import { useCaseStudyHomeRailGap } from '../hooks/useCaseStudyHomeRailGap'
import { buildCaseStudyHeroEntranceVariants } from './homeCaseStudyHeroMotion'
import {
  TEST_HOME_HERO_META_LABEL_SERIF,
  TEST_HOME_PROJECT_TITLE_SERIF,
  TEST_HOME_SECTION_CONTENT_HEADING_SERIF,
  TEST_HOME_SECTION_RAIL_TITLE_SERIF,
  testHomeDetailsSectionHighlightClass,
} from './testHomeTypography'

/** Matches `HOVR_CASE_BODY_CLASS` / `HOVR_SECTION_BODY_CLASS` for visual parity with {@link HomeHovrCaseStudy}. */
const CASE_BODY = 'font-mono text-[12px] font-normal leading-[1.2] tracking-[-0.02em]'
const SECTION_BODY = 'text-[12px] font-normal font-mono leading-[1.2] tracking-[-0.02em]'

type MetaRow = { label: string; value: string; valuePreLine?: boolean }

const FRAMER_SECTION_META: readonly MetaRow[] = [
  { label: 'Team / Role', value: 'Component Designer & Creator (Independent)' },
  {
    label: 'Problem',
    value:
      'High-fidelity visual designs often stall at the implementation phase due to the technical gap between design and code. Traditional full-scale development is too rigid to match the rapid pace of AI-driven market trends, trapping designers in single-platform silos and limiting their execution speed.',
  },
  {
    label: 'Solution',
    value:
      'Pioneered a "Vibe Coding" methodology, leveraging generative AI to bridge the gap between human aesthetic sensibility and technical execution. Shifted from building static sites to crafting modular, high-trend "plug-and-play" micro-assets, ensuring maximum agility and production-ready visual fidelity.',
  },
  {
    label: 'Impact',
    valuePreLine: true,
    value:
      '• Commercial Success: Successfully commercialized digital assets, achieving 3,000+ cumulative views and generating $100+ USD in early revenue.\n\n• Technical Independence: Proven ability for designers to execute high-quality front-end components independently through AI-enhanced workflows.\n\n• Thought Leadership: Established a professional narrative around "AI-Era Designer Survival Strategies" on LinkedIn, advocating for the balance of human touch and AI execution.',
  },
]

const DEFAULT_SECTION_META: readonly MetaRow[] = [
  { label: 'Team / Role', value: 'Placeholder — team & ownership TBD.' },
  {
    label: 'Problem',
    value: 'Placeholder — problem framing for this stream TBD.',
  },
  {
    label: 'Solution',
    value: 'Placeholder — Framer components, portfolio shell, automation TBD.',
  },
  {
    label: 'Impact',
    value: 'Placeholder — metrics & outcomes TBD.',
  },
]

function sectionMetaRows(sectionId: string): readonly MetaRow[] {
  return sectionId === 'framer-components' ? FRAMER_SECTION_META : DEFAULT_SECTION_META
}

export type AiWorksSpySection = { id: string; label: string; body: string; media?: string }

/**
 * `/test` PR05: title + roles hero (no top image). Per-section meta under each rail section; spy order from
 * `HOME_PROJECTS`.
 */
export function HomeAiWorksPlaceholderCaseStudy({
  isDark,
  isMobile,
  sectionRefs,
  onMediaClick,
  entranceActive,
  reduceMotion,
  onHeroEntranceComplete,
  testHomeHighlightSectionId,
  title,
  rolesLine,
  sections,
}: {
  isDark: boolean
  isMobile: boolean
  sectionRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
  onMediaClick: (src: string) => void
  entranceActive: boolean
  reduceMotion: boolean
  onHeroEntranceComplete?: () => void
  testHomeHighlightSectionId?: string | null
  title: string
  rolesLine: string
  sections: AiWorksSpySection[]
}) {
  const fg = isDark ? '#FFFFFF' : '#000000'
  const { rootRef, railGapPx } = useCaseStudyHomeRailGap()
  const heroV = useMemo(() => buildCaseStudyHeroEntranceVariants(reduceMotion), [reduceMotion])
  const heroState = entranceActive ? 'visible' : 'hidden'
  const heroInitial = reduceMotion ? false : 'hidden'
  const heroMetaLabelClass = TEST_HOME_HERO_META_LABEL_SERIF
  const homeSectionContentHeadingClass = TEST_HOME_SECTION_CONTENT_HEADING_SERIF

  return (
    <div
      ref={rootRef}
      className="flex w-full min-w-0 flex-col pb-4 md:min-h-0"
      style={{ fontFamily: 'Arial, sans-serif', color: fg }}
    >
      <motion.div
        className="mb-0 w-full"
        variants={heroV.heroContainer}
        initial={heroInitial}
        animate={heroState}
      >
        <motion.h1
          variants={heroV.heroItem}
          className={`mb-[10px] mt-0 whitespace-pre-line text-[clamp(2.1rem,8.4vw,3rem)] md:text-[48px] ${TEST_HOME_PROJECT_TITLE_SERIF}`}
        >
          {title}
        </motion.h1>

        <motion.p
          variants={heroV.heroItem}
          className={`mb-[75px] mt-0 ${CASE_BODY}`}
          onAnimationComplete={() => {
            if (entranceActive) onHeroEntranceComplete?.()
          }}
        >
          {rolesLine}
        </motion.p>
      </motion.div>

      {sections.map((section, i) => {
        const isProcess = section.id.endsWith('--process')
        const metaRows = !isProcess ? sectionMetaRows(section.id) : null
        const sectionSpyActive =
          Boolean(testHomeHighlightSectionId) && section.id === testHomeHighlightSectionId
        return (
          <motion.div
            key={section.id}
            ref={(el) => {
              sectionRefs.current[i] = el
            }}
            className={[
              isProcess ? 'mb-[200px] last:mb-0' : 'mb-10 md:mb-12',
              testHomeDetailsSectionHighlightClass(isDark, sectionSpyActive),
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ transformOrigin: 'top center' }}
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, ease: [0.44, 0, 0.3, 0.99] }}
          >
            <div
              className="flex items-start gap-5"
              style={{
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? 20 : railGapPx,
              }}
            >
              <CaseStudyRailTitle
                className={`shrink-0 whitespace-nowrap ${TEST_HOME_SECTION_RAIL_TITLE_SERIF} ${isMobile ? 'w-full' : 'w-[130px]'}`}
              >
                {section.label}
              </CaseStudyRailTitle>

              <div
                className={`flex min-w-0 w-full flex-col gap-4 ${SECTION_BODY}`}
                style={{ width: isMobile ? '100%' : undefined }}
              >
                <p className={homeSectionContentHeadingClass}>{section.label}</p>
                {section.body.split('\n\n').map((para, idx) => (
                  <p key={idx} className={idx === 0 ? '-mt-[10px]' : undefined}>
                    {para}
                  </p>
                ))}
                {!isProcess && section.media ? (
                  <MediaBlock src={section.media} onMediaClick={onMediaClick} />
                ) : null}

                {!isProcess && metaRows ? (
                  <div className="mt-10 flex w-full flex-col gap-y-2 border-t border-black/10 pt-8 dark:border-white/10">
                    <div className="flex w-full items-center gap-x-[20px]">
                      <span className={`shrink-0 whitespace-nowrap ${heroMetaLabelClass}`}>{metaRows[0].label}</span>
                      <span className={`min-w-0 flex-1 ${CASE_BODY}`}>{metaRows[0].value}</span>
                    </div>
                    <div className="h-[10px] shrink-0" aria-hidden />
                    <div className="grid w-full grid-cols-[auto_1fr] items-start gap-x-[20px] gap-y-2">
                      {metaRows.slice(1).map((row) => (
                        <Fragment key={`${section.id}-${row.label}`}>
                          <span className={`shrink-0 whitespace-nowrap ${heroMetaLabelClass}`}>{row.label}</span>
                          <span
                            className={[
                              'min-w-0',
                              CASE_BODY,
                              row.valuePreLine ? 'whitespace-pre-line' : '',
                            ]
                              .filter(Boolean)
                              .join(' ')}
                          >
                            {row.value}
                          </span>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
