# EXP01-EN3 · Game Content Translation · ES / EN

Estado: **PASS · Game Content Translation ES/EN integrada y validada**.

## Alcance

EXP01-EN3 completa la capa inglesa visible del único build de Caso 001 sin modificar la lógica del juego.

Se auditó el contenido activo de los 12 Crime Packs C001-01…C001-12 en Supabase y se creó una capa de traducción de presentación para:

- narrativa principal y prólogo legacy;
- Cinema Intro V10.7;
- perfiles públicos;
- nombres visibles de lugares y objetos;
- 12 Crime Packs habilitados: evidencias públicas/privadas y fallbacks NPC;
- rol/objetivo privado de Investigador e Impostor;
- mentira central, hecho real y encubrimiento del Impostor;
- orientaciones automáticas y solicitadas del Director;
- motivo, contradicción, evento crítico, mecanismo, encubrimiento, reconstrucción, señuelos y cierre de la solución.

## Arquitectura

La traducción permanece estrictamente en cliente/presentación. No se modifica `pack_payload`, no se envía `lang` a acciones multiplayer y no se duplica la partida.

Archivos de contenido:

- `content-en-core.js`
- `content-en-packs-01-04.js`
- `content-en-packs-05-08.js`
- `content-en-packs-09-12.js`
- `content-en.js`

`content-en.js` mantiene mapas reversibles ES↔EN y observa UI dinámica para traducir contenido server-side cuando aparece en DOM. El texto de usuario no se traduce salvo coincidencia exacta con una frase canónica del juego.

## Canon / seguridad

- `P2_LABELS` internos permanecen en español.
- personajes mantienen sus nombres propios.
- índices de persona/escena/objeto permanecen canónicos.
- `solutionVisual()` usa primero los índices server-side y conserva el lookup por nombre solo como fallback legacy.
- no se tocaron Edge Functions, Crime Packs, tablas, timers, roles, acciones, licencias ni estados de sala.

## Gate definitivo

Browser QA automatizado: **PASS**.

El gate valida narrativa principal, perfiles, lugares/objetos, muestras representativas de evidencias de los packs 01/05/09/12, contenido privado, Director, solución, Cinema Intro, reversión EN→ES, segundo cambio ES→EN, conservación de estado local, parámetros de Intro, ausencia de idioma en multiplayer y resolución visual por índices canónicos.
