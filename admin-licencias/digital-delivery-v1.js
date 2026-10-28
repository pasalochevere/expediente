/* LIC-P2 - Extensión del Admin Maestro; no sustituye herramientas existentes */
(function(){
"use strict";
var root=document.getElementById("history");if(!root)return;
var esc=function(v){return String(v==null?"":v).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};
var $=function(id){return document.getElementById(id)};
var state={catalog:[],assets:[],events:[],licenses:[]};
var style=document.createElement("style");
style.textContent="#ddPanel{margin-top:20px}.dd-head{display:flex;justify-content:space-between;flex-wrap:wrap;gap:16px}.dd-head h2{margin:6px 0}.dd-note{color:#aeb3ba;font-size:13px;line-height:1.5}.dd-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:15px 0}.dd-kpis div{background:#1f2227;border:1px solid #343840;padding:13px;border-radius:12px}.dd-kpis b{display:block;font-size:23px}.dd-kpis small{color:#9ca0a7}.dd-tabs{display:flex;gap:8px;margin:14px 0;flex-wrap:wrap}.dd-tabs .selected{background:#f7941d;color:#151515}.dd-scroll{overflow-x:auto}.dd-table{width:100%;border-collapse:collapse;font-size:13px}.dd-table th{text-align:left;font-size:11px;text-transform:uppercase;color:#a5aab1;padding:9px}.dd-table td{border-top:1px solid #343840;padding:11px 9px;vertical-align:top}.dd-table small{display:block;color:#9ca0a7;margin-top:4px}.dd-pill{display:inline-block;border-radius:20px;padding:4px 9px;font-size:11px;background:#343840;color:#f6d67e}.dd-ok{color:#9ee0cf;background:#153c36}.dd-fail{color:#ffb8ae;background:#422929}.dd-upload{background:#191b20;padding:15px;border-radius:12px;margin:12px 0 19px;border:1px solid #343840}.dd-fields{display:grid;grid-template-columns:1.3fr 1.4fr auto;align-items:end;gap:10px}.dd-fields label{display:block;color:#a5aab1;margin-bottom:6px;font-size:12px}.dd-fields select,.dd-fields input,.dd-search{background:#101114;color:#fff;border:1px solid #454953;border-radius:9px;padding:10px;width:100%;min-width:0;font:inherit}.dd-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:5px 0}.dd-row .btn{padding:5px 10px;font-size:11px}.dd-tools{display:flex;gap:10px;justify-content:space-between;align-items:center;flex-wrap:wrap;margin-bottom:12px}.dd-search{max-width:350px}@media(max-width:700px){.dd-fields{grid-template-columns:1fr}.dd-kpis{grid-template-columns:repeat(2,1fr)}}";
document.head.appendChild(style);
var panel=document.createElement("section");panel.id="ddPanel";panel.className="card";
panel.innerHTML=[
'<div class="dd-head"><div><div class="eyebrow">LIC-P2 · ENTREGAS DIGITALES</div><h2>Control de productos y descargas</h2><p class="dd-note">Registro privado por licencia, archivo y número de operación. No modifica tus códigos ni etiquetas QR.</p></div><div><a href="../descargas/" target="_blank" rel="noopener" class="btn ghost">Portal del comprador</a> <button id="ddReload" class="btn">Actualizar</button></div></div>',
'<div class="msg" id="ddMsg">Cargando módulo de entregas…</div><div class="dd-kpis" id="ddKpis"></div>',
'<div class="dd-tabs"><button class="btn selected" id="ddCatalogTab">Catálogo y archivos</button><button class="btn" id="ddHistoryTab">Historial por comprador</button></div>',
'<div id="ddCatalogArea"><div class="dd-upload"><h3>Subir archivos privados</h3><p class="dd-note">Podés cargar PDF, ZIP, PNG o JPG de hasta 50 MB. La licencia activa habilitará las descargas desde el portal del comprador.</p><div class="dd-fields"><div><label for="ddProduct">Producto</label><select id="ddProduct"></select></div><div><label for="ddFile">Archivo</label><input id="ddFile" type="file" accept=".pdf,.zip,.png,.jpg,.jpeg"></div><button class="btn primary" id="ddUpload">Subir archivo</button></div><p id="ddUploadMsg" class="dd-note">Pendiente de seleccionar archivo.</p></div>',
'<div class="dd-scroll"><table class="dd-table"><thead><tr><th>Producto</th><th>Tipo</th><th>Licencias</th><th>Archivos y disponibilidad</th><th>Recibidos</th></tr></thead><tbody id="ddProducts"></tbody></table></div></div>',
'<div id="ddHistoryArea" style="display:none"><div class="dd-tools"><input id="ddSearch" class="dd-search" placeholder="Buscar pedido, email o producto"><button id="ddCsv" class="btn">Exportar CSV</button></div><p class="dd-note">“Recibido” indica que el navegador informó la recepción completa. No prueba que el archivo fue guardado, abierto o impreso.</p><div class="dd-scroll"><table class="dd-table"><thead><tr><th>Fecha</th><th>Producto / archivo</th><th>Comprador / operación</th><th>Estado</th></tr></thead><tbody id="ddEvents"></tbody></table></div></div>'
].join("");
root.closest("section.card").insertAdjacentElement("afterend",panel);
var setMessage=function(msg,bad){$("ddMsg").textContent=msg;$("ddMsg").className="msg "+(bad?"bad":"good")};
function explainError(value){if(typeof value==="string")return value;if(value&&typeof value==="object"){if(value.error)return explainError(value.error);if(typeof value.message==="string")return value.message;if(typeof value.error_description==="string")return value.error_description;if(typeof value.code==="string")return "Error de consulta ("+value.code+"). Reintentá."; }return "No se pudo completar la consulta. Reintentá."}
async function api(body){var r=await sb.functions.invoke("pasalochevere-digital-delivery",{body:body});if(r.error){var data;try{data=await r.error.context?.json()}catch(e){}throw new Error(explainError(data||r.error))}if(!r.data||!r.data.ok)throw new Error(explainError(r.data));return r.data}
function attempts(){var m=new Map();state.events.forEach(function(e){var v=m.get(e.attempt_id)||{license_id:e.license_id,asset_id:e.asset_id,date:e.created_at,status:"requested"};if(e.event_type==="received")v.status="received";else if(e.event_type==="failed"&&v.status!=="received")v.status="failed";if(e.event_type==="requested")v.date=e.created_at;m.set(e.attempt_id,v)});return Array.from(m.values())}
function dates(s){return s?new Date(s).toLocaleString("es-AR",{dateStyle:"short",timeStyle:"short"}):"—"}
function render(){
var list=attempts(),received=list.filter(function(e){return e.status==="received"}).length;
var downloads=state.catalog.filter(function(p){return p.delivery_type!=="app"});
$("ddKpis").innerHTML=[["Productos",state.catalog.length],["Descargables",downloads.length],["Archivos activos",state.assets.filter(function(a){return a.enabled}).length],["Recibidos",received]].map(function(x){return "<div><b>"+x[1]+"</b><small>"+esc(x[0])+"</small></div>"}).join("");
var selected=$("ddProduct").value;$("ddProduct").innerHTML=downloads.map(function(p){return '<option value="'+esc(p.product_code)+'">'+esc(p.title)+"</option>"}).join("");
if(downloads.some(function(p){return p.product_code===selected}))$("ddProduct").value=selected;
$("ddProducts").innerHTML=state.catalog.map(function(p){
var files=state.assets.filter(function(a){return a.product_code===p.product_code});
var licenses=state.licenses.filter(function(l){return l.product_code===p.product_code});
var count=list.filter(function(a){return a.status==="received"&&licenses.some(function(l){return l.id===a.license_id})}).length;
var fileHtml=files.length?files.map(function(a){return '<div class="dd-row"><span class="dd-pill '+(a.enabled?"dd-ok":"dd-fail")+'">'+(a.enabled?"Activo":"Suspendido")+"</span><span>"+esc(a.file_name)+"</span><small>"+(a.file_size/1048576).toFixed(1)+' MB</small><button class="btn ghost" data-asset="'+esc(a.id)+'" data-next="'+(!a.enabled)+'">'+(a.enabled?"Suspender":"Habilitar")+"</button></div>"}).join(""):p.delivery_type==="app"?'<span class="dd-note">Aplicación online</span>':'<span class="dd-pill">Pendiente de archivo</span>';
return "<tr><td><strong>"+esc(p.title)+"</strong><small>"+esc(p.product_code)+"</small></td><td>"+(p.delivery_type==="app"?"App":p.delivery_type==="mixed"?"Mixto":"PDF / ZIP")+"</td><td>"+licenses.length+"</td><td>"+fileHtml+"</td><td>"+(p.delivery_type==="app"?"—":count)+"</td></tr>"
}).join("");
panel.querySelectorAll("[data-asset]").forEach(function(btn){btn.onclick=function(){toggleAsset(btn.dataset.asset,btn.dataset.next==="true")}});
renderEvents()
}
function renderEvents(){
var q=$("ddSearch").value.trim().toLowerCase(),licenses=new Map(state.licenses.map(function(l){return [l.id,l]})),assets=new Map(state.assets.map(function(a){return [a.id,a]})),catalog=new Map(state.catalog.map(function(p){return [p.product_code,p]}));
var rows=attempts().filter(function(a){var l=licenses.get(a.license_id)||{},f=assets.get(a.asset_id)||{},p=catalog.get(l.product_code)||{};return [l.owner_email,l.order_ref,l.product_code,f.file_name,p.title].join(" ").toLowerCase().includes(q)});
$("ddEvents").innerHTML=rows.length?rows.map(function(a){var l=licenses.get(a.license_id)||{},f=assets.get(a.asset_id)||{},p=catalog.get(l.product_code)||{},label=a.status==="received"?"Recibido en navegador":a.status==="failed"?"Error de descarga":"Solicitud",cls=a.status==="received"?"dd-ok":a.status==="failed"?"dd-fail":"";
return "<tr><td>"+dates(a.date)+"</td><td><b>"+esc(p.title||l.product_code)+"</b><small>"+esc(f.file_name||"Archivo")+"</small></td><td>"+esc(l.owner_email||"Sin email")+"<small>"+esc(l.order_ref||"Sin operación")+'</small></td><td><span class="dd-pill '+cls+'">'+label+"</span></td></tr>"}).join(""):'<tr><td colspan="4" class="dd-note">No hay descargas registradas.</td></tr>'
}
async function refresh(){setMessage("Consultando catálogo y movimientos…");try{var auth=await sb.auth.getUser();if(!auth.data.user||auth.data.user.email.toLowerCase()!=="pasalochevere@gmail.com"){setMessage("Ingresá con la cuenta administradora.",true);return}var d=await api({action:"admin_overview"});state.catalog=d.catalog;state.assets=d.assets;state.events=d.events;state.licenses=d.licenses;render();setMessage("Información actualizada. Los productos sin archivo están pendientes de carga.")}catch(e){setMessage(e.message,true)}}
async function toggleAsset(id,next){if(!confirm(next?"¿Rehabilitar este archivo?":"¿Suspender nuevas descargas de este archivo?"))return;try{await api({action:"admin_toggle_asset",asset_id:id,enabled:next});await refresh()}catch(e){setMessage(e.message,true)}}
async function upload(){
var file=$("ddFile").files[0],product=$("ddProduct").value;if(!file||!product){$("ddUploadMsg").textContent="Elegí producto y archivo.";return}
var btn=$("ddUpload");btn.disabled=true;
try{$("ddUploadMsg").textContent="Preparando subida privada…";var data=await api({action:"admin_prepare_upload",product_code:product,file_name:file.name,file_size:file.size});$("ddUploadMsg").textContent="Subiendo archivo…";var r=await sb.storage.from(data.bucket).uploadToSignedUrl(data.path,data.token,file,{contentType:file.type||"application/pdf"});if(r.error)throw r.error;await api({action:"admin_finish_upload",product_code:data.product_code,path:data.path,file_name:data.file_name});$("ddFile").value="";$("ddUploadMsg").textContent="Archivo habilitado correctamente.";await refresh()}catch(e){$("ddUploadMsg").textContent="Error: "+e.message}finally{btn.disabled=false}}
function exportCsv(){var ls=new Map(state.licenses.map(function(v){return [v.id,v]})),as=new Map(state.assets.map(function(v){return [v.id,v]})),ps=new Map(state.catalog.map(function(v){return [v.product_code,v]}));var quote=function(s){return '"'+String(s||"").replace(/"/g,'""')+'"'};var rows=[["Fecha","Producto","Archivo","Email","Operacion","Estado"].map(quote).join(",")];attempts().forEach(function(e){var l=ls.get(e.license_id)||{},a=as.get(e.asset_id)||{},p=ps.get(l.product_code)||{};rows.push([e.date,p.title,a.file_name,l.owner_email,l.order_ref,e.status].map(quote).join(","))});var url=URL.createObjectURL(new Blob(["\ufeff"+rows.join("\r\n")],{type:"text/csv;charset=utf-8"}));var a=document.createElement("a");a.href=url;a.download="PasaloChevere_Descargas.csv";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url)}
$("ddCatalogTab").onclick=function(){$("ddCatalogArea").style.display="";$("ddHistoryArea").style.display="none";this.classList.add("selected");$("ddHistoryTab").classList.remove("selected")};
$("ddHistoryTab").onclick=function(){$("ddCatalogArea").style.display="none";$("ddHistoryArea").style.display="";this.classList.add("selected");$("ddCatalogTab").classList.remove("selected")};
$("ddReload").onclick=refresh;$("ddUpload").onclick=upload;$("ddSearch").oninput=renderEvents;$("ddCsv").onclick=exportCsv;
sb.auth.onAuthStateChange(function(_ev,session){if(session&&session.user&&session.user.email&&session.user.email.toLowerCase()==="pasalochevere@gmail.com")refresh()});
refresh();
})();

/* LIC-P3 · Fichas y vinculación de clientes. Aditivo: no cambia la titularidad de las licencias. */
(function(){
"use strict";
var base=document.getElementById("ddPanel");
if(!base||typeof sb==="undefined")return;
var state={catalog:[],licenses:[],assignments:[],events:[],assets:[],products:[]},selected=null,limit=30,created=null;
var el=function(id){return document.getElementById(id)};
var esc=function(x){return String(x==null?"":x).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};
var date=function(v){return v?new Date(v).toLocaleString("es-AR",{dateStyle:"short",timeStyle:"short"}):"—"};
var style=document.createElement("style");
style.textContent='#crPanel{margin-top:20px}#crPanel h3{margin:15px 0 10px}#crPanel .cr-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}#crPanel .cr-grid.three{grid-template-columns:repeat(3,minmax(0,1fr))}#crPanel label{display:block;color:#aab0bb;font-size:12px;margin-bottom:5px}#crPanel input,#crPanel select,#crPanel textarea{background:#0f1114;color:#fff;border:1px solid #454953;border-radius:9px;padding:11px;width:100%;min-width:0;font:inherit}#crPanel textarea{min-height:85px;resize:vertical}#crPanel .cr-box{border:1px solid #343840;background:#1a1c21;border-radius:14px;padding:15px;margin:15px 0}#crPanel .cr-note{font-size:13px;color:#acb2be;line-height:1.6}#crPanel .cr-actions{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}#crPanel .cr-scroll{overflow:auto;max-height:490px}#crPanel table{width:100%;border-collapse:collapse;font-size:13px}#crPanel th{text-align:left;color:#aab0bb;font-size:11px;padding:10px}#crPanel td{border-top:1px solid #343840;padding:10px;vertical-align:top}#crPanel td small{display:block;color:#aab0bb;margin-top:4px}#crPanel .cr-code{font:800 16px ui-monospace,monospace;color:#f6d67e;word-break:break-word}#crPanel .cr-top{display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap}#crPanel [hidden]{display:none!important}#crPanel .cr-pill{font-size:11px;padding:5px 8px;border-radius:12px;background:#35413c;color:#a9e5d2}#crPanel .cr-card{padding:12px;border:1px solid #383d45;border-radius:10px;background:#212429}#crPanel .cr-card strong{display:block;margin-top:6px;word-break:break-word}@media(max-width:740px){#crPanel .cr-grid,#crPanel .cr-grid.three{grid-template-columns:1fr}}';
document.head.appendChild(style);
var panel=document.createElement("section");panel.id="crPanel";panel.className="card";
panel.innerHTML='<div class="cr-top"><div><div class="eyebrow">LIC-P3 · CLIENTES Y ENTREGAS</div><h2>Ficha individual del comprador</h2><p class="cr-note">Relacioná cada venta, su licencia y las descargas realizadas. El contacto no activa la licencia.</p></div><button id="crRefresh" class="btn ghost" type="button">Actualizar fichas</button></div>'
+'<div class="msg" id="crMsg">Cargando…</div>'
+'<div class="cr-box"><h3>Asignar una entrega a un comprador</h3><p class="cr-note">Genera un código o recupera el existente para el mismo producto y operación. Para Mercado Libre solo necesitás el número de venta; el contacto es opcional.</p>'
+'<div class="cr-grid three"><div><label for="crProduct">Producto</label><select id="crProduct"></select></div><div><label for="crChannel">Canal</label><select id="crChannel"><option value="ML">Mercado Libre</option><option value="TN">Tienda Nube</option><option value="ETSY">Etsy</option><option value="DIRECT">Venta directa</option><option value="RETAIL">Juguetería</option><option value="WHOLESALE">Mayorista</option><option value="EVENT">Feria / Evento</option><option value="OTHER">Otro</option></select></div><div><label for="crSale" id="crSaleLabel">Número de venta ML (16 dígitos)</label><input id="crSale" autocomplete="off" inputmode="numeric" maxlength="80" placeholder="2000018505705824"/></div></div>'
+'<div class="cr-grid" style="margin-top:12px"><div><label for="crName">Nombre o alias (opcional)</label><input id="crName" maxlength="100" placeholder="Nombre del comprador"/></div><div><label for="crContact">Email de contacto (opcional)</label><input id="crContact" maxlength="254" type="email" placeholder="Solo si fue proporcionado"/></div><div><label for="crBuyerId">ID comprador (opcional)</label><input id="crBuyerId" maxlength="100" placeholder="Identificador de la plataforma"/></div><div><label for="crNote">Nota interna (opcional)</label><input id="crNote" maxlength="500" placeholder="Entrega / reclamo"/></div></div>'
+'<div class="cr-actions"><button class="btn primary" id="crCreate" type="button">Crear o recuperar licencia + asociar</button></div><div class="cr-box" id="crCreated" hidden></div></div>'
+'<div class="cr-top"><div><h3>Ventas existentes</h3><p class="cr-note" id="crCount"></p></div><input id="crSearch" style="max-width:340px" placeholder="Buscar número, producto, cliente o código"/></div>'
+'<div class="cr-scroll"><table><thead><tr><th>Operación y producto</th><th>Comprador</th><th>Estado</th><th>Descargas</th><th></th></tr></thead><tbody id="crRows"></tbody></table></div>'
+'<div class="cr-actions"><button class="btn" id="crMore" type="button" hidden>Ver más ventas</button></div><div class="cr-box" id="crDetail" hidden></div>';
base.insertAdjacentElement("afterend",panel);
function notice(v,bad){el("crMsg").textContent=v;el("crMsg").className="msg "+(bad?"bad":"good")}
function errorText(v){if(typeof v==="string")return v;if(v&&typeof v.error==="string")return v.error;if(v&&typeof v.message==="string")return v.message;return "No se pudo completar la operación."}
async function api(slug,body){var r=await sb.functions.invoke(slug,{body:body});if(r.error){var data;try{data=await r.error.context?.json()}catch(_){}throw new Error(errorText(data||r.error))}if(!r.data||!r.data.ok)throw new Error(errorText(r.data));return r.data}
function license(id){return state.licenses.find(function(l){return l.id===id})}
function assignment(id){return state.assignments.find(function(a){return a.license_id===id})||{}}
function product(code){return state.catalog.find(function(p){return p.product_code===code})||{}}
function events(id){
 var grouped=new Map();
 state.events.filter(function(e){return e.license_id===id}).forEach(function(e){
  var x=grouped.get(e.attempt_id)||{asset_id:e.asset_id,created_at:e.created_at,status:"requested"};
  if(e.event_type==="received")x.status="received";
  if(e.event_type==="failed"&&x.status!=="received")x.status="failed";
  if(e.event_type==="requested")x.created_at=e.created_at;
  grouped.set(e.attempt_id,x)
 });
 var rows=[...grouped.values()].sort(function(a,b){return Date.parse(b.created_at)-Date.parse(a.created_at)});
 return {rows:rows,received:rows.filter(function(e){return e.status==="received"}).length}
}
function status(l){if(l.status==="revoked")return "Revocada";if(l.status==="available")return "Sin activar";if(l.status==="active"&&l.expires_at&&Date.parse(l.expires_at)<Date.now())return "Vencida";return l.status==="active"?"Activa":l.status}
function renderList(){
 var q=el("crSearch").value.trim().toLowerCase(),rows=state.licenses.filter(function(l){
 var a=assignment(l.id),p=product(l.product_code);
 return [l.order_ref,l.license_key,l.product_code,p.title,l.owner_email,a.buyer_name,a.contact_email,a.marketplace_buyer_id].join(" ").toLowerCase().includes(q)});
 el("crCount").textContent=rows.length+" ventas encontradas (hasta las últimas 500 licencias del sistema).";
 el("crRows").innerHTML=rows.slice(0,limit).map(function(l){
  var a=assignment(l.id),p=product(l.product_code),d=events(l.id);
  return '<tr><td><strong>'+esc(l.order_ref||"Sin referencia")+'</strong><small>'+esc(p.title||l.product_code)+'</small></td><td>'+esc(a.buyer_name||a.marketplace_buyer_id||l.owner_email||"Sin contacto")+'<small>'+esc(a.contact_email||"")+'</small></td><td><span class="cr-pill">'+esc(status(l))+'</span></td><td>'+d.received+' recibidas<small>'+d.rows.length+' solicitudes</small></td><td><button type="button" class="btn ghost" data-cr-id="'+esc(l.id)+'">Abrir ficha</button></td></tr>'
 }).join("")||'<tr><td colspan="5" class="cr-note">No hay ventas que coincidan con la búsqueda.</td></tr>';
 el("crMore").hidden=rows.length<=limit;
 panel.querySelectorAll("[data-cr-id]").forEach(function(b){b.onclick=function(){openDetail(b.dataset.crId,true)}});
}
function renderProducts(){
 var current=el("crProduct").value;
 var valid=new Set(state.products.map(function(p){return p.product_code}));
 var items=state.catalog.filter(function(p){return valid.has(p.product_code)});
 el("crProduct").innerHTML=items.map(function(p){return '<option value="'+esc(p.product_code)+'">'+esc(p.title)+'</option>'}).join("");
 if(items.some(function(p){return p.product_code===current}))el("crProduct").value=current;
 el("crCreate").disabled=!items.length
}
async function refresh(){
 notice("Cargando fichas…");
 try{
  var u=await sb.auth.getUser();if(u.data.user?.email?.toLowerCase()!=="pasalochevere@gmail.com")throw new Error("Ingresá con la cuenta administradora.");
  var r=await api("pasalochevere-digital-delivery",{action:"admin_overview"});
  var cfg=await api("pasalochevere-admin-license",{action:"config"});
  Object.assign(state,{catalog:r.catalog||[],assets:r.assets||[],events:r.events||[],licenses:r.licenses||[],assignments:r.assignments||[],products:cfg.products||[]});
  renderProducts();renderList();if(selected&&license(selected))openDetail(selected,false);
  notice("Fichas actualizadas. Nombre y correo son datos de contacto; no habilitan descargas.");
 }catch(e){notice(e.message||String(e),true)}
}
function access(l){return "https://pasalochevere.github.io/expediente/acceso/?code="+encodeURIComponent(l.license_key)}
function buyerMessage(l){return "¡Gracias por tu compra en PasaloChévere!\nProducto: "+(product(l.product_code).title||l.product_code)+"\nCódigo: "+l.license_key+"\nActivá tu producto: "+access(l)+"\n\nPara archivos imprimibles, después de activar ingresá a https://pasalochevere.github.io/expediente/descargas/"}
async function copy(t){try{await navigator.clipboard.writeText(t)}catch(_){var e=document.createElement("textarea");e.value=t;document.body.appendChild(e);e.select();document.execCommand("copy");e.remove()}}
function createdView(l,reused){
 created=l;el("crCreated").hidden=false;el("crCreated").innerHTML='<h3>'+(reused?"Código de una venta existente":"Nueva licencia creada")+'</h3><p class="cr-code">'+esc(l.license_key)+'</p><div class="cr-actions"><button id="crCopyCode" class="btn primary">Copiar código</button><button id="crCopyBuyer" class="btn">Copiar mensaje al comprador</button><button id="crJump" class="btn">Abrir ficha</button></div><p class="cr-note">El comprador deberá activar este código desde su cuenta verificada.</p>';
 el("crCopyCode").onclick=function(){copy(l.license_key);this.textContent="Copiado"};
 el("crCopyBuyer").onclick=function(){copy(buyerMessage(l));this.textContent="Mensaje copiado"};
 el("crJump").onclick=function(){openDetail(l.id,true)};
}
async function create(){
 var ref=el("crSale").value.trim(),channel=el("crChannel").value,code=el("crProduct").value,
 name=el("crName").value.trim(),email=el("crContact").value.trim(),buyerId=el("crBuyerId").value.trim(),note=el("crNote").value.trim();
 if(!ref||!code){notice("Seleccioná producto y número de venta.",true);return}
 if(channel==="ML"&&!/^\d{16}$/.test(ref)){notice("Mercado Libre requiere un número de venta de 16 dígitos.",true);return}
 if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){notice("Email de contacto inválido.",true);return}
 var b=el("crCreate"),l=null,reused=false;b.disabled=true;
 try{
  notice("Generando o recuperando el código sin duplicar la operación…");
  // Este correo es SOLO para contacto. Nunca se remite al generador como owner_email.
  var result=await api("pasalochevere-admin-license",{action:"create_license",product_code:code,channel:channel,sale_ref:ref,access_kind:"commercial"});
  l=result.license;reused=!!result.reused;
  if(!l?.id||!l?.license_key)throw new Error("No se recibió una licencia completa.");
  if(name||email||buyerId||note)await api("pasalochevere-digital-delivery",{action:"customer_assign",license_id:l.id,buyer_name:name,contact_email:email,marketplace_buyer_id:buyerId,delivery_note:note});
  createdView(l,reused);await refresh();
  notice(reused?"Se recuperó la licencia existente y se asociaron los datos.":"Licencia creada y datos vinculados. Enviá el código al comprador.");
 }catch(e){if(l)createdView(l,reused);notice((l?"El código existe, pero el contacto no pudo guardarse: ":"")+(e.message||String(e)),true)}
 finally{b.disabled=false}
}
function openDetail(id,scroll){
 var l=license(id);if(!l)return;selected=id;
 var a=assignment(id),p=product(l.product_code),d=events(id),files=new Map(state.assets.map(function(x){return [x.id,x]}));
 var history=d.rows.map(function(x){var f=files.get(x.asset_id)||{};return '<tr><td>'+date(x.created_at)+'</td><td>'+esc(f.file_name||"Archivo")+'</td><td>'+esc(x.status==="received"?"Recibido en navegador":x.status==="failed"?"Fallido":"Solicitado")+'</td></tr>'}).join("")||'<tr><td colspan="3" class="cr-note">Sin movimientos registrados.</td></tr>';
 el("crDetail").hidden=false;
 el("crDetail").innerHTML='<div class="cr-top"><div><div class="eyebrow">FICHA DE VENTA · '+esc(l.order_ref||"—")+'</div><h3>'+esc(p.title||l.product_code)+'</h3></div><button id="crClose" class="btn" type="button">Cerrar</button></div>'
 +'<div class="cr-grid three"><div class="cr-card"><small>Licencia</small><strong class="cr-code">'+esc(l.license_key)+'</strong></div><div class="cr-card"><small>Estado</small><strong>'+esc(status(l))+'</strong></div><div class="cr-card"><small>Descargas recientes</small><strong>'+d.received+' recibidas / '+d.rows.length+' solicitudes</strong></div></div>'
 +'<p class="cr-note">Cuenta que activó: <strong>'+esc(l.activated_at?l.owner_email||"No informada":"Pendiente")+'</strong> · Canal: '+esc(l.source)+' · Fecha: '+date(l.created_at)+'</p>'
 +'<div class="cr-grid"><div><label for="crEditName">Nombre o alias</label><input id="crEditName" maxlength="100" value="'+esc(a.buyer_name||"")+'"/></div><div><label for="crEditContact">Email de contacto (no otorga acceso)</label><input type="email" id="crEditContact" maxlength="254" value="'+esc(a.contact_email||"")+'"/></div><div><label for="crEditBuyerId">ID del comprador</label><input id="crEditBuyerId" maxlength="100" value="'+esc(a.marketplace_buyer_id||"")+'"/></div><div><label for="crEditNote">Notas internas / reclamo</label><textarea id="crEditNote" maxlength="500">'+esc(a.delivery_note||"")+'</textarea></div></div>'
 +'<div class="cr-actions"><button class="btn primary" id="crSave">Guardar ficha</button><button class="btn" id="crCodeCopy">Copiar código</button><button class="btn" id="crMessageCopy">Copiar mensaje</button><button class="btn" id="crCsv">Exportar ficha CSV</button>'+(a.license_id?'<button class="btn ghost" id="crRemove">Desvincular contacto</button>':"")+'</div>'
 +'<p class="cr-note" id="crDetailMsg">Los datos de contacto son administrativos y no reemplazan la activación por código.</p><h3>Historial de descargas</h3><p class="cr-note">Muestra hasta los 500 eventos más recientes del módulo; una recepción no demuestra que el cliente abrió o guardó el archivo.</p><div class="cr-scroll"><table><thead><tr><th>Fecha</th><th>Archivo</th><th>Resultado</th></tr></thead><tbody>'+history+'</tbody></table></div>';
 el("crClose").onclick=function(){el("crDetail").hidden=true;selected=null};
 el("crSave").onclick=function(){save(id)};
 el("crCodeCopy").onclick=function(){copy(l.license_key);this.textContent="Copiado"};
 el("crMessageCopy").onclick=function(){copy(buyerMessage(l));this.textContent="Copiado"};
 el("crCsv").onclick=function(){exportCsv(l,a,d)};
 if(el("crRemove"))el("crRemove").onclick=function(){remove(id)};
 if(scroll)el("crDetail").scrollIntoView({behavior:"smooth",block:"start"});
}
async function save(id){
 var b=el("crSave");b.disabled=true;el("crDetailMsg").textContent="Guardando…";
 try{await api("pasalochevere-digital-delivery",{action:"customer_assign",license_id:id,buyer_name:el("crEditName").value,contact_email:el("crEditContact").value,marketplace_buyer_id:el("crEditBuyerId").value,delivery_note:el("crEditNote").value});await refresh();el("crDetailMsg").textContent="Ficha guardada. Licencia y titularidad sin cambios."}catch(e){el("crDetailMsg").textContent="No se pudo guardar: "+(e.message||String(e))}finally{if(el("crSave"))el("crSave").disabled=false}
}
async function remove(id){
 if(!confirm("¿Desvincular el contacto? El número de venta, la licencia y el historial de descargas se conservan."))return;
 try{await api("pasalochevere-digital-delivery",{action:"customer_unassign",license_id:id});await refresh();notice("Contacto desvinculado. Se conservó la venta y su historial.")}catch(e){notice(e.message||String(e),true)}
}
function exportCsv(l,a,d){
 var q=function(v){var s=String(v??"");if(/^[=+\-@\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'};var rows=[["Campo","Valor"],["Venta",l.order_ref],["Producto",product(l.product_code).title||l.product_code],["Código",l.license_key],["Estado",status(l)],["Comprador",a.buyer_name],["Correo contacto",a.contact_email],["ID comprador",a.marketplace_buyer_id],["Cuenta activada",l.activated_at?l.owner_email:"Pendiente"],["Nota",a.delivery_note],["Solicitudes recientes",d.rows.length],["Recepciones recientes",d.received]];
 d.rows.forEach(function(x){rows.push(["Descarga "+date(x.created_at),x.status+" - "+(state.assets.find(function(f){return f.id===x.asset_id})||{}).file_name])});
 var url=URL.createObjectURL(new Blob(["\ufeff"+rows.map(function(x){return x.map(q).join(",")}).join("\r\n")],{type:"text/csv;charset=utf-8"})),node=document.createElement("a");node.href=url;node.download="PasaloChevere_Ficha_"+l.product_code+".csv";document.body.appendChild(node);node.click();node.remove();setTimeout(function(){URL.revokeObjectURL(url)},1000);
}
el("crChannel").onchange=function(){var ml=this.value==="ML";el("crSaleLabel").textContent=ml?"Número de venta ML (16 dígitos)":"Referencia de venta / pedido";el("crSale").value="";el("crSale").placeholder=ml?"2000018505705824":"PEDIDO-001";el("crSale").inputMode=ml?"numeric":"text"};
el("crSale").oninput=function(){if(el("crChannel").value==="ML")this.value=this.value.replace(/\D/g,"").slice(0,16)};
el("crRefresh").onclick=refresh;el("crCreate").onclick=create;
el("crSearch").oninput=function(){limit=30;renderList()};
el("crMore").onclick=function(){limit+=30;renderList()};
sb.auth.onAuthStateChange(function(_event,session){if(session?.user?.email?.toLowerCase()==="pasalochevere@gmail.com")setTimeout(refresh,250)});
refresh();
})();
