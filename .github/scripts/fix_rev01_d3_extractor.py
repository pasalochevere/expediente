from pathlib import Path

p = Path('.github/scripts/patch_rev01_d3.py')
s = p.read_text()
start = s.index('# Extract only the historical character library')
end = s.index('ASSET_DIR.mkdir', start)
new = '''# Extract the canonical character order and the separate historical ART portrait library.
m = re.search(r"const\\s+CHARS\\s*=\\s*\\[(.*?)\\]\\s*;", src, re.S)
if not m:
    raise SystemExit('CHARS block not found')
char_block = m.group(1)
names = re.findall(r"\\bname\\s*:\\s*['\\\"]([^'\\\"]+)['\\\"]", char_block)
expected = ['Santiago', 'Clara', 'Vera', 'Mateo', 'Inés', 'Tomás']
if names != expected:
    raise SystemExit(f'character order mismatch: {names}')

art = re.search(r"portraits\\s*:\\s*\\{(.*?)\\}\\s*,", src, re.S)
if not art:
    raise SystemExit('ART.portraits block not found')
raw_images = re.findall(r"(\\d+)\\s*:\\s*['\\\"]data:image/([^;]+);base64,([A-Za-z0-9+/=]+)['\\\"]", art.group(1))
indices = [int(x[0]) for x in raw_images]
if indices != list(range(6)):
    raise SystemExit(f'portrait indices mismatch: {indices}')
images = [(mime, b64) for _, mime, b64 in raw_images]
if len(images) != 6:
    raise SystemExit(f'expected 6 embedded portraits, got {len(images)}')

'''
s = s[:start] + new + s[end:]
p.write_text(s)
print('D3 extractor patched for ART.portraits 0..5')
