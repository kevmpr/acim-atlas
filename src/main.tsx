import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { AtlasTutorialOverlay } from './components/tutorial/AtlasTutorialOverlay'

// Apply theme from URL param or localStorage
const params = new URLSearchParams(window.location.search)
const urlTheme = params.get('theme')
const savedTheme = localStorage.getItem('theme')
const theme = urlTheme ?? savedTheme ?? 'light'
if (theme === 'dark') document.documentElement.classList.add('dark')
else document.documentElement.classList.remove('dark')
if (urlTheme) localStorage.setItem('theme', urlTheme)

// Listen for theme changes from Shell
window.addEventListener('message', (e) => {
  if (e.data?.type === 'ACIM_THEME') {
    const t = e.data.theme as string
    if (t === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', t)
  }
})

const token = params.get('token')
const tenantId = params.get('tenantId')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App token={token} tenantId={tenantId} />
    <AtlasTutorialOverlay />
  </StrictMode>
)
