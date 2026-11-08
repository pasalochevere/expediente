# TA-UI V2.0-P0.4R4 — Poderes, cronómetros y licencias

Fecha: 2026-11-08. Alcance: solo auditoría y test. **Sin modificaciones** al motor estable, licencias de clientes ni base de datos.

## 1. Browser QA automatizado

Ejecución: https://github.com/pasalochevere/expediente/actions/runs/42528135087

- Resultado R4: **12 PASS / 0 FAIL**.
- R2 y R3 también finalizaron SUCCESS en el mismo pipeline.
- CAPITÁN: se conserva ayudante y se muestra en la consigna.
- HINCHADA: habilita ayuda colectiva.
- CONTRAATAQUE: el fallo del rival concede el bono al dueño.
- EL 10: selecciona quién responde, pero los puntos siguen adjudicándose al dueño.
- LA COPA: se adquiere y aparece como segunda oportunidad en una jugada posterior.
- ROJA: activa sanción y comprueba consumo del ESCUDO.
- REMONTADA: ofrece segunda oportunidad.
- PENALES y FINAL: disparan minijuego después de la consigna.
- Cronómetros: reto (2s), penal individual (5s), tanda (5s), comprobados con tiempo real en Chromium.

La suite R4 invoca funciones del motor desde el navegador con datos controlados; no es una prueba de cada gesto táctil ni de todos los recorridos con licencias reales.

## 2. Backend real: Supabase expediente-dev

Proyecto: `fzbndgfnqxcacsvlitui`.
Función activa: `pasalochevere-access` versión 35.
- `verify_jwt=false` a nivel de despliegue; el propio código ejecuta `userClient.auth.getUser()` y exige usuario autenticado y correo. Esta diferencia merece seguimiento en auditoría de seguridad, sin deducir que existe acceso anónimo exitoso.
- La acción `register_device` verifica propiedad del código, revocación, vencimiento y límite de dispositivos antes de permitir la sesión.
- La acción `me` deriva el estado `expired` de la fecha, aunque el registro conserve un estado almacenado `active`.

**Consulta SQL agregada y de solo lectura, 2026-11-08**:
| Estado almacenado | Cantidad | Vencimiento pasado | Vigente | Sin fecha |
| --- | ---: | ---: | ---: | ---: |
| active | 7 | 6 | 1 | 0 |
| available | 1 | 0 | 0 | 1 |

No se leyeron códigos de activación, correos, dispositivos ni detalles personales; tampoco se alteraron registros.
Recomendación: revisar la conciliación de estados comerciales y fechas antes de integrar o lanzar.

## 3. Pendientes de certificación real

1. Inicio de sesión con cuenta autorizada real en producción o staging controlado.
2. Prueba de licencia vigente, expirada, revocada y límite de dispositivos, sin cambiar titulares ni licencias existentes.
3. Prueba offline dentro de la ventana permitida y revocación al reconectar.
4. Revisión de variantes `FUT-AMERICA-PHY` y `FUT-AMERICA-DIG` contempladas por `access.js` pero no listadas en el catálogo de productos del servidor; confirmar si son SKU futuros.
5. Safari/iOS y dispositivos móviles reales.

**Decisión:** R4 **aprobado en QA automatizada y auditoría de solo lectura**. Licencias reales de extremo a extremo: **pendiente**, no aprobado. No fusionar ni publicar hasta esa verificación.
