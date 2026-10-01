// EXP01-EN5 · Bilingual Printables · Caso 001
// Presentation-only localization for the printable kit. Canonical game data is never mutated.
import {translateGameContent} from '../content-en.js?v=exp01-en3-20261001';

const STORAGE_KEY='expedientes.c001.printables.lang';
const GLOBAL_STORAGE_KEY='expedientes_language';
const VALID_LANGS=new Set(['es','en']);

const PRINTABLE_PAIRS=Object.freeze([
  ['EXPEDIENTES · CASO 001','EXPEDIENTES · CASE 001'],
  ['LA ÚLTIMA REUNIÓN · KIT IMPRIMIBLE','THE LAST MEETING · PRINTABLE KIT'],
  ['Versión','Version'],
  ['ECO / B&N','ECO / B&W'],
  ['Etapa liberada','Released stage'],
  ['E1 · Apertura','E1 · Opening'],
  ['E2 · Fractura','E2 · Fracture'],
  ['E3 · Pivote','E3 · Pivot'],
  ['— sin pack —','— no pack —'],
  ['Canal evidencia','Evidence channel'],
  ['Expediente público + NPC','Public case file + NPC'],
  ['Privada · Santiago','Private · Santiago'],
  ['Privada · Clara','Private · Clara'],
  ['Privada · Vera','Private · Vera'],
  ['Privada · Mateo','Private · Mateo'],
  ['Privada · Inés','Private · Inés'],
  ['Privada · Tomás','Private · Tomás'],
  ['Carga manual','Manual load'],
  ['Cargar JSON local','Load local JSON'],
  ['Salida','Output'],
  ['Imprimir / Guardar PDF','Print / Save PDF'],
  ['Incluir 8 A4 base','Include 8 base A4 pages'],
  ['Incluir evidencias','Include evidence'],
  ['Humanos:','Human players:'],
  ['Kit base listo. Seleccioná un Crime Pack para generar las evidencias correspondientes.','Base kit ready. Select a Crime Pack to generate the corresponding evidence.'],

  ['EXPEDIENTE DEL CASO','CASE FILE'],
  ['ARCHIVO CONFIDENCIAL','CONFIDENTIAL FILE'],
  ['LA ÚLTIMA REUNIÓN','THE LAST MEETING'],
  ['La verdad está en la mesa.','The truth is on the table.'],
  ['LEER EN VOZ ALTA','READ ALOUD'],
  ['Seis personas. Una reunión que debía cerrar viejas cuentas. Una muerte que ninguno esperaba.','Six people. A meeting meant to settle old scores. A death no one expected.'],
  ['APERTURA COMÚN','SHARED OPENING'],
  ['Una reunión que nadie podrá olvidar.','A meeting no one will ever forget.'],
  ['Esteban Valdés convocó a seis personas que forman parte de distintos momentos de su vida. Todos aceptaron asistir. Ninguno llegó sin algo que perder.','Esteban Valdés called together six people, each connected to a different chapter of his life. They all agreed to attend. None arrived with nothing to lose.'],
  ['“Esta noche vamos a terminar lo que empezamos.”','“Tonight we finish what we started.”'],
  ['La conversación se volvió tensa. Hubo reproches, silencios y movimientos que más tarde nadie describiría de la misma manera.','The conversation grew tense. There were accusations, silences, and movements that no one would later describe in quite the same way.'],
  ['Antes de que terminara la noche, Esteban Valdés murió dentro de la propiedad. La explicación no está en una sola pista. Está dispersa entre personas, escenas, objetos, horarios y contradicciones.','Before the night was over, Esteban Valdés died inside the property. The explanation is not in a single clue. It is scattered across people, scenes, objects, times, and contradictions.'],
  ['Mínimo 3 jugadores humanos. Los personajes restantes son NPC. Normal: 35 min; el responsable puede ser humano o NPC. Impostor: 30 min; el responsable es uno de los jugadores humanos y recibe su rol en privado.','Minimum 3 human players. The remaining characters are NPCs. Normal: 35 min; the culprit may be a human or an NPC. Impostor: 30 min; the culprit is one of the human players and receives the role privately.'],
  ['1 · INVESTIGÁ POR ETAPAS.','1 · INVESTIGATE IN STAGES.'],
  ['Etapa 1 abre líneas. Etapa 2 fractura coartadas. Etapa 3 habilita el cierre por cruce.','Stage 1 opens lines of inquiry. Stage 2 breaks alibis. Stage 3 enables the final cross-check.'],
  ['2 · NINGUNA PISTA VALE SOLA.','2 · NO CLUE STANDS ALONE.'],
  ['Contrastá hechos, testimonios y registros antes de descartar.','Cross-check facts, statements, and records before ruling anything out.'],
  ['3 · ACUSACIÓN FINAL.','3 · FINAL ACCUSATION.'],
  ['Persona + Escena + Objeto son los 3 ejes obligatorios. Motivo / hipótesis causal es complementario.','Person + Scene + Object are the 3 required axes. Motive / causal hypothesis is supplementary.'],

  ['PERSONAS · 6 SOSPECHOSOS','PEOPLE · 6 SUSPECTS'],
  ['Personas','People'],
  ['Los seis existen siempre. En modo Normal, un NPC también puede ser responsable; en modo Impostor, el responsable está entre los jugadores humanos.','All six are always present. In Normal mode, an NPC can also be the culprit; in Impostor mode, the culprit is one of the human players.'],
  ['Ficha pública inicial.','Initial public profile.'],
  ['“Ficha pública inicial.”','“Initial public profile.”'],
  ['Anotá solo hechos comprobados. Los antecedentes y contradicciones relevantes se revelan durante la investigación.','Record only verified facts. Relevant background and contradictions are revealed during the investigation.'],

  ['ESCENAS DE INVESTIGACIÓN','INVESTIGATION SCENES'],
  ['Escenas','Scenes'],
  ['Una escena puede ser el lugar del hecho crítico o una parte indispensable de la secuencia.','A scene may be the location of the critical event or an essential part of the sequence.'],
  ['Sillón, mesa y lámpara','Sofa, table, and lamp'],
  ['Mesada, hornallas y vajilla','Counter, stovetop, and dishes'],
  ['Escritorio, papeles y libros','Desk, papers, and books'],
  ['Cama y mesa de luz','Bed and nightstand'],
  ['Patio o zona exterior','Patio or outdoor area'],
  ['Puerta, hall y corredor','Door, foyer, and hallway'],
  ['¿Qué ocurrió aquí? ¿Quién tuvo acceso? ¿Qué registro puede confirmarlo?','What happened here? Who had access? What record can confirm it?'],

  ['OBJETOS CLAVE','KEY OBJECTS'],
  ['Objetos','Objects'],
  ['El objeto verdadero es el que vuelve incompleta la reconstrucción si se lo retira.','The true key object is the one the reconstruction cannot fully explain without.'],
  ['Elemento agresor o amenaza','Aggressive instrument or threat'],
  ['Notas y apuntes','Notes and annotations'],
  ['Llamadas, mensajes y registros','Calls, messages, and records'],
  ['Acceso o cerradura','Access or lock'],
  ['Archivos y copias digitales','Files and digital copies'],
  ['Tela, fibra o rastro','Cloth, fiber, or trace'],
  ['No asumas que el objeto clave es necesariamente el mecanismo de la muerte.','Do not assume the key object is necessarily what caused the death.'],

  ['HOJA DE INVESTIGACIÓN','INVESTIGATION SHEET'],
  ['Tablero de teoría','Theory board'],
  ['Separá lo que sabés de lo que suponés. Un descarte necesita una razón.','Separate what you know from what you assume. Every dismissal needs a reason.'],
  ['PERSONA','PERSON'],
  ['ESCENA','SCENE'],
  ['OBJETO','OBJECT'],
  ['MOTIVO / HIPÓTESIS (OPCIONAL)','MOTIVE / HYPOTHESIS (OPTIONAL)'],
  ['HECHOS CONFIRMADOS','CONFIRMED FACTS'],
  ['CONTRADICCIONES','CONTRADICTIONS'],
  ['COARTADAS','ALIBIS'],
  ['TESTIMONIOS','STATEMENTS'],
  ['HIPÓTESIS ABIERTAS','OPEN HYPOTHESES'],
  ['DESCARTES JUSTIFICADOS','JUSTIFIED EXCLUSIONS'],

  ['LÍNEA DE TIEMPO','TIMELINE'],
  ['Cronología reconstruida','Reconstructed chronology'],
  ['No hay un rango horario fijo: anotá toda marca temporal útil de la partida.','There is no fixed time range: record every useful time marker from the game.'],
  ['HORA','TIME'],
  ['EVENTO','EVENT'],
  ['FUENTE','SOURCE'],
  ['CERTEZA','CERTAINTY'],
  ['CONTRADICCIÓN','CONTRADICTION'],

  ['MAPA DE RELACIONES','RELATIONSHIP MAP'],
  ['CENTRO DEL CASO','CENTER OF THE CASE'],
  ['Víctima · cruzá relaciones sin asumir culpabilidad','Victim · cross-reference relationships without assuming guilt'],
  ['VÍNCULO','CONNECTION'],
  ['INTERÉS / MOTIVO','INTEREST / MOTIVE'],
  ['CONFLICTO','CONFLICT'],
  ['ACCESO','ACCESS'],
  ['COARTADA','ALIBI'],

  ['ACUSACIÓN FINAL','FINAL ACCUSATION'],
  ['Bloqueo de hipótesis','Hypothesis lock'],
  ['Completá Persona + Escena + Objeto antes de sellar la acusación. El motivo es una hipótesis causal complementaria.','Complete Person + Scene + Object before locking the accusation. Motive is a supplementary causal hypothesis.'],
  ['PERSONA RESPONSABLE','RESPONSIBLE PERSON'],
  ['ESCENA CLAVE','KEY SCENE'],
  ['OBJETO CLAVE','KEY OBJECT'],
  ['RECONSTRUCCIÓN BREVE DE LOS HECHOS','BRIEF RECONSTRUCTION OF EVENTS'],
  ['FIRMA / EQUIPO INVESTIGADOR','SIGNATURE / INVESTIGATION TEAM'],
  ['FECHA / CÓDIGO DE SALA','DATE / ROOM CODE'],

  ['EVIDENCIA','EVIDENCE'],
  ['Evidencia','Evidence'],
  ['Etapa','Stage'],
  ['Canal','Channel'],
  ['Privada','Private'],
  ['Pública','Public']
]);

const ES_TO_EN=new Map(PRINTABLE_PAIRS);
const EN_TO_ES=new Map(PRINTABLE_PAIRS.map(([es,en])=>[en,es]));
const ES_CI=new Map(PRINTABLE_PAIRS.map(([es,en])=>[es.toLocaleLowerCase('es'),en]));
const EN_CI=new Map(PRINTABLE_PAIRS.map(([es,en])=>[en.toLocaleLowerCase('en'),es]));

const PORTRAITS=Object.freeze({
  santiago:'../assets-en/personajes/santiago.svg',
  clara:'../assets-en/personajes/clara.svg',
  vera:'../assets-en/personajes/vera.svg',
  mateo:'../assets-en/personajes/mateo.svg',
  ines:'../assets-en/personajes/ines.svg',
  tomas:'../assets-en/personajes/tomas.svg'
});
const NOTEBOOK_EN='../assets-en/objetos/cuaderno.svg';

function normalizeKey(value){
  return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();
}
function currentLanguage(){
  return String(document.documentElement.lang||'es').toLowerCase()==='en'?'en':'es';
}
function preserveWhitespace(original,replacement){
  const m=String(original).match(/^(\s*)([\s\S]*?)(\s*)$/);
  return `${m?.[1]||''}${replacement}${m?.[3]||''}`;
}
function preserveCase(source,target){
  const letters=String(source).replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g,'');
  if(letters && letters===letters.toLocaleUpperCase('es')) return String(target).toLocaleUpperCase('en');
  return target;
}
function dynamicTranslation(core,language){
  let m;
  if(language==='en'){
    if((m=core.match(/^ETAPA\s+(\d+)$/i))) return `STAGE ${m[1]}`;
    if((m=core.match(/^Privada\s+·\s+(.+)$/i))) return `Private · ${m[1]}`;
  }else{
    if((m=core.match(/^STAGE\s+(\d+)$/i))) return `ETAPA ${m[1]}`;
    if((m=core.match(/^Private\s+·\s+(.+)$/i))) return `Privada · ${m[1]}`;
  }
  return core;
}
function translatePrintable(value,language=currentLanguage()){
  const original=String(value??'');
  if(!original.trim()) return original;
  const core=original.trim();
  const exact=(language==='en'?ES_TO_EN:EN_TO_ES).get(core);
  if(exact!==undefined) return preserveWhitespace(original,preserveCase(core,exact));
  const ci=(language==='en'?ES_CI:EN_CI).get(core.toLocaleLowerCase(language==='en'?'es':'en'));
  if(ci!==undefined) return preserveWhitespace(original,preserveCase(core,ci));
  const dynamic=dynamicTranslation(core,language);
  if(dynamic!==core) return preserveWhitespace(original,preserveCase(core,dynamic));
  const game=translateGameContent(core,language);
  return game===core?original:preserveWhitespace(original,preserveCase(core,game));
}

function skipTextNode(node){
  const p=node?.parentElement;
  return !p||!!p.closest('script,style,noscript,textarea,input');
}
function localizeTextNode(node){
  if(!node||node.nodeType!==Node.TEXT_NODE||skipTextNode(node)) return;
  const next=translatePrintable(node.nodeValue,currentLanguage());
  if(next!==node.nodeValue) node.nodeValue=next;
}
function localizeAttributes(el){
  if(!el||el.nodeType!==Node.ELEMENT_NODE) return;
  for(const attr of ['alt','title','aria-label']){
    if(!el.hasAttribute(attr)) continue;
    const value=el.getAttribute(attr)||'';
    const next=translatePrintable(value,currentLanguage());
    if(next!==value) el.setAttribute(attr,next);
  }
}
function identifyVisual(img){
  if(!(img instanceof HTMLImageElement)) return null;
  if(img.dataset.en5VisualKey) return img.dataset.en5VisualKey;
  const key=normalizeKey(img.getAttribute('alt'));
  if(PORTRAITS[key]){
    img.dataset.en5VisualKey=`portrait:${key}`;
    img.dataset.en5EsSrc=img.getAttribute('src')||'';
    return img.dataset.en5VisualKey;
  }
  if((key==='cuaderno'||key==='notebook')&&img.closest('.object')){
    img.dataset.en5VisualKey='object:notebook';
    img.dataset.en5EsSrc=img.getAttribute('src')||'';
    return img.dataset.en5VisualKey;
  }
  return null;
}
function localizeVisual(img){
  const visual=identifyVisual(img);
  if(!visual) return;
  const language=currentLanguage();
  let next=img.dataset.en5EsSrc||img.getAttribute('src')||'';
  if(language==='en'){
    if(visual.startsWith('portrait:')) next=PORTRAITS[visual.split(':')[1]]||next;
    else if(visual==='object:notebook') next=NOTEBOOK_EN;
  }
  if(next && img.getAttribute('src')!==next) img.setAttribute('src',next);
}
function applyVisuals(root=document){
  if(root instanceof HTMLImageElement) localizeVisual(root);
  root.querySelectorAll?.('img').forEach(localizeVisual);
}

export function applyPrintableLocalization(root=document){
  if(typeof document==='undefined'||!root) return;
  applyVisuals(root);
  if(root.nodeType===Node.TEXT_NODE){localizeTextNode(root);return;}
  if(root.nodeType===Node.ELEMENT_NODE) localizeAttributes(root);
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT);
  let node=walker.currentNode;
  while(node){
    if(node.nodeType===Node.TEXT_NODE) localizeTextNode(node);
    else localizeAttributes(node);
    node=walker.nextNode();
  }
}

function setDocumentTitle(language){
  document.title=language==='en'
    ?'EXPEDIENTES · Case 001 · The Last Meeting · Printable Kit'
    :'EXPEDIENTES · Caso 001 · La Última Reunión · Kit imprimible';
}
function syncUrl(language){
  const url=new URL(location.href);
  url.searchParams.set('lang',language);
  history.replaceState(null,'',url);
}
function ensureLanguageControl(){
  let select=document.getElementById('printLang');
  if(select) return select;
  const controls=document.querySelector('.controls');
  if(!controls) return null;
  const field=document.createElement('div');
  field.className='field en5-lang-field';
  field.innerHTML='<label for="printLang">Idioma / Language</label><select id="printLang" aria-label="Idioma / Language"><option value="es">ESPAÑOL</option><option value="en">ENGLISH</option></select>';
  controls.prepend(field);
  select=field.querySelector('select');
  select.addEventListener('change',()=>setPrintableLanguage(select.value));
  return select;
}

export function getPrintableLanguage(){return currentLanguage();}
export function setPrintableLanguage(language,{updateUrl=true,persist=true}={}){
  const next=VALID_LANGS.has(language)?language:'es';
  document.documentElement.lang=next;
  setDocumentTitle(next);
  const select=ensureLanguageControl();
  if(select) select.value=next;
  if(persist){try{localStorage.setItem(STORAGE_KEY,next);localStorage.setItem(GLOBAL_STORAGE_KEY,next)}catch{}}
  if(updateUrl) syncUrl(next);
  applyPrintableLocalization(document);
  window.dispatchEvent(new CustomEvent('expedientes:languagechange',{detail:{language:next,source:'printables-en5'}}));
  return next;
}

function initialLanguage(){
  const param=new URL(location.href).searchParams.get('lang');
  if(VALID_LANGS.has(param)) return param;
  try{
    const globalStored=localStorage.getItem(GLOBAL_STORAGE_KEY);
    if(VALID_LANGS.has(globalStored)) return globalStored;
    const stored=localStorage.getItem(STORAGE_KEY);
    if(VALID_LANGS.has(stored)) return stored;
  }catch{}
  return 'es';
}

let observer=null;
function bindMutationLocalization(){
  if(observer||typeof MutationObserver==='undefined') return;
  let scheduled=false;
  const schedule=()=>{
    if(scheduled) return;
    scheduled=true;
    queueMicrotask(()=>{scheduled=false;applyPrintableLocalization(document)});
  };
  observer=new MutationObserver(schedule);
  observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['src','alt','title','aria-label']});
}

export function printableTranslationStats(){
  return {pairs:PRINTABLE_PAIRS.length,visualVariants:7,portraitVariants:6,objectVariants:1,basePages:8};
}

function boot(){
  ensureLanguageControl();
  setPrintableLanguage(initialLanguage(),{updateUrl:false,persist:false});
  bindMutationLocalization();
  window.EXP01_EN5=Object.freeze({
    setLanguage:setPrintableLanguage,
    getLanguage:getPrintableLanguage,
    apply:applyPrintableLocalization,
    stats:printableTranslationStats
  });
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
else boot();
