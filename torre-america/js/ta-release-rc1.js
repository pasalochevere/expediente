/* TA-V2.0-P0.5 · Release Candidate comercial.
 * No altera licencias ni lógica. Evita instalar por error la PWA V1
 * desde una candidata que todavía no está aprobada para producción.
 */
(function(){
  "use strict";
  const info=window.TA_RELEASE_RC;
  if(!info||info.build!=="TA-V2.0-RC1-P05R2-20261108")return;
  const style=document.createElement("style");
  style.id="ta-rc-pwa-policy";
  style.textContent='body[data-ta-commercial-candidate="RC1"] #installBtn,'+
    'body[data-ta-commercial-candidate="RC1"] #installHint{display:none!important}';
  document.head.appendChild(style);
  const label=document.querySelector("#home .hero-kicker .badge");
  if(label){
    label.textContent="V2.0 · EDICIÓN CANDIDATA";
    label.setAttribute("aria-label","Edición comercial candidata V2.0 en validación");
  }
  const stamp=document.querySelector("#home .release-stamp");
  if(stamp)stamp.textContent="TA-V2.0 RC1 · PRELANZAMIENTO";
  info.installerEnabled=false;
  info.sharedServiceWorkerUnmodified=true;
  info.entitlementUnmodified=true;
  info.production=false;
  info.requiredChecks=["editorial","penal","timer","icons","motion"];
  const gate=document.getElementById("licenseGate");
  const app=document.getElementById("app");
  function observeValidatedGate(){
    if(gate?.classList.contains("hidden")&&app?.style.display==="block"){
      info.status="access-validated";
      if(observer)observer.disconnect();
    }
  }
  let observer=null;
  if(gate&&app){
    observer=new MutationObserver(observeValidatedGate);
    observer.observe(gate,{attributes:true,attributeFilter:["class"]});
    observer.observe(app,{attributes:true,attributeFilter:["style"]});
    observeValidatedGate();
  }
})();