import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useIsNarrow } from '../hooks/useIsNarrow'
import { useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { usePageTheme } from '../context/PageThemeContext'
import { AboutMePopupPanel } from './AboutMePopup'

type LucideIcon = React.ComponentType<{ size?: number; strokeWidth?: number; color?: string }>

function ResumeIcon({ color = 'black' }: { color?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="23" viewBox="0 0 18 23" fill="none">
      <path d="M3.364 21.7857H14.0311C16.1106 21.7857 17.1451 20.731 17.1451 18.6417V9.52129C17.1451 8.22529 17.0046 7.663 16.201 6.83929L10.6561 1.20443C9.89329 0.420572 9.27014 0.25 8.13529 0.25H3.364C1.29486 0.25 0.25 1.31457 0.25 3.40429V18.6417C0.25 20.7409 1.29486 21.7857 3.364 21.7857ZM3.44414 20.1687C2.40957 20.1687 1.867 19.6159 1.867 18.6117V3.43429C1.867 2.44 2.40957 1.867 3.45443 1.867H7.91414V7.70329C7.91414 8.96886 8.557 9.59157 9.80243 9.59157H15.5281V18.6117C15.5281 19.6159 14.9954 20.1687 13.951 20.1687H3.44414ZM9.98329 8.07443C9.59157 8.07443 9.43043 7.91414 9.43043 7.51214V2.17857L15.2161 8.07486L9.98329 8.07443Z" fill={color} stroke={color} strokeWidth="0.5"/>
    </svg>
  )
}

function HomeIcon({ color = 'black' }: { color?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18" fill="none">
      <path d="M2 15.5H5V10.5C5 10.2167 5.096 9.97933 5.288 9.788C5.48 9.59667 5.71733 9.50067 6 9.5H10C10.2833 9.5 10.521 9.596 10.713 9.788C10.905 9.98 11.0007 10.2173 11 10.5V15.5H14V6.5L8 2L2 6.5V15.5ZM0 15.5V6.5C0 6.18333 0.0709998 5.88333 0.213 5.6C0.355 5.31667 0.550667 5.08333 0.8 4.9L6.8 0.4C7.15 0.133333 7.55 0 8 0C8.45 0 8.85 0.133333 9.2 0.4L15.2 4.9C15.45 5.08333 15.646 5.31667 15.788 5.6C15.93 5.88333 16.0007 6.18333 16 6.5V15.5C16 16.05 15.804 16.521 15.412 16.913C15.02 17.305 14.5493 17.5007 14 17.5H10C9.71667 17.5 9.47933 17.404 9.288 17.212C9.09667 17.02 9.00067 16.7827 9 16.5V11.5H7V16.5C7 16.7833 6.904 17.021 6.712 17.213C6.52 17.405 6.28267 17.5007 6 17.5H2C1.45 17.5 0.979333 17.3043 0.588 16.913C0.196666 16.5217 0.000666667 16.0507 0 15.5Z" fill={color}/>
    </svg>
  )
}

function FolderIcon({ color = 'black' }: { color?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M4 20C3.45 20 2.97933 19.8043 2.588 19.413C2.19667 19.0217 2.00067 18.5507 2 18V6C2 5.45 2.196 4.97933 2.588 4.588C2.98 4.19667 3.45067 4.00067 4 4H10L12 6H20C20.55 6 21.021 6.196 21.413 6.588C21.805 6.98 22.0007 7.45067 22 8V18C22 18.55 21.8043 19.021 21.413 19.413C21.0217 19.805 20.5507 20.0007 20 20H4ZM4 18H20V8H11.175L9.175 6H4V18Z" fill={color}/>
    </svg>
  )
}

function FolderHoverActiveIcon({ isDark }: { isDark: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={isDark ? 'text-white' : 'text-black'}>
      <path d="M4 20C3.45 20 2.97933 19.8043 2.588 19.413C2.19667 19.0217 2.00067 18.5507 2 18V6C2 5.45 2.196 4.97933 2.588 4.588C2.98 4.19667 3.45067 4.00067 4 4H10L12 6H20C20.55 6 21.021 6.196 21.413 6.588C21.805 6.98 22.0007 7.45067 22 8H11.175L9.175 6H4V18L6.4 10H23.5L20.925 18.575C20.7917 19.0083 20.546 19.3543 20.188 19.613C19.83 19.8717 19.434 20.0007 19 20H4ZM6.1 18H19L20.8 12H7.9L6.1 18Z" fill="currentColor"/>
    </svg>
  )
}

function LinkedInIcon({ color = 'black' }: { color?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M19 3C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19ZM18.5 18.5V13.2C18.5 12.3354 18.1565 11.5062 17.5452 10.8948C16.9338 10.2835 16.1046 9.94 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17C14.6813 12.17 15.0374 12.3175 15.2999 12.5801C15.5625 12.8426 15.71 13.1987 15.71 13.57V18.5H18.5ZM6.88 8.56C7.32556 8.56 7.75288 8.383 8.06794 8.06794C8.383 7.75288 8.56 7.32556 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19C6.43178 5.19 6.00193 5.36805 5.68499 5.68499C5.36805 6.00193 5.19 6.43178 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56ZM8.27 18.5V10.13H5.5V18.5H8.27Z" fill={color}/>
    </svg>
  )
}

const PHASE2_TRANSITION = {
  delay: 1.2,
  duration: 2.0,
  ease: [0.44, 0, 0.3, 0.99] as [number, number, number, number],
}

const PROJECTS = [
  { id: 'hovr', label: 'HOVR', desc: '84.9% Faster Driver Approvals via OCR Automation' },
  { id: 'piikai', label: 'Piik AI', desc: '75% Support Ticket Drop through Behavioral Analysis' },
  { id: 'ar-fitting-room', label: 'AR-Fitting Room', desc: 'Award-Winning Accessible Design: AR Solution for Inclusive Fashion' },
]

export function PillNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null)
  const [isProjectsOpen, setIsProjectsOpen] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
  const isNarrow = useIsNarrow(1500)
  const { isDark } = usePageTheme()

  const iconColor = isDark ? '#FFFFFF' : '#000000'
  const glassClass = isDark ? 'bg-white/20 border-2 border-white/[0.22]' : 'bg-white/30 border-2 border-black'

  useEffect(() => {
    if (!isProjectsOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsProjectsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isProjectsOpen])

  const navItems = useMemo(() => {
    const items: Array<{
      icon?: LucideIcon
      home?: true
      folder?: true
      linkedIn?: true
      resume?: true
      label: string
      to?: string
      href?: string
    }> = [
      { home: true, label: 'Home', to: '/' },
      { folder: true, label: 'Projects', to: '/projects' },
      { linkedIn: true, label: 'LinkedIn', href: 'https://www.linkedin.com/in/minjoo-kim-kor/?skipRedirect=true' },
      { resume: true, label: 'Resume', href: 'https://drive.google.com/file/d/1WRFvCfASQgqN4Utfcp4b-aEZtw2FzHY3/view' },
    ]
    return items
  }, [])

  return (
    <div
      ref={navRef}
      className="max-md:hidden absolute top-1/2 z-[100] -translate-y-1/2"
      style={{ left: isNarrow ? 16 : 'calc(8.33% + 15px)' }}
    >
      <motion.div
        className={`flex flex-col gap-[11px] rounded-[100px] p-[10px] backdrop-blur-xl pointer-events-auto transition-none ${glassClass}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={PHASE2_TRANSITION}
      >
      {navItems.map((item) => {
        const isActive: boolean = (() => {
          if (item.href) return false
          if (!item.to) return false
          return item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to)
        })()

        const isHovered = hoveredLabel === item.label
        const isProjects = item.label === 'Projects'
        const shouldShowProjectsBlackIcon = isProjects && (isProjectsOpen || isHovered || isActive)

        return (
          <div
            key={item.label}
            className="relative"
            onMouseEnter={() => setHoveredLabel(item.label)}
            onMouseLeave={() => setHoveredLabel(null)}
          >
            <motion.button
              aria-label={item.label}
              className="box-border flex h-[50px] w-[50px] items-center justify-center rounded-full border-2 border-black dark:border-white/[0.22]"
              animate={{ backgroundColor: isActive ? 'rgba(128,128,128,0.15)' : 'rgba(0,0,0,0)' }}
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(128,128,128,0.12)' }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => {
                if (isProjects) {
                  setIsProjectsOpen((v) => !v)
                  return
                }
                if (item.href) window.open(item.href, '_blank')
                else if (item.to) navigate(item.to)
              }}
            >
              {item.home ? (
                <HomeIcon color={iconColor} />
              ) : item.folder ? (
                shouldShowProjectsBlackIcon ? <FolderHoverActiveIcon isDark={isDark} /> : <FolderIcon color={iconColor} />
              ) : item.linkedIn ? (
                <LinkedInIcon color={iconColor} />
              ) : item.resume ? (
                <ResumeIcon color={iconColor} />
              ) : item.icon ? (
                <item.icon size={24} strokeWidth={1.5} color={iconColor} />
              ) : null}
            </motion.button>

            {isProjects && isProjectsOpen && (
              <motion.div
                className={`absolute top-0 left-[calc(100%+1rem)] z-[10001] flex max-h-[min(380px,70vh)] min-w-0 w-[min(380px,calc(100vw-2rem))] max-w-[min(380px,calc(100vw-2rem))] flex-col gap-3 overflow-x-hidden overflow-y-auto overscroll-contain rounded-[20px] border-2 border-black p-[10px] backdrop-blur-xl transition-none dark:border-white/[0.22] ${isDark ? 'bg-white/20' : 'bg-white/30'}`}
                style={{ fontFamily: 'Arial, sans-serif' }}
                initial={{ x: -16, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -8, opacity: 0 }}
                transition={{
                  duration: 0.35,
                  ease: 'easeOut',
                }}
              >
                {PROJECTS.map((p) => (
                  <motion.div
                    key={p.id}
                    className="flex flex-col gap-1 rounded-[10px] px-4 py-3"
                    whileHover={{ backgroundColor: 'rgba(128,128,128,0.12)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <p style={{ fontSize: 14, lineHeight: '16px', fontWeight: 700, color: iconColor }}>{p.label}</p>
                    <p style={{ fontSize: 14, lineHeight: '16px', fontWeight: 400, color: iconColor, opacity: 0.85 }}>{p.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        )
      })}
      </motion.div>
    </div>
  )
}

const THEME_SUN_PATH_OUTLINE =
  'M6 6H4V12H6V6ZM6 6H12V4H6V6ZM2 16H4V14H2V16ZM0 10H2V8H0V10ZM8 18H10V16H8V18ZM6 14H12V12H6V14ZM2 4H4V2H2V4ZM14 16H16V14H14V16ZM12 12H14V6H12V12ZM8 2H10V0H8V2ZM16 10H18V8H16V10ZM14 4H16V2H14V4Z'
const THEME_SUN_PATH_FILLED =
  'M6 14H12V12H14V6H12V4H6V6H4V12H6V14ZM2 16H4V14H2V16ZM0 10H2V8H0V10ZM8 18H10V16H8V18ZM2 4H4V2H2V4ZM14 16H16V14H14V16ZM8 2H10V0H8V2ZM16 10H18V8H16V10ZM14 4H16V2H14V4Z'
const THEME_MOON_PATH_OUTLINE =
  'M19 16V17H17V18H13V17H11V16H9V15H8V13H7V11H6V7H7V5H8V3H9V2H11V1H13V0H8V1H6V2H4V3H3V4H2V6H1V8H0V14H1V16H2V18H3V19H4V20H6V21H8V22H14V21H16V20H18V19H19V18H20V16H19ZM6 19V18H4V16H3V14H2V8H3V6H4V4H6V5H5V7H4V11H5V13H6V15H7V16H8V17H9V18H11V19H13V20H8V19H6Z'
const THEME_MOON_PATH_FILLED =
  'M22 17V19H21V20H20V21H18V22H16V23H10V22H8V21H6V20H5V19H4V17H3V15H2V9H3V7H4V5H5V4H6V3H8V2H10V1H15V2H13V3H11V4H10V6H9V8H8V12H9V14H10V16H11V17H13V18H15V19H19V18H21V17H22Z'

/** Sun: outline when off; filled when on or on hover/press while off. Block SVG + wrapper avoids baseline offset inside the segment. */
function ThemeLightAppearanceGlyphs({ selected }: { selected: boolean }) {
  const svgClass = 'block h-[15.84px] w-[15.84px] shrink-0'
  const core = selected ? (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="none" className={svgClass}>
      <path d={THEME_SUN_PATH_FILLED} fill="currentColor" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="none" className={svgClass}>
      <path
        d={THEME_SUN_PATH_OUTLINE}
        fill="currentColor"
        className="opacity-100 transition-opacity duration-100 ease-out group-hover:opacity-0 group-active:opacity-0"
      />
      <path
        d={THEME_SUN_PATH_FILLED}
        fill="currentColor"
        className="opacity-0 transition-opacity duration-100 ease-out group-hover:opacity-100 group-active:opacity-100"
      />
    </svg>
  )
  return (
    <span className="inline-flex items-center justify-center leading-none">{core}</span>
  )
}

/** Moon slot: outline + filled share the same 20×22px box so hover/active doesn’t resize; scale + parent `place-items` keeps it button-centered. */
const THEME_MOON_SLOT_CLASS = 'relative block h-[19.36px] w-[17.6px] shrink-0'

function ThemeDarkAppearanceGlyphs({ selected }: { selected: boolean }) {
  const moonSvgClass = 'absolute inset-0 block h-full w-full'
  const core = selected ? (
    <span className={THEME_MOON_SLOT_CLASS}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={moonSvgClass} preserveAspectRatio="xMidYMid meet">
        <path d={THEME_MOON_PATH_FILLED} fill="currentColor" />
      </svg>
    </span>
  ) : (
    <span className={THEME_MOON_SLOT_CLASS}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 22"
        fill="none"
        className={`${moonSvgClass} opacity-100 transition-opacity duration-100 ease-out group-hover:opacity-0 group-active:opacity-0`}
        preserveAspectRatio="xMidYMid meet"
      >
        <path d={THEME_MOON_PATH_OUTLINE} fill="currentColor" />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        className={`${moonSvgClass} opacity-0 transition-opacity duration-100 ease-out group-hover:opacity-100 group-active:opacity-100`}
        preserveAspectRatio="xMidYMid meet"
      >
        <path d={THEME_MOON_PATH_FILLED} fill="currentColor" />
      </svg>
    </span>
  )
  return (
    <span className="inline-flex origin-center scale-[0.81] items-center justify-center leading-none">{core}</span>
  )
}

const themeSegOff =
  'bg-[#faf7f0] text-black transition-colors hover:bg-black hover:text-white dark:bg-[#111111] dark:text-white dark:hover:bg-white dark:hover:text-black'
const themeSegOn =
  'bg-black text-white dark:bg-white dark:text-black'

const LINKEDIN_URL = 'https://www.linkedin.com/in/minjoo-kim-kor/?skipRedirect=true'
const RESUME_URL =
  'https://drive.google.com/file/d/1WRFvCfASQgqN4Utfcp4b-aEZtw2FzHY3/view'

const CHROME_INSET_TOP = 'max(var(--portfolio-chrome-top,1rem),env(safe-area-inset-top,0px))'
const CHROME_INSET_RIGHT = 'max(var(--portfolio-chrome-top,1rem),env(safe-area-inset-right,0px))'
/** Sit link stack directly above the fixed SYSTEM GRID control. */
const CHROME_LINKS_BOTTOM =
  'calc(max(var(--portfolio-chrome-top,1rem),env(safe-area-inset-bottom,0px)) + var(--portfolio-chrome-control-size) + 0.5rem)'
const CHROME_POPUP_ABOVE_STACK_GAP_PX = 4
const CHROME_PROFILE_LINK_WIDTH_PX = 100
const CHROME_PROFILE_LINK_CLASS =
  'blueprint-mode-toggle box-border grid h-[var(--portfolio-chrome-control-size)] min-h-[var(--portfolio-chrome-control-size)] max-h-[var(--portfolio-chrome-control-size)] w-[100px] min-w-[100px] max-w-[100px] shrink-0 grow-0 grid-cols-[1.15em_minmax(0,1fr)] items-center gap-x-[0.35em] overflow-hidden text-left font-[inherit]'

function ChromeLinkIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex size-[1.15em] items-center justify-center [&>svg]:block">{children}</span>
  )
}

/** “I like” fold glyph — used for About me chrome link. */
function ChromeAboutIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="block shrink-0"
      style={{ width: '1.15em', height: '1.15em' }}
    >
      <path
        d="M22 20V19H21V18H20V17H19V16H17V15H18V13H19V7H18V5H17V4H16V3H15V2H13V1H7V2H5V3H4V4H3V5H2V7H1V13H2V15H3V16H4V17H5V18H7V19H13V18H15V17H16V19H17V20H18V21H19V22H20V23H22V22H23V20H22ZM12 15V16H8V15H6V14H5V12H4V8H5V6H6V5H8V4H12V5H14V6H15V8H16V12H15V14H14V15H12Z"
        fill="currentColor"
      />
    </svg>
  )
}

function ChromeLinkedInIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 19 19"
      fill="none"
      aria-hidden
      className="block shrink-0"
      style={{ width: '1.15em', height: '1.15em' }}
    >
      <path
        d="M17.5 0.833333V0H0.833333V0.833333H0V17.5H0.833333V18.3333H17.5V17.5H18.3333V0.833333H17.5ZM10 9.16667V15.8333H7.5V6.66667H10V7.5H10.8333V6.66667H14.1667V7.5H15V15.8333H12.5V9.16667H10ZM2.5 5.83333V3.33333H5V5.83333H2.5ZM5 6.66667V15.8333H2.5V6.66667H5Z"
        fill="currentColor"
      />
    </svg>
  )
}

function ChromeResumeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden
      className="block shrink-0"
      style={{ width: '1.15em', height: '1.15em' }}
    >
      <path
        d="M19.25 3.6665V8.24984H18.3334V9.1665H17.4167V10.0832H16.5V10.9998H15.5834V11.9165H14.6667V12.8332H13.75V13.7498H12.8334V14.6665H11.9167V15.5832H11V16.4998H10.0834V17.4165H7.33337V16.4998H6.41671V15.5832H5.50004V12.8332H6.41671V11.9165H7.33337V10.9998H8.25004V10.0832H9.16671V9.1665H10.0834V8.24984H11V7.33317H11.9167V6.4165H12.8334V5.49984H13.75V4.58317H14.6667V5.49984H15.5834V7.33317H14.6667V8.24984H13.75V9.1665H12.8334V10.0832H11.9167V10.9998H11V11.9165H10.0834V12.8332H9.16671V13.7498H8.25004V14.6665H10.0834V13.7498H11V12.8332H11.9167V11.9165H12.8334V10.9998H13.75V10.0832H14.6667V9.1665H15.5834V8.24984H16.5V4.58317H15.5834V3.6665H12.8334V4.58317H11.9167V5.49984H11V6.4165H10.0834V7.33317H9.16671V8.24984H8.25004V9.1665H7.33337V10.0832H6.41671V10.9998H5.50004V11.9165H4.58337V16.4998H5.50004V17.4165H6.41671V18.3332H11V17.4165H11.9167V16.4998H12.8334V15.5832H13.75V14.6665H14.6667V13.7498H15.5834V12.8332H16.5V11.9165H17.4167V10.9998H18.3334V11.9165H19.25V13.7498H18.3334V14.6665H17.4167V15.5832H16.5V16.4998H15.5834V17.4165H14.6667V18.3332H13.75V19.2498H12.8334V20.1665H11.9167V21.0832H6.41671V20.1665H4.58337V19.2498H3.66671V18.3332H2.75004V16.4998H1.83337V10.9998H2.75004V10.0832H3.66671V9.1665H4.58337V8.24984H5.50004V7.33317H6.41671V6.4165H7.33337V5.49984H8.25004V4.58317H9.16671V3.6665H10.0834V2.74984H11V1.83317H12.8334V0.916504H16.5V1.83317H17.4167V2.74984H18.3334V3.6665H19.25Z"
        fill="currentColor"
      />
    </svg>
  )
}

/** Two-segment radiogroup: light | dark — inverted “on” side reads as power / selection. */
export function ThemeToggle() {
  const { isDark, setThemePersisted } = usePageTheme()
  const [aboutOpen, setAboutOpen] = useState(false)
  const [aboutPopupPosition, setAboutPopupPosition] = useState<{ right: number; bottom: number } | null>(
    null,
  )
  const chromeLinksRef = useRef<HTMLDivElement>(null)
  const chromeLinkStackRef = useRef<HTMLDivElement>(null)
  const aboutPopupRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!aboutOpen) {
      setAboutPopupPosition(null)
      return
    }

    const stack = chromeLinkStackRef.current
    if (!stack) return

    const updatePosition = () => {
      const el = chromeLinkStackRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      setAboutPopupPosition({
        right: Math.round(window.innerWidth - rect.right),
        bottom: Math.round(window.innerHeight - rect.top + CHROME_POPUP_ABOVE_STACK_GAP_PX),
      })
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    const ro = new ResizeObserver(updatePosition)
    ro.observe(stack)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
      ro.disconnect()
    }
  }, [aboutOpen])

  useEffect(() => {
    if (!aboutOpen) return
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (chromeLinksRef.current?.contains(target)) return
      if (aboutPopupRef.current?.contains(target)) return
      setAboutOpen(false)
    }
    window.addEventListener('pointerdown', onPointerDown)
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [aboutOpen])

  const aboutPopupPortal = useMemo(() => {
    if (typeof document === 'undefined') return null
    return createPortal(
      <AnimatePresence>
        {aboutOpen && aboutPopupPosition ? (
          <AboutMePopupPanel
            panelRef={aboutPopupRef}
            className="z-[var(--portfolio-popup-z)]"
            style={{
              right: aboutPopupPosition.right,
              bottom: aboutPopupPosition.bottom,
            }}
            onClose={() => setAboutOpen(false)}
          />
        ) : null}
      </AnimatePresence>,
      document.body,
    )
  }, [aboutOpen, aboutPopupPosition])

  return (
    <>
      <div
        className="fixed z-[110] flex flex-col items-end"
        style={{ top: CHROME_INSET_TOP, right: CHROME_INSET_RIGHT }}
      >
        <motion.div
          role="radiogroup"
          aria-label="Color theme"
          className="flex h-[var(--portfolio-chrome-control-size)] min-h-[var(--portfolio-chrome-control-size)] shrink-0 overflow-hidden rounded-none border border-black/[0.18] font-mono dark:border-white/[0.14]"
          initial={{ x: 12, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <button
            type="button"
            role="radio"
            aria-checked={!isDark}
            title="Light appearance"
            className={`group relative box-border grid min-h-[var(--portfolio-chrome-control-size)] min-w-[var(--portfolio-chrome-control-size)] flex-1 place-items-center border-r border-black/[0.18] p-[1.65px] outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf7f0] dark:border-r-white/[0.14] dark:focus-visible:ring-white/40 dark:focus-visible:ring-offset-[#111111] ${!isDark ? themeSegOn : themeSegOff}`}
            onClick={() => setThemePersisted(false)}
          >
            <span className="pointer-events-none leading-none" aria-hidden>
              <ThemeLightAppearanceGlyphs selected={!isDark} />
            </span>
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={isDark}
            title="Dark appearance"
            className={`group relative box-border grid min-h-[var(--portfolio-chrome-control-size)] min-w-[var(--portfolio-chrome-control-size)] flex-1 place-items-center p-[1.65px] outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf7f0] dark:focus-visible:ring-white/40 dark:focus-visible:ring-offset-[#111111] ${isDark ? themeSegOn : themeSegOff}`}
            onClick={() => setThemePersisted(true)}
          >
            <span className="pointer-events-none leading-none" aria-hidden>
              <ThemeDarkAppearanceGlyphs selected={isDark} />
            </span>
          </button>
        </motion.div>
      </div>
      {aboutPopupPortal}
      <div
        ref={chromeLinksRef}
        className="fixed z-[99998]"
        style={{
          bottom: CHROME_LINKS_BOTTOM,
          right: CHROME_INSET_RIGHT,
          fontSize: 'var(--portfolio-chrome-label-size)',
        }}
      >
        <div
          ref={chromeLinkStackRef}
          className="relative inline-flex shrink-0 grow-0 flex-col items-stretch gap-[0.35em]"
          style={{ width: CHROME_PROFILE_LINK_WIDTH_PX }}
        >
          <button
            type="button"
            className={`${CHROME_PROFILE_LINK_CLASS} appearance-none`}
            aria-label="About me"
            aria-expanded={aboutOpen}
            onClick={() => setAboutOpen((open) => !open)}
          >
          <ChromeLinkIcon>
            <ChromeAboutIcon />
          </ChromeLinkIcon>
          <span>[ ABOUT ME ]</span>
        </button>
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={CHROME_PROFILE_LINK_CLASS}
          aria-label="LinkedIn profile"
        >
          <ChromeLinkIcon>
            <ChromeLinkedInIcon />
          </ChromeLinkIcon>
          <span>[ LINKEDIN ]</span>
        </a>
        <a
          href={RESUME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={CHROME_PROFILE_LINK_CLASS}
          aria-label="Resume (opens in Google Drive)"
        >
          <ChromeLinkIcon>
            <ChromeResumeIcon />
          </ChromeLinkIcon>
          <span>[ RESUME ]</span>
        </a>
        </div>
      </div>
    </>
  )
}

