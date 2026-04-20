import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { usePageTheme } from '../context/PageThemeContext'
import { useHomeMobileProjectOptional } from '../context/HomeMobileProjectContext'

const MENU_PROJECTS = [
  { id: 'hovr', label: 'HOVR', href: '/projects/hovr' },
  { id: 'piikai', label: 'Piik AI', href: '/projects/piik' },
  { id: 'ar-fitting-room', label: 'AR Fitting Room', href: '/projects/ar-fitting-room' },
] as const

function FolderGlyph({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4 20C3.45 20 2.97933 19.8043 2.588 19.413C2.19667 19.0217 2.00067 18.5507 2 18V6C2 5.45 2.196 4.97933 2.588 4.588C2.98 4.19667 3.45067 4.00067 4 4H10L12 6H20C20.55 6 21.021 6.196 21.413 6.588C21.805 6.98 22.0007 7.45067 22 8V18C22 18.55 21.8043 19.021 21.413 19.413C21.0217 19.805 20.5507 20.0007 20 20H4ZM4 18H20V8H11.175L9.175 6H4V18Z"
        fill="currentColor"
      />
    </svg>
  )
}

/**
 * Mobile-only (`md:hidden`): bottom-right FAB opens an animated projects menu.
 * Shown on home, `/projects` index, and individual `/projects/*` case studies (with back button).
 */
export function MobileQuickNav() {
  const { pathname } = useLocation()
  const { isDark } = usePageTheme()
  const homeMobile = useHomeMobileProjectOptional()
  const [open, setOpen] = useState(false)

  const isProjectDetail = /^\/projects\/(hovr|piik|jojo|ar-fitting-room|bmad)(\/.*)?$/.test(pathname)
  const onProjects = pathname === '/projects' || pathname === '/projects/'
  const onHome = pathname === '/' || pathname === ''

  const showFab = onHome || onProjects || isProjectDetail

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    close()
  }, [pathname, close])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  if (!showFab) return null

  if (onHome && homeMobile?.detailOpen) return null

  const glass = isDark ? 'bg-black/55 text-white' : 'bg-white/70 text-black'
  const menuGlass = isDark ? 'bg-black/60 text-white' : 'bg-white/80 text-black'
  /** Mobile menu rows only (`md:hidden` shell): invert surface on hover. */
  const rowHover = isDark ? 'hover:bg-white hover:text-black' : 'hover:bg-black hover:text-white'

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 z-[997] bg-black/25"
            onPointerDown={close}
          />
        )}
      </AnimatePresence>

      <div
        className="md:hidden pointer-events-none fixed bottom-[max(1rem,env(safe-area-inset-bottom,0px))] right-4 z-[998] flex flex-col-reverse items-end gap-2"
      >
        <button
          type="button"
          aria-label={open ? 'Close projects menu' : 'Open projects menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={`pointer-events-auto flex h-14 w-14 shrink-0 items-center justify-center rounded-full shadow-lg backdrop-blur-xl transition-transform active:scale-95 ${glass}`}
        >
          <FolderGlyph className="opacity-90" />
        </button>

        <AnimatePresence>
          {open && (
            <motion.nav
              role="menu"
              aria-label="Projects"
              initial={{ opacity: 0, y: 14, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 420, damping: 30 }}
              className={`pointer-events-auto flex min-w-[200px] max-w-[min(calc(100vw-2rem),280px)] flex-col gap-2 overflow-hidden rounded-none p-2 shadow-xl backdrop-blur-xl ${menuGlass}`}
            >
              {MENU_PROJECTS.map((p) => (
                <Link
                  key={p.id}
                  role="menuitem"
                  to={p.href}
                  onClick={close}
                  className={`box-border flex items-center gap-3 rounded-none px-4 py-2.5 font-mono text-[13px] font-semibold text-inherit visited:text-inherit ${rowHover}`}
                >
                  <FolderGlyph className="h-[18px] w-[18px] shrink-0 opacity-90" />
                  {p.label}
                </Link>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
