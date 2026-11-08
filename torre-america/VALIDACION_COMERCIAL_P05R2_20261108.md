# Torre de América — P0.5R2 · Ediciones registradas y permisos aislados

**Fecha:** 2026-11-08  
**Candidata:** `TA-V2.0-RC1-P05R2-20261108`  
**Decisión:** **CANDIDATA TÉCNICA PARA QA**, todavía **NO-GO** para ventas, PWA u oficialización.

## Avances reales
1. Se crearon en `expediente-dev` los SKUs `FUT-AMERICA-DIG` (Solo Digital) y `FUT-AMERICA-PHY` (Torre Física + Digital) con `sales_enabled=false`, `price_ars=NULL` y `game_url=NULL`; catálogo `enabled=false` para ambos. Los parámetros 8760 horas y 2 dispositivos se copiaron del producto histórico como valores **provisionales**.
2. El producto histórico `FUT-AMERICA` mantiene su configuración y URL V1. No se crearon pedidos, licencias ni transacciones para los nuevos SKUs.
3. Se desplegó una **Edge Function nueva y aislada** `torre-america-entitlement-rc` v1. El endpoint requiere JWT válido y `auth.getUser()`, comprueba pertenencia, licencia activa/no vencida y dispositivo registrado; solo consulta las tablas, sin escrituras. Devuelve:
   - `FUT-AMERICA-DIG` → `DIGITAL`
   - `FUT-AMERICA-PHY` → `DIGITAL`, `FISICA`
   - `FUT-AMERICA` (legacy) → `DIGITAL`, `FISICA`
4. La RC V2 usa `access-rc1.js`, una copia específica de su validador: primero invoca el registro de dispositivo existente y después el nuevo control de permisos. Si falla cualquier validación **no abre la partida**. Las claves locales de licencia RC son independientes de las de V1. El RC **no admite acceso sin conexión** hasta validar una PWA V2 aislada.
5. `ta-rc-formats-p05r2.js` permite solo el formato autorizado y no muestra la torre física para el SKU Digital; impide recuperar una partida guardada con torre cuando la cuenta es Solo Digital. La restricción de interfaz evita usos accidentales, **no debe considerarse protección contra manipulación del JavaScript en el navegador**.
6. `ta-rc-formats-p05r2.css` mejora la presentación de la única tarjeta digital. Todas estas capas se cargan **únicamente** desde `v2-rc.html`.
7. No se alteraron el archivo estable `index.html`, el acceso compartido `access.js`, el service worker V1, el motor original ni las licencias históricas.

## Pruebas realizadas
| Prueba | Resultado |
| --- | --- |
| Datos reales de las tres fichas (SQL) | Tres presentes; ninguna habilita venta |
| Catálogo digital de nuevos SKU | Inactivo (ambos) |
| Pedidos nuevos y licencias de nuevos SKUs | Ninguno |
| Edge Function nueva | `ACTIVE`, v1, `verify_jwt=true` |
| Preflight de autorización del código del endpoint | Usuario + propiedad + expiración + dispositivo |
| Cliente RC con validador simulado | 5 escenarios; 5 correctos |
| Formatos con UI simulada | 3 perfiles; 3 correctos |
| JS y HTML RC | Sin errores de sintaxis |
| V1/worker/acceso estable | SHAs sin cambios |
| Login real de QA y licencia digital/física | **No realizado**, no hay cuenta/licencia de QA preparada |
| GitHub Pages, Chrome/Android/iPhone | **No confirmado** (herramientas sin navegación autenticada) |
| PWA V2 y offline | **Pendientes** |

## Límites conocidos y liberación pendiente
- **Portal Biblioteca:** el servicio compartido `pasalochevere-access` v35 todavía contiene un mapa de productos que no reconoce los nuevos códigos ni publica una URL de acceso para ellos. Se requiere integración controlada del portal antes de venta; **no se desplegó ninguna modificación del servicio compartido**.
- **Cuentas de prueba:** crear 2 licencias de QA para usuarios controlados, una de cada SKU, sin acceder a compras reales; probar vigencia, revocación, límite de dispositivos y distintos navegadores.
- **PWA/offline:** aun sin registrar el worker desde RC, un worker V1 instalado previamente puede controlar la misma ruta. Resolver con scope V2 independiente antes de prometer offline.
- **Producción:** confirmar los precios, stock físico, cantidad y dimensiones de bloques, duración de licencia, dispositivos, condiciones y logística; realizar compra simulada y confirmar entrega/activación antes de habilitar `sales_enabled`.
- **Seguridad/comercial:** la base de consignas se sirve al navegador. En una webapp estática, los derechos de selección por formato dependen de la interfaz; no anunciar restricciones criptográficamente inviolables.

## Enlaces de QA
- RC: `https://pasalochevere.github.io/expediente/torre-america/v2-rc.html?v=p05r2b`
- RC con diagnóstico: `https://pasalochevere.github.io/expediente/torre-america/v2-rc.html?qa=1&v=p05r2b`
- V1: `https://pasalochevere.github.io/expediente/torre-america/`

**Próximo hito:** `P0.5R3 — Integración de Biblioteca, licencias QA y PWA V2 aislada`. No reemplazar V1 ni habilitar ventas antes de cerrar esos controles.
