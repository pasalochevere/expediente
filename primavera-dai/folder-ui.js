(()=>{
  'use strict';

  function setFolderState(group, open){
    const body=group.querySelector('.folderBody');
    const title=group.querySelector('.groupTitle');
    const toggle=group.querySelector('.folderOpenBtn');
    const head=group.querySelector('.groupHead');
    if(!body||!title||!head)return;

    body.hidden=!open;
    group.classList.toggle('folderOpen',open);
    head.setAttribute('aria-expanded',String(open));
    title.textContent=(open?'📂 ':'📁 ')+title.textContent.replace(/^[📁📂]\s*/u,'');
    if(toggle)toggle.textContent=open?'CERRAR':'ABRIR';
  }

  function folderize(group){
    if(!group||group.dataset.folderized==='1')return;
    const head=group.querySelector('.groupHead');
    const grid=group.querySelector('.groupGrid');
    if(!head||!grid)return;

    group.dataset.folderized='1';
    head.setAttribute('role','button');
    head.setAttribute('tabindex','0');
    head.setAttribute('aria-expanded','false');

    const body=document.createElement('div');
    body.className='folderBody';
    grid.parentNode.insertBefore(body,grid);
    body.appendChild(grid);

    let actions=head.querySelector('.groupActions');
    if(!actions){
      actions=document.createElement('div');
      actions.className='groupActions';
      head.appendChild(actions);
    }

    const toggle=document.createElement('button');
    toggle.type='button';
    toggle.className='folderOpenBtn';
    toggle.textContent='ABRIR';
    actions.insertBefore(toggle,actions.firstChild);

    const toggleFolder=()=>setFolderState(group,body.hidden);

    toggle.addEventListener('click',e=>{
      e.stopPropagation();
      toggleFolder();
    });

    head.addEventListener('click',e=>{
      if(e.target.closest('button'))return;
      toggleFolder();
    });

    head.addEventListener('keydown',e=>{
      if(e.target.closest('button'))return;
      if(e.key==='Enter'||e.key===' '){
        e.preventDefault();
        toggleFolder();
      }
    });

    setFolderState(group,false);
  }

  function folderizeAll(){
    document.querySelectorAll('#gallery .memoryGroup').forEach(folderize);
  }

  function boot(){
    folderizeAll();
    const gallery=document.getElementById('gallery');
    if(!gallery)return;
    const observer=new MutationObserver(()=>folderizeAll());
    observer.observe(gallery,{childList:true,subtree:false});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
