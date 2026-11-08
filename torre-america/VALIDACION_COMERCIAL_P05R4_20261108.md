# Torre de América V2 — P0.5R4 · QA de activación, PWA y coexistencia

**Fecha:** 2026-11-08  
**Estado:** VERIFICACIÓN TÉCNICA PARCIAL; **NO-GO A LIBERACIÓN COMERCIAL**.

## Alcance y fuentes verificadas

- Repositorio `pasalochevere/expediente`, ruta `torre-america/`, GitHub.
- Proyecto Supabase `expediente-dev`: consultas agregadas sobre usuarios de QA, licencias reservadas, productos y pedidos, sin extraer emails o claves personales.
- Service workers V1 y V2 leídos directamente del repositorio y ejecutados en simulador de eventos de navegador.
- Documentación actual de MDN sobre scope/CacheStorage y Supabase sobre autorización.
- No se pudo acceder a GitHub Pages con el navegador externo de la sesión. Chromium headless está instalado, pero su acceso al servidor local fue bloqueado por el entorno (`ERR_BLOCKED_BY_ADMINISTRATOR`). **No se hizo una prueba E2E autenticada en navegador real.**

## 1. Activación y licencias QA

- Dos licencias reservadas (`TA-P05R3-QA`): `FUT-AMERICA-DIG` y `FUT-AMERICA-PHY`, ambas `available`, sin titular ni activación.
- No se identificaron cuentas de prueba por email con indicios `qa` / `test` en `auth.users` (esto no demuestra que no existan otras cuentas de prueba).
- Ambos SKUs siguen deshabilitados para ventas y catálogo y no tienen precio; no se registraron pedidos FUT-AMERICA.
- Edge Function `torre-america-entitlement-rc` valida usuario autenticado, propiedad de licencia, vigencia, dispositivo registrado y SKU. `pasalochevere-access` se modificó previamente a v37 para enlazar por SKU sin exponer códigos en URL.
- El flujo se simuló en P0.5R3: seis escenarios de resolución por SKU (incluyendo cambio de edición, denegación, PWA y offline) y tres perfiles de selector, sin errores.
- **Bloqueo real:** no se puede certificar activación desde Biblioteca sin cuenta QA verificada y autorización de asignación de las licencias. No se tocaron licencias de compradores.

## 2. Coexistencia de service workers: defecto confirmado

Se ejecutaron los controladores `activate` / `fetch` originales en un entorno de eventos simulado con cachés V1 + V2 + otros productos.

| Caso | Resultado |
| --- | --- |
| V1 actual se activa con caché V2 existente | **FALLO:** elimina caché V2 y otros nombres |
| V2 actual se activa con caché V1 existente | **OK:** conserva caché V1 |
| V2 se actualiza y encuentra una versión antigua propia | **OK:** borra solo prefijo `ta-v2-qa-` viejo |
| V2 no tiene caché por borrado previo y el usuario está offline | **MITIGADO:** devuelve HTML de reconexión con HTTP 503, sin abrir el juego |
| Worker V1 propuesto con limpieza por prefijo | **OK** en prueba controlada: conserva V2 y cachés ajenos, elimina solo versiones V1 antiguas |

### Archivos
- **V1 estable, sin cambios:** `torre-america/service-worker.js`.
- **Alternativa V1 NO activa:** `torre-america/service-worker-v1-safe-candidate-p05r4.js`.
- **V2 corregido:** `torre-america/v2/sw.js`, caché `ta-v2-qa-20261108-p05r4`, fallback HTML embebido.
- **Panel diagnóstico V2 actualizado:** `torre-america/v2/pwa-qa.js`, botón **Comprobar convivencia** y **Copiar informe QA**. No accede a claves ni emails, solo registra el estado del worker y el caché.

### Decisión de protección
**NO reemplazar el SW V1 automáticamente.** Su sustitución podría actualizar instalaciones reales. El cambio correcto es pequeño, pero requiere validar V1 online, offline, actualización de cachés, recuperación de sesión y rollback antes de publicarlo. La copia candidata se deja preparada para esa revisión.

## 3. Cómo comprobar la PWA en el navegador

1. Iniciar sesión en la Biblioteca PasaloChévere con una cuenta con licencia QA asignada/activada.
2. Abrir `https://pasalochevere.github.io/expediente/torre-america/v2/?pwa=1` desde el mismo navegador.
3. Comprobar que aparece **PWA V2 · Instalación de prueba**. Pulsar **Comprobar convivencia**, copiar el diagnóstico.
4. Esperado: `v2Registered=true`, `v2WorkerActive=true`, `v2ControllingPage=true`, `manifestV2=true`; si V1 también figura registrada, registrar ese dato.
5. Instalar **Torre V2 QA** en Chrome/Android cuando se habilite la opción. En iPhone, probar **Compartir → Agregar a inicio** y validar la sesión de nuevo.
6. Reiniciar con red; comprobar que abre la edición correcta, que no hay datos de V1 mezclados y que la partida se recupera.
7. Desconectar internet: debe aparecer el aviso de reconexión. **No debe abrir el juego con una licencia sin verificar.**
8. Volver a conectar y completar una partida en cada modalidad con dados, poderes, penales, reanudación y final.
9. Repetir coexistencia con V1 instalada y con un perfil limpio. La actualización/desinstalación no debe borrar partidas ni afectar el producto V1.

## 4. Matriz de resultados

| Control | Estado |
| --- | --- |
| Dos SKUs creados y ventas deshabilitadas | APROBADO |
| Dos licencias QA reservadas no asignadas | APROBADO |
| Acceso de Biblioteca con SKU y sin código personal en URL | Verificado en código y simulaciones |
| Reglas de formato Digital / Física / legacy | Verificado en simulaciones |
| Instalador V2 aislado en /v2/ | Verificado en código |
| Cachés nuevos no borran V1 | Verificado en simulación |
| Cachés V1 no borran V2 | **FALLO en el SW V1 actual** |
| Fallback offline seguro de V2 | Corregido, probado en simulación |
| HTML/JS/manifest/scope V2 | Sintaxis y archivos verificados |
| Login real en una cuenta de QA | PENDIENTE |
| Activación real de ambas licencias | PENDIENTE |
| Instalación real de Chrome/Android | PENDIENTE |
| Instalación iPhone y persistencia de sesión | PENDIENTE |
| Pruebas con navegador y conexión auténticos | PENDIENTE |

## 5. Conclusión: NO-GO

El hito queda **implementado como preparación y auditoría**, pero **no aprobado como QA real de lanzamiento**. Para cerrar el circuito faltan un usuario QA verificado autorizado para ambas licencias, prueba de login/activación con dispositivos reales y aplicar después de QA la corrección de limpieza de V1. No cambiar `index.html`, no activar ventas ni publicar V2 definitiva sin estas evidencias.

**Enlaces:**
- Instalación QA V2: `https://pasalochevere.github.io/expediente/torre-america/v2/?pwa=1`
- Biblioteca: `https://pasalochevere.github.io/expediente/portal/`
- Código alternativo worker V1: `torre-america/service-worker-v1-safe-candidate-p05r4.js`
