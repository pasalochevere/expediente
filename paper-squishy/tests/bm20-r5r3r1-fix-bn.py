#!/usr/bin/env python3
"""BM20 R5R3R1: repair unmirrored back-cut contour, preserve embedded B/N artwork.
Usage:
  python bm20-r5r3r1-fix-bn.py ORIGINAL.pdf CORREGIDO.pdf
No changes to storage, license portal, or original PDF.
"""
import sys,re,hashlib,fitz
from pathlib import Path
assert len(sys.argv)==3,"Usage: script original.pdf corrected.pdf"
src,dst=map(Path,sys.argv[1:3])
src_sha=hashlib.sha256(src.read_bytes()).hexdigest()
expected='6a0fe31d6b1a3e9739067fc8bc89bba0c8a0a11c1464ffa64cc621656e1c8dc8'
assert src_sha==expected, "Input is not the BM20 certified original"
doc=fitz.open(src)
assert len(doc)==20
outline=re.compile(rb'q 0 0 0 RG 1\.3 w\s+(.*?)\s+S Q',re.S)
rgb=re.compile(rb'(?<![\d.])([0-9]*\.?[0-9]+)\s+([0-9]*\.?[0-9]+)\s+([0-9]*\.?[0-9]+)\s+(rg|RG)\b')
for idx,page in enumerate(doc):
    assert len(page.get_contents())==1
    original=page.read_contents()
    matches=list(outline.finditer(original))
    assert len(matches)==2,f"Page {idx+1}: expected exactly two vector cut contours"
    front,back=matches
    # BUG FIX: the previous right-side vector path was a translated (not mirrored)
    # copy of the front. Reflect the original front path across x=421 PDF pt.
    mirror=b'q -1 0 0 1 842 0 cm '+front.group(0)+b' Q'
    updated=original[:back.start()]+mirror+original[back.end():]
    # Make original violet text/guide RGB operators neutral gray.
    def make_gray(m):
        r,g,b=map(float,m.group(1,2,3))
        v=max(0,min(1,0.2126*r+0.7152*g+0.0722*b))
        v=f'{v:.5f}'.encode()
        return b' '.join((v,v,v,m.group(4)))
    updated=rgb.sub(make_gray,updated)
    doc.update_stream(page.get_contents()[0],updated,compress=True)
meta=dict(doc.metadata)
meta['title']='Butter Mania - BN - Dorsos corregidos R5R3R1'
doc.set_metadata(meta)
doc.save(dst,garbage=4,deflate=True,clean=True)
doc.close()
print(dst,'bytes=',dst.stat().st_size,'sha256=',hashlib.sha256(dst.read_bytes()).hexdigest())
