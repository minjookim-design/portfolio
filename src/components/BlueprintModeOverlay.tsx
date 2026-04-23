/**
 * Blueprint layout mode: grid overlay + `html.blueprint-enabled` outlines.
 * Fixed SYSTEM_CORE toggle matches home (`PillNav` / theme rail offset) on every route including `/deck`.
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

export function BlueprintModeOverlay() {
  const { pathname } = useLocation()
  const [on, setOn] = useState(readStoredOn)

  useEffect(() => {
    setOn(readStoredOn())
  }, [pathname])

  useEffect(() => {
    document.documentElement.classList.toggle('blueprint-enabled', on)
    return () => {
      document.documentElement.classList.remove('blueprint-enabled')
    }
  }, [on])

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

  const gridLayer =
    on && typeof document !== 'undefined'
      ? createPortal(<div className="blueprint-grid-overlay" aria-hidden />, document.body)
      : null

  /** Aligned with `ThemeToggle` (`PillNav`): same `top` / safe-area `right`; offset = 2×29px rail + frame + gap. */
  const toggleButton =
    typeof document !== 'undefined'
      ? createPortal(
          <button
            type="button"
            className="blueprint-mode-toggle fixed top-[max(1rem,env(safe-area-inset-top,0px))] right-[calc(max(1rem,env(safe-area-inset-right,0px))+61px+0.5rem)] z-[99999]"
            onClick={toggle}
            aria-pressed={on}
          >
            {on ? '[ SYSTEM_CORE: ON ]' : '[ SYSTEM_CORE: OFF ]'}
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
