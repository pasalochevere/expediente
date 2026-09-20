# C002 · HOTEL ORFEO — STYLE BIBLE V1

**Estado:** CANON VISUAL MAESTRO  
**Fase:** P2.2R.2 · Restauración estética C002  
**Alcance:** portada pública, prólogo, juego, eventos, fichas, documentos, kit imprimible y material comercial.  
**Regla:** el ENGINE P2 y el canon narrativo no se modifican desde esta guía.

---

## 1. Idea rectora

Hotel Orfeo no es una app oscura con detalles dorados. Es un **hotel detenido en el tiempo convertido en expediente de investigación**.

La experiencia debe mezclar tres capas sin que ninguna domine por completo:

1. **Cine de misterio:** oscuridad, lluvia, pasillos, contraluz, silencio, 03:17.
2. **Hotel decadente:** bronce viejo, madera oscura, papel crema, terciopelo vino, señalética clásica.
3. **Archivo confidencial:** fotografías, planos, cintas, informes, sellos, fichas y anotaciones.

Palabras guía: **lujo muerto · tormenta · archivo · secreto · bronce · habitación imposible · 03:17**.

---

## 2. Símbolos maestros

### HABITACIÓN 317
Es el símbolo principal del caso. No se usa como decoración repetida en todas las imágenes. Debe aparecer cuando aporta tensión narrativa: portada, acceso bloqueado, revelación y cierre.

### 03:17
Es un marcador temporal, no un logo. Se reserva para reloj detenido, apagón, documentos técnicos, cinta/registro y momentos de revelación.

### HOTEL ORFEO
Debe sentirse como un lugar real. Cada locación necesita identidad propia. Queda prohibido representar Vestíbulo, Salón de baile, Archivo, 216, Máquinas y Pasillo con la misma puerta 317.

---

## 3. Paleta canónica

| Token | Hex | Uso |
|---|---|---|
| Orfeo Black | `#070707` | fondos profundos, blackout |
| Charcoal | `#090A0B` | fondo general |
| Night | `#12100E` | paneles y marcos |
| Panel | `#191511` | tarjetas y superficies secundarias |
| Ink | `#F0E6D6` | texto principal sobre oscuro |
| Paper | `#D8C3A5` | documentos y fichas físicas |
| Muted | `#B7A995` | metadatos y texto secundario |
| Old Gold | `#A37A48` | filetes, placas y acentos |
| Brass Light | `#C79A5D` | acento premium puntual |
| Wine | `#7E2E2E` | peligro, sellos, conflicto |
| Wine Bright | `#A54A3F` | llamados y sellos fuertes |
| Storm | `#4E555E` | lluvia, metal, noche exterior |
| Line | `#4C3A2A` | bordes discretos |

**Prohibido:** dorado saturado tipo casino, negro puro plano como única textura, rojo brillante de interfaz gamer, gradientes azules genéricos.

---

## 4. Tipografía

- **Títulos narrativos / nombres / documentos:** Georgia o Times New Roman. Deben sentirse editoriales, no corporativos.
- **UI / botones / etiquetas / navegación:** Inter o system sans.
- **Hora, códigos de sala, registros técnicos:** monoespaciada.
- **Jerarquía:** título grande serif + etiqueta pequeña sans espaciada.

Evitar Impact, neon, tipografías sci-fi y exceso de mayúsculas en párrafos.

---

## 5. Fotografía e ilustración

### Regla de oro
Una evidencia debe parecer **algo encontrado**, no un ícono que representa algo encontrado.

**Correcto:** cassette fotografiado/escaneado sobre mesa de archivo, etiqueta manuscrita, desgaste, sombra, número de evidencia.  
**Incorrecto:** rectángulo negro + dos círculos dorados + texto “Cinta de casete”.

### Tratamiento
- baja saturación;
- contraste medio/alto;
- sombras profundas;
- temperatura cálida en interiores y fría/neutral en tormenta;
- grano fino y viñeta moderada;
- ninguna imagen stock brillante o contemporánea;
- evitar collage artificial de muchos objetos.

---

## 6. Biblioteca visual obligatoria

El master final debe disponer de activos diferenciados para:

### Portada y atmósfera
- `hero_hotel_orfeo`
- `door_317`
- `storm_exterior`
- `corridor_317_reveal`

### 6 personas
- Alma Salvatierra
- Bruno Ferrer
- Celeste Vidal
- Damián Orsini
- Eva Montenegro
- Franco Valdés

Cada retrato: busto o medio cuerpo, fondo del hotel coherente, iluminación noir, vestuario atemporal de fines de los 90 / clásico.

### 6 lugares
- Vestíbulo
- Salón de baile
- Archivo subterráneo
- Habitación 216
- Sala de máquinas
- Pasillo del tercer piso

Cada lugar debe ser visualmente reconocible sin leer el título.

### 6 objetos
- Llave 317
- Reloj detenido
- Cinta de casete
- Plano quemado
- Cámara Polaroid
- Medallón de plata

Cada objeto debe tener una “foto de evidencia” individual, no pictograma.

### Documentos / eventos mayores
- Registro histórico / recepción
- Plano arquitectónico
- Transcripción de cinta
- Informe de apagón 03:17
- Polaroid
- Caja de León / inventario
- Ficha Habitación 317

---

## 7. Sistema de superficies

### A. Cine / pantalla
Negro carbón, imagen grande, degradado lateral, título serif, muy poco texto. Se usa en portada, prólogo y grandes revelaciones.

### B. Panel de investigación
Oscuro, borde marrón/bronce discreto, radios moderados. Es UI funcional; no debe parecer SaaS ni dashboard corporativo.

### C. Documento físico
Papel crema/sepia, tinta oscura, sello vino, manchas sutiles, tipografía editorial. Se usa para evidencias y kit imprimible.

### D. Evidencia fotográfica
Imagen dominante + etiqueta de archivo + metadata breve. El objeto o lugar ocupa al menos 60% de la pieza.

---

## 8. Componentes maestros

### Portada
Debe incluir: EXPEDIENTES · CASO 002, LA HABITACIÓN QUE NO EXISTE, HOTEL ORFEO, frase breve, acceso principal y presencia visual de 317. Nunca un spinner como protagonista.

### Tarjeta de personaje
Retrato dominante, nombre serif, rol pequeño, código P01–P06, frase breve. No usar avatar con iniciales si existe el retrato.

### Tarjeta de evidencia
Fotografía o reproducción del documento primero. Código y título después. Máximo 2 líneas descriptivas.

### Documento
Número de archivo, fecha/hora, sello o firma cuando corresponde, zonas de desgaste y marcas de manejo. Debe poder imprimirse y recortarse sin perder credibilidad.

### 317
Debe sentirse distinta al resto: más oscura, más silenciosa, menos UI visible.

---

## 9. Movimiento y sonido

- transiciones lentas de 180–450 ms;
- flicker sólo en blackout/tormenta;
- lluvia y ambiente como capa, nunca ruido constante invasivo;
- 03:17 puede tener pulso/latido visual puntual;
- prohibido animar todos los paneles o usar efectos “arcade”.

---

## 10. Impresión

El kit imprimible debe sentirse como material retirado del juego y puesto sobre una mesa.

- A4 real;
- márgenes seguros 12–15 mm;
- versión color y B/N compatibles;
- fotos convertibles a alto contraste sin perder lectura;
- sellos y filetes siguen legibles en gris;
- recortables con líneas discretas, no marcos de app;
- ninguna página de evidencia puede resolverse sólo con pictogramas lineales.

---

## 11. Contrato de integración con ENGINE P2

La restauración visual **no** puede cambiar:

- IDs de personas/lugares/objetos;
- eventos P2;
- room/session/recovery;
- licencias;
- solución generada;
- flujo multiplayer;
- reglas de Habitación 317;
- canon narrativo.

La UI consume estado del motor; el motor no conoce la presentación visual.

---

## 12. Prohibiciones de regresión

1. No reemplazar imágenes por íconos por “facilidad de implementación”.
2. No usar el mismo SVG 317 para personajes, lugares y objetos.
3. No introducir etiquetas internas como BETA, P1.x, P2.x o RANDOM en la experiencia del cliente.
4. No convertir el juego en un dashboard azul/gris genérico.
5. No fabricar imprimibles con estética distinta al juego.
6. No modificar esta Style Bible indirectamente al trabajar backend.

---

## 13. Release Gate Visual C002

Una build comercial pasa QA sólo si:

- [ ] Portada reconocible como Hotel Orfeo antes de leer el título.
- [ ] Las 6 personas tienen retratos diferenciados.
- [ ] Los 6 lugares son visualmente distintos.
- [ ] Los 6 objetos son evidencias visuales, no pictogramas.
- [ ] El prólogo y el juego comparten paleta/tipografía.
- [ ] El kit parece provenir del mismo universo visual.
- [ ] 317 se reserva para momentos narrativos clave.
- [ ] No hay etiquetas técnicas visibles al comprador.
- [ ] Mobile mantiene atmósfera y legibilidad.
- [ ] ENGINE P2 pasa QA sin cambios funcionales.

**Regla de cierre:** si una pantalla podría pertenecer a cualquier otro juego cambiando sólo el título, todavía no es Hotel Orfeo.
