const CACHE_NAME = 'lifeflow-v2'

const urlsToCache = [
  '/',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (
            event.request.method === 'GET' &&
            networkResponse.status === 200
          ) {
            const responseClone = networkResponse.clone()

            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone)
            })
          }

          return networkResponse
        })
        .catch(() => {
          return caches.match('/')
        })
    })
  )
})
