export const IMPOSTOR_POWERS=Object.freeze({
  STATEMENT:'DECLARACION_CONTROLADA',
  RESERVE:'RESERVA',
  REDIRECT:'FOCO_ALTERNATIVO'
});

export function createImpostorState(){
  return {tokens:2,used:[],locked:false};
}

export function lockImpostorState(state){
  return {...state,locked:true};
}

export function canUseImpostorPower(state,power){
  if(!state||state.locked) return {ok:false,reason:'La acusación ya está bloqueada.'};
  if(Number(state.tokens)<=0) return {ok:false,reason:'No quedan fichas de sabotaje.'};
  if(state.used?.includes(power)) return {ok:false,reason:'Ese poder ya fue utilizado.'};
  if(!Object.values(IMPOSTOR_POWERS).includes(power)) return {ok:false,reason:'Poder desconocido.'};
  return {ok:true};
}

export function useImpostorPower(pack,state,power){
  const check=canUseImpostorPower(state,power);
  if(!check.ok) return {ok:false,state,event:null,error:check.reason};
  let event;
  if(power===IMPOSTOR_POWERS.STATEMENT){
    event={type:'player_statement',label:'DECLARACIÓN PERSONAL',text:pack.centralLie,officialEvidence:false};
  }else if(power===IMPOSTOR_POWERS.RESERVE){
    event={type:'impostor_reserve',label:'IMPOSTOR · RESERVA',text:'El jugador utiliza RESERVA y no responde una pregunta personal durante este turno.',officialEvidence:false};
  }else{
    const decoy=pack.redHerrings?.[0];
    if(!decoy) return {ok:false,state,event:null,error:'El paquete no tiene un señuelo disponible.'};
    event={type:'impostor_redirect',label:'IMPOSTOR · FOCO ALTERNATIVO',text:`La siguiente investigación debe considerar esta línea: ${decoy.title}.`,officialEvidence:false,redHerringTitle:decoy.title};
  }
  return {ok:true,state:{...state,tokens:state.tokens-1,used:[...(state.used||[]),power]},event,error:null};
}

export function assertOfficialEvidence(event){
  return event?.officialEvidence===true;
}
