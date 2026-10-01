// EXP01-EN1 · Shared presentation-only language layer for Caso 001
// IMPORTANT: language never enters game state, room state, save/load, licenses or multiplayer.

export const LANGUAGE_STORAGE_KEY='expedientes_language';
export const SUPPORTED_LANGUAGES=Object.freeze(['es','en']);

const DICTIONARY=Object.freeze({
  es:Object.freeze({
    'lang.es':'ES','lang.en':'EN','lang.aria':'Idioma / Language',
    'common.home':'Inicio','common.case':'Caso','common.characters':'Personajes','common.locations':'Lugares','common.objects':'Objetos','common.evidence':'Evidencias','common.notes':'Notas',
    'common.continueInvestigation':'Continuar investigación','common.viewEvidence':'Ver evidencias','common.analyzeClues':'Analizar pistas','common.settings':'Configuración','common.back':'Volver','common.continue':'Continuar','common.cancel':'Cancelar','common.save':'Guardar','common.close':'Cerrar','common.next':'Siguiente','common.previous':'Anterior',
    'header.replay':'VER PRÓLOGO','header.printKit':'KIT IMPRIMIBLE',
    'prologue.soundOff':'🔇 ACTIVAR AMBIENTE','prologue.soundOn':'🔊 AMBIENTE ACTIVO','prologue.skip':'SALTAR INTRO','prologue.previous':'← ANTERIOR','prologue.continue':'CONTINUAR →','prologue.open':'ABRIR EXPEDIENTE →',
    'setup.createRoom':'Crear sala','setup.join':'Unirme','setup.name':'Tu nombre','setup.license':'Licencia','setup.mode':'Modo','setup.roomCode':'Código de sala','setup.character':'Tu personaje','setup.namePlaceholder':'Investigador','setup.licensePlaceholder':'Código de acceso','setup.roomPlaceholder':'ABC123','setup.characterHint':'ELEGÍ UNA IDENTIDAD PARA INGRESAR AL EXPEDIENTE.','setup.rejoin':'Reingresar a mi última sala',
    'setup.initializing':'INICIALIZANDO…','setup.createCta':'Crear sala','setup.joinCta':'Unirme a la sala','setup.engineStarting':'INICIALIZANDO MOTOR…','setup.engineReady':'MOTOR P2 LISTO','setup.engineUnavailable':'MOTOR NO DISPONIBLE','setup.checkingAccess':'Comprobando acceso…','setup.accessLoaded':'ACCESO CARGADO','setup.readyCreate':'listo para crear sala','setup.sessionIdentified':'SESIÓN IDENTIFICADA','setup.serverFindAccess':'el servidor buscará tu acceso activo','setup.missingAccess':'Falta cargar un acceso para crear una sala','setup.openPortal':'ABRIR MI PORTAL','setup.portalHelp':'También podés ingresar tu código de acceso en el campo Licencia.',
    'mode.dig.label':'Investigación normal','mode.dig.short':'NORMAL','mode.dig.description':'Todos investigan. El responsable puede ser humano o NPC. Duración base: 35 min.','mode.imp.label':'Modo Impostor','mode.imp.short':'IMPOSTOR','mode.imp.description':'Uno de los jugadores humanos recibe en secreto el rol de impostor y debe proteger su mentira central. Duración base: 30 min.',
    'room.code':'CÓDIGO DE SALA','room.waiting':'ESPERANDO','room.active':'EN CURSO','room.finished':'FINALIZADO','room.humans':'HUMANOS','room.investigators':'INVESTIGADORES HUMANOS','room.investigator':'INVESTIGADOR HUMANO','room.npc':'NPC','room.teamReady':'✓ EQUIPO LISTO','room.missingHuman':'FALTA 1 HUMANO','room.missingHumans':'FALTAN {count} HUMANOS','room.openCase':'ABRIR EXPEDIENTE','room.whatsapp':'WHATSAPP','room.copyLink':'COPIAR ENLACE','room.copyCode':'COPIAR CÓDIGO','room.host':'ANFITRIÓN · HOST','room.connected':'JUGADOR CONECTADO','room.noPlayer':'PERSONAJE SIN JUGADOR','room.autoNpc':'NPC AUTOMÁTICO',
    'game.phase':'FASE','game.stage':'ETAPA {stage}','game.publicFile':'Expediente público','game.privateDossier':'Dossier privado','game.hidePrivate':'OCULTAR INFORMACIÓN','game.showPrivate':'MOSTRAR INFORMACIÓN','game.privateHidden':'Información privada oculta','game.privateHiddenHelp':'Volvé a mostrarla cuando nadie más esté mirando la pantalla.',
    'board.title':'Tablero de investigación','board.people':'PERSONAS','board.locations':'ESCENARIOS','board.objects':'OBJETOS','board.who':'¿QUIÉN?','board.where':'¿DÓNDE?','board.withWhat':'¿CON QUÉ ELEMENTO?','board.clearMarks':'LIMPIAR MARCAS','board.clearHistory':'LIMPIAR HISTORIAL','board.open':'ARCHIVO ABIERTO','board.focus':'EN FOCO','board.discarded':'DESCARTADO','board.motivePlaceholder':'Escribí tu hipótesis de motivo, contradicciones o conexión entre evidencias…',
    'director.title':'Director del caso','director.ask':'PEDIR ORIENTACIÓN AL DIRECTOR','director.channel':'CANAL →','director.hostControls':'CONTROLES DEL ANFITRIÓN','director.advance':'ADELANTAR ETAPA','director.pause':'PAUSAR','director.resume':'REANUDAR','director.addTime':'+2 MIN','director.available':'El canal del Director estará disponible durante la partida.',
    'log.title':'Bitácora del expediente','log.shared':'REGISTRO COMPARTIDO','log.open':'EN CURSO',
    'evidence.none':'Todavía no se liberaron evidencias.','evidence.stage':'ETAPA {stage}','evidence.records':'{count} REGISTROS','evidence.record':'1 REGISTRO','evidence.private':'EVIDENCIA SOLO PARA VOS','evidence.noPrivate':'No tenés evidencia privada liberada en esta etapa.',
    'acc.title':'Acusación final','acc.lock':'SELLAR ACUSACIÓN','acc.reveal':'REVELAR RECONSTRUCCIÓN','acc.person':'PERSONA','acc.scene':'ESCENA','acc.object':'OBJETO','acc.motive':'MOTIVO','acc.who':'¿QUIÉN?','acc.where':'¿DÓNDE?','acc.what':'¿QUÉ ELEMENTO?','acc.waiting':'ACUSACIÓN EN PREPARACIÓN',
    'status.paused':'PAUSADO','status.running':'EN CURSO','status.finished':'FINALIZADO',
    'intro.soundOff':'🔇 SONIDO','intro.soundOn':'🔊 SONIDO','intro.fullscreen':'⛶ PANTALLA COMPLETA','intro.exitFullscreen':'⤢ SALIR PANTALLA COMPLETA','intro.restart':'↻ REINICIAR','intro.skip':'SALTAR','intro.openCase':'ABRIR EXPEDIENTE →','intro.buildTheory':'Construí la teoría','intro.person':'Persona','intro.scene':'Escena','intro.object':'Objeto','intro.motive':'Motivo','intro.stage1':'E1 · APERTURA','intro.stage2':'E2 · FRACTURA','intro.stage3':'E3 · PIVOTE','intro.sharedResearch':'Jugadores + NPC · roles privados · investigación compartida',
    'error.engineStarting':'El motor todavía se está inicializando. Esperá un instante y volvé a intentar.','error.createNeedsAccess':'Para crear una sala, abrí el juego desde Mi Portal o ingresá tu código de acceso. Unirse a una sala no requiere licencia.','error.roomCode':'Ingresá el código de sala.'
  }),
  en:Object.freeze({
    'lang.es':'ES','lang.en':'EN','lang.aria':'Language / Idioma',
    'common.home':'Home','common.case':'Case','common.characters':'Characters','common.locations':'Locations','common.objects':'Objects','common.evidence':'Evidence','common.notes':'Notes',
    'common.continueInvestigation':'Continue investigation','common.viewEvidence':'View evidence','common.analyzeClues':'Analyze clues','common.settings':'Settings','common.back':'Back','common.continue':'Continue','common.cancel':'Cancel','common.save':'Save','common.close':'Close','common.next':'Next','common.previous':'Previous',
    'header.replay':'VIEW PROLOGUE','header.printKit':'PRINTABLE KIT',
    'prologue.soundOff':'🔇 ENABLE AMBIENCE','prologue.soundOn':'🔊 AMBIENCE ON','prologue.skip':'SKIP INTRO','prologue.previous':'← PREVIOUS','prologue.continue':'CONTINUE →','prologue.open':'OPEN CASE FILE →',
    'setup.createRoom':'Create room','setup.join':'Join','setup.name':'Your name','setup.license':'License','setup.mode':'Mode','setup.roomCode':'Room code','setup.character':'Your character','setup.namePlaceholder':'Investigator','setup.licensePlaceholder':'Access code','setup.roomPlaceholder':'ABC123','setup.characterHint':'CHOOSE AN IDENTITY TO ENTER THE CASE FILE.','setup.rejoin':'Rejoin my last room',
    'setup.initializing':'INITIALIZING…','setup.createCta':'Create room','setup.joinCta':'Join room','setup.engineStarting':'INITIALIZING ENGINE…','setup.engineReady':'P2 ENGINE READY','setup.engineUnavailable':'ENGINE UNAVAILABLE','setup.checkingAccess':'Checking access…','setup.accessLoaded':'ACCESS LOADED','setup.readyCreate':'ready to create room','setup.sessionIdentified':'SESSION IDENTIFIED','setup.serverFindAccess':'the server will look for your active access','setup.missingAccess':'Load an access code to create a room','setup.openPortal':'OPEN MY PORTAL','setup.portalHelp':'You can also enter your access code in the License field.',
    'mode.dig.label':'Normal investigation','mode.dig.short':'NORMAL','mode.dig.description':'Everyone investigates. The responsible person may be human or NPC. Base duration: 35 min.','mode.imp.label':'Impostor Mode','mode.imp.short':'IMPOSTOR','mode.imp.description':'One human player secretly receives the impostor role and must protect their central lie. Base duration: 30 min.',
    'room.code':'ROOM CODE','room.waiting':'WAITING','room.active':'IN PROGRESS','room.finished':'FINISHED','room.humans':'HUMANS','room.investigators':'HUMAN INVESTIGATORS','room.investigator':'HUMAN INVESTIGATOR','room.npc':'NPC','room.teamReady':'✓ TEAM READY','room.missingHuman':'1 HUMAN NEEDED','room.missingHumans':'{count} HUMANS NEEDED','room.openCase':'OPEN CASE FILE','room.whatsapp':'WHATSAPP','room.copyLink':'COPY LINK','room.copyCode':'COPY CODE','room.host':'HOST','room.connected':'PLAYER CONNECTED','room.noPlayer':'CHARACTER WITHOUT PLAYER','room.autoNpc':'AUTOMATIC NPC',
    'game.phase':'PHASE','game.stage':'STAGE {stage}','game.publicFile':'Public case file','game.privateDossier':'Private dossier','game.hidePrivate':'HIDE INFORMATION','game.showPrivate':'SHOW INFORMATION','game.privateHidden':'Private information hidden','game.privateHiddenHelp':'Show it again when nobody else is looking at the screen.',
    'board.title':'Investigation board','board.people':'PEOPLE','board.locations':'LOCATIONS','board.objects':'OBJECTS','board.who':'WHO?','board.where':'WHERE?','board.withWhat':'WITH WHAT?','board.clearMarks':'CLEAR MARKS','board.clearHistory':'CLEAR HISTORY','board.open':'OPEN FILE','board.focus':'IN FOCUS','board.discarded':'DISCARDED','board.motivePlaceholder':'Write your motive hypothesis, contradictions or connections between evidence…',
    'director.title':'Case Director','director.ask':'ASK THE DIRECTOR FOR GUIDANCE','director.channel':'CHANNEL →','director.hostControls':'HOST CONTROLS','director.advance':'ADVANCE STAGE','director.pause':'PAUSE','director.resume':'RESUME','director.addTime':'+2 MIN','director.available':'The Director channel will be available during the game.',
    'log.title':'Case log','log.shared':'SHARED LOG','log.open':'IN PROGRESS',
    'evidence.none':'No evidence has been released yet.','evidence.stage':'STAGE {stage}','evidence.records':'{count} RECORDS','evidence.record':'1 RECORD','evidence.private':'EVIDENCE FOR YOUR EYES ONLY','evidence.noPrivate':'No private evidence has been released for you at this stage.',
    'acc.title':'Final accusation','acc.lock':'SEAL ACCUSATION','acc.reveal':'REVEAL RECONSTRUCTION','acc.person':'PERSON','acc.scene':'SCENE','acc.object':'OBJECT','acc.motive':'MOTIVE','acc.who':'WHO?','acc.where':'WHERE?','acc.what':'WHICH ITEM?','acc.waiting':'ACCUSATION IN PREPARATION',
    'status.paused':'PAUSED','status.running':'IN PROGRESS','status.finished':'FINISHED',
    'intro.soundOff':'🔇 SOUND','intro.soundOn':'🔊 SOUND','intro.fullscreen':'⛶ FULL SCREEN','intro.exitFullscreen':'⤢ EXIT FULL SCREEN','intro.restart':'↻ RESTART','intro.skip':'SKIP','intro.openCase':'OPEN CASE FILE →','intro.buildTheory':'Build your theory','intro.person':'Person','intro.scene':'Scene','intro.object':'Object','intro.motive':'Motive','intro.stage1':'S1 · OPENING','intro.stage2':'S2 · FRACTURE','intro.stage3':'S3 · PIVOT','intro.sharedResearch':'Players + NPC · private roles · shared investigation',
    'error.engineStarting':'The engine is still initializing. Wait a moment and try again.','error.createNeedsAccess':'To create a room, open the game from My Portal or enter your access code. Joining a room does not require a license.','error.roomCode':'Enter the room code.'
  })
});

function normalizeLanguage(value){const v=String(value||'').trim().toLowerCase();return SUPPORTED_LANGUAGES.includes(v)?v:null}
function safeStorageGet(key){try{return localStorage.getItem(key)}catch{return null}}
function safeStorageSet(key,value){try{localStorage.setItem(key,value)}catch{}}
function interpolate(value,vars={}){return String(value).replace(/\{([a-zA-Z0-9_]+)\}/g,(_,k)=>Object.prototype.hasOwnProperty.call(vars,k)?String(vars[k]):`{${k}}`)}

function initialLanguage(){
  let query=null;
  try{query=normalizeLanguage(new URLSearchParams(location.search).get('lang'))}catch{}
  if(query){safeStorageSet(LANGUAGE_STORAGE_KEY,query);return query}
  const saved=normalizeLanguage(safeStorageGet(LANGUAGE_STORAGE_KEY));
  return saved||'es';
}

let currentLanguage=initialLanguage();
if(typeof document!=='undefined')document.documentElement.lang=currentLanguage;

export function getLanguage(){return currentLanguage}
export function t(key,vars={}){
  const primary=DICTIONARY[currentLanguage]?.[key];
  const fallback=DICTIONARY.es?.[key];
  return interpolate(primary??fallback??key,vars);
}
export function setLanguage(language,{persist=true,updateUrl=true}={}){
  const next=normalizeLanguage(language)||'es';
  currentLanguage=next;
  if(persist)safeStorageSet(LANGUAGE_STORAGE_KEY,next);
  if(typeof document!=='undefined')document.documentElement.lang=next;
  if(updateUrl&&typeof location!=='undefined'&&typeof history!=='undefined'){
    try{const u=new URL(location.href);u.searchParams.set('lang',next);history.replaceState(history.state,'',u.toString())}catch{}
  }
  if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent('expedientes:languagechange',{detail:{lang:next}}));
  return next;
}
export function applyTranslations(root=document){
  if(!root?.querySelectorAll)return;
  root.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=t(el.dataset.i18n)});
  root.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{el.setAttribute('placeholder',t(el.dataset.i18nPlaceholder))});
  root.querySelectorAll('[data-i18n-title]').forEach(el=>{el.setAttribute('title',t(el.dataset.i18nTitle))});
  root.querySelectorAll('[data-exp-lang]').forEach(el=>{const active=el.dataset.expLang===currentLanguage;el.classList.toggle('active',active);el.setAttribute('aria-pressed',active?'true':'false')});
}
export function bindLanguageSwitcher(root=document){
  if(!root?.querySelectorAll)return;
  root.querySelectorAll('[data-exp-lang]').forEach(el=>{
    if(el.dataset.expLangBound==='1')return;
    el.dataset.expLangBound='1';
    el.addEventListener('click',()=>setLanguage(el.dataset.expLang));
  });
  applyTranslations(root);
}
export function preserveLanguage(input){
  try{
    const u=new URL(input,location.href);
    u.searchParams.set('lang',currentLanguage);
    return u.toString();
  }catch{return input}
}
export function languageLocale(){return currentLanguage==='en'?'en-US':'es-AR'}
