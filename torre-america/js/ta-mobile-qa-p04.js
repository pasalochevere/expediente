/* TA-UI V2.0-P0.4 — keyboard accessibility patch, preview only.
   Never modifies S, DB, original handlers, scoring, license or intro. */
(function(){
 "use strict";
 function setup(root){
  if(!root||root.dataset.taP04==="1")return;
  root.dataset.taP04="1";
  root.addEventListener("keydown",function(e){
   if(e.key!=="Enter"&&e.key!==" ")return;
   const card=e.target.closest(".option");
   if(!card||!root.contains(card))return;
   const index=Array.from(root.querySelectorAll(".option")).indexOf(card);
   if(index<0)return;
   // P0.3 activates the option and reconstructs cards synchronously.
   requestAnimationFrame(function(){
    const chosen=root.querySelectorAll(".option")[index];
    if(chosen&&document.activeElement!==chosen)chosen.focus({preventScroll:true});
   });
  },true);
 }
 function init(){
  if(!document.getElementById("app")||document.body.dataset.taP04Ready==="1")return;
  document.body.dataset.taP04Ready="1";
  document.body.classList.add("ta-mobile-p04");
  ["modeOpts","diffOpts"].forEach(id=>setup(document.getElementById(id)));
  window.TA_MOBILE_QA_P04={version:"TA-UI-V2-P0.4",scope:"preview UI only",keyboardFocusRecovery:true,gameEngineTouched:false,licenseTouched:false};
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});
 else init();
})();