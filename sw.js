const VERSION = "3_5_20:23_00";
const CACHE_NAME = "samclercky_startpage" + VERSION;

self.addEventListener("install", (evt)  => {
    // TODO precache
});


self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request)
          .then(function(response) {
            // Cache hit - return response
            if (response) {
              return response;
            }
    
            return fetch(event.request).then(
              function(response) {
                // Check if we received a valid response
                if(!response || response.status !== 200 || response.type !== 'basic') {
                  return response;
                }
    
                // IMPORTANT: Clone the response. A response is a stream
                // and because we want the browser to consume the response
                // as well as the cache consuming the response, we need
                // to clone it so we have two streams.
                var responseToCache = response.clone();
    
                caches.open(CACHE_NAME)
                  .then(function(cache) {
                    cache.put(event.request, responseToCache);
                  });
    
                return response;
              }
            );
          })
        );
    
})