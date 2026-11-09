# BM20-R5R3R3 — Cierre digital y reemplazo protegido (staging)

Fecha: 2026-11-09.

## Estado confirmado

**PDF B/N candidato**: `BM20_R5R3R1_BN_Dorsos_Corregidos_A4.pdf`
- 20 páginas A4 apaisado (842 × 595 pt).
- 40 imágenes fuente preservadas en comparación con el PDF B/N original.
- Tamaño: **8.219.759 bytes**.
- SHA-256: `c2adde75329c492325ed4f6d9aa7694e7227050ab2cedba2c8a58e45cef39546`.
- Color original inalterado.

**Origen B/N preservado**:
- 8.240.058 bytes.
- SHA-256: `6a0fe31d6b1a3e9739067fc8bc89bba0c8a0a11c1464ffa64cc621656e1c8dc8`.

**Estado Supabase** comprobado por SQL de solo lectura al finalizar:
- Producto `PSQ-BUTTER-20` deshabilitado.
- PDF color privado existente y deshabilitado.
- PDF B/N anterior privado existente y deshabilitado.
- **Nueva versión todavía NO cargada en storage**.

## Herramienta de carga segura publicada

URL: https://pasalochevere.github.io/expediente/admin-licencias/butter-mania-bn-r5r3r3.html

Commit exclusivo en `main`: `fc916522fe57f4dd50c4f18b6fb21b5fd6fb3116`.  
GitHub Pages desplegó exitosamente el cambio: https://github.com/pasalochevere/expediente/actions/runs/42610751560

La herramienta:
1. Comprueba la sesión administradora en `pasalochevere-digital-delivery`.
2. Confirma catálogo deshabilitado y ambos archivos originales registrados y deshabilitados.
3. Comprueba en cliente el SHA-256 y tamaño exacto del PDF B/N corregido.
4. Solicita URL de subida temporal al servidor.
5. Sube **un archivo nuevo con nombre distinto**, sin upsert del antiguo.
6. Lo registra y deshabilita mediante `admin_toggle_asset`.
7. Vuelve a verificar que producto, archivos originales y corrección están todos deshabilitados.
8. Evita cargas duplicadas si ya hay una versión corregida registrada.

**No se cargó el PDF automáticamente**: requiere la acción de un administrador autenticado seleccionando el PDF. El conector actual de Supabase no expone carga de bytes a Storage desde esta conversación. No se intenta eludir los controles de autenticación.

## QA de la herramienta

Cuatro escenarios de navegador en Playwright Chromium: admin permitido, no-admin bloqueado, catálogo habilitado accidentalmente bloqueado y archivo ya cargado detectado e impedido de duplicarse. También rechazo de PDF erróneo por tamaño. GitHub Actions: https://github.com/pasalochevere/expediente/actions/runs/42610614051 — **SUCCESS**.

## Requisitos pendientes para cierre de imprenta y activación comercial

Aún no se recibió la prueba física de impresión y encastre. Imprimir BM01 (manteca), BM02 (quesito), BM07 (crema) al **100%, sin ajustar**, medir barra 50 mm y confirmar que frente y dorso calzan tras recortar y pegar. Sin esto no puede afirmarse que la impresión física esté aprobada.

Tras evidencia física satisfactoria y subida suspendida de la versión corregida:
- Reconsultar ambos assets B/N, que estén deshabilitados, tamaños y existencia en Storage.
- Decidir habilitar **solo** el asset nuevo y el producto, preservando rollback del B/N anterior.
- Verificar descarga real desde licencia autorizada.
- Ante error, deshabilitar el nuevo asset y (si se decide) volver al original, sin eliminar objetos.

**Estado: cargador publicado, QA digital aprobado, sustitución privada pendiente de carga autenticada, cierre físico y activación comercial pendientes.**
