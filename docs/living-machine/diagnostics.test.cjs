"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const root=__dirname;
const html=fs.readFileSync(path.join(root,"diagnostics.html"),"utf8");
const js=fs.readFileSync(path.join(root,"diagnostics.js"),"utf8");
const serviceWorker=fs.readFileSync(path.join(root,"sw.js"),"utf8");
test("Browser diagnostics compile and expose no network data transfer",()=>{
 assert.doesNotThrow(()=>new vm.Script(js));
 assert.doesNotMatch(js,/\bfetch\s*\(/);
 assert.doesNotMatch(js,/XMLHttpRequest|sendBeacon|WebSocket/);
 assert.match(html,/connect-src 'none'/);
});
test("Diagnostics contain actual engine checks and safe exports",()=>{
 for(const id of ["diagRun","diagExport","checks","summary"])assert.ok(html.includes('id="'+id+'"'));
 for(const symbol of ["parseCaptions","draftTimedCaptions","zipFiles","wavFromChannels","imagePDF","sampleTimes"])assert.ok(js.includes(symbol));
 assert.match(js,/textContent=/);
 assert.doesNotMatch(js,/innerHTML\s*=/);
});
test("PWA cache includes diagnostics and eighth utility",()=>{
 for(const p of ["./video-sheet.js","./diagnostics.html","./diagnostics.js"])assert.ok(serviceWorker.includes(p));
 assert.match(serviceWorker,/belentani-studio-v7/);
});
