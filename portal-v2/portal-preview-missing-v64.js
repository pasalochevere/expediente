/* V6.4 · MISSING CATEGORY PREVIEW PASS
   Completa Pareja & Adultos (Doble Intención) y unifica Torre de América.
   Sólo presentación comercial: no toca precios, licencias, checkout ni acceso al producto. */
(()=>{
  if(window.__pcMissingCategoryPreviewV64)return;
  window.__pcMissingCategoryPreviewV64=true;

  const VERSION='20261009-v64';
  const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase();
  let queued=false,applying=false;

  function ensureStyle(){
    if(document.getElementById('pc-missing-category-preview-v64-style'))return;
    const st=document.createElement('style');
    st.id='pc-missing-category-preview-v64-style';
    st.textContent=`
      /* Doble Intención · commercial hero */
      #drawer-adult .card.pcV64DiCard{padding-top:0!important;overflow:hidden!important}
      #drawer-adult .card.pcV64DiCard> .pcV4Cover{display:none!important}
      .pcV64DiMedia{position:relative;display:block;width:calc(100% + 36px);aspect-ratio:16/9;margin:0 -18px 16px;overflow:hidden;background:#130c12;border-bottom:1px solid rgba(222,181,92,.19);cursor:pointer;isolation:isolate}
      .pcV64DiMedia:focus-visible{outline:2px solid #e1b960;outline-offset:-3px}
      .pcV64DiArt{position:absolute;inset:0;color:#fff4e9;background:linear-gradient(118deg,#110b10 0%,#26101d 38%,#4d1d29 67%,#6c3029 100%);overflow:hidden}
      .pcV64DiArt:before{content:'';position:absolute;inset:-34% 30% -24% -18%;background:radial-gradient(circle at 35% 45%,rgba(239,172,99,.22),transparent 38%),radial-gradient(circle at 70% 60%,rgba(174,66,95,.24),transparent 42%);filter:blur(2px)}
      .pcV64DiArt:after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,rgba(7,5,8,.14),rgba(7,5,8,0) 54%),linear-gradient(180deg,rgba(0,0,0,.03),rgba(0,0,0,.27));box-shadow:inset 0 0 70px rgba(0,0,0,.34)}
      .pcV64DiOrbit{position:absolute;right:7%;top:50%;width:155px;height:155px;transform:translateY(-50%);border:1px solid rgba(255,217,159,.16);border-radius:50%;z-index:1}
      .pcV64DiOrbit:before,.pcV64DiOrbit:after{content:'';position:absolute;border:1px solid rgba(255,217,159,.11);border-radius:50%}.pcV64DiOrbit:before{inset:22px}.pcV64DiOrbit:after{inset:47px}
      .pcV64DiCopy{position:absolute;z-index:3;left:28px;top:23px;width:57%;text-shadow:0 2px 16px rgba(0,0,0,.58)}
      .pcV64DiCopy small{display:block;color:#edc36e;font-size:.59rem;font-weight:950;letter-spacing:.15em}.pcV64DiCopy strong{display:block;margin-top:8px;font:700 clamp(1.85rem,3.8vw,3rem)/.87 Georgia,serif;letter-spacing:-.045em}.pcV64DiCopy strong em{display:block;color:#ffd083;font-style:normal}.pcV64DiCopy>span{display:block;margin-top:10px;color:#f5e5d8;font-size:.58rem;font-weight:900;letter-spacing:.09em}
      .pcV64DiLevels{position:absolute;z-index:3;right:19px;bottom:20px;display:grid;gap:6px;width:128px}
      .pcV64DiLevel{display:grid;grid-template-columns:18px 1fr;grid-template-areas:'icon name' 'icon desc';column-gap:7px;padding:6px 8px;border:1px solid rgba(255,222,171,.18);border-radius:10px;background:rgba(14,8,13,.42);backdrop-filter:blur(5px);box-shadow:0 8px 18px rgba(0,0,0,.12)}
      .pcV64DiLevel i{grid-area:icon;align-self:center;color:#f0bd66;font-style:normal;font-size:.76rem}.pcV64DiLevel b{grid-area:name;color:#fff1df;font-size:.57rem;letter-spacing:.09em}.pcV64DiLevel span{grid-area:desc;color:#cbb8ae;font-size:.48rem;margin-top:1px}
      .pcV64DiBadge{position:absolute;z-index:5;left:13px;bottom:11px;padding:6px 9px;border-radius:999px;background:rgba(8,7,9,.86);border:1px solid rgba(224,183,84,.48);color:#f2d17b;font-size:.59rem;font-weight:950;letter-spacing:.085em;backdrop-filter:blur(7px)}
      .pcV64DiCard h3{letter-spacing:-.02em}.pcV64DiCard .accent{line-height:1.45}

      /* Torre de América · one visual only */
      #drawer-family .pcComingCard.pcV64TowerCard> .pcV4Cover{display:none!important}
      #drawer-family .pcComingCard.pcV64TowerCard{overflow:hidden!important}
      #drawer-family .pcComingCard.pcV64TowerCard .pcComingMedia{position:relative;aspect-ratio:16/9!important;margin-bottom:13px!important;background:#06111a!important}
      #drawer-family .pcComingCard.pcV64TowerCard .pcComingMedia img{width:100%!important;height:100%!important;object-fit:cover!important;object-position:center 38%!important;filter:saturate(1.03) contrast(1.03)}
      #drawer-family .pcComingCard.pcV64TowerCard .pcComingMedia:after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(3,8,12,.02) 52%,rgba(3,8,12,.48) 100%)}
      .pcV64TowerLine{position:absolute;z-index:3;right:10px;bottom:9px;padding:5px 8px;border-radius:999px;background:rgba(5,10,14,.72);border:1px solid rgba(255,214,111,.30);color:#f4d779;font-size:.52rem;font-weight:950;letter-spacing:.08em;backdrop-filter:blur(5px)}
      #drawer-family .pcComingCard.pcV64TowerCard h3{letter-spacing:-.015em}
      .pcComingModal.pcV64TowerModal .pcComingModalMedia{position:relative;background:#06111a}
      .pcComingModal.pcV64TowerModal .pcComingModalMedia img{object-fit:cover!important;object-position:center 38%!important;filter:saturate(1.03) contrast(1.03)}
      .pcComingModal.pcV64TowerModal .pcComingModalCopy h2{letter-spacing:-.045em}

      @media(max-width:620px){
        .pcV64DiMedia{aspect-ratio:16/10}
        .pcV64DiCopy{left:19px;top:18px;width:65%}.pcV64DiCopy strong{font-size:1.8rem}.pcV64DiCopy>span{font-size:.49rem}
        .pcV64DiLevels{right:11px;bottom:14px;width:105px;gap:4px}.pcV64DiLevel{padding:5px 6px}.pcV64DiLevel span{display:none}
        #drawer-family .pcComingCard.pcV64TowerCard .pcComingMedia{aspect-ratio:16/10!important}
      }
    `;
    document.head.appendChild(st);
  }

  function diArt(){
    return `<div class="pcV64DiArt">
      <div class="pcV64DiOrbit" aria-hidden="true"></div>
      <div class="pcV64DiCopy">
        <small>PASALOCHEVERE · EXPERIENCIA +18</small>
        <strong>Doble<em>Intención.</em></strong>
        <span>TRES CLIMAS · UNA EXPERIENCIA PARA DOS</span>
      </div>
      <div class="pcV64DiLevels" aria-hidden="true">
        <div class="pcV64DiLevel"><i>✦</i><b>CHISPA</b><span>Conexión y complicidad</span></div>
        <div class="pcV64DiLevel"><i>◐</i><b>FUEGO</b><span>Más intensidad</span></div>
        <div class="pcV64DiLevel"><i>◆</i><b>DOMINIO</b><span>Otro nivel</span></div>
      </div>
    </div>`;
  }

  function findDobleCard(){
    return [...document.querySelectorAll('#drawer-adult .drawerGrid > .card:not(.pcComingCard)')].find(card=>norm(card.textContent).includes('DOBLE INTENCION'))||null;
  }

  function patchDobleProduct(){
    const p=window.PC_REAL_PREVIEWS_V2?.['DI-TRILOGIA'];
    if(!p)return false;
    p.title='Doble Intención';
    p.subtitle='Trilogía · Chispa · Fuego · Dominio · +18';
    p.summary='Tres intensidades para compartir de a dos. Elegí CHISPA, FUEGO o DOMINIO, jugá por número o al azar y decidan juntos el clima de cada partida.';
    p.focus='3 ediciones · juego digital + material descargable';
    p.__v64=true;
    return true;
  }

  function patchDobleCard(){
    const card=findDobleCard();if(!card)return false;
    card.classList.add('pcLiveUnifiedV62','pcV64DiCard');
    card.querySelectorAll(':scope > .pcV4Cover').forEach(n=>n.remove());
    let media=card.querySelector(':scope > .pcV64DiMedia');
    if(!media){
      media=document.createElement('div');
      media.className='pcV64DiMedia';
      media.setAttribute('role','button');
      media.setAttribute('tabindex','0');
      media.setAttribute('aria-label','Ver preview de Doble Intención');
      media.innerHTML=diArt()+'<span class="pcV64DiBadge">PREVIEW DEL PRODUCTO</span>';
      card.insertBefore(media,card.firstChild);
    }
    if(!media.dataset.pcV64Bound){
      media.dataset.pcV64Bound='1';
      const open=()=>window.pcOpenRealPreview?.('DI-TRILOGIA');
      media.addEventListener('click',open);
      media.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}});
    }
    const h=card.querySelector('h3');if(h)h.textContent='DOBLE INTENCIÓN';
    const accent=card.querySelector('.accent');if(accent)accent.textContent='TRILOGÍA · CHISPA · FUEGO · DOMINIO · +18';
    const p=card.querySelector('p');if(p)p.textContent='Elegí el clima de la partida. Un solo código desbloquea las tres ediciones, el juego digital y el material descargable.';
    return true;
  }

  function patchTowerCard(){
    const card=document.querySelector('#drawer-family .pcComingCard[data-coming-code="TORRE-AMERICA"]');
    if(!card)return false;
    card.classList.add('pcV64TowerCard');
    card.querySelectorAll(':scope > .pcV4Cover').forEach(n=>n.remove());
    const media=card.querySelector(':scope > .pcComingMedia');
    if(media&&!media.querySelector('.pcV64TowerLine'))media.insertAdjacentHTML('beforeend','<span class="pcV64TowerLine">FÚTBOL · TRIVIA · DESAFÍOS</span>');
    const h=card.querySelector('h3');if(h)h.textContent='TORRE DE AMÉRICA';
    const accent=card.querySelector('.accent');if(accent)accent.textContent='TRIVIA, DESAFÍOS Y PASIÓN FUTBOLERA';
    const p=card.querySelector('p');if(p)p.textContent='Una experiencia para responder, competir y compartir la pasión por el fútbol de toda América.';
    return true;
  }

  function patchTowerModal(){
    const modal=document.getElementById('pcComingModalV57');if(!modal)return false;
    const title=norm(modal.querySelector('#pcComingTitle')?.textContent||'');
    const isTower=!modal.classList.contains('hidden')&&title.includes('TORRE DE AMERICA');
    modal.classList.toggle('pcV64TowerModal',isTower);
    return isTower;
  }

  function apply(){
    if(applying)return;applying=true;
    try{
      ensureStyle();
      patchDobleProduct();
      patchDobleCard();
      patchTowerCard();
      patchTowerModal();
    }finally{applying=false}
  }

  function schedule(){
    if(queued)return;queued=true;
    requestAnimationFrame(()=>{queued=false;apply()});
  }

  window.pcApplyMissingCategoryPreviewV64=apply;
  window.pcV64PreviewAudit=()=>({
    version:VERSION,
    dobleCard:!!document.querySelector('#drawer-adult .pcV64DiCard .pcV64DiMedia'),
    doblePreview:!!window.PC_REAL_PREVIEWS_V2?.['DI-TRILOGIA']?.__v64,
    towerCard:!!document.querySelector('#drawer-family .pcComingCard[data-coming-code="TORRE-AMERICA"].pcV64TowerCard'),
    towerGenericCovers:document.querySelectorAll('#drawer-family .pcComingCard[data-coming-code="TORRE-AMERICA"] > .pcV4Cover').length,
    towerMedia:!!document.querySelector('#drawer-family .pcComingCard[data-coming-code="TORRE-AMERICA"] .pcComingMedia')
  });

  new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  schedule();[250,650,1200,2200,3800].forEach(ms=>setTimeout(schedule,ms));
})();
