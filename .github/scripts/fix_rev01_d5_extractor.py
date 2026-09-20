from pathlib import Path
p=Path('.github/scripts/patch_rev01_d5.py')
s=p.read_text()
start=s.find('def section_start')
end=s.find("loc_names=['sala-estar'",start)
if start<0 or end<0: raise SystemExit('D5 extractor anchors not found')
new=r'''def extract_array(kind, next_kind=None):
    art=source.find('const ART=')
    if art<0: raise SystemExit('ART not found')
    m=re.search(r'\b'+re.escape(kind)+r'\s*:\s*\[',source[art:])
    if not m: raise SystemExit(f'{kind} array not found')
    pos=art+m.start()
    if next_kind:
        n=re.search(r'\b'+re.escape(next_kind)+r'\s*:\s*\[',source[pos+m.end()-m.start():])
        end=pos+(m.end()-m.start())+n.start() if n else min(len(source),pos+180000)
    else:
        close=source.find('\n};',pos)
        end=close if close>=0 else min(len(source),pos+180000)
    block=source[pos:end]
    rows=re.findall(r'[\'\"]data:image/([a-zA-Z0-9+.-]+);base64,([^\'\"]+)[\'\"]',block,re.S)
    if len(rows)<6: raise SystemExit(f'{kind}: expected at least 6 images, got {len(rows)}')
    return rows[:6]

locations=extract_array('locations','objects')
objects=extract_array('objects',None)

'''
s=s[:start]+new+s[end:]
old="s,n=old.subn(new,s,count=1)\nif n!=1: raise SystemExit(f'board HTML replacement failed ({n})')"
replacement="""board_probe=s.find('id=\"suspectChips\"')
if board_probe<0: raise SystemExit('suspectChips anchor not found')
board_start=s.rfind('<section',0,board_probe)
board_end=s.find('</section>',board_probe)
if board_start<0 or board_end<0: raise SystemExit('board section bounds not found')
board_end+=len('</section>')
s=s[:board_start]+new+s[board_end:]"""
if old not in s: raise SystemExit('D5 board substitution anchor not found')
s=s.replace(old,replacement,1)
p.write_text(s)
print('D5 extractor + board replacement hardened')