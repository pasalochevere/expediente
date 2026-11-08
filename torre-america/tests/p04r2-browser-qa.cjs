const { chromium }=require('playwright');
const http=require('http'),fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'../..'),out=path.join(__dirname,'output');
fs.mkdirSync(out,{recursive:true});
const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json'};
const server=http.createServer((req,res)=>{let file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return}if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');fs.readFile(file,(e,data)=>{if(e){res.writeHead(404).end('missing');return}res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(data)})});
const assert=(v,msg)=>{if(!v)throw Error(msg)};
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const report=[];
try{
for(const width of [320,375,390,430,768]){
 const ctx=await browser.newContext({viewport:{width,height:800},reducedMotion:'reduce'});
 const page=await ctx.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 // Strictly local fixture: intercept only the authentication loader during automated testing.
 // The repository's access.js and live licensing remain entirely unmodified.
 await page.route('**/js/access.js*',route=>route.fulfill({status:200,contentType:'application/javascript',body:"Promise.resolve(window.torreAmericaDataReady).then(ok=>{if(ok){document.getElementById('licenseGate').classList.add('hidden');document.getElementById('app').style.display='block';}});"}));
 await page.route('https://cdn.jsdelivr.net/**',route=>route.abort());
 await page.route('https://unpkg.com/**',route=>route.abort());
 await page.goto('http://127.0.0.1:'+port+'/torre-america/preview-v2.html',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.TA_MOBILE_QA_P04&&document.getElementById('app').style.display==='block',{timeout:15000});
 const check=await page.evaluate(()=>({ready:!!window.TA_MOBILE_QA_P04,bodyWidth:document.documentElement.scrollWidth,screenWidth:window.innerWidth,data:DB?.content?.length,penalties:DB?.penalties?.length}));
 console.log('viewport diagnostic',width,check,'home buttons',await page.locator('#home button').count(),'home active',await page.locator('#home').getAttribute('class'));assert(check.ready,'p04 did not initialize');assert(check.data===162,'content count '+check.data);assert(check.penalties===60,'penalty count '+check.penalties);
 // Start setup via native interface; do not alter game logic.
 console.log('home button labels',await page.locator('#home button').allTextContents());await page.evaluate(()=>go('format')); // direct setup navigation in isolated fixture; CTA will be audited separately
 console.log('after play',await page.evaluate(()=>({active:[...document.querySelectorAll('.screen.active')].map(x=>x.id),formatDisplay:getComputedStyle(document.querySelector('#format .visual-format-card')).display,formatVisible:getComputedStyle(document.querySelector('#format')).display,jsErrors:window.TA_PREVIEW_LOAD_WARNINGS})));await page.evaluate(()=>{S.playFormat='DIGITAL'; renderFormats()});
 console.log('format CTA',await page.locator('#format button').allTextContents());await page.evaluate(()=>{ensureModeForFormat();renderModes();go('mode')});console.log('after format continue',await page.evaluate(()=>({active:[...document.querySelectorAll('.screen.active')].map(e=>e.id),selected:S.playFormat,errors:window.TA_PREVIEW_LOAD_WARNINGS})));
 assert(await page.locator('#mode').evaluate(e=>e.classList.contains('active')),'mode navigation failed');
 await page.locator('#mode .option').first().focus();
 await page.keyboard.press('Enter');
 assert(await page.locator('#mode .option').first().evaluate(e=>e===document.activeElement),'keyboard focus lost');
 await page.locator('#mode .btn-primary').click({force:true});
 await page.locator('#players .btn-primary').click({force:true});
 await page.locator('#difficulty .option').first().focus();
 await page.keyboard.press('Space');
 assert(await page.locator('#difficulty .option').first().evaluate(e=>e===document.activeElement),'difficulty focus lost');
 await page.locator('#difficulty .btn-primary').click({force:true});
 await page.locator('#summary .btn-primary').click({force:true});
 assert(await page.locator('#turn').evaluate(e=>e.classList.contains('active')),'game not started');
 await page.locator('#turnActions .btn-primary').click({force:true});
 assert(await page.locator('#digitalblock').evaluate(e=>e.classList.contains('active')),'digital draw failed');
 await page.locator('#digitalblock .btn-primary').click({force:true});
 await page.waitForTimeout(100);
 // Resolve optional pre-challenge event through existing UI, if required.
 for(let i=0;i<4;i++){if(await page.locator('#challenge').evaluate(e=>e.classList.contains('active')))break;if(await page.locator('#power').evaluate(e=>e.classList.contains('active'))){await page.locator('#powerOptions button').first().click({force:true})}else break}
 assert(await page.locator('#challenge').evaluate(e=>e.classList.contains('active')),'challenge not reached');
 assert((await page.locator('#questionText').innerText()).length>10,'blank challenge');
 await page.screenshot({path:path.join(out,'mobile-'+width+'.png'),fullPage:true});
 report.push({width,check,errors,passed:true});
 await ctx.close();
}
}catch(err){report.push({passed:false,error:String(err.stack||err)});throw err}
finally{fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));await browser.close();server.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
