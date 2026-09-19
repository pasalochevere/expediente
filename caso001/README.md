# CASO 001 · LA ÚLTIMA REUNIÓN · P2

Esta carpeta contiene la reconstrucción no destructiva del motor de misterio de Caso 001.

## Estado actual

- `CASE_STANDARD.md` — reglas maestras congeladas.
- `manifest.json` — IDs estables de personajes, escenas, objetos y lista de Crime Packs.
- `packs/C001-01.json` … `C001-12.json` — 12 crímenes completos y coherentes.
- `crime-engine.js` — carga, selección, validación estructural, solvencia, progresión, acusación y Director narrativo.
- `qa.html` — panel visual de QA de todos los paquetes.
- `index.html` — prototipo jugable aislado P2.

## Regla de integración

No modificar el `index.html` raíz hasta que la biblioteca P2 pase QA narrativo y jugable. La rama `mejora-caso001-p2` existe para evitar romper la versión publicada.

## Qué cambia respecto de V1

V1 elegía una combinación de Persona + Lugar + Objeto y adaptaba descartes alrededor de ella.

P2 elige un Paquete de Crimen que ya contiene motivo, verdad, cronología, mentira, contradicción, relaciones, señuelo, evidencias y epílogo. Las pistas describen hechos del mundo y el motor verifica internamente que todas conduzcan a una única solución.

## Flujo P2

1. Seleccionar un paquete compatible con los personajes activos.
2. Entregar evidencias en tres etapas.
3. Permitir teoría libre y orientación narrativa del Director.
4. Llegar a una solución única sin necesitar consultas hit/miss.
5. Registrar y bloquear Persona + Escena + Objeto antes de revelar.
6. Mostrar resultado parcial/total y reconstrucción cronológica.

## Pendientes antes de integrar en producción

- Asignación real de evidencias privadas para 3/4/5/6 jugadores.
- Poderes controlados del Modo Impostor.
- Adaptador server-side para mantener la solución fuera del estado público multijugador.
- Integración con sala, cronómetro, bitácora y Realtime de V1.
- QA móvil, reconexión y seguridad de acciones de anfitrión.
