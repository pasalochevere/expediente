#!/usr/bin/env python3
import requests,io,json,base64
from PIL import Image
URL="https://fzbndgfnqxcacsvlitui.supabase.co/storage/v1/object/public/paper-squishy-assets/"
items=["v2.7/animal_cuties/gatito_mishi/front_print.webp","v2.7/animal_cuties/gatito_mishi/back_print.webp","v2.7/animal_cuties/gatito_mishi/coloring.webp","v2.7/animal_cuties/gatito_mishi/coloring_back.webp","v2.7/ocean_buddies/ollie/front_print.webp","v2.7/ocean_buddies/ollie/coloring_back.webp"]
montage=Image.new("RGB",(3*300,2*380),"white")
for i,path in enumerate(items):
 r=requests.get(URL+path,timeout=30);r.raise_for_status();im=Image.open(io.BytesIO(r.content));print("ASSET",path,len(r.content),im.size,im.mode)
 a=im.convert("RGB");a.thumbnail((280,335));montage.paste(a,((i%3)*300+10,(i//3)*380+38))
from PIL import ImageDraw
d=ImageDraw.Draw(montage)
for i,name in enumerate(items):
 d.text(((i%3)*300+6,(i//3)*380+3),name.split("/")[-1],fill="black")
b=io.BytesIO();montage.save(b,format="JPEG",quality=60);print("CONTACT_IMAGE",base64.b64encode(b.getvalue()).decode())
