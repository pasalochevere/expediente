from pathlib import Path
import re, base64

repo=Path('.')
source=(repo/'caso001/printables/index.html').read_text()
page=repo/'caso001-rev01/index.html'
s=page.read_text()

if 'P2.12D.5 · INVESTIGATION BOARD' in s:
    raise SystemExit('D5 already applied')

def section_start(text, names, start=0):
    hits=[]
    for name in names:
        p=text.find(name,start)
        if p>=0: hits.append((p,name))
    if not hits: return -1,None
    return min(hits)[0],min(hits)[1]

def extract_six(kind, next_names):
    if kind=='locations': names=['ART.locations={','ART.locations = {','locations:{','locations: {']
    else: names=['ART.objects={','ART.objects = {','objects:{','objects: {']
    pos,matched=section_start(source,names,source.find('const ART='))
    if pos<0: raise SystemExit(f'{kind} art section not found')
    ends=[]
    for n in next_names:
        q=source.find(n,pos+len(matched))
        if q>=0: ends.append(q)
    end=min(ends) if ends else min(len(source),pos+400000)
    block=source[pos:end]
    rows=re.findall(r"(\d+)\s*:\s*['\"]data:image/([a-zA-Z0-9+.-]+);base64,([^'\"]+)['\"]",block,re.S)
    # Preserve first value for each numeric key.
    found={}
    for idx,mime,b64 in rows:
        i=int(idx)
        if 0<=i<6 and i not in found: found[i]=(mime,b64)
    if len(found)!=6:
        raise SystemExit(f'{kind}: expected keys 0..5, got {sorted(found)} using marker {matched!r}')
    return [found[i] for i in range(6)]

locations=extract_six('locations',['ART.objects={','ART.objects = {','objects:{','objects: {','function artImg','function renderBase'])
objects=extract_six('objects',['function artImg','function renderBase','const pack','const $','document.addEventListener'])

loc_names=['sala-estar','cocina','estudio','dormitorio','jardin-exterior','pasillo-acceso']
obj_names=['arma','cuaderno','celular','llave','memoria-usb','panuelo']

def write_assets(rows,folder,names):
    out=repo/'caso001-rev01/assets'/folder
    out.mkdir(parents=True,exist_ok=True)
    paths=[]
    for (mime,b64),name in zip(rows,names):
        raw=base64.b64decode(b64)
        m=mime.lower()
        if m in ('jpeg','jpg'):
            ext='jpg'; valid=raw.startswith(b'\xff\xd8\xff')
        elif m=='png':
            ext='png'; valid=raw.startswith(b'\x89PNG\r\n\x1a\n')
        else:
            raise SystemExit(f'{folder}/{name}: unsupported mime {mime}')
        if not valid or len(raw)<5000:
            raise SystemExit(f'{folder}/{name}: invalid or too-small image ({len(raw)} bytes)')
        f=out/f'{name}.{ext}'
        f.write_bytes(raw)
        paths.append(f'assets/{folder}/{name}.{ext}')
        print(folder,name,mime,len(raw))
    return paths

loc_paths=write_assets(locations,'escenas',loc_names)
obj_paths=write_assets(objects,'objetos',obj_names)

css=r'''
/* P2.12D.5 · INVESTIGATION BOARD */
.investigationBoard{padding:0;overflow:hidden;border-radius:8px;border-color:#5c442d}.boardHead{display:flex;justify-content:space-between;gap:18px;align-items:flex-start;padding:18px 20px;border-bottom:1px solid #503923;background:linear-gradient(180deg,#191410,#0f0d0b)}.boardEyebrow{font-size:9px;letter-spacing:.19em;color:#a98659;font-weight:950}.boardHead h2{font-family:Georgia,serif;font-size:29px;margin:4px 0 4px}.boardHead p{margin:0;color:#aa9a88;font-size:12px;line-height:1.5}.boardLegend{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}.legendItem{border:1px solid #58432e;background:#13100d;padding:6px 8px;font-size:8px;letter-spacing:.08em;color:#ad9c88;white-space:nowrap}.legendItem.focus{border-color:#8d342e;color:#efb19f;background:#21100e}.legendItem.out{opacity:.58;text-decoration:line-through}.boardBody{padding:18px 20px 20px;background:radial-gradient(circle at 50% 0,rgba(93,61,36,.08),transparent 35%)}.theorySection{margin-top:18px}.theorySection:first-child{margin-top:0}.theoryTitle{display:flex;justify-content:space-between;gap:10px;align-items:end;border-bottom:1px solid #483522;padding-bottom:7px;margin-bottom:9px}.theoryTitle h3{margin:0!important;color:#d2a55e!important;font:900 11px/1 Inter,ui-sans-serif,system-ui!important;letter-spacing:.17em!important}.theoryTitle span{font-size:8px;letter-spacing:.1em;color:#756958}.theoryGrid{display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr));gap:8px!important}.theoryCard{position:relative;display:flex;flex-direction:column;padding:0!important;min-height:176px;border:1px solid #56412d!important;background:#100e0c!important;border-radius:4px!important;overflow:hidden;text-align:left;color:#eadfce!important;cursor:pointer;transition:.16s ease;box-shadow:0 7px 18px rgba(0,0,0,.2)}.theoryCard:hover{transform:translateY(-2px);border-color:#9a7244!important}.theoryThumb{height:105px;position:relative;overflow:hidden;background:#18140f;border-bottom:1px solid #4a3726}.theoryThumb img{width:100%;height:100%;object-fit:cover;display:block;filter:sepia(.08) saturate(.88) contrast(1.04)}.theoryCard.person .theoryThumb img{object-position:center 24%}.theoryThumb:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 50%,rgba(0,0,0,.6));pointer-events:none}.theoryCode{position:absolute;left:6px;top:6px;z-index:2;background:#100c09dc;border:1px solid #72583b;color:#e4c48b;padding:3px 5px;font:850 7px/1 ui-monospace,monospace;letter-spacing:.1em}.theoryCopy{padding:9px 9px 10px;min-height:70px;display:flex;flex-direction:column}.theoryCopy b{font-family:Georgia,serif;font-size:14px;line-height:1.05}.theoryState{display:flex;align-items:center;gap:5px;margin-top:auto;padding-top:8px;font-size:7px;letter-spacing:.08em;color:#8e806e;font-weight:900}.theoryState:before{content:"";width:6px;height:6px;border:1px solid #76624d;border-radius:50%;background:#201a14}.theoryCard.sus{border:2px solid #a63a31!important;background:#21110f!important;box-shadow:0 0 0 1px rgba(179,55,47,.18),0 8px 20px rgba(0,0,0,.28)}.theoryCard.sus .theoryThumb img{filter:sepia(.08) saturate(.95) contrast(1.06)}.theoryCard.sus .theoryState{color:#efaa98}.theoryCard.sus .theoryState:before{background:#b13b32;border-color:#d65d51;box-shadow:0 0 7px rgba(190,61,51,.55)}.theoryCard.sus:after{content:"EN FOCO";position:absolute;right:-19px;top:12px;transform:rotate(36deg);background:#8f2822;color:#fff0dd;padding:3px 23px;font-size:6px;letter-spacing:.08em;font-weight:950;z-index:3}.theoryCard.out{opacity:.44;border-style:dashed!important;filter:grayscale(.75)}.theoryCard.out .theoryCopy b{text-decoration:line-through}.theoryCard.out .theoryState{color:#847a70}.theoryCard.out .theoryState:before{border-radius:0;transform:rotate(45deg);background:#665c50}.motiveNotebook{margin-top:18px;display:grid;grid-template-columns:minmax(180px,.32fr) 1fr;border:1px solid #6c5237;background:linear-gradient(135deg,#d6bf9b,#b49369);color:#231a12;min-height:135px;box-shadow:0 10px 26px rgba(0,0,0,.22)}.motiveLabel{padding:17px;border-right:1px solid #846746;position:relative;overflow:hidden}.motiveLabel:after{content:"HIPÓTESIS";position:absolute;left:-8px;bottom:8px;font:900 26px/1 Impact,'Arial Narrow',sans-serif;color:rgba(109,35,30,.08);letter-spacing:.04em}.motiveLabel small{display:block;color:#70231f;font-size:8px;letter-spacing:.15em;font-weight:950}.motiveLabel b{display:block;font-family:Georgia,serif;font-size:20px;margin-top:5px}.motiveLabel p{font-size:10px;line-height:1.45;margin:8px 0 0;color:#54402e}.motiveNotebook textarea{border:0!important;border-radius:0!important;background:repeating-linear-gradient(180deg,transparent 0 27px,rgba(72,50,30,.16) 27px 28px)!important;color:#2a2018!important;padding:17px 18px!important;min-height:135px!important;resize:vertical;font-family:Georgia,serif!important;font-size:14px!important;line-height:28px!important;outline:none}.boardActions{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.boardActions .btn{font-size:10px}.boardTip{font-size:9px;color:#867765;margin-top:10px;letter-spacing:.03em}
@media(max-width:1100px){.theoryGrid{grid-template-columns:repeat(3,minmax(0,1fr))}.theoryCard{min-height:185px}.theoryThumb{height:118px}}
@media(max-width:700px){.boardHead{display:grid}.boardLegend{justify-content:flex-start}.boardBody{padding:14px}.theoryGrid{grid-template-columns:repeat(2,minmax(0,1fr))}.theoryThumb{height:124px}.motiveNotebook{grid-template-columns:1fr}.motiveLabel{border-right:0;border-bottom:1px solid #846746}.boardHead{padding:15px}.boardHead h2{font-size:24px}}
@media(max-width:410px){.theoryGrid{grid-template-columns:1fr 1fr;gap:6px!important}.theoryCard{min-height:163px}.theoryThumb{height:98px}.theoryCopy b{font-size:13px}.theoryCopy{padding:8px}}
'''
anchor='/* P2.12D.4 · LOBBY VISUAL + QR + WHATSAPP */'
if anchor not in s: raise SystemExit('D4 CSS marker missing')
s=s.replace(anchor,css+'\n'+anchor,1)

old=re.compile(r'<section class="panel board">\s*<h2 style="margin-top:0">Tablero de investigación</h2>[\s\S]*?<button id="clearHistory" class="btn">LIMPIAR HISTORIAL</button>\s*</div>\s*</section>')
new='''<section class="panel board investigationBoard">
  <div class="boardHead"><div><div class="boardEyebrow">EXPEDIENTES · CASO 001 · MESA DE HIPÓTESIS</div><h2>Tablero de investigación</h2><p>Tocá cada ficha para clasificarla. Tus marcas son privadas y quedan guardadas en este dispositivo.</p></div><div class="boardLegend"><span class="legendItem">○ ARCHIVO ABIERTO</span><span class="legendItem focus">● EN FOCO</span><span class="legendItem out">× DESCARTADO</span></div></div>
  <div class="boardBody">
    <section class="theorySection"><div class="theoryTitle"><h3>PERSONAS</h3><span>¿QUIÉN?</span></div><div id="suspectChips" class="chips theoryGrid"></div></section>
    <section class="theorySection"><div class="theoryTitle"><h3>ESCENARIOS</h3><span>¿DÓNDE?</span></div><div id="locationChips" class="chips theoryGrid"></div></section>
    <section class="theorySection"><div class="theoryTitle"><h3>OBJETOS</h3><span>¿CON QUÉ ELEMENTO?</span></div><div id="objectChips" class="chips theoryGrid"></div></section>
    <div class="motiveNotebook"><div class="motiveLabel"><small>EJE 04 · MOTIVO</small><b>Hipótesis causal</b><p>Anotá por qué creés que ocurrió. Es una nota privada: no modifica la solución del servidor.</p></div><textarea id="motiveTheory" maxlength="800" placeholder="Escribí tu hipótesis de motivo, contradicciones o conexión entre evidencias…"></textarea></div>
    <div class="boardActions"><button id="clearMarks" class="btn">LIMPIAR MARCAS</button><button id="clearHistory" class="btn">LIMPIAR HISTORIAL</button></div>
    <div class="boardTip">Ciclo de cada ficha: archivo abierto → en foco → descartado → archivo abierto.</div>
  </div>
</section>'''
s,n=old.subn(new,s,count=1)
if n!=1: raise SystemExit(f'board HTML replacement failed ({n})')

portrait_anchor=re.search(r"const REV01_PORTRAITS=\[[^\]]+\];",s)
if not portrait_anchor: raise SystemExit('REV01_PORTRAITS missing')
loc_js='const REV01_LOCATION_IMAGES='+repr(loc_paths).replace('"',"'")+';'
obj_js='const REV01_OBJECT_IMAGES='+repr(obj_paths).replace('"',"'")+';'
visual_codes="const REV01_THEORY_CODES={suspects:['P1','P2','P3','P4','P5','P6'],locations:['L1','L2','L3','L4','L5','L6'],objects:['O1','O2','O3','O4','O5','O6']};"
s=s[:portrait_anchor.end()]+'\n'+loc_js+'\n'+obj_js+'\n'+visual_codes+s[portrait_anchor.end():]

pat=re.compile(r"function buildTheory\(\)\{[\s\S]*?\}\nfunction ",re.M)
m=pat.search(s)
if not m: raise SystemExit('buildTheory block not found')
next_func=m.group(0)[m.group(0).rfind('\nfunction ')+1:]
# Keep the following function declaration by appending it back.
replacement=r'''function buildTheory(){
 const cfg={
  suspects:{labels:P2_LABELS.characters,target:'#suspectChips',images:REV01_PORTRAITS,kind:'person'},
  locations:{labels:P2_LABELS.locations,target:'#locationChips',images:REV01_LOCATION_IMAGES,kind:'location'},
  objects:{labels:P2_LABELS.objects,target:'#objectChips',images:REV01_OBJECT_IMAGES,kind:'object'}
 };
 Object.entries(cfg).forEach(([key,c])=>{$(c.target).innerHTML=c.labels.map((label,i)=>{const state=Number(marks?.[key]?.[i]||0),stateClass=state===1?'sus':state===2?'out':'',stateText=state===1?'EN FOCO':state===2?'DESCARTADO':'ARCHIVO ABIERTO',code=REV01_THEORY_CODES[key][i];return `<button class="chip theoryCard ${c.kind} ${stateClass}" data-k="${key}" data-i="${i}" aria-label="${esc(label)} · ${stateText}"><span class="theoryThumb"><img src="${esc(c.images[i])}" alt="${esc(label)}"><span class="theoryCode">${esc(code)}</span></span><span class="theoryCopy"><b>${esc(label)}</b><span class="theoryState">${stateText}</span></span></button>`}).join('')});
 document.querySelectorAll('.theoryCard[data-k]').forEach(b=>b.onclick=()=>{const k=b.dataset.k,i=Number(b.dataset.i);if(!marks[k]||typeof marks[k]!=='object')marks[k]={};marks[k][i]=((Number(marks[k][i])||0)+1)%3;saveMarks();buildTheory()});
 const motive=$('#motiveTheory');if(motive){motive.value=String(marks.motive||'');motive.oninput=()=>{marks.motive=motive.value;saveMarks()}}
}
'''+next_func
s=s[:m.start()]+replacement+s[m.end():]

page.write_text(s)
print('P2.12D.5 patch complete')
