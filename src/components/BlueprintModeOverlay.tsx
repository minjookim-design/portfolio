/**
 * Blueprint layout mode: grid overlay + `html.blueprint-enabled` outlines.
 * Fixed SYSTEM GRID toggle — hidden on ERD home and all deck routes.
 */
import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from 'react-router-dom'

const STORAGE_KEY = 'portfolio-blueprint-mode'

function readStoredOn(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

import { isErdHomePathname } from '../pages/testHome3/erdHomePaths'

function isDeckPathname(pathname: string): boolean {
  return (
    pathname === '/deck' ||
    pathname.startsWith('/deck/') ||
    pathname === '/hovr-deck' ||
    pathname.startsWith('/hovr-deck/') ||
    pathname === '/piik-deck' ||
    pathname.startsWith('/piik-deck/')
  )
}

export function BlueprintModeOverlay() {
  const { pathname } = useLocation()
  const [on, setOn] = useState(readStoredOn)
  const isRampTestHome =
    pathname === '/test-home-ramp' || pathname.startsWith('/test-home-ramp/')
  const hideChrome =
    isDeckPathname(pathname) || isErdHomePathname(pathname) || isRampTestHome

  useEffect(() => {
    setOn(readStoredOn())
  }, [pathname])

  useEffect(() => {
    const enabled = on && !hideChrome
    document.documentElement.classList.toggle('blueprint-enabled', enabled)
    return () => {
      document.documentElement.classList.remove('blueprint-enabled')
    }
  }, [on, hideChrome])

  const toggle = useCallback(() => {
    setOn((prev) => {
      const next = !prev
      try {
        if (next) sessionStorage.setItem(STORAGE_KEY, '1')
        else sessionStorage.removeItem(STORAGE_KEY)
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  if (hideChrome) return null

  const gridLayer =
    on && typeof document !== 'undefined'
      ? createPortal(<div className="blueprint-grid-overlay" aria-hidden />, document.body)
      : null

  /** Bottom-right corner; inset matches page margin (`--portfolio-chrome-top` on `/test-home-3`). */
  const toggleButton =
    typeof document !== 'undefined'
      ? createPortal(
          <button
            type="button"
            className="blueprint-mode-toggle fixed bottom-[max(var(--portfolio-chrome-top,1rem),env(safe-area-inset-bottom,0px))] right-[max(var(--portfolio-chrome-top,1rem),env(safe-area-inset-right,0px))] z-[99999]"
            onClick={toggle}
            aria-pressed={on}
          >
            {on ? '[ SYSTEM GRID: ON ]' : '[ SYSTEM GRID: OFF ]'}
          </button>,
          document.body,
        )
      : null

  return (
    <>
      {gridLayer}
      {toggleButton}
    </>
  )
}
