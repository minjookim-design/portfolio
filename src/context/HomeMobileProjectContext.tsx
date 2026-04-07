import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useLocation } from 'react-router-dom'

type HomeMobileProjectContextValue = {
  detailOpen: boolean
  setDetailOpen: (open: boolean) => void
  closeDetail: () => void
}

const HomeMobileProjectContext = createContext<HomeMobileProjectContextValue | null>(null)

export function HomeMobileProjectProvider({ children }: { children: ReactNode }) {
  const [detailOpen, setDetailOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    if (pathname !== '/' && pathname !== '') {
      setDetailOpen(false)
    }
  }, [pathname])

  const closeDetail = useCallback(() => setDetailOpen(false), [])

  const value = useMemo(
    () => ({ detailOpen, setDetailOpen, closeDetail }),
    [detailOpen, closeDetail],
  )

  return (
    <HomeMobileProjectContext.Provider value={value}>
      {children}
    </HomeMobileProjectContext.Provider>
  )
}

export function useHomeMobileProject() {
  const ctx = useContext(HomeMobileProjectContext)
  if (!ctx) {
    throw new Error('useHomeMobileProject must be used within HomeMobileProjectProvider')
  }
  return ctx
}

export function useHomeMobileProjectOptional() {
  return useContext(HomeMobileProjectContext)
}
