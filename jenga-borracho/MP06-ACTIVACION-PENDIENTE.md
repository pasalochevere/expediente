# MODO PREVIA · MP06 — Integración comercial (pendiente de backend)
Fecha: 2026-10-19

## Estado
- **Portal:** `/expediente/portal-v2/` — ficha en Pareja & Adultos y modal preview Party Pop publicados.
- **Juego:** `/expediente/jenga-borracho/` — identidad MODO PREVIA, 3 modos, 126 consignas originales intactas.
- **Precio propuesto:** ARS 14.999.
- **Código de producto propuesto:** `MP-001`. El Portal también reconoce `JB-BORRACHO` como código legado para el acceso desde Mi biblioteca.
- **Importante:** la venta de `MP-001` permanece deshabilitada hasta que el backend responda con `sales_enabled: true` y un precio válido.
- **El enlace directo al juego todavía es público. NO afirmar que el contenido tiene protección de licencia.**

## Supabase real del Portal
- Proyecto: `fzbndgfnqxcacsvlitui`
- El conector Supabase disponible en ChatGPT no tiene permisos para administrar ese proyecto.
- No realizar cambios en proyectos alternativos `pasalochevere-juegos` o `pasalochevere-gamefactory` como sustituto del backend del Portal.

## Flujo deseado
1. Usuario entra en Pareja & Adultos y abre la ficha de MODO PREVIA.
2. Explora el preview, ve precio (ARS 14.999), modalidades y descripción.
3. Elige **TENGO UN CÓDIGO · ACTIVAR**, que lo lleva al inicio de sesión y sección de activación existente del Portal.
4. Backend del Portal valida código de compra y asocia licencia del producto `MP-001` al usuario autenticado.
5. Se muestra la licencia en **Mis juegos** y el botón **JUGAR**.
6. El Portal valida registro de dispositivo con `pasalochevere-access` y redirige a `../jenga-borracho/?access=<codigo>&v=mp04`.
7. **Pendiente imprescindible:** el juego debe verificar autorización real y expiración al cargar, y no exponer todas las consignas al navegador sin validación. En GitHub Pages los archivos estáticos `data.js` y `app.js` son públicamente descargables; un simple bloqueo visual en JS no constituye protección comercial real.

## Para completar MP06, una vez concedido el acceso correcto
- Inspeccionar el esquema actual del producto, las tablas de códigos, licencias y dispositivos y las funciones existentes, sin asumir nombres ni columnas.
- Registrar `MP-001` con el nombre MODO PREVIA, precio `14999`, `game_url` de este repositorio, estado inicial de ventas deshabilitadas. Verificar vigencia y límite de dispositivos con el usuario antes de fijarlos.
- Adaptar `pasalochevere-access`, `pasalochevere-catalog` y checkout si fuera necesario, siguiendo sus contratos actuales.
- Proteger la entrega del contenido: idealmente suministrar consignas desde endpoint autenticado o por token de licencia y mover el banco sensible fuera del repositorio estático.
- Probar en un dispositivo de prueba real: email / enlace mágico → código de compra → licencia → Mis juegos → registro de dispositivo → acceso al contenido → reabrir → expirar/revocar → error visible.
- SOLO entonces habilitar `sales_enabled` y CTA comprar.

## Verificaciones locales ya realizadas
- Motor ruleta individual: 3 × 42 giros sin repetición.
- Motor ruleta completa: 126 giros, alineación puntero/sector verificada.
- Modo Torre y reanudación de partidas conservados.
- HTML y JS de Portal y Juego verificaron sintaxis; despliegue de Pages finalizó con SUCCESS.
- Falta prueba de renderizado en navegador real y prueba con una licencia real.
