# CASO 001 · LA ÚLTIMA REUNIÓN · P2

Esta carpeta contiene la reconstrucción no destructiva del motor de misterio de Caso 001.

## Estado actual

- `CASE_STANDARD.md` — reglas maestras congeladas.
- `manifest.json` — IDs estables de personajes, escenas, objetos y lista de Crime Packs.
- `packs/C001-01.json` … `C001-12.json` — 12 crímenes completos y coherentes.
- `crime-engine.js` — carga, selección, validación estructural, solvencia, progresión, acusación y Director narrativo.
- `qa.html` — panel visual de QA estructural/lógico.
- `P2.11B_QA_JUGABLE.md` — auditoría humana profunda de los 12 crímenes.
- `index.html` — prototipo jugable aislado P2.

## Estado QA P2.11B

La auditoría jugable profunda está completa para 12/12 paquetes.

Resultado:
- 3 paquetes requieren ajuste leve: C001-02, C001-09, C001-10.
- 3 requieren reescritura media: C001-01, C001-03, C001-06.
- 4 requieren reestructuración del revelado: C001-04, C001-05, C001-07, C001-08.
- 2 requieren rediseño prioritario: C001-11, C001-12.

Hallazgos transversales:
- falta explicitar `criticalEvent`, `mechanism` y `postCrimeAction`;
- varias pistas de etapa 1/2 identifican demasiado pronto al responsable;
- los señuelos deben sobrevivir más tiempo antes de ser descartados;
- debe fijarse el comportamiento NPC de personajes no controlados en partidas de 3–5 jugadores;
- la tecnología debe corroborar la deducción y no sustituirla;
- los epílogos deben ser específicos de cada crimen.

**Estado:** QA de escritorio completo · PLAYTEST HUMANO PENDIENTE · NO RC.

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

- P2.11C — FIX jugable de los 12 Paquetes.
- Definir y agregar hecho crítico/mecanismo/acción postcrimen.
- Regla NPC y variantes de pistas para 3/4/5/6 jugadores.
- Asignación real de evidencias privadas.
- Poderes controlados del Modo Impostor.
- Adaptador server-side para mantener la solución fuera del estado público multijugador.
- Integración con sala, cronómetro, bitácora y Realtime de V1.
- QA móvil, reconexión y seguridad de acciones de anfitrión.
