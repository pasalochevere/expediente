/* CP3.0B — Creator Plus Upgrade | patch inserted INSIDE the validated factory IIFE.
 * Test-only: no changes to licensed core, library master assets or published factory.
 */
const CP30B_VERSION='3.0B.TEST.1';
const cp3OldRenderTools=renderTools;
const cp3OldBlank=blankEditor;
const cp3OldStart=startEditor;
const cp3OldDrawObject=drawObject;
const cp3OldDrawEditor=drawEditor;
const cp3OldLoadBase=loadBase;
let cp3Exporting=false;
const cp3Styles=[
  {id:'choco',name:'Chocolate Party',emoji:'🍫',colors:['#75402e','#f2c292','#ffcf6d'],items:[['star',320,320,49,'#e8b86c'],['circle',675,315,25,'#8c4c32'],['heart',300,665,34,'#d98470'],['star',675,660,44,'#f6d69a'],['circle',390,710,22,'#8e5136']],stickers:[['🍫',700,385,62],['✨',327,585,52]]},
  {id:'vanilla',name:'Vainilla Sprinkle',emoji:'🍦',colors:['#ffe4a3','#f59ebc','#c7adee'],items:[['star',290,380,45,'#f5a1c1'],['circle',365,290,22,'#afc9f2'],['heart',700,350,32,'#f7badd'],['star',705,675,38,'#c7aaed'],['circle',330,665,25,'#f3d78d']],stickers:[['✨',380,720,48],['🍒',690,430,50]]},
  {id:'blueberry',name:'Blueberry Pop',emoji:'🫐',colors:['#8b7bc6','#add1f7','#ebd2ff'],items:[['star',290,340,51,'#7c91d0'],['circle',710,315,29,'#b2a1f1'],['heart',710,675,34,'#a1d0f6'],['star',345,715,42,'#c7b4ee'],['circle',275,600,19,'#7978ce']],stickers:[['🫐',688,415,60],['✨',320,585,47]]}
];
const cp3Shapes=[{type:'star',name:'Estrella',icon:'⭐'},{type:'heart',name:'Corazón',icon:'🩷'},{type:'circle',name:'Círculo',icon:'●'},{type:'cloud',name:'Nube',icon:'☁️'},{type:'flower',name:'Flor',icon:'🌸'},{type:'drop',name:'Gota',icon:'💧'}];
const cp3Stickers=['✨','🌈','🎀','🍒','🍓','🫐','🍫','🍦','🩷','🌟','🌼','👑'];
let cp3Collection='';
const cp3Css=document.createElement('style');
cp3Css.id='psq-cp30b-css';
cp3Css.textContent=`
.tool-tabs{grid-template-columns:repeat(5,minmax(0,1fr))!important}
.tool-tabs button{min-width:0;padding:8px 1px!important}
.cp3-banner{border:1px solid #dbbddf;background:linear-gradient(135deg,#fff0fa,#fff6d9);padding:13px;border-radius:16px;margin:5px 0 13px}
.cp3-banner b{display:block;font-size:15px}.cp3-banner small{display:block;line-height:1.35;color:#6d596a;margin-top:5px}
.cp3-collection-tabs{display:flex;gap:6px;overflow-x:auto;padding:4px 0 8px;scrollbar-width:thin}
.cp3-collection-tabs button{flex:0 0 auto;max-width:165px;background:#fff;border:1px solid #ecd7ca;border-radius:99px;padding:7px 9px;font-size:10px;font-weight:900;cursor:pointer}
.cp3-collection-tabs button.active{background:#ffe59f;border-color:#5a3d2f}
.cp3-character-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;max-height:320px;overflow:auto;padding:3px}
.cp3-character{display:flex;flex-direction:column;align-items:center;gap:4px;min-width:0;border:1px solid #eaded8;border-radius:12px;padding:5px;background:#fffdf8;cursor:pointer}
.cp3-character img{display:block;width:100%;aspect-ratio:1;object-fit:contain;border-radius:8px;background:#fff7ef}
.cp3-character strong{font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.cp3-character.active{outline:2px solid #ef797d;background:#fff1f3}
.cp3-divider{font-size:10px;font-weight:1000;letter-spacing:.07em;margin:13px 0 8px;color:#6d554c}
.cp3-style-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}
.cp3-style{display:flex;flex-direction:column;align-items:center;border:1px solid #e9daca;background:#fff;border-radius:13px;min-width:0;overflow:hidden;cursor:pointer;padding:4px 3px 8px}
.cp3-style.active{outline:2px solid #f0897c}
.cp3-style img{width:100%;aspect-ratio:1;object-fit:contain;display:block;background:#fff9ed;border-radius:8px}
.cp3-style strong{font-size:10px;line-height:1.2;margin-top:5px;min-height:24px}
.cp3-style small{font-size:9px;color:#73635b}
.cp3-pillgrid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:5px}
.cp3-pillgrid button{display:flex;align-items:center;justify-content:center;min-height:42px;font-size:23px;border:1px solid #eaddd3;border-radius:10px;background:#fffdf8;cursor:pointer}
.cp3-form{display:grid;grid-template-columns:1fr auto;gap:7px;align-items:center}.cp3-form input[type=text]{width:100%;min-width:0;border:1px solid #dfcfc3;border-radius:9px;padding:10px}.cp3-form button{border:0;background:#ffd66e;border-radius:9px;padding:10px;font-weight:900;cursor:pointer}
.cp3-form-next{display:flex;flex-wrap:wrap;gap:6px;margin-top:7px}.cp3-form-next select,.cp3-form-next input{min-width:0;flex:1;border:1px solid #e1d1c7;border-radius:8px;background:#fff;padding:8px}
.cp3-warning{border-radius:11px;background:#fff7e6;padding:10px;font-size:10px;line-height:1.5;color:#745740;margin-top:10px}
@media(max-width:640px){.cp3-character-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.cp3-style-grid{gap:5px}.cp3-collection-tabs button{max-width:135px}}
`;
document.head.appendChild(cp3Css);
const cp3Tab=document.createElement('button');cp3Tab.type='button';cp3Tab.dataset.tool='cpPresets';cp3Tab.innerHTML='<span>🪄</span><small>Presets</small>';
const cp3Tabs=document.querySelector('.tool-tabs');
if(cp3Tabs)cp3Tabs.insertBefore(cp3Tab,cp3Tabs.firstChild);
cp3Tab.onclick=()=>{editor.tool='cpPresets';renderTools();drawEditor()};
function cp3Characters(){return (window.PS_LIBRARY?.characters||LIB.characters||[]).filter(c=>c.assets?.editor_asset?.path);}
function cp3Collections(){return (window.PS_LIBRARY?.collections||LIB.collections||[]).filter(c=>cp3Characters().some(ch=>ch.collection_id===c.id));}
function cp3CurrentCharacter(){return cp3Characters().find(ch=>ch.id===editor.sourceId)||null;}
function cp3ValidateCollection(){const current=cp3CurrentCharacter();if(!cp3Collections().some(c=>c.id===cp3Collection))cp3Collection=current?.collection_id||cp3Collections()[0]?.id||'';}
function cp3Limit(v,lo,hi){return Math.min(hi,Math.max(lo,v));}
function cp3AddShape(type,x=340,y=330,size=52,color='#ffa6cb',preset=false){
  if(!preset)color=document.querySelector('#cp3ShapeColor')?.value||color;
  snapshot();editor.objects.push({type:'cpShape',value:type,x:cp3Limit(x,240,760),y:cp3Limit(y,240,760),size:cp3Limit(size,28,180),color,cp30b:true,cpPresetItem:preset});
  editor.selected=editor.objects.length-1;drawEditor();updateEditorUI();
}
function cp3AddSticker(value,x=330,y=360,size=64,preset=false){
  snapshot();editor.objects.push({type:'sticker',value,x:cp3Limit(x,240,760),y:cp3Limit(y,240,760),size:cp3Limit(size,30,125),cp30b:true,cpPresetItem:preset});
  editor.selected=editor.objects.length-1;drawEditor();updateEditorUI();
}
function cp3AddText(){const input=document.querySelector('#cp3TextInput');const value=(input?.value||'').trim().slice(0,18);if(!value){toast('Escribí una frase corta');return;}
  const where=document.querySelector('#cp3TextPosition')?.value||'bottom';const color=document.querySelector('#cp3TextColor')?.value||'#5e3159';
  const pos=where==='top'?[500,285]:where==='side'?[650,590]:[500,725];
  snapshot();editor.objects.push({type:'text',value,color,x:pos[0],y:pos[1],size:where==='side'?28:50,cp30b:true});
  editor.selected=editor.objects.length-1;drawEditor();updateEditorUI();toast('Texto agregado · movelo con el mouse');
}
function cp3ApplyStyle(styleId){const style=cp3Styles.find(x=>x.id===styleId);if(!style)return;
 if(!editor.sourceId){toast('Primero elegí un personaje real de la colección');return;}
 snapshot();editor.objects=editor.objects.filter(o=>!o.cpPresetItem);
 for(const [type,x,y,size,color] of style.items)editor.objects.push({type:'cpShape',value:type,x,y,size,color,cp30b:true,cpPresetItem:true});
 for(const [value,x,y,size] of style.stickers)editor.objects.push({type:'sticker',value,x,y,size,cp30b:true,cpPresetItem:true});
 editor.cpPreset=style.id;editor.selected=null;drawEditor();renderTools();toast(style.name+' aplicado · base original intacta');
}
function cp3Html(text){return String(text||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function cp3RenderPanel(){
 const box=document.querySelector('#toolBox');if(!box)return;cp3ValidateCollection();
 const collections=cp3Collections(),chars=cp3Characters().filter(c=>c.collection_id===cp3Collection),selected=cp3CurrentCharacter();
 box.innerHTML='<div class="cp3-banner"><b>🪄 CREATOR PLUS · CP3.0B</b><small>Elegí un personaje real de las colecciones y aplicale un estilo editable sin modificar su silueta original.</small></div>';
 const lab=document.createElement('div');lab.className='cp3-divider';lab.textContent='1 · COLECCIÓN';box.appendChild(lab);
 const tabs=document.createElement('div');tabs.className='cp3-collection-tabs';for(const col of collections){const btn=document.createElement('button');btn.type='button';btn.textContent=col.name;btn.classList.toggle('active',col.id===cp3Collection);btn.onclick=()=>{cp3Collection=col.id;cp3RenderPanel()};tabs.appendChild(btn);}box.appendChild(tabs);
 const section=document.createElement('div');section.className='cp3-divider';section.textContent='2 · PERSONAJE ORIGINAL';box.appendChild(section);
 const grid=document.createElement('div');grid.className='cp3-character-grid';for(const ch of chars){const b=document.createElement('button');b.className='cp3-character';b.type='button';b.classList.toggle('active',ch.id===editor.sourceId);
  const img=document.createElement('img');img.loading='lazy';img.alt='Personaje original '+ch.name;img.src=ch.assets?.hero?.path||ch.assets?.editor_asset?.path;b.appendChild(img);
  const t=document.createElement('strong');t.textContent=ch.name;b.appendChild(t);b.onclick=()=>{if(editor.objects.length&&editor.sourceId!==ch.id&&!confirm('Cambiar de personaje reinicia las decoraciones actuales. ¿Continuar?'))return;cp3Collection=ch.collection_id;startEditor(ch.id);};grid.appendChild(b);}box.appendChild(grid);
 const styleLabel=document.createElement('div');styleLabel.className='cp3-divider';styleLabel.textContent='3 · PRESETS EDITABLES';box.appendChild(styleLabel);
 const styles=document.createElement('div');styles.className='cp3-style-grid';for(const st of cp3Styles){const b=document.createElement('button');b.type='button';b.className='cp3-style';b.classList.toggle('active',editor.cpPreset===st.id);b.disabled=!selected;
 const img=document.createElement('img');img.alt='Vista del personaje real para '+st.name;img.src=selected?.assets?.hero?.path||chars[0]?.assets?.hero?.path||'';img.style.background=`linear-gradient(135deg,${st.colors.join(',')})`;
 const strong=document.createElement('strong');strong.textContent=st.name;const sml=document.createElement('small');sml.textContent=st.emoji+' decorar';b.append(img,strong,sml);b.onclick=()=>cp3ApplyStyle(st.id);styles.appendChild(b);}box.appendChild(styles);
 const shapeLabel=document.createElement('div');shapeLabel.className='cp3-divider';shapeLabel.textContent='4 · FORMAS DECORATIVAS';box.appendChild(shapeLabel);
 const shapeColor=document.createElement('div');shapeColor.className='cp3-form-next';shapeColor.innerHTML='<label style="font-size:10px;display:flex;align-items:center;gap:8px">Color de formas <input id="cp3ShapeColor" type="color" value="#ffa6cb" aria-label="Color de formas"></label>';box.appendChild(shapeColor);
 const shapeGrid=document.createElement('div');shapeGrid.className='cp3-pillgrid';for(const sh of cp3Shapes){const b=document.createElement('button');b.type='button';b.title=sh.name;b.textContent=sh.icon;b.onclick=()=>cp3AddShape(sh.type,360+Math.random()*260,320+Math.random()*320);shapeGrid.appendChild(b);}box.appendChild(shapeGrid);
 const stickerLabel=document.createElement('div');stickerLabel.className='cp3-divider';stickerLabel.textContent='5 · STICKERS';box.appendChild(stickerLabel);
 const stickerGrid=document.createElement('div');stickerGrid.className='cp3-pillgrid';for(const em of cp3Stickers){const b=document.createElement('button');b.type='button';b.title='Agregar sticker '+em;b.textContent=em;b.onclick=()=>cp3AddSticker(em,355+Math.random()*250,325+Math.random()*315);stickerGrid.appendChild(b);}box.appendChild(stickerGrid);
 const textLabel=document.createElement('div');textLabel.className='cp3-divider';textLabel.textContent='6 · FRASE CORTA';box.appendChild(textLabel);
 const form=document.createElement('div');form.className='cp3-form';form.innerHTML='<input id="cp3TextInput" type="text" maxlength="18" placeholder="Ej.: ¡Qué rico!" aria-label="Frase para el personaje"><button type="button" id="cp3TextAdd">+ Texto</button>';box.appendChild(form);
 const options=document.createElement('div');options.className='cp3-form-next';options.innerHTML='<select id="cp3TextPosition" aria-label="Posición del texto"><option value="bottom">Abajo</option><option value="top">Arriba</option><option value="side">Costado</option></select><input id="cp3TextColor" type="color" value="#5e3159" aria-label="Color del texto">';box.appendChild(options);
 document.querySelector('#cp3TextAdd').onclick=cp3AddText;document.querySelector('#cp3TextInput').onkeydown=e=>{if(e.key==='Enter')cp3AddText()};
 const warn=document.createElement('div');warn.className='cp3-warning';warn.textContent='✓ Original intacto · capas editables, mover / tamaño / duplicar / eliminar / deshacer. Impresión de remix en prueba: requiere verificar frente y dorso antes de habilitarla.';box.appendChild(warn);
 updateEditorUI();
}
renderTools=function(){
 $$('.tool-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.tool===editor.tool));
 if(editor.tool==='cpPresets'){cp3RenderPanel();return;}cp3OldRenderTools();
};
function cp3BeginBlank(){cp3OldBlank();editor.tool='cpPresets';renderTools();}
function cp3StartCharacter(id){cp3OldStart(id);cp3Collection=cp3CurrentCharacter()?.collection_id||cp3Collection;editor.cpPreset=null;editor.tool='cpPresets';renderTools();}
blankEditor=cp3BeginBlank;
startEditor=cp3StartCharacter;
for(const id of ['headerCreateBtn','blankStartBtn','blankStartBtn2']){const b=document.getElementById(id);if(b)b.onclick=cp3BeginBlank;}
loadBase=function(src){if(!src){baseImage=null;drawEditor();return;}baseImage=new Image();baseImage.crossOrigin='anonymous';baseImage.decoding='async';baseImage.onload=drawEditor;baseImage.onerror=()=>{toast('No se pudo cargar el personaje. Revisá la conexión');console.warn('[CP30B] Asset no disponible',src)};baseImage.src=src;};
function cp3DrawShape(o){ctx.save();ctx.translate(o.x,o.y);ctx.rotate((o.rotation||0)*Math.PI/180);const s=cp3Limit(o.size||50,25,240);ctx.fillStyle=o.color||'#ffadc9';ctx.strokeStyle='#5f3d4e';ctx.lineWidth=Math.max(1,s*.035);ctx.beginPath();const k=o.value;
 if(k==='circle'){ctx.arc(0,0,s*.46,0,Math.PI*2)}
 else if(k==='star'){for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2? s*.21:s*.5;i?ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r):ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r)}ctx.closePath()}
 else if(k==='heart'){ctx.moveTo(0,s*.45);ctx.bezierCurveTo(-s*.7,-s*.02,-s*.48,-s*.5,0,-s*.21);ctx.bezierCurveTo(s*.48,-s*.5,s*.7,-s*.02,0,s*.45);ctx.closePath()}
 else if(k==='drop'){ctx.moveTo(0,-s*.48);ctx.bezierCurveTo(-s*.6,s*.2,-s*.43,s*.47,0,s*.47);ctx.bezierCurveTo(s*.43,s*.47,s*.6,s*.2,0,-s*.48);ctx.closePath()}
 else if(k==='flower'){for(let i=0;i<6;i++){const a=Math.PI*2*i/6;ctx.moveTo(0,0);ctx.arc(Math.cos(a)*s*.25,Math.sin(a)*s*.25,s*.24,0,Math.PI*2)}ctx.moveTo(s*.12,0);ctx.arc(0,0,s*.12,0,Math.PI*2)}
 else if(k==='cloud'){ctx.moveTo(-s*.43,s*.22);ctx.bezierCurveTo(-s*.63,-s*.09,-s*.35,-s*.36,-s*.14,-s*.26);ctx.bezierCurveTo(s*.02,-s*.55,s*.28,-s*.36,s*.3,-s*.12);ctx.bezierCurveTo(s*.63,-s*.12,s*.63,s*.3,s*.26,s*.31);ctx.lineTo(-s*.34,s*.31);ctx.closePath()}
 ctx.fill();ctx.stroke();ctx.restore();}
drawObject=function(o,i){if(o.cp30b&&o.type!=='cpShape'&&o.rotation){ctx.save();ctx.translate(o.x,o.y);ctx.rotate(o.rotation*Math.PI/180);cp3OldDrawObject({...o,x:0,y:0},-1);ctx.restore();if(i===editor.selected&&!cp3Exporting){ctx.save();const sz=Math.max(90,(o.size||90)*1.35);ctx.strokeStyle='#ff8068';ctx.lineWidth=3;ctx.setLineDash([8,6]);ctx.strokeRect(o.x-sz/2,o.y-sz/2,sz,sz);ctx.restore();}return;}if(o.type==='cpShape'){cp3DrawShape(o);if(i===editor.selected&&!cp3Exporting){ctx.save();const sz=Math.max(90,(o.size||90)*1.35);ctx.strokeStyle='#ff8068';ctx.lineWidth=3;ctx.setLineDash([8,6]);ctx.strokeRect(o.x-sz/2,o.y-sz/2,sz,sz);ctx.restore();}return;}if(cp3Exporting){const old=editor.selected;editor.selected=null;cp3OldDrawObject(o,i);editor.selected=old;}else cp3OldDrawObject(o,i);};
drawEditor=function(){if(!cp3Exporting)return cp3OldDrawEditor();ctx.clearRect(0,0,CW,CH);
 if(baseImage?.complete&&baseImage.naturalWidth>0){const ratio=Math.min(820/baseImage.naturalWidth,820/baseImage.naturalHeight);const w=baseImage.naturalWidth*ratio,h=baseImage.naturalHeight*ratio;ctx.drawImage(baseImage,(CW-w)/2,(CH-h)/2,w,h)}
 else if(!editor.baseSrc){const p=shapePath(editor.baseShape||'circle');ctx.fillStyle=editor.baseColor||'#fff8ef';ctx.fill(p,'evenodd');ctx.strokeStyle='#3c2b23';ctx.lineWidth=10;ctx.stroke(p)}
 editor.paths.forEach(drawPathStroke);editor.objects.forEach(drawObject);
};
function cp3ExportPng(){const selected=editor.selected;try{cp3Exporting=true;editor.selected=null;drawEditor();return canvas.toDataURL('image/png');}finally{cp3Exporting=false;editor.selected=selected;drawEditor();}}
const cp3Done=document.querySelector('#editorDone');if(cp3Done)cp3Done.onclick=()=>{try{const data=cp3ExportPng();document.querySelector('#exportPreview').src=data;show('export')}catch(e){console.error('[CP30B] PNG export:',e);toast('No se pudo exportar. Revisá carga del personaje')}};
const cp3Download=document.querySelector('#downloadPng');if(cp3Download)cp3Download.onclick=()=>{try{download((editor.sourceName||'Mi-Squishy')+'-cp30b.png',cp3ExportPng(),'url')}catch(e){toast('No se pudo descargar PNG');console.error(e)}};
const cp3Print=document.querySelector('#printRemixBtn');if(cp3Print)cp3Print.onclick=()=>{if(editor.cpPreset||editor.objects.some(o=>o.cp30b)){alert('CP3.0B: impresión del remix todavía en validación. Primero debemos comprobar que frente y dorso coincidan al 100%. Podés descargar el PNG de prueba.');return;}prepareRemixPrint();};
const cp3Rotate=document.createElement('div');cp3Rotate.className='cp3-form-next';cp3Rotate.style.cssText='align-items:center;margin-top:10px;padding:8px;background:#fff7e7;border-radius:10px';cp3Rotate.innerHTML='<label style="font-size:10px;white-space:nowrap;font-weight:900">↻ Girar capa</label><input id="cp3Rotation" type="range" min="-45" max="45" step="5" value="0" disabled><output id="cp3RotationValue" style="font-size:11px">0°</output>';const cp3SelectedPanel=document.querySelector('.selected-tools');if(cp3SelectedPanel)cp3SelectedPanel.appendChild(cp3Rotate);
const cp3UpdateOriginal=updateEditorUI;
updateEditorUI=function(){cp3UpdateOriginal();const o=selectedObject(),range=document.querySelector('#cp3Rotation'),label=document.querySelector('#cp3RotationValue');if(range){range.disabled=!o?.cp30b;range.value=o?.rotation||0;if(label)label.textContent=(o?.rotation||0)+'°';}};
let cp3RotGesture=false;const cp3RotRange=document.querySelector('#cp3Rotation');if(cp3RotRange){cp3RotRange.addEventListener('pointerdown',()=>{if(selectedObject()?.cp30b){snapshot();cp3RotGesture=true}});cp3RotRange.addEventListener('input',e=>{const o=selectedObject();if(!o?.cp30b)return;if(!cp3RotGesture){snapshot();cp3RotGesture=true}o.rotation=+e.target.value;document.querySelector('#cp3RotationValue').textContent=o.rotation+'°';drawEditor()});cp3RotRange.addEventListener('change',()=>{cp3RotGesture=false})}
canvas.addEventListener('pointerup',()=>{const o=editor.objects[editor.selected];if(o?.cp30b){o.x=cp3Limit(o.x,240,760);o.y=cp3Limit(o.y,240,760);drawEditor();}});
window.PSQ_CP30B={active:true,release:CP30B_VERSION,getCollections:()=>cp3Collections().map(x=>x.name),getCharacterCount:()=>cp3Characters().length,selectCharacter:(id)=>startEditor(id),getCurrent:()=>({sourceId:editor.sourceId,preset:editor.cpPreset,objects:editor.objects.length}),testApply:(id)=>cp3ApplyStyle(id),exportPng:cp3ExportPng};
console.info('[PSQ] Creator Plus CP3.0B TEST listo',window.PSQ_CP30B);