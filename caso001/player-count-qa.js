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

export function simulatePlayerCounts(pack,manifest=null){
  const allCharacters=Object.keys(manifest?.characters||{}).length?Object.keys(manifest.characters):CASE001_IDS.characters;
  const locations=Object.keys(manifest?.locations||{}).length?Object.keys(manifest.locations):CASE001_IDS.locations;
  const keyObjects=Object.keys(manifest?.keyObjects||{}).length?Object.keys(manifest.keyObjects):CASE001_IDS.keyObjects;
  const runs=[];
  for(let playerCount=3;playerCount<=6;playerCount++){
    for(const activeCharacters of combinations(allCharacters,playerCount)){
      if(!activeCharacters.includes(pack.killer)) continue;
      const result=solveFromEvidence(pack,{characters:activeCharacters,locations,keyObjects});
      const ok=result.suspects.length===1&&result.suspects[0]===pack.killer&&result.locations.length===1&&result.locations[0]===pack.location&&result.objects.length===1&&result.objects[0]===pack.keyObject;
      runs.push({playerCount,activeCharacters,ok,result});
    }
  }
  return {packId:pack.id,total:runs.length,passed:runs.filter(x=>x.ok).length,failed:runs.filter(x=>!x.ok).length,ok:runs.every(x=>x.ok),runs};
}

export function simulateLibraryPlayerCounts(packs,manifest=null){
  const reports=(packs||[]).map(pack=>simulatePlayerCounts(pack,manifest));
  return {total:reports.reduce((n,r)=>n+r.total,0),passed:reports.reduce((n,r)=>n+r.passed,0),failed:reports.reduce((n,r)=>n+r.failed,0),ok:reports.every(r=>r.ok),reports};
}
