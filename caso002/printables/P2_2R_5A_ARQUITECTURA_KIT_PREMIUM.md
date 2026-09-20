# C002 · P2.2R.5A — ARQUITECTURA CERRADA DEL KIT PREMIUM

**Producto:** EXPEDIENTES · Caso 002 · Hotel Orfeo  
**Estado:** ARQUITECTURA CONGELADA / LISTA PARA PRODUCCIÓN  
**Fuente visual:** `../design/library/LIBRARY_INDEX.md`  
**Style Bible:** `../design/STYLE_BIBLE_C002.md`  
**Canon:** `C002_CANON_LOCK_V1` / ENGINE P2 sin cambios

---

## 0 · PRINCIPIO MAESTRO

El kit imprimible debe sentirse como material físico retirado del Hotel Orfeo y puesto sobre una mesa de investigación.

No se dibujan sustitutos genéricos si existe un master visual aprobado. Quedan fuera del nuevo master las siluetas, pictogramas y geometrías procedurales del builder anterior.

### Contrato de canon
- No fija una solución PERSONA/LUGAR/OBJETO.
- No agrega nombres, habitaciones, fechas, transcripciones, culpables ni pistas que no existan en canon.
- `EVD-002` mantiene identidades/habitaciones ilegibles.
- `EVD-004` no incorpora notas inventadas.
- `EVD-005/006` no incorporan transcripciones inventadas.
- `EVD-009` no resuelve la combinación final.
- `EVD-010` es postcrédito visual sin explicación añadida.

---

# 1 · ENTREGABLES COMERCIALES

La producción final genera cuatro salidas desde un único master editorial:

1. `C002_Kit_Premium_COLOR.pdf` — dossier completo A4.
2. `C002_Kit_Premium_BN.pdf` — versión optimizada para impresión B/N.
3. `C002_Recortables_COLOR.pdf` — sólo piezas recortables.
4. `C002_Recortables_BN.pdf` — recortables B/N.

El comprador puede jugar sólo con el dossier digital; imprimir es complementario.

### Tamaño y salida
- A4 real: 210 × 297 mm.
- Sangrado visual: 3 mm sólo donde el diseño lo requiera.
- Zona segura: 14 mm.
- Resolución objetivo de imágenes: 300 ppp en impresión.
- Color: RGB de origen con export PDF de alta calidad.
- B/N: conversión editorial controlada, no simple desaturación automática.

---

# 2 · CLASES DE PÁGINA

| Código | Tipo | Lenguaje |
|---|---|---|
| `CINE` | apertura / revelación | imagen dominante, negro, serif grande, poco texto |
| `DOSSIER` | persona / lugar | papel crema, foto dominante, metadata, notas |
| `EVID` | evidencia | reproducción física, código, metadata mínima |
| `DOC` | documento | papel, sellos, marcas de archivo, alta legibilidad |
| `PLAY` | ayuda de juego | espacio para escribir, funcional pero dentro del universo Orfeo |
| `SEALED` | spoiler/final | advertencia clara, oscuro, no leer antes de tiempo |
| `CUT` | recortable | líneas discretas, sin marcos de app |

---

# 3 · ARQUITECTURA DEL DOSSIER PRINCIPAL — 36 PÁGINAS

## BLOQUE A · APERTURA — PÁGS. 01–04

| Pág. | Código | Título | Tipo | Fuente visual | Función |
|---:|---|---|---|---|---|
| 01 | `COVER-01` | Hotel Orfeo | CINE | `KEY-001` Hotel Orfeo hero | portada comercial/premium |
| 02 | `OPEN-01` | La habitación que no existe | CINE | `KEY-002` Puerta 317 + `KEY-003` Pasillo hero | briefing narrativo sin spoilers |
| 03 | `GUIDE-01` | Cómo usar este expediente | DOC | `SYS` papel/marco/etiquetas | preparación, impresión, orden de uso |
| 04 | `INDEX-01` | Inventario del expediente | DOC | thumbnails aprobados | índice visual y leyenda de códigos |

### Regla de impresión
Pág. 03 define tres niveles:
- **Esencial:** páginas de apoyo jugable + evidencias que el grupo quiera manipular.
- **Recomendado:** personajes, lugares, objetos y hojas de investigación.
- **Completo:** dossier entero + recortables.

---

## BLOQUE B · PERSONAS — PÁGS. 05–11

| Pág. | Código | Título | Tipo | Asset |
|---:|---|---|---|---|
| 05 | `CHAR-P01` | Alma Salvatierra · Restauradora | DOSSIER | `CHAR-P01` master / print crop |
| 06 | `CHAR-P02` | Bruno Ferrer · Ilusionista | DOSSIER | `CHAR-P02` |
| 07 | `CHAR-P03` | Celeste Vidal · Periodista | DOSSIER | `CHAR-P03` |
| 08 | `CHAR-P04` | Damián Orsini · Arquitecto | DOSSIER | `CHAR-P04` |
| 09 | `CHAR-P05` | Eva Montenegro · Escritora / Médium | DOSSIER | `CHAR-P05` |
| 10 | `CHAR-P06` | Franco Valdés · Heredero | DOSSIER | `CHAR-P06` |
| 11 | `BOARD-P` | Tablero de personas | PLAY | 6 thumbnails personajes | comparación y notas del equipo |

### Plantilla DOSSIER PERSONA
- fotografía 55–62% de la página;
- código P01–P06;
- nombre serif;
- rol canónico;
- texto sólo desde canon aprobado;
- zona de notas manuales;
- nunca etiquetar “culpable”, “sospechoso principal” ni similar.

---

## BLOQUE C · LUGARES — PÁGS. 12–17

| Pág. | Código | Título | Tipo | Asset |
|---:|---|---|---|---|
| 12 | `LOC-L01` | Vestíbulo | DOSSIER | `LOC-L01` |
| 13 | `LOC-L02` | Salón de baile | DOSSIER | `LOC-L02` |
| 14 | `LOC-L03` | Archivo subterráneo | DOSSIER | `LOC-L03` |
| 15 | `LOC-L04` | Habitación 216 | DOSSIER | `LOC-L04` |
| 16 | `LOC-L05` | Sala de máquinas | DOSSIER | `LOC-L05` |
| 17 | `LOC-L06` | Pasillo del tercer piso | DOSSIER | `LOC-L06` |

### Regla
Los seis lugares deben seguir siendo reconocibles sin leer el nombre. 317 no se reutiliza como fondo genérico.

---

## BLOQUE D · OBJETOS — PÁGS. 18–23

| Pág. | Código | Título | Tipo | Asset |
|---:|---|---|---|---|
| 18 | `OBJ-O01` | Llave 317 | EVID | `OBJ-O01` |
| 19 | `OBJ-O02` | Reloj detenido | EVID | `OBJ-O02` |
| 20 | `OBJ-O03` | Cinta de casete | EVID | `OBJ-O03` |
| 21 | `OBJ-O04` | Plano quemado | EVID | `OBJ-O04` |
| 22 | `OBJ-O05` | Cámara Polaroid | EVID | `OBJ-O05` |
| 23 | `OBJ-O06` | Medallón de plata | EVID | `OBJ-O06` |

### Regla de distinción
`OBJ-O04` es el **objeto físico encontrado**. `EVD-003` es el **documento/anomalía arquitectónica**. No se fusionan.

---

## BLOQUE E · EVIDENCIAS MAYORES — PÁGS. 24–31

| Pág. | Código | Título | Tipo | Asset | Política |
|---:|---|---|---|---|---|
| 24 | `EVD-001` | Habitación 317 | CINE/EVID | `EVD-001` | pieza icónica; tratamiento especial |
| 25 | `EVD-002` | Registro de 1968 | DOC | `EVD-002` | datos sensibles/identidades ilegibles |
| 26 | `EVD-003` | Plano / anomalía arquitectónica | DOC | `EVD-003` | marzo 1958; sin contradicciones |
| 27 | `EVD-008` | Polaroid 03:12 | EVID | `EVD-008` | fotografía encontrada |
| 28 | `EVD-007` | Apagón 03:17 | DOC/EVID | `EVD-007` | evento, no simple cuarto eléctrico |
| 29 | `EVD-004` | Caja de León | EVID | `EVD-004` | sin nota/contenido inventado |
| 30 | `EVD-005` | Cinta · Fragmento 01 | EVID | `EVD-005` | sin transcripción inventada |
| 31 | `EVD-006` | Cinta · Fragmento 02 | EVID | `EVD-006` | sin transcripción inventada |

### Regla 317
Pág. 24 es la única página del dossier donde 317 domina completamente la composición. En el resto se utiliza sólo cuando el contenido lo exige.

---

## BLOQUE F · HERRAMIENTAS DE INVESTIGACIÓN — PÁGS. 32–34

| Pág. | Código | Título | Tipo | Función |
|---:|---|---|---|---|
| 32 | `PLAY-LOG` | Bitácora del investigador | PLAY | pistas, hallazgos, dudas, hipótesis |
| 33 | `PLAY-TIME` | Cronología y contradicciones | PLAY | ordenar horas/eventos y cruzar contradicciones |
| 34 | `PLAY-ACC` | Acusación final | PLAY | PERSONA + LUGAR + OBJETO + fundamento |

### Hoja de acusación
Debe reflejar la matriz dinámica de 216 combinaciones. Nunca imprime una respuesta predeterminada.

---

## BLOQUE G · FINAL / SPOILERS — PÁGS. 35–36

| Pág. | Código | Título | Tipo | Asset | Regla |
|---:|---|---|---|---|---|
| 35 | `EVD-009` | Reconstrucción final | SEALED | `EVD-009` | no resuelve una combinación concreta |
| 36 | `EVD-010` | 319 | SEALED | `EVD-010` | postcrédito; no abrir antes del cierre |

Ambas páginas llevan una banda visible: **ABRIR SÓLO CUANDO EL JUEGO LO INDIQUE**.

---

# 4 · PACK RECORTABLE — 6 PÁGINAS

Se exporta además como PDF independiente para quien quiera montar mesa física.

| Pág. | Código | Contenido | Tipo |
|---:|---|---|---|
| R01 | `CUT-P-A` | Personas P01–P03 | CUT |
| R02 | `CUT-P-B` | Personas P04–P06 | CUT |
| R03 | `CUT-L` | Lugares L01–L06 | CUT |
| R04 | `CUT-O` | Objetos O01–O06 | CUT |
| R05 | `CUT-E-A` | Llave / reloj / polaroid / plano | CUT |
| R06 | `CUT-E-B` | 317 / registro / cintas / caja | CUT |

### Formato recortables
- bordes de corte gris/bronce de 0,25–0,35 pt;
- esquinas moderadas, no look de tarjeta de app;
- anverso visual + código de archivo;
- sin información que revele solución;
- margen de seguridad interno mínimo 4 mm.

---

# 5 · REGLAS DE PLANTILLA

## 5.1 Portada / CINE
- imagen a sangre o 70–80% de página;
- overlay carbón degradado;
- serif grande;
- oro viejo sólo como acento;
- máximo 60 palabras visibles.

## 5.2 Dossier de persona/lugar
- imagen dominante 55–62%;
- bloque de archivo 38–45%;
- metadata sans pequeña;
- título serif;
- sello vino sólo cuando corresponda;
- área de notas real, no decorativa.

## 5.3 Evidencia
- objeto/documento ocupa mínimo 60%;
- código + nombre debajo;
- descripción máxima 2–3 líneas;
- nada de pictogramas sustitutivos.

## 5.4 PLAY
- fondo papel claro para escribir;
- alto contraste;
- lineado y cajas discretas;
- estética expediente, no formulario corporativo.

## 5.5 SEALED
- fondo oscuro;
- imagen parcial o velada;
- advertencia de spoiler;
- no exponer texto final en miniatura/índice.

---

# 6 · VERSIÓN B/N

La versión B/N no se obtiene con un filtro global automático.

Reglas:
- personajes/lugares: alto contraste con preservación de piel y detalle;
- documentos: tinta negra + grises + sellos convertidos a gris oscuro tramado;
- Old Gold/Wine se traducen por valor tonal distinto;
- recortables mantienen diferenciación sin depender del color;
- fotografías no deben empastarse en sombras.

---

# 7 · MATRIZ DE PRODUCCIÓN / FUENTE

## Fuente obligatoria
1. master o `print_crop` de la biblioteca restaurada;
2. contenido textual desde canon existente;
3. Style Bible para composición.

## Fuente prohibida
- assets web comprimidos de integración P2.2R.4 para impresión;
- siluetas procedurales del builder antiguo;
- iconografía lineal como evidencia final;
- texto generado que no esté en canon;
- capturas de UI del juego como sustituto de documento.

---

# 8 · QA GATE DE P2.2R.5

El kit no pasa a release si falla cualquiera de estos puntos:

- [ ] 36 páginas del dossier presentes y numeradas.
- [ ] 6 páginas de recortables presentes.
- [ ] 6 personajes usan retratos reales diferenciados.
- [ ] 6 lugares usan escenas diferentes.
- [ ] 6 objetos parecen evidencias físicas.
- [ ] Las 8 evidencias mayores usan masters aprobados.
- [ ] No aparecen siluetas/iconos del builder legado.
- [ ] No hay texto técnico P1/P2/BETA/RANDOM visible.
- [ ] No se fija una solución de las 216 combinaciones.
- [ ] 317 y 03:17 se usan con disciplina narrativa.
- [ ] B/N conserva legibilidad y jerarquía.
- [ ] A4 y márgenes seguros verificados.
- [ ] Las hojas PLAY tienen espacio real para escribir.
- [ ] Páginas 35–36 están marcadas como spoiler/sealed.
- [ ] PDF abre sin fuentes externas ni enlaces rotos.

---

# 9 · MIGRACIÓN DESDE EL KIT ACTUAL

El archivo actual `C002_Kit_Imprimible_Hotel_Orfeo.pdf` y `build_kit.py` quedan considerados **LEGACY** durante P2.2R.5B–D.

No se eliminan todavía. El nuevo generador se construye en paralelo y sólo reemplaza al legacy cuando P2.2R.5E pase QA final.

---

# 10 · ORDEN DE PRODUCCIÓN BLOQUEADO

1. `P2.2R.5B` — Sistema Visual Editorial + 7 templates maestros.
2. `P2.2R.5C` — Producción real de las 36 páginas + 6 recortables.
3. `P2.2R.5D` — Ensamblado COLOR/B&N y exports.
4. `P2.2R.5E` — QA visual, técnico, impresión y release gate.
5. Recién después: reemplazo de `C002_Kit_Imprimible_Hotel_Orfeo.pdf` y actualización del acceso desde el juego.

**Arquitectura congelada:** cualquier cambio posterior en cantidad de páginas, orden o contenido estructural debe registrarse como revisión explícita de esta fase, no hacerse silenciosamente dentro del builder.
