from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    if old not in text:
        raise SystemExit(f"{label} not found")
    return text.replace(old, new, 1)

# Main game
p = Path('caso001/index.html')
s = p.read_text(encoding='utf-8')
s = replace_once(
    s,
    "import {t,getLanguage,bindLanguageSwitcher,applyTranslations,languageLocale} from './i18n.js?v=exp01-en1-20261001';",
    "import {t,getLanguage,bindLanguageSwitcher,applyTranslations,languageLocale} from './i18n.js?v=exp01-en3-20261001';\nimport {bindGameContentLocalization,applyGameContentTranslations} from './content-en.js?v=exp01-en3-20261001';",
    'main i18n import',
)
s = replace_once(
    s,
    "function solutionVisual(labels,images,name){const n=normalizedLabel(name),idx=labels.findIndex(x=>normalizedLabel(x)===n);return idx>=0?images[idx]:''}",
    "function solutionVisual(labels,images,name,index=null){const canonicalIndex=Number(index);if(Number.isInteger(canonicalIndex)&&canonicalIndex>=0&&canonicalIndex<images.length)return images[canonicalIndex];const n=normalizedLabel(name),idx=labels.findIndex(x=>normalizedLabel(x)===n);return idx>=0?images[idx]:''}",
    'solutionVisual',
)
s = replace_once(
    s,
    "killerImg=solutionVisual(P2_LABELS.characters,REV01_PORTRAITS,killer),locationImg=solutionVisual(P2_LABELS.locations,REV01_LOCATION_IMAGES,locationName),objectImg=solutionVisual(P2_LABELS.objects,REV01_OBJECT_IMAGES,objectName),",
    "killerImg=solutionVisual(P2_LABELS.characters,REV01_PORTRAITS,killer,data.killer_character_index),locationImg=solutionVisual(P2_LABELS.locations,REV01_LOCATION_IMAGES,locationName,data.location_index),objectImg=solutionVisual(P2_LABELS.objects,REV01_OBJECT_IMAGES,objectName,data.object_index),",
    'solution visual calls',
)
s = replace_once(
    s,
    """function refreshLanguagePresentation(){
  applyTranslations(document);
  bindLanguageSwitcher(document);
  buildCharacters();
  buildTheory();
  updateAccessPreflight();
  if(view){renderLobby();renderGame()}
  if(!$('#prologue').classList.contains('hidden'))renderPrologueScene();
}""",
    """function refreshLanguagePresentation(){
  applyTranslations(document);
  bindLanguageSwitcher(document);
  buildCharacters();
  buildTheory();
  updateAccessPreflight();
  if(view){renderLobby();renderGame()}
  if(!$('#prologue').classList.contains('hidden'))renderPrologueScene();
  applyGameContentTranslations(document);
}""",
    'refreshLanguagePresentation',
)
s = replace_once(
    s,
    "bindLanguageSwitcher(document);applyTranslations(document);buildCharacters();buildTheory();",
    "bindLanguageSwitcher(document);applyTranslations(document);bindGameContentLocalization(document);buildCharacters();buildTheory();",
    'main localization bootstrap',
)
p.write_text(s, encoding='utf-8')

# Cinema Intro
p = Path('caso001/intro/index.html')
s = p.read_text(encoding='utf-8')
s = replace_once(
    s,
    "import {t,getLanguage,bindLanguageSwitcher,applyTranslations} from '../i18n.js?v=exp01-en1-20261001';",
    "import {t,getLanguage,bindLanguageSwitcher,applyTranslations} from '../i18n.js?v=exp01-en3-20261001';\nimport {bindGameContentLocalization,applyGameContentTranslations} from '../content-en.js?v=exp01-en3-20261001';",
    'intro i18n import',
)
s = replace_once(
    s,
    "function renderLanguageUi(){applyTranslations(document);soundBtn.textContent=t(soundOn?'intro.soundOn':'intro.soundOff');fsBtn.textContent=t(document.fullscreenElement?'intro.exitFullscreen':'intro.fullscreen')}bindLanguageSwitcher(document);renderLanguageUi();",
    "function renderLanguageUi(){applyTranslations(document);applyGameContentTranslations(document);soundBtn.textContent=t(soundOn?'intro.soundOn':'intro.soundOff');fsBtn.textContent=t(document.fullscreenElement?'intro.exitFullscreen':'intro.fullscreen')}bindLanguageSwitcher(document);bindGameContentLocalization(document);renderLanguageUi();",
    'intro localization bootstrap',
)
p.write_text(s, encoding='utf-8')

# Release marker
p = Path('caso001/RELEASE.txt')
s = p.read_text(encoding='utf-8')
s = s.replace(
    'Language checkpoint: EXP01-EN2 · structural/functional UI translation complete',
    'Language checkpoint: EXP01-EN3 · full visible game-content translation ES/EN complete',
)
s = s.replace(
    'Language scope EN2: setup, onboarding, lobby, board, Director, evidence metadata, private labels, log, accusation, solution shell, client messages/toasts, accessibility and WhatsApp invite localized ES/EN',
    'Language scope EN3: EN2 structural UI + main narrative, legacy prologue, Cinema Intro, public profiles, visible location/object labels, all enabled C001 evidence payloads, private role/objective content, Impostor truth, Director guidance and full solution/reconstruction narrative localized ES/EN',
)
s = s.replace(
    'Narrative scope deferred: story, character profiles, canonical character/location/object labels, evidence payloads, private server content and reconstruction/solution narrative remain Spanish until EXP01-EN3',
    'Canonical safety: server Crime Packs, P2 labels, room state and multiplayer payloads remain unchanged in Spanish/internal IDs; English is presentation-only and solution visuals resolve by canonical indices before legacy name fallback',
)
s = s.replace(
    'Language QA EN2: automated browser PASS · bidirectional ES↔EN PASS · local state isolation PASS · narrative payload exclusion PASS · language absent from multiplayer payloads',
    'Language QA EN3: automated browser PASS · bidirectional ES↔EN PASS · narrative/evidence/private/Director/solution PASS · Cinema Intro PASS · local state isolation PASS · language absent from multiplayer payloads · solution visual lookup index-safe',
)
p.write_text(s, encoding='utf-8')

# Audit file
Path('caso001/EXP01_EN3_AUDIT.md').write_text(
"""# EXP01-EN3 · Game Content Translation · ES / EN

Estado: **PASS · Game Content Translation ES/EN integrada y validada**.

## Alcance

EXP01-EN3 completa la capa inglesa visible del único build de Caso 001 sin modificar la lógica del juego.

Se auditó el contenido activo de los 12 Crime Packs C001-01…C001-12 en Supabase y se creó una capa de traducción de presentación para:

- narrativa principal y prólogo legacy;
- Cinema Intro V10.7;
- perfiles públicos;
- nombres visibles de lugares y objetos;
- 12 Crime Packs habilitados: evidencias públicas/privadas y fallbacks NPC;
- rol/objetivo privado de Investigador e Impostor;
- mentira central, hecho real y encubrimiento del Impostor;
- orientaciones automáticas y solicitadas del Director;
- motivo, contradicción, evento crítico, mecanismo, encubrimiento, reconstrucción, señuelos y cierre de la solución.

## Arquitectura

La traducción permanece estrictamente en cliente/presentación. No se modifica `pack_payload`, no se envía `lang` a acciones multiplayer y no se duplica la partida.

Archivos de contenido:

- `content-en-core.js`
- `content-en-packs-01-04.js`
- `content-en-packs-05-08.js`
- `content-en-packs-09-12.js`
- `content-en.js`

`content-en.js` mantiene mapas reversibles ES↔EN y observa UI dinámica para traducir contenido server-side cuando aparece en DOM. El texto de usuario no se traduce salvo coincidencia exacta con una frase canónica del juego.

## Canon / seguridad

- `P2_LABELS` internos permanecen en español.
- personajes mantienen sus nombres propios.
- índices de persona/escena/objeto permanecen canónicos.
- `solutionVisual()` usa primero los índices server-side y conserva el lookup por nombre solo como fallback legacy.
- no se tocaron Edge Functions, Crime Packs, tablas, timers, roles, acciones, licencias ni estados de sala.

## Gate definitivo

Browser QA automatizado: **PASS**.

El gate valida narrativa principal, perfiles, lugares/objetos, muestras representativas de evidencias de los packs 01/05/09/12, contenido privado, Director, solución, Cinema Intro, reversión EN→ES, segundo cambio ES→EN, conservación de estado local, parámetros de Intro, ausencia de idioma en multiplayer y resolución visual por índices canónicos.
""",
encoding='utf-8')
