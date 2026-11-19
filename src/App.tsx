import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { ThemeToggle } from './components/PillNav'
import { MobileProjectBackButton } from './components/MobileProjectBackButton'
import { HomeMobileProjectProvider } from './context/HomeMobileProjectContext'
import { useRedirectHomeWhenDesktop } from './hooks/useRedirectHomeWhenDesktop'
import { HomePage } from './pages/HomePage'
import { HomePageClassic } from './pages/HomePageClassic'
import { TestHome3Hovr } from './pages/TestHome3Hovr'
import { TestHome3Piik } from './pages/TestHome3Piik'
import { TestHome3ArFitting } from './pages/TestHome3ArFitting'
import { TestHome3Jojo } from './pages/TestHome3Jojo'
import { isErdHomePathname } from './pages/testHome3/erdHomePaths'
import { TestPage } from './pages/TestPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { HovrProjectPage } from './pages/HovrProjectPage'
import { JojoProjectPage } from './pages/JojoProjectPage'
import { PiikProjectPage } from './pages/PiikProjectPage'
import { ArFittingProjectPage } from './pages/ArFittingProjectPage'
import { ProjectBmadPage } from './pages/ProjectBmadPage'
import { Deck } from './pages/Deck'
import { FooterEmail } from './components/FooterEmail'

import { TestPiik } from './TestPiik'
import { TestHome } from './TestHome'
import { TestHomeRamp } from './pages/TestHomeRamp'
import { Hovr } from './pages/Hovr'
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
  const isErdHome = isErdHomePathname(pathname)
  const isErdDeck = pathname === '/deck' || isStandaloneDeck
  const isRampTestHome =
    pathname === '/test-home-ramp' || pathname.startsWith('/test-home-ramp/')
  const isHomeShellRoute =
    pathname === '/' ||
    pathname === '' ||
    isErdHome ||
    pathname === '/test' ||
    pathname === '/test-home' ||
    pathname.startsWith('/test-home/') ||
    pathname === '/test-home-classic' ||
    pathname.startsWith('/test-home-classic/') ||
    isRampTestHome ||
    isErdDeck
  const isDocumentScrollHome =
    pathname === '/' ||
    pathname === '' ||
    pathname === '/more' ||
    pathname === '/more/' ||
    pathname === '/test-home-ramp'

  return (
    <HomeMobileProjectProvider>
      <div
        className={`theme-surface-transition relative w-full min-w-0 max-w-[100vw] ${
          isDocumentScrollHome
            ? 'min-h-[100dvh] overflow-x-clip overflow-y-visible'
            : 'h-screen min-h-[100dvh] overflow-x-hidden overflow-y-hidden'
        } ${
          isErdHome || isErdDeck || isRampTestHome
            ? 'bg-white'
            : 'bg-[var(--color-bg-base,#faf7f0)]'
        }`}
      >
        {!isErdHome && !isErdDeck && !isRampTestHome && <MobileProjectBackButton />}
        {!isStandaloneDeck && !isErdHome && !isErdDeck && !isRampTestHome && <ThemeToggle />}
        {!isHomeShellRoute && <FooterEmail variant="fixed" />}
        <Routes>
          <Route path="/" element={<HomePage />}>
            <Route path="hovr" element={<TestHome3Hovr />} />
            <Route path="piik-ai" element={<TestHome3Piik />} />
            <Route path="ar-fitting-room" element={<TestHome3ArFitting />} />
            <Route path="jojo" element={<TestHome3Jojo />} />
            <Route path="about" element={<Navigate to="/more" replace />} />
            <Route path="more">
              <Route path="hovr" element={<TestHome3Hovr />} />
              <Route path="piik-ai" element={<TestHome3Piik />} />
              <Route path="ar-fitting-room" element={<TestHome3ArFitting />} />
              <Route path="jojo" element={<TestHome3Jojo />} />
            </Route>
          </Route>
          <Route path="test" element={<TestPage />} />
          <Route path="test-home" element={<TestHome />} />
          <Route path="test-home-ramp" element={<TestHomeRamp />} />
          <Route path="test-home-classic" element={<HomePageClassic />}>
            <Route
              path="hovr"
              element={<Hovr backTo="/test-home-classic" backLabel="Back to home" />}
            />
            <Route path="piik-ai" element={<TestPiik />} />
          </Route>
          <Route path="test-home-3" element={<Navigate to="/" replace />} />
          <Route path="test-home-3/hovr" element={<Navigate to="/hovr" replace />} />
          <Route path="test-home-3/piik-ai" element={<Navigate to="/piik-ai" replace />} />
          <Route path="test-home-3/ar-fitting-room" element={<Navigate to="/ar-fitting-room" replace />} />
          <Route path="test-home-3/about" element={<Navigate to="/more" replace />} />
          <Route
            path="project/ar-fitting-room"
            element={<Navigate to="/ar-fitting-room" replace />}
          />
          {/* Legacy sandbox URLs → production home */}
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
