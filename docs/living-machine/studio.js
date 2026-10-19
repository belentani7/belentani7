/* BELENTANI STUDIO / Browser applications / zero runtime dependencies */
(function(){
"use strict";
if("serviceWorker" in navigator && (location.protocol==="https:" || location.hostname==="localhost" || location.hostname==="127.0.0.1")){
  window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js",{scope:"./"}).catch(()=>{}),{once:true});
}
const Core=window.StudioCore;
if(!Core)throw Error("StudioCore missing; verify local script order.");
const $=s=>document.querySelector(s),$$=s=>Array.from(document.querySelectorAll(s));
const toast=(target,message,err=false)=>{const el=$(target);el.textContent=String(message);el.classList.toggle("error",!!err);};
function saveBlob(blob,name){const a=document.createElement("a"),url=URL.createObjectURL(blob);a.href=url;a.download=Core.safeFilename(name);document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),4000);}
const saveText=(content,name,mime="text/plain")=>saveBlob(new Blob([content],{type:mime+";charset=utf-8"}),name);
const fmtBytes=n=>(n/1048576).toFixed(2)+" MB";
const chosen=()=>$$("[data-tab]").find(b=>b.classList.contains("chosen"));
function activate(id){
  for(const b of $$("[data-tab]")){const on=b.dataset.tab===id;b.classList.toggle("chosen",on);b.setAttribute("aria-current",on?"page":"false");}
  for(const panel of $$(".panel")){const on=panel.id==="tab-"+id;panel.hidden=!on;panel.classList.toggle("active",on);}
  history.replaceState(null,"","#"+id);
  if(window.innerWidth<950)$("#workspace").scrollIntoView({block:"start",behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});
}
$$("[data-tab]").forEach(b=>b.addEventListener("click",()=>activate(b.dataset.tab)));
let initially=location.hash.replace("#","");if(!$$("[data-tab]").some(x=>x.dataset.tab===initially))initially="batch";activate(initially);
window.addEventListener("hashchange",()=>{const tab=location.hash.slice(1);if($$("[data-tab]").some(b=>b.dataset.tab===tab))activate(tab)});

/* 01 IMAGE BATCH — files never leave the browser */
let selectedImages=[];
const batchInput=$("#batchFiles"),batchDrop=$("#imageDrop");
function showBatch(){
  const holder=$("#batchList");holder.replaceChildren();
  for(const file of selectedImages){
    const el=document.createElement("div");el.className="file";
    const a=document.createElement("span");a.textContent=file.name;
    const b=document.createElement("span");b.textContent=fmtBytes(file.size);
    el.append(a,b);holder.append(el);
  }
}
function setBatch(files){
  const arr=Array.from(files||[]);
  if(arr.length>20){toast("#batchResult","A maximum of 20 files is supported.",true);return}
  if(arr.some(f=>!f.type.startsWith("image/"))){toast("#batchResult","Only local image files are accepted.",true);return}
  if(arr.some(f=>f.size>20*1048576)){toast("#batchResult","File size limit is 20 MB each.",true);return}
  const total=arr.reduce((s,f)=>s+f.size,0);
  if(total>100*1048576){toast("#batchResult","Combined input limit is 100 MB.",true);return}
  selectedImages=arr;showBatch();
  toast("#batchResult",arr.length?arr.length+" image(s) ready · "+fmtBytes(total):"Choose images to convert.");
}
batchInput.addEventListener("change",e=>setBatch(e.target.files));
batchDrop.addEventListener("dragover",e=>{e.preventDefault();batchDrop.classList.add("dragover")});
batchDrop.addEventListener("dragleave",()=>batchDrop.classList.remove("dragover"));
batchDrop.addEventListener("drop",e=>{e.preventDefault();batchDrop.classList.remove("dragover");setBatch(e.dataTransfer.files)});
$("#batchClear").addEventListener("click",()=>{selectedImages=[];batchInput.value="";showBatch();toast("#batchResult","Selection cleared.")});
async function imageConvert(file,i){
  const bmp=await createImageBitmap(file);
  try{
    const desired=Number($("#batchWidth").value)||bmp.width;
    const width=Math.min(bmp.width,desired),height=Math.max(1,Math.round(bmp.height*(width/bmp.width)));
    if(!width||!height||width*height>24000000)throw Error("Output exceeds 24 megapixels.");
    const canvas=document.createElement("canvas");canvas.width=width;canvas.height=height;
    const ctx=canvas.getContext("2d");if(!ctx)throw Error("Browser Canvas is unavailable");
    const type=$("#batchFormat").value;
    if(type==="image/jpeg"){ctx.fillStyle="#fff";ctx.fillRect(0,0,width,height);}
    ctx.drawImage(bmp,0,0,width,height);
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,type,Number($("#batchQuality").value)));
    if(!blob)throw Error("Image encoder failed");
    if(blob.type!==type)throw Error("Selected output format is not supported by this browser.");
    const ext=type==="image/png"?"png":type==="image/webp"?"webp":"jpg";
    const filename=String(i+1).padStart(2,"0")+"-"+Core.safeFilename(file.name.replace(/\.[^./]+$/,""))+"."+ext;
    return {blob,name:filename,width,height};
  }finally{bmp.close()}
}
$("#batchGo").addEventListener("click",async()=>{
  const btn=$("#batchGo");if(!selectedImages.length){toast("#batchResult","Choose at least one image.",true);return;}
  btn.disabled=true;const results=[],errors=[];
  try{
    for(let i=0;i<selectedImages.length;i++){
      toast("#batchResult","Converting "+(i+1)+"/"+selectedImages.length+"...");
      try{results.push(await imageConvert(selectedImages[i],i))}
      catch(e){errors.push(selectedImages[i].name+": "+e.message)}
    }
    if(!results.length)throw Error("No images converted. "+errors.join(" / "));
    if(results.length===1)saveBlob(results[0].blob,results[0].name);
    else{
      const parts=[];
      for(const r of results)parts.push({name:r.name,data:new Uint8Array(await r.blob.arrayBuffer())});
      const zip=Core.zipFiles(parts);saveBlob(zip,"belentani-converted-images.zip");
    }
    toast("#batchResult","Done: "+results.length+" image(s) converted and downloaded.\n"+(errors.length?errors.length+" skipped:\n"+errors.join("\n"):"Local processing · no upload."));
  }catch(err){toast("#batchResult",err.message,true)}finally{btn.disabled=false;}
});

/* 02 TIMECODE STUDIO */
$("#subtitleFile").addEventListener("change",async e=>{
  const file=e.target.files[0];if(!file)return;
  if(file.size>3000000){toast("#subtitleResult","Subtitle input exceeds 3MB.",true);return}
  $("#subtitleInput").value=await file.text();toast("#subtitleResult","Loaded "+file.name);
});
$("#captionDraft").addEventListener("click",()=>{
 try{
   const script=$("#subtitleInput").value;
   if(script.includes("-->"))throw Error("This already looks like timed subtitles. Use the SRT/VTT converter instead.");
   const wpm=Number($("#captionWpm").value),start=Number($("#captionStart").value);
   const cues=Core.draftTimedCaptions(script,{wordsPerMinute:wpm,startMs:start*1000});
   $("#subtitleInput").value=Core.subtitleExport(cues,"srt");
   $("#subtitleShift").value="0";
   toast("#subtitleResult",cues.length+" editable timed cues generated. Timings are estimates, not speech transcription; verify with your video.");
 }catch(err){toast("#subtitleResult",err.message||"Unable to draft captions.",true)}
});
function produceCaptions(){
  const cues=Core.parseCaptions($("#subtitleInput").value);
  if(!cues.length)throw Error("No valid timed subtitle cues found.");
  const shift=Number($("#subtitleShift").value)||0,offset=Core.offsetCaptions(cues,shift);
  if(!offset.length)throw Error("No cues remain after this offset.");
  return {cues:offset,out:Core.subtitleExport(offset,$("#subtitleFormat").value)};
}
$("#subtitleGo").addEventListener("click",()=>{
  try{const a=produceCaptions(),ext=$("#subtitleFormat").value;saveText(a.out,"belentani-timed-captions."+ext);toast("#subtitleResult",a.cues.length+" cues exported to "+ext.toUpperCase());}
  catch(err){toast("#subtitleResult",err.message,true)}
});
$("#subtitlePreview").addEventListener("click",()=>{
  try{const a=produceCaptions();toast("#subtitleResult",a.out.slice(0,7500));}
  catch(err){toast("#subtitleResult",err.message,true)}
});

/* 03 CV READABILITY: no remote processing, no claim of ATS score */
let lastCVReport=null;
$("#cvGo").addEventListener("click",()=>{
  const txt=$("#cvText").value;if(!txt.trim()){toast("#cvResult","Paste CV text to analyze.",true);return}
  const data=Core.analyzeCV(txt);lastCVReport=data;
  const report=$("#cvResult");report.replaceChildren();
  const row=document.createElement("div");row.className="metric-row";
  const metrics=[["Words",data.wordCount],["Sections",Object.values(data.sections).filter(Boolean).length+"/4"],["Email",data.contact.email?"Present":"Missing"],["Evidence",data.quantifiedImpact?"Detected":"Review"]];
  for(const [name,value] of metrics){const el=document.createElement("div");el.className="metric";const strong=document.createElement("strong");strong.textContent=String(value);const title=document.createElement("span");title.textContent=name;el.append(strong,title);row.append(el);}
  report.append(row);
  const h=document.createElement("h3");h.textContent="Review signals · not a hiring prediction";report.append(h);
  const ul=document.createElement("ul");
  for(const s of data.suggestions.length?data.suggestions:["Basic structure detected. Review role relevance and factual accuracy manually."]){const li=document.createElement("li");li.textContent=s;ul.append(li)}report.append(ul);
  const note=document.createElement("p");note.textContent=data.disclaimer;report.append(note);
});
$("#cvExport").addEventListener("click",()=>{
  if(!lastCVReport){toast("#cvResult","Inspect text before exporting.",true);return}
  saveText(JSON.stringify(lastCVReport,null,2),"belentani-cv-clarity-report.json","application/json");
});

/* 04 SHOT-BASED CREATIVE PRODUCTION */
let shots=[];
function newShot(){
  return{seconds:"4",camera:"medium shot",movement:"slow dolly",visual:"",audio:"",notes:""};
}
function shotInput(row,field,type){
  const td=document.createElement("td"),el=document.createElement("input");
  el.type=type||"text";el.setAttribute("aria-label",field+" shot "+(row+1));
  if(field==="seconds"){el.min="0.1";el.max="3600";el.step="0.1";}
  el.value=shots[row][field];el.addEventListener("input",()=>shots[row][field]=el.value);
  td.append(el);return td;
}
function renderShots(){
  const target=$("#shots");target.replaceChildren();
  shots.forEach((s,i)=>{
    const tr=document.createElement("tr"),index=document.createElement("td");index.textContent=String(i+1).padStart(2,"0");tr.append(index);
    tr.append(shotInput(i,"seconds","number"),shotInput(i,"camera"),shotInput(i,"movement"),shotInput(i,"visual"),shotInput(i,"audio"),shotInput(i,"notes"));
    const action=document.createElement("td"),b=document.createElement("button");b.className="remove";b.textContent="×";b.setAttribute("aria-label","Remove shot "+(i+1));
    b.addEventListener("click",()=>{shots.splice(i,1);renderShots();});action.append(b);tr.append(action);target.append(tr);
  });
  const duration=shots.reduce((sum,s)=>sum+(Number(s.seconds)>0?Number(s.seconds):0),0);
  toast("#storyResult",shots.length+" shots · "+duration.toFixed(1)+" seconds planned.");
}
$("#addShot").addEventListener("click",()=>{if(shots.length>=120){toast("#storyResult","Limit 120 shots.",true);return}shots.push(newShot());renderShots();});
shots=[newShot(),{seconds:"3.5",camera:"close-up",movement:"handheld",visual:"",audio:"",notes:""}];renderShots();
function validatedShots(){if(!shots.length)throw Error("Add at least one shot.");if(shots.some(s=>!Number.isFinite(Number(s.seconds))||Number(s.seconds)<=0||Number(s.seconds)>3600))throw Error("Each shot must have a valid positive duration up to 3600 seconds.");return shots;}
$("#exportShots").addEventListener("click",()=>{try{saveText(Core.storyboardCSV(validatedShots()),"belentani-storyboard.csv","text/csv");toast("#storyResult","Shot list exported as spreadsheet-safe CSV.");}catch(e){toast("#storyResult",e.message,true)}});
$("#exportShotsJson").addEventListener("click",()=>{
  try{
    const data={title:$("#filmTitle").value.trim(),bpm:Number($("#filmTempo").value)||null,createdAt:new Date().toISOString(),shots:validatedShots()};
    saveText(JSON.stringify(data,null,2),"belentani-storyboard.json","application/json");toast("#storyResult","Storyboard saved as editable JSON.");
  }catch(e){toast("#storyResult",e.message,true)}
});

/* 05 COLOR SAMPLER */
let palette=[];
$("#paletteGo").addEventListener("click",async()=>{
  const file=$("#paletteImage").files[0];
  if(!file){toast("#paletteResult","Choose an image.",true);return}
  if(file.size>20*1048576){toast("#paletteResult","Maximum file size is 20 MB.",true);return}
  try{
    const bmp=await createImageBitmap(file);
    try{
      const display=$("#paletteCanvas"),ratio=Math.min(420/bmp.width,240/bmp.height,1);
      display.width=Math.max(1,Math.floor(bmp.width*ratio));display.height=Math.max(1,Math.floor(bmp.height*ratio));
      display.getContext("2d").drawImage(bmp,0,0,display.width,display.height);
      const sample=document.createElement("canvas");sample.width=72;sample.height=72;
      const ctx=sample.getContext("2d",{willReadFrequently:true});ctx.drawImage(bmp,0,0,72,72);
      const rgba=ctx.getImageData(0,0,72,72).data,colors=new Map();
      for(let i=0;i<rgba.length;i+=4){
        if(rgba[i+3]<160)continue;
        const key=[rgba[i]>>4,rgba[i+1]>>4,rgba[i+2]>>4].join(",");
        const a=colors.get(key)||{r:0,g:0,b:0,n:0};
        a.r+=rgba[i];a.g+=rgba[i+1];a.b+=rgba[i+2];a.n++;colors.set(key,a);
      }
      const candidates=[...colors.values()].sort((a,b)=>b.n-a.n);
      palette=candidates.slice(0,6).map(c=>[c.r/c.n,c.g/c.n,c.b/c.n].map(v=>Math.round(v).toString(16).padStart(2,"0")).join("").toUpperCase()).map(s=>"#"+s);
      const host=$("#swatches");host.replaceChildren();
      for(const hex of palette){
        const b=document.createElement("button");b.style.setProperty("--swatch",hex);b.setAttribute("aria-label","Copy color "+hex);
        const label=document.createElement("span");label.textContent=hex;b.append(label);
        b.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(hex);toast("#paletteResult","Copied "+hex)}catch{toast("#paletteResult","Color: "+hex+" (clipboard unavailable)")}});host.append(b);
      }
      toast("#paletteResult",palette.length+" sampled colors · approximate image palette.");
    }finally{bmp.close()}
  }catch(err){toast("#paletteResult",err.message,true)}
});
$("#paletteExport").addEventListener("click",()=>{
  if(!palette.length){toast("#paletteResult","Extract colors before exporting.",true);return}
  const content="/* BELENTANI image palette, locally sampled */\n:root {\n"+palette.map((hex,i)=>"  --palette-"+(i+1)+": "+hex+";").join("\n")+"\n}\n";
  saveText(content,"belentani-palette.css","text/css");toast("#paletteResult","CSS variables exported.");
});
/* 06 IMAGE TO PDF — portable A4 PDF with JPEG XObjects */
$("#pdfGo").addEventListener("click",async()=>{
  const button=$("#pdfGo"),files=Array.from($("#pdfFiles").files||[]);
  if(!files.length){toast("#pdfResult","Choose one or more images.",true);return;}
  if(files.length>25||files.some(f=>f.size>20*1048576)||files.reduce((sum,f)=>sum+f.size,0)>100*1048576){toast("#pdfResult","Limits: 25 images, 20MB per file, 100MB combined.",true);return;}
  button.disabled=true;
  try{
    if(!window.PDFCore?.imagePDF)throw Error("Local PDF engine is missing.");
    const inputs=[],quality=Number($("#pdfQuality").value);
    for(let i=0;i<files.length;i++){
      const file=files[i];toast("#pdfResult","Reading page "+(i+1)+" of "+files.length+"…");
      const bitmap=await createImageBitmap(file);
      try{
        const scale=Math.min(1,Math.sqrt(16000000/(bitmap.width*bitmap.height)),8000/Math.max(bitmap.width,bitmap.height));
        const width=Math.max(1,Math.floor(bitmap.width*scale)),height=Math.max(1,Math.floor(bitmap.height*scale));
        const canvas=document.createElement("canvas");canvas.width=width;canvas.height=height;
        const ctx=canvas.getContext("2d");if(!ctx)throw Error("2D canvas unavailable.");
        ctx.fillStyle="#fff";ctx.fillRect(0,0,width,height);ctx.drawImage(bitmap,0,0,width,height);
        const jpg=await new Promise(resolve=>canvas.toBlob(resolve,"image/jpeg",quality));
        if(!jpg||jpg.type!=="image/jpeg")throw Error("This browser cannot encode JPEG.");
        inputs.push({width,height,data:new Uint8Array(await jpg.arrayBuffer())});
        canvas.width=0;canvas.height=0;
      }finally{bitmap.close();}
    }
    const pdf=window.PDFCore.imagePDF(inputs,{margin:Number($("#pdfMargin").value)});
    saveBlob(pdf,"belentani-image-collection.pdf");
    toast("#pdfResult","PDF generated: "+inputs.length+" page(s), "+fmtBytes(pdf.size)+". Local processing, no server upload.");
  }catch(err){toast("#pdfResult",err.message||"PDF export failed.",true);}
  finally{button.disabled=false;}
});

/* 07 AUDIO TO WAV — WebAudio decode, locally generated 16-bit WAV */
$("#audioGo").addEventListener("click",async()=>{
  const file=$("#audioFile").files[0],button=$("#audioGo");
  if(!file){toast("#audioResult","Choose a local audio file.",true);return;}
  if(file.size>60*1048576){toast("#audioResult","Audio input must be under 60MB.",true);return;}
  if(!window.AudioCore?.wavFromChannels){toast("#audioResult","Audio engine missing.",true);return;}
  if(!window.AudioContext&&!window.webkitAudioContext){toast("#audioResult","Web Audio is not supported in this browser.",true);return;}
  button.disabled=true;let context;
  try{
    const AudioEngine=window.AudioContext||window.webkitAudioContext;
    context=new AudioEngine();
    toast("#audioResult","Decoding source locally…");
    const buffer=await context.decodeAudioData(await file.arrayBuffer());
    const len=buffer.length;
    if(!len||len>12000000)throw Error("Audio duration exceeds the available WAV memory budget.");
    const input=Array.from({length:buffer.numberOfChannels},(_,i)=>buffer.getChannelData(i));
    if(!input.length)throw Error("No audio channels detected.");
    let channels;
    if($("#audioChannels").value==="mono"){
      const mixed=new Float32Array(len);
      for(const ch of input)for(let i=0;i<len;i++)mixed[i]+=ch[i]/input.length;
      channels=[mixed];
    }else{
      channels=input.slice(0,2);
      if(buffer.numberOfChannels>2)toast("#audioResult","Multichannel source: only first two channels used.");
    }
    const stats=window.AudioCore.channelSummary(channels,buffer.sampleRate);
    const canvas=$("#waveCanvas"),ctx=canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="#09060c";ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle="#ff729b";ctx.lineWidth=1;ctx.beginPath();
    const data=channels[0],mid=canvas.height/2,width=canvas.width;
    for(let x=0;x<width;x++){
      const start=Math.floor(x*len/width),end=Math.min(len,Math.ceil((x+1)*len/width));
      let lo=0,hi=0;
      for(let j=start;j<end;j++){lo=Math.min(lo,data[j]);hi=Math.max(hi,data[j]);}
      ctx.moveTo(x,mid-lo*mid*.84);ctx.lineTo(x,mid-hi*mid*.84);
    }
    ctx.stroke();
    toast("#audioResult","Encoding 16-bit PCM WAV locally…");
    const result=window.AudioCore.wavFromChannels(channels,buffer.sampleRate,$("#audioNormalize").value==="yes");
    saveBlob(result,Core.safeFilename(file.name.replace(/\.[^.]+$/,""))+"-belentani.wav");
    toast("#audioResult","Saved WAV • "+stats.duration.toFixed(1)+"s • "+channels.length+" channel(s) • "+buffer.sampleRate+"Hz • peak "+stats.peak.toFixed(3)+" • RMS "+stats.rms.toFixed(3));
  }catch(err){toast("#audioResult",err.message||"Audio conversion failed.",true);}
  finally{button.disabled=false;if(context)context.close().catch(()=>{});}
});

})();
