export async function loadProofMap(baseUrl='./'){
  const root=new URL(baseUrl,import.meta.url);
  const r=await fetch(new URL('proof-map.json',root));
  if(!r.ok) throw new Error(`No se pudo cargar proof-map.json: HTTP ${r.status}`);
  return r.json();
}

export function validateNarrativeProof(pack,proofMap){
  const spec=proofMap?.packs?.[pack.id];
  const errors=[];
  if(!spec) return {ok:false,status:'MISSING',errors:[`Falta mapa narrativo para ${pack.id}`]};
  const evidenceIds=new Set((pack.evidence||[]).map(e=>e.id));
  const chain=new Set(spec.chain||[]);
  for(const id of chain) if(!evidenceIds.has(id)) errors.push(`La cadena narrativa referencia una evidencia inexistente: ${id}`);
  for(const role of proofMap.requiredRoles||[]){
    const roleIds=spec.roles?.[role]||[];
    if(!roleIds.length) errors.push(`Falta rol narrativo: ${role}`);
    else if(!roleIds.some(id=>chain.has(id))) errors.push(`La cadena no contiene una evidencia del rol: ${role}`);
    for(const id of roleIds) if(!evidenceIds.has(id)) errors.push(`El rol ${role} usa evidencia inexistente: ${id}`);
  }
  return {ok:errors.length===0,status:spec.deskReview||'UNREVIEWED',errors,chain:[...chain],roles:spec.roles||{}};
}

export function validateNarrativeLibrary(packs,proofMap){
  const reports=(packs||[]).map(pack=>({id:pack.id,...validateNarrativeProof(pack,proofMap)}));
  return {ok:reports.every(r=>r.ok),total:reports.length,passed:reports.filter(r=>r.ok).length,failed:reports.filter(r=>!r.ok).length,reports};
}
