import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrambleText } from './ScrambleText'

const PROJECTS = ['BMAD', 'HOVR Admin', 'JoJo', 'AR Fitting Room']

const NEON = '#00FF00'
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const listVariants = {
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
  open: {
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  closed: {
    opacity: 0,
    y: -6,
    transition: { ease: EASE, duration: 0.25 },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: { ease: EASE, duration: 0.35 },
  },
}

// ── SVG Icons ─────────────────────────────────────────────────────────────────

function FolderUnfilled() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M18.3333 4.99984V4.1665H10.8333V3.33317H9.99992V2.49984H9.16658V1.6665H1.66659V2.49984H0.833252V17.4998H1.66659V18.3332H18.3333V17.4998H19.1666V4.99984H18.3333ZM17.4999 16.6665H2.49992V3.33317H8.33325V4.1665H9.16658V4.99984H9.99992V5.83317H17.4999V16.6665Z"
        fill="currentColor"
      />
    </svg>
  )
}

function FolderFilled() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M1.83341 14.6668H0.916748V2.75016H1.83341V1.8335H8.25008V2.75016H9.16675V3.66683H17.4167V4.5835H18.3334V8.25016H4.58341V9.16683H3.66675V11.0002H2.75008V12.8335H1.83341V14.6668Z"
        fill="currentColor"
      />
      <path
        d="M21.0833 9.1665V10.9998H20.1666V12.8332H19.2499V14.6665H18.3333V16.4998H17.4166V19.2498H16.4999V20.1665H2.74992V19.2498H1.83325V16.4998H2.74992V14.6665H3.66659V12.8332H4.58325V10.9998H5.49992V9.1665H21.0833Z"
        fill="currentColor"
      />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M14.6667 9.16683H15.5834V15.5835H14.6667V16.5002H13.7501V17.4168H12.8334V18.3335H11.9167V19.2502H11.0001V20.1668H10.0834V21.0835H4.58341V20.1668H3.66675V19.2502H2.75008V18.3335H1.83341V17.4168H0.916748V12.8335H1.83341V11.9168H2.75008V11.0002H3.66675V10.0835H4.58341V12.8335H3.66675V13.7502H2.75008V16.5002H3.66675V17.4168H4.58341V18.3335H5.50008V19.2502H9.16675V18.3335H10.0834V17.4168H11.0001V16.5002H11.9167V15.5835H12.8334V14.6668H13.7501V10.0835H12.8334V9.16683H11.9167V8.25016H12.8334V7.3335H13.7501V8.25016H14.6667V9.16683Z"
        fill="currentColor"
      />
      <path
        d="M21.0834 4.58317V9.1665H20.1667V10.0832H19.2501V10.9998H18.3334V11.9165H17.4167V9.1665H18.3334V8.24984H19.2501V5.49984H18.3334V4.58317H17.4167V3.6665H16.5001V2.74984H12.8334V3.6665H11.9167V4.58317H11.0001V5.49984H10.0834V6.4165H9.16675V7.33317H8.25008V11.9165H9.16675V12.8332H10.0834V13.7498H9.16675V14.6665H8.25008V13.7498H7.33341V12.8332H6.41675V6.4165H7.33341V5.49984H8.25008V4.58317H9.16675V3.6665H10.0834V2.74984H11.0001V1.83317H11.9167V0.916504H17.4167V1.83317H18.3334V2.74984H19.2501V3.6665H20.1667V4.58317H21.0834Z"
        fill="currentColor"
      />
    </svg>
  )
}

function ResumeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path
        d="M21.4167 3.6665V8.24984H20.5V9.1665H19.5833V10.0832H18.6667V10.9998H17.75V11.9165H16.8333V12.8332H15.9167V13.7498H15V14.6665H14.0833V15.5832H13.1667V16.4998H12.25V17.4165H9.5V16.4998H8.58333V15.5832H7.66667V12.8332H8.58333V11.9165H9.5V10.9998H10.4167V10.0832H11.3333V9.1665H12.25V8.24984H13.1667V7.33317H14.0833V6.4165H15V5.49984H15.9167V4.58317H16.8333V5.49984H17.75V6.4165H16.8333V7.33317H15.9167V8.24984H15V9.1665H14.0833V10.0832H13.1667V10.9998H12.25V11.9165H11.3333V12.8332H10.4167V13.7498H9.5V14.6665H10.4167V15.5832H11.3333V14.6665H12.25V13.7498H13.1667V12.8332H14.0833V11.9165H15V10.9998H15.9167V10.0832H16.8333V9.1665H17.75V8.24984H18.6667V7.33317H19.5833V4.58317H18.6667V3.6665H17.75V2.74984H15V3.6665H14.0833V4.58317H13.1667V5.49984H12.25V6.4165H11.3333V7.33317H10.4167V8.24984H9.5V9.1665H8.58333V10.0832H7.66667V10.9998H6.75V11.9165H5.83333V16.4998H6.75V17.4165H7.66667V18.3332H8.58333V19.2498H13.1667V18.3332H14.0833V17.4165H15V16.4998H15.9167V15.5832H16.8333V14.6665H17.75V13.7498H18.6667V12.8332H19.5833V11.9165H21.4167V13.7498H20.5V14.6665H19.5833V15.5832H18.6667V16.4998H17.75V17.4165H16.8333V18.3332H15.9167V19.2498H15V20.1665H14.0833V21.0832H8.58333V20.1665H6.75V19.2498H5.83333V18.3332H4.91667V16.4998H4V10.9998H4.91667V10.0832H5.83333V9.1665H6.75V8.24984H7.66667V7.33317H8.58333V6.4165H9.5V5.49984H10.4167V4.58317H11.3333V3.6665H12.25V2.74984H13.1667V1.83317H15V0.916504H18.6667V1.83317H19.5833V2.74984H20.5V3.6665H21.4167Z"
        fill="currentColor"
      />
    </svg>
  )
}

// ── Lock Icon ────────────────────────────────────────────────────────────────

function LockIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M19.2499 10.9998V10.0832H16.4999V4.58317H15.5833V2.74984H14.6666V1.83317H12.8333V0.916504H9.16659V1.83317H7.33325V2.74984H6.41659V4.58317H5.49992V10.0832H2.74992V10.9998H1.83325V20.1665H2.74992V21.0832H19.2499V20.1665H20.1666V10.9998H19.2499ZM18.3333 11.9165V19.2498H3.66659V11.9165H18.3333ZM8.24992 4.58317V3.6665H9.16659V2.74984H12.8333V3.6665H13.7499V4.58317H14.6666V10.0832H7.33325V4.58317H8.24992Z"
        fill="currentColor"
      />
    </svg>
  )
}

// ── Dropdown sub-item ─────────────────────────────────────────────────────────

function ProjectSubItem({ label, delay }: { label: string; delay: number }) {
  const [hovered, setHovered] = useState(false)
  const isBMAD = label === 'BMAD'

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center gap-[8px] text-left"
      style={{ color: hovered ? NEON : 'white' }}
    >
      {isBMAD
        ? <LockIcon />
        : hovered ? <FolderFilled /> : <FolderUnfilled />
      }
      <ScrambleText text={label} delay={delay} scrambleCycles={6} speed={30} />
    </button>
  )
}

// ── NavMenu ───────────────────────────────────────────────────────────────────

export function NavMenu() {
  const [projectsOpen, setProjectsOpen] = useState(false)
  const [projectsHovered, setProjectsHovered] = useState(false)
  const [aboutHovered, setAboutHovered] = useState(false)
  const [linkedinHovered, setLinkedinHovered] = useState(false)
  const [resumeHovered, setResumeHovered] = useState(false)

  const projectsActive = projectsHovered || projectsOpen

  return (
    <nav className="font-mono text-[14px] leading-[16px] flex flex-col gap-[20px]">

      {/* ── PROJECTS ──────────────────────────────────────────────────────── */}
      <div>
        <button
          onClick={() => setProjectsOpen((v) => !v)}
          onMouseEnter={() => setProjectsHovered(true)}
          onMouseLeave={() => setProjectsHovered(false)}
          className="flex items-center gap-[8px]"
          style={{ color: projectsActive ? NEON : 'white' }}
        >
          {projectsActive ? <FolderFilled /> : <FolderUnfilled />}
          <ScrambleText text="PROJECTS" delay={0} />
        </button>

        <AnimatePresence>
          {projectsOpen && (
            <motion.ul
              variants={listVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="mt-[8px] pl-[28px] flex flex-col gap-[8px] list-none"
            >
              {PROJECTS.map((project, i) => (
                <motion.li key={project} variants={itemVariants}>
                  <ProjectSubItem label={project} delay={i * 80} />
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* ── ABOUT ME ──────────────────────────────────────────────────────── */}
      <button
        onMouseEnter={() => setAboutHovered(true)}
        onMouseLeave={() => setAboutHovered(false)}
        className="flex items-center gap-[8px] text-left"
        style={{ color: aboutHovered ? NEON : 'white' }}
      >
        {aboutHovered ? <FolderFilled /> : <FolderUnfilled />}
        <ScrambleText text="ABOUT ME" delay={200} />
      </button>

      {/* ── LINKEDIN ──────────────────────────────────────────────────────── */}
      <button
        onMouseEnter={() => setLinkedinHovered(true)}
        onMouseLeave={() => setLinkedinHovered(false)}
        className="flex items-center gap-[8px] text-left"
        style={{ color: linkedinHovered ? NEON : 'white' }}
      >
        <LinkIcon />
        <ScrambleText text="LINKEDIN" delay={400} />
      </button>

      {/* ── RESUME ────────────────────────────────────────────────────────── */}
      <button
        onMouseEnter={() => setResumeHovered(true)}
        onMouseLeave={() => setResumeHovered(false)}
        className="flex items-center gap-[8px] text-left"
        style={{ color: resumeHovered ? NEON : 'white' }}
      >
        <ResumeIcon />
        <ScrambleText text="RESUME" delay={600} />
      </button>

    </nav>
  )
}
