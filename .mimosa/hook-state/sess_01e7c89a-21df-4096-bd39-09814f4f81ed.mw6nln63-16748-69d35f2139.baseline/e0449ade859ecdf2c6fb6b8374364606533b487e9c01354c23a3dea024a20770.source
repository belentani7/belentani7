"use strict";
/* Standalone browser diagnostics, no network. */
(function(){
 const $=s=>document.querySelector(s);
 const run=$("#diagRun"),exportButton=$("#diagExport"),container=$("#checks"),summary=$("#summary");let last=null;
 async function check(name,fn,optional=false){
  try{const value=await fn();return {name,status:value?"pass":optional?"warn":"fail",note:value?"Available or verified.":"Unavailable or failed check."}}
  catch(e){return{name,status:optional?"warn":"fail",note:String(e?.message||e)}}
 }
 async function verify(){
  const core=window.StudioCore,pdf=window.PDFCore,audio=window.AudioCore,video=window.VideoSheet;
  const enc=new TextEncoder();
  return Promise.all([
   check("Captions: SRT ↔ VTT",()=>{const c=core.parseCaptions("1\n00:00:01,250 --> 00:00:03,000\nHola");return c.length===1&&core.parseCaptions(core.subtitleExport(c,"vtt")).length===1}),
   check("Script → timed subtitle draft",()=>core.draftTimedCaptions("Hola. Estás comprobando este generador.").length>0),
   check("ZIP archive structure",async()=>{const zip=core.zipFiles([{name:"test.txt",data:enc.encode("hello")}]);return new DataView(await zip.arrayBuffer()).getUint32(0,true)===0x04034b50}),
   check("PCM WAV encoder",async()=>{const b=audio.wavFromChannels([new Float32Array([0,.5,-.5])],8000);return new DataView(await b.arrayBuffer()).getUint32(4,true)===42}),
   check("PDF engine",async()=>{const jpg=new Uint8Array([255,216,255,224,0,16,74,70,73,70,0,1,0,1,0,0,255,217]);const b=pdf.imagePDF([{data:jpg,width:10,height:10}]);return new TextDecoder().decode(new Uint8Array(await b.arrayBuffer()).slice(0,8)).startsWith("%PDF-1.4")}),
   check("Video frame sampling",()=>video.sampleTimes(60,9).length===9),
   check("Browser JPEG encoder",()=>{const c=document.createElement("canvas");c.width=c.height=2;return c.toDataURL("image/jpeg").startsWith("data:image/jpeg")}),
   check("Browser WebP encoder",()=>{const c=document.createElement("canvas");c.width=c.height=2;return c.toDataURL("image/webp").startsWith("data:image/webp")},true),
   check("Web Audio support",()=>!!(window.AudioContext||window.webkitAudioContext),true),
   check("MediaRecorder",()=>!!window.MediaRecorder,true),
   check("Web Crypto SHA-256",()=>!!window.crypto?.subtle,true),
   check("Offline service worker",()=>!!navigator.serviceWorker,true)
  ]);
 }
 function show(items){
  container.replaceChildren();
  for(const item of items){const row=document.createElement("div");row.className="check "+item.status;
   const content=document.createElement("div"),title=document.createElement("strong"),note=document.createElement("small"),state=document.createElement("span");
   title.textContent=item.name;note.textContent=item.note;state.className="state";state.textContent=item.status.toUpperCase();
   content.append(title,note);row.append(content,state);container.append(row);
  }
 }
 run.addEventListener("click",async()=>{
  run.disabled=true;exportButton.disabled=true;summary.textContent="Running local checks…";
  try{const data=await verify();show(data);
   const passed=data.filter(x=>x.status==="pass").length,failed=data.filter(x=>x.status==="fail").length,warn=data.filter(x=>x.status==="warn").length;
   last={createdAt:new Date().toISOString(),application:"BELENTANI Studio",results:data,summary:{passed,failed,optionalUnavailable:warn}};
   summary.textContent=passed+" passed · "+failed+" required checks failed · "+warn+" optional capabilities unavailable";
   exportButton.disabled=false;
  }catch(e){summary.textContent="Unable to complete: "+String(e?.message||e)}
  finally{run.disabled=false}
 });
 exportButton.addEventListener("click",()=>{if(!last)return;const blob=new Blob([JSON.stringify(last,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="belentani-local-diagnostics.json";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2500)});
})();
