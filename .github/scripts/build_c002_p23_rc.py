from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor, black, white, Color
from reportlab.lib.units import mm

ROOT=Path('.')
OUT=ROOT/'caso002'/'printables'
OUT.mkdir(parents=True,exist_ok=True)
W,H=A4

CHARACTERS=[
 ('P01','Alma Salvatierra','Restauradora','El pasado siempre deja huellas.'),
 ('P02','Bruno Ferrer','Ilusionista','Nada es lo que parece.'),
 ('P03','Celeste Vidal','Periodista','Las preguntas también revelan.'),
 ('P04','Damián Orsini','Arquitecto','Todo edificio esconde una verdad.'),
 ('P05','Eva Montenegro','Escritora / Médium','Hay silencios que hablan.'),
 ('P06','Franco Valdés','Heredero','Algunas herencias son una condena.'),
]
LOCATIONS=[('L01','Vestíbulo'),('L02','Salón de baile'),('L03','Archivo subterráneo'),('L04','Habitación 216'),('L05','Sala de máquinas'),('L06','Pasillo del tercer piso')]
OBJECTS=[('O01','Llave 317'),('O02','Reloj detenido'),('O03','Cinta de casete'),('O04','Plano quemado'),('O05','Cámara Polaroid'),('O06','Medallón de plata')]
TIMELINE=[
 ('05%','La caja de León'),('20%','Registro de 1968'),('35%','Anomalía arquitectónica'),('48%','Habitación 317'),
 ('57%','Cinta · Fragmento 01'),('70%','El apagón fue manual'),('82%','Polaroid 03:12'),('96%','Preparar acusación')]

GOLD=HexColor('#9a6e36'); INK=HexColor('#201b18'); MUTED=HexColor('#6d6259'); PALE=HexColor('#f4efe7'); LINE=HexColor('#b8aa99')

def palette(bn):
    if bn: return (black, Color(.35,.35,.35), Color(.94,.94,.94), Color(.7,.7,.7))
    return (INK, GOLD, PALE, LINE)

def header(c,title,bn=False,sub='KIT IMPRIMIBLE · CASO 002'):
    ink,accent,pale,line=palette(bn)
    c.setFillColor(ink); c.setFont('Helvetica-Bold',8); c.drawString(16*mm,H-14*mm,'EXPEDIENTES · HOTEL ORFEO')
    c.setFillColor(accent); c.setFont('Helvetica-Bold',7); c.drawRightString(W-16*mm,H-14*mm,sub)
    c.setStrokeColor(line); c.line(16*mm,H-18*mm,W-16*mm,H-18*mm)
    c.setFillColor(ink); c.setFont('Times-Bold',22); c.drawString(16*mm,H-29*mm,title)

def footer(c,page,bn=False):
    ink,accent,pale,line=palette(bn)
    c.setStrokeColor(line); c.line(16*mm,13*mm,W-16*mm,13*mm)
    c.setFillColor(MUTED if not bn else Color(.4,.4,.4)); c.setFont('Helvetica',6.8)
    c.drawString(16*mm,8.5*mm,'PasaloChevere · material complementario · la solución real se gestiona dentro del juego digital')
    c.drawRightString(W-16*mm,8.5*mm,f'{page:02d}')

def door(c,x,y,w,h,bn=False,label='317'):
    ink,accent,pale,line=palette(bn)
    c.setFillColor(ink); c.roundRect(x,y,w,h,3*mm,fill=1,stroke=0)
    c.setStrokeColor(accent); c.setLineWidth(2); c.roundRect(x+4*mm,y+4*mm,w-8*mm,h-8*mm,2*mm,fill=0,stroke=1)
    c.setFillColor(pale); c.setFont('Times-Bold',30); c.drawCentredString(x+w/2,y+h*0.58,label)
    c.setFillColor(accent); c.circle(x+w*0.78,y+h*0.48,1.6*mm,fill=1,stroke=0)

def card(c,x,y,w,h,code,title,subtitle='',quote='',kind='person',bn=False):
    ink,accent,pale,line=palette(bn)
    c.setFillColor(pale); c.setStrokeColor(line); c.setLineWidth(.8); c.roundRect(x,y,w,h,3*mm,fill=1,stroke=1)
    c.setFillColor(ink); c.setFont('Helvetica-Bold',7); c.drawString(x+5*mm,y+h-8*mm,code)
    # simple visible illustration
    c.setStrokeColor(accent); c.setFillColor(white if not bn else Color(.98,.98,.98))
    cx=x+w/2; cy=y+h-28*mm
    if kind=='person':
        c.circle(cx,cy+6*mm,7*mm,fill=0,stroke=1); c.roundRect(cx-12*mm,cy-14*mm,24*mm,16*mm,5*mm,fill=0,stroke=1)
    elif kind=='location':
        c.rect(cx-15*mm,cy-10*mm,30*mm,22*mm,fill=0,stroke=1); c.line(cx-10*mm,cy-10*mm,cx-10*mm,cy+12*mm); c.line(cx,cy-10*mm,cx,cy+12*mm); c.line(cx+10*mm,cy-10*mm,cx+10*mm,cy+12*mm)
    else:
        if 'Llave' in title:
            c.circle(cx-8*mm,cy+2*mm,5*mm,fill=0,stroke=1); c.line(cx-3*mm,cy+2*mm,cx+13*mm,cy+2*mm); c.line(cx+8*mm,cy+2*mm,cx+8*mm,cy-4*mm)
        elif 'Reloj' in title:
            c.circle(cx,cy,11*mm,fill=0,stroke=1); c.line(cx,cy,cx,cy+7*mm); c.line(cx,cy,cx+6*mm,cy-3*mm)
        elif 'Cinta' in title:
            c.roundRect(cx-15*mm,cy-8*mm,30*mm,16*mm,2*mm,fill=0,stroke=1); c.circle(cx-8*mm,cy,4*mm,fill=0,stroke=1); c.circle(cx+8*mm,cy,4*mm,fill=0,stroke=1)
        elif 'Plano' in title:
            c.rect(cx-14*mm,cy-10*mm,28*mm,20*mm,fill=0,stroke=1); c.line(cx-8*mm,cy-6*mm,cx+9*mm,cy+6*mm); c.line(cx-10*mm,cy+4*mm,cx+5*mm,cy-5*mm)
        elif 'Cámara' in title:
            c.roundRect(cx-15*mm,cy-8*mm,30*mm,16*mm,2*mm,fill=0,stroke=1); c.circle(cx,cy,6*mm,fill=0,stroke=1); c.rect(cx-8*mm,cy+8*mm,10*mm,4*mm,fill=0,stroke=1)
        else:
            c.circle(cx,cy,11*mm,fill=0,stroke=1); c.circle(cx,cy,5*mm,fill=0,stroke=1)
    c.setFillColor(ink); c.setFont('Times-Bold',12); c.drawCentredString(cx,y+19*mm,title)
    if subtitle:
        c.setFillColor(accent); c.setFont('Helvetica-Bold',7); c.drawCentredString(cx,y+14*mm,subtitle)
    if quote:
        c.setFillColor(MUTED if not bn else Color(.35,.35,.35)); c.setFont('Helvetica-Oblique',6.6); c.drawCentredString(cx,y+8*mm,quote[:48])

def build_pdf(path,bn=False):
    c=canvas.Canvas(str(path),pagesize=A4)
    # 1 cover
    ink,accent,pale,line=palette(bn)
    c.setFillColor(pale); c.rect(0,0,W,H,fill=1,stroke=0)
    door(c,W/2-34*mm,H/2-58*mm,68*mm,112*mm,bn)
    c.setFillColor(accent); c.setFont('Helvetica-Bold',8); c.drawCentredString(W/2,H-30*mm,'EXPEDIENTES · CASO 002')
    c.setFillColor(ink); c.setFont('Times-Bold',28); c.drawCentredString(W/2,H-44*mm,'LA HABITACIÓN QUE NO EXISTE')
    c.setFont('Helvetica-Bold',11); c.drawCentredString(W/2,25*mm,'KIT IMPRIMIBLE · HOTEL ORFEO · 1998')
    c.setFont('Helvetica',7); c.drawCentredString(W/2,18*mm,'Complemento para la experiencia digital de 3 jugadores')
    footer(c,1,bn); c.showPage()
    # 2 guide
    header(c,'Cómo usar este kit',bn); y=H-43*mm
    steps=[('1','Cada jugador abre el juego digital en su dispositivo.'),('2','Usen estas hojas para tachar sospechosos, lugares y objetos.'),('3','No miren una solución física: la combinación queda congelada en ENGINE P2.'),('4','Cuando se desbloquee la Habitación 317, usen la hoja especial.'),('5','Al final, completen la acusación PERSONA + LUGAR + OBJETO y confírmenla en pantalla.')]
    for n,t in steps:
        c.setFillColor(accent); c.circle(23*mm,y+1*mm,5*mm,fill=1,stroke=0); c.setFillColor(white if not bn else white); c.setFont('Helvetica-Bold',8); c.drawCentredString(23*mm,y-1.5*mm,n)
        c.setFillColor(ink); c.setFont('Helvetica',9); c.drawString(33*mm,y-2*mm,t); y-=18*mm
    c.setFillColor(pale); c.setStrokeColor(line); c.roundRect(16*mm,35*mm,W-32*mm,42*mm,3*mm,fill=1,stroke=1)
    c.setFillColor(ink); c.setFont('Times-Bold',14); c.drawString(23*mm,65*mm,'Regla de oro')
    c.setFont('Helvetica',8); c.drawString(23*mm,56*mm,'Este material acompaña la investigación; no sustituye el reloj, los eventos privados ni la solución del servidor.')
    c.drawString(23*mm,48*mm,'No compartan la pantalla privada de cada jugador en Modo Impostor.')
    footer(c,2,bn); c.showPage()
    # 3 board
    header(c,'Tablero de investigación',bn); cols=[('PERSONAS',CHARACTERS),('LUGARES',LOCATIONS),('OBJETOS',OBJECTS)]; colw=(W-36*mm)/3
    for ci,(label,arr) in enumerate(cols):
        x=16*mm+ci*colw; c.setFillColor(accent); c.setFont('Helvetica-Bold',8); c.drawString(x,H-43*mm,label)
        yy=H-53*mm
        for item in arr:
            code,name=item[0],item[1]; c.setStrokeColor(line); c.rect(x,yy-3*mm,5*mm,5*mm,fill=0,stroke=1)
            c.setFillColor(ink); c.setFont('Helvetica-Bold',7); c.drawString(x+8*mm,yy,code)
            c.setFont('Helvetica',7.5); c.drawString(x+22*mm,yy,name); yy-=15*mm
    c.setFillColor(ink); c.setFont('Helvetica-Bold',8); c.drawString(16*mm,65*mm,'NOTAS / CONTRADICCIONES')
    c.setStrokeColor(line)
    for i in range(6): c.line(16*mm,57*mm-i*8*mm,W-16*mm,57*mm-i*8*mm)
    footer(c,3,bn); c.showPage()
    # 4 characters
    header(c,'Mazo · Personas',bn); cw=(W-38*mm)/3; ch=92*mm
    for i,(code,name,role,quote) in enumerate(CHARACTERS):
        row=i//3; col=i%3; x=16*mm+col*(cw+3*mm); y=H-42*mm-(row+1)*ch-row*4*mm
        card(c,x,y,cw,ch,code,name,role,quote,'person',bn)
    footer(c,4,bn); c.showPage()
    # 5 locations
    header(c,'Mazo · Lugares',bn); cw=(W-38*mm)/3; ch=92*mm
    for i,(code,name) in enumerate(LOCATIONS):
        row=i//3; col=i%3; x=16*mm+col*(cw+3*mm); y=H-42*mm-(row+1)*ch-row*4*mm
        card(c,x,y,cw,ch,code,name,'HOTEL ORFEO','','location',bn)
    footer(c,5,bn); c.showPage()
    # 6 objects
    header(c,'Mazo · Objetos',bn); cw=(W-38*mm)/3; ch=92*mm
    for i,(code,name) in enumerate(OBJECTS):
        row=i//3; col=i%3; x=16*mm+col*(cw+3*mm); y=H-42*mm-(row+1)*ch-row*4*mm
        card(c,x,y,cw,ch,code,name,'EVIDENCIA','','object',bn)
    footer(c,6,bn); c.showPage()
    # 7 room 317 timeline
    header(c,'Habitación 317 · hoja especial',bn); door(c,16*mm,H-134*mm,54*mm,86*mm,bn)
    c.setFillColor(ink); c.setFont('Helvetica',8); c.drawString(78*mm,H-50*mm,'Se habilita sólo cuando la Central confirma la anomalía arquitectónica.')
    c.drawString(78*mm,H-60*mm,'No forma parte de los seis lugares del random normal.')
    c.setFont('Helvetica-Bold',8); c.drawString(78*mm,H-78*mm,'HITOS DE REFERENCIA')
    yy=H-90*mm
    for pct,title in TIMELINE:
        c.setFillColor(accent); c.setFont('Helvetica-Bold',7); c.drawString(78*mm,yy,pct)
        c.setFillColor(ink); c.setFont('Helvetica',7.5); c.drawString(96*mm,yy,title); yy-=12*mm
    c.setFont('Helvetica-Bold',8); c.drawString(16*mm,82*mm,'NOTAS SOBRE 317')
    c.setStrokeColor(line)
    for i in range(7): c.line(16*mm,74*mm-i*8*mm,W-16*mm,74*mm-i*8*mm)
    footer(c,7,bn); c.showPage()
    # 8 accusation
    header(c,'Acusación final',bn); c.setFillColor(ink); c.setFont('Helvetica',9); c.drawString(16*mm,H-44*mm,'Cierren una única teoría y confírmenla en la pantalla del host.')
    boxes=[('PERSONA','P__'),('LUGAR','L__'),('OBJETO','O__')]
    yy=H-80*mm
    for label,code in boxes:
        c.setFillColor(pale); c.setStrokeColor(line); c.roundRect(20*mm,yy, W-40*mm,30*mm,3*mm,fill=1,stroke=1)
        c.setFillColor(accent); c.setFont('Helvetica-Bold',8); c.drawString(27*mm,yy+19*mm,label)
        c.setFillColor(ink); c.setFont('Times-Bold',16); c.drawString(60*mm,yy+15*mm,'________________________________________')
        c.setFont('Helvetica-Bold',9); c.drawRightString(W-28*mm,yy+16*mm,code)
        yy-=43*mm
    c.setFont('Helvetica-Bold',8); c.drawString(16*mm,70*mm,'ARGUMENTO FINAL / EVIDENCIAS QUE LO SOSTIENEN')
    c.setStrokeColor(line)
    for i in range(6): c.line(16*mm,62*mm-i*8*mm,W-16*mm,62*mm-i*8*mm)
    footer(c,8,bn); c.save()

def build_html():
    html='''<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Kit imprimible · Caso 002 · Hotel Orfeo</title><style>
    :root{--bg:#090a0b;--panel:#15120f;--ink:#f3e8d8;--muted:#a99b8a;--gold:#b9874b;--line:#4c3a2a}*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at 50% 0,#2b1e13,#090a0b 42%);color:var(--ink);font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial}.wrap{max-width:920px;margin:auto;padding:28px}.hero{border:1px solid var(--line);border-radius:22px;background:linear-gradient(145deg,#1c1510,#0d0c0b);padding:30px;box-shadow:0 28px 80px #0009}.ey{color:var(--gold);font-weight:900;letter-spacing:.16em;font-size:.72rem}.hero h1{font:900 clamp(2.2rem,7vw,4.5rem)/.95 Georgia,serif;margin:10px 0}.hero p,.note{color:var(--muted);line-height:1.55}.grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:18px}.card{border:1px solid var(--line);border-radius:16px;background:#100e0c;padding:18px}.card h2{font-family:Georgia,serif;margin:0 0 8px}.btn{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:12px 16px;margin-top:10px;border:1px solid #76583a;border-radius:11px;background:#21180f;color:white;text-decoration:none;font-weight:900}.btn.primary{background:linear-gradient(135deg,#8d3029,#5a1714);border-color:#a94038}.meta{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.pill{border:1px solid #4c3a2a;border-radius:999px;padding:6px 9px;color:#c7b9a8;font-size:.72rem}@media(max-width:700px){.grid{grid-template-columns:1fr}.wrap{padding:16px}.hero{padding:20px}}</style></head><body><main class="wrap"><section class="hero"><div class="ey">EXPEDIENTES · CASO 002</div><h1>Kit imprimible<br>Hotel Orfeo</h1><p>Material complementario para <b>La Habitación que No Existe</b>. Incluye tablero de investigación, mazo de personas/lugares/objetos, hoja especial 317 y acusación final.</p><div class="meta"><span class="pill">A4</span><span class="pill">8 páginas</span><span class="pill">COLOR + B/N</span><span class="pill">3 jugadores</span></div><div class="grid"><article class="card"><h2>Versión COLOR</h2><p class="note">Para impresión color o para guardar como copia digital.</p><a class="btn primary" href="Kit_Imprimible_Caso_002_COLOR.pdf" target="_blank">ABRIR PDF COLOR</a></article><article class="card"><h2>Versión B/N</h2><p class="note">Optimizada para impresoras domésticas y menor consumo de tinta.</p><a class="btn" href="Kit_Imprimible_Caso_002_BN.pdf" target="_blank">ABRIR PDF B/N</a></article></div><p class="note" style="margin-top:18px">La solución real, los eventos privados y el reloj permanecen dentro del juego digital. No hay una hoja física con la respuesta.</p><a class="btn" href="../">VOLVER A HOTEL ORFEO</a></section></main></body></html>'''
    (OUT/'index.html').write_text(html,encoding='utf-8')

def build_rc_js():
    js='''(()=>{const install=()=>{if(window.__c002KitRc)return;window.__c002KitRc=true;const original=window.showView;if(typeof original!=="function")return;window.showView=function(view){const out=original.apply(this,arguments);if(view==="print")setTimeout(()=>{const el=document.querySelector("#appView");if(el&&!el.querySelector("[data-c002-kit-link]")){el.insertAdjacentHTML("beforeend",`<div class="btns" data-c002-kit-link><a class="btn primary" href="printables/" target="_blank" rel="noopener">ABRIR KIT IMPRIMIBLE</a></div>`)}},0);return out}};if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install);else install()})();'''
    (ROOT/'caso002'/'rc.js').write_text(js,encoding='utf-8')

def build_portal_js():
    js='''(()=>{async function init(){const cards=[...document.querySelectorAll('.card[data-cat="mystery"]')];const card=cards.find(c=>c.querySelector('.accent')?.textContent.includes('Caso 002'));if(!card)return;const status=card.querySelector('.status');const p=card.querySelector('p');if(status)status.textContent='● RELEASE CANDIDATE';if(p)p.textContent='Hotel Orfeo · 3 jugadores · roles privados · Habitación 317 · finales variables · kit imprimible COLOR y B/N.';let price=card.querySelector('#exp002Price');if(!price){price=document.createElement('div');price.id='exp002Price';price.className='note';price.style.marginTop='8px';const actions=card.querySelector('.actions');card.insertBefore(price,actions)}const actions=card.querySelector('.actions');if(actions)actions.innerHTML='<button class="btn primary" id="exp002Buy" disabled>VENTA ONLINE PENDIENTE</button><a class="btn" href="https://wa.me/5491153774769?text=Hola%20PasaloChevere%2C%20quiero%20consultar%20por%20EXPEDIENTES%20%E2%80%94%20Caso%20002." target="_blank" rel="noopener">WHATSAPP</a>';const btn=document.getElementById('exp002Buy');price.textContent='Release Candidate aprobado · precio online pendiente de definición';try{if(typeof sb==='undefined')return;const {data,error}=await sb.functions.invoke('pasalochevere-catalog',{body:{}});if(error||!data?.ok)return;const prod=(data.products||[]).find(x=>x.product_code==='EXP-002');if(prod?.sales_enabled&&Number(prod.price_ars)>0){price.textContent=new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(Number(prod.price_ars))+' · acceso 12 meses';if(status)status.textContent='● DISPONIBLE';btn.disabled=false;btn.textContent='COMPRAR AHORA';btn.onclick=()=>buyNow('EXP-002')}else{btn.disabled=true}}catch(e){console.warn('C002 catalog',e)}}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init()})();'''
    (ROOT/'portal-v2'/'c002-rc.js').write_text(js,encoding='utf-8')

def inject_script(path,tag):
    p=ROOT/path; s=p.read_text(encoding='utf-8')
    if tag not in s:
        s=s.replace('</body>',tag+'</body>')
        p.write_text(s,encoding='utf-8')

build_pdf(OUT/'Kit_Imprimible_Caso_002_COLOR.pdf',False)
build_pdf(OUT/'Kit_Imprimible_Caso_002_BN.pdf',True)
build_html(); build_rc_js(); build_portal_js()
inject_script('caso002/index.html','<script src="rc.js?v=230"></script>')
inject_script('portal-v2/index.html','<script src="c002-rc.js?v=230"></script>')
(ROOT/'caso002'/'P2_3_RELEASE_CANDIDATE.txt').write_text('P2.3 RELEASE CANDIDATE C002\nKit imprimible COLOR/B&N integrado.\nPortal V2 cableado a EXP-002, respetando sales_enabled y price_ars.\nNo habilitar venta online mientras price_ars sea NULL o sales_enabled=false.\n',encoding='utf-8')
print('P2.3 assets built')