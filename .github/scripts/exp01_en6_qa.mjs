import { chromium } from 'playwright-core';

const BASE=(process.env.BASE_URL||'http://127.0.0.1:4173/').replace(/\/+$/,'')+'/';
const LABEL=process.env.QA_LABEL||'LOCAL';
const CHROME=process.env.CHROME;
if(!CHROME) throw new Error('CHROME is required');

const browser=await chromium.launch({headless:true,executablePath:CHROME,args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:1280,height:900}});
const errors=[];
const checks=[];
const watch=p=>p.on('pageerror',e=>errors.push(`${p.url()} :: ${String(e)}`));
const ok=(condition,name,detail='')=>{
  if(!condition) throw new Error(`${LABEL} · ${name}: ${detail}`);
  checks.push({name,detail});
};

try{
  // Portal buyer handoff.
  const portal=await context.newPage();
  watch(portal);
  await portal.goto(BASE+'portal-v2/',{waitUntil:'domcontentloaded',timeout:60000});
  await portal.waitForFunction(()=>typeof gameHref==='function',{timeout:20000});
  const route=await portal.evaluate(()=>gameHref({
    game_url:'https://invalid.example',
    product_code:'EXP-001',
    activation_code:'EXP01-EN6-QA'
  }));
  ok(route.includes('../caso001/intro/?access=EXP01-EN6-QA'),'Portal EXP-001 → Cinema Intro',route);
  ok(route.includes('v=20260923-v10'),'Portal keeps Cinema V10 route',route);
  await portal.close();

  // Cinema Intro in English.
  const page=await context.newPage();
  watch(page);
  await page.goto(BASE+'caso001/intro/?access=EXP01-EN6-QA&room=EN6ROOM&lang=en',{
    waitUntil:'domcontentloaded',timeout:60000
  });
  await page.waitForFunction(()=>document.documentElement.lang==='en',{timeout:15000});
  await page.waitForTimeout(650);
  const intro=await page.evaluate(()=>({
    text:document.body.textContent||'',
    portraits:[...document.querySelectorAll('.person img')].map(i=>i.getAttribute('src')||''),
    notebook:[...document.querySelectorAll('.ev img')].map(i=>i.getAttribute('src')||'').find(s=>s.includes('cuaderno'))||'',
    enVisible:[...document.querySelectorAll('[data-exp-lang="en"]')].some(e=>e.offsetParent!==null)
  }));
  ok(intro.text.includes('One meeting.')&&intro.text.includes('Six identities.'),'Cinema narrative EN');
  ok(intro.portraits.filter(s=>s.includes('assets-en/')).length===6,'Cinema 6 EN portraits',JSON.stringify(intro.portraits));
  ok(intro.notebook.includes('assets-en/'),'Cinema EN notebook',intro.notebook);
  ok(intro.enVisible,'Cinema EN control visible');

  // Intro → Game handoff.
  await Promise.all([
    page.waitForURL(u=>u.pathname.endsWith('/caso001/')&&u.searchParams.get('skipintro')==='1',{timeout:30000}),
    page.click('#skipBtn')
  ]);
  const handoff=new URL(page.url());
  ok(handoff.searchParams.get('access')==='EXP01-EN6-QA','Handoff preserves access');
  ok(handoff.searchParams.get('room')==='EN6ROOM','Handoff preserves room');
  ok(handoff.searchParams.get('lang')==='en','Handoff preserves EN');
  ok(handoff.searchParams.get('intro')==='v10','Handoff stamps intro=v10');

  await page.waitForFunction(()=>document.documentElement.lang==='en',{timeout:15000});
  await page.waitForSelector('#tabCreate',{state:'attached',timeout:20000});
  await page.waitForTimeout(700);
  let game=await page.evaluate(()=>({
    lang:document.documentElement.lang,
    stored:localStorage.getItem('expedientes_language'),
    title:document.querySelector('.revTitleRow h1')?.textContent?.trim()||'',
    create:document.getElementById('tabCreate')?.textContent?.trim()||'',
    join:document.getElementById('tabJoin')?.textContent?.trim()||'',
    printHref:document.querySelector('a[href*="printables"]')?.getAttribute('href')||''
  }));
  ok(game.lang==='en'&&game.stored==='en','Game opens/persists EN',JSON.stringify(game));
  ok(game.title==='The Last Meeting','Game title EN',game.title);
  ok(/Create room/i.test(game.create)&&/Join/i.test(game.join),'Game entry UI EN',JSON.stringify(game));
  ok(game.printHref.includes('printables'),'Game exposes printable kit',game.printHref);

  // Regression test for the upper controls. No server action is allowed:
  // the lower CTA is intercepted in capture phase before its production handler.
  const wiring=await page.evaluate(()=>{
    const lower=document.getElementById('enterRoom');
    const create=document.getElementById('tabCreate');
    const join=document.getElementById('tabJoin');
    if(!lower||!create||!join) return {error:'missing entry controls'};
    let hits=0;
    lower.addEventListener('click',e=>{
      hits++;
      e.preventDefault();
      e.stopImmediatePropagation();
    },true);

    if(!create.classList.contains('active')) create.click();
    lower.disabled=false;
    create.click();
    const createHits=hits;

    join.click();
    const afterJoinSwitch=hits;
    lower.disabled=false;
    join.click();
    const finalHits=hits;
    return {createHits,afterJoinSwitch,finalHits,joinActive:join.classList.contains('active')};
  });
  ok(!wiring.error&&wiring.createHits===1,'Upper Create executes lower CTA',JSON.stringify(wiring));
  ok(wiring.afterJoinSwitch===1,'Inactive Join first click only changes mode',JSON.stringify(wiring));
  ok(wiring.finalHits===2&&wiring.joinActive,'Upper Join executes lower CTA',JSON.stringify(wiring));

  // Language switch must not reset local gameplay state.
  await page.evaluate(()=>{
    localStorage.setItem('pc_exp_rev01_theory_v1','EN6-THEORY-SENTINEL');
    localStorage.setItem('pc_exp_p2_last_room','EN6-ROOM-SENTINEL');
  });
  await page.evaluate(()=>[...document.querySelectorAll('[data-exp-lang="es"]')].find(e=>e.offsetParent!==null)?.click());
  await page.waitForFunction(()=>document.documentElement.lang==='es',{timeout:10000});
  game=await page.evaluate(()=>({
    title:document.querySelector('.revTitleRow h1')?.textContent?.trim()||'',
    create:document.getElementById('tabCreate')?.textContent?.trim()||'',
    theory:localStorage.getItem('pc_exp_rev01_theory_v1'),
    room:localStorage.getItem('pc_exp_p2_last_room')
  }));
  ok(game.title==='La Última Reunión'&&/Crear sala/i.test(game.create),'Game reverses EN → ES',JSON.stringify(game));
  ok(game.theory==='EN6-THEORY-SENTINEL'&&game.room==='EN6-ROOM-SENTINEL','Language switch preserves local state');
  await page.evaluate(()=>[...document.querySelectorAll('[data-exp-lang="en"]')].find(e=>e.offsetParent!==null)?.click());
  await page.waitForFunction(()=>document.documentElement.lang==='en',{timeout:10000});

  // Printables inherit the global EN choice without needing ?lang=en.
  const printPage=await context.newPage();
  watch(printPage);
  await printPage.goto(BASE+'caso001/printables/',{waitUntil:'domcontentloaded',timeout:60000});
  await printPage.waitForSelector('#printLang',{timeout:20000});
  await printPage.waitForFunction(()=>document.documentElement.lang==='en',{timeout:15000});
  await printPage.waitForTimeout(750);
  let printable=await printPage.evaluate(()=>({
    lang:document.documentElement.lang,
    select:document.getElementById('printLang')?.value,
    global:localStorage.getItem('expedientes_language'),
    legacy:localStorage.getItem('expedientes.c001.printables.lang'),
    pages:document.querySelectorAll('.page').length,
    title:document.title,
    swaps:[...document.images].filter(i=>(i.getAttribute('src')||'').includes('assets-en/')).length,
    broken:[...document.images].filter(i=>!i.complete||i.naturalWidth===0).length
  }));
  ok(printable.lang==='en'&&printable.select==='en'&&printable.global==='en','Printables inherit global EN',JSON.stringify(printable));
  ok(printable.pages===8&&printable.title.includes('The Last Meeting'),'Printables EN 8 pages',JSON.stringify(printable));
  ok(printable.swaps===7&&printable.broken===0,'Printables EN visual assets',JSON.stringify(printable));

  await printPage.selectOption('#printLang','es');
  await printPage.waitForFunction(()=>document.documentElement.lang==='es',{timeout:10000});
  await printPage.waitForTimeout(300);
  printable=await printPage.evaluate(()=>({
    lang:document.documentElement.lang,
    global:localStorage.getItem('expedientes_language'),
    legacy:localStorage.getItem('expedientes.c001.printables.lang'),
    pages:document.querySelectorAll('.page').length,
    swaps:[...document.images].filter(i=>(i.getAttribute('src')||'').includes('assets-en/')).length
  }));
  ok(printable.lang==='es'&&printable.global==='es'&&printable.legacy==='es','Printables synchronize ES preference',JSON.stringify(printable));
  ok(printable.pages===8&&printable.swaps===0,'Printables restore ES assets',JSON.stringify(printable));

  // Mobile visibility, in isolated contexts so previous state cannot mask the URL language.
  const mobile=await browser.newContext({viewport:{width:390,height:844}});
  for(const [name,url,selector] of [
    ['Cinema',BASE+'caso001/intro/?lang=en','[data-exp-lang="en"]'],
    ['Game',BASE+'caso001/?skipintro=1&lang=en','[data-exp-lang="en"]'],
    ['Printables',BASE+'caso001/printables/?lang=en','#printLang']
  ]){
    const m=await mobile.newPage();
    watch(m);
    await m.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
    await m.waitForSelector(selector,{state:'attached',timeout:20000});
    const box=await m.evaluate(sel=>{
      const el=[...document.querySelectorAll(sel)].find(e=>e.offsetParent!==null);
      if(!el) return null;
      const r=el.getBoundingClientRect();
      return {x:r.x,y:r.y,w:r.width,h:r.height};
    },selector);
    ok(box&&box.x>=0&&box.x+box.w<=390&&box.y>=0&&box.y<844,`Mobile ${name} language control`,JSON.stringify(box));
    await m.close();
  }
  await mobile.close();

  ok(errors.length===0,'No JavaScript page errors',JSON.stringify(errors));
  console.log(`EXP01_EN6_${LABEL}_PASS`);
  console.log(JSON.stringify({base:BASE,checks},null,2));
  await printPage.close();
  await page.close();
} finally {
  await context.close().catch(()=>{});
  await browser.close().catch(()=>{});
}
