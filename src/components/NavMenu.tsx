import { useState, useEffect, type RefObject } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrambleText } from './ScrambleText'
import { useScrollSpy } from '../context/ScrollSpyContext'

const NEON = '#39ff14'
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export const HOVR_SECTIONS = [
  { id: 'overview',        label: 'Overview' },
  { id: 'the-goal',        label: 'The Goal' },
  { id: 'research',        label: 'Research' },
  { id: 'solution-sketch', label: 'Solution Sketch' },
  { id: 'final-solution',  label: 'Final Solution' },
  { id: 'takeaway',        label: 'Takeaway' },
]

// ── Animation variants ────────────────────────────────────────────────────────

const listVariants = {
  closed: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
  open:   { transition: { staggerChildren: 0.07 } },
}

const itemVariants = {
  closed: { opacity: 0, y: -6, transition: { ease: EASE, duration: 0.25 } },
  open:   { opacity: 1, y:  0, transition: { ease: EASE, duration: 0.35 } },
}

// ── Helper ────────────────────────────────────────────────────────────────────

function scrollToSection(id: string, containerRef: RefObject<HTMLDivElement | null>) {
  const container = containerRef.current
  if (!container) return
  const el = document.getElementById(id)
  if (!el) return
  const containerRect = container.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()
  const targetTop = container.scrollTop + (elRect.top - containerRect.top)
  container.scrollTo({ top: targetTop, behavior: 'smooth' })
}

// ── SVG Icons — exact paths extracted from Figma components page ──────────────

/** pixel:folder — default/unfilled state */
function FolderUnfilled() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path d="M17.5 3.33333L17.5 2.5L10 2.5L10 1.66667L9.16667 1.66667L9.16667 0.833333L8.33333 0.833333L8.33333 0L0.833333 0L0.833333 0.833333L0 0.833333L0 15.8333L0.833333 15.8333L0.833333 16.6667L17.5 16.6667L17.5 15.8333L18.3333 15.8333L18.3333 3.33333L17.5 3.33333ZM16.6667 15L1.66667 15L1.66667 1.66667L7.5 1.66667L7.5 2.5L8.33333 2.5L8.33333 3.33333L9.16667 3.33333L9.16667 4.16667L16.6667 4.16667L16.6667 15Z" fill="currentColor" />
    </svg>
  )
}

/** pixel:folder-open-solid — selected/active state (2 paths: tab + open body) */
function FolderOpenSolid() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path d="M1.66665 13.3334H0.833313V2.50002H1.66665V1.66669H7.49998V2.50002H8.33331V3.33335H15.8333V4.16669H16.6666V7.50002H4.16665V8.33335H3.33331V10H2.49998V11.6667H1.66665V13.3334Z" fill="currentColor" />
      <path d="M19.1667 8.33331V9.99998H18.3334V11.6666H17.5V13.3333H16.6667V15H15.8334V17.5H15V18.3333H2.50002V17.5H1.66669V15H2.50002V13.3333H3.33335V11.6666H4.16669V9.99998H5.00002V8.33331H19.1667Z" fill="currentColor" />
    </svg>
  )
}

/** pixel:lock — default/hover state */
function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path d="M17.5 9.99998V9.16665H15V4.16665H14.1667V2.49998H13.3334V1.66665H11.6667V0.833313H8.33335V1.66665H6.66669V2.49998H5.83335V4.16665H5.00002V9.16665H2.50002V9.99998H1.66669V18.3333H2.50002V19.1666H17.5V18.3333H18.3334V9.99998H17.5ZM16.6667 10.8333V17.5H3.33335V10.8333H16.6667ZM7.50002 4.16665V3.33331H8.33335V2.49998H11.6667V3.33331H12.5V4.16665H13.3334V9.16665H6.66669V4.16665H7.50002Z" fill="currentColor" />
    </svg>
  )
}

/** pixel:lock-solid — selected state */
function LockSolid() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path d="M17.5 9.99998V9.16665H15V4.16665H14.1666V2.49998H13.3333V1.66665H11.6666V0.833313H8.33329V1.66665H6.66663V2.49998H5.83329V4.16665H4.99996V9.16665H2.49996V9.99998H1.66663V18.3333H2.49996V19.1666H17.5V18.3333H18.3333V9.99998H17.5ZM12.5 9.16665H7.49996V4.16665H8.33329V3.33331H11.6666V4.16665H12.5V9.16665Z" fill="currentColor" />
    </svg>
  )
}

/** pixel:link — 2 overlapping chain links */
function LinkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path d="M13.3334 8.33335H14.1667V14.1667H13.3334V15H12.5V15.8334H11.6667V16.6667H10.8334V17.5H10V18.3334H9.16671V19.1667H4.16671V18.3334H3.33337V17.5H2.50004V16.6667H1.66671V15.8334H0.833374V11.6667H1.66671V10.8334H2.50004V10H3.33337V9.16669H4.16671V11.6667H3.33337V12.5H2.50004V15H3.33337V15.8334H4.16671V16.6667H5.00004V17.5H8.33337V16.6667H9.16671V15.8334H10V15H10.8334V14.1667H11.6667V13.3334H12.5V9.16669H11.6667V8.33335H10.8334V7.50002H11.6667V6.66669H12.5V7.50002H13.3334V8.33335Z" fill="currentColor" />
      <path d="M19.1667 4.16665V8.33331H18.3334V9.16665H17.5V9.99998H16.6667V10.8333H15.8334V8.33331H16.6667V7.49998H17.5V4.99998H16.6667V4.16665H15.8334V3.33331H15V2.49998H11.6667V3.33331H10.8334V4.16665H10V4.99998H9.16671V5.83331H8.33337V6.66665H7.50004V10.8333H8.33337V11.6666H9.16671V12.5H8.33337V13.3333H7.50004V12.5H6.66671V11.6666H5.83337V5.83331H6.66671V4.99998H7.50004V4.16665H8.33337V3.33331H9.16671V2.49998H10V1.66665H10.8334V0.833313H15.8334V1.66665H16.6667V2.49998H17.5V3.33331H18.3334V4.16665H19.1667Z" fill="currentColor" />
    </svg>
  )
}

/** pixel:paperclip — resume icon */
function PaperclipIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path d="M19.972 3.35662V7.55241H19.1328V8.39157H18.2937V9.23073H17.4545V10.0699H16.6154V10.9091H15.7762V11.7482H14.937V12.5874H14.0979V13.4265H13.2587V14.2657H12.4196V15.1048H11.5804V15.944H9.06292V15.1048H8.22376V14.2657H7.3846V11.7482H8.22376V10.9091H9.06292V10.0699H9.90208V9.23073H10.7412V8.39157H11.5804V7.55241H12.4196V6.71325H13.2587V5.87409H14.0979V5.03494H14.937V4.19578H15.7762V5.03494H16.6154V5.87409H15.7762V6.71325H14.937V7.55241H14.0979V8.39157H13.2587V9.23073H12.4196V10.0699H11.5804V10.9091H10.7412V11.7482H9.90208V12.5874H9.06292V13.4265H9.90208V14.2657H10.7412V13.4265H11.5804V12.5874H12.4196V11.7482H13.2587V10.9091H14.0979V10.0699H14.937V9.23073H15.7762V8.39157H16.6154V7.55241H17.4545V6.71325H18.2937V4.19578H17.4545V3.35662H16.6154V2.51746H14.0979V3.35662H13.2587V4.19578H12.4196V5.03494H11.5804V5.87409H10.7412V6.71325H9.90208V7.55241H9.06292V8.39157H8.22376V9.23073H7.3846V10.0699H6.54544V10.9091H5.70628V15.1048H6.54544V15.944H7.3846V16.7832H8.22376V17.6223H12.4196V16.7832H13.2587V15.944H14.0979V15.1048H14.937V14.2657H15.7762V13.4265H16.6154V12.5874H17.4545V11.7482H18.2937V10.9091H19.972V12.5874H19.1328V13.4265H18.2937V14.2657H17.4545V15.1048H16.6154V15.944H15.7762V16.7832H14.937V17.6223H14.0979V18.4615H13.2587V19.3006H8.22376V18.4615H6.54544V17.6223H5.70628V16.7832H4.86712V15.1048H4.02797V10.0699H4.86712V9.23073H5.70628V8.39157H6.54544V7.55241H7.3846V6.71325H8.22376V5.87409H9.06292V5.03494H9.90208V4.19578H10.7412V3.35662H11.5804V2.51746H12.4196V1.6783H14.0979V0.839139H17.4545V1.6783H18.2937V2.51746H19.1328V3.35662H19.972Z" fill="currentColor" />
    </svg>
  )
}

/** dinkie-icons:circle — scroll-spy default/hover */
function CircleEmpty() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path d="M16.6667 15H15V16.6667H16.6667V15ZM16.6667 15H18.3333V6.66669H16.6667V15ZM3.33333 18.3334H5V16.6667H3.33333V18.3334ZM1.66667 16.6667H3.33333V15H1.66667V16.6667ZM0 15H1.66667V6.66669H0V15ZM5 20H13.3333V18.3334H5V20ZM1.66667 6.66669H3.33333V5.00002H1.66667V6.66669ZM13.3333 18.3334H15V16.6667H13.3333V18.3334ZM3.33333 5.00002H5V3.33335H3.33333V5.00002ZM5 3.33335H13.3333V1.66669H5V3.33335ZM15 6.66669H16.6667V5.00002H15V6.66669ZM13.3333 5.00002H15V3.33335H13.3333V5.00002Z" fill="currentColor" />
    </svg>
  )
}

/** dinkie-icons:circle-filled — scroll-spy active */
function CircleFilled() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path d="M5 20H13.3333V18.3334H16.6667V15H18.3333V6.66669H16.6667V3.33335H13.3333V1.66669H5V3.33335H1.66667V6.66669H0V15H1.66667V18.3334H5V20Z" fill="currentColor" />
    </svg>
  )
}

// ── Sub-item components ───────────────────────────────────────────────────────

function ProjectItem({
  label,
  icon,
  isActive,
  onClick,
  delay,
}: {
  label: string
  icon: React.ReactNode
  isActive: boolean
  onClick: () => void
  delay: number
}) {
  const [hovered, setHovered] = useState(false)
  const color = isActive || hovered ? NEON : 'white'

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center text-left"
      style={{ color, gap: 10, padding: 8, background: 'transparent', border: 'none' }}
    >
      {icon}
      <ScrambleText text={label} delay={delay} scrambleCycles={6} speed={30} />
    </button>
  )
}

function CircleNavItem({
  section,
  isActive,
  delay,
  scrollContainerRef,
}: {
  section: { id: string; label: string }
  isActive: boolean
  delay: number
  scrollContainerRef: RefObject<HTMLDivElement | null>
}) {
  const [hovered, setHovered] = useState(false)
  const color = isActive || hovered ? NEON : 'white'

  return (
    <button
      onClick={() => scrollToSection(section.id, scrollContainerRef)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center text-left"
      style={{ color, gap: 10, padding: 8, background: 'transparent', border: 'none' }}
    >
      {isActive ? <CircleFilled /> : <CircleEmpty />}
      <ScrambleText text={section.label} delay={delay} scrambleCycles={5} speed={30} />
    </button>
  )
}

// ── NavMenu ───────────────────────────────────────────────────────────────────

export function NavMenu() {
  const navigate = useNavigate()
  const location = useLocation()
  const { activeSection, scrollContainerRef } = useScrollSpy()

  const isOnHovr  = location.pathname === '/projects/hovr'
  const isOnBmad  = location.pathname === '/projects/bmad'
  const isOnAbout = location.pathname === '/about'
  const isOnProject = isOnHovr || isOnBmad

  const [projectsOpen, setProjectsOpen] = useState(isOnProject)
  const [projectsHovered, setProjectsHovered] = useState(false)
  const [aboutHovered, setAboutHovered]       = useState(false)
  const [linkedinHovered, setLinkedinHovered] = useState(false)
  const [resumeHovered, setResumeHovered]     = useState(false)

  useEffect(() => {
    if (isOnProject) setProjectsOpen(true)
  }, [isOnProject])

  // Folder: open-solid when dropdown is open OR on a project page; unfilled otherwise
  const projectsIsOpen = projectsOpen || isOnProject
  const projectsColor  = projectsIsOpen || projectsHovered ? NEON : 'white'

  return (
    <nav className="font-mono text-[18px] leading-[20px] flex flex-col gap-5" style={{ mixBlendMode: 'difference', zIndex: 9999, position: 'relative' }}>

      {/* ── PROJECTS ──────────────────────────────────────────────────── */}
      <div>
        <button
          onClick={() => {
            if (!isOnProject) setProjectsOpen(v => !v)
          }}
          onMouseEnter={() => setProjectsHovered(true)}
          onMouseLeave={() => setProjectsHovered(false)}
          className="flex items-center text-left"
          style={{ color: projectsColor, gap: 10, padding: 8, background: 'transparent', border: 'none' }}
        >
          {projectsIsOpen ? <FolderOpenSolid /> : <FolderUnfilled />}
          <ScrambleText text="PROJECTS" delay={0} />
        </button>

        <AnimatePresence>
          {projectsOpen && (
            <motion.ul
              variants={listVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="flex flex-col list-none"
              style={{ paddingLeft: 26, gap: 8 }}
            >
              {/* BMAD — locked */}
              <motion.li key="bmad" variants={itemVariants}>
                <ProjectItem
                  label="BMAD"
                  icon={isOnBmad ? <LockSolid /> : <LockIcon />}
                  isActive={isOnBmad}
                  onClick={() => navigate('/projects/bmad')}
                  delay={0}
                />
              </motion.li>

              {/* HOVR ADMIN */}
              <motion.li key="hovr" variants={itemVariants}>
                <ProjectItem
                  label="HOVR ADMIN"
                  icon={isOnHovr ? <FolderOpenSolid /> : <FolderUnfilled />}
                  isActive={isOnHovr}
                  onClick={() => navigate('/projects/hovr')}
                  delay={80}
                />

                {/* Scroll-spy circle items — only on Hovr page */}
                <AnimatePresence>
                  {isOnHovr && (
                    <motion.ul
                      variants={listVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      className="flex flex-col list-none"
                      style={{ paddingLeft: 26, gap: 8 }}
                    >
                      {HOVR_SECTIONS.map((section, i) => (
                        <motion.li key={section.id} variants={itemVariants}>
                          <CircleNavItem
                            section={section}
                            isActive={activeSection === section.id}
                            delay={i * 50}
                            scrollContainerRef={scrollContainerRef}
                          />
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </motion.li>

              {/* AR FITTING ROOM */}
              <motion.li key="ar" variants={itemVariants}>
                <ProjectItem
                  label="AR FITTING ROOM"
                  icon={<FolderUnfilled />}
                  isActive={false}
                  onClick={() => {}}
                  delay={240}
                />
              </motion.li>
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* ── ABOUT ME ──────────────────────────────────────────────────── */}
      <button
        onMouseEnter={() => setAboutHovered(true)}
        onMouseLeave={() => setAboutHovered(false)}
        onClick={() => navigate('/about')}
        className="flex items-center text-left"
        style={{
          color: isOnAbout || aboutHovered ? NEON : 'white',
          gap: 10, padding: 8, background: 'transparent', border: 'none',
        }}
      >
        {isOnAbout ? <FolderOpenSolid /> : <FolderUnfilled />}
        <ScrambleText text="ABOUT ME" delay={200} />
      </button>

      {/* ── LINKEDIN ──────────────────────────────────────────────────── */}
      <button
        onMouseEnter={() => setLinkedinHovered(true)}
        onMouseLeave={() => setLinkedinHovered(false)}
        onClick={() => window.open('https://www.linkedin.com/in/minjoo-kim-kor/?skipRedirect=true', '_blank')}
        className="flex items-center text-left"
        style={{
          color: linkedinHovered ? NEON : 'white',
          gap: 10, padding: 8, background: 'transparent', border: 'none',
        }}
      >
        <LinkIcon />
        <ScrambleText text="LINKEDIN" delay={400} />
      </button>

      {/* ── RESUME ────────────────────────────────────────────────────── */}
      <button
        type="button"
        onMouseEnter={() => setResumeHovered(true)}
        onMouseLeave={() => setResumeHovered(false)}
        onClick={() => window.open('https://drive.google.com/file/d/1WRFvCfASQgqN4Utfcp4b-aEZtw2FzHY3/view', '_blank')}
        className="flex items-center text-left"
        style={{
          color: resumeHovered ? NEON : 'white',
          gap: 10, padding: 8, background: 'transparent', border: 'none',
        }}
      >
        <PaperclipIcon />
        <ScrambleText text="RESUME" delay={600} />
      </button>

    </nav>
  )
}
