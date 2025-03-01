const CACHE_NAME = 'capitalnotes-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/games.html',
    '/memory-match.html',
    '/snake-game.html',
    '/math-quiz.html',
    '/word-scramble.html',
    '/about.html',
    '/contact.html',
    '/faq.html',
    '/privacy.html',
    '/terms.html',
    '/404.html',
    '/main.js',
    '/snake-game.js',
    '/memory-match.js',
    '/math-quiz.js',
    '/word-scramble.js',
    '/js/financial-data.js',
    '/styles.css',
    '/manifest.json',
    '/images/favicon-32x32.png',
    '/images/favicon-16x16.png',
    '/images/apple-touch-icon.png',
    '/images/logo.png'
];

// Install event - cache assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                return response || fetch(event.request)
                    .then(response => {
                        // Cache new resources
                        if (response.status === 200) {
                            const responseClone = response.clone();
                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(event.request, responseClone);
                                });
                        }
                        return response;
                    })
                    .catch(() => {
                        // Return custom offline page if network fails
                        if (event.request.mode === 'navigate') {
                            return caches.match('/404.html');
                        }
                    });
            })
    );
}); 