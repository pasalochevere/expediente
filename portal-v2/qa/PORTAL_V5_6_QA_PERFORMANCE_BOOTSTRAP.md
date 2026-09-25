# PORTAL V5.6.2 — QA + PERFORMANCE + STABILIZATION

Fecha: 2026-09-25

## Objetivo
Mantener la generación V5 del Portal sobre una base estable después del QA real de login y activación. No se modifica backend, licencias, checkout ni rutas de producto en esta fase.

## Runtime actual

`portal-v5-bootstrap-v56.js` es el cargador único de las capas V5 y se inicia sólo después de que la base estable del Portal terminó de cargar.

Orden actual:

1. V5.0 Access Gate.
2. V5.1 Clean Home.
3. V5.6.1 Activation Reliability Fix.
4. V5.2 Category Experience.
5. V5.3 Account Center.
6. V5.4 Nav + Mobile.
7. V5.5 Legacy Cleanup.
8. V5.6 Visual QA stylesheet.

Se conservan V3/V4/V4.1, Reconcile, Quick Access y Preview Real porque siguen siendo dependencias funcionales.

## Correcciones de estabilización V5.6.1 / V5.6.2

### Activación
- V5 no inicia antes que `callAccess`, `activateOwned`, `loadMyGames` y la base estable.
- Los accesos pendientes tienen un fallback directo a `activate_owned` mediante `portal-activation-fix-v561.js`.
- Inicio, Biblioteca y Mi Cuenta comparten la misma vía segura de activación.

### Access Gate
- Un fallo temporal de `action: me` ya no se interpreta como una cuenta sin juegos.
- Se reintenta automáticamente hasta 3 veces.
- Si el servicio sigue sin responder, la sesión se conserva y aparece un botón `REINTENTAR`; no se deriva al usuario incorrectamente a ingresar un código nuevo.
- El cooldown de magic link sólo comienza cuando el envío fue exitoso. Un error deja el botón disponible para volver a intentar.

### Mi Cuenta / Chévere Kids
- Se eliminan duplicados exactos por código.
- Las variantes de Matemática no se colapsan por defecto.
- Sólo se reduce al acceso canónico cuando conviven las tres variantes detectadas históricamente: canónica + física + digital.
- Dos variantes legítimamente compradas permanecen visibles.

### Categorías + Preview
- Cuando Preview Real está abierta encima de una categoría, `Escape` pertenece primero a Preview.
- Cerrar Preview ya no debe cerrar también la categoría que quedó debajo.

## Auditoría runtime

V5.6.2 expone:

```js
pcPortalV56Audit()
```

Criterio esperado con usuario dentro del Portal:

- `version: "5.6.2"`
- `ready: true`
- `bootstrap: "v56.2"`
- `errors: []`
- `activationFix: true`
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

para residuos legacy.

## Matriz QA funcional

### Access Gate
- [ ] Sin sesión: gate visible, Portal no visible.
- [ ] Correo válido envía magic link.
- [ ] Error de envío no inicia cooldown falso.
- [ ] Callback vuelve al Portal sin dejar tokens visibles en URL.
- [ ] Cuenta con accesos entra sin solicitar código nuevo.
- [ ] Fallo temporal de `action: me` reintenta y no pide código nuevo.
- [ ] Cuenta realmente sin accesos pide activación.
- [ ] FAMILIA30 conserva su flujo especial.

### Inicio
- [ ] Existe una sola Home V5.1.
- [ ] Continuar/Abrir apunta a un acceso real.
- [ ] Activar acceso pendiente funciona.
- [ ] Mi biblioteca abre sólo Biblioteca.
- [ ] Explorar abre sólo Explorar.

### Biblioteca
- [ ] Smart Cards muestran estado correcto.
- [ ] Activar pendiente funciona.
- [ ] Reconcile no duplica Chévere Kids.
- [ ] Quick Access conserva recientes + activos fallback.
- [ ] No existe overflow horizontal a 360 px.

### Explorar
- [ ] Cinco categorías visibles en desktop.
- [ ] Modal desktop no supera viewport útil.
- [ ] Mobile usa pantalla completa.
- [ ] X, backdrop y Escape funcionan.
- [ ] Preview abierta desde categoría: primer Escape cierra sólo Preview.
- [ ] Segundo Escape cierra categoría.
- [ ] Focus trap/restauración de foco siguen activos.

### Mi cuenta
- [ ] Correo largo no rompe layout.
- [ ] Dos variantes legítimas de Kids siguen visibles.
- [ ] Patrón de tres duplicados Kids se reconcilia al canónico.
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
- [ ] No se exponen assets premium/imprimibles protegidos.

## Visual mínimo

- Desktop 1366×768 y 1920×1080.
- Tablet 768×1024 y 1024×768.
- Mobile 360×800, 390×844 y 430×932.
- Landscape 800×360 y 844×390.
- Reduced motion activado.

## Gate de salida

1. Base estable carga antes del bootstrap V5.
2. `pcPortalV56Audit()` devuelve V5.6.2 sin errores.
3. Activación pendiente funciona desde Inicio, Biblioteca y Cuenta.
4. Login por magic link no entra en loop.
5. Error de red no se confunde con cuenta sin accesos.
6. Categoría y Preview manejan Escape por capas.
7. GitHub Pages despliega el commit final correctamente.
8. Pase autenticado PC + celular antes de congelar definitivamente esta generación.
