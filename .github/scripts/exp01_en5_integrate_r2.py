from pathlib import Path
import subprocess

subprocess.run(['python3','.github/scripts/exp01_en5_integrate.py'],check=True)

index=Path('caso001/printables/index.html')
s=index.read_text(encoding='utf-8')
fix='<script type="module" src="./i18n-en5-fix1.js?v=exp01-en5-fix1-20261001"></script>'
if fix not in s:
    main='<script type="module" src="./i18n-en5.js?v=exp01-en5-20261001"></script>'
    if main not in s: raise SystemExit('EN5 main runtime injection missing')
    s=s.replace(main,main+'\n'+fix,1)
index.write_text(s,encoding='utf-8')
