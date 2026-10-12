# Cofre Familiar · RC1 Recovery

Recovery source construido el 2026-10-12 a partir del backend RC que sigue vivo en Supabase y del release gate de `COFRE 0.9.15 · RC1 FROZEN`.

> Este árbol **no afirma ser byte-a-byte el ZIP perdido** `COFRE_P0_9_15_RC1_Candidate_rc3.zip`. Es una reconstrucción controlada contra el contrato real de producción: schema `cofre`, schema `cofre_private`, RLS, RPC y Edge Functions existentes.

## Aislamiento

- Proyecto: **Cofre Familiar**.
- No usa `public.cofre_spaces` / `public.cofre_memories` (Cofre Gas + Dai).
- No modifica `primavera-dai/cofre.html`.
- Branch de recovery: `release/cofre-familiar-rc1`.

## Stack

- Next.js 16.4.0
- React 19.3.0
- TypeScript 5.9.3
- `@supabase/ssr` 0.12.7
- `@supabase/supabase-js` 2.117.3
- Node >= 20.9

## Flujo recuperado

`Login → Cofres → Cofre Familiar → Inicio`

Rutas principales:

- `/c/:cofreId`
- `/history`
- `/memories`
- `/media`
- `/people`
- `/dates`
- `/letters`
- `/capsules`
- `/dreams`
- `/projects`
- `/search`
- `/notifications`
- `/members`
- `/settings`
- `/gift/:token`
- `/invite/:token`
- `/contribute/:token`

Las rutas con token usan `noindex/nofollow` y no guardan el token crudo en `localStorage`.

## Variables

Copiar `.env.example` a `.env.local` para desarrollo.

## QA

```bash
npm install
npm run typecheck
npm run build
npm start
```

La meta del recovery es volver a alcanzar y después superar el gate histórico de **62 PASS / 0 FAIL**.
