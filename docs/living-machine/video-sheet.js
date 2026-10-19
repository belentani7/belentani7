/* BELENTANI / Video Contact Sheet
   Extract stills locally from browser-supported video files. No network requests.
   Pure timing helpers are independently testable in Node.js.
*/
(function(root,factory){const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;else root.VideoSheet=api;})(typeof globalThis==="object"?globalThis:this,function(){
"use strict";
function sampleTimes(duration,count){
 if(!Number.isFinite(duration)||duration<=0||duration>24*3600)throw Error("Video requires a finite duration under 24 hours.");
 if(!Number.isInteger(count)||![4,9,16].includes(count))throw Error("Select 4, 9 or 16 frames.");
 const max=Math.max(0,duration-.04);
 return Array.from({length:count},(_,i)=>Math.min(max,Math.max(0,((i+.5)/count)*duration)));
}
function clockLabel(seconds){
 if(!Number.isFinite(seconds)||seconds<0)throw Error("Invalid video timestamp.");
 const secs=Math.floor(seconds%60),mins=Math.floor(seconds/60)%60,hours=Math.floor(seconds/3600);
 return (hours?String(hours).padStart(2,"0")+":":"")+String(mins).padStart(2,"0")+":"+String(secs).padStart(2,"0");
}
async function generateContactSheet(file,opts={}){
 if(!file||typeof file.size!=="number")throw Error("Choose a local video file.");
 if(file.size>500*1024*1024)throw Error("Maximum supported video size is 500MB.");
 if(!file.type.startsWith("video/"))throw Error("Only local video files are accepted.");
 const count=opts.count??9,columns=opts.columns??(count===16?4:count===9?3:2);
 if(![2,3,4].includes(columns)||count%columns!==0)throw Error("Choose a supported sheet grid.");
 const video=document.createElement("video");
 video.preload="auto";video.muted=true;video.playsInline=true;video.volume=0;
 const url=URL.createObjectURL(file);
 const wait=(event,timeout=15000)=>new Promise((resolve,reject)=>{
  let settled=false;const done=err=>{
    if(settled)return;settled=true;clearTimeout(timer);
    video.removeEventListener(event,success);video.removeEventListener("error",failure);
    err?reject(err):resolve();
  };
  const success=()=>done(),failure=()=>done(Error("Video decoding error."));
  const timer=setTimeout(()=>done(Error("Video decoder timed out.")),timeout);
  video.addEventListener(event,success,{once:true});
  video.addEventListener("error",failure,{once:true});
 });
 try{
  const ready=wait("loadedmetadata",22000);
  video.src=url;video.load();await ready;
  if(!video.videoWidth||!video.videoHeight)throw Error("Cannot determine video dimensions.");
  const times=sampleTimes(video.duration,count);
  const cardW=300,cardH=Math.max(96,Math.min(290,Math.round(cardW*video.videoHeight/video.videoWidth)));
  const gap=14,labelHeight=35,pad=18,rows=count/columns;
  const canvas=document.createElement("canvas");
  canvas.width=columns*cardW+(columns-1)*gap+pad*2;
  canvas.height=rows*(cardH+labelHeight)+(rows-1)*gap+pad*2;
  if(canvas.width*canvas.height>16000000)throw Error("Sheet canvas exceeds memory budget.");
  const ctx=canvas.getContext("2d");
  if(!ctx)throw Error("Canvas unavailable");
  ctx.fillStyle="#080509";ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.font="13px Consolas, monospace";ctx.textBaseline="middle";
  for(let i=0;i<times.length;i++){
    const t=times[i];
    if(!(Math.abs(video.currentTime-t)<.045 && video.readyState>=2)){
      const seek=wait("seeked");
      video.currentTime=t;await seek;
    }
    const x=pad+(i%columns)*(cardW+gap);
    const y=pad+Math.floor(i/columns)*(cardH+labelHeight+gap);
    ctx.fillStyle="#181019";ctx.fillRect(x,y,cardW,cardH);
    ctx.drawImage(video,x,y,cardW,cardH);
    ctx.fillStyle="#21121c";ctx.fillRect(x,y+cardH,cardW,labelHeight);
    ctx.fillStyle="#f5deea";
    ctx.fillText(String(i+1).padStart(2,"0")+"   "+clockLabel(t),x+12,y+cardH+labelHeight/2);
    if(typeof opts.onProgress==="function")opts.onProgress(i+1,count);
  }
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,"image/png"));
  if(!blob||blob.type!=="image/png")throw Error("PNG encoder unavailable.");
  return {blob,frames:times.length,columns,rows,width:canvas.width,height:canvas.height,duration:video.duration};
 }finally{
  video.pause();video.removeAttribute("src");video.load();URL.revokeObjectURL(url);
 }
}
return{sampleTimes,clockLabel,generateContactSheet};
});