# CASO 001 · LA ÚLTIMA REUNIÓN
## P2.1 — Estándar maestro del misterio

Estado: CONGELADO PARA P2

Este documento define las reglas que debe cumplir cualquier partida de Caso 001 antes de integrarse al portal actual.

## 1. Principio central

Caso 001 deja de construir una solución aleatoria `persona + lugar + objeto` y luego fabricar descartes alrededor de ella.

A partir de P2, cada partida nace de un **Paquete de Crimen** completo y coherente. El paquete contiene una verdad criminal previa: motivo, cronología, escena clave, objeto clave, mentira central, contradicción, evidencias, señuelos y reconstrucción final.

El jugador no debe sentir que resuelve una matriz. Debe sentir que reconstruye un hecho.

## 2. Conceptos canónicos

### Persona responsable
Uno de los seis personajes activos. Debe tener un motivo concreto, oportunidad verificable y una mentira o maniobra posterior al hecho.

### Escena clave
Reemplaza conceptualmente a “lugar correcto”. Es el espacio que resulta indispensable para reconstruir el hecho central. Puede ser el lugar del ataque, del encuentro decisivo o de una maniobra inmediatamente ligada al crimen, pero esa función debe quedar explícita dentro del paquete.

### Objeto clave
Reemplaza conceptualmente a `weapon`. No tiene que ser un arma. Es el objeto sin el cual la explicación del crimen queda incompleta. Puede probar acceso, horario, motivo, identidad, encubrimiento o mecanismo.

Objetos disponibles:
- O1 · Arma
- O2 · Cuaderno
- O3 · Celular
- O4 · Llave
- O5 · Memoria USB
- O6 · Pañuelo

## 3. Las seis familias de evidencia

Toda partida debe combinar al menos cuatro de estas familias:

1. **Temporal** — horarios, registros, tickets, llamadas, secuencias.
2. **Testimonial** — declaraciones, omisiones y contradicciones.
3. **Física** — fibras, marcas, huellas, desplazamientos, rastros.
4. **Digital** — celular, USB, archivos, metadatos, registros.
5. **Acceso** — llaves, puertas, permisos, recorridos posibles.
6. **Motivacional** — dinero, secretos, vínculos, presión, reputación.

Las evidencias visibles deben describir hechos del mundo. Evitar textos del tipo “X no es culpable” o “este objeto es incorrecto”. La deducción pertenece al jugador.

## 4. Cadena de prueba obligatoria

Cada Paquete de Crimen debe contener una **cadena de prueba** de al menos tres evidencias independientes que, combinadas, sostengan:

- identidad de la persona responsable;
- escena clave;
- objeto clave;
- contradicción decisiva.

Ninguna pista aislada debe revelar la solución completa.

## 5. Solución única

La partida debe ser resoluble sin pedirle al Director que confirme combinaciones.

Antes de ser habilitado, un paquete debe pasar un validador de solvencia:

- 1 y solo 1 persona compatible al final;
- 1 y solo 1 escena compatible al final;
- 1 y solo 1 objeto compatible al final;
- cadena de prueba completa;
- ningún dato obligatorio depende de información inaccesible para la cantidad de jugadores elegida.

El Director puede orientar, contextualizar o reexpresar evidencias. No puede ser necesario para completar la solución.

## 6. Director narrativo

Se elimina como objetivo la respuesta matemática tipo:

- Pista prometedora
- Pista parcial
- Línea débil

El nuevo Director debe responder con información diegética: registros, observaciones, contradicciones o sugerencias de qué cruzar.

Ejemplo:

En vez de “Pista parcial”, usar: “El registro del edificio confirma movimiento cerca del estudio durante esa franja, pero la cámara no permite identificar a la persona.”

## 7. Señuelos

Cada paquete debe contener 1 o 2 `redHerrings` plausibles.

Un señuelo:
- debe tener explicación real dentro de la historia;
- no puede contradecir la solución;
- no puede depender de una mentira del sistema;
- debe poder descartarse mediante otra evidencia.

## 8. Personajes y secretos

Los secretos personales no equivalen automáticamente al crimen. Deben servir para generar sospecha, negociación e información privada.

Cada paquete debe definir al menos dos relaciones cruzadas entre personajes para evitar seis historias aisladas alrededor de la víctima.

## 9. Modo Impostor

Regla base:

- Evidencia oficial pública: NO se puede falsear.
- Evidencia oficial privada recibida por el jugador: NO se puede falsear al mostrarla como evidencia.
- Secretos personales, intenciones y acciones no verificadas: el jugador puede ocultarlos o mentir sobre ellos.
- Teorías: libres.
- La persona responsable recibe sabotajes limitados definidos por el paquete; no puede inventar evidencia oficial.

## 10. Acusación final

Antes de revelar la solución, la interfaz debe capturar y bloquear:

1. Persona acusada.
2. Escena clave.
3. Objeto clave.
4. Motivo o hipótesis causal.

Una vez confirmada la acusación no puede editarse.

El cierre debe devolver:
- aciertos por dimensión;
- resolución total / parcial / fallida;
- reconstrucción cronológica;
- contradicción decisiva;
- explicación de los señuelos.

## 11. Reglas de calidad de un Paquete de Crimen

Un paquete queda aprobado solo si cumple todas:

- motivo creíble;
- oportunidad concreta;
- escena necesaria para la explicación;
- objeto necesario para la explicación;
- mentira central verificable;
- al menos una contradicción decisiva;
- 6 o más evidencias;
- al menos 4 familias de evidencia;
- 1 o 2 señuelos justificables;
- cadena de prueba de 3 o más evidencias;
- epílogo narrativo;
- no depende del Director para ser resuelto;
- no presenta dos soluciones igualmente compatibles.

## 12. Identificadores estables

Personajes:
- SANTIAGO
- CLARA
- VERA
- MATEO
- INES
- TOMAS

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

Estos IDs no deben cambiar aunque luego cambie el texto visible.

## 13. Migración segura

La versión actual de `index.html` permanece intacta durante P2. Los nuevos datos y el nuevo motor se construyen en `/caso001` y solo se conectarán al portal cuando hayan pasado validación estructural y QA jugable.
