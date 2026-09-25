// CASO 001 · P2.12D.17 · Adaptador multiplayer real
// Recupera los modos NORMAL e IMPOSTOR sobre el motor P2 existente.

export const P2_CONFIG = Object.freeze({
  supabaseUrl: 'https://fzbndgfnqxcacsvlitui.supabase.co',
  supabaseKey: 'sb_publishable_bJ91vnQUWHfFqWRO99fFkQ_dh0icDxo',
  functions: {
    createRoom: 'expediente-create-room',
    joinRoom: 'expediente-p2-join-room',
    roomView: 'expediente-p2-room-view',
    startGame: 'expediente-p2-start-game',
    privateView: 'expediente-p2-private',
    action: 'expediente-p2-game-action'
  }
});

export const P2_LABELS = Object.freeze({
  characters: ['Santiago','Clara','Vera','Mateo','Inés','Tomás'],
  characterIds: ['SANTIAGO','CLARA','VERA','MATEO','INES','TOMAS'],
  locations: ['Sala de estar','Cocina','Estudio','Dormitorio','Jardín / exterior','Pasillo / acceso'],
  objects: ['Arma','Cuaderno','Celular','Llave','Memoria USB','Pañuelo']
});

export const P2_MODES = Object.freeze({
  dig: {
    label: 'Investigación normal',
    short: 'NORMAL',
    description: 'Todos investigan. El responsable puede ser humano o NPC. Duración base: 35 min.'
  },
  imp: {
    label: 'Modo Impostor',
    short: 'IMPOSTOR',
    description: 'Uno de los jugadores humanos recibe en secreto el rol de impostor y debe proteger su mentira central. Duración base: 30 min.'
  }
});

function hydrateModeSelector(){
  if(typeof document==='undefined') return;
  const select=document.getElementById('mode');
  if(!(select instanceof HTMLSelectElement)) return;

  const normal=select.querySelector('option[value="dig"]')||document.createElement('option');
  normal.value='dig';
  normal.textContent=P2_MODES.dig.label;
  if(!normal.parentNode) select.appendChild(normal);

  let impostor=select.querySelector('option[value="imp"]');
  if(!impostor){
    impostor=document.createElement('option');
    impostor.value='imp';
    select.appendChild(impostor);
  }
  impostor.textContent=P2_MODES.imp.label;

  let help=document.getElementById('modeHelp');
  if(!help){
    help=document.createElement('div');
    help.id='modeHelp';
    help.className='muted';
    help.style.cssText='font-size:11px;line-height:1.45;margin-top:7px;padding:8px 10px;border-left:3px solid #6b5435;background:#100e0c';
    select.insertAdjacentElement('afterend',help);
  }
  const render=()=>{
    const meta=P2_MODES[select.value]||P2_MODES.dig;
    help.innerHTML=`<strong style="color:#d7b675">${meta.short}</strong> · ${meta.description}`;
  };
  select.removeEventListener('change',select.__pcModeChangeHandler||(()=>{}));
  select.__pcModeChangeHandler=render;
  select.addEventListener('change',render);
  render();
}

if(typeof document!=='undefined'){
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',hydrateModeSelector,{once:true});
  else queueMicrotask(hydrateModeSelector);
}

// IMPORTANTE: Portal y juego deben compartir exactamente el mismo ID físico.
const DEVICE_KEY='pc_device_id';
const LEGACY_DEVICE_KEY='pc_exp_device_id_v1';
const LAST_ROOM_KEY='pc_exp_p2_last_room';
const LICENSE_KEYS=['pc_exp_license_key','pc_license_key','pc_exp_license','exp_license_key'];

function stableDeviceId(){
  let id=localStorage.getItem(DEVICE_KEY);
  if(!id){
    // Compatibilidad: si el juego ya había creado un ID antes del Portal unificado,
    // lo migramos al nombre compartido para no consumir otro cupo.
    id=localStorage.getItem(LEGACY_DEVICE_KEY);
    if(!id) id=(globalThis.crypto?.randomUUID?.()||`web-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    localStorage.setItem(DEVICE_KEY,id);
  }
  return id;
}

export function findStoredLicense(){
  for(const key of LICENSE_KEYS){
    const value=String(localStorage.getItem(key)||'').trim();
    if(value) return value;
  }
  return '';
}

export function saveStoredLicense(value){
  const v=String(value||'').trim();
  if(v) localStorage.setItem(LICENSE_KEYS[0],v);
}

export function lastRoomCode(){return String(localStorage.getItem(LAST_ROOM_KEY)||'').trim().toUpperCase()}
export function saveLastRoomCode(code){if(code)localStorage.setItem(LAST_ROOM_KEY,String(code).trim().toUpperCase())}
export function clearLastRoomCode(){localStorage.removeItem(LAST_ROOM_KEY)}

export function remainingSeconds(publicState){
  if(!publicState) return 0;
  if(publicState.paused && Number.isFinite(Number(publicState.paused_remaining_seconds))) return Math.max(0,Math.floor(Number(publicState.paused_remaining_seconds)));
  const start=Date.parse(publicState.started_at||'');
  const duration=Number(publicState.duration_seconds||0);
  if(!Number.isFinite(start)||!Number.isFinite(duration)||duration<=0) return 0;
  return Math.max(0,Math.ceil((start+duration*1000-Date.now())/1000));
}

export function formatClock(seconds){
  const n=Math.max(0,Math.floor(Number(seconds)||0));
  return `${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;
}

export class P2MultiplayerAdapter{
  constructor(config=P2_CONFIG){
    this.config=config;
    this.sb=null;
    this.user=null;
    this.roomId=null;
    this.channel=null;
    this.changeHandler=null;
    this.refreshTimer=null;
    this.fallbackTickTimer=null;
  }

  async init(){
    if(!globalThis.supabase?.createClient) throw new Error('No se cargó Supabase JS.');
    this.sb=globalThis.supabase.createClient(this.config.supabaseUrl,this.config.supabaseKey,{
      auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}
    });
    let {data:{session}}=await this.sb.auth.getSession();
    if(!session){
      const {error}=await this.sb.auth.signInAnonymously();
      if(error) throw error;
      ({data:{session}}=await this.sb.auth.getSession());
    }
    const {data:{user},error}=await this.sb.auth.getUser();
    if(error||!user) throw error||new Error('No pude iniciar la sesión.');
    this.user=user;
    return user;
  }

  async invoke(name,body={}){
    if(!this.sb) throw new Error('Adaptador no inicializado.');
    const {data,error}=await this.sb.functions.invoke(name,{body});
    if(error){
      let detail='';
      try{detail=await error.context?.json?.();}catch{}
      const msg=typeof detail==='object'&&detail?.error?detail.error:error.message;
      throw new Error(msg||'Error de comunicación con el servidor.');
    }
    if(data?.ok===false) throw new Error(data.error||'La operación fue rechazada.');
    return data;
  }

  async createRoom({licenseKey,displayName,characterIndex,mode='dig'}){
    saveStoredLicense(licenseKey);
    const data=await this.invoke(this.config.functions.createRoom,{
      license_key:String(licenseKey||'').trim(),
      device_id:stableDeviceId(),
      display_name:String(displayName||'Jugador 1').trim(),
      character_index:Number(characterIndex),
      mode:mode==='imp'?'imp':'dig'
    });
    this.roomId=data.room?.id||null;
    if(data.room?.code) saveLastRoomCode(data.room.code);
    return data;
  }

  async joinRoom({code,displayName,characterIndex}){
    const data=await this.invoke(this.config.functions.joinRoom,{
      code:String(code||'').trim().toUpperCase(),
      display_name:String(displayName||'Jugador').trim(),
      character_index:Number(characterIndex)
    });
    this.roomId=data.room?.id||null;
    if(data.room?.code) saveLastRoomCode(data.room.code);
    return data;
  }

  async roomView(roomId=this.roomId){
    if(!roomId) throw new Error('No hay sala activa.');
    this.roomId=roomId;
    return this.invoke(this.config.functions.roomView,{room_id:roomId});
  }

  async privateView(roomId=this.roomId){
    if(!roomId) throw new Error('No hay sala activa.');
    return this.invoke(this.config.functions.privateView,{room_id:roomId});
  }

  async startGame(roomId=this.roomId){
    if(!roomId) throw new Error('No hay sala activa.');
    return this.invoke(this.config.functions.startGame,{room_id:roomId});
  }

  async action(action,payload={},roomId=this.roomId){
    if(!roomId) throw new Error('No hay sala activa.');
    return this.invoke(this.config.functions.action,{room_id:roomId,action,payload});
  }

  onChange(handler){this.changeHandler=handler}

  async subscribe(roomId=this.roomId){
    if(!this.sb||!roomId) return;
    await this.unsubscribe();
    this.roomId=roomId;
    const notify=()=>{
      clearTimeout(this.refreshTimer);
      this.refreshTimer=setTimeout(()=>this.changeHandler?.(),120);
    };
    const channel=this.sb.channel(`p2-room-${roomId}-${Math.random().toString(36).slice(2)}`);
    channel
      .on('postgres_changes',{event:'*',schema:'public',table:'exp_players',filter:`room_id=eq.${roomId}`},notify)
      .on('postgres_changes',{event:'*',schema:'public',table:'exp_rooms',filter:`id=eq.${roomId}`},notify)
      .on('postgres_changes',{event:'*',schema:'public',table:'exp_room_state',filter:`room_id=eq.${roomId}`},notify)
      .on('postgres_changes',{event:'*',schema:'public',table:'exp_events',filter:`room_id=eq.${roomId}`},notify)
      .subscribe();
    this.channel=channel;
    clearInterval(this.fallbackTickTimer);
    this.fallbackTickTimer=setInterval(()=>{
      if(this.roomId===roomId) this.action('tick',{},roomId).catch(()=>{});
    },45000);
  }

  async unsubscribe(){
    clearTimeout(this.refreshTimer);
    clearInterval(this.fallbackTickTimer);
    this.fallbackTickTimer=null;
    if(this.sb&&this.channel){try{await this.sb.removeChannel(this.channel)}catch{}}
    this.channel=null;
  }
}
