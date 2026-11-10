#!/usr/bin/env python3
"""PSQ80: build the original 60 as new A4 landscape two-up PDFs from protected-stable v2.7 public print art.
No overwrite of legacy 60 master, factory or Butter commercial PDF.
"""
import io,json,hashlib,re,os,base64,zipfile
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor,as_completed
from PIL import Image,ImageChops,ImageOps,ImageDraw
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import landscape,A4
from reportlab.lib.utils import ImageReader
from reportlab.lib.colors import HexColor
import requests

ROOT=Path(__file__).resolve().parent
manifest=json.loads((ROOT/'manifest.json').read_text())
assert len(manifest['original60'])==60
BASE='https://fzbndgfnqxcacsvlitui.supabase.co/storage/v1/object/public/paper-squishy-assets/'
DEST=ROOT/'generated';DEST.mkdir(parents=True,exist_ok=True)
mm=72/25.4
W,H=landscape(A4)
COLORS={'sweet_squishies':'#DF86C1','animal_cuties':'#F79B6C','food_squad':'#E8B55A','cosmic_friends':'#778CD3','magic_objects':'#A283CB','ocean_buddies':'#65B5BB'}
records=[]
def download(entry,view):
    url=BASE+entry['source_prefix']+'/'+view+'.webp'
    errors=[]
    for attempt in range(3):
        try:
            resp=requests.get(url,timeout=40)
            resp.raise_for_status()
            im=Image.open(io.BytesIO(resp.content));im.load()
            assert im.width>=850 and im.height>=1200,(url,im.size)
            return (entry['code'],view,im.copy(),url,len(resp.content),hashlib.sha256(resp.content).hexdigest())
        except Exception as e: errors.append(str(e))
    raise RuntimeError('Could not download '+url+': '+str(errors))
items=[(e,k) for e in manifest['original60'] for k in ['front_print','back_print','coloring','coloring_back']]
out={}
with ThreadPoolExecutor(max_workers=12) as pool:
 futures=[pool.submit(download,e,k) for e,k in items]
 for future in as_completed(futures):
    code,view,im,url,byte,sha=future.result()
    out[(code,view)]=im
    records.append({'code':code,'view':view,'pixels':list(im.size),'bytes':byte,'sha256':sha,'source_url':url})
assert len(out)==240

def crop_art(im):
    # Source image is an A4 PORTRAIT sheet; remove only printed headings and footer,
    # preserving the cutting contour, glue tabs and artwork.
    rgb=im.convert('RGB')
    area=(50,220,im.width-50,min(im.height-205,1290))
    sub=rgb.crop(area)
    # Colored backgrounds can fill the region: normalize by observing difference from white.
    diff=ImageChops.difference(sub,Image.new('RGB',sub.size,'white')).convert('L')
    b=diff.point(lambda p:255 if p>48 else 0).getbbox()
    if b:
        left=max(0,b[0]-18);top=max(0,b[1]-18)
        right=min(sub.width,b[2]+18);bottom=min(sub.height,b[3]+18)
        # do not overcrop very small detected art
        if right-left>250 and bottom-top>250:sub=sub.crop((left,top,right,bottom))
    return sub

def draw_pdf(variant):
    pdf=DEST/('PSQ60_A4_APAISADO_COLOR_FRENTE_DORSO.pdf' if variant=='color' else 'PSQ60_A4_APAISADO_BN_FRENTE_DORSO.pdf')
    cv=canvas.Canvas(str(pdf),pagesize=landscape(A4),pageCompression=1)
    cv.setTitle('PasaloChevere Paper Squishy - 60 personajes - '+variant)
    for idx,e in enumerate(manifest['original60'],1):
        col=e['collection'];title=e['slug'].replace('_',' ').title()
        cv.setFillColor(HexColor('#292934'))
        cv.setFont('Helvetica-Bold',13);cv.drawString(12*mm,H-12*mm,f'PASALOCHEVERE  /  PAPER SQUISHY  {idx:02d}/60')
        cv.setFillColor(HexColor(COLORS[col] if variant=='color' else '#555555'))
        cv.rect(12*mm,H-18*mm,W-24*mm,1.1*mm,fill=1,stroke=0)
        cv.setFillColor(HexColor('#33333A'));cv.setFont('Helvetica-Bold',12)
        cv.drawString(14*mm,H-28*mm,title[:40])
        cv.setFont('Helvetica',9);cv.drawRightString(W-14*mm,H-26*mm,manifest['collections'][col])
        cv.setFont('Helvetica-Bold',10)
        cv.drawCentredString(W*.25,H-36*mm,'FRENTE')
        cv.drawCentredString(W*.75,H-36*mm,'DORSO')
        cv.setStrokeColor(HexColor('#D8D5D4'));cv.setLineWidth(.45)
        cv.line(W/2,37*mm,W/2,H-37*mm)
        keys=('front_print','back_print') if variant=='color' else ('coloring','coloring_back')
        for side,key in enumerate(keys):
            im=crop_art(out[(e['code'],key)])
            # A4 landscape two-up: max 124 mm per image in width and 133 mm tall.
            maxw,maxh=126*mm,134*mm
            factor=min(maxw/im.width,maxh/im.height)
            dw,dh=im.width*factor,im.height*factor
            cx=(W/4 if side==0 else W*.75);cy=102*mm
            buf=io.BytesIO()
            if variant=='bn': im=im.convert('L')
            im.save(buf,format='JPEG',quality=87 if variant=='color' else 90,optimize=True,subsampling=1 if variant=='color' else 0)
            buf.seek(0)
            cv.drawImage(ImageReader(buf),cx-dw/2,cy-dh/2,width=dw,height=dh,mask='auto')
        cv.setFillColor(HexColor('#666666'));cv.setFont('Helvetica',8)
        cv.drawString(12*mm,17*mm,'A4 horizontal - imprimir al 100 % sin ajustar - recortar por la linea exterior.')
        cv.drawRightString(W-12*mm,17*mm,'PSQ80 | Base historica intacta')
        cv.setStrokeColor(HexColor('#222222'));cv.setLineWidth(.7)
        cv.line(14*mm,10*mm,64*mm,10*mm)
        cv.line(14*mm,8.5*mm,14*mm,11.5*mm);cv.line(64*mm,8.5*mm,64*mm,11.5*mm)
        cv.setFont('Helvetica',7);cv.drawString(67*mm,9*mm,'Control 50 mm')
        cv.showPage()
    cv.save()
    import fitz
    test=fitz.open(pdf);assert len(test)==60
    for pg in test:
        assert abs(pg.rect.width-842)<1 and abs(pg.rect.height-595)<1
        assert len(pg.get_images(full=True))>=2
    return {'filename':pdf.name,'bytes':pdf.stat().st_size,'sha256':hashlib.sha256(pdf.read_bytes()).hexdigest(),'pages':60}

results=[draw_pdf('color'),draw_pdf('bn')]
(DEST/'psq60-source-integrity.json').write_text(json.dumps({'sources':records,'pdfs':results},indent=2))
from PIL import ImageDraw
def contact(pdfpath,output):
    import fitz
    doc=fitz.open(pdfpath);pages=[0,9,19,29,39,49,59]
    ims=[]
    for n in pages:
        p=doc[n].get_pixmap(matrix=fitz.Matrix(1.1,1.1),alpha=False)
        im=Image.open(io.BytesIO(p.tobytes('png'))).convert('RGB');im.thumbnail((760,540));ims.append(im)
    canvas_img=Image.new('RGB',(820,570*len(ims)),(255,255,255))
    for i,im in enumerate(ims):
        canvas_img.paste(im,(24,i*570+24))
    canvas_img.save(output,quality=82)
for r in results: contact(DEST/r['filename'],DEST/(r['filename'].replace('.pdf','-QA.jpg')))
print('PSQ60 DONE',json.dumps(results,ensure_ascii=False))
