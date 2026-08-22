import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ClickRipple } from './components/ClickRipple'
import { Cursor } from './components/DraftingCursor'
import { DraftingCursorProvider } from './context/DraftingCursorContext.tsx'
import { PageThemeProvider } from './context/PageThemeContext.tsx'
import { HomeFooterAttributionProvider } from './context/HomeFooterAttributionContext.tsx'
import { BlueprintModeOverlay } from './components/BlueprintModeOverlay.tsx'
import { TestProjectSheetChromeProvider } from './context/TestProjectSheetChromeContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TestProjectSheetChromeProvider>
        <BlueprintModeOverlay />
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
              <ClickRipple />
              <Cursor />
            </div>
          </PageThemeProvider>
        </DraftingCursorProvider>
      </TestProjectSheetChromeProvider>
    </BrowserRouter>
  </StrictMode>,
)
