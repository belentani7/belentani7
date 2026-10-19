"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const PDF=require("./pdf-core.js");
const Audio=require("./audio-core.js");
const html=fs.readFileSync(path.join(__dirname,"studio.html"),"utf8");
const js=fs.readFileSync(path.join(__dirname,"studio.js"),"utf8");

test("PDF and audio modules and Studio entry compile",()=>{
 assert.doesNotThrow(()=>new vm.Script(js));
 assert.match(html,/pdf-core\.js/);assert.match(html,/audio-core\.js/);
 assert.match(html,/id="tab-pdf"/);assert.match(html,/id="tab-audio"/);
 assert.match(html,/connect-src &#39;none&#39;|connect-src 'none'/);
});

test("PDF: valid object/xref offsets and page tree for two JPEGs",async()=>{
 // JPEG magic sufficient for structural test; browser supplies true Canvas-encoded JPEGs.
 const jpeg=new Uint8Array([0xff,0xd8,0xff,0xe0,0,16,74,70,73,70,0,1,0,1,0,0,0xff,0xd9]);
 const pdf=PDF.imagePDF([{data:jpeg,width:100,height:50},{data:jpeg,width:50,height:100}],{margin:24});
 const raw=new Uint8Array(await pdf.arrayBuffer());
 const body=Buffer.from(raw).toString("latin1");
 assert.ok(body.startsWith("%PDF-1.4\n"));
 const at=/startxref\n(\d+)\n%%EOF/.exec(body);assert.ok(at);
 assert.equal(body.slice(Number(at[1]),Number(at[1])+4),"xref");
 assert.match(body,/\/Type \/Pages \/Count 2/);
 assert.match(body,/\/Filter \/DCTDecode/);
 assert.match(body,/\/MediaBox \[0 0 595\.276 841\.89\]/);
 const xref=/xref\n0 9\n([\s\S]*?)trailer/.exec(body);assert.ok(xref);
 const lines=xref[1].trim().split("\n");assert.equal(lines.length,9);
 for(let i=1;i<=8;i++){
   const offset=Number(lines[i].slice(0,10));
   assert.ok(body.slice(offset).startsWith(i+" 0 obj\n"),"PDF obj "+i);
 }
 assert.equal(pdf.type,"application/pdf");
});

test("PDF: refuses untrusted format, unbounded images and invalid dimensions",()=>{
 assert.throws(()=>PDF.imagePDF([{data:new Uint8Array([1,2,3]),width:2,height:3}]));
 assert.throws(()=>PDF.imagePDF([]));
 const jpeg=new Uint8Array([255,216,255,1,1,1,1,1,1,1,1,1]);
 assert.throws(()=>PDF.imagePDF([{data:jpeg,width:0,height:10}]));
 assert.throws(()=>PDF.imagePDF(Array.from({length:51},()=>({data:jpeg,width:2,height:2}))));
});

test("WAV: mono 16-bit PCM header, sample count and clipping",async()=>{
 const wav=Audio.wavFromChannels([new Float32Array([0,1,-1,.5])],8000);
 const view=new DataView(await wav.arrayBuffer());
 const text=(p,n)=>String.fromCharCode(...new Uint8Array(view.buffer,p,n));
 assert.equal(text(0,4),"RIFF");assert.equal(text(8,4),"WAVE");
 assert.equal(text(36,4),"data");assert.equal(view.getUint16(22,true),1);
 assert.equal(view.getUint32(24,true),8000);
 assert.equal(view.getUint32(40,true),8);
 assert.equal(view.getInt16(44,true),0);
 assert.equal(view.getInt16(46,true),32767);
 assert.equal(view.getInt16(48,true),-32768);
 assert.equal(view.getInt16(50,true),16384);
});

test("WAV: stereo, normalization and invalid channel safety",async()=>{
 const l=new Float32Array([.25,-.25]),r=new Float32Array([0,.5]);
 const wav=Audio.wavFromChannels([l,r],44100,true);
 const view=new DataView(await wav.arrayBuffer());
 assert.equal(view.getUint16(22,true),2);
 assert.equal(view.getUint16(32,true),4);
 assert.equal(view.getUint32(40,true),8);
 assert.equal(view.getInt16(50,true),Math.round(.99*32767));
 assert.throws(()=>Audio.wavFromChannels([],44100));
 assert.throws(()=>Audio.wavFromChannels([l,new Float32Array([.1])],44100));
 const stat=Audio.channelSummary([l,r],44100);
 assert.equal(stat.duration,2/44100);
 assert.equal(stat.peak,.5);
});
