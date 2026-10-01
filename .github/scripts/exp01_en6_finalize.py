from pathlib import Path

AUDIT = """# EXP01-EN6 · Final Bilingual Release QA · ES / EN

Estado: **PASS · release bilingüe final validado localmente y sobre GitHub Pages público; checkpoint congelado**.

## Hallazgos cerrados en EN6

1. **Continuidad de idioma en imprimibles.** EN5 usaba una preferencia propia y podía abrir el kit en ES aunque el jugador hubiera elegido EN. Printables ahora prioriza `?lang`, luego `expedientes_language`, conserva la clave EN5 como fallback y sincroniza ambas al cambiar idioma.
2. **Controles superiores Crear / Unirse.** El gate fresco confirmó que el wiring anterior era asimétrico: Unirse activo ejecutaba el CTA y Crear activo no. EN6 reemplaza ese wiring por una delegación única: un control inactivo cambia de pestaña y uno ya activo ejecuta exactamente el CTA inferior. No modifica estética ni backend.

## Recorrido final PASS

- Portal EXP-001 → Cinema Intro.
- Cinema Intro EN: narrativa y assets localizados.
- Handoff Intro → Juego conserva `access`, `room`, `lang`, `skipintro=1` e `intro=v10`.
- Juego ES/EN reversible y estado local de teoría/última sala preservado.
- Crear/Unirse superiores PASS en gate local y nuevamente sobre GitHub Pages público, sin ejecutar acción server-side durante QA.
- Printables heredan idioma del juego; 8 páginas EN, 7 swaps visuales EN y assets completos; reversión ES restaura assets y sincroniza preferencias.
- Mobile 390×844: controles de idioma visibles en Intro, Juego y Printables.
- Sin errores JavaScript en los gates finales.

## Seguridad

No se modificaron Crime Packs, Edge Functions, room state, timers, licencias, roles ni payloads multiplayer. Continúan vigentes EN1–EN5 y el smoke autenticado previo del core Impostor con 3 jugadores reales.

## Freeze

**EXP01-EN1 → EXP01-EN6: PASS.** La capa bilingüe de Caso 001 queda congelada como checkpoint de producción. Cualquier mejora posterior debe abrir una fase nueva.
"""

RELEASE_LINES = """Final bilingual checkpoint: EXP01-EN6 · Final Bilingual Release QA PASS
EN6 language continuity: Printables inherit global `expedientes_language`; legacy EN5 key retained as fallback and synchronized on change
EN6 entry-control hardening: upper Create/Join use one delegated wiring; inactive switches mode, active executes lower CTA; local + public browser smoke PASS
Final path QA: Portal EXP-001 → Cinema Intro → game → printables PASS locally and on public GitHub Pages
Final handoff QA: access/room/lang/skipintro/intro-v10 preserved
Final mobile QA: language controls visible at 390x844 on Intro, game and printables
Final safety: theory/last-room local state preserved · backend/multiplayer payloads unchanged
Bilingual release freeze: EXP01-EN1 through EXP01-EN6 PASS · production checkpoint frozen
"""

Path('caso001/EXP01_EN6_AUDIT.md').write_text(AUDIT, encoding='utf-8')
release = Path('caso001/RELEASE.txt')
current = release.read_text(encoding='utf-8')
if 'Final bilingual checkpoint: EXP01-EN6' not in current:
    if current and not current.endswith('\n'):
        current += '\n'
    current += RELEASE_LINES
    release.write_text(current, encoding='utf-8')

print('EXP01-EN6 freeze documents written')
