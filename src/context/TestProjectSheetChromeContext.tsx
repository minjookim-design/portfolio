import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

type TestProjectSheetChromeValue = {
  /** `null` = no project sheet open; otherwise whether it has expanded to full page. */
  sheetFullPage: boolean | null
  setSheetFullPage: (value: boolean | null) => void
}

const TestProjectSheetChromeContext = createContext<TestProjectSheetChromeValue | null>(null)

export function TestProjectSheetChromeProvider({ children }: { children: ReactNode }) {
  const [sheetFullPage, setSheetFullPage] = useState<boolean | null>(null)
  const value = useMemo(() => ({ sheetFullPage, setSheetFullPage }), [sheetFullPage])
  return (
    <TestProjectSheetChromeContext.Provider value={value}>
      {children}
    </TestProjectSheetChromeContext.Provider>
  )
}

export function useTestProjectSheetChrome() {
  return useContext(TestProjectSheetChromeContext)
}
