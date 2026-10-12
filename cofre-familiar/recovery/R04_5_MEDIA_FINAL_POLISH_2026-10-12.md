# COFRE-R04.5 — MEDIA FINAL PIXEL POLISH + FAILED UPLOAD CLEANUP

Fecha: 2026-10-12
Rama: `release/cofre-familiar-rc1`
Runtime: Railway `cofre-web-rc1`

## Validación de usuario previa

El usuario validó en navegador real que:
- la subida de fotos funciona;
- la creación de álbum funciona;
- las fotos pueden moverse al álbum;
- las fotos se muestran completas, sin el recorte anterior.

## Hallazgo de cleanup

La tarjeta gris de `0 MB` era un asset QA histórico de R02.1:
- `qa-r02-1.png`
- status `failed`
- size `0 bytes`

Ese registro QA fue retirado sin tocar fotos reales.

## Cambios R04.5

- La galería consulta solamente assets `ready`.
- Nuevo RPC seguro `cofre.cancel_my_media_upload_secure(...)` para cancelar únicamente reservas propias del usuario autenticado.
- Si una subida falla después de reservar espacio, el cliente cancela la reserva y libera cuota.
- En subida múltiple, los archivos exitosos salen de la cola; un reintento procesa sólo los pendientes.
- La vista de álbum se compactó para 1–2 archivos y evita grandes espacios vacíos.
- Cabecera de álbum simplificada: nombre, cantidad, fecha y nota en una misma jerarquía.
- Tarjetas simplificadas a nombre visible, fecha/tamaño y acciones `Ver original`, `Editar`, `Información`.
- Detalles técnicos quedan secundarios.
- Se agregó stylesheet final `app/r04-5.css`.

## QA backend

Se probó en transacción con rol `authenticated`:
1. reservar upload;
2. cancelar mediante `cancel_my_media_upload_secure`;
3. verificar status `failed`;
4. verificar `reserved_size_bytes = 0`;
5. verificar reserva global de storage `0`;
6. `ROLLBACK`.

No quedaron filas QA de esa prueba.

Seguridad: el RPC restringe el target por `uploaded_by = auth.uid()` y no abre mutación directa de `media_assets` al cliente.

## Gate de build

- Recovery general: **75 PASS / 0 FAIL**
- R03: **33 PASS / 0 FAIL**
- R04/R04.5: **27 PASS / 0 FAIL**
- TypeScript: PASS
- Next build: PASS
- Static pages: 8/8
- Runtime: Ready
- Healthcheck `/health`: **1/1 PASS**

Deployment R04.5: `bd7084bb-edc7-49d4-92f1-a46ebb910e93`
Source commit: `654e4a6f4783a7ee5cc6a71f8dcfd0b9e9321d82`

## Release pendiente

Antes de mergear a `main` / publicar launcher de GitHub Pages, sigue pendiente versionar `package-lock.json` para instalaciones determinísticas.

No se hizo merge a `main`. No se publicó el launcher estable. El Cofre personal `primavera-dai/cofre.html` no se tocó.
