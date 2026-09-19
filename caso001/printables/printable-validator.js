(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  root.Caso001PrintableValidator=api;
})(typeof self!=='undefined'?self:this,function(){
  const ALLOWED_TYPES=new Set(['temporal','testimonial','physical','digital','access','motivational']);
  const ALLOWED_STAGES=new Set([1,2,3]);
  const REQUIRED_PACK_FIELDS=['id','title','killer','location','keyObject','motive','truthSummary','criticalEvent','mechanism','postCrimeAction','centralLie','contradiction','timeline','evidence','epilogue'];

  function isNonEmptyString(v){return typeof v==='string'&&v.trim().length>0;}
  function add(list,code,message,context){list.push({code,message,context:context||null});}

  function auditEvidence(e,index,errors,warnings,stageCounts){
    const ctx={index,id:e&&e.id||null};
    if(!e||typeof e!=='object'){
      add(errors,'EVIDENCE_OBJECT','La evidencia no es un objeto válido.',ctx);return;
    }
    if(!isNonEmptyString(e.id)) add(errors,'EVIDENCE_ID','Falta evidence.id.',ctx);
    if(!ALLOWED_TYPES.has(e.type)) add(errors,'EVIDENCE_TYPE',`Tipo no soportado para impresión: ${String(e.type)}`,ctx);
    if(!ALLOWED_STAGES.has(Number(e.stage))) add(errors,'EVIDENCE_STAGE',`Etapa inválida: ${String(e.stage)}`,ctx);
    else stageCounts[Number(e.stage)]++;
    if(typeof e.public!=='boolean') add(errors,'EVIDENCE_PUBLIC','evidence.public debe ser boolean.',ctx);
    if(!isNonEmptyString(e.text)) add(errors,'EVIDENCE_TEXT','Falta evidence.text.',ctx);

    if(e.public===false){
      if(!isNonEmptyString(e.sourceCharacter)) add(errors,'PRIVATE_SOURCE','Evidencia privada sin sourceCharacter.',ctx);
      if(!e.delivery||e.delivery.human!=='private'||e.delivery.npc!=='casefile'){
        add(errors,'PRIVATE_DELIVERY','Evidencia privada sin delivery human/private + npc/casefile.',ctx);
      }
      if(!isNonEmptyString(e.npcFallback)) add(errors,'NPC_FALLBACK','Evidencia privada sin npcFallback.',ctx);
    }

    if(e.printSpec){
      if(typeof e.printSpec!=='object') add(errors,'PRINT_SPEC','printSpec debe ser objeto.',ctx);
      if(e.printSpec&&'text' in e.printSpec){
        add(errors,'PRINT_SPEC_DUPLICATE_TEXT','printSpec no puede duplicar el texto narrativo.',ctx);
      }
    }
  }

  function auditPack(pack){
    const errors=[],warnings=[];
    if(!pack||typeof pack!=='object') return {ok:false,errors:[{code:'PACK_OBJECT',message:'Pack inválido.',context:null}],warnings:[],summary:null};

    REQUIRED_PACK_FIELDS.forEach(k=>{
      if(!(k in pack)||pack[k]===null||pack[k]==='') add(errors,'REQUIRED_FIELD',`Falta campo obligatorio: ${k}`,{field:k});
    });

    if(!Array.isArray(pack.timeline)||pack.timeline.length<3) add(errors,'TIMELINE','timeline debe contener al menos 3 eventos.',null);
    if(!Array.isArray(pack.evidence)||pack.evidence.length<6) add(errors,'EVIDENCE_COUNT','Se requieren al menos 6 evidencias.',null);

    const stageCounts={1:0,2:0,3:0};
    if(Array.isArray(pack.evidence)) pack.evidence.forEach((e,i)=>auditEvidence(e,i,errors,warnings,stageCounts));

    [1,2,3].forEach(stage=>{
      if(stageCounts[stage]===0) add(errors,'STAGE_EMPTY',`No hay evidencia en E${stage}.`,{stage});
    });

    if(!pack.epilogue||!Array.isArray(pack.epilogue.reconstruction)||pack.epilogue.reconstruction.length<3){
      add(errors,'EPILOGUE_RECONSTRUCTION','epilogue.reconstruction debe tener al menos 3 pasos.',null);
    }
    if(!pack.epilogue||!isNonEmptyString(pack.epilogue.closing)) add(errors,'EPILOGUE_CLOSING','Falta epilogue.closing.',null);

    const privateCount=Array.isArray(pack.evidence)?pack.evidence.filter(e=>e&&e.public===false).length:0;
    const publicCount=Array.isArray(pack.evidence)?pack.evidence.filter(e=>e&&e.public===true).length:0;

    if(Array.isArray(pack.evidence)&&!pack.evidence.some(e=>e&&e.type==='testimonial')){
      add(warnings,'NO_TESTIMONIAL','El pack no contiene evidencia testimonial; revisar variedad visual.',null);
    }

    return {
      ok:errors.length===0,
      errors,
      warnings,
      summary:{
        packId:pack.id||null,
        evidenceCount:Array.isArray(pack.evidence)?pack.evidence.length:0,
        publicCount,
        privateCount,
        stageCounts,
        printableTemplates:Array.isArray(pack.evidence)?[...new Set(pack.evidence.map(e=>e&&e.type).filter(Boolean))]:[]
      }
    };
  }

  function releaseForPrint(pack,currentStage,context){
    const stage=Math.max(1,Math.min(3,Number(currentStage)||1));
    const humanCharacters=new Set((context&&context.humanCharacters)||[]);
    const viewerCharacter=context&&context.viewerCharacter||null;
    const out={public:[],private:[],npc:[]};
    if(!pack||!Array.isArray(pack.evidence)) return out;

    for(const e of pack.evidence){
      if(Number(e.stage)>stage) continue;
      if(e.public===true){out.public.push({...e,printText:e.text,printChannel:'PUBLIC'});continue;}
      if(e.public===false&&isNonEmptyString(e.sourceCharacter)){
        if(humanCharacters.has(e.sourceCharacter)){
          if(viewerCharacter===e.sourceCharacter){
            out.private.push({...e,printText:e.text,printChannel:`PRIVATE::${e.sourceCharacter}`});
          }
        }else if(isNonEmptyString(e.npcFallback)){
          out.npc.push({...e,printText:e.npcFallback,printChannel:'NPC'});
        }
      }
    }
    return out;
  }

  return {auditPack,releaseForPrint,ALLOWED_TYPES:[...ALLOWED_TYPES]};
});
