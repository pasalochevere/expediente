/* TA-UI V2.0-P0.4 · Protecciones de auditoría.
 * SOLO PREVIEW: no cambia reglas, premios, número de preguntas ni licencias.
 * Defensas contra dobles toques y reinicio involuntario de cronómetros.
 */
(function(){
  "use strict";
  if(document.body.dataset.taQaP04Guards==="1")return;
  document.body.dataset.taQaP04Guards="1";
  const QA={version:"P0.4",guards:[],notes:[]};
  function currentQuestionKey(){
    try{
      return [S.turnCount,S.currentBlock,S.currentContent?.id,S.currentContent?.variantOf].join(":");
    }catch(e){return "";}
  }
  // Evita que el mismo botón vuelva a contabilizar un penal ya cerrado.
  if(typeof finishPenalty==="function"){
    const original=finishPenalty;
    finishPenalty=function(ok){
      if(typeof S==="undefined"||!S.activePenalty)return;
      if(typeof penInt!=="undefined")clearInterval(penInt);
      return original(ok);
    };
    QA.guards.push("penal_unico");
  }
  // Cada remate de shootout solo se puede registrar cuando la respuesta fue
  // mostrada y los botones están realmente habilitados.
  if(typeof finishShootoutKick==="function"){
    const original=finishShootoutKick;
    finishShootoutKick=function(ok){
      if(typeof S==="undefined"||!S.shootout?.currentPen)return;
      const active=document.getElementById("shootContent");
      const controls=document.getElementById("shootActions");
      if(!active||!controls||active.classList.contains("hidden")||controls.classList.contains("hidden"))return;
      if(typeof shootInt!=="undefined")clearInterval(shootInt);
      // Ocultar inmediatamente antes de registrar, evita dobles toques.
      controls.classList.add("hidden");
      return original(ok);
    };
    QA.guards.push("shootout_unico");
  }
  // Cronómetro de consigna: un inicio por intento. Al pasar a una pregunta
  // nueva o usar segunda oportunidad, la acción vuelve a habilitarse.
  let timerKey="",timerRunning=false;
  function getTimerButton(){
    return document.querySelector('#timerWrap button[onclick*="startTimer"]');
  }
  function resetTimer(key){
    timerKey=key;timerRunning=false;
    const button=getTimerButton();
    if(button){
      button.disabled=false;
      button.removeAttribute("aria-disabled");
      button.dataset.taTimerStarted="0";
      // No sobrescribir su icono SVG, solamente restaurar el texto sin destruirlo.
      const labels=Array.from(button.childNodes).filter(x=>x.nodeType===Node.TEXT_NODE);
      if(labels.length)labels[labels.length-1].textContent=" INICIAR CRONÓMETRO";
      else button.appendChild(document.createTextNode(" INICIAR CRONÓMETRO"));
    }
  }
  if(typeof renderChallenge==="function"){
    const original=renderChallenge;
    renderChallenge=function(){
      const key=currentQuestionKey();
      const changed=key!==timerKey;
      const result=original();
      if(changed)resetTimer(key);
      return result;
    };
    QA.guards.push("timer_por_intento");
  }
  if(typeof startTimer==="function"){
    const original=startTimer;
    startTimer=function(){
      const key=currentQuestionKey();
      if(key!==timerKey)resetTimer(key);
      if(timerRunning)return;
      const seconds=Number(S.currentContent?.timer||0);
      if(!Number.isFinite(seconds)||seconds<=0)return;
      timerRunning=true;
      const button=getTimerButton();
      if(button){
        button.disabled=true;
        button.setAttribute("aria-disabled","true");
        button.dataset.taTimerStarted="1";
        const labels=Array.from(button.childNodes).filter(x=>x.nodeType===Node.TEXT_NODE);
        if(labels.length)labels[labels.length-1].textContent=" CRONÓMETRO EN MARCHA";
      }
      return original();
    };
  }
  window.TA_QA_P04_GUARDS=QA;
})();