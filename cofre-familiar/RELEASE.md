# COFRE FAMILIAR · RC1 RECOVERY

Ruta objetivo estable:

`https://pasalochevere.github.io/expediente/cofre-familiar/`

## Estado actual · 2026-10-12

- Base funcional: **COFRE 0.9.15 · RC1 FROZEN**.
- El ZIP `COFRE_P0_9_15_RC1_Candidate_rc3.zip` no pudo recuperarse.
- Se realizó una **reconstrucción controlada** contra el backend V2 real todavía activo en Supabase.
- Schema usado: `cofre` + `cofre_private`.
- Edge Functions recuperadas/contractualmente fijadas: media upload, media finalize y gift reveal.
- Recovery preflight: **62 PASS / 0 FAIL**.
- `primavera-dai/cofre.html` queda fuera de alcance y no se modifica.

## Arquitectura de publicación

Cofre Familiar es una aplicación Next.js con Auth, Supabase, RLS y funciones dinámicas. GitHub Pages no puede ejecutar ese runtime. Por lo tanto:

1. `cofre-familiar/` conserva el source versionado y aislado dentro de este repositorio.
2. El runtime real se valida/despliega en Railway.
3. La URL de GitHub Pages `/expediente/cofre-familiar/` podrá actuar como acceso/landing estable hacia el runtime una vez aprobado el E2E.

## Gate pendiente

1. Build remoto real (`npm install` + typecheck + `next build`).
2. Smoke público.
3. Auth register/login/callback.
4. Flujo autenticado de punta a punta.
5. QA mobile.
6. Recién después, integrar a `main` y publicar el acceso estable.
