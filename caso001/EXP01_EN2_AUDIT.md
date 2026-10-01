# EXP01-EN2 · UI Translation Complete · ES / EN

Estado: **PASS · interfaz estructural y funcional bilingüe completada**.

## Objetivo

Completar la capa ES/EN de la interfaz funcional de Caso 001 sin traducir todavía el contenido narrativo del caso ni modificar el motor de juego.

EXP01-EN2 trabaja sobre el único build de Caso 001 y mantiene la arquitectura de EXP01-EN1: el idioma es una preferencia local de presentación y nunca forma parte de la partida, la licencia, la sala, el save/load ni los payloads multiplayer.

## Implementación

Archivo principal modificado:

- `caso001/i18n.js`

No se modificaron:

- `caso001/p2-multiplayer-adapter.js`
- funciones Supabase / P2
- tablas / room state
- timers
- acciones multiplayer
- licencias
- Crime Packs
- historia / solución
- imprimibles

## UI localizada en EN2

La capa ES/EN cubre la interfaz estructural y funcional visible alrededor del contenido del juego:

- header y sellos del expediente;
- onboarding previo a la sala;
- setup de creación / ingreso;
- ayudas de acceso y licencia;
- lobby y estados de sala;
- invitación, QR y textos de compartir;
- botones y mensajes de WhatsApp del lobby;
- tablero de investigación y estados de fichas;
- ayudas del tablero y notas de motivo;
- metadata visual de evidencias;
- etiquetas del dossier privado;
- bitácora y mensajes estructurales de eventos;
- controles del Director y del anfitrión;
- acusación final y sus controles;
- shell estructural de la reconstrucción / resolución;
- toasts y mensajes funcionales del cliente;
- errores funcionales conocidos;
- placeholders, `alt`, `aria-label` y `title` estructurales;
- cambio ES → EN → ES sin recargar ni reiniciar la partida.

## Contenido deliberadamente NO traducido en EN2

Estos elementos permanecen en español y corresponden a **EXP01-EN3 · Game Content Translation**:

- narrativa de `PROLOGUE_SCENES`;
- subtítulo / texto narrativo principal;
- `REV01_PROFILES` de los seis personajes;
- nombres canónicos de personajes, lugares y objetos en `P2_LABELS`;
- texto real de evidencias públicas y privadas;
- objetivos y contenido privado provenientes del servidor;
- verdad / mentira / evento / encubrimiento del Impostor;
- título y cuerpo narrativo enviados por el Director server-side;
- motivo real, contradicción, evento crítico, mecanismo y encubrimiento de la solución;
- pasos de reconstrucción, señuelos y cierre narrativo.

Esta separación es intencional para no modificar contenido server-side ni el canon del caso durante una fase de UI.

## Protección de contenido narrativo

La capa dinámica de localización excluye expresamente los contenedores narrativos, entre ellos:

- `.prologueCopy p`
- `.evText`
- `.privateObjective p`
- `.revealMotive p`
- `.decisiveContradiction p`
- `.revealFact p`
- `.reconText`
- `.redHerring p`
- `.revealClosing`

Esto permite localizar metadata y controles sin traducir accidentalmente una evidencia o una solución.

## UI dinámica

Caso 001 genera parte de la interfaz después de cargar la sala o recibir eventos. EN2 agrega una capa de observación de DOM exclusivamente de presentación para localizar esos elementos cuando aparecen.

No ejecuta acciones de juego, no llama `adapter.action()`, no crea ni une salas, no cambia el timer, no altera suscripciones y no escribe idioma en `public_state`.

## Cambio bidireccional

Se auditó ES → EN y EN → ES.

Durante QA se detectó una ambigüedad potencial en sellos que compartían el término inglés `OPEN` (`ABIERTO` / `ABIERTA`). Se corrigió de forma segura localizando por estructura específica:

- `.caseStamp`: `CASO / ABIERTO` ↔ `CASE / OPEN`
- `.lobbySeal`: `SALA / ABIERTA` ↔ `ROOM / OPEN`

Así el cambio de idioma es reversible sin depender de una traducción inversa ambigua.

## Persistencia y aislamiento

Se mantienen las claves existentes, entre ellas:

- `pc_exp_rev01_theory_v1`
- `pc_exp_p2_last_room`
- `pc_exp_license_key`
- claves de dispositivo existentes

El idioma sigue utilizando únicamente:

- `expedientes_language`

El QA verificó que cambiar de idioma no modifica el contenido guardado en `pc_exp_rev01_theory_v1`.

## Guardrails

PASS:

- idioma ausente del adapter multiplayer;
- `dig` / `imp` preservados;
- `pc_exp_p2_last_room` preservado;
- `pc_exp_rev01_theory_v1` preservado;
- `REV01_PROFILES` fuente permanece sin traducir;
- evidencia narrativa dentro de `.evText` permanece sin traducir;
- metadata de evidencia sí se localiza;
- interfaz dinámica se localiza sin cambiar estado.

## QA browser automatizado

Run definitivo:

- `36922479913` · `EXP01 EN2 UI QA2`
- conclusión: **success**

Validaciones PASS:

- header estructural EN;
- sello Caso abierto ↔ Case open;
- onboarding EN;
- helper de setup EN;
- lobby EN;
- sello Room open;
- invitación EN;
- acusación estructural EN;
- tablero EN;
- Director EN;
- bitácora EN;
- atributos ALT EN;
- narrativa principal permanece ES;
- toast dinámico EN;
- MutationObserver localiza UI creada después de carga;
- metadata compuesta de evidencia EN;
- payload narrativo de evidencia protegido;
- reversión EN → ES correcta;
- cambio posterior ES → EN correcto;
- estado local sin cambios;
- perfiles fuente sin cambios;
- idioma ausente de multiplayer;
- IDs y claves internas preservados;
- exclusiones narrativas presentes.

## Resultado

**EXP01-EN2 PASS.**

Caso 001 ya tiene una interfaz estructural / funcional completa capaz de trabajar en español o inglés sin duplicar el juego y sin convertir idioma en estado de partida.

El contenido narrativo completo continúa pendiente para EXP01-EN3.

**No avanzar a EXP01-EN3 sin autorización explícita del usuario.**
