# P1.6.5 — SOPORTE POSTVENTA + RECUPERACIÓN DE ACCESO

Producto: **MEGA PACK VERDAD O RETO +800**  
Código técnico: `TORRE-MEGA`

## Objetivo
Resolver los casos comunes de soporte sin crear licencias duplicadas ni desproteger la compra.

## Matriz operativa

### 1. Compró y todavía no activó
- Buscar por número de venta MercadoLibre.
- Confirmar estado `available / SIN ACTIVAR`.
- Reenviar el mismo `license_key` y Portal V2.
- No generar otra licencia.
- La vigencia todavía no corre.

### 2. No le llega el magic link
- Pedir que revise Spam / Correo no deseado.
- Confirmar que usa el mismo correo de activación.
- Si la licencia ya está activa y tiene `owner_email`, usar `support_access_link` para generar un enlace de acceso de un solo uso.
- Enviar ese link únicamente al titular del correo asociado.

### 3. Cambió de celular / llegó a 2 dispositivos
- El comprador puede iniciar sesión en Portal V2 sin registrar el nuevo dispositivo.
- Desde su tarjeta de juego usa **GESTIONAR DISPOSITIVOS**.
- `list_devices` permite ver los dispositivos asociados.
- Libera uno antiguo con `release_device`.
- Recién al tocar JUGAR se registra el nuevo dispositivo.

### 4. Perdió el código
- Buscar por número de venta o email.
- Recuperar el código existente.
- No crear uno nuevo.

### 5. Licencia revocada o vencida
- Revisar motivo antes de tocarla.
- Si corresponde, usar la acción administrativa `reactivate`.
- Si fue una baja legítima, no reactivar.

### 6. Ya no tiene acceso al correo original
- No cambiar el titular automáticamente.
- Verificar primero la compra original en MercadoLibre.
- Caso de escalamiento manual; no enviar magic links a un correo distinto sin validación.

## Reglas de seguridad
1. Una venta real debe conservar una sola licencia.
2. Nunca reemplazar una licencia activa por otra para resolver soporte.
3. No enviar links mágicos de soporte a terceros.
4. No liberar o reactivar accesos sin verificar la venta cuando exista una disputa.
5. El acceso directo a `/torre/` continúa protegido por sesión + licencia activa + vigencia + dispositivo.

## Herramientas
- Admin de licencias: `https://pasalochevere.github.io/expediente/admin-licencias/`
- Portal V2: `https://pasalochevere.github.io/expediente/portal-v2/`
- Panel P1.6.5: `https://pasalochevere.github.io/expediente/soporte-postventa/`

## Estado
P1.6.5 implementado con autoservicio para los casos normales y escalamiento manual para cambio de correo/titular.
