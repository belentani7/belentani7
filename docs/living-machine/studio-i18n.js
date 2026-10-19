/* BELENTANI STUDIO / editorial interface localization / ES EN PT
 * Static, audited dictionaries: no remote translation and no arbitrary HTML.
 */
(function(){
"use strict";
const copy={
en:{
 engine:"● LOCAL ENGINE",apps:"APPLICATIONS / 01—07",
 navBatch:"Image batch converter",navSubtitles:"Subtitle time studio",
 navCV:"CV clarity inspector",navShots:"Storyboard architect",
 navPalette:"Image color sampler",navPDF:"Image → PDF composer",navAudio:"Audio to WAV studio",
 headline:"Tools that<br><i>earn their place.</i>",
 intro:"Pixel-precise glass, practical software and honest limits. Your files stay in your browser. Each utility is designed as a self-contained operation, with no registration or third-party file service.",
 sevenTools:"7 REAL TOOLS",batchTitle:"Batch image converter",subtitleTitle:"Subtitle time studio",
 cvTitle:"CV clarity inspector",storyTitle:"Storyboard architect",paletteTitle:"Image color sampler",
 pdfTitle:"Images into PDF",audioTitle:"Audio to WAV"
},
es:{
 engine:"● MOTOR LOCAL",apps:"APLICACIONES / 01—07",
 navBatch:"Convertir imágenes en lote",navSubtitles:"Estudio de subtítulos",
 navCV:"Análisis de claridad del CV",navShots:"Diseño de storyboard",
 navPalette:"Extractor de paletas",navPDF:"Imágenes → PDF",navAudio:"Audio a WAV",
 headline:"Herramientas que<br><i>merecen existir.</i>",
 intro:"Cristal de precisión, software útil y límites claros. Tus archivos permanecen en el navegador. Cada herramienta funciona de forma independiente, sin registro y sin enviar documentos a terceros.",
 sevenTools:"7 HERRAMIENTAS REALES",batchTitle:"Conversión de imágenes por lotes",
 subtitleTitle:"Estudio de tiempos y subtítulos",cvTitle:"Analizador de claridad del CV",
 storyTitle:"Arquitecto de storyboard",paletteTitle:"Extractor de paletas de imagen",
 pdfTitle:"Imágenes a PDF",audioTitle:"Audio a WAV"
},
pt:{
 engine:"● MOTOR LOCAL",apps:"APLICATIVOS / 01—07",
 navBatch:"Conversor de imagens em lote",navSubtitles:"Estúdio de legendas",
 navCV:"Análise de clareza do currículo",navShots:"Planejador de storyboard",
 navPalette:"Extrator de paleta de cores",navPDF:"Imagens → PDF",navAudio:"Áudio para WAV",
 headline:"Ferramentas que<br><i>fazem sentido.</i>",
 intro:"Vidro de precisão, software útil e limites claros. Seus arquivos permanecem no navegador. Cada ferramenta funciona de forma independente, sem cadastro e sem enviar arquivos para serviços de terceiros.",
 sevenTools:"7 FERRAMENTAS REAIS",batchTitle:"Conversor de imagens em lote",
 subtitleTitle:"Estúdio de legendas e tempos",cvTitle:"Analisador de clareza do currículo",
 storyTitle:"Planejador de storyboard",paletteTitle:"Extrator de paletas de imagem",
 pdfTitle:"Imagens para PDF",audioTitle:"Áudio para WAV"
}
};
const select=document.getElementById("interfaceLanguage");
if(!select)return;
let saved;try{saved=localStorage.getItem("belentani-studio-lang")}catch{}
const query=new URLSearchParams(location.search).get("lang");
const fromBrowser=(navigator.language||"en").toLowerCase().startsWith("pt")?"pt":(navigator.language||"en").toLowerCase().startsWith("es")?"es":"en";
const preferred=[query,saved,fromBrowser].find(x=>x&&Object.prototype.hasOwnProperty.call(copy,x))||"en";
function apply(lang){
 if(!Object.prototype.hasOwnProperty.call(copy,lang))return;
 select.value=lang;document.documentElement.lang=lang;
 document.querySelectorAll("[data-i18n]").forEach(node=>{
   const key=node.getAttribute("data-i18n");
   if(!Object.prototype.hasOwnProperty.call(copy[lang],key))return;
   const value=copy[lang][key];
   if(key==="headline")node.innerHTML=value;
   else node.textContent=value;
 });
 try{localStorage.setItem("belentani-studio-lang",lang)}catch{}
 document.title="BELENTANI STUDIO / "+(lang==="es"?"Herramientas":lang==="pt"?"Ferramentas":"Free Browser Tools");
}
select.addEventListener("change",e=>apply(e.target.value));
apply(preferred);
window.BELENTANI_STUDIO_LANG={set:apply,available:Object.keys(copy)};
})();