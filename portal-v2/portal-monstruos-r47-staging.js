/* FM27 R4.7 — vista de prueba. Solo visible con ?monstruosR47=1; sin pagos ni descargas publicas. */
(function(){
  "use strict";
  if(new URLSearchParams(location.search).get("monstruosR47")!=="1") return;
  var products=[
    {code:"MON-REC-20",title:"20 Monstruos Recortables",subtitle:"20 personajes + accesorios",desc:"20 laminas A4 apaisadas, color y escala de grises",tone:"#17d9d5",icon:"✂"},
    {code:"MON-SQ-20",title:"20 Monstruos Paper Squishies",subtitle:"Frente y dorso",desc:"20 laminas A4 apaisadas, color y escala de grises",tone:"#ff67c1",icon:"★"},
    {code:"MON-MEGA-20",title:"Megapack 20 Monstruos",subtitle:"Recortables + squishies",desc:"4 PDF, 80 paginas y guia de impresion",tone:"#ffcf38",icon:"✦"}
  ];
  function render(){
    var root=document.querySelector("#drawer-printables .printCollections");
    if(!root||document.querySelector("#monstruosR47Preview"))return;
    var section=document.createElement("section");section.className="printGroup";section.id="monstruosR47Preview";
    section.innerHTML='<h4>Fabrica de Monstruos — vista de prueba R4.7</h4><p style="color:#e6d5f3;font-size:.84rem">Los tres productos estan registrados como borradores; venta y descarga deshabilitadas hasta completar la validacion y cargar los archivos privados.</p>';
    var grid=document.createElement("div");grid.className="drawerGrid";grid.style.gridTemplateColumns="repeat(auto-fit,minmax(220px,1fr))";
    products.forEach(function(p){
      var card=document.createElement("article");card.className="card bingoPrintCard";card.dataset.cat="printables";card.dataset.productCode=p.code;
      var slot=document.createElement("div");slot.style.cssText="width:100%;aspect-ratio:1;position:relative;background:linear-gradient(135deg,#42247b,#1a4d6f);border-radius:14px;overflow:hidden;";
      var fallback=document.createElement("div");fallback.style.cssText="position:absolute;inset:0;display:grid;place-content:center;text-align:center;padding:16px;color:white;gap:10px;font-weight:900";
      var emblem=document.createElement("span");emblem.textContent=p.icon;emblem.style.cssText="font-size:66px;color:"+p.tone;fallback.appendChild(emblem);
      var label=document.createElement("span");label.textContent=p.title;fallback.appendChild(label);slot.appendChild(fallback);
      var img=new Image();img.alt="Caratula "+p.title;img.loading="lazy";img.style.cssText="width:100%;height:100%;object-fit:cover;display:none;position:absolute;inset:0";
      img.onload=function(){img.style.display="block"};img.onerror=function(){img.style.display="none"};
      img.src="https://fzbndgfnqxcacsvlitui.supabase.co/functions/v1/pasalochevere-product-covers?product_code="+encodeURIComponent(p.code);
      slot.appendChild(img);card.appendChild(slot);
      var status=document.createElement("span");status.className="status";status.textContent="● BORRADOR · NO DISPONIBLE";card.appendChild(status);
      var h=document.createElement("h3");h.textContent=p.title;card.appendChild(h);
      var sub=document.createElement("div");sub.className="accent";sub.textContent=p.subtitle;card.appendChild(sub);
      var desc=document.createElement("p");desc.textContent=p.desc;card.appendChild(desc);
      var state=document.createElement("p");state.style.cssText="font-weight:800;color:#f8d6a5";state.textContent="Precio a definir · Entrega protegida pendiente";card.appendChild(state);
      grid.appendChild(card);
    });
    section.appendChild(grid);root.insertBefore(section,root.firstChild);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",render,{once:true});else render();
})();