import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from 'react'

/** Keep in sync with the inline script in `index.html`. */
export const THEME_STORAGE_KEY = 'portfolio-theme'

function readInitialIsDark(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY)
    if (raw === 'dark') return true
    if (raw === 'light') return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  } catch {
    return false
  }
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
}

const PageThemeContext = createContext<PageThemeContextValue>({
  isDark: false,
  setIsDark: () => {},
  toggleTheme: () => {},
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

  return (
    <PageThemeContext.Provider value={{ isDark, setIsDark, toggleTheme }}>
      {children}
    </PageThemeContext.Provider>
  )
}
