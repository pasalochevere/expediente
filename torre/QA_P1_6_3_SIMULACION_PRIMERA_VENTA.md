# P1.6.3 — Simulación de primera venta MercadoLibre

Fecha: 2026-09-20
Producto: MEGA PACK VERDAD O RETO +800
Código técnico: TORRE-MEGA

## Objetivo
Simular el circuito comercial de una primera venta MercadoLibre sin dejar residuos de prueba en producción.

## Datos de simulación
- Venta ficticia ML: `2000099999999999`
- Order ref: `ML:TORRE-MEGA:2000099999999999`
- Código de compra temporal: `ML-TORRE-Q7KM-N4PX`
- Estado inicial esperado: `available`
- Vigencia: 8760 horas / 12 meses
- Dispositivos: 2
- Email previo: ninguno
- Activación: no iniciada
- Vencimiento: no iniciado

## Resultado
PASS — La licencia de venta pudo crearse con el formato comercial previsto y quedó correctamente:
- sin email previo;
- sin código personal de activación;
- sin fecha de activación;
- sin fecha de vencimiento;
- con límite de 2 dispositivos;
- con fuente `mercadolibre`;
- con un único registro para la referencia simulada.

Se verificó además el estado del acceso real de prueba existente `TORRE-TEST-5EN1`, que permanece activo con código personal, vencimiento a 12 meses y 1/2 dispositivos usados. Esto confirma el estado post-activación y la compatibilidad con el guard de acceso del juego.

## Protección de acceso
`torre/access-guard.js` valida `TORRE-MEGA`, exige sesión, licencia activa, vigencia y registro de dispositivo. Si falta sesión redirige a Portal V2.

## Limpieza
La licencia ficticia `ML-TORRE-Q7KM-N4PX` fue eliminada luego de la simulación. Verificación final: 0 registros de simulación remanentes.

## Observación
La interacción humana exacta del magic link (abrir correo y volver al Portal) no puede ejecutarse desde esta auditoría automática. El backend y el estado post-activación sí fueron verificados por separado.

Estado: P1.6.3 PASS CON OBSERVACIÓN MENOR DE INTERACCIÓN HUMANA.