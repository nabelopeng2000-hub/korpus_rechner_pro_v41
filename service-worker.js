const CACHE="korpus-v41";
const ASSETS=["./","./index.html","./manifest.webmanifest"];
self.addEventListener("install",e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate",e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))));
  self.clients.claim();
});
self.addEventListener("fetch",e=>{
  e.respondWith(
    caches.match(e.request).then(r=>r||fetch(e.request).then(n=>{
      if(e.request.method==="GET"&&e.request.url.startsWith(self.location.origin)){
        const c=n.clone();
        caches.open(CACHE).then(cc=>cc.put(e.request,c));
      }
      return n;
    }).catch(()=>caches.match("./index.html")))
  );
});
