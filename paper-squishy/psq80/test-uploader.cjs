const {chromium}=require('playwright');
const fs=require('fs'),http=require('http'),path=require('path');
const root=path.resolve(__dirname,'../..');
const html=fs.readFileSync(path.join(root,'paper-squishy/psq80-upload.html'),'utf8');
const server=http.createServer((_q,res)=>{res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end(html)});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});const cases=[];
 try{
  for(const admin of [true,false]){
   const ctx=await browser.newContext({viewport:{width:390,height:850}});
   const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   const email=admin?'pasalochevere@gmail.com':'someone@example.com';
   const mock='window.__testUploads=0;window.supabase={createClient:()=>({auth:{getUser:async()=>({data:{user:{email:'+JSON.stringify(email)+'}},error:null})},storage:{from:()=>({list:async()=>({data:[{name:"02_PAPER_SQUISHY_50_PERSONAJES.pdf"}],error:null}),upload:async()=>{window.__testUploads++;return {error:null}}})}})}';
   await page.route('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',r=>r.fulfill({status:200,contentType:'application/javascript',body:mock}));
   await page.goto('http://127.0.0.1:'+server.address().port,{waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>document.querySelector('#auth')?.textContent!=='Comprobando cuenta…',null,{timeout:15000});
   let d=await page.evaluate(()=>({auth:document.getElementById('auth').textContent,disabled:document.getElementById('submit').disabled}));
   if(!d.disabled)throw Error('Wrong default button '+JSON.stringify(d));
   if(admin){
    if(!d.auth.includes('Administrador reconocido'))throw Error('Admin state '+JSON.stringify(d));
    for(const id of ['color','bn'])await page.locator('#'+id).setInputFiles({name:'wrong.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF bad')});
    await page.locator('#submit').click();
    await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('La carga no finalizó'),null,{timeout:12000});
    const uploads=await page.evaluate(()=>window.__testUploads);
    if(uploads!==0)throw Error('Mutated storage for malformed PDF');
   }else if(!d.auth.includes('Acceso pendiente'))throw Error('Unauthorized state missing');
   if(errors.length)throw Error('JS errors: '+errors.join('; '));
   cases.push({admin,status:'PASS'});
   await ctx.close();
  }
 }finally{await browser.close();server.close()}
 console.log('PSQ80 PRIVATE UPLOADER QA',JSON.stringify(cases));
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
