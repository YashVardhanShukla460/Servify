/**
 * App.jsx — the root component of the React application
 *
 * This is the TOP of the component tree. Everything renders inside here.
 *
 * Structure:
 *   App
 *    └─ BrowserRouter (gives all children access to React Router)
 *        └─ AppRoutes (decides which page to show based on URL)
 *
 * Note: The Redux <Provider> is set in main.jsx (one level above App).
 * That wraps everything so ANY component can access the Redux store.
 */

import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
