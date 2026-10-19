/* BELENTANI — local PCM WAV encoder (browser and Node) */
(function(root,factory){const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;else root.AudioCore=api;})(typeof globalThis==="object"?globalThis:this,function(){
"use strict";
function wavFromChannels(channels,sampleRate,normalize=false){
 if(!Array.isArray(channels)||!channels.length||channels.length>2)throw Error("WAV supports mono or stereo channels.");
 if(!Number.isFinite(sampleRate)||sampleRate<8000||sampleRate>192000)throw Error("Invalid sample rate.");
 const count=channels[0]?.length;
 if(!Number.isInteger(count)||count<1||count>12000000)throw Error("Audio length exceeds this tool's memory budget.");
 if(!channels.every(c=>c instanceof Float32Array && c.length===count))throw Error("Channels must have equal Float32Array lengths.");
 const numChannels=channels.length;
 let peak=0;
 if(normalize)for(const ch of channels)for(let i=0;i<count;i++)peak=Math.max(peak,Math.abs(Number.isFinite(ch[i])?ch[i]:0));
 const gain=normalize&&peak>0?Math.min(16,0.99/peak):1;
 const bytes=new ArrayBuffer(44+count*numChannels*2);
 const view=new DataView(bytes),ascii=(offset,value)=>{for(let i=0;i<value.length;i++)view.setUint8(offset+i,value.charCodeAt(i));};
 ascii(0,"RIFF");view.setUint32(4,36+count*numChannels*2,true);ascii(8,"WAVE");
 ascii(12,"fmt ");view.setUint32(16,16,true);view.setUint16(20,1,true);
 view.setUint16(22,numChannels,true);view.setUint32(24,Math.round(sampleRate),true);
 view.setUint32(28,Math.round(sampleRate)*numChannels*2,true);
 view.setUint16(32,numChannels*2,true);view.setUint16(34,16,true);
 ascii(36,"data");view.setUint32(40,count*numChannels*2,true);
 let at=44;for(let i=0;i<count;i++)for(let channel=0;channel<numChannels;channel++){
   const val=channels[channel][i];
   const n=Math.max(-1,Math.min(1,(Number.isFinite(val)?val:0)*gain));
   view.setInt16(at,n<0?Math.round(n*32768):Math.round(n*32767),true);at+=2;
 }
 return new Blob([bytes],{type:"audio/wav"});
}
function channelSummary(channels,sampleRate){
 const length=channels[0]?.length||0;
 if(!channels.length||!length)return {duration:0,peak:0,rms:0};
 let sq=0,peak=0,num=0;
 for(const channel of channels){
 for(let i=0;i<channel.length;i++){const v=Number.isFinite(channel[i])?channel[i]:0;peak=Math.max(peak,Math.abs(v));sq+=v*v;num++;}
 }
 return {duration:length/sampleRate,peak,rms:Math.sqrt(sq/Math.max(1,num))};
}
return {wavFromChannels,channelSummary};
});