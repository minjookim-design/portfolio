/**
 * Dev-only: full-site layout grid + dashed outlines (`html.blueprint-enabled`).
 * See `index.css` for paint rules.
 */
import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

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
  const [on, setOn] = useState(readStoredOn)

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
      ? createPortal(
          <div className="blueprint-grid-overlay" aria-hidden />,
          document.body,
        )
      : null

  return (
    <>
      {gridLayer}
      <button
        type="button"
        className="blueprint-mode-toggle"
        onClick={toggle}
        aria-pressed={on}
      >
        {on ? '[ SYSTEM_CORE: ON ]' : '[ SYSTEM_CORE: OFF ]'}
      </button>
    </>
  )
}
