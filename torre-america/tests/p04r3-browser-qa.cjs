const {chromium}=require('playwright');
const fs=require('fs'),http=require('http'),path=require('path');
const root=path.resolve(__dirname,'../..'),out=path.join(__dirname,'output');
fs.mkdirSync(out,{recursive:true});
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'};
const server=http.createServer((req,res)=>{
 const u=new URL(req.url,'http://localhost'),file=path.resolve(root,'.'+decodeURIComponent(u.pathname));
 if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return}
 fs.readFile(file,(err,body)=>{if(err){res.writeHead(404).end('missing');return}res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(body)});
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const origin='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const results=[],issues=[];
 let context,page;
 const check=async(name,fn)=>{try{const details=await fn();results.push({name,status:'PASS',details});console.log('PASS',name,JSON.stringify(details||{}).slice(0,500))}catch(e){results.push({name,status:'FAIL',error:String(e.message||e)});issues.push({name,error:String(e.stack||e)});console.error('FAIL',name,e.message)}};
 const ok=(v,m)=>{if(!v)throw Error(m)};
 const state=()=>page.evaluate(()=>({active:[...document.querySelectorAll('.screen.active')].map(e=>e.id),mode:S.mode,format:S.playFormat,score:S.players[0]?.score,shoot:S.shootout?{side:S.shootout.side,a:S.shootout.kicksA,b:S.shootout.kicksB,sudden:S.shootout.sudden}:null}));
 async function open(width=390){
  if(context)await context.close();
  context=await browser.newContext({viewport:{width,height:844},reducedMotion:'reduce',serviceWorkers:'block'});
  page=await context.newPage();
  await page.route('**/js/access.js*',r=>r.fulfill({status:200,contentType:'text/javascript',body:"window.torreAmericaDataReady.then(ok=>{if(ok){document.getElementById('licenseGate').classList.add('hidden');document.getElementById('app').style.display='block'}})"}));
  await page.route('https://cdn.jsdelivr.net/**',r=>r.abort());
  await page.route('https://unpkg.com/**',r=>r.abort());
  await page.goto(origin+'/torre-america/preview-v2.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.TA_MOBILE_QA_P04&&document.getElementById('app').style.display==='block',{timeout:15000});
 }
 const reset=()=>page.evaluate(()=>{newGame();S.mode='PUNTOS';S.playFormat='DIGITAL';S.difficulty='FACIL';startGame()});
 try{
 await open();
 await check('CTA Inicio real',async()=>{
  const btn=page.locator('#home button').filter({hasText:'ENTRAR A LA CANCHA'}).first();
  const skip=page.locator('#cinemaIntro button').filter({hasText:'ENTRAR DIRECTO'});if(await skip.count())await skip.first().click({timeout:4000});
  await btn.click({timeout:4000});
  const a=await state();ok(a.active.includes('format'),'CTA did not open format');return a;
 });
 await check('Tacto formato',async()=>{
  const card=page.locator('#format .visual-format-card').last();
  await card.click({timeout:4000});
  const selected=await page.evaluate(()=>S.playFormat);ok(selected==='DIGITAL','Digital format not selected');return {selected};
 });
 await check('Continuar formato con click real',async()=>{
  await page.locator('#format .footer-actions .btn-primary').click({timeout:4000});
  const a=await state();ok(a.active.includes('mode'),'Did not enter mode');return a;
 });
 for(const outcome of ['GOL','ATAJADA','VAR','REPLAY','FALTA','PENAL']){
  await check('DADO '+outcome,async()=>{
   const result=await page.evaluate((r)=>{
     newGame();S.mode='PUNTOS';S.playFormat='DIGITAL';S.difficulty='FACIL';startGame();
     const card=DB.content.find(x=>x.difficulty==='FACIL'&&x.event==='DADO');
     if(!card)throw Error('No FACIL DADO content');
     prepareContent(card.block);const before={score:S.players[0].score,timer:S.currentContent.timer,id:S.currentContent.id};
     diceResult(r);
     return {before,after:{score:S.players[0].score,timer:S.currentContent.timer,id:S.currentContent.id,shield:S.players[0].powers.includes('ESCUDO'),replay:S.turnCtx.diceReplay,resolved:S.turnCtx.diceResolved,penalty:!!S.activePenalty},screen:[...document.querySelectorAll('.screen.active')].map(x=>x.id)};
   },outcome);
   ok(result.after.resolved,'dice not resolved');
   if(outcome==='GOL')ok(result.after.score===result.before.score+1,'GOL did not add point');
   if(outcome==='ATAJADA')ok(result.after.shield,'ATAJADA did not grant shield');
   if(outcome==='VAR')ok(result.after.id!==result.before.id,'VAR did not replace content');
   if(outcome==='REPLAY')ok(result.after.replay,'REPLAY not active');
   if(outcome==='FALTA')ok(result.after.timer!==result.before.timer,'FALTA did not affect timer');
   if(outcome==='PENAL')ok(result.after.penalty&&result.screen.includes('penalty'),'PENAL screen not opened');
   return result;
  });
 }
 await check('Penal individual: acierto y regreso al reto',async()=>{
  const r=await page.evaluate(()=>{
   if(!S.activePenalty)throw Error('no active penalty');
   startPenalty();showPenaltyAnswer();finishPenalty(true);
   return {score:S.players[0].score,screen:[...document.querySelectorAll('.screen.active')].map(x=>x.id),activePenalty:S.activePenalty};
  });ok(r.score===1,'penalty score incorrect');ok(r.screen.includes('power'),'penalty continuation missing');return r;
 });
 await check('Tanda de 3 penales por lado',async()=>{
  const r=await page.evaluate(()=>{
    newGame();S.mode='PUNTOS';S.playFormat='DIGITAL';S.difficulty='FACIL';startGame();
    beginShootout('PENALES',1);
    const plan=[true,false,true,false,true,false];
    for(const goal of plan)finishShootoutKick(goal);
    return {active:[...document.querySelectorAll('.screen.active')].map(x=>x.id),shootout:S.shootout,score:S.players.map(p=>p.score),text:document.getElementById('resultText').textContent};
  });
  ok(r.shootout===null,'shootout not finished');ok(r.active.includes('result'),'result missing');ok(r.score[0]===1,'winner point missing');return r;
 });
 await check('Muerte súbita tras empate',async()=>{
  const r=await page.evaluate(()=>{
    newGame();S.mode='PUNTOS';S.playFormat='DIGITAL';S.difficulty='FACIL';startGame();
    beginShootout('PENALES',1);
    for(const goal of [true,true,false,false,true,true])finishShootoutKick(goal);
    const before={sudden:S.shootout?.sudden,difficulty:S.shootout?.currentPen?.difficulty};
    finishShootoutKick(true);finishShootoutKick(false);
    return {before,active:[...document.querySelectorAll('.screen.active')].map(x=>x.id),finished:S.shootout===null};
  });
  ok(r.before.sudden,'sudden death did not activate');ok(r.before.difficulty==='LEYENDA','sudden difficulty not LEYENDA');ok(r.finished,'sudden shootout did not finish');return r;
 });
 await check('Recuperar partida desde reto',async()=>{
  await reset();await page.evaluate(()=>{const c=DB.content.find(x=>x.difficulty==='FACIL'&&!x.event);prepareContent(c.block);continueToChallenge();save();goHome()});
  await page.reload();await page.waitForFunction(()=>document.getElementById('app').style.display==='block');
  const r=await page.evaluate(()=>{resumeGame();return {screen:[...document.querySelectorAll('.screen.active')].map(x=>x.id),question:document.getElementById('questionText').textContent}});
  ok(r.screen.includes('challenge')&&r.question.length>5,'challenge not recovered');return r;
 });
 await check('Recuperar penal individual',async()=>{
  await reset();await page.evaluate(()=>{
   const c=DB.content.find(x=>x.difficulty==='FACIL'&&x.event==='DADO');prepareContent(c.block);diceResult('PENAL');save();goHome();
  });
  await page.reload();await page.waitForFunction(()=>document.getElementById('app').style.display==='block');
  const r=await page.evaluate(()=>{resumeGame();return {screen:[...document.querySelectorAll('.screen.active')].map(x=>x.id),ready:!document.getElementById('penReady').classList.contains('hidden'),question:!!S.activePenalty}});
  ok(r.screen.includes('penalty')&&r.ready&&r.question,'penalty not recovered');return r;
 });
 await check('Recuperar tanda y marcador',async()=>{
  await reset();await page.evaluate(()=>{beginShootout('PENALES',1);finishShootoutKick(true);save();goHome()});
  await page.reload();await page.waitForFunction(()=>document.getElementById('app').style.display==='block');
  const r=await page.evaluate(()=>{resumeGame();return {screen:[...document.querySelectorAll('.screen.active')].map(x=>x.id),sh:S.shootout&&{side:S.shootout.side,a:S.shootout.kicksA.length,b:S.shootout.kicksB.length},ready:!document.getElementById('shootReady').classList.contains('hidden')}});
  ok(r.screen.includes('shootout')&&r.sh?.a===1&&r.sh?.side==='B'&&r.ready,'shootout not recovered');return r;
 });
 await check('Estado después de resultado',async()=>{
  await reset();await page.evaluate(()=>{const c=DB.content.find(x=>x.difficulty==='FACIL'&&!x.event);prepareContent(c.block);continueToChallenge();revealAnswer();resolve(true);goHome()});
  await page.reload();await page.waitForFunction(()=>document.getElementById('app').style.display==='block');
  const r=await page.evaluate(()=>{resumeGame();return {screen:[...document.querySelectorAll('.screen.active')].map(x=>x.id),result:document.getElementById('resultTitle').textContent}});
  ok(r.screen.includes('result'),'result not recovered');return r;
 });
 }finally{
  fs.writeFileSync(path.join(out,'p04r3-report.json'),JSON.stringify({results,issues},null,2));
  await context?.close();await browser.close();server.close();
 }
 console.log('SUMMARY',results.filter(r=>r.status==='PASS').length,'PASS',issues.length,'FAIL');
 if(issues.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;server.close()});
