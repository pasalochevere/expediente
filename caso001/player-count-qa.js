import {CASE001_IDS,solveFromEvidence} from './crime-engine.js';

function combinations(items,size){
  const out=[];
  function walk(start,current){
    if(current.length===size){out.push([...current]);return}
    for(let i=start;i<items.length;i++){current.push(items[i]);walk(i+1,current);current.pop()}
  }
  walk(0,[]);
  return out;
}

function evidenceAccessible(pack,humanCharacters){
  const humans=new Set(humanCharacters);
  const problems=[];
  for(const e of pack?.evidence||[]){
    if(e?.public!==false) continue;
    if(e?.type!=='testimonial') continue;
    if(!e?.sourceCharacter) continue;
    if(humans.has(e.sourceCharacter)) continue;
    if(!e?.npcFallback||e?.delivery?.npc!=='casefile') problems.push(`${e.id}: testigo NPC sin fallback accesible`);
  }
  return {ok:problems.length===0,problems};
}

// Modo normal: los 6 personajes existen siempre. La cantidad de jugadores define
// quiénes son humanos y quiénes NPC, pero cualquiera de los 6 puede ser responsable.
export function simulatePlayerCounts(pack,manifest=null){
  const allCharacters=Object.keys(manifest?.characters||{}).length?Object.keys(manifest.characters):CASE001_IDS.characters;
  const locations=Object.keys(manifest?.locations||{}).length?Object.keys(manifest.locations):CASE001_IDS.locations;
  const keyObjects=Object.keys(manifest?.keyObjects||{}).length?Object.keys(manifest.keyObjects):CASE001_IDS.keyObjects;
  const runs=[];
  for(let playerCount=3;playerCount<=6;playerCount++){
    for(const humanCharacters of combinations(allCharacters,playerCount)){
      const npcCharacters=allCharacters.filter(x=>!humanCharacters.includes(x));
      const accessibility=evidenceAccessible(pack,humanCharacters);
      const result=solveFromEvidence(pack,{characters:allCharacters,locations,keyObjects});
      const solved=result.suspects.length===1&&result.suspects[0]===pack.killer&&result.locations.length===1&&result.locations[0]===pack.location&&result.objects.length===1&&result.objects[0]===pack.keyObject;
      const ok=solved&&accessibility.ok;
      runs.push({playerCount,humanCharacters,npcCharacters,killerIsHuman:humanCharacters.includes(pack.killer),ok,result,accessibility});
    }
  }
  const impostorRuns=runs.filter(x=>x.killerIsHuman);
  return {
    packId:pack.id,
    total:runs.length,
    passed:runs.filter(x=>x.ok).length,
    failed:runs.filter(x=>!x.ok).length,
    ok:runs.every(x=>x.ok),
    impostorTotal:impostorRuns.length,
    impostorPassed:impostorRuns.filter(x=>x.ok).length,
    impostorFailed:impostorRuns.filter(x=>!x.ok).length,
    impostorOk:impostorRuns.every(x=>x.ok),
    runs
  };
}

export function simulateLibraryPlayerCounts(packs,manifest=null){
  const reports=(packs||[]).map(pack=>simulatePlayerCounts(pack,manifest));
  return {
    total:reports.reduce((n,r)=>n+r.total,0),
    passed:reports.reduce((n,r)=>n+r.passed,0),
    failed:reports.reduce((n,r)=>n+r.failed,0),
    ok:reports.every(r=>r.ok),
    impostorTotal:reports.reduce((n,r)=>n+r.impostorTotal,0),
    impostorPassed:reports.reduce((n,r)=>n+r.impostorPassed,0),
    impostorFailed:reports.reduce((n,r)=>n+r.impostorFailed,0),
    impostorOk:reports.every(r=>r.impostorOk),
    reports
  };
}
