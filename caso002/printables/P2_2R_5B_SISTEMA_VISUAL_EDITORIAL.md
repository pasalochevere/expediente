# C002 · P2.2R.5B — SISTEMA VISUAL EDITORIAL + 7 TEMPLATES MAESTROS

**Estado:** CERRADO / LISTO PARA PRODUCCIÓN  
**Depende de:** `P2_2R_5A_ARQUITECTURA_KIT_PREMIUM.md`  
**Preview:** `premium/templates.html`  
**CSS maestro:** `premium/templates.css`  
**Regla:** los assets web de `P2.2R.4` se usan sólo para preview. Los exports finales de P2.2R.5C–D deben usar master o `print_crop` de alta resolución.

---

## 1 · TOKENS EDITORIALES CONGELADOS

- Orfeo Black `#070707`
- Charcoal `#090A0B`
- Night `#12100E`
- Panel `#191511`
- Ink `#F0E6D6`
- Paper `#E7D7BF`
- Paper 2 `#D8C3A5`
- Old Gold `#A37A48`
- Brass Light `#C79A5D`
- Wine `#7E2E2E`
- Wine Bright `#A54A3F`
- Storm `#4E555E`
- Line `#4C3A2A`
- Paper Ink `#1D1915`
- Paper Muted `#756A5D`

Tipografía:
- narrativo/títulos: Georgia / Times New Roman;
- metadata/UI editorial: Inter / system sans;
- códigos/horas: monospace.

Formato:
- A4 210 × 297 mm;
- safe area 14 mm;
- `@page size:A4; margin:0`;
- no dependencia de fuentes externas;
- versión B/N controlada por sistema tonal, no por rediseño separado.

---

# 2 · LOS 7 TEMPLATES MAESTROS

## T01 · CINE
**Uso:** COVER-01, OPEN-01, EVD-001 y grandes revelaciones visuales.

Variables:
- `eyebrow`
- `title`
- `lede`
- `hero_asset`
- `accent`

Reglas:
- imagen 70–100% de página;
- overlay carbón lateral/inferior;
- máximo 60 palabras visibles;
- serif grande;
- 317 sólo cuando la página lo justifica narrativamente.

---

## T02 · DOSSIER PERSONA
**Uso:** CHAR-P01…CHAR-P06.

Variables:
- `code`
- `name`
- `role`
- `portrait_asset`
- `canon_copy`
- `notes_label`

Composición:
- retrato 55–62%;
- metadata en columna lateral;
- nombre serif + rol;
- notas manuales reales;
- sello opcional.

Prohibido:
- avatar/silueta;
- etiquetas de culpabilidad;
- inventar antecedentes.

---

## T03 · DOSSIER LUGAR
**Uso:** LOC-L01…LOC-L06.

Variables:
- `code`
- `name`
- `scene_asset`
- `canon_copy`
- `notes_label`

Composición:
- escena dominante en tercio superior/medio;
- título sobre degradado;
- ficha y notas debajo;
- cada lugar debe ser reconocible sin texto.

---

## T04 · EVIDENCIA
**Uso:** OBJ-O01…OBJ-O06, EVD-004, EVD-005, EVD-006, EVD-008.

Variables:
- `code`
- `name`
- `evidence_asset`
- `metadata`
- `canon_copy`

Composición:
- objeto/foto/documento mínimo 60%;
- soporte papel/mesa de archivo;
- etiqueta de archivo secundaria;
- descripción máxima 2–3 líneas.

Regla de oro: la evidencia debe parecer encontrada, no ilustrada como icono.

---

## T05 · DOCUMENTO
**Uso:** GUIDE-01, INDEX-01, EVD-002, EVD-003, EVD-007.

Variables:
- `document_type`
- `title`
- `code`
- `date`
- `fields[]`
- `body`
- `stamp`

Composición:
- papel claro;
- filetes finos;
- campos tabulares;
- sellos vino/gris;
- prioridad absoluta de lectura.

Política de canon:
- campos desconocidos pueden quedar ocultos o sin completar;
- no inventar nombres, habitaciones, firmas, transcripciones o causas.

---

## T06 · PLAY
**Uso:** BOARD-P, PLAY-LOG, PLAY-TIME, PLAY-ACC.

Variables:
- `title`
- `instructions`
- `sections[]`
- `write_areas[]`

Composición:
- encabezado oscuro Orfeo;
- cuerpo claro;
- espacios amplios para escribir;
- lineado discreto;
- PERSONA + LUGAR + OBJETO visible en acusación, sin respuesta preimpresa.

---

## T07 · SEALED / CUT
**Uso SEALED:** EVD-009, EVD-010.  
**Uso CUT:** R01–R06.

### Modo SEALED
Variables:
- `title`
- `warning`
- `veiled_asset`
- `unlock_instruction`

Reglas:
- fondo oscuro;
- imagen velada/parcial;
- advertencia visible;
- nunca filtrar contenido en miniatura o índice.

### Modo CUT
Variables:
- `cards[]`
- `code`
- `asset`
- `label`

Reglas:
- líneas de corte 0,25–0,35 pt;
- margen interno mínimo 4 mm;
- sin look de tarjeta de app;
- anverso visual + código;
- ningún texto que revele solución.

---

# 3 · MAPA DE PÁGINAS → TEMPLATE

- 01–02 → T01 CINE
- 03–04 → T05 DOCUMENTO
- 05–10 → T02 DOSSIER PERSONA
- 11 → T06 PLAY
- 12–17 → T03 DOSSIER LUGAR
- 18–23 → T04 EVIDENCIA
- 24 → T01 CINE / EVID
- 25–26 → T05 DOCUMENTO
- 27 → T04 EVIDENCIA
- 28 → T05 DOCUMENTO / EVID
- 29–31 → T04 EVIDENCIA
- 32–34 → T06 PLAY
- 35–36 → T07 SEALED
- R01–R06 → T07 CUT

---

# 4 · CONTRATO DE PRODUCCIÓN P2.2R.5C

Cada página deberá declararse como objeto de datos con:

```text
page_id
page_number
template
section
title
subtitle
asset_master
asset_print_crop
copy_source
spoiler_level
print_mode
```

`copy_source` sólo acepta:
- canon/versionado;
- Style Bible;
- manifiestos visuales;
- instrucciones de uso no narrativas.

No acepta prosa improvisada presentada como pista/canon.

---

# 5 · COLOR / B&N

Un mismo HTML/master genera ambas versiones.

Color:
- bronce y vino como acentos;
- imagen con baja saturación y contraste cinematográfico.

B/N:
- contraste reforzado en imagen;
- Old Gold y Wine traducidos a valores grises distintos;
- sellos y filetes siguen diferenciándose;
- no depender del color para códigos o categorías.

---

# 6 · QA GATE DE TEMPLATE

Los templates quedan aprobados sólo si:

- [x] A4 real y safe area 14 mm.
- [x] No requieren fuentes externas.
- [x] Sistema COLOR/B&N incluido.
- [x] CINE prioriza imagen y atmósfera.
- [x] PERSONA usa retrato real y área de notas.
- [x] LUGAR usa escena dominante y notas.
- [x] EVIDENCIA prioriza objeto/documento real.
- [x] DOCUMENTO mantiene alta legibilidad.
- [x] PLAY tiene áreas reales de escritura.
- [x] SEALED muestra advertencia de spoiler.
- [x] CUT define cortes discretos y código de archivo.
- [x] Ningún template fija una solución de las 216 combinaciones.
- [x] Ningún template depende de pictogramas como evidencia final.

---

# 7 · ARCHIVOS MAESTROS

- `premium/templates.css` — sistema editorial y print CSS.
- `premium/templates.html` — preview de las 7 familias maestras.
- `P2_2R_5B_SISTEMA_VISUAL_EDITORIAL.md` — contrato de producción.

**Siguiente bloque:** `P2.2R.5C — PRODUCCIÓN REAL DE LAS 42 PÁGINAS`.
