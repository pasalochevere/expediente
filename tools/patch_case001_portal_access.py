from pathlib import Path
p=Path('caso001/index.html')
s=p.read_text(encoding='utf-8')
old="import {P2MultiplayerAdapter,P2_LABELS,findStoredLicense,lastRoomCode,remainingSeconds,formatClock} from './p2-multiplayer-adapter.js';"
new="import {P2MultiplayerAdapter,P2_LABELS,findStoredLicense,saveStoredLicense,lastRoomCode,remainingSeconds,formatClock} from './p2-multiplayer-adapter.js';"
assert s.count(old)==1, f'import mismatch {s.count(old)}'
s=s.replace(old,new,1)
old="buildCharacters();buildTheory();$('#licenseKey').value=findStoredLicense();const invitedRoom=new URLSearchParams(location.search).get('room');const last=lastRoomCode();if(invitedRoom){setEntryMode('join');$('#roomCode').value=String(invitedRoom).trim().toUpperCase();toast('Código de sala cargado. Elegí tu personaje y uníte.')}else if(last){$('#roomCode').value=last;$('#rejoinLast').classList.remove('hidden');$('#rejoinLast').textContent=`Reingresar a ${last}`}"
new="buildCharacters();buildTheory();const urlParams=new URLSearchParams(location.search);const portalAccess=String(urlParams.get('access')||'').trim();const invitedRoom=urlParams.get('room');if(portalAccess){$('#licenseKey').value=portalAccess;saveStoredLicense(portalAccess);$('#licenseKey').readOnly=true;$('#licenseKey').title='Acceso cargado desde tu Portal PasaloChevere';toast('Acceso cargado desde Portal.')}else{$('#licenseKey').value=findStoredLicense()}const last=lastRoomCode();if(invitedRoom){setEntryMode('join');$('#roomCode').value=String(invitedRoom).trim().toUpperCase();toast('Código de sala cargado. Elegí tu personaje y uníte.')}else if(last){$('#roomCode').value=last;$('#rejoinLast').classList.remove('hidden');$('#rejoinLast').textContent=`Reingresar a ${last}`}"
assert s.count(old)==1, f'init mismatch {s.count(old)}'
s=s.replace(old,new,1)
assert "urlParams.get('access')" in s
assert 'saveStoredLicense(portalAccess)' in s
p.write_text(s,encoding='utf-8')
print('Caso001 portal access patch OK')
