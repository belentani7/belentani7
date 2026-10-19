"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const here=__dirname,sw=fs.readFileSync(path.join(here,"sw.js"),"utf8");
const html=fs.readFileSync(path.join(here,"studio.html"),"utf8");
const manifest=JSON.parse(fs.readFileSync(path.join(here,"manifest.webmanifest"),"utf8"));

test("installable Studio has scope-safe manifest and assets",()=>{
 assert.equal(manifest.start_url,"./studio.html");
 assert.equal(manifest.scope,"./");
 assert.equal(manifest.display,"standalone");
 assert.match(html,/rel="manifest"/);
 assert.match(html,/worker-src 'self'/);
 assert.match(html,/manifest-src 'self'/);
 const refs=["studio.js","studio-core.js","studio-i18n.js","audio-core.js","pdf-core.js"];
 for(const r of refs){
  assert.match(sw,new RegExp(r.replace(".","\\.")));
  assert.ok(fs.existsSync(path.join(here,r)),r);
 }
});

test("service worker intercepts only same-origin GET and does not cache user files",()=>{
 const events={};
 const registration={scope:"https://example.test/apps/living-machine/"};
 const self={registration,clients:{claim:async()=>{}},skipWaiting:async()=>{},addEventListener(name,fn){events[name]=fn;}};
 const mock={self,caches:{},URL,fetch:()=>Promise.reject(Error("Offline"))};
 vm.runInNewContext(sw,mock,{filename:"sw.js"});
 assert.equal(typeof events.fetch,"function");
 let captured;
 const intercept=(url,method="GET",destination="document")=>{
  captured=undefined;
  events.fetch({request:{url,method,destination},respondWith:p=>captured=p});
  return captured;
 };
 assert.equal(intercept("https://elsewhere.test/apps/living-machine/studio.html"),undefined);
 assert.equal(intercept("https://example.test/outside/studio.html"),undefined);
 assert.equal(intercept("https://example.test/apps/living-machine/private","POST"),undefined);
 assert.match(sw,/ASSET_PATHS\.has\(url\.pathname\)/);
 assert.match(sw,/cache\.put\(req,res\.clone\(\)\)/);
 assert.doesNotMatch(sw,/event\.request\.body/);
 assert.doesNotMatch(sw,/indexedDB|localStorage/);
});
