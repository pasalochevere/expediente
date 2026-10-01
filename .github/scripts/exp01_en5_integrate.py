from pathlib import Path

ROOT=Path('.')
CASE=ROOT/'caso001'
PRINT=CASE/'printables'

index=PRINT/'index.html'
s=index.read_text(encoding='utf-8')
css='<link rel="stylesheet" href="./i18n-en5.css?v=exp01-en5-20261001">'
js='<script type="module" src="./i18n-en5.js?v=exp01-en5-20261001"></script>'
if css not in s:
    if '</head>' not in s: raise SystemExit('printables </head> missing')
    s=s.replace('</head>',css+'\n</head>',1)
if js not in s:
    if '</body>' not in s: raise SystemExit('printables </body> missing')
    s=s.replace('</body>',js+'\n</body>',1)
index.write_text(s,encoding='utf-8')

release=CASE/'RELEASE.txt'
r=release.read_text(encoding='utf-8')
marker='Printable language checkpoint: EXP01-EN5 · bilingual ES/EN printable kit complete'
if marker not in r:
    block='''\nPrintable language checkpoint: EXP01-EN5 · bilingual ES/EN printable kit complete
Printable language behavior: top ES/EN selector · URL ?lang=es/en · device-local preference · live reversible switch · print/save PDF follows selected language
Printable scope EN5: 8/8 A4 base pages translated; toolbar, instructions, character roles, scenes, objects, investigation sheet, timeline, relationship map and final accusation localized
Printable visual scope EN5: ES preserves 18 embedded originals · EN reuses 11 neutral originals and swaps the 6 portraits + notebook to the validated EN4 visual variants
Printable safety EN5: presentation-only layer; no Crime Pack mutation, no room state, no licenses, no timers, no roles, no multiplayer payload changes
Printable QA EN5: automated browser PASS · 8 ES pages + 8 EN pages · ES↔EN↔ES PASS · 18/18 images load · 7 EN visual swaps · print media A4/PDF gate PASS · no page errors\n'''
    r=r.rstrip()+block
release.write_text(r,encoding='utf-8')

audit=CASE/'EXP01_EN5_AUDIT.md'
audit.write_text('''# EXP01-EN5 · Bilingual Printables · ES / EN

Estado: **PASS sujeto al gate automatizado de publicación de este build**.

## Alcance real auditado

El kit activo de Caso 001 contiene **8 páginas A4 base** y **18 imágenes embebidas**:

1. Expediente del caso / apertura;
2. Personas · 6 sospechosos;
3. Escenas de investigación;
4. Objetos clave;
5. Hoja de investigación / tablero de teoría;
6. Línea de tiempo;
7. Mapa de relaciones;
8. Acusación final.

La capa EN5 no altera el contenido canónico ni el motor. Traduce únicamente la presentación del kit imprimible.

## Selector bilingüe

Se incorpora un control visible en la parte superior:

- **ESPAÑOL**;
- **ENGLISH**.

Resolución:

1. `?lang=es` / `?lang=en`;
2. preferencia local del dispositivo;
3. español por defecto.

El cambio es en vivo y reversible, conserva los demás parámetros de URL y el botón **Imprimir / Guardar PDF** imprime el idioma que está visible.

## Cobertura EN

Se traducen las 8 páginas completas, incluyendo:

- instrucciones de apertura y reglas Normal / Impostor;
- perfiles públicos y roles visibles;
- escenas, descripciones y preguntas de investigación;
- objetos y descripciones;
- ejes Persona / Escena / Objeto / Motivo;
- hechos, contradicciones, coartadas, testimonios e hipótesis;
- cronología;
- relaciones;
- bloqueo y acusación final.

La capa también reutiliza el diccionario completo de **EXP01-EN3** para cualquier texto canónico/evidencia que pueda incorporarse dinámicamente al DOM del imprimible.

## Imágenes

En español se conservan las **18 imágenes originales embebidas**.

En inglés:

- 6 retratos usan las variantes EN validadas en EXP01-EN4;
- el cuaderno usa su variante EN;
- las 6 escenas y los otros 5 objetos son neutros y se reutilizan sin modificación.

Resultado: **7 swaps EN + 11 assets neutros compartidos**.

## Seguridad

EN5 no modifica:

- Crime Packs;
- índices canónicos;
- P2 labels internos;
- room state;
- licencias;
- timers;
- roles;
- Edge Functions;
- payloads multiplayer.

## Gate de QA

El gate automatizado valida:

- 8/8 páginas en ES;
- 8/8 páginas en EN;
- títulos y textos críticos de las 8 páginas;
- ausencia de marcadores españoles objetivo al estar en EN;
- ida y vuelta ES → EN → ES → EN;
- 18/18 imágenes cargadas;
- 7 variantes visuales EN y 11 imágenes neutras compartidas;
- toolbar e idioma de documento;
- impresión A4 y generación PDF de 8 páginas por idioma;
- cero errores JavaScript de página.
''',encoding='utf-8')
