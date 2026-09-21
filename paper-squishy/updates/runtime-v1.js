(()=>{
  const REQUIRED=['hero','front_print','back_print','coloring','editor_asset','character_card','tutorial','mockup'];
  function validatePack(pack){
    const errors=[];
    if(!pack||pack.status!=='QA_PASS'&&pack.status!=='LIVE')errors.push('pack_not_publishable');
    if(!Array.isArray(pack?.characters)||pack.characters.length!==10)errors.push('characters_must_equal_10');
    for(const ch of pack?.characters||[]){
      if(!ch.id||!ch.slug||!ch.name||!ch.collection_id)errors.push('invalid_character:'+String(ch?.id||ch?.slug||'?'));
      const paths=ch.asset_paths||ch.assets||{};
      for(const key of REQUIRED){if(!paths[key])errors.push('missing_'+key+':'+String(ch?.id||ch?.slug||'?'));}
    }
    return {ok:errors.length===0,errors};
  }
  function normalizeCharacter(ch){
    if(ch.assets)return ch;
    const assets={};
    for(const key of REQUIRED){
      assets[key]={path:ch.asset_paths[key]};
    }
    return {...ch,status:'approved',editor_ready:true,assets};
  }
  function merge(base,packs){
    const next=JSON.parse(JSON.stringify(base));
    next.collections=Array.isArray(next.collections)?next.collections:[];
    next.characters=Array.isArray(next.characters)?next.characters:[];
    const ids=new Set(next.characters.map(x=>x.id));
    const slugs=new Set(next.characters.map(x=>x.slug));
    const collIds=new Set(next.collections.map(x=>x.id));
    for(const pack of packs||[]){
      const v=validatePack(pack); if(!v.ok)continue;
      if(!collIds.has(pack.collection.id)){
        next.collections.push({...pack.collection,status:'approved'});
        collIds.add(pack.collection.id);
      }
      for(const raw of pack.characters){
        if(ids.has(raw.id)||slugs.has(raw.slug))continue;
        const ch=normalizeCharacter(raw);
        next.characters.push(ch);ids.add(ch.id);slugs.add(ch.slug);
      }
    }
    next.collections.sort((a,b)=>(a.order||999)-(b.order||999));
    next.characters.sort((a,b)=>((a.collection_id||'').localeCompare(b.collection_id||''))||((a.order||999)-(b.order||999)));
    next.character_count=next.characters.length;
    next.update_runtime='P2.5-runtime-v1';
    return next;
  }
  window.PSQUpdateRuntime={version:'1.0',requiredAssets:REQUIRED,validatePack,merge};
})();