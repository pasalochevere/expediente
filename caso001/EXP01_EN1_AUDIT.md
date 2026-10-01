# EXP01-EN1 · Auditoría y checkpoint de arquitectura bilingüe ES / EN

Estado: implementación de arquitectura completada; QA browser automatizado en ejecución al crear este checkpoint.

## Alcance respetado

EXP01-EN1 agrega una capa de presentación bilingüe sobre el único Caso 001. No duplica HTML del juego y no cambia historia, solución, Crime Packs, engine, IDs, room state, save/load, licencias, autenticación, timers ni acciones multiplayer.

## Archivos del build actual

- `caso001/index.html`: shell Rev01, setup, lobby, juego activo, tablero, evidencias, privado, director, acusación y resolución.
- `caso001/p2-multiplayer-adapter.js`: conexión P2 real con Supabase; room/create/join/view/private/actions.
- `caso001/intro/index.html`: Cinema Intro V10.7.
- `caso001/i18n.js`: nueva capa central EXP01-EN1 de idioma.
- `caso001/printables/index.html`: fuera de alcance de EN1; no modificado.

## Resolución de idioma

Orden implementado:

1. `?lang=es` / `?lang=en` válido en URL.
2. `localStorage.expedientes_language`.
3. fallback por defecto `es`.

Un `lang` válido de URL actualiza la preferencia guardada. Cambiar ES / EN usa `history.replaceState`, por lo que conserva `room`, `access`, `skipintro` y otros parámetros existentes.

## Cambio en vivo

`setLanguage()` sólo actualiza la presentación, `document.documentElement.lang`, preferencia local y UI renderizada. Emite `expedientes:languagechange`.

El handler de idioma NO ejecuta:

- `createRoom`
- `joinRoom`
- `startGame`
- `adapter.action()`
- `tick`
- reinicio de timer
- nueva suscripción
- regeneración server-side

El estado compartido y el idioma quedan separados.

## Persistencia / claves existentes auditadas

Se preservan las claves existentes del producto, entre ellas:

- `pc_exp_rev01_theory_v1` — tablero / hipótesis local.
- `pc_exp_p2_last_room` — última sala.
- `pc_exp_license_key` — acceso local existente.
- `pc_device_id` / `pc_exp_device_id_v1` — dispositivo.
- `pc_exp_rev01_prologue_seen` — prologue session flag.

Nueva clave aislada:

- `expedientes_language` — únicamente `es` o `en`.

No se incorpora idioma a payloads multiplayer ni a `public_state`.

## Selector

Se agregó selector discreto `ES | EN` en:

- pantalla inicial / shell de Caso 001;
- header visible durante lobby / juego activo;
- prólogo legacy;
- Cinema Intro V10.7.

El activo queda marcado visualmente y con `aria-pressed`.

## Traducción piloto incluida en EN1

Se tradujo únicamente UI estructural / funcional seleccionada para validar la arquitectura:

- crear / unirse;
- nombre, licencia, modo, código de sala y personaje;
- Normal / Impostor y descripciones de modo;
- estados de sala;
- controles básicos de lobby;
- fase / etapa;
- expediente público / dossier privado;
- mostrar / ocultar privado;
- tablero y estados de marcación;
- controles del Director / anfitrión;
- encabezados básicos de evidencias;
- controles base de intro;
- controles y CTA estructurales del Cinema Intro;
- locale visual del reloj de bitácora.

## Contenido deliberadamente pendiente

EXP01-EN1 NO traduce todavía el contenido narrativo. Queda para fases posteriores:

### EXP01-EN2 · UI Translation Complete

- toasts y mensajes secundarios aún hardcodeados;
- metadatos visuales secundarios de evidencia;
- textos de bitácora generados por eventos;
- textos completos de acusación y controles secundarios;
- etiquetas menores de dossier / sellos aún no migradas al diccionario.

### EXP01-EN3 · Game Content Translation

- narrativa del prólogo;
- narrativa del Cinema Intro;
- perfiles públicos de personajes;
- nombres traducibles de lugares / objetos si se decide localizarlos;
- evidencia pública y privada;
- objetivos / roles privados provenientes del servidor;
- documentos, diálogos y pistas;
- reconstrucción / solución / finales.

## Hallazgos de lógica acoplada a texto visible

### 1. Intro: sonido

Se detectó que Cinema Intro usaba el texto visible del botón (`🔇` / `🔊`) como estado lógico. Para que el idioma no afecte comportamiento, EN1 reemplazó únicamente ese acoplamiento por un boolean local `soundOn`. No toca audio del juego ni estado compartido.

### 2. Resolución: lookup visual por nombre

`solutionVisual()` todavía localiza la imagen de responsable / escena / objeto comparando nombres visibles normalizados contra `P2_LABELS`.

Por seguridad, EN1 NO traduce `P2_LABELS.characters`, `P2_LABELS.locations` ni `P2_LABELS.objects`.

Antes de traducir esos nombres en EXP01-EN3 se debe desacoplar el lookup visual y resolver assets mediante índices / IDs canónicos, manteniendo el contenido server-side sin cambios.

## Imágenes con posible texto embebido · inventario para EXP01-EN4

No se modificó ningún asset. Existen 18 JPG principales a revisar visualmente en EN4:

### Personajes — prioridad media

- `assets/personajes/santiago.jpg`
- `assets/personajes/clara.jpg`
- `assets/personajes/vera.jpg`
- `assets/personajes/mateo.jpg`
- `assets/personajes/ines.jpg`
- `assets/personajes/tomas.jpg`

### Escenas — prioridad alta para auditoría visual

- `assets/escenas/sala-estar.jpg`
- `assets/escenas/cocina.jpg`
- `assets/escenas/estudio.jpg`
- `assets/escenas/dormitorio.jpg`
- `assets/escenas/jardin-exterior.jpg`
- `assets/escenas/pasillo-acceso.jpg`

### Objetos — prioridad alta para auditoría visual

- `assets/objetos/arma.jpg`
- `assets/objetos/cuaderno.jpg`
- `assets/objetos/celular.jpg`
- `assets/objetos/llave.jpg`
- `assets/objetos/memoria-usb.jpg`
- `assets/objetos/panuelo.jpg`

Estado EN1: **pendiente de clasificación visual detallada de texto realmente impreso dentro de la fotografía**. Los sellos/labels detectados en el código son mayoritariamente HTML/CSS y por eso pueden localizarse sin duplicar la imagen.

## Printables

Sin cambios. El kit P2.12D.17.4 sigue siendo el canon actual. `KIT_ES / KIT_EN` queda reservado para una fase posterior.

## QA estático ejecutado

- parche aplicado con `git diff --check` PASS;
- selector e import central presentes PASS;
- `mode` interno sigue `dig` / `imp` PASS;
- `pc_exp_p2_last_room` preservado PASS;
- `pc_exp_rev01_theory_v1` preservado PASS;
- idioma ausente de payloads del adapter P2 PASS;
- fallback `EN -> ES -> key` implementado PASS;
- intro propaga `lang` junto a `access` / `room` PASS;
- workflow de parche EXP01-EN1 PASS.

## QA browser

Run creado: `36916899729` · `EXP01 EN1 browser QA`.

El run valida URL ES/EN, cambio en vivo, persistencia, prioridad URL, parámetros existentes, dos contextos con misma room y distinto idioma local, save local ES -> reopen EN, handoff Intro -> Caso con `lang/access/room`, selector mobile y ausencia de `undefined/null/[object Object]` visibles.

Actualizar este bloque con el resultado final antes de congelar EXP01-EN1.
