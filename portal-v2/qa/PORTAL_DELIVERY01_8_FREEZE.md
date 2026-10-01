# PORTAL-DELIVERY01.8 · Etsy EXP-001 · Commercial Freeze

Fecha de freeze: 2026-10-01

## URL oficial

`https://pasalochevere.github.io/expediente/portal-v2/?channel=etsy&product=EXP-001&lang=es`

Esta es la URL que debe usar el QR, el PDF de acceso digital y el mensaje comercial de Etsy para EXPEDIENTES · Caso 001 · La Última Reunión.

No agregar al QR: email, número de pedido, código de compra, activation_code, access token ni datos personales.

## QR oficial

Asset: `portal-v2/assets/delivery/etsy-exp001-qr.svg`

Target congelado: la URL oficial anterior.

## Reglas comerciales congeladas

- Canal: Etsy (`ETSY` / source `etsy`).
- Producto: `EXP-001`.
- Vigencia comercial estándar: 8760 horas / 12 meses desde la activación.
- Límite comercial: 2 dispositivos.
- El código de compra se genera por pedido y se activa una sola vez por cuenta.
- El código personal/licencia se genera o queda asociado al activar.
- El acceso al juego continúa protegido por `register_device`.
- Caso 001 se abre por Cinema Intro; no existe bypass comercial directo al juego.
- Idiomas de Delivery y Caso 001: ES / EN.

## Smoke real validado

Validado manualmente en producción el 2026-10-01:

1. Entrada por URL contextual Etsy + EXP-001.
2. Delivery específico de Caso 001.
3. Verificación de correo por magic link.
4. Retorno del magic link conservando contexto Etsy / EXP-001.
5. Ingreso de código de compra.
6. Activación correcta de licencia de prueba.
7. Pantalla `TU EXPEDIENTE ESTÁ LISTO`.
8. Código personal visible.
9. Registro del dispositivo: 1 / 2 en la prueba.
10. Entrada protegida a Caso 001.
11. Cinema Intro / handoff al juego.
12. Cambio ES → EN dentro del producto funcionando normalmente.

La licencia usada en el smoke fue deliberadamente de 1 día. No modifica la regla comercial de 12 meses.

## Freeze técnico

Los siguientes componentes forman el circuito congelado:

- `portal-delivery-freeze-v018.js`
- `portal-delivery-context-v601.js`
- `portal-delivery-auth-v014.js`
- `portal-delivery-exp001-v013.js`
- `portal-delivery-activation-v015.js`
- `portal-delivery-support-v016.js`
- `portal-delivery-success-v017.js`
- `portal-v5-bootstrap-v56.js`
- `c002-rc.js`
- `admin-licencias/etsy-exp001-v018.js`
- `assets/delivery/etsy-exp001-qr.svg`

## Regla de mantenimiento

Cualquier cambio futuro que altere URL, channel, product, vigencia comercial, límite de dispositivos, magic-link return, activación, ruta de Caso 001 o QR debe actualizar este freeze y pasar nuevamente el smoke de DELIVERY01.8 antes de publicar.