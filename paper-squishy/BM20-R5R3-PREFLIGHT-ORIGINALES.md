# BM20-R5R3 — Certificación de PDFs comerciales originales

**Fecha de inspección:** 2026-11-08.  
**Estado:** `METADATOS VALIDADOS — CERTIFICACIÓN DEL CONTENIDO PENDIENTE`  
**Fuente:** consulta de solo lectura al proyecto Supabase `expediente-dev` (`fzbndgfnqxcacsvlitui`), y comparación con `paper-squishy/butter-mania/manifest.json`.

## Identidad verificada de los archivos

| Variante | PDF registrado | Bytes reales (Storage) | Bytes catálogo | Integridad de ruta | Habilitado |
| --- | --- | ---: | ---: | --- | --- |
| Color | `BM20_20_A4_APAISADO_COLOR_FRENTE_DORSO.pdf` | 24.850.286 | 24.850.286 | Existe y coincide | No |
| B/N | `BM20_20_A4_APAISADO_BN_FRENTE_DORSO.pdf` | 8.240.058 | 8.240.058 | Existe y coincide | No |

Ambos objetos existen en el bucket **privado** `pc-digital-private`, debajo de `PSQ-BUTTER-20`, con MIME `application/pdf`. El catálogo `PSQ-BUTTER-20` permanece deshabilitado y los dos assets también: **no se alteró ningún permiso, licencia, archivo o registro.**

El manifiesto antiguo declara tamaños idénticos pero otra ruta (`paper-squishy-downloads/P2.5/BM20`). Por eso, esas rutas antiguas no deben utilizarse para descargar. Los SHA-256 esperados del manifiesto son:
- COLOR: `324535beb709db44689f3193516212744c700fc74362acba7621a3802abf636c`.
- BN: `6a0fe31d6b1a3e9739067fc8bc89bba0c8a0a11c1464ffa64cc621656e1c8dc8`.

**Los hashes no pudieron comprobarse**, porque la consulta a los metadatos del bucket no entrega los bytes originales. El valor `eTag` no equivale necesariamente a SHA-256.

## Por qué aún no está aprobado el PDF comercial

La función real `pasalochevere-digital-delivery` requiere sesión verificada y, para descargas, una licencia vigente con asset habilitado. Actualmente los assets están deshabilitados. Tampoco los dos originales aparecen en las cargas de archivos disponibles para este chat; sí aparecen previsualizaciones antiguas y documentos R5R2, que **no equivalen a los originales**.

En consecuencia, **NO fue posible abrir ni rasterizar las páginas de estos dos archivos privados**. No afirmar como verificado ninguno de los puntos siguientes:

- Número de páginas y tamaño real de MediaBox A4 apaisado.
- Colocación de frente y dorso y concordancia de contorno.
- Calidad y resolución efectiva de las ilustraciones.
- Contenido B/N verdaderamente monocromo.
- Ausencia de marcas de agua rasterizadas `VISTA PREVIA`.
- Exactitud de cortes, espejo, márgenes y escala 100%.
- SHA-256 de cada archivo original.

## Procedimiento disponible

Hay un validador de **solo lectura** preparado para ejecutar al obtener los originales. Comprueba tamaño y hash contra manifiesto, páginas A4, contenido por mitad, detección textual de marca de agua, DPI de imágenes y cromaticidad de B/N; produce PNGs de páginas representativas para inspección visual. Este validador fue probado con PDFs sintéticos, no con los originales. Nunca certifica por sí solo el encastre de corte.

Para recuperar los dos archivos reales sin activar la venta:
1. Entrar al Supabase Dashboard del proyecto `expediente-dev`.
2. Ir a `Storage > Files > pc-digital-private > PSQ-BUTTER-20`.
3. Abrir las dos subcarpetas existentes y **descargar** los archivos PDF individuales (sin cambiar sus permisos).
4. Adjuntarlos a esta conversación. Se realiza la certificación del contenido original y se revisa visualmente el A4; solo una impresión física da el cierre de corte.

## Decisión

**BM20-R5R3: control de almacenamiento y catálogo APROBADO.**  
**BM20-R5R3: certificación gráfica, estructural y de impresión de los dos PDF comerciales originales PENDIENTE de recibir los bytes originales.**

No activar publicación ni integrar Creator Plus mientras no esté resuelto el control de arte final.
