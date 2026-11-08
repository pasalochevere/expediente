/* TA-UI V2.0-P0.3 · Complemento de presentación
 * No modifica las reglas ni el contenido de las partidas.
 * Añade accesibilidad al selector de opciones y estados gráficos a resultados. */
(function(){
  "use strict";

  const doc=document;

  function decorateOptions(root){
    if(!root)return;
    const cards=root.querySelectorAll(".option");
    cards.forEach(function(card){
      if(card.dataset.taAccessible==="1"){
        card.setAttribute("aria-pressed",card.classList.contains("selected")?"true":"false");
        return;
      }
      card.dataset.taAccessible="1";
      card.setAttribute("role","button");
      card.setAttribute("tabindex","0");
      card.setAttribute("aria-pressed",card.classList.contains("selected")?"true":"false");
      const title=card.querySelector("strong");
      if(title)card.setAttribute("aria-label","Elegir "+title.textContent.trim());
      card.addEventListener("keydown",function(e){
        if(e.key==="Enter"||e.key===" "){
          e.preventDefault();
          card.click();
        }
      });
    });
  }

  function watchOptions(id){
    const root=doc.getElementById(id);
    if(!root)return;
    decorateOptions(root);
    new MutationObserver(function(){
      decorateOptions(root);
    }).observe(root,{childList:true});
  }

  function watchResult(){
    const root=doc.getElementById("result");
    const title=doc.getElementById("resultTitle");
    if(!root||!title)return;
    const update=function(){
      const text=(title.textContent||"").toLocaleUpperCase("es");
      const fail=/ATAJADA|FALL|ERROR|NO SUPER/.test(text);
      root.classList.toggle("ta-outcome-fail",fail);
      root.classList.toggle("ta-outcome-goal",!fail&&!!text.trim());
    };
    new MutationObserver(update).observe(title,{childList:true,subtree:true,characterData:true});
    update();
  }

  function watchPower(){
    const root=doc.getElementById("power");
    const title=doc.getElementById("powerTitle");
    if(!root||!title)return;
    const update=function(){
      root.classList.toggle("ta-power-red",/ROJA|EXPULS|SANCION/i.test(title.textContent||""));
    };
    new MutationObserver(update).observe(title,{childList:true,subtree:true,characterData:true});
    update();
  }

  function init(){
    if(doc.body.dataset.taUiP03Ready==="1")return;
    if(!doc.getElementById("app"))return;
    doc.body.dataset.taUiP03Ready="1";
    doc.body.classList.add("ta-v2-p03");
    watchOptions("modeOpts");
    watchOptions("diffOpts");
    watchResult();
    watchPower();

    /* Marca visual de preview; no altera la pantalla de licencia. */
    const home=doc.getElementById("home");
    const label=home?.querySelector(".ta-preview-tag");
    if(label)label.textContent="PREVIEW V2.0 · P0.3";
  }

  if(doc.readyState==="loading")doc.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();
