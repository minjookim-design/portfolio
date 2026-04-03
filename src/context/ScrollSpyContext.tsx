import { createContext, useContext, useState, useRef, type ReactNode, type RefObject } from 'react'

interface ScrollSpyContextType {
  activeSection: string
  setActiveSection: (id: string) => void
  scrollContainerRef: RefObject<HTMLDivElement | null>
}

const ScrollSpyContext = createContext<ScrollSpyContextType>({
  activeSection: '',
  setActiveSection: () => {},
  scrollContainerRef: { current: null },
})

export function ScrollSpyProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState('')
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  return (
    <ScrollSpyContext.Provider value={{ activeSection, setActiveSection, scrollContainerRef }}>
      {children}
    </ScrollSpyContext.Provider>
  )
}

export function useScrollSpy() {
  return useContext(ScrollSpyContext)
}
