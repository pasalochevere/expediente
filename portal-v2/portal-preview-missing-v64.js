/* V6.4 · MISSING CATEGORY PREVIEW PASS
   Completa Pareja & Adultos (Doble Intención) y unifica Torre de América.
   V6.4.1 alinea Doble Intención, Mesa Tarot, Víncores y Escuela de Runas.
   Sólo presentación comercial: no toca precios, licencias, checkout ni acceso al producto. */
(()=>{
  if(window.__pcMissingCategoryPreviewV64)return;
  window.__pcMissingCategoryPreviewV64=true;

  const VERSION='20261009-v641';
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
      .pcV64DiOrbit{position:absolute;right:6%;top:50%;width:146px;height:146px;transform:translateY(-50%);border:1px solid rgba(255,217,159,.16);border-radius:50%;z-index:1}
      .pcV64DiOrbit:before,.pcV64DiOrbit:after{content:'';position:absolute;border:1px solid rgba(255,217,159,.11);border-radius:50%}.pcV64DiOrbit:before{inset:22px}.pcV64DiOrbit:after{inset:47px}
      .pcV64DiCopy{position:absolute;z-index:3;left:24px;top:18px;width:47%;max-width:270px;text-shadow:0 2px 16px rgba(0,0,0,.58)}
      .pcV64DiCopy small{display:block;color:#edc36e;font-size:.55rem;font-weight:950;letter-spacing:.14em;line-height:1.35}.pcV64DiCopy strong{display:block;margin-top:7px;font:700 clamp(1.58rem,2.6vw,2.38rem)/.86 Georgia,serif;letter-spacing:-.042em;overflow-wrap:anywhere}.pcV64DiCopy strong em{display:block;color:#ffd083;font-style:normal}.pcV64DiCopy>span{display:block;margin-top:8px;color:#f5e5d8;font-size:.50rem;font-weight:900;letter-spacing:.075em;line-height:1.3}
      .pcV64DiLevels{position:absolute;z-index:3;right:14px;bottom:18px;display:grid;gap:5px;width:116px}
      .pcV64DiLevel{display:grid;grid-template-columns:16px 1fr;grid-template-areas:'icon name' 'icon desc';column-gap:6px;padding:6px 7px;border:1px solid rgba(255,222,171,.18);border-radius:10px;background:rgba(14,8,13,.47);backdrop-filter:blur(5px);box-shadow:0 8px 18px rgba(0,0,0,.12)}
      .pcV64DiLevel i{grid-area:icon;align-self:center;color:#f0bd66;font-style:normal;font-size:.70rem}.pcV64DiLevel b{grid-area:name;color:#fff1df;font-size:.54rem;letter-spacing:.075em}.pcV64DiLevel span{grid-area:desc;color:#cbb8ae;font-size:.45rem;margin-top:1px}
      .pcV64DiBadge{position:absolute;z-index:5;left:13px;bottom:11px;padding:6px 9px;border-radius:999px;background:rgba(8,7,9,.90);border:1px solid rgba(224,183,84,.48);color:#f2d17b;font-size:.56rem;font-weight:950;letter-spacing:.075em;backdrop-filter:blur(7px);white-space:nowrap}
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

      /* V6.4.1 · wellbeing alignment master */
      #drawer-wellbeing .drawerGrid>.card.pcV641AlignedCard{padding:0 18px 18px!important;overflow:hidden!important}
      #drawer-wellbeing .drawerGrid>.card.pcV641AlignedCard>.pcV4Cover,
      #drawer-wellbeing .drawerGrid>.card.pcV641RunasCard>.pcV641RunasOldVisual{display:none!important}
      #drawer-wellbeing .drawerGrid>.card.pcV641AlignedCard>.pcLiveMediaV62,
      #drawer-wellbeing .drawerGrid>.card.pcV641AlignedCard>.pcV641RunasMedia{position:relative!important;width:calc(100% + 36px)!important;aspect-ratio:16/9!important;margin:0 -18px 16px!important;border-radius:0!important;overflow:hidden!important;background:#09090b!important;border-bottom:1px solid rgba(214,176,91,.18)!important}
      #drawer-wellbeing .drawerGrid>.card.pcV641AlignedCard>.status{margin-top:0!important}
      #drawer-wellbeing .drawerGrid>.card.pcV641AlignedCard>h3{min-height:2.18em;margin:12px 0 5px!important;line-height:1.05!important;letter-spacing:-.025em}
      #drawer-wellbeing .drawerGrid>.card.pcV641AlignedCard>.accent{min-height:2.45em;line-height:1.35!important}
      #drawer-wellbeing .drawerGrid>.card.pcV641AlignedCard>p{margin-top:13px!important;line-height:1.48!important}
      #drawer-wellbeing .pcV641TarotCard .pcV62TarotArt{padding:20px 23px!important}
      #drawer-wellbeing .pcV641TarotCard .pcV62TarotArt small{font-size:.57rem!important;letter-spacing:.095em!important}
      #drawer-wellbeing .pcV641TarotCard .pcV62TarotArt strong{max-width:47%!important;margin-top:7px!important;font-size:clamp(1.55rem,2.55vw,2.25rem)!important;line-height:.86!important;letter-spacing:-.035em!important;position:relative;z-index:2}
      #drawer-wellbeing .pcV641TarotCard .pcV62TarotCards{right:5%!important;bottom:14%!important;gap:6px!important;transform:rotate(-2deg)!important}
      #drawer-wellbeing .pcV641TarotCard .pcV62TarotCards i{width:48px!important;border-radius:7px!important;font-size:1.1rem!important}
      #drawer-wellbeing .pcV641TarotCard .pcV62TarotCards i:nth-child(2){transform:translateY(-9px)!important}
      #drawer-wellbeing .pcV641TarotCard .pcLiveBadgeV62{left:12px!important;bottom:11px!important}
      #drawer-wellbeing .pcV641VincCard .pcV62VincArt{padding:20px 23px!important;background-position:80% 50%!important;background-size:60% auto!important}
      #drawer-wellbeing .pcV641VincCard .pcV62VincArt strong{font-size:clamp(1.55rem,2.55vw,2.28rem)!important;line-height:.90!important}
      #drawer-wellbeing .pcV641VincCard .pcV62VincArt p{max-width:43%!important;font-size:.67rem!important;line-height:1.3!important}
      .pcV641RunasMedia{isolation:isolate}
      .pcV641RunasMedia>img{display:block;width:100%;height:100%;object-fit:cover;object-position:center 48%;filter:saturate(.98) contrast(1.02)}
      .pcV641RunasMedia:after{content:'';position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(180deg,rgba(5,5,7,.02) 48%,rgba(5,5,7,.48) 100%)}
      .pcV641RunasBadge{position:absolute;z-index:4;left:12px;bottom:11px;padding:6px 9px;border-radius:999px;background:rgba(8,8,10,.88);border:1px solid rgba(224,183,84,.48);color:#f2d17b;font-size:.59rem;font-weight:950;letter-spacing:.075em;backdrop-filter:blur(7px);white-space:nowrap}

      @media(max-width:620px){
        .pcV64DiMedia{aspect-ratio:16/10}
        .pcV64DiCopy{left:17px;top:15px;width:48%;max-width:205px}.pcV64DiCopy small{font-size:.48rem}.pcV64DiCopy strong{font-size:1.48rem}.pcV64DiCopy>span{font-size:.43rem}
        .pcV64DiLevels{right:8px;bottom:13px;width:96px;gap:4px}.pcV64DiLevel{padding:5px 6px}.pcV64DiLevel span{display:none}.pcV64DiBadge{font-size:.50rem;padding:5px 7px}
        #drawer-family .pcComingCard.pcV64TowerCard .pcComingMedia{aspect-ratio:16/10!important}
        #drawer-wellbeing .drawerGrid>.card.pcV641AlignedCard>.pcLiveMediaV62,#drawer-wellbeing .drawerGrid>.card.pcV641AlignedCard>.pcV641RunasMedia{aspect-ratio:16/10!important}
        #drawer-wellbeing .pcV641TarotCard .pcV62TarotArt{padding:18px!important}
        #drawer-wellbeing .pcV641TarotCard .pcV62TarotArt strong{max-width:51%!important;font-size:1.55rem!important}
        #drawer-wellbeing .pcV641TarotCard .pcV62TarotCards i{width:42px!important}
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
    p.__v641=true;
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

  function wellbeingCards(){
    return [...document.querySelectorAll('#drawer-wellbeing .drawerGrid > .card:not(.emptyCard)')];
  }

  function patchTarot(card){
    if(!card)return false;
    card.classList.add('pcV641AlignedCard','pcV641TarotCard');
    const media=card.querySelector(':scope > .pcLiveMediaV62');
    if(media)media.classList.add('pcV641AlignedMedia');
    const title=media?.querySelector('.pcV62TarotArt strong');
    if(title&&title.dataset.pcV641!=='1'){
      title.dataset.pcV641='1';
      title.innerHTML='Mesa<br>Tarot.';
    }
    return !!media;
  }

  function patchVinc(card){
    if(!card)return false;
    card.classList.add('pcV641AlignedCard','pcV641VincCard');
    const media=card.querySelector(':scope > .pcLiveMediaV62');
    if(media)media.classList.add('pcV641AlignedMedia');
    return !!media;
  }

  function findRealPreviewCode(term){
    const hit=Object.entries(window.PC_REAL_PREVIEWS_V2||{}).find(([,p])=>norm(p?.title).includes(term)||norm(p?.subtitle).includes(term));
    return hit?.[0]||'';
  }

  function patchRunas(card){
    if(!card)return false;
    card.classList.add('pcV641AlignedCard','pcV641RunasCard');
    [...card.children].forEach(node=>{
      if(node.classList?.contains('pcV641RunasMedia'))return;
      if(node.classList?.contains('pcV4Cover')||node.classList?.contains('pcLiveMediaV62')||node.classList?.contains('pcComingMedia'))node.classList.add('pcV641RunasOldVisual');
    });
    let media=card.querySelector(':scope > .pcV641RunasMedia');
    if(!media){
      media=document.createElement('div');
      media.className='pcV641RunasMedia';
      media.innerHTML=`<img src="assets/upcoming/runas.webp?v=${VERSION}" alt="Escuela de Runas · preview del producto" loading="lazy" decoding="async"><span class="pcV641RunasBadge">PREVIEW DEL PRODUCTO</span>`;
      card.insertBefore(media,card.firstChild);
    }
    const code=findRealPreviewCode('RUNAS');
    if(code&&!media.dataset.pcV641Bound){
      media.dataset.pcV641Bound='1';
      media.setAttribute('role','button');media.setAttribute('tabindex','0');media.setAttribute('aria-label','Ver preview de Escuela de Runas');
      const open=()=>window.pcOpenRealPreview?.(code);
      media.addEventListener('click',open);
      media.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}});
    }
    return true;
  }

  function patchWellbeingAlignment(){
    let tarot=false,vinc=false,runas=false;
    wellbeingCards().forEach(card=>{
      const t=norm(card.textContent);
      if(t.includes('MESA TAROT'))tarot=patchTarot(card)||tarot;
      else if(t.includes('VINCORES'))vinc=patchVinc(card)||vinc;
      else if(t.includes('RUNAS'))runas=patchRunas(card)||runas;
    });
    return {tarot,vinc,runas};
  }

  function apply(){
    if(applying)return;applying=true;
    try{
      ensureStyle();
      patchDobleProduct();
      patchDobleCard();
      patchTowerCard();
      patchTowerModal();
      patchWellbeingAlignment();
    }finally{applying=false}
  }

  function schedule(){
    if(queued)return;queued=true;
    requestAnimationFrame(()=>{queued=false;apply()});
  }

  window.pcApplyMissingCategoryPreviewV64=apply;
  window.pcV64PreviewAudit=()=>({
    version:VERSION,
    alignment:'V6.4.1',
    dobleCard:!!document.querySelector('#drawer-adult .pcV64DiCard .pcV64DiMedia'),
    doblePreview:!!window.PC_REAL_PREVIEWS_V2?.['DI-TRILOGIA']?.__v641,
    tarotAligned:!!document.querySelector('#drawer-wellbeing .pcV641TarotCard>.pcLiveMediaV62'),
    vincAligned:!!document.querySelector('#drawer-wellbeing .pcV641VincCard>.pcLiveMediaV62'),
    runasAligned:!!document.querySelector('#drawer-wellbeing .pcV641RunasCard>.pcV641RunasMedia'),
    towerCard:!!document.querySelector('#drawer-family .pcComingCard[data-coming-code="TORRE-AMERICA"].pcV64TowerCard'),
    towerGenericCovers:document.querySelectorAll('#drawer-family .pcComingCard[data-coming-code="TORRE-AMERICA"] > .pcV4Cover').length,
    towerMedia:!!document.querySelector('#drawer-family .pcComingCard[data-coming-code="TORRE-AMERICA"] .pcComingMedia')
  });

  new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  schedule();[250,650,1200,2200,3800].forEach(ms=>setTimeout(schedule,ms));
})();
