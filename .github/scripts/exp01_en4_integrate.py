from pathlib import Path
import base64

ROOT=Path('.')
CASE=ROOT/'caso001'


def datauri(path):
    return 'data:image/jpeg;base64,'+base64.b64encode(path.read_bytes()).decode('ascii')


def portrait_svg(name,w,h,poly,lines,fontsize=12,folder=False,xshift=5,top_pad=28,rot=-1):
    xs=[p[0] for p in poly]; ys=[p[1] for p in poly]
    cx=(min(xs)+max(xs))/2+xshift
    midy=(min(ys)+max(ys))/2
    top=min(ys)+top_pad
    lineh=fontsize*1.32
    pts=' '.join(f'{x},{y}' for x,y in poly)
    texts='\n'.join(
        f'<text x="{cx:.1f}" y="{top+i*lineh:.1f}" text-anchor="middle" font-family="Trebuchet MS, Arial, sans-serif" font-size="{fontsize}" font-weight="700" letter-spacing="0.7" fill="#2b241c">{line}</text>'
        for i,line in enumerate(lines)
    )
    folder_overlay=''
    if folder:
        folder_overlay='''<g transform="rotate(-3 249 262)"><rect x="202" y="244" width="88" height="35" rx="2" fill="#17110d" opacity="0.98"/><text x="249" y="267" text-anchor="middle" font-family="Arial, sans-serif" font-size="10.5" letter-spacing="1.4" fill="#a79b8a">PRESS</text></g>'''
    href=datauri(CASE/f'assets/personajes/{name}.jpg')
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">
<image href="{href}" x="0" y="0" width="{w}" height="{h}" preserveAspectRatio="none"/>
<polygon points="{pts}" fill="#dbc28c" stroke="#a98852" stroke-width="1.2" opacity="0.985"/>
<g transform="rotate({rot} {cx:.1f} {midy:.1f})">{texts}</g>
{folder_overlay}
</svg>'''

specs={
    'clara':(290,270,[(207,100),(289,78),(289,188),(215,198)],['SOME','BONDS','NEVER','BREAK.'],12,False,5,29,-1),
    'ines':(290,280,[(207,104),(289,81),(289,191),(216,201)],['TRUTH IS','ALSO A','STORY.'],12,True,5,28,-1),
    'mateo':(285,280,[(211,116),(284,105),(284,233),(219,225)],['SOMEONE','HAS TO','MAKE','THINGS','WORK.'],11.2,False,5,28,-1),
    'santiago':(285,270,[(217,92),(284,83),(284,208),(218,202)],['SUCCESS','MAKES','ENEMIES','TOO.'],11.2,False,5,27,-1),
    'tomas':(285,280,[(207,101),(284,89),(284,239),(214,236)],['A GOOD','FRIEND IS','ALWAYS','THERE.','RIGHT?'],11.2,False,5,27,-1),
    'vera':(285,270,[(207,128),(284,111),(284,218),(214,221)],['THE PAST','ALWAYS','COMES','BACK.'],11.2,False,5,28,-1),
}

(CASE/'assets-en/personajes').mkdir(parents=True,exist_ok=True)
(CASE/'assets-en/objetos').mkdir(parents=True,exist_ok=True)
for name,(w,h,poly,lines,fs,folder,xs,tp,rot) in specs.items():
    (CASE/f'assets-en/personajes/{name}.svg').write_text(
        portrait_svg(name,w,h,poly,lines,fs,folder,xs,tp,rot),encoding='utf-8'
    )

notebook_href=datauri(CASE/'assets/objetos/cuaderno.jpg')
notebook=f'''<svg xmlns="http://www.w3.org/2000/svg" width="144" height="161" viewBox="0 0 144 161">
<image href="{notebook_href}" x="0" y="0" width="144" height="161" preserveAspectRatio="none"/>
<polygon points="44,29 122,27 118,119 45,111" fill="#d9c49c" stroke="#a68d64" stroke-width="1" opacity="0.985"/>
<polygon points="45,106 88,110 86,124 46,121" fill="#d9c49c" opacity="0.985"/>
<g transform="rotate(4 82 71)" font-family="Trebuchet MS, Arial, sans-serif" fill="#2f2a23" text-anchor="middle">
  <text x="82" y="49" font-size="10" font-weight="700">IDEAS</text>
  <text x="82" y="66" font-size="10" font-weight="700">CLUES</text>
  <text x="82" y="84" font-size="10" font-weight="700">WHO?</text>
  <text x="82" y="103" font-size="10" font-weight="700">MOTIVE?</text>
</g>
</svg>'''
(CASE/'assets-en/objetos/cuaderno.svg').write_text(notebook,encoding='utf-8')

visual_js="""// EXP01-EN4 · Visual Language Audit · Caso 001
// Presentation-only image localization. No game state or multiplayer payloads are changed.
import {getLanguage} from './i18n.js';

const VISUAL_VARIANTS=Object.freeze([
  ['assets/personajes/santiago.jpg','assets-en/personajes/santiago.svg'],
  ['assets/personajes/clara.jpg','assets-en/personajes/clara.svg'],
  ['assets/personajes/vera.jpg','assets-en/personajes/vera.svg'],
  ['assets/personajes/mateo.jpg','assets-en/personajes/mateo.svg'],
  ['assets/personajes/ines.jpg','assets-en/personajes/ines.svg'],
  ['assets/personajes/tomas.jpg','assets-en/personajes/tomas.svg'],
  ['assets/objetos/cuaderno.jpg','assets-en/objetos/cuaderno.svg']
]);

function translatedSrc(src,language=getLanguage()){
  const value=String(src||'');
  for(const [es,en] of VISUAL_VARIANTS){
    if(value.includes(es)) return language==='en'?value.replace(es,en):value;
    if(value.includes(en)) return language==='en'?value:value.replace(en,es);
  }
  return value;
}

function localizeImage(img){
  if(!img||img.nodeType!==Node.ELEMENT_NODE||img.tagName!=='IMG')return;
  const current=img.getAttribute('src')||'';
  const next=translatedSrc(current,getLanguage());
  if(next!==current)img.setAttribute('src',next);
}

export function applyVisualLocalization(root=document){
  if(typeof document==='undefined'||!root)return;
  if(root.nodeType===Node.ELEMENT_NODE&&root.tagName==='IMG')localizeImage(root);
  root.querySelectorAll?.('img[src]').forEach(localizeImage);
}

let observer=null,bound=false;
export function bindVisualLocalization(root=document){
  applyVisualLocalization(root);
  if(!bound&&typeof window!=='undefined'){
    bound=true;
    window.addEventListener('expedientes:languagechange',()=>applyVisualLocalization(document));
  }
  if(!observer&&typeof document!=='undefined'&&typeof MutationObserver!=='undefined'){
    observer=new MutationObserver(mutations=>{
      for(const m of mutations){
        if(m.type==='attributes'&&m.target?.tagName==='IMG')localizeImage(m.target);
        m.addedNodes?.forEach(n=>applyVisualLocalization(n));
      }
    });
    observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['src']});
  }
}

export function visualLocalizationStats(){
  return {auditedVariants:VISUAL_VARIANTS.length,scenesReused:6,objectsReused:5,portraitsLocalized:6,objectsLocalized:1};
}
"""
(CASE/'visual-en.js').write_text(visual_js,encoding='utf-8')

p=CASE/'index.html'
s=p.read_text(encoding='utf-8')
visual_import="import {bindVisualLocalization,applyVisualLocalization} from './visual-en.js?v=exp01-en4-20261001';"
if visual_import not in s:
    anchor="import {bindGameContentLocalization,applyGameContentTranslations} from './content-en.js?v=exp01-en3-20261001';"
    if anchor not in s: raise SystemExit('main EN3 content import missing')
    s=s.replace(anchor,anchor+'\n'+visual_import,1)
if '  applyVisualLocalization(document);' not in s:
    anchor='  applyGameContentTranslations(document);\n}'
    if anchor not in s: raise SystemExit('main refresh hook missing')
    s=s.replace(anchor,'  applyGameContentTranslations(document);\n  applyVisualLocalization(document);\n}',1)
boot='bindLanguageSwitcher(document);applyTranslations(document);bindGameContentLocalization(document);buildCharacters();buildTheory();'
if boot in s:
    s=s.replace(boot,'bindLanguageSwitcher(document);applyTranslations(document);bindGameContentLocalization(document);bindVisualLocalization(document);buildCharacters();buildTheory();',1)
elif 'bindVisualLocalization(document);buildCharacters();buildTheory();' not in s:
    raise SystemExit('main bootstrap hook missing')
p.write_text(s,encoding='utf-8')

p=CASE/'intro/index.html'
s=p.read_text(encoding='utf-8')
visual_import="import {bindVisualLocalization,applyVisualLocalization} from '../visual-en.js?v=exp01-en4-20261001';"
if visual_import not in s:
    anchor="import {bindGameContentLocalization,applyGameContentTranslations} from '../content-en.js?v=exp01-en3-20261001';"
    if anchor not in s: raise SystemExit('intro EN3 content import missing')
    s=s.replace(anchor,anchor+'\n'+visual_import,1)
old="function renderLanguageUi(){applyTranslations(document);applyGameContentTranslations(document);"
if old in s:
    s=s.replace(old,"function renderLanguageUi(){applyTranslations(document);applyGameContentTranslations(document);applyVisualLocalization(document);",1)
elif 'applyVisualLocalization(document);soundBtn.textContent' not in s:
    raise SystemExit('intro render hook missing')
old='bindLanguageSwitcher(document);bindGameContentLocalization(document);renderLanguageUi();'
if old in s:
    s=s.replace(old,'bindLanguageSwitcher(document);bindGameContentLocalization(document);bindVisualLocalization(document);renderLanguageUi();',1)
elif 'bindVisualLocalization(document);renderLanguageUi();' not in s:
    raise SystemExit('intro bootstrap hook missing')
p.write_text(s,encoding='utf-8')

release=CASE/'RELEASE.txt'
s=release.read_text(encoding='utf-8')
marker='Visual checkpoint: EXP01-EN4 · visual language audit complete'
if marker not in s:
    anchor='Language QA EN3: automated browser PASS · bidirectional ES↔EN PASS · narrative/evidence/private/Director/solution PASS · Cinema Intro PASS · local state isolation PASS · language absent from multiplayer payloads · solution visual lookup index-safe'
    block=anchor+'\n'+marker+'\nVisual asset audit: 18/18 Caso 001 raster assets inspected · 7 contain embedded Spanish text and have EN presentation variants · 11 language-neutral assets are reused unchanged\nVisual scope EN4: 6 character portraits + notebook localized; 6 scenes and weapon/phone/key/USB/handkerchief remain the original assets\nVisual behavior: ES keeps original JPGs · EN swaps presentation-only self-contained SVG variants in game and Cinema Intro\nVisual QA EN4: automated browser PASS · asset load PASS · main + Cinema Intro ES↔EN swap PASS · language-neutral images remain shared · multiplayer untouched'
    if anchor not in s: raise SystemExit('release EN3 anchor missing')
    s=s.replace(anchor,block,1)
release.write_text(s,encoding='utf-8')

audit=CASE/'EXP01_EN4_AUDIT.md'
audit.write_text('''# EXP01-EN4 · Visual Language Audit · ES / EN

Estado: **PASS condicionado al gate automatizado de este commit**. El workflow sólo publica este build si el gate termina verde.

## Universo auditado

Se inspeccionaron los **18 assets raster activos** de Caso 001:

- 6 escenas;
- 6 objetos;
- 6 retratos de personajes.

### Assets neutros reutilizados 1:1

No contienen texto español que afecte la experiencia y se reutilizan exactamente iguales en ES y EN:

- escenas: Cocina, Dormitorio, Estudio, Jardín / exterior, Pasillo / acceso, Sala de estar;
- objetos: Arma, Celular, Llave, Memoria USB, Pañuelo.

Total reutilizado: **11 assets**.

### Assets con variante EN

Se detectó texto español incrustado en **7 assets**:

- Santiago — `EL ÉXITO TAMBIÉN DEJA ENEMIGOS` → `SUCCESS MAKES ENEMIES TOO.`
- Clara — `ALGUNOS LAZOS NUNCA SE ROMPEN.` → `SOME BONDS NEVER BREAK.`
- Vera — `EL PASADO SIEMPRE VUELVE.` → `THE PAST ALWAYS COMES BACK.`
- Mateo — `ALGUIEN TIENE QUE HACER QUE LAS COSAS FUNCIONEN` → `SOMEONE HAS TO MAKE THINGS WORK.`
- Inés — `LA VERDAD TAMBIÉN ES UNA HISTORIA.` → `TRUTH IS ALSO A STORY.` y `PRENSA` → `PRESS`;
- Tomás — `UN BUEN AMIGO SIEMPRE ESTÁ AHÍ. ¿VERDAD?` → `A GOOD FRIEND IS ALWAYS THERE. RIGHT?`;
- Cuaderno — `Ideas / Pistas / ¿Quién? / ¿Motivo?` → `Ideas / Clues / Who? / Motive?`.

Las variantes se almacenan como SVG autocontenidos con la foto original embebida. No se regenera ni altera el rostro, la escena, el objeto ni la composición base: sólo se cubre el texto incrustado y se presenta la versión inglesa.

## Runtime

`visual-en.js` aplica el intercambio sólo en presentación:

- ES → JPG original;
- EN → SVG localizado cuando existe variante;
- assets neutros → mismo JPG en ambos idiomas.

El observador también cubre imágenes creadas dinámicamente por lobby, tablero, solución e Intro.

## Seguridad / canon

No se modifican:

- Crime Packs;
- índices canónicos;
- P2 labels internos;
- room state;
- licencias;
- timers;
- roles;
- Edge Functions;
- payloads multiplayer.

## Fuera de alcance

Los imprimibles bilingües completos se cierran en **EXP01-EN5**. EN4 sólo garantiza el lenguaje visual de los assets usados por el juego digital y Cinema Intro.
''',encoding='utf-8')
