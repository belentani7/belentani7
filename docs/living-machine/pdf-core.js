/* BELENTANI / PDF Engine
 * Local JPEG-to-PDF composer. No runtime libraries or network access.
 * Creates one page per JPEG. Input bytes are generated from browser Canvas.
 */
(function(root,factory){const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;else root.PDFCore=api;})(typeof globalThis==="object"?globalThis:this,function(){
 "use strict";
 function imagePDF(images,options={}){
   if(!Array.isArray(images)||!images.length||images.length>50)throw Error("Select 1–50 images.");
   const pageWidth=595.276,pageHeight=841.89,margin=Number.isFinite(options.margin)?Math.max(0,Math.min(80,options.margin)):24;
   const enc=new TextEncoder(),chunks=[],offsets=[0];let length=0;
   function put(v){const bytes=typeof v==="string"?enc.encode(v):v;if(!(bytes instanceof Uint8Array))throw Error("Invalid PDF segment");chunks.push(bytes);length+=bytes.length;}
   function object(n,parts){offsets[n]=length;put(n+" 0 obj\n");for(const part of parts)put(part);put("\nendobj\n");}
   const total=2+3*images.length;
   put("%PDF-1.4\n%BELENTANI-STUDIO\n");
   object(1,["<< /Type /Catalog /Pages 2 0 R >>"]);
   const kids=images.map((_,i)=>(3+3*i)+" 0 R").join(" ");
   object(2,["<< /Type /Pages /Count "+images.length+" /Kids [ "+kids+" ] >>"]);
   for(let i=0;i<images.length;i++){
     const info=images[i],bytes=info?.data;
     if(!(bytes instanceof Uint8Array)||bytes.length<12||bytes[0]!==0xff||bytes[1]!==0xd8||bytes[2]!==0xff)throw Error("Images must be valid JPEG-encoded data.");
     const width=Number(info.width),height=Number(info.height);
     if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||width>20000||height>20000)throw Error("Invalid JPEG dimensions.");
     if(bytes.length>50000000)throw Error("JPEG image exceeds 50MB.");
     const page=3+3*i,img=page+1,stream=page+2;
     const scale=Math.min((pageWidth-2*margin)/width,(pageHeight-2*margin)/height);
     const dw=width*scale,dh=height*scale,x=(pageWidth-dw)/2,y=(pageHeight-dh)/2;
     object(page,["<< /Type /Page /Parent 2 0 R /MediaBox [0 0 "+pageWidth+" "+pageHeight+"] /Resources << /XObject << /Im0 "+img+" 0 R >> >> /Contents "+stream+" 0 R >>"]);
     object(img,["<< /Type /XObject /Subtype /Image /Width "+width+" /Height "+height+" /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length "+bytes.length+" >>\nstream\n",bytes,"\nendstream"]);
     const content="q\n"+dw.toFixed(3)+" 0 0 "+dh.toFixed(3)+" "+x.toFixed(3)+" "+y.toFixed(3)+" cm\n/Im0 Do\nQ\n";
     object(stream,["<< /Length "+enc.encode(content).length+" >>\nstream\n",content,"endstream"]);
   }
   const xref=length;put("xref\n0 "+(total+1)+"\n0000000000 65535 f \n");
   for(let i=1;i<=total;i++)put(String(offsets[i]).padStart(10,"0")+" 00000 n \n");
   put("trailer\n<< /Size "+(total+1)+" /Root 1 0 R >>\nstartxref\n"+xref+"\n%%EOF\n");
   return new Blob(chunks,{type:"application/pdf"});
 }
 return {imagePDF};
});