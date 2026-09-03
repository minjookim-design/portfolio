/**
 * Dual accessibility stats chart for AR Fitting Room (Background).
 * Motion language mirrors PiikImpactStoryGraph: viewport-triggered grow + stagger.
 */
import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { usePageTheme } from '../context/PageThemeContext'

const GRAPH_EASE = [0.87, 0, 0.13, 1] as const
const VIEWPORT = { once: true, margin: '-80px' } as const

const BLUE = '#4CA5FF'
const CORAL = '#FF6B6B'
/** Soft fill behind the highlighted bar — same treatment on both charts. */
const INDICATOR_OPACITY = 0.18
/** Match weekly vertical plot height on both charts. */
const PLOT_HEIGHT = 'h-[220px] sm:h-[260px]'
/** Shared bar thickness — only the percentage axis grows. */
const BAR_THICK_W = 'w-9 sm:w-10'
const BAR_THICK_H = 'h-9 sm:h-10'

const WEEKLY_MAX = 50
const WEEKLY_BARS = [
  {
    label: 'General consumers',
    lines: ['General', 'consumers'] as const,
    value: 22,
    accent: false as const,
    showValue: false,
  },
  {
    label: 'People with disabilities',
    lines: ['People with', 'disabilities'] as const,
    value: 50,
    accent: 'blue' as const,
    showValue: true,
  },
]

const FACTOR_MAX = 60
const FACTOR_BARS = [
  { label: 'Accessibility', value: 56, accent: 'coral' as const, showValue: true },
  { label: 'Variety', value: 50, accent: false as const, showValue: false },
  { label: 'Price', value: 40, accent: false as const, showValue: false },
]

function barColor(accent: false | 'blue' | 'coral', isDark: boolean) {
  if (accent === 'blue') return BLUE
  if (accent === 'coral') return CORAL
  return isDark ? '#a1a1aa' : '#52525b'
}

function labelColor(accent: false | 'blue' | 'coral', isDark: boolean) {
  if (accent === 'blue') return BLUE
  if (accent === 'coral') return CORAL
  return isDark ? 'rgba(242,242,242,0.55)' : 'rgba(0,0,0,0.45)'
}

function accentHex(accent: 'blue' | 'coral') {
  return accent === 'blue' ? BLUE : CORAL
}

function reveal(
  reduceMotion: boolean | null,
  visible: Record<string, number | string>,
  hidden: Record<string, number | string>,
  transition?: Record<string, unknown>,
) {
  if (reduceMotion) return { initial: false as const }
  return {
    initial: hidden,
    whileInView: visible,
    viewport: VIEWPORT,
    transition,
  }
}

export function ArFittingStatsGraph() {
  const reduceMotion = useReducedMotion()
  const { isDark } = usePageTheme()
  const [hoveredWeekly, setHoveredWeekly] = useState<string | null>(null)
  const [hoveredFactor, setHoveredFactor] = useState<string | null>(null)

  const pace = 1
  const t = (seconds: number) => seconds / pace
  const axesDelay = 0
  const weeklyBarDelay = t(0.2)
  const weeklyStagger = t(0.12)
  const weeklyDuration = t(0.75)
  const factorDelay = t(0.55)
  const factorStagger = t(0.1)
  const factorDuration = t(0.7)
  const captionDelay = factorDelay + factorDuration + t(0.25)
  const indicatorDelay = weeklyBarDelay
  const indicatorDuration = weeklyDuration

  const mono =
    "font-['IBM_Plex_Mono',monospace] text-[9px] uppercase tracking-[0.08em]"
  const valueType =
    "font-['SUIT_Variable',sans-serif] text-[11px] font-bold tracking-tight"
  const axisLabel =
    "font-['SUIT_Variable',sans-serif] text-[11px] font-semibold tracking-tight"
  const gridLine = isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.1)'
  const tickClass = `${mono} text-black/35 dark:text-white/35`
  const titleClass = `${mono} mb-5 text-black/45 dark:text-white/45`
  const valueOnBar = (accent: false | 'blue' | 'coral') =>
    accent ? 'text-white' : 'text-white dark:text-black'

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
        {/* Weekly online shopping — vertical bars */}
        <div className="min-w-0 w-full">
          <motion.p
            className={titleClass}
            {...reveal(
              reduceMotion,
              { opacity: 1, y: 0 },
              { opacity: 0, y: 8 },
              { delay: axesDelay, duration: t(0.4), ease: GRAPH_EASE },
            )}
          >
            Shop online weekly
          </motion.p>

          <div className={`relative ${PLOT_HEIGHT}`}>
            <motion.div
              className="pointer-events-none absolute inset-0"
              {...reveal(
                reduceMotion,
                { opacity: 1 },
                { opacity: 0 },
                { delay: axesDelay, duration: t(0.45), ease: GRAPH_EASE },
              )}
            >
              {[50, 40, 30, 20, 10, 0].map((tick) => {
                /* bottom% so 0% sits on the plot baseline the bars share */
                const bottom = (tick / WEEKLY_MAX) * 100
                return (
                  <div
                    key={tick}
                    className="absolute right-0 left-0 h-0"
                    style={{ bottom: `${bottom}%` }}
                  >
                    <span
                      className={`${tickClass} absolute top-0 left-0 w-8 -translate-y-1/2`}
                    >
                      {tick}%
                    </span>
                    <div
                      className="absolute top-0 right-0 left-10 h-px -translate-y-1/2 sm:left-12"
                      style={{ background: gridLine }}
                    />
                  </div>
                )
              })}
            </motion.div>

            <div className="absolute inset-y-0 right-0 left-10 flex items-end justify-around gap-8 sm:left-12 sm:gap-12">
              {WEEKLY_BARS.map((bar, index) => {
                const heightPct = (bar.value / WEEKLY_MAX) * 100
                const active = hoveredWeekly === bar.label
                const color = barColor(bar.accent, isDark)
                return (
                  <div
                    key={bar.label}
                    className="relative flex h-full w-[5.75rem] flex-col items-center justify-end"
                    onMouseEnter={() => setHoveredWeekly(bar.label)}
                    onMouseLeave={() => setHoveredWeekly(null)}
                  >
                    {bar.accent ? (
                      <motion.div
                        className={`pointer-events-none absolute bottom-0 ${BAR_THICK_W} origin-bottom`}
                        style={{
                          height: `${heightPct}%`,
                          backgroundColor: accentHex(bar.accent),
                          opacity: INDICATOR_OPACITY,
                          borderRadius: '999px 999px 0 0',
                          transform: 'scaleX(1.28)',
                          transformOrigin: 'center bottom',
                        }}
                        {...reveal(
                          reduceMotion,
                          { scaleY: 1, opacity: INDICATOR_OPACITY },
                          { scaleY: 0, opacity: 0 },
                          {
                            delay: indicatorDelay + index * weeklyStagger,
                            duration: indicatorDuration,
                            ease: GRAPH_EASE,
                          },
                        )}
                        aria-hidden
                      />
                    ) : null}
                    <motion.div
                      className={`relative z-[1] ${BAR_THICK_W} origin-bottom cursor-default`}
                      style={{
                        height: `${heightPct}%`,
                        backgroundColor: color,
                        borderRadius: '999px 999px 0 0',
                        boxShadow: active ? `0 0 24px ${color}55` : 'none',
                        filter: active ? 'brightness(1.08)' : 'none',
                        transition: 'box-shadow 0.25s ease, filter 0.25s ease',
                      }}
                      {...reveal(
                        reduceMotion,
                        { scaleY: 1, opacity: 1 },
                        { scaleY: 0, opacity: 0.4 },
                        {
                          delay: weeklyBarDelay + index * weeklyStagger,
                          duration: weeklyDuration,
                          ease: GRAPH_EASE,
                        },
                      )}
                    >
                      {(bar.showValue || active) && (
                        <motion.span
                          className={`absolute top-2 left-1/2 -translate-x-1/2 ${valueType} ${valueOnBar(bar.accent)}`}
                          {...reveal(
                            reduceMotion,
                            { opacity: 1 },
                            { opacity: 0 },
                            {
                              delay:
                                weeklyBarDelay +
                                index * weeklyStagger +
                                weeklyDuration * 0.55,
                              duration: t(0.35),
                              ease: GRAPH_EASE,
                            },
                          )}
                        >
                          {bar.value}%
                        </motion.span>
                      )}
                    </motion.div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-4 ml-10 flex justify-around gap-8 sm:ml-12 sm:gap-12">
            {WEEKLY_BARS.map((bar, index) => (
              <motion.p
                key={bar.label}
                className={`${axisLabel} w-[5.75rem] text-center leading-[1.25]`}
                style={{ color: labelColor(bar.accent, isDark) }}
                {...reveal(
                  reduceMotion,
                  { opacity: 1, y: 0 },
                  { opacity: 0, y: 6 },
                  {
                    delay: weeklyBarDelay + index * weeklyStagger + t(0.35),
                    duration: t(0.4),
                    ease: GRAPH_EASE,
                  },
                )}
              >
                {bar.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </motion.p>
            ))}
          </div>
        </div>

        {/* Deciding factors — horizontal bars */}
        <div className="min-w-0 w-full">
          <motion.p
            className={titleClass}
            {...reveal(
              reduceMotion,
              { opacity: 1, y: 0 },
              { opacity: 0, y: 8 },
              { delay: axesDelay + t(0.1), duration: t(0.4), ease: GRAPH_EASE },
            )}
          >
            Top deciding factors
          </motion.p>

          <div className={`flex w-full ${PLOT_HEIGHT}`}>
            {/* Row labels — width hugs text, rows align with bars */}
            <div className="flex h-full shrink-0 flex-col pt-5 pr-2 sm:pr-3">
              <div className="flex min-h-0 flex-1 flex-col justify-between">
                {FACTOR_BARS.map((bar, index) => (
                  <motion.span
                    key={bar.label}
                    className={`${axisLabel} flex flex-1 items-center justify-end whitespace-nowrap text-right leading-snug`}
                    style={{ color: labelColor(bar.accent, isDark) }}
                    {...reveal(
                      reduceMotion,
                      { opacity: 1, x: 0 },
                      { opacity: 0, x: -10 },
                      {
                        delay: factorDelay + index * factorStagger,
                        duration: t(0.4),
                        ease: GRAPH_EASE,
                      },
                    )}
                  >
                    {bar.label}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Plot: percentage grid background + bars — fills remaining width */}
            <div className="flex h-full min-w-0 flex-1 flex-col">
              <motion.div
                className="relative mb-1.5 h-4 w-full shrink-0"
                {...reveal(
                  reduceMotion,
                  { opacity: 1 },
                  { opacity: 0 },
                  { delay: axesDelay + t(0.1), duration: t(0.45), ease: GRAPH_EASE },
                )}
              >
                {[0, 10, 20, 30, 40, 50, 60].map((tick) => (
                  <span
                    key={tick}
                    className={`${tickClass} absolute top-0 -translate-x-1/2`}
                    style={{ left: `${(tick / FACTOR_MAX) * 100}%` }}
                  >
                    {tick}%
                  </span>
                ))}
              </motion.div>

              <div className="relative min-h-0 w-full flex-1">
                <motion.div
                  className="pointer-events-none absolute inset-0"
                  {...reveal(
                    reduceMotion,
                    { opacity: 1 },
                    { opacity: 0 },
                    { delay: axesDelay + t(0.1), duration: t(0.45), ease: GRAPH_EASE },
                  )}
                >
                  {[0, 10, 20, 30, 40, 50, 60].map((tick) => (
                    <div
                      key={tick}
                      className="absolute top-0 bottom-0 w-px"
                      style={{
                        left: `${(tick / FACTOR_MAX) * 100}%`,
                        background: gridLine,
                      }}
                    />
                  ))}
                </motion.div>

                <div className="relative z-[1] flex h-full w-full flex-col justify-between">
                  {FACTOR_BARS.map((bar, index) => {
                    const widthPct = (bar.value / FACTOR_MAX) * 100
                    const active = hoveredFactor === bar.label
                    const color = barColor(bar.accent, isDark)
                    return (
                      <div
                        key={bar.label}
                        className="relative flex flex-1 items-center overflow-visible"
                        onMouseEnter={() => setHoveredFactor(bar.label)}
                        onMouseLeave={() => setHoveredFactor(null)}
                      >
                        <div className={`relative w-full ${BAR_THICK_H}`}>
                          {bar.accent ? (
                            <motion.div
                              className={`pointer-events-none absolute left-0 ${BAR_THICK_H} origin-left`}
                              style={{
                                width: `${widthPct}%`,
                                backgroundColor: accentHex(bar.accent),
                                opacity: INDICATOR_OPACITY,
                                borderRadius: '4px 999px 999px 4px',
                                transform: 'scaleY(1.28)',
                                transformOrigin: 'left center',
                              }}
                              {...reveal(
                                reduceMotion,
                                { scaleX: 1, opacity: INDICATOR_OPACITY },
                                { scaleX: 0, opacity: 0 },
                                {
                                  delay: factorDelay + index * factorStagger,
                                  duration: factorDuration,
                                  ease: GRAPH_EASE,
                                },
                              )}
                              aria-hidden
                            />
                          ) : null}
                          <motion.div
                            className="absolute inset-y-0 left-0 z-[1] flex items-center justify-end origin-left cursor-default px-2.5"
                            style={{
                              width: `${widthPct}%`,
                              backgroundColor: color,
                              borderRadius: '4px 999px 999px 4px',
                              boxShadow: active ? `0 0 24px ${color}55` : 'none',
                              filter: active ? 'brightness(1.08)' : 'none',
                              transition: 'box-shadow 0.25s ease, filter 0.25s ease',
                            }}
                            {...reveal(
                              reduceMotion,
                              { scaleX: 1, opacity: 1 },
                              { scaleX: 0, opacity: 0.4 },
                              {
                                delay: factorDelay + index * factorStagger,
                                duration: factorDuration,
                                ease: GRAPH_EASE,
                              },
                            )}
                          >
                            {(bar.showValue || active) && (
                              <motion.span
                                className={`${valueType} ${valueOnBar(bar.accent)}`}
                                {...reveal(
                                  reduceMotion,
                                  { opacity: 1 },
                                  { opacity: 0 },
                                  {
                                    delay:
                                      factorDelay +
                                      index * factorStagger +
                                      factorDuration * 0.55,
                                    duration: t(0.35),
                                    ease: GRAPH_EASE,
                                  },
                                )}
                              >
                                {bar.value}%
                              </motion.span>
                            )}
                          </motion.div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Spacer aligns column height with weekly chart x-axis labels */}
          <div className="mt-4 min-h-[2.75rem]" aria-hidden />
        </div>
      </div>

      <motion.p
        className="mt-5 max-w-[52ch] font-['SUIT_Variable',sans-serif] text-[10pt] font-normal leading-snug tracking-tight text-[color:var(--color-muted,#666666)] dark:text-white/75"
        {...reveal(
          reduceMotion,
          { opacity: 1, y: 0 },
          { opacity: 0, y: 8 },
          { delay: captionDelay, duration: t(0.45), ease: GRAPH_EASE },
        )}
      >
        People with disabilities shop online weekly at more than twice the rate of general
        consumers — and accessibility is their top deciding factor when choosing an e-commerce
        platform.
      </motion.p>
    </div>
  )
}
