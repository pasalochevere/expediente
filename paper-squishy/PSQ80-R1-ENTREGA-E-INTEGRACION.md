# PSQ80-R1 — Consolidación + integración protegida

**Fecha:** 2026-11-10.

## 1. PDF comerciales de 80 modelos

Construidos sin redibujar, remuestrear ni modificar las páginas fuente:
- 60 páginas originales de la fábrica actual: `04_PAPER_SQUISHY_60_COLOR_2_POR_HOJA_FRENTE_DORSO.pdf` y `PAPER_SQUISHY_60_COLORING_2_POR_HOJA_FRENTE_DORSO.pdf`, recuperados de la biblioteca de archivos del propietario.
- 20 páginas Butter Mania: original `BM20_20_A4_APAISADO_COLOR_FRENTE_DORSO.pdf` y B/N R5R3R1 con dorsos corregidos.

| Output | Páginas | Bytes | SHA-256 |
|---|---:|---:|---|
| `PASALOCHEVERE_SQUISHIES_80_COLOR_A4_APAISADO.pdf` | 80 | 41.571.019 | `789c459ae5e38f8ecfbf572a1f0338cbdd5d5e797c5e52152adfb660722d341a` |
| `PASALOCHEVERE_SQUISHIES_80_BN_A4_APAISADO.pdf` | 80 | 27.922.834 | `3fdf063c4ef6f455859acb144c4fdf394e4e8cd59a3ef49d2ac74af0b42fd83c` |

Cada archivo tiene 80 hojas A4 horizontales, una por personaje, frente y dorso juntos. Las páginas 1–60 son originales; 61–80 son Butter. Comparación de píxeles de muestras en ambas partes: idénticos antes/después de la consolidación. La versión B/N antigua de 60 incluye elementos de encabezado en color: se preservó porque el usuario pidió conservar lo ya validado; no se convirtió todo el master a grises.

Los PDFs y un ZIP de ambos se entregaron como adjuntos a la conversación, no como objetos públicos de GitHub.

## 2. Integración en fábrica — prueba independiente

- Ruta publicada: https://pasalochevere.github.io/expediente/paper-squishy/factory-80-preview.html
- Add-on: `paper-squishy/psq80-butter-extension.js`
- Colección adicionada: Butter Mania, 20 personajes y 180 vistas WebP originales en los 12 ZIP existentes.
- Se mantienen los 60, seis colecciones y el core congelado sin modificación.
- Catálogo de preview: **80 personajes, siete colecciones, nueve vistas por personaje Butter**.
- Prueba aislada navegador Chromium (390px): PASS, 120 recursos decodificados.
- Prueba Node: PASS, 60 entradas originales inalteradas, 20 códigos Butter únicos, 180 imágenes WebP con firma RIFF.
- GitHub Pages desplegado: https://github.com/pasalochevere/expediente/actions/runs/42812746866

**Límite:** la prueba de la URL real en sesión anónima redirigió al portal de acceso, conforme al sistema de licencias. No se pudo certificar Creator Plus de punta a punta con sesión real autorizada. La vista individual para imprimir Butter usa recursos de previsualización; la impresión comercial deberá hacerse desde los PDFs 80.

## 3. Subida privada pendiente

- Administrador dedicado publicado: https://pasalochevere.github.io/expediente/paper-squishy/admin-psq80-upload.html
- Valida tamaño y SHA-256 exactos de los dos PDFs 80.
- Sube a `paper-squishy-downloads/P3.0/PSQ80/`, bucket privado con RLS de administradora.
- `upsert:false`: no reemplaza masters existentes.
- Estado Storage al finalizar el trabajo: **sin archivos bajo `P3.0/PSQ80/`**. Requiere que el usuario seleccione ambos PDFs desde su sesión autenticada y pulse el botón de carga; no hay una herramienta de upload binario de Storage disponible en esta conversación.
- La fábrica estable y las licencias permanecen intactas. Las descargas del catálogo actual NO se modificaron.

## 4. Próximo gate antes de la promoción comercial

1. Subir los dos PDFs80 con la herramienta administradora.
2. Confirmar en SQL privado existencia y bytes, y verificar hashes por descarga autorizada.
3. Validar el navegador con sesión real de licencia: catálogo de siete colecciones, 80 personajes, nueve vistas, Creator Plus y acciones de impresión seguras.
4. Integrar las dos descargas PSQ80 al flujo privado existente de `PSQ-FACTORY`, sin quitar los 60 ni eliminar respaldos.
5. Aprobar prueba física de corte y encastre para Butter BM01/BM02/BM07; publicar solo tras validación comercial.

**Estado general: PDFs 80 ENTREGADOS / colección Butter STAGING PUBLISHED / PDFs80 STORAGE PENDING / factory stable UNSCHANGED.**
