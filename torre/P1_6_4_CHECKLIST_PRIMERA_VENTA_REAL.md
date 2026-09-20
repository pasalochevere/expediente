# P1.6.4 — CHECKLIST OPERATIVO DE PRIMERA VENTA REAL

Producto: **MEGA PACK VERDAD O RETO +800**  
Código técnico: `TORRE-MEGA`  
Canal principal: MercadoLibre  
Portal cliente: https://pasalochevere.github.io/expediente/portal-v2/  
Administrador: https://pasalochevere.github.io/expediente/admin-licencias/

## Checklist express — 30 segundos

1. Confirmar que la venta de MercadoLibre está aprobada / confirmada.
2. Copiar el **número de venta de 16 dígitos**.
3. Abrir el Administrador de Licencias PasaloChevere.
4. Seleccionar:
   - Producto: **MEGA PACK VERDAD O RETO +800**
   - Canal: **MercadoLibre**
   - Tipo de acceso: **Comercial**
   - Vigencia: **Estándar del producto · 12 meses**
5. Pegar el número de venta.
6. Tocar **GENERAR CÓDIGO**.
7. Copiar el mensaje sugerido completo.
8. Enviarlo al comprador por el chat de MercadoLibre.
9. No pedir email por MercadoLibre: el comprador registra su propio correo en el Portal.
10. Esperar la activación y revisar el historial del Administrador.

## Mensaje que debe recibir el comprador

El Administrador genera automáticamente un mensaje con:
- nombre del producto;
- código de compra tipo `ML-TORRE-XXXX-XXXX`;
- enlace al Portal PasaloChevere;
- indicación de verificar su correo mediante magic link;
- vigencia de 12 meses desde la activación;
- límite de hasta 2 dispositivos.

## Qué hace el comprador

1. Abre el Portal PasaloChevere.
2. Ingresa su correo.
3. Abre el magic link recibido por email.
4. Vuelve al Portal ya autenticado.
5. Ingresa el código de compra recibido por MercadoLibre.
6. Toca activar.
7. El sistema genera su código personal `PC-XXXX-XXXX`.
8. El producto aparece en **Mis juegos**.
9. Toca **JUGAR**.
10. El juego valida sesión, licencia, vencimiento y dispositivo antes de abrir.

## Qué revisar después de la activación

En el Administrador, la licencia debe mostrar:
- estado: **ACTIVO**;
- email del comprador asociado;
- fecha de activación;
- fecha de vencimiento aproximadamente 12 meses después;
- dispositivos usados: normalmente `1 / 2` al primer ingreso;
- producto: **MEGA PACK VERDAD O RETO +800**.

## Si algo falla

- **Volviste a cargar la misma venta:** no pasa nada. El sistema debe recuperar el mismo código y no duplicarlo.
- **Figura SIN ACTIVAR:** el comprador todavía no completó correo + magic link + código de compra.
- **No llega el magic link:** pedir que revise Spam / Correo no deseado y reintente desde el Portal.
- **Código de compra no válido:** verificar que se haya copiado completo, sin espacios extras.
- **Límite de dispositivos alcanzado:** desde el Portal se puede gestionar y liberar un dispositivo anterior.
- **Comprador activó pero no entra al juego:** revisar que la licencia esté ACTIVA, no vencida, y que tenga dispositivo disponible.
- **URL directa del juego compartida:** sin sesión/licencia válida, el guard bloquea el acceso y redirige al Portal.

## Regla importante

No enviar nunca el enlace directo de `/torre/` como acceso de venta.  
Siempre enviar **código de compra + Portal V2**.

## Cierre de operación

Una venta se considera correctamente entregada cuando:
- el código comercial fue generado;
- el comprador recibió el mensaje;
- la licencia aparece ACTIVA;
- el email quedó asociado;
- el juego aparece en Mis juegos;
- el primer dispositivo quedó registrado;
- el botón JUGAR abre el Mega Pack.

Estado operativo: **LISTO PARA PRIMERA VENTA REAL**.
