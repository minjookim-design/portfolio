import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { AboutMePopupPanel } from '../../components/AboutMePopup'
import { usePageTheme } from '../../context/PageThemeContext'

export const LINKEDIN_URL = 'https://www.linkedin.com/in/minjoo-kim-kor/?skipRedirect=true'
export const RESUME_URL = 'https://drive.google.com/file/d/1WRFvCfASQgqN4Utfcp4b-aEZtw2FzHY3/view'

const PILL_NAV_LINKS = [
  { label: 'About Me', kind: 'about' as const },
  { label: 'Resume', kind: 'resume' as const, href: RESUME_URL },
  { label: 'LinkedIn', kind: 'external' as const, href: LINKEDIN_URL },
]

function ErdNavLogoMark() {
  return (
    <span className="erd-nav-pill-logo-mark">
      <img
        src="/me/me1.png"
        alt="Minjoo Kim"
        className="erd-nav-pill-logo-img erd-nav-pill-logo-img--default"
        decoding="async"
      />
      <img
        src="/me/me2.png"
        alt=""
        aria-hidden
        className="erd-nav-pill-logo-img erd-nav-pill-logo-img--hover"
        decoding="async"
      />
    </span>
  )
}

function MenuIcon() {
  return (
    <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function ProjectCloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M3 3l8 8M11 3 3 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function ErdProjectCloseButton({
  onClick,
  label = 'Close project',
  className,
}: {
  onClick: () => void
  label?: string
  className?: string
}) {
  return (
    <div className={`erd-nav-pill erd-project-close-pill${className ? ` ${className}` : ''}`}>
      <button type="button" className="erd-project-close-btn" onClick={onClick} aria-label={label}>
        <ProjectCloseIcon />
      </button>
    </div>
  )
}

export function ErdNavThemeToggle({ className }: { className?: string }) {
  const { isDark, setThemePersisted } = usePageTheme()

  return (
    <div
      className={`erd-nav-pill-theme${isDark ? ' is-dark' : ' is-light'}${className ? ` ${className}` : ''}`}
      role="radiogroup"
      aria-label="Color theme"
    >
      <span className="erd-nav-pill-theme-thumb" aria-hidden />
      <button
        type="button"
        role="radio"
        aria-checked={!isDark}
        title="Light appearance"
        className={`erd-nav-pill-theme-btn${!isDark ? ' is-active' : ''}`}
        onClick={() => setThemePersisted(false)}
      >
        <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden>
          <circle cx="9" cy="9" r="3.25" stroke="currentColor" strokeWidth="1.5" />
          <path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.4 3.4l1.4 1.4M13.2 13.2l1.4 1.4M3.4 14.6l1.4-1.4M13.2 4.8l1.4-1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={isDark}
        title="Dark appearance"
        className={`erd-nav-pill-theme-btn${isDark ? ' is-active' : ''}`}
        onClick={() => setThemePersisted(true)}
      >
        <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden>
          <path
            d="M7.4 2.1a6.5 6.5 0 1 0 8.5 8.5 5.25 5.25 0 1 1-8.5-8.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  )
}

export function ErdHeader({
  logoTo,
  menuOpen,
  aboutOpen,
  onMenuToggle,
  onAboutOpen,
  onAboutClose,
  pillEntrance,
}: {
  logoTo: string
  menuOpen: boolean
  aboutOpen: boolean
  onMenuToggle: () => void
  onAboutOpen: () => void
  onAboutClose: () => void
  /** When set, primary nav pill plays this entrance (e.g. slide down at end of page load). */
  pillEntrance?: Variants
}) {
  const reduceMotion = useReducedMotion()
  const pillInitial = pillEntrance && !reduceMotion ? 'hidden' : false

  return (
    <header className="erd-header">
      <div className="erd-header-inner">
        <button
          type="button"
          className="erd-menu-btn"
          aria-label={menuOpen ? 'Close menu' : 'Menu'}
          onClick={onMenuToggle}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        <motion.nav
          className="erd-nav-pill"
          aria-label="Primary"
          initial={pillInitial}
          animate="show"
          variants={pillEntrance}
        >
          <Link to={logoTo} className="erd-nav-pill-logo" aria-label="Minjoo Kim home">
            <ErdNavLogoMark />
          </Link>
          {PILL_NAV_LINKS.map((item) => {
            if (item.kind === 'about') {
              return (
                <button
                  key={item.label}
                  type="button"
                  className="erd-nav-pill-link erd-nav-pill-link--about"
                  onClick={onAboutOpen}
                >
                  {item.label}
                </button>
              )
            }

            return (
              <a
                key={item.label}
                href={item.href}
                className="erd-nav-pill-link"
                target="_blank"
                rel="noreferrer"
              >
                {item.label}
              </a>
            )
          })}
          <ErdNavThemeToggle />
        </motion.nav>
      </div>

      {aboutOpen && typeof document !== 'undefined'
        ? createPortal(
            <div className="erd-about-overlay" onClick={onAboutClose}>
              <div onClick={(e) => e.stopPropagation()}>
                <AboutMePopupPanel onClose={onAboutClose} className="z-[var(--portfolio-popup-z)]" />
              </div>
            </div>,
            document.body,
          )
        : null}
    </header>
  )
}

export function ErdMobileMenu({
  logoTo,
  open,
  onClose,
  onAboutOpen,
}: {
  logoTo: string
  open: boolean
  onClose: () => void
  onAboutOpen: () => void
}) {
  return (
    <div className={`erd-mobile-menu${open ? ' is-open' : ''}`} aria-hidden={!open}>
      <div className="erd-mobile-menu-inner">
        <Link to={logoTo} onClick={onClose} className="erd-mobile-menu-logo" aria-label="Minjoo Kim home">
          <ErdNavLogoMark />
        </Link>
        <button
          type="button"
          onClick={() => {
            onClose()
            onAboutOpen()
          }}
        >
          About Me
        </button>
        <a href={RESUME_URL} target="_blank" rel="noreferrer" onClick={onClose}>
          Resume
        </a>
        <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" onClick={onClose}>
          LinkedIn
        </a>
        <ErdNavThemeToggle className="erd-nav-pill-theme--mobile" />
      </div>
    </div>
  )
}

/** Full homepage nav — header, mobile menu, and backdrop. */
export function ErdSiteNav({
  logoTo = '/',
  pillEntrance,
  /** When set, About Me scrolls to this element id (or navigates to `aboutPath#id`). */
  aboutSectionId,
  aboutPath = '/',
  /** When set, About Me navigates to this route (project overlay open). */
  aboutTo,
}: {
  logoTo?: string
  pillEntrance?: Variants
  aboutSectionId?: string
  aboutPath?: string
  aboutTo?: string
}) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)

  const closeAll = useCallback(() => {
    setMenuOpen(false)
    setAboutOpen(false)
  }, [])

  const openAbout = useCallback(() => {
    setMenuOpen(false)
    if (aboutTo) {
      navigate(aboutTo)
      return
    }
    if (aboutSectionId) {
      const el = document.getElementById(aboutSectionId)
      const projectOpen = Boolean(document.querySelector('.erd-site--project-open'))
      if (el && !projectOpen) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        return
      }
      navigate({ pathname: aboutPath, hash: aboutSectionId })
      return
    }
    setAboutOpen(true)
  }, [aboutPath, aboutSectionId, aboutTo, navigate])

  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  return (
    <>
      <ErdHeader
        logoTo={logoTo}
        menuOpen={menuOpen}
        aboutOpen={aboutOpen}
        pillEntrance={pillEntrance}
        onMenuToggle={() => {
          setAboutOpen(false)
          setMenuOpen((open) => !open)
        }}
        onAboutOpen={openAbout}
        onAboutClose={() => setAboutOpen(false)}
      />
      {typeof document !== 'undefined'
        ? createPortal(
            <div className="erd-nav-layer">
              <ErdMobileMenu
                logoTo={logoTo}
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
                onAboutOpen={openAbout}
              />
              <div
                className={`erd-backdrop${menuOpen ? ' is-open' : ''}`}
                aria-hidden={!menuOpen}
                onClick={closeAll}
              />
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
