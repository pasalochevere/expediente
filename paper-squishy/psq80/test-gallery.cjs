const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),http=require('http');
const root=path.resolve(__dirname,'../..');
const server=http.createServer((req,res)=>{
 const file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
 if(!file.startsWith(root+path.sep))return res.writeHead(403).end();
 fs.readFile(file,(err,bytes)=>{if(err)return res.writeHead(404).end('missing');const ext=path.extname(file);res.setHeader('Content-Type',{'.html':'text/html','.json':'application/json','.js':'text/javascript','.webp':'image/webp'}[ext]||'application/octet-stream');res.end(bytes)});
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const results=[];
 try{
  for(const w of [390,1280]){
   const ctx=await browser.newContext({viewport:{width:w,height:850},serviceWorkers:'block',reducedMotion:'reduce'});
   const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:'+server.address().port+'/paper-squishy/factory-80-staging.html',{waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>document.querySelectorAll('#grid .tile').length===80,{timeout:20000});
   const base=await page.evaluate(()=>({cards:document.querySelectorAll('#grid .tile').length,filters:document.querySelectorAll('#filters [data-collection]').length,scrollWidth:document.documentElement.scrollWidth,viewport:innerWidth,ids:[...document.querySelectorAll('#grid .tile')].map(n=>n.dataset.id)}));
   if(base.cards!==80||base.filters!==8||new Set(base.ids).size!==80||base.scrollWidth>base.viewport+1)throw Error('Failed base '+JSON.stringify(base));
   await page.locator('[data-collection="butter_mania"]').click();
   if(await page.locator('#grid .tile').count()!==20)throw Error('Butter filter not 20');
   await page.locator('#grid .tile').first().click();
   await page.waitForFunction(()=>document.querySelector('#front')?.naturalWidth>0&&document.querySelector('#back')?.naturalWidth>0,{timeout:15000});
   await page.locator('[data-mode="bn"]').click();
   await page.waitForFunction(()=>document.querySelector('#front')?.complete&&document.querySelector('#front')?.naturalWidth>0&&document.querySelector('#back')?.naturalWidth>0,{timeout:12000});
   await page.locator('[data-collection="animal_cuties"]').click();
   if(await page.locator('#grid .tile').count()!==10)throw Error('Original filter not 10');
   await page.locator('#grid .tile').first().click();
   await page.waitForFunction(()=>document.querySelector('#front')?.naturalWidth>0&&document.querySelector('#back')?.naturalWidth>0,{timeout:15000});
   if(errors.length)throw Error('JS errors '+errors.join(';'));
   results.push({viewport:w,full:base.cards,butter:20,original_collection:10,errors:0});
   await ctx.close();
  }
 }finally{await browser.close();server.close()}
 console.log('PSQ80 GALLERY QA PASSED',JSON.stringify(results));
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
