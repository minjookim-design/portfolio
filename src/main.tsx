import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Agentation } from 'agentation'
import './index.css'
import App from './App.tsx'
import { PageThemeProvider } from './context/PageThemeContext.tsx'
import { HomeFooterAttributionProvider } from './context/HomeFooterAttributionContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Agentation />
      <PageThemeProvider>
        <HomeFooterAttributionProvider>
          <App />
        </HomeFooterAttributionProvider>
      </PageThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
