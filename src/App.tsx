import { useState, useEffect, useRef, type CSSProperties } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { usePrefersReducedMotion } from './components/HomeIntroScrambleText'
import { usePageTheme } from './context/PageThemeContext'
import { useHomeFooterAttribution } from './context/HomeFooterAttributionContext'
import { ThemeToggle } from './components/PillNav'
import { HomePage } from './pages/HomePage'
import { ProjectsPage } from './pages/ProjectsPage'
import { HovrProjectPage } from './pages/HovrProjectPage'
import { JojoProjectPage } from './pages/JojoProjectPage'
import { PiikProjectPage } from './pages/PiikProjectPage'
import { ArFittingProjectPage } from './pages/ArFittingProjectPage'
import { ProjectBmadPage } from './pages/ProjectBmadPage'
// scrambleCycles=20 × speed=35ms → 700ms per scramble (per user spec)
// Nav + bio fade-in uses exact values from Figma: delay=2.2s, duration=0.7s
const PHASE2_TRANSITION = {
  delay: 1.2,
  duration: 2.0,
  ease: [0.44, 0, 0.3, 0.99] as [number, number, number, number],
}
// ── Footer email ───────────────────────────────────────────────────────────────

const EMAIL = 'minjoo.kim.kor@gmail.com'

const FOOTER_ATTRIBUTION =
  'This website is designed by me, Coded by Claude & Cursor'

const FOOTER_ATTRIBUTION_CHAR_MS = 38

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

  useEffect(() => {
    if (!start) {
      setLen(0)
      return
    }
    if (reduceMotion) {
      setLen(text.length)
      return
    }
    setLen(0)
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      if (i >= text.length) {
        clearInterval(id)
        setLen(text.length)
        return
      }
      setLen(i)
    }, FOOTER_ATTRIBUTION_CHAR_MS)
    return () => clearInterval(id)
  }, [start, text, reduceMotion])

  const color = isDark ? '#B8B8B8' : '#666666'
  const showCursor = start && len < text.length && !reduceMotion
  const srHidden = len < text.length && !reduceMotion

  return (
    <span
      className="inline-flex min-w-0 max-w-[min(100%,52ch)] flex-wrap items-baseline text-pretty font-mono text-[12px] font-medium leading-[1.2] md:max-w-none"
      style={{ color }}
      aria-hidden={srHidden}
    >
      <span>{text.slice(0, len)}</span>
      {showCursor && (
        <span
          className="cursor-blink ml-px inline-block h-[1em] w-[2px] shrink-0 translate-y-[0.06em] bg-current align-baseline"
          aria-hidden
        />
      )}
    </span>
  )
}

function FooterEmail() {
  const { isDark } = usePageTheme()
  const { pathname } = useLocation()
  const homeFooterAttribution = useHomeFooterAttribution()
  const reduceMotion = usePrefersReducedMotion()
  const [isHovered, setIsHovered] = useState(false)
  const [copied, setCopied] = useState(false)
  const [footerFadeDone, setFooterFadeDone] = useState(reduceMotion)
  const footerFadeCompleteRef = useRef(false)

  const isHomeRoute = pathname === '/' || pathname === ''
  const homeHovrAttributionReady =
    homeFooterAttribution?.homeHovrAttributionReady ?? false
  const attributionStart =
    footerFadeDone && (isHomeRoute ? homeHovrAttributionReady : true)

  const handleHoverStart = () => setIsHovered(true)

  const handleClick = () => {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  useEffect(() => {
    if (reduceMotion) setFooterFadeDone(true)
  }, [reduceMotion])

  const footerLineStyle: CSSProperties = {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 12,
    fontWeight: 500,
    lineHeight: 1.2,
    color: isDark ? '#B8B8B8' : '#666666',
    userSelect: 'none',
  }

  return (
    <motion.div
      className="fixed z-[100] pointer-events-auto left-4 w-fit max-w-[min(100%,calc(100vw-2rem))] pt-4 max-md:bottom-[calc(16px+env(safe-area-inset-bottom,0px))] md:bottom-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={PHASE2_TRANSITION}
      onAnimationComplete={() => {
        if (reduceMotion || footerFadeCompleteRef.current) return
        footerFadeCompleteRef.current = true
        setFooterFadeDone(true)
      }}
    >
      <p
        className="m-0 flex flex-col gap-2 md:flex-row md:flex-wrap md:items-baseline md:gap-x-3 md:gap-y-1"
        style={footerLineStyle}
      >
        <span className="inline-flex min-w-0 flex-wrap items-baseline gap-x-1">
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
                  <div className="flex items-center justify-center px-[10px] py-[6px] rounded-[100px] bg-white/20 backdrop-blur-xl border border-white/40 whitespace-nowrap">
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
        <FooterAttributionTypewriter text={FOOTER_ATTRIBUTION} start={attributionStart} isDark={isDark} />
      </p>
    </motion.div>
  )
}

// ── App ────────────────────────────────────────────────────────────────────────

function AppShell() {
  const { isDark } = usePageTheme()
  return (
    <div
      className={`theme-surface-transition relative h-screen min-h-[100dvh] w-screen max-w-[100vw] overflow-hidden ${isDark ? 'bg-[#111111]' : 'bg-[#e8e8e8]'}`}
    >
      <ThemeToggle />
      <FooterEmail />
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/bmad" element={<ProjectBmadPage />} />
        <Route path="projects/hovr" element={<HovrProjectPage />} />
        <Route path="projects/jojo" element={<JojoProjectPage />} />
        <Route path="projects/piik" element={<PiikProjectPage />} />
        <Route path="projects/ar-fitting-room" element={<ArFittingProjectPage />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return <AppShell />
}
