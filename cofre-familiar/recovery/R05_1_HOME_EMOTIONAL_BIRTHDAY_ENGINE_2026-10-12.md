# COFRE-R05.1 — HOME EMOCIONAL + BIRTHDAY ENGINE

Fecha: 2026-10-12
Rama: `release/cofre-familiar-rc1`
Runtime: Railway `cofre-web-rc1`

## Objetivo

Recuperar la dirección original del producto: una portada viva y emocional que conecte Personas, Fechas, Recuerdos, Notificaciones y Proyectos, comenzando por cumpleaños.

## Cambios visibles

- Home rediseñada como superficie emocional, no dashboard técnico.
- Paleta cálida crema/terracota y navegación carbón.
- Próximo cumpleaños como protagonista: nombre, cuenta regresiva, edad que cumple, vínculo y patrón de avisos.
- Próximos cumpleaños secundarios.
- “Hoy en tu historia” / últimos recuerdos.
- Cartas y cápsulas próximas a abrirse.
- Otras fechas próximas.
- Nueva ficha `/c/[cofreId]/dates/[dateId]` con cumpleaños, recuerdos relacionados, avisos y acciones.
- Personas explica que una fecha de nacimiento crea automáticamente su cumpleaños.
- Calendario enlaza cada fecha con su ficha emocional.

## Birthday Engine recuperado

Se reutiliza la infraestructura original de ocasiones ya presente en Supabase:

- Plantilla `birthday` con 30 días de anticipación.
- Avisos: 30 / 14 / 7 / 3 / 1 / 0 días.
- Motores sugeridos originales: regalo + plan + álbum + colaboración.
- Cron real de reminder scan ya existente.
- `ensure_occasion_campaign_secure` para materializar la campaña.
- `create_gift_project_secure` para generar el proyecto de regalo.

### Puente Persona → Cumpleaños

Migración aplicada: `cofre_049_birthday_person_bridge_v1`.

- Trigger sobre `cofre.people`.
- Fecha de nacimiento crea/sincroniza un `important_date` tipo birthday.
- Repetición yearly.
- Patrón 30/14/7/3/1/0.
- Vinculación primaria en `important_date_people`.
- Índice para impedir cumpleaños duplicados activos por persona.
- Backfill de personas existentes con fecha de nacimiento.
- RPC segura `ensure_person_birthday_secure`.

## Acciones de cumpleaños

### Preparar cumpleaños

- Materializa/reutiliza la campaña original de la ocasión.
- Mantiene una sola campaña para esa ocurrencia.
- Respeta milestone/edad y fecha real.

### Generar regalo

- Crea o reutiliza un proyecto `gift` ligado a la campaña y persona.
- Modo sorpresa.
- Horizonte calculado según días restantes.
- Lee `person_preferences` y `person_wishes` cuando existen.
- Código preparado para sembrar 3 propuestas iniciales: regalo según gustos, experiencia/deseo y álbum + carta.
- Si un cumpleaños manual no está ligado a una Persona, deriva a Personas en vez de fallar.

## QA real con RLS

Ejecutado bajo rol `authenticated` usando datos temporales dentro de transacciones con `ROLLBACK`.

### QA 1 — Persona → cumpleaños → campaña → proyecto

PASS:

1. Crear Persona temporal con nacimiento.
2. Trigger crea cumpleaños automático.
3. `reminder_days` contiene 30/14/7/3/1/0.
4. Próxima ocurrencia correcta.
5. Milestone/edad correcta.
6. `ensure_occasion_campaign_secure` crea campaña.
7. `create_gift_project_secure` crea proyecto de regalo.
8. `ROLLBACK` deja cero residuos QA.

### QA 2 — Aviso real

PASS usando `run_reminder_scan(..., true)` sobre un cumpleaños temporal del día.

Notificación generada:

- Título: `Hoy · Cumpleaños de Aviso QA`
- Tipo: `occasion_reminder`
- Body: `Si quieren preparar algo, todavía hay tiempo.`
- `action_url` apunta a la nueva ficha `/c/<cofre>/dates/<dateId>`.
- `ROLLBACK` dejó cero residuos QA.

### QA 3 — ideas iniciales

El código del generador y sus contratos están cubiertos por el gate R05 y compilan en producción. Una inserción manual directa de las tres filas de QA fue bloqueada por la capa de seguridad de la herramienta antes de ejecutarse; por lo tanto, la confirmación final de las 3 ideas se deja al Browser Acceptance mediante el botón `Generar regalo`.

## Gates finales

- Recovery general: 75 PASS / 0 FAIL.
- R03: 33 PASS / 0 FAIL.
- R04/R04.5: 27 PASS / 0 FAIL.
- R05.1: 16 PASS / 0 FAIL.
- TypeScript: PASS.
- Next production build: PASS.
- Nueva ruta `/c/[cofreId]/dates/[dateId]`: incluida en build.
- Runtime Next: Ready.
- Healthcheck `/health`: 1/1 PASS.

## Deployment final

- Deployment: `3ba6cf59-9c88-425a-9282-4ed68b2885ff`
- Commit desplegado: `d5228b790745d5df3ce9e30f4a3a0d7b1e552d83`
- Estado: SUCCESS
- Región: `sfo`

El primer intento `a7c280da-3189-4966-909b-e5e7f9332097` falló sólo porque tres asserts del gate R03 todavía buscaban textos de la Home anterior. Se actualizó el gate para validar la funcionalidad equivalente de la nueva Home emocional y el deploy final pasó completo.

## Pendientes explícitos

- Álbumes automáticos: **NO implementados todavía**. Se reservan para R05.3.
- Generador de regalos/experiencias más profundo y editable: siguiente evolución R05.2.
- `package-lock.json`: pendiente del release gate final.
- No se hizo merge a `main`.
- No se publicó todavía el launcher estable de GitHub Pages.

## Browser Acceptance recomendado

1. Hard refresh y revisar la nueva Home emocional.
2. Agregar una Persona con fecha de nacimiento.
3. Volver a Inicio: debe aparecer el cumpleaños automáticamente.
4. Ir a Fechas: verificar birthday + patrón de avisos.
5. Abrir la ficha del cumpleaños.
6. Pulsar `Preparar cumpleaños`.
7. Pulsar `Generar ideas de regalo` y comprobar que abre el proyecto con las propuestas iniciales.
