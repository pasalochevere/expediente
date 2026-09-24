# PORTAL V5.5 — QA INTEGRAL + CLEANUP DE LEGACY

Fecha: 2026-09-24

## Objetivo
Consolidar el Portal V5 sin reescribir las capas estables que todavía son dependencias reales. La limpieza de V5.5 retira del runtime la Home/Discovery V4.2 y su tuning V4.2.1, mantiene V3/V4/V4.1 donde siguen aportando cards, covers, biblioteca y previews, y agrega un firewall de compatibilidad para sesiones con caché anterior.

## Regla de seguridad
- No tocar auth, Supabase, licencias, checkout, storage ni rutas de producto.
- No borrar archivos legacy todavía: se retiran del runtime y quedan disponibles como rollback/histórico.
- No reemplazar V4/V4.1 de forma masiva: V5 todavía consume parte de su DOM y comportamiento.
- Cualquier limpieza destructiva queda para una futura refactorización V6 después de QA visual real.

## Inventario de runtime

| Capa | Estado V5.5 | Motivo |
|---|---|---|
| V3 / base estable | KEEP | Base funcional cargada por snapshot estable. |
| V4 Premium | KEEP | Crea navegación base, covers y elementos usados por V5. |
| V4.1A Smart Cards | KEEP | Estructura de biblioteca y estados. |
| V4.1B Product Mapping | KEEP | Nombres comerciales y metadata. |
| V4.1C Covers | KEEP | Visuales reutilizados por Home/Biblioteca. |
| V4.1D Payment/Trust | KEEP | Integración visual/comercial existente. |
| V4.1E Library Experience | KEEP | Filtros, recents y experiencia de biblioteca. |
| V4.1E.2 Reconcile | KEEP | Canonicalización Kids y compactación. |
| V4.1E.3 Quick Access | KEEP | Acceso rápido reciente/activo. |
| Preview Real V2/V2.1B/V2.1C | KEEP | Galería y UX de previews. |
| Home Discovery V4.2 | RETIRE RUNTIME | Reemplazada por V5.1 Clean Home. |
| Home Tuning V4.2.1 | RETIRE RUNTIME | Ajustaba una Home que ya no debe ejecutarse. |
| V5.0 Access Gate | KEEP | Entrada y sesión. |
| V5.1 Clean Home | KEEP | Home y switching de vistas. |
| V5.2 Category Experience | KEEP | Explorar por familias. |
| V5.3 Account Center | KEEP | Cuenta, códigos, dispositivos y logout. |
| V5.4 Nav + Mobile | KEEP | Navegación final desktop/mobile. |
| V5.5 Legacy Cleanup | NEW | Firewall, auditoría y retiro controlado de V4.2/V4.2.1. |

## QA funcional

### Acceso / sesión
- [ ] Usuario sin sesión: Access Gate visible y Portal protegido.
- [ ] Magic link/callback vuelve al Portal correctamente.
- [ ] Sesión existente no vuelve a pedir login innecesariamente.
- [ ] Cerrar sesión desde Mi cuenta limpia sesión y vuelve al ingreso.
- [ ] FAMILIA30 sigue usando el flujo de activación existente.

### Navegación V5
- [ ] Desktop: Inicio · Mi biblioteca · Explorar · Mi cuenta.
- [ ] Mobile: barra inferior con 4 destinos y safe-area.
- [ ] Sólo un destino aparece activo a la vez.
- [ ] El estado activo responde a `data-pc-v5-view`, no al scroll legacy.
- [ ] La barra mobile se oculta en Access Gate y modal de categorías.
- [ ] Volver a Inicio desde Biblioteca/Explorar/Cuenta conserva navegación coherente.

### Home
- [ ] Existe una sola `.pcV51Home` visible.
- [ ] No existe `.pcV42Home` visible ni recreándose.
- [ ] Sólo existe un `#inicio` y pertenece a V5.1.
- [ ] Continuar/Abrir apunta a una experiencia realmente disponible.
- [ ] Accesos activos/pending se representan sin duplicados Kids.

### Biblioteca
- [ ] Cards inteligentes mantienen estado ACTIVO/POR ACTIVAR/VENCIDO.
- [ ] Quick Access muestra hasta 3 accesos: recientes primero, activos como fallback.
- [ ] Chévere Kids se muestra como una experiencia canónica, no tres variantes simultáneas.
- [ ] Filtros/búsqueda/recientes siguen funcionando.
- [ ] No hay secciones gigantes vacías ni duplicación de títulos en covers.

### Explorar / categorías
- [ ] Sólo se ven las categorías hasta que se abre una familia.
- [ ] Desktop: modal amplio, scroll interno controlado.
- [ ] Mobile: categoría a pantalla completa.
- [ ] Escape, X y backdrop cierran correctamente donde corresponde.
- [ ] Focus trap/restauración de foco funcionan.
- [ ] Landscape corto sigue siendo usable.

### Preview Real
- [ ] Abrir/cerrar preview no ejecuta el juego.
- [ ] Swipe funciona en mobile.
- [ ] Flechas, thumbs y teclado cambian slide.
- [ ] Contador y `aria-current` reflejan slide actual.
- [ ] Lazy/preload no bloquea apertura.
- [ ] Fallback de asset roto evita áreas vacías.
- [ ] Labels distinguen imagen real, interfaz de muestra y muestra segura.
- [ ] Caso001/Caso002 permanecen sin spoilers.
- [ ] Paper Squishy no expone imprimibles protegidos.

### Mi cuenta
- [ ] Correo de sesión visible.
- [ ] Totales activo/por activar/accesos coherentes.
- [ ] Copiar código funciona.
- [ ] Gestión de dispositivos abre el flujo existente.
- [ ] Activar acceso pendiente funciona con el flujo existente.
- [ ] Activar código nuevo sigue usando el backend existente.
- [ ] Cerrar sesión funciona.

### Productos / rutas a comprobar
- [ ] Doble Intención.
- [ ] Torre de América.
- [ ] Verdad o Reto +800.
- [ ] Chévere Kids Matemática.
- [ ] EXPEDIENTES Caso 001.
- [ ] EXPEDIENTES Caso 002.
- [ ] Guía Interactiva de Tarot.
- [ ] Víncores Digital.
- [ ] Paper Squishy Factory.
- [ ] Quimera cuando esté expuesta en catálogo/biblioteca.

## QA responsive mínimo
- Desktop: 1366×768 y 1920×1080.
- Tablet: 768×1024 y 1024×768.
- Mobile portrait: 360×800, 390×844 y 430×932.
- Mobile landscape: 800×360 y 844×390.
- `prefers-reduced-motion: reduce` activado.

## Auditoría runtime V5.5
V5.5 expone `window.pcPortalV55Audit()` para inspección manual. Debe devolver:
- `ready: true`
- `legacyHomeCount: 0`
- `topNavCount: 1`
- `bottomNavCount: 1`
- `inicioCount: 1`
- flags V5 de gate/home/categories/account/nav cargados

Si una sesión antigua ya había cargado V4.2 antes de recibir V5.5, el firewall deshabilita sus hojas de estilo legacy, elimina la Home V4.2 residual y normaliza `#inicio`. Los scripts ya ejecutados no se eliminan a ciegas porque sus listeners no pueden desregistrarse de forma segura; el loader V5.5 evita que vuelvan a cargarse en sesiones nuevas.

## Limitaciones de esta pasada
- El QA de código y arquitectura puede cerrarse desde repositorio.
- El QA visual autenticado completo requiere recorrer el Portal con una sesión real en desktop y mobile.
- El backend productivo de licencias no se modifica ni se considera auditado por esta limpieza.

## Gate de salida V5.5
1. Loader ya no solicita `portal-home-discovery-v42.js/css` ni `portal-home-tuning-v421.js/css`.
2. V5.1–V5.5 cargan desde un único bridge V5.
3. V4/V4.1 permanecen donde son dependencias conocidas.
4. `pcPortalV55Audit()` no informa Home legacy ni IDs `inicio` duplicados.
5. Pages despliega el commit final correctamente.
6. Pase manual final en PC + celular antes de considerar V5.5 congelada.
