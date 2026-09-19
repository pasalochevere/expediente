from pathlib import Path
p=Path('portal-v2/index.html')
s=p.read_text(encoding='utf-8')

old='''<div class="heroPanel"><div class="eyebrow">TU BIBLIOTECA PERSONAL</div><h2>Menos mezcla. Más ganas de jugar.</h2><p>Cada producto vive dentro de una familia clara, sin perder la estética original de su juego.</p><div class="heroStats"><div class="heroStat"><b>5</b><span>familias de experiencias</span></div><div class="heroStat"><b>1</b><span>acceso personal</span></div><div class="heroStat"><b>Flexible</b><span>vigencia según tu acceso</span></div><div class="heroStat"><b>2</b><span>dispositivos</span></div></div></div>'''
new='''<div class="heroPanel"><div class="eyebrow">TU CUENTA PASALOCHEVERE</div><h2>Todos tus juegos y accesos, en un solo lugar.</h2><p>Activá códigos, abrí tus juegos y consultá tus accesos anteriores, vigencia y dispositivos desde la misma cuenta.</p><div class="heroStats"><div class="heroStat"><b>Todo</b><span>tu historial de accesos</span></div><div class="heroStat"><b>1</b><span>cuenta personal</span></div><div class="heroStat"><b>Flexible</b><span>vigencia según cada acceso</span></div><div class="heroStat"><b>2</b><span>dispositivos por acceso</span></div></div></div>'''
assert s.count(old)==1, f'hero anchor mismatch {s.count(old)}'
s=s.replace(old,new,1)

old='''<section id="myGames" class="hidden">
  <div class="catalog-title"><div><div class="eyebrow">MI BIBLIOTECA</div><h2>Mis juegos</h2></div><span>Accesos vinculados a tu cuenta</span></div>
  <div id="myGamesGrid" class="libraryGroups"></div>
</section>'''
new='''<section id="myGames" class="hidden">
  <div class="catalog-title"><div><div class="eyebrow">MI CUENTA · HISTORIAL Y BIBLIOTECA</div><h2>Mis accesos y juegos</h2></div><span>Incluye tus activaciones anteriores vinculadas a esta misma cuenta</span></div>
  <div class="msg good" style="margin:0 0 14px">Tus códigos personales anteriores aparecen automáticamente acá. No necesitás volver a activarlos.</div>
  <div id="myGamesGrid" class="libraryGroups"></div>
</section>'''
assert s.count(old)==1, f'myGames anchor mismatch {s.count(old)}'
s=s.replace(old,new,1)

old="if(l.product_code==='EXP-001')return '../?access='+encodeURIComponent(l.activation_code);"
new="if(l.product_code==='EXP-001')return '../caso001/?access='+encodeURIComponent(l.activation_code);"
assert s.count(old)==1, f'EXP001 href mismatch {s.count(old)}'
s=s.replace(old,new,1)

old="const badge=active?'● ACTIVO':pending?'● COMPRA APROBADA':'VENCIDO';"
new="const badge=active?'● ACTIVO':pending?'● PENDIENTE DE ACTIVAR':l.status==='revoked'?'● ANULADO':'● VENCIDO';"
assert s.count(old)==1, f'badge mismatch {s.count(old)}'
s=s.replace(old,new,1)

old="else if(active&&l.game_url) action='<a class=\"btn primary\" href=\"#\" onclick=\"openGame(\\''+escapeHtml(l.activation_code||'')+'\\',\\''+escapeHtml(gameHref(l))+'\\');return false\">JUGAR</a>';"
new="else if(active&&l.game_url) action='<a class=\"btn primary\" href=\"#\" onclick=\"openGame(\\''+escapeHtml(l.activation_code||'')+'\\',\\''+escapeHtml(gameHref(l))+'\\');return false\">JUGAR</a><button class=\"btn\" onclick=\"copyCode(\\''+escapeHtml(l.activation_code||'')+'\\');return false\">COPIAR CÓDIGO</button>';"
assert s.count(old)==1, f'active action mismatch {s.count(old)}'
s=s.replace(old,new,1)

old="else if(active) action='<span class=\"btn\" style=\"opacity:.6\">URL PENDIENTE</span>';"
new="else if(active) action='<span class=\"btn\" style=\"opacity:.6\">URL PENDIENTE</span><button class=\"btn\" onclick=\"copyCode(\\''+escapeHtml(l.activation_code||'')+'\\');return false\">COPIAR CÓDIGO</button>';"
assert s.count(old)==1, f'active no-url action mismatch {s.count(old)}'
s=s.replace(old,new,1)

old="<div class=\"accent\">Código personal: <code>'+escapeHtml(code)+'</code></div>"
new="<div class=\"accent\">Código de acceso: <code>'+escapeHtml(code)+'</code></div>"
assert s.count(old)==1, f'code label mismatch {s.count(old)}'
s=s.replace(old,new,1)

assert 'Todos tus juegos y accesos, en un solo lugar.' in s
assert "../caso001/?access=" in s
assert 'COPIAR CÓDIGO' in s
assert 'Incluye tus activaciones anteriores' in s
p.write_text(s,encoding='utf-8')
print('Portal account-center patch OK')
