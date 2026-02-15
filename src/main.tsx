import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { StudyProgressProvider } from '@/context/StudyProgressContext'
import { AuthProfileProvider } from '@/context/AuthProfileContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProfileProvider>
      <StudyProgressProvider>
        <App />
      </StudyProgressProvider>
    </AuthProfileProvider>
  </StrictMode>,
)
