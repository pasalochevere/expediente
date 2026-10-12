(()=>{
'use strict';
const LIB=window.PS_LIBRARY;
if(!LIB||!Array.isArray(LIB.characters))return;
const isEN=String(document.documentElement.lang||'es').toLowerCase().startsWith('en');
const ORDER=['hero','front_print','back_print','coloring','coloring_back','editor_asset','character_card','tutorial','mockup'];
const LABELS={
 hero:isEN?'HERO':'HERO',
 front_print:isEN?'FRONT':'FRENTE',
 back_print:isEN?'BACK':'DORSO',
 coloring:isEN?'COLORING · FRONT':'COLOREAR · FRENTE',
 coloring_back:isEN?'COLORING · BACK':'COLOREAR · DORSO',
 editor_asset:isEN?'EDITOR':'EDITOR',
 character_card:isEN?'CHARACTER CARD':'FICHA DEL PERSONAJE',
 tutorial:isEN?'TUTORIAL':'TUTORIAL',
 mockup:isEN?'FINISHED EXAMPLE':'EJEMPLO TERMINADO'
};
const DESC={
 hero:isEN?'Character preview':'Vista principal del personaje',
 front_print:isEN?'Printable front · A4':'Frente imprimible · A4',
 back_print:isEN?'Printable back · A4':'Dorso imprimible · A4',
 coloring:isEN?'Front coloring sheet · A4':'Frente para colorear · A4',
 coloring_back:isEN?'Back coloring sheet · A4':'Dorso para colorear · A4',
 editor_asset:isEN?'Creator Plus editable asset':'Asset editable para Creator Plus',
 character_card:isEN?'Character card':'Ficha del personaje',
 tutorial:isEN?'Assembly guide':'Guía de armado',
 mockup:isEN?'Finished reference':'Referencia terminada'
};
const SHEETS=new Set(['front_print','back_print','coloring','coloring_back','character_card','tutorial']);
let state={open:false,ch:null,index:0};

const css=document.createElement('style');
css.id='psq-v28-style';
css.textContent=`
#psqV28{position:fixed;inset:0;z-index:9999;background:#fffaf2;display:none;overflow:auto;color:#34251f;font-family:Inter,system-ui,-apple-system,Segoe UI,Arial,sans-serif}
#psqV28.on{display:block}
#psqV28 .v28-top{position:sticky;top:0;z-index:5;min-height:72px;padding:10px clamp(14px,3vw,38px);display:flex;align-items:center;justify-content:space-between;gap:16px;background:rgba(255,250,242,.96);backdrop-filter:blur(14px);border-bottom:1px solid #eadfd4}
#psqV28 .v28-title{text-align:left;min-width:0}#psqV28 .v28-kicker{font-size:10px;font-weight:1000;letter-spacing:.12em;color:#ff7867}#psqV28 h2{font-size:clamp(24px,3vw,40px);margin:2px 0 0;line-height:1}#psqV28 .v28-close{border:2px solid #34251f;background:white;border-radius:14px;padding:10px 14px;font-weight:900}
#psqV28 .v28-wrap{max-width:1320px;margin:auto;padding:18px clamp(12px,3vw,30px) 36px}
#psqV28 .v28-meta{text-align:center;margin:2px auto 12px}#psqV28 .v28-meta b{display:block;font-size:17px}#psqV28 .v28-meta span{font-size:12px;color:#806f64}
#psqV28 .v28-stage{position:relative;min-height:clamp(470px,64vh,720px);border:1px solid #eadfd4;border-radius:30px;background:#fff;box-shadow:0 16px 46px rgba(74,52,38,.08);display:grid;grid-template-columns:76px minmax(0,1fr) 76px;align-items:center;gap:10px;padding:18px}
#psqV28 .v28-media{height:clamp(430px,60vh,670px);display:grid;place-items:center;min-width:0}
#psqV28 .v28-media img{display:block;object-fit:contain;object-position:center;width:auto;height:auto;max-width:100%;max-height:100%;border-radius:18px}
#psqV28 .v28-media.sheet img{max-height:min(64vh,650px);max-width:min(92%,520px);background:white;border:1px solid #efe6dc;padding:6px;box-shadow:0 8px 24px rgba(62,43,32,.06)}
#psqV28 .v28-media.art img{max-height:min(58vh,590px);max-width:min(86%,620px);background:#fffaf2;padding:14px}
#psqV28 .v28-arrow{width:58px;height:58px;border:2px solid #34251f;border-radius:50%;background:#fff;display:grid;place-items:center;font-size:32px;line-height:1;box-shadow:4px 4px 0 #34251f;justify-self:center}
#psqV28 .v28-count{margin:12px auto 14px;width:max-content;padding:7px 13px;border:1px solid #eadfd4;border-radius:999px;background:#fff2d8;font-weight:1000}
#psqV28 .v28-thumbs{display:grid;grid-template-columns:repeat(9,minmax(0,1fr));gap:10px;align-items:stretch}
#psqV28 .v28-thumb{border:2px solid transparent;border-radius:18px;background:#fff;padding:7px;min-width:0;box-shadow:0 6px 18px rgba(74,52,38,.05)}
#psqV28 .v28-thumb.active{border-color:#ff7867;background:#fff5f1}.v28-thumb img{display:block;width:100%;height:138px;object-fit:contain;object-position:center;background:#fffdfa;border:1px solid #f0e7dc;border-radius:12px;padding:4px}.v28-thumb.sheet img{background:#fff}.v28-thumb span{display:flex;align-items:center;justify-content:center;text-align:center;min-height:34px;margin-top:5px;font-size:9px;line-height:1.1;font-weight:1000;color:#6e5b50}
#psqV28 .v28-actions{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-top:18px}.v28-action{border:2px solid #34251f;border-radius:16px;padding:12px 18px;font-weight:1000;background:#fff}.v28-action.primary{background:#ffd458;box-shadow:4px 4px 0 #34251f}
#psqV28 .v28-tip{max-width:760px;margin:12px auto 0;text-align:center;font-size:11px;color:#806f64}
#viewer.psq-v28-suppressed{visibility:hidden!important;pointer-events:none!important}
@media(max-width:1050px){#psqV28 .v28-stage{min-height:58vh;grid-template-columns:56px minmax(0,1fr) 56px}#psqV28 .v28-media{height:54vh}.v28-thumb img{height:112px}#psqV28 .v28-thumbs{grid-template-columns:repeat(5,1fr)}}
@media(max-width:680px){#psqV28 .v28-top{min-height:64px}#psqV28 .v28-wrap{padding:10px 8px 24px}#psqV28 .v28-stage{min-height:52vh;grid-template-columns:42px minmax(0,1fr) 42px;padding:8px;border-radius:22px}#psqV28 .v28-media{height:48vh}#psqV28 .v28-media.sheet img{max-width:96%;max-height:47vh}#psqV28 .v28-media.art img{max-width:94%;max-height:45vh}#psqV28 .v28-arrow{width:42px;height:42px;font-size:24px;box-shadow:2px 2px 0 #34251f}.v28-thumb img{height:92px}#psqV28 .v28-thumbs{display:flex;overflow-x:auto;padding-bottom:5px;scroll-snap-type:x mandatory}#psqV28 .v28-thumb{flex:0 0 116px;scroll-snap-align:start}#psqV28 .v28-thumb span{font-size:8px}}
@media print{#psqV28 .v28-top,#psqV28 .v28-meta,#psqV28 .v28-arrow,#psqV28 .v28-count,#psqV28 .v28-thumbs,#psqV28 .v28-actions,#psqV28 .v28-tip{display:none!important}#psqV28{position:static;background:white}#psqV28 .v28-wrap{padding:0}#psqV28 .v28-stage{border:0;box-shadow:none;padding:0;display:block;min-height:0}#psqV28 .v28-media{height:277mm}#psqV28 .v28-media img{max-width:190mm!important;max-height:277mm!important;margin:auto;padding:0!important;border:0!important;box-shadow:none!important}}
`;
document.head.appendChild(css);

const root=document.createElement('div');
root.id='psqV28';
root.innerHTML=`
 <div class="v28-top"><div class="v28-title"><div class="v28-kicker">PAPER SQUISHY FACTORY · 9 VISTAS</div><h2 id="v28Name">Personaje</h2></div><button class="v28-close" id="v28Close">${isEN?'BACK':'VOLVER AL PERSONAJE'} ×</button></div>
 <div class="v28-wrap">
  <div class="v28-meta"><b id="v28Label"></b><span id="v28Desc"></span></div>
  <div class="v28-stage"><button class="v28-arrow" id="v28Prev" aria-label="Anterior">←</button><div class="v28-media" id="v28Media"><img id="v28Image" alt=""></div><button class="v28-arrow" id="v28Next" aria-label="Siguiente">→</button></div>
  <div class="v28-count" id="v28Count">1 / 9</div>
  <div class="v28-thumbs" id="v28Thumbs"></div>
  <div class="v28-actions"><button class="v28-action primary" id="v28Print">🖨️ ${isEN?'PRINT THIS SHEET':'IMPRIMIR ESTA HOJA'}</button><button class="v28-action" id="v28Back">← ${isEN?'BACK TO CHARACTER':'VOLVER AL PERSONAJE'}</button></div>
  <div class="v28-tip">${isEN?'Front, back and both coloring sheets are separate A4 views.':'Frente, dorso y ambas láminas para colorear son vistas A4 separadas.'}</div>
 </div>`;
document.body.appendChild(root);

const q=id=>document.getElementById(id);
const oldViewer=()=>document.getElementById('viewer');
function assetOf(ch,key){return ch?.assets?.[key]?.path||''}
function matchCharacterBySrc(src){if(!src)return null;src=String(src).split('?')[0];for(const ch of LIB.characters){for(const key of ORDER){const p=assetOf(ch,key);if(p&&src===String(p).split('?')[0])return ch;}}return null}
function matchCharacterByName(){const text=[...document.querySelectorAll('h1,h2,h3,[id*=Name],[id*=name]')].filter(x=>x.offsetParent!==null).map(x=>x.textContent.trim()).join(' · ');return LIB.characters.find(ch=>text.includes(ch.name))||null}
function detectCharacter(){
 const ov=oldViewer();
 if(ov){for(const img of ov.querySelectorAll('img')){const ch=matchCharacterBySrc(img.currentSrc||img.src);if(ch)return ch;}}
 for(const img of [...document.images].filter(i=>i.offsetParent!==null)){const ch=matchCharacterBySrc(img.currentSrc||img.src);if(ch)return ch;}
 return matchCharacterByName();
}
function viewIndexFromSrc(ch,src){src=String(src||'').split('?')[0];const i=ORDER.findIndex(k=>String(assetOf(ch,k)).split('?')[0]===src);return i>=0?i:0}
function render(){
 const ch=state.ch;if(!ch)return;
 const key=ORDER[state.index],src=assetOf(ch,key);
 q('v28Name').textContent=ch.name||'Paper Squishy';q('v28Label').textContent=LABELS[key];q('v28Desc').textContent=DESC[key];q('v28Count').textContent=(state.index+1)+' / 9';
 const media=q('v28Media');media.className='v28-media '+(SHEETS.has(key)?'sheet':'art');const img=q('v28Image');img.src=src;img.alt=LABELS[key]+' · '+ch.name;
 q('v28Print').style.display=SHEETS.has(key)?'inline-block':'none';
 const thumbs=q('v28Thumbs');thumbs.innerHTML='';
 ORDER.forEach((k,i)=>{const p=assetOf(ch,k);if(!p)return;const b=document.createElement('button');b.className='v28-thumb '+(SHEETS.has(k)?'sheet ':'')+(i===state.index?'active':'');b.innerHTML='<img alt=""><span></span>';b.querySelector('img').src=p;b.querySelector('img').alt=LABELS[k];b.querySelector('span').textContent=LABELS[k];b.onclick=()=>{state.index=i;render();setTimeout(()=>b.scrollIntoView({block:'nearest',inline:'nearest',behavior:'smooth'}),0)};thumbs.appendChild(b)});
}
function open(ch,index=0){if(!ch)return;state={open:true,ch,index:Math.max(0,Math.min(8,index))};const ov=oldViewer();if(ov)ov.classList.add('psq-v28-suppressed');root.classList.add('on');document.documentElement.style.overflow='hidden';render();}
function close(){state.open=false;root.classList.remove('on');document.documentElement.style.overflow='';const ov=oldViewer();if(ov){ov.classList.remove('psq-v28-suppressed');ov.classList.add('hidden');ov.style.display='';}}
function move(d){state.index=(state.index+d+9)%9;render()}
q('v28Prev').onclick=()=>move(-1);q('v28Next').onclick=()=>move(1);q('v28Close').onclick=close;q('v28Back').onclick=close;
q('v28Print').onclick=()=>window.print();
window.addEventListener('keydown',e=>{if(!state.open)return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')move(-1);if(e.key==='ArrowRight')move(1)});

function patchEntryButtons(){
 const gallery=document.getElementById('galleryBtn');if(gallery&&!gallery.dataset.v28){gallery.dataset.v28='1';gallery.addEventListener('click',e=>{const ch=detectCharacter();if(!ch)return;e.preventDefault();e.stopImmediatePropagation();open(ch,0)},true);const b=gallery.querySelector('b'),s=gallery.querySelector('small');if(b)b.textContent=isEN?'View gallery · 9 views':'Ver galería · 9 vistas';if(s)s.textContent=isEN?'Complete 9-view character gallery':'Galería completa de 9 vistas';}
 const color=document.getElementById('colorBtn');if(color&&!color.dataset.v28){color.dataset.v28='1';color.addEventListener('click',e=>{const ch=detectCharacter();if(!ch)return;e.preventDefault();e.stopImmediatePropagation();open(ch,3)},true);}
 let cb=document.getElementById('colorBackBtn');if(!cb&&color){cb=color.cloneNode(true);cb.id='colorBackBtn';color.insertAdjacentElement('afterend',cb)}
 if(cb&&!cb.dataset.v28){cb.dataset.v28='1';const b=cb.querySelector('b'),s=cb.querySelector('small');if(b)b.textContent=isEN?'Color the back':'Colorear dorso';if(s)s.textContent=isEN?'Open the back coloring sheet':'Abrir el dorso para colorear';cb.addEventListener('click',e=>{const ch=detectCharacter();if(!ch)return;e.preventDefault();e.stopImmediatePropagation();open(ch,4)},true);}
 for(const el of document.querySelectorAll('span,b,small,div')){if(el.children.length)continue;const t=el.textContent.trim();if(t==='8 ASSETS')el.textContent='9 ASSETS';if(/^[1-8]\s*\/\s*8$/.test(t))el.textContent=t.replace('/ 8','/ 9');}
}

const mo=new MutationObserver(()=>{
 patchEntryButtons();
 const ov=oldViewer();if(state.open)return;
 if(ov&&ov.offsetParent!==null&&!ov.classList.contains('hidden')&&!ov.classList.contains('psq-v28-suppressed')){
  const ch=detectCharacter();if(!ch)return;let idx=0;const imgs=[...ov.querySelectorAll('img')].filter(i=>i.offsetParent!==null);if(imgs.length){const main=imgs.sort((a,b)=>b.getBoundingClientRect().width*b.getBoundingClientRect().height-a.getBoundingClientRect().width*a.getBoundingClientRect().height)[0];idx=viewIndexFromSrc(ch,main.currentSrc||main.src)}open(ch,idx);
 }
});
mo.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style','src']});
patchEntryButtons();
window.PSQ_V28={open:(id,index=0)=>{const ch=LIB.characters.find(c=>c.id===id||c.code===id||c.slug===id);if(ch)open(ch,index)},close,version:'2.8'};
console.info('[PSQ 2.8] visor independiente activo · 9 vistas');
})();