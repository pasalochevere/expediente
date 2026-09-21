# P2.4.2A.1 — MATRIZ TÉCNICA POR RUTA + LOTE CRÍTICO

Fecha: 2026-09-21
Producto: EXP-002 · Caso 002 — La Habitación que No Existe

## Estado comercial

- `sales_enabled=false` durante el hotfix visual.
- Las licencias existentes continúan activas y no requieren migración.
- No se modifica canon, solución dinámica ni ENGINE P2.

## Contrato de carga visual de producción

Orden obligatorio:

1. `assets/visual/assets-part-01.js` … `assets-part-08.js`
2. overrides correctivos por ID
3. `assets/visual/visual-restoration.js`

Build de control: `20260921-p242a1b`.

## Matriz

| ID | Elemento | Ruta / fuente actual | Incidencia observada | Ruta correctiva / fuente maestra | Superficies | Prioridad | Estado |
|---|---|---|---|---|---|---|---|
| P04 | Damián Orsini · Arquitecto | `assets-part-07.js` | mosaico / pixelado | fuente sana: `c002_web_assets/P04.jpg` 640×360; small 480×270 | Archivo visual + selector | ALTA | siguiente lote |
| P05 | Eva Montenegro · Escritora / Médium | bundle visual legado / fallback incorrecto | mostraba 317 | `assets/visual/fix-P05-v242.js` · fuente sana 480×270 | Archivo visual + selector | CRÍTICA | corregido, pendiente QA real |
| P06 | Franco Valdés · Heredero | bundle visual legado / fallback incorrecto | mostraba 317 | `assets/visual/fix-P06-v242.js` · fuente sana 480×270 | Archivo visual + selector | CRÍTICA | corregido, pendiente QA real |
| L03 | Archivo subterráneo | `assets-part-02.js` | imagen rota / alt visible | `assets/visual/fix-L03-v242.js` · fuente sana 480×270 | Archivo visual + lugares | CRÍTICA | corregido, pendiente QA real |
| O02 | Reloj 03:17 | bundle objetos legado | card vacía / inconsistente | fuente sana: `c002_web_assets/O02.jpg` 640×360; small 480×270 | Archivo visual + objetos | ALTA | siguiente lote |
| O03 | Cinta de casete | `assets-part-05.js` | pixelado / degradado | fuente sana: `c002_web_assets/O03.jpg` 640×360; small 480×270 | Archivo visual + objetos | ALTA | siguiente lote |
| room_317 | Habitación 317 | bundle visual legado | mosaico / pixelado | `assets/visual/fix-room-317-v242.js` · fuente sana 480×270 | portada lateral + área especial + revelación 317 | CRÍTICA | corregido, pendiente QA real |
| hero_hotel | Hotel Orfeo hero | asset restaurado | sin bloqueo confirmado | conservar master restaurado | portada / cinema | MEDIA | auditar en QA |
| door_317 | Puerta 317 | `assets-part-08.js` | sin bloqueo confirmado | conservar master restaurado | portada / cinema | MEDIA | auditar en QA |

## Lote crítico P2.4.2A.1

Implementado:

- `fix-P05-v242.js`
- `fix-P06-v242.js`
- `fix-L03-v242.js`
- `fix-room-317-v242.js`

Los cuatro archivos se cargan después de `assets-part-01..08` y antes de `visual-restoration.js`, de forma que el adaptador recibe los valores correctos al parchear `window.CASE002_DATA`.

El archivo combinado experimental `assets-critical-v242.js` fue retirado por haber quedado truncado durante una escritura anterior. Producción ya no depende de él.

## Fuente maestra verificada

Las variantes locales de control de P04, P05, P06, L03, O02, O03 y room_317 fueron inspeccionadas y son visualmente sanas. El defecto está en la integración/bundle servido, no en los masters.

## Gate

P2.4.2A.1 no se considera GO visual hasta verificar en navegador real:

- P05 correcto
- P06 correcto
- L03 visible
- Habitación 317 sin mosaico

Después: `P2.4.2B.1 — LOTE CALIDAD/MAPEO RESTANTE` para P04 + O02 + O03 y auditoría completa de los 21 assets.
