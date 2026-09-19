# EXPEDIENTES · CASO 001 · ESTÁNDAR MAESTRO DE IMPRIMIBLES P2

Versión: 1.0.0
Estado: CONGELADO PARA IMPLEMENTACIÓN P2.11F

## 1. Fuente de verdad

Los imprimibles no constituyen una base narrativa separada.

Fuentes canónicas:

- `../manifest.json`
- `../packs/C001-XX.json`
- estado de sala P2 server-side

Todo texto específico de una evidencia debe derivar de `evidence.text` o, cuando corresponda, `npcFallback`.

## 2. Kit Base · 8 páginas

Orden oficial:

1. `BASE-01` · Expediente / prólogo
2. `BASE-02` · Personas
3. `BASE-03` · Escenas
4. `BASE-04` · Objetos
5. `BASE-05` · Hoja de investigación
6. `BASE-06` · Línea de tiempo
7. `BASE-07` · Mapa de relaciones
8. `BASE-08` · Acusación final

### BASE-01 · Expediente / prólogo

Debe:
- identificar `CASO 001 · LA ÚLTIMA REUNIÓN`;
- contener un prólogo común sin resolver ningún Crime Pack;
- explicar que la información aparecerá por etapas;
- evitar nombres de culpable, escena verdadera u objeto verdadero.

### BASE-02 · Personas

Seis fichas:
- P1 · SANTIAGO
- P2 · CLARA
- P3 · VERA
- P4 · MATEO
- P5 · INES
- P6 · TOMAS

El código P1–P6 es visual. El ID lógico sigue siendo el string canónico.

### BASE-03 · Escenas

- L1 · Sala de estar
- L2 · Cocina
- L3 · Estudio
- L4 · Dormitorio
- L5 · Jardín / exterior
- L6 · Pasillo / acceso

En P2 el término recomendado en instrucciones es **Escena**, no `Lugar`, porque el espacio puede ser parte de una secuencia y no solo el sitio final.

### BASE-04 · Objetos

- O1 · Arma
- O2 · Cuaderno
- O3 · Celular
- O4 · Llave
- O5 · Memoria USB
- O6 · Pañuelo

`O1 · Arma` es una categoría visible genérica; un pack puede concretarla como un objeto específico.

### BASE-05 · Hoja de investigación

Debe incluir:
- PERSONA;
- ESCENA;
- OBJETO;
- MOTIVO;
- HECHOS CONFIRMADOS;
- CONTRADICCIONES;
- COARTADAS;
- TESTIMONIOS;
- HIPÓTESIS;
- DESCARTES JUSTIFICADOS.

No usar Prometedora / Parcial / Débil.

### BASE-06 · Línea de tiempo

Formato libre de marcas horarias con:
- hora;
- evento;
- fuente;
- certeza;
- contradicción asociada.

Debe permitir anotar eventos fuera de un rango preimpreso si un pack lo requiere.

### BASE-07 · Mapa de relaciones

Centro: víctima / conflicto del caso.

Por personaje debe permitir anotar:
- vínculo;
- interés/motivo;
- conflicto;
- acceso;
- coartada;
- contradicción.

No debe sugerir visualmente quién es el responsable.

### BASE-08 · Acusación final

Campos obligatorios:
1. Persona responsable
2. Escena clave
3. Objeto clave
4. Motivo / hipótesis causal
5. Reconstrucción breve de los hechos

La hoja no incluye casillas de solución verdadera.

## 3. Evidencia dinámica

ID de salida recomendado:

`PRINT::<room_id>::<evidence_id>::<channel>`

Canales:
- `PUBLIC`
- `PRIVATE::<CHARACTER_ID>`
- `NPC`

La existencia de una representación imprimible nunca amplía permisos de lectura.

## 4. Plantillas visuales por tipo

### TEMPORAL
Documento tipo:
- bitácora;
- secuencia horaria;
- historial;
- cronología.

### TESTIMONIAL
Documento tipo:
- declaración;
- transcripción;
- entrevista.

Debe distinguir visualmente:
- `DECLARACIÓN PRIVADA` cuando pertenece a un humano;
- `DECLARACIÓN DE EXPEDIENTE · NPC` cuando proviene de `npcFallback`.

### PHYSICAL
Documento tipo:
- ficha pericial;
- evidencia material;
- laboratorio;
- descripción de objeto/rastro.

### DIGITAL
Documento tipo:
- captura;
- log;
- mensaje;
- audio/transcripción;
- dispositivo.

### ACCESS
Documento tipo:
- control de acceso;
- llave;
- puerta;
- registro de ingreso/salida.

### MOTIVATIONAL
Documento tipo:
- borrador;
- factura;
- contrato;
- correspondencia;
- nota contextual.

## 5. Metadatos de presentación opcionales

Cuando una evidencia necesite tratamiento visual especial, el pack podrá añadir más adelante un objeto de presentación que NO duplique la verdad narrativa:

```json
{
  "printSpec": {
    "template": "message|receipt|forensic|access_log|statement|timeline|generic",
    "title": "Título de artefacto",
    "visualCue": "indicación artística no narrativa"
  }
}
```

Reglas:
- `printSpec` no sustituye `text`;
- no puede introducir un hecho nuevo;
- no puede contener la solución;
- si se elimina `printSpec`, el caso sigue siendo jugable.

## 6. Liberación por etapa

Una evidencia es imprimible únicamente cuando el servidor ya la considera visible para ese usuario/sala.

- E1: `stage <= 1`
- E2: `stage <= 2`
- E3: `stage <= 3`

No se genera un PDF abierto con E1+E2+E3 al comienzo.

## 7. Privacidad

Para `public:false`:

### Personaje humano
Renderizar `evidence.text` únicamente para ese usuario/personaje.

### Personaje NPC
Renderizar `npcFallback` como documento de expediente público cuando la lógica del juego lo libere.

No mostrar ambos canales a la vez.

## 8. Reveal

Antes de `room.status = finished`, quedan fuera de toda salida imprimible de jugador:

- killer;
- truthSummary;
- criticalEvent de resolución;
- mechanism de resolución;
- postCrimeAction;
- centralLie atribuida;
- red herring resolution;
- epilogue.

Después del reveal se permite una página opcional `RESOLUTION-01` derivada del resultado real de la sala.

## 9. A4 y legibilidad

- 210 × 297 mm
- vertical por defecto
- margen seguro mínimo 10 mm
- objetivo 12 mm
- tipografía cuerpo 9.5 pt mínimo
- 300 dpi para raster preparado
- evitar fondos plenos negros en ECO
- evitar texto sobre fotografía sin caja de contraste
- ninguna instrucción depende solo del color

## 10. Tarjetas

Cuando se usen tarjetas individuales:

- objetivo: 6 por A4;
- grilla recomendada: 2 columnas × 3 filas;
- tamaño máximo objetivo por tarjeta: 63 × 88 mm;
- líneas de corte discretas;
- no exigir corte para poder jugar: la hoja completa también debe ser utilizable.

## 11. Versiones de salida

### COLOR
Mismo contenido, tratamiento visual completo.

### ECO_BW
Mismo contenido:
- blanco predominante;
- contraste alto;
- tramas/íconos además de color;
- imágenes optimizadas a escala de grises.

El contenido no se bifurca por versión.

## 12. Convención de archivo

Kit base:

`EXP-C001-BASE-v<version>-COLOR.pdf`
`EXP-C001-BASE-v<version>-ECO.pdf`

Evidencia dinámica individual:

`EXP-C001-<evidence_id>-<channel>.pdf`

Resolución post-reveal:

`EXP-C001-RESOLUCION-<room_code>.pdf`

Nunca incluir culpable/escena/objeto verdadero en el nombre del archivo.

## 13. QA obligatorio

### Narrativo
- coincide con JSON canónico;
- no añade hechos;
- no contradice digital;
- etapa correcta;
- canal correcto.

### Seguridad
- no filtra solución;
- no filtra etapa futura;
- no filtra evidencia privada de otro jugador;
- no revela `pack_payload` completo en el cliente.

### Impresión
- A4 sin clipping;
- legible en 100% de escala;
- ECO entendible sin color;
- caracteres acentuados correctos;
- no hay imágenes rotas;
- QR, si existiera, tiene fallback textual y no contiene secretos en la URL.

## 14. Regla de oro

> Si cambia una evidencia del Crime Pack, el imprimible debe cambiar automáticamente con ella. Si hay que corregir el mismo hecho en dos lugares distintos, el diseño está mal arquitectado.
