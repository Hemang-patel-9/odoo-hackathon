import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './contexts/theme-context.tsx'
import { SocketProvider } from './contexts/socketContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
  </StrictMode>,
)
