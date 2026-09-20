(()=>{
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
      price.textContent=new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(Number(prod.price_ars))+' · acceso 12 meses';
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
    <article class="card" data-cat="creative">
      <span class="status live" id="psqStatus">● DISPONIBLE</span>
      <h3>PAPER SQUISHY FACTORY</h3>
      <div class="accent">30 DISEÑOS · CREATOR PLUS · 10 NUEVOS CADA MES</div>
      <p>Creá, personalizá e imprimí Paper Squishies. Incluye 30 diseños iniciales, 3 colecciones, editor Creator Plus y nuevas incorporaciones durante 12 meses.</p>
      <div class="note" id="psqPrice" style="margin-top:8px">Cargando precio…</div>
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
      price.textContent=new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(Number(prod.price_ars))+' · acceso 12 meses';
      btn.disabled=false;btn.textContent='COMPRAR AHORA';
      if(status)status.textContent='● DISPONIBLE';
    }else{
      price.textContent='Disponible para activar con código de compra';
      btn.disabled=true;btn.textContent='VENTA ONLINE PENDIENTE';
    }
  }catch(e){
    console.warn('Paper Squishy catalog',e);
    price.textContent='$14.999 · acceso 12 meses';
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
    const originalRender=window.renderLicenses;
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
  installPaperSquishyCategory();
  installPaperSquishyLibraryCategory();
  await Promise.allSettled([initC002(),hydratePaperSquishy()]);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();