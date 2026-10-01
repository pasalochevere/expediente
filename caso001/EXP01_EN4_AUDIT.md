# EXP01-EN4 · Visual Language Audit · ES / EN

Estado: **PASS condicionado al gate automatizado de este commit**. El workflow sólo publica este build si el gate termina verde.

## Universo auditado

Se inspeccionaron los **18 assets raster activos** de Caso 001:

- 6 escenas;
- 6 objetos;
- 6 retratos de personajes.

### Assets neutros reutilizados 1:1

No contienen texto español que afecte la experiencia y se reutilizan exactamente iguales en ES y EN:

- escenas: Cocina, Dormitorio, Estudio, Jardín / exterior, Pasillo / acceso, Sala de estar;
- objetos: Arma, Celular, Llave, Memoria USB, Pañuelo.

Total reutilizado: **11 assets**.

### Assets con variante EN

Se detectó texto español incrustado en **7 assets**:

- Santiago — `EL ÉXITO TAMBIÉN DEJA ENEMIGOS` → `SUCCESS MAKES ENEMIES TOO.`
- Clara — `ALGUNOS LAZOS NUNCA SE ROMPEN.` → `SOME BONDS NEVER BREAK.`
- Vera — `EL PASADO SIEMPRE VUELVE.` → `THE PAST ALWAYS COMES BACK.`
- Mateo — `ALGUIEN TIENE QUE HACER QUE LAS COSAS FUNCIONEN` → `SOMEONE HAS TO MAKE THINGS WORK.`
- Inés — `LA VERDAD TAMBIÉN ES UNA HISTORIA.` → `TRUTH IS ALSO A STORY.` y `PRENSA` → `PRESS`;
- Tomás — `UN BUEN AMIGO SIEMPRE ESTÁ AHÍ. ¿VERDAD?` → `A GOOD FRIEND IS ALWAYS THERE. RIGHT?`;
- Cuaderno — `Ideas / Pistas / ¿Quién? / ¿Motivo?` → `Ideas / Clues / Who? / Motive?`.

Las variantes se almacenan como SVG autocontenidos con la foto original embebida. No se regenera ni altera el rostro, la escena, el objeto ni la composición base: sólo se cubre el texto incrustado y se presenta la versión inglesa.

## Runtime

`visual-en.js` aplica el intercambio sólo en presentación:

- ES → JPG original;
- EN → SVG localizado cuando existe variante;
- assets neutros → mismo JPG en ambos idiomas.

El observador también cubre imágenes creadas dinámicamente por lobby, tablero, solución e Intro.

## Seguridad / canon

No se modifican:

- Crime Packs;
- índices canónicos;
- P2 labels internos;
- room state;
- licencias;
- timers;
- roles;
- Edge Functions;
- payloads multiplayer.

## Fuera de alcance

Los imprimibles bilingües completos se cierran en **EXP01-EN5**. EN4 sólo garantiza el lenguaje visual de los assets usados por el juego digital y Cinema Intro.
