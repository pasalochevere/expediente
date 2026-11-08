/* TA-UI V2.0-P0.2R1 — Formato premium accesible.
   Se conserva S, selectVisualFormat, reglas, catálogo y licencias.
   Reemplaza solo la presentación del selector, exclusivamente en preview. */
(function(){
  "use strict";
  function towerArtwork(){
    let rows="";
    for(let i=0;i<14;i++){
      let blocks="";
      for(let j=0;j<3;j++)blocks+='<span class="ta-tower-block"></span>';
      rows+='<div class="ta-tower-row">'+blocks+'</div>';
    }
    return '<div class="ta-art-stage" aria-hidden="true"><div class="ta-art-glow"></div><div class="ta-tower-visual">'+rows+'</div></div>';
  }
  function phoneArtwork(){
    return '<div class="ta-art-stage" aria-hidden="true"><div class="ta-art-glow"></div><div class="ta-mobile-visual"><div class="ta-mobile-screen"><span class="ta-mobile-label">TORRE DIGITAL</span><span class="ta-mobile-number">27</span><span class="ta-mobile-sub">TU BLOQUE</span></div></div></div>';
  }
  function createCard(format){
    const id=String(format[0]||"").toUpperCase();
    const physical=id==="FISICA";
    const selected=typeof S!=="undefined"&&S.playFormat===id;
    const button=document.createElement("button");
    button.type="button";
    button.className="visual-format-card"+(physical?"":" digital")+(selected?" selected":"");
    button.setAttribute("aria-pressed",selected?"true":"false");
    button.setAttribute("aria-label",(physical?"Con torre física":"Solo digital")+", "+(selected?"seleccionado":"seleccionar"));
    const art=physical?towerArtwork():phoneArtwork();
    button.innerHTML='<span class="visual-format-bg" aria-hidden="true"></span>'+
      '<span class="ta-card-edge" aria-hidden="true"></span>'+
      '<span class="visual-format-check" aria-hidden="true">'+(selected?'✓':'')+'</span>'+
      art+
      '<span class="visual-format-content">'+
       '<span class="visual-format-ribbon">'+(physical?'CON TORRE DE MADERA':'SIN ELEMENTOS FÍSICOS')+'</span>'+
       '<h3>'+(physical?'Torre física':'Solo digital')+'</h3>'+
       '<p>'+(physical?'Sacá una pieza, ingresá su número y convertí cada bloque en una jugada.':'La aplicación sortea el bloque. Jugá todos los desafíos desde tu celular.')+'</p>'+
       '<span class="visual-format-cta">'+(selected?'✓ Formato seleccionado':'Elegir este formato →')+'</span>'+
      '</span>';
    button.addEventListener('click',function(){
      if(typeof S==="undefined")return;
      if(typeof selectVisualFormat==="function")selectVisualFormat(id);
      else{S.playFormat=id;renderFormats();}
    });
    return button;
  }
  function renderFormatPremium(){
    const root=document.getElementById("formatOpts");
    if(!root||typeof formats==="undefined")return;
    root.replaceChildren(...formats.map(createCard));
    const next=document.querySelector("#format .footer-actions .btn-primary");
    if(next){
      const physical=typeof S==="undefined"||S.playFormat!=="DIGITAL";
      next.textContent=physical?"Continuar con torre física →":"Continuar solo digital →";
      next.setAttribute("aria-label",next.textContent);
    }
  }
  function setup(){
    if(document.body.dataset.taFormatR1==="true")return;
    document.body.dataset.taFormatR1="true";
    /* La función es usada por la pantalla al ingresar y al cambiar el formato. */
    window.renderFormats=renderFormatPremium;
    const format=document.getElementById("format");
    if(format){
      format.classList.add("visual-v2");
      const head=format.querySelector(".section-head h2");
      if(head)head.textContent="Elegí cómo querés jugar";
      const sub=format.querySelector(".section-head .subtitle");
      if(sub)sub.textContent="Una experiencia de fútbol en dos formatos. Elegí el que va con tu partida.";
    }
    renderFormatPremium();
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",setup,{once:true});
  else setup();
})();
