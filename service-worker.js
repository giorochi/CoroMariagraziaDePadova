const CACHE = "coro-mdp-v1";


const FILES = [

"index.html",
"canto.html",
"style.css",
"app.js",
"canto.js",
"manifest.json"

];




self.addEventListener(
"install",
event=>{


event.waitUntil(

caches.open(CACHE)

.then(cache=>
cache.addAll(FILES)
)

);


});





self.addEventListener(
"fetch",
event=>{


event.respondWith(

caches.match(event.request)

.then(response=>{

return response ||
fetch(event.request);

})

);


});
