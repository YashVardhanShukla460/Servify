/**
 * main.jsx — the JavaScript entry point
 *
 * This is the very first file that runs.
 *
 * It does three things:
 * 1. Imports global CSS (Tailwind directives)
 * 2. Wraps App in the Redux <Provider> so all components can access the store
 * 3. Mounts the React app into the <div id="root"> in index.html
 *
 * WHAT is <Provider>?
 *   Provider makes the Redux store available to every component in the tree.
 *   Without it, useSelector and useDispatch would not work.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './redux/store'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Provider wraps everything — any component can now use Redux */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
