from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor, Color, black, white
from reportlab.lib.units import mm
from reportlab.pdfbase.pdfmetrics import stringWidth
from pathlib import Path
import math, random, hashlib

OUT=str(Path(__file__).with_name('C002_Kit_Imprimible_Hotel_Orfeo.pdf'))
W,H=A4
# Hotel Orfeo palette
CHARCOAL=HexColor('#090A0B'); NIGHT=HexColor('#12100E'); PANEL=HexColor('#191511')
CREAM=HexColor('#F2E8D7'); PAPER=HexColor('#E7D7BF'); PAPER2=HexColor('#D6C3A5')
INK=HexColor('#1D1915'); MUTED=HexColor('#756A5D'); GOLD=HexColor('#A37A48'); GOLD2=HexColor('#C79A5D')
RED=HexColor('#7E2E2E'); RED2=HexColor('#A54A3F'); LINE=HexColor('#B5A58D'); STORM=HexColor('#4E555E')

chars=[
('P01','Alma Salvatierra','Restauradora','El pasado siempre deja huellas.','restorer'),
('P02','Bruno Ferrer','Ilusionista','Nada es lo que parece.','magician'),
('P03','Celeste Vidal','Periodista','Las preguntas también revelan.','journalist'),
('P04','Damián Orsini','Arquitecto','Todo edificio esconde una verdad.','architect'),
('P05','Eva Montenegro','Escritora / Médium','Hay silencios que hablan.','medium'),
('P06','Franco Valdés','Heredero','Algunas herencias son una condena.','heir')]
locs=[('L01','Vestíbulo','lobby'),('L02','Salón de baile','ballroom'),('L03','Archivo subterráneo','archive'),('L04','Habitación 216','room216'),('L05','Sala de máquinas','machines'),('L06','Pasillo del tercer piso','corridor')]
objs=[('O01','Llave 317','key'),('O02','Reloj detenido','clock'),('O03','Cinta de casete','cassette'),('O04','Plano quemado','blueprint'),('O05','Cámara Polaroid','camera'),('O06','Medallón de plata','medallion')]

def safe(s):
    return str(s).replace('–','-').replace('—','-').replace('·','•').replace('“','"').replace('”','"').replace('’',"'")

def wrap(c,text,x,y,maxw,font='Helvetica',size=9.2,leading=None,color=INK,max_lines=None):
    leading=leading or size*1.28; c.setFont(font,size); c.setFillColor(color)
    words=safe(text).split(); lines=[]; cur=''
    for w in words:
        t=(cur+' '+w).strip()
        if stringWidth(t,font,size)<=maxw: cur=t
        else:
            if cur: lines.append(cur)
            cur=w
    if cur: lines.append(cur)
    if max_lines and len(lines)>max_lines:
        lines=lines[:max_lines]
        last=lines[-1]
        while stringWidth(last+'...',font,size)>maxw and len(last)>3: last=last[:-1]
        lines[-1]=last+'...'
    for i,line in enumerate(lines): c.drawString(x,y-i*leading,line)
    return y-len(lines)*leading

def aged_bg(c,dark=False):
    if dark:
        c.setFillColor(CHARCOAL); c.rect(0,0,W,H,fill=1,stroke=0)
        c.setFillColor(Color(.12,.14,.15,.8)); c.circle(W*.72,H*.94,80*mm,fill=1,stroke=0)
        c.setStrokeColor(Color(1,1,1,.035)); c.setLineWidth(.4)
        for i in range(55):
            x=(i*37 % int(W))+3; y=(i*71 % int(H))+4
            c.line(x,y,x-8,y-26)
        return
    c.setFillColor(CREAM); c.rect(0,0,W,H,fill=1,stroke=0)
    c.setFillColor(Color(.35,.22,.10,.035)); c.rect(0,0,W,6*mm,fill=1,stroke=0); c.rect(0,H-6*mm,W,6*mm,fill=1,stroke=0)
    c.rect(0,0,5*mm,H,fill=1,stroke=0); c.rect(W-5*mm,0,5*mm,H,fill=1,stroke=0)
    c.setStrokeColor(Color(.22,.16,.10,.035)); c.setLineWidth(.25)
    for i in range(75):
        y=(i*11.3)%H
        c.line(0,y,W,y+((i%5)-2)*.5)

def page_header(c,pno,section,title,sub=None,dark=False):
    aged_bg(c,dark)
    if dark:
        fg=CREAM; mut=HexColor('#B7A995')
        c.setStrokeColor(GOLD); c.setLineWidth(.8); c.line(17*mm,H-18*mm,W-17*mm,H-18*mm)
        c.setFillColor(GOLD2); c.setFont('Helvetica-Bold',7.4); c.drawString(18*mm,H-14*mm,safe(section).upper())
        c.setFillColor(fg); c.setFont('Times-Bold',24); c.drawString(18*mm,H-31*mm,safe(title))
        if sub: wrap(c,sub,18*mm,H-38*mm,W-36*mm,'Helvetica',8.8,11,mut,2)
    else:
        c.setFillColor(NIGHT); c.rect(0,H-22*mm,W,22*mm,fill=1,stroke=0)
        c.setFillColor(GOLD2); c.setFont('Helvetica-Bold',7.2); c.drawString(17*mm,H-9.5*mm,safe(section).upper())
        c.setFillColor(CREAM); c.setFont('Times-Bold',18); c.drawString(17*mm,H-16.5*mm,safe(title))
        c.setFillColor(GOLD); c.rect(0,H-22.7*mm,W,.7*mm,fill=1,stroke=0)
        if sub: wrap(c,sub,17*mm,H-29*mm,W-34*mm,'Helvetica',8.2,10,MUTED,2)
    c.setFillColor(GOLD if dark else RED); c.setFont('Helvetica-Bold',7.2); c.drawRightString(W-17*mm,H-9.5*mm,f'ARCHIVO 002  /  {pno:02d}')

def footer(c,pno,dark=False):
    c.setStrokeColor(Color(1,1,1,.1) if dark else LINE); c.setLineWidth(.4); c.line(17*mm,13*mm,W-17*mm,13*mm)
    c.setFillColor(HexColor('#9F9180') if dark else MUTED); c.setFont('Helvetica',6.8)
    c.drawString(17*mm,9*mm,'EXPEDIENTES • CASO 002 • HOTEL ORFEO • KIT IMPRIMIBLE')
    c.drawRightString(W-17*mm,9*mm,f'{pno:02d}')

def stamp(c,x,y,text,angle=-3,color=RED):
    c.saveState(); c.translate(x,y); c.rotate(angle); c.setStrokeColor(color); c.setFillColor(color); c.setLineWidth(1.6)
    tw=stringWidth(text,'Helvetica-Bold',9); pad=4*mm
    c.roundRect(-pad,-3.5*mm,tw+2*pad,8*mm,2*mm,fill=0,stroke=1)
    c.setFont('Helvetica-Bold',9); c.drawString(0,0,text); c.restoreState()

def draw_door(c,x,y,w,h,label='317',dark=True):
    c.saveState()
    c.setFillColor(NIGHT if dark else HexColor('#DED0B9')); c.roundRect(x,y,w,h,4*mm,fill=1,stroke=0)
    c.setStrokeColor(GOLD if dark else INK); c.setLineWidth(1.4)
    c.rect(x+w*.25,y+h*.10,w*.50,h*.80,fill=0,stroke=1)
    c.rect(x+w*.29,y+h*.14,w*.42,h*.72,fill=0,stroke=1)
    c.setFont('Times-Bold',min(w,h)*.16); c.setFillColor(GOLD2 if dark else RED); c.drawCentredString(x+w*.50,y+h*.56,label)
    c.circle(x+w*.66,y+h*.42,max(1.5,w*.018),fill=1,stroke=0)
    c.setFont('Helvetica-Bold',min(w,h)*.042); c.setFillColor(GOLD); c.drawCentredString(x+w*.50,y+h*.06,'HOTEL ORFEO')
    c.restoreState()

def silhouette(c,x,y,w,h,kind,bw=False):
    bg=HexColor('#1B1713') if not bw else HexColor('#E3E3E3'); fg=GOLD2 if not bw else HexColor('#333333'); ink=HexColor('#D9C7AE') if not bw else HexColor('#555555')
    c.setFillColor(bg); c.roundRect(x,y,w,h,3*mm,fill=1,stroke=0)
    c.setFillColor(Color(.55,.38,.20,.12) if not bw else Color(.2,.2,.2,.08)); c.circle(x+w*.5,y+h*.62,w*.30,fill=1,stroke=0)
    c.setFillColor(ink); c.circle(x+w*.5,y+h*.64,w*.11,fill=1,stroke=0); c.roundRect(x+w*.36,y+h*.20,w*.28,h*.33,w*.06,fill=1,stroke=0)
    c.setStrokeColor(fg); c.setLineWidth(1.3); c.setFillColor(fg)
    if kind=='restorer':
        c.line(x+w*.16,y+h*.22,x+w*.34,y+h*.46); c.line(x+w*.13,y+h*.19,x+w*.20,y+h*.14); c.line(x+w*.20,y+h*.14,x+w*.24,y+h*.22)
    elif kind=='magician':
        c.rect(x+w*.36,y+h*.78,w*.28,h*.055,fill=1,stroke=0); c.rect(x+w*.42,y+h*.835,w*.16,h*.10,fill=1,stroke=0); c.arc(x+w*.10,y+h*.16,x+w*.30,y+h*.35,0,300)
    elif kind=='journalist':
        c.roundRect(x+w*.12,y+h*.12,w*.22,h*.18,2,fill=0,stroke=1); c.circle(x+w*.23,y+h*.21,w*.045,fill=0,stroke=1); c.line(x+w*.72,y+h*.18,x+w*.86,y+h*.32); c.line(x+w*.73,y+h*.19,x+w*.83,y+h*.16)
    elif kind=='architect':
        c.rect(x+w*.10,y+h*.10,w*.28,h*.18,fill=0,stroke=1); c.line(x+w*.12,y+h*.12,x+w*.36,y+h*.26); c.line(x+w*.36,y+h*.12,x+w*.12,y+h*.26); c.line(x+w*.72,y+h*.12,x+w*.72,y+h*.30); c.line(x+w*.64,y+h*.21,x+w*.80,y+h*.21)
    elif kind=='medium':
        c.arc(x+w*.36,y+h*.75,x+w*.64,y+h*.94,20,245); c.circle(x+w*.80,y+h*.22,w*.055,fill=0,stroke=1); c.line(x+w*.74,y+h*.22,x+w*.86,y+h*.22); c.line(x+w*.80,y+h*.16,x+w*.80,y+h*.28)
    elif kind=='heir':
        c.circle(x+w*.80,y+h*.21,w*.055,fill=0,stroke=1); c.circle(x+w*.80,y+h*.21,w*.015,fill=1,stroke=0); c.line(x+w*.50,y+h*.16,x+w*.50,y+h*.38); c.line(x+w*.43,y+h*.38,x+w*.50,y+h*.29); c.line(x+w*.57,y+h*.38,x+w*.50,y+h*.29)

def location_art(c,x,y,w,h,kind,bw=False):
    bg=HexColor('#181511') if not bw else HexColor('#EEEEEE'); fg=GOLD2 if not bw else HexColor('#333333'); c.setFillColor(bg); c.roundRect(x,y,w,h,3*mm,fill=1,stroke=0); c.setStrokeColor(fg); c.setFillColor(fg); c.setLineWidth(1.2)
    if kind=='lobby':
        c.rect(x+w*.12,y+h*.18,w*.76,h*.22,fill=0,stroke=1); c.line(x+w*.18,y+h*.40,x+w*.18,y+h*.72); c.line(x+w*.82,y+h*.40,x+w*.82,y+h*.72); c.line(x+w*.18,y+h*.72,x+w*.82,y+h*.72); c.circle(x+w*.50,y+h*.52,w*.05,fill=0,stroke=1)
    elif kind=='ballroom':
        c.line(x+w*.5,y+h*.86,x+w*.5,y+h*.67); c.line(x+w*.32,y+h*.67,x+w*.68,y+h*.67)
        for t in (.34,.43,.57,.66): c.line(x+w*.5,y+h*.67,x+w*t,y+h*.48); c.circle(x+w*t,y+h*.44,w*.018,fill=0,stroke=1)
        c.arc(x+w*.16,y+h*.15,x+w*.84,y+h*.55,0,180)
    elif kind=='archive':
        for col in (.14,.40,.66):
            c.rect(x+w*col,y+h*.16,w*.20,h*.66,fill=0,stroke=1)
            for r in (.28,.42,.56,.70): c.line(x+w*col,y+h*r,x+w*(col+.20),y+h*r)
    elif kind=='room216':
        c.rect(x+w*.33,y+h*.10,w*.34,h*.76,fill=0,stroke=1); c.circle(x+w*.61,y+h*.46,w*.014,fill=1,stroke=0); c.setFont('Times-Bold',w*.11); c.drawCentredString(x+w*.50,y+h*.62,'216')
    elif kind=='machines':
        for cx,cy,r in ((.34,.49,.12),(.62,.42,.095),(.58,.68,.075)): c.circle(x+w*cx,y+h*cy,w*r,fill=0,stroke=1); c.circle(x+w*cx,y+h*cy,w*r*.3,fill=0,stroke=1)
        c.line(x+w*.12,y+h*.16,x+w*.88,y+h*.16)
    elif kind=='corridor':
        c.line(x+w*.12,y+h*.16,x+w*.50,y+h*.80); c.line(x+w*.88,y+h*.16,x+w*.50,y+h*.80); c.line(x+w*.12,y+h*.16,x+w*.88,y+h*.16)
        for t in (.25,.40,.60,.75): c.rect(x+w*(t-.055),y+h*.18,w*.11,h*.22,fill=0,stroke=1)

def object_art(c,x,y,w,h,kind,bw=False):
    bg=HexColor('#181511') if not bw else HexColor('#EEEEEE'); fg=GOLD2 if not bw else HexColor('#333333'); c.setFillColor(bg); c.roundRect(x,y,w,h,3*mm,fill=1,stroke=0); c.setStrokeColor(fg); c.setFillColor(fg); c.setLineWidth(1.5); cx=x+w*.5; cy=y+h*.5
    if kind=='key':
        c.circle(x+w*.32,cy,w*.09,fill=0,stroke=1); c.line(x+w*.41,cy,x+w*.79,cy); c.line(x+w*.68,cy,x+w*.68,y+h*.38); c.line(x+w*.76,cy,x+w*.76,y+h*.42); c.setFont('Times-Bold',w*.10); c.drawCentredString(cx,y+h*.18,'317')
    elif kind=='clock':
        c.circle(cx,cy,w*.22,fill=0,stroke=1); c.line(cx,cy,cx,cy+w*.13); c.line(cx,cy,cx+w*.12,cy-w*.08); c.setFont('Helvetica-Bold',w*.075); c.drawCentredString(cx,y+h*.17,'03:17')
    elif kind=='cassette':
        c.roundRect(x+w*.16,y+h*.30,w*.68,h*.38,5,fill=0,stroke=1); c.circle(x+w*.35,y+h*.49,w*.07,fill=0,stroke=1); c.circle(x+w*.65,y+h*.49,w*.07,fill=0,stroke=1); c.line(x+w*.28,y+h*.35,x+w*.72,y+h*.35)
    elif kind=='blueprint':
        c.rect(x+w*.20,y+h*.17,w*.60,h*.66,fill=0,stroke=1); c.rect(x+w*.29,y+h*.29,w*.18,h*.22,fill=0,stroke=1); c.rect(x+w*.53,y+h*.40,w*.17,h*.27,fill=0,stroke=1); c.setStrokeColor(RED if not bw else fg); c.line(x+w*.59,y+h*.20,x+w*.82,y+h*.37)
    elif kind=='camera':
        c.roundRect(x+w*.20,y+h*.29,w*.60,h*.42,5,fill=0,stroke=1); c.circle(cx,y+h*.50,w*.14,fill=0,stroke=1); c.rect(x+w*.28,y+h*.70,w*.18,h*.07,fill=0,stroke=1); c.line(x+w*.31,y+h*.21,x+w*.69,y+h*.21)
    elif kind=='medallion':
        c.circle(cx,y+h*.46,w*.20,fill=0,stroke=1); c.circle(cx,y+h*.46,w*.11,fill=0,stroke=1); c.arc(x+w*.30,y+h*.40,x+w*.70,y+h*.92,20,140); c.line(cx,y+h*.41,cx,y+h*.54); c.line(cx-w*.05,y+h*.48,cx+w*.05,y+h*.48)

def entity_card(c,x,y,w,h,code,name,sub,kind,key,bw=False):
    c.setFillColor(Color(0,0,0,.08)); c.roundRect(x+1.3*mm,y-1.3*mm,w,h,3*mm,fill=1,stroke=0)
    c.setFillColor(HexColor('#F6EFE4') if not bw else white); c.setStrokeColor(INK); c.setLineWidth(.8); c.roundRect(x,y,w,h,3*mm,fill=1,stroke=1)
    artH=h*.58
    if kind=='char': silhouette(c,x+4*mm,y+h-artH-4*mm,w-8*mm,artH,key,bw)
    elif kind=='loc': location_art(c,x+4*mm,y+h-artH-4*mm,w-8*mm,artH,key,bw)
    else: object_art(c,x+4*mm,y+h-artH-4*mm,w-8*mm,artH,key,bw)
    c.setFillColor(RED if not bw else black); c.setFont('Helvetica-Bold',7); c.drawString(x+5*mm,y+20*mm,code)
    c.setFillColor(INK); c.setFont('Times-Bold',12.5); c.drawString(x+5*mm,y+14.5*mm,safe(name))
    wrap(c,sub,x+5*mm,y+9.5*mm,w-10*mm,'Helvetica',6.9,8,MUTED,2)
    c.setStrokeColor(LINE); c.setDash(2,2); c.roundRect(x,y,w,h,3*mm,fill=0,stroke=1); c.setDash()

def cards_page(c,pno,title,items,kind,bw=False):
    page_header(c,pno,'ARCHIVO RECORTABLE',title,'Recortá por la guía punteada. Ninguna carta revela la solución.',False)
    margin=17*mm; gap=7*mm; top=H-38*mm; bottom=18*mm; cw=(W-2*margin-gap)/2; ch=(top-bottom-2*gap)/3
    for i,it in enumerate(items):
        col=i%2; row=i//2; x=margin+col*(cw+gap); y=top-(row+1)*ch-row*gap
        if kind=='char': code,name,role,phrase,key=it; sub=f'{role} • {phrase}'
        else: code,name,key=it; sub='Elemento del expediente Hotel Orfeo.'
        entity_card(c,x,y,cw,ch,code,name,sub,kind,key,bw)
    footer(c,pno); c.showPage()

def note_box(c,x,y,w,h,title,accent=GOLD):
    c.setFillColor(Color(1,1,1,.38)); c.setStrokeColor(LINE); c.roundRect(x,y,w,h,2.5*mm,fill=1,stroke=1)
    c.setFillColor(accent); c.setFont('Helvetica-Bold',7.2); c.drawString(x+4*mm,y+h-6*mm,title.upper())
    c.setStrokeColor(Color(.2,.15,.1,.16)); c.setLineWidth(.35)
    yy=y+h-11*mm
    while yy>y+4*mm:
        c.line(x+4*mm,yy,x+w-4*mm,yy); yy-=7*mm

def cover(c):
    aged_bg(c,True)
    c.setStrokeColor(GOLD); c.setLineWidth(.7); c.rect(12*mm,12*mm,W-24*mm,H-24*mm,fill=0,stroke=1)
    c.setStrokeColor(Color(.64,.46,.28,.35)); c.rect(15*mm,15*mm,W-30*mm,H-30*mm,fill=0,stroke=1)
    c.setFillColor(GOLD2); c.setFont('Helvetica-Bold',8); c.drawCentredString(W/2,H-24*mm,'EXPEDIENTES  •  CASO 002  •  ARCHIVO DE MESA')
    c.setFillColor(CREAM); c.setFont('Times-Bold',21); c.drawCentredString(W/2,H-43*mm,'LA HABITACIÓN QUE NO EXISTE')
    c.setFillColor(GOLD2); c.setFont('Times-Bold',41); c.drawCentredString(W/2,H-59*mm,'HOTEL ORFEO')
    c.setFillColor(HexColor('#B7A995')); c.setFont('Times-Italic',12.5); c.drawCentredString(W/2,H-70*mm,'"Algunas puertas fueron cerradas por una razón."')
    draw_door(c,W/2-40*mm,H/2-52*mm,80*mm,112*mm,'317',True)
    stamp(c,25*mm,41*mm,'ARCHIVO RESERVADO',-4,RED2)
    c.setFillColor(GOLD2); c.setFont('Helvetica-Bold',8); c.drawRightString(W-20*mm,43*mm,'KIT IMPRIMIBLE • 22 A4')
    c.setFillColor(HexColor('#A99B8A')); c.setFont('Helvetica',7.4); c.drawRightString(W-20*mm,37*mm,'Compatible con ENGINE P2 • sin solución fija')
    c.showPage()

def guide(c,pno):
    page_header(c,pno,'GUÍA DE CAMPO','Cómo usar este expediente','El juego digital conserva la solución, el reloj y los roles privados.',False)
    x=17*mm; y=H-54*mm; w=W-34*mm
    c.setFillColor(HexColor('#F7F0E5')); c.setStrokeColor(LINE); c.roundRect(x,y-158*mm,w,158*mm,3*mm,fill=1,stroke=1)
    c.setFillColor(NIGHT); c.rect(x,y-19*mm,w,19*mm,fill=1,stroke=0)
    c.setFillColor(GOLD2); c.setFont('Times-Bold',16); c.drawString(x+7*mm,y-12*mm,'HOTEL ORFEO • DOSSIER DE INVESTIGACIÓN')
    steps=[('01','ANTES DE JUGAR','Imprimí las cartas y las hojas que quieras usar. El juego funciona también sin imprimir.'),('02','DURANTE LA PARTIDA','Ordená sospechosos, lugares y objetos mientras cada teléfono recibe eventos y pistas.'),('03','HABITACIÓN 317','La 317 es un área narrativa especial. No reemplaza a ninguno de los seis lugares posibles.'),('04','SIN SPOILERS','Este expediente no contiene la combinación ganadora. Cada sesión P2 congela una solución distinta.'),('05','IMPRESIÓN','A4, tamaño real 100%. Para cartas: 160-220 g o papel común pegado sobre cartulina.')]
    yy=y-32*mm
    for n,t,b in steps:
        c.setFillColor(RED); c.circle(x+10*mm,yy+2*mm,5*mm,fill=1,stroke=0); c.setFillColor(CREAM); c.setFont('Helvetica-Bold',7); c.drawCentredString(x+10*mm,yy,n)
        c.setFillColor(INK); c.setFont('Helvetica-Bold',8); c.drawString(x+20*mm,yy+4*mm,t)
        wrap(c,b,x+20*mm,yy-1*mm,w-29*mm,'Helvetica',8.1,10,MUTED,3)
        yy-=25*mm
    c.setFillColor(HexColor('#F0E0CF')); c.setStrokeColor(RED); c.roundRect(x+7*mm,y-151*mm,w-14*mm,22*mm,2*mm,fill=1,stroke=1)
    c.setFillColor(RED); c.setFont('Helvetica-Bold',7.5); c.drawString(x+12*mm,y-137*mm,'IMPORTANTE')
    wrap(c,'No compartas identidades privadas ni alertas del impostor. Esas piezas permanecen exclusivamente dentro del juego digital.',x+12*mm,y-143*mm,w-24*mm,'Helvetica',8.1,9.6,INK,3)
    footer(c,pno); c.showPage()

def summary(c,pno):
    page_header(c,pno,'EXPEDIENTE','Resumen del caso','Material de ambientación. No determina la solución dinámica.',False)
    x=17*mm; top=H-48*mm
    c.setFillColor(NIGHT); c.roundRect(x,top-34*mm,W-34*mm,34*mm,3*mm,fill=1,stroke=0)
    c.setFillColor(GOLD2); c.setFont('Times-Bold',14); c.drawString(x+8*mm,top-12*mm,'UN HOTEL CERRADO DURANTE DÉCADAS.')
    c.setFillColor(CREAM); wrap(c,'Seis invitados. Una desaparición a las 03:17. Y una puerta que no debería existir.',x+8*mm,top-20*mm,W-50*mm,'Times-Roman',12,15,CREAM,2)
    events=[('UNA SEMANA ANTES','Seis personas reciben invitaciones sin explicación.'),('ESA NOCHE','León Valdés abre una caja con fotografías, documentos y una cinta.'),('03:17','Cae la energía. Suena la campana. Se oyen tres golpes.'),('03:18','La electricidad vuelve. León desapareció. La llave ya no está.'),('TERCER PISO','Entre 316 y 318 aparece la puerta 317, ausente de los planos.'),('OBJETIVO','Reconstruir PERSONA + LUGAR + OBJETO usando evidencia compartida y privada.')]
    yy=top-48*mm
    c.setStrokeColor(GOLD); c.setLineWidth(1.1); c.line(x+6*mm,yy+5*mm,x+6*mm,yy-98*mm)
    for i,(t,b) in enumerate(events):
        c.setFillColor(RED if i in (2,3) else GOLD); c.circle(x+6*mm,yy,2.6*mm,fill=1,stroke=0)
        c.setFillColor(RED if i in (2,3) else INK); c.setFont('Helvetica-Bold',8); c.drawString(x+14*mm,yy+2*mm,t)
        wrap(c,b,x+14*mm,yy-4*mm,W-x-34*mm,'Helvetica',8.3,10,MUTED,2)
        yy-=18*mm
    stamp(c,W-72*mm,31*mm,'03:17',-7,RED)
    footer(c,pno); c.showPage()

def board(c,pno):
    page_header(c,pno,'TABLERO','Mapa de investigación','Marcá, descartá o conectá elementos a medida que avance la partida.',False)
    cols=[('PERSONAS',chars,'char'),('LUGARES',locs,'loc'),('OBJETOS',objs,'obj')]
    margin=14*mm; gap=4*mm; cw=(W-2*margin-2*gap)/3; y0=H-50*mm
    for ci,(title,items,kind) in enumerate(cols):
        x=margin+ci*(cw+gap)
        c.setFillColor(NIGHT); c.roundRect(x,y0-9*mm,cw,9*mm,2*mm,fill=1,stroke=0); c.setFillColor(GOLD2); c.setFont('Helvetica-Bold',7.5); c.drawCentredString(x+cw/2,y0-5.8*mm,title)
        yy=y0-13*mm
        for it in items:
            code,name=it[0],it[1]
            c.setFillColor(HexColor('#F7F0E6')); c.setStrokeColor(LINE); c.roundRect(x,yy-25*mm,cw,23*mm,2*mm,fill=1,stroke=1)
            c.setFillColor(RED); c.setFont('Helvetica-Bold',6.5); c.drawString(x+3*mm,yy-6*mm,code)
            c.setFillColor(INK); c.setFont('Times-Bold',9.3); wrap(c,name,x+3*mm,yy-12*mm,cw-6*mm,'Times-Bold',9.2,10,INK,2)
            c.setStrokeColor(MUTED); c.rect(x+3*mm,yy-22*mm,3.5*mm,3.5*mm,fill=0,stroke=1); c.rect(x+11*mm,yy-22*mm,3.5*mm,3.5*mm,fill=0,stroke=1)
            c.setFillColor(MUTED); c.setFont('Helvetica',5.8); c.drawString(x+16*mm,yy-21.2*mm,'investigado / descartado')
            yy-=27*mm
    c.setFillColor(HexColor('#EFE2D1')); c.setStrokeColor(GOLD); c.roundRect(14*mm,20*mm,W-28*mm,18*mm,2*mm,fill=1,stroke=1)
    c.setFillColor(RED); c.setFont('Helvetica-Bold',7); c.drawString(19*mm,31*mm,'LEYENDA')
    wrap(c,'Usá líneas o notas para registrar conexiones. La habitación 317 se trata aparte como área narrativa.',19*mm,26*mm,W-38*mm,'Helvetica',7.8,9,MUTED,2)
    footer(c,pno); c.showPage()

def room317(c,pno):
    page_header(c,pno,'ÁREA ESPECIAL','HABITACIÓN 317','Se desbloquea durante la investigación. Aporta contexto histórico y no forma parte del random de Lugar.',True)
    draw_door(c,18*mm,H-160*mm,67*mm,100*mm,'317',True)
    c.setFillColor(CREAM); c.setFont('Times-Bold',17); c.drawString(98*mm,H-67*mm,'LA HABITACIÓN NUNCA DEJÓ DE EXISTIR.')
    wrap(c,'Fue sellada. La Central habilita su exploración cuando la anomalía arquitectónica queda confirmada.',98*mm,H-78*mm,W-116*mm,'Times-Roman',10.5,13,HexColor('#CDBEA9'),5)
    items=[('01','GRABADOR ANTIGUO','Marcas de uso y restos de cinta. Alguien retiró una grabación antes del sellado.'),('02','MIRILLA INTERIOR','La orientación permite observar sectores del hotel sin quedar expuesto desde el pasillo.'),('03','FOTOGRAFÍAS','Varias imágenes fueron tomadas desde ángulos imposibles para un huésped.'),('04','PANEL DE CABLEADO','Los conductos no pertenecen a calefacción ni ventilación.'),('05','PLACA 317','La numeración coincide con el espacio faltante entre 316 y 318.')]
    yy=H-112*mm
    for n,t,b in items:
        c.setFillColor(PANEL); c.setStrokeColor(HexColor('#5B4430')); c.roundRect(97*mm,yy-24*mm,W-114*mm,21*mm,2.3*mm,fill=1,stroke=1)
        c.setFillColor(GOLD2); c.setFont('Helvetica-Bold',7.2); c.drawString(101*mm,yy-10*mm,n+'  '+t)
        wrap(c,b,101*mm,yy-15*mm,W-122*mm,'Helvetica',7.3,8.4,HexColor('#AFA08C'),3)
        yy-=26*mm
    stamp(c,26*mm,31*mm,'ACCESO RESTRINGIDO',-4,RED2)
    footer(c,pno,True); c.showPage()

def evidence_header(c,pno,letter,title,subtitle):
    page_header(c,pno,f'DOCUMENTO {letter}',title,subtitle,False)
    stamp(c,W-61*mm,H-43*mm,'EVIDENCIA',-3,RED)

def ledger(c,pno):
    evidence_header(c,pno,'A','Registro de 1968','Recreación imprimible del documento mencionado por la Central.')
    x=18*mm; y=H-58*mm; w=W-36*mm; h=174*mm
    c.setFillColor(HexColor('#F7EFE1')); c.setStrokeColor(INK); c.rect(x,y-h,w,h,fill=1,stroke=1)
    c.setFillColor(NIGHT); c.rect(x,y-17*mm,w,17*mm,fill=1,stroke=0); c.setFillColor(GOLD2); c.setFont('Times-Bold',15); c.drawCentredString(W/2,y-10.5*mm,'HOTEL ORFEO • REGISTRO DE HUÉSPEDES • 1968')
    cols=[22,54,88,112,170]; headers=['FECHA','NOMBRE','HAB.','OBSERVACIÓN']; yy=y-29*mm
    c.setFillColor(INK); c.setFont('Helvetica-Bold',7)
    for i,hdr in enumerate(headers): c.drawString(x+cols[i]*mm/2.0,yy,hdr)
    c.setStrokeColor(LINE); c.line(x+5*mm,yy-3*mm,x+w-5*mm,yy-3*mm)
    rows=[('12/06','L. Ferrer','216','Firma ilegible'),('13/06','V. Salvatierra','208','Salida anticipada'),('13/06','A. Montenegro','302','Sin equipaje'),('14/06','D. Orsini','-','Registro parcial'),('14/06','Valdés','318','Apellido visible'),('15/06','[PÁGINAS ARRANCADAS]','-','-')]
    yy-=13*mm; c.setFont('Times-Roman',9)
    for r in rows:
        c.setFillColor(RED if 'ARRANCADAS' in r[1] else INK); c.drawString(x+8*mm,yy,r[0]); c.drawString(x+42*mm,yy,r[1]); c.drawString(x+91*mm,yy,r[2]); c.drawString(x+113*mm,yy,r[3])
        c.setStrokeColor(Color(.2,.15,.1,.18)); c.line(x+6*mm,yy-4*mm,x+w-6*mm,yy-4*mm); yy-=18*mm
    c.setFillColor(HexColor('#EFE0CA')); c.setStrokeColor(RED); c.roundRect(x+8*mm,y-h+12*mm,w-16*mm,31*mm,2*mm,fill=1,stroke=1)
    c.setFillColor(RED); c.setFont('Helvetica-Bold',7); c.drawString(x+13*mm,y-h+34*mm,'NOTA DE CENTRAL')
    wrap(c,'Varias páginas del registro original fueron arrancadas. Los apellidos visibles aportan contexto histórico; no confirman por sí solos a la persona responsable.',x+13*mm,y-h+27*mm,w-26*mm,'Helvetica',8,9.5,INK,4)
    footer(c,pno); c.showPage()

def blueprint(c,pno):
    evidence_header(c,pno,'B','Anomalía arquitectónica','Plano esquemático del tercer piso. Recreación para uso de mesa.')
    x=17*mm; y=H-60*mm; w=W-34*mm; h=174*mm
    c.setFillColor(HexColor('#E4D8C4')); c.setStrokeColor(HexColor('#6F6558')); c.rect(x,y-h,w,h,fill=1,stroke=1)
    c.setStrokeColor(Color(.18,.22,.22,.12)); c.setLineWidth(.25); step=5*mm; xx=x
    while xx<x+w: c.line(xx,y-h,xx,y); xx+=step
    yy=y-h
    while yy<y: c.line(x,yy,x+w,yy); yy+=step
    c.setStrokeColor(INK); c.setLineWidth(1.2); base=y-94*mm
    rooms=[('314',.07,.14),('315',.22,.14),('316',.37,.14),('317?',.53,.12),('318',.66,.14),('319',.81,.12)]
    for label,rx,rw in rooms:
        c.rect(x+w*rx,base,w*rw,44*mm,fill=0,stroke=1); c.setFont('Times-Bold',11); c.setFillColor(RED if '?' in label else INK); c.drawCentredString(x+w*(rx+rw/2),base+22*mm,label)
    c.setFillColor(INK); c.setFont('Helvetica-Bold',7); c.drawCentredString(W/2,base-8*mm,'PASILLO DEL TERCER PISO')
    c.setStrokeColor(RED); c.setLineWidth(2); c.line(x+w*.51,base+50*mm,x+w*.66,base+50*mm); c.line(x+w*.51,base+47*mm,x+w*.51,base+53*mm); c.line(x+w*.66,base+47*mm,x+w*.66,base+53*mm)
    c.setFillColor(RED); c.setFont('Helvetica-Bold',8); c.drawCentredString(x+w*.585,base+55*mm,'≈ 3,8 m SIN EXPLICACIÓN')
    c.setFillColor(HexColor('#F1E4D1')); c.setStrokeColor(GOLD); c.roundRect(x+10*mm,y-h+12*mm,w-20*mm,29*mm,2*mm,fill=1,stroke=1)
    c.setFillColor(RED); c.setFont('Helvetica-Bold',7); c.drawString(x+15*mm,y-h+32*mm,'HALLAZGO')
    wrap(c,'Las medidas exteriores del tercer piso no coinciden con los planos. Falta espacio físico entre 316 y 318.',x+15*mm,y-h+25*mm,w-30*mm,'Helvetica',8,9.5,INK,3)
    footer(c,pno); c.showPage()

def cassette_doc(c,pno,letter,fragment,quote):
    evidence_header(c,pno,letter,f'Cinta - Fragmento {fragment}','Transcripción entregada durante la investigación.')
    object_art(c,19*mm,H-111*mm,72*mm,48*mm,'cassette',False)
    c.setFillColor(NIGHT); c.roundRect(101*mm,H-160*mm,W-119*mm,92*mm,3*mm,fill=1,stroke=0)
    c.setFillColor(GOLD2); c.setFont('Helvetica-Bold',7); c.drawString(108*mm,H-81*mm,f'TRANSCRIPCIÓN / CANAL {fragment}')
    c.setFillColor(CREAM); wrap(c,quote,108*mm,H-94*mm,W-133*mm,'Times-Italic',14,18,CREAM,8)
    c.setStrokeColor(GOLD); c.setLineWidth(1); mid=H-147*mm; x0=108*mm; x1=W-25*mm
    for i in range(48):
        xx=x0+(x1-x0)*i/47; amp=(4+9*abs(math.sin(i*.73)))*mm/3; c.line(xx,mid-amp,xx,mid+amp)
    note_box(c,19*mm,29*mm,W-38*mm,49*mm,'ANOTACIONES DEL EQUIPO',GOLD)
    footer(c,pno); c.showPage()

def blackout(c,pno):
    evidence_header(c,pno,'D','Informe del apagón - 03:17','Registro técnico recreado para acompañar el evento del juego.')
    x=18*mm; y=H-58*mm
    c.setFillColor(NIGHT); c.roundRect(x,y-67*mm,W-36*mm,62*mm,3*mm,fill=1,stroke=0)
    c.setFillColor(GOLD2); c.setFont('Helvetica-Bold',7); c.drawString(x+7*mm,y-15*mm,'REGISTRO DEL TABLERO AUXILIAR')
    rows=[('03:16:54','Tensión estable.'),('03:17:02','Corte total de iluminación.'),('03:17:05','Tablero auxiliar: accionamiento manual.'),('03:17:41','Campana de recepción: un pulso.'),('03:18:03','Servicio restablecido.')]; yy=y-26*mm
    for t,b in rows:
        c.setFillColor(RED2 if t.startswith('03:17') else GOLD2); c.setFont('Helvetica-Bold',8); c.drawString(x+7*mm,yy,t); c.setFillColor(CREAM); c.setFont('Helvetica',8.4); c.drawString(x+35*mm,yy,b); yy-=9*mm
    gy=H-170*mm; c.setFillColor(HexColor('#F7EFE4')); c.setStrokeColor(LINE); c.roundRect(x,gy-54*mm,W-36*mm,54*mm,3*mm,fill=1,stroke=1)
    c.setFillColor(INK); c.setFont('Helvetica-Bold',7); c.drawString(x+7*mm,gy-10*mm,'TENSIÓN / 03:16:40 - 03:18:10')
    c.setStrokeColor(GOLD); c.setLineWidth(1.6); pts=[]
    for i in range(44):
        xx=x+9*mm+i*(W-54*mm)/43; val=gy-42*mm if 15<=i<=27 else gy-24*mm + math.sin(i*.8)*1.5*mm; pts.append((xx,val))
    for a,b in zip(pts,pts[1:]): c.line(a[0],a[1],b[0],b[1])
    c.setStrokeColor(RED); c.setDash(2,2); c.line(x+9*mm+15*(W-54*mm)/43,gy-48*mm,x+9*mm+15*(W-54*mm)/43,gy-15*mm); c.setDash()
    c.setFillColor(RED); c.setFont('Helvetica-Bold',6.5); c.drawString(x+9*mm+15*(W-54*mm)/43+2*mm,gy-17*mm,'03:17')
    c.setFillColor(HexColor('#F1E2D0')); c.setStrokeColor(RED); c.roundRect(x,24*mm,W-36*mm,31*mm,2*mm,fill=1,stroke=1)
    c.setFillColor(RED); c.setFont('Helvetica-Bold',7); c.drawString(x+7*mm,45*mm,'CONCLUSIÓN')
    wrap(c,'La tormenta no provocó el corte de las 03:17. El tablero auxiliar fue accionado desde el interior del hotel.',x+7*mm,38*mm,W-50*mm,'Helvetica',8.4,10,INK,3)
    footer(c,pno); c.showPage()

def polaroid(c,pno):
    evidence_header(c,pno,'F','Polaroid - 03:12','Evidencia fotográfica recreada. La cronología es más importante que la imagen exacta.')
    c.saveState(); c.translate(30*mm,H-182*mm); c.rotate(-3); c.setFillColor(HexColor('#EEE8DE')); c.setStrokeColor(HexColor('#C8BFB1')); c.setLineWidth(.8); c.rect(0,0,83*mm,108*mm,fill=1,stroke=1); draw_door(c,6*mm,31*mm,71*mm,70*mm,'317',True); c.setFillColor(INK); c.setFont('Helvetica-Bold',8); c.drawCentredString(41.5*mm,16*mm,'03:12'); c.restoreState()
    c.setFillColor(NIGHT); c.roundRect(122*mm,H-172*mm,W-140*mm,79*mm,3*mm,fill=1,stroke=0)
    c.setFillColor(GOLD2); c.setFont('Times-Bold',17); c.drawString(130*mm,H-111*mm,'LA PUERTA YA ESTABA ABIERTA.')
    c.setFillColor(CREAM); wrap(c,'La puerta 317 aparece abierta cinco minutos antes del apagón. No surgió durante el corte: alguien la había abierto antes.',130*mm,H-125*mm,W-153*mm,'Times-Roman',11.5,15,CREAM,6)
    stamp(c,129*mm,H-160*mm,'ANTES DEL CORTE',-2,RED2); footer(c,pno); c.showPage()

def box_doc(c,pno):
    evidence_header(c,pno,'G','La caja de León','Inventario de referencia para acompañar el primer evento narrativo.')
    x=25*mm; y=H-72*mm; w=W-50*mm; h=145*mm
    c.setFillColor(HexColor('#C2A77E')); c.setStrokeColor(HexColor('#6C5136')); c.setLineWidth(1.1); c.roundRect(x,y-h,w,h,5*mm,fill=1,stroke=1); c.setStrokeColor(HexColor('#7A5D3D')); c.line(x+w/2,y-h,x+w/2,y); c.line(x,y-h+22*mm,x+w,y-h+22*mm)
    c.setFillColor(NIGHT); c.setFont('Times-Bold',18); c.drawCentredString(W/2,y-17*mm,'L. V.')
    items=[('01','FOTOGRAFÍAS','Varias tomas antiguas del hotel.'),('02','DOCUMENTOS','Papeles y copias vinculadas al pasado del Orfeo.'),('03','CINTA','Grabación conservada dentro de la caja.'),('04','HUECO DE LLAVE','Falta una pieza con la forma de una llave.')]; yy=y-40*mm
    for n,t,b in items:
        c.setFillColor(HexColor('#EFE2CC')); c.setStrokeColor(HexColor('#8B6B45')); c.roundRect(x+10*mm,yy-21*mm,w-20*mm,18*mm,2*mm,fill=1,stroke=1); c.setFillColor(RED); c.setFont('Helvetica-Bold',7); c.drawString(x+15*mm,yy-9*mm,n+'  '+t); c.setFillColor(INK); c.setFont('Helvetica',8); c.drawString(x+15*mm,yy-15*mm,b); yy-=25*mm
    footer(c,pno); c.showPage()

def connections(c,pno):
    page_header(c,pno,'HOJA DE TRABAJO','Conexiones e hipótesis','Usá esta página para registrar pares y teorías antes de acusar.',False)
    note_box(c,17*mm,H-111*mm,W-34*mm,55*mm,'PERSONA + LUGAR',RED); note_box(c,17*mm,H-174*mm,W-34*mm,55*mm,'PERSONA + OBJETO',GOLD); note_box(c,17*mm,H-237*mm,W-34*mm,55*mm,'LUGAR + OBJETO',GOLD); footer(c,pno); c.showPage()

def logbook(c,pno):
    page_header(c,pno,'HOJA DE TRABAJO','Bitácora de investigación','Cronología, contradicciones y evidencia crítica.',False)
    x=17*mm; w=W-34*mm; y=H-53*mm
    sections=[('CRONOLOGÍA',['Hora / evento','Quién lo confirma','Qué cambia']),('CONTRADICCIONES',['Declaración','Prueba que la contradice','Qué descarta']),('EVIDENCIA CRÍTICA',['Pista','Categoría','Impacto en la teoría'])]
    for title,heads in sections:
        c.setFillColor(NIGHT); c.roundRect(x,y-9*mm,w,9*mm,2*mm,fill=1,stroke=0); c.setFillColor(GOLD2); c.setFont('Helvetica-Bold',7); c.drawString(x+4*mm,y-6*mm,title); yy=y-13*mm; colw=w/3
        c.setFillColor(HexColor('#EADBC6')); c.setStrokeColor(LINE); c.rect(x,yy-10*mm,w,10*mm,fill=1,stroke=1); c.setFillColor(INK); c.setFont('Helvetica-Bold',6.5)
        for i,h in enumerate(heads): c.drawString(x+i*colw+3*mm,yy-6.5*mm,h)
        yy-=10*mm
        for r in range(3):
            c.setFillColor(Color(1,1,1,.35)); c.setStrokeColor(LINE); c.rect(x,yy-14*mm,w,14*mm,fill=1,stroke=1); c.line(x+colw,yy-14*mm,x+colw,yy); c.line(x+2*colw,yy-14*mm,x+2*colw,yy); yy-=14*mm
        y=yy-7*mm
    footer(c,pno); c.showPage()

def accusation(c,pno):
    page_header(c,pno,'HOJA FINAL','Acusación del equipo','Completá antes de enviar la acusación en el juego digital.',False)
    x=18*mm; top=H-55*mm; w=W-36*mm; fields=[('PERSONA','P__   Nombre:'),('LUGAR','L__   Lugar:'),('OBJETO','O__   Objeto:')]; yy=top
    for title,label in fields:
        c.setFillColor(HexColor('#F8F1E6')); c.setStrokeColor(INK); c.roundRect(x,yy-34*mm,w,29*mm,3*mm,fill=1,stroke=1); c.setFillColor(RED); c.setFont('Helvetica-Bold',7); c.drawString(x+6*mm,yy-13*mm,title); c.setFillColor(INK); c.setFont('Times-Bold',13); c.drawString(x+30*mm,yy-14*mm,label); c.setStrokeColor(LINE); c.line(x+30*mm,yy-21*mm,x+w-8*mm,yy-21*mm); yy-=39*mm
    note_box(c,x,yy-55*mm,w,50*mm,'TEORÍA EN UNA FRASE',RED); yy-=65*mm
    c.setFillColor(NIGHT); c.roundRect(x,yy-25*mm,w,22*mm,3*mm,fill=1,stroke=0); c.setFillColor(GOLD2); c.setFont('Helvetica-Bold',7); c.drawString(x+6*mm,yy-10*mm,'CONFIANZA DEL EQUIPO')
    for i,l in enumerate(['BAJA','MEDIA','ALTA']):
        xx=x+62*mm+i*34*mm; c.setStrokeColor(GOLD); c.rect(xx,yy-15*mm,4*mm,4*mm,fill=0,stroke=1); c.setFillColor(CREAM); c.setFont('Helvetica-Bold',7); c.drawString(xx+6*mm,yy-14.4*mm,l)
    footer(c,pno); c.showPage()

def checklist(c,pno):
    page_header(c,pno,'CIERRE','Checklist de impresión','Elegí sólo las páginas que quieras usar. El juego funciona incluso sin imprimir.',True)
    items=['Cartas de personajes (color o B/N)','Cartas de lugares (color o B/N)','Cartas de objetos (color o B/N)','Tablero de investigación','Habitación 317','Documentos narrativos','Hoja de conexiones','Bitácora','Acusación final']; x=26*mm; yy=H-66*mm
    for it in items:
        c.setStrokeColor(GOLD); c.rect(x,yy-3*mm,4*mm,4*mm,fill=0,stroke=1); c.setFillColor(CREAM); c.setFont('Helvetica',9.5); c.drawString(x+10*mm,yy,it); yy-=18*mm
    c.setFillColor(PANEL); c.setStrokeColor(HexColor('#5C4633')); c.roundRect(25*mm,30*mm,W-50*mm,42*mm,3*mm,fill=1,stroke=1); c.setFillColor(GOLD2); c.setFont('Helvetica-Bold',7); c.drawString(32*mm,60*mm,'RECORDATORIO')
    wrap(c,'Este kit es un soporte físico del Caso 002. La Central digital conserva el cronómetro, la solución, las pistas dinámicas, los eventos privados y la validación final.',32*mm,52*mm,W-64*mm,'Helvetica',8.5,11,HexColor('#CBBDA9'),4)
    c.setFillColor(HexColor('#8F8170')); c.setFont('Helvetica',6.6); c.drawCentredString(W/2,20*mm,'EXPEDIENTES es una obra de ficción. Todos los personajes y acontecimientos representados son ficticios.')
    footer(c,pno,True); c.showPage()

c=canvas.Canvas(OUT,pagesize=A4)
c.setTitle('EXPEDIENTES - Caso 002 - Hotel Orfeo - Kit imprimible')
cover(c)
guide(c,2)
summary(c,3)
board(c,4)
cards_page(c,5,'Personajes • color',chars,'char',False)
cards_page(c,6,'Lugares • color',locs,'loc',False)
cards_page(c,7,'Objetos • color',objs,'obj',False)
room317(c,8)
ledger(c,9)
blueprint(c,10)
cassette_doc(c,11,'C','01','VOZ FEMENINA: Si encuentran esto... no crean la versión del hotel. La habitación no fue construida para alojar huéspedes.')
blackout(c,12)
cassette_doc(c,13,'E','02','VOZ FEMENINA: Ellos creen que no escuché la grabación... Fue construida para escucharlos. La función de la 317 queda confirmada.')
polaroid(c,14)
box_doc(c,15)
connections(c,16)
logbook(c,17)
accusation(c,18)
cards_page(c,19,'Personajes • blanco y negro',chars,'char',True)
cards_page(c,20,'Lugares • blanco y negro',locs,'loc',True)
cards_page(c,21,'Objetos • blanco y negro',objs,'obj',True)
checklist(c,22)
c.save()
print(OUT)
print('sha256',hashlib.sha256(Path(OUT).read_bytes()).hexdigest())
print('size',Path(OUT).stat().st_size)
