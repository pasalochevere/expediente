import {chromium} from 'playwright-core';

const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME,args:['--no-sandbox']});
const checks=[];
const ck=(name,value,detail='')=>{checks.push([name,!!value,detail]);if(!value)throw new Error(`${name}: ${detail}`)};
const errors=[];

const spanishMarkers=[
  'LA ÚLTIMA','REUNIÓN','LEER EN VOZ ALTA','PERSONAS · 6 SOSPECHOSOS','ESCENAS DE INVESTIGACIÓN',
  'OBJETOS CLAVE','HOJA DE INVESTIGACIÓN','LÍNEA DE TIEMPO','MAPA DE RELACIONES','ACUSACIÓN FINAL',
  'Ficha pública inicial','Anotá solo hechos comprobados','¿Qué ocurrió aquí?','No asumas que el objeto clave',
  'Separá lo que sabés','No hay un rango horario fijo','Víctima · cruzá relaciones','Completá Persona + Escena + Objeto'
];
const englishMarkers=[
  'THE LAST','MEETING','READ ALOUD','PEOPLE · 6 SUSPECTS','INVESTIGATION SCENES','KEY OBJECTS',
  'INVESTIGATION SHEET','TIMELINE','RELATIONSHIP MAP','FINAL ACCUSATION','Initial public profile',
  'Record only verified facts','What happened here?','Do not assume the key object','Separate what you know',
  'There is no fixed time range','Victim · cross-reference relationships','Complete Person + Scene + Object'
];

async function setLang(page,language){
  await page.evaluate(lang=>window.EXP01_EN5.setLanguage(lang),language);
  await page.waitForTimeout(600);
}

try{
  const context=await browser.newContext({viewport:{width:1280,height:900}});
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push(String(e)));

  await page.goto('http://127.0.0.1:4173/caso001/printables/?lang=es',{waitUntil:'domcontentloaded'});
  await page.waitForSelector('#printLang');
  await page.waitForTimeout(800);

  ck('EN5 runtime exposed',await page.evaluate(()=>!!window.EXP01_EN5));
  const stats=await page.evaluate(()=>window.EXP01_EN5.stats());
  ck('EN5 stats',stats.basePages===8&&stats.visualVariants===7&&stats.portraitVariants===6&&stats.objectVariants===1,JSON.stringify(stats));
  ck('ES document language',await page.evaluate(()=>document.documentElement.lang)==='es');
  ck('ES selector value',await page.locator('#printLang').inputValue()==='es');
  ck('ES page count',await page.locator('.page').count()===8,String(await page.locator('.page').count()));
  ck('ES title',(await page.title()).includes('La Última Reunión'),await page.title());
  let text=await page.locator('#app').innerText();
  for(const marker of spanishMarkers) ck(`ES marker ${marker}`,text.includes(marker));
  ck('ES 18 images',await page.locator('.page img').count()===18,String(await page.locator('.page img').count()));
  ck('ES no EN visual variants',await page.locator('.page img[src*="assets-en/"]').count()===0);
  ck('ES embedded originals',await page.locator('.page img[src^="data:image"]').count()===18,String(await page.locator('.page img[src^="data:image"]').count()));
  ck('ES images load',await page.locator('.page img').evaluateAll(imgs=>imgs.length===18&&imgs.every(i=>i.complete&&i.naturalWidth>0)));

  await setLang(page,'en');
  ck('EN document language',await page.evaluate(()=>document.documentElement.lang)==='en');
  ck('EN URL param',new URL(page.url()).searchParams.get('lang')==='en',page.url());
  ck('EN selector value',await page.locator('#printLang').inputValue()==='en');
  ck('EN page count',await page.locator('.page').count()===8,String(await page.locator('.page').count()));
  ck('EN title',(await page.title()).includes('The Last Meeting'),await page.title());
  text=await page.locator('#app').innerText();
  for(const marker of englishMarkers) ck(`EN marker ${marker}`,text.includes(marker));
  const leaked=spanishMarkers.filter(x=>text.includes(x));
  ck('EN target Spanish markers absent',leaked.length===0,JSON.stringify(leaked));
  const toolbar=await page.locator('.toolbar').innerText();
  ck('EN toolbar Version',toolbar.includes('Version'));
  ck('EN toolbar print label',toolbar.includes('Print / Save PDF'));
  ck('EN visual variants count',await page.locator('.page img[src*="assets-en/"]').count()===7,String(await page.locator('.page img[src*="assets-en/"]').count()));
  ck('EN shared originals count',await page.locator('.page img[src^="data:image"]').count()===11,String(await page.locator('.page img[src^="data:image"]').count()));
  ck('EN images load',await page.locator('.page img').evaluateAll(imgs=>imgs.length===18&&imgs.every(i=>i.complete&&i.naturalWidth>0)));
  ck('EN six portrait swaps',await page.locator('.page img[src*="assets-en/personajes/"]').count()===6);
  ck('EN notebook swap',await page.locator('.page img[src*="assets-en/objetos/cuaderno.svg"]').count()===1);

  await setLang(page,'es');
  ck('reverse ES language',await page.evaluate(()=>document.documentElement.lang)==='es');
  ck('reverse ES visual restore',await page.locator('.page img[src*="assets-en/"]').count()===0);
  ck('reverse ES originals restore',await page.locator('.page img[src^="data:image"]').count()===18);
  text=await page.locator('#app').innerText();
  ck('reverse ES split title restore',text.includes('LA ÚLTIMA')&&text.includes('REUNIÓN'));

  await setLang(page,'en');
  ck('second EN switch',await page.locator('.page img[src*="assets-en/"]').count()===7);

  await page.emulateMedia({media:'print'});
  const printMetrics=await page.locator('.page').first().evaluate(el=>{const r=el.getBoundingClientRect();return {w:r.width,h:r.height,toolbar:getComputedStyle(document.querySelector('.toolbar')).display}});
  ck('print toolbar hidden',printMetrics.toolbar==='none',JSON.stringify(printMetrics));
  ck('print A4 width',printMetrics.w>790&&printMetrics.w<798,JSON.stringify(printMetrics));
  ck('print A4 height',printMetrics.h>1118&&printMetrics.h<1130,JSON.stringify(printMetrics));
  await page.pdf({path:'/tmp/exp01-en5-en.pdf',printBackground:true,preferCSSPageSize:true});

  await setLang(page,'es');
  await page.pdf({path:'/tmp/exp01-en5-es.pdf',printBackground:true,preferCSSPageSize:true});

  const mobileContext=await browser.newContext({viewport:{width:390,height:844}});
  const mobile=await mobileContext.newPage();
  const mobileErrors=[];mobile.on('pageerror',e=>mobileErrors.push(String(e)));
  await mobile.goto('http://127.0.0.1:4173/caso001/printables/?lang=en',{waitUntil:'domcontentloaded'});
  await mobile.waitForSelector('#printLang');
  await mobile.waitForTimeout(650);
  ck('mobile language selector visible',await mobile.locator('#printLang').isVisible());
  ck('mobile EN pages',await mobile.locator('.page').count()===8);
  ck('mobile EN title',(await mobile.title()).includes('The Last Meeting'),await mobile.title());
  ck('mobile no page errors',mobileErrors.length===0,JSON.stringify(mobileErrors));
  await mobileContext.close();

  ck('desktop no page errors',errors.length===0,JSON.stringify(errors));
  console.log(JSON.stringify({ok:true,checks},null,2));
  await context.close();
} finally {
  await browser.close();
}
