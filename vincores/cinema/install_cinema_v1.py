from pathlib import Path

idx=Path('vincores/index.html')
text=idx.read_text(encoding='utf-8')
backup=Path('vincores/backups/P1.8.9_before_CINEMA_ENGINE_V1.html')
if not backup.exists():
    backup.write_text(text,encoding='utf-8')

css='<link rel="stylesheet" href="cinema/cinema.css?v=1900">'
js='<script src="cinema/cinema.js?v=1900"></script>'
if css not in text:
    text=text.replace('</head>',css+'\n</head>',1)
if js not in text:
    text=text.replace('</body>',js+'\n</body>',1)
text=text.replace('<!-- VÍNCORES P1.8 · PREMIUM GUIDED FIELD · SELL READY -->','<!-- VÍNCORES P1.9 · CINEMA ENGINE V1 + PREMIUM GUIDED FIELD · SELL READY -->',1)
idx.write_text(text,encoding='utf-8')

release=Path('vincores/rc/p1-8/.release')
if release.exists():
    r=release.read_text(encoding='utf-8')
    marker='P1.9.0 · CINEMA ENGINE V1\n'
    if marker not in r:
        r += '\n'+marker+'Cinematic intro: 8 scenes · first-access autoplay · replay from Presentación · real product imagery + live digital field\n'
        release.write_text(r,encoding='utf-8')
print('cinema installed')