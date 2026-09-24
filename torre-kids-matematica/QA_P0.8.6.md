# P0.8.6 — QA Kids real + pulido visual

**Producto:** Chévere Kids · Matemática 7–9  
**Versión:** 1.3.0  
**Fecha:** 2026-09-24

## Alcance

QA heurístico de uso infantil tomando como disparador el feedback real de prueba: evitar que el jugador vea la solución antes de comprometer una respuesta. Se revisaron además legibilidad, jerarquía visual, tamaño táctil, comportamiento móvil, orientación, feedback, accesibilidad básica e intro cinematográfica.

## Correcciones aplicadas

- Respuesta activa mantiene el resultado oculto hasta que el jugador responda.
- Tres intentos visibles antes de habilitar solución.
- La pista aparece luego de intentos fallidos y reduce la recompensa como ya definía el motor.
- Si la solución fue mostrada, el desafío queda bloqueado para puntaje; solo puede recuperarse una estrella mediante Mini Reto.
- El lenguaje visible deja de hablar de “anti-trampa” y pasa a una lógica positiva: Pensá → Respondé → Comprobá.
- Los desafíos orales o variables siguen con validación supervisada y referencia oculta hasta terminar.
- Se mejoraron botones, estados táctiles, focus visible, tarjetas de desafío, chips, puntaje, misión y jerarquía general.
- Se ampliaron objetivos táctiles para celular y tablet.
- Pantalla de desafío optimizada en móvil: tarjeta principal primero y mascota/feedback en bloque compacto.
- Navegación superior adaptable con desplazamiento horizontal en pantallas chicas.
- Intro Cinema Engine V3 ajustada a `100dvh`, safe areas, retrato y paisaje de baja altura.
- Categorías de la intro pasan a 2 columnas en móvil y 6 columnas en paisaje.
- Se agregó soporte `prefers-reduced-motion`.
- Se agregó feedback visual de intentos y celebración liviana al acertar.

## QA técnico

- `kids-qa-v1.js`: sintaxis JavaScript validada con `node --check`.
- `answer-engine-v1.js`: sintaxis validada nuevamente.
- `cinema-engine-v3.js`: sintaxis validada nuevamente.
- Assets P0.8.6 enlazados al HTML principal.
- `TK_VERSION=1.3.0`.
- `KIDS_QA_VERSION=1.0.0`.

## Limitación consciente

No existe una protección absoluta contra un niño decidido a “hacer trampa” en desafíos supervisados: cualquier mecanismo de validación de adulto puede ser operado por el mismo jugador. El objetivo de V1.3 es evitar la revelación accidental o inmediata de respuestas y hacer que el flujo normal premie primero el intento real.

## Prueba recomendada

1. Abrir desde Mi Biblioteca en celular.
2. Completar la intro en vertical y luego repetir con celular horizontal.
3. Entrar en Solo Digital y sortear un desafío numérico.
4. Fallar dos veces, pedir pista, fallar una tercera vez y abrir solución.
5. Verificar que, una vez abierta la solución, no sea posible ganar estrellas ingresando el número correcto.
6. Ejecutar Mini Reto y comprobar recuperación de una estrella.
7. Probar un desafío de dados/tiempo para verificar validación supervisada.
8. Repetir en desktop para revisar navegación, tarjetas y tamaños.
