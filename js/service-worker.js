const CACHE_NAME = 'capitalnotes-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/main.js',
    '/manifest.json',
    '/images/icon-192x192.png',
    '/images/icon-512x512.png',
    // Game files
    '/memory-match.html',
    '/snake-game.html',
    '/tetris.html',
    '/whack-a-mole.html',
    '/tic-tac-toe.html',
    '/rock-paper-scissors.html',
    '/simon-says.html',
    '/hangman.html',
    '/minesweeper.html',
    '/math-quiz.html',
    '/pattern-recognition.html',
    '/word-scramble.html',
    '/puzzle-slide.html',
    // JavaScript files
    '/js/snake-game.js',
    '/js/memory.js',
    '/js/memory-match.js',
    // CSS files
    '/css/memory.css',
    // Other pages
    '/about.html',
    '/contact.html',
    '/faq.html',
    '/privacy.html',
    '/terms.html',
    '/404.html'
];

// Install event - cache assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
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
                // Cache hit - return response
                if (response) {
                    return response;
                }

                // Clone the request
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(
                    response => {
                        // Check if valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
            .catch(() => {
                // If both cache and network fail, show offline page
                if (event.request.mode === 'navigate') {
                    return caches.match('/404.html');
                }
            })
    );
}); 