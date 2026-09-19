from pathlib import Path
p=Path('caso001/index.html')
s=p.read_text(encoding='utf-8')
old="import {P2MultiplayerAdapter,P2_LABELS,findStoredLicense,saveStoredLicense,lastRoomCode,remainingSeconds,formatClock} from './p2-multiplayer-adapter.js';"
new="import {P2MultiplayerAdapter,P2_LABELS,findStoredLicense,lastRoomCode,remainingSeconds,formatClock} from './p2-multiplayer-adapter.js?v=20260919-2312';"
assert s.count(old)==1, f'import mismatch {s.count(old)}'
s=s.replace(old,new,1)
old="saveStoredLicense(portalAccess);"
new="localStorage.setItem('pc_exp_license_key',portalAccess);"
assert s.count(old)==1, f'save mismatch {s.count(old)}'
s=s.replace(old,new,1)
# Let backend auto-resolve an active account access when field is empty.
old="const key=$('#licenseKey').value.trim();if(!key)throw new Error('Ingresá la licencia para crear la sala.');data=await adapter.createRoom({licenseKey:key,displayName:name,characterIndex:selectedCharacter,mode:$('#mode').value})"
new="const key=$('#licenseKey').value.trim();data=await adapter.createRoom({licenseKey:key,displayName:name,characterIndex:selectedCharacter,mode:$('#mode').value})"
assert s.count(old)==1, f'enter mismatch {s.count(old)}'
s=s.replace(old,new,1)
assert 'saveStoredLicense' not in s
assert "p2-multiplayer-adapter.js?v=20260919-2312" in s
p.write_text(s,encoding='utf-8')
print('Caso001 cache-safe patch OK')
