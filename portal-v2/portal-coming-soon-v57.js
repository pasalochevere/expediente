(()=>{
  if(window.__pcComingSoonV57)return;
  window.__pcComingSoonV57=true;

  const PRODUCTS=[
    {
      code:'TORRE-AMERICA',category:'family',image:'assets/upcoming/torre-america.webp?v=20260928-hd1200',
      title:'Torre de América',subtitle:'Trivia, desafíos y pasión futbolera',
      description:'Una torre temática con preguntas, retos y momentos épicos inspirados en el fútbol de toda América.',
      detail:'Juego físico + experiencia digital pensado para compartir en familia o con amigos. La torre combina trivia, desafíos y distintos niveles de juego.'
    },
    {
      code:'FABRICA-AVIONES',category:'creative',image:'assets/upcoming/aviones.webp?v=20260928-hd1200',
      title:'Fábrica de Aviones',subtitle:'Diseñá, plegá y hacé volar',
      description:'Una experiencia creativa para aprender a construir aviones de papel con modelos, guías paso a paso y fichas de vuelo.',
      detail:'Cada modelo propone un recorrido completo: plano, plegado cuadro por cuadro, versión final y ficha para probar cómo vuela.'
    },
    {
      code:'ESCUELA-RUNAS',category:'wellbeing',image:'assets/upcoming/runas.webp?v=20260928-hd1200',
      title:'Escuela de Runas',subtitle:'Historia, símbolos y práctica guiada',
      description:'Una escuela interactiva para conocer el mundo de las runas, sus significados, lecturas y aplicaciones prácticas.',
      detail:'Historia, simbología, lecturas, ejercicios y progreso dentro de una experiencia visual e interactiva.'
    },
    {
      code:'EXP-003',category:'mystery',image:'assets/upcoming/exp003.webp?v=20260928-hd1200',
      title:'Expedientes · Caso 003',subtitle:'La Casa de los Espejos',
      description:'Un caso donde nada refleja lo mismo. Pistas, documentos y decisiones dentro de una nueva investigación inquietante.',
      detail:'Una nueva investigación de Expedientes. La preview presenta el clima y el concepto sin revelar soluciones ni spoilers.'
    },
    {
      code:'CRIMENES-REALES',category:'mystery',image:'assets/upcoming/crimenes-reales.webp?v=20260928-hd1200',
      title:'Crímenes Reales',subtitle:'Casos reales, evidencia y reconstrucción',
      description:'Una experiencia documental interactiva para explorar cronologías, documentos, mapas, testimonios y hechos de casos reales.',
      detail:'El recorrido diferenciará claramente hechos confirmados, testimonios, versiones, hipótesis y puntos todavía no resueltos.',
      chips:['HECHO CONFIRMADO','TESTIMONIO','VERSIÓN','HIPÓTESIS','PUNTO NO RESUELTO']
    },
    {
      code:'QUIMERA',category:'mystery',image:'assets/upcoming/quimera.webp?v=20260928-hd1200',
      title:'Quimera',subtitle:'Investigación inmersiva en evolución',
      description:'Un universo de investigaciones, salas, enigmas, decisiones y rutas variables que puede expandirse mucho más allá de la pantalla.',
      detail:'Quimera no es un único caso: es un motor de experiencias de investigación capaz de crecer en distintas formas de juego.',
      extensions:[
        ['DIGITAL','Rooms, pistas, enigmas y rutas variables dentro de la experiencia base.'],
        ['MULTIJUGADOR','Cada jugador puede recibir información diferente y necesitar del equipo para avanzar.'],
        ['BOX INTERACTIVA','Objetos, sobres, mapas y piezas físicas conectados con la investigación digital.'],
        ['MUNDO REAL','GPS, recorridos, lugares y pistas que llevan la experiencia fuera de la pantalla.']
      ]
    }
  ];

  const byCode=code=>PRODUCTS.find(p=>p.code===code);
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  function ensureStyle(){
    if(document.getElementById('pc-coming-soon-v57-style'))return;
    const st=document.createElement('style');st.id='pc-coming-soon-v57-style';st.textContent=`
      .pcComingCard{display:flex!important;flex-direction:column!important;min-height:430px!important;padding:14px!important;overflow:hidden!important;background:linear-gradient(180deg,#1b181b,#100f11)!important;border-color:rgba(214,176,91,.24)!important}
      .pcComingMedia{position:relative;aspect-ratio:1/1;overflow:hidden;border-radius:14px;margin-bottom:13px;background:#09090b;border:1px solid rgba(255,255,255,.07)}
      .pcComingMedia img{display:block;width:100%;height:100%;object-fit:cover}
      .pcComingFlag{position:absolute;left:10px;top:10px;z-index:2;padding:6px 9px;border-radius:999px;background:rgba(8,8,10,.88);border:1px solid rgba(224,183,84,.55);color:#f4d37a;font-size:.61rem;font-weight:950;letter-spacing:.09em;backdrop-filter:blur(7px)}
      .pcComingCard h3{margin:3px 0 4px!important;font-size:1.25rem!important}.pcComingCard .accent{color:#d7ae56!important}.pcComingCard p{margin:8px 0 15px!important}
      .pcComingCard .actions{position:static!important;left:auto!important;right:auto!important;bottom:auto!important;margin-top:auto!important;display:block!important}
      .pcComingPreviewBtn{width:100%;border:1px solid rgba(221,181,89,.38)!important;background:linear-gradient(135deg,#6f531f,#473414)!important;color:#fff!important}
      .pcComingShelf{margin:34px 0 8px;padding-top:22px;border-top:1px solid rgba(236,218,205,.12)}
      .pcComingShelfHead{display:flex;align-items:end;justify-content:space-between;gap:16px;margin-bottom:13px}.pcComingShelfHead small{display:block;color:#d2aa51;font-size:.61rem;font-weight:950;letter-spacing:.15em}.pcComingShelfHead h2{margin:5px 0 0;font-size:1.55rem}.pcComingShelfHead p{margin:0;max-width:520px;text-align:right;color:#9f958e;font-size:.77rem;line-height:1.45}
      .pcComingShelfGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.pcComingShelfItem{appearance:none;border:1px solid rgba(236,218,205,.12);border-radius:17px;background:#121114;color:#eee6df;text-align:left;padding:0;overflow:hidden;cursor:pointer;transition:.17s transform,.17s border-color}.pcComingShelfItem:hover{transform:translateY(-2px);border-color:rgba(210,170,81,.35)}.pcComingShelfItem img{display:block;width:100%;aspect-ratio:16/10;object-fit:cover}.pcComingShelfCopy{padding:13px}.pcComingShelfCopy small{color:#d2aa51;font-size:.58rem;font-weight:950;letter-spacing:.12em}.pcComingShelfCopy b{display:block;margin-top:5px;font-size:.95rem}.pcComingShelfCopy span{display:block;margin-top:4px;color:#958b84;font-size:.69rem;line-height:1.35}
      .pcComingModal{position:fixed;inset:0;z-index:26000;display:grid;place-items:center;padding:18px;background:rgba(0,0,0,.80);backdrop-filter:blur(9px)}.pcComingModal.hidden{display:none!important}.pcComingDialog{position:relative;width:min(980px,100%);max-height:92vh;overflow:auto;border:1px solid rgba(236,218,205,.16);border-radius:24px;background:linear-gradient(155deg,#1a171a,#09090b);box-shadow:0 34px 100px rgba(0,0,0,.66)}.pcComingClose{position:absolute;right:14px;top:14px;z-index:4;width:38px;height:38px;border-radius:50%;border:1px solid rgba(255,255,255,.15);background:rgba(10,10,12,.82);color:#fff;font-size:1.25rem;cursor:pointer}.pcComingModalGrid{display:grid;grid-template-columns:minmax(300px,.95fr) minmax(0,1.05fr);min-height:560px}.pcComingModalMedia{background:#09090b;min-height:100%;display:grid;place-items:center;overflow:hidden}.pcComingModalMedia img{width:100%;height:100%;max-height:760px;object-fit:cover}.pcComingModalCopy{padding:36px 34px 32px}.pcComingModalCopy .pcComingEyebrow{color:#d5ae55;font-size:.62rem;font-weight:950;letter-spacing:.16em}.pcComingModalCopy h2{margin:8px 0 5px;font-size:clamp(2rem,4vw,3.1rem);line-height:.96;letter-spacing:-.04em}.pcComingModalCopy h3{margin:0 0 15px;color:#d2aa51;font-size:1rem}.pcComingModalCopy p{color:#b0a59d;line-height:1.6;font-size:.9rem}.pcComingNotice{margin-top:18px;padding:12px 14px;border-radius:13px;border:1px solid rgba(214,176,91,.20);background:rgba(214,176,91,.05);color:#d9c79c;font-size:.72rem;line-height:1.45}.pcComingExtensions{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:18px}.pcComingExt{padding:12px;border:1px solid rgba(255,255,255,.09);border-radius:13px;background:rgba(255,255,255,.025)}.pcComingExt b{display:block;color:#e0bd68;font-size:.72rem}.pcComingExt span{display:block;color:#948b85;font-size:.68rem;line-height:1.4;margin-top:5px}.pcComingChips{display:flex;flex-wrap:wrap;gap:7px;margin-top:17px}.pcComingChip{padding:6px 8px;border:1px solid rgba(214,176,91,.22);border-radius:999px;color:#d9c79c;font-size:.58rem;font-weight:850;letter-spacing:.04em}
      @media(max-width:820px){.pcComingShelfGrid{grid-template-columns:repeat(2,minmax(0,1fr))}.pcComingModalGrid{grid-template-columns:1fr}.pcComingModalMedia{max-height:52vh}.pcComingModalMedia img{height:auto;max-height:none}.pcComingShelfHead{display:block}.pcComingShelfHead p{display:none}}
      @media(max-width:560px){.pcComingShelfGrid{grid-template-columns:1fr}.pcComingCard{min-height:0!important}.pcComingModal{padding:8px}.pcComingDialog{border-radius:18px}.pcComingModalCopy{padding:25px 18px 22px}.pcComingExtensions{grid-template-columns:1fr}}
    `;document.head.appendChild(st);
  }

  function cardHtml(p){return `
    <div class="pcComingMedia"><span class="pcComingFlag">PRÓXIMAMENTE</span><img src="${esc(p.image)}" alt="Preview comercial de ${esc(p.title)}" loading="lazy"></div>
    <span class="status">PRÓXIMAMENTE</span>
    <h3>${esc(p.title)}</h3>
    <div class="accent">${esc(p.subtitle)}</div>
    <p>${esc(p.description)}</p>
    <div class="actions"><button class="btn pcComingPreviewBtn" type="button" data-coming-preview="${esc(p.code)}">👁 VER PREVIEW</button></div>`}

  function injectCards(){
    let added=false;
    PRODUCTS.forEach(p=>{
      const grid=document.querySelector(`#drawer-${p.category} .drawerGrid`);if(!grid)return;
      if(grid.querySelector(`[data-coming-code="${p.code}"]`))return;
      const card=document.createElement('article');card.className='card pcComingCard';card.dataset.cat=p.category;card.dataset.comingCode=p.code;card.innerHTML=cardHtml(p);grid.appendChild(card);added=true;
    });
    if(added&&typeof window.pcApplyCategoryExperienceV52==='function')setTimeout(()=>window.pcApplyCategoryExperienceV52(),30);
    return added;
  }

  function ensureShelf(){
    const hub=document.querySelector('.categoryHub');if(!hub)return;
    let shelf=hub.querySelector('.pcComingShelf');if(shelf)return;
    shelf=document.createElement('section');shelf.className='pcComingShelf';shelf.innerHTML=`<div class="pcComingShelfHead"><div><small>EN DESARROLLO</small><h2>Próximas experiencias</h2></div><p>Una mirada a lo que estamos construyendo. Podés abrir cada preview sin registrarte.</p></div><div class="pcComingShelfGrid">${PRODUCTS.map(p=>`<button type="button" class="pcComingShelfItem" data-coming-preview="${esc(p.code)}"><img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy"><span class="pcComingShelfCopy"><small>PRÓXIMAMENTE</small><b>${esc(p.title)}</b><span>${esc(p.subtitle)}</span></span></button>`).join('')}</div>`;
    hub.appendChild(shelf);
  }

  function ensureModal(){
    let modal=document.getElementById('pcComingModalV57');if(modal)return modal;
    modal=document.createElement('div');modal.id='pcComingModalV57';modal.className='pcComingModal hidden';modal.setAttribute('aria-hidden','true');modal.innerHTML='<div class="pcComingDialog" role="dialog" aria-modal="true" aria-labelledby="pcComingTitle"><button class="pcComingClose" type="button" aria-label="Cerrar">×</button><div class="pcComingModalGrid"><div class="pcComingModalMedia"><img id="pcComingImage" alt=""></div><div class="pcComingModalCopy"><div class="pcComingEyebrow">PRÓXIMAMENTE · PASALOCHEVERE</div><h2 id="pcComingTitle"></h2><h3 id="pcComingSubtitle"></h3><p id="pcComingDesc"></p><p id="pcComingDetail"></p><div id="pcComingExtra"></div><div class="pcComingNotice">Esta experiencia está en desarrollo. La preview muestra el concepto actual y puede evolucionar antes de su lanzamiento.</div></div></div></div>';
    document.body.appendChild(modal);
    modal.querySelector('.pcComingClose').addEventListener('click',closePreview);
    modal.addEventListener('click',e=>{if(e.target===modal)closePreview()});
    return modal;
  }

  function openPreview(code){
    const p=byCode(code);if(!p)return;const modal=ensureModal();
    const img=modal.querySelector('#pcComingImage');img.src=p.image;img.alt=`Preview comercial de ${p.title}`;
    modal.querySelector('#pcComingTitle').textContent=p.title;
    modal.querySelector('#pcComingSubtitle').textContent=p.subtitle;
    modal.querySelector('#pcComingDesc').textContent=p.description;
    modal.querySelector('#pcComingDetail').textContent=p.detail||'';
    const extra=modal.querySelector('#pcComingExtra');extra.innerHTML='';
    if(p.extensions)extra.innerHTML=`<div class="pcComingExtensions">${p.extensions.map(([a,b])=>`<div class="pcComingExt"><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join('')}</div>`;
    if(p.chips)extra.innerHTML+=`<div class="pcComingChips">${p.chips.map(x=>`<span class="pcComingChip">${esc(x)}</span>`).join('')}</div>`;
    modal.classList.remove('hidden');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
  }
  function closePreview(){const modal=document.getElementById('pcComingModalV57');if(!modal)return;modal.classList.add('hidden');modal.setAttribute('aria-hidden','true');document.body.style.removeProperty('overflow')}

  function apply(){ensureStyle();injectCards();ensureShelf();ensureModal()}
  window.pcApplyComingSoonV57=apply;
  window.pcOpenComingSoonV57=openPreview;
  document.addEventListener('click',e=>{const b=e.target.closest('[data-coming-preview]');if(!b)return;e.preventDefault();e.stopPropagation();openPreview(b.dataset.comingPreview)},true);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.getElementById('pcComingModalV57')?.classList.contains('hidden'))closePreview()});

  let queued=false;const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})};
  new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
  schedule();setTimeout(schedule,400);setTimeout(schedule,1000);setTimeout(schedule,2200);
})();