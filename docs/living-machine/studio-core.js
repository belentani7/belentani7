/* BELENTANI Studio Core — offline, zero dependencies, browser + Node */
(function(root,factory){const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;else root.StudioCore=api;})(typeof globalThis==="object"?globalThis:this,function(){
"use strict";
function utf8(v){return new TextEncoder().encode(String(v));}
function safeFilename(v){return (String(v||"file").normalize("NFKC").replace(/[\u0000-\u001f\u007f\/\\:*?"<>|]+/g,"_").replace(/^\.+|\.+$/g,"").trim().slice(0,100)||"file");}
function escapeHTML(v){return String(v==null?"":v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");}
const crctable=new Uint32Array(256);
for(let i=0;i<256;i++){let c=i;for(let j=0;j<8;j++)c=c&1?(0xedb88320^(c>>>1)):(c>>>1);crctable[i]=c>>>0;}
function crc32(bytes){if(!(bytes instanceof Uint8Array))throw TypeError("Expected Uint8Array");let c=0xffffffff;for(let i=0;i<bytes.length;i++)c=crctable[(c^bytes[i])&255]^(c>>>8);return(c^0xffffffff)>>>0;}
function zipFiles(entries){
 if(!Array.isArray(entries)||!entries.length||entries.length>60)throw Error("ZIP requires 1–60 files.");
 const parts=[],directory=[];let offset=0,centralSize=0;
 const w16=(dv,p,v)=>dv.setUint16(p,v,true),w32=(dv,p,v)=>dv.setUint32(p,v>>>0,true);
 for(const item of entries){
  const name=utf8(safeFilename(item.name)),bytes=item.data;
  if(!(bytes instanceof Uint8Array)||bytes.length>100000000||name.length>65535)throw Error("Invalid or oversized ZIP file.");
  const crc=crc32(bytes),local=new Uint8Array(30+name.length),dv=new DataView(local.buffer);
  w32(dv,0,0x04034b50);w16(dv,4,20);w16(dv,6,0x0800);w32(dv,14,crc);w32(dv,18,bytes.length);w32(dv,22,bytes.length);w16(dv,26,name.length);local.set(name,30);
  const cd=new Uint8Array(46+name.length),cv=new DataView(cd.buffer);
  w32(cv,0,0x02014b50);w16(cv,4,20);w16(cv,6,20);w16(cv,8,0x0800);w32(cv,16,crc);w32(cv,20,bytes.length);w32(cv,24,bytes.length);w16(cv,28,name.length);w32(cv,42,offset);cd.set(name,46);
  parts.push(local,bytes);directory.push(cd);offset+=local.length+bytes.length;centralSize+=cd.length;
  if(offset+centralSize>200000000)throw Error("ZIP maximum 200MB.");
 }
 const end=new Uint8Array(22),dv=new DataView(end.buffer);
 w32(dv,0,0x06054b50);w16(dv,8,entries.length);w16(dv,10,entries.length);w32(dv,12,centralSize);w32(dv,16,offset);
 return new Blob([...parts,...directory,end],{type:"application/zip"});
}
function timestamp(v){const m=String(v).trim().replace(",",".").match(/^(?:(\d+):)?(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?$/);if(!m)throw Error("Invalid timestamp "+v);const h=+(m[1]||0),mm=+m[2],s=+m[3];if(mm>59||s>59)throw Error("Invalid time range");return h*3600000+mm*60000+s*1000+ +((m[4]||"0").padEnd(3,"0"));}
function timeString(n,comma){n=Math.max(0,Math.round(n));const pad=(v,l=2)=>String(v).padStart(l,"0");return pad(Math.floor(n/3600000))+":"+pad(Math.floor(n/60000)%60)+":"+pad(Math.floor(n/1000)%60)+(comma?",":".")+pad(n%1000,3);}
function parseCaptions(text){const blocks=String(text).replace(/^\uFEFF/,"").replace(/\r/g,"").replace(/^WEBVTT[^\n]*\n?/,"").trim().split(/\n\s*\n/);const cues=[];for(const b of blocks){const lines=b.split("\n").map(s=>s.trim()).filter(Boolean),i=lines.findIndex(s=>s.includes("-->"));if(i<0)continue;const parts=lines[i].split(/\s*-->\s*/);if(parts.length!==2)throw Error("Bad cue");const start=timestamp(parts[0]),end=timestamp(parts[1].split(/\s+/)[0]);if(end<=start)throw Error("Caption must end after start");const body=lines.slice(i+1).join("\n");if(body)cues.push({start,end,body});}return cues;}
function subtitleExport(cues,type){if(!["srt","vtt","txt"].includes(type))throw Error("Unsupported format");if(type==="txt")return cues.map(c=>c.body).join("\n");return(type==="vtt"?"WEBVTT\n\n":"")+cues.map((c,i)=>(type==="srt"?i+1+"\n":"")+timeString(c.start,type==="srt")+" --> "+timeString(c.end,type==="srt")+"\n"+c.body).join("\n\n")+"\n";}
function offsetCaptions(cues,ms){if(!Number.isFinite(ms)||Math.abs(ms)>86400000)throw Error("Offset must be within 24 hours");return cues.map(c=>({start:Math.max(0,c.start+ms),end:Math.max(0,c.end+ms),body:c.body})).filter(c=>c.end>c.start);}
/**
 * Create editable subtitle timing from a written script (not transcription).
 * Durations are estimated solely from reading speed; users must sync to media.
 */
function draftTimedCaptions(input,options={}){
 const original=String(input||"").trim();
 if(!original)throw Error("Paste a transcript or script first.");
 if(original.length>35000)throw Error("Script limit is 35,000 characters.");
 const wpm=Number(options.wordsPerMinute??165);
 const start=Number(options.startMs??0);
 const maxChars=Number(options.maxCharacters??68);
 if(!Number.isFinite(wpm)||wpm<80||wpm>280)throw Error("Reading speed must be 80–280 words/minute.");
 if(!Number.isFinite(start)||start<0||start>86400000)throw Error("Start time must be within 24 hours.");
 if(!Number.isInteger(maxChars)||maxChars<28||maxChars>90)throw Error("Character limit must be 28–90.");
 const words=original.replace(/\s+/g," ").trim().split(" ");
 const groups=[];let current=[],length=0;
 function flush(){if(current.length){groups.push(current.join(" "));current=[];length=0;}}
 for(const word of words){
   if(current.length && (length+1+word.length>maxChars||current.length>=12))flush();
   current.push(word);length+=word.length+(current.length>1?1:0);
   if(current.length>=3 && /[.!?…。！？]$/.test(word))flush();
 }
 flush();
 if(groups.length>500)throw Error("Maximum 500 captions. Shorten the script.");
 let cursor=Math.round(start);
 return groups.map(body=>{
   const count=(body.match(/\S+/g)||[]).length;
   const duration=Math.round(Math.max(1250,Math.min(5200,count*60000/wpm+300)));
   const entry={start:cursor,end:cursor+duration,body};
   cursor=entry.end+100;
   if(cursor>86400000)throw Error("Timed script exceeds 24 hours.");
   return entry;
 });
}
function csvEscape(v){let s=v==null?"":String(v);if(/^\s*[=+@]/.test(s)||/^\s*-(?!\d+([.,]\d+)?\s*$)/.test(s))s="'"+s;return/[",\r\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;}
function storyboardCSV(shots){return [["Shot","Seconds","Camera","Movement","Visual","Audio","Notes"],...shots.map((s,i)=>[i+1,s.seconds,s.camera,s.movement,s.visual,s.audio,s.notes])].map(r=>r.map(csvEscape).join(",")).join("\r\n");}
function getTextMetrics(s){s=String(s||"");const words=(s.match(/\S+/g)||[]).length;return{characters:[...s].length,words,lines:s?s.split(/\r?\n/).length:0,paragraphs:s.trim()?s.trim().split(/\n\s*\n/).length:0,readingMinutes:Math.round(words/220*10)/10};}
function analyzeCV(input){
 const txt=String(input||"").slice(0,100000),headings={experience:/(experience|experiencia|experiência|employment|histórico profissional)/i,skills:/(skills|habilidades|competencias|competências|technologies|tecnologías|tecnologias)/i,education:/(education|educación|educação|formación|formação|studies|estudios)/i,projects:/(projects|proyectos|projetos|portfolio|portafolio|portfólio)/i};
 const sections=Object.fromEntries(Object.entries(headings).map(([k,re])=>[k,re.test(txt)])),wordCount=(txt.match(/[\p{L}\p{N}][\p{L}\p{N}'’_-]*/gu)||[]).length;
 const email=/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(txt),link=/(https?:\/\/|github\.com|linkedin\.com)/i.test(txt),impact=/\b\d+(?:[.,]\d+)?\s*(?:%|percent|por ciento|por cento|users|usuarios|clients|clientes|hours|horas|projects|proyectos|projetos)\b/i.test(txt);
 const suggestions=[];if(wordCount<120)suggestions.push("Add specific outcomes and responsibilities.");if(wordCount>950)suggestions.push("Create a shorter version for quick review.");if(!email)suggestions.push("Make a professional contact method visible.");if(!sections.experience)suggestions.push("Use a clear professional experience heading.");if(!sections.skills)suggestions.push("Show relevant technologies and skills.");if(!sections.projects)suggestions.push("Consider adding verifiable project evidence.");if(!impact)suggestions.push("Use measurable results only when supported by evidence.");
 return{wordCount,characters:txt.length,sections,contact:{email,portfolioOrProfile:link},quantifiedImpact:impact,suggestions,disclaimer:"Heuristic readability analysis, not ATS certification or hiring prediction."};
}
return{utf8,safeFilename,escapeHTML,crc32,zipFiles,timestamp,timeString,parseCaptions,subtitleExport,offsetCaptions,draftTimedCaptions,csvEscape,storyboardCSV,getTextMetrics,analyzeCV};
});