# TA-UI V2.0-P0.4R1 — QA funcional y móvil (auditoría de código)

Fecha: 2026-11-08. Alcance: preview V2; la versión estable `torre-america/index.html`, los archivos `app-*.js`, `access.js`, `data/*.json` y la intro quedan intactos.

## Evidencia comprobada (inspección de código)
- `preview-v2.html` enlaza al motor original y añade las capas visuales P0.2, P0.3, R3, R4, P0.4 en orden.
- El validador `access.js` sigue siendo obligatorio y se carga después de los recursos visuales; no hay desactivación del control de licencias.
- Los modos de torre física incluyen CLASICO, PUNTOS, EQUIPOS, ELIMINACION y FINAL. El formato digital incluye PUNTOS, EQUIPOS, ELIMINACION y FINAL.
- El selector de 54 bloques, la asignación de consignas, los eventos del dado, penales, desempates y la reanudación se implementan en archivos de motor originales.
- Los únicos cambios de P0.4 afectan al documento preview y a dos nuevos recursos de accesibilidad visual.

## Observaciones de riesgo (requieren prueba real, NO se modificó motor)
1. **Recuperación de definición por penales:** `resumeGame()` restaura `S.shootout` pero deja las secciones de inicio visibles; comprobar ronda/turno del pateador, respuesta pendiente y persistencia antes/después de cada tiro.
2. **Reanudación de un penal del dado:** `resumeGame()` reconstruye `pen` desde `S.activePenalty`; validar penal en curso y retorno a consigna principal.
3. **Regresión de temporizadores:** `startTimer()`, `startPenalty()` y `startShootoutKick()` manejan intervalos distintos; verificar que reiniciar, salir y reingresar no duplique cuentas ni oculte botones.
4. **Accesibilidad del selector:** nueva recuperación de foco implementada por `ta-mobile-qa-p04.js`; falta comprobar en Chrome/Firefox/Safari real.
5. **P0.3R5:** la vista previa rastreada en GitHub está etiquetada P0.3R4, por lo que no debe afirmarse que R5 ya está integrada.

## Matriz de regresión pendiente de ejecución con acceso legítimo
| ID | Caso | Resultado esperado |
| --- | --- | --- |
| M01 | Móvil 320/375/390/430px, vertical y horizontal | Sin desbordes ni solapamiento de controles |
| A01 | Tab + Enter/Espacio en modo y dificultad | Selección efectiva y foco conservado |
| F01 | Física: elegir bloque 01, 27 y 54 | Consigna correspondiente, sin alterar número |
| D01 | Digital: 54 sorteos, dificultad fija y mixta | Bloques válidos, consignas válidas |
| T01 | Cronómetro de reto: iniciar / finalizar | Valores correctos y respuesta habilitada |
| E01 | 5 modos físicos / 4 digitales | Puntuación y cierre conforme reglas originales |
| P01 | Evento DADO: seis resultados | Efecto correcto y un solo uso |
| P02 | Penal simple, definición por 3 y muerte súbita | Turno, marcador y ganador correctos |
| R01 | Reanudar turno, reto, resultado, penal y tanda | Estado conservado y pantalla utilizable |
| L01 | Acceso sin licencia, con licencia y offline vigente | No permitir acceso sin autorización |
| V01 | Activar/desactivar audio, vibración y animaciones | Preferencias respetadas |
| S01 | Revisión visual de R4 y R5 | Sin regresiones de iconografía/animaciones |

## Decisión
P0.4R1 queda en **auditoría estática + correcciones de interfaz aisladas**, no en QA end-to-end aprobado. No fusionar la rama ni publicar el preview hasta completar la matriz con una cuenta autorizada en navegadores reales.


## P0.4R2 — Resultado de ejecución automatizada (2026-11-08)

- Ejecución de GitHub Actions: https://github.com/pasalochevere/expediente/actions/runs/42526998957 — **SUCCESS**.
- Evidencia: artifact `ta-p04r2-browser-evidence` (5 capturas móviles y reporte JSON).
- Chromium ejecutó los tamaños de 320, 375, 390, 430 y 768 px.
- En cada tamaño se verificó carga de la biblioteca (162 retos, 60 penales), inicialización de UI, selección por teclado de modo y dificultad, configuración de jugadores, sorteo y visualización de un reto digital, presentación de respuesta y resultado de la jugada, y un bloque físico sin evento hasta resultado.
- Corrección validada: la recuperación de foco tras reconstruir una tarjeta funciona usando `requestAnimationFrame`.
- Los pasos críticos de formato y navegación secundaria se probaron invocando funciones originales del DOM en una **fixture aislada**; esto confirma su flujo de software, **NO** valida hit-testing táctil ni desplazamiento real de todos los botones.
- El test intercepta el cargador `access.js` solo dentro de la sesión automatizada: ninguna licencia real se probó, y el archivo fuente permanece intacto.
- Pendientes antes de fusionar: recorrido táctil auténtico, validación de licencia, dados y poderes completos, penales y muerte súbita, reanudación y orientación horizontal. P0.4R2 es una **prueba parcial aprobada**, no un end-to-end integral certificado.
