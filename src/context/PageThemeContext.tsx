import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from 'react'

/** Keep in sync with the inline script in `index.html`. */
export const THEME_STORAGE_KEY = 'portfolio-theme'

/** Matches `useIsNarrow(768)` / Tailwind `md` breakpoint (mobile = width ≤ 768px). */
export const MOBILE_THEME_QUERY = '(max-width: 768px)'

function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia(MOBILE_THEME_QUERY).matches
}

/** User explicitly chose dark in storage; otherwise light (no system preference). */
export function readStoredThemePrefersDark(): boolean {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === 'dark'
  } catch {
    return false
  }
}

function readInitialIsDark(): boolean {
  if (typeof window === 'undefined') return false
  // Mobile: always light on load (ignore saved dark).
  if (isMobileViewport()) return false
  return readStoredThemePrefersDark()
}

export function applyDocumentTheme(isDark: boolean) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.classList.toggle('dark', isDark)
  root.dataset.theme = isDark ? 'dark' : 'light'
  root.style.colorScheme = isDark ? 'dark' : 'light'
  /* Backgrounds come from CSS (critical + index.css) — avoids transition flash vs inline swaps */
  root.style.backgroundColor = ''
  document.body.style.backgroundColor = ''
}

interface PageThemeContextValue {
  isDark: boolean
  /** Session / route sync — does not write localStorage (avoids clobbering user choice). */
  setIsDark: (v: boolean) => void
  /** User toggle — flips theme and persists. */
  toggleTheme: () => void
  /** Explicit light / dark — updates theme and persists (e.g. segmented control). */
  setThemePersisted: (next: boolean) => void
}

const PageThemeContext = createContext<PageThemeContextValue>({
  isDark: false,
  setIsDark: () => {},
  toggleTheme: () => {},
  setThemePersisted: () => {},
})

export const usePageTheme = () => useContext(PageThemeContext)

export function PageThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDarkState] = useState(readInitialIsDark)

  useLayoutEffect(() => {
    applyDocumentTheme(isDark)
  }, [isDark])

  // Keep mobile ≤768px in light mode; restore desktop preference when widening (storage only).
  useLayoutEffect(() => {
    const mq = window.matchMedia(MOBILE_THEME_QUERY)
    const syncViewportTheme = () => {
      if (mq.matches) {
        setIsDarkState(false)
      } else {
        setIsDarkState(readStoredThemePrefersDark())
      }
    }
    syncViewportTheme()
    mq.addEventListener('change', syncViewportTheme)
    return () => mq.removeEventListener('change', syncViewportTheme)
  }, [])

  const setIsDark = useCallback((v: boolean) => {
    setIsDarkState(v)
  }, [])

  const toggleTheme = useCallback(() => {
    setIsDarkState((prev) => {
      const next = !prev
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light')
      } catch {
        /* ignore quota / private mode */
      }
      return next
    })
  }, [])

  const setThemePersisted = useCallback((next: boolean) => {
    setIsDarkState(next)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light')
    } catch {
      /* ignore quota / private mode */
    }
  }, [])

  return (
    <PageThemeContext.Provider value={{ isDark, setIsDark, toggleTheme, setThemePersisted }}>
      {children}
    </PageThemeContext.Provider>
  )
}
