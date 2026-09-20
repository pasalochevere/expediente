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
for key in re.findall(r'\n\s*([A-Za-z_][A-Za-z0-9_]*)\s*:\s*\{',block)[:20]:
    pos=block.find(key+':{')
    if pos<0: pos=block.find(key+' :{')
    frag=block[pos:pos+500]
    print('KEY',key,'HEAD',frag[:180].replace('\n',' '))
# Count image data declarations grouped by area between top keys.
for m in re.finditer(r'\n\s*([A-Za-z_][A-Za-z0-9_]*)\s*:\s*\{',block):
    key=m.group(1); nxt=re.search(r'\n\s*[A-Za-z_][A-Za-z0-9_]*\s*:\s*\{',block[m.end():])
    e=m.end()+nxt.start() if nxt else len(block)
    part=block[m.end():e]
    imgs=re.findall(r'data:image/([a-zA-Z0-9+.-]+);base64,',part)
    print('COUNT',key,len(imgs),imgs[:8])