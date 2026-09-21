# C002 · P2.2R.5E — QA PREMIUM + REEMPLAZO LEGACY

**Estado:** QA PREMIUM PASS / REEMPLAZO VIVO PENDIENTE DE HOSTING BINARIO

## QA de los cuatro PDFs finales

- `C002_Kit_Premium_COLOR.pdf` · 36 páginas · A4 · sin cifrado · SHA256 `cb02db70e379cca432b8ae2b05cda9ed33223926ed18af19cdb2a47469189797`
- `C002_Kit_Premium_BN.pdf` · 36 páginas · A4 · sin cifrado · SHA256 `791a1e726b6534deb5008fcd8476dfc85519b4decdfac8c6151c323fed048c4d`
- `C002_Recortables_COLOR.pdf` · 6 páginas · A4 · sin cifrado · SHA256 `f0157596f2d7e450295494a5c18d2cc7ac6709824182ae944384eee5773b83be`
- `C002_Recortables_BN.pdf` · 6 páginas · A4 · sin cifrado · SHA256 `dc615d9fe13afff82728b09c34c9e72674fcab11e943f699736f07abf6d9886f`

## Gate visual/técnico

- 36/36 páginas dossier presentes en COLOR y B/N.
- 6/6 páginas recortables presentes en COLOR y B/N.
- Formato A4 confirmado.
- PDFs no cifrados y abren correctamente.
- No hay páginas negras, vacías, rotadas ni cortadas en el render de control.
- Páginas 35–36 mantienen tratamiento SEALED.
- No se fija una solución PERSONA/LUGAR/OBJETO.
- No se usan siluetas/pictogramas legacy en el master Premium.
- El PDF legacy permanece vivo hasta completar el switch de hosting.

## Rollback

Se creó una rama de respaldo antes del reemplazo: `backup-c002-legacy-before-premium`, apuntando al commit `8bc7b4d93bbd527a802ef94d9ace923353aa1403`.

## Reemplazo vivo

Pendiente únicamente de publicar los cuatro binarios Premium en un host con enlace directo estable. El conector GitHub disponible no acepta archivos binarios locales grandes sin degradarlos, por lo que no se reemplaza el enlace vivo hasta contar con hosting adecuado.

Al completar el hosting:
1. El enlace principal del comprador pasa a `C002_Kit_Premium_COLOR.pdf`.
2. Se ofrecen como alternativas Kit B/N + Recortables COLOR + Recortables B/N.
3. El PDF legacy deja de estar enlazado, pero queda recuperable desde la rama de backup.
4. Se actualiza `printables/index.html` de 22 páginas a 36 + 6 recortables.
5. Se verifica GitHub Pages y se congela el release comercial.
