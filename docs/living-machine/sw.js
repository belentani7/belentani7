"use strict";
/* BELENTANI STUDIO — static application shell only.
 * Network-first updates; cache only explicitly listed same-origin application resources.
 * Never stores the files users load, convert, record or export.
 */
const CACHE="belentani-studio-v5";
const ASSETS=["./","./index.html","./studio.html","./studio.css","./studio.js","./studio-core.js","./studio-i18n.js","./audio-core.js","./pdf-core.js","./studio-icon.svg","./manifest.webmanifest"];
const ASSET_PATHS=new Set(ASSETS.map(x=>new URL(x,self.registration.scope).pathname));
self.addEventListener("install",event=>{
 event.waitUntil((async()=>{
   const cache=await caches.open(CACHE);
   await cache.addAll(ASSETS);
   await self.skipWaiting();
 })());
});
self.addEventListener("activate",event=>{
 event.waitUntil((async()=>{
   const previous=await caches.keys();
   await Promise.all(previous.filter(x=>x.startsWith("belentani-studio-")&&x!==CACHE).map(x=>caches.delete(x)));
   await self.clients.claim();
 })());
});
self.addEventListener("fetch",event=>{
 const req=event.request;
 if(req.method!=="GET")return;
 const url=new URL(req.url),scope=new URL(self.registration.scope);
 if(url.origin!==scope.origin || !ASSET_PATHS.has(url.pathname))return;
 event.respondWith((async()=>{
   try{
     const res=await fetch(req);
     if(res&&res.ok){
       const cache=await caches.open(CACHE);
       await cache.put(req,res.clone());
     }
     return res;
   }catch(error){
     const cached=await caches.match(req);
     if(cached)return cached;
     if(req.destination==="document"){
       const fallback=await caches.match("./studio.html");
       if(fallback)return fallback;
     }
     throw error;
   }
 })());
});
