/* Butter Mania BM20-R5R1 · self-contained real browser QA.
   Source files and factory stable are READ-ONLY. */
const {chromium}=require('playwright'),http=require('http'),fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'../..'),out=path.join(__dirname,'output');
fs.mkdirSync(out,{recursive:true});
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.json':'application/json','.zip':'application/zip','.webp':'image/webp','.png':'image/png'};
const server=http.createServer((req,res)=>{
 const route=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 let file=path.resolve(root,'.'+route);
 if(!file.startsWith(root+path.sep))return res.writeHead(403).end('forbidden');
 fs.readFile(file,(err,data)=>{if(err)return res.writeHead(404).end('missing '+route);res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.setHeader('Cache-Control','no-store');res.end(data)});
});
const expect=(v,msg)=>{if(!v)throw Error(msg)};
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const origin='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const reports=[],issues=[];
 async function check(label,fn){
  try{const value=await fn();reports.push({label,status:'PASS',details:value});console.log('PASS',label,JSON.stringify(value||{}).slice(0,500))}
  catch(e){issues.push({label,error:String(e.stack||e)});reports.push({label,status:'FAIL',error:String(e.message||e)});console.error('FAIL',label,String(e.message||e))}
 }
 try{
  for(const width of [320,390,768,1280]){
   const ctx=await browser.newContext({viewport:{width,height:880},deviceScaleFactor:1,reducedMotion:'reduce'});
   const page=await ctx.newPage(),errors=[],badResponses=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('response',r=>{if(r.status()>=400)badResponses.push({url:r.url(),status:r.status()})});
   await page.goto(origin+'/paper-squishy/factory-butter-native-r5.html',{waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>window.BM20_RECOVERED?.ready,{timeout:20000});
   await check('Carga R5 '+width+'px',async()=>{
    const d=await page.evaluate(()=>({ready:window.BM20_RECOVERED?.ready,characters:window.BM20_RECOVERED?.characters,baseViews:window.BM20_RECOVERED?.baseViews,cards:document.querySelectorAll('#cards .card').length,tabs:document.querySelectorAll('#view-buttons [data-view]').length,bodyWidth:document.documentElement.scrollWidth,viewport:innerWidth,image:document.querySelector('#focus-img')?.naturalWidth}));
    expect(d.characters===20&&d.cards===20,'20 personajes incompletos');expect(d.tabs===9,'no hay nueve pestañas');expect(d.image>100,'imagen principal no decodifica');expect(d.bodyWidth<=d.viewport+1,'desbordamiento horizontal: '+d.bodyWidth+' vs '+d.viewport);return d;
   });
   if(width===390){
    await check('Filtros de las tres familias',async()=>{
     const results=[];
     for(const filter of ['Mantecas','Quesitos','Cremitas','Todos']){
      await page.locator('#filters [data-filter="'+filter+'"]').click();
      const r=await page.evaluate(()=>({filter:[...document.querySelectorAll('#filters [aria-pressed="true"]')].map(x=>x.dataset.filter)[0],count:document.querySelectorAll('#cards .card').length,text:document.getElementById('count').textContent}));
      expect(r.filter===filter&&r.count>0,'filtro vacío '+filter);results.push(r);
     }
     expect(results.reduce((n,x)=>n+x.count,0)-20===20,'conteos de familias no suman 20');
     return results;
    });

    await check('20 selecciones reales de personajes en móvil',async()=>{
     await page.locator('#filters [data-filter="Todos"]').click();
     const detail=[];
     for(let i=0;i<20;i++){
      const card=page.locator('#cards .card[data-index="'+i+'"]');
      await card.click({timeout:5000});
      await page.waitForFunction(i=>{
       const chosen=document.querySelector('#cards .card[aria-pressed="true"]');
       const img=document.getElementById('focus-img');
       return chosen&&Number(chosen.dataset.index)===i&&img?.naturalWidth>0;
      },i,{timeout:5000});
      const d=await page.evaluate(()=>({selected:Number(document.querySelector('#cards .card[aria-pressed="true"]').dataset.index),name:document.getElementById('selected-name').textContent,src:document.getElementById('focus-img').naturalWidth,activeCards:document.querySelectorAll('#cards .card[aria-pressed="true"]').length}));
      expect(d.selected===i&&d.activeCards===1&&d.src>0,'selección visual incorrecta '+i+': '+JSON.stringify(d));
      detail.push(d.name);
     }
     return {clicks:detail.length,uniqueNames:new Set(detail).size,first:detail[0],last:detail[19]};
    });
    await check('80 imágenes básicas: frente y dorso color/B&N',async()=>{
     const diag=await page.evaluate(async()=>{
      const out=[];
      for(let i=0;i<20;i++){
       window.BM20_RECOVERED.select(i);
       for(const key of ['front_print','back_print','coloring','coloring_back']){
        document.querySelector('#view-buttons [data-view="'+key+'"]').click();
        const img=document.getElementById('focus-img');
        if(!img.complete)await new Promise((resolve,reject)=>{img.addEventListener('load',resolve,{once:true});img.addEventListener('error',reject,{once:true})});
        out.push({index:i+1,key,src:img.currentSrc.slice(0,12),width:img.naturalWidth,height:img.naturalHeight,ok:img.naturalWidth>100&&img.naturalHeight>100});
       }
      }
      return out;
     });
     const bad=diag.filter(x=>!x.ok);expect(!bad.length,'fallan imágenes básicas '+JSON.stringify(bad.slice(0,8)));
     expect(diag.every(x=>x.src.startsWith('data:image/')||x.src.startsWith('blob:')),'vistas básicas con fuente inválida');
     return {total:diag.length,passed:diag.filter(x=>x.ok).length,sourceTypes:[...new Set(diag.map(x=>x.src))],minWidth:Math.min(...diag.map(x=>x.width)),minHeight:Math.min(...diag.map(x=>x.height))};
    });
    await check('Descarga 12 ZIP y 180 vistas reales',async()=>{
     await page.locator('#view-buttons [data-view="hero"]').click();
     await page.waitForFunction(()=>window.BM20_RECOVERED.expandedViews()===180||document.querySelector('#load-state')?.textContent.includes('no se pudieron'),{timeout:45000});
     const d=await page.evaluate(()=>({loaded:window.BM20_RECOVERED.expandedViews(),message:document.querySelector('#load-state').textContent}));
     expect(d.loaded===180,'solo '+d.loaded+' recursos expandidos: '+d.message);return d;
    });
    await check('180 pestañas reales por personaje',async()=>{
     const d=await page.evaluate(async()=>{
      const rows=[],keys=['hero','front_print','back_print','coloring','coloring_back','editor_asset','character_card','tutorial','mockup'];
      for(let i=0;i<20;i++){
       window.BM20_RECOVERED.select(i);
       for(const key of keys){
        document.querySelector('#view-buttons [data-view="'+key+'"]').click();
        const img=document.getElementById('focus-img');
        if(!img.complete)await new Promise((resolve,reject)=>{img.addEventListener('load',resolve,{once:true});img.addEventListener('error',reject,{once:true})});
        rows.push({i:i+1,key,src:img.currentSrc.slice(0,12),w:img.naturalWidth,h:img.naturalHeight});
       }
      }return rows;
     });
     const bad=d.filter(x=>x.w<100||x.h<100);
     expect(!bad.length,'vistas sin imagen '+JSON.stringify(bad.slice(0,8)));
     const expanded=d.filter(x=>!['front_print','back_print','coloring','coloring_back'].includes(x.key));
     expect(expanded.every(x=>x.src.startsWith('blob:')),'vistas ampliadas usan fallback o recurso incorrecto');
     return {verified:d.length,expanded:expanded.length,broken:bad.length,minImageWidth:Math.min(...d.map(x=>x.w)),maxImageWidth:Math.max(...d.map(x=>x.w)),minImageHeight:Math.min(...d.map(x=>x.h)),maxImageHeight:Math.max(...d.map(x=>x.h))};
    });
    await page.screenshot({path:path.join(out,'butter-r5-mobile-390.png'),fullPage:true});
   }
   await page.screenshot({path:path.join(out,'butter-r5-'+width+'.png'),fullPage:true});
   await check('Consola/HTTP '+width+'px',()=>{expect(errors.length===0,'JavaScript '+errors.join('; '));expect(badResponses.length===0,'HTTP '+JSON.stringify(badResponses));return {jsErrors:errors.length,httpErrors:badResponses.length}});
   await ctx.close();
  }
 }finally{
  fs.writeFileSync(path.join(out,'bm20-r5r1-report.json'),JSON.stringify({reports,issues},null,2));
  await browser.close();server.close();
 }
 console.log('BM20 SUMMARY',reports.filter(x=>x.status==='PASS').length,'PASS',issues.length,'FAIL');
 if(issues.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;server.close()});
