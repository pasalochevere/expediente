# PREVIEW REAL V2.1A — QA MATRIX + FIX LIST

Fecha: 2026-09-22

Baseline auditado:
- `portal-preview-real-v2.js` SHA `2a841b01c125300aaba7730c72fe7337f3e16194`
- `portal-preview-real-v2.css` SHA `d1457fc11ed01ed667781e889ddf645b39004972`
- loader V2 activo desde `c002-rc.js`

## Objetivo
Auditar PREVIEW REAL V2 antes del polish específico por producto. Mantener una galería comercial segura: sin ejecutar juegos, sin revelar consignas premium, sin habilitar descargas y sin alterar auth/licencias/backend.

## Escala
- P0 = bloquear antes de considerar V2.1 comercialmente cerrada.
- P1 = mejora de calidad importante.
- P2 = refinamiento.

## QA transversal

| ID | Área | Hallazgo | Prioridad | Fix | Criterio de aprobación |
|---|---|---|---|---|---|
| QA-01 | Mobile | No existe gesto swipe para cambiar slides; sólo botones y teclado. | P1 | Agregar touch/pointer swipe horizontal con umbral y sin interferir con scroll vertical. | En móvil se navega anterior/siguiente con swipe y flechas. |
| QA-02 | Assets | Cuando una imagen falla, el `<img>` se oculta y se agrega `assetFail`, pero no hay fallback visual explícito. | P0 | Crear estado de error con fallback de producto + texto “Vista no disponible”. Nunca dejar área vacía ni badge “IMAGEN REAL” engañoso. | Asset roto no produce pantalla negra/vacía. |
| QA-03 | Performance | Todas las imágenes principales se generan con `loading="eager"`. | P1 | Primer slide eager; slides siguientes lazy/preload progresivo. Thumbnails lazy. | Apertura rápida en 4G/móvil sin cargar toda la galería de golpe. |
| QA-04 | Accesibilidad | Al abrir se enfoca Cerrar, pero no se conserva/restaura el foco del botón que abrió la preview. No hay focus trap. | P1 | Guardar opener, trap Tab dentro del modal y devolver foco al cerrar. | Navegación completa por teclado sin escapar detrás del modal. |
| QA-05 | Mobile landscape | `min-height:390px` en <=620px puede forzar una galería demasiado alta en celulares apaisados/viewport corto. | P0 | Regla específica por `max-height` + landscape con stage 240–300px y footer compacto. | Preview usable en 360–430 px alto sin recortes ni CTA inaccesible. |
| QA-06 | Thumbnails | Slides `ui` usan thumbnail genérico oscuro, por lo que varias previews parecen iguales. | P1 | Generar miniatura específica por producto/slide o snapshot estilizado del mismo UI. | Cada thumb comunica qué slide abre. |
| QA-07 | Navegación | Flechas se renderizan siempre; no hay contador `1/4`. | P2 | Añadir contador accesible y ocultar navegación si sólo hay 1 slide. | Usuario entiende posición y cantidad de vistas. |
| QA-08 | Estado | No hay anuncio ARIA del cambio de slide. | P2 | `aria-live="polite"` para título/counter, `aria-current` en thumb activo. | Lectores de pantalla reciben el cambio de vista. |
| QA-09 | CTA | Para cualquier producto no vendible se usa genéricamente “YA COMPRÉ · ACTIVAR”. | P1 | CTA contextual por estado/producto: Comprar / Activar / Abrir desde Mi biblioteca / Consultar. | No aparece CTA incoherente para producto ya activo o no comercializable. |
| QA-10 | Copy | Badge global “PREVIEW REAL V2” es técnico/interno. | P1 | Mostrar “VISTA PREVIA” al usuario; conservar versión sólo en data/diagnóstico. | Cero nomenclatura interna en UI comercial. |
| QA-11 | Copy/Fidelidad | `IMAGEN REAL` y `INTERFAZ FIEL` son útiles, pero faltan `CAPTURA REAL`, `INTERFAZ DE MUESTRA` y `CONTENIDO PROTEGIDO` según el caso. | P1 | Etiqueta por tipo de slide, no sólo image/ui. | Etiqueta describe exactamente lo que el usuario ve. |
| QA-12 | Visual | Footer sticky + head sticky + modal scroll puede comprimir demasiado la zona útil en móvil. | P1 | En móvil: head compacto, footer seguro con safe-area, info plegable si hace falta. | Galería sigue siendo protagonista en 390x844 y 360x800. |

## QA por producto

| Producto | Estado | Hallazgo principal | Prioridad | Fix específico |
|---|---|---|---|---|
| Doble Intención | ÁMBAR | Slide 1 y 3 reutilizan exactamente `diIntro`; se percibe repetición. La interfaz es fiel pero aún algo “demo técnica”. | P0 | Crear tercer slide único: selector Chispa/Fuego/Dominio o ritual de entrada; pulir tipografía/editorial y reducir panel técnico. |
| Chévere Kids Matemática | VERDE/ÁMBAR | Buen uso de Bloqui e iconos reales. El 3er slide es sólo logo/mascota y aporta menos que una pantalla de progreso/recompensa. | P1 | Sustituir por slide de nivel/estrellas/feedback y mantener tono luminoso. |
| Verdad o Reto +800 | ROJO | Slide 1 y 3 repiten `megaModes`; los cuatro modos no tienen identidad visual suficiente entre sí. | P0 | Dar color/acento propio a Kids/General/Fiesta/Sin Filtro y crear 3er slide real de flujo torre/digital. |
| Torre de América | VERDE | Usa 4 assets reales; es la preview más fuerte. Riesgo: SVG `contain` puede dejar demasiado aire y hero puede dominar de más. | P1 | Ajustar focal/crop por slide, captions más cortos y revisar contraste en móvil. |
| Expedientes Caso 001 | VERDE/ÁMBAR | Usa 4 escenas reales y mantiene spoilers fuera. Falta narrativa de galería: todas son habitaciones con peso similar. | P1 | Orden “entrada → espacio → investigación → tensión”, oscurecer caption y validar cada asset contra spoiler list. |
| Expedientes Caso 002 | VERDE/ÁMBAR | Buen ancla 317 + Hotel Orfeo; los dos UI slides tienen mucho texto y estilos inline. | P1 | Convertir roles e hipótesis a componentes CSS propios, menos texto y más atmósfera. Mantener SIN SPOILERS persistente. |
| Víncores | ROJO/ÁMBAR | Slide 1 y 3 repiten `vincoresField`; la preview explica controles más que valor/uso humano. | P0 | 3er slide diferente: escena antes/después o bitácora; copy centrado en relaciones/emociones, no paneles. |
| Guía Interactiva de Tarot | ÁMBAR | Buena identidad oscura/dorada, pero cartas se representan con símbolos genéricos; puede sentirse mock conceptual. | P0 | Incorporar assets/capturas reales seguras de cartas/mesa si existen; si no, etiquetar explícitamente “INTERFAZ DE MUESTRA”. |
| Paper Squishy Factory | ROJO | Usa blobs genéricos; no transmite los personajes reales ni las 5 colecciones. Slide 1 y 3 repiten biblioteca. | P0 | Reemplazar por personajes/thumbnails reales seguros del repositorio, más editor real/fiel. Nunca exponer plantillas imprimibles descargables. |

## FIX LIST ordenada

### P0 — ejecutar primero
1. `QA-02` fallback de assets rotos.
2. `QA-05` landscape/móvil corto.
3. Doble Intención: eliminar slide duplicado.
4. Verdad o Reto +800: eliminar slide duplicado + diferenciar 4 modos.
5. Víncores: eliminar slide duplicado + enfoque humano.
6. Tarot: reducir sensación de mock genérico con assets seguros o etiquetado correcto.
7. Paper Squishy: reemplazar blobs genéricos por material visual real seguro.

### P1 — siguiente pasada
1. Swipe móvil.
2. Lazy/preload progresivo.
3. Focus trap + restore.
4. Thumbnails específicos.
5. CTA contextual.
6. Etiquetas comerciales exactas.
7. Pulido de Caso 001, Caso 002, Kids y Torre América.
8. Compactar head/footer móvil.

### P2 — cierre
1. Contador `1/N`.
2. `aria-live` + `aria-current`.
3. Microtransiciones y polish fino de captions.

## Matriz mínima de dispositivos

- Desktop: 1366x768, 1920x1080.
- Tablet: 768x1024 y 1024x768.
- Mobile portrait: 360x800, 390x844, 430x932.
- Mobile landscape corto: 800x360, 844x390.
- Reduced motion activado.

## Checklist por preview

- [ ] Abre desde `VER EXPERIENCIA`.
- [ ] No ejecuta el juego.
- [ ] No expone consignas/pistas/interpretaciones premium.
- [ ] No habilita descarga protegida.
- [ ] Imagen/slide correcto y sin deformación.
- [ ] Flechas, thumbs y teclado funcionan.
- [ ] Swipe funciona en móvil (pendiente V2.1B).
- [ ] CTA correcto para el estado del producto.
- [ ] Precio correcto o texto neutral si no hay venta.
- [ ] Cierra con X, backdrop y Escape.
- [ ] Restaura scroll y foco.
- [ ] Sin overflow horizontal.
- [ ] Landscape corto usable.
- [ ] Etiqueta de fidelidad correcta.
- [ ] Copy corto y comercial.

## Gate de salida V2.1A
V2.1A queda cerrado cuando esta matriz existe y los P0 están definidos. La implementación comienza en V2.1B. No se cambia backend, auth, licencias, checkout ni storage en esta fase.
