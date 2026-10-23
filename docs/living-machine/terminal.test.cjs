"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const html = fs.readFileSync(path.join(__dirname,"index.html"),"utf8");
const js = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(js,"Application script must exist");

function terminalHarness(){
  const start = js.indexOf("  function wireTerminal(win){");
  const end = js.indexOf("  function wireSystem(win){",start);
  assert.ok(start>=0 && end>start,"Terminal handler must be extractable");
  const source = js.slice(start,end);
  assert.doesNotThrow(()=>new vm.Script(source));
  const terminal={textContent:"",scrollHeight:120,scrollTop:0};
  const entry={value:"",listeners:{},addEventListener(event,callback){this.listeners[event]=callback;}};
  const downloads=[];const opens=[];const dialogs=[];
  const window={
    isSecureContext:true,
    crypto:{subtle:{}},
    get localStorage(){throw new Error("Storage disabled by user");},
    open(...args){opens.push(args);}
  };
  const document={querySelector(selector){assert.equal(selector,"#profile");return {scrollIntoView(){dialogs.push("projects")}}}};
  const $=(selector)=>({"#console":terminal,"#terminalInput":entry}[selector]);
  const downloadText=(...args)=>downloads.push(args);
  const openApp=(key)=>dialogs.push(key);
  const navigator={userAgent:"test browser"};
  const factory=new Function("$","navigator","window","document","downloadText","openApp",source+"\nreturn wireTerminal;");
  factory($,navigator,window,document,downloadText,openApp)({});
  const type=(value,key="Enter")=>{
    entry.value=value;
    entry.listeners.keydown({key,preventDefault(){}});
    return terminal.textContent;
  };
  return {terminal,entry,type,downloads,opens,dialogs};
}

test("English page defaults and translated hero do not mislabel whole document",()=>{
  assert.match(html,/<html lang="en">/);
  assert.match(js,/\$\("#hero-copy"\)\.lang=/);
  assert.doesNotMatch(js,/document\.documentElement\.lang\s*=\s*lang/);
});
test("interactive terminal answers documented commands and never executes system commands",()=>{
  const h=terminalHarness();
  assert.match(h.terminal.textContent,/No real OS shell/);
  assert.match(h.type("help"),/capabilities\.json/);
  assert.match(h.type("whoami"),/Pedro Belentani/);
  assert.match(h.type("cat capabilities.json"),/live_browser_tools/);
  assert.match(h.type("sh -c whoami"),/Unknown command/);
});
test("terminal status survives blocked local storage",()=>{
  const h=terminalHarness();
  const status=h.type("status");
  assert.match(status,/Local storage: false/);
  assert.match(status,/Web Crypto: true/);
});
test("terminal history navigation, safe links and JSON export work",()=>{
  const h=terminalHarness();
  h.type("open studio");
  assert.equal(h.opens[0][0],"./studio.html");
  assert.equal(h.opens[0][2],"noopener,noreferrer");
  h.type("export profile");
  assert.equal(h.downloads.length,1);
  assert.equal(h.downloads[0][1],"belentani-profile.json");
  assert.ok(JSON.parse(h.downloads[0][0]).capabilities.live_browser_tools.length>=6);
  h.type("anything","ArrowUp");
  assert.equal(h.entry.value,"export profile");
  h.type("anything","ArrowDown");
  assert.equal(h.entry.value,"");
});
test("README preview is static, not a false claim of public hosting",()=>{
  const readme=fs.readFileSync(path.resolve(__dirname,"../../README.md"),"utf8");
  assert.match(readme,/assets\/profile-terminal\.svg/);
  assert.match(readme,/repository currently includes broader private/);
});
