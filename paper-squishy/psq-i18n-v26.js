(()=>{
  const API_VERSION='2.6.0';
  const STORAGE_KEY='psq_lang_v26';
  const PARAM='lang';
  let applying=false;
  let observer=null;
  let timer=null;

  const PAIRS=[
    ['Encendiendo la Fábrica de Squishies…','Starting the Squishy Factory…'],
    ['Saltar intro','Skip intro'],
    ['PasaloChévere presenta','PasaloChévere presents'],
    ['Fábrica de Squishies','Squishy Factory'],
    ['Tu imaginación. Tu diseño. Tu squishy.','Your imagination. Your design. Your squishy.'],
    ['ENTRAR A LA FÁBRICA →','ENTER THE FACTORY →'],
    ['La fábrica despierta','The factory awakens'],
    ['Todo comienza con una chispa.','Everything begins with a spark.'],
    ['El taller duerme en silencio… hasta que una línea de luz toca el papel y despierta la imaginación.','The workshop sleeps in silence… until a line of light touches the paper and awakens imagination.'],
    ['El primer trazo','The first stroke'],
    ['La idea encuentra su forma.','The idea finds its shape.'],
    ['Papel, color y magia empiezan a construir algo que todavía no existía.','Paper, color and magic begin to create something that did not exist before.'],
    ['El taller cobra vida','The workshop comes alive'],
    ['Miles de ideas empiezan a moverse.','Thousands of ideas begin to move.'],
    ['Bocetos, cintas, estrellas y personajes aparecen por todas partes.','Sketches, ribbons, stars and characters appear everywhere.'],
    ['La transformación','The transformation'],
    ['Del dibujo… al squishy.','From drawing… to squishy.'],
    ['La idea deja de ser plana. Se infla, sonríe y cobra vida frente a tus ojos.','The idea is no longer flat. It puffs up, smiles and comes to life before your eyes.'],
    ['La gran revelación','The big reveal'],
    ['Bienvenido a la Fábrica de Squishies.','Welcome to the Squishy Factory.'],
    ['Una fábrica hecha de imaginación, papel, color y personajes que esperan ser creados.','A factory made of imagination, paper, color and characters waiting to be created.'],
    ['Explosión creativa','Creative explosion'],
    ['Un universo infinito de diseños.','An endless universe of designs.'],
    ['Comida, animales, fantasía y nuevas colecciones: cada idea puede convertirse en un nuevo squishy.','Food, animals, fantasy and new collections: every idea can become a new squishy.'],
    ['El origen','The origin'],
    ['Todo vuelve al papel.','Everything comes back to paper.'],
    ['Porque antes de cada personaje hubo una idea, una hoja en blanco y ganas de crear.','Because before every character there was an idea, a blank sheet and the desire to create.'],
    ['La fábrica ya está lista. Ahora te toca crear.','The factory is ready. Now it is your turn to create.'],

    ['Abriendo la fábrica completa · 50 personajes · 5 colecciones · Creator Plus','Opening the full factory · 50 characters · 5 collections · Creator Plus'],
    ['Cargando versión estable…','Loading stable version…'],
    ['No pude abrir la versión restaurada.','I could not open the restored version.'],
    ['VERIFICAR CORE RESTAURADO','CHECK RESTORED CORE'],
    ['VOLVER A MIS JUEGOS','BACK TO MY GAMES'],

    ['Ir al inicio','Go to home'],
    ['Inicio','Home'],
    ['Colecciones','Collections'],
    ['Personajes','Characters'],
    ['Mis descargas','My downloads'],
    ['+ Crear','+ Create'],
    ['Elegí uno.','Pick one.'],
    ['Hacelo tuyo.','Make it yours.'],
    ['Y armalo.','And build it.'],
    ['Una biblioteca de personajes listos para imprimir o transformar en tu propia versión.','A library of characters ready to print or transform into your own version.'],
    ['Explorar personajes →','Explore characters →'],
    ['Explorar personajes','Explore characters'],
    ['Crear desde cero →','Create from scratch →'],
    ['Crear desde cero','Create from scratch'],
    ['Crear en Creator Plus','Create in Creator Plus'],
    ['personajes','characters'],
    ['colecciones','collections'],
    ['láminas','sheets'],
    ['formas de crear','ways to create'],
    ['PERSONAJES','CHARACTERS'],
    ['COLECCIONES','COLLECTIONS'],
    ['LÁMINAS','SHEETS'],
    ['ASÍ DE SIMPLE','THAT SIMPLE'],
    ['Del personaje al squishy en 3 pasos','From character to squishy in 3 steps'],
    ['Elegí','Choose'],
    ['Entrá a una colección y encontrá tu personaje.','Open a collection and find your character.'],
    ['Personalizá','Customize'],
    ['Usalo tal cual o abrilo en el editor para hacer un remix.','Use it as-is or open it in the editor to make your own remix.'],
    ['Imprimí y armá','Print and build'],
    ['Prepará frente y dorso, recortá, rellená y cerrá.','Prepare front and back, cut, fill and close.'],
    ['Cinco mundos para crear','Five worlds to create'],
    ['Tres mundos para crear','Three worlds to create'],
    ['Ver todos →','View all →'],
    ['PERSONAJES DESTACADOS','FEATURED CHARACTERS'],
    ['Elegí uno y empezá','Pick one and start'],
    ['🎲 Sorprendeme','🎲 Surprise me'],
    ['¿TENÉS UNA IDEA PROPIA?','HAVE YOUR OWN IDEA?'],
    ['Empezá con una hoja en blanco.','Start with a blank canvas.'],
    ['Dibujá, agregá texto y stickers y después preparalo para imprimir.','Draw, add text and stickers, then get it ready to print.'],

    ['BIBLIOTECA','LIBRARY'],
    ['Elegí una colección','Choose a collection'],
    ['Entrá por el estilo que más te guste. Todos los personajes tienen remix, impresión, tutorial y versión para colorear.','Pick the style you like most. Every character includes remix, printing, tutorial and a coloring version.'],
    ['COLECCIÓN · ','COLLECTION · '],
    ['COLECCIÓN','COLLECTION'],
    ['Colección','Collection'],
    ['Todos los personajes están normalizados para que se vean con el mismo tamaño y encuadre.','All characters are normalized to keep the same size and framing.'],
    ['10 personajes','10 characters'],
    ['Elegí uno para ver sus opciones','Choose one to see its options'],
    ['Ver opciones →','View options →'],
    ['PERSONAJE','CHARACTER'],
    ['Personaje','Character'],
    ['Elegí qué querés hacer.','Choose what you want to do.'],
    ['Imprimí, remixá o explorá todos los materiales del personaje.','Print, remix or explore all the character assets.'],
    ['ELEGÍ UNA ACCIÓN','CHOOSE AN ACTION'],
    ['¿Qué querés hacer?','What do you want to do?'],
    ['Ver galería · 8 vistas','View gallery · 8 views'],
    ['Hero, frente, dorso, coloring, editor, ficha, tutorial y mockup','Hero, front, back, coloring, editor, character card, tutorial and mockup'],
    ['Hacer mi versión','Make my version'],
    ['Abrir en el editor y personalizarlo','Open in the editor and customize it'],
    ['Imprimir y armar','Print and build'],
    ['Preparar frente + dorso a escala','Prepare front + back at matching scale'],
    ['Ver cómo se arma','See how to build it'],
    ['Tutorial paso a paso de este personaje','Step-by-step tutorial for this character'],
    ['Colorearlo','Color it'],
    ['Abrir la versión blanco y negro','Open the black & white version'],
    ['Ver su ficha','View character card'],
    ['Conocer al personaje y su personalidad','Meet the character and its personality'],
    ['Verlo terminado','See it finished'],
    ['Ejemplo real del paper squishy armado','Real example of the finished paper squishy'],
    ['GALERÍA 8 VISTAS','8-VIEW GALLERY'],
    ['Explorá todos los materiales del personaje.','Explore all character assets.'],
    ['Vista anterior','Previous view'],
    ['Vista siguiente','Next view'],
    ['Deslizá a izquierda o derecha para cambiar de vista','Swipe left or right to change view'],
    ['🖨️ Imprimir esta hoja','🖨️ Print this sheet'],
    ['🎨 Usar en Creator Plus','🎨 Use in Creator Plus'],
    ['← Volver al personaje','← Back to character'],
    ['Vista principal','Main view'],
    ['La ilustración principal del personaje.','The main character illustration.'],
    ['FRENTE','FRONT'],
    ['Frente imprimible','Printable front'],
    ['Vista frontal preparada para impresión.','Front view prepared for printing.'],
    ['DORSO','BACK'],
    ['Dorso imprimible','Printable back'],
    ['Vista trasera preparada a la misma escala que el frente.','Back view prepared at the same scale as the front.'],
    ['PARA COLOREAR','COLORING'],
    ['Versión blanco y negro','Black & white version'],
    ['Imprimila y pintala antes de armar.','Print and color it before building.'],
    ['Asset para Creator Plus','Creator Plus asset'],
    ['Base editable para hacer tu propia versión.','Editable base for your own version.'],
    ['FICHA DEL PERSONAJE','CHARACTER CARD'],
    ['Conocé a ','Meet '],
    ['Su ficha, personalidad y pequeños detalles.','Its character card, personality and little details.'],
    ['TUTORIAL','TUTORIAL'],
    ['Cómo se arma','How to build it'],
    ['Seguí esta guía paso por paso.','Follow this guide step by step.'],
    ['EJEMPLO TERMINADO','FINISHED EXAMPLE'],
    ['Así queda ','Finished '],
    ['Referencia visual del paper squishy ya armado.','Visual reference of the completed paper squishy.'],
    ['VISTA','VIEW'],

    ['CREAR DESDE CERO','CREATE FROM SCRATCH'],
    ['Mi Squishy','My Squishy'],
    ['⛶ Lienzo grande','⛶ Large canvas'],
    ['Listo →','Done →'],
    ['Elegí una base vacía o empezá a dibujar encima.','Choose a blank base or start drawing on top.'],
    ['16 bases · 5 pinceles · 60 stickers · panel ampliado · controles grandes · tamaño siempre visible.','16 bases · 5 brushes · 60 stickers · expanded panel · large controls · size always visible.'],
    ['Cuando termines, tocá “Listo”.','When you finish, tap “Done”.'],
    ['LIENZO CREATIVO','CREATIVE CANVAS'],
    ['zona útil amplia · dibujá con mouse o dedo','large working area · draw with mouse or finger'],
    ['Elegí una base y empezá a crear','Choose a base and start creating'],
    ['Dibujar','Draw'],
    ['Elementos','Elements'],
    ['Texto','Text'],
    ['Control global de tamaño','Global size control'],
    ['Tamaño','Size'],
    ['Reducir tamaño','Decrease size'],
    ['Tamaño del elemento seleccionado','Selected element size'],
    ['Aumentar tamaño','Increase size'],
    ['Restablecer tamaño','Reset size'],
    ['CAPAS Y ACCIONES · elemento seleccionado','LAYERS & ACTIONS · selected element'],
    ['⧉ Duplicar','⧉ Duplicate'],
    ['↓ Atrás','↓ Back'],
    ['↑ Frente','↑ Front'],
    ['✕ Eliminar','✕ Delete'],
    ['↶ Deshacer','↶ Undo'],
    ['Limpiar lienzo','Clear canvas'],
    ['TU DISEÑO','YOUR DESIGN'],
    ['Listo. ¿Qué querés hacer ahora?','Done. What do you want to do now?'],
    ['Podés guardar la imagen, conservar el proyecto editable o preparar la impresión.','You can save the image, keep the editable project or prepare it for printing.'],
    ['Vista previa','Preview'],
    ['Descargar PNG','Download PNG'],
    ['Imagen final en alta resolución','Final image in high resolution'],
    ['Guardar proyecto editable','Save editable project'],
    ['Archivo JSON para conservar el remix','JSON file to keep your remix'],
    ['Preparar para imprimir','Prepare for printing'],
    ['Usar mi remix como frente del Squishy','Use my remix as the Squishy front'],
    ['Elegir otro personaje','Choose another character'],
    ['PREPARAR IMPRESIÓN','PREPARE FOR PRINTING'],
    ['Tu Squishy','Your Squishy'],
    ['Elegí el tamaño. La vista de abajo es la que se imprime.','Choose the size. The view below is what will be printed.'],
    ['Tamaño:','Size:'],
    ['🖨️ Imprimir','🖨️ Print'],
    ['XL · 17 cm: frente y dorso se imprimen en 2 hojas A4, una por hoja.','XL · 17 cm: front and back print on 2 A4 sheets, one per sheet.'],
    ['Mini y Normal: frente y dorso comparten una hoja A4.','Mini and Normal: front and back share one A4 sheet.'],
    ['Imprimir en A4 al 100% · sin ajustar a página. Recortá, uní los bordes dejando una abertura, rellená y cerrá.','Print on A4 at 100% · do not fit to page. Cut, join the edges leaving an opening, fill and close.'],
    ['CREATOR PLUS · 12 MESES · HASTA 2 DISPOSITIVOS','CREATOR PLUS · 12 MONTHS · UP TO 2 DEVICES'],

    ['Círculo','Circle'],['Cuadrado suave','Soft square'],['Corazón','Heart'],['Estrella','Star'],['Nube','Cloud'],['Óvalo','Oval'],['Cápsula','Capsule'],['Dona','Donut'],['Huevito','Egg'],['Gota','Drop'],['Flor','Flower'],['Gatito','Kitten'],['Osito','Teddy bear'],['Conejito','Bunny'],['Globo','Speech bubble'],['Blob','Blob'],
    ['Ojos kawaii','Kawaii eyes'],['Ojos felices','Happy eyes'],['Guiño','Wink'],['Ojos brillo','Sparkle eyes'],['Ojos cerrados','Closed eyes'],['Ojos corazón','Heart eyes'],['Ojos estrella','Star eyes'],['Ojos sorpresa','Surprised eyes'],
    ['Sonrisa','Smile'],['Boca feliz','Happy mouth'],['Boquita O','O mouth'],['Lengüita','Tongue'],['Dientito','Little tooth'],['Mejillas','Cheeks'],['Pecas','Freckles'],['Cejas felices','Happy brows'],['Lagrimita','Little tear'],['Brillitos','Sparkles'],
    ['Moño','Bow'],['Corona','Crown'],['Lentes corazón','Heart glasses'],['Lentes','Glasses'],['Sombrerito','Mini hat'],['Gorrita','Cap'],['Orejas','Ears'],['Alitas','Wings'],['Curita','Bandage'],
    ['Ojos','Eyes'],['Bocas','Mouths'],['Expresiones','Expressions'],['Accesorios','Accessories'],
    ['CARITAS','FACES'],['NATURALEZA','NATURE'],['COMIDA','FOOD'],['DIVERSIÓN','FUN'],
    ['Suave','Soft'],['Lápiz','Pencil'],['Marcador','Marker'],['Crayón','Crayon'],['Puntos','Dots'],
    ['BASES VACÍAS · 16 FORMAS','BLANK BASES · 16 SHAPES'],
    ['FORMAS','SHAPES'],['COLORES','COLORS'],['DIBUJO','DRAWING'],['COLOR DE BASE','BASE COLOR'],['ELEMENTOS KAWAII','KAWAII ELEMENTS'],['TEXTO','TEXT'],
    ['Agregar texto','Add text'],['ESCRIBÍ ALGO','TYPE SOMETHING'],['Ej: MI SQUISHY','Ex: MY SQUISHY'],['GROSOR','THICKNESS'],['Fino','Thin'],['Medio','Medium'],['Grueso','Thick'],['Borrar solo los trazos','Erase strokes only'],
    ['DIBUJO LIBRE · 5 PINCELES','FREE DRAWING · 5 BRUSHES'],['✏️ Dibujá sobre la base. Cada trazo recuerda su pincel.','✏️ Draw on the base. Each stroke remembers its brush.'],
    ['Armá caras, expresiones y accesorios','Build faces, expressions and accessories'],['Agregá un nombre o mensaje','Add a name or message'],['Elegí textura, color y grosor','Choose texture, color and thickness'],
    ['Lienzo limpio','Clean canvas'],['Estás editando un personaje de la biblioteca.','You are editing a character from the library.'],['Dibujá con el mouse o el dedo','Draw with mouse or finger'],['Elegí un elemento o sticker y ajustá su tamaño en la barra fija superior','Choose an element or sticker and adjust its size in the fixed top bar'],['Personalizá tu personaje','Customize your character'],
    ['Texto agregado','Text added'],['Tamaño restablecido','Size reset'],['Elemento duplicado','Element duplicated'],['Diseño original','Original design'],

    ['Dulces, pasteles y personajes tiernos para coleccionar y remixar.','Sweet treats, pastries and adorable characters to collect and remix.'],
    ['Comidas divertidas convertidas en personajes llenos de personalidad.','Fun foods turned into characters full of personality.'],
    ['Animalitos kawaii listos para imprimir, colorear, armar y remixar.','Kawaii animals ready to print, color, build and remix.'],
    ['Entrar a la colección →','Open collection →'],
    ['Entrar a la colección','Open collection'],
    ['fácil','easy'],['Fácil','Easy'],['medio','medium'],['Medio','Medium'],['difícil','advanced'],['Difícil','Advanced'],

    ['PAPER SQUISHY FACTORY · Mis Descargas','PAPER SQUISHY FACTORY · My Downloads'],
    ['← VOLVER A LA FACTORY','← BACK TO FACTORY'],
    ['MIS DESCARGAS · PSQ 2.5','MY DOWNLOADS · PSQ 2.5'],
    ['Todo tu Paper Squishy Factory,','Your entire Paper Squishy Factory,'],
    ['siempre en un solo lugar.','always available in one place.'],
    ['Tu guía, el pack completo de personajes y Creator Plus quedan organizados acá para que puedas volver cuando quieras mientras tu licencia PSQ-FACTORY esté activa.','Your guide, the complete character pack and Creator Plus are organized here so you can come back anytime while your PSQ-FACTORY license is active.'],
    ['Comprobando tu acceso…','Checking your access…'],
    ['Estamos validando tu sesión y la licencia PSQ-FACTORY.','We are validating your session and PSQ-FACTORY license.'],
    ['VALIDANDO','CHECKING'],
    ['ACTIVAR MI COMPRA','ACTIVATE MY PURCHASE'],
    ['TU BIBLIOTECA DE ARCHIVOS','YOUR FILE LIBRARY'],
    ['Listo para descargar','Ready to download'],
    ['Las descargas se habilitan solamente con una sesión válida y una licencia PSQ-FACTORY activa.','Downloads are enabled only with a valid session and an active PSQ-FACTORY license.'],
    ['GUÍA DE BIENVENIDA','WELCOME GUIDE'],
    ['Empezá por acá','Start here'],
    ['Todo lo que necesitás para empezar, imprimir y armar tus paper squishies.','Everything you need to start, print and build your paper squishies.'],
    ['PASO A PASO','STEP BY STEP'],
    ['DISPONIBLE','AVAILABLE'],
    ['DESCARGAR GUÍA','DOWNLOAD GUIDE'],
    ['PACK COMPLETO · 50 PERSONAJES','COMPLETE PACK · 50 CHARACTERS'],
    ['PACK PRINCIPAL','MAIN PACK'],
    ['La colección completa','The complete collection'],
    ['5 colecciones · 50 personajes · 150 láminas. Frente + dorso + coloring.','5 collections · 50 characters · 150 sheets. Front + back + coloring.'],
    ['50 PERSONAJES','50 CHARACTERS'],['5 COLECCIONES','5 COLLECTIONS'],['150 LÁMINAS','150 SHEETS'],
    ['DESCARGAR LOS 50 PERSONAJES','DOWNLOAD ALL 50 CHARACTERS'],
    ['Tu imaginación sigue','Your imagination continues'],
    ['Guía de acceso, activación y uso de Creator Plus.','Access, activation and Creator Plus usage guide.'],
    ['12 MESES','12 MONTHS'],['HASTA 2 DISPOSITIVOS','UP TO 2 DEVICES'],
    ['DESCARGAR GUÍA CREATOR PLUS','DOWNLOAD CREATOR PLUS GUIDE'],
    ['ABRIR CREATOR PLUS','OPEN CREATOR PLUS'],
    ['Acceso incluido con tu licencia PSQ-FACTORY','Access included with your PSQ-FACTORY license'],
    ['Producto 100% digital. No se envía ningún artículo físico.','100% digital product. No physical item will be shipped.'],
    ['12 meses desde activación','12 months from activation'],
    ['Hasta 2 dispositivos','Up to 2 devices'],
    ['ACCESO ACTIVO','ACCESS ACTIVE'],
    ['Tu licencia PSQ-FACTORY está activa. Los tres recursos están habilitados.','Your PSQ-FACTORY license is active. All three resources are enabled.'],
    ['ACCESO NO ACTIVADO','ACCESS NOT ACTIVATED'],
    ['Iniciá sesión en el Portal PasaloChévere y activá tu compra para acceder a tus descargas.','Sign in to the PasaloChévere Portal and activate your purchase to access your downloads.'],
    ['SIN SESIÓN','NO SESSION'],
    ['ACCESO VENCIDO','ACCESS EXPIRED'],
    ['Tu licencia PSQ-FACTORY venció. Volvé al Portal para revisar tu acceso.','Your PSQ-FACTORY license has expired. Return to the Portal to review your access.'],
    ['NO DISPONIBLE','UNAVAILABLE'],
    ['PREPARANDO…','PREPARING…'],
    ['Descarga iniciada.','Download started.'],
    ['No pude validar la licencia.','I could not validate the license.'],
    ['No pude descargar el archivo: ','I could not download the file: '],

    ['Abrir en el editor','Open in editor'],
    ['Imprimir','Print'],
    ['Descargar','Download'],
    ['Guardar','Save'],
    ['Volver','Back'],
    ['Cancelar','Cancel'],
    ['Cerrar','Close']
  ];

  const FORWARD=[...PAIRS].sort((a,b)=>b[0].length-a[0].length);
  const REVERSE=PAIRS.map(([es,en])=>[en,es]).sort((a,b)=>b[0].length-a[0].length);

  function normalizeLang(v){
    v=String(v||'').toLowerCase().trim();
    return v.startsWith('en')?'en':v.startsWith('es')?'es':'';
  }
  function initialLang(){
    try{const q=normalizeLang(new URL(location.href).searchParams.get(PARAM));if(q)return q}catch{}
    try{const saved=normalizeLang(localStorage.getItem(STORAGE_KEY));if(saved)return saved}catch{}
    return normalizeLang(navigator.language||navigator.userLanguage||'')||'es';
  }

  let lang=initialLang();

  function translateString(value,target=lang){
    if(value==null)return value;
    let out=String(value);
    const list=target==='en'?FORWARD:REVERSE;
    for(const [from,to] of list){if(from&&out.includes(from))out=out.split(from).join(to)}
    return out;
  }

  function shouldSkipNode(node){
    const p=node.parentElement;
    if(!p)return false;
    return !!p.closest('script,style,noscript,template,code,pre,[data-psq-no-i18n]');
  }

  function translateTextNodes(root=document.body){
    if(!root)return;
    if(root.nodeType===Node.TEXT_NODE){if(!shouldSkipNode(root))root.nodeValue=translateString(root.nodeValue);return}
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(n){return shouldSkipNode(n)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(n=>{const next=translateString(n.nodeValue);if(next!==n.nodeValue)n.nodeValue=next});
  }

  function translateAttributes(root=document){
    const els=(root.querySelectorAll?root.querySelectorAll('[placeholder],[title],[aria-label],[data-tooltip],input[type="button"],input[type="submit"]'):[]);
    els.forEach(el=>{
      ['placeholder','title','aria-label','data-tooltip'].forEach(a=>{if(el.hasAttribute(a)){const v=el.getAttribute(a),n=translateString(v);if(n!==v)el.setAttribute(a,n)}});
      if(el.matches('input[type="button"],input[type="submit"]')&&el.value)el.value=translateString(el.value);
    });
  }

  function rewriteLinks(){
    document.querySelectorAll('a[href]').forEach(a=>{
      const raw=a.getAttribute('href');
      if(!raw||raw.startsWith('#')||raw.startsWith('javascript:')||raw.startsWith('mailto:')||raw.startsWith('tel:')||raw.startsWith('blob:'))return;
      try{
        const u=new URL(raw,location.href);
        if(u.origin!==location.origin)return;
        if(!(/\/paper-squishy\//.test(u.pathname)||/\/portal-v2\//.test(u.pathname)))return;
        u.searchParams.set(PARAM,lang);
        a.href=u.href;
      }catch{}
    });
  }

  function selectorMarkup(){return `<span class="psq-lang-label" aria-hidden="true">LANG</span><button type="button" data-psq-lang="es" aria-label="Español">ES</button><i aria-hidden="true">|</i><button type="button" data-psq-lang="en" aria-label="English">EN</button>`}

  function ensureSwitcher(){
    let sw=document.getElementById('psqLangSwitch');
    if(sw)return sw;
    sw=document.createElement('div');sw.id='psqLangSwitch';sw.className='psq-lang-switch';sw.setAttribute('role','group');sw.setAttribute('aria-label','Language / Idioma');sw.dataset.psqNoI18n='1';sw.innerHTML=selectorMarkup();
    const topbar=document.querySelector('.topbar .top-actions');
    const top=document.querySelector('.top');
    if(topbar){sw.classList.add('psq-lang-inline','psq-lang-factory');topbar.appendChild(sw)}
    else if(top){sw.classList.add('psq-lang-inline','psq-lang-downloads');const back=top.querySelector('.back');back?top.insertBefore(sw,back):top.appendChild(sw)}
    else{sw.classList.add('psq-lang-float');if(document.querySelector('.skip'))sw.classList.add('psq-lang-cinema');document.body?.appendChild(sw)}
    sw.querySelectorAll('[data-psq-lang]').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.psqLang,true)));
    return sw;
  }

  function updateSwitcher(){
    const sw=ensureSwitcher();
    sw?.querySelectorAll('[data-psq-lang]').forEach(b=>{const on=b.dataset.psqLang===lang;b.classList.toggle('active',on);b.setAttribute('aria-pressed',on?'true':'false')});
  }

  function updateUrl(){try{const u=new URL(location.href);u.searchParams.set(PARAM,lang);history.replaceState(history.state,'',u.pathname+u.search+u.hash)}catch{}}

  function applyAll(){
    if(applying)return;
    applying=true;
    try{
      document.documentElement.lang=lang;
      document.documentElement.dataset.psqLang=lang;
      if(document.title)document.title=translateString(document.title);
      ensureSwitcher();
      translateTextNodes(document.body);
      translateAttributes(document);
      rewriteLinks();
      updateSwitcher();
    }finally{applying=false}
  }

  function scheduleApply(){clearTimeout(timer);timer=setTimeout(applyAll,18)}

  function setLang(next,updateHistory=true){
    next=normalizeLang(next)||'es';lang=next;
    try{localStorage.setItem(STORAGE_KEY,lang)}catch{}
    if(updateHistory)updateUrl();
    applyAll();
    try{window.dispatchEvent(new CustomEvent('psq:languagechange',{detail:{lang,version:API_VERSION}}))}catch{}
  }

  function attachObserver(){
    try{observer?.disconnect()}catch{}
    if(!document.documentElement)return;
    observer=new MutationObserver(()=>{if(!applying)scheduleApply()});
    observer.observe(document.documentElement,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['placeholder','title','aria-label']});
  }

  function init(){if(!document.body){document.addEventListener('DOMContentLoaded',init,{once:true});return}setLang(lang,false);attachObserver()}

  const nativeAlert=window.alert?.bind(window),nativeConfirm=window.confirm?.bind(window),nativePrompt=window.prompt?.bind(window);
  if(nativeAlert)window.alert=(m)=>nativeAlert(translateString(m));
  if(nativeConfirm)window.confirm=(m)=>nativeConfirm(translateString(m));
  if(nativePrompt)window.prompt=(m,d)=>nativePrompt(translateString(m),d);

  window.PSQ_I18N={version:API_VERSION,get lang(){return lang},setLang,translate:translateString,reapply:applyAll,reinit(){attachObserver();applyAll()}};
  init();
})();
