import { StrictMode, type ComponentType } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { Cursor } from './components/DraftingCursor'
import { DraftingCursorProvider } from './context/DraftingCursorContext.tsx'
import { PageThemeProvider } from './context/PageThemeContext.tsx'
import { HomeFooterAttributionProvider } from './context/HomeFooterAttributionContext.tsx'

async function bootstrap() {
  const DevOverlay: ComponentType | undefined = import.meta.env.DEV
    ? (await import('./dev/AgentationOverlay.tsx')).default
    : undefined

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        {DevOverlay ? <DevOverlay /> : null}
        <DraftingCursorProvider>
          <PageThemeProvider>
            <HomeFooterAttributionProvider>
              <App />
            </HomeFooterAttributionProvider>
            {/*
              `display: contents` = no layout box / stacking wrapper in `#root`; cursor still portals to `body`.
              Avoid transform/opacity/filter/isolation on any real parent of `<Cursor />`.
            */}
            <div style={{ display: 'contents' }}>
              <Cursor />
            </div>
          </PageThemeProvider>
        </DraftingCursorProvider>
      </BrowserRouter>
    </StrictMode>,
  )
}

void bootstrap()
