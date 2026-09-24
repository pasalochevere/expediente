# PORTAL V5.6 — QA VISUAL REAL + PERFORMANCE + BOOTSTRAP CONSOLIDATION

Fecha: 2026-09-24

## Objetivo
Cerrar la generación V5 del Portal con una pasada conservadora de QA visual, mejoras de performance de arranque y un bootstrap único para V5.0→V5.5. No se modifica backend, auth, licencias, checkout, storage ni rutas de producto.

## Cambios estructurales

### Bootstrap V5.6
`portal-v5-bootstrap-v56.js` pasa a ser el único cargador de las capas V5:

1. V5.0 Access Gate.
2. V5.1 Clean Home.
3. V5.2 Category Experience.
4. V5.3 Account Center.
5. V5.4 Nav + Mobile.
6. V5.5 Legacy Cleanup.
7. V5.6 Visual QA stylesheet.

Los CSS se solicitan en paralelo y los JS se cargan en orden determinista. El loader principal deja de encadenar V5 mediante `portal-home-discovery-v42-bridge.js`.

### Compatibilidad
Se conservan V3/V4/V4.1, Reconcile, Quick Access y Preview Real porque siguen siendo dependencias funcionales. El bridge V4.2 queda en el repositorio sólo como histórico/rollback, no como dependencia del loader V5.6.

## QA visual aplicado por código

- Prevención de overflow horizontal a nivel documento.
- `min-width:0` en grids, cards, paneles, modal y columnas susceptibles de desbordar.
- Imágenes limitadas al ancho disponible.
- Blancos táctiles mínimos de 44 px para CTAs principales.
- `touch-action: manipulation` en controles interactivos.
- Foco visible consistente para teclado.
- `overflow-wrap:anywhere` en correo, códigos y textos largos.
- Modal de categorías ajustado a `dvh` en mobile y landscape corto.
- Safe-area mobile preservada por V5.4.
- Ajuste extra para 390 px o menos en acciones de Mi cuenta.
- Landscape corto: Home, Cuenta y categoría más compactos.
- `prefers-reduced-motion` desactiva transiciones/animaciones no esenciales.
- Contención de layout/paint en cards móviles seleccionadas para reducir trabajo de render.

## Performance / bootstrap

### Antes de V5.6
El loader invocaba repetidamente `ensureV5Bridge()` / `ensureV55()` desde Quick Access, Preview V2.1B, Preview V2.1C, arranque y reintentos. A su vez el bridge era responsable de encadenar V5.0→V5.5.

### V5.6
- Una sola entrada: `ensureV56()`.
- Un solo archivo decide el orden V5.
- CSS V5 precargados al comienzo del bootstrap.
- JS V5 cargados una sola vez mediante IDs estables.
- Se elimina del camino normal el bridge cuyo nombre todavía refería a V4.2.
- Se mantiene el sistema de observers propio de cada módulo por compatibilidad; no se reemplaza en esta fase para evitar una regresión de sesión/navegación.

## Auditoría runtime
V5.6 expone:

```js
pcPortalV56Audit()
```

Criterio esperado con usuario dentro del Portal:

- `version: "5.6"`
- `ready: true`
- `bootstrap: "v56"`
- `errors: []`
- `dom.homes: 1`
- `dom.legacyHomes: 0`
- `dom.inicio: 1`
- `dom.topNav: 1`
- `dom.bottomNav: 1`
- `dom.categoryModals: 1`
- `dom.accountSections: 1`
- módulos gate/home/categories/account/nav/cleanup en `true`

También se conserva:

```js
pcPortalV55Audit()
```

para comprobar específicamente residuos legacy.

## Matriz QA funcional

### Access Gate
- [ ] Sin sesión: gate visible, Portal no visible.
- [ ] Correo válido envía magic link.
- [ ] Callback vuelve al Portal sin dejar tokens visibles en URL.
- [ ] Cuenta con accesos entra sin solicitar código nuevo.
- [ ] Cuenta sin accesos pide activación.
- [ ] FAMILIA30 conserva su flujo especial.

### Inicio
- [ ] Existe una sola Home V5.1.
- [ ] Continuar/Abrir apunta a un acceso real.
- [ ] Mi biblioteca abre sólo la vista Biblioteca.
- [ ] Explorar abre sólo la vista Explorar.
- [ ] No aparece Home V4.2 ni Discovery V4.2.

### Biblioteca
- [ ] Smart Cards muestran estado correcto.
- [ ] Reconcile no duplica Chévere Kids.
- [ ] Quick Access conserva recientes + activos fallback.
- [ ] Filtros y recents funcionan.
- [ ] No existe overflow horizontal a 360 px.

### Explorar
- [ ] Cinco categorías visibles en desktop.
- [ ] Categorías apilan correctamente en mobile.
- [ ] Modal desktop no supera viewport útil.
- [ ] Mobile usa pantalla completa.
- [ ] Escape, X y backdrop funcionan.
- [ ] Focus trap/restauración de foco siguen activos.
- [ ] Landscape 800×360 y 844×390 conserva cierre y scroll.

### Mi cuenta
- [ ] Correo largo no rompe layout.
- [ ] Stats no desbordan en 360/390 px.
- [ ] Código largo envuelve sin ampliar página.
- [ ] Copiar código funciona.
- [ ] Dispositivos funciona.
- [ ] Activar pendiente funciona.
- [ ] Activar código nuevo funciona.
- [ ] Logout vuelve al gate.

### Preview
- [ ] Abrir/cerrar no altera la vista V5 activa.
- [ ] Swipe móvil funciona.
- [ ] Flechas/teclado/thumbs funcionan.
- [ ] Foco vuelve al CTA que abrió la preview.
- [ ] Landscape corto conserva CTA visible.
- [ ] No se exponen assets premium/imprimibles protegidos.

## Matriz visual mínima

- Desktop: 1366×768.
- Desktop grande: 1920×1080.
- Tablet portrait: 768×1024.
- Tablet landscape: 1024×768.
- Mobile: 360×800.
- Mobile: 390×844.
- Mobile: 430×932.
- Mobile landscape: 800×360.
- Mobile landscape: 844×390.
- Reduced motion activado.

## Performance a observar en QA manual

- Gate debe aparecer sin esperar que toda la biblioteca termine de renderizar.
- No debe existir flash de Home V4.2 antes de V5.1.
- Navegación no debe duplicarse después de varios cambios de vista.
- Abrir/cerrar categorías repetidamente no debe multiplicar modales.
- Cambiar Home/Biblioteca/Explorar/Cuenta repetidamente no debe crear secciones duplicadas.
- `pcPortalV56Audit().bootMs` sirve como referencia del tiempo de carga de módulos V5 en ese dispositivo; no es una métrica de red completa ni reemplaza Lighthouse/DevTools.

## Gate de salida V5.6

1. `c002-rc.js` carga `portal-v5-bootstrap-v56.js` y ya no carga el bridge V4.2.
2. Bootstrap V5.6 carga V5.0→V5.5 una sola vez y en orden.
3. V5.6 visual CSS está activo.
4. `pcPortalV56Audit()` devuelve estructura única y sin errores.
5. `pcPortalV55Audit()` no detecta Home V4.2 residual.
6. GitHub Pages despliega el commit final correctamente.
7. Pase visual autenticado en PC + celular antes de congelar definitivamente V5.6.

## Nota de alcance
El QA de repositorio, arquitectura, CSS y bootstrap queda cubierto por esta fase. La confirmación visual autenticada completa requiere abrir una sesión real del Portal en navegador desktop y mobile; no se considera reemplazada por una revisión estática del código.
