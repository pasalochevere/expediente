from pathlib import Path

p=Path('admin-licencias/index.html')
s=p.read_text(encoding='utf-8')

old='<div class="fields"><div class="field"><label>Producto *</label><select id="product"></select></div><div class="field"><label>Canal *</label><select id="channel"></select></div></div>'
new='''<div class="fields"><div class="field"><label>Producto *</label><select id="product"></select></div><div class="field"><label>Canal *</label><select id="channel"></select></div></div>
<div class="fields"><div class="field"><label>Tipo de acceso *</label><select id="accessKind"><option value="commercial">Comercial</option><option value="promo">Promoción / prueba</option></select></div><div class="field"><label>Vigencia *</label><select id="durationPreset"><option value="standard">Estándar del producto · 12 meses</option><option value="24">1 día</option><option value="72">3 días</option><option value="168">7 días</option><option value="720">30 días</option><option value="2160">90 días</option><option value="8760">12 meses</option><option value="custom">Personalizada</option></select></div></div>
<div class="field hidden" id="customDurationField"><label>Vigencia personalizada · días</label><input id="customDays" type="number" min="1" max="365" step="1" value="7"></div>
<div id="durationHint" class="msg"><b>Comercial:</b> usa la vigencia estándar del producto. La vigencia empieza cuando el cliente activa el código.</div>'''
assert s.count(old)==1, f'fields anchor mismatch {s.count(old)}'
s=s.replace(old,new)

start=s.index('function buyerText(lic){')
end=s.index('async function checkSession',start)
new_buyer="""function durationText(lic){const h=Number(lic?.duration_hours||0);if(lic?.duration_label)return lic.duration_label;if(!h)return 'vigencia configurada';if(h===8760)return '12 meses';if(h%24===0)return `${h/24} día${h===24?'':'s'}`;return `${h} horas`}
function buyerText(lic){const name=lic.product_name||productName(lic.product_code),ch=lic.channel_name||channelName(channelCodeFromSource(lic.source)),dur=durationText(lic);return `Hola, gracias por tu compra de ${name}${ch?` en ${ch}`:''}.\n\nTu código de activación es: ${lic.license_key}\n\nIngresá al Portal PasaloChevere:\n${PORTAL}\n\n1) Escribí tu propio correo electrónico.\n2) Abrí el enlace mágico que recibirás por email.\n3) Volvé al Portal y en “Activar compra” ingresá este código.\n4) El producto aparecerá en “Mis juegos”.\n\nVigencia: ${dur} desde la activación. El acceso es personal y queda asociado al correo que verificaste.\n\nSi necesitás ayuda, escribinos por este medio.`}
"""
s=s[:start]+new_buyer+s[end:]

start=s.index('async function loadConfig(){')
end=s.index('function syncChannel(){',start)
new_config="""async function loadConfig(){config=await callAdmin({action:'config'});$('product').innerHTML=config.products.map(p=>`<option value="${esc(p.product_code)}">${esc(p.name)} · ${esc(p.product_code)}</option>`).join('');$('channel').innerHTML=config.channels.map(c=>`<option value="${esc(c.code)}">${esc(c.name)}</option>`).join('');$('channel').value='ML';syncChannel();syncAccess()}
function syncAccess(){const kind=$('accessKind').value,preset=$('durationPreset').value;$('customDurationField').classList.toggle('hidden',preset!=='custom');if(kind==='commercial'&&preset==='standard')$('durationHint').innerHTML='<b>Comercial:</b> usa la vigencia estándar del producto (hoy 12 meses). La vigencia comienza al activar.';else $('durationHint').innerHTML='<b>Promoción / vigencia especial:</b> el acceso vencerá '+(preset==='custom'?$('customDays').value+' días':$('durationPreset').selectedOptions[0].textContent)+' después de la activación.'}
function selectedDurationHours(){const preset=$('durationPreset').value;if(preset==='standard')return null;if(preset==='custom'){const d=Number($('customDays').value);if(!Number.isInteger(d)||d<1||d>365)throw new Error('La vigencia personalizada debe ser de 1 a 365 días.');return d*24}return Number(preset)}
"""
s=s[:start]+new_config+s[end:]

start=s.index('async function createLicense(){')
end=s.index('function statusLabel',start)
new_create="""async function createLicense(){const product=$('product').value,channel=$('channel').value,ref=$('saleRef').value.trim(),email=$('buyerEmail').value.trim(),accessKind=$('accessKind').value;let durationHours;try{durationHours=selectedDurationHours()}catch(e){return msg('createMsg',e.message||String(e),'bad')}if(!product||!channel||!ref)return msg('createMsg','Completá producto, canal y referencia de venta.','bad');if(channel==='ML'&&!/^\\d{16}$/.test(ref))return msg('createMsg','El número de venta MercadoLibre debe tener 16 dígitos. Ejemplo: 2000018505705824.','bad');$('createBtn').disabled=true;msg('createMsg','Generando licencia…');try{const data=await callAdmin({action:'create_license',product_code:product,channel,sale_ref:ref,buyer_email:channel==='ML'?null:(email||null),access_kind:accessKind,duration_hours:durationHours});current=data.license;$('purchaseCode').textContent=current.license_key;$('resultTitle').textContent=current.product_name;$('resultMeta').textContent=(data.reused?'Esta referencia ya tenía código; recuperé el existente. ':'Código nuevo creado. ')+(current.owner_email?'Reservado/asociado a '+current.owner_email+'. ':'Sin email previo: se asociará al correo que lo active. ')+'Vigencia: '+durationText(current)+' · Referencia: '+current.order_ref;$('buyerMessage').textContent=buyerText(current);$('resultCard').classList.remove('hidden');msg('createMsg','✓ Código preparado.','good');await loadHistory()}catch(e){msg('createMsg',e.message||String(e),'bad')}finally{$('createBtn').disabled=false}}
"""
s=s[:start]+new_create+s[end:]

old='<small>${r.devices_used||0} / ${r.device_limit||2} dispositivos</small></div><div><b class="mono">'
new='<small>${r.devices_used||0} / ${r.device_limit||2} dispositivos</small><small>Vigencia: ${esc(r.duration_label||durationText(r))}</small></div><div><b class="mono">'
assert s.count(old)==1, f'history anchor mismatch {s.count(old)}'
s=s.replace(old,new)

old="function resetSale(){$('saleRef').value='';$('buyerEmail').value='';$('resultCard').classList.add('hidden');current=null;$('saleRef').focus();msg('createMsg','Listo para una nueva venta.','')}"
new="function resetSale(){$('saleRef').value='';$('buyerEmail').value='';$('accessKind').value='commercial';$('durationPreset').value='standard';$('customDays').value='7';syncAccess();$('resultCard').classList.add('hidden');current=null;$('saleRef').focus();msg('createMsg','Listo para una nueva venta.','')}"
assert s.count(old)==1, f'reset anchor mismatch {s.count(old)}'
s=s.replace(old,new)

old="$('channel').onchange=syncChannel;$('saleRef').oninput="
new="$('channel').onchange=syncChannel;$('accessKind').onchange=syncAccess;$('durationPreset').onchange=syncAccess;$('customDays').oninput=syncAccess;$('saleRef').oninput="
assert s.count(old)==1, f'listener anchor mismatch {s.count(old)}'
s=s.replace(old,new)

s=s.replace('comienza la vigencia de 12 meses y se habilita el límite configurado de dispositivos.','comienza la vigencia configurada para ese código y se habilita el límite de dispositivos.')
p.write_text(s,encoding='utf-8')
print('admin duration patch OK')
