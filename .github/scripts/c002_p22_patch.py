from pathlib import Path
import sys

def patch_html(s:str)->str:
    def R(old,new,expected=None):
        nonlocal s
        n=s.count(old)
        if expected is not None and n!=expected:
            raise RuntimeError(f'expected {expected}, got {n}: {old[:90]}')
        if n==0:
            raise RuntimeError(f'not found: {old[:90]}')
        s=s.replace(old,new)

    R('<title>EXPEDIENTES · Caso 002 · P1.3 · Sala e Identidad Privada</title>',
      '<title>EXPEDIENTES · Caso 002 · La Habitación que No Existe</title>',1)
    R('<div style="position:fixed;left:10px;bottom:10px;z-index:99999;background:#7e2e2e;color:#fff;border:1px solid #a37a48;border-radius:999px;padding:6px 10px;font:700 11px system-ui;letter-spacing:.08em">CASO 002 · BETA ONLINE</div>','',1)
    R('<span class="devtag">NAVEGACIÓN FUNCIONAL</span>','<span class="devtag">EXPERIENCIA INTERACTIVA</span>',1)
    R("<button onclick=\"showView('classic')\"><div class=\"mini\">CARTAS</div><strong>MODO CLÁSICO</strong><span>Mazo físico + asistente digital</span></button>",'',1)
    R('EXPEDIENTES · CASO 002 · HOTEL ORFEO · Motor EXP‑V2','EXPEDIENTES · CASO 002 · HOTEL ORFEO',1)
    R('<div class="eyebrow">P1.8 · BETA ONLINE</div><h3>${label}</h3>','<div class="eyebrow">SALA ONLINE · HOTEL ORFEO</div><h3>${label}</h3>',1)
    R('● CONEXIÓN SUPABASE','● SALA ONLINE',1)
    R('Se necesitan al menos 3 jugadores para iniciar.','Se necesitan exactamente 3 jugadores para iniciar.',1)
    R('10 minutos · PRUEBA BETA','10 minutos · PARTIDA RÁPIDA',1)
    R('Compartí este código. Los demás deben abrir este mismo P1.4 y elegir <b>Unirme</b>.','Compartí este código. Los demás deben abrir este mismo enlace del Caso 002 y elegir <b>Unirme</b>.',1)
    R('${players.length} jugadores conectados. La sala ya puede comenzar.','${players.length} jugadores en la sala. La sala ya puede comenzar.',1)
    R('<b>P1.4</b><br>Tu identidad ya está asignada.','<b>SIGUIENTE PASO</b><br>Tu identidad ya está asignada.',1)
    R('<div class="eyebrow">P1.7 · LISTOS</div>','<div class="eyebrow">LISTOS PARA COMENZAR</div>',1)
    R('<div class="eyebrow">P1.8 · CENTRAL DE INVESTIGACIÓN</div>','<div class="eyebrow">CENTRAL DE INVESTIGACIÓN</div>',2)
    R('La generación PDF se conecta en la siguiente etapa usando la misma biblioteca visual y narrativa.','El kit imprimible es complementario: podés usarlo junto con la experiencia digital o jugar sin imprimir.',1)
    R('/* ===== P1.8 · BETA ONLINE ===== */','/* ===== ENGINE P2 · ONLINE ===== */',2)

    R("const C002_ROOM_KEY='exp_c002_room_id';\nlet c002RoomId=localStorage.getItem(C002_ROOM_KEY)||'';",
      "const C002_ROOM_KEY='exp_c002_room_id';\nconst C002_ROOM_CODE_KEY='exp_c002_room_code';\nlet c002RoomId=localStorage.getItem(C002_ROOM_KEY)||'';\nlet c002RoomCode=localStorage.getItem(C002_ROOM_CODE_KEY)||'';",1)
    R("try{c002Msg('Creando sala…');const d=await c002Call({action:'create',mode,display_name:$('#c002Name').value,character_index:c002SelectedChar(),duration_minutes:Number($('#c002Duration').value)});c002EnterRoom(d.room.id)}",
      "try{c002Msg('Creando sala…');const d=await c002Call({action:'create',mode,display_name:$('#c002Name').value,character_index:c002SelectedChar(),duration_minutes:Number($('#c002Duration').value)});if(d.room?.code){c002RoomCode=d.room.code;localStorage.setItem(C002_ROOM_CODE_KEY,c002RoomCode)}c002EnterRoom(d.room.id)}",1)
    R("try{c002Msg('Buscando sala…');const code=String($('#c002JoinCode').value||'').trim().toUpperCase();const d=await c002Call({action:'join',code,display_name:$('#c002Name').value,character_index:c002SelectedChar()});c002EnterRoom(d.room.id)}",
      "try{c002Msg('Buscando sala…');const code=String($('#c002JoinCode').value||'').trim().toUpperCase();const d=await c002Call({action:'join',code,display_name:$('#c002Name').value,character_index:c002SelectedChar()});c002RoomCode=code;localStorage.setItem(C002_ROOM_CODE_KEY,c002RoomCode);c002EnterRoom(d.room.id)}",1)
    R("const d=await c002Call({action:'lobby',room_id:c002RoomId});c002LastLobby=d;",
      "const d=await c002Call({action:'lobby',room_id:c002RoomId});if(!d.room.code&&c002RoomCode)d.room.code=c002RoomCode;c002LastLobby=d;",2)
    R("HOTEL ORFEO · SALA ${escapeHtmlP13(g.room.code)} ·","HOTEL ORFEO · SALA ${escapeHtmlP13(g.room.code||c002RoomCode||'ACTIVA')} ·",2)

    R("table:'exp_players',filter:'room_id=eq.'+c002RoomId","table:'room_members',filter:'room_id=eq.'+c002RoomId",2)
    R("table:'exp_rooms',filter:'id=eq.'+c002RoomId","table:'rooms',filter:'id=eq.'+c002RoomId",2)
    R("table:'exp_room_state',filter:'room_id=eq.'+c002RoomId","table:'game_sessions',filter:'room_id=eq.'+c002RoomId",2)
    R(".on('postgres_changes',{event:'INSERT',schema:'public',table:'exp_events',filter:'room_id=eq.'+c002RoomId},()=>c002RefreshInvestigation())",
      ".on('postgres_changes',{event:'INSERT',schema:'public',table:'session_events'},()=>c002RefreshInvestigation(false))\n    .on('postgres_changes',{event:'UPDATE',schema:'public',table:'session_state'},()=>c002SmartRefresh())",1)

    R("g.state?.phase==='investigation'","['investigation','solving'].includes(g.state?.phase)",7)
    R("async function c002DoTick(){\n  try{await c002GameCall({action:'tick',room_id:c002RoomId})}catch(e){console.warn('tick',e)}\n}",
      "async function c002DoTick(){\n  try{await c002GameCall({action:'tick',room_id:c002RoomId});await c002RefreshInvestigation(false)}catch(e){console.warn('tick',e)}\n}",1)
    R("c002RefreshInvestigation=async function(){\n  if(!c002RoomId)return;\n  try{\n    const g=await c002GameCall({action:'state',room_id:c002RoomId});\n    if(g.room.status==='finished'||c002SolutionEvent(g)){c002RenderFinishedFrom(g);return}\n    if(['investigation','solving'].includes(g.state?.phase))c002RenderInvestigationFrom(g);\n  }catch(e){console.warn(e)}\n};",
      "c002RefreshInvestigation=async function(startLoops=true){\n  if(!c002RoomId)return;\n  try{\n    const g=await c002GameCall({action:'state',room_id:c002RoomId});\n    if(g.room.status==='finished'||c002SolutionEvent(g)){c002RenderFinishedFrom(g);return}\n    if(['investigation','solving'].includes(g.state?.phase))c002RenderInvestigationFrom(g,startLoops);\n  }catch(e){console.warn(e)}\n};",1)

    R("setTimeout(async()=>{if(c002RoomId){try{await c002EnsureSession();c002Subscribe();await c002RefreshLobby()}catch{}}},450);",
      "setTimeout(async()=>{\n try{\n  await c002EnsureSession();\n  if(c002RoomId){c002Subscribe();await c002RefreshLobby();return}\n  const d=await c002Call({action:'recover'});\n  if(d?.recovered&&d?.room?.id&&(d.recovery_phase!=='lobby'||c002RoomCode))c002EnterRoom(d.room.id);\n }catch{}\n},450);",1)

    css='''<style id="p22QaFixes">
/* P2.2 · QA visual y jugable */
.inv-card{color:#d8c3a5;text-align:left;font:inherit}
.inv-card-copy b{color:#ead7b9}
.copy-btn{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:9px 12px}
.p16-private-btn{min-height:44px}
.p17-close{width:44px!important;height:44px!important}
@media(max-width:620px){
 .pair-dock{position:static;bottom:auto;margin-top:14px}
 .btn{min-height:44px}
 .pair-actions .btn{min-height:44px}
 .inv-card{min-height:44px}
}
</style>'''
    R('</head>',css+'</head>',1)

    bad=['CASO 002 · BETA ONLINE','MODO CLÁSICO</strong>','P1.8 · CENTRAL DE INVESTIGACIÓN','10 minutos · PRUEBA BETA','este mismo P1.4','La generación PDF se conecta',"table:'exp_players'","table:'exp_rooms'","table:'exp_room_state'","table:'exp_events'"]
    for b in bad:
        if b in s: raise RuntimeError('still contains '+b)
    return s

if __name__=='__main__':
    src=Path(sys.argv[1]).read_text('utf-8')
    Path(sys.argv[2]).write_text(patch_html(src),'utf-8')
