# BM20-R5R3 — Certificación real de los originales recibidos

**Fecha:** 2026-11-08. **Rama protegida:** `audit/bm20-r5r3-20261108`.  
**Fuentes reales:** `BM20_20_A4_APAISADO_COLOR_FRENTE_DORSO.pdf` y `BM20_20_A4_APAISADO_BN_FRENTE_DORSO.pdf` recibidos del propietario.

## Resultado

| Criterio | Color | B/N |
|---|---|---|
| Autenticidad SHA-256 | PASS | PASS |
| Tamaño registrado en Supabase | PASS 24.850.286 bytes | PASS 8.240.058 bytes |
| Cantidad de hojas | 20 | 20 |
| Formato A4 apaisado | 20/20 PASS | 20/20 PASS |
| Frente y dorso ilustrados | 20/20 PASS | 20/20 PASS |
| Nombres y orden de 20 modelos | PASS | PASS |
| Barra de control de escala 50mm | PASS | PASS |
| Marca "VISTA PREVIA" visible | No encontrada | No encontrada |
| Resolución de gráficos principales | 206–323 ppp | ~300 ppp |
| Contorno exterior | Espejo coherente | Defectos visuales en dorsos |
| Monocromía íntegra | N/A | NO (tintes violeta en encabezado/control) |
| Estado comercial sugerido | **Apto para muestra física; aprobación condicionada** | **No aprobado; corregir** |

### SHA-256 verificados por lectura de ambos archivos

- Color: `324535beb709db44689f3193516212744c700fc74362acba7621a3802abf636c`
- B/N: `6a0fe31d6b1a3e9739067fc8bc89bba0c8a0a11c1464ffa64cc621656e1c8dc8`

Ambos hashes coinciden exactamente con los declarados en el manifiesto original.

### Contornos color

Se rasterizaron las veinte páginas y se extrajeron los contornos exteriores rosados de frente y dorso, alineando y espejando el segundo. La comparación de las siluetas rellenas obtuvo **IoU mínimo 0,99333** (99,33%). Diferencias máximas de las cajas exteriores, a 120 ppp: **0,635 mm en ancho** y **0,423 mm en alto**. Incluye grosor y antialiasing de línea, no es prueba física de encastre.

### Resolución

- Color BM01 207 ppp, BM02 206 ppp, BM03 229 ppp; otros modelos varían entre 266 y 323 ppp.
- B/N: gráficos principales ~300 ppp en las cuarenta caras.
- 300 ppp es objetivo recomendado para impresión raster, no garantía única de calidad final.

### Errores visuales críticos de B/N

En los dorsos aparecen **dos o más contornos desplazados**, por ejemplo claramente en BM07, BM08, BM09 y BM17, y en varios diseños del mismo grupo. En BM09 el borde exterior de un cuadrado inclinado se cruza con otro contorno, generando líneas imposibles de seguir con tijera. El PDF B/N también contiene elementos de color violeta (la proporción de píxeles cromáticos sobre el total de página fue ~2,7%). El cuerpo de las ilustraciones está predominantemente en escala de grises, pero el PDF no es estrictamente monocromo.

**Decisión:** Rehacer dorsos B/N con una única silueta maestra espejada. Eliminar trazos duplicados; usar RGB neutro o grayscale en todos los encabezados y guías. Repetir QA digital de cada uno de los 20 modelos antes de volver a exportar.

### Aprobación comercial

**Color:** documentalmente auténtico, con diseño y contornos correctos en la revisión digital; faltan muestra impresa al 100%, calce físico, verificación de escala en papel y decidir si BM01–BM03 requieren mejores artes a 300 ppp.  
**B/N:** **no certificar para venta** hasta corregir los contornos.  
**Producto combinado:** **mantener deshabilitado**. No se modificaron licencias, activos, Supabase, originales ni fábrica estable.

Se entregó al usuario el PDF de auditoría visual de seis páginas junto con una carpeta ZIP de evidencias, contact sheets y resultados de verificaciones.
