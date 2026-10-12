import base64
import lzma
import pathlib
import string
import subprocess
import zlib

ROOT = pathlib.Path('.')
OUT = ROOT / 'recovered'
DIAG = OUT / 'diagnostics'
PAYLOAD_OUT = OUT / 'payload'
RUNTIME_OUT = OUT / 'runtime'
for p in (DIAG, PAYLOAD_OUT, RUNTIME_OUT):
    p.mkdir(parents=True, exist_ok=True)

ALPHABET = set((string.ascii_letters + string.digits + '+/=').encode())
report = []


def clean_decode(name: str, raw: bytes) -> bytes:
    clean = bytes(b for b in raw if b in ALPHABET)
    removed = [b for b in raw if b not in ALPHABET]
    clean += b'=' * ((-len(clean)) % 4)
    (DIAG / f'{name}.raw').write_bytes(raw)
    (DIAG / f'{name}.b64').write_bytes(clean)
    packed = base64.b64decode(clean, validate=True)
    (DIAG / f'{name}.packed').write_bytes(packed)
    report.append(f'== {name} base64 ==')
    report.append(f'raw={len(raw)} clean={len(clean)} removed={len(removed)} packed={len(packed)} magic={packed[:12].hex()}')
    if removed:
        report.append('removed_values=' + repr(sorted(set(removed))))
    return packed


# Payload: four current verified chunks plus the historical tail committed as 004005.
payload_raw = b''.join((ROOT / 'cofre-rc1' / 'payload' / f'chunk-{i:03d}').read_bytes() for i in range(4))
tail = subprocess.check_output([
    'git', 'show',
    '0e9d58315bd6d3fa0d30da9cab96dbd9d38efcee:cofre-rc1/payload/chunk-004005'
])
payload_raw += tail
payload_packed = clean_decode('payload', payload_raw)
try:
    dec = zlib.decompressobj(16 + zlib.MAX_WBITS)
    payload_decoded = dec.decompress(payload_packed)
    try:
        payload_decoded += dec.flush()
    except Exception as exc:
        report.append('payload_flush_error=' + repr(exc))
    (DIAG / 'payload.decoded').write_bytes(payload_decoded)
    report.append(f'payload_decoded={len(payload_decoded)} eof={dec.eof} unused={len(dec.unused_data)} unconsumed={len(dec.unconsumed_tail)}')
except Exception as exc:
    report.append('payload_decompress_error=' + repr(exc))


# Runtime: current chunks form an XZ stream.
runtime_dir = ROOT / 'cofre-rc1' / 'runtime'
runtime_raw = b''.join(p.read_bytes() for p in sorted(runtime_dir.glob('chunk-*')))
runtime_packed = clean_decode('runtime', runtime_raw)
try:
    dec = lzma.LZMADecompressor(format=lzma.FORMAT_XZ)
    runtime_decoded = dec.decompress(runtime_packed)
    (DIAG / 'runtime.decoded').write_bytes(runtime_decoded)
    report.append(f'runtime_decoded={len(runtime_decoded)} eof={dec.eof} unused={len(dec.unused_data)}')
except Exception as exc:
    report.append('runtime_decompress_error=' + repr(exc))

(DIAG / 'report.txt').write_text('\n'.join(report) + '\n', encoding='utf-8')
print('\n'.join(report))
