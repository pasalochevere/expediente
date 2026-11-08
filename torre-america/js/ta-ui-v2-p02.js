/* TA-UI V2.0-P0.2 · PREVIEW
   Solo presentación. No modifica estado, respuestas, puntajes o licencias. */
(function(){
  'use strict';
  function make(tag, className, text){
    const el=document.createElement(tag);
    if(className)el.className=className;
    if(text!=null)el.textContent=text;
    return el;
  }
  function screenHeader(section, label, detail){
    if(!section || section.querySelector('.ta-p02-head'))return null;
    const bar=make('div','ta-p02-head');
    const left=make('span','ta-p02-label',label);
    const right=make('span','ta-p02-end',detail);
    bar.append(left,right);
    const hud=section.querySelector('.hud');
    if(hud)section.insertBefore(bar,hud);
    return right;
  }
  function decorateHome(){
    const home=document.getElementById('home');
    if(!home || home.querySelector('.ta-home-strip'))return;
    const actions=home.querySelector('.footer-actions');
    if(!actions)return;
    const strip=make('div','ta-home-strip');
    const middle=make('span','', 'LA COPA SE JUEGA BLOQUE A BLOQUE');
    strip.append(document.createElement('span'),middle,document.createElement('span'));
    strip.setAttribute('aria-hidden','true');
    home.insertBefore(strip,actions);
    const top=home.querySelector('.hero-premium-top');
    if(top && !top.querySelector('.ta-preview-tag')){
      const old=top.querySelector('.visual-release');
      if(old)old.remove();
      top.append(make('span','ta-preview-tag','PREVIEW V2'));
    }
  }
  function decorateTurn(){
    const section=document.getElementById('turn');
    const value=screenHeader(section,'EN LA CANCHA','PARTIDA EN CURSO');
    if(!value)return;
    const name=section.querySelector('#turnName');
    function update(){
      try{
        if(typeof S!=='undefined' && S.started){
          value.textContent='TURNO '+String((S.turnCount||0)+1).padStart(2,'0');
        }else value.textContent='PARTIDA EN CURSO';
      }catch(e){value.textContent='PARTIDA EN CURSO'}
    }
    if(name)new MutationObserver(update).observe(name,{childList:true,subtree:true,characterData:true});
    update();
  }
  function decorateChallenge(){
    const section=document.getElementById('challenge');
    screenHeader(section,'EL DESAFÍO','JUGÁ TU CARTA');
    if(!section || section.querySelector('.ta-challenge-kicker'))return;
    const card=section.querySelector(':scope > .card.gold');
    if(card){
      const row=make('div','ta-challenge-kicker');
      row.append(make('span','','NOCHE DE COPA'),make('span','','JUGADA EN CURSO'));
      card.insertBefore(row,card.firstChild);
    }
    const timer=section.querySelector('#timer');
    const question=section.querySelector('#questionText');
    function updateTimer(){
      if(!timer)return;
      const raw=Number.parseInt(timer.textContent||'0',10);
      const seconds=Number.isFinite(raw)?Math.max(0,raw):0;
      let initial=15;
      try{if(typeof S!=='undefined')initial=Number(S.currentContent?.timer)||15}catch(e){}
      const angle=Math.round(Math.min(1,seconds/Math.max(1,initial))*360);
      timer.style.setProperty('--ta-progress',angle+'deg');
      timer.setAttribute('aria-label',seconds+' segundos restantes');
    }
    if(timer)new MutationObserver(updateTimer).observe(timer,{childList:true,subtree:true,characterData:true});
    if(question)new MutationObserver(updateTimer).observe(question,{childList:true,subtree:true,characterData:true});
    updateTimer();
  }
  function init(){
    if(document.body.dataset.taUiV2Ready==='true')return;
    if(!document.getElementById('app'))return;
    document.body.dataset.taUiV2Ready='true';
    document.body.classList.add('ta-v2-p02');
    decorateHome();
    decorateTurn();
    decorateChallenge();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
