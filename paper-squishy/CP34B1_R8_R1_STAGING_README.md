# Creator Plus Cuppy — R8-R2 (staging solamente)

**NO fusionar con main ni publicar a clientes.**

## Instalación completada
- Rama: `staging/cp34b1-r8-cuppy`.
- Seis artes originales de la R4-R1 instalados en `paper-squishy/cp34b1-r8-assets/`. Los seis blobs se verificaron individualmente después del commit.
- Manifiesto de integridad: `paper-squishy/cp34b1-r8-assets/manifest.json`.
- Colores: Original, Lavanda, Menta. Frente y dorso de cada color siguen emparejados.
- Cargador de esta rama: `psq-catalog-v27.js` → `psq-cuppy-r8-staging.js`.
- `main` no carga el módulo.

## Bloqueos antes de vista previa protegida
- Vercel devolvió **403 Forbidden** al crear un proyecto independiente dentro del equipo conectado. No hay despliegue remoto.
- El código tiene `allowedPreviewHosts=[]`. La activación remota queda denegada hasta verificar un host HTTPS bajo Vercel Authentication y agregarlo explícitamente.
- El módulo consulta `pasalochevere-access` con la acción `me` y busca una licencia `PSQ-FACTORY` activa. Este flujo se cotejó con el código actual de Edge Function, pero **no** con una sesión autorizada en preview.
- Falta comprobar los límites de dispositivo y las decisiones de acceso negativo en un portal real.
- Falta aceptación artística y armado físico. No liberar descarga comercial.

## QA realizado
- Laboratorio HTML autónomo, no el portal desplegado: 12/12 controles de escritorio y 12/12 de móvil sobre catálogo 60, selector de tres colores/dos caras y ausencia de overflow/error de JS.
- No es una validación de autenticación, impresora física ni producción.

## Para retomar
1. Obtener en Vercel permisos de crear proyecto y habilitar Vercel Authentication en todas las URLs de preview.
2. Crear el proyecto privado de QA vinculado a esta rama, sin asignar dominio de producción.
3. Verificar los seis archivos por HTTP con manifest y comparar hashes; corroborar funcionamiento del cargador, acceso con y sin licencia y mobile.
4. Incorporar **solo el hostname real verificado** en `allowedPreviewHosts`.
5. Completar prueba física y revisión artística antes de cualquier promoción.
