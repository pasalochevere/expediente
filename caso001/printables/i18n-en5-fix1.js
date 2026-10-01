// EXP01-EN5 FIX1 · split cover-title nodes in the printable master.
// Presentation only; loaded after i18n-en5.js.
const PAIRS=Object.freeze([
  ['LA ÚLTIMA','THE LAST'],
  ['REUNIÓN','MEETING']
]);
const ES_TO_EN=new Map(PAIRS);
const EN_TO_ES=new Map(PAIRS.map(([es,en])=>[en,es]));

function lang(){return document.documentElement.lang==='en'?'en':'es'}
function apply(root=document){
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  let node=walker.nextNode();
  while(node){
    const raw=node.nodeValue||'';
    const core=raw.trim();
    const next=(lang()==='en'?ES_TO_EN:EN_TO_ES).get(core);
    if(next){
      const lead=raw.match(/^\s*/)?.[0]||'';
      const tail=raw.match(/\s*$/)?.[0]||'';
      node.nodeValue=lead+next+tail;
    }
    node=walker.nextNode();
  }
}

window.addEventListener('expedientes:languagechange',()=>queueMicrotask(()=>apply(document)));
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>queueMicrotask(()=>apply(document)),{once:true});
else queueMicrotask(()=>apply(document));
