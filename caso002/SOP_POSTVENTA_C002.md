# C002 · SOP POSTVENTA · HOTEL ORFEO

Estado: PRODUCCIÓN
Producto: EXP-002 · EXPEDIENTES · Caso 002 · La Habitación que No Existe
Precio vigente: ARS 14.999
Vigencia: 12 meses desde activación
Límite: 2 dispositivos
Portal: /portal-v2/
Juego: /caso002/
Kit Premium: /caso002/printables/

## 1. Compra online
1. El comprador inicia sesión/verifica su correo en Portal V2.
2. COMPRAR AHORA invoca `pasalochevere-checkout` con `product_code=EXP-002`.
3. Mercado Pago crea la orden y devuelve al Portal con estado success/pending/failure.
4. `pasalochevere-mp-webhook` y `pasalochevere-payment-status` reconcilian el pago.
5. Si el pago queda aprobado, se crea una licencia `EXP-002` en estado `available`, asociada al correo de la compra.
6. El Portal muestra el acceso como PENDIENTE DE ACTIVAR.

## 2. Activación
1. El comprador presiona ACTIVAR en Mis juegos.
2. `pasalochevere-access` fija el titular, inicia la vigencia de 12 meses y genera el código personal.
3. Se registra el primer dispositivo.
4. El acceso pasa a ACTIVO y aparece el botón ABRIR/JUGAR.

## 3. Juego y kit
- El Portal abre `/caso002/?access=<codigo>`.
- El juego valida acceso y dispositivo antes de iniciar.
- El menú de impresión abre `/caso002/printables/`.
- El kit oficial es `C002_Kit_Imprimible_Hotel_Orfeo.pdf`.
- No entregar PDFs viejos ni copias fuera de la ruta oficial.

## 4. Dispositivos
- Límite comercial: 2.
- El comprador puede entrar al Portal sin consumir un nuevo lugar y usar GESTIONAR DISPOSITIVOS.
- Puede liberar un dispositivo anterior y volver a registrar otro.
- Nunca crear una licencia nueva sólo por cambio de celular.

## 5. Soporte de acceso
### Compró pero no aparece
- Confirmar correo usado para pagar.
- Verificar la orden en `pc_orders`.
- Si está pending, usar reconciliación de pago antes de intervenir manualmente.
- Si está approved, debe existir una licencia con `order_ref = external_reference`.

### No puede activar
- Verificar que la licencia sea EXP-002, no esté revocada y pertenezca al mismo correo.
- Si la licencia está available, usar Portal V2 para activar.
- No iniciar vigencia manualmente salvo recuperación administrada.

### No puede entrar
- Verificar licencia activa, vencimiento y límite de dispositivos.
- Usar el administrador genérico de licencias para generar un enlace de acceso de un solo uso si el correo del titular es válido.
- El comprador puede autogestionar dispositivos desde Portal V2.

### Licencia vencida o revocada
- No duplicar la licencia.
- Revisar historial y usar REACTIVAR sólo cuando corresponda comercialmente.

## 6. Regla de seguridad
Nunca enviar service role, hashes, secretos de sesión, solución de partida ni datos privados del impostor. El comprador sólo recibe Portal, código de compra/código personal, juego y kit.

## 7. Gate de primera venta
Antes de habilitar ventas comprobar:
- `price_ars > 0`
- `sales_enabled = true`
- URL `/caso002/`
- 12 meses
- 2 dispositivos
- Portal muestra precio correcto
- Checkout activo
- Webhook/reconciliación activos
- Kit Premium accesible
- ENGINE P2 Release Candidate PASS

## 8. Rollback comercial
Ante una falla crítica, poner `pc_products.EXP-002.sales_enabled=false`. Esto oculta el botón de compra sin revocar licencias existentes ni afectar compradores ya activados.
