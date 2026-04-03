import { createContext, useContext, useState } from 'react'

interface PageThemeContextValue {
  isDark: boolean
  setIsDark: (v: boolean) => void
}

const PageThemeContext = createContext<PageThemeContextValue>({
  isDark: false,
  setIsDark: () => {},
})

export const usePageTheme = () => useContext(PageThemeContext)

export function PageThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false)
  return (
    <PageThemeContext.Provider value={{ isDark, setIsDark }}>
      {children}
    </PageThemeContext.Provider>
  )
}
