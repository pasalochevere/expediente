# BM20-R5R2 — Auditoría visual premium y preparación para impresión

Fecha: 8 de noviembre de 2026
Rama protegida: `audit/bm20-r5r2-20261108`.
**Decisión: PREPARACIÓN TÉCNICA COMPLETADA; PRENSA COMERCIAL NO APROBADA AÚN.**

## Evidencia

- [GitHub Actions — preflight y composiciones de contacto](https://github.com/pasalochevere/expediente/actions/runs/42531400135)
- Artefacto: `bm20-r5r2-print-audit`. Incluye contactos visuales de los 20 personajes: frente/dorso color, frente/dorso B/N, hero, editor asset, fichas, JSON y geometría.
- La auditoría es read-only sobre ZIPs originales del repositorio. No modifica fábrica, motores, licencias ni archivos almacenados.

## Inventario y tamaños

- 20 personajes `BM01..BM20`, 180 recursos WebP únicos y sin colisiones SHA-256.
- `hero`: 900x900 RGB; `editor_asset`: 540x540 RGBA.
- `front_print`, `back_print`, `coloring`, `coloring_back`: 600x848 RGB y con marca de agua `VISTA PREVIA`.
- `character_card` y `tutorial`: 1055x1491 RGB.
- Declaración del manifiesto: `A4_landscape`, 20 hojas por variante.
- La caja exterior `cut_mm` va desde aproximadamente 103,9x120 hasta 120x119,2 mm según diseño.

## Geometría calculada a partir del alfa

Los 20 `editor_asset` tienen siluetas opacas cuya relación ancho/alto coincide con la caja `cut_mm` declarada:
- Máximo error de proporción: **0,425%**.
- DPI efectivo de los silueteados RGBA si se imprimieran en su tamaño declarado: **90,2–90,6 ppp**.
- Este resultado verifica *proporción*, no precisión del espejo de dorso ni nitidez imprimible.

Conclusión: **no** ampliar las imágenes del editor de 540px para generar el PDF comercial. Usar los masters/PDFs de impresión originales y revisar su resolución y escala real.

## Auditoría artística (observación de planchas)

**Correcto/encaminado**
- Colección kawaii coherente: expresión, brillo, paleta y contornos consistentes.
- Frente y dorso visualmente compatibles en los 20 prototipos.
- Dibujos B/N de alto contraste en la ilustración principal.

**Correcciones para producto premium**
1. Eliminar dependencia de imágenes con la marca `VISTA PREVIA` para exportar, imprimir o vender; las previsualizaciones sí deben mantenerse para la demo.
2. En los másters B/N, el encabezado, metadatos y cualquier línea de control deben ser también grises/negros, nunca magenta/rosa.
3. Confirmar *cut contour* y encastre del espejo sobre al menos una impresión física de cada familia: mantecas, quesitos, cremas.
4. Priorizar diferenciación gráfica entre BM07/BM18 (frutilla) y BM08/BM19 (arándanos): son variaciones visualmente próximas.
5. En PDFs finales, asegurar que una página A4 apaisada contiene frente y dorso al tamaño físico declarado sin reducción automática del cuadro del controlador.
6. El fondo del editor es transparente en RGBA (se ve correctamente al componerlo sobre blanco); no confundir sus canales RGB ocultos con un defecto visual.
7. Verificar margen no imprimible de la impresora, instrucciones a 100%, grosor de líneas y referencia física de 20mm/50mm.

## Verificación de PDFs en almacenamiento privado

Se confirmó mediante **consulta SQL de solo lectura** que hay dos PDFs en el bucket privado `pc-digital-private`, bajo la colección `PSQ-BUTTER-20`, con los siguientes nombres y tamaños:

| Archivo | Tamaño en bytes | Archivo manifiesto anterior |
|---|---:|---|
| `BM20_20_A4_APAISADO_COLOR_FRENTE_DORSO.pdf` | 24.850.286 | color 24.850.286 |
| `BM20_20_A4_APAISADO_BN_FRENTE_DORSO.pdf` | 8.240.058 | B/N 8.240.058 |

Los tamaños coinciden con el manifiesto, aunque allí se declara otra ubicación (`paper-squishy-downloads/P2.5/BM20`) y un estado `preview_only_pending_private_upload` que **ya no representa el almacenamiento actual**. No editar el manifiesto de producción sin reconciliar el mecanismo de descargas.

**Límite crítico:** no se obtuvo contenido ni acceso directo autorizado a esos PDFs. Por lo tanto, **no están comprobados** número de páginas, MediaBox A4, resolución interna, hash, espejo, contornos, marca de agua, escala ni márgenes. Los ZIP del repositorio no reemplazan esta verificación.

## Pruebas de aceptación antes de venta

1. Abrir **ambos PDFs originales privados** como usuario autorizado y comprobar 20 páginas A4 apaisadas en cada uno (o estructura equivalente documentada).
2. Verificar tamaño real sin escalado; medir cuadrado 20mm y regla 50mm de la plantilla auxiliar.
3. Inspeccionar BM01, BM02, BM03, BM07, BM14, BM16, BM17 y BM20, tanto frente como dorso, al 100% de escala.
4. Alinear los contornos sobre una copia impresa, comprobar espejo, CUT exterior y margen para pegado.
5. Para B/N: probar impresión en modo monocromo y coloreabilidad sin marcas internas.
6. Aprobar archivo comercial solo tras muestras físicas correctas.

## Resultado

La revisión visual y el preflight dimensional de **previsualizaciones** están terminados. Se creó una **plantilla auxiliar A4 apaisada de 22 páginas**, que reproduce las cajas exteriores del manifiesto a escala y lleva referencias físicas de 20 y 50mm; **no contiene artes ni curvas finales de corte**. El archivo descargable se adjunta en la entrega del chat.

**BM20-R5R2 → QA técnica completa; aprobación de artes finales de imprenta pendiente.**
