(()=>{
'use strict';
try{
  // PSQ 2.9.5 · Editor remix export fix.
  // Los personajes de biblioteca usan imágenes públicas de Supabase. Sin CORS,
  // el canvas queda tainted y el botón "Listo" falla al ejecutar toDataURL().
  if(typeof loadBase==='function'){
    loadBase=(src)=>{
      if(!src){baseImage=null;drawEditor();return;}
      baseImage=new Image();
      baseImage.crossOrigin='anonymous';
      baseImage.decoding='async';
      baseImage.onload=()=>drawEditor();
      baseImage.onerror=(e)=>{
        console.warn('[PSQ Editor 2.9.5] no cargó la base con CORS',src,e);
        try{toast('No pude cargar la base del personaje. Volvé a abrirlo.')}catch{}
      };
      const sep=String(src).includes('?')?'&':'?';
      baseImage.src=String(src)+sep+'psq_editor=2951';
    };
  }

  const done=document.getElementById('editorDone');
  if(done){
    done.onclick=()=>{
      try{
        drawEditor();
        const data=canvas.toDataURL('image/png');
        const preview=document.getElementById('exportPreview');
        if(preview)preview.src=data;
        show('export');
      }catch(e){
        console.error('[PSQ Editor 2.9.5] Listo/export falló',e);
        try{
          if(editor?.baseSrc)loadBase(editor.baseSrc);
          toast('Recargué la base del personaje. Probá “Listo” nuevamente.');
        }catch{}
      }
    };
  }

  window.PSQ_EDITOR_V295={active:true,corsBase:true,doneGuard:true,release:'2.9.5'};
  console.info('[PSQ Editor 2.9.5] fix activo',window.PSQ_EDITOR_V295);
}catch(e){
  console.warn('[PSQ Editor 2.9.5] hotfix no aplicado',e);
}
})();
