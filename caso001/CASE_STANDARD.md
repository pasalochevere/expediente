# CASO 001 · LA ÚLTIMA REUNIÓN
## Estándar maestro del misterio P2.11C

Estado: CONGELADO PARA QA POST-FIX

## 1. Principio central

Caso 001 no construye una solución aleatoria `persona + lugar + objeto` para luego fabricar descartes.

Cada partida nace de un **Paquete de Crimen** coherente que contiene una verdad previa: responsable, escena clave, objeto clave, motivo, hecho crítico, mecanismo, acción postcrimen, cronología, mentira central, contradicción, relaciones, señuelos, evidencias y reconstrucción final.

El jugador debe sentir que reconstruye un hecho, no que resuelve una matriz.

## 2. Conceptos canónicos

### Persona responsable
Uno de los seis personajes de la historia:
- SANTIAGO
- CLARA
- VERA
- MATEO
- INES
- TOMAS

Los seis existen siempre, aunque no todos estén controlados por humanos.

### Escena clave
Espacio indispensable para reconstruir el hecho central. Puede ser lugar de la confrontación, del ataque o de una maniobra inmediatamente ligada al crimen.

### Objeto clave
Objeto sin el cual la explicación queda incompleta. No tiene que ser el mecanismo ni un arma.

Objetos:
- O1 · Arma
- O2 · Cuaderno
- O3 · Celular
- O4 · Llave
- O5 · Memoria USB
- O6 · Pañuelo

Cada paquete puede concretar la representación visible de un objeto genérico. Ejemplo: O1 puede ser un cuchillo de cocina en un crimen específico.

## 3. Campos narrativos obligatorios

Todo paquete debe declarar:

- `motive` — por qué existe presión real;
- `truthSummary` — verdad resumida del caso;
- `criticalEvent` — qué ocurrió exactamente en el momento central;
- `mechanism` — cómo ocurrió y qué rol cumple el objeto clave;
- `postCrimeAction` — primera maniobra de encubrimiento;
- `centralLie` — mentira principal del responsable;
- `contradiction` — qué cruce rompe esa mentira;
- `timeline` — secuencia cronológica;
- `epilogue.reconstruction` — reconstrucción final específica;
- `epilogue.closing` — cierre propio del caso.

## 4. Las seis familias de evidencia

Cada paquete debe combinar al menos cuatro:

1. Temporal.
2. Testimonial.
3. Física.
4. Digital.
5. Acceso.
6. Motivacional.

Las evidencias visibles describen hechos del mundo. Evitar textos como “X es culpable” o “este objeto es incorrecto”.

## 5. Ritmo de revelado

### Etapa 1 · Apertura

Objetivo: abrir líneas.

- establece escena, objeto, anomalía o conflicto;
- no debe identificar directamente al responsable;
- `supports.suspect` está prohibido en Stage 1;
- debe permitir varias interpretaciones.

### Etapa 2 · Fractura

Objetivo: reducir, no cerrar.

- introduce motivos y contradicciones;
- mantiene al menos una alternativa narrativa razonable;
- los señuelos siguen activos;
- una sola pista no debería resolver Persona + Escena.

### Etapa 3 · Pivote

Objetivo: cerrar por cruce.

- identifica o vincula la prueba decisiva;
- rompe la mentira central;
- explica el señuelo;
- permite reconstruir Persona + Escena + Objeto + Motivo + Contradicción.

## 6. Cadena de prueba

Cada paquete necesita una cadena de al menos tres evidencias independientes que, combinadas, sostengan:

- identidad;
- escena;
- objeto;
- motivo;
- contradicción.

Ninguna evidencia aislada de Etapa 1 debe revelar la solución completa.

## 7. Solución única y límites de la matriz

La partida debe ser resoluble sin pedir al Director que confirme combinaciones.

El motor interno verifica que `rulesOut` converge a:

- 1 responsable;
- 1 escena;
- 1 objeto.

`rulesOut` es solo QA técnico/pacing. No equivale a demostrar que un humano perciba la deducción como justa.

## 8. Director narrativo

El Director no responde “hit/miss”. Entrega orientación diegética: horarios, accesos, contradicciones o relaciones que conviene cruzar.

Nunca debe ser necesario para completar la solución.

## 9. Señuelos

Cada paquete debe contener 1 o 2 `redHerrings` con:

- `title`;
- `text` — presentación del señuelo sin explicar por qué es falso;
- `resolution` — explicación diferida para Etapa 3/epílogo.

Un señuelo debe ser plausible, justo y descartable mediante evidencia real.

## 10. Humanos y NPC · 3–6 jugadores

Los seis personajes existen siempre.

- 3 jugadores = 3 humanos + 3 NPC.
- 4 jugadores = 4 humanos + 2 NPC.
- 5 jugadores = 5 humanos + 1 NPC.
- 6 jugadores = 6 humanos.

### Modo normal

Cualquiera de los seis puede ser responsable, sea humano o NPC. La cantidad de jugadores no debe reducir el universo de sospechosos por metajuego.

### Testimonios

Si el testigo es humano, una evidencia privada puede entregarse a ese jugador.

Si el testigo es NPC, la misma información debe poder recuperarse como declaración del expediente mediante `npcFallback`.

Ninguna solución puede depender de información inaccesible por cantidad de jugadores.

## 11. Modo Impostor

En Impostor, el responsable sí debe estar controlado por un humano.

Reglas:
- evidencia oficial pública: no se falsifica;
- evidencia oficial privada: no se falsifica al mostrarla como evidencia;
- secretos, intenciones y acciones no verificadas: pueden ocultarse o mentirse;
- teorías: libres;
- sabotajes: limitados por el estándar del modo;
- el Director nunca miente.

## 12. Acusación final

Antes de revelar la solución, la interfaz debe capturar y bloquear:

1. Persona acusada.
2. Escena clave.
3. Objeto clave.
4. Motivo o hipótesis causal.

El cierre devuelve:
- aciertos por dimensión;
- resolución total/parcial/fallida;
- hecho crítico;
- mecanismo;
- acción postcrimen;
- reconstrucción cronológica;
- contradicción decisiva;
- explicación de los señuelos.

## 13. Reglas de calidad de un Paquete de Crimen

Un paquete queda aprobado para QA solo si cumple:

- motivo creíble;
- oportunidad concreta;
- escena necesaria;
- objeto necesario;
- hecho crítico explícito;
- mecanismo explícito;
- acción postcrimen explícita;
- mentira central verificable;
- contradicción decisiva;
- 6 o más evidencias;
- 4 o más familias;
- 1 o 2 señuelos con resolución diferida;
- cadena de prueba completa;
- epílogo específico;
- fallback NPC en testimonios privados necesarios;
- no depende del Director;
- no presenta dos soluciones finales igualmente compatibles.

## 14. Identificadores estables

Escenas:
- L1 · Sala de estar
- L2 · Cocina
- L3 · Estudio
- L4 · Dormitorio
- L5 · Jardín / exterior
- L6 · Pasillo / acceso

Objetos:
- O1 · Arma
- O2 · Cuaderno
- O3 · Celular
- O4 · Llave
- O5 · Memoria USB
- O6 · Pañuelo

Los IDs no cambian aunque cambie el texto visible.

## 15. Migración segura

La versión actual del `index.html` raíz permanece intacta durante P2.

Los nuevos datos y motores viven en `/caso001` y solo se integrarán al portal después de QA post-FIX, playtest humano, adaptación multiplayer y revisión de seguridad.
