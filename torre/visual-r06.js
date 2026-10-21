(()=>{'use strict';
 if(!/^\/expediente\/torre\/(?:index\.html)?$/.test(location.pathname))return;
 const sheet=document.createElement('link');sheet.rel='stylesheet';sheet.href='./visual-r06.css?v=20261021-r06';document.head.appendChild(sheet);
 const classicCSS=`
 :root{--bg:#f5ecdf;--ink:#261d20;--card:#fffaf4;--muted:#70625f;--gold:#c88b4a}
 body{background:radial-gradient(circle at 90% 0%,rgba(214,136,125,.14),transparent 38%),linear-gradient(135deg,#f9f1e5,#ecddcc)!important}
 .hero{background:linear-gradient(130deg,#fffaf4,#f5e6da)!important;border-color:#e6d5c7!important;box-shadow:0 15px 40px rgba(65,35,24,.13)!important}
 .hero h1,.hero h1 span,.hero .kicker,.hero .hero-sub{color:#3a2631!important;text-shadow:none!important}
 .panel,.mode-card,.content-card,.bonus-card,.timer-screen{background:linear-gradient(145deg,#fffdf8,#f6ebdf)!important;color:#281d24!important;border-color:#e8d5c5!important;box-shadow:0 14px 38px rgba(65,35,24,.09)!important}
 .panel h3,.panel p.big,.content-card .content-title,.content-card .content-text,.bonus-card .content-title,.bonus-card .content-text,.mode-card h3,.mode-card p{color:#3a2931!important}
 .content-card .content-text{font-size:clamp(18px,4.2vw,24px)!important;line-height:1.42!important}
 .choice-btn.secondary{background:#fffaf4!important;color:#382831!important;border-color:#e8d5c5!important}
 .choice-btn.secondary .choice-copy strong,.choice-btn.secondary .choice-copy small{color:#382831!important}
 .mode-card.locked{background:#eae0d6!important;border-style:dashed!important}
 .topbar .titleBox h2{color:#fff!important}
 `;
 const frame=document.getElementById('gameFrame');
 function applyClassicSkin(){
   try{const doc=frame?.contentDocument;if(!doc||!doc.head||doc.getElementById('vr800-r06-classic'))return;const style=doc.createElement('style');style.id='vr800-r06-classic';style.textContent=classicCSS;doc.head.appendChild(style)}catch(err){console.warn('VR800-R06: nested game visual skin not available',err)}
 }
 if(frame)frame.addEventListener('load',applyClassicSkin);
})();