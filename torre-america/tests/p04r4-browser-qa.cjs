const {chromium}=require('playwright'),fs=require('fs'),http=require('http'),path=require('path');
const root=path.resolve(__dirname,'../..'),out=path.join(__dirname,'output');fs.mkdirSync(out,{recursive:true});
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://local').pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return}fs.readFile(file,(e,b)=>{if(e)return res.writeHead(404).end('missing');res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(b)})});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const ctx=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce',serviceWorkers:'block'});
 const page=await ctx.newPage(),results=[]; const assert=(v,msg)=>{if(!v)throw Error(msg)};
 const check=async(name,fn)=>{try{const r=await fn();results.push({name,status:'PASS',details:r});console.log('PASS',name,JSON.stringify(r).slice(0,600))}catch(e){results.push({name,status:'FAIL',error:String(e.stack||e)});console.error('FAIL',name,String(e.message||e))}};
 try{
 await page.route('**/js/access.js*',r=>r.fulfill({status:200,contentType:'text/javascript',body:"window.torreAmericaDataReady.then(ok=>{if(ok){document.getElementById('licenseGate').classList.add('hidden');document.getElementById('app').style.display='block'}})"}));
 await page.route('https://cdn.jsdelivr.net/**',r=>r.abort());
 await page.route('https://unpkg.com/**',r=>r.abort());
 await page.goto('http://127.0.0.1:'+server.address().port+'/torre-america/preview-v2.html');
 await page.waitForFunction(()=>document.getElementById('app')?.style.display==='block',{timeout:15000});
 const prepare=(event)=>page.evaluate((ev)=>{
   newGame();S.mode='PUNTOS';S.difficulty='FACIL';S.playFormat='DIGITAL';startGame();
   const c=DB.content.find(x=>x.event===ev&&x.difficulty==='FACIL')||DB.content.find(x=>x.event===ev);
   if(!c)throw Error('event absent: '+ev);
   S.difficulty=c.difficulty;prepareContent(c.block);enterCurrentContent();
   return {event:c.event,id:c.id,screen:[...document.querySelectorAll('.screen.active')].map(x=>x.id)};
 },event);
 await check('CAPITAN helper',async()=>{
  await prepare('CAPITAN');
  const r=await page.evaluate(()=>{setCaptainHelper(1);continueToChallenge();return {helper:S.turnCtx.helper,screen:[...document.querySelectorAll('.screen.active')].map(x=>x.id),note:document.getElementById('eventBox').textContent}});
  assert(r.helper===1&&r.screen.includes('challenge')&&r.note.includes('Ayuda'),'CAPITAN selection failed');return r;
 });
 await check('HINCHADA group help',async()=>{
  await prepare('HINCHADA');const r=await page.evaluate(()=>{activateHinchada();return {active:S.turnCtx.hinchada,screen:[...document.querySelectorAll('.screen.active')].map(x=>x.id)}});assert(r.active&&r.screen.includes('challenge'),'HINCHADA failed');return r;
 });
 await check('CONTRAATAQUE failure bonus',async()=>{
  await prepare('CONTRAATAQUE');const r=await page.evaluate(()=>{setContraTarget(1);continueToChallenge();finalizeResolution(false);return {contra:S.turnCtx.contra,target:S.turnCtx.responder,pts:S.players.map(p=>p.score)}});assert(r.contra&&r.target===1&&r.pts[0]===1,'contra bonus failed');return r;
 });
 await check('EL_10 responds for owner',async()=>{
  await prepare('EL_10');const r=await page.evaluate(()=>{setEl10Responder(1);continueToChallenge();finalizeResolution(true);return {responder:S.turnCtx.responder,el10:S.turnCtx.el10,pts:S.players.map(p=>p.score)}});assert(r.el10&&r.responder===1&&r.pts[0]===1&&r.pts[1]===0,'EL_10 attribution incorrect');return r;
 });
 await check('LA_COPA save and future rescue',async()=>{
  const p=await prepare('LA_COPA');const r=await page.evaluate(()=>{
   const granted=S.players[0].powers.includes('COPA');continueToChallenge();finalizeResolution(true);nextTurn();nextTurn();
   const c=DB.content.find(x=>x.difficulty==='FACIL'&&!x.event);prepareContent(c.block);enterCurrentContent();resolve(false);
   const offered=S.turnCtx.powerStage==='SECOND_CHANCE'&&S.turnCtx.secondChanceSource==='COPA';
   return {granted,offered,screen:[...document.querySelectorAll('.screen.active')].map(x=>x.id)};
  });assert(r.granted&&r.offered,'LA_COPA rescue failed');return {p,...r};
 });
 await check('ROJA penalty and ESCUDO defense',async()=>{
  await prepare('ROJA');const r=await page.evaluate(()=>{
   finalizeResolution(true);afterResult();const offered=[...document.querySelectorAll('.screen.active')].map(x=>x.id).includes('power');
   applyRed(1);const red=S.players[1].redTurns;
   S.players[1].powers.push('ESCUDO');applyRed(1);
   return {offered,red,blocked:S.players[1].redTurns===1,shieldConsumed:!S.players[1].powers.includes('ESCUDO')};
  });assert(r.offered&&r.red===1&&r.shieldConsumed,'ROJA failed');return r;
 });
 await check('REMONTADA second chance',async()=>{
  await prepare('REMONTADA');const r=await page.evaluate(()=>{resolve(false);return {stage:S.turnCtx.powerStage,source:S.turnCtx.secondChanceSource}});assert(r.stage==='SECOND_CHANCE'&&r.source==='REMONTADA','REMONTADA rescue failed');return r;
 });
 for(const kind of ['PENALES','FINAL']){
  await check(kind+' post-event trigger',async()=>{
   await prepare(kind);const r=await page.evaluate(()=>{finalizeResolution(true);afterResult();return {stage:S.turnCtx.powerStage,screen:[...document.querySelectorAll('.screen.active')].map(x=>x.id),buttons:document.querySelectorAll('#powerOptions button').length}});assert(r.stage==='POST_'+kind&&r.screen.includes('power')&&r.buttons>0,kind+' not triggered');return r;
  });
 }
 await check('Reloj consigna: detenerse en cero',async()=>{
  await prepare('HINCHADA');const r=await page.evaluate(()=>{S.currentContent.timer=2;continueToChallenge();startTimer();return Number(document.getElementById('timer').textContent)});
  assert(r===2,'timer did not start at 2');
  await page.waitForTimeout(2350);
  const t=await page.locator('#timer').innerText();assert(t==='0','timer expected 0: '+t);return {final:t};
 });
 await check('Reloj penal individual: cinco segundos',async()=>{
  await prepare('DADO');const initial=await page.evaluate(()=>{diceResult('PENAL');startPenalty();return document.getElementById('penTimer').textContent});assert(initial==='5','penalty timer did not start');await page.waitForTimeout(5300);const final=await page.locator('#penTimer').innerText();assert(final==='0','penalty timer end: '+final);return {initial,final};
 });
 await check('Reloj tanda: cinco segundos',async()=>{
  const initial=await page.evaluate(()=>{newGame();S.mode='PUNTOS';startGame();beginShootout('PENALES',1);startShootoutKick();return document.getElementById('shootTimer').textContent});assert(initial==='5','shootout clock start failed');await page.waitForTimeout(5250);const final=await page.locator('#shootTimer').innerText();assert(final==='0','shootout clock end: '+final);return {initial,final};
 });
 }finally{
  fs.writeFileSync(path.join(out,'p04r4-report.json'),JSON.stringify({results},null,2));
  await ctx.close();await browser.close();server.close();
 }
 const failed=results.filter(r=>r.status==='FAIL');console.log('R4 SUMMARY',results.length-failed.length,'PASS',failed.length,'FAIL');if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
