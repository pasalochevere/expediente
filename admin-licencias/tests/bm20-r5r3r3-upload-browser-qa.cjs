const {chromium}=require('playwright');
const fs=require('fs'),http=require('http'),path=require('path');
const root=path.resolve(__dirname,'../..');
const html=fs.readFileSync(path.join(root,'admin-licencias/butter-mania-bn-r5r3r3.html'),'utf8');
const assert=(x,m)=>{if(!x)throw new Error(m)};
const server=http.createServer((_req,res)=>{res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end(html)});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const tests=[];
 try{
  for(const scenario of ['admin','nonadmin','product-active','already-staged']){
   const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   const assets=[
    {id:'old',file_name:'BM20_20_A4_APAISADO_BN_FRENTE_DORSO.pdf',file_size:8240058,product_code:'PSQ-BUTTER-20',enabled:false},
    {id:'color',file_name:'BM20_20_A4_APAISADO_COLOR_FRENTE_DORSO.pdf',file_size:24850286,product_code:'PSQ-BUTTER-20',enabled:false}
   ];
   if(scenario==='already-staged')assets.push({id:'staged',file_name:'BM20_20_A4_APAISADO_BN_FRENTE_DORSO_R5R3R1.pdf',file_size:8219759,product_code:'PSQ-BUTTER-20',enabled:false});
   const result={catalog:[{product_code:'PSQ-BUTTER-20',delivery_type:'download',enabled:scenario==='product-active'}],assets};
   const email=scenario==='nonadmin'?'someone-else@example.com':'pasalochevere@gmail.com';
   const stub='window.supabase={createClient:()=>({auth:{getUser:async()=>({data:{user:{email:'+JSON.stringify(email)+'}},error:null})},functions:{invoke:async(name,{body})=>({data:body.action==="admin_overview"?Object.assign({ok:true},'+JSON.stringify(result)+'):{ok:false,error:"Bloqueado en QA"},error:null})}})}';
   await page.route('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',route=>route.fulfill({status:200,contentType:'application/javascript',body:stub}));
   await page.goto('http://127.0.0.1:'+server.address().port,{waitUntil:'load'});
   await page.waitForFunction(()=>document.querySelector('#auth')?.textContent!=='Comprobando acceso...',null,{timeout:12000});
   const x=await page.evaluate(()=>({auth:document.querySelector('#auth').textContent,button:document.querySelector('#stage').disabled}));
   assert(x.button,'El boton no debe habilitarse sin archivo');
   if(scenario==='admin')assert(x.auth.includes('Sesión correcta'),JSON.stringify(x));
   if(scenario==='nonadmin')assert(x.auth.includes('Iniciá sesión administradora'),JSON.stringify(x));
   if(scenario==='product-active')assert(x.auth.includes('deshabilitado'),JSON.stringify(x));
   if(scenario==='already-staged')assert(x.auth.includes('ya registrada'),JSON.stringify(x));
   assert(errors.length===0,'Errores JS '+errors.join(';'));
   if(scenario==='admin'){
    await page.locator('#file').setInputFiles({name:'mal.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4 TEST')});
    assert(!(await page.locator('#stage').isDisabled()),'Se espera boton habilitado despues de seleccionar');
    await page.locator('#stage').click();
    await page.waitForFunction(()=>document.querySelector('#status')?.textContent.includes('NO quedó aprobada'),null,{timeout:12000});
    const e=await page.locator('#status').innerText();
    assert(e.includes('Tamaño o extensión incorrectos'),e);
   }
   tests.push({scenario,status:'PASS'});
   await context.close();
  }
 }finally{await browser.close();server.close()}
 console.log('BM20 R5R3R3 ADMIN UI',tests.length,'PASS',JSON.stringify(tests));
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
