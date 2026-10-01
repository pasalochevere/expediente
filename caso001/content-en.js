// EXP01-EN3 · Complete visible game-content localization layer for Caso 001.
// Presentation-only. It never mutates room state, multiplayer payloads, licenses or Crime Packs.
// Language follows the canonical document <html lang> set by i18n.js, avoiding a second module state.
import {CORE_CONTENT_PAIRS,CORE_DYNAMIC_TRANSLATORS} from './content-en-core.js';
import {PACK_CONTENT_PAIRS_01_04} from './content-en-packs-01-04.js';
import {PACK_CONTENT_PAIRS_05_08} from './content-en-packs-05-08.js';
import {PACK_CONTENT_PAIRS_09_12} from './content-en-packs-09-12.js';

const ALL_PAIRS=Object.freeze([
  ...CORE_CONTENT_PAIRS,
  ...PACK_CONTENT_PAIRS_01_04,
  ...PACK_CONTENT_PAIRS_05_08,
  ...PACK_CONTENT_PAIRS_09_12
]);
const ES_TO_EN=new Map(ALL_PAIRS);
const EN_TO_ES=new Map(ALL_PAIRS.map(([es,en])=>[en,es]));

function presentationLanguage(){
  if(typeof document==='undefined')return 'es';
  return String(document.documentElement?.lang||'es').toLowerCase()==='en'?'en':'es';
}
function preserveOuterWhitespace(original,replacement){
  const m=String(original).match(/^(\s*)([\s\S]*?)(\s*)$/);
  return `${m?.[1]||''}${replacement}${m?.[3]||''}`;
}

export function translateGameContent(value,language=presentationLanguage()){
  const original=String(value??'');
  if(!original.trim()) return original;
  const core=original.trim();
  const exact=(language==='en'?ES_TO_EN:EN_TO_ES).get(core);
  let translated=exact;
  if(translated===undefined){
    translated=language==='en'?CORE_DYNAMIC_TRANSLATORS.toEnglish(core):CORE_DYNAMIC_TRANSLATORS.toSpanish(core);
  }
  return translated===core?original:preserveOuterWhitespace(original,translated);
}

function skipNode(node){
  const p=node?.parentElement;
  return !p||!!p.closest('script,style,noscript,textarea,input,select,option');
}
function localizeTextNode(node){
  if(!node||node.nodeType!==Node.TEXT_NODE||skipNode(node))return;
  const next=translateGameContent(node.nodeValue,presentationLanguage());
  if(next!==node.nodeValue)node.nodeValue=next;
}
function localizeAttributes(el){
  if(!el||el.nodeType!==Node.ELEMENT_NODE)return;
  for(const attr of ['alt','title','aria-label']){
    if(!el.hasAttribute(attr))continue;
    const value=el.getAttribute(attr)||'';
    const next=translateGameContent(value,presentationLanguage());
    if(next!==value)el.setAttribute(attr,next);
  }
}
export function applyGameContentTranslations(root=document){
  if(typeof document==='undefined'||!root)return;
  if(root.nodeType===Node.TEXT_NODE){localizeTextNode(root);return}
  if(root.nodeType===Node.ELEMENT_NODE)localizeAttributes(root);
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT);
  let node=walker.currentNode;
  while(node){
    if(node.nodeType===Node.TEXT_NODE)localizeTextNode(node);
    else localizeAttributes(node);
    node=walker.nextNode();
  }
}

let observer=null,listenerBound=false;
export function bindGameContentLocalization(root=document){
  applyGameContentTranslations(root);
  if(!listenerBound&&typeof window!=='undefined'){
    listenerBound=true;
    window.addEventListener('expedientes:languagechange',()=>applyGameContentTranslations(document));
  }
  if(!observer&&typeof document!=='undefined'&&typeof MutationObserver!=='undefined'){
    observer=new MutationObserver(mutations=>{
      for(const m of mutations){
        if(m.type==='characterData')localizeTextNode(m.target);
        if(m.type==='attributes')localizeAttributes(m.target);
        m.addedNodes?.forEach(n=>applyGameContentTranslations(n));
      }
    });
    observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['alt','title','aria-label']});
  }
}

export function contentTranslationStats(){
  return {pairs:ALL_PAIRS.length,uniqueEs:ES_TO_EN.size,uniqueEn:EN_TO_ES.size};
}
