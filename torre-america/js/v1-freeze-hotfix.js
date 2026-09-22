/* TORRE DE AMÉRICA · V1.0 FREEZE HOTFIX
   Cierre QA: MIXTO 40/40/20 + marcador de shootout mostrado desde el ganador.
*/

// Canon V1: MIXTO = 40% Fácil / 40% Medio / 20% Leyenda.
effectiveDifficulty=function(){
  if(S.difficulty!=='MIXTO')return S.difficulty;
  const r=Math.random();
  return r<.40?'FACIL':r<.80?'MEDIO':'LEYENDA';
};

// Mantiene toda la lógica original del shootout y corrige sólo el texto final.
const _v1FinishShootout=finishShootout;
finishShootout=function(winner){
  const sh=S.shootout?{
    type:S.shootout.type,
    owner:S.shootout.owner,
    rival:S.shootout.rival,
    kicksA:[...(S.shootout.kicksA||[])],
    kicksB:[...(S.shootout.kicksB||[])]
  }:null;
  const out=_v1FinishShootout(winner);
  if(sh&&!['TIEBREAK','TEAM_TIEBREAK'].includes(sh.type)){
    const loser=winner===sh.owner?sh.rival:sh.owner;
    const a=sh.kicksA.filter(Boolean).length;
    const b=sh.kicksB.filter(Boolean).length;
    const winnerGoals=winner===sh.owner?a:b;
    const loserGoals=winner===sh.owner?b:a;
    const el=document.getElementById('resultText');
    if(el)el.textContent=`${S.players[winner].name} ganó ${winnerGoals}–${loserGoals} ante ${S.players[loser].name}.`;
  }
  return out;
};

window.TORRE_AMERICA_RELEASE='V1.0';
