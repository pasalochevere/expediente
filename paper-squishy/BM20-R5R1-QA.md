# BM20-R5R1 — Auditoría visual y funcional de Butter Mania R5

**Fecha:** 2026-11-08  
**Entorno:** Chromium automatizado / GitHub Actions sobre copia local del repositorio.  
**Fuente auditada:** `paper-squishy/factory-butter-native-r5.html` en `main`.  
**Ejecución final:** https://github.com/pasalochevere/expediente/actions/runs/42529976663  
**Resultado:** **13 PASS / 0 FAIL**.

## Resultados confirmados

| Prueba | Estado |
| --- | --- |
| Inicialización, 20 personajes, 9 pestañas, 320 px | PASS |
| Sin errores HTTP o JavaScript, 320 px | PASS |
| Inicialización y sin desbordamiento, 390 px | PASS |
| Filtros: Mantecas 8, Quesitos 5, Cremitas 7, Todos 20 | PASS |
| Clic real en cada uno de los 20 personajes en móvil | PASS |
| 80 vistas básicas: frente/dorso color y B/N | PASS |
| Carga de 12 archivos ZIP / 180 recursos WebP | PASS |
| 180 combinaciones personaje-vista, sin imágenes rotas | PASS |
| Sin errores HTTP o JavaScript, 390 px | PASS |
| Inicialización y sin desbordamiento, 768 px | PASS |
| Sin errores HTTP o JavaScript, 768 px | PASS |
| Inicialización y sin desbordamiento, 1280 px | PASS |
| Sin errores HTTP o JavaScript, 1280 px | PASS |

Se inspeccionó `naturalWidth/naturalHeight` en todos los recursos seleccionados: ancho mínimo 540 px, máximo 1055 px; alto mínimo 540 px, máximo 1491 px. Las vistas ampliadas se sirvieron como `blob:` procedentes de ZIP; no hubo fallback en estas pruebas.

**Evidencia guardada:** artifact `bm20-r5r1-browser-evidence`, con informe JSON y capturas a 320, 390, 768 y 1280 px.

## Hallazgos y límites

1. La página R5 es una galería independiente, **no la integración a Creator Plus**.
2. R5 inicia `loadExtra()` al mostrar la vista inicial `hero`, por lo que intenta traer los 12 ZIP ampliados sin esperar a que el usuario seleccione vistas avanzadas. **Oportunidad de optimización** para redes lentas; no falla en el entorno de CI.
3. Las vistas son **previsualizaciones**, no prueba de calidad de impresión o de escala exacta. Quedan sin certificación visual artística: simetría de contornos, espejo del dorso, líneas CUT, legibilidad de fichas, colorimetría, resolución de PDFs A4, márgenes y armado físico.
4. La cobertura se hizo en Chromium local con cuatro anchos. **No** certifica Safari, Firefox, navegadores móviles físicos, la versión alojada en GitHub Pages ni el rendimiento bajo conexión lenta.
5. La primera corrida tuvo una aserción incorrecta que exigía `data:image/` en recursos que la página ya había actualizado a `blob:`. Se corrigió **el test**, no el producto.
6. Una corrida de clics mostró una condición de sincronización entre cambio de personaje y decodificación de imagen; con espera explícita la secuencia de 20 clics finalizó correctamente. No se confirmó un defecto funcional en R5.

## Estado y decisión

**BM20-R5R1: QA técnica en navegador APROBADA dentro de su alcance.**  
**Aprobación visual comercial / impresión física: PENDIENTE.**

No se modificó `factory-butter-native-r5.html`, `factory.html`, `psq-butter-native-r5.js`, el portal de licencias ni la fábrica estable. No se activó la venta.

### Próximo hito sugerido

**BM20-R5R2 — Revisión visual premium y de producción**, con inspección artística 1:1 de frentes, dorsos y B/N, comprobación de CUT exterior, espejado, escala A4 real, contraste y prueba de impresión. Después, **R5R3 — Integración protegida a Creator Plus**.
