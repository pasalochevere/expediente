/* V6.4 · MISSING CATEGORY PREVIEW PASS
   Completa Pareja & Adultos (Doble Intención) y unifica Torre de América.
   V6.4.1 alinea Doble Intención, Mesa Tarot, Víncores y Escuela de Runas.
   Sólo presentación comercial: no toca precios, licencias, checkout ni acceso al producto. */
(()=>{
  if(window.__pcMissingCategoryPreviewV64)return;
  window.__pcMissingCategoryPreviewV64=true;

  const VERSION='20261020-di-v21k';
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
    st.textContent += "\n/* DI-V2.1K · Vista comercial coherente con Intro 2.1H. No modifica otros productos. */\n#drawer-adult .card.pcV64DiCard .pcV64DiMedia{border-bottom-color:rgba(255,100,163,.30)!important}\n.pcV64DiArt.pcV21KArt{background:radial-gradient(circle at 74% 26%,rgba(255,67,147,.26),transparent 31%),linear-gradient(118deg,#130914 0%,#261025 43%,#361027 72%,#181021 100%)!important;color:#fff2f5}\n.pcV64DiArt.pcV21KArt:before{background:radial-gradient(circle at 16% 75%,rgba(177,80,192,.16),transparent 38%)!important}\n.pcV64DiArt.pcV21KArt:after{background:linear-gradient(90deg,rgba(8,4,14,.18),transparent 52%),linear-gradient(180deg,transparent 55%,rgba(8,4,12,.45))!important;box-shadow:inset 0 0 44px rgba(8,3,12,.2)!important;pointer-events:none}\n.pcV21KArt .pcV64DiCopy{left:5.8%;top:14%;width:53%;max-width:270px;z-index:3}\n.pcV21KArt .pcV64DiCopy small{font-size:clamp(8px,.67vw,10px);color:#ffc4dc;letter-spacing:.13em}\n.pcV21KArt .pcV64DiCopy strong{font-family:Georgia,serif;font-size:clamp(27px,3.4vw,44px);line-height:.91;margin-top:11px;letter-spacing:-.055em;color:#fff4f4;overflow-wrap:normal}\n.pcV21KArt .pcV64DiCopy strong em{display:block;color:#ff86b8;font-style:normal}\n.pcV21KArt .pcV64DiCopy>span{font-size:clamp(8px,.71vw,10px);color:#f7c992;letter-spacing:.12em;font-weight:800;line-height:1.4;margin-top:12px}\n.pcV21KWheelArt{position:absolute;z-index:2;right:7%;top:45%;transform:translateY(-50%) rotate(-13deg);width:min(37%,164px);aspect-ratio:1;border-radius:50%;border:4px solid #442036;background:conic-gradient(from -40deg,#e84489 0 120deg,#f07a59 120deg 240deg,#9861bd 240deg 360deg);box-shadow:0 10px 27px rgba(0,0,0,.46),0 0 0 4px rgba(255,178,205,.16),inset 0 0 0 2px rgba(255,235,241,.50)}\n.pcV21KWheelArt:before{content:\"\";position:absolute;inset:12%;border-radius:50%;border:1px solid rgba(255,220,227,.52);box-shadow:0 0 26px rgba(20,0,18,.34) inset}\n.pcV21KWheelArt:after{content:\"\";position:absolute;left:50%;top:-13px;transform:translateX(-50%);width:0;height:0;border-left:9px solid transparent;border-right:9px solid transparent;border-top:18px solid #ffe3cf;filter:drop-shadow(0 2px 3px #140613)}\n.pcV21KWheelCore{position:absolute;z-index:2;inset:34%;display:flex;flex-direction:column;justify-content:center;align-items:center;border-radius:50%;background:#220c22;color:#fff1f1;border:2px solid #ffadd1;transform:rotate(13deg);box-shadow:0 0 12px rgba(0,0,0,.65)}\n.pcV21KWheelCore b{font:900 clamp(12px,1.6vw,18px)/1 Georgia,serif}.pcV21KWheelCore small{font:800 5px/1.1 Arial,sans-serif;letter-spacing:.08em;margin-top:2px;color:#ff95c1}\n.pcV21KHeroStat{position:absolute;z-index:3;right:4%;bottom:8%;color:#f9c7df;font:800 8px/1.3 'Segoe UI',Arial,sans-serif;letter-spacing:.06em;text-align:right}\n.pcV64DiBadge{color:#ffe3f0!important;border-color:rgba(255,99,164,.52)!important;background:rgba(26,6,23,.92)!important}\n#drawer-adult .pcV64DiCard .accent{color:#eeb5d0}\n.pcV21KScene{position:relative;overflow:hidden;width:100%;height:100%;min-height:240px;background:linear-gradient(130deg,#160a17,#34122e 64%,#130a18);color:#fff3f5;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;font-family:'Segoe UI',Arial,sans-serif;padding:16px 18px 54px;box-sizing:border-box}\n.pcV21KScene .pcV64DiArt.pcV21KArt{position:absolute;inset:0}\n.pcV21KScene .pcV21KArt .pcV64DiCopy{left:7%;top:17%;text-align:left}\n.pcV21KScene .pcV21KArt .pcV64DiCopy strong{font-size:clamp(26px,4vw,49px)}\n.pcV21KScene .pcV21KWheelArt{right:12%;top:45%;width:min(32%,195px)}\n.pcV21KScene .pcV21KHeroStat{right:8%;bottom:23%}\n.pcV21KScene h3{font:800 clamp(19px,2.6vw,30px)/1.04 Georgia,serif;letter-spacing:-.03em;margin:0 0 7px}\n.pcV21KScene p{margin:7px 0;font-size:clamp(10px,1.3vw,13px);line-height:1.35;color:#e9c7db;max-width:340px}\n.pcV21KDemoWheel{position:relative;width:clamp(108px,24%,165px);aspect-ratio:1;margin:12px auto;border-radius:50%;background:conic-gradient(from 20deg,#e84489 0 120deg,#f07958 120deg 240deg,#925ac5 240deg 360deg);border:4px solid #4a1e41;box-shadow:0 0 0 3px #cf79a3,0 14px 25px #0e040c}\n.pcV21KDemoWheel:before{content:\"\";position:absolute;top:-17px;left:calc(50% - 9px);border-left:9px solid transparent;border-right:9px solid transparent;border-top:19px solid #ffe5f4}\n.pcV21KDemoWheel:after{content:\"DI\";position:absolute;inset:37%;border-radius:50%;background:#290b26;border:2px solid #f3b0ce;display:grid;place-items:center;font:900 clamp(13px,2.3vw,22px)/1 Georgia,serif}\n.pcV21KModes{display:flex;justify-content:center;flex-wrap:wrap;gap:5px;margin-top:6px}\n.pcV21KModes span{border:1px solid rgba(255,188,216,.36);border-radius:99px;padding:5px 8px;background:#32152e;font:700 9px/1.1 'Segoe UI',Arial,sans-serif;letter-spacing:.04em}\n.pcV21KModes span:nth-child(2){border-color:#fa9868}.pcV21KModes span:nth-child(3){border-color:#c9a5f5}.pcV21KModes span:nth-child(4){border-color:#f7c992}\n.pcV21KMiniPrints{display:flex;gap:12px;justify-content:center;align-items:center;margin:13px auto 8px}\n.pcV21KMiniPrint{width:112px;height:150px;border-radius:12px;border:2px solid #fa8bad;background:linear-gradient(170deg,#49102c,#250c26);box-shadow:0 9px 18px #090409;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:13px 9px;box-sizing:border-box}\n.pcV21KMiniPrint.bw{background:#f7f5f3;border-color:#9b8992;color:#231621}\n.pcV21KMiniPrint b{font:850 10px/1.2 'Segoe UI',Arial,sans-serif;letter-spacing:.06em}\n.pcV21KMiniPrint strong{font:700 34px/1 Georgia,serif}.pcV21KMiniPrint small{font:700 8px/1.2 'Segoe UI',Arial,sans-serif;letter-spacing:.1em}\n.pcV21KScene .pcV21KPrintBadge{border:1px solid rgba(251,172,210,.45);border-radius:99px;color:#ffb8d6;padding:6px 10px;font:800 10px/1.1 'Segoe UI',Arial,sans-serif}\n@media(max-width:620px){\n .pcV21KArt .pcV64DiCopy{left:5%;top:13%;width:57%}\n .pcV21KArt .pcV64DiCopy small{font-size:7px}\n .pcV21KArt .pcV64DiCopy strong{font-size:clamp(24px,6.6vw,34px);margin-top:7px}\n .pcV21KArt .pcV64DiCopy>span{font-size:7px;margin-top:8px}\n .pcV21KWheelArt{right:6%;width:34%;top:48%}\n .pcV21KHeroStat{font-size:6px;bottom:10%;right:5%}\n .pcV21KScene{padding-bottom:48px}\n .pcV21KScene .pcV21KWheelArt{top:47%;right:7%;width:36%}\n .pcV21KScene .pcV21KArt .pcV64DiCopy strong{font-size:clamp(24px,5.2vw,40px)}\n}\n@media(max-width:350px){\n .pcV21KArt .pcV64DiCopy strong{font-size:22px}\n .pcV21KWheelArt{right:5%;width:32%}\n .pcV21KHeroStat{font-size:5.5px}\n}\n";
    document.head.appendChild(st);
  }

  function diArt(){return "<div class=\"pcV64DiArt pcV21KArt\">\n <div class=\"pcV21KGlow\" aria-hidden=\"true\"></div>\n <div class=\"pcV64DiCopy\">\n  <small>PASALOCHEVERE · EXPERIENCIA +18</small>\n  <strong>Doble<em>Intención.</em></strong>\n  <span>UNA TORRE · CUATRO RULETAS</span>\n </div>\n <div class=\"pcV21KWheelArt\" aria-hidden=\"true\">\n  <span class=\"pcV21KWheelArrow\"></span>\n  <div class=\"pcV21KWheelCore\"><b>DI</b><small>RULETA</small></div>\n </div>\n <div class=\"pcV21KHeroStat\" aria-hidden=\"true\">✦ CHISPA &nbsp; ◈ FUEGO &nbsp; ♛ DOMINIO</div>\n </div>";}

  function findDobleCard(){
    return [...document.querySelectorAll('#drawer-adult .drawerGrid > .card:not(.pcComingCard)')].find(card=>norm(card.textContent).includes('DOBLE INTENCION'))||null;
  }

  function patchDobleProduct(){
    const p=window.PC_REAL_PREVIEWS_V2?.['DI-TRILOGIA'];
    if(!p)return false;
    if(p.__v21k)return true;
    p.title='Doble Intención';
    p.subtitle='Trilogía · CHISPA · FUEGO · DOMINIO · +18';
    p.summary='Una torre, cuatro ruletas y 126 desafíos. Jugá desde el celular y descargá las cartas en PDF color o blanco y negro con tu acceso personal.';
    p.format='Digital + 126 cartas imprimibles';
    p.use='Pareja · +18';
    p.focus='4 ruletas · 3 modos · Ruleta Total';
    p.safe='Retos protegidos por licencia';
    p.slides=[
      {kind:'ui',label:'Nueva identidad',note:'Imagen de presentación alineada con la intro V2.1H.',render:()=>"<div class=\"pcV21KScene\"><div class=\"pcV64DiArt pcV21KArt\">\n <div class=\"pcV21KGlow\" aria-hidden=\"true\"></div>\n <div class=\"pcV64DiCopy\">\n  <small>PASALOCHEVERE · EXPERIENCIA +18</small>\n  <strong>Doble<em>Intención.</em></strong>\n  <span>UNA TORRE · CUATRO RULETAS</span>\n </div>\n <div class=\"pcV21KWheelArt\" aria-hidden=\"true\">\n  <span class=\"pcV21KWheelArrow\"></span>\n  <div class=\"pcV21KWheelCore\"><b>DI</b><small>RULETA</small></div>\n </div>\n <div class=\"pcV21KHeroStat\" aria-hidden=\"true\">✦ CHISPA &nbsp; ◈ FUEGO &nbsp; ♛ DOMINIO</div>\n </div></div>"},
      {kind:'ui',label:'Las cuatro ruletas',note:'Tres modos y una Ruleta Total, sin mostrar retos protegidos.',render:()=>"<div class=\"pcV21KScene\"><h3>Cuatro formas de jugar</h3><p>Elegí CHISPA, FUEGO, DOMINIO o dejá que la RULETA TOTAL sorprenda.</p><div class=\"pcV21KDemoWheel\" aria-hidden=\"true\"></div><div class=\"pcV21KModes\"><span>✦ CHISPA</span><span>◈ FUEGO</span><span>♛ DOMINIO</span><span>↻ TOTAL</span></div></div>"},
      {kind:'ui',label:'Cartas imprimibles',note:'126 cartas listas para imprimir en color o blanco y negro.',render:()=>"<div class=\"pcV21KScene\"><h3>También se juega en papel</h3><div class=\"pcV21KMiniPrints\"><div class=\"pcV21KMiniPrint\"><b>CHISPA · FUEGO · DOMINIO</b><strong>✦</strong><small>PDF COLOR</small></div><div class=\"pcV21KMiniPrint bw\"><b>CHISPA · FUEGO · DOMINIO</b><strong>♛</strong><small>PDF B/N</small></div></div><div class=\"pcV21KPrintBadge\">126 CARTAS · 16 HOJAS A4 POR VERSIÓN</div><p>Descarga disponible con licencia activa.</p></div>"}
    ];
    p.__v21k=true;
    p.__v64=true;p.__v641=true;
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
    const p=card.querySelector('p');if(p)p.textContent='Cuatro ruletas, 126 desafíos y cartas imprimibles en color y B/N. Un acceso para las tres ediciones.';
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
    alignment:'DI-V2.1K',
    dobleCard:!!document.querySelector('#drawer-adult .pcV64DiCard .pcV64DiMedia'),
    doblePreview:!!window.PC_REAL_PREVIEWS_V2?.['DI-TRILOGIA']?.__v21k,
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
