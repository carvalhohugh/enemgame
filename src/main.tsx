import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { StudyProgressProvider } from '@/context/StudyProgressContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StudyProgressProvider>
      <App />
    </StudyProgressProvider>
  </StrictMode>,
)
