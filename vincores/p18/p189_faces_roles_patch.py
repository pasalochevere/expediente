from pathlib import Path
import re

js_path=Path('vincores/p18/p188.js')
css_path=Path('vincores/p18/p188.css')
idx_path=Path('vincores/index.html')
js=js_path.read_text(encoding='utf-8')
css=css_path.read_text(encoding='utf-8')
idx=idx_path.read_text(encoding='utf-8')

# Backups before P1.8.9
backups={
 Path('vincores/backups/P1.8.8_before_P1.8.9_FACES_V4.html'):idx,
 Path('vincores/backups/P1.8.8_before_P1.8.9_FACES_V4_p188.js'):js,
 Path('vincores/backups/P1.8.8_before_P1.8.9_FACES_V4_p188.css'):css,
}
for p,content in backups.items():
    if not p.exists():
        p.write_text(content,encoding='utf-8')

js=js.replace('/* VÍNCORES P1.8.8 · GUIADO POR CASO + OBSERVACIÓN ASISTIDA + CARAS V3 */','/* VÍNCORES P1.8.9 · CARAS V4 + ROLES VISUALES */',1)

role_block=r'''const ROLE_PRESETS={
 mujer:{label:'Mujer',preferredShape:'cylinder',defaultColor:'#d79aa3',eyes:'soft',brows:'soft',mouth:'soft',hair:'medium',faceScale:1.16,strokeWeightMode:'normal'},
 hombre:{label:'Hombre',preferredShape:'prism',defaultColor:'#d7c7aa',eyes:'neutral',brows:'straight',mouth:'neutral',hair:'short',faceScale:1.16,strokeWeightMode:'normal'},
 nina:{label:'Niña',preferredShape:'cylinder',defaultColor:'#ef9c6c',eyes:'soft',brows:'none',mouth:'soft',hair:'medium',faceScale:1.18,strokeWeightMode:'soft'},
 nino:{label:'Niño',preferredShape:'prism',defaultColor:'#9eb3d1',eyes:'neutral',brows:'none',mouth:'soft',hair:'short',faceScale:1.18,strokeWeightMode:'soft'},
 abuela:{label:'Abuela',preferredShape:'cylinder',defaultColor:'#bd91c9',eyes:'closed',brows:'raised',mouth:'soft',hair:'tied',faceScale:1.17,strokeWeightMode:'normal'},
 abuelo:{label:'Abuelo',preferredShape:'prism',defaultColor:'#d7c7aa',eyes:'closed',brows:'straight',mouth:'neutral',hair:'short',faceScale:1.17,strokeWeightMode:'normal'},
 neutro:{label:'Neutro',preferredShape:'cylinder',defaultColor:'#d7c7aa',eyes:'neutral',brows:'none',mouth:'neutral',hair:'none',faceScale:1.16,strokeWeightMode:'normal'}
};
const ROLE_LABEL_MAP={'mamá':'mujer','mama':'mujer','mujer':'mujer','papá':'hombre','papa':'hombre','hombre':'hombre','niña':'nina','nina':'nina','niño':'nino','nino':'nino','abuela':'abuela','abuelo':'abuelo','neutro':'neutro'};
function roleFromLabel(label){return ROLE_LABEL_MAP[String(label||'').trim().toLowerCase()]||null}
'''
if 'const ROLE_PRESETS=' not in js:
    js=js.replace('};\nlet C=', '};\n'+role_block+'let C=',1)

face_block=r'''function normalizeFaceMeta(m){
 if(!m)return m;
 const hairMap={bun:'tied',curly:'medium'};const eyeMap={open:'neutral'};const mouthMap={open:'neutral'};
 m.hair=hairMap[m.hair]||m.hair||'none';m.eyes=eyeMap[m.eyes]||m.eyes||'neutral';m.mouth=mouthMap[m.mouth]||m.mouth||'neutral';m.brows=m.brows||'soft';
 if(m.visualRole&&ROLE_PRESETS[m.visualRole]){const p=ROLE_PRESETS[m.visualRole];m.faceScale=Number(m.faceScale)||p.faceScale;m.strokeWeightMode=m.strokeWeightMode||p.strokeWeightMode}
 else{m.visualRole=m.visualRole||null;m.faceScale=Number(m.faceScale)||1.16;m.strokeWeightMode=m.strokeWeightMode||'normal'}
 return m
}
function v4FaceHTML(m){
 normalizeFaceMeta(m);
 const hair=esc(m.hair),eyes=esc(m.eyes),mouth=esc(m.mouth),brows=esc(m.brows),hc=esc(m.hairColor||'#654632');
 const role=esc(m.visualRole||'legacy'),scale=Math.max(1.08,Math.min(1.24,Number(m.faceScale)||1.16));
 return `<div class="p189-face-inner p189-role-${role}" style="--p189-scale:${scale};--p188-hair:${hc}"><div class="p188-hair ${hair}"></div><div class="p188-brows ${brows}"><i></i><i></i></div><div class="p188-eyes ${eyes}"><i></i><i></i></div><div class="p188-mouth ${mouth}"></div></div>`
}
try{faceHTML=v4FaceHTML}catch{}
'''
pat=r"function normalizeFaceMeta\(m\)\{.*?try\{faceHTML=v3FaceHTML\}catch\{\}"
js,n=re.subn(pat,face_block,js,count=1,flags=re.S)
if n!=1: raise SystemExit('face renderer replacement failed')

setup_block=r'''function setupFaceControls(){
 replaceSelect('hair',[['none','Sin pelo'],['short','Corto'],['medium','Medio'],['long','Largo'],['tied','Recogido']]);
 replaceSelect('eyes',[['neutral','Neutros'],['soft','Suaves'],['closed','Cerrados'],['side-left','Mirada izquierda'],['side-right','Mirada derecha'],['none','Sin ojos']]);
 replaceSelect('mouth',[['neutral','Neutra'],['soft','Suave'],['smile','Sonrisa leve'],['none','Sin boca']]);
 const hair=q('hair'),hairRow=hair?.closest('.row');
 if(hairRow&&q('p189RoleProp')==null){
  const prop=document.createElement('div');prop.className='prop p189-role-prop';prop.id='p189RoleProp';
  prop.innerHTML='<label>Rol visual</label><select id="p189Role"><option value="">Personalizado / escena antigua</option><option value="neutro">Neutro</option><option value="mujer">Mujer</option><option value="hombre">Hombre</option><option value="nina">Niña</option><option value="nino">Niño</option><option value="abuela">Abuela</option><option value="abuelo">Abuelo</option></select>';
  hairRow.before(prop);q('p189Role').onchange=e=>{if(e.target.value)applyVisualRole(e.target.value)}
 }
 const mouth=q('mouth');if(mouth&&q('p188Brows')==null){const row=mouth.closest('.row');const prop=document.createElement('div');prop.className='prop';prop.innerHTML='<label>Cejas</label><select id="p188Brows"><option value="none">Sin cejas</option><option value="soft" selected>Suaves</option><option value="raised">Elevadas</option><option value="straight">Rectas</option></select>';row?.after(prop);q('p188Brows').onchange=e=>{if(typeof selected==='undefined'||!selected)return;normalizeFaceMeta(selected._meta);selected._meta.brows=e.target.value;selected._meta.mode='character';if(q('mode'))q('mode').value='character';renderFigure(selected);commitHistory?.()}}
}
function facePresetFor'''
pat=r"function setupFaceControls\(\)\{.*?\n\}\nfunction facePresetFor"
js,n=re.subn(pat,setup_block,js,count=1,flags=re.S)
if n!=1: raise SystemExit('setupFaceControls replacement failed')

role_engine=r'''function applyRoleMeta(m,role){
 const p=ROLE_PRESETS[role];if(!m||!p)return false;
 Object.assign(m,{visualRole:role,shape:p.preferredShape,color:p.defaultColor,eyes:p.eyes,brows:p.brows,mouth:p.mouth,hair:p.hair,faceScale:p.faceScale,strokeWeightMode:p.strokeWeightMode,mode:'character'});return true
}
function syncFacePanel(m){
 if(!m)return;normalizeFaceMeta(m);if(q('p189Role'))q('p189Role').value=m.visualRole||'';if(q('hair'))q('hair').value=m.hair;if(q('eyes'))q('eyes').value=m.eyes;if(q('mouth'))q('mouth').value=m.mouth;if(q('p188Brows'))q('p188Brows').value=m.brows||'soft';if(q('mode'))q('mode').value=m.mode||'character'
}
function applyVisualRole(role,labelOverride=null){
 if(typeof selected==='undefined'||!selected||selected._meta?.kind!=='figure'||!ROLE_PRESETS[role])return;
 const m=selected._meta;if(labelOverride!==null)m.label=labelOverride;applyRoleMeta(m,role);renderFigure(selected);selectNode(selected);syncFacePanel(m);renderPalette?.();commitHistory?.()
}
function installRolePresetEngine(){
 try{
  const legacy=rolePreset;
  rolePreset=function(label,shape,hair){
   if(typeof selected==='undefined'||!selected)return;const role=roleFromLabel(label);
   if(role)return applyVisualRole(role,label);
   return legacy?.(label,shape,hair)
  };
  window.rolePreset=rolePreset
 }catch{}
}
'''
marker="try{\n const baseSelect=selectNode;"
if role_engine not in js:
    if marker not in js: raise SystemExit('role engine insert marker missing')
    js=js.replace(marker,role_engine+marker,1)

# Ensure selectNode syncs the new role selector.
old="if(q('p188Face'))q('p188Face').value=facePresetFor(n._meta)}return out}"
new="if(q('p188Face'))q('p188Face').value=facePresetFor(n._meta);if(q('p189Role'))q('p189Role').value=n._meta.visualRole||''}return out}"
if old in js: js=js.replace(old,new,1)
elif "if(q('p189Role'))" not in js: raise SystemExit('selectNode sync pattern missing')

js=js.replace('function init(){setupFaceControls();buildOverlays();installRelationResizeFix();','function init(){setupFaceControls();installRolePresetEngine();buildOverlays();installRelationResizeFix();',1)
js=js.replace('faceHTML:v3FaceHTML','faceHTML:v4FaceHTML,roles:ROLE_PRESETS',1)

css_add=r'''
/* P1.8.9 · CARAS V4 + ROLES VISUALES */
.mode-character .face{display:block;top:13px;width:44px;height:38px;opacity:.98;overflow:visible}
.p189-face-inner{position:absolute;inset:0;transform:translateY(-2px) scale(var(--p189-scale,1.16));transform-origin:50% 18%;--p189-ink:rgba(88,60,40,.82);--p189-ink-strong:rgba(82,54,34,.88);--p189-boost:0px}
.node[data-p18size="s"] .p189-face-inner{--p189-boost:.15px}
.p189-face-inner .p188-hair,.p189-face-inner .p188-brows,.p189-face-inner .p188-eyes,.p189-face-inner .p188-mouth{position:absolute;pointer-events:none}
.p189-face-inner .p188-hair{left:50%;top:-1px;transform:translateX(-50%);width:31px;height:13px;color:color-mix(in srgb,var(--p188-hair,#654632) 84%,transparent);display:none}
.p189-face-inner .p188-hair.short,.p189-face-inner .p188-hair.medium,.p189-face-inner .p188-hair.long,.p189-face-inner .p188-hair.tied{display:block}
.p189-face-inner .p188-hair.short{border-top:calc(2.1px + var(--p189-boost)) solid currentColor;border-radius:50% 50% 0 0}
.p189-face-inner .p188-hair.medium{width:32px;height:17px;border:calc(2.1px + var(--p189-boost)) solid currentColor;border-bottom:0;border-radius:50% 50% 36% 36%;opacity:.92}
.p189-face-inner .p188-hair.long{width:33px;height:22px;border-left:calc(2.1px + var(--p189-boost)) solid currentColor;border-right:calc(2.1px + var(--p189-boost)) solid currentColor;border-top:calc(2.1px + var(--p189-boost)) solid currentColor;border-radius:48% 48% 28% 28%;opacity:.9}
.p189-face-inner .p188-hair.tied{width:29px;height:14px;border-top:calc(2.1px + var(--p189-boost)) solid currentColor;border-radius:50%}
.p189-face-inner .p188-hair.tied:after{content:"";position:absolute;right:-3px;top:-1px;width:8px;height:8px;border:calc(2px + var(--p189-boost)) solid currentColor;border-radius:50%;background:transparent}
.p189-face-inner .p188-brows{left:7px;right:7px;top:10px;display:flex;justify-content:space-between}
.p189-face-inner .p188-brows i{display:block;width:8px;height:0;border-top:calc(2px + var(--p189-boost)) solid var(--p189-ink);border-radius:999px}
.p189-face-inner .p188-brows.none{display:none}.p189-face-inner .p188-brows.raised i:first-child{transform:rotate(-10deg) translateY(-1px)}.p189-face-inner .p188-brows.raised i:last-child{transform:rotate(10deg) translateY(-1px)}.p189-face-inner .p188-brows.straight i{border-radius:0}
.p189-face-inner .p188-eyes{left:8px;right:8px;top:19px;display:flex;justify-content:space-between}
.p189-face-inner .p188-eyes i{display:block;width:3.4px;height:3.4px;border-radius:50%;background:var(--p189-ink-strong)}
.p189-face-inner .p188-eyes.soft i{width:8px;height:0;border-top:calc(1.9px + var(--p189-boost)) solid var(--p189-ink);background:none;border-radius:999px}
.p189-face-inner .p188-eyes.closed i{width:8px;height:4px;border-bottom:calc(1.9px + var(--p189-boost)) solid var(--p189-ink);background:none;border-radius:0 0 55% 55%}
.p189-face-inner .p188-eyes.side-left i{transform:translateX(-1.7px)}.p189-face-inner .p188-eyes.side-right i{transform:translateX(1.7px)}.p189-face-inner .p188-eyes.none{display:none}
.p189-face-inner .p188-mouth{left:50%;top:30px;transform:translateX(-50%);width:11px;height:0;border-top:calc(1.8px + var(--p189-boost)) solid rgba(104,67,54,.84);border-radius:999px}
.p189-face-inner .p188-mouth.soft{height:5px;border-top:0;border-bottom:calc(1.8px + var(--p189-boost)) solid rgba(104,67,54,.82);border-radius:0 0 55% 55%}
.p189-face-inner .p188-mouth.smile{height:6px;width:12px;border-top:0;border-bottom:calc(1.9px + var(--p189-boost)) solid rgba(104,67,54,.84);border-radius:0 0 60% 60%}.p189-face-inner .p188-mouth.none{display:none}
/* Rol-specific microgeometry: distinction without caricature. */
.p189-role-nina .p188-hair.medium{width:30px;height:15px;border-radius:56% 56% 42% 42%}.p189-role-nina .p188-eyes{left:7px;right:7px}.p189-role-nina .p188-mouth{top:30px}
.p189-role-mujer .p188-hair.medium{height:19px;width:33px}.p189-role-mujer .p188-brows{top:9px}
.p189-role-abuela .p188-hair.tied{top:-2px;width:27px}.p189-role-abuela .p188-eyes{top:18px}.p189-role-abuela .p188-mouth{top:30px;width:10px}
.p189-role-nino .p188-hair.short{width:28px}.p189-role-nino .p188-eyes{left:7px;right:7px}
.p189-role-hombre .p188-hair.short{width:31px}.p189-role-hombre .p188-brows{top:9px}
.p189-role-abuelo .p188-hair.short{width:24px;opacity:.72}.p189-role-abuelo .p188-eyes{top:18px}.p189-role-abuelo .p188-brows{top:9px}
.p189-role-prop{border-top:1px solid #e4dcd2;padding-top:10px;margin-top:4px}
'''
if '/* P1.8.9 · CARAS V4 + ROLES VISUALES */' not in css: css += '\n'+css_add
css=css.replace('/* VÍNCORES P1.8.8 · GUIADO POR CASO + CARAS V3 */','/* VÍNCORES P1.8.9 · CARAS V4 + ROLES VISUALES */',1)

# Cache-bust assets.
idx=idx.replace('p18/p188.css?v=1883','p18/p188.css?v=1890')
idx=idx.replace('p18/p188.js?v=1883','p18/p188.js?v=1890')

js_path.write_text(js,encoding='utf-8')
css_path.write_text(css,encoding='utf-8')
idx_path.write_text(idx,encoding='utf-8')
print('P1.8.9 patch applied')
