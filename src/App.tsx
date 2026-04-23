import { Routes, Route, useLocation } from 'react-router-dom'
import { ThemeToggle } from './components/PillNav'
import { MobileProjectBackButton } from './components/MobileProjectBackButton'
import { MobileQuickNav } from './components/MobileQuickNav'
import { HomeMobileProjectProvider } from './context/HomeMobileProjectContext'
import { useRedirectHomeWhenDesktop } from './hooks/useRedirectHomeWhenDesktop'
import { HomePage } from './pages/HomePage'
import { TestPage } from './pages/TestPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { HovrProjectPage } from './pages/HovrProjectPage'
import { JojoProjectPage } from './pages/JojoProjectPage'
import { PiikProjectPage } from './pages/PiikProjectPage'
import { ArFittingProjectPage } from './pages/ArFittingProjectPage'
import { ProjectBmadPage } from './pages/ProjectBmadPage'
import { Deck } from './pages/Deck'
import { FooterEmail } from './components/FooterEmail'

/** Standalone `/projects/*` case studies: mobile only; desktop redirects before child mounts. */
function MobileOnlyCaseStudyRoute({ children }: { children: React.ReactNode }) {
  const allow = useRedirectHomeWhenDesktop({ blockChildMountOnDesktop: true })
  if (!allow) return null
  return <>{children}</>
}

function AppShell() {
  const { pathname } = useLocation()
  const isHomeShellRoute =
    pathname === '/' || pathname === '' || pathname === '/test' || pathname === '/deck'

  return (
    <HomeMobileProjectProvider>
      <div
        className="theme-surface-transition relative h-screen min-h-[100dvh] w-full min-w-0 max-w-[100vw] overflow-x-hidden overflow-y-hidden bg-[var(--color-bg-base,#faf7f0)]"
      >
        <MobileProjectBackButton />
        <MobileQuickNav />
        <ThemeToggle />
        {!isHomeShellRoute && <FooterEmail variant="fixed" />}
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="test" element={<TestPage />} />
          <Route path="deck" element={<Deck />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route
            path="projects/bmad"
            element={
              <MobileOnlyCaseStudyRoute>
                <ProjectBmadPage />
              </MobileOnlyCaseStudyRoute>
            }
          />
          <Route
            path="projects/hovr"
            element={
              <MobileOnlyCaseStudyRoute>
                <HovrProjectPage />
              </MobileOnlyCaseStudyRoute>
            }
          />
          <Route
            path="projects/jojo"
            element={
              <MobileOnlyCaseStudyRoute>
                <JojoProjectPage />
              </MobileOnlyCaseStudyRoute>
            }
          />
          <Route
            path="projects/piik"
            element={
              <MobileOnlyCaseStudyRoute>
                <PiikProjectPage />
              </MobileOnlyCaseStudyRoute>
            }
          />
          <Route
            path="projects/ar-fitting-room"
            element={
              <MobileOnlyCaseStudyRoute>
                <ArFittingProjectPage />
              </MobileOnlyCaseStudyRoute>
            }
          />
        </Routes>
      </div>
    </HomeMobileProjectProvider>
  )
}

export default function App() {
  return <AppShell />
}
