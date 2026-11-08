#!/usr/bin/env python3
"""BM20-R5R2 print preflight: read-only source assets and contact sheets.
No commercial exports, no changes to original assets or production PDFs.
"""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont,ImageOps,ImageStat
from collections import defaultdict
from io import BytesIO
import json,zipfile,hashlib,base64,statistics
BASE=Path(__file__).resolve().parents[1]
OUT=Path(__file__).resolve().parent/'output-r5r2'
OUT.mkdir(parents=True,exist_ok=True)
manifest=json.loads((BASE/'butter-mania'/'manifest.json').read_text())
ASSETS={}
for n in range(1,13):
    src=BASE/'butter-mania'/f'native-{n:02d}.zip'
    with zipfile.ZipFile(src) as z:
        for name in z.namelist():
            if not name.lower().endswith('.webp'):continue
            key=Path(name).name
            if key in ASSETS: raise Exception('Duplicated image name: '+key)
            ASSETS[key]=z.read(name)
assert len(ASSETS)==180,len(ASSETS)
TYPES=['hero','front_print','back_print','coloring','coloring_back','editor_asset','character_card','tutorial','mockup']
records=[]
images={}
for ch in manifest['characters']:
    c=ch['code']
    for v in TYPES:
        raw=ASSETS[f'{c}_{v}.webp']
        im=Image.open(BytesIO(raw))
        im.load()
        rgb=im.convert('RGB')
        # Find bounding box of pixels visibly different from white.
        mask=ImageOps.grayscale(ImageOps.invert(rgb))
        # Ignore near-white pixels: not a contour detector, just a margin indicator.
        box=mask.point(lambda p:255 if p>36 else 0).getbbox()
        ext=rgb.getextrema()
        stat=ImageStat.Stat(rgb)
        rec={'character':c,'view':v,'width':im.width,'height':im.height,'mode':im.mode,'alpha': 'A' in im.getbands(),
             'content_box':box,'sha256':hashlib.sha256(raw).hexdigest(),
             'rgb_mean':[round(x,1) for x in stat.mean],'rgb_stddev':[round(x,1) for x in stat.stddev]}
        records.append(rec)
        images[(c,v)]=rgb
def montage(items,name,width=1220,cols=4):
    font=ImageFont.load_default()
    n=len(items);rows=(n+cols-1)//cols
    cw=width//cols;ch=300; canvas=Image.new('RGB',(width,ch*rows),(255,252,248))
    dr=ImageDraw.Draw(canvas)
    for i,(label,img) in enumerate(items):
        x=(i%cols)*cw;y=(i//cols)*ch
        tile=ImageOps.contain(img,(cw-22,ch-37))
        canvas.paste(tile,(x+(cw-tile.width)//2,y+24+(ch-37-tile.height)//2))
        dr.text((x+12,y+8),label,font=font,fill=(42,35,37))
        dr.rectangle((x,y,x+cw-1,y+ch-1),outline=(226,221,215),width=1)
    path=OUT/name
    canvas.save(path,format='JPEG',quality=71,optimize=True)
    print('PREVIEW_IMAGE',name,base64.b64encode(path.read_bytes()).decode('ascii'))
# Contact panels: pairs front/back with 5 characters each, 10 tiles; 4 sheets
for gi in range(4):
    batch=manifest['characters'][gi*5:(gi+1)*5]
    tiles=[]
    for ch in batch:
        code=ch['code']
        tiles.extend([(code+' FRONT',images[(code,'front_print')]),(code+' BACK',images[(code,'back_print')])])
    montage(tiles,f'bm20-front-back-{gi+1}.jpg',width=1120,cols=2)
# A black/white contact sheet 20 = front-back for 10 at each panel
for gi in range(2):
    batch=manifest['characters'][gi*10:(gi+1)*10]
    tiles=[]
    for ch in batch:
        code=ch['code']
        tiles.extend([(code+' BN FRONT',images[(code,'coloring')]),(code+' BN BACK',images[(code,'coloring_back')])])
    montage(tiles,f'bm20-bn-{gi+1}.jpg',width=1120,cols=4)
# color usage in B/N: channel divergence >12 means chromatic, simple pixel sampling
bn_metrics=[]
for ch in manifest['characters']:
    for view in ('coloring','coloring_back'):
        im=images[(ch['code'],view)].resize((120,180))
        data=list(im.getdata())
        pct=sum(max(rgb)-min(rgb)>12 for rgb in data)/len(data)
        bn_metrics.append({'code':ch['code'],'view':view,'chromatic_share':round(pct,4)})
dims=defaultdict(set)
for rec in records:dims[rec['view']].add((rec['width'],rec['height']))
sha_repeats=defaultdict(list)
for rec in records:sha_repeats[rec['sha256']].append(rec['character']+'_'+rec['view'])
report={'characters':len(manifest['characters']),'assets':len(ASSETS),'orientation':manifest.get('orientation'),
 'manifest_state':manifest.get('state'),'dimensions_by_view':{k:sorted(list(v)) for k,v in dims.items()},
 'duplicate_images':[v for v in sha_repeats.values() if len(v)>1],
 'bn_color_leakage':bn_metrics,
 'records':records}
(OUT/'bm20-r5r2-preflight.json').write_text(json.dumps(report,indent=2,ensure_ascii=False))
print('SUMMARY',json.dumps({k:v for k,v in report.items() if k not in ('records','bn_color_leakage')},ensure_ascii=False))
print('BN_LEAKAGE_TOP',sorted(bn_metrics,key=lambda r:r['chromatic_share'],reverse=True)[:10])
