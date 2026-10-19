"use strict";
/* Static-only offline application shell. Never caches uploaded or generated user files. */
const CACHE="belentani-studio-v4";
const ASSETS=["./","./index.html","./studio.html","./studio.css","./studio.js","./studio-core.js","./studio-i18n.js","./audio-core.js","./pdf-core.js","./studio-icon.svg","./manifest.webmanifest"];
self.addEventListener("install",event=>{
 event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(ASSETS);await self.skipWaiting()})());
});
self.addEventListener("activate",event=>{
 event.waitUntil((async()=>{const all=await caches.keys();await Promise.all(all.filter(x=>x.startsWith("belentani-studio-")&&x!==CACHE).map(x=>caches.delete(x)));await self.clients.claim()})());
});
self.addEventListener("fetch",event=>{
 const req=event.request;if(req.method!=="GET")return;
 const url=new URL(req.url),scope=new URL(self.registration.scope);
 if(url.origin!==scope.origin || !url.pathname.startsWith(scope.pathname))return;
 if(req.destination==="document"){
   event.respondWith(fetch(req).catch(async()=>await caches.match(req)||await caches.match("./studio.html")));
   return;
 }
 event.respondWith(caches.match(req).then(cached=>cached||fetch(req)));
});
