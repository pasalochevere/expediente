# BM20-R5R3R1 — Corrección definitiva de dorsos blanco y negro

**Resultado:** CORREGIDO Y VALIDADO DIGITALMENTE — 20/20. Pendiente una prueba física de encastre.

## Causa

En el PDF comercial original `BM20_20_A4_APAISADO_BN_FRENTE_DORSO.pdf`, el trazado vectorial negro de corte del dorso era una **copia desplazada, pero NO espejada**, del trazado frontal. El arte raster del dorso sí estaba espejado. Esta incongruencia superponía contornos no coincidentes, particularmente en BM07, BM08, BM09 y BM17.

## Solución

Se conserva el arte original, y en cada una de las 20 páginas:
1. Se localizan los dos trazos vectoriales de corte de grosor 1,3 pt.
2. Se conserva exactamente el contorno frontal.
3. Se sustituye el contorno dorsal por un reflejo horizontal de ese mismo contorno delantero con transformación PDF `-1 0 0 1 842 0 cm`, es decir `x' = 842 - x`, usando el eje central de A4.
4. Se pasan a grises las instrucciones de color RGB de la maquetación B/N.
5. Se mantiene el contenido rasterizado original, sus dimensiones y calidad sin remuestrear.

Código reproducible: `paper-squishy/tests/bm20-r5r3r1-fix-bn.py`.

## QA efectuado sobre el archivo corregido real

- **20/20** páginas A4 apaisadas, sin faltantes.
- **40/40** imágenes embebidas (frentes/dorsos) con contenido **idéntico byte a byte** al del PDF original.
- **20/20** contornos dorsales espejados contra sus frentes (desviación máxima numérica: 0,00003 puntos PDF, aproximadamente 0,000011 mm).
- **20/20** regiones de dibujo frontal sin cambios de píxeles en comparación antes/después.
- **20/20** páginas con cero píxeles cromáticos al renderizar como RGB: escala de grises estricta.
- Se renderizaron y revisaron las 20 láminas; comparación visual antes/después en BM07, BM08, BM09 y BM17.
- La versión Color **no se modificó**.

## Hashes (SHA-256)

| Archivo | SHA-256 |
| --- | --- |
| B/N original | `6a0fe31d6b1a3e9739067fc8bc89bba0c8a0a11c1464ffa64cc621656e1c8dc8` |
| B/N corregido R5R3R1 | `c2adde75329c492325ed4f6d9aa7694e7227050ab2cedba2c8a58e45cef39546` |
| Color original conservado | `324535beb709db44689f3193516212744c700fc74362acba7621a3802abf636c` |

## Entregables

- `BM20_R5R3R1_BN_Dorsos_Corregidos_A4.pdf` (8.219.759 bytes, 20 páginas).
- `BM20_R5R3R1_Informe_Correcciones.pdf` (4 páginas, comparativas visuales).
- `BM20_R5R3R1_BN_Corregido_y_QA.zip` con PDF, informe, resultados JSON y contacto visual 20 personajes.

Entregados como archivos del chat, no publicados en producción. No se modificó la fábrica estable, Creator Plus, Supabase, licencias ni assets comerciales almacenados.

## Estado comercial

**Corrección B/N: aprobada digitalmente.** Todavía requiere imprimir una hoja A4 real (100%, sin ajustar), medir la barra de 5 cm y recortar un modelo de tres familias (manteca, quesito y crema) para confirmar encastre antes de reemplazar el PDF privado y activar ventas.
