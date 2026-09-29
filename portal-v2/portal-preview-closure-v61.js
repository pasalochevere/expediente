/* Public-preview usability only: no checkout, licence or price mutations. */
(()=>{
if(window.__pcPreviewClosureV61)return;window.__pcPreviewClosureV61=true;
function enhance(){
 const modal=document.getElementById('pcRealPreviewModal');if(!modal||modal.classList.contains('hidden'))return;
 const slides=[...modal.querySelectorAll('.pcRv2Slide')];
 slides.forEach(s=>{const hidden=!s.classList.contains('active');if(s.getAttribute('aria-hidden')!==String(hidden))s.setAttribute('aria-hidden',String(hidden))});
 modal.querySelectorAll('.pcRv2Thumb').forEach(b=>{const val=String(b.classList.contains('active'));if(b.getAttribute('aria-pressed')!==val)b.setAttribute('aria-pressed',val)});
 const price=modal.querySelector('#pcRv2Price');if(price?.textContent==='Según catálogo')price.textContent='Precio a consultar';
 const info=modal.querySelector('.pcRv2Info');
 if(info&&!info.querySelector('.pc61Terms')){const p=document.createElement('p');p.className='pc61Terms';info.appendChild(p)}
 const title=modal.querySelector('#pcRv2Title')?.textContent||'';
 const txt=/Matemática|Verdad o Reto|Víncores/.test(title)?'El importe del portal corresponde al acceso digital. Las piezas físicas se ofrecen según la publicación de compra. Vigencia según el acceso adquirido.':'Vigencia y condiciones según el acceso adquirido.';
 const terms=info?.querySelector('.pc61Terms');if(terms&&terms.textContent!==txt)terms.textContent=txt;
 if(modal.dataset.pcClosure61)return;modal.dataset.pcClosure61='1';
 const stage=modal.querySelector('.pcRv2StageWrap');
 if(stage&&!stage.dataset.pcSwipe21c){stage.dataset.pcSwipe21c='1';stage.style.touchAction='pan-y';let x=0,y=0;stage.addEventListener('touchstart',e=>{const t=e.touches[0];if(t){x=t.clientX;y=t.clientY}},{passive:true});stage.addEventListener('touchend',e=>{const t=e.changedTouches[0];if(!t)return;const dx=t.clientX-x,dy=t.clientY-y;if(Math.abs(dx)>48&&Math.abs(dx)>Math.abs(dy)*1.15)modal.querySelector(`[data-dir="${dx<0?1:-1}"]`)?.click()},{passive:true})}
 modal.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const a=[...modal.querySelectorAll('button,a,input,[tabindex="0"]')].filter(n=>!n.disabled&&n.offsetParent!==null);if(!a.length)return;if(e.shiftKey&&document.activeElement===a[0]){e.preventDefault();a.at(-1).focus()}else if(!e.shiftKey&&document.activeElement===a.at(-1)){e.preventDefault();a[0].focus()}});
}
let queued=false;const queue=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;enhance()})};new MutationObserver(queue).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});enhance();
})();
