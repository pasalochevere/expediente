# CASO 001 · LA ÚLTIMA REUNIÓN · P2

Reconstrucción no destructiva de Caso 001. Todo P2 permanece aislado de `index.html` raíz hasta completar QA multidispositivo, seguridad y playtest humano.

## Componentes

- `CASE_STANDARD.md` — reglas maestras P2.
- `manifest.json` — IDs estables.
- `packs/C001-01.json` … `C001-12.json` — 12 Crime Packs post-FIX.
- `crime-engine.js` — motor deductivo aislado.
- `proof-map.json` + `proof-validator.js` — cadena narrativa.
- `player-count-qa.js` — matriz 3–6 jugadores Normal/Impostor.
- `qa.html` — QA visual.
- `P2.11B_QA_JUGABLE.md` — diagnóstico jugable profundo.
- `P2.11C_FIX_JUGABLE.md` — FIX de los 12 casos.
- `P2.11D_QA_POST_FIX.md` — recorrido post-FIX E1 → E2 → E3.
- `P2.12_INTEGRATION.md` — arquitectura de integración real.
- `index.html` — prototipo P2 local/aislado.
- `p2-multiplayer-adapter.js` — cliente de contrato multiplayer P2.
- `multiplayer-p2.html` — cliente multiplayer real aislado.

## Estado deductivo · P2.11D

- 12/12 abren E1 sin revelar identidad.
- 12/12 conservan alternativa defendible en E2.
- 12/12 reservan el pivote fuerte para E3.
- 12/12 tienen `criticalEvent`, `mechanism` y `postCrimeAction`.
- 12/12 soportan testigos humanos/NPC.
- No se detectó un fallo lógico grave que obligue a volver a P2.11C.

Deuda narrativa antes de RC: demasiados casos comparten `discusión → forcejeo/empujón → caída/golpe fatal → encubrimiento`. Objetivo: no más de 4/12 con una misma familia de desenlace.

## Regla 3–6 jugadores

Los seis personajes existen siempre.

- 3 jugadores = 3 humanos + 3 NPC.
- 4 = 4 humanos + 2 NPC.
- 5 = 5 humanos + 1 NPC.
- 6 = 6 humanos.

### Normal

El responsable puede ser humano o NPC. La matriz teórica cubre 504 configuraciones humano/NPC para los 12 paquetes.

### Impostor

El responsable debe ser humano. La matriz compatible cubre 312 configuraciones. El responsable humano recibe rol oculto y sabotajes controlados; evidencia oficial nunca se puede falsear.

## P2.12 · Integración real

La integración real ya está implementada de forma paralela al V1.

### Supabase · tablas P2 protegidas

- `exp_p2_game_secret` — paquete y solución completa.
- `exp_p2_private_roles` — rol/objetivo privado por humano.
- `exp_p2_accusations` — acusación final bloqueada.

Las tres tienen RLS habilitado, sin privilegios para `anon` ni `authenticated`; se operan desde Edge Functions con service role.

### Edge Functions P2

- `expediente-p2-join-room`
- `expediente-p2-room-view`
- `expediente-p2-start-game`
- `expediente-p2-private`
- `expediente-p2-game-action`

Creación de sala/licencia reutiliza `expediente-create-room` existente.

### Cliente aislado

`multiplayer-p2.html` integra:

- crear/unirse/reingresar a sala;
- humanos + NPC;
- Normal/Impostor;
- Realtime;
- cronómetro, pausa y +2 min;
- auto-pacing y adelanto manual E1/E2/E3;
- evidencia pública;
- evidencia privada por etapa;
- fallback de declaraciones NPC;
- rol oculto Impostor;
- Director manual/automático;
- bitácora (`exp_events`);
- tablero local de teoría;
- acusación Persona + Escena + Objeto + motivo;
- bloqueo previo al reveal;
- solución/reconstrucción final server-side.

El cliente P2 no importa `packs/*.json`, `manifest.json` ni la solución.

## Privacidad P2

Información pública de sala y evidencia liberada viajan por estado/eventos. Evidencia privada y rol se resuelven server-side. Paquete completo, responsable, escena y objeto permanecen en `exp_p2_game_secret` hasta `finish`.

La acusación se persiste antes de comparar con la solución. El evento `solution` solo existe después del reveal explícito del anfitrión.

## Cronómetro P2

El estado conserva:

- `initial_duration_seconds`;
- `duration_seconds` corriente;
- `stage2_at_remaining`;
- `stage3_at_remaining`.

Así pausar/reanudar o sumar tiempo no recalcula accidentalmente el pacing narrativo.

## Bloqueantes antes de Release Candidate

### S1 · Crime Packs públicos

Durante P2.12 el servidor carga el paquete elegido desde la rama pública de GitHub y lo copia a la tabla secreta. El navegador no recibe el `pack_id` antes del final, pero un usuario técnico podría buscar una frase de pista en el repositorio y descubrir la solución.

Antes de publicar P2, los Crime Packs deben mudarse a almacenamiento privado server-side y dejar de servirse desde assets/repositorio público.

### S2 · RLS heredado de V1

Las tablas operativas históricas (`exp_rooms`, `exp_players`, `exp_room_state`, `exp_events` y `exp_private_roles`) conservan policies amplias porque el V1 publicado aún realiza lecturas directas.

P2 ya usa `expediente-p2-room-view` como vista canónica y no guarda secretos P2 en esas tablas. El endurecimiento definitivo debe hacerse después de migrar el root para no romper producción.

## QA pendiente para cerrar P2.12

Hace falta una prueba real con licencia válida y varias sesiones/dispositivos:

- Normal con 3/4/5/6 humanos;
- Impostor;
- testigo humano vs el mismo testigo NPC;
- reingreso a partida activa;
- pausa/reanudar/+2 min;
- auto E2/E3 y adelanto manual;
- Director;
- privacidad entre jugadores;
- acusación bloqueada/reveal simultáneo;
- intento host-only desde no-host;
- móvil y reconexión.

No se fuerza una licencia ajena ni se altera una sala productiva para automatizar esta prueba.

## Producción

`index.html` raíz permanece intacto. P2.12 es aditivo y el PR continúa Draft.

**Estado:** P2.12 INTEGRACIÓN DE CÓDIGO IMPLEMENTADA · PRUEBA E2E MULTIDISPOSITIVO PENDIENTE · PLAYTEST HUMANO PENDIENTE · NO RELEASE CANDIDATE.
