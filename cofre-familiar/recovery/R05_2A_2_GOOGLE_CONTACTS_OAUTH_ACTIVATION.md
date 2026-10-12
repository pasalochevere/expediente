# COFRE R05.2A.2 — Google Contacts OAuth Activation

Estado: APP READY / EXTERNAL OAUTH SETUP REQUIRED

## Arquitectura

Cofre usa Supabase Auth para vincular una identidad Google al usuario ya autenticado. La app solicita únicamente `https://www.googleapis.com/auth/contacts.readonly`, recibe el `provider_token` durante el callback PKCE y lo usa sólo en servidor para consultar Google People API. El token de Google no se persiste. Los contactos se guardan primero en staging por 30 minutos y el usuario revisa/selecciona antes de importar.

## 1. Google Cloud

Crear o seleccionar un proyecto para PASALOCHEVERE Cofre Familiar.

1. Activar **People API**.
2. Abrir **Google Auth Platform**.
3. Branding: nombre visible **PASALOCHEVERE · Cofre Familiar**.
4. Audience: **External**. Mientras esté en prueba, agregar las cuentas que usarán el piloto como Test users.
5. Data Access / Scopes: mantener los scopes básicos de identidad y agregar:
   - `openid`
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
   - `https://www.googleapis.com/auth/contacts.readonly`
6. Crear un OAuth Client de tipo **Web application**.
7. Authorized redirect URI de Google, exacta:

   `https://awuzunqfsbqyjsxlkdsb.supabase.co/auth/v1/callback`

El Client ID y Client Secret se cargan directamente en Supabase Dashboard. No guardarlos en GitHub, Railway ni en código cliente.

## 2. Supabase Auth

Proyecto: `pasalochevere-gamefactory` (`awuzunqfsbqyjsxlkdsb`).

1. Authentication → Providers → Google.
2. Habilitar Google.
3. Pegar el Client ID y Client Secret del OAuth Client de Google.
4. Authentication → Settings / Security: habilitar **Manual Linking** para permitir `auth.linkIdentity()` desde un usuario ya autenticado.
5. Authentication → URL Configuration:
   - Site URL: `https://cofre-web-rc1-production.up.railway.app`
   - Redirect URL de producción: `https://cofre-web-rc1-production.up.railway.app/auth/callback`

## 3. Railway

Sólo después de que Google y Supabase estén configurados y verificados, activar en `cofre-web-rc1`:

`NEXT_PUBLIC_GOOGLE_CONTACTS_ENABLED=true`

Esto habilita el botón **Conectar Google**. Hasta ese momento el feature flag debe permanecer apagado para evitar una UX rota.

## 4. Browser Acceptance

Flujo esperado:

1. Usuario autenticado abre Personas → Importar personas.
2. Toca **Conectar Google**.
3. Google muestra consentimiento de sólo lectura de contactos.
4. Regresa a `/auth/callback`.
5. Cofre consulta Google People API en servidor.
6. Se crea un lote temporal de staging.
7. La pantalla muestra la lista de contactos encontrada.
8. El usuario selecciona cuáles importar.
9. Cofre deduplica y guarda sólo los elegidos.

Criterio PASS:
- OAuth abre Google sin `provider not enabled`.
- Callback vuelve a Cofre.
- People API responde contactos.
- No se persiste `provider_token`.
- El lote aparece antes de guardar.
- Importación confirma nuevas/combinadas.
- Errores de OAuth vuelven con mensaje legible y sin guardar contactos.

## Gate

No marcar R05.2A.2 como FULL PASS hasta completar un OAuth real desde navegador. La app y el callback pueden pasar build/TypeScript antes, pero la activación final depende de las credenciales externas de Google y de Manual Linking en Supabase Auth.
