# P2.4 — PRIMERA VENTA REAL + MONITOREO POSTVENTA C002

Estado: **GO · MONITOREO ACTIVO**
Fecha: 2026-09-21
Producto: `EXP-002` · EXPEDIENTES · Caso 002 · La Habitación que No Existe

## Estado inicial

- Venta online: habilitada.
- Precio: ARS 14.999.
- Vigencia: 12 meses / 8760 h.
- Dispositivos: 2.
- Órdenes reales EXP-002 al congelar esta fase: 0.
- Estado esperado: `WAITING_FIRST_SALE`.

## Monitor técnico

Migración Supabase: `c002_commercial_monitor_v1`.
Vista privada: `private.c002_commercial_monitor`.
Edge Function admin-only: `c002-commercial-monitor` v1.
Panel admin: `/caso002/monitor/`.

Cadena observada:

1. Orden creada.
2. Pago aprobado.
3. Licencia EXP-002 emitida.
4. Activación por comprador.
5. Primer dispositivo registrado.
6. Espejo P2 sincronizado.
7. Primera sala creada.
8. Primera sesión iniciada.

## Umbrales de alerta

- `PAYMENT_PENDING_LONG`: pago pendiente > 30 min.
- `LICENSE_MISSING`: pago aprobado sin licencia > 10 min.
- `NOT_ACTIVATED_24H`: compra aprobada sin activar > 24 h.
- `P2_SYNC_MISSING`: activación sin espejo P2 > 10 min.
- `NO_FIRST_ROOM_24H`: activación sin primera sala > 24 h.
- `ROOM_NO_SESSION_2H`: sala creada sin sesión > 2 h.

## Seguridad

- La vista vive en schema `private`.
- La API requiere JWT y restringe acceso a la cuenta administrativa autorizada.
- El panel no expone claves de compra, códigos de activación, service role ni secretos de Mercado Pago.

## Vigilancia automática

Se mantiene un condition watch horario para detectar:

- primera orden real EXP-002;
- nuevas órdenes posteriores;
- cualquier estado warning/error de postventa.

Si no hay novedades ni alertas, no se envía notificación.

## Rollback comercial

Ante incidencia crítica: poner `pc_products.sales_enabled=false` únicamente para `EXP-002`. Las licencias ya emitidas no deben revocarse por ese rollback.