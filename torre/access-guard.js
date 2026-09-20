(() => {
  'use strict';

  const PORTAL = 'https://pasalochevere.github.io/expediente/portal-v2/';
  const SUPABASE_URL = 'https://fzbndgfnqxcacsvlitui.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_bJ91vnQUWHfFqWRO99fFkQ_dh0icDxo';
  const PRODUCT_CODE = 'TORRE-MEGA';
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

  function unlockGame() {
    document.getElementById('pc-access-gate')?.remove();
    document.documentElement.classList.remove('pc-access-pending');
    window.__PC_TORRE_ACCESS_OK__ = true;
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
      item.product_code === PRODUCT_CODE &&
      item.status === 'active' &&
      item.activation_code &&
      item.expires_at &&
      new Date(item.expires_at).getTime() > Date.now()
    );

    if (!license) {
      showGate('Esta cuenta no tiene una licencia activa para MEGA PACK VERDAD O RETO +800.', true);
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
