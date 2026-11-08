# BM20-F10 — Integración controlada (rama de prueba)

Fecha de preparación: 2026-11-08. Proyecto: PasaloChévere.

## Estado real
- 20 personajes de Butter Mania; 9 vistas por personaje; 180 WebP.
- PDF color y B/N A4 apaisados (20 páginas por versión).
- Producto de portal reservado en `public.pc_digital_catalog` como `PSQ-BUTTER-20`, `enabled=false`.
- No hay PDFs de Butter Mania en el bucket privado de producción `pc-digital-private` al preparar esta entrega.
- No hay imágenes Butter Mania en `paper-squishy-assets` al preparar esta entrega.
- Fábrica comercial `paper-squishy/factory.html` no alterada.
- No activar ni las ventas ni la integración hasta completar QA funcional y de licencias.

## PASO A — Subir PDFs al bucket privado (operación en Supabase Dashboard)
Bucket: `pc-digital-private`, debe permanecer privado.
Carpeta: `PSQ-BUTTER-20/BM20-F9/`.
Subir exactamente estos nombres (no los renombres):
- `BM20_20_A4_APAISADO_COLOR_FRENTE_DORSO.pdf` (24850286 bytes)
- `BM20_20_A4_APAISADO_BN_FRENTE_DORSO.pdf` (8240058 bytes)
Comprobar con Storage que están cargados y comparar tamaño / SHA-256.
No escribir manualmente en `storage.objects` para simular la carga.

## PASO B — Registrar archivos en la tabla de entregas, DESHABILITADOS
Después de confirmar que los dos objetos existen en `storage.objects`:
```sql
INSERT INTO public.pc_digital_assets(product_code,file_name,object_path,file_size,mime_type,enabled)
SELECT 'PSQ-BUTTER-20','BM20_20_A4_APAISADO_COLOR_FRENTE_DORSO.pdf','PSQ-BUTTER-20/BM20-F9/BM20_20_A4_APAISADO_COLOR_FRENTE_DORSO.pdf',24850286,'application/pdf',false
WHERE EXISTS(SELECT 1 FROM storage.objects WHERE bucket_id='pc-digital-private' AND name='PSQ-BUTTER-20/BM20-F9/BM20_20_A4_APAISADO_COLOR_FRENTE_DORSO.pdf')
AND NOT EXISTS(SELECT 1 FROM public.pc_digital_assets WHERE product_code='PSQ-BUTTER-20' AND file_name='BM20_20_A4_APAISADO_COLOR_FRENTE_DORSO.pdf');
INSERT INTO public.pc_digital_assets(product_code,file_name,object_path,file_size,mime_type,enabled)
SELECT 'PSQ-BUTTER-20','BM20_20_A4_APAISADO_BN_FRENTE_DORSO.pdf','PSQ-BUTTER-20/BM20-F9/BM20_20_A4_APAISADO_BN_FRENTE_DORSO.pdf',8240058,'application/pdf',false
WHERE EXISTS(SELECT 1 FROM storage.objects WHERE bucket_id='pc-digital-private' AND name='PSQ-BUTTER-20/BM20-F9/BM20_20_A4_APAISADO_BN_FRENTE_DORSO.pdf')
AND NOT EXISTS(SELECT 1 FROM public.pc_digital_assets WHERE product_code='PSQ-BUTTER-20' AND file_name='BM20_20_A4_APAISADO_BN_FRENTE_DORSO.pdf');
```
Verificar el flujo real de descarga del portal con una cuenta de prueba licenciada para PSQ-BUTTER-20 y otra sin licencia. No asumir que registrar un SKU habilita automáticamente la emisión de códigos.

## PASO C — Preparar fábrica, SIN publicar
- Revisar los 180 WebP antes de ponerlos en bucket público: los `front_print`, `back_print` y `coloring` contienen imágenes utilizables para impresión; decidir si se limitarán a vista previa (marcas de agua o reducción) para evitar la distribución gratuita del producto de venta.
- Integrar metadatos solo en ruta/branch de prueba, no en el cargador comercial actual.
- Mapear `bm01`..`bm20` a nueve claves de vista y verificar nombres, CUT y espejo por personaje.
- **Importante**: `editor_ready=false` y no anunciar la edición de Butter Mania como funcional hasta probar recolor, transparencia, impresión/escala, interacción y mobile.
- Activar temporalmente QA para la séptima colección; si pasa, preparar una promoción controlada.

## PASO D — Portal comercial
- La tarjeta actual en `portal-v2` no debe quedar visible hasta que funcione la entrega privada.
- Verificar portada, precio, activación y autorización del SKU de Butter Mania.
- Solo tras comprobación positiva y negativa: habilitar dos assets, `pc_digital_catalog.enabled=true` y publicar la tarjeta.
- No alterar el precio o condiciones de PSQ-FACTORY ni de Megapack 60.

## Rollback
- Catálogo: volver `PSQ-BUTTER-20.enabled=false`, assets=false, retirar tarjeta del despliegue.
- Fábrica: revertir el pequeño cambio de carga del módulo; conservar originales y los 60 personajes existentes.
- No borrar archivos de otras colecciones ni tocar el núcleo estable.
