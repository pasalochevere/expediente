# COFRE FAMILIAR · RC1

Ruta objetivo de publicación:

`https://pasalochevere.github.io/expediente/cofre-familiar/`

## Estado

- Base: COFRE 0.9.15 · RC1 FROZEN
- Preflight verificado: 62 PASS / 0 FAIL
- Carpeta nueva e independiente de `primavera-dai/`
- `primavera-dai/cofre.html` no debe modificarse

## Regla de release

No publicar un `index.html` sustituto ni copiar el Cofre Gas + Dai como RC1.
La carpeta debe recibir únicamente el build/export correcto de Cofre Familiar.

## Pendiente para publicación

1. Recuperar el source/build RC1 correcto (`cofre-frontend-v1 0.9.15` / candidato `cofre_P0_9_15_RC1_Candidate_rc3.zip`).
2. Generar o validar una salida compatible con GitHub Pages bajo `/expediente/cofre-familiar/`.
3. Copiar los assets con rutas relativas o base path correcto.
4. Ejecutar smoke desktop + mobile.
5. Recién entonces integrar a `main`.
