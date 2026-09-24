# Chévere Kids · Matemática · V1.4

**Estado:** RELEASE ACTIVA / EVOLUCIÓN V1  
**Fecha base de release:** 2026-09-14  
**Última actualización:** 2026-09-24  
**Producto:** PasaloChévere · Chévere Kids · Matemática 7–9

## SKUs comerciales

- `TK-MAT-79-PHY` — Física + Digital
- `TK-MAT-79-DIG` — Solo Digital
- `TK-MAT-79` — legado/pruebas internas, no destinado a venta nueva

## Acceso

- Activación por correo + código de compra
- Código personal posterior a la activación
- 12 meses de vigencia desde la primera activación
- Hasta 2 dispositivos por licencia
- Física + Digital habilita Con Torre y Sin Torre
- Solo Digital habilita únicamente Sin Torre

## Contenido base

- 54 desafíos
- 6 categorías
- 9 desafíos por categoría
- 3 niveles
- 18 desafíos por nivel
- Modos Con Torre y Sin Torre
- Modo Misión con objetivo de estrellas
- Pistas, respuestas, mini retos y recuperación
- Botón Otro desafío dentro de misma categoría y nivel
- Resumen educativo final
- Música ambiente, efectos, control adulto y volumen
- PDFs: manual, 54 desafíos, respuestas y estrellas
- Identidad visual infantil, mascota y pictogramas

## Evolución V1.1 — Cinema Engine V3

- Intro cinematográfica real de 7 escenas.
- Capas de fondo, partículas, símbolos, mascota, construcción animada de torre, categorías y logo reveal.
- Botón Saltar intro.
- Inicio de audio luego de interacción del usuario.
- Adaptación a celular y desktop.

## Evolución V1.2 — Respuesta activa

- El jugador escribe el resultado antes de comprobar.
- Teclado numérico integrado para respuestas exactas.
- Tres intentos antes de habilitar solución.
- Pista progresiva.
- Desafíos orales/variables usan validación supervisada.
- La referencia permanece oculta hasta completar el intento.

## Evolución V1.3 — P0.8.6 QA Kids + pulido visual

- Flujo visual Pensá → Respondé → Comprobá.
- Contador visual de intentos.
- Corrección de loophole: si la solución fue mostrada, ya no se puede sumar estrellas ingresando luego la respuesta correcta.
- Mini Reto queda como única recuperación después de abrir solución.
- Botones y objetivos táctiles más grandes.
- Mejor jerarquía de tarjetas, desafíos, puntaje y misión.
- Pantalla de desafío optimizada para celular.
- Navegación responsive mejorada.
- Intro adaptada a `100dvh`, safe areas, retrato y paisaje.
- Soporte `prefers-reduced-motion`.
- Feedback positivo y celebración visual liviana al acertar.

## Evolución V1.4 — P0.8.7 QA visual final + Recompensas Kids

- HUD de partida con estrellas acumuladas, desafíos jugados y nivel actual.
- Camino de estrellas para partidas normales, sin duplicar el progreso visual del modo Misión.
- Celebración breve al acertar con estrellas ganadas y total acumulado.
- Hitos de celebración a 4, 8, 12, 16 y 20 estrellas.
- Hitos solo visuales: no cambian puntaje ni reglas del juego.
- Panel de medalla en el cierre de partida según progreso alcanzado.
- Resumen visual de categorías practicadas en la pantalla final.
- Recompensas reiniciadas correctamente al comenzar partida, revancha, cambio de nivel o reinicio adulto.
- Animaciones compatibles con `prefers-reduced-motion`.
- Ajustes específicos para celular horizontal y safe areas.

## Reglas de producto

- La biblioteca maestra es la fuente de verdad para digital e imprimible.
- El contenido físico no requiere cambios en las 54 piezas actuales.
- La numeración física continúa de 01 a 54.
- Los colores conservan su mapeo:
  - Rojo: Cálculo
  - Verde: Multiplicación
  - Azul: Lógica
  - Amarillo: Problemas
  - Fucsia: Velocidad
  - Negro: Súper desafío
- El portal debe validar licencia y dispositivo antes de abrir el juego.
- No se incorporan perfiles infantiles, chat, rankings online ni IA conversacional en V1.
- Las recompensas son locales a la partida y no introducen rachas obligatorias ni presión por uso diario.

## QA técnico vigente

- Sintaxis JavaScript validada para motor principal, Cinema Engine V3, Answer Engine V1, Kids QA V1 y Rewards Engine V1.
- 54 piezas únicas, sin faltantes ni duplicados.
- 9 desafíos por color.
- 18 desafíos por nivel.
- 3 desafíos por combinación color/nivel.
- Sorteo digital mantiene coherencia entre número de pieza y color/categoría.
- Mini reto puede completar una misión.
- Resumen final usa “desafíos jugados”.
- QA P0.8.6 documentado en `QA_P0.8.6.md`.
- QA P0.8.7 documentado en `QA_P0.8.7.md`.

## Próximas versiones

Nuevas mejoras deben conservar compatibilidad con los SKUs actuales, las 54 piezas y las activaciones existentes. Ediciones como Palabras, Inglés, Mente, Mundo o Emociones deben reutilizar la arquitectura común sin modificar retroactivamente el contenido base de Matemática.
