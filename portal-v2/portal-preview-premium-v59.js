/* Second commercial gallery batch. Illustrative diagrams contain no case evidence. */
(()=>{
  if(window.__pcPreviewPremiumV59)return;
  const tag=s=>`<div class="pc59Kicker">${s}</div>`;
  const wrap=(theme,s)=>`<div class="pc59 pc59-${theme}">${s}</div>`;
  const foot=s=>`<div class="pc59Foot">${s}</div>`;
  const heading=(a,b)=>`<h3 class="pc59Title">${a}<br><em>${b}</em></h3>`;
  const steps=items=>`<div class="pc59Steps">${items.map(([t,d],i)=>`<div><span>0${i+1}</span><section><b>${t}</b><p>${d}</p></section></div>`).join('')}</div>`;
  const cards=()=>`<div class="pc59TarotCards" aria-hidden="true"><i>☾</i><i>✦</i><i>☼</i></div>`;
  const room='../caso002/assets/visual/bin/room-317-v244.jpg';
  const study='../caso001/assets/escenas/estudio.jpg';
  const oneCover=()=>wrap('case',`${tag('EXPEDIENTES · CASO 001')}<div class="pc59Seal" aria-hidden="true">001</div>${heading('La Última','Reunión.')}<p class="pc59Lead">Una reunión.<br>Demasiadas preguntas.</p><div class="pc59CaseLine"><span>EXPLORÁ</span><span>CONECTÁ</span><span>RESOLVÉ</span></div>${foot('INVESTIGACIÓN DIGITAL · SIN SPOILERS')}`);
  const oneUse=()=>wrap('case',`${tag('CÓMO SE JUEGA')}${heading('Cada hallazgo','abre una pregunta.')}${steps([['Explorá los espacios','Recorré los escenarios del caso.'],['Compartí lo que sabés','Cruzá la información con tu equipo.'],['Construí una hipótesis','Relacioná lo que descubriste y sacá tus conclusiones.']])}${foot('ESQUEMA DE LA DINÁMICA · NO MUESTRA PISTAS DEL CASO')}`);
  const oneIncludes=()=>wrap('case',`${tag('QUÉ ENCONTRÁS EN EL CASO')}${heading('Una historia.','Distintas miradas.')}<div class="pc59Included"><figure><img src="${study}" alt="El estudio, escenario real de La Última Reunión" loading="lazy"><figcaption>EL ESTUDIO · ESCENA DEL JUEGO</figcaption></figure><div>${steps([['Escenarios de investigación','Espacios para explorar.'],['Personajes e información','Una historia para reconstruir.'],['Investigación compartida','Poné a prueba las ideas del equipo.']])}</div></div>${foot('EXPERIENCIA DIGITAL · PRESENTACIÓN SIN RESOLUCIÓN')}`);
  const twoCover=()=>wrap('orfeo',`${tag('EXPEDIENTES · CASO 002')}<div class="pc59Door" aria-hidden="true"><span>HOTEL ORFEO</span><b>317</b><i></i></div>${heading('Hotel','Orfeo.')}<p class="pc59Lead">Tres jugadores.<br>Una historia por reconstruir.</p>${foot('HABITACIÓN 317 · ROLES PRIVADOS · SIN SPOILERS')}`);
  const twoUse=()=>wrap('orfeo',`${tag('CÓMO SE JUEGA')}${heading('Nadie ve','la historia completa.')}<div class="pc59Roles">${['01','02','03'].map(n=>`<div><span>JUGADOR ${n}</span><b>?</b><p>Información<br>privada</p></div>`).join('')}</div><p class="pc59Callout">Compartí tus hallazgos.<br><strong>La hipótesis se construye en equipo.</strong></p>${foot('ESQUEMA ILUSTRATIVO · LOS ROLES SE REVELAN EN LA PARTIDA')}`);
  const twoIncludes=()=>wrap('orfeo',`${tag('QUÉ ENCONTRÁS EN EL CASO')}${heading('Entrá al hotel.','Seguí la investigación.')}<div class="pc59Included"><figure><img src="${room}" alt="Habitación 317, escenario real de Hotel Orfeo" loading="lazy"><figcaption>HABITACIÓN 317 · ESCENA DEL JUEGO</figcaption></figure><div>${steps([['Tres miradas','Información propia para cada jugador.'],['Rutas de investigación','Pistas y decisiones durante la partida.'],['Hipótesis del grupo','Conectá los hallazgos del equipo.']])}</div></div>${foot('EXPERIENCIA DIGITAL · PRESENTACIÓN SIN RESOLUCIÓN')}`);
  const tarotCover=()=>wrap('tarot',`${tag('PASALOCHEVERE · GUÍA INTERACTIVA')}${heading('Mesa','Tarot.')}${cards()}<p class="pc59Lead">Aprendé. Practicá. Interpretá.</p>${foot('78 CARTAS · BIBLIOTECA · TIRADAS')}`);
  const tarotUse=()=>wrap('tarot',`${tag('CÓMO SE USA')}${heading('De una carta','a una lectura.')}${steps([['Explorá la biblioteca','Conocé las cartas y sus significados.'],['Practicá una tirada','Observá cada carta en su posición.'],['Relacioná e interpretá','Conectá los símbolos con tu pregunta.']])}${foot('RECORRIDO ILUSTRATIVO · NO ES UNA TIRADA ACTIVA')}`);
  const tarotIncludes=()=>wrap('tarot',`${tag('QUÉ INCLUYE LA GUÍA')}${heading('Un mazo completo.','Tu espacio de práctica.')}<div class="pc59TarotKit"><div class="pc59Number"><b>78</b><span>CARTAS</span><small>22 arcanos mayores<br>56 arcanos menores</small></div>${steps([['Biblioteca','Exploración de las cartas.'],['Tiradas','Posiciones y combinaciones.'],['Práctica guiada','Aprendizaje e interpretación.']])}</div>${foot('GUÍA DIGITAL · ILUSTRACIÓN SIMBÓLICA DEL MAZO')}`);
  const thumb=(theme,s)=>`<div class="pc59Thumb pc59-${theme}">${s}</div>`;
  const slide=(theme,label,render,s)=>({kind:'ui',label,note:'',render,thumbHtml:thumb(theme,s)});
  const sets={
    'EXP-001':{theme:'case',slides:[['El caso',oneCover,'001'],['Cómo se juega',oneUse,'?'],['Qué incluye',oneIncludes,'PISTAS']],summary:'Explorá los escenarios de La Última Reunión, compartí información con tu equipo y construí una hipótesis. Estas vistas presentan la dinámica sin revelar la resolución.'},
    'EXP-002':{theme:'orfeo',slides:[['Hotel Orfeo',twoCover,'317'],['Cómo se juega',twoUse,'3'],['Qué incluye',twoIncludes,'EL HOTEL']],summary:'Tres jugadores investigan Hotel Orfeo desde roles con información privada. Compartan sus hallazgos y conecten las pistas para construir una hipótesis.'},
    'TAROT-GUIDE':{theme:'tarot',slides:[['Mesa Tarot',tarotCover,'✦'],['Cómo se usa',tarotUse,'☾'],['Qué incluye',tarotIncludes,'78']],summary:'Explorá la biblioteca de 78 cartas, practicá tiradas y relacioná significados. Una guía digital para aprender e interpretar a tu ritmo.'}
  };
  function patch(){const p=window.PC_REAL_PREVIEWS_V2;if(!p)return false;for(const [key,v] of Object.entries(sets)){if(!p[key])continue;p[key].slides=v.slides.map(([label,render,s])=>slide(v.theme,label,render,s));p[key].summary=v.summary;p[key].__v21b=true;p[key].__v59=true}window.__pcPreviewPremiumV59=true;return true}
  const posters={
    exp001:`<small>EXPEDIENTES · CASO 001</small><strong>La Última<br><em>Reunión.</em></strong><span>INVESTIGÁ · CONECTÁ · RESOLVÉ</span><i aria-hidden="true">001</i>`,
    exp002:`<small>EXPEDIENTES · CASO 002</small><strong>Hotel<br><em>Orfeo.</em></strong><span>3 JUGADORES · ROLES PRIVADOS</span><i aria-hidden="true">317</i>`,
    tarot:`<small>GUÍA INTERACTIVA · 78 CARTAS</small><strong>Mesa<br><em>Tarot.</em></strong><span>APRENDÉ · PRACTICÁ · INTERPRETÁ</span><i aria-hidden="true">✦</i>`
  };
  function covers(){document.querySelectorAll('.pcV4Cover[data-pc-cover-key]').forEach(c=>{const k=c.dataset.pcCoverKey;if(!posters[k]||c.querySelector('.pc59Poster'))return;c.classList.add('pc59Cover');c.insertAdjacentHTML('beforeend',`<div class="pc59Poster pc59Poster-${k}">${posters[k]}</div>`)})}
  function boot(){if(!patch())return false;covers();let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;covers()})}).observe(document.body,{childList:true,subtree:true});return true}
  if(!boot()){let tries=0;const timer=setInterval(()=>{if(boot()||++tries>60)clearInterval(timer)},100)}
})();
