from pathlib import Path
p=Path('admin-licencias/index.html')
s=p.read_text()
old="const delBtn=canDelete?`<button class=\"miniBtn danger\" data-delete=\"${i}\">Eliminar</button>`:'';return `<article"
new="const delBtn=canDelete?`<button class=\"miniBtn danger\" data-delete=\"${i}\">Eliminar</button>`:'';const supportBtn=(r.status==='active'&&r.owner_email)?`<button class=\"miniBtn success\" data-support=\"${i}\">Acceso directo</button>`:'';return `<article"
if old not in s: raise SystemExit('render anchor 1 missing')
s=s.replace(old,new,1)
old2="${stateBtn}${delBtn}</div></article>`}).join('');[...$('history').querySelectorAll('[data-message]')]"
new2="${supportBtn}${stateBtn}${delBtn}</div></article>`}).join('');[...$('history').querySelectorAll('[data-message]')]"
if old2 not in s: raise SystemExit('render anchor 2 missing')
s=s.replace(old2,new2,1)
old3="[...$('history').querySelectorAll('[data-revoke]')].forEach(b=>b.onclick=()=>adminLicenseAction('revoke',rows[+b.dataset.revoke]));"
new3="[...$('history').querySelectorAll('[data-support]')].forEach(b=>b.onclick=()=>supportAccessLink(rows[+b.dataset.support],b));"+old3
if old3 not in s: raise SystemExit('listener anchor missing')
s=s.replace(old3,new3,1)
anchor="async function adminLicenseAction(action,r){"
support="""async function supportAccessLink(r,btn){
 if(!r?.id||!r?.owner_email)return alert('Este acceso todavía no tiene un email asociado.');
 if(!confirm(`Generar un enlace de acceso de un solo uso para ${r.owner_email}?\\n\\nEnviarlo únicamente al titular de la cuenta.`))return;
 const old=btn.textContent;btn.disabled=true;btn.textContent='Generando…';
 try{const d=await callAdmin({action:'support_access_link',license_id:r.id});await copyText(d.action_link);alert(`✅ Enlace directo generado y copiado.\\n\\nCuenta: ${d.email}\\n\\nMandalo por WhatsApp y pedile que lo abra en el dispositivo donde va a jugar.`)}catch(e){alert(e.message||String(e))}finally{btn.disabled=false;btn.textContent=old}
}
"""
if anchor not in s: raise SystemExit('function anchor missing')
s=s.replace(anchor,support+anchor,1)
p.write_text(s)
print('patched admin support access link')
