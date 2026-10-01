from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
PSQ=ROOT/'paper-squishy'
CSS='<link rel="stylesheet" href="./psq-i18n-v26.css?v=2600">'
JS='<script src="./psq-i18n-v26.js?v=2600"></script>'

def write_if_changed(path:Path, text:str):
    old=path.read_text(encoding='utf-8')
    if old!=text:
        path.write_text(text,encoding='utf-8')
        print('patched',path.relative_to(ROOT))
    else:
        print('unchanged',path.relative_to(ROOT))

def patch_static(name:str):
    p=PSQ/name
    s=p.read_text(encoding='utf-8')
    if 'psq-i18n-v26.css' not in s:
        s=s.replace('</head>',CSS+'\n</head>',1)
    if 'psq-i18n-v26.js' not in s:
        s=s.replace('</body>',JS+'\n</body>',1)
    write_if_changed(p,s)

patch_static('index.html')
patch_static('downloads.html')

p=PSQ/'factory.html'
s=p.read_text(encoding='utf-8')

loader_patch=""" const __psqLang=(()=>{try{const q=(new URL(location.href).searchParams.get('lang')||'').toLowerCase();if(q.startsWith('en'))return'en';if(q.startsWith('es'))return'es';const saved=(localStorage.getItem('psq_lang_v26')||'').toLowerCase();if(saved.startsWith('en'))return'en';if(saved.startsWith('es'))return'es';return String(navigator.language||'').toLowerCase().startsWith('en')?'en':'es'}catch{return'es'}})();
 document.documentElement.lang=__psqLang;
 if(__psqLang==='en'){const box=document.querySelector('.box');if(box){const ps=box.querySelectorAll('p');if(ps[0])ps[0].textContent='Opening the full factory · 50 characters · 5 collections · Creator Plus';if(ps[1])ps[1].textContent='Loading stable version…'}}
"""
if '__psqLang' not in s:
    s=s.replace('(async()=>{\n','(async()=>{\n'+loader_patch,1)

# Inject bilingual assets into the final document produced from the frozen core.
head_anchor="  html=html.replace('</head>',printCss+navCss+'</head>');"
if "psq-i18n-v26.css" not in s:
    s=s.replace(head_anchor,head_anchor+"\n  html=html.replace('</head>','"+CSS+"</head>');",1)

body_anchor="  document.open();document.write(html);document.close();"
if "psq-i18n-v26.js" not in s:
    s=s.replace(body_anchor,"  html=html.replace('</body>','<script src=\"./psq-i18n-v26.js?v=2600\"></scr'+'ipt></body>');\n"+body_anchor,1)

# Preserve selected language if the license gate sends the user back to the Portal.
if "portal-v2/?lang=" not in s:
    marker="  let html=new TextDecoder().decode(ab);"
    s=s.replace(marker,marker+"\n  html=html.replaceAll(\"location.replace('../portal-v2/')\",\"location.replace('../portal-v2/?lang="+"'+__psqLang+'"+"')\");",1)

write_if_changed(p,s)
