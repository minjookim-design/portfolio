import { useState, useEffect, useLayoutEffect, useRef, type CSSProperties } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { usePrefersReducedMotion } from './HomeIntroScrambleText'
import { usePageTheme } from '../context/PageThemeContext'
import { useHomeFooterAttribution } from '../context/HomeFooterAttributionContext'

const PHASE2_TRANSITION = {
  delay: 1.2,
  duration: 2.0,
  ease: [0.44, 0, 0.3, 0.99] as [number, number, number, number],
}

const EMAIL = 'minjoo.kim.kor@gmail.com'

/** Prior Framer portfolio — linked from home inline footer. */
const PORTFOLIO_2025_URL = 'https://frequent-quicker-863716.framer.app'

/** Canonical copy — keep in sync with `DESIGN_SYSTEM.md` §5. */
const FOOTER_ATTRIBUTION = 'Designed by me, Coded by Claude & Cursor'

/** ms per character; `0.7×` playback = slower reveal (`38 / 0.7`). */
const FOOTER_ATTRIBUTION_CHAR_MS = Math.round(38 / 0.7)

function FooterAttributionTypewriter({
  text,
  start,
  isDark,
}: {
  text: string
  start: boolean
  isDark: boolean
}) {
  const reduceMotion = usePrefersReducedMotion()
  const [len, setLen] = useState(0)
  /** After the last character appears, keep red/bold emphasis for this many ms. */
  const [postRevealEmphasis, setPostRevealEmphasis] = useState(false)

  useEffect(() => {
    if (!start) {
      const t = requestAnimationFrame(() => setLen(0))
      return () => cancelAnimationFrame(t)
    }
    if (reduceMotion) {
      const t = requestAnimationFrame(() => setLen(text.length))
      return () => cancelAnimationFrame(t)
    }
    let intervalId: ReturnType<typeof setInterval> | undefined
    const raf = requestAnimationFrame(() => {
      setLen(0)
      let i = 0
      intervalId = window.setInterval(() => {
        i += 1
        if (i >= text.length) {
          if (intervalId) clearInterval(intervalId)
          intervalId = undefined
          setLen(text.length)
          return
        }
        setLen(i)
      }, FOOTER_ATTRIBUTION_CHAR_MS)
    })
    return () => {
      cancelAnimationFrame(raf)
      if (intervalId) clearInterval(intervalId)
    }
  }, [start, text, reduceMotion])

  useLayoutEffect(() => {
    if (!start || len < text.length) {
      setPostRevealEmphasis(false)
      return
    }
    setPostRevealEmphasis(true)
  }, [start, len, text.length])

  useEffect(() => {
    if (!start || len < text.length) return
    const t = window.setTimeout(() => setPostRevealEmphasis(false), 3000)
    return () => clearTimeout(t)
  }, [start, len, text.length])

  const color = isDark ? '#B8B8B8' : '#666666'
  const isTyping = start && len < text.length && !reduceMotion
  const showEmphasis = isTyping || postRevealEmphasis
  const showCursor = isTyping
  const srHidden = len < text.length && !reduceMotion

  return (
    <span
      className={`inline-flex min-w-0 max-w-[min(100%,52ch)] flex-wrap items-center text-pretty font-mono text-[12px] leading-[1.2] md:max-w-none ${
        showEmphasis ? 'font-bold text-red-600 dark:text-red-400' : 'font-medium'
      }`}
      style={showEmphasis ? undefined : { color }}
      aria-hidden={srHidden}
    >
      <span>{text.slice(0, len)}</span>
      {showCursor && (
        <span
          className="cursor-blink ml-px inline-block h-[1em] w-[2px] shrink-0 self-center bg-current"
          aria-hidden
        />
      )}
    </span>
  )
}

export type FooterEmailVariant = 'fixed' | 'inline'

export function FooterEmail({ variant = 'fixed' }: { variant?: FooterEmailVariant }) {
  const { isDark } = usePageTheme()
  const { pathname } = useLocation()
  const homeFooterAttribution = useHomeFooterAttribution()
  const reduceMotion = usePrefersReducedMotion()
  const [isHovered, setIsHovered] = useState(false)
  const [copied, setCopied] = useState(false)
  const [footerFadeDone, setFooterFadeDone] = useState(reduceMotion)
  const footerFadeCompleteRef = useRef(false)

  const isHomeRoute = pathname === '/' || pathname === '' || pathname === '/test'
  const homeHovrAttributionReady = homeFooterAttribution?.homeHovrAttributionReady ?? false
  const attributionStart = footerFadeDone && (isHomeRoute ? homeHovrAttributionReady : true)

  const handleHoverStart = () => setIsHovered(true)

  const handleClick = () => {
    void navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  useEffect(() => {
    if (!reduceMotion) return
    const t = requestAnimationFrame(() => setFooterFadeDone(true))
    return () => cancelAnimationFrame(t)
  }, [reduceMotion])

  const footerLineStyle: CSSProperties = {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 12,
    fontWeight: 500,
    lineHeight: 1.2,
    color: isDark ? '#B8B8B8' : '#666666',
    userSelect: 'none',
  }

  const isInline = variant === 'inline'
  const outerClass = isInline
    ? 'relative z-[20] box-border flex w-full min-w-0 shrink-0 flex-col items-start justify-center pointer-events-auto pt-[4px]'
    : 'fixed z-[100] box-border inline-flex max-h-none min-h-0 w-max max-w-[min(100%,calc(100vw-2rem))] flex-col items-center justify-center pt-2 pointer-events-auto max-md:bottom-[max(1rem,env(safe-area-inset-bottom,0px))] md:bottom-4'

  const leadSpanClass = isInline
    ? 'inline-flex min-w-0 flex-wrap items-center justify-start gap-x-1 pl-0'
    : 'inline-flex min-w-0 flex-wrap items-center justify-center gap-x-1 pl-4'

  const footerLeadOnly = (
    <span className={leadSpanClass}>
      © 2026{' '}
      <span className="relative inline-block">
        <motion.span
          style={{ cursor: 'pointer' }}
          animate={{ fontWeight: isHovered ? 700 : 500 }}
          transition={{ duration: 0.2, ease: [0.44, 0, 0.3, 0.99] }}
          onHoverStart={handleHoverStart}
          onHoverEnd={() => setIsHovered(false)}
          onClick={handleClick}
        >
          {EMAIL}
        </motion.span>

        <AnimatePresence>
          {copied && (
            <motion.div
              className="absolute"
              style={{ bottom: 'calc(100% + 8px)', left: 0 }}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2, ease: [0.44, 0, 0.3, 0.99] }}
            >
              <div className="flex items-center justify-center rounded-[100px] border border-white/40 bg-white/20 px-[10px] py-[6px] whitespace-nowrap backdrop-blur-xl">
                <span
                  style={{
                    fontFamily: 'Arial, sans-serif',
                    fontSize: 12,
                    fontWeight: 700,
                    color: isDark ? '#FFFFFF' : '#000000',
                  }}
                >
                  Copied!
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </span>
    </span>
  )

  const footerPrimaryLine = (
    <>
      {footerLeadOnly}
      <FooterAttributionTypewriter text={FOOTER_ATTRIBUTION} start={attributionStart} isDark={isDark} />
    </>
  )

  return (
    <motion.div
      className={outerClass}
      style={{ height: 'auto' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={PHASE2_TRANSITION}
      onAnimationComplete={() => {
        if (reduceMotion || footerFadeCompleteRef.current) return
        footerFadeCompleteRef.current = true
        setFooterFadeDone(true)
      }}
    >
      {isInline ? (
        <div className="m-0 flex w-full min-w-0 max-w-full flex-row flex-wrap items-start justify-between gap-x-3 gap-y-2 md:items-center">
          <p
            className="m-0 flex max-h-none min-h-0 min-w-0 flex-1 flex-col items-start gap-2 md:flex-row md:flex-wrap md:items-center md:gap-x-3 md:gap-y-1"
            style={footerLineStyle}
          >
            {footerLeadOnly}
            <motion.a
              href={PORTFOLIO_2025_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 no-underline outline-none focus-visible:ring-2 focus-visible:ring-black/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf7f0] dark:focus-visible:ring-white/30 dark:focus-visible:ring-offset-[#111111]"
              style={{ ...footerLineStyle, cursor: 'pointer', userSelect: 'text' }}
              whileHover={{ fontWeight: 700 }}
              transition={{ duration: 0.2, ease: [0.44, 0, 0.3, 0.99] }}
            >
              Wanna see my 2025 portfolio?
            </motion.a>
          </p>
          <FooterAttributionTypewriter text={FOOTER_ATTRIBUTION} start={attributionStart} isDark={isDark} />
        </div>
      ) : (
        <p
          className="m-0 flex max-h-none min-h-0 min-w-0 flex-col items-start gap-2 md:flex-row md:flex-wrap md:items-center md:gap-x-3 md:gap-y-1"
          style={footerLineStyle}
        >
          {footerPrimaryLine}
        </p>
      )}
    </motion.div>
  )
}
