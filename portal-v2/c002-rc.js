(()=>{
const PRODUCT_CODES={
  'DOBLE INTENCIÓN':'DI-TRILOGIA',
  'CHÉVERE KIDS · MATEMÁTICA|FÍSICO + DIGITAL':'TK-MAT-79-PHY',
  'CHÉVERE KIDS · MATEMÁTICA|SOLO DIGITAL':'TK-MAT-79-DIG',
  'MEGA PACK VERDAD O RETO +800':'TORRE-MEGA',
  'EXPEDIENTES|CASO 001':'EXP-001',
  'EXPEDIENTES|CASO 002':'EXP-002',
  'VÍNCORES DIGITAL':'VINC-001',
  'PAPER SQUISHY FACTORY':'PSQ-FACTORY'
};

const PREVIEWS={
  'DI-TRILOGIA':{
    eyebrow:'PAREJA & ADULTOS',title:'DOBLE INTENCIÓN',subtitle:'CHISPA · FUEGO · DOMINIO · +18',
    summary:'Una vista rápida del sistema antes de comprar: tres intensidades, consignas digitales y material imprimible.',
    items:['Elegís la edición según el clima de la partida.','Las consignas aparecen una por una desde el celular.','Incluye material descargable para jugar también fuera de pantalla.'],
    sample:['CHISPA · conversación y conexión','FUEGO · retos y tensión','DOMINIO · nivel más intenso']
  },
  'TK-MAT-79-PHY':{
    eyebrow:'FAMILIA & KIDS',title:'CHÉVERE KIDS · MATEMÁTICA',subtitle:'FÍSICO + DIGITAL · 7–9 AÑOS',
    summary:'La torre física se combina con desafíos digitales para convertir cada turno en una actividad de matemática.',
    items:['54 piezas numeradas y desafíos por niveles.','Dados, estrellas y progresión de dificultad.','Material imprimible y acompañamiento digital.'],
    sample:['NIVEL 1 · cálculo simple','NIVEL 2 · problemas cortos','NIVEL 3 · desafío relámpago']
  },
  'TK-MAT-79-DIG':{
    eyebrow:'FAMILIA & KIDS',title:'CHÉVERE KIDS · MATEMÁTICA',subtitle:'SOLO DIGITAL · 7–9 AÑOS',
    summary:'La misma lógica de aprendizaje y desafío, preparada para jugar directamente desde celular o tablet.',
    items:['No requiere torre física.','Desafíos, niveles y estrellas.','Pensado para partidas cortas y repetibles.'],
    sample:['ELEGÍ NIVEL','RESOLVÉ EL DESAFÍO','SUMÁ ESTRELLAS']
  },
  'TORRE-MEGA':{
    eyebrow:'FAMILIA & FIESTA',title:'MEGA PACK VERDAD O RETO +800',subtitle:'4 VERSIONES · 832 CONTENIDOS',
    summary:'Una biblioteca grande para usar con torre numerada o en modo completamente digital.',
    items:['KIDS, GENERAL, FIESTA 18+ y SIN FILTRO 18+.','Modo con torre física o Solo Digital.','Consignas listas para sacar al azar durante la partida.'],
    sample:['KIDS · juego familiar','GENERAL · para cualquier grupo','FIESTA / SIN FILTRO · +18']
  },
  'EXP-001':{
    eyebrow:'MISTERIO & GRUPO',title:'EXPEDIENTES · CASO 001',subtitle:'LA ÚLTIMA REUNIÓN',
    summary:'Preview sin spoilers: así se ve la experiencia de investigación, las pistas y el trabajo en equipo.',
    items:['Sala multijugador y roles privados.','Evidencias, pistas y decisiones durante la investigación.','Kit imprimible para sumar objetos físicos a la partida.'],
    sample:['ABRIR EXPEDIENTE','REVISAR EVIDENCIAS','CONECTAR LAS PISTAS']
  },
  'EXP-002':{
    eyebrow:'MISTERIO & GRUPO',title:'EXPEDIENTES · CASO 002',subtitle:'LA HABITACIÓN QUE NO EXISTE',
    summary:'Preview sin revelar la solución: Hotel Orfeo, Habitación 317, roles privados y una investigación con caminos variables.',
    items:['Diseñado para 3 jugadores.','Pistas dinámicas y finales variables.','Kit imprimible COLOR y B/N.'],
    sample:['HOTEL ORFEO','HABITACIÓN 317','¿QUÉ OCURRIÓ?']
  },
  'VINC-001':{
    eyebrow:'BIENESTAR & VÍNCULOS',title:'VÍNCORES DIGITAL',subtitle:'CAMPO DE CONSTELACIÓN INTERACTIVO',
    summary:'Una mirada al espacio de trabajo donde podés representar vínculos, escenas, posiciones y emociones.',
    items:['Campo interactivo con figuras y roles.','Práctica guiada y biblioteca de escenas.','Bitácora, etapas y exportación PNG.'],
    sample:['UBICAR PERSONAS','AGREGAR EMOCIONES','GUARDAR LA ESCENA']
  },
  'PSQ-FACTORY':{
    eyebrow:'CREATIVOS & DIDÁCTICOS',title:'PAPER SQUISHY FACTORY',subtitle:'CREATOR PLUS · NUEVOS DISEÑOS CADA MES',
    summary:'Así funciona la fábrica: elegís un diseño, lo personalizás en el editor y preparás las vistas para imprimir.',
    items:['30 diseños iniciales y 3 colecciones.','Editor Creator Plus para personalizar.','10 diseños nuevos por mes durante 12 meses.'],
    sample:['1 · ELEGIR DISEÑO','2 · PERSONALIZAR','3 · IMPRIMIR Y ARMAR']
  }
};

function injectCommercialStyles(){
  if(document.getElementById('pcCommercialStyles'))return;
  const style=document.createElement('style');
  style.id='pcCommercialStyles';
  style.textContent=`
  .categoryDrawer .card{display:flex;flex-direction:column;min-height:390px;height:auto;overflow:hidden;padding-bottom:18px}
  .categoryDrawer .card p{margin-bottom:0}
  .categoryDrawer .card .actions{position:static!important;left:auto!important;right:auto!important;bottom:auto!important;margin-top:auto;padding-top:14px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;width:100%}
  .categoryDrawer .card .actions .btn{min-width:0;display:flex;align-items:center;justify-content:center;min-height:50px;line-height:1.15}
  .productPrice{margin:12px 0 0;padding:10px 12px;border:1px solid #57462c;border-radius:12px;background:linear-gradient(180deg,#17130d,#100e0b);color:#e7bd61;font-weight:950;font-size:1.12rem;letter-spacing:.01em;position:relative;z-index:2}
  .productPrice small{display:block;color:#a99e92;font-size:.7rem;font-weight:750;margin-top:3px;letter-spacing:0}
  .previewAction{margin-top:12px;position:relative;z-index:2}
  .previewAction .btn{width:100%;background:linear-gradient(180deg,#232025,#18161a);border-color:#655a60;color:#f4e9dd}
  .previewAction .btn:hover{border-color:#8b777f}
  #psqPrice,#exp001Price,#exp002Price{font-size:1.12rem!important;color:#e7bd61!important;font-weight:950!important}
  .previewModal{position:fixed;inset:0;background:rgba(0,0,0,.78);display:grid;place-items:center;padding:18px;z-index:10050;backdrop-filter:blur(6px)}
  .previewModal.hidden{display:none!important}
  .previewDialog{width:min(920px,100%);max-height:90vh;overflow:auto;background:linear-gradient(145deg,#1d1819,#0e0d0f);border:1px solid #514346;border-radius:24px;padding:22px;box-shadow:0 30px 90px rgba(0,0,0,.62)}
  .previewHead{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;padding-bottom:15px;border-bottom:1px solid #3d3437}
  .previewHead h2{margin:4px 0 3px;font-size:1.85rem}.previewSubtitle{color:#d3a548;font-weight:900;font-size:.88rem}
  .previewBody{display:grid;grid-template-columns:1.05fr .95fr;gap:18px;margin-top:18px}
  .previewCopy p{color:#c0b4aa;line-height:1.55;margin-top:0}.previewList{display:grid;gap:9px;margin-top:14px}.previewList div{border:1px solid #40383b;border-radius:12px;padding:11px 12px;background:#111013;color:#e9dfd5;font-size:.88rem}.previewList div:before{content:'✓';color:#9dd7ad;font-weight:950;margin-right:8px}
  .previewScreen{min-height:310px;border-radius:20px;border:1px solid #4b4044;background:radial-gradient(circle at 80% 10%,rgba(201,154,58,.18),transparent 35%),linear-gradient(160deg,#181518,#0b0b0d);padding:18px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:inset 0 0 0 1px rgba(255,255,255,.02)}
  .previewScreenTop{display:flex;justify-content:space-between;gap:10px;align-items:center;color:#c99a3a;font-size:.68rem;font-weight:950;letter-spacing:.12em}.previewScreenTop span:last-child{color:#8b817a}
  .previewScreenTitle{font-size:clamp(1.65rem,4vw,2.6rem);font-weight:950;line-height:.95;margin:18px 0 8px}.previewScreenSub{color:#a99e92;font-size:.82rem;line-height:1.4}
  .previewSamples{display:grid;gap:8px;margin-top:20px}.previewSample{padding:12px 13px;border:1px solid #514447;background:#171417;border-radius:13px;font-weight:900;font-size:.82rem;letter-spacing:.03em}
  .previewFooter{display:flex;justify-content:flex-end;gap:8px;margin-top:18px;padding-top:16px;border-top:1px solid #3d3437}.previewFooter .btn{min-width:150px}
  @media(max-width:720px){.previewBody{grid-template-columns:1fr}.previewScreen{min-height:250px}.categoryDrawer .card{min-height:0}.categoryDrawer .card .actions{grid-template-columns:1fr}.previewFooter{flex-direction:column}.previewFooter .btn{width:100%}}
  `;
  document.head.appendChild(style);
}

function productCodeForCard(card){
  const title=card.querySelector('h3')?.textContent.trim().toUpperCase()||'';
  const accent=card.querySelector('.accent')?.textContent.trim().toUpperCase()||'';
  if(title.includes('DOBLE INTENCIÓN'))return 'DI-TRILOGIA';
  if(title.includes('CHÉVERE KIDS')&&accent.includes('FÍSICO + DIGITAL'))return 'TK-MAT-79-PHY';
  if(title.includes('CHÉVERE KIDS')&&accent.includes('SOLO DIGITAL'))return 'TK-MAT-79-DIG';
  if(title.includes('MEGA PACK'))return 'TORRE-MEGA';
  if(title.includes('EXPEDIENTES')&&accent.includes('CASO 001'))return 'EXP-001';
  if(title.includes('EXPEDIENTES')&&accent.includes('CASO 002'))return 'EXP-002';
  if(title.includes('VÍNCORES'))return 'VINC-001';
  if(title.includes('PAPER SQUISHY FACTORY'))return 'PSQ-FACTORY';
  return '';
}

function formatPrice(v){
  return new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(Number(v));
}

function ensurePreviewModal(){
  if(document.getElementById('previewModal'))return;
  const modal=document.createElement('div');
  modal.id='previewModal';modal.className='previewModal hidden';modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-labelledby','previewTitle');
  modal.innerHTML=`<div class="previewDialog"><div class="previewHead"><div><div class="eyebrow" id="previewEyebrow">PREVIEW</div><h2 id="previewTitle">Vista previa</h2><div class="previewSubtitle" id="previewSubtitle"></div></div><button class="btn" type="button" onclick="closePreview()">CERRAR ×</button></div><div class="previewBody"><div class="previewCopy"><p id="previewSummary"></p><div class="previewList" id="previewList"></div></div><div class="previewScreen"><div><div class="previewScreenTop"><span>PASALOCHEVERE · PREVIEW</span><span>VISTA DEMO</span></div><div class="previewScreenTitle" id="previewScreenTitle"></div><div class="previewScreenSub" id="previewScreenSub"></div></div><div class="previewSamples" id="previewSamples"></div></div></div><div class="previewFooter"><button class="btn" type="button" onclick="closePreview()">SEGUIR MIRANDO</button><button class="btn primary" type="button" id="previewBuyBtn">COMPRAR AHORA</button></div></div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click',e=>{if(e.target===modal)closePreview()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.classList.contains('hidden'))closePreview()});
}

window.openPreview=function(productCode){
  const p=PREVIEWS[productCode];if(!p)return;
  ensurePreviewModal();
  document.getElementById('previewEyebrow').textContent=p.eyebrow;
  document.getElementById('previewTitle').textContent=p.title;
  document.getElementById('previewSubtitle').textContent=p.subtitle;
  document.getElementById('previewSummary').textContent=p.summary;
  document.getElementById('previewList').innerHTML=p.items.map(x=>'<div>'+escapeHtml(x)+'</div>').join('');
  document.getElementById('previewScreenTitle').textContent=p.title;
  document.getElementById('previewScreenSub').textContent=p.subtitle;
  document.getElementById('previewSamples').innerHTML=p.sample.map(x=>'<div class="previewSample">'+escapeHtml(x)+'</div>').join('');
  const buy=document.getElementById('previewBuyBtn');
  const prod=(window.publicCatalog||{})[productCode]||publicCatalog?.[productCode];
  if(prod?.sales_enabled&&Number(prod.price_ars)>0){buy.classList.remove('hidden');buy.textContent='COMPRAR · '+formatPrice(prod.price_ars);buy.onclick=()=>buyNow(productCode)}
  else{buy.classList.remove('hidden');buy.textContent='ACTIVAR / CONSULTAR';buy.onclick=()=>{closePreview();scrollToActivation()}}
  document.getElementById('previewModal').classList.remove('hidden');
};
window.closePreview=function(){document.getElementById('previewModal')?.classList.add('hidden')};

function installPreviewButtons(){
  document.querySelectorAll('.categoryDrawer .card').forEach(card=>{
    if(card.classList.contains('emptyCard'))return;
    const code=productCodeForCard(card);if(!code||!PREVIEWS[code])return;
    card.dataset.productCode=code;
    if(card.querySelector('.previewAction'))return;
    const preview=document.createElement('div');preview.className='previewAction';
    preview.innerHTML='<button class="btn" type="button" onclick="openPreview(\''+code+'\')">👁 VER PREVIEW</button>';
    const actions=card.querySelector('.actions');
    if(actions)card.insertBefore(preview,actions);else card.appendChild(preview);
  });
}

function ensureCatalogPrices(products){
  const byCode=Object.fromEntries((products||[]).map(p=>[p.product_code,p]));
  document.querySelectorAll('.categoryDrawer .card[data-product-code]').forEach(card=>{
    const code=card.dataset.productCode;
    const prod=byCode[code];
    let price=card.querySelector('.productPrice');
    const existing=card.querySelector('#psqPrice,#exp001Price,#exp002Price');
    if(existing){existing.classList.add('productPrice');price=existing}
    if(!price){
      price=document.createElement('div');price.className='productPrice';
      const preview=card.querySelector('.previewAction');
      if(preview)card.insertBefore(price,preview);else card.appendChild(price);
    }
    if(prod&&Number(prod.price_ars)>0){
      price.innerHTML=formatPrice(prod.price_ars)+'<small>Acceso digital según condiciones del producto</small>';
    }else if(code==='PSQ-FACTORY'){
      price.innerHTML='$ 14.999<small>Acceso por 12 meses</small>';
    }else{
      price.innerHTML='PRECIO A CONSULTAR<small>Consultá disponibilidad o activá tu compra</small>';
    }
  });
}

async function hydrateCommercialCatalog(){
  try{
    if(typeof sb==='undefined')return;
    const {data,error}=await sb.functions.invoke('pasalochevere-catalog',{body:{}});
    if(error||!data?.ok)return;
    const products=data.products||[];
    publicCatalog=Object.fromEntries(products.map(p=>[p.product_code,p]));
    window.publicCatalog=publicCatalog;
    ensureCatalogPrices(products);
  }catch(e){console.warn('commercial catalog',e)}
}

async function initC002(){
  const cards=[...document.querySelectorAll('.card[data-cat="mystery"]')];
  const card=cards.find(c=>c.querySelector('.accent')?.textContent.includes('Caso 002'));
  if(!card)return;
  const status=card.querySelector('.status');
  const p=card.querySelector('p');
  if(status)status.textContent='● RELEASE CANDIDATE';
  if(p)p.textContent='Hotel Orfeo · 3 jugadores · roles privados · Habitación 317 · finales variables · kit imprimible COLOR y B/N.';
  let price=card.querySelector('#exp002Price');
  if(!price){
    price=document.createElement('div');price.id='exp002Price';price.className='note';price.style.marginTop='8px';
    const actions=card.querySelector('.actions');card.insertBefore(price,actions)
  }
  const actions=card.querySelector('.actions');
  if(actions)actions.innerHTML='<button class="btn primary" id="exp002Buy" disabled>VENTA ONLINE PENDIENTE</button><a class="btn" href="https://wa.me/5491153774769?text=Hola%20PasaloChevere%2C%20quiero%20consultar%20por%20EXPEDIENTES%20%E2%80%94%20Caso%20002." target="_blank" rel="noopener">WHATSAPP</a>';
  const btn=document.getElementById('exp002Buy');
  price.textContent='Release Candidate aprobado · precio online pendiente de definición';
  try{
    if(typeof sb==='undefined')return;
    const {data,error}=await sb.functions.invoke('pasalochevere-catalog',{body:{}});
    if(error||!data?.ok)return;
    const prod=(data.products||[]).find(x=>x.product_code==='EXP-002');
    if(prod?.sales_enabled&&Number(prod.price_ars)>0){
      price.textContent=formatPrice(prod.price_ars)+' · acceso 12 meses';
      if(status)status.textContent='● DISPONIBLE';btn.disabled=false;btn.textContent='COMPRAR AHORA';btn.onclick=()=>buyNow('EXP-002')
    }else{btn.disabled=true}
  }catch(e){console.warn('C002 catalog',e)}
}

function installPaperSquishyCategory(){
  const chip=document.querySelector('.catChip[data-category="creative"]');
  if(chip){
    const count=chip.querySelector('.catCount');
    if(count)count.textContent='1 producto';
  }
  const drawer=document.getElementById('drawer-creative');
  const grid=drawer?.querySelector('.drawerGrid');
  if(!grid)return;
  grid.innerHTML=`
    <article class="card" data-cat="creative" data-product-code="PSQ-FACTORY">
      <span class="status live" id="psqStatus">● DISPONIBLE</span>
      <h3>PAPER SQUISHY FACTORY</h3>
      <div class="accent">30 DISEÑOS · CREATOR PLUS · 10 NUEVOS CADA MES</div>
      <p>Creá, personalizá e imprimí Paper Squishies. Incluye 30 diseños iniciales, 3 colecciones, editor Creator Plus y nuevas incorporaciones durante 12 meses.</p>
      <div class="note productPrice" id="psqPrice">Cargando precio…</div>
      <div class="actions">
        <button class="btn primary" id="psqBuy" onclick="buyNow('PSQ-FACTORY')" disabled>COMPRAR AHORA</button>
        <button class="btn" onclick="scrollToActivation()">ACTIVAR COMPRA</button>
      </div>
    </article>`;
}

async function hydratePaperSquishy(){
  const price=document.getElementById('psqPrice');
  const btn=document.getElementById('psqBuy');
  const status=document.getElementById('psqStatus');
  if(!price||!btn||typeof sb==='undefined')return;
  try{
    const {data,error}=await sb.functions.invoke('pasalochevere-catalog',{body:{}});
    if(error||!data?.ok)throw error||new Error('Catálogo no disponible');
    const prod=(data.products||[]).find(x=>x.product_code==='PSQ-FACTORY');
    if(prod?.sales_enabled&&Number(prod.price_ars)>0){
      price.innerHTML=formatPrice(prod.price_ars)+'<small>Acceso por 12 meses</small>';
      btn.disabled=false;btn.textContent='COMPRAR AHORA';
      if(status)status.textContent='● DISPONIBLE';
    }else{
      price.innerHTML='DISPONIBLE PARA ACTIVAR<small>Ingresá el código recibido con tu compra</small>';
      btn.disabled=true;btn.textContent='VENTA ONLINE PENDIENTE';
    }
  }catch(e){
    console.warn('Paper Squishy catalog',e);
    price.innerHTML='$ 14.999<small>Acceso por 12 meses</small>';
    btn.disabled=false;
  }
}

function installPaperSquishyLibraryCategory(){
  if(typeof window.licenseCategory!=='function')return;
  const original=window.licenseCategory;
  window.licenseCategory=function(l){
    const code=String(l?.product_code||'').toUpperCase(),name=String(l?.product_name||'').toUpperCase();
    if(code==='PSQ-FACTORY'||name.includes('PAPER SQUISHY FACTORY'))return {key:'creative',label:'✂ CREATIVOS & DIDÁCTICOS'};
    return original(l);
  };
  if(typeof window.renderLicenses==='function'){
    window.renderLicenses=function(list){
      const sec=document.getElementById('myGames'),g=document.getElementById('myGamesGrid');
      list=(list||[]).filter(l=>l.product_code!=='TOWER-JAM');
      if(!list.length){sec.classList.add('hidden');g.innerHTML='';return}
      sec.classList.remove('hidden');
      const groups={};
      list.forEach(l=>{const c=window.licenseCategory(l);(groups[c.key]||(groups[c.key]={label:c.label,items:[]})).items.push(l)});
      const order=['adult','family','mystery','wellbeing','creative','other'];
      g.innerHTML=order.filter(k=>groups[k]).map(k=>{
        const group=groups[k];
        const cards=group.items.map(l=>{
          const active=l.status==='active'&&l.expires_at&&new Date(l.expires_at).getTime()>Date.now();
          const pending=!!l.can_activate;
          const hours=Number(l.duration_hours||8760);const duration=hours===8760?'12 MESES':hours===24?'1 DÍA':hours%24===0?`${hours/24} DÍAS`:`${hours} HORAS`;const date=l.expires_at?new Date(l.expires_at).toLocaleDateString('es-AR'):'Empieza al activar';
          const badge=active?'● ACTIVO':pending?'● PENDIENTE DE ACTIVAR':l.status==='revoked'?'● ANULADO':'● VENCIDO';
          const badgeClass=(active||pending)?'live':'';
          const code=l.activation_code||'Se genera al activar';
          const deviceManage=active&&l.activation_code?'<br><button class="copy" onclick="openDevices(\''+escapeHtml(l.activation_code)+'\',\''+escapeHtml(l.product_name)+'\');return false">GESTIONAR DISPOSITIVOS</button>':'';
          let action='';
          if(pending) action='<button class="btn primary" onclick="activateOwned(\''+escapeHtml(l.product_code)+'\')">ACTIVAR · '+duration+'</button>';
          else if(active&&l.game_url) action='<a class="btn primary" href="#" onclick="openGame(\''+escapeHtml(l.activation_code||'')+'\',\''+escapeHtml(gameHref(l))+'\');return false">ABRIR</a><button class="btn" onclick="copyCode(\''+escapeHtml(l.activation_code||'')+'\');return false">COPIAR CÓDIGO</button>';
          else if(active) action='<span class="btn" style="opacity:.6">URL PENDIENTE</span><button class="btn" onclick="copyCode(\''+escapeHtml(l.activation_code||'')+'\');return false">COPIAR CÓDIGO</button>';
          else action='<span class="btn" style="opacity:.45">SIN ACCESO</span>';
          const title=l.product_code==='TORRE-MEGA'?'MEGA PACK VERDAD O RETO +800':l.product_name;
          return '<article class="card" data-cat="'+k+'"><span class="status '+badgeClass+'">'+badge+'</span><h3>'+escapeHtml(title)+'</h3><div class="accent">Código de acceso: <code>'+escapeHtml(code)+'</code></div><p>Vigencia: <b>'+duration+'</b><br>Vence: <b>'+date+'</b><br>Dispositivos registrados: <b>'+l.devices_used+' de '+l.device_limit+'</b>'+deviceManage+'</p><div class="actions">'+action+'</div></article>';
        }).join('');
        return '<section class="libraryGroup"><div class="libraryGroupTitle"><b>'+group.label+'</b><span></span></div><div class="grid">'+cards+'</div></section>';
      }).join('');
    };
  }
}

async function init(){
  injectCommercialStyles();
  installPaperSquishyCategory();
  installPaperSquishyLibraryCategory();
  await Promise.allSettled([initC002(),hydratePaperSquishy()]);
  installPreviewButtons();
  await hydrateCommercialCatalog();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();