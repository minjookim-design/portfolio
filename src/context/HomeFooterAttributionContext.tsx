import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useLocation } from 'react-router-dom'

type HomeFooterAttributionContextValue = {
  homeHovrAttributionReady: boolean
  setHomeHovrAttributionReady: (v: boolean) => void
}

const HomeFooterAttributionContext =
  createContext<HomeFooterAttributionContextValue | null>(null)

export function useHomeFooterAttribution() {
  return useContext(HomeFooterAttributionContext)
}

export function HomeFooterAttributionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { pathname } = useLocation()
  const [homeHovrAttributionReady, setHomeHovrAttributionReady] = useState(false)

  useEffect(() => {
    if (pathname !== '/' && pathname !== '') {
      setHomeHovrAttributionReady(false)
    }
  }, [pathname])

  const setHomeHovrAttributionReadyStable = useCallback(
    (v: boolean) => setHomeHovrAttributionReady(v),
    [],
  )

  const value = useMemo(
    () => ({
      homeHovrAttributionReady,
      setHomeHovrAttributionReady: setHomeHovrAttributionReadyStable,
    }),
    [homeHovrAttributionReady, setHomeHovrAttributionReadyStable],
  )

  return (
    <HomeFooterAttributionContext.Provider value={value}>
      {children}
    </HomeFooterAttributionContext.Provider>
  )
}
