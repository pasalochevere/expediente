from pathlib import Path

# EXP01-EN6 functional hardening.
# Presentation/UI only: no Edge Functions, Crime Packs, timers, licenses,
# roles, room state or multiplayer payload schemas are modified.

# 1) Printables share the global language selected in Intro/Game.
p = Path('caso001/printables/i18n-en5.js')
s = p.read_text(encoding='utf-8')
if "GLOBAL_STORAGE_KEY='expedientes_language'" not in s:
    old = "const STORAGE_KEY='expedientes.c001.printables.lang';\nconst VALID_LANGS=new Set(['es','en']);"
    new = "const STORAGE_KEY='expedientes.c001.printables.lang';\nconst GLOBAL_STORAGE_KEY='expedientes_language';\nconst VALID_LANGS=new Set(['es','en']);"
    if old not in s:
        raise SystemExit('printable storage anchor missing')
    s = s.replace(old, new, 1)

    old = "if(persist){try{localStorage.setItem(STORAGE_KEY,next)}catch{}}"
    new = "if(persist){try{localStorage.setItem(STORAGE_KEY,next);localStorage.setItem(GLOBAL_STORAGE_KEY,next)}catch{}}"
    if old not in s:
        raise SystemExit('printable persist anchor missing')
    s = s.replace(old, new, 1)

    old = "  try{\n    const stored=localStorage.getItem(STORAGE_KEY);\n    if(VALID_LANGS.has(stored)) return stored;\n  }catch{}\n  return 'es';"
    new = "  try{\n    const globalStored=localStorage.getItem(GLOBAL_STORAGE_KEY);\n    if(VALID_LANGS.has(globalStored)) return globalStored;\n    const stored=localStorage.getItem(STORAGE_KEY);\n    if(VALID_LANGS.has(stored)) return stored;\n  }catch{}\n  return 'es';"
    if old not in s:
        raise SystemExit('printable initialLanguage anchor missing')
    s = s.replace(old, new, 1)
p.write_text(s, encoding='utf-8')

# 2) Make upper Create / Join behavior symmetrical and resilient.
p = Path('caso001/p2-multiplayer-adapter.js')
s = p.read_text(encoding='utf-8')
start = s.index('function wireUpperEntryActions(){')
end = s.index('\nfunction hydrateEntryUi(){', start)
new_function = """function wireUpperEntryActions(){
  if(typeof document==='undefined') return;
  const root=document.documentElement;
  if(root?.dataset?.pcUpperEntryDelegated==='1') return;
  if(root?.dataset) root.dataset.pcUpperEntryDelegated='1';

  // Un único handler delegado evita diferencias entre Crear y Unirse.
  document.addEventListener('click',(event)=>{
    const raw=event.target;
    const upper=raw instanceof Element?raw.closest('#tabCreate,#tabJoin'):null;
    if(!(upper instanceof HTMLButtonElement)) return;

    // Inactivo: el handler original sólo cambia de pestaña.
    if(!upper.classList.contains('active')) return;

    // Activo: ejecuta exactamente el CTA inferior correspondiente.
    const lower=document.getElementById('enterRoom');
    if(!(lower instanceof HTMLButtonElement)||lower.disabled) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    lower.click();
  },true);
}
"""
s = s[:start] + new_function + s[end:]
p.write_text(s, encoding='utf-8')

print('EXP01-EN6 patches applied')
