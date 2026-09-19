# CASO 001 · LA ÚLTIMA REUNIÓN · P2

Esta carpeta contiene la reconstrucción no destructiva del motor de misterio de Caso 001.

## Estado actual

- `CASE_STANDARD.md` — reglas maestras P2.
- `manifest.json` — IDs estables de personajes, escenas, objetos y lista de Crime Packs.
- `packs/C001-01.json` … `C001-12.json` — 12 crímenes reescritos después de P2.11C.
- `crime-engine.js` — carga, validación, progresión, acusación y Director narrativo.
- `proof-map.json` + `proof-validator.js` — mapa de prueba narrativa y auditoría de roles.
- `player-count-qa.js` — matriz 3–6 jugadores con humanos + NPC y matriz específica de Impostor.
- `qa.html` — panel visual de QA P2.11C.
- `P2.11B_QA_JUGABLE.md` — diagnóstico profundo previo al FIX.
- `P2.11C_FIX_JUGABLE.md` — cambios aplicados y reglas posteriores al FIX.
- `index.html` — prototipo jugable aislado P2.

## Estado P2.11C

Los 12 Paquetes de Crimen ya incorporan:

- `criticalEvent`: qué ocurrió exactamente en el momento central;
- `mechanism`: cómo ocurrió y qué función cumple el objeto clave;
- `postCrimeAction`: primera maniobra de encubrimiento;
- Etapa 1 sin identificación directa del responsable;
- Etapa 2 con al menos una hipótesis alternativa narrativa;
- Etapa 3 como pivote de identificación/reconstrucción;
- señuelos con `text` de presentación y `resolution` diferida;
- epílogos específicos para cada crimen;
- correcciones de tecnología demasiado determinante;
- fallback NPC para testimonios privados esenciales.

Los casos C001-11 y C001-12 fueron rediseñados en profundidad. C001-04, 05, 07 y 08 fueron reestructurados en su secuencia de revelado. Los otros seis recibieron ajustes de ritmo, prueba y señuelos.

## Regla 3–6 jugadores

Los seis personajes existen siempre en el mundo de la historia.

- 3 jugadores = 3 humanos + 3 NPC.
- 4 jugadores = 4 humanos + 2 NPC.
- 5 jugadores = 5 humanos + 1 NPC.
- 6 jugadores = 6 humanos.

### Modo normal

Cualquiera de los seis personajes puede ser responsable, sea humano o NPC. Esto evita que la cantidad de jugadores revele información por metajuego.

La matriz completa contempla 42 configuraciones humanas por paquete, es decir 504 configuraciones para los 12 crímenes.

### Modo Impostor

El responsable debe ser un personaje controlado por una persona, porque ese jugador recibe el rol oculto y los sabotajes permitidos.

La submatriz compatible con Impostor conserva 26 configuraciones por paquete, es decir 312 configuraciones para los 12 crímenes.

Los testimonios privados de personajes NPC se transforman en declaraciones recuperables desde el expediente mediante `npcFallback`.

## Regla de revelado P2.11C

### Etapa 1 · Apertura

- establece escena, objeto, anomalía o conflicto;
- no usa `supports.suspect`;
- no identifica directamente al responsable;
- debe permitir varias lecturas iniciales.

### Etapa 2 · Fractura

- introduce motivo, contradicción y relaciones;
- reduce el universo narrativo;
- mantiene al menos una alternativa plausible;
- un señuelo todavía puede parecer válido.

### Etapa 3 · Pivote

- identifica o vincula la prueba decisiva;
- resuelve el señuelo;
- permite reconstruir Responsable + Escena + Objeto + Motivo + Contradicción;
- la prueba final funciona por cruce, no como respuesta aislada sin contexto.

## QA automatizado

`crime-engine.js` ahora falla si:

- falta `criticalEvent`, `mechanism` o `postCrimeAction`;
- un señuelo no tiene resolución diferida;
- una evidencia de Etapa 1 identifica un sospechoso mediante `supports.suspect`;
- un testimonio privado no tiene testigo y fallback NPC;
- faltan familias de evidencia, cadena de prueba o reconstrucción;
- la matriz interna no converge a una solución única.

`proof-map.json` fue actualizado a v1.1.0 después de la reescritura P2.11C.

Importante: `rulesOut` y la matriz automática sirven para compatibilidad y pacing técnico. No prueban por sí solos que un humano perciba la deducción como justa o divertida.

## Regla de integración

No modificar el `index.html` raíz todavía. La versión publicada permanece intacta mientras P2 vive en `mejora-caso001-p2`.

## Pendientes antes de integrar en producción

- P2.11D — playtest simulado final / recorrido de mesa de los 12 casos después del FIX.
- Playtest humano real para dificultad, claridad, diversión y duración 30–45 min.
- Adaptar selección de caso a regla normal vs Impostor en el multiplayer real.
- Distribución real de evidencia privada/expediente NPC.
- Integración con sala, cronómetro, bitácora y Realtime de V1.
- Verificación server-side de solución, permisos, RLS y acciones de anfitrión.
- QA móvil y reconexión.

**Estado:** P2.11C IMPLEMENTADO · QA DE ESCRITORIO REFORZADO · PLAYTEST HUMANO PENDIENTE · NO RELEASE CANDIDATE.
