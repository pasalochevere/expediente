# PAPER SQUISHY FACTORY · P2.5 · M01

## Ocean Friends

Primer pack mensual de actualización. Estado actual: `DESIGN_READY`. **No está publicado en la biblioteca comercial** hasta completar producción y QA.

### Personajes

1. OF01 · Delfi · delfín kawaii
2. OF02 · Pulpi · pulpo kawaii
3. OF03 · Nari · narval kawaii
4. OF04 · Tibi · tiburón kawaii
5. OF05 · Estrelli · estrella de mar kawaii
6. OF06 · Caballi · caballito de mar kawaii
7. OF07 · Medusi · medusa kawaii
8. OF08 · Balleni · ballena kawaii
9. OF09 · Cangri · cangrejo kawaii
10. OF10 · Pufi · pez globo kawaii

### Contrato obligatorio por personaje

Cada personaje debe entregar 8 archivos independientes:

- `hero`
- `front_print`
- `back_print`
- `coloring`
- `editor_asset`
- `character_card`
- `tutorial`
- `mockup`

Total del pack: **10 personajes · 80 assets**.

### QA obligatorio antes de LIVE

- hero consistente con las otras 7 vistas;
- frente y dorso con la misma geometría/escala;
- dorso real sin cara frontal repetida;
- `editor_asset` con transparencia real;
- coloring limpio en blanco y negro;
- ficha y tutorial legibles;
- mockup coherente con el imprimible;
- 80/80 archivos presentes;
- 0 IDs, slugs o nombres duplicados;
- rutas HTTP 200;
- prueba de galería 8/8, Remix e impresión.

### Regla de publicación

M01 solo pasa de `DESIGN_READY` a `ASSETS_READY`, luego `QA_PASS` y finalmente `LIVE`. El core comercial P2.4.4 permanece congelado: el pack se incorpora por manifest/library, no reconstruyendo la aplicación.
