from pathlib import Path

p=Path('admin-licencias/index.html')
s=p.read_text(encoding='utf-8')

# The successful guarded patch was preceded by earlier partial commits.
# Keep one canonical copy of each block and remove only exact duplicates.
fields='''<div class="fields"><div class="field"><label>Tipo de acceso *</label><select id="accessKind"><option value="commercial">Comercial</option><option value="promo">Promoción / prueba</option></select></div><div class="field"><label>Vigencia *</label><select id="durationPreset"><option value="standard">Estándar del producto · 12 meses</option><option value="24">1 día</option><option value="72">3 días</option><option value="168">7 días</option><option value="720">30 días</option><option value="2160">90 días</option><option value="8760">12 meses</option><option value="custom">Personalizada</option></select></div></div>
<div class="field hidden" id="customDurationField"><label>Vigencia personalizada · días</label><input id="customDays" type="number" min="1" max="365" step="1" value="7"></div>
<div id="durationHint" class="msg"><b>Comercial:</b> usa la vigencia estándar del producto. La vigencia empieza cuando el cliente activa el código.</div>
'''
count=s.count(fields)
assert count==2, f'expected 2 access blocks, got {count}'
first=s.find(fields)
second=s.find(fields,first+len(fields))
s=s[:second]+s[second+len(fields):]

fn="function durationText(lic){const h=Number(lic?.duration_hours||0);if(lic?.duration_label)return lic.duration_label;if(!h)return 'vigencia configurada';if(h===8760)return '12 meses';if(h%24===0)return `${h/24} día${h===24?'':'s'}`;return `${h} horas`}\n"
count=s.count(fn)
assert count==2, f'expected 2 durationText functions, got {count}'
first=s.find(fn)
second=s.find(fn,first+len(fn))
s=s[:second]+s[second+len(fn):]

listeners="$('accessKind').onchange=syncAccess;$('durationPreset').onchange=syncAccess;$('customDays').oninput=syncAccess;"
double=listeners+listeners
assert double in s, 'duplicated listener block not found'
s=s.replace(double,listeners,1)

# Sanity checks for the final commercial admin.
assert s.count('id="accessKind"')==1
assert s.count('id="durationPreset"')==1
assert s.count('id="customDays"')==1
assert s.count('function durationText(lic)')==1
assert s.count('function syncAccess()')==1
assert s.count('function selectedDurationHours()')==1
assert s.count("$('accessKind').onchange=syncAccess;")==1
assert 'duration_hours:durationHours' in s
assert 'Vigencia: ${dur} desde la activación.' in s

p.write_text(s,encoding='utf-8')
print('admin duration duplicate cleanup OK')
