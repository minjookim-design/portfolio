import { useLayoutEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

/** Viewports with width **greater than** this value are treated as desktop → redirect to `/`. */
export const MOBILE_ONLY_MAX_WIDTH_PX = 768

export type RedirectHomeWhenDesktopOptions = {
  maxWidthPx?: number
  /**
   * When true, returns `false` on desktop so route children are not mounted until the viewport
   * is confirmed mobile (avoids loading heavy case-study assets before redirect).
   */
  blockChildMountOnDesktop?: boolean
}

/**
 * Client-only guard for routes that should only be used on small viewports.
 * Redirects when `window.innerWidth > maxWidthPx` (default 768), on mount (useLayoutEffect) and on
 * every resize — **no debounce**, so the redirect snaps as soon as the breakpoint is crossed.
 */
export function useRedirectHomeWhenDesktop(
  options?: RedirectHomeWhenDesktopOptions,
): boolean {
  const maxWidthPx = options?.maxWidthPx ?? MOBILE_ONLY_MAX_WIDTH_PX
  const blockChildMountOnDesktop = options?.blockChildMountOnDesktop ?? false

  const navigate = useNavigate()
  const [allowChildren, setAllowChildren] = useState(() => {
    if (!blockChildMountOnDesktop) return true
    if (typeof window === 'undefined') return false
    return window.innerWidth <= maxWidthPx
  })

  useLayoutEffect(() => {
    const redirectIfDesktop = () => {
      if (typeof window === 'undefined') return
      if (window.innerWidth > maxWidthPx) {
        navigate('/', { replace: true })
        if (blockChildMountOnDesktop) setAllowChildren(false)
        return
      }
      if (blockChildMountOnDesktop) setAllowChildren(true)
    }

    redirectIfDesktop()

    window.addEventListener('resize', redirectIfDesktop, { passive: true })
    return () => {
      window.removeEventListener('resize', redirectIfDesktop)
    }
  }, [navigate, maxWidthPx, blockChildMountOnDesktop])

  return blockChildMountOnDesktop ? allowChildren : true
}
