from pathlib import Path
import base64
import json
import re
import subprocess

PRINTABLE = Path('caso001/printables/index.html')
PAGE = Path('caso001-rev01/index.html')
ASSET_DIR = Path('caso001-rev01/assets/personajes')

src = PRINTABLE.read_text()
s = PAGE.read_text()

# Extract only the historical character library, never scenes/objects.
m = re.search(r"const\s+CHARS\s*=\s*\[(.*?)\]\s*;", src, re.S)
if not m:
    raise SystemExit('CHARS block not found')
block = m.group(1)

names = re.findall(r"\bname\s*:\s*['\"]([^'\"]+)['\"]", block)
images = re.findall(r"data:image/([^;]+);base64,([A-Za-z0-9+/=]+)", block)
expected = ['Santiago', 'Clara', 'Vera', 'Mateo', 'Inés', 'Tomás']
if names != expected:
    raise SystemExit(f'character order mismatch: {names}')
if len(images) != 6:
    raise SystemExit(f'expected 6 embedded portraits, got {len(images)}')

ASSET_DIR.mkdir(parents=True, exist_ok=True)
stems = ['santiago', 'clara', 'vera', 'mateo', 'ines', 'tomas']
portrait_paths = []
for name, stem, (declared_mime, b64) in zip(names, stems, images):
    raw = base64.b64decode(b64)
    if raw.startswith(b'\x89PNG\r\n\x1a\n'):
        ext = 'png'
    elif raw.startswith(b'\xff\xd8\xff'):
        ext = 'jpg'
    elif raw.startswith(b'RIFF') and raw[8:12] == b'WEBP':
        ext = 'webp'
    else:
        raise SystemExit(f'{name}: unsupported image bytes ({declared_mime})')
    if len(raw) < 10000:
        raise SystemExit(f'{name}: suspiciously small portrait ({len(raw)} bytes)')
    filename = f'{stem}.{ext}'
    (ASSET_DIR / filename).write_bytes(raw)
    portrait_paths.append(f'assets/personajes/{filename}')
    print(f'{name}: {filename} · {len(raw)} bytes · declared {declared_mime}')

if 'P2.12D.3 · CHARACTER DOSSIERS' in s:
    raise SystemExit('D3 already applied')

css = '''
/* P2.12D.3 · CHARACTER DOSSIERS */
.portraitReal{position:relative;background:#0b0a09;border-right:1px solid #5b4631;min-height:132px;overflow:hidden;display:block}.portraitReal img{width:100%;height:100%;min-height:132px;object-fit:cover;object-position:center 24%;display:block;filter:sepia(.11) saturate(.88) contrast(1.05)}.portraitReal:after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,transparent 42%,rgba(0,0,0,.6)),repeating-linear-gradient(0deg,transparent 0 3px,rgba(255,255,255,.018) 3px 4px)}.portraitReal em{position:absolute;z-index:2;left:7px;bottom:7px;font-style:normal;font-size:8px;letter-spacing:.1em;color:#ead2a5;background:#080604dc;border:1px solid #806342;padding:4px 6px}.dossierChar{grid-template-columns:104px 1fr;min-height:132px}.charMeta .fileState{display:inline-flex;width:max-content;margin-top:8px;border:1px solid #4f654e;color:#9bc398;background:#0f1710;padding:3px 5px;font-size:8px;letter-spacing:.1em;font-style:normal}.characterDossierPreview{margin-top:14px;border:1px solid #785b3b;background:linear-gradient(135deg,#d8c29f,#b79770);color:#211911;box-shadow:0 14px 36px rgba(0,0,0,.26);position:relative;overflow:hidden}.characterDossierPreview:after{content:"ARCHIVO PÚBLICO";position:absolute;right:-13px;bottom:17px;transform:rotate(-7deg);border:3px solid rgba(126,32,29,.43);color:rgba(126,32,29,.5);padding:6px 10px;font-weight:950;letter-spacing:.12em;font-size:14px}.characterPreviewGrid{display:grid;grid-template-columns:190px 1fr;min-height:245px}.characterPreviewPhoto{position:relative;background:#16120f;border-right:1px solid #72583c;overflow:hidden}.characterPreviewPhoto img{width:100%;height:100%;min-height:245px;object-fit:cover;object-position:center 22%;display:block;filter:sepia(.08) saturate(.9) contrast(1.04)}.characterPreviewPhoto:after{content:"";position:absolute;inset:0;box-shadow:inset 0 0 45px rgba(0,0,0,.35);pointer-events:none}.characterPreviewNo{position:absolute;left:10px;top:10px;background:#17100bdc;color:#f0d9af;border:1px solid #8b6d48;padding:6px 8px;font-size:9px;letter-spacing:.14em;font-weight:900}.characterPreviewCopy{padding:22px 24px;display:flex;flex-direction:column;justify-content:center;position:relative}.characterPreviewEyebrow{font-size:9px;letter-spacing:.18em;color:#76231f;font-weight:950}.characterPreviewCopy h3{font-family:Georgia,serif;font-size:34px;margin:5px 0 4px;color:#1c1510}.characterPreviewRole{font-size:12px;text-transform:uppercase;letter-spacing:.12em;color:#76231f;font-weight:950}.characterPreviewRule{height:1px;background:#8f7658;margin:15px 0 13px;max-width:420px}.characterPreviewCopy p{font-family:Georgia,serif;font-size:15px;line-height:1.5;max-width:620px;margin:0;color:#36291e}.characterPreviewMeta{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}.characterPreviewMeta span{border:1px solid #8f7658;background:rgba(255,255,255,.18);padding:5px 7px;font-size:9px;letter-spacing:.08em;font-weight:850}.characterPreviewSelected{color:#245a35!important;border-color:#64856c!important}.charactersHint{font-size:10px;color:#8e7d6a;letter-spacing:.06em;margin:7px 0 0}.dossierChar.selected .portraitReal:before{content:"SELECCIONADO";position:absolute;z-index:3;right:-25px;top:13px;transform:rotate(37deg);background:#7f201d;color:#fff0e0;padding:4px 28px;font-size:7px;letter-spacing:.08em;font-weight:950}
@media(max-width:900px){.characters{grid-template-columns:repeat(2,minmax(0,1fr))}.characterPreviewGrid{grid-template-columns:160px 1fr}.characterPreviewPhoto img{min-height:220px}}
@media(max-width:620px){.characters{grid-template-columns:1fr}.dossierChar{grid-template-columns:92px 1fr;min-height:118px}.portraitReal,.portraitReal img{min-height:118px}.characterPreviewGrid{grid-template-columns:118px 1fr;min-height:190px}.characterPreviewPhoto img{min-height:190px}.characterPreviewCopy{padding:15px}.characterPreviewCopy h3{font-size:26px}.characterPreviewCopy p{font-size:13px}.characterDossierPreview:after{display:none}}
'''
marker = '/* P2.12D.2 · PRÓLOGO CINEMATOGRÁFICO REV01 */'
if marker not in s:
    raise SystemExit('D2 CSS marker missing')
s = s.replace(marker, css + '\n' + marker, 1)

# Insert selected-character dossier directly after the existing selector grid.
g = re.search(r'<div[^>]+id="characterGrid"[^>]*></div>', s)
if not g:
    raise SystemExit('characterGrid element not found')
extra = '\n<div class="charactersHint">ELEGÍ UNA IDENTIDAD PARA INGRESAR AL EXPEDIENTE.</div>\n<div id="characterDossierPreview" class="characterDossierPreview"></div>'
s = s[:g.end()] + extra + s[g.end():]

profile_match = re.search(r"const REV01_PROFILES=\[[^\]]+\];", s)
if not profile_match:
    raise SystemExit('REV01_PROFILES anchor missing')
portraits = 'const REV01_PORTRAITS=' + json.dumps(portrait_paths, ensure_ascii=False, separators=(',', ':')) + ';'
s = s[:profile_match.end()] + '\n' + portraits + s[profile_match.end():]

pattern = r"function buildCharacters\(\)\{[\s\S]*?\}\nfunction setEntryMode"
if not re.search(pattern, s):
    raise SystemExit('buildCharacters block not found')
replacement = '''function renderCharacterDossierPreview(){
 const i=selectedCharacter,name=P2_LABELS.characters[i],profile=REV01_PROFILES[i],img=REV01_PORTRAITS[i],fileId=P2_LABELS.characterIds[i];
 const el=$('#characterDossierPreview');if(!el)return;
 el.innerHTML=`<div class="characterPreviewGrid"><div class="characterPreviewPhoto"><img src="${esc(img)}" alt="Retrato de ${esc(name)}"><span class="characterPreviewNo">PERSONA ${String(i+1).padStart(2,'0')}</span></div><div class="characterPreviewCopy"><div class="characterPreviewEyebrow">EXPEDIENTES · CASO 001 · IDENTIDAD PÚBLICA</div><h3>${esc(name)}</h3><div class="characterPreviewRole">${esc(profile)}</div><div class="characterPreviewRule"></div><p>Ficha pública inicial. Los antecedentes, contradicciones y datos relevantes se revelarán únicamente durante la investigación.</p><div class="characterPreviewMeta"><span>${esc(fileId)}</span><span>ARCHIVO ABIERTO</span><span class="characterPreviewSelected">✓ PERSONA SELECCIONADA</span></div></div></div>`;
}
function buildCharacters(){
 $('#characterGrid').innerHTML=P2_LABELS.characters.map((name,i)=>`<button class="char dossierChar ${i===selectedCharacter?'selected':''}" data-char="${i}" aria-pressed="${i===selectedCharacter?'true':'false'}"><span class="portraitReal"><img src="${esc(REV01_PORTRAITS[i])}" alt="Retrato de ${esc(name)}"><em>PERSONA ${String(i+1).padStart(2,'0')}</em></span><span class="charMeta"><strong>${esc(name)}</strong><small>${esc(REV01_PROFILES[i])}</small><i>${P2_LABELS.characterIds[i]}</i><span class="fileState">ARCHIVO DISPONIBLE</span></span></button>`).join('');
 $('#characterGrid').querySelectorAll('[data-char]').forEach(b=>b.onclick=()=>{selectedCharacter=Number(b.dataset.char);buildCharacters()});
 renderCharacterDossierPreview();
}
function setEntryMode'''
s = re.sub(pattern, lambda _: replacement, s, count=1)
PAGE.write_text(s)

# D3 QA: six usable image assets, six referenced paths, required UI anchors, valid module JS.
for path in portrait_paths:
    f = Path('caso001-rev01') / path
    if not f.exists() or f.stat().st_size < 10000:
        raise SystemExit(f'asset QA failed: {path}')
    if path not in s:
        raise SystemExit(f'asset not referenced: {path}')
for token in ['P2.12D.3 · CHARACTER DOSSIERS', 'characterDossierPreview', 'REV01_PORTRAITS', 'renderCharacterDossierPreview']:
    if token not in s:
        raise SystemExit(f'missing D3 token: {token}')
module = re.search(r'<script type="module">(.*?)</script>', s, re.S)
if not module:
    raise SystemExit('module script not found')
code = re.sub(r"^import .*?;\s*", '', module.group(1), count=1, flags=re.S)
tmp = Path('/tmp/rev01-d3.js')
tmp.write_text(code)
subprocess.run(['node', '--check', str(tmp)], check=True)
print('P2.12D.3 QA PASS · 6/6 portraits · JS syntax PASS')
