"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");

const root=__dirname;
const source=fs.readFileSync(path.join(root,"studio-i18n.js"),"utf8");
const html=fs.readFileSync(path.join(root,"studio.html"),"utf8");

test("Localization source compiles and is served as a local script",()=>{
  assert.doesNotThrow(()=>new vm.Script(source));
  assert.match(html,/studio-i18n\.js/);
  assert.match(html,/id="interfaceLanguage"/);
  for(const lang of ["en","es","pt"])assert.match(html,new RegExp('<option value="'+lang+'">'));
});

test("Studio translates visible headings and updates language without a server",()=>{
  const keys=["headline","navBatch","navPDF","navAudio","intro","sevenTools"];
  const nodes=keys.map(key=>({
    key,textContent:"",innerHTML:"",
    getAttribute(name){return name==="data-i18n"?this.key:null}
  }));
  const callbacks={};
  const select={value:"",addEventListener(type,fn){callbacks[type]=fn}};
  const saved={};
  const document={
    documentElement:{lang:""},
    title:"",
    getElementById(id){return id==="interfaceLanguage"?select:null},
    querySelectorAll(query){return query==="[data-i18n]"?nodes:[]}
  };
  const context={
    document,window:{},navigator:{language:"es-ES"},location:{search:"?lang=es"},
    localStorage:{getItem:k=>saved[k]||null,setItem:(k,v)=>saved[k]=v},
    URLSearchParams
  };
  vm.runInNewContext(source,context);
  assert.equal(document.documentElement.lang,"es");
  assert.match(nodes.find(n=>n.key==="headline").innerHTML,/merecen existir/);
  assert.match(nodes.find(n=>n.key==="navPDF").textContent,/PDF/);
  assert.equal(saved["belentani-studio-lang"],"es");
  callbacks.change({target:{value:"pt"}});
  assert.equal(document.documentElement.lang,"pt");
  assert.match(nodes.find(n=>n.key==="intro").textContent,/navegador/);
  assert.equal(saved["belentani-studio-lang"],"pt");
  callbacks.change({target:{value:"en"}});
  assert.equal(document.documentElement.lang,"en");
  assert.match(nodes.find(n=>n.key==="headline").innerHTML,/earn their place/);
});

test("Interface includes reduced-motion support and offline localization",()=>{
  const css=fs.readFileSync(path.join(root,"studio.css"),"utf8");
  assert.match(css,/prefers-reduced-motion/);
  assert.doesNotMatch(source,/\bfetch\s*\(/);
  assert.doesNotMatch(source,/https?:\/\//);
  assert.match(html,/connect-src 'none'/);
});
