from pathlib import Path
import re
s=Path('caso001/printables/index.html').read_text()
start=s.find('const ART=')
if start<0: raise SystemExit('ART not found')
end=s.find('\n};',start)
if end<0: end=min(len(s),start+500000)
block=s[start:end+3]
print('ART_LEN',len(block))
print('TOP_KEYS',re.findall(r'\n\s*([A-Za-z_][A-Za-z0-9_]*)\s*:\s*\{',block)[:20])
idx=re.findall(r'(\d+)\s*:\s*[\'\"]data:image/([a-zA-Z0-9+.-]+);base64,',block)
print('IMAGE_INDEXES',idx)
rest=s[end+3:]
uses=[]
for m in re.finditer(r'ART(?:\.[A-Za-z_][A-Za-z0-9_]*)?(?:\[[^\]]+\])?',rest):
    val=m.group(0)
    if val not in uses: uses.append(val)
print('ART_USES',uses[:50])
for needle in ['portrait','scene','location','object','symbol']:
    print('---',needle,'---')
    for m in list(re.finditer(needle,rest,re.I))[:8]:
        print(rest[max(0,m.start()-120):m.start()+220].replace('\n',' ')[:340])