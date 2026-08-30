import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from 'react'

/** Keep in sync with the inline script in `index.html`. */
export const THEME_STORAGE_KEY = 'portfolio-theme'

/** Dark unless the user explicitly saved `light` in storage. */
export function readStoredThemePrefersDark(): boolean {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY)
    if (raw === 'light') return false
    return true
  } catch {
    return true
  }
}

function readInitialIsDark(): boolean {
  if (typeof window === 'undefined') return true
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
  isDark: true,
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
