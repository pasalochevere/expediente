from pathlib import Path
# trigger v1
p=Path('portal-v2/index.html')
s=p.read_text(encoding='utf-8')

# CSS modal + device rows
anchor='@media(max-width:920px)'
css='''
.deviceModal{position:fixed;inset:0;background:rgba(0,0,0,.72);display:grid;place-items:center;padding:18px;z-index:9999}.deviceModal.hidden{display:none!important}.deviceDialog{width:min(620px,100%);max-height:85vh;overflow:auto;background:linear-gradient(180deg,#1b1719,#0f0e10);border:1px solid #4b4042;border-radius:20px;padding:20px;box-shadow:0 28px 80px rgba(0,0,0,.55)}.deviceHead{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:12px}.deviceHead h3{margin:3px 0 0;font-size:1.35rem}.deviceList{display:grid;gap:10px}.deviceRow{display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center;padding:13px;border:1px solid #3d3638;border-radius:14px;background:#111013}.deviceRow b{display:block}.deviceRow small{display:block;color:var(--muted);margin-top:4px;line-height:1.4}.deviceCurrent{display:inline-flex;margin-left:7px;padding:3px 6px;border-radius:999px;border:1px solid #315e40;color:#a9e3bc;font-size:.62rem;font-weight:900}.deviceEmpty{padding:14px;border:1px dashed #4a4245;border-radius:12px;color:var(--muted)}
'''
assert s.count(anchor)==1, f'css anchor mismatch {s.count(anchor)}'
s=s.replace(anchor,css+anchor,1)

# Modal markup before scripts
anchor='''</div>\n<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>'''
modal='''</div>\n<div id="deviceModal" class="deviceModal hidden" role="dialog" aria-modal="true" aria-labelledby="deviceModalTitle"><div class="deviceDialog"><div class="deviceHead"><div><div class="eyebrow">GESTIÓN DE DISPOSITIVOS</div><h3 id="deviceModalTitle">Tus dispositivos</h3><div id="deviceModalSub" class="sub"></div></div><button class="btn" onclick="closeDevices()">CERRAR</button></div><div id="deviceList" class="deviceList"></div><div id="deviceMsg" class="msg"></div></div></div>\n<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>'''
assert s.count(anchor)==1, f'modal anchor mismatch {s.count(anchor)}'
s=s.replace(anchor,modal,1)

# Card text + manage action
old="""     const code=l.activation_code||'Se genera al activar';\n     let action='';"""
new="""     const code=l.activation_code||'Se genera al activar';\n     const deviceManage=active&&l.activation_code?'<br><button class=\"copy\" onclick=\"openDevices(\\''+escapeHtml(l.activation_code)+'\\',\\''+escapeHtml(l.product_name)+'\\');return false\">GESTIONAR DISPOSITIVOS</button>':'';\n     let action='';"""
assert s.count(old)==1, f'card preamble mismatch {s.count(old)}'
s=s.replace(old,new,1)
old="""<br>Dispositivos: '+l.devices_used+' / '+l.device_limit+'</p><div class=\"actions\">'+action+'</div></article>';"""
new="""<br>Dispositivos registrados: <b>'+l.devices_used+' de '+l.device_limit+'</b>'+deviceManage+'</p><div class=\"actions\">'+action+'</div></article>';"""
assert s.count(old)==1, f'device text mismatch {s.count(old)}'
s=s.replace(old,new,1)

# Device manager JS before activateOwned
anchor='''async function activateOwned(productCode){'''
js=r'''function deviceDate(v){if(!v)return 'Sin registro';try{return new Date(v).toLocaleString('es-AR',{dateStyle:'short',timeStyle:'short'})}catch{return String(v)}}
let openDeviceAccess='';
async function openDevices(activationCode,productName){
 openDeviceAccess=activationCode;
 document.getElementById('deviceModalTitle').textContent=productName||'Tus dispositivos';
 document.getElementById('deviceModalSub').textContent='Cargando dispositivos registrados…';
 document.getElementById('deviceList').innerHTML='';
 document.getElementById('deviceMsg').textContent='';
 document.getElementById('deviceModal').classList.remove('hidden');
 try{
   const d=await callAccess({action:'list_devices',activation_code:activationCode,device_id:deviceId()});
   document.getElementById('deviceModalSub').textContent=`${d.devices.length} de ${d.device_limit} dispositivos registrados`;
   const list=document.getElementById('deviceList');
   if(!d.devices.length){list.innerHTML='<div class="deviceEmpty">No hay dispositivos registrados.</div>';return}
   list.innerHTML=d.devices.map(x=>{
     const current=x.is_current?'<span class="deviceCurrent">ESTE DISPOSITIVO</span>':'';
     const btn=x.is_current?'<button class="btn" disabled>EN USO</button>':'<button class="btn" onclick="releaseDevice(\''+escapeHtml(x.device_id)+'\',\''+escapeHtml(x.label||'Dispositivo')+'\')">LIBERAR</button>';
     return '<div class="deviceRow"><div><b>'+escapeHtml(x.label||'Dispositivo')+current+'</b><small>Primera actividad: '+deviceDate(x.first_seen_at)+'<br>Última actividad: '+deviceDate(x.last_seen_at)+'</small></div>'+btn+'</div>';
   }).join('');
 }catch(e){document.getElementById('deviceMsg').textContent=e.message||String(e);document.getElementById('deviceMsg').className='msg bad'}
}
function closeDevices(){document.getElementById('deviceModal').classList.add('hidden');openDeviceAccess=''}
async function releaseDevice(targetId,label){
 if(!openDeviceAccess)return;
 if(!confirm(`¿Liberar ${label}?\n\nEse dispositivo dejará de ocupar un lugar de tu licencia.`))return;
 const m=document.getElementById('deviceMsg');m.textContent='Liberando dispositivo…';m.className='msg';
 try{
   await callAccess({action:'release_device',activation_code:openDeviceAccess,release_device_id:targetId,device_id:deviceId()});
   m.textContent='✅ Dispositivo liberado.';m.className='msg good';
   await loadMyGames();
   await openDevices(openDeviceAccess,document.getElementById('deviceModalTitle').textContent);
 }catch(e){m.textContent=e.message||String(e);m.className='msg bad'}
}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDevices()});
document.getElementById('deviceModal').addEventListener('click',e=>{if(e.target.id==='deviceModal')closeDevices()});

async function activateOwned(productCode){'''
assert s.count(anchor)==1, f'js anchor mismatch {s.count(anchor)}'
s=s.replace(anchor,js,1)

assert 'Dispositivos registrados:' in s
assert 'GESTIONAR DISPOSITIVOS' in s
assert "action:'list_devices'" in s
assert "action:'release_device'" in s
p.write_text(s,encoding='utf-8')
print('Portal device manager patch OK')
