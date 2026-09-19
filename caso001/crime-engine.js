// CASO 001 · P2 Crime Engine
// Motor independiente del index.html actual. No revela soluciones al cliente hasta la fase de cierre.

export const CASE001_IDS = Object.freeze({
  characters:['SANTIAGO','CLARA','VERA','MATEO','INES','TOMAS'],
  locations:['L1','L2','L3','L4','L5','L6'],
  keyObjects:['O1','O2','O3','O4','O5','O6'],
  evidenceTypes:['temporal','testimonial','physical','digital','access','motivational']
});

export async function loadCrimeLibrary(baseUrl='./'){
  const root=new URL(baseUrl,import.meta.url);
  const manifest=await fetch(new URL('manifest.json',root)).then(assertFetch);
  const packs=await Promise.all(manifest.packs.map(path=>fetch(new URL(path,root)).then(assertFetch)));
  return {manifest,packs};
}

async function assertFetch(response){
  if(!response.ok) throw new Error(`No se pudo cargar ${response.url}: HTTP ${response.status}`);
  return response.json();
}

export function validateCrimePack(pack,manifest=null){
  const errors=[];
  const warnings=[];
  const ids={
    characters:Object.keys(manifest?.characters||{}).length?Object.keys(manifest.characters):CASE001_IDS.characters,
    locations:Object.keys(manifest?.locations||{}).length?Object.keys(manifest.locations):CASE001_IDS.locations,
    keyObjects:Object.keys(manifest?.keyObjects||{}).length?Object.keys(manifest.keyObjects):CASE001_IDS.keyObjects,
    evidenceTypes:manifest?.evidenceTypes||CASE001_IDS.evidenceTypes
  };

  const requiredStrings=['id','title','killer','location','keyObject','motive','truthSummary','criticalEvent','mechanism','postCrimeAction','centralLie','contradiction'];
  for(const key of requiredStrings){ if(!pack?.[key]||typeof pack[key]!=='string') errors.push(`Falta ${key}`); }
  if(pack?.id&&!/^C001-\d{2}$/.test(pack.id)) errors.push('ID de paquete inválido');
  if(pack?.killer&&!ids.characters.includes(pack.killer)) errors.push(`Responsable desconocido: ${pack.killer}`);
  if(pack?.location&&!ids.locations.includes(pack.location)) errors.push(`Escena desconocida: ${pack.location}`);
  if(pack?.keyObject&&!ids.keyObjects.includes(pack.keyObject)) errors.push(`Objeto desconocido: ${pack.keyObject}`);
  if(!Array.isArray(pack?.timeline)||pack.timeline.length<5) errors.push('Timeline insuficiente: mínimo 5 hitos');
  if(!Array.isArray(pack?.relationships)||pack.relationships.length<2) errors.push('Se requieren al menos 2 relaciones cruzadas');
  if(!Array.isArray(pack?.redHerrings)||pack.redHerrings.length<1) errors.push('Se requiere al menos 1 señuelo');
  for(const h of pack?.redHerrings||[]){
    if(!h?.title||!h?.text) errors.push('Señuelo incompleto: requiere title + text');
    if(!h?.resolution) errors.push(`Señuelo sin resolución diferida: ${h?.title||'sin título'}`);
  }
  if(!Array.isArray(pack?.evidence)||pack.evidence.length<6) errors.push('Se requieren al menos 6 evidencias');

  const evidence=Array.isArray(pack?.evidence)?pack.evidence:[];
  const evidenceIds=new Set();
  const evidenceTypes=new Set();
  for(const e of evidence){
    if(!e?.id) errors.push('Hay una evidencia sin ID');
    else if(evidenceIds.has(e.id)) errors.push(`ID de evidencia duplicado: ${e.id}`);
    else evidenceIds.add(e.id);
    if(!ids.evidenceTypes.includes(e?.type)) errors.push(`Tipo de evidencia inválido en ${e?.id||'sin ID'}: ${e?.type}`);
    else evidenceTypes.add(e.type);
    if(![1,2,3].includes(Number(e?.stage))) errors.push(`Stage inválido en ${e?.id||'sin ID'}`);
    if(!e?.text||!e?.deduction) errors.push(`Evidencia incompleta: ${e?.id||'sin ID'}`);
    if(Number(e?.stage)===1&&e?.supports?.suspect) errors.push(`${e.id}: stage 1 no debe identificar un sospechoso mediante supports.suspect`);
    if(e?.type==='testimonial'&&e?.sourceCharacter&&!ids.characters.includes(e.sourceCharacter)) errors.push(`${e.id}: sourceCharacter inválido ${e.sourceCharacter}`);
    if(e?.type==='testimonial'&&e?.public===false){
      if(!e?.sourceCharacter) errors.push(`${e.id}: testimonio privado sin sourceCharacter`);
      if(!e?.npcFallback) errors.push(`${e.id}: testimonio privado sin npcFallback para partidas 3–5 jugadores`);
      if(e?.delivery?.human!=='private'||e?.delivery?.npc!=='casefile') errors.push(`${e.id}: delivery debe definir human=private y npc=casefile`);
    }
    const ro=e?.rulesOut||{};
    for(const s of ro.suspects||[]) if(!ids.characters.includes(s)) errors.push(`${e.id}: sospechoso inválido ${s}`);
    for(const l of ro.locations||[]) if(!ids.locations.includes(l)) errors.push(`${e.id}: escena inválida ${l}`);
    for(const o of ro.objects||[]) if(!ids.keyObjects.includes(o)) errors.push(`${e.id}: objeto inválido ${o}`);
    if((ro.suspects||[]).includes(pack.killer)) errors.push(`${e.id}: elimina al responsable verdadero`);
    if((ro.locations||[]).includes(pack.location)) errors.push(`${e.id}: elimina la escena verdadera`);
    if((ro.objects||[]).includes(pack.keyObject)) errors.push(`${e.id}: elimina el objeto verdadero`);
  }
  if(evidenceTypes.size<4) errors.push(`Solo hay ${evidenceTypes.size} familias de evidencia; mínimo 4`);

  if(!Array.isArray(pack?.proofChain)||pack.proofChain.length<3) errors.push('Cadena de prueba insuficiente: mínimo 3 evidencias');
  for(const id of pack?.proofChain||[]) if(!evidenceIds.has(id)) errors.push(`La cadena de prueba referencia una evidencia inexistente: ${id}`);

  const solution=solveFromEvidence(pack,ids);
  if(solution.suspects.length!==1||solution.suspects[0]!==pack.killer) errors.push(`La evidencia no deja un único responsable: ${solution.suspects.join(', ')||'ninguno'}`);
  if(solution.locations.length!==1||solution.locations[0]!==pack.location) errors.push(`La evidencia no deja una única escena: ${solution.locations.join(', ')||'ninguna'}`);
  if(solution.objects.length!==1||solution.objects[0]!==pack.keyObject) errors.push(`La evidencia no deja un único objeto: ${solution.objects.join(', ')||'ninguno'}`);

  const progression=[1,2,3].map(stage=>({stage,...solveFromEvidence(pack,ids,stage)}));
  const solvedBeforeFinal=progression.slice(0,2).some(p=>p.suspects.length===1&&p.locations.length===1&&p.objects.length===1);
  if(solvedBeforeFinal) warnings.push('La matriz interna queda resuelta antes de stage 3; recordar que rulesOut solo mide pacing técnico, no prueba deducción humana.');

  if(!pack?.epilogue?.reconstruction||pack.epilogue.reconstruction.length<4) errors.push('Falta reconstrucción final suficiente: mínimo 4 pasos');
  if(!pack?.epilogue?.closing) errors.push('Falta cierre narrativo propio del paquete');
  if((pack?.minPlayers||0)<3||(pack?.maxPlayers||0)>6) errors.push('Rango de jugadores fuera de 3–6');

  return {ok:errors.length===0,errors,warnings,solution,progression,evidenceFamilies:[...evidenceTypes]};
}

export function solveFromEvidence(pack,ids=CASE001_IDS,maxStage=Infinity,evidenceFilter=null){
  const suspects=new Set(ids.characters||CASE001_IDS.characters);
  const locations=new Set(ids.locations||CASE001_IDS.locations);
  const objects=new Set(ids.keyObjects||CASE001_IDS.keyObjects);
  for(const e of pack?.evidence||[]){
    if(Number(e.stage)>maxStage) continue;
    if(evidenceFilter&&!evidenceFilter(e)) continue;
    for(const x of e?.rulesOut?.suspects||[]) suspects.delete(x);
    for(const x of e?.rulesOut?.locations||[]) locations.delete(x);
    for(const x of e?.rulesOut?.objects||[]) objects.delete(x);
  }
  return {suspects:[...suspects],locations:[...locations],objects:[...objects]};
}

export function validateLibrary(packs,manifest=null){
  const seen=new Set();
  const reports=(packs||[]).map(pack=>{
    const report=validateCrimePack(pack,manifest);
    if(seen.has(pack.id)) report.errors.push(`ID de paquete duplicado: ${pack.id}`);
    seen.add(pack.id);
    report.ok=report.errors.length===0;
    return {id:pack.id,title:pack.title,...report};
  });
  return {
    ok:reports.every(r=>r.ok),
    total:reports.length,
    passed:reports.filter(r=>r.ok).length,
    failed:reports.filter(r=>!r.ok).length,
    reports
  };
}

export function selectCrimePack(packs,{activeCharacters=CASE001_IDS.characters,rng=Math.random,excludeIds=[]}={}){
  const active=new Set(activeCharacters);
  const excluded=new Set(excludeIds);
  const eligible=(packs||[]).filter(p=>active.has(p.killer)&&!excluded.has(p.id));
  if(!eligible.length) throw new Error('No hay Paquetes de Crimen compatibles con los personajes activos.');
  const n=Math.min(eligible.length-1,Math.floor(Math.max(0,Math.min(0.999999999,rng()))*eligible.length));
  return eligible[n];
}

export function validateAccusation(pack,accusation){
  const dimensions={
    suspect:accusation?.suspect===pack.killer,
    location:accusation?.location===pack.location,
    object:accusation?.object===pack.keyObject
  };
  const hits=Object.values(dimensions).filter(Boolean).length;
  return {
    locked:true,
    hits,
    dimensions,
    status:hits===3?'resolved':hits>=1?'partial':'failed',
    solution:{suspect:pack.killer,location:pack.location,object:pack.keyObject},
    criticalEvent:pack.criticalEvent||'',
    mechanism:pack.mechanism||'',
    postCrimeAction:pack.postCrimeAction||'',
    reconstruction:pack.epilogue?.reconstruction||[],
    closing:pack.epilogue?.closing||''
  };
}

export function buildProgressionReport(pack,manifest=null){
  const ids={
    characters:Object.keys(manifest?.characters||{}).length?Object.keys(manifest.characters):CASE001_IDS.characters,
    locations:Object.keys(manifest?.locations||{}).length?Object.keys(manifest.locations):CASE001_IDS.locations,
    keyObjects:Object.keys(manifest?.keyObjects||{}).length?Object.keys(manifest.keyObjects):CASE001_IDS.keyObjects
  };
  return [1,2,3].map(stage=>{
    const s=solveFromEvidence(pack,ids,stage);
    return {stage,suspects:s.suspects.length,locations:s.locations.length,objects:s.objects.length,candidates:s};
  });
}

// El Director ya no responde hit/miss. Devuelve una orientación narrativa
// basada en evidencias aún no reveladas y nunca expone la solución bruta.
export function buildDirectorHint(pack,revealedEvidenceIds=[]){
  const revealed=new Set(revealedEvidenceIds);
  const pending=(pack?.evidence||[]).filter(e=>!revealed.has(e.id));
  if(!pending.length) return 'No quedan evidencias nuevas. Crucen horarios, acceso, objeto y contradicciones antes de acusar.';
  const priority=['temporal','access','digital','physical','testimonial','motivational'];
  pending.sort((a,b)=>priority.indexOf(a.type)-priority.indexOf(b.type)||a.stage-b.stage);
  const e=pending[0];
  const prompts={
    temporal:'Revisen la línea de tiempo: hay un horario que no encaja con una de las versiones.',
    access:'Pregúntense quién podía entrar, salir o abrir lo que aparece en la historia.',
    digital:'Hay un registro digital capaz de confirmar o romper una coartada.',
    physical:'Vuelvan sobre los rastros físicos: un detalle pequeño conecta dos partes del caso.',
    testimonial:'Comparen las declaraciones. Una omisión importa más que una acusación.',
    motivational:'El motivo no prueba el hecho, pero ayuda a entender qué evidencia merece otra mirada.'
  };
  return prompts[e.type]||'Crucen dos evidencias que todavía no hayan relacionado entre sí.';
}
