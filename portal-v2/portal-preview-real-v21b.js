(()=>{
  if(window.__pcPreviewRealV21B)return;
  window.__pcPreviewRealV21B=true;

  const html={
    diIntensity:()=>`<div class="pcV21DiIntensity"><small>DOBLE INTENCIÓN · TRES CLIMAS</small><h4>La misma noche puede empezar distinto.</h4><div class="pcV21DiLevels"><div class="pcV21DiLevel"><b>CHISPA</b><p>Entrada suave, humor y conexión.</p></div><div class="pcV21DiLevel"><b>FUEGO</b><p>Más intensidad y decisiones compartidas.</p></div><div class="pcV21DiLevel"><b>DOMINIO</b><p>El nivel más alto de la trilogía.</p></div></div></div>`,
    megaModes:()=>`<div class="pcV21MegaModes"><h4>Verdad o Reto <span>+800</span></h4><div class="pcV21MegaModeGrid"><div class="pcV21MegaMode kids"><b>KIDS</b><span>Familiar · dinámico · simple</span></div><div class="pcV21MegaMode general"><b>GENERAL</b><span>Para grupos y reuniones</span></div><div class="pcV21MegaMode fiesta"><b>FIESTA 18+</b><span>Más ritmo e intensidad</span></div><div class="pcV21MegaMode filtro"><b>SIN FILTRO 18+</b><span>La versión más atrevida</span></div></div></div>`,
    megaFlow:()=>`<div class="pcV21MegaFlow"><small>TORRE O SOLO DIGITAL</small><h4>Elegí el modo. Sacá una consigna. Seguí jugando.</h4><div class="pcV21MegaSteps"><div class="pcV21MegaStep"><i>01</i><b>ELEGÍ</b><span>Seleccioná la versión según el grupo.</span></div><div class="pcV21MegaStep"><i>02</i><b>JUGÁ</b><span>Una pregunta o reto por vez.</span></div><div class="pcV21MegaStep"><i>03</i><b>REPETÍ</b><span>Más de 800 consignas para rotar partidas.</span></div></div></div>`,
    vincHuman:()=>`<div class="pcV21VincHuman"><div><small>VÍNCORES · ESCENA</small><h4>Ver una relación también ayuda a pensarla distinto.</h4><p>Ubicá personas, distancias, dirección y vínculo. Guardá escenas para volver a mirarlas más adelante.</p></div><div class="pcV21VincScene"><span class="pcV21VincLine"></span><span class="pcV21VincPerson a"></span><span class="pcV21VincPerson b"></span><span class="pcV21VincPerson c"></span></div></div>`,
    tarotDeck:()=>`<div class="pcV21Tarot"><small>GUÍA INTERACTIVA · BIBLIOTECA</small><h4>Explorá las 78 cartas con contexto.</h4><div class="pcV21TarotDeck"><div class="pcV21TarotCard"><b>EL LOCO</b><span>ARCANO MAYOR</span></div><div class="pcV21TarotCard"><b>LA SACERDOTISA</b><span>ARCANO MAYOR</span></div><div class="pcV21TarotCard"><b>EL SOL</b><span>ARCANO MAYOR</span></div><div class="pcV21TarotCard"><b>LA LUNA</b><span>ARCANO MAYOR</span></div></div></div>`,
    tarotPractice:()=>`<div class="pcV21Tarot"><small>PRÁCTICA GUIADA</small><h4>Una tirada. Tres posiciones. Una lectura.</h4><div class="pcV21TarotPositions"><div class="pcV21TarotPos"><div class="pcV21TarotCard"><b>POSICIÓN 1</b><span>Carta oculta en preview</span></div><span>Situación</span></div><div class="pcV21TarotPos"><div class="pcV21TarotCard"><b>POSICIÓN 2</b><span>Carta oculta en preview</span></div><span>Tensión</span></div><div class="pcV21TarotPos"><div class="pcV21TarotCard"><b>POSICIÓN 3</b><span>Carta oculta en preview</span></div><span>Integración</span></div></div></div>`,
    squishyLibrary:()=>`<div class="pcV21Squishy"><small>PAPER SQUISHY FACTORY · CATÁLOGO</small><h4>50 personajes · 5 colecciones</h4><div class="pcV21SqCollections"><div class="pcV21SqCollection"><b>SWEET SQUISHIES</b><span>Donita · Cuppy · Heladín · Shaky · Maca · Waffy · Galleti · Carami · Torti · Paleti</span></div><div class="pcV21SqCollection"><b>FOOD SQUAD</b><span>Burgui · Pizzi · Tacci · Sushi · Hotty · Poppi · Frydi · Sandwi · Noodi · Eggi</span></div><div class="pcV21SqCollection"><b>ANIMAL CUTIES</b><span>Teddy · Luli · Mishi · Rocko · Kumo y más</span></div><div class="pcV21SqCollection"><b>COSMIC FRIENDS</b><span>Luni · Soli · Esteli · Coheti · Saturni · Astri · Cometi · Ovni Pop · Nebuli · Lumo</span></div><div class="pcV21SqCollection"><b>MAGIC OBJECTS</b><span>Poci · Libri · Cristali · Calderi · Variti · Llavi · Orbi · Cofri · Areni · Sombreri</span></div></div></div>`,
    squishyFlow:()=>`<div class="pcV21Squishy"><small>CREATOR PLUS · FLUJO</small><h4>Elegí. Personalizá. Prepará para imprimir.</h4><div class="pcV21SqFlow"><div><i>01</i><b>ELEGIR</b><span>Partí de uno de los personajes disponibles.</span></div><div><i>02</i><b>PERSONALIZAR</b><span>Trabajá dentro del editor Creator Plus.</span></div><div><i>03</i><b>IMPRIMIR</b><span>Los archivos finales se habilitan sólo con licencia activa.</span></div></div></div>`
  };

  function patchProducts(){
    const p=window.PC_REAL_PREVIEWS_V2;
    if(!p)return false;

    if(p['DI-TRILOGIA']&&!p['DI-TRILOGIA'].__v21b){
      p['DI-TRILOGIA'].slides=[
        p['DI-TRILOGIA'].slides[0],
        p['DI-TRILOGIA'].slides[1],
        {kind:'ui',label:'Tres intensidades',note:'Tres climas distintos dentro de una misma experiencia.',render:html.diIntensity}
      ];
      p['DI-TRILOGIA'].__v21b=true;
    }

    if(p['TORRE-MEGA']&&!p['TORRE-MEGA'].__v21b){
      p['TORRE-MEGA'].slides=[
        {kind:'ui',label:'Cuatro versiones',note:'Cada modo tiene su propio clima de partida.',render:html.megaModes},
        p['TORRE-MEGA'].slides[1],
        {kind:'ui',label:'Flujo de juego',note:'Compatible con torre o uso solo digital.',render:html.megaFlow}
      ];
      p['TORRE-MEGA'].__v21b=true;
    }

    if(p['VINC-001']&&!p['VINC-001'].__v21b){
      p['VINC-001'].slides=[
        p['VINC-001'].slides[0],
        p['VINC-001'].slides[1],
        {kind:'ui',label:'Una escena para volver a mirar',note:'La herramienta pone el foco en personas, posiciones y relaciones.',render:html.vincHuman}
      ];
      p['VINC-001'].summary='Representá personas, distancias, emociones y relaciones dentro de una escena que podés guardar y volver a revisar.';
      p['VINC-001'].__v21b=true;
    }

    if(p['TAROT-GUIDE']&&!p['TAROT-GUIDE'].__v21b){
      p['TAROT-GUIDE'].slides=[
        {kind:'ui',label:'Biblioteca de cartas',note:'Interfaz de muestra basada en la estructura real de la guía.',render:html.tarotDeck},
        {kind:'ui',label:'Práctica guiada',note:'La preview no revela interpretaciones completas.',render:html.tarotPractice},
        {kind:'ui',label:'Aprender y practicar',note:'Carta, posición y contexto dentro del mismo recorrido.',render:html.tarotDeck}
      ];
      p['TAROT-GUIDE'].__v21b=true;
    }

    if(p['PSQ-FACTORY']&&!p['PSQ-FACTORY'].__v21b){
      p['PSQ-FACTORY'].slides=[
        {kind:'ui',label:'5 colecciones reales',note:'Nombres reales del catálogo; sin exponer archivos imprimibles.',render:html.squishyLibrary},
        p['PSQ-FACTORY'].slides[1],
        {kind:'ui',label:'Flujo Creator Plus',note:'La exportación completa requiere licencia activa.',render:html.squishyFlow}
      ];
      p['PSQ-FACTORY'].__v21b=true;
    }
    return true;
  }

  function setText(el,value){if(el&&el.textContent!==value)el.textContent=value}

  function polishModal(){
    const modal=document.getElementById('pcRealPreviewModal');
    if(!modal)return;
    const title=(modal.querySelector('#pcRv2Title')?.textContent||'').toUpperCase();
    modal.querySelectorAll('.pcRv2Slide[data-kind="ui"] .pcRv2Source').forEach(el=>setText(el,'INTERFAZ DE MUESTRA'));
    if(title.includes('HOTEL ORFEO')||title.includes('ÚLTIMA REUNIÓN')){
      modal.querySelectorAll('.pcRv2Slide[data-kind="image"] .pcRv2Source').forEach(el=>setText(el,'IMAGEN REAL · SIN SPOILERS'));
    }
    if(title.includes('PAPER SQUISHY')){
      modal.querySelectorAll('.pcRv2Source').forEach(el=>{if(el.textContent.includes('INTERFAZ'))setText(el,'MUESTRA SEGURA')});
    }
  }

  function watchModal(){
    const root=document.body;
    let queued=false;
    const obs=new MutationObserver(()=>{
      if(queued)return;queued=true;
      requestAnimationFrame(()=>{queued=false;polishModal()});
    });
    obs.observe(root,{childList:true,subtree:true,characterData:true});
    setTimeout(polishModal,0);
  }

  function boot(){
    if(!patchProducts())return false;
    watchModal();
    if(typeof window.pcApplyPreviewRealV2==='function')window.pcApplyPreviewRealV2();
    return true;
  }

  if(!boot()){
    let tries=0;
    const t=setInterval(()=>{tries++;if(boot()||tries>30)clearInterval(t)},100);
  }
})();
