# CP3.4B1-R8-R3 · Preflight para Creator Plus Cuppy
Fecha: 2026-10-29 · Exclusivamente staging, NO publicar.

## Hallazgos confirmados
- `pasalochevere-access` existe como Supabase Edge Function activa con JWT y `action:"me"` retorna `{ok:true,licenses:[{product_code,status,expires_at,...}]}`. La condición PSQ-FACTORY / active / no vencida es compatible con la respuesta real.
- Supabase Auth guarda la sesión en el origen del navegador. Una preview en `.vercel.app` NO hereda automáticamente una sesión iniciada en el portal principal. La autorización de clientes reales aún no se probó; no suponer éxito en preview.
- El bloqueo actual es **solo código de interfaz**, no protege por sí solo los archivos estáticos: el despliegue debe exigir **Vercel Authentication (all deployments)** a nivel plataforma.
- Se revisaron los seis PNG en paquete local y el instalador en un checkout local temporal. **No se han subido a esta rama en GitHub**. Hasta que se suban, `node paper-squishy/qa-cuppy-r8.mjs` debe salir con error por archivos ausentes.

## Control R8-R3
1. Subir exactamente los seis PNG del paquete R8-R2 a `paper-squishy/cp34b1-r8-assets/` en `staging/cp34b1-r8-cuppy`.
2. Ejecutar `node paper-squishy/qa-cuppy-r8.mjs`; no desplegar si falla.
3. Resolver error Vercel `403 Forbidden` para creación del proyecto `creatorplus-cuppy-r8-qa`. No usar un proyecto de producción existente ni intentar el mismo cambio sin permisos.
4. Crear preview aislada con Vercel Authentication para **all deployments**. Verificar bloqueo desde sesión no autorizada (antes de descargar HTML y PNG).
5. Verificar desde cuenta interna permitida: origen/cookies, respuesta `pasalochevere-access`, activa/vencida/revocada/sin licencia y límite de dispositivos según política vigente.
6. Comprobar las seis variantes en red (HTTP 200), frente-dorso del mismo color, A4 100 %, 390px móvil, 60 personajes y exportaciones.
7. Aprobación física/artística de Cuppy aún pendiente. No activar para clientes ni fusionar a main.

## Estado
GitHub staging: módulo y test estático guardados.
GitHub staging assets: no instalados.
Vercel deployment: no creado, bloqueo por permiso 403.
Producción: no modificada.
