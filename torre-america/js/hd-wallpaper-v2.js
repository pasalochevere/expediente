/* TORRE DE AMÉRICA · HD WALLPAPER V2 · sharpness QA */
(function(){
  const HD='../cinema-hd/hero.webp';
  try{
    if(typeof WC_SCENES!=='undefined'){
      [1,2,3,4,5,7,8,9,10].forEach(n=>{if(WC_SCENES[n])WC_SCENES[n].bg=HD});
      if(WC_SCENES[1])WC_SCENES[1].tone='';
      if(WC_SCENES[2])WC_SCENES[2].tone='';
      if(WC_SCENES[3])WC_SCENES[3].tone='gold';
      if(WC_SCENES[4])WC_SCENES[4].tone='';
      if(WC_SCENES[8])WC_SCENES[8].tone='silent';
      if(WC_SCENES[9])WC_SCENES[9].tone='gold';
      if(WC_SCENES[10])WC_SCENES[10].tone='gold';
    }
    const img=new Image();img.decoding='async';img.src='./assets/cinema-hd/hero.webp';
    if(typeof cinemaMontage==='function'){
      cinemaMontage=function(){
        const seq=[
          {ms:0,tone:'',html:'<small>TRIVIA</small><strong>HISTORIA</strong><p>Una pregunta puede cambiar la noche.</p>',cue:'wood'},
          {ms:850,tone:'red',html:'<div class="wc-red-card"></div><strong>ROJA</strong><p>Elegí un rival.</p>',cue:'thump'},
          {ms:1700,tone:'blue',html:'<div class="wc-monitor"></div><strong>VAR</strong><p>Revisando la jugada.</p>',cue:'wood'},
          {ms:2550,tone:'',html:'<small>DESDE LOS DOCE PASOS</small><strong>PENALES</strong><p>5 segundos. Una respuesta.</p>',cue:'thump'},
          {ms:3500,tone:'',html:'<div class="wc-die"></div><strong>DADO</strong><p>Todo puede cambiar.</p>',cue:'wood'},
          {ms:4450,tone:'gold',html:'<small>GRAN FINAL</small><strong>2 — 2</strong><p>Todo en juego.</p>',cue:'thump'}
        ];
        seq.forEach(x=>cinemaTimers.push(setTimeout(()=>{wcSetBg(HD,x.tone);wcEvent(x.html);x.cue==='wood'?wcWood():wcThump(.05,.22)},x.ms)));
      };
    }
    if(typeof cinemaEscalation==='function'){
      cinemaEscalation=function(){
        const flash=document.getElementById('c11Flash');if(!flash)return;
        const seq=[['FÍSICA',''],['DIGITAL','blue'],['PENALES',''],['LEYENDA','gold']];
        seq.forEach((x,i)=>cinemaTimers.push(setTimeout(()=>{wcSetBg(HD,x[1]);flash.innerHTML=`<strong>${x[0]}</strong>`;flash.classList.remove('pulse');void flash.offsetWidth;flash.classList.add('pulse');i===2?wcThump(.06,.26):wcWood()},420+i*1050)));
      };
    }
  }catch(e){console.warn('HD wallpaper patch',e)}
})();
