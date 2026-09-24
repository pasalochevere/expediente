# QA P0.8.7 — Chévere Kids · Matemática

Fecha: 2026-09-24

## Alcance

QA visual final y sistema de recompensas Kids sobre la versión V1.4, sin modificar los 54 desafíos, las reglas de puntaje base, los SKUs, las activaciones ni el acceso por dispositivo.

## Recompensas incorporadas

- HUD de partida: estrellas, desafíos jugados y nivel.
- Camino de estrellas en modos no Misión.
- Celebración visual al acertar.
- Hitos visuales en 4 / 8 / 12 / 16 / 20 estrellas.
- Medalla final según estrellas acumuladas.
- Categorías practicadas visibles en el cierre.
- Reinicio de hitos al iniciar una partida nueva o reiniciar.

## Reglas de QA

1. La celebración no debe bloquear el botón Siguiente turno.
2. El modo Misión conserva su propia barra de progreso y no duplica Camino de estrellas.
3. Los hitos no agregan ni descuentan estrellas.
4. Ver solución continúa bloqueando puntaje directo; solo Mini Reto puede recuperar una estrella.
5. Las recompensas no usan perfiles infantiles ni almacenamiento de rachas diarias.
6. El HUD se oculta en la pantalla final.
7. La pantalla final muestra una sola medalla por partida.
8. `prefers-reduced-motion` reduce las animaciones de celebración.
9. En celular horizontal el HUD, progreso y celebración deben caber sin tapar controles críticos.
10. El sistema debe convivir con Cinema Engine V3, Answer Engine V1 y Kids QA V1.

## Hitos visuales

- 4 ⭐ — Primer logro
- 8 ⭐ — Mente en marcha
- 12 ⭐ — Gran avance
- 16 ⭐ — Equipo brillante
- 20 ⭐ — Misión Chévere

Los hitos son exclusivamente celebratorios. No cambian la dificultad, el contenido ni las reglas de la partida.

## Compatibilidad

- Física + Digital: sin cambios de acceso.
- Solo Digital: sin cambios de acceso.
- Torre física 01–54: sin cambios.
- PDFs e imprimibles: sin cambios funcionales en este bloque.
- Desktop, celular vertical y celular horizontal contemplados.

## Validaciones técnicas

El workflow de integración ejecuta `node --check` sobre:

- `kids-rewards-v1.js`
- `kids-qa-v1.js`
- `answer-engine-v1.js`
- `cinema-engine-v3.js`

Y valida la presencia de los assets P0.8.7 y la versión `TK_VERSION='1.4.0'` en el HTML principal.
