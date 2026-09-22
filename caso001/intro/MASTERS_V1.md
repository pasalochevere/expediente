# P2.12D.16.4 · INTRO CASO 001 · MASTERS V1

Estado: FROZEN V1
Producto: EXPEDIENTES · Caso 001 — La Última Reunión
Objetivo: intro cinematográfica con material REAL del producto, sin revelar la solución ni privilegiar elementos que permitan inferirla.

## Política NO-SPOILER

- Los seis personajes reciben el mismo peso visual.
- Ningún objeto decisivo queda como hero único.
- Ninguna escena potencialmente decisiva domina la narrativa.
- No se captura ni muestra solución, resultado de acusación, verdad privada, rol secreto, reconstrucción final ni datos de clientes.
- Las capturas de juego deben realizarse únicamente con sesión/partida QA.

## Masters congelados

### M01 · ATMÓSFERA / APERTURA — FROZEN
Primario: `assets/escenas/pasillo-acceso.jpg`
Apoyo: `assets/escenas/estudio.jpg`
Uso: apertura, desplazamiento, tensión inicial.
Motivo: introduce el espacio sin destacar una escena como respuesta.

### M02 · UNIVERSO DEL CASO — FROZEN
Montaje equilibrado de las seis escenas reales:
- `assets/escenas/sala-estar.jpg`
- `assets/escenas/cocina.jpg`
- `assets/escenas/estudio.jpg`
- `assets/escenas/dormitorio.jpg`
- `assets/escenas/jardin-exterior.jpg`
- `assets/escenas/pasillo-acceso.jpg`
Regla: ningún plano > 1.2 s antes del bloque de gameplay.

### M03 · SOSPECHOSOS — FROZEN
Montaje con igualdad estricta de duración, escala y tratamiento:
- `assets/personajes/santiago.jpg`
- `assets/personajes/clara.jpg`
- `assets/personajes/vera.jpg`
- `assets/personajes/mateo.jpg`
- `assets/personajes/ines.jpg`
- `assets/personajes/tomas.jpg`
Regla: no asociar efectos, color, sonido o texto especial a una persona concreta.

### M04 · EVIDENCIAS — FROZEN
Hero visual seguro: `assets/objetos/celular.jpg`
Apoyo equilibrado:
- `assets/objetos/llave.jpg`
- `assets/objetos/cuaderno.jpg`
- `assets/objetos/memoria-usb.jpg`
- `assets/objetos/arma.jpg`
- `assets/objetos/panuelo.jpg`
Regla: el pañuelo puede aparecer solo como parte del montaje y nunca como plano dominante o conclusión visual.

### M05 · GAMEPLAY REAL — CAPTURE REQUIRED
Captura QA real de investigación activa.
Debe mostrar:
- barra de estado / etapa
- cronómetro
- evidencia pública
- navegación/paneles reales
No debe mostrar:
- verdad privada
- solución
- identidad del culpable
- datos personales
Archivo objetivo: `intro/captures/UI_GAMEPLAY_STAGE1.png`

### M06 · TABLERO DE TEORÍA — CAPTURE REQUIRED
Captura QA real del tablero PERSONA + ESCENA + OBJETO + MOTIVO.
Estado ideal: hipótesis incompleta / neutra.
Archivo objetivo: `intro/captures/UI_THEORY_BOARD.png`

### M07 · PROGRESIÓN — CAPTURE REQUIRED
Tres capturas QA reales del mismo caso visualmente coherentes:
- `intro/captures/UI_STAGE1.png`
- `intro/captures/UI_STAGE2.png`
- `intro/captures/UI_STAGE3.png`
Regla: textos de pistas no deben ser legibles a escala de intro si contienen información decisiva.

### M08 · ACUSACIÓN — CAPTURE REQUIRED
Captura QA real de la pantalla de acusación ANTES de sellarla.
Persona, escena y objeto deben quedar vacíos o con selección deliberadamente neutra/ficticia.
Archivo objetivo: `intro/captures/UI_ACCUSATION_EMPTY.png`

### M09 · LOBBY MULTIJUGADOR — CAPTURE REQUIRED
Captura QA real de una sala de prueba, nunca de un cliente.
Puede mostrar código QA y jugadores QA.
Archivo objetivo: `intro/captures/UI_LOBBY_QA.png`

### M10 · CIERRE / TITLE MASTER — FROZEN
Base visual: `assets/escenas/estudio.jpg` + montaje sutil de escenas/objetos.
Texto:
EXPEDIENTES
CASO 001 · LA ÚLTIMA REUNIÓN
INVESTIGÁ · ACUSÁ · RESOLVÉ
Regla: no usar sala + pañuelo + personaje específico como composición final.

## Capturas obligatorias antes de integrar Intro V3

1. UI_LOBBY_QA.png
2. UI_GAMEPLAY_STAGE1.png
3. UI_STAGE1.png
4. UI_STAGE2.png
5. UI_STAGE3.png
6. UI_THEORY_BOARD.png
7. UI_ACCUSATION_EMPTY.png

## Duración visual recomendada

- Material real del juego/UI: 60–70%
- Atmósfera/escenas/personajes/objetos: 30–40%

## Criterio de aprobación

Un espectador debe entender en menos de 30 s que Caso 001 tiene:
- sospechosos reales
- escenas investigables
- evidencias
- progresión por etapas
- tablero de teoría
- acusación final

sin poder deducir la solución por la selección de imágenes.
