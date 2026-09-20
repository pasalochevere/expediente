from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor, Color, black, white
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.lib.units import mm
from pathlib import Path
import hashlib

OUT=str(Path(__file__).with_name('C002_Kit_Imprimible_Hotel_Orfeo.pdf'))
W,H=A4
INK=HexColor('#1E1A17'); BROWN=HexColor('#6A4A2D'); GOLD=HexColor('#A47A47'); PAPER=HexColor('#F1E9DC'); PAPER2=HexColor('#E6D7C2'); MUTED=HexColor('#776B5E'); RED=HexColor('#7E2E2E'); DARK=HexColor('#0D0C0B'); LINE=HexColor('#B9A78E'); LIGHT=HexColor('#FBF7F1')
characters=[('P01','Alma Salvatierra','Restauradora','El pasado siempre deja huellas.','alma'),('P02','Bruno Ferrer','Ilusionista','Nada es lo que parece.','bruno'),('P03','Celeste Vidal','Periodista','Las preguntas también revelan.','celeste'),('P04','Damián Orsini','Arquitecto','Todo edificio esconde una verdad.','damian'),('P05','Eva Montenegro','Escritora / Médium','Hay silencios que hablan.','eva'),('P06','Franco Valdés','Heredero','Algunas herencias son una condena.','franco')]
locations=[('L01','Vestíbulo','lobby'),('L02','Salón de baile','ballroom'),('L03','Archivo subterráneo','archive'),('L04','Habitación 216','room216'),('L05','Sala de máquinas','machines'),('L06','Pasillo del tercer piso','corridor')]
objects=[('O01','Llave 317','key'),('O02','Reloj detenido','clock'),('O03','Cinta de casete','cassette'),('O04','Plano quemado','blueprint'),('O05','Cámara Polaroid','camera'),('O06','Medallón de plata','medallion')]

def safe(s): return s.replace('–','-').replace('—','-').replace('·','-').replace('“','"').replace('”','"').replace('’',"'")
def wrap(c,text,x,y,maxw,font='Helvetica',size=9.5,leading=None,color=INK,max_lines=None):
    leading=leading or size*1.25; c.setFont(font,size); c.setFillColor(color); words=safe(text).split(); lines=[]; cur=''
    for w in words:
        t=(cur+' '+w).strip()
        if stringWidth(t,font,size)<=maxw: cur=t
        else:
            if cur: lines.append(cur)
            cur=w
    if cur: lines.append(cur)
    if max_lines and len(lines)>max_lines:
        lines=lines[:max_lines]; last=lines[-1]
        while stringWidth(last+'...',font,size)>maxw and len(last)>3: last=last[:-1]
        lines[-1]=last+'...'
    for i,line in enumerate(lines): c.drawString(x,y-i*leading,line)
    return y-len(lines)*leading

def header(c,section,title,subtitle=None,dark=False):
    if dark: c.setFillColor(DARK); c.rect(0,0,W,H,fill=1,stroke=0); fg=PAPER; muted=HexColor('#B9A996')
    else: c.setFillColor(PAPER); c.rect(0,0,W,H,fill=1,stroke=0); fg=INK; muted=MUTED
    c.setFillColor(GOLD); c.setFont('Helvetica-Bold',8); c.drawString(18*mm,H-18*mm,safe(section).upper()); c.setFillColor(fg); c.setFont('Times-Bold',24); c.drawString(18*mm,H-30*mm,safe(title))
    if subtitle: wrap(c,subtitle,18*mm,H-37*mm,W-36*mm,'Helvetica',9.2,11.5,muted)
    c.setStrokeColor(GOLD); c.setLineWidth(.7); c.line(18*mm,H-43*mm,W-18*mm,H-43*mm)
def footer(c,pno):
    c.setFillColor(MUTED); c.setFont('Helvetica',6.8); c.drawString(18*mm,10*mm,'EXPEDIENTES - Caso 002 - Kit imprimible complementario'); c.drawRightString(W-18*mm,10*mm,f'{pno:02d}')
def cut_marks(c,x,y,w,h): c.setStrokeColor(LINE); c.setLineWidth(.4); c.setDash(2,2); c.rect(x,y,w,h,fill=0,stroke=1); c.setDash()
def draw_door(c,x,y,w,h,label='317',bw=False):
    bg=HexColor('#17130F') if not bw else HexColor('#DDDDDD'); fg=GOLD if not bw else black; c.setFillColor(bg); c.roundRect(x,y,w,h,4*mm,fill=1,stroke=0); c.setStrokeColor(fg); c.setLineWidth(2); c.rect(x+w*.32,y+h*.14,w*.36,h*.70,fill=0,stroke=1); c.setFont('Times-Bold',min(w,h)*.18); c.setFillColor(fg); c.drawCentredString(x+w*.5,y+h*.56,label); c.setFont('Helvetica-Bold',min(w,h)*.055); c.drawCentredString(x+w*.5,y+h*.08,'HOTEL ORFEO')
def draw_portrait(c,x,y,w,h,key,bw=False):
    bg=HexColor('#D7C7AF') if not bw else HexColor('#EEEEEE'); ink=HexColor('#3A2A1B') if not bw else black; c.setFillColor(bg); c.roundRect(x,y,w,h,3*mm,fill=1,stroke=0); c.setFillColor(Color(0,0,0,alpha=.08)); c.circle(x+w*.5,y+h*.53,min(w,h)*.33,fill=1,stroke=0); c.setFillColor(ink); c.roundRect(x+w*.32,y+h*.15,w*.36,h*.32,8,fill=1,stroke=0); c.circle(x+w*.5,y+h*.60,min(w,h)*.16,fill=1,stroke=0); c.setStrokeColor(ink); c.setLineWidth(max(1,w*.012))
    if key=='alma': c.circle(x+w*.62,y+h*.73,min(w,h)*.07,fill=1,stroke=0); c.line(x+w*.20,y+h*.18,x+w*.34,y+h*.50); c.line(x+w*.18,y+h*.20,x+w*.25,y+h*.14)
    elif key=='bruno': c.rect(x+w*.34,y+h*.72,w*.32,h*.07,fill=1,stroke=0); c.rect(x+w*.40,y+h*.79,w*.20,h*.12,fill=1,stroke=0); c.rect(x+w*.15,y+h*.15,w*.12,h*.17,fill=0,stroke=1); c.line(x+w*.18,y+h*.25,x+w*.24,y+h*.19)
    elif key=='celeste': c.rect(x+w*.18,y+h*.13,w*.16,h*.16,fill=0,stroke=1); c.circle(x+w*.26,y+h*.21,w*.035,fill=0,stroke=1); c.line(x+w*.70,y+h*.18,x+w*.84,y+h*.34); c.line(x+w*.72,y+h*.19,x+w*.82,y+h*.16)
    elif key=='damian': c.rect(x+w*.12,y+h*.12,w*.25,h*.16,fill=0,stroke=1); c.line(x+w*.15,y+h*.15,x+w*.33,y+h*.24); c.line(x+w*.33,y+h*.15,x+w*.15,y+h*.24); c.line(x+w*.70,y+h*.18,x+w*.84,y+h*.18); c.line(x+w*.77,y+h*.12,x+w*.77,y+h*.25)
    elif key=='eva': c.arc(x+w*.36,y+h*.70,x+w*.64,y+h*.93,20,250); c.circle(x+w*.76,y+h*.23,w*.05,fill=0,stroke=1); c.line(x+w*.71,y+h*.23,x+w*.81,y+h*.23); c.line(x+w*.76,y+h*.18,x+w*.76,y+h*.28)
    elif key=='franco': c.line(x+w*.50,y+h*.15,x+w*.50,y+h*.37); c.line(x+w*.40,y+h*.37,x+w*.50,y+h*.26); c.line(x+w*.60,y+h*.37,x+w*.50,y+h*.26); c.circle(x+w*.78,y+h*.21,w*.045,fill=0,stroke=1); c.circle(x+w*.78,y+h*.21,w*.015,fill=1,stroke=0)
def draw_location(c,x,y,w,h,key,bw=False):
    bg=HexColor('#D8C8B1') if not bw else HexColor('#EEEEEE'); ink=HexColor('#3A2A1B') if not bw else black; c.setFillColor(bg); c.roundRect(x,y,w,h,3*mm,fill=1,stroke=0); c.setStrokeColor(ink); c.setFillColor(ink); c.setLineWidth(1.4)
    if key=='lobby': c.rect(x+w*.15,y+h*.22,w*.70,h*.22,fill=0,stroke=1); c.line(x+w*.20,y+h*.44,x+w*.20,y+h*.70); c.line(x+w*.80,y+h*.44,x+w*.80,y+h*.70); c.line(x+w*.20,y+h*.70,x+w*.80,y+h*.70); c.circle(x+w*.50,y+h*.50,w*.05,fill=0,stroke=1)
    elif key=='ballroom': c.line(x+w*.5,y+h*.84,x+w*.5,y+h*.67); c.line(x+w*.33,y+h*.67,x+w*.67,y+h*.67); [c.line(x+w*.5,y+h*.67,x+w*t,y+h*.48) for t in (.34,.42,.58,.66)]; [c.circle(x+w*t,y+h*.45,w*.025,fill=0,stroke=1) for t in (.34,.42,.58,.66)]; c.arc(x+w*.18,y+h*.15,x+w*.82,y+h*.55,0,180)
    elif key=='archive':
        for col in (.18,.42,.66):
            c.rect(x+w*col,y+h*.18,w*.18,h*.62,fill=0,stroke=1)
            for r in (.28,.42,.56,.70): c.line(x+w*col,y+h*r,x+w*(col+.18),y+h*r)
    elif key=='room216': c.rect(x+w*.34,y+h*.12,w*.32,h*.72,fill=0,stroke=1); c.circle(x+w*.60,y+h*.45,w*.018,fill=1,stroke=0); c.setFont('Times-Bold',min(w,h)*.12); c.drawCentredString(x+w*.50,y+h*.62,'216')
    elif key=='machines':
        for cx,cy,r in ((.36,.50,.13),(.62,.43,.10),(.57,.67,.08)): c.circle(x+w*cx,y+h*cy,w*r,fill=0,stroke=1); c.circle(x+w*cx,y+h*cy,w*r*.3,fill=0,stroke=1)
        c.line(x+w*.15,y+h*.18,x+w*.85,y+h*.18)
    elif key=='corridor': c.line(x+w*.15,y+h*.18,x+w*.5,y+h*.78); c.line(x+w*.85,y+h*.18,x+w*.5,y+h*.78); c.line(x+w*.15,y+h*.18,x+w*.85,y+h*.18); [c.rect(x+w*(t-.06),y+h*.20,w*.12,h*.20,fill=0,stroke=1) for t in (.28,.43,.57,.72)]
def draw_object(c,x,y,w,h,key,bw=False):
    bg=HexColor('#D8C8B1') if not bw else HexColor('#EEEEEE'); ink=HexColor('#3A2A1B') if not bw else black; c.setFillColor(bg); c.roundRect(x,y,w,h,3*mm,fill=1,stroke=0); c.setStrokeColor(ink); c.setFillColor(ink); c.setLineWidth(1.6); cx=x+w*.5; cy=y+h*.5
    if key=='key': c.circle(x+w*.34,cy,w*.10,fill=0,stroke=1); c.line(x+w*.44,cy,x+w*.78,cy); c.line(x+w*.68,cy,x+w*.68,y+h*.38); c.line(x+w*.75,cy,x+w*.75,y+h*.42); c.setFont('Times-Bold',w*.10); c.drawCentredString(cx,y+h*.20,'317')
    elif key=='clock': c.circle(cx,cy,w*.22,fill=0,stroke=1); c.line(cx,cy,cx,cy+w*.13); c.line(cx,cy,cx+w*.12,cy-w*.08); c.setFont('Helvetica-Bold',w*.08); c.drawCentredString(cx,y+h*.18,'03:17')
    elif key=='cassette': c.roundRect(x+w*.18,y+h*.30,w*.64,h*.38,5,fill=0,stroke=1); c.circle(x+w*.36,y+h*.49,w*.075,fill=0,stroke=1); c.circle(x+w*.64,y+h*.49,w*.075,fill=0,stroke=1); c.line(x+w*.30,y+h*.35,x+w*.70,y+h*.35)
    elif key=='blueprint': c.rect(x+w*.20,y+h*.18,w*.60,h*.64,fill=0,stroke=1); c.rect(x+w*.30,y+h*.30,w*.18,h*.22,fill=0,stroke=1); c.rect(x+w*.52,y+h*.40,w*.18,h*.26,fill=0,stroke=1); c.line(x+w*.20,y+h*.18,x+w*.28,y+h*.30); c.line(x+w*.80,y+h*.82,x+w*.70,y+h*.68); c.setStrokeColor(RED if not bw else black); c.line(x+w*.58,y+h*.20,x+w*.82,y+h*.37)
    elif key=='camera': c.roundRect(x+w*.22,y+h*.30,w*.56,h*.40,5,fill=0,stroke=1); c.circle(cx,y+h*.50,w*.14,fill=0,stroke=1); c.rect(x+w*.30,y+h*.68,w*.18,h*.07,fill=0,stroke=1); c.line(x+w*.32,y+h*.22,x+w*.68,y+h*.22)
    elif key=='medallion': c.circle(cx,y+h*.46,w*.20,fill=0,stroke=1); c.circle(cx,y+h*.46,w*.12,fill=0,stroke=1); c.arc(x+w*.30,y+h*.40,x+w*.70,y+h*.92,20,140); c.line(cx,y+h*.42,cx,y+h*.54); c.line(cx-w*.05,y+h*.48,cx+w*.05,y+h*.48)
def draw_art(c,x,y,w,h,kind,key,bw=False):
    {'character':draw_portrait,'location':draw_location,'object':draw_object}[kind](c,x,y,w,h,key,bw)
def card(c,x,y,w,h,code,name,sub,kind,key,bw=False):
    cut_marks(c,x,y,w,h); pad=5*mm; art_h=h*.58; draw_art(c,x+pad,y+h-art_h-pad,w-2*pad,art_h,kind,key,bw); c.setFillColor(INK); c.setFont('Helvetica-Bold',7.5); c.drawString(x+pad,y+23*mm,code); c.setFont('Times-Bold',13); c.drawString(x+pad,y+16.5*mm,safe(name)); wrap(c,sub,x+pad,y+11*mm,w-2*pad,'Helvetica',7.5,9,MUTED,2)
def page_cards(c,title,items,kind,bw=False,pno=1):
    header(c,'ARCHIVO RECORTABLE'+(' - B/N' if bw else ''),title,'Recortá por las líneas punteadas. Las cartas no revelan la solución.'); margin=18*mm; gap=8*mm; top=H-52*mm; bottom=18*mm; w=(W-2*margin-gap)/2; h=(top-bottom-2*gap)/3
    for idx,it in enumerate(items):
        col=idx%2; row=idx//2; x=margin+col*(w+gap); y=top-(row+1)*h-row*gap
        if kind=='character': code,name,role,phrase,key=it; sub=f'{role}. {phrase}'
        else: code,name,key=it; sub='Evidencia del expediente.'
        card(c,x,y,w,h,code,name,sub,kind,key,bw)
    footer(c,pno); c.showPage()
def draw_checkbox(c,x,y,label,size=3.6*mm): c.setStrokeColor(MUTED); c.rect(x,y-size+1,size,size,fill=0,stroke=1); c.setFillColor(INK); c.setFont('Helvetica',8); c.drawString(x+size+2*mm,y-size+2,label)

c=canvas.Canvas(OUT,pagesize=A4,pageCompression=1); c.setTitle('EXPEDIENTES Caso 002 - Kit Imprimible Hotel Orfeo'); pno=1
header(c,'EXPEDIENTES - CASO 002','LA HABITACIÓN QUE NO EXISTE','Kit imprimible complementario - Hotel Orfeo - 3 jugadores',True); draw_door(c,55*mm,70*mm,100*mm,120*mm,'317'); c.setFillColor(PAPER); c.setFont('Times-Bold',20); c.drawCentredString(W/2,53*mm,'HOTEL ORFEO'); c.setFillColor(HexColor('#B9A996')); c.setFont('Helvetica',8); c.drawCentredString(W/2,45*mm,'Tablero - 18 cartas - documentos - hojas de investigación'); c.setFillColor(GOLD); c.setFont('Helvetica-Bold',8); c.drawCentredString(W/2,34*mm,'P2.3.1 - SIN SOLUCIÓN FIJA - COMPATIBLE CON ENGINE P2'); c.showPage(); pno+=1
header(c,'GUÍA','Cómo usar este kit','El juego digital sigue siendo la autoridad: tiempo, pistas, 317, roles privados y solución dinámica.'); y=H-55*mm
steps=[('1. Antes de jugar','Imprimí las cartas y, si querés, las hojas de investigación. No hace falta imprimir todo el dossier.'),('2. Durante la partida','Usá las cartas para ordenar sospechosos, lugares y objetos mientras cada teléfono recibe eventos y pistas.'),('3. Habitación 317','La página especial 317 es narrativa. No reemplaza a los seis lugares posibles de la solución.'),('4. Sin spoilers','Este PDF no contiene una combinación ganadora. Cada sesión P2 genera y congela una solución distinta.'),('5. Impresión','A4, tamaño real 100%. Para cartas: papel 160-220 g o papel común pegado sobre cartulina.')]
for title,body in steps: c.setFillColor(PAPER2); c.roundRect(18*mm,y-20*mm,W-36*mm,17*mm,3*mm,fill=1,stroke=0); c.setFillColor(BROWN); c.setFont('Helvetica-Bold',9); c.drawString(23*mm,y-8*mm,title.upper()); wrap(c,body,23*mm,y-13*mm,W-46*mm,'Helvetica',8,10,MUTED,2); y-=23*mm
c.setFillColor(RED); c.setFont('Helvetica-Bold',8); c.drawString(18*mm,28*mm,'IMPORTANTE'); wrap(c,'No compartas las identidades privadas ni las alertas del impostor. Esas piezas permanecen exclusivamente en el juego digital.',18*mm,23*mm,W-36*mm,'Helvetica',8.5,10,INK,3); footer(c,pno); c.showPage(); pno+=1
header(c,'EXPEDIENTE','Resumen del caso','Material de ambientación. No determina la solución dinámica.'); wrap(c,'Un hotel cerrado durante décadas. Seis invitados. Una desaparición a las 03:17. Y una puerta que no debería existir.',18*mm,H-55*mm,W-36*mm,'Times-Bold',15,19,INK,4)
timeline=[('UNA SEMANA ANTES','Seis personas reciben invitaciones sin explicación.'),('ESA NOCHE','León Valdés abre una caja con fotografías, documentos y una cinta.'),('03:17','Cae la energía. Suena la campana. Se oyen tres golpes.'),('03:18','La electricidad vuelve. León desapareció. La llave ya no está.'),('TERCER PISO','Entre 316 y 318 aparece la puerta 317, ausente de los planos.')]; y=H-92*mm; c.setStrokeColor(GOLD); c.setLineWidth(1.3); c.line(28*mm,y-75*mm,28*mm,y+5*mm)
for i,(t,b) in enumerate(timeline): yy=y-i*18*mm; c.setFillColor(GOLD); c.circle(28*mm,yy,2.2*mm,fill=1,stroke=0); c.setFont('Helvetica-Bold',8); c.drawString(35*mm,yy+1*mm,t); wrap(c,b,35*mm,yy-5*mm,W-55*mm,'Helvetica',8.5,10,MUTED,2)
c.setFillColor(PAPER2); c.roundRect(18*mm,25*mm,W-36*mm,28*mm,4*mm,fill=1,stroke=0); c.setFillColor(BROWN); c.setFont('Times-Bold',14); c.drawString(23*mm,43*mm,'OBJETIVO'); wrap(c,'Reconstruir PERSONA + LUGAR + OBJETO usando la evidencia compartida y privada que entregue la Central.',23*mm,36*mm,W-46*mm,'Helvetica',9,11,INK,3); footer(c,pno); c.showPage(); pno+=1
header(c,'TABLERO','Mapa de investigación','Marcá, descartá o conectá elementos a medida que avance la partida.'); cols=[('PERSONAS',characters,'character'),('LUGARES',locations,'location'),('OBJETOS',objects,'object')]; x0=18*mm; gap=5*mm; colw=(W-36*mm-2*gap)/3; y0=H-55*mm
for ci,(title,items,kind) in enumerate(cols):
    x=x0+ci*(colw+gap); c.setFillColor(BROWN); c.setFont('Helvetica-Bold',9); c.drawString(x,y0,title)
    for ri,it in enumerate(items):
        yy=y0-10*mm-ri*23*mm; c.setFillColor(LIGHT); c.roundRect(x,yy-18*mm,colw,18*mm,2*mm,fill=1,stroke=0); code,name,*rest=it; key=rest[-1]; draw_art(c,x+2*mm,yy-16*mm,17*mm,14*mm,kind,key,True); c.setFillColor(INK); c.setFont('Helvetica-Bold',6.8); c.drawString(x+21*mm,yy-5*mm,code); wrap(c,name,x+21*mm,yy-10*mm,colw-23*mm,'Helvetica-Bold',7,8,INK,2); c.setStrokeColor(MUTED); c.rect(x+colw-6*mm,yy-7*mm,3.5*mm,3.5*mm,fill=0,stroke=1); c.rect(x+colw-6*mm,yy-14*mm,3.5*mm,3.5*mm,fill=0,stroke=1)
c.setFillColor(PAPER2); c.roundRect(18*mm,18*mm,W-36*mm,20*mm,3*mm,fill=1,stroke=0); c.setFillColor(INK); c.setFont('Helvetica-Bold',8); c.drawString(22*mm,31*mm,'LEYENDA'); c.setFont('Helvetica',7.2); c.drawString(22*mm,25*mm,'Primer cuadro: investigado / segundo cuadro: descartado. Usá líneas o notas para registrar conexiones.'); footer(c,pno); c.showPage(); pno+=1
page_cards(c,'Personajes - color',characters,'character',False,pno); pno+=1; page_cards(c,'Lugares - color',locations,'location',False,pno); pno+=1; page_cards(c,'Objetos - color',objects,'object',False,pno); pno+=1
header(c,'ÁREA ESPECIAL','HABITACIÓN 317','Se desbloquea durante la investigación. Aporta contexto histórico y no forma parte del random de Lugar.'); draw_door(c,18*mm,H-122*mm,65*mm,65*mm,'317'); wrap(c,'La habitación nunca dejó de existir. Fue sellada. La Central habilita su exploración cuando la anomalía arquitectónica queda confirmada.',90*mm,H-62*mm,W-108*mm,'Times-Bold',12,15,INK,7)
items317=[('GRABADOR ANTIGUO','Conserva marcas de uso y restos de cinta. Alguien retiró una grabación antes de que la habitación fuera sellada.'),('MIRILLA INTERIOR','La orientación permite observar sectores del hotel sin quedar expuesto desde el pasillo.'),('FOTOGRAFÍAS','Varias imágenes fueron tomadas desde ángulos imposibles para un huésped.'),('PANEL DE CABLEADO','Los conductos no pertenecen a calefacción ni ventilación.'),('PLACA 317','La numeración coincide con el espacio faltante entre 316 y 318.')]; y=H-135*mm
for i,(t,b) in enumerate(items317): c.setFillColor(PAPER2); c.roundRect(18*mm,y-20*mm,W-36*mm,17*mm,2.5*mm,fill=1,stroke=0); c.setFillColor(BROWN); c.setFont('Helvetica-Bold',8); c.drawString(23*mm,y-8*mm,f'{i+1:02d}  {t}'); wrap(c,b,23*mm,y-13*mm,W-46*mm,'Helvetica',7.6,9,MUTED,2); y-=20*mm
footer(c,pno); c.showPage(); pno+=1
header(c,'DOCUMENTO A','Registro de 1968','Recreación imprimible del documento mencionado por la Central.'); c.setFillColor(HexColor('#E2D1B5')); c.roundRect(25*mm,35*mm,W-50*mm,H-92*mm,3*mm,fill=1,stroke=0); c.setFillColor(INK); c.setFont('Times-Bold',18); c.drawCentredString(W/2,H-72*mm,'HOTEL ORFEO - REGISTRO DE HUÉSPEDES'); c.setFont('Helvetica',8); c.drawCentredString(W/2,H-80*mm,'Extracto restaurado - 1968')
rows=[('12/06','L. Ferrer','216','Firma ilegible'),('13/06','V. Salvatierra','208','Salida anticipada'),('13/06','A. Montenegro','302','Sin equipaje'),('14/06','D. Orsini','-','Registro parcial'),('14/06','Valdés','318','Apellido visible'),('15/06','[PÁGINAS ARRANCADAS]','-','-')]; y=H-100*mm; c.setFont('Helvetica-Bold',8); c.drawString(35*mm,y,'FECHA'); c.drawString(62*mm,y,'NOMBRE'); c.drawString(118*mm,y,'HAB.'); c.drawString(142*mm,y,'OBSERVACIÓN'); c.setStrokeColor(BROWN); c.line(35*mm,y-2*mm,W-35*mm,y-2*mm); y-=11*mm
for r in rows: c.setFont('Courier',8); c.setFillColor(INK); c.drawString(35*mm,y,r[0]); c.drawString(62*mm,y,r[1]); c.drawString(118*mm,y,r[2]); c.drawString(142*mm,y,r[3]); c.setStrokeColor(LINE); c.line(35*mm,y-3*mm,W-35*mm,y-3*mm); y-=12*mm
c.setFillColor(RED); c.setFont('Helvetica-Bold',9); c.drawString(35*mm,58*mm,'NOTA DE CENTRAL:'); wrap(c,'Varias páginas del registro original fueron arrancadas. Los apellidos visibles aportan contexto histórico, no confirman por sí solos a la persona responsable.',35*mm,51*mm,W-70*mm,'Helvetica',8,10,INK,4); footer(c,pno); c.showPage(); pno+=1
header(c,'DOCUMENTO B','Anomalía arquitectónica','Plano esquemático del tercer piso. Recreación para uso de mesa.'); c.setStrokeColor(INK); c.setLineWidth(1.2); x=25*mm; y=55*mm; pw=W-50*mm; ph=105*mm; c.rect(x,y,pw,ph,fill=0,stroke=1); c.line(x,y+ph*.42,x+pw,y+ph*.42)
for i,label in enumerate(['314','315','316']): rx=x+i*pw*.17; c.rect(rx,y+ph*.42,pw*.17,ph*.58,fill=0,stroke=1); c.setFont('Helvetica-Bold',10); c.drawCentredString(rx+pw*.085,y+ph*.70,label)
rx=x+pw*.51; c.setStrokeColor(RED); c.setDash(4,3); c.rect(rx,y+ph*.42,pw*.18,ph*.58,fill=0,stroke=1); c.setDash(); c.setFillColor(RED); c.setFont('Times-Bold',18); c.drawCentredString(rx+pw*.09,y+ph*.70,'317?'); c.setStrokeColor(INK)
for j,label in enumerate(['318','319']): r2=x+pw*(.69+j*.155); c.rect(r2,y+ph*.42,pw*.155,ph*.58,fill=0,stroke=1); c.setFont('Helvetica-Bold',10); c.setFillColor(INK); c.drawCentredString(r2+pw*.0775,y+ph*.70,label)
c.setFont('Helvetica',9); c.drawCentredString(x+pw/2,y+ph*.18,'PASILLO DEL TERCER PISO'); c.setFillColor(PAPER2); c.roundRect(25*mm,H-78*mm,W-50*mm,25*mm,3*mm,fill=1,stroke=0); c.setFillColor(BROWN); c.setFont('Helvetica-Bold',9); c.drawString(31*mm,H-65*mm,'HALLAZGO'); wrap(c,'Las medidas exteriores del tercer piso no coinciden con los planos. Faltan aproximadamente 3,8 metros de espacio entre 316 y 318.',31*mm,H-72*mm,W-62*mm,'Helvetica',8.3,10,INK,3); footer(c,pno); c.showPage(); pno+=1
for sec,title,txt in [('C','Cinta - Fragmento 01','VOZ FEMENINA: Si encuentran esto... no crean la versión del hotel. La habitación no fue construida para alojar huéspedes.'),('E','Cinta - Fragmento 02','VOZ FEMENINA: Ellos creen que no escuché la grabación... Fue construida para escucharlos. La función de la 317 queda confirmada.')]:
    header(c,'DOCUMENTO '+sec,title,'Transcripción entregada durante la investigación.'); draw_object(c,35*mm,H-115*mm,60*mm,50*mm,'cassette'); c.setFillColor(DARK); c.roundRect(108*mm,H-130*mm,75*mm,62*mm,4*mm,fill=1,stroke=0); c.setFillColor(PAPER); c.setFont('Courier-Bold',8); c.drawString(114*mm,H-82*mm,'TRANSCRIPCIÓN'); wrap(c,txt,114*mm,H-92*mm,63*mm,'Courier',8.5,11,PAPER,8); c.setFillColor(PAPER2); c.roundRect(25*mm,45*mm,W-50*mm,34*mm,3*mm,fill=1,stroke=0); c.setFillColor(INK); c.setFont('Helvetica-Bold',8); c.drawString(31*mm,67*mm,'ANOTACIONES DEL EQUIPO'); [c.line(31*mm,(58-i*8)*mm,W-31*mm,(58-i*8)*mm) for i in range(3)]; footer(c,pno); c.showPage(); pno+=1
header(c,'DOCUMENTO D','Informe del apagón - 03:17','Registro técnico recreado para acompañar el evento del juego.'); c.setFillColor(HexColor('#D9D0C4')); c.roundRect(28*mm,H-140*mm,65*mm,70*mm,4*mm,fill=1,stroke=0); c.setStrokeColor(INK); c.rect(38*mm,H-130*mm,45*mm,50*mm,fill=0,stroke=1)
for r in range(3):
    for col in range(2): xx=44*mm+col*22*mm; yy=H-(94+r*11)*mm; c.roundRect(xx,yy,14*mm,7*mm,2,fill=0,stroke=1)
c.setFillColor(RED); c.setFont('Helvetica-Bold',9); c.drawCentredString(60.5*mm,H-137*mm,'TABLERO AUXILIAR'); notes=[('03:16:54','Tensión estable.'),('03:17:02','Corte total de iluminación.'),('03:17:05','Tablero auxiliar: accionamiento manual.'),('03:17:41','Campana de recepción: un pulso.'),('03:18:03','Servicio restablecido.')]; y=H-78*mm; c.setFillColor(INK); c.setFont('Helvetica-Bold',9); c.drawString(108*mm,y,'REGISTRO'); y-=10*mm
for t,b in notes: c.setFont('Courier-Bold',7.8); c.drawString(108*mm,y,t); c.setFont('Helvetica',8); c.drawString(133*mm,y,b); y-=11*mm
c.setFillColor(PAPER2); c.roundRect(25*mm,45*mm,W-50*mm,32*mm,3*mm,fill=1,stroke=0); c.setFillColor(BROWN); c.setFont('Helvetica-Bold',9); c.drawString(31*mm,66*mm,'CONCLUSIÓN'); wrap(c,'La tormenta no provocó el corte de las 03:17. El tablero auxiliar fue accionado desde el interior del hotel.',31*mm,59*mm,W-62*mm,'Helvetica',8.5,10,INK,3); footer(c,pno); c.showPage(); pno+=1
header(c,'DOCUMENTO F','Polaroid - 03:12','Evidencia fotográfica recreada. La cronología es más importante que la imagen exacta.'); px=48*mm; py=55*mm; pw=115*mm; ph=145*mm; c.saveState(); c.translate(px+pw/2,py+ph/2); c.rotate(-2.5); c.translate(-(px+pw/2),-(py+ph/2)); c.setFillColor(white); c.rect(px,py,pw,ph,fill=1,stroke=0); c.setFillColor(HexColor('#40362C')); c.rect(px+9*mm,py+36*mm,pw-18*mm,ph-48*mm,fill=1,stroke=0); c.setStrokeColor(HexColor('#D7C8B5')); c.setLineWidth(1.4); c.line(px+18*mm,py+47*mm,px+pw/2,py+ph-20*mm); c.line(px+pw-18*mm,py+47*mm,px+pw/2,py+ph-20*mm); c.rect(px+pw*.35,py+70*mm,pw*.30,50*mm,fill=0,stroke=1); c.setFillColor(HexColor('#D7C8B5')); c.setFont('Times-Bold',18); c.drawCentredString(px+pw/2,py+93*mm,'317'); c.setFillColor(INK); c.setFont('Courier-Bold',11); c.drawCentredString(px+pw/2,py+18*mm,'03:12'); c.restoreState(); wrap(c,'La puerta 317 ya estaba abierta cinco minutos antes del apagón. No apareció durante el corte: alguien la había abierto antes.',25*mm,42*mm,W-50*mm,'Times-Bold',10.5,13,INK,5); footer(c,pno); c.showPage(); pno+=1
header(c,'DOCUMENTO G','La caja de León','Inventario de referencia para acompañar el primer evento narrativo.'); c.setFillColor(HexColor('#8B6540')); c.roundRect(30*mm,H-145*mm,W-60*mm,65*mm,5*mm,fill=1,stroke=0); c.setFillColor(HexColor('#B88750')); c.rect(38*mm,H-113*mm,W-76*mm,8*mm,fill=1,stroke=0); c.setFillColor(PAPER); c.setFont('Times-Bold',20); c.drawCentredString(W/2,H-116*mm,'L. V.'); inv=[('Fotografías','Varias tomas antiguas del hotel.'),('Documentos','Papeles y copias vinculadas al pasado del Orfeo.'),('Cinta','Grabación conservada dentro de la caja.'),('Hueco de llave','Falta una pieza con la forma de una llave.')]; y=H-165*mm
for i,(a,b) in enumerate(inv): c.setFillColor(PAPER2); c.roundRect(30*mm,y-16*mm,W-60*mm,13*mm,2*mm,fill=1,stroke=0); c.setFillColor(BROWN); c.setFont('Helvetica-Bold',8); c.drawString(35*mm,y-8*mm,f'{i+1:02d}  {a.upper()}'); c.setFillColor(INK); c.setFont('Helvetica',7.5); c.drawRightString(W-35*mm,y-8*mm,b); y-=17*mm
footer(c,pno); c.showPage(); pno+=1
header(c,'HOJA DE TRABAJO','Conexiones e hipótesis','Usá esta página para registrar pares y teorías antes de acusar.')
for i,title in enumerate(['PERSONA + LUGAR','PERSONA + OBJETO','LUGAR + OBJETO']): yy=H-(65+i*55)*mm; c.setFillColor(PAPER2); c.roundRect(18*mm,yy-42*mm,W-36*mm,42*mm,3*mm,fill=1,stroke=0); c.setFillColor(BROWN); c.setFont('Helvetica-Bold',9); c.drawString(23*mm,yy-9*mm,title); [c.line(23*mm,yy-(19+r*8)*mm,W-23*mm,yy-(19+r*8)*mm) for r in range(3)]
footer(c,pno); c.showPage(); pno+=1
header(c,'HOJA DE TRABAJO','Bitácora de investigación','Cronología, contradicciones y evidencia crítica.'); sections=[('CRONOLOGÍA',['Hora / evento','Quién lo confirma','Qué cambia']),('CONTRADICCIONES',['Declaración','Prueba que la contradice','Qué descarta']),('EVIDENCIA CRÍTICA',['Pista','Categoría','Impacto en la teoría'])]; y=H-58*mm
for title,heads in sections:
    c.setFillColor(BROWN); c.setFont('Helvetica-Bold',9); c.drawString(18*mm,y,title); y-=7*mm; c.setFillColor(PAPER2); c.rect(18*mm,y-42*mm,W-36*mm,42*mm,fill=1,stroke=0); col=(W-36*mm)/3; c.setStrokeColor(LINE); [c.line(18*mm+k*col,y,18*mm+k*col,y-42*mm) for k in range(1,3)]; [c.line(18*mm,y-r*8.4*mm,W-18*mm,y-r*8.4*mm) for r in range(1,5)]; c.setFillColor(MUTED); c.setFont('Helvetica-Bold',6.8); [c.drawString(20*mm+k*col,y-5.7*mm,h) for k,h in enumerate(heads)]; y-=53*mm
footer(c,pno); c.showPage(); pno+=1
header(c,'HOJA FINAL','Acusación del equipo','Completá antes de enviar la acusación en el juego digital.'); labels=[('PERSONA','P__','Nombre:'),('LUGAR','L__','Lugar:'),('OBJETO','O__','Objeto:')]; y=H-68*mm
for title,code,prompt in labels: c.setFillColor(PAPER2); c.roundRect(30*mm,y-33*mm,W-60*mm,30*mm,4*mm,fill=1,stroke=0); c.setFillColor(BROWN); c.setFont('Helvetica-Bold',8); c.drawString(37*mm,y-13*mm,title); c.setFont('Times-Bold',20); c.drawString(37*mm,y-24*mm,code); c.setFillColor(INK); c.setFont('Helvetica',8); c.drawString(76*mm,y-20*mm,prompt); c.setStrokeColor(MUTED); c.line(97*mm,y-20*mm,W-40*mm,y-20*mm); y-=42*mm
c.setFillColor(INK); c.setFont('Helvetica-Bold',9); c.drawString(30*mm,70*mm,'TEORÍA EN UNA FRASE'); [c.line(30*mm,(61-i*9)*mm,W-30*mm,(61-i*9)*mm) for i in range(3)]; c.setFont('Helvetica-Bold',8); c.drawString(30*mm,28*mm,'CONFIANZA DEL EQUIPO'); [draw_checkbox(c,75*mm+i*36*mm,29*mm,t) for i,t in enumerate(['BAJA','MEDIA','ALTA'])]; footer(c,pno); c.showPage(); pno+=1
page_cards(c,'Personajes - blanco y negro',characters,'character',True,pno); pno+=1; page_cards(c,'Lugares - blanco y negro',locations,'location',True,pno); pno+=1; page_cards(c,'Objetos - blanco y negro',objects,'object',True,pno); pno+=1
header(c,'CIERRE','Checklist de impresión','Elegí sólo las páginas que quieras usar. El juego funciona incluso sin imprimir.'); y=H-60*mm; checks=['Cartas de personajes (color o B/N)','Cartas de lugares (color o B/N)','Cartas de objetos (color o B/N)','Tablero de investigación','Habitación 317','Documentos narrativos','Hoja de conexiones','Bitácora','Acusación final']
for t in checks: draw_checkbox(c,25*mm,y,t,4*mm); y-=12*mm
c.setFillColor(PAPER2); c.roundRect(18*mm,35*mm,W-36*mm,42*mm,4*mm,fill=1,stroke=0); c.setFillColor(BROWN); c.setFont('Times-Bold',13); c.drawString(24*mm,64*mm,'RECORDATORIO'); wrap(c,'Este kit es un soporte físico del Caso 002. La Central digital conserva el cronómetro, la solución, las pistas dinámicas, los eventos privados y la validación final.',24*mm,56*mm,W-48*mm,'Helvetica',8.7,11,INK,5); c.setFont('Helvetica',7); c.setFillColor(MUTED); c.drawString(24*mm,40*mm,'EXPEDIENTES es una obra de ficción. Todos los personajes y acontecimientos representados son ficticios.'); footer(c,pno); c.showPage(); pno+=1
c.save(); print(OUT); print('pages',pno-1); print('size',Path(OUT).stat().st_size); print('sha256',hashlib.sha256(Path(OUT).read_bytes()).hexdigest())
