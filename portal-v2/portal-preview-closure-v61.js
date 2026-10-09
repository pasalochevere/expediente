/* Public-preview usability only: no checkout, licence or price mutations. */
(()=>{
if(window.__pcPreviewClosureV61)return;window.__pcPreviewClosureV61=true;

/* V6.2 guard: the unified Matemática card has delegated + local preview events.
   Collapse duplicate opens in the same interaction so body scroll state remains correct. */
function installOpenGuard(){
 const current=window.pcOpenRealPreview;
 if(typeof current!=='function'||current.__pcOpenGuardV62)return false;
 let lastCode='',lastAt=-Infinity;
 const wrapped=function(code){
  const now=performance.now();
  if(String(code||'')===lastCode&&now-lastAt<180)return true;
  lastCode=String(code||'');lastAt=now;
  return current.apply(this,arguments);
 };
 wrapped.__pcOpenGuardV62=true;
 window.pcOpenRealPreview=wrapped;
 return true;
}

function enhance(){
 installOpenGuard();
 const modal=document.getElementById('pcRealPreviewModal');if(!modal||modal.classList.contains('hidden'))return;
 const slides=[...modal.querySelectorAll('.pcRv2Slide')];
 slides.forEach(s=>{const hidden=!s.classList.contains('active');if(s.getAttribute('aria-hidden')!==String(hidden))s.setAttribute('aria-hidden',String(hidden))});
 modal.querySelectorAll('.pcRv2Thumb').forEach(b=>{const val=String(b.classList.contains('active'));if(b.getAttribute('aria-pressed')!==val)b.setAttribute('aria-pressed',val)});
 const price=modal.querySelector('#pcRv2Price');if(price?.textContent==='Según catálogo')price.textContent='Precio a consultar';
 const info=modal.querySelector('.pcRv2Info');
 if(info&&!info.querySelector('.pc61Terms')){const p=document.createElement('p');p.className='pc61Terms';info.appendChild(p)}
 const title=modal.querySelector('#pcRv2Title')?.textContent||'';
 const txt=/Matemática|Verdad o Reto|Víncores/.test(title)?'El importe del portal corresponde al acceso digital. Las piezas físicas se ofrecen según la publicación de compra. Vigencia según el acceso adquirido.':'Vigencia y condiciones según el acceso adquirido.';
 const terms=info?.querySelector('.pc61Terms');if(terms&&terms.textContent!==txt)terms.textContent=txt;
 if(modal.dataset.pcClosure61)return;modal.dataset.pcClosure61='1';
 const stage=modal.querySelector('.pcRv2StageWrap');
 if(stage&&!stage.dataset.pcSwipe21c){stage.dataset.pcSwipe21c='1';stage.style.touchAction='pan-y';let x=0,y=0;stage.addEventListener('touchstart',e=>{const t=e.touches[0];if(t){x=t.clientX;y=t.clientY}},{passive:true});stage.addEventListener('touchend',e=>{const t=e.changedTouches[0];if(!t)return;const dx=t.clientX-x,dy=t.clientY-y;if(Math.abs(dx)>48&&Math.abs(dx)>Math.abs(dy)*1.15)modal.querySelector(`[data-dir="${dx<0?1:-1}"]`)?.click()},{passive:true})}
 modal.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const a=[...modal.querySelectorAll('button,a,input,[tabindex="0"]')].filter(n=>!n.disabled&&n.offsetParent!==null);if(!a.length)return;if(e.shiftKey&&document.activeElement===a[0]){e.preventDefault();a.at(-1).focus()}else if(!e.shiftKey&&document.activeElement===a.at(-1)){e.preventDefault();a[0].focus()}});
}
let queued=false;const queue=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;enhance()})};new MutationObserver(queue).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});enhance();
if(!installOpenGuard()){let tries=0;const timer=setInterval(()=>{if(installOpenGuard()||++tries>30)clearInterval(timer)},100)}
})();

/* V6.3 · CASO 001 COMMERCIAL PREVIEW REBUILD
   Reemplaza el recorte borroso de estudio por un title master compuesto con material real,
   manteniendo la política no-spoiler del producto. */
(()=>{
 if(window.__pcExp001CommercialV63)return;window.__pcExp001CommercialV63=true;
 const V='20261009-v63';
 const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase();
 let queued=false,applying=false;
 const scene=n=>`../caso001/assets/escenas/${n}.jpg?v=${V}`;

 function ensureStyle(){
  if(document.getElementById('pc-exp001-commercial-v63-style'))return;
  const st=document.createElement('style');st.id='pc-exp001-commercial-v63-style';st.textContent=`
   .pcV63ExpArt{position:absolute;inset:0;z-index:2;overflow:hidden;background:#08090a;color:#f2eadf;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif}
   .pcV63ExpShots{position:absolute;inset:0;display:grid;grid-template-columns:1.16fr .84fr;gap:3px;background:#08090a;filter:saturate(.82) contrast(1.08)}
   .pcV63ExpShot{background-position:center;background-size:cover;min-width:0;min-height:0}
   .pcV63ExpLeft{background-image:url('${scene('pasillo-acceso')}');background-position:center 55%}
   .pcV63ExpRight{display:grid;grid-template-rows:1fr 1fr;gap:3px}.pcV63ExpStudy{background-image:url('${scene('estudio')}');background-position:center 48%}.pcV63ExpRoom{background-image:url('${scene('sala-estar')}');background-position:center 55%}
   .pcV63ExpShade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(5,7,8,.91) 0%,rgba(5,7,8,.72) 38%,rgba(5,7,8,.26) 66%,rgba(5,7,8,.18) 100%),linear-gradient(180deg,rgba(0,0,0,.06),rgba(0,0,0,.48));box-shadow:inset 0 0 70px rgba(0,0,0,.45)}
   .pcV63ExpCopy{position:absolute;left:27px;top:24px;z-index:3;width:59%;text-shadow:0 2px 14px rgba(0,0,0,.65)}
   .pcV63ExpCopy small{display:block;color:#e0b75c;font-size:.58rem;font-weight:950;letter-spacing:.15em}.pcV63ExpCopy strong{display:block;margin-top:8px;font:700 clamp(1.72rem,3.4vw,2.65rem)/.88 Georgia,serif;letter-spacing:-.035em}.pcV63ExpCopy strong em{display:block;color:#e7c66f;font-style:normal}.pcV63ExpCopy span{display:block;margin-top:10px;color:#eee6dc;font-size:.61rem;font-weight:900;letter-spacing:.075em}
   .pcV63ExpMark{position:absolute;right:18px;top:16px;z-index:3;width:46px;height:46px;border:1px solid rgba(225,188,102,.42);border-radius:50%;display:grid;place-items:center;color:rgba(229,194,113,.78);font:700 1.05rem Georgia,serif;background:rgba(6,7,8,.36);backdrop-filter:blur(4px)}
   .pcLiveMediaV62-exp001 .pcLiveBadgeV62{z-index:5}.pcLiveMediaV62-exp001::after{display:none!important}
   .pcRv2Ui.pcV63ExpPreview{padding:0!important;background:#08090a!important}.pcRv2Ui.pcV63ExpPreview .pcV63ExpArt{position:absolute}
   @media(max-width:620px){.pcV63ExpCopy{left:19px;top:18px;width:68%}.pcV63ExpCopy strong{font-size:1.75rem}.pcV63ExpCopy span{font-size:.53rem}.pcV63ExpMark{width:38px;height:38px;right:12px;top:12px}}
  `;document.head.appendChild(st);
 }

 function art(){return `<div class="pcV63ExpArt"><div class="pcV63ExpShots"><div class="pcV63ExpShot pcV63ExpLeft"></div><div class="pcV63ExpRight"><div class="pcV63ExpShot pcV63ExpStudy"></div><div class="pcV63ExpShot pcV63ExpRoom"></div></div></div><div class="pcV63ExpShade"></div><div class="pcV63ExpCopy"><small>EXPEDIENTES · CASO 001</small><strong>La Última<em>Reunión.</em></strong><span>INVESTIGÁ · CONECTÁ · RESOLVÉ</span></div><div class="pcV63ExpMark">001</div></div>`}

 function patchProduct(){
  const p=window.PC_REAL_PREVIEWS_V2?.['EXP-001'];if(!p||p.__v63)return false;
  p.title='La Última Reunión';
  p.subtitle='Caso 001 · investigación multijugador · sin spoilers';
  p.summary='Una investigación multijugador con escenas, sospechosos, evidencias, progresión y acusación final. La preview usa material real del caso sin revelar la solución.';
  const rest=(p.slides||[]).filter((s,i)=>i>0).slice(0,3);
  p.slides=[{kind:'ui',label:'Caso 001 · La Última Reunión',note:'Title master comercial construido con escenas reales del caso y criterio no-spoiler.',render:()=>`<div class="pcRv2Ui pcV63ExpPreview">${art()}</div>`,thumbHtml:'<div style="position:absolute;inset:0;background:linear-gradient(135deg,#17100d,#060708);display:grid;place-items:center;color:#d8b35d;font:800 .72rem/1 Inter,system-ui">CASO 001</div>'},...rest];
  p.__v63=true;return true;
 }

 function isCase001(card){const t=norm(card?.textContent||'');return card?.dataset?.productCode==='EXP-001'||(t.includes('CASO 001')&&t.includes('ULTIMA REUNION'))}
 function patchCard(){
  const card=[...document.querySelectorAll('#drawer-mystery .drawerGrid > .card:not(.pcComingCard)')].find(isCase001);if(!card)return false;
  card.classList.add('pcLiveUnifiedV62','pcExp001V63');
  let media=card.querySelector(':scope > .pcLiveMediaV62');
  if(!media){media=document.createElement('div');media.className='pcLiveMediaV62 pcLiveMediaV62-exp001';card.insertBefore(media,card.firstChild)}
  media.classList.add('pcLiveMediaV62-exp001');
  if(!media.querySelector('.pcV63ExpArt'))media.innerHTML=art()+'<span class="pcLiveBadgeV62">PREVIEW DEL PRODUCTO</span>';
  const h=card.querySelector('h3');if(h&&norm(h.textContent)!=='LA ULTIMA REUNION')h.textContent='LA ÚLTIMA REUNIÓN';
  const a=card.querySelector('.accent');if(a)a.textContent='CASO 001 · INVESTIGACIÓN MULTIJUGADOR';
  const p=card.querySelector('p');if(p)p.textContent='Investigación multijugador con QR, roles privados, escenas, evidencias y kit imprimible.';
  return true;
 }

 function apply(){if(applying)return;applying=true;try{ensureStyle();patchProduct();patchCard()}finally{applying=false}}
 function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})}
 new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
 schedule();[250,700,1400,2800].forEach(ms=>setTimeout(schedule,ms));
})();
