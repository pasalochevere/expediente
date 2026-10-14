(()=>{
'use strict';
if(window.PSQ_BASELINE_V298)return;
const RELEASE='2.9.8';
const pairs=[
 ['Abriendo la fábrica completa · 60 personajes · 6 colecciones · Creator Plus','Opening the full factory · 60 characters · 6 collections · Creator Plus'],
 ['Seis mundos para crear','Six worlds to create'],
 ['XL: frente y dorso se imprimen en 2 hojas A4, una por hoja.','XL: front and back print on 2 A4 sheets, one per sheet.'],
 ['PACK COMPLETO · 60 PERSONAJES','COMPLETE PACK · 60 CHARACTERS'],
 ['6 colecciones · 60 personajes · 240 láminas. Frente + dorso + coloring frente + coloring dorso.','6 collections · 60 characters · 240 sheets. Front + back + coloring front + coloring back.'],
 ['60 PERSONAJES','60 CHARACTERS'],
 ['6 COLECCIONES','6 COLLECTIONS'],
 ['240 LÁMINAS','240 SHEETS'],
 ['DESCARGAR LOS 60 PERSONAJES','DOWNLOAD ALL 60 CHARACTERS']
];
const forward=[...pairs].sort((a,b)=>b[0].length-a[0].length),reverse=pairs.map(([a,b])=>[b,a]).sort((a,b)=>b[0].length-a[0].length);
const lang=()=>String(document.documentElement.lang||window.PSQ_I18N?.lang||'es').toLowerCase().startsWith('en')?'en':'es';
let applying=false,timer=null;
function translate(s){let out=String(s||'');for(const [a,b] of (lang()==='en'?forward:reverse)){if(a&&out.includes(a))out=out.split(a).join(b)}return out}
function apply(root=document.body){if(applying||!root)return;applying=true;try{const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(w.nextNode())nodes.push(w.currentNode);for(const n of nodes){if(n.parentElement?.closest('script,style,noscript,template,code,pre,[data-psq-no-i18n]'))continue;const v=translate(n.nodeValue);if(v!==n.nodeValue)n.nodeValue=v}for(const a of document.querySelectorAll('a[href*="downloads.html"]')){try{const u=new URL(a.getAttribute('href'),location.href);if(/\/paper-squishy\/downloads\.html$/.test(u.pathname)){u.pathname=u.pathname.replace(/downloads\.html$/,'downloads-v298.html');u.searchParams.set('lang',lang());a.href=u.href}}catch{}}}finally{applying=false}}
function schedule(){clearTimeout(timer);timer=setTimeout(()=>apply(),30)}
window.addEventListener('psq:languagechange',()=>setTimeout(()=>apply(),40));
const mo=new MutationObserver(()=>{if(!applying)schedule()});
if(document.documentElement)mo.observe(document.documentElement,{childList:true,subtree:true,characterData:true});
const nativeOpen=window.open?.bind(window);
if(nativeOpen&&!window.__PSQ_OPEN_GUARD_298){window.__PSQ_OPEN_GUARD_298=true;window.open=(...args)=>{const w=nativeOpen(...args);if(!w)setTimeout(()=>alert(lang()==='en'?'Your browser blocked the print window. Allow pop-ups for this site and try again.':'Tu navegador bloqueó la ventana de impresión. Permití las ventanas emergentes para este sitio y volvé a intentar.'),0);return w}}
window.PSQ_BASELINE_V298={active:true,release:RELEASE,i18nCurrent:true,popupGuard:true,downloadsWrapper:true,apply};
setTimeout(apply,0);setTimeout(apply,300);
console.info('[PSQ 2.9.8] QA baseline cleanup activo',window.PSQ_BASELINE_V298);
})();
