from pathlib import Path

p=Path('portal-v2/index.html')
s=p.read_text(encoding='utf-8')

repls=[
    ('<div class="pill">12 MESES · HASTA 2 DISPOSITIVOS</div>',
     '<div class="pill">VIGENCIA SEGÚN TU ACCESO · HASTA 2 DISPOSITIVOS</div>'),
    ('<div class="heroStat"><b>12m</b><span>desde activación</span></div>',
     '<div class="heroStat"><b>Flexible</b><span>vigencia según tu acceso</span></div>'),
]
for old,new in repls:
    count=s.count(old)
    assert count==1, f'anchor mismatch {old[:45]!r}: {count}'
    s=s.replace(old,new,1)

old="const date=l.expires_at?new Date(l.expires_at).toLocaleDateString():'Empieza al activar';"
new="const hours=Number(l.duration_hours||8760);const duration=hours===8760?'12 MESES':hours===24?'1 DÍA':hours%24===0?`${hours/24} DÍAS`:`${hours} HORAS`;const date=l.expires_at?new Date(l.expires_at).toLocaleDateString('es-AR'):'Empieza al activar';"
assert s.count(old)==1, f'duration anchor mismatch {s.count(old)}'
s=s.replace(old,new,1)

old="if(pending) action='<button class=\"btn primary\" onclick=\"activateOwned(\\''+escapeHtml(l.product_code)+'\\')\">ACTIVAR 12 MESES</button>';"
new="if(pending) action='<button class=\"btn primary\" onclick=\"activateOwned(\\''+escapeHtml(l.product_code)+'\\')\">ACTIVAR · '+duration+'</button>';"
assert s.count(old)==1, f'activate button anchor mismatch {s.count(old)}'
s=s.replace(old,new,1)

old="<p>Vence: <b>'+date+'</b><br>Dispositivos: '+l.devices_used+' / '+l.device_limit+'</p>"
new="<p>Vigencia: <b>'+duration+'</b><br>Vence: <b>'+date+'</b><br>Dispositivos: '+l.devices_used+' / '+l.device_limit+'</p>"
assert s.count(old)==1, f'card meta anchor mismatch {s.count(old)}'
s=s.replace(old,new,1)

assert 'ACTIVAR 12 MESES' not in s, 'static activation duration remains'
assert '<div class="pill">12 MESES · HASTA 2 DISPOSITIVOS</div>' not in s, 'static top duration remains'

p.write_text(s,encoding='utf-8')
print('portal dynamic duration patch OK')
