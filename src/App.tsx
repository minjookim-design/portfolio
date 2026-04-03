import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { usePageTheme } from './context/PageThemeContext'
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

function FooterEmail() {
  const { isDark } = usePageTheme()
  const [isHovered, setIsHovered] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleHoverStart = () => setIsHovered(true)

  const handleClick = () => {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <motion.div
      className="fixed z-[100] pointer-events-auto"
      style={{ bottom: 16, left: 16 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={PHASE2_TRANSITION}
    >
      <p
        style={{
          fontFamily: 'Arial, sans-serif',
          fontSize: 14,
          lineHeight: '16px',
          color: isDark ? '#B8B8B8' : '#666666',
          userSelect: 'none',
          fontWeight: 400,
        }}
      >
        © 2026{' '}
        <span className="relative inline-block">
          <motion.span
            style={{ cursor: 'pointer' }}
            animate={{ fontWeight: isHovered ? 700 : 400 }}
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
      </p>
    </motion.div>
  )
}

// ── App ────────────────────────────────────────────────────────────────────────

function AppShell() {
  const { isDark } = usePageTheme()
  return (
    <div
      className={`relative h-screen w-screen overflow-hidden ${isDark ? 'bg-[#111111]' : 'bg-[#e8e8e8]'}`}
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
