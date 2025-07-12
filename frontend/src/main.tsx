import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './contexts/theme-context.tsx'
import { SocketProvider } from './contexts/socketContext.tsx'

const user = localStorage.getItem("user");

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SocketProvider userId={user?.id ?? null}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </SocketProvider>
  </StrictMode>,
)
