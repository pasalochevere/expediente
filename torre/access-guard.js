(() => {
  'use strict';

  const PORTAL = 'https://pasalochevere.github.io/expediente/portal-v2/';
  const SUPABASE_URL = 'https://fzbndgfnqxcacsvlitui.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_bJ91vnQUWHfFqWRO99fFkQ_dh0icDxo';
  const PRODUCT_CODES = new Set(['TORRE-MEGA', 'T5XL-001', 'MONSTER-001']);
  const DEVICE_KEY = 'pc_device_id';

  function getDeviceId() {
    let value = localStorage.getItem(DEVICE_KEY);
    if (!value) {
      value = crypto.randomUUID
        ? crypto.randomUUID()
        : `dev_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(DEVICE_KEY, value);
    }
    return value;
  }

  function getDeviceLabel() {
    const kind = navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Browser';
    return [navigator.platform || '', kind].filter(Boolean).join(' / ').slice(0, 150);
  }

  function showGate(message, failed = false) {
    let gate = document.getElementById('pc-access-gate');
    if (!gate) {
      gate = document.createElement('div');
      gate.id = 'pc-access-gate';
      document.body.appendChild(gate);
    }

    gate.replaceChildren();
    const box = document.createElement('div');
    box.className = 'pc-box';

    const brand = document.createElement('div');
    brand.className = 'pc-brand';
    brand.textContent = 'PASALOCHEVERE · ACCESO PERSONAL';

    const title = document.createElement('h1');
    title.textContent = failed ? 'Acceso requerido' : 'Validando tu acceso…';

    const spinner = document.createElement('div');
    spinner.className = 'pc-spin';
    if (failed) spinner.style.display = 'none';

    const text = document.createElement('p');
    text.textContent = message;

    box.append(brand, title, spinner, text);

    if (failed) {
      const link = document.createElement('a');
      link.href = PORTAL;
      link.textContent = 'IR AL PORTAL PASALOCHEVERE';
      box.appendChild(link);
    }

    gate.appendChild(box);
  }


  /* VR800-R05B — navegación de modos en la portada original.
     Se monta SOLO después de licencia + dispositivo verificados. */
  function mountVr800ModeChooser() {
    if (!/^\/expediente\/torre\/(?:index\.html)?$/.test(location.pathname)) return;
    const root = document.getElementById('master');
    const versionsHeading = root?.querySelector('.section-title');
    if (!root || !versionsHeading || document.getElementById('pc-vr800-mode-chooser')) return;
    const style = document.createElement('style');
    style.id = 'pc-vr800-mode-styles';
    style.textContent = [
      '#pc-vr800-mode-chooser{margin:22px 0 24px;padding:18px;border:2px solid #e7bc9f;border-radius:25px;background:linear-gradient(135deg,#fffaf4 4%,#fff2e7 48%,#f8e7de 100%);box-shadow:0 14px 32px rgba(84,45,37,.12);color:#251d1c}',
      '#pc-vr800-mode-chooser .pc-vr800-heading{margin:0 0 13px;display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}',
      '#pc-vr800-mode-chooser .pc-vr800-heading h2{margin:0;font-size:21px;letter-spacing:-.035em;line-height:1.15}',
      '#pc-vr800-mode-chooser .pc-vr800-tag{display:inline-flex;padding:6px 10px;border-radius:999px;background:#6a2036;color:#ffe5b7;font-size:10px;font-weight:950;letter-spacing:.08em}',
      '#pc-vr800-mode-chooser .pc-vr800-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}',
      '#pc-vr800-mode-chooser .pc-vr800-card{width:100%;appearance:none;display:flex;flex-direction:column;text-align:left;text-decoration:none;gap:7px;min-height:144px;padding:15px 14px;border-radius:17px;border:1px solid #dfd1c8;background:#fffdfb;color:#27211d;cursor:pointer;box-sizing:border-box;font:inherit;box-shadow:0 6px 15px rgba(0,0,0,.06);transition:transform .15s ease,box-shadow .15s ease}',
      '#pc-vr800-mode-chooser .pc-vr800-card:hover{transform:translateY(-2px);box-shadow:0 12px 26px rgba(70,35,25,.14)}',
      '#pc-vr800-mode-chooser .pc-vr800-card:focus-visible{outline:3px solid #2477bf;outline-offset:3px}',
      '#pc-vr800-mode-chooser .pc-vr800-card strong{font-size:15px;font-weight:950}',
      '#pc-vr800-mode-chooser .pc-vr800-card small{font-size:11.5px;line-height:1.35;color:#71645c;font-weight:600}',
      '#pc-vr800-mode-chooser .pc-vr800-icon{font-size:25px;line-height:1.1}',
      '#pc-vr800-mode-chooser .pc-vr800-card.roulette{background:linear-gradient(135deg,#361624,#6b253f);border-color:#a66a54;color:#fff4e2;box-shadow:0 9px 20px rgba(92,26,47,.17)}',
      '#pc-vr800-mode-chooser .pc-vr800-card.roulette small{color:#ead0c3}',
      '#pc-vr800-mode-chooser .pc-vr800-caption{display:block;margin-top:12px;color:#7b6255;font-size:11px;line-height:1.45}',
      '@media(max-width:400px){#pc-vr800-mode-chooser{padding:13px;margin:18px 0}#pc-vr800-mode-chooser .pc-vr800-grid{gap:8px}#pc-vr800-mode-chooser .pc-vr800-card{padding:11px;min-height:155px}#pc-vr800-mode-chooser .pc-vr800-card strong{font-size:13px}#pc-vr800-mode-chooser .pc-vr800-card small{font-size:10px}}',
      '@media(max-width:310px){#pc-vr800-mode-chooser .pc-vr800-grid{grid-template-columns:1fr}}'
    ].join('\n');
    document.head.appendChild(style);
    const section = document.createElement('section');
    section.id = 'pc-vr800-mode-chooser';
    section.setAttribute('aria-label', 'Elegí cómo jugar Verdad o Reto +800');
    section.innerHTML =
      '<div class="pc-vr800-heading"><h2>¿CÓMO QUERÉS JUGAR?</h2><span class="pc-vr800-tag">NUEVO MODO</span></div>' +
      '<div class="pc-vr800-grid">' +
      '<button type="button" class="pc-vr800-card classic"><span class="pc-vr800-icon" aria-hidden="true">🧱</span><strong>JUEGO CLÁSICO</strong><small>Elegí una de las cuatro versiones originales.</small></button>' +
      '<a class="pc-vr800-card roulette" href="./ruleta/"><span class="pc-vr800-icon" aria-hidden="true">🎡</span><strong>RULETA SIN ESCAPE</strong><small>Girás, descubrís y jugás. Incluye las 832 consignas.</small></a>' +
      '</div>' +
      '<span class="pc-vr800-caption">Ambos modos están incluidos en tu acceso actual. No necesitás activar otro código.</span>';
    versionsHeading.before(section);
    section.querySelector('.classic')?.addEventListener('click', () => {
      versionsHeading.scrollIntoView({behavior:'smooth',block:'start'});
    });
  }

  function unlockGame() {
    document.getElementById('pc-access-gate')?.remove();
    document.documentElement.classList.remove('pc-access-pending');
    window.__PC_TORRE_ACCESS_OK__ = true;
    mountVr800ModeChooser();
  }

  async function invokeAccess(sb, body) {
    const { data, error } = await sb.functions.invoke('pasalochevere-access', { body });
    if (!error && data && data.ok !== false) return data;

    let message = data?.error || error?.message || 'No se pudo validar el acceso.';
    try {
      if (error?.context) {
        const payload = await error.context.clone().json();
        if (payload?.error) message = payload.error;
      }
    } catch (_) {}
    throw new Error(message);
  }

  async function validateAccess() {
    showGate('Comprobando sesión, licencia y dispositivo.');

    if (!window.supabase) {
      throw new Error('No se pudo iniciar el validador de acceso.');
    }

    const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: true,
        detectSessionInUrl: true,
        autoRefreshToken: true
      }
    });

    const { data: sessionData, error: sessionError } = await sb.auth.getSession();
    if (sessionError || !sessionData.session) {
      location.replace(PORTAL);
      return;
    }

    let me;
    try {
      me = await invokeAccess(sb, { action: 'me' });
    } catch (_) {
      location.replace(PORTAL);
      return;
    }

    const license = (me.licenses || []).find((item) =>
      PRODUCT_CODES.has(item.product_code) &&
      item.status === 'active' &&
      item.activation_code &&
      item.expires_at &&
      new Date(item.expires_at).getTime() > Date.now()
    );

    if (!license) {
      showGate('Esta cuenta no tiene una licencia activa para VERDAD O RETO +800, MONSTER + DIGITAL o 5 EN 1 XL + DIGITAL.', true);
      return;
    }

    try {
      await invokeAccess(sb, {
        action: 'register_device',
        activation_code: license.activation_code,
        device_id: getDeviceId(),
        device_label: getDeviceLabel()
      });
    } catch (error) {
      showGate(error?.message || 'No se pudo validar este dispositivo.', true);
      return;
    }

    unlockGame();
  }

  window.addEventListener('DOMContentLoaded', () => {
    validateAccess().catch((error) => {
      console.error('PC_TORRE_ACCESS_GUARD', error);
      showGate('No se pudo validar el acceso. Entrá nuevamente desde tu Portal PasaloChevere.', true);
    });
  }, { once: true });
})();
