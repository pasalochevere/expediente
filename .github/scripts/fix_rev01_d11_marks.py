from pathlib import Path
p=Path('caso001-rev01/index.html')
s=p.read_text()
old="const theory=new Map();"
if old not in s:
    raise SystemExit('legacy theory marker missing')
new="""const MARKS_STORAGE_KEY='pc_exp_rev01_theory_v1';
function loadMarks(){try{const raw=JSON.parse(localStorage.getItem(MARKS_STORAGE_KEY)||'{}');return {suspects:raw?.suspects&&typeof raw.suspects==='object'?raw.suspects:{},locations:raw?.locations&&typeof raw.locations==='object'?raw.locations:{},objects:raw?.objects&&typeof raw.objects==='object'?raw.objects:{},motive:String(raw?.motive||'')}}catch{return {suspects:{},locations:{},objects:{},motive:''}}}
let marks=loadMarks();
function saveMarks(){try{localStorage.setItem(MARKS_STORAGE_KEY,JSON.stringify(marks))}catch{}}
function clearTheoryMarks(keepMotive=true){marks={suspects:{},locations:{},objects:{},motive:keepMotive?String(marks.motive||''):''};saveMarks();buildTheory()}"""
s=s.replace(old,new,1)
hook="$('#privacyToggle').onclick=()=>{privateInfoHidden=!privateInfoHidden;applyPrivateVisibility()};"
if hook not in s:
    raise SystemExit('privacy hook missing')
extra="""$('#clearMarks').onclick=()=>{clearTheoryMarks(true);toast('Marcas del tablero limpiadas.')};
$('#clearHistory').onclick=()=>{clearTheoryMarks(false);toast('Tablero e hipótesis local limpiados.')};"""
s=s.replace(hook,hook+'\n'+extra,1)
p.write_text(s)
print('D11 marks runtime fix applied')
