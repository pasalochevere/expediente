# COFRE-R02.1 · CRUD + MEDIA + MOBILE ACCEPTANCE

Fecha: 2026-10-12
Branch: `release/cofre-familiar-rc1`
Runtime: `cofre-web-rc1-production.up.railway.app`

## Resultado

**CRUD/RLS: PASS**
**Media backend/reservation: PASS**
**Media upload binario end-to-end desde navegador: PENDIENTE**
**Responsive/mobile structural gate: PASS**
**Mobile real-device browser acceptance: PENDIENTE**

## CRUD probado como rol `authenticated` real

Se ejecutaron operaciones bajo RLS simulando el JWT del usuario QA, sin `service_role`:

- Recuerdo: INSERT + SELECT persistente → PASS.
- Persona: INSERT + SELECT persistente → PASS.
- Fecha importante: INSERT + Search → PASS.
- Sueño: INSERT + SELECT persistente → PASS.
- Carta: INSERT de `letters` + INSERT separado de `letter_contents` + `seal_letter()` → PASS.
- Cápsula: INSERT draft → PASS.
- Proyecto de regalo: `create_gift_project_secure()` → PASS después de correcciones R02.1.
- Configuración: `update_cofre_settings_secure()` → PASS.
- Búsqueda: `search_cofre_secure()` encontró Fecha, Recuerdo y Persona QA → PASS.

Persistencia final antes de cleanup: 1/1 en Recuerdo, Persona, Fecha, Sueño, Carta sellada, Cápsula y Proyecto visible.

## Bugs reales encontrados y corregidos

### 1. Proyecto de regalo: enums UI vs constraints DB

La UI aceptaba:

- presupuesto `high`, inexistente en DB;
- horizonte como texto libre.

DB acepta:

- `budget_level`: `free | low | medium | special | unspecified`
- `time_horizon`: `today | week | month | no_rush`

Corrección:

- Presupuesto e Horizonte convertidos a selects válidos.
- Server Action ahora aplica whitelist antes del RPC.

### 2. Configuración: privacidad inválida

La UI ofrecía `cofre` y `selected`, pero `cofres_default_content_visibility_chk` sólo admite `members` o `private`.

Corrección:

- UI reducida a valores soportados.
- Server Action aplica whitelist `members | private`.

### 3. Proyecto sorpresa sin destinatario quedaba invisible

`cofre_private.can_view_project()` evaluaba una comparación nullable con `target.linked_user_id`. Para un proyecto sorpresa sin `target_person_id`, la expresión terminaba en `NULL` y el creador no podía verlo aunque fuera `organizer`.

Corrección aplicada mediante migración:

`cofre_r02_1_fix_can_view_project_null_target`

Ahora el ocultamiento sólo se aplica cuando existe realmente un usuario objetivo vinculado. Re-test: creador autenticado vuelve a ver el proyecto → PASS.

## Media

Probado bajo RLS:

- `reserve_media_upload()` → PASS.
- bucket esperado: `cofre-media`.
- path aislado por Cofre/media ID → PASS.
- reserva de cuota → PASS.
- `cancel_media_upload()` correctamente restringida al backend/servicio; cleanup administrativo → PASS.
- storage final tras cleanup: `used_bytes=0`, `reserved_bytes=0`.

No se certifica todavía el tramo **signed URL → upload binario → Edge Function finalize** desde un navegador autenticado real. El entorno de esta sesión no permite automatizar ese navegador de forma segura.

## Mobile / responsive

Reglas verificadas en el build real:

### <= 900 px

- sidebar desktop se oculta;
- `.app-grid` pasa a una columna;
- aparece navegación inferior fija de 5 accesos;
- `main-inner` reserva 92 px inferiores para no ser tapado por la barra;
- stats pasan de 4 a 2 columnas;
- `two-col` pasa a una columna;
- Personas/Media pasan a 2 columnas.

### <= 580 px

- formularios pasan a una columna;
- Personas/Media/Cards/Cofres pasan a una columna;
- upload cambia a layout vertical;
- timeline reduce columna de fecha;
- auth/select/public reducen padding;
- búsqueda pasa a una columna.

El intento de harness Chromium local no pudo completar por limitaciones del entorno headless/DBus, no por un error de Cofre. Por ello el responsive **estructural** queda PASS, pero no se marca todavía real-device visual PASS.

## Build posterior a fixes

Deployment: `de0fdc15-84a4-458e-886a-a07a8be6bab2`

- Recovery preflight: **62 PASS / 0 FAIL**.
- Next compile: PASS.
- TypeScript: PASS.
- Healthcheck: PASS.
- Railway deployment: **SUCCESS**.

## Cleanup

Los registros `QA-R02.1` fueron eliminados después de verificar persistencia.

Estado restaurado:

- memories: 0
- people: 0
- important_dates: 0
- letters: 0
- capsules: 0
- dreams: 0
- projects: 0
- storage used/reserved: 0 / 0
- tagline: null
- start_date: null

## Gate para cerrar R02.1 al 100%

Faltan sólo dos pruebas de interacción física:

1. subir un archivo real desde la pantalla Media y comprobar preview/persistencia;
2. abrir el Cofre desde un celular real en vertical + horizontal y recorrer Inicio, Recuerdos, Media y Formularios.

Hasta esos dos checks: **R02.1 = PASS técnico / Browser Acceptance parcial**.
