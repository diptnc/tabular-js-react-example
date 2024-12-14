import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "tabulator-tables/dist/css/tabulator_simple.min.css"; // Import Tabulator CSS

import './index.css'
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
