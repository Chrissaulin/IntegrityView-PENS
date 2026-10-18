import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App.jsx'
import { ReportFilterProvider } from './data/ReportFilterContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ReportFilterProvider><App /></ReportFilterProvider>
  </StrictMode>,
)
