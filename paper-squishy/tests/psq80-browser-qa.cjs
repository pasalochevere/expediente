const {chromium}=require('playwright'),fs=require('fs'),http=require('http'),path=require('path');
const root=path.resolve(__dirname,'../..');
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.zip':'application/zip','.webp':'image/webp'};
const server=http.createServer((req,res)=>{
 const p=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://local').pathname));
 if(!p.startsWith(root+path.sep))return res.writeHead(403).end();
 fs.readFile(p,(e,b)=>{if(e)return res.writeHead(404).end('not found');res.setHeader('Content-Type',mime[path.extname(p)]||'application/octet-stream');res.end(b)});
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:390,height:844}});
 const page=await context.newPage();const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try{
  await page.route('https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js',r=>r.fulfill({status:200,contentType:'application/javascript',body:fs.readFileSync(require.resolve('jszip/dist/jszip.min.js'))}));
  await page.goto('http://127.0.0.1:'+server.address().port+'/paper-squishy/psq80-test.html',{waitUntil:'load'});
  await page.waitForFunction(()=>window.PSQ80_EXTENSION?.ready===true||window.PSQ80_EXTENSION?.errors?.length>0,null,{timeout:90000});
  const result=await page.evaluate(async()=>{
   const s=window.PSQ80_EXTENSION,L=window.PS_LIBRARY,items=L.characters.filter(x=>x.collection_id==='butter_mania');
   const per=items.map(c=>Object.keys(c.assets).length);
   const codes=items.map(c=>c.code),imgs=[];
   for(const c of items)for(const key of ['hero','front_print','back_print','coloring','coloring_back','editor_asset']){
    const a=c.assets[key];
    imgs.push(await new Promise(resolve=>{const i=new Image();i.onload=()=>resolve({code:c.code,key,good:i.naturalWidth>100&&i.naturalHeight>100});i.onerror=()=>resolve({code:c.code,key,good:false});i.src=a.path;}));
   }
   return {ready:s.ready,errors:s.errors,characters:L.characters.length,collections:L.collections.length,assets:s.assets,butter:items.length,uniqueCodes:new Set(codes).size,allNine:per.every(x=>x===9),failedImages:imgs.filter(x=>!x.good),last:L.characters.at(-1)?.code};
  });
  if(!result.ready||result.errors.length||result.characters!==80||result.collections!==7||result.assets!==180||result.butter!==20||result.uniqueCodes!==20||!result.allNine||result.failedImages.length||errors.length)throw Error(JSON.stringify({result,errors}).slice(0,2500));
  console.log('PASS PSQ80 extension: 60 stable + 20 Butter / 7 collections / 180 real WebP, 120 decoded checks',JSON.stringify(result));
 }finally{await context.close();await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
