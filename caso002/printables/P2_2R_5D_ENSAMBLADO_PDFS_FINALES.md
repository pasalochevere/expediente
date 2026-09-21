# C002 · P2.2R.5D — ENSAMBLADO DE PDFs FINALES

**Estado:** ENSAMBLADO / QA TÉCNICO Y VISUAL PASS  
**Fuente:** 42 páginas maestras producidas en `P2.2R.5C`  
**Legacy:** NO reemplazado todavía. El reemplazo comercial queda reservado para `P2.2R.5E`.

## Entregables

| Archivo | Páginas | Tamaño | SHA-256 |
|---|---:|---:|---|
| `C002_Kit_Premium_COLOR.pdf` | 36 | 44,911,136 bytes | `cb02db70e379cca432b8ae2b05cda9ed33223926ed18af19cdb2a47469189797` |
| `C002_Kit_Premium_BN.pdf` | 36 | 28,713,138 bytes | `791a1e726b6534deb5008fcd8476dfc85519b4decdfac8c6151c323fed048c4d` |
| `C002_Recortables_COLOR.pdf` | 6 | 6,694,981 bytes | `f0157596f2d7e450295494a5c18d2cc7ac6709824182ae944384eee5773b83be` |
| `C002_Recortables_BN.pdf` | 6 | 4,179,182 bytes | `dc615d9fe13afff82728b09c34c9e72674fcab11e943f699736f07abf6d9886f` |

## QA realizado

- 36/36 páginas del dossier COLOR presentes.
- 36/36 páginas del dossier B/N presentes.
- 6/6 páginas de recortables COLOR presentes.
- 6/6 páginas de recortables B/N presentes.
- Tamaño de página PDF: A4 real, 595.276 × 841.89 pt.
- PDFs abiertos correctamente con PyMuPDF/PyPDF.
- Render visual completo revisado mediante contact sheets.
- Conversión B/N editorial con autocontraste y ajuste tonal; no filtro plano.
- No se detectaron páginas negras, vacías, rotadas ni cortadas.
- Páginas 35–36 mantienen tratamiento SEALED y advertencia de spoiler.
- El dossier no fija una solución PERSONA/LUGAR/OBJETO.
- Los PDFs son image-only de forma intencional: son piezas gráficas de impresión y no requieren OCR para el release.

## Regla de release

Estos cuatro archivos son los candidatos finales de `P2.2R.5D`, pero `C002_Kit_Imprimible_Hotel_Orfeo.pdf` y `build_kit.py` continúan como LEGACY hasta que `P2.2R.5E — QA PREMIUM + REEMPLAZO LEGACY` pase el gate final.

## Próximo bloque

`P2.2R.5E — QA PREMIUM + REEMPLAZO DEL KIT LEGACY`
