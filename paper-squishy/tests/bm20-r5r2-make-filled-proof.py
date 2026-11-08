#!/usr/bin/env python3
"""Butter Mania R5R2: 20 actual characters on physical-size A4 printable PROOFS.

This is a non-commercial visual proof assembled exclusively from the four
embedded R5 previews. Original private commercial PDFs are NOT touched.
"""
import re,json,base64,io,hashlib
from pathlib import Path
from PIL import Image,ImageOps,ImageChops
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import landscape,A4
from reportlab.lib.utils import ImageReader
from reportlab.lib.colors import HexColor

root=Path(__file__).resolve().parents[1]
html=(root/'factory-butter-native-r5.html').read_text(encoding='utf-8')
found=re.search(r'const CHARACTERS=(\[.*?\]);\s*const VIEWS',html,re.S)
if not found:
    found=re.search(r'const CHARACTERS=(\[.*?\]);',html,re.S)
if not found: raise ValueError('Could not extract embedded R5 characters')
chars=json.loads(found.group(1))
assert len(chars)==20,len(chars)
out=root/'qa-exports'
out.mkdir(exist_ok=True)
mm=72/25.4
W,H=landscape(A4)
mag=HexColor('#f44691'); ink=HexColor('#37272e'); mute=HexColor('#696069')
dimensions=[]
def extracted_image(payload):
    assert payload.startswith('data:image/'),payload[:20]
    data=base64.b64decode(payload.split(',',1)[1])
    im=Image.open(io.BytesIO(data))
    im.load()
    # avoid any alternate format or hidden palette in reportlab
    im=im.convert('RGBA')
    alpha=im.getchannel('A')
    if alpha.getextrema()[0] != 255:
        bbox=alpha.point(lambda x: 255 if x>12 else 0).getbbox()
    else:
        bg=Image.new('RGB',im.size,'white')
        dif=ImageChops.difference(im.convert('RGB'),bg).convert('L')
        bbox=dif.point(lambda x:255 if x>34 else 0).getbbox()
    if not bbox:raise ValueError('Empty character image')
    # transparency to white (printing) and true content crop
    im=im.crop(bbox)
    comp=Image.new('RGBA',im.size,'white')
    comp.alpha_composite(im)
    return comp.convert('RGB'),bbox

def label(c,code,name,variant):
    c.setFillColor(mag);c.rect(12*mm,H-19*mm,W-24*mm,1.2*mm,fill=1,stroke=0)
    c.setFillColor(ink);c.setFont('Helvetica-Bold',19);c.drawString(12*mm,H-13*mm,'BUTTER MANIA  /  '+code)
    c.setFont('Helvetica',10);c.setFillColor(mute);c.drawRightString(W-12*mm,H-12.2*mm,name)
    c.setFont('Helvetica-Bold',10);c.setFillColor(ink);c.drawString(13*mm,H-27*mm,'FRENTE')
    c.drawString(164*mm,H-27*mm,'DORSO')
    c.setFillColor(mute);c.setFont('Helvetica',7.5)
    c.drawString(12*mm,15*mm,'PRUEBA VISUAL R5R2  |  Imprimir A4 apaisado al 100%. No es el PDF comercial.')
    c.drawRightString(W-12*mm,15*mm,f'{variant.upper()}  |  {code}')
    c.setStrokeColor(HexColor('#ded5d4'));c.line(148.5*mm,34*mm,148.5*mm,H-34*mm)
    # useful measurement marker
    c.setLineWidth(.5);c.setStrokeColor(ink)
    c.rect(12*mm,6*mm,20*mm,4*mm,fill=0,stroke=1)
    c.setFont('Helvetica',6.3);c.drawString(33*mm,7*mm,'20 mm')

for color in (True,False):
    target=out/('BM20_R5R2_20_Personajes_Color_Prueba_A4.pdf' if color else 'BM20_R5R2_20_Personajes_BN_Prueba_A4.pdf')
    c=canvas.Canvas(str(target),pagesize=landscape(A4),pageCompression=1)
    for index,ch in enumerate(chars):
        code,name=ch['code'],ch['name']
        w_mm,h_mm=map(float,ch['cut_mm'])
        keys=['front_color','back_color'] if color else ['front_bn','back_bn']
        label(c,code,name,'color' if color else 'blanco y negro')
        for side,key in enumerate(keys):
            im,bbox=extracted_image(ch['images'][key])
            dimensions.append({'code':code,'variant':key,'raw_size':len(base64.b64decode(ch['images'][key].split(',',1)[1])),
                               'cropped_size':im.size,'content_bbox':bbox,'cut_mm':[w_mm,h_mm]})
            # 120mm char within each A4 landscape half, as specified by original dimension manifest.
            # Ratio remains exact: constrain if embedded preview proportionality differs.
            aspect=im.width/im.height
            target_aspect=w_mm/h_mm
            if abs(aspect/target_aspect-1)>0.09:
                print('RATIO_WARNING',code,key,round(aspect/target_aspect-1,3))
            draw_w=w_mm*mm
            draw_h=(draw_w/aspect)
            if draw_h>120*mm:
                draw_h=120*mm
                draw_w=draw_h*aspect
            center_x=(74 if side==0 else 222)*mm
            center_y=(105)*mm
            x=center_x-draw_w/2;y=center_y-draw_h/2
            c.drawImage(ImageReader(im),x,y,width=draw_w,height=draw_h,mask='auto')
            c.setFillColor(mute)
            c.setFont('Helvetica',7)
            c.drawCentredString(center_x,31*mm,f'Corte previsto: {w_mm:.1f} x {h_mm:.1f} mm')
        c.showPage()
    c.save()
    print('GENERATED',target.name,'pages',len(chars),'bytes',target.stat().st_size)
(out/'bm20-r5r2-embedded-previews.json').write_text(json.dumps(dimensions,ensure_ascii=False,indent=2))
