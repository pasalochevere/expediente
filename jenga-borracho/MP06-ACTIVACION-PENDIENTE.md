# MODO PREVIA — MP06B · Protección y licencia de prueba

Fecha: 2026-10-19
Estado: **GATE PUBLICADO / PRUEBA CON CUENTA REAL PENDIENTE**.

## Publicado y verificado
- Producto `MP-001` registrado en proyecto Supabase `fzbndgfnqxcacsvlitui` (`expediente-dev`), precio ARS 14.999, duración comercial 8760 horas, 2 dispositivos, `sales_enabled=false`.
- Funciones `pasalochevere-access` (v29) y `pasalochevere-admin-license` (v16) reconocen `MP-001`.
- Portal en `portal-v2/` muestra MODO PREVIA, preview Party Pop, botón de activación y acceso desde `Mis juegos`.
- Nueva Edge Function `modo-previa-content` v1 `verify_jwt=true`; valida JWT con `auth.getUser`, licencia activada del titular, vencimiento, código de producto y dispositivo registrado.
- Banco de 42×3=126 desafíos migrado **sin modificaciones** a la Edge Function. Archivo público `jenga-borracho/data.js` retirado del HEAD del repositorio público. `index.html` ahora carga `license-gate.js` antes de cargar `app.js` y `manuals.js`.
- La función responde con `Cache-Control: no-store`; el service worker limpia cachés antiguas y ya no precachea el banco.
- La verificación se repite cada diez minutos durante sesiones prolongadas.
- Despliegue final GitHub Pages: commit `46e173ac31805be9df1ed1671e82a1c96e1b7796`, GitHub Actions SUCCESS.
- Escenarios simulados de gate (válido, sin sesión, licencia rechazada, sin código): PASS. También se verificó sintaxis JS e identidad de las 126 consignas.

## Licencia de prueba real
- Registro único de prueba con `product_code=MP-001`, `status=available`.
- Código de compra: `DEMO-MP-8771B1F01F15`.
- Vigencia: 24 horas **desde que el usuario active** la compra, no desde su creación.
- Dispositivos permitidos: 2.
- `order_ref=TEST:MP06B:20261019`. Solo para prueba, no venta.
- Se activará con la **primera cuenta autenticada** que lo utilice; no está preasignada a un email. No enviar a terceros.

## Prueba de punta a punta pendiente con una cuenta real
1. Abrir `https://pasalochevere.github.io/expediente/portal-v2/`.
2. Iniciar sesión y verificar correo.
3. En `Activar compra`, ingresar el código de prueba.
4. En `Mis juegos`, ubicar MODO PREVIA y pulsar `JUGAR`.
5. Debe abrirse `/expediente/jenga-borracho/?access=...&v=mp04` y cargar los tres modos.
6. Cerrar y reabrir desde `Mis juegos`, probar refresco, otro navegador y un código inválido o vencido.
7. Revisar consola de navegador, flujos de activación, dispositivos y contenido contra un usuario no autorizado.

## Limitaciones y próximos controles
- **No considerar la venta lista** hasta que un usuario complete el paso anterior. La última prueba fue simulada y no una sesión real.
- **Exposición histórica:** GitHub conserva historial público del antiguo `data.js`, que puede haber sido cacheado o clonado. El gate protege la entrega nueva, pero no puede hacer confidenciales copias ya distribuidas. No borrar ni reescribir la historia de todo el repositorio sin un plan específico y autorización.
- Las licencias de 12 meses deben verificar autoría, caducidad y dispositivo en backend antes de entregar desafíos. No esconder/mostrar solamente elementos del frontend.
- Si se decide vender el producto, habilitar `sales_enabled` solo luego de completar QA extremo a extremo y revisar riesgos del historial.
