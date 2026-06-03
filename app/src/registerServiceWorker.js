/**
 * Registers a service worker to enable offline capabilities and improve performance.
 * The service worker is registered when the window loads, and logs the registration status to the console.
 * If the browser does not support service workers, this function does nothing.
 * @module registerServiceWorker
 */
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration)
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
        })
    })
  }
}
