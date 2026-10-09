/* Final available-product gallery batch; uses original Kids SVG assets. */
(()=>{
if(window.__pcPreviewPremiumV60)return;
const A='../torre-kids-matematica/assets/';
const pic=(file,alt,cls='')=>`<img class="${cls}" src="${A+file}.svg" alt="${alt}" loading="lazy">`;
const tag=s=>`<div class="pc59Kicker">${s}</div>`;
const title=(a,b)=>`<h3 class="pc59Title">${a}<br><em>${b}</em></h3>`;
const foot=s=>`<div class="pc59Foot">${s}</div>`;
const wrap=(theme,s)=>`<div class="pc59 pc60 pc60-${theme}">${s}</div>`;
const steps=a=>`<div class="pc59Steps">${a.map(([t,d],i)=>`<div><span>0${i+1}</span><section><b>${t}</b><p>${d}</p></section></div>`).join('')}</div>`;
const cats=[['calculo','Cálculo'],['multiplicacion','Multiplicación'],['logica','Lógica'],['problemas','Problemas'],['velocidad','Velocidad'],['super','Súper desafío']];
const mathCover=d=>wrap('math',`${tag('PASALOCHEVERE · 7–9 AÑOS')}${title('Chévere Kids','Matemática.')}${pic('mascota-bloqui','Bloqui, mascota original de Chévere Kids','pc60Bloqui')}<p class="pc60Lead">Jugando<br>se aprende.</p><div class="pc60Mode">${d?'SOLO DIGITAL':'FÍSICO + DIGITAL'}</div>${foot(d?'CELULAR O TABLET · SIN TORRE FÍSICA':'TORRE + DESAFÍOS EN PANTALLA')}`);
const mathUse=d=>wrap('math',`${tag('CÓMO SE JUEGA · '+(d?'SIN TORRE':'CON TORRE'))}${title(d?'Un toque.':'Un bloque.','Un nuevo desafío.')}${steps(d?[['Sorteá una pieza virtual','El juego elige número, color y desafío.'],['Pensá y resolvé','Leé la consigna y buscá tu respuesta.'],['Seguí jugando','Probá otro desafío desde el celular o la tablet.']]:[['Retirá un bloque','Buscá en pantalla el número de la pieza.'],['Resolvé el desafío','Cada color propone una categoría.'],['Seguí construyendo','Volvé a la torre y continuá la partida.']])}${foot('RECORRIDO ILUSTRATIVO · NO REVELA LA BIBLIOTECA DE CONSIGNAS')}`);
const mathKit=d=>wrap('math',`${tag('QUÉ INCLUYE LA EXPERIENCIA')}${title('Seis maneras','de pensar.')}<div class="pc60Categories">${cats.map(([f,n])=>`<div>${pic('icon-'+f,'')}<b>${n}</b></div>`).join('')}</div><p class="pc60Note">${d?'Desafíos digitales con Bloqui.<br>No requiere torre física.':'Desafíos con Bloqui y dos modos de juego:<br>con torre o con piezas virtuales.'}</p>${foot(d?'ACCESO SOLO DIGITAL · 7–9 AÑOS':'MODALIDAD FÍSICO + DIGITAL · 7–9 AÑOS')}`);
const modes=()=>`<div class="pc60Modes">${[['KIDS','Para jugar en familia'],['GENERAL','Para compartir en grupo'],['FIESTA','Mayores de 18'],['SIN FILTRO','Mayores de 18']].map(([n,d])=>`<div><b>${n}</b><span>${d}</span></div>`).join('')}</div>`;
const partyCover=()=>wrap('party',`${tag('PASALOCHEVERE · FAMILIA & FIESTA')}${title('Verdad','o Reto.')}<div class="pc60Burst" aria-hidden="true">?!</div><div class="pc60Count"><b>+800</b><span>PREGUNTAS Y RETOS</span></div>${foot('KIDS · GENERAL · FIESTA +18 · SIN FILTRO +18')}`);
const partyUse=()=>wrap('party',`${tag('CÓMO SE JUEGA')}${title('Elegí el clima.','Que siga la ronda.')}${steps([['Elegí una versión','Kids, General, Fiesta o Sin Filtro.'],['Leé la consigna','Una pregunta o un reto por turno.'],['Pasá al siguiente turno','Compartí la ronda y mantené el ritmo del grupo.']])}${foot('ESQUEMA DE LA DINÁMICA · SIN CONSIGNAS DEL PRODUCTO')}`);
const partyKit=()=>wrap('party',`${tag('QUÉ INCLUYE')}${title('Cuatro versiones.','Mucho para jugar.')}${modes()}<p class="pc60Note">Más de 800 preguntas y retos.<br>Para jugar con torre o en modo digital.</p>${foot('FIESTA Y SIN FILTRO SON VERSIONES PARA MAYORES DE 18')}`);
const thumb=(theme,s)=>`<div class="pc59Thumb pc60-${theme}">${s}</div>`;
const slide=(theme,label,render,s)=>({kind:'ui',label,note:'',render,thumbHtml:thumb(theme,s)});
function patch(){const p=window.PC_REAL_PREVIEWS_V2;if(!p)return false;
for(const [key,d] of [['TK-MAT-79-PHY',false],['TK-MAT-79-DIG',true]]){if(!p[key])continue;p[key].slides=[slide('math',d?'Solo digital':'Con torre',()=>mathCover(d),d?'DIGITAL':'TORRE'),slide('math','Cómo se juega',()=>mathUse(d),'1·2·3'),slide('math','Qué incluye',()=>mathKit(d),'6')];p[key].summary=d?'Jugá con Bloqui desde el celular o la tablet. El juego sortea piezas virtuales y propone desafíos de seis categorías, sin necesitar una torre física.':'Retirá un bloque, buscá su número y resolvé el desafío con Bloqui. Esta modalidad permite jugar con torre y también con piezas virtuales.';p[key].__v21b=true;p[key].__v60=true;}
if(p['TORRE-MEGA']){const c=p['TORRE-MEGA'];c.slides=[slide('party','Verdad o Reto',partyCover,'+800'),slide('party','Cómo se juega',partyUse,'?!'),slide('party','Qué incluye',partyKit,'4')];c.summary='Más de 800 preguntas y retos en cuatro versiones: Kids, General, Fiesta y Sin Filtro. Elegí la adecuada para el grupo; Fiesta y Sin Filtro son para mayores de 18.';c.__v21b=true;c.__v60=true;}
window.__pcPreviewPremiumV60=true;return true;}
function covers(){document.querySelectorAll('.pcV4Cover[data-pc-cover-key]').forEach(c=>{const k=c.dataset.pcCoverKey;if(!['math','party'].includes(k)||c.querySelector('.pc60Poster'))return;const digital=k==='math'&&/solo digital/i.test(c.parentElement.textContent);c.classList.add('pc60Cover');c.insertAdjacentHTML('beforeend',k==='math'?`<div class="pc60Poster pc60-math"><small>7–9 AÑOS · ${digital?'SOLO DIGITAL':'FÍSICO + DIGITAL'}</small><strong>Chévere Kids<br><em>Matemática.</em></strong>${pic('mascota-bloqui','Bloqui')}<span>JUGANDO SE APRENDE</span></div>`:`<div class="pc60Poster pc60-party"><small>CUATRO VERSIONES PARA ELEGIR</small><strong>Verdad<br><em>o Reto.</em></strong><b>+800</b><span>KIDS · GENERAL · FIESTA +18 · SIN FILTRO +18</span></div>`);})}
function boot(){if(!patch())return false;covers();let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;covers()})}).observe(document.body,{childList:true,subtree:true});return true}
if(!boot()){let n=0;const t=setInterval(()=>{if(boot()||++n>60)clearInterval(t)},100)}
})();

/* V6.2 · LIVE PREVIEW UNIFICATION + CATALOG DEDUPE
   Unifica las cards disponibles con el lenguaje visual de Próximamente/Runas.
   No modifica licencias, catálogo, checkout ni juegos del usuario. */
(()=>{
  if(window.__pcLivePreviewUnifyV62)return;
  window.__pcLivePreviewUnifyV62=true;
  const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase();
  let applying=false,queued=false;

  function ensureStyle(){
    if(document.getElementById('pc-live-preview-unify-v62-style'))return;
    const st=document.createElement('style');
    st.id='pc-live-preview-unify-v62-style';
    st.textContent=`
      .categoryDrawer .card.pcLiveUnifiedV62:not(.pcComingCard){padding-top:0!important;overflow:hidden!important}
      .categoryDrawer .card.pcLiveUnifiedV62:not(.pcComingCard)> .pcV4Cover{display:none!important}
      .pcLiveMediaV62{position:relative;display:block;width:calc(100% + 36px);aspect-ratio:16/9;margin:0 -18px 16px;overflow:hidden;background:#09090b;border-bottom:1px solid rgba(214,176,91,.18);isolation:isolate}
      .pcLiveMediaV62>img{display:block;width:100%;height:100%;object-fit:cover;object-position:center;image-rendering:auto}
      .pcLiveMediaV62::after{content:'';position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(180deg,rgba(5,5,7,.02) 45%,rgba(5,5,7,.52) 100%)}
      .pcLiveBadgeV62{position:absolute;z-index:4;left:12px;bottom:11px;padding:6px 9px;border-radius:999px;background:rgba(8,8,10,.86);border:1px solid rgba(224,183,84,.48);color:#f2d17b;font-size:.59rem;font-weight:950;letter-spacing:.085em;backdrop-filter:blur(7px)}
      .pcLiveMediaV62.pcV62Contain>img{object-fit:contain;padding:18px;background:radial-gradient(circle at 72% 44%,#fff8d8 0,#e8f9f2 45%,#dff5fb 100%)}
      .pcV62MathArt{position:absolute;inset:0;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:14px;padding:26px 30px;background:linear-gradient(118deg,#e7faff 0%,#f8f8da 62%,#e8f5e5 100%);color:#14384b}
      .pcV62MathArt section{max-width:68%}.pcV62MathArt small{display:block;font-size:.64rem;font-weight:950;letter-spacing:.08em}.pcV62MathArt strong{display:block;margin-top:8px;font-size:clamp(1.6rem,3.2vw,2.55rem);line-height:.9;letter-spacing:-.05em}.pcV62MathArt strong em{font-style:normal;color:#008f9b}.pcV62MathArt img{width:min(32%,130px);height:auto;filter:drop-shadow(0 10px 9px rgba(34,70,70,.18))}
      .pcV62TarotArt{position:absolute;inset:0;z-index:2;padding:24px 28px;background:radial-gradient(circle at 80% 22%,rgba(174,120,207,.32),transparent 30%),linear-gradient(135deg,#342141,#120d18 68%,#08070b);color:#f4e7d4}
      .pcV62TarotArt small{font-size:.62rem;font-weight:950;letter-spacing:.11em;color:#e7c98a}.pcV62TarotArt strong{display:block;margin-top:8px;font:700 clamp(1.8rem,3.4vw,2.75rem)/.92 Georgia,serif}.pcV62TarotCards{position:absolute;right:8%;bottom:10%;display:flex;gap:8px;transform:rotate(-3deg)}.pcV62TarotCards i{display:grid;place-items:center;width:54px;aspect-ratio:.66;border:1px solid rgba(231,201,138,.55);border-radius:7px;background:linear-gradient(145deg,#6c5276,#26182f);box-shadow:0 12px 24px rgba(0,0,0,.35);font-style:normal;font-size:1.35rem}.pcV62TarotCards i:nth-child(2){transform:translateY(-12px)}
      .pcV62VincArt{position:absolute;inset:0;z-index:2;background:linear-gradient(90deg,rgba(13,43,34,.92) 0%,rgba(13,43,34,.72) 38%,rgba(13,43,34,.06) 72%),url('assets/previews-v58/vincores-kit.webp?v=20261009-v62') 78% 50%/62% auto no-repeat,#e8e4d9;color:#f2eee4;padding:25px 27px}.pcV62VincArt small{font-size:.61rem;font-weight:900;letter-spacing:.12em;color:#e3c77d}.pcV62VincArt strong{display:block;margin-top:8px;font:700 clamp(1.8rem,3.4vw,2.7rem)/.94 Georgia,serif}.pcV62VincArt strong span{display:block;margin-top:4px;font:800 .67rem/1.1 Inter,system-ui;letter-spacing:.18em}.pcV62VincArt p{margin:11px 0 0!important;max-width:46%;color:#d8dfd9!important;font-size:.72rem!important;line-height:1.35!important}
      .pcV62PartyArt{position:absolute;inset:0;z-index:2;padding:24px 28px;background:radial-gradient(circle at 78% 28%,rgba(255,188,86,.20),transparent 25%),linear-gradient(135deg,#6f342d,#401b2d 55%,#160d15);color:#fff2d8}.pcV62PartyArt small{font-size:.61rem;font-weight:950;letter-spacing:.1em}.pcV62PartyArt strong{display:block;margin-top:8px;font-size:clamp(1.9rem,3.7vw,3rem);line-height:.9}.pcV62PartyArt strong em{font-style:normal;color:#ffc568}.pcV62PartyArt b{position:absolute;right:9%;top:37%;font-size:clamp(2.3rem,5vw,4rem);color:rgba(255,192,104,.55)}
      .pcV62VariantBlock{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0 4px}.pcV62VariantBtn{appearance:none;border:1px solid rgba(214,176,91,.23);border-radius:12px;background:rgba(214,176,91,.055);color:#efe5d8;padding:10px 11px;text-align:left;cursor:pointer}.pcV62VariantBtn b{display:block;color:#e2bb61;font-size:.68rem}.pcV62VariantBtn span{display:block;margin-top:3px;color:#aaa09a;font-size:.61rem;line-height:1.35}.pcV62VariantBtn:hover{border-color:rgba(214,176,91,.5);background:rgba(214,176,91,.09)}
      #pc-math-unified-v62>.pcRv2PreviewAction{display:none!important}
      @media(max-width:620px){.pcLiveMediaV62{aspect-ratio:16/10}.pcV62MathArt,.pcV62TarotArt,.pcV62VincArt,.pcV62PartyArt{padding:19px}.pcV62VincArt p{display:none}.pcV62VariantBlock{grid-template-columns:1fr}}
    `;
    document.head.appendChild(st);
  }

  function titleOf(card){return norm(card.querySelector('h3')?.textContent||'')}
  function accentOf(card){return norm(card.querySelector('.accent')?.textContent||'')}

  function mergeMath(){
    const grid=document.querySelector('#drawer-family .drawerGrid');
    if(!grid)return false;
    const cards=[...grid.querySelectorAll(':scope > .card:not(.pcComingCard)')].filter(c=>titleOf(c).includes('CHEVERE KIDS')&&titleOf(c).includes('MATEMATICA'));
    if(!cards.length)return false;
    let primary=cards.find(c=>accentOf(c).includes('FISICO'))||cards[0];
    if(primary.id!=='pc-math-unified-v62')primary.id='pc-math-unified-v62';
    primary.dataset.pcV4Type='math';
    const accent=primary.querySelector('.accent');
    if(accent)accent.textContent='JUGANDO Y APRENDIENDO · 7–9 AÑOS · DOS MODALIDADES';
    const p=primary.querySelector('p');
    if(p)p.textContent='Una sola experiencia, dos formas de jugar: con torre física + digital o en modo Solo Digital desde celular o tablet.';
    if(!primary.querySelector('.pcV62VariantBlock')){
      const block=document.createElement('div');block.className='pcV62VariantBlock';
      block.innerHTML=`<button type="button" class="pcV62VariantBtn" data-pc-math-preview="TK-MAT-79-PHY"><b>FÍSICO + DIGITAL</b><span>Torre + desafíos en pantalla</span></button><button type="button" class="pcV62VariantBtn" data-pc-math-preview="TK-MAT-79-DIG"><b>SOLO DIGITAL</b><span>Celular o tablet · sin torre</span></button>`;
      const actions=primary.querySelector('.actions');
      if(actions)primary.insertBefore(block,actions);else primary.appendChild(block);
      block.querySelectorAll('[data-pc-math-preview]').forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();window.pcOpenRealPreview?.(btn.dataset.pcMathPreview)}));
    }
    cards.filter(c=>c!==primary).forEach(c=>c.remove());
    return cards.length>1;
  }

  function removeReleasedUpcoming(){
    let changed=false;
    document.querySelectorAll('#drawer-mystery .pcComingCard[data-coming-code="QUIMERA"]').forEach(n=>{n.remove();changed=true});
    document.querySelectorAll('.pcComingShelfItem[data-coming-preview="QUIMERA"]').forEach(n=>{n.remove();changed=true});
    return changed;
  }

  function keyFor(card){
    const t=titleOf(card),a=accentOf(card);
    if(t.includes('ULTIMA REUNION')||a.includes('CASO 001'))return 'exp001';
    if(t.includes('HOTEL ORFEO')||a.includes('CASO 002')||t.includes('HABITACION 317'))return 'exp002';
    if(t.includes('PROJECT QUIMERA')||t==='QUIMERA')return 'quimera';
    if(t.includes('CHEVERE KIDS')&&t.includes('MATEMATICA'))return 'math';
    if(t.includes('VERDAD O RETO')||t.includes('MEGA PACK'))return 'party';
    if(t.includes('TAROT'))return 'tarot';
    if(t.includes('VINCORES'))return 'vincores';
    if(t.includes('PAPER SQUISHY'))return 'squishy';
    if(t.includes('DOBLE INTENCION'))return 'doble';
    return '';
  }

  const imgMedia=(src,alt,pos='center')=>`<img src="${src}" alt="${alt}" loading="lazy" style="object-position:${pos}">`;
  function mediaContent(key){
    if(key==='exp001')return imgMedia('../caso001/assets/escenas/estudio.jpg','Preview de La Última Reunión','center 54%');
    if(key==='exp002')return imgMedia('../caso002/assets/visual/bin/room-317-v244.jpg','Preview de Hotel Orfeo · Habitación 317','center 52%');
    if(key==='quimera')return imgMedia('assets/upcoming/quimera.webp?v=20261009-v62','Preview de Project Quimera','center 48%');
    if(key==='squishy')return imgMedia('assets/previews-v58/squishy-factory.webp?v=20261009-v62','Preview de Paper Squishy Factory','center');
    if(key==='math')return `<div class="pcV62MathArt"><section><small>7–9 AÑOS · DOS MODALIDADES</small><strong>Chévere Kids<br><em>Matemática.</em></strong></section><img src="../torre-kids-matematica/assets/mascota-bloqui.svg" alt="Bloqui"></div>`;
    if(key==='tarot')return `<div class="pcV62TarotArt"><small>GUÍA INTERACTIVA · 78 CARTAS</small><strong>Mesa<br>Tarot.</strong><div class="pcV62TarotCards" aria-hidden="true"><i>☾</i><i>✦</i><i>☼</i></div></div>`;
    if(key==='vincores')return `<div class="pcV62VincArt"><small>CAMPO INTERACTIVO</small><strong>Víncores<span>DIGITAL</span></strong><p>Explorá personas, posiciones y relaciones dentro de una escena visual.</p></div>`;
    if(key==='party')return `<div class="pcV62PartyArt"><small>CUATRO VERSIONES PARA ELEGIR</small><strong>Verdad<br><em>o Reto.</em></strong><b>+800</b></div>`;
    return '';
  }

  function unifyCard(card){
    if(!card||card.classList.contains('pcComingCard')||card.id==='pc-runas-card-v1')return;
    const key=keyFor(card);if(!key)return;
    card.classList.add('pcLiveUnifiedV62');
    if(card.querySelector(':scope > .pcLiveMediaV62'))return;
    const html=mediaContent(key);if(!html)return;
    const media=document.createElement('div');
    media.className='pcLiveMediaV62 pcLiveMediaV62-'+key;
    media.innerHTML=html+'<span class="pcLiveBadgeV62">PREVIEW DEL PRODUCTO</span>';
    card.insertBefore(media,card.firstChild);
  }

  function refreshCounts(){
    if(typeof window.pcApplyCategoryExperienceV52==='function')requestAnimationFrame(()=>window.pcApplyCategoryExperienceV52());
  }

  function apply(){
    if(applying)return;applying=true;
    try{
      ensureStyle();
      const mathChanged=mergeMath();
      const upcomingChanged=removeReleasedUpcoming();
      document.querySelectorAll('.categoryDrawer .drawerGrid > .card:not(.pcComingCard)').forEach(unifyCard);
      if(mathChanged||upcomingChanged)refreshCounts();
    }finally{applying=false}
  }

  function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})}
  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-pc-math-preview]');
    if(!b)return;e.preventDefault();e.stopPropagation();window.pcOpenRealPreview?.(b.dataset.pcMathPreview);
  },true);
  new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
  schedule();[300,800,1600,3000].forEach(ms=>setTimeout(schedule,ms));
})();
