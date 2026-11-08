# Torre de América — P0.5R3 · Biblioteca, licencias QA y PWA V2 separada

**Fecha:** 2026-11-08  
**Versión QA:** `TA-V2.0-RC1-P05R3-20261108`  
**Estado:** desarrollo e integración técnica completos; **NO-GO a venta / migración definitiva** hasta QA de cuentas, móviles y offline.

## 1. Biblioteca real de PasaloChévere

- Frontend identificado: `portal/index.html`; presenta "Mi Biblioteca" mediante `renderLicenses()` desde la Edge Function `pasalochevere-access`.
- Servicio compartido actualizado de v35 a **v37** mediante cambios estrictamente aditivos.
- Nuevos códigos:
  - `FUT-AMERICA-DIG`: Solo Digital; enlace `../torre-america/v2/?sku=FUT-AMERICA-DIG`.
  - `FUT-AMERICA-PHY`: Torre Física + Digital; enlace `../torre-america/v2/?sku=FUT-AMERICA-PHY`.
- `FUT-AMERICA` legado conserva ruta y conducta existentes: `../torre-america/` y su acceso actual.
- Los enlaces de los nuevos SKUs **no llevan códigos personales en la URL**; el SKU es público, y la licencia se obtiene desde `me` después de autenticar la cuenta.
- No se cambió `portal/index.html`: ya funciona de forma dinámica con enlaces `game_url` para licencias activas.

## 2. Licencias QA

Dos reservas reales creadas en `public.exp_licenses`, una por SKU, batch `TA-P05R3-QA`, fuente `qa_p05r3_20261108`.
- `status=available`; sin usuario/correo asignado, activación, vencimiento ni dispositivos.
- No se muestran ni exportan las claves en la documentación.
- No hay compra, cobro ni pedido asociado; las ventas de ambos SKUs siguen deshabilitadas y con precio NULL.
- **No son pruebas E2E todavía**: para ejercitar el flujo se necesita designar una cuenta QA con email verificado, activar con esa cuenta y registrar su dispositivo. No se asignaron licencias a compradores reales.

## 3. Autorización V2

- `torre-america-entitlement-rc` v1 está activo y `verify_jwt=true`.
- Consulta solamente: `auth.getUser()`, titularidad de la licencia, vigencia, dispositivo registrado y SKU de Torre de América.
- Formatos:
  - `DIG`: `DIGITAL`.
  - `PHY`: `DIGITAL`, `FISICA`.
  - `FUT-AMERICA` legado: `DIGITAL`, `FISICA`.
- `access-rc1.js` resuelve la licencia por `?sku=` + sesión, registra dispositivo mediante el servicio existente, obtiene permisos por el servicio aislado y solo entonces abre la app. Claves de sesión RC separadas de las de V1.
- El selector impide elegir formato físico cuando corresponde Solo Digital y no reanuda una partida de torre física con ese permiso.
- El estado de SKU se conserva en LocalStorage para que la PWA instalada lo recupere al abrir `?pwa=1`.
- La restricción del selector es una restricción de interfaz; por tratarse de un juego estático, no equivale a protección anti-manipulación del contenido local.

## 4. PWA V2 QA: nueva ruta y archivos

`torre-america/v2/index.html` utiliza `<base href="../">` para conservar referencias al motor y biblioteca existentes, sin duplicar ni cambiar datos originales.

Archivos exclusivos de la carpeta `/torre-america/v2/`:
- `index.html`: entrada RC P0.5R3 y verificación de licencias.
- `manifest.webmanifest`: aplicación identificada como **Torre V2 QA**, `start_url="./?pwa=1"` y `scope="./"`.
- `sw.js`: worker registrado únicamente bajo **/torre-america/v2/**.
- `pwa-qa.js`: se activa solo con `?pwa=1`, expone un pequeño panel de estado e instalación de prueba.
- `offline.html`: pantalla segura de reconexión, no da acceso al juego cuando no se puede validar el permiso online.

Worker nuevo:
- elimina exclusivamente cachés cuyos nombres empiezan por `ta-v2-qa-`; no elimina cachés de V1 ni otros proyectos;
- no almacena navegaciones con parámetros sensibles en la URL;
- no intercepta solicitudes entre orígenes ni navegación fuera del scope V2;
- con conexión usa network-first; sin conexión devuelve `offline.html` en una navegación V2.

**Limitación conocida de coexistencia:** el SW original `torre-america/service-worker.js` de V1 tiene una limpieza global de caches en `activate`. Una futura actualización de V1 podría borrar cachés de V2 por compartir origen. **No se modificó el SW estable**. Por ello V2 debe seguir bajo QA hasta resolver este conflicto con una migración segura o un origen completamente separado.

## 5. Pruebas ejecutadas

| Prueba | Resultado |
| --- | --- |
| URL relativa de Biblioteca Digital y Física | Se resuelve a `/expediente/torre-america/v2/?sku=…` |
| `<base href="../">`, bibliotecas, CSS, manifest, icono y worker | URLs resueltas correctamente |
| Frontend `access-rc1.js` simulado, seis escenarios (incluye cambio de edición, PWA, denegación y offline) | 6/6 correctos |
| Selector de permisos simulado con tres perfiles (P0.5R2) | 3/3 correctos |
| Supabase v37 y función aislada v1 | Ambas activas; mapa de SKUs verificado |
| Dos SKUs nuevos y catálogo | Existen; `sales_enabled=false`, `price_ars=NULL`, `catalog_enabled=false` |
| Dos licencias de reserva QA | Creadas, sin asignación ni activación |
| Compras `FUT-AMERICA*` | Sin pedidos |
| JS/manifest/HTML de la nueva carpeta V2 | Archivos existentes; sin errores de sintaxis detectados |
| V1 `index.html`, `access.js`, SW y manifest | SHAs originales intactos |
| Navegación real de GitHub Pages | **No verificada** (el navegador externo no pudo abrir el enlace) |
| Login real de QA y activar nuevas licencias | **Pendiente** |
| Instalación Chrome/Android/iOS y update/rollback de workers | **Pendiente** |
| Juego completo offline | **No habilitado** a propósito |

## 6. Puerta de salida comercial

- [ ] Verificar publicación de GitHub Pages y ejecutar la PWA QA en Chrome/Android/iOS.
- [ ] Probar convivencia y reinicios de service workers V1 + V2, con caché seguro.
- [ ] Designar cuentas QA y activar por cada SKU reservado sin cobrar.
- [ ] Entrar desde "Mi Biblioteca": Digital, Física, licencia legacy, vencida e inválida; verificar recuperación de sesión y límite de dispositivos.
- [ ] Prueba real de principio a fin en ambas ediciones (partida, dados, poderes, penales, guardado, recarga).
- [ ] Confirmar plazo de acceso, máximo de dispositivos, precio, stock y condiciones de entrega.
- [ ] Configurar enlace oficial `pc_products.game_url` y activar catálogo solo después de probar.
- [ ] Publicar imágenes comerciales, caja física y digital, soporte y material de venta cuando la RC esté aprobada.

**No se habilitaron ventas, no se publicaron nuevos productos al catálogo y no se reemplazó V1.**

## Enlaces
- QA PWA: `https://pasalochevere.github.io/expediente/torre-america/v2/?pwa=1`
- QA por SKU: `https://pasalochevere.github.io/expediente/torre-america/v2/?sku=FUT-AMERICA-DIG` / `?sku=FUT-AMERICA-PHY`
- V1: `https://pasalochevere.github.io/expediente/torre-america/`
