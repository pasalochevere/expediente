# P2.12D.16.5 — TIMELINE CINEMATOGRÁFICA + MOTION PLAN V3

Producto: EXPEDIENTES · Caso 001 — La Última Reunión  
Duración master: 30 s  
Formato base: 16:9 horizontal, responsive-safe para móvil  
Estado: FROZEN V3 · implementation-ready  
Dependencia pendiente: capturas QA M05–M09  

## Principios congelados

- 35% atmósfera cinematográfica / 65% producto real.
- Nunca mostrar solución, rol privado, acusación resuelta ni datos de clientes.
- Los seis personajes reciben el mismo peso visual.
- Ningún personaje + escena + objeto debe formar una combinación que sugiera la solución.
- Las capturas de gameplay deben provenir de una partida QA, nunca de una partida real de cliente.
- No fabricar screenshots falsos. Si una captura falta, el beat queda pendiente.
- Movimiento premium: cámara lenta, profundidad y microparallax. Glitch solo como acento, no como lenguaje principal.
- Texto máximo por beat: 3–7 palabras principales.

---

## Beat 01 · 00:00–00:03.2 · LA NOCHE

**Visual master:** M01 · pasillo-acceso.jpg → apoyo estudio.jpg  
**Copy:** `UNA REUNIÓN.` → `UNA CAÍDA.`  
**Motion:** negro 200 ms → push-in 103%→109%; parallax leve; viñeta respirando; desenfoque de entrada 8 px→0.  
**Transición:** shutter/black dip 140 ms.  
**Audio:** room tone + golpe grave muy corto en 00:01.6.  
**Objetivo:** intriga inmediata sin explicar el crimen.

## Beat 02 · 00:03.2–00:06.7 · EL EXPEDIENTE

**Visual master:** M02 · montaje de escenas reales.  
**Secuencia:** sala → cocina → estudio → dormitorio → jardín → pasillo.  
**Copy:** `SEIS LUGARES. UNA MISMA NOCHE.`  
**Motion:** 0.45–0.6 s por imagen; Ken Burns alternado; match cuts por contraste de luces; ninguna escena >1.2 s.  
**Audio:** tic grave muy suave + textura documental.  
**Objetivo:** demostrar amplitud espacial real del caso.

## Beat 03 · 00:06.7–00:10.4 · TODOS ESTUVIERON AHÍ

**Visual master:** M03 · 6 retratos reales.  
**Copy:** `TODOS ESTUVIERON AHÍ.` / `NADIE CUENTA TODO.`  
**Motion:** mosaico 2×3; entrada secuencial cada 140 ms; microzoom idéntico en los seis; una sola luz barrida transversal.  
**Regla:** mismo tamaño, exposición, duración y jerarquía para todos los personajes.  
**Audio:** seis pequeños clicks de archivo / fotografía, muy contenidos.  
**Objetivo:** instalar sospecha sin sugerir culpable.

## Beat 04 · 00:10.4–00:13.8 · LAS PRUEBAS

**Visual master:** M04 · celular como hero neutral + llave/cuaderno/USB/arma/pañuelo como flashes equivalentes.  
**Copy:** `OBSERVÁ.` → `COMPARÁ.` → `DUDÁ.`  
**Motion:** macro pushes 106%→114%; wipe tipo dossier; 0.45–0.7 s por objeto; profundidad simulada.  
**Regla:** ningún objeto más de 0.9 s; pañuelo y arma nunca cierran el beat.  
**Audio:** papel, click digital y golpe percusivo seco.  
**Objetivo:** comunicar investigación física + digital.

## Beat 05 · 00:13.8–00:18.3 · ESTO ES EL JUEGO

**Visual master:** M09 lobby + M05 gameplay Etapa 1.  
**Estado:** CAPTURE_REQUIRED.  
**Copy:** `ENTRÁ AL CASO.` / `INVESTIGÁ EN EQUIPO.`  
**Motion:** lobby entra en perspectiva 3D leve y se endereza; corte por zoom al gameplay; cursor/controles no se animan falsamente.  
**Hold:** lobby 1.5 s; gameplay 3.0 s.  
**Audio:** subida de pulso + interfaz sutil.  
**Objetivo:** demostrar de forma inequívoca que es una experiencia jugable real.

## Beat 06 · 00:18.3–00:22.7 · CONECTÁ

**Visual master:** M06 theory board + evidencia pública visual.  
**Estado:** CAPTURE_REQUIRED.  
**Copy:** `CONECTÁ LAS PISTAS.`  
**Motion:** teoría completa visible 1.4 s; foco secuencial PERSONA → ESCENA → OBJETO → MOTIVO; evidencia aparece como capa documental lateral.  
**Regla:** selecciones neutras/vacías; ningún texto decisivo legible.  
**Audio:** 4 ticks sincronizados con los cuatro ejes.  
**Objetivo:** explicar la mecánica central sin tutorial.

## Beat 07 · 00:22.7–00:26.7 · LA INVESTIGACIÓN ESCALA

**Visual master:** M07 Stage1 → Stage2 → Stage3 + M08 acusación vacía.  
**Estado:** CAPTURE_REQUIRED.  
**Copy:** `CADA PISTA CAMBIA LA HISTORIA.` → `ACUSÁ.`  
**Motion:** Stage 1, 2 y 3 apiladas con push temporal; speed-ramp muy leve; caída a negro 100 ms antes de acusación; acusación aparece estable y silenciosa.  
**Duraciones:** etapas 0.75 s cada una; acusación 1.6 s.  
**Regla:** acusación vacía o QA neutral; jamás mostrar combinación correcta o resultado.  
**Audio:** crescendo corto → silencio de 180 ms → hit grave.  
**Objetivo:** clímax jugable.

## Beat 08 · 00:26.7–00:30.0 · REVELACIÓN DE MARCA

**Visual master:** M10 · estudio.jpg con montaje muy tenue de escenas/personajes detrás.  
**Copy principal:** `EXPEDIENTES`  
**Copy secundario:** `CASO 001 · LA ÚLTIMA REUNIÓN`  
**Tagline:** `INVESTIGÁ · ACUSÁ · RESOLVÉ`  
**CTA:** `ABRIR EXPEDIENTE`  
**Motion:** fondo 102%→106%; título aparece por tracking/opacity; sello CASO 001 entra con golpe seco; CTA aparece último.  
**Audio:** resolución tonal oscura, sin sensación de “victoria”.  
**Objetivo:** recordar marca + invitar a jugar.

---

# Motion Language V3

## Cámara
- Zooms máximos: +12% por plano.
- Paneos máximos: 5–8% del frame.
- Evitar sacudidas constantes.
- Parallax: solo escenas/objetos; nunca deformar rostros.

## Transiciones
1. Black dip 100–180 ms.
2. Match cut por encuadre/luz.
3. Dossier wipe / shutter ocasional.
4. Glitch máximo 80 ms y máximo 2 veces en toda la intro.
5. Nada de transiciones “plantilla” llamativas.

## Tipografía
- Identidad EXPEDIENTES: condensada/bold/forense.
- Texto narrativo: máximo 2 líneas.
- Tracking amplio en labels/documentos.
- Blanco hueso + rojo oscuro + dorado apagado existentes del juego.

## FX
- Film grain muy leve.
- Vignette leve.
- Bloom localizado en blancos/documentos.
- No humo gratuito ni partículas decorativas permanentes.

## Audio
- Base: ambience procedural o loop licenciado propio.
- Capas: low drone + room tone + papel/clicks + hits puntuales.
- Mezcla deberá soportar mute total sin perder comprensión.
- Botón `ACTIVAR AMBIENTE` se mantiene por políticas de autoplay móvil.

---

# Responsive / móvil

- Safe area central del 76% para textos esenciales.
- Retratos en móvil: 2×3 o carrusel cinematográfico sin recortar ojos/caras.
- Objetos: máximo 2 simultáneos en <460 px.
- Gameplay real: contain dentro de mock-frame mínimo, no “device mockup” artificial.
- Título final debe caber completo a 360×640 CSS px.
- Intro mantiene `SALTAR INTRO` visible y accesible.

---

# Capturas requeridas para liberar implementación

- `intro/captures/UI_LOBBY_QA.png`
- `intro/captures/UI_GAMEPLAY_STAGE1.png`
- `intro/captures/UI_STAGE1.png`
- `intro/captures/UI_STAGE2.png`
- `intro/captures/UI_STAGE3.png`
- `intro/captures/UI_THEORY_BOARD.png`
- `intro/captures/UI_ACCUSATION_EMPTY.png`

Estas capturas pueden solaparse si una misma toma cubre M05 y M07, pero los targets permanecen separados para edición.

# QA de aceptación

La V3 solo puede pasar a producción si:

- [ ] usa imágenes reales en al menos 6 de los 8 beats;
- [ ] contiene gameplay real visible durante al menos 8 s acumulados;
- [ ] no contiene spoilers;
- [ ] todos los personajes tienen peso visual equivalente;
- [ ] funciona en desktop y móvil vertical;
- [ ] puede saltarse;
- [ ] funciona sin audio;
- [ ] no altera el adapter P2 ni el flujo de acceso;
- [ ] no inicia ni modifica una partida real de cliente;
- [ ] mantiene tiempo total entre 28 y 32 s.

## Congelado

`TIMELINE_MOTION_V3` queda congelado como especificación oficial para P2.12D.16.6 — Intro Prototype V3.
