import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from 'react'

/** Keep in sync with the inline script in `index.html`. */
export const THEME_STORAGE_KEY = 'portfolio-theme'

export const SYSTEM_DARK_QUERY = '(prefers-color-scheme: dark)'

function readStoredThemeOverride(): 'light' | 'dark' | null {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY)
    if (raw === 'light' || raw === 'dark') return raw
    return null
  } catch {
    return null
  }
}

export function readSystemPrefersDark(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia(SYSTEM_DARK_QUERY).matches
}

/** Saved override wins; otherwise follow OS light/dark preference. */
export function resolveThemeIsDark(): boolean {
  const override = readStoredThemeOverride()
  if (override === 'light') return false
  if (override === 'dark') return true
  return readSystemPrefersDark()
}

/** @deprecated Prefer `resolveThemeIsDark` — kept for existing call sites. */
export function readStoredThemePrefersDark(): boolean {
  return resolveThemeIsDark()
}

function readInitialIsDark(): boolean {
  return resolveThemeIsDark()
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

  // When no saved override, track OS theme changes.
  useLayoutEffect(() => {
    const mq = window.matchMedia(SYSTEM_DARK_QUERY)
    const syncWithSystem = () => {
      if (readStoredThemeOverride() != null) return
      setIsDarkState(mq.matches)
    }
    syncWithSystem()
    mq.addEventListener('change', syncWithSystem)
    return () => mq.removeEventListener('change', syncWithSystem)
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
