# C002 · P2.2R.5E — PREMIUM RELEASE MANIFEST

**Estado:** QA PASS / HUB PREPARADO / PENDIENTE PERMISO PÚBLICO DRIVE

## Rama de release
`p2-2r-5e-c002-kit-release`

## Rollback
La rama `backup-c002-legacy-before-premium` conserva el estado de producción anterior al reemplazo.

## PDFs Premium en Google Drive

| Entregable | Drive file id | Uso |
|---|---|---|
| Kit Premium COLOR | `16c1La03tV9VDVC-tUhgJkgdKp9237DpL` | Principal / 36 páginas |
| Kit Premium B/N | `1Y5T6-vPsJ-7xWb2R81OfM7tBzXKEz5Tk` | Alternativa / 36 páginas |
| Recortables COLOR | `1f_3JN--h9kDqJD_PXHd77NNdHPTcPhWT` | Mesa física / 6 páginas |
| Recortables B/N | `1VQBn7NM4Kw6xnQ5pY3POP25DGQ6ZrRZa` | Mesa física / 6 páginas |

## Release gate restante
Los cuatro archivos deben mostrar en Google Drive:

- `Acceso general: Cualquier persona con el enlace`
- `Rol: Lector`

No promover esta rama a `main` mientras los archivos figuren `shared: false` o sin permiso público/link-reader.

## Hub Premium
`caso002/printables/index.html` ya está reconstruido en esta rama con:

- Kit Premium COLOR como CTA principal.
- Kit Premium B/N.
- Recortables COLOR.
- Recortables B/N.
- 36 páginas A4 + 6 recortables.
- explicación de SEALED.
- ENGINE P2 como autoridad de solución.
- sin enlace visible al kit legacy.

## Acción final
1. Verificar permisos públicos de los 4 archivos.
2. Promover rama a `main`.
3. Esperar Pages SUCCESS.
4. Abrir `/caso002/printables/` como usuario anónimo.
5. Abrir los cuatro PDFs.
6. Confirmar que el legacy ya no aparece en UI.
7. Cerrar P2.2R.5E.
