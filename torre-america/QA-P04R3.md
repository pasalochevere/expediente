# TA-UI V2.0-P0.4R3 — Regresión en navegador

Fecha: 2026-11-08

## Ejecución reproducible
- [GitHub Actions — SUCCESS](https://github.com/pasalochevere/expediente/actions/runs/42527694224)
- Resultado de la suite R3: **16 PASS, 0 FAIL**.
- Suite R2 móvil: **SUCCESS** en la misma ejecución.
- Evidencia archivada como artifact `ta-p04r2-r3-browser-evidence`, con JSON y capturas.
- Rama de QA: `audit/ta-ui-v2-p04-20261108`.

## Casos R3 aprobados
1. Introducción cinematográfica: uso del botón «ENTRAR DIRECTO» y luego CTA de Inicio.
2. Selección con clic real de formato Digital.
3. Continuación con clic real desde Formato a Modo.
4. DADO GOL: +1 punto.
5. DADO ATAJADA: ESCUDO adquirido.
6. DADO VAR: sustitución de consigna.
7. DADO REPLAY: segunda oportunidad activada.
8. DADO FALTA: variación del cronómetro.
9. DADO PENAL: pantalla y estado de penal.
10. Penal individual acertado: +1 punto y continuación.
11. Tanda estándar de tres disparos por lado.
12. Empate en tanda y resolución de muerte súbita en LEYENDA.
13. Reanudación tras recargar desde reto.
14. Reanudación tras recargar desde penal individual.
15. Reanudación tras recargar desde tanda, preservando pateador y marcador.
16. Reanudación tras recargar desde resultado.

## Alcance y límites
- Las pruebas se ejecutaron en **Chromium automatizado** con un servidor HTTP local dentro de GitHub Actions. R2 cubre cinco tamaños: 320, 375, 390, 430 y 768 px.
- La suite sustituye **solo durante la sesión automatizada** la descarga de `access.js` para evitar validar una licencia real. No modifica el archivo original, el validador real ni Supabase.
- Los botones de Inicio/Formato se accionaron con clics reales. El resto de los casos R3 usa funciones reales del motor invocadas en el navegador con estado de prueba controlado: no demuestra interacción táctil completa de todos los controles.
- No constituye certificación completa de todas las ramas de poderes (CAPITAN, HINCHADA, CONTRAATAQUE, EL_10, ROJA, LA_COPA, etc.), temporizadores en tiempo real, Safari/Firefox, conectividad offline, sesiones/licencias reales ni persistencia de producción.
- No se fusionó la rama ni se desplegó en producción.
- Los errores iniciales del test (overlay de intro y espera de HTML asíncrono tras reload) se corrigieron en la suite, sin tocar el motor.

## Decisión
**R3: aprobado dentro del alcance automatizado.** Antes de integrar el preview a `main`, validar licencias reales, recorrido táctil integral y casos adicionales de poderes/temporizadores en un entorno autorizado.
