/* Torre de América V2.0 RC · P0.5R2.
 * Presentación de formatos según licencia verificada por el servidor.
 * Exclusivo v2-rc.html. El servidor autoriza, este archivo aplica esa decisión.
 */
(function(){
"use strict";
const known=new Set(["DIGITAL","FISICA"]);
function apply(formats,productCode){
  if(!Array.isArray(formats)||!formats.length||formats.some(x=>!known.has(x))){
    throw new Error("Formato de licencia desconocido.");
  }
  if(!["FUT-AMERICA","FUT-AMERICA-DIG","FUT-AMERICA-PHY"].includes(productCode)){
    throw new Error("Edición no reconocida.");
  }
  const allowed=new Set(formats);
  const digitalOnly=allowed.has("DIGITAL")&&!allowed.has("FISICA");
  const decide=function(){
    if(typeof S==="undefined")return;
    if(digitalOnly){
      S.playFormat="DIGITAL";
      if(S.mode==="CLASICO")S.mode="PUNTOS";
    }
  };
  const baseRender=window.renderFormats;
  const baseStart=window.startGame;
  const baseResume=window.resumeGame;
  const baseGo=window.go;
  const baseSelectBlock=window.selectPhysicalBlock;
  if(typeof baseRender!=="function"||typeof baseStart!=="function"||typeof baseResume!=="function"||typeof baseGo!=="function"){
    throw new Error("Motor de formatos no disponible.");
  }
  function decorateFormat(){
    const root=document.getElementById("formatOpts");
    if(!root)return;
    const physical=root.querySelector(".visual-format-card:not(.digital), .format-card:not(.digital)");
    if(physical&&digitalOnly){physical.setAttribute("aria-disabled","true");physical.hidden=true;physical.style.display="none"}
    const title=document.querySelector("#format .section-head .subtitle");
    if(title&&digitalOnly)title.textContent="Tu edición Solo Digital incluye todos los desafíos, sin requerir torre física.";
  }
  window.renderFormats=function(){decide();const result=baseRender.apply(this,arguments);decorateFormat();return result};
  window.startGame=function(){decide();return baseStart.apply(this,arguments)};
  window.go=function(id){
    decide();
    const result=baseGo.apply(this,arguments);
    if(id==="format")decorateFormat();
    return result;
  };
  window.resumeGame=function(){
    if(digitalOnly){
      try{
        const saved=JSON.parse(localStorage.getItem("torreAmericaGameV2RC1")||"null");
        if(saved?.playFormat&&saved.playFormat!=="DIGITAL"){
          alert("La partida guardada utiliza torre física. Tu licencia Solo Digital no permite reanudar ese formato. Podés comenzar una partida digital nueva.");
          return;
        }
      }catch(_error){/* El motor maneja los errores de guardado. */}
    }
    const result=baseResume.apply(this,arguments);
    decide();
    return result;
  };
  if(typeof baseSelectBlock==="function"){
    window.selectPhysicalBlock=function(){
      if(digitalOnly)return;
      return baseSelectBlock.apply(this,arguments);
    };
  }
  window.TA_RC_FORMATS={product_code:productCode,allowed:[...allowed],digitalOnly,serverVerified:true};
  decide();window.renderFormats();
}
window.TA_RC_SET_FORMATS=apply;
})();