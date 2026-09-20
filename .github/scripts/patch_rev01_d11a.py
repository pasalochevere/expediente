from pathlib import Path
import re
p=Path('caso001-rev01/index.html')
s=p.read_text()
if 'P2.12D.11A · ACCESS PREFLIGHT + MOBILE QA' in s:
    raise SystemExit('D11A already applied')

css=r'''
/* P2.12D.11A · ACCESS PREFLIGHT + MOBILE QA */
.entryRuntime{margin-top:12px;border:1px solid #4e3b2b;background:#100e0c;padding:10px 11px;display:grid;gap:8px}.entryRuntimeRow{display:flex;align-items:center;justify-content:space-between;gap:10px}.runtimeState{display:flex;align-items:center;gap:7px;font-size:9px;letter-spacing:.08em;color:#9a8b79;font-weight:850}.runtimeDot{width:8px;height:8px;border-radius:50%;background:#756858;box-shadow:0 0 0 3px rgba(117,104,88,.12)}.runtimeState.ready{color:#9bc5a2}.runtimeState.ready .runtimeDot{background:#6cb37a;box-shadow:0 0 0 3px rgba(108,179,122,.12),0 0 8px rgba(108,179,122,.32)}.runtimeState.bad{color:#e3a09a}.runtimeState.bad .runtimeDot{background:#b94a42;box-shadow:0 0 0 3px rgba(185,74,66,.12)}.accessState{font-size:9px;color:#8d7d6b;line-height:1.45}.accessState strong{color:#d7b675}.entryError{border-left:4px solid #a43a34;background:#22110f;color:#edb5ae;padding:10px 11px;font-size:10px;line-height:1.5}.entryHelp{display:flex;gap:7px;align-items:center;flex-wrap:wrap}.entryHelp a{border:1px solid #6c5336;background:#18130f;color:#dbba7b;text-decoration:none;padding:7px 9px;font-size:8px;letter-spacing:.08em;font-weight:850}.entryHelp span{font-size:8px;color:#786c5e}.entryToolbar{align-items:center}.entryToolbar .btn.primary.runtimeWaiting{opacity:.62;cursor:wait}.licenseLoaded{border-color:#526b47!important;box-shadow:inset 0 0 0 1px rgba(115,160,100,.12)}
@media(max-width:900px){.gridMain{grid-template-columns:1fr}.lobbyLayout{grid-template-columns:1fr}.inviteDossier{border-left:0;border-top:1px solid #503923}.statusbar{grid-template-columns:1fr auto}.stage{text-align:right}.privateDossierPanel,.investigationBoard,.directorPanel,.logPanel{max-width:100%}}
@media(max-width:560px){.wrap{padding-inline:8px}.top{display:grid}.revTopActions{align-items:flex-start}.revTitleRow{gap:10px}.caseStamp{font-size:8px;padding:6px}.dossierGrid{grid-template-columns:1fr}.grid2{grid-template-columns:1fr}.characters{grid-template-columns:1fr 1fr}.dossierChar{grid-template-columns:76px 1fr}.characterDossierPreview{max-width:100%}.roomHead{display:grid}.roomHead .meta{justify-content:flex-start}.lobbyHeader{align-items:flex-start}.lobbyPlayers.players{grid-template-columns:1fr}.inviteDossier{padding:15px}.qrFrame{max-width:210px;margin-inline:auto}.statusbar{grid-template-columns:1fr}.clock{text-align:left}.stage{text-align:left}.entryRuntimeRow{display:grid}.entryToolbar{display:grid;grid-template-columns:1fr}.entryToolbar .btn{width:100%;min-height:46px}.accChoices,.theoryGrid{grid-template-columns:repeat(2,minmax(0,1fr))!important}.revealTriad,.revealFacts{grid-template-columns:1fr}.code{overflow-wrap:anywhere}}
@media(max-width:380px){.characters{grid-template-columns:1fr}.accChoices,.theoryGrid{grid-template-columns:1fr 1fr!important}.revTitleRow h1{font-size:44px}.boardBody,.accBody{padding-inline:10px}.lobbyRoster{padding-inline:12px}.privateHero{grid-template-columns:88px 1fr}}
'''
anchor='/* P2.12D.10 · CINEMATIC REVEAL */'
if anchor not in s: raise SystemExit('D10 marker missing')
s=s.replace(anchor,css+'\n'+anchor,1)

# Import fresh adapter URL.
s=s.replace("../caso001/p2-multiplayer-adapter.js?v=rev01-prologue-2","../caso001/p2-multiplayer-adapter.js?v=rev01-d11a-20260920")

old='''  <div class="toolbar"><button id="enterRoom" class="btn primary">Crear sala</button><button id="rejoinLast" class="btn hidden">Reingresar a mi última sala</button></div>
</section>'''
new='''  <div class="entryRuntime"><div class="entryRuntimeRow"><div id="runtimeState" class="runtimeState"><span class="runtimeDot"></span><span>INICIALIZANDO MOTOR…</span></div><div id="accessState" class="accessState">Comprobando acceso…</div></div><div id="entryError" class="entryError hidden"></div><div id="entryHelp" class="entryHelp hidden"><a href="../portal-v2/">ABRIR MI PORTAL</a><span>También podés ingresar tu código de acceso en el campo Licencia.</span></div></div>
  <div class="toolbar entryToolbar"><button id="enterRoom" class="btn primary runtimeWaiting" disabled>INICIALIZANDO…</button><button id="rejoinLast" class="btn hidden">Reingresar a mi última sala</button></div>
</section>'''
if old not in s: raise SystemExit('setup toolbar anchor missing')
s=s.replace(old,new,1)

state="let entryMode='create',selectedCharacter=0,view=null,privateView=null,refreshing=false,pendingRefresh=false,tickTimer=null,clockTimer=null,busy=false;"
if state not in s: raise SystemExit('main state anchor missing')
s=s.replace(state,state+"\nlet adapterReady=false,adapterInitError='';",1)

helpers=r'''function setEntryError(message=''){const box=$('#entryError');if(!box)return;const text=String(message||'').trim();box.textContent=text;box.classList.toggle('hidden',!text)}
function updateAccessPreflight(){const input=$('#licenseKey'),runtime=$('#runtimeState'),access=$('#accessState'),help=$('#entryHelp'),button=$('#enterRoom');const key=String(input?.value||'').trim(),signed=adapter.user&&!adapter.user.is_anonymous;if(input)input.classList.toggle('licenseLoaded',!!key);if(runtime){runtime.classList.toggle('ready',adapterReady);runtime.classList.toggle('bad',!!adapterInitError);runtime.innerHTML=`<span class="runtimeDot"></span><span>${adapterInitError?'MOTOR NO DISPONIBLE':adapterReady?'MOTOR P2 LISTO':'INICIALIZANDO MOTOR…'}</span>`}if(access)access.innerHTML=key?'<strong>ACCESO CARGADO</strong> · listo para crear sala':signed?'<strong>SESIÓN IDENTIFICADA</strong> · el servidor buscará tu acceso activo':'Falta cargar un acceso para crear una sala';if(help)help.classList.toggle('hidden',!!key||signed||entryMode!=='create');if(button){button.disabled=!adapterReady||!!adapterInitError;button.classList.toggle('runtimeWaiting',!adapterReady&&!adapterInitError);button.textContent=!adapterReady?'INICIALIZANDO…':entryMode==='create'?'Crear sala':'Unirme a la sala'}}
function canCreateWithCurrentAccess(){const key=String($('#licenseKey')?.value||'').trim();const signed=adapter.user&&!adapter.user.is_anonymous;return !!key||!!signed}
'''
needle="const setBusy=v=>{busy=v;document.body.classList.toggle('loading',v)};"
if needle not in s: raise SystemExit('helper insertion anchor missing')
s=s.replace(needle,needle+'\n'+helpers,1)

old_mode="function setEntryMode(mode){entryMode=mode;$('#tabCreate').classList.toggle('active',mode==='create');$('#tabJoin').classList.toggle('active',mode==='join');$('#createOnly').classList.toggle('hidden',mode!=='create');$('#joinOnly').classList.toggle('hidden',mode!=='join');$('#enterRoom').textContent=mode==='create'?'Crear sala':'Unirme a la sala'}"
new_mode="function setEntryMode(mode){entryMode=mode;setEntryError('');$('#tabCreate').classList.toggle('active',mode==='create');$('#tabJoin').classList.toggle('active',mode==='join');$('#createOnly').classList.toggle('hidden',mode!=='create');$('#joinOnly').classList.toggle('hidden',mode!=='join');updateAccessPreflight()}"
if old_mode not in s: raise SystemExit('setEntryMode anchor missing')
s=s.replace(old_mode,new_mode,1)

pat=re.compile(r'async function enter\(\)\{.*?\}\nasync function rejoin\(\)\{',re.S)
m=pat.search(s)
if not m: raise SystemExit('enter anchor missing')
new_enter=r'''async function enter(){if(!adapterReady){setEntryError(adapterInitError||'El motor todavía se está inicializando. Esperá un instante y volvé a intentar.');return}const name=$('#displayName').value.trim()||'Investigador';setEntryError('');if(entryMode==='create'&&!canCreateWithCurrentAccess()){const msg='Para crear una sala desde esta preview, abrí el juego desde Mi Portal o ingresá tu código de acceso. Unirse a una sala no requiere licencia.';setEntryError(msg);$('#entryHelp').classList.remove('hidden');toast(msg,true);return}setBusy(true);try{let data;if(entryMode==='create'){const key=$('#licenseKey').value.trim();data=await adapter.createRoom({licenseKey:key,displayName:name,characterIndex:selectedCharacter,mode:$('#mode').value})}else{const code=$('#roomCode').value.trim();if(!code)throw new Error('Ingresá el código de sala.');data=await adapter.joinRoom({code,displayName:name,characterIndex:selectedCharacter})}if(!data?.room?.id)throw new Error('El servidor no devolvió una sala válida.');adapter.roomId=data.room.id;await adapter.subscribe();await refresh(true);toast(entryMode==='create'?'Sala creada.':'Entraste a la sala.')}catch(e){const msg=e?.message||String(e);setEntryError(msg);toast(msg,true)}finally{setBusy(false);updateAccessPreflight()}}
'''
s=s[:m.start()]+new_enter+'async function rejoin(){'+s[m.end():]

# Ensure field edits update visible access state.
hook="$('#privacyToggle').onclick=()=>{privateInfoHidden=!privateInfoHidden;applyPrivateVisibility()};"
if hook not in s: raise SystemExit('event hook missing')
s=s.replace(hook,hook+"\n$('#licenseKey').addEventListener('input',()=>{setEntryError('');updateAccessPreflight()});",1)

old_init="try{await adapter.init();configureTimers()}catch(e){toast(`No pude iniciar Supabase: ${e.message||e}`,true)}"
new_init="try{await adapter.init();adapterReady=true;adapterInitError='';configureTimers();updateAccessPreflight()}catch(e){adapterReady=false;adapterInitError=e?.message||String(e);setEntryError(`No pude iniciar el motor P2: ${adapterInitError}`);updateAccessPreflight();toast(`No pude iniciar Supabase: ${adapterInitError}`,true)}"
if old_init not in s: raise SystemExit('init anchor missing')
s=s.replace(old_init,new_init,1)

# Call preflight once after stored/portal access resolution, before async init.
needle2="adapter.onChange(()=>refresh());"
if needle2 not in s: raise SystemExit('onChange anchor missing')
s=s.replace(needle2,"updateAccessPreflight();\n"+needle2,1)

p.write_text(s)
print('P2.12D.11A patch complete')
