(()=>{
  if(window.__pcPreviewRealV2)return;
  window.__pcPreviewRealV2=true;

  const norm=(v)=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().trim();
  const esc=(s)=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  let activeCode='';
  let activeIndex=0;
  let oldBodyOverflow='';
  let originalOpenPreview=null;

  const ui={
    diIntro:()=>`<div class="pcRv2Ui pcRv2Ui--di"><div style="height:100%;display:flex;flex-direction:column;justify-content:center"><div class="rv2DiBrand">DOBLE<span>INTENCIÓN</span></div><div class="rv2DiTagline">Una noche. Dos intenciones.</div><div class="rv2DiPills"><span>CHISPA</span><span>FUEGO</span><span>DOMINIO</span></div></div></div>`,
    diGame:()=>`<div class="pcRv2Ui pcRv2Ui--di"><div class="rv2DiWorkspace"><div class="rv2DiPanel"><small>ELEGÍ EDICIÓN · NÚMERO</small><div class="rv2DiPills" style="margin-top:10px"><span>CHISPA</span><span>FUEGO</span><span>DOMINIO</span></div><div class="rv2DiNums">${Array.from({length:20},(_,i)=>`<i class="${i===11?'hot':''}">${String(i+1).padStart(2,'0')}</i>`).join('')}</div></div><div class="rv2DiCard"><small>DOBLE INTENCIÓN · VISTA DEMO</small><div class="rv2DiNumber">12</div><div class="rv2DiRule"></div><div class="rv2DiPlaceholder">La consigna aparece acá después de activar tu acceso.</div><div class="rv2DiActions"><span>SÍ</span><span>MÁS SUAVE</span><span>PASO</span></div></div></div></div>`,
    kidsMenu:()=>`<div class="pcRv2Ui pcRv2Ui--kids"><div class="rv2KidsTop"><img src="../torre-kids-matematica/assets/mascota-bloqui.svg" alt="Bloqui"><div class="rv2KidsTitle">CHÉVERE KIDS<span>MATEMÁTICA</span></div></div><div class="rv2KidsGrid"><div class="rv2KidsTile"><img src="../torre-kids-matematica/assets/icon-calculo.svg" alt=""><b>CÁLCULO</b></div><div class="rv2KidsTile"><img src="../torre-kids-matematica/assets/icon-logica.svg" alt=""><b>LÓGICA</b></div><div class="rv2KidsTile"><img src="../torre-kids-matematica/assets/icon-problemas.svg" alt=""><b>PROBLEMAS</b></div><div class="rv2KidsTile"><img src="../torre-kids-matematica/assets/icon-velocidad.svg" alt=""><b>VELOCIDAD</b></div><div class="rv2KidsTile"><img src="../torre-kids-matematica/assets/icon-multiplicacion.svg" alt=""><b>MULTIPLICACIÓN</b></div><div class="rv2KidsTile"><img src="../torre-kids-matematica/assets/icon-super.svg" alt=""><b>SÚPER DESAFÍO</b></div></div></div>`,
    kidsChallenge:()=>`<div class="pcRv2Ui pcRv2Ui--kids"><div class="rv2KidsChallenge"><div class="rv2Bloqui"><img src="../torre-kids-matematica/assets/mascota-bloqui.svg" alt="Bloqui"></div><div class="rv2ChallengeCard"><small>DESAFÍO · NIVEL 2</small><strong>Tu desafío de matemática aparece acá.</strong><div class="rv2Stars">★ ★ ★</div><p style="font-size:.7rem;color:#52727c;line-height:1.45">La preview muestra la interfaz, no las consignas completas del producto.</p></div></div></div>`,
    megaModes:()=>`<div class="pcRv2Ui pcRv2Ui--mega"><div class="rv2MegaTitle">VERDAD O RETO <span>+800</span></div><div class="rv2MegaModes"><div class="rv2MegaMode"><b>KIDS</b><small>Juego familiar</small></div><div class="rv2MegaMode"><b>GENERAL</b><small>Para cualquier grupo</small></div><div class="rv2MegaMode"><b>FIESTA 18+</b><small>Más intensidad</small></div><div class="rv2MegaMode"><b>SIN FILTRO 18+</b><small>Nivel adulto</small></div></div></div>`,
    megaPrompt:()=>`<div class="pcRv2Ui pcRv2Ui--mega"><div class="rv2MegaCard"><div class="rv2MegaPrompt"><small>FIESTA · CONSIGNA ALEATORIA</small><strong>La pregunta o el reto aparece acá al jugar.</strong><span>SIGUIENTE CONSIGNA</span></div></div></div>`,
    vincoresField:()=>`<div class="pcRv2Ui pcRv2Ui--vincores"><div class="rv2VTop"><b>VÍNCORES DIGITAL</b><span>CAMPO DE CONSTELACIÓN</span></div><div class="rv2VFrame"><div class="rv2VBoard"><span class="rv2VLink"></span><span class="rv2VNode a"></span><span class="rv2VNode b"></span><span class="rv2VNode c"></span><span class="rv2VLabel l1">PERSONA A</span><span class="rv2VLabel l2">PERSONA B</span></div></div></div>`,
    vincoresWorkspace:()=>`<div class="pcRv2Ui pcRv2Ui--vincores"><div class="rv2VSide"><div class="rv2VPanel"><b>FIGURAS & ROLES</b><p>Personas, símbolos, tamaños y estilos.</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-top:10px">${Array.from({length:6},()=>'<span style="height:35px;border:1px solid #ddd4c8;border-radius:8px;background:#faf7f2"></span>').join('')}</div></div><div class="rv2VPanel"><b>ESCENA</b><div class="rv2VSceneMini"></div></div><div class="rv2VPanel"><b>PROPIEDADES</b><p>Nombre · rol · emoción · vínculo · dirección.</p><div style="display:grid;gap:6px;margin-top:9px">${Array.from({length:5},()=>'<span style="height:24px;border:1px solid #ddd4c8;border-radius:7px;background:#fff"></span>').join('')}</div></div></div></div>`,
    tarotGate:()=>`<div class="pcRv2Ui pcRv2Ui--tarot"><div class="rv2TarotBrand"><small>PASALOCHEVERE · GUÍA INTERACTIVA</small><h4>Mesa Tarot</h4><p>Aprendé, practicá e interpretá con las 78 cartas.</p><div class="rv2TarotCards"><div class="rv2TarotCard"><span>☼</span></div><div class="rv2TarotCard"><span>✦</span></div><div class="rv2TarotCard"><span>☾</span></div></div></div></div>`,
    tarotLibrary:()=>`<div class="pcRv2Ui pcRv2Ui--tarot"><div style="max-width:700px;margin:auto"><div class="rv2TarotBrand" style="margin-top:0;text-align:left"><small>BIBLIOTECA · 78 CARTAS</small><h4 style="font-size:2rem">Exploración guiada</h4></div><div class="rv2TarotLibrary">${Array.from({length:18},(_,i)=>`<div class="rv2TarotMini">${['☼','✦','☾','♢','○','△'][i%6]}</div>`).join('')}</div></div></div>`,
    tarotSpread:()=>`<div class="pcRv2Ui pcRv2Ui--tarot"><div class="rv2TarotBrand"><small>PRÁCTICA DE TIRADA</small><h4 style="font-size:2rem">Tres posiciones</h4><div class="rv2TarotCards"><div class="rv2TarotCard"><span>1</span></div><div class="rv2TarotCard"><span>2</span></div><div class="rv2TarotCard"><span>3</span></div></div><p style="font-size:.72rem">La interpretación completa se habilita dentro de la experiencia.</p></div></div>`,
    squishyLibrary:()=>`<div class="pcRv2Ui pcRv2Ui--squishy"><div class="rv2SqTitle">PAPER SQUISHY<span>FACTORY</span></div><div class="rv2SqCollection">${['Sweet','Food','Animal','Magic'].map(x=>`<div class="rv2SqCharacter"><div class="rv2SqBlob"></div><small>${x} Collection</small></div>`).join('')}</div></div>`,
    squishyEditor:()=>`<div class="pcRv2Ui pcRv2Ui--squishy"><div class="rv2SqEditor"><div class="rv2SqPanel"><b>ELEMENTOS</b><div class="rv2SqTools">${Array.from({length:7},()=>'<span></span>').join('')}</div></div><div class="rv2SqPanel rv2SqCanvas"><div class="rv2SqBigBlob"></div></div><div class="rv2SqPanel"><b>CREATOR PLUS</b><div class="rv2SqTools">${Array.from({length:5},()=>'<span></span>').join('')}</div><div class="rv2SqLock">Imprimibles y exportación completa disponibles con licencia activa.</div></div></div></div>`
  };

  const PRODUCTS={
    'DI-TRILOGIA':{category:'PAREJA & ADULTOS',title:'Doble Intención',subtitle:'Chispa · Fuego · Dominio',summary:'Una experiencia de pareja con tres intensidades. La preview reproduce el lenguaje visual y la mecánica sin mostrar consignas premium.',format:'Digital + imprimibles',use:'Pareja · +18',focus:'Conexión y desafío',safe:'Contenido protegido',slides:[
      {kind:'ui',label:'Identidad real',note:'Basada en la intro V11 actualmente publicada.',render:ui.diIntro},
      {kind:'ui',label:'Interfaz de partida',note:'Selector y tarjeta fieles al motor actual, con contenido de muestra.',render:ui.diGame},
      {kind:'ui',label:'Tres intensidades',note:'Chispa, Fuego y Dominio dentro de una misma experiencia.',render:ui.diIntro}
    ]},
    'TK-MAT-79-PHY':{category:'FAMILIA & KIDS',title:'Chévere Kids · Matemática',subtitle:'Torre física + digital · 7–9 años',summary:'Bloqui, niveles y categorías matemáticas en una experiencia que acompaña la torre física.',format:'Físico + digital',use:'7–9 años',focus:'Cálculo · lógica · problemas',slides:[
      {kind:'ui',label:'Bloqui + categorías',note:'Usa la mascota e iconografía reales del producto.',render:ui.kidsMenu},
      {kind:'ui',label:'Desafío en pantalla',note:'Vista fiel del flujo, sin revelar la biblioteca de ejercicios.',render:ui.kidsChallenge},
      {kind:'image',src:'../torre-kids-matematica/assets/torre-kids-logo.svg',fit:'contain',bg:'#eefbff',label:'Identidad Torre Kids',note:'Activo gráfico real del producto.'}
    ]},
    'TK-MAT-79-DIG':{category:'FAMILIA & KIDS',title:'Chévere Kids · Matemática',subtitle:'Solo digital · 7–9 años',summary:'La misma lógica educativa preparada para jugar desde celular o tablet, sin requerir torre física.',format:'100% digital',use:'Celular o tablet',focus:'Cálculo · lógica · práctica',slides:[
      {kind:'ui',label:'Biblioteca de desafíos',note:'Categorías visuales y Bloqui.',render:ui.kidsMenu},
      {kind:'ui',label:'Partida breve',note:'Así se presenta un desafío durante el juego.',render:ui.kidsChallenge},
      {kind:'image',src:'../torre-kids-matematica/assets/mascota-bloqui.svg',fit:'contain',bg:'#e7faff',label:'Bloqui',note:'Mascota real de Chévere Kids.'}
    ]},
    'TORRE-MEGA':{category:'FAMILIA & FIESTA',title:'Verdad o Reto +800',subtitle:'Kids · General · Fiesta · Sin Filtro',summary:'Cuatro estilos de partida y una gran biblioteca de preguntas y retos para torre o modo digital.',format:'Digital + torre',use:'4 versiones',focus:'Preguntas · retos · grupo',safe:'Sin consignas premium',slides:[
      {kind:'ui',label:'Elegí la versión',note:'Cuatro ambientes de juego claramente separados.',render:ui.megaModes},
      {kind:'ui',label:'Consigna en partida',note:'Interfaz de muestra sin revelar contenido pago.',render:ui.megaPrompt},
      {kind:'ui',label:'Modo grupo',note:'El motor entrega una consigna por vez para mantener el ritmo.',render:ui.megaModes}
    ]},
    'TORRE-AMERICA':{category:'FÚTBOL · JUEGO',title:'Torre de América',subtitle:'Trivia · desafíos · experiencia futbolera',summary:'Una experiencia de fútbol con presentación cinematográfica, bloques, preguntas y momentos de partido.',format:'Digital + juego físico',use:'Grupo · fútbol',focus:'Trivia · retos · eventos',slides:[
      {kind:'image',src:'../torre-america/assets/cinema-hd/hero.webp',label:'Hero cinematográfico',note:'Imagen real del producto.'},
      {kind:'image',src:'../torre-america/assets/cinema/hd/03-blocks-hd.svg',fit:'contain',bg:'#07111a',label:'La torre entra en juego',note:'Escena real de la intro cinematográfica.'},
      {kind:'image',src:'../torre-america/assets/cinema/hd/05-penalty-hd.svg',fit:'contain',bg:'#07111a',label:'Momentos de partido',note:'Activo real del producto.'},
      {kind:'image',src:'../torre-america/assets/cinema/hd/11-home-hd.svg',fit:'contain',bg:'#07111a',label:'Entrada a la experiencia',note:'Pantalla visual real del producto.'}
    ]},
    'EXP-001':{category:'EXPEDIENTES · CASO 001',title:'La Última Reunión',subtitle:'Investigación multijugador · sin spoilers',summary:'Recorré espacios, revisá información y construí una hipótesis con tu equipo. La galería usa escenas reales pero excluye evidencias sensibles.',format:'Investigación digital',use:'Multijugador',focus:'Deducción · evidencias',safe:'SIN SPOILERS',slides:[
      {kind:'image',src:'../caso001/assets/escenas/estudio.jpg',label:'El estudio',note:'Escena real del expediente. No revela la solución.'},
      {kind:'image',src:'../caso001/assets/escenas/pasillo-acceso.jpg',label:'Pasillo de acceso',note:'Escena ambiental real del caso.'},
      {kind:'image',src:'../caso001/assets/escenas/sala-estar.jpg',label:'Sala de estar',note:'Espacio real de investigación.'},
      {kind:'image',src:'../caso001/assets/escenas/cocina.jpg',label:'Cocina',note:'Escena real, seleccionada sin evidencia crítica.'}
    ]},
    'EXP-002':{category:'EXPEDIENTES · CASO 002',title:'Hotel Orfeo · 317',subtitle:'3 jugadores · roles privados · sin spoilers',summary:'Hotel Orfeo, Habitación 317 y una investigación con rutas variables. Mostramos atmósfera y estructura sin exponer respuestas.',format:'Investigación digital',use:'3 jugadores',focus:'Misterio inmersivo',safe:'SIN SPOILERS',slides:[
      {kind:'image',src:'../caso002/assets/visual/bin/room-317-v244.jpg',label:'Habitación 317',note:'Imagen real del caso.'},
      {kind:'image',src:'../caso002/assets/visual/bin/L03-v244.jpg',label:'Hotel Orfeo',note:'Activo visual real seleccionado para preview sin resolución.'},
      {kind:'ui',label:'Roles privados',note:'Cada jugador recibe información propia antes de construir la hipótesis.',render:()=>`<div class="pcRv2Ui" style="background:radial-gradient(circle at 70% 20%,#5b3a2044,transparent 35%),#0b0908;color:#efe3d7"><div style="max-width:700px;margin:6% auto"><small style="color:#d1a563;letter-spacing:.16em">HOTEL ORFEO · ROLES PRIVADOS</small><h3 style="font-size:clamp(1.8rem,5vw,3.4rem);margin:8px 0 20px">Cada mirada tiene una parte de la historia.</h3><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:9px">${['JUGADOR 1','JUGADOR 2','JUGADOR 3'].map(x=>`<div style="min-height:120px;border:1px solid #5e4936;border-radius:14px;padding:14px;background:#15100d"><b>${x}</b><p style="color:#a99b90;font-size:.68rem;line-height:1.45">Información privada habilitada dentro de la partida.</p></div>`).join('')}</div></div></div>`},
      {kind:'ui',label:'Construir la hipótesis',note:'Pistas y decisiones convergen al final sin mostrar la respuesta.',render:()=>`<div class="pcRv2Ui" style="background:#0d0b0a;color:#eee1d4"><div style="max-width:720px;margin:7% auto"><small style="color:#c99a3a;letter-spacing:.15em">INVESTIGACIÓN · SIN SPOILERS</small><h3 style="font-size:2rem;margin:8px 0 18px">Conectá lo que cada jugador descubrió.</h3><div style="display:grid;gap:8px">${['PISTA PRIVADA','REGISTRO DEL HOTEL','DECISIÓN DEL GRUPO'].map((x,i)=>`<div style="padding:13px;border:1px solid #483d35;border-radius:12px;background:#151210"><b>${String(i+1).padStart(2,'0')} · ${x}</b><span style="display:block;color:#9f948b;font-size:.68rem;margin-top:4px">Contenido disponible durante la partida.</span></div>`).join('')}</div></div></div>`}
    ]},
    'VINC-001':{category:'BIENESTAR & VÍNCULOS',title:'Víncores',subtitle:'Campo de vínculos interactivo',summary:'Un espacio visual para representar personas, posiciones, emociones y relaciones dentro de escenas guardables.',format:'Herramienta digital',use:'Exploración guiada',focus:'Vínculos · escenas · bitácora',slides:[
      {kind:'ui',label:'Campo de constelación',note:'Reconstrucción fiel del campo que usa el producto.',render:ui.vincoresField},
      {kind:'ui',label:'Workspace de edición',note:'Figuras, escena y propiedades organizadas como en la aplicación real.',render:ui.vincoresWorkspace},
      {kind:'ui',label:'Escena guardable',note:'La herramienta permite trabajar y revisar configuraciones visuales.',render:ui.vincoresField}
    ]},
    'TAROT-GUIDE':{category:'BIENESTAR · TAROT',title:'Guía Interactiva de Tarot',subtitle:'78 cartas · tiradas · práctica guiada',summary:'Una guía para aprender, practicar e interpretar Tarot con biblioteca, ejercicios y tiradas.',format:'Guía interactiva',use:'Aprendizaje y práctica',focus:'Cartas · tiradas · interpretación',slides:[
      {kind:'ui',label:'Mesa Tarot',note:'Lenguaje visual fiel a la aplicación publicada.',render:ui.tarotGate},
      {kind:'ui',label:'Biblioteca de 78 cartas',note:'Vista conceptual de la navegación por cartas.',render:ui.tarotLibrary},
      {kind:'ui',label:'Práctica de tiradas',note:'La preview muestra posiciones, no respuestas ni interpretaciones completas.',render:ui.tarotSpread}
    ],catalogCodes:['TAROT-GUIDE','TAROT-78']},
    'PSQ-FACTORY':{category:'CREATIVOS · FACTORY',title:'Paper Squishy Factory',subtitle:'Creator Plus · 50 diseños actuales',summary:'Elegí diseños, personalizalos en Creator Plus y prepará tu proyecto para imprimir. Los archivos finales requieren licencia activa.',format:'Factory digital',use:'Biblioteca + editor',focus:'Crear · personalizar · imprimir',safe:'DESCARGA BLOQUEADA SIN LICENCIA',slides:[
      {kind:'ui',label:'Biblioteca creativa',note:'Representación segura de colecciones; no entrega archivos de diseño.',render:ui.squishyLibrary},
      {kind:'ui',label:'Creator Plus',note:'Vista fiel del concepto de editor sin assets descargables.',render:ui.squishyEditor},
      {kind:'ui',label:'Flujo de producción',note:'Elegir → personalizar → imprimir con licencia activa.',render:ui.squishyLibrary}
    ]}
  };

  window.PC_REAL_PREVIEWS_V2=Object.freeze(PRODUCTS);

  function catalogProduct(config,code){
    const keys=config.catalogCodes||[code];
    try{
      if(typeof publicCatalog!=='undefined'){
        for(const k of keys)if(publicCatalog?.[k])return {code:k,data:publicCatalog[k]};
      }
    }catch{}
    try{
      for(const k of keys)if(window.publicCatalog?.[k])return {code:k,data:window.publicCatalog[k]};
    }catch{}
    return {code:keys[0],data:null};
  }

  function formatPrice(v){
    const n=Number(v||0);if(!(n>0))return '';
    try{return new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(n)}catch{return '$ '+n.toLocaleString('es-AR')}
  }

  function slideMarkup(slide,i){
    if(slide.kind==='image'){
      const fit=slide.fit||'cover',bg=slide.bg||'#0b0b0d';
      return `<div class="pcRv2Slide ${i===0?'active':''}" data-kind="image" data-index="${i}" style="background:${esc(bg)}"><img src="${esc(slide.src)}" alt="${esc(slide.label||'Vista del producto')}" loading="eager" style="object-fit:${esc(fit)}" onerror="this.style.display='none';this.parentElement.classList.add('assetFail')"><div class="pcRv2SlideCaption"><div><b>${esc(slide.label||'Vista del producto')}</b><span>${esc(slide.note||'')}</span></div><span class="pcRv2Source">IMAGEN REAL</span></div></div>`;
    }
    return `<div class="pcRv2Slide ${i===0?'active':''}" data-kind="ui" data-index="${i}">${slide.render()}<div class="pcRv2SlideCaption"><div><b>${esc(slide.label||'Interfaz')}</b><span>${esc(slide.note||'')}</span></div><span class="pcRv2Source">INTERFAZ FIEL</span></div></div>`;
  }

  function thumbMarkup(slide,i){
    const inner=slide.kind==='image'?`<img src="${esc(slide.src)}" alt="" style="object-fit:${esc(slide.fit||'cover')}">`:`<div style="position:absolute;inset:0;background:linear-gradient(145deg,#2c2027,#111014)"></div>`;
    return `<button type="button" class="pcRv2Thumb ${i===0?'active':''}" data-index="${i}" aria-label="Ver ${esc(slide.label||'vista '+(i+1))}">${inner}<span>${esc(slide.label||'Vista '+(i+1))}</span></button>`;
  }

  function ensureModal(){
    let modal=document.getElementById('pcRealPreviewModal');
    if(modal)return modal;
    modal=document.createElement('div');modal.id='pcRealPreviewModal';modal.className='pcRv2Modal hidden';modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-labelledby','pcRv2Title');
    modal.innerHTML=`<div class="pcRv2Dialog"><header class="pcRv2Head"><div><div class="pcRv2Eyebrow" id="pcRv2Category">VISTA PREVIA</div><h2 id="pcRv2Title">Experiencia</h2><div class="pcRv2Sub" id="pcRv2Subtitle"></div></div><button type="button" class="pcRv2Close" aria-label="Cerrar vista previa">×</button></header><div class="pcRv2Hero"><section class="pcRv2Gallery"><div class="pcRv2StageWrap"><div class="pcRv2Stage" id="pcRv2Stage"></div><div class="pcRv2Nav"><button type="button" data-dir="-1" aria-label="Vista anterior">‹</button><button type="button" data-dir="1" aria-label="Vista siguiente">›</button></div></div><div class="pcRv2Rail" id="pcRv2Rail"></div></section><aside class="pcRv2Info"><div class="pcRv2BadgeRow" id="pcRv2Badges"></div><h3 id="pcRv2InfoTitle"></h3><p id="pcRv2Summary"></p><div class="pcRv2Facts" id="pcRv2Facts"></div><div class="pcRv2Promise" id="pcRv2Promise"></div></aside></div><footer class="pcRv2Footer"><div class="pcRv2Price"><small>ACCESO DIGITAL</small><strong id="pcRv2Price">Según catálogo</strong></div><div class="pcRv2FooterActions"><button type="button" class="btn" data-action="close">SEGUIR MIRANDO</button><button type="button" class="btn primary" id="pcRv2Cta">COMPRAR / ACTIVAR</button></div></footer></div>`;
    document.body.appendChild(modal);
    modal.querySelector('.pcRv2Close').onclick=closeRealPreview;
    modal.querySelector('[data-action="close"]').onclick=closeRealPreview;
    modal.querySelectorAll('.pcRv2Nav button').forEach(b=>b.onclick=()=>move(Number(b.dataset.dir||1)));
    modal.addEventListener('click',e=>{if(e.target===modal)closeRealPreview()});
    return modal;
  }

  function showSlide(index){
    const config=PRODUCTS[activeCode];if(!config)return;
    const count=config.slides.length;activeIndex=(index+count)%count;
    const modal=ensureModal();
    modal.querySelectorAll('.pcRv2Slide').forEach((el,i)=>el.classList.toggle('active',i===activeIndex));
    modal.querySelectorAll('.pcRv2Thumb').forEach((el,i)=>{el.classList.toggle('active',i===activeIndex);if(i===activeIndex)el.scrollIntoView({behavior:'smooth',block:'nearest',inline:'nearest'})});
  }
  function move(delta){showSlide(activeIndex+delta)}

  function openRealPreview(code){
    const config=PRODUCTS[code];if(!config)return false;
    activeCode=code;activeIndex=0;
    const modal=ensureModal();
    modal.querySelector('#pcRv2Category').textContent=config.category;
    modal.querySelector('#pcRv2Title').textContent=config.title;
    modal.querySelector('#pcRv2Subtitle').textContent=config.subtitle;
    modal.querySelector('#pcRv2InfoTitle').textContent='Así se ve y así se usa';
    modal.querySelector('#pcRv2Summary').textContent=config.summary;
    modal.querySelector('#pcRv2Badges').innerHTML='<span class="pcRv2Badge">PREVIEW REAL V2</span>'+(config.safe?'<span class="pcRv2Badge safe">'+esc(config.safe)+'</span>':'');
    modal.querySelector('#pcRv2Facts').innerHTML=`<div class="pcRv2Fact"><b>Formato</b><span>${esc(config.format)}</span></div><div class="pcRv2Fact"><b>Uso</b><span>${esc(config.use)}</span></div><div class="pcRv2Fact"><b>Enfoque</b><span>${esc(config.focus)}</span></div>`;
    modal.querySelector('#pcRv2Promise').innerHTML=config.safe?.includes('SPOILERS')?'<strong>Preview cuidada.</strong> Usamos escenas y estructura reales, pero no mostramos la solución ni evidencias críticas.':'<strong>Lo que ves es una muestra comercial segura.</strong> Las imágenes marcadas como reales provienen del producto; las vistas de interfaz reproducen su diseño y flujo sin exponer contenido premium.';
    modal.querySelector('#pcRv2Stage').innerHTML=config.slides.map(slideMarkup).join('');
    modal.querySelector('#pcRv2Rail').innerHTML=config.slides.map(thumbMarkup).join('');
    modal.querySelectorAll('.pcRv2Thumb').forEach(b=>b.onclick=()=>showSlide(Number(b.dataset.index||0)));

    const {code:checkoutCode,data:prod}=catalogProduct(config,code);
    const price=formatPrice(prod?.price_ars);
    modal.querySelector('#pcRv2Price').textContent=price||'Según catálogo';
    const cta=modal.querySelector('#pcRv2Cta');
    if(prod?.sales_enabled&&Number(prod.price_ars)>0&&typeof window.buyNow==='function'){
      cta.textContent='COMPRAR · '+price;
      cta.onclick=()=>{closeRealPreview();window.buyNow(checkoutCode)};
    }else{
      cta.textContent='YA COMPRÉ · ACTIVAR';
      cta.onclick=()=>{closeRealPreview();if(typeof window.scrollToActivation==='function')window.scrollToActivation()};
    }

    oldBodyOverflow=document.body.style.overflow;document.body.style.overflow='hidden';
    modal.classList.remove('hidden');
    modal.querySelector('.pcRv2Close').focus({preventScroll:true});
    return true;
  }

  function closeRealPreview(){
    const modal=document.getElementById('pcRealPreviewModal');if(!modal)return;
    modal.classList.add('hidden');document.body.style.overflow=oldBodyOverflow||'';activeCode='';
  }

  function detectCardCode(card){
    if(card.dataset.productCode&&PRODUCTS[card.dataset.productCode])return card.dataset.productCode;
    const title=norm(card.querySelector('h3')?.textContent||'');
    const accent=norm(card.querySelector('.accent')?.textContent||'');
    if(title.includes('DOBLE INTENCION'))return 'DI-TRILOGIA';
    if(title.includes('TORRE DE AMERICA'))return 'TORRE-AMERICA';
    if(title.includes('CHEVERE KIDS')&&title.includes('MATEMATICA'))return accent.includes('FISICO')?'TK-MAT-79-PHY':'TK-MAT-79-DIG';
    if(title.includes('MEGA PACK')||title.includes('VERDAD O RETO'))return 'TORRE-MEGA';
    if(title.includes('EXPEDIENTES')&&(accent.includes('001')||title.includes('001')||title.includes('ULTIMA REUNION')))return 'EXP-001';
    if(title.includes('EXPEDIENTES')&&(accent.includes('002')||title.includes('002')||title.includes('ORFEO')))return 'EXP-002';
    if(title.includes('VINCORES'))return 'VINC-001';
    if(title.includes('TAROT'))return 'TAROT-GUIDE';
    if(title.includes('PAPER SQUISHY'))return 'PSQ-FACTORY';
    return '';
  }

  function installButtons(){
    document.querySelectorAll('.categoryDrawer .card').forEach(card=>{
      if(card.classList.contains('emptyCard'))return;
      const code=detectCardCode(card);if(!code)return;
      card.dataset.pcRealPreviewCode=code;
      let wrap=card.querySelector('.previewAction');
      let btn=wrap?.querySelector('.btn');
      if(!wrap){wrap=document.createElement('div');wrap.className='previewAction pcRv2PreviewAction';btn=document.createElement('button');btn.type='button';btn.className='btn';wrap.appendChild(btn);const actions=card.querySelector('.actions');if(actions)card.insertBefore(wrap,actions);else card.appendChild(wrap)}
      if(!btn)return;
      btn.textContent='VER EXPERIENCIA';
      btn.removeAttribute('onclick');
      btn.onclick=(e)=>{e.preventDefault();e.stopPropagation();openRealPreview(code)};
      btn.setAttribute('aria-label','Ver experiencia '+(PRODUCTS[code]?.title||''));
    });
  }

  function installOverride(){
    if(window.__pcPreviewRealV2Override)return;
    if(typeof window.openPreview!=='function')return;
    originalOpenPreview=window.openPreview;
    window.__pcPreviewRealV2Override=true;
    window.openPreview=function(productCode){
      if(PRODUCTS[productCode])return openRealPreview(productCode);
      return originalOpenPreview.apply(this,arguments);
    };
  }

  function watch(){
    const root=document.querySelector('.categoryDrawers')||document.body;
    if(root.dataset.pcRv2Observed==='1')return;
    root.dataset.pcRv2Observed='1';let queued=false;
    new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;installButtons()})}).observe(root,{childList:true,subtree:true});
  }

  function keydown(e){
    const modal=document.getElementById('pcRealPreviewModal');if(!modal||modal.classList.contains('hidden'))return;
    if(e.key==='Escape')closeRealPreview();
    else if(e.key==='ArrowLeft')move(-1);
    else if(e.key==='ArrowRight')move(1);
  }

  function boot(){watch();installOverride();installButtons()}
  window.pcOpenRealPreview=openRealPreview;
  window.pcApplyPreviewRealV2=boot;
  document.addEventListener('keydown',keydown);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  setTimeout(boot,250);setTimeout(boot,900);setTimeout(boot,2000);
})();