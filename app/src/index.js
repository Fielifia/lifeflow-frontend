/**
 * Entry point of the React application. This file renders the main App component into the DOM and sets up performance reporting.
 * @module index
 */
import ReactDOM from 'react-dom/client'
import App from './App'
import { registerServiceWorker } from './registerServiceWorker'
import './features/dashboard/Dashboard.css'
import './features/workout/components/session/WorkoutSessionBar.css'
import reportWebVitals from './reportWebVitals'
import './shared/components/cards/WorkoutPreviewCard.css'
import './shared/components/ui/button/Button.css'
import './shared/components/ui/dropdown/Dropdown.css'
import './shared/components/ui/skeleton/Skeleton.css'
import './shared/components/ui/confirm/ConfirmDialog.css'
import './styles/App.css'

// --- Render the App component into the root DOM element ---
ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

registerServiceWorker()
