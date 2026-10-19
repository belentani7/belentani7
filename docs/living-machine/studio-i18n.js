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
 pdfTitle:"Images into PDF",audioTitle:"Audio to WAV",
 batchDesc:"Convert up to 20 local images to PNG, JPEG or WebP while preserving proportions. Download one file or a standards-compatible ZIP.",
 subtitleDesc:"Convert SRT/VTT, adjust timestamps and export plain transcripts. Existing captions are required; this does not transcribe videos.",
 cvDesc:"Privacy-conscious text review for structure, contact details and verifiable evidence. This is not an ATS rating or a hiring prediction.",
 storyDesc:"Plan real shot lists for reels, music videos and campaigns: duration, camera, movement, sound and creative intention.",
 paletteDesc:"Sample colors from a local image and export reusable CSS variables. Results are approximate and not colorimetric.",
 pdfDesc:"Combine local photographs and screenshots into an A4 PDF, one image per page. The browser recreates JPEG data without the original image metadata.",
 audioDesc:"Decode browser-compatible audio, inspect peak and RMS, and export a local 16-bit PCM WAV file in mono or stereo.",
 batchGo:"Convert images ↗",
 batchClear:"Clear",
 subtitleGo:"Convert & export ↗",
 subtitlePreview:"Preview shifted text",
 cvGo:"Inspect clarity ↗",
 cvExport:"Export report",
 addShot:"＋ Add shot",
 exportShots:"Export CSV ↗",
 exportShotsJson:"Export JSON",
 paletteGo:"Extract palette ↗",
 paletteExport:"Export CSS",
 pdfGo:"Compose & download PDF ↗",
 audioGo:"Decode & download WAV ↗"
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
 pdfTitle:"Imagens para PDF",audioTitle:"Áudio para WAV",
 batchDesc:"Converta até 20 imagens locais para PNG, JPEG ou WebP sem distorção. Baixe um arquivo ou um ZIP compatível com programas comuns.",
 subtitleDesc:"Converta SRT/VTT, ajuste os tempos e exporte transcrições em texto. Precisa de legendas existentes; não transcreve vídeos automaticamente.",
 cvDesc:"Análise local e orientativa do texto: estrutura, contatos e resultados verificáveis. Não inventa pontuação ATS nem prevê contratações.",
 storyDesc:"Planeje cenas para reels, videoclipes e campanhas: duração, câmera, movimento, som e intenção criativa.",
 paletteDesc:"Extraia cores aproximadas de uma imagem local e exporte variáveis CSS reutilizáveis. Não substitui a análise colorimétrica.",
 pdfDesc:"Combine fotos e capturas locais num PDF A4, uma por página. O navegador recria o JPEG sem preservar os metadados originais.",
 audioDesc:"Decodifique áudio compatível com seu navegador, analise picos e RMS e exporte um WAV PCM de 16 bits, mono ou estéreo.",
 batchGo:"Converter imagens ↗",
 batchClear:"Limpar",
 subtitleGo:"Converter e exportar ↗",
 subtitlePreview:"Prévia dos tempos",
 cvGo:"Analisar clareza ↗",
 cvExport:"Exportar relatório",
 addShot:"＋ Adicionar cena",
 exportShots:"Exportar CSV ↗",
 exportShotsJson:"Exportar JSON",
 paletteGo:"Extrair paleta ↗",
 paletteExport:"Exportar CSS",
 pdfGo:"Criar e baixar PDF ↗",
 audioGo:"Converter e baixar WAV ↗",
 batchDesc:"Convierte hasta 20 imágenes locales en PNG, JPEG o WebP sin deformarlas. Descarga una imagen o un ZIP compatible con los programas habituales.",
 subtitleDesc:"Convierte SRT/VTT, ajusta los tiempos y exporta transcripciones en texto. Necesita subtítulos existentes; no transcribe vídeos automáticamente.",
 cvDesc:"Revisión local y orientativa del texto: estructura, datos de contacto y resultados verificables. No inventa una puntuación ATS ni predice contrataciones.",
 storyDesc:"Planifica planos de reels, videoclips y campañas: duración, cámara, movimientos, sonido e intención creativa.",
 paletteDesc:"Extrae colores aproximados de una imagen local y exporta variables CSS reutilizables. No sustituye la medición colorimétrica.",
 pdfDesc:"Combina fotografías y capturas locales en un PDF A4, una por página. El navegador recrea el JPEG sin conservar los metadatos originales.",
 audioDesc:"Decodifica audio compatible con tu navegador, analiza picos y RMS y exporta un WAV PCM de 16 bits, mono o estéreo.",
 batchGo:"Convertir imágenes ↗",
 batchClear:"Limpiar",
 subtitleGo:"Convertir y exportar ↗",
 subtitlePreview:"Previsualizar tiempos",
 cvGo:"Revisar claridad ↗",
 cvExport:"Exportar informe",
 addShot:"＋ Añadir plano",
 exportShots:"Exportar CSV ↗",
 exportShotsJson:"Exportar JSON",
 paletteGo:"Extraer paleta ↗",
 paletteExport:"Exportar CSS",
 pdfGo:"Crear y descargar PDF ↗",
 audioGo:"Convertir y descargar WAV ↗"
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