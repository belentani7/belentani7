"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const engine=require("./video-sheet.js");
const dir=__dirname;
const page=fs.readFileSync(path.join(dir,"studio.html"),"utf8");
const app=fs.readFileSync(path.join(dir,"studio.js"),"utf8");
const translations=fs.readFileSync(path.join(dir,"studio-i18n.js"),"utf8");

test("Contact sheet engine parses and has bounded deterministic frame times",()=>{
  const js=fs.readFileSync(path.join(dir,"video-sheet.js"),"utf8");
  assert.doesNotThrow(()=>new vm.Script(js));
  for(const count of [4,9,16]){
    const times=engine.sampleTimes(120,count);
    assert.equal(times.length,count);
    assert.ok(times.every((v,i)=>v>0&&v<120&&(i===0||v>times[i-1])));
    assert.deepEqual(times,engine.sampleTimes(120,count));
  }
});
test("Contact sheet timing rejects unknown duration, count and infinite video",()=>{
  assert.throws(()=>engine.sampleTimes(0,9));
  assert.throws(()=>engine.sampleTimes(Infinity,9));
  assert.throws(()=>engine.sampleTimes(25*3600,9));
  assert.throws(()=>engine.sampleTimes(60,10));
  assert.throws(()=>engine.clockLabel(-1));
  assert.equal(engine.clockLabel(61),"01:01");
  assert.equal(engine.clockLabel(3723),"01:02:03");
});
test("Eighth tab, file input, output result, no remote video upload",()=>{
  assert.match(page,/data-tab="video"/);
  assert.match(page,/id="tab-video"/);
  assert.match(page,/id="videoSheetFile"/);
  assert.match(page,/id="videoSheetGo"/);
  assert.match(page,/src="\.\/video-sheet\.js"/);
  assert.match(app,/VideoSheet\.generateContactSheet/);
  assert.doesNotMatch(app,/\bfetch\s*\(/);
});
test("Video application is localized in English, Spanish and Portuguese",()=>{
  assert.match(translations,/navVideo:"Video contact sheet"/);
  assert.match(translations,/navVideo:"Hoja de contactos de vídeo"/);
  assert.match(translations,/navVideo:"Folha de contatos de vídeo"/);
  assert.match(translations,/videoDesc:/);
  assert.match(page,/data-i18n="videoTitle"/);
  assert.match(page,/data-i18n="videoGo"/);
});
