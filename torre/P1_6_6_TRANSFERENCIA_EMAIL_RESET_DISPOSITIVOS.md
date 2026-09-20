# P1.6.6 — Transferencia segura de correo + reset admin de dispositivos

Fecha: 2026-09-20
Producto: MEGA PACK VERDAD O RETO +800 (`TORRE-MEGA`)

## Implementado

### Transferencia segura de correo
- Disponible únicamente para la sesión administrativa `pasalochevere@gmail.com`.
- Solo opera sobre `TORRE-MEGA`.
- Requiere licencia `active` o `available`.
- Exige nuevo email válido.
- Exige escribir exactamente la referencia/número de venta original.
- Exige confirmación literal `TRANSFERIR`.
- Bloquea la operación si el nuevo correo ya posee otro Mega Pack activo o pendiente.
- Cambia `owner_email` y elimina `activated_by_user_id` para cortar el acceso de la cuenta anterior.
- Conserva código de compra, código personal, fecha de activación y vencimiento.
- Libera todos los dispositivos registrados en la transferencia.
- Registra la operación en `notes` con fecha, correo anterior, correo nuevo, venta y cantidad de dispositivos liberados.
- Intenta generar un magic link de un solo uso al nuevo correo; si no es posible, el nuevo titular puede ingresar normalmente por Portal V2.

### Reset administrativo de dispositivos
- Disponible únicamente para la sesión administrativa.
- Exige confirmación literal `RESET`.
- Elimina todos los registros de `pc_license_devices` asociados a la licencia.
- No modifica correo, licencia, activación, vigencia ni vencimiento.
- Registra la acción en `notes`.

## Backend
Nueva Edge Function: `pasalochevere-support-admin`, `verify_jwt=true`.

## Panel
`/soporte-postventa/` actualizado a P1.6.6 con botones:
- CAMBIAR EMAIL
- RESET DISPOSITIVOS

## Regla operativa
Nunca crear una licencia nueva para solucionar pérdida de email o cambio de celular. Primero localizar la venta original y operar sobre esa misma licencia.

Estado: **P1.6.6 IMPLEMENTADO**.
