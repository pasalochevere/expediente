(function(){
  const css=`
  .manual-entry{width:100%;margin-top:4px;border:1px solid rgba(198,154,58,.24);border-radius:20px;padding:13px 14px;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:12px;text-align:left;cursor:pointer;background:linear-gradient(135deg,#fffaf0,#fffdfa);box-shadow:0 10px 22px rgba(91,65,22,.06);color:var(--ink);transition:.16s ease}
  .manual-entry:hover{transform:translateY(-1px);box-shadow:0 14px 27px rgba(91,65,22,.09)}
  .manual-entry small{display:block;color:var(--gold-dark);font-size:9px;letter-spacing:.12em;font-weight:900}.manual-entry b{display:block;margin-top:3px;font-size:14px}.manual-entry i{font-style:normal;font-size:22px;color:var(--gold-dark);font-weight:900}
  .pdf-mini,.pdf-icon{display:grid;place-items:center;background:#171717;color:#fff;font-weight:900;letter-spacing:.07em;border-radius:12px}.pdf-mini{width:42px;height:42px;font-size:10px;box-shadow:0 8px 15px rgba(0,0,0,.10)}
  .manual-intro{color:var(--mut);margin:8px 0 18px}.downloads{display:grid;gap:14px}.download-card{position:relative;overflow:hidden;padding:20px;border-radius:25px;background:linear-gradient(180deg,#fff,#fbf6ef);border:1px solid var(--line);box-shadow:var(--shadow2)}
  .download-card:before{content:"";position:absolute;top:0;left:0;right:0;height:6px;background:linear-gradient(90deg,var(--gold),#e9c577)}.download-card.quick:before{background:linear-gradient(90deg,#171717,#6e665b)}
  .pdf-icon{width:58px;height:58px;border-radius:16px;font-size:12px;margin-bottom:14px;box-shadow:0 10px 20px rgba(0,0,0,.10)}.download-copy small{display:block;color:var(--gold-dark);font-size:9px;letter-spacing:.13em;font-weight:900}
  .download-copy h3{margin:6px 0 7px;font-size:23px}.download-copy p{margin:0;color:var(--mut);font-size:14px;line-height:1.5}.download-card .btn{margin-top:16px}.manual-back{display:block;margin:10px auto 0}
  `;
  const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);

  const baseHome=home,baseOverlay=overlay,baseR=R;

  window.openManuals=function(from='home'){window.__manualReturn=from;O=null;S='manuals';R()};
  window.closeManuals=function(){S=window.__manualReturn||'home';R()};
  window.downloadPDF=async function(file,name){
    try{
      const r=await fetch(file);if(!r.ok)throw new Error('manual');
      const txt=(await r.text()).replace(/\s/g,'');
      const bin=atob(txt),bytes=new Uint8Array(bin.length);
      for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
      const url=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));
      const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),2500);
    }catch{alert('No pudimos preparar el PDF. Probá de nuevo en unos segundos.')}
  };

  window.manuals=function(){return`<div class="top"><button class="back" onclick="closeManuals()">‹</button>${logo()}</div>
    <span class="over">MATERIAL DESCARGABLE</span><h1>MANUALES<br><em>PDF</em></h1>
    <p class="manual-intro">Guardalos en el celular, imprimilos o compartilos con quien vaya a jugar.</p>
    <div class="downloads">
      <article class="download-card"><div class="pdf-icon">PDF</div><div class="download-copy"><small>MANUAL COMPLETO · 2 PÁGINAS</small><h3>Manual de juego</h3><p>Contenido del set, cómo jugar, niveles, modo digital y juego responsable.</p></div><button class="btn" onclick="downloadPDF('manual-juego.b64','Torre_Yenga_Borracho_Manual.pdf')">DESCARGAR PDF ↓</button></article>
      <article class="download-card quick"><div class="pdf-icon">PDF</div><div class="download-copy"><small>1 PÁGINA · CONSULTA RÁPIDA</small><h3>Guía rápida de la web app</h3><p>Los tres niveles y el flujo SACÁ · MOSTRÁ · CUMPLÍ · APILÁ en una sola hoja.</p></div><button class="btn s" onclick="downloadPDF('guia-webapp.b64','Torre_Yenga_Borracho_Guia_Rapida_WebApp.pdf')">DESCARGAR PDF ↓</button></article>
    </div><button class="link manual-back" onclick="closeManuals()">Volver</button>`};

  home=function(){
    const html=baseHome();
    const entry=`<button class="manual-entry" onclick="openManuals('home')"><span class="pdf-mini">PDF</span><span><small>MANUALES DESCARGABLES</small><b>Manual de juego + guía rápida</b></span><i>↓</i></button>`;
    return html.replace('</section>',entry+'</section>');
  };

  overlay=function(){
    const html=baseOverlay();
    if(O==='menu'&&html){
      return html.replace('<button class="link" onclick="O=null;S=\'care\';R()">Consumo responsable</button>', '<button class="btn s" onclick="openManuals(\'game\')">Manuales PDF</button><button class="link" onclick="O=null;S=\'care\';R()">Consumo responsable</button>');
    }
    return html;
  };

  R=function(){if(S==='manuals'){q('#app').innerHTML=manuals();return}baseR()};
  R();
})();