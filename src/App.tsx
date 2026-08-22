import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
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
import { TestHovr } from './TestHovr'
import { TestPiik } from './TestPiik'
import { TestHome } from './TestHome'
import { HovrDeck } from './HovrDeck'
import { PiikDeck } from './PiikDeck'

/** Standalone `/projects/*` case studies: mobile only; desktop redirects before child mounts. */
function MobileOnlyCaseStudyRoute({ children }: { children: React.ReactNode }) {
  const allow = useRedirectHomeWhenDesktop({ blockChildMountOnDesktop: true })
  if (!allow) return null
  return <>{children}</>
}

function AppShell() {
  const { pathname } = useLocation()
  const isStandaloneDeck =
    pathname === '/hovr-deck' ||
    pathname.startsWith('/hovr-deck/') ||
    pathname === '/piik-deck' ||
    pathname.startsWith('/piik-deck/')
  const isHomeShellRoute =
    pathname === '/' ||
    pathname === '' ||
    pathname === '/hovr' ||
    pathname.startsWith('/hovr/') ||
    pathname === '/piik-ai' ||
    pathname.startsWith('/piik-ai/') ||
    pathname === '/test' ||
    pathname === '/test-home' ||
    pathname.startsWith('/test-home/') ||
    pathname === '/deck' ||
    isStandaloneDeck

  return (
    <HomeMobileProjectProvider>
      <div
        className="theme-surface-transition relative h-screen min-h-[100dvh] w-full min-w-0 max-w-[100vw] overflow-x-hidden overflow-y-hidden bg-[var(--color-bg-base,#faf7f0)]"
      >
        <MobileProjectBackButton />
        <MobileQuickNav />
        {!isStandaloneDeck && <ThemeToggle />}
        {!isHomeShellRoute && <FooterEmail variant="fixed" />}
        <Routes>
          <Route path="/" element={<HomePage />}>
            <Route path="hovr" element={<TestHovr />} />
            <Route path="piik-ai" element={<TestPiik />} />
          </Route>
          <Route path="test" element={<TestPage />} />
          <Route path="test-home" element={<TestHome />} />
          {/* Legacy sandbox URLs → promoted home */}
          <Route path="test-home-2" element={<Navigate to="/" replace />} />
          <Route path="test-home-2/hovr" element={<Navigate to="/hovr" replace />} />
          <Route path="test-home-2/piik-ai" element={<Navigate to="/piik-ai" replace />} />
          <Route path="test-hovr" element={<Navigate to="/hovr" replace />} />
          <Route path="test-piik-ai" element={<Navigate to="/piik-ai" replace />} />
          <Route path="deck" element={<Deck />} />
          <Route path="hovr-deck" element={<HovrDeck />} />
          <Route path="piik-deck" element={<PiikDeck />} />
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
