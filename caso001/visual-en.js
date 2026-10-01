// EXP01-EN4 · Visual Language Audit · Caso 001
// Presentation-only image localization. No game state or multiplayer payloads are changed.
const VISUAL_VARIANTS=Object.freeze([
  ['assets/personajes/santiago.jpg','assets-en/personajes/santiago.svg'],
  ['assets/personajes/clara.jpg','assets-en/personajes/clara.svg'],
  ['assets/personajes/vera.jpg','assets-en/personajes/vera.svg'],
  ['assets/personajes/mateo.jpg','assets-en/personajes/mateo.svg'],
  ['assets/personajes/ines.jpg','assets-en/personajes/ines.svg'],
  ['assets/personajes/tomas.jpg','assets-en/personajes/tomas.svg'],
  ['assets/objetos/cuaderno.jpg','assets-en/objetos/cuaderno.svg']
]);

function currentVisualLanguage(){return typeof document!=='undefined'&&document.documentElement.lang==='en'?'en':'es'}

function translatedSrc(src,language=currentVisualLanguage()){
  const value=String(src||'');
  for(const [es,en] of VISUAL_VARIANTS){
    if(value.includes(es)) return language==='en'?value.replace(es,en):value;
    if(value.includes(en)) return language==='en'?value:value.replace(en,es);
  }
  return value;
}

function localizeImage(img){
  if(!img||img.nodeType!==Node.ELEMENT_NODE||img.tagName!=='IMG')return;
  const current=img.getAttribute('src')||'';
  const next=translatedSrc(current,currentVisualLanguage());
  if(next!==current)img.setAttribute('src',next);
}

export function applyVisualLocalization(root=document){
  if(typeof document==='undefined'||!root)return;
  if(root.nodeType===Node.ELEMENT_NODE&&root.tagName==='IMG')localizeImage(root);
  root.querySelectorAll?.('img[src]').forEach(localizeImage);
}

let observer=null,bound=false;
export function bindVisualLocalization(root=document){
  applyVisualLocalization(root);
  if(!bound&&typeof window!=='undefined'){
    bound=true;
    window.addEventListener('expedientes:languagechange',()=>applyVisualLocalization(document));
  }
  if(!observer&&typeof document!=='undefined'&&typeof MutationObserver!=='undefined'){
    observer=new MutationObserver(mutations=>{
      for(const m of mutations){
        if(m.type==='attributes'&&m.target?.tagName==='IMG')localizeImage(m.target);
        m.addedNodes?.forEach(n=>applyVisualLocalization(n));
      }
    });
    observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['src']});
  }
}

export function visualLocalizationStats(){
  return {auditedVariants:VISUAL_VARIANTS.length,scenesReused:6,objectsReused:5,portraitsLocalized:6,objectsLocalized:1};
}
