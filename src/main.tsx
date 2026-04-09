import { StrictMode, type ComponentType } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
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
        <PageThemeProvider>
          <HomeFooterAttributionProvider>
            <App />
          </HomeFooterAttributionProvider>
        </PageThemeProvider>
      </BrowserRouter>
    </StrictMode>,
  )
}

void bootstrap()
