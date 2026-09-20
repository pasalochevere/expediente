from pathlib import Path
import re
s=Path('caso001/printables/index.html').read_text()
start=s.find('const ART=')
if start<0: raise SystemExit('ART not found')
for needle in ['locations','objects','ART.locations','ART.objects']:
    print('===',needle,'===')
    hits=list(re.finditer(re.escape(needle),s[start:],re.I))
    print('COUNT',len(hits))
    for m in hits[:8]:
        pos=start+m.start()
        print('POS',pos,'SNIP',s[max(0,pos-160):pos+260].replace('\n',' ')[:420])
# Show tail around where portrait object closes.
end=s.find('\n};',start)
print('FIRST_CLOSE',end)
print('AFTER_CLOSE',s[max(start,end-250):end+500].replace('\n',' ') if end>=0 else '')