import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import 'leaflet/dist/leaflet.css'
import './index.css'
import App from './App.tsx'
import amplifyConfig from './amplifyconfiguration'

Amplify.configure(amplifyConfig)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
