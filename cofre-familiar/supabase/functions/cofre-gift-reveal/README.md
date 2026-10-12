# cofre-gift-reveal

Edge Function activa v2 recuperada del proyecto Supabase.

Contrato usado por el frontend recovery:

POST `{ token, action: "context" | "open" }`

- SHA-256 del token crudo.
- Lookup en `cofre.project_access_links` con `purpose='reveal'`.
- Control de status, expiración y cantidad de usos.
- Exige proyecto `kind='gift'` y `cinema_sequence` publicada.
- Al abrir consume el link con `consume_reveal_link_service`.
- Firma media por 30 minutos y devuelve escenas.

El source exacto permanece desplegado en Supabase; no modificar desde este recovery sin un cambio de backend explícito.
