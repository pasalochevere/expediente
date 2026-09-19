# CASO 001 · P2.8 — Modo Impostor

## Objetivo

Mantener engaño social sin destruir la lógica deductiva del expediente.

## Regla de oro

**Ningún jugador puede falsificar, modificar ni negar como falsa una evidencia oficial del sistema.**

El culpable puede mentir sobre su propia versión, omitir información personal y gastar poderes de sabotaje controlados. La mesa siempre debe poder distinguir entre:

- EVIDENCIA OFICIAL;
- DECLARACIÓN DE JUGADOR;
- TEORÍA;
- ACCIÓN DE IMPOSTOR.

## Qué puede hacer cualquier jugador

- Mentir u ocultar secretos personales no documentados.
- Defender una teoría equivocada.
- Omitir una sospecha propia.
- Negociar, persuadir y acusar.

## Qué no puede hacer nadie

- Inventar una tarjeta o registro oficial.
- Cambiar el texto de una evidencia.
- Afirmar que una evidencia oficial no existe cuando fue revelada.
- Mostrar como oficial una declaración personal.
- Alterar horarios o resultados ya registrados por el sistema.

## Culpable / Impostor

El culpable recibe 2 fichas de sabotaje por partida. Puede usar como máximo una vez cada poder.

### 1. DECLARACIÓN CONTROLADA

Publica la `centralLie` del Paquete de Crimen como **DECLARACIÓN PERSONAL**.

La interfaz debe mostrarla visualmente distinta de la evidencia oficial.

No cambia ninguna variable lógica del caso.

### 2. RESERVA

Permite no responder una pregunta personal durante un turno de interrogación.

La interfaz registra que se utilizó RESERVA. No borra preguntas ni evidencias y no puede impedir la acusación final.

### 3. FOCO ALTERNATIVO

Obliga a que la siguiente investigación de mesa considere uno de los `redHerrings` reales del paquete.

El sistema solo muestra el título de esa línea de investigación. No agrega hechos falsos ni oculta evidencia.

## Límites

- 2 fichas totales.
- Cada poder solo una vez.
- No se puede usar un poder después de bloquear la acusación final.
- No se puede retrasar una evidencia necesaria para la solvencia.
- El Director nunca miente para ayudar al Impostor.

## Criterio de victoria

La victoria del culpable no depende de fabricar una realidad falsa. Depende de lograr que la acusación final falle en Persona, Escena u Objeto mediante persuasión, ocultamiento personal y uso inteligente de los dos sabotajes.

## UI obligatoria

Los eventos deben llevar etiqueta visible:

- `EVIDENCIA OFICIAL`
- `DECLARACIÓN PERSONAL`
- `IMPOSTOR · RESERVA`
- `IMPOSTOR · FOCO ALTERNATIVO`

Esto evita que el metajuego invalide las reglas deductivas.
