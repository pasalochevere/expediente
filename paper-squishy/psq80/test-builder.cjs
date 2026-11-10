const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),http=require('http');
const root=path.resolve(__dirname,'../..');
const server=http.createServer((req,res)=>{
 const file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
 if(!file.startsWith(root+path.sep))return res.writeHead(403).end();
 fs.readFile(file,(err,bytes)=>{if(err)return res.writeHead(404).end('missing');res.setHeader('Content-Type',{'.html':'text/html','.js':'text/javascript','.json':'application/json'}[path.extname(file)]||'application/octet-stream');res.end(bytes)});
});
(async()=>{
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto('http://127.0.0.1:'+server.address().port+'/paper-squishy/psq80-builder.html',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>!!window.PDFLib,null,{timeout:30000});
 await page.locator('#verify').click();
 await page.waitForFunction(()=>/certificadas|ERROR/.test(document.querySelector('#sources')?.textContent||''),null,{timeout:150000});
 const txt=await page.locator('#sources').innerText();
 if(!txt.includes('60 páginas color + 60 B/N'))throw Error('Master source verification failed: '+txt);
 const e=await page.evaluate(async()=>{
  const PDF=window.PDFLib;
  const url='https://raw.githubusercontent.com/pasalochevere/expediente/feat/psq80-staging-20261110/paper-squishy/psq80/generated/PSQ60_A4_APAISADO_COLOR_FRENTE_DORSO.pdf';
  const original=await PDF.PDFDocument.load(await (await fetch(url)).arrayBuffer());
  const sample=await PDF.PDFDocument.create();
  for(let i=0;i<20;i++)sample.addPage([842,595]);
  const composed=await PDF.PDFDocument.create();
  (await composed.copyPages(original,Array.from({length:60},(_,i)=>i))).forEach(pg=>composed.addPage(pg));
  (await composed.copyPages(sample,Array.from({length:20},(_,i)=>i))).forEach(pg=>composed.addPage(pg));
  return {original:original.getPageCount(),butter:sample.getPageCount(),merged:composed.getPageCount()};
 });
 if(e.original!==60||e.butter!==20||e.merged!==80)throw Error('Wrong PDF merge '+JSON.stringify(e));
 if(errors.length)throw Error('JS errors: '+errors.join('; '));
 console.log('PSQ80 BUILDER PASS',JSON.stringify(e));
}finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
