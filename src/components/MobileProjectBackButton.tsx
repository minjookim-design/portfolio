import { useNavigate, useLocation } from 'react-router-dom'
import { usePageTheme } from '../context/PageThemeContext'
import { useHomeMobileProjectOptional } from '../context/HomeMobileProjectContext'

const PROJECT_DETAIL_RE =
  /^\/projects\/(hovr|piik|jojo|ar-fitting-room|bmad)(\/.*)?$/

/**
 * Mobile-only fixed back: home project overlay closes to intro; case studies go to `/`.
 */
export function MobileProjectBackButton() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { isDark } = usePageTheme()
  const homeMobile = useHomeMobileProjectOptional()

  const onHome = pathname === '/' || pathname === ''
  const homeProjectOverlay = onHome && homeMobile?.detailOpen

  if (!homeProjectOverlay && !PROJECT_DETAIL_RE.test(pathname)) return null

  const label = homeProjectOverlay ? 'Back' : 'Back to Home'
  const ariaLabel = homeProjectOverlay ? 'Close project and go back' : 'Back to home'

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={() => {
        if (homeProjectOverlay) homeMobile?.closeDetail()
        else navigate('/')
      }}
      className={`md:hidden fixed left-4 top-[max(1rem,env(safe-area-inset-top,0px))] z-[999] flex items-center gap-1.5 rounded-full border px-3 py-2 font-mono text-[12px] font-semibold backdrop-blur-xl ${
        isDark
          ? 'border-white/20 bg-black/55 text-white'
          : 'border-black/10 bg-white/70 text-black'
      }`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M15 18L9 12L15 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label}
    </button>
  )
}
