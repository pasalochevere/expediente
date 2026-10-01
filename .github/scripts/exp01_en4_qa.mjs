import {chromium} from 'playwright-core';
import fs from 'node:fs';

const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME,args:['--no-sandbox']});
const checks=[];
const ck=(name,value,detail='')=>{checks.push([name,!!value,detail]);if(!value)throw new Error(`${name}: ${detail}`)};

try{
  const context=await browser.newContext({viewport:{width:1280,height:900}});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  await page.goto('http://127.0.0.1:4173/caso001/?lang=en&skipintro=1',{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(1500);

  const stats=await page.evaluate(async()=>{const m=await import('./visual-en.js');return m.visualLocalizationStats()});
  ck('visual stats',stats.auditedVariants===7&&stats.portraitsLocalized===6&&stats.objectsLocalized===1,JSON.stringify(stats));
  ck('main portrait variants',await page.locator('img[src*="assets-en/personajes/"]').count()>=6);
  ck('main notebook variant',await page.locator('img[src*="assets-en/objetos/cuaderno.svg"]').count()>=1);
  ck('main localized assets load',await page.locator('img[src*="assets-en/"]').evaluateAll(imgs=>imgs.length>=7&&imgs.every(i=>i.complete&&i.naturalWidth>0)),JSON.stringify(errors));
  ck('neutral scene remains shared',await page.locator('img[src*="assets/escenas/"]').count()>=1);

  await page.locator('.revTopActions [data-exp-lang="es"]').click();
  await page.waitForTimeout(450);
  const remaining=await page.locator('img[src*="assets-en/"]').evaluateAll(imgs=>imgs.map(i=>({src:i.getAttribute('src'),id:i.id,cls:i.className})));
  ck('main reverse ES removes variants',remaining.length===0,JSON.stringify(remaining));
  ck('main original portraits restored',await page.locator('img[src*="assets/personajes/"]').count()>=6);
  ck('main original notebook restored',await page.locator('img[src*="assets/objetos/cuaderno.jpg"]').count()>=1);

  await page.locator('.revTopActions [data-exp-lang="en"]').click();
  await page.waitForTimeout(350);
  ck('main second EN swap',await page.locator('img[src*="assets-en/personajes/"]').count()>=6);
  ck('main no page errors',errors.length===0,JSON.stringify(errors));
  await context.close();

  const introContext=await browser.newContext({viewport:{width:390,height:844}});
  const intro=await introContext.newPage();
  const introErrors=[];
  intro.on('pageerror',e=>introErrors.push(String(e)));
  await intro.goto('http://127.0.0.1:4173/caso001/intro/?lang=en&access=QAACCESS&room=QAROOM',{waitUntil:'domcontentloaded'});
  await intro.waitForTimeout(900);
  ck('intro six portrait variants',await intro.locator('#s3 img[src*="assets-en/personajes/"]').count()===6);
  ck('intro notebook variant',await intro.locator('#s4 img[src*="assets-en/objetos/cuaderno.svg"]').count()===1);
  ck('intro variants load',await intro.locator('img[src*="assets-en/"]').evaluateAll(imgs=>imgs.length===7&&imgs.every(i=>i.complete&&i.naturalWidth>0)));
  ck('intro scenes remain shared',await intro.locator('img.bg[src*="assets/escenas/"]').count()===6);
  await intro.locator('[data-exp-lang="es"]').click();
  await intro.waitForTimeout(350);
  const introRemaining=await intro.locator('img[src*="assets-en/"]').evaluateAll(imgs=>imgs.map(i=>i.getAttribute('src')));
  ck('intro reverse ES',introRemaining.length===0,JSON.stringify(introRemaining));
  const iu=new URL(intro.url());
  ck('intro params preserved',iu.searchParams.get('access')==='QAACCESS'&&iu.searchParams.get('room')==='QAROOM');
  ck('intro no page errors',introErrors.length===0,JSON.stringify(introErrors));
  await introContext.close();

  const expected={
    'clara.svg':'SOME',
    'ines.svg':'PRESS',
    'mateo.svg':'SOMEONE',
    'santiago.svg':'SUCCESS',
    'tomas.svg':'RIGHT?',
    'vera.svg':'THE PAST',
    'cuaderno.svg':'CLUES'
  };
  for(const [file,needle] of Object.entries(expected)){
    const path=file==='cuaderno.svg'?`caso001/assets-en/objetos/${file}`:`caso001/assets-en/personajes/${file}`;
    ck(`svg copy ${file}`,fs.readFileSync(path,'utf8').includes(needle),needle);
  }
  const raster=[...fs.readdirSync('caso001/assets/escenas').filter(x=>x.endsWith('.jpg')),...fs.readdirSync('caso001/assets/objetos').filter(x=>x.endsWith('.jpg')),...fs.readdirSync('caso001/assets/personajes').filter(x=>x.endsWith('.jpg'))];
  ck('18 raster assets audited',raster.length===18,String(raster.length));
  const adapter=fs.readFileSync('caso001/p2-multiplayer-adapter.js','utf8');
  ck('multiplayer untouched',!adapter.includes('visual-en.js')&&!adapter.includes('assets-en/'));

  console.log(JSON.stringify({ok:true,checks},null,2));
} finally {
  await browser.close();
}
