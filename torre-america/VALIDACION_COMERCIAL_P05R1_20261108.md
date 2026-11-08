# Torre de América V2.0 — P0.5R1 · Validación comercial real y matriz de lanzamiento

**Fecha:** 2026-11-08  
**Build candidata:** `TA-V2.0-RC1-P05R1-20261108`  
**Estado:** CANDIDATA DE PRUEBA — NO LIBERADA A VENTA NI A INSTALACIÓN V2.

## 1. Verificación realizada en Supabase real

Proyecto de PasaloChévere: `expediente-dev`. Consulta de solo lectura sobre tablas `public.pc_products`, `public.exp_licenses`, `public.pc_orders` y `public.pc_digital_catalog`, y revisión del código de las Edge Functions `pasalochevere-access` v35, `pasalochevere-checkout` v5 y `pasalochevere-payment-status` v1.

| Elemento | Resultado real |
| --- | --- |
| Producto `FUT-AMERICA` | Existe |
| Precio `FUT-AMERICA` | NULL |
| `sales_enabled` | FALSE |
| URL producto actual | V1 estable `../torre-america/` |
| `FUT-AMERICA-DIG` en productos | No existe |
| `FUT-AMERICA-PHY` en productos | No existe |
| Catálogo digital | `FUT-AMERICA` presente y habilitado como app |
| Pedidos en `pc_orders` para FUT-AMERICA | 0 |
| Licencias históricas `FUT-AMERICA` | 7 estado active (solo 1 no vencida según fechas), 1 available |
| Control de compra | Checkout rechaza producto sin precio o con ventas deshabilitadas |
| Control de sesión en acceso | Edge Function valida `auth.getUser()` y pertenencia de licencia antes de registrar dispositivo |
| Entitlement para FUT-AMERICA | Función devuelve “full” para el juego genérico; no hay distinción Digital/Física implementada |

La verificación no incluyó inicio de sesión real de un comprador, inscripción de dispositivo ni cobro. No se leyeron ni divulgaron códigos de activación, correos o identificadores personales.

## 2. Cambios concretos de protección en RC

- La candidata usa `v2-rc.html`; no modifica el `index.html` estable.
- Copias aisladas para RC: `app-1-rc1.js`, `app-6-rc1.js`, `app-7-rc1.js` reemplazan únicamente la clave de almacenamiento `torreAmericaGame` por `torreAmericaGameV2RC1`.
- Copia `app-8-rc1.js`: evita volver a registrar el service worker V1 desde la candidata.
- La licencia, las preferencias globales autorizadas, las reglas y el motor central se conservan.
- La candidata sigue fallando de forma segura si faltan contenido, protecciones P0.4, estilos, iconografía o animaciones.
- **Limitación:** los navegadores que ya tengan instalado el service worker V1 todavía podrían controlar `v2-rc.html` por compartir alcance de ruta. No se certifica offline para V2 ni se habilita su instalación.

## 3. Matriz de productos propuesta (SIN CREARLOS TODAVÍA)

| Código | Tipo | Entrega | Estado deseado en QA |
| --- | --- | --- | --- |
| `FUT-AMERICA` | Legacy | Mantener la URL V1 y los accesos históricos | Sin cambios |
| `FUT-AMERICA-DIG` | Solo Digital | Licencia + acceso V2 digital, sin torre | SKU nuevo, `sales_enabled=false` |
| `FUT-AMERICA-PHY` | Torre Física + Digital | Licencia + torre física y acceso V2 | SKU nuevo, `sales_enabled=false` |

**No asumir precio, plazo ni límite de dispositivos:** deben confirmarse para cada SKU. El backend `pasalochevere-access` utiliza un mapa de productos que tampoco tiene estos dos códigos y debe actualizarse antes de publicar. El cliente actual acepta esos códigos como formatos permitidos, pero **no garantiza ni fuerza derechos diferenciados**. No basta con agregarlos a una tabla.

### Pasos técnicos futuros sin romper compras anteriores
1. Dar de alta los dos productos nuevos **deshabilitados**, con precio provisional NULL, URL de RC y condiciones de entrega verificadas.
2. Agregar ambos códigos al mapa del backend `pasalochevere-access`, manteniendo la entrada legacy.
3. Definir y verificar el `entitlement` servidor para cada SKU, las URL de biblioteca y la validación por dispositivo.
4. Ejercitar digital válido, físico/híbrido válido, legacy vigente, caducado, inválido y límite de dispositivos con **cuentas/licencias de QA dedicadas**.
5. Confirmar entrega desde el portal, pago simulado (sin fondos reales), webhook, registro y recuperación de licencia, y eventual reembolso o soporte.
6. Activar precios y ventas solo con decisión comercial explícita y QA aprobado.

## 4. PWA y offline: condición necesaria

El service worker V1 tiene alcance `./` sobre toda `torre-america/` y caché compartido. Su fallback puede servir `index.html` cuando otro archivo falta sin conexión. **Una V2 instalada en la misma ruta puede mostrar V1 o quedar incompleta.**

Salida segura recomendada: crear una ubicación propia para V2 (ruta `torre-america/v2/` con assets/manifest/worker y scope aislados) o coordinar una migración de service worker controlada con pruebas de usuarios V1; nunca sobrescribir el worker V1 sin evaluar impacto. Verificar versiones, recarga, instalación, guardado y renovación de licencia en Android, escritorio e iOS.

## 5. Matriz de aceptación obligatoria

- [x] Producto real y estado de venta verificados sin escrituras.
- [x] Flujo de checkout revisado: bloquea correctamente precio inválido / venta desactivada.
- [x] Copias del motor de guardado específicas de RC creadas sin cambios de reglas.
- [x] Simulación: iniciar, guardar, reanudar, cerrar V2 sin tocar partida V1.
- [x] RC no registra el service worker V1 por su cuenta.
- [ ] Producto `FUT-AMERICA-DIG` creado y validado.
- [ ] Producto `FUT-AMERICA-PHY` creado y validado.
- [ ] Separación de permisos / entregables validada en servidor y portal.
- [ ] Test de login y licencia activa con cuenta de QA, sin tocar comprador.
- [ ] Test de licencia vencida/inválida y límite de dispositivos.
- [ ] QA real Chrome/Edge/Android/iOS con screenshots y partidas completas.
- [ ] Pruebas PWA V2 + offline sin interferencia con V1.
- [ ] Precios, stock, materiales y condiciones comerciales confirmadas.
- [ ] Cinco imágenes comerciales finales por edición, hechas desde capturas reales.
- [ ] QA checkout, webhook, devolución y activación, sin cobro de dinero real.
- [ ] Autorización de publicación y sustitución controlada de V1.

## 6. Decisión de lanzamiento

**NO-GO A VENTAS / PUBLICACIÓN DEFINITIVA.** Continúa disponible la candidata `v2-rc.html` para validación con credencial propia. La versión estable, los productos actuales, las licencias existentes, el checkout y el service worker V1 no fueron modificados. La compra V2 permanece bloqueada hasta cerrar permisos, precios, pruebas de dispositivo y PWA.
